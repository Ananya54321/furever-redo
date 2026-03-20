"use server";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "@/../db/dbConfig";
import User from "../db/schema/user.schema";
import Seller from "../db/schema/seller.schema";
import { z } from "zod";
import { setCookie } from "@/lib/auth";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import mongoose from "mongoose";

const JWT_USER_SECRET = process.env.JWT_USER_SECRET;
const JWT_SELLER_SECRET = process.env.JWT_SELLER_SECRET;

// Ensure database is connected before proceeding
// This is better than just the function reference
try {
  connectToDatabase();
} catch (error) {
  console.error("Initial database connection failed:", error);
}

const loginValidationSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  userType: z.enum(["user", "seller"], {
    errorMap: () => ({
      message: "User type must be either 'user' or 'seller'",
    }),
  }),
});

export async function loginAction(formData) {
  try {
    // Validate form data
    const parsedData = loginValidationSchema.safeParse(formData);

    if (!parsedData.success) {
      console.log("Invalid parse of user data");
      return {
        success: false,
        error: parsedData.error.errors.map((e) => e.message).join(", "),
      };
    }

    const { email, password, userType } = parsedData.data;

    // Ensure DB connection is active
    await connectToDatabase();

    // Select the appropriate model
    const Member = userType === "user" ? User : Seller;

    // Modified findOne with explicit try/catch and timeout handling
    let user;
    try {
      // Use a more efficient query with only necessary fields
      user = await Member.findOne({ email }).select("+password").lean().exec();
      // user = await Member.findOne({ email }).select("+password")
      // this is to prevent the db from timing out
      // console.log("Database query successful");
      // lean () means it returns a plain JS object
      // exec () means it returns a promise
    } catch (dbError) {
      console.error("Database query failed:", dbError);
      if (dbError instanceof mongoose.Error.MongooseServerSelectionError) {
        return {
          success: false,
          error:
            "Could not connect to database. Please check if MongoDB is running.",
        };
      }
      return {
        success: false,
        error: "Database error occurred: " + dbError.message,
      };
    }

    if (!user) {
      return {
        success: false,
        error: "User not found",
      };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return {
        success: false,
        error: "Invalid password",
      };
    }

    const JWT_SECRET =
      userType === "user" ? JWT_USER_SECRET : JWT_SELLER_SECRET;
    const token = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });
    await clearAllCookies();
    await setCookie(token, userType);

    // Remove password from returned user object
    delete user.password;

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
    console.error("Login error:", error);
    return {
      success: false,
      error: "An error occurred during login: " + error.message,
    };
  }
}

export async function getAuthenticatedUser() {
  try {
    const cookieStore = await cookies();
    const userToken = cookieStore.get("userToken")?.value;
    const sellerToken = cookieStore.get("sellerToken")?.value;

    if (!userToken && !sellerToken) {
      return null;
    }

    if (userToken) {
      try {
        const decoded = jwt.verify(userToken, process.env.JWT_USER_SECRET);
        const user = await User.findById(decoded.id).select("-password -__v").lean();

        if (user) {
          return {
            _id: user._id.toString(),
            name: user.name,
            email: user.email,
            profilePicture: user.profilePicture, // Ensure this is returned if needed
            bio: user.bio, // Ensure bio is returned
            createdAt: user.createdAt,
            userType: "user",
            token: userToken,
          };
        }
      } catch (error) {
        console.error("User token verification failed:", error);
      }
    }

    if (sellerToken) {
      try {
        const decoded = jwt.verify(sellerToken, process.env.JWT_SELLER_SECRET);
        const seller = await Seller.findById(decoded.id).select(
          "-password -__v"
        ).lean();

        if (seller) {
          return {
            _id: seller._id.toString(),
            name: seller.name,
            email: seller.email,
            userType: "seller",
            token: sellerToken,
          };
        }
      } catch (error) {
        console.error("Seller token verification failed:", error);
      }
    }

    return null;
  } catch (error) {
    console.error("Auth check error:", error);
    return null;
  }
}

async function clearAllCookies() {
  const cookieStore = await cookies();

  const allCookies = cookieStore.getAll();
  for (const cookie of allCookies) {
    cookieStore.set({
      name: cookie.name,
      value: "",
      expires: new Date(0),
      path: "/",
    });
  }

  return { success: true, message: "All cookies cleared" };
}

export async function logoutAction() {
  try {
    const result = await clearAllCookies();
    redirect("/login");
  } catch (error) {
    console.error("Logout error:", error);
    return { success: false, error: "An error occurred during logout" };
  }
}
