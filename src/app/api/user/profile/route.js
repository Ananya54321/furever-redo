import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../../db/dbConfig";
import User from "../../../../../db/schema/user.schema";
import Seller from "../../../../../db/schema/seller.schema";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

connectToDatabase();

export async function PUT(request) {
  try {
    const cookieStore = await cookies();
    const userToken = cookieStore.get("userToken")?.value;
    const sellerToken = cookieStore.get("sellerToken")?.value;

    if (!userToken && !sellerToken) {
      return NextResponse.json(
        { success: false, error: "User not authenticated" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, bio, profilePicture } = body;
    
    if (!name) {
      return NextResponse.json(
        { success: false, error: "Name is required" },
        { status: 400 }
      );
    }

    let userId;
    let userType;
    
    if (userToken) {
      try {
        const decoded = jwt.verify(userToken, process.env.JWT_USER_SECRET);
        userId = decoded.id;
        userType = "user";
      } catch (error) {
        return NextResponse.json(
          { success: false, error: "Invalid token" },
          { status: 401 }
        );
      }
    } else {
      try {
        const decoded = jwt.verify(sellerToken, process.env.JWT_SELLER_SECRET);
        userId = decoded.id;
        userType = "seller";
      } catch (error) {
        return NextResponse.json(
          { success: false, error: "Invalid token" },
          { status: 401 }
        );
      }
    }

    const Model = userType === "user" ? User : Seller;
    
    const updatedUser = await Model.findByIdAndUpdate(
      userId,
      {
        name,
        bio,
        profilePicture,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        ...updatedUser.toObject(),
        _id: updatedUser._id.toString(),
        userType
      }
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const cookieStore = await cookies();
    const userToken = cookieStore.get("userToken")?.value;
    const sellerToken = cookieStore.get("sellerToken")?.value;

    if (!userToken && !sellerToken) {
      return NextResponse.json(
        { success: false, error: "User not authenticated" },
        { status: 401 }
      );
    }

    let userId;
    let userType;
    
    if (userToken) {
      try {
        const decoded = jwt.verify(userToken, process.env.JWT_USER_SECRET);
        userId = decoded.id;
        userType = "user";
      } catch (error) {
        return NextResponse.json(
          { success: false, error: "Invalid token" },
          { status: 401 }
        );
      }
    } else {
      try {
        const decoded = jwt.verify(sellerToken, process.env.JWT_SELLER_SECRET);
        userId = decoded.id;
        userType = "seller";
      } catch (error) {
        return NextResponse.json(
          { success: false, error: "Invalid token" },
          { status: 401 }
        );
      }
    }

    const Model = userType === "user" ? User : Seller;
    
    const user = await Model.findById(userId).select("-password");

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        ...user.toObject(),
        _id: user._id.toString(),
        userType
      }
    });
  } catch (error) {
    console.error("Profile retrieval error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
} 