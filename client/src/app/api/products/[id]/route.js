import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../../db/dbConfig";
import Product from "../../../../../db/schema/product.schema";
import Seller from "../../../../../db/schema/seller.schema";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

// Ensure database is connected
connectToDatabase();

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const product = await Product.findById(id).populate("owner", "name storeName");

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Fetch product error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const sellerToken = cookieStore.get("sellerToken")?.value;

    if (!sellerToken) {
      return NextResponse.json(
        { success: false, error: "Seller authentication required" },
        { status: 401 }
      );
    }

    let sellerId;
    try {
      const decoded = jwt.verify(sellerToken, process.env.JWT_SELLER_SECRET);
      sellerId = decoded.id;
    } catch (error) {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 401 }
      );
    }

    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    if (product.owner.toString() !== sellerId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: You do not own this product" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const updatedProduct = await Product.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json({
      success: true,
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Update product error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const sellerToken = cookieStore.get("sellerToken")?.value;

    if (!sellerToken) {
      return NextResponse.json(
        { success: false, error: "Seller authentication required" },
        { status: 401 }
      );
    }

    let sellerId;
    try {
      const decoded = jwt.verify(sellerToken, process.env.JWT_SELLER_SECRET);
      sellerId = decoded.id;
    } catch (error) {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 401 }
      );
    }

    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    if (product.owner.toString() !== sellerId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: You do not own this product" },
        { status: 403 }
      );
    }

    await Product.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
