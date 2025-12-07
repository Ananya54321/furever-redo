import { NextResponse } from "next/server";
import Stripe from "stripe";
import { connectToDatabase } from "../../../../../db/dbConfig";
import Order from "../../../../../db/schema/order.schema";
import User from "../../../../../db/schema/user.schema";
import Product from "../../../../../db/schema/product.schema";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

connectToDatabase();

export async function POST(request) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature || !webhookSecret) {
      return NextResponse.json(
        { error: "Missing signature or webhook secret" },
        { status: 400 }
      );
    }

    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      return NextResponse.json(
        { error: `Webhook Error: ${err.message}` },
        { status: 400 }
      );
    }

    // Handle the checkout.session.completed event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      
      // Get userId from metadata
      const userId = session.metadata?.userId;
      
      if (!userId) {
        console.error("No userId in session metadata");
        return NextResponse.json({ received: true });
      }

      // Check if order already exists for this session
      const existingOrder = await Order.findOne({ 
        paymentSessionId: session.id 
      });

      if (existingOrder) {
        console.log("Order already exists for this session");
        return NextResponse.json({ received: true });
      }

      // Create the order (similar to POST /api/orders but triggered by webhook)
      const user = await User.findById(userId).populate("cart.product");
      
      if (!user || user.cart.length === 0) {
        console.error("User cart is empty or user not found");
        return NextResponse.json({ received: true });
      }

      let totalAmount = 0;
      const orderItems = [];

      for (const item of user.cart) {
        if (!item.product) continue;
        
        const product = await Product.findById(item.product._id);
        
        if (product) {
          orderItems.push({
            productId: product._id,
            quantity: item.quantity,
            priceAtPurchase: product.price,
          });
          
          totalAmount += product.price * item.quantity;
          
          // Update stock
          product.quantity = Math.max(0, product.quantity - item.quantity);
          await product.save();
        }
      }

      // Create order
      const order = await Order.create({
        userId,
        items: orderItems,
        totalAmount,
        shippingAddress: {
          fullName: user.name,
          email: user.email,
        },
        paymentStatus: "completed",
        paymentSessionId: session.id,
      });

      // Clear cart and update user
      user.cart = [];
      user.productsBought.push(order._id);
      await user.save();

      console.log("Order created successfully via webhook:", order._id);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
