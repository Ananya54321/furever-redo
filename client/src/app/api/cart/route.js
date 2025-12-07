import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../db/dbConfig";
import User from "../../../../db/schema/user.schema";
import Product from "../../../../db/schema/product.schema";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

connectToDatabase();

// Helper to get authenticated user
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

export async function GET(request) {
  const userId = await getUser(request);
  if (!userId) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await User.findById(userId).populate({
      path: "cart.product",
      model: "Product",
    });

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    // Filter out null products (in case product was deleted)
    const validCart = user.cart.filter(item => item.product !== null);
    
    return NextResponse.json({ success: true, cart: validCart });
  } catch (error) {
    console.error("Get cart error:", error);
    return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
  }
}

export async function POST(request) {
  const userId = await getUser(request);
  if (!userId) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { productId, quantity = 1 } = await request.json();
    
    if (!productId) {
      return NextResponse.json({ success: false, error: "Product ID is required" }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json({ success: false, error: "Invalid Product ID" }, { status: 400 });
    }

    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    // Check if product is available
    if (product.quantity === 0) {
      return NextResponse.json({ success: false, error: "Product is out of stock" }, { status: 400 });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    // Ensure cart exists
    if (!user.cart) {
      user.cart = [];
    }

    const existingItemIndex = user.cart.findIndex(
      (item) => item && item.product && item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
      user.cart[existingItemIndex].quantity += quantity;
    } else {
      user.cart.push({ product: productId, quantity });
    }

    await user.save();
    
    // Return updated cart with populated products
    const updatedUser = await User.findById(userId).populate({
        path: "cart.product",
        model: "Product",
    });

    return NextResponse.json({ success: true, cart: updatedUser.cart });
  } catch (error) {
    console.error("Add to cart error:", error);
    console.error("Error stack:", error.stack);
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Server Error" 
    }, { status: 500 });
  }
}

export async function PUT(request) {
  const userId = await getUser(request);
  if (!userId) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { productId, quantity } = await request.json();
    
    if (quantity < 1) {
         return NextResponse.json({ success: false, error: "Quantity must be at least 1" }, { status: 400 });
    }

    const user = await User.findById(userId);
    const itemIndex = user.cart.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      user.cart[itemIndex].quantity = quantity;
      await user.save();
    }

    // Return updated cart
    const updatedUser = await User.findById(userId).populate({
        path: "cart.product",
        model: "Product",
    });

    return NextResponse.json({ success: true, cart: updatedUser.cart });
  } catch (error) {
    console.error("Update cart error:", error);
    return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
  }
}

export async function DELETE(request) {
    const userId = await getUser(request);
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
  
    try {
      const { searchParams } = new URL(request.url);
      const productId = searchParams.get("productId");

      if (!productId) {
          return NextResponse.json({ success: false, error: "Product ID required" }, { status: 400 });
      }
  
      const user = await User.findById(userId);
      user.cart = user.cart.filter(
        (item) => item.product.toString() !== productId
      );
  
      await user.save();
  
      const updatedUser = await User.findById(userId).populate({
        path: "cart.product",
        model: "Product",
    });

    return NextResponse.json({ success: true, cart: updatedUser.cart });
    } catch (error) {
      console.error("Remove from cart error:", error);
      return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
    }
  }
