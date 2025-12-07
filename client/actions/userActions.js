"use server";
import User from "../db/schema/user.schema";
import Seller from "../db/schema/seller.schema";
import { connectToDatabase } from "../db/dbConfig";
import { cookies } from "next/headers";


import jwt from "jsonwebtoken";

export async function getUserByToken(token, userType) {
  await connectToDatabase();
  const Member = userType === "seller" ? Seller : User;
  const JWT_SECRET =
    userType === "seller"
      ? process.env.JWT_SELLER_SECRET
      : process.env.JWT_USER_SECRET;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await Member.findById(decoded.id).lean();
    if (!user) {
      return { success: false, message: "User not found" };
    }
    return {
      success: true,
      user: {
        ...user,
        _id: user._id.toString(),
      },
    };
  } catch (error) {
    console.error("Error fetching user by token:", error);
    return { success: false, message: "Error fetching user by token" };
  }
}

export async function getToken(tokenName) {
  const cookieStore = await cookies();
  const token = cookieStore.get(tokenName)?.value;
  return token;
}
