"use server";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "@/../db/dbConfig";
import User from "../db/schema/user.schema";
import Seller from "../db/schema/seller.schema";
import { z } from "zod";
import { setCookie } from "@/lib/auth";

const JWT_USER_SECRET = process.env.JWT_USER_SECRET;
const JWT_SELLER_SECRET = process.env.JWT_SELLER_SECRET;
const saltRounds = 10;

const registerValidationSchema = z.object({
  name: z.string().min(3, "Username must be at least 3 characters long"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  userType: z.enum(["user", "seller"], {
    errorMap: () => ({
      message: "User type must be either 'user' or 'seller'",
    }),
  }),
});

export async function registerAction(formData) {
  try {
    const parsedData = registerValidationSchema.safeParse(formData);

    if (!parsedData.success) {
      return {
        success: false,
        error: parsedData.error.errors.map((e) => e.message).join(", "),
      };
    }

    const { name, email, password, userType } = parsedData.data;

    await connectToDatabase();

    const Member = userType === "user" ? User : Seller;

    const existingUser = await Member.findOne({ email });
    if (existingUser) {
      return {
        success: false,
        error: "Account with this email already exists",
      };
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = await Member.create({
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const JWT_SECRET =
      userType === "user" ? JWT_USER_SECRET : JWT_SELLER_SECRET;
    const token = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });
    await setCookie(token, userType);

    // Create user in CometChat
    try {
        const { createCometChatUser } = await import("@/lib/cometChatApi");
        await createCometChatUser(user._id.toString(), user.name);
    } catch (chatError) {
        console.error("Failed to sync user with CometChat:", chatError);
        // Continue execution, do not fail registration
    }

    return {
      success: true,
      user: {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        userType,
      },
    };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      error: "An error occurred during registration",
    };
  }
}
