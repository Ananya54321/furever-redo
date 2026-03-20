import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../db/dbConfig";
import Product from "../../../../db/schema/product.schema";
import Seller from "../../../../db/schema/seller.schema";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

connectToDatabase();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    const query = {};
    if (category) {
      query.category = category;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }

    const products = await Product.find(query)
      .populate("owner", "name storeName email")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Fetch products error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
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

    const seller = await Seller.findById(sellerId);
    if (!seller) {
      return NextResponse.json(
        { success: false, error: "Seller not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { name, description, price, quantity, images, category, tags, discount } = body;

    if (!name || !price || !images || images.length === 0) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newProduct = await Product.create({
      name,
      description,
      price,
      quantity,
      images,
      category,
      tags,
      discount,
      owner: sellerId,
    });

    return NextResponse.json({
      success: true,
      product: newProduct,
    });
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error: " + error.message },
      { status: 500 }
    );
  }
}
