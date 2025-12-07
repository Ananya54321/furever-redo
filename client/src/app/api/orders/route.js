import { NextResponse } from "next/server";
import Stripe from "stripe";
import { connectToDatabase } from "../../../../db/dbConfig";
import Order from "../../../../db/schema/order.schema";
import User from "../../../../db/schema/user.schema";
import Product from "../../../../db/schema/product.schema";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

connectToDatabase();

async function getUser(request) {
  const cookieStore = await cookies();
  const userToken = cookieStore.get("userToken")?.value;

  if (!userToken) return null;

  try {
    const decoded = jwt.verify(userToken, process.env.JWT_USER_SECRET);
    return decoded.id;
  } catch (error) {
    return null;
  }
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  const userId = await getUser(request);
  if (!userId) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const body = await request.json();
    const { shippingAddress, paymentSessionId } = body;
    
    if (paymentSessionId) {
        const checkoutSession = await stripe.checkout.sessions.retrieve(paymentSessionId);
        if (checkoutSession.payment_status !== 'paid') {
             throw new Error("Payment not completed");
        }
    }

    const user = await User.findById(userId).populate("cart.product").session(session);

    if (!user || user.cart.length === 0) {
        await session.abortTransaction();
        session.endSession();
        return NextResponse.json(
            { success: false, error: "Cart is empty" },
            { status: 400 }
        );
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of user.cart) {
        if (!item.product) continue;
        
        const product = await Product.findById(item.product._id).session(session);
        
        if (!product) {
            throw new Error(`Product ${item.product.name} not found`);
        }

        if (product.quantity < item.quantity) {
            throw new Error(`Insufficient stock for ${product.name}`);
        }

        orderItems.push({
            productId: product._id,
            quantity: item.quantity,
            priceAtPurchase: product.price,
        });

        totalAmount += product.price * item.quantity;
        
        product.quantity -= item.quantity;
        await product.save({ session });
    }

    const order = await Order.create([{
        userId,
        items: orderItems,
        totalAmount,
        shippingAddress: shippingAddress || { fullName: user.name, email: user.email },
        paymentSessionId: paymentSessionId || undefined,
    }], { session });

    user.cart = [];
    user.productsBought.push(order[0]._id);
    await user.save({ session });

    await session.commitTransaction();
    session.endSession();

    return NextResponse.json({
      success: true,
      order: order[0],
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Create order error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  const userId = await getUser(request);
  if (!userId) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const orders = await Order.find({ userId })
        .populate("items.productId")
        .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Fetch orders error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
