import { NextResponse } from "next/server";
import Stripe from "stripe";
import { connectToDatabase } from "../../../../db/dbConfig";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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

export async function POST(request) {
  const userId = await getUser(request);
  if (!userId) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { items, shippingAddress } = await request.json();
    
    // Validate items
    if (!items || items.length === 0) {
        return NextResponse.json(
            { success: false, error: "Cart is empty" },
            { status: 400 }
        );
    }

    const lineItems = items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.product.name,
          images: item.product.images?.length > 0 ? [item.product.images[0]] : [],
          description: item.product.description ? item.product.description.substring(0, 100) : undefined,
        },
        unit_amount: Math.round(item.product.price * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/store/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/store/cart`,
      metadata: {
        userId,
        source: "furrever_store",
      },
      customer_email: shippingAddress?.email,
    });

    return NextResponse.json({
      success: true,
      url: session.url,
      id: session.id
    });
  } catch (error) {
    console.error("Stripe Checkout Error:", error);
    return NextResponse.json(
      { success: false, error: "Payment session creation failed" },
      { status: 500 }
    );
  }
}
