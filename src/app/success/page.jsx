"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuthenticatedUser } from "../../../actions/loginActions";
import axios from "axios";

import Cookies from "js-cookie";
import toast from "react-hot-toast";

export default function SingleSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // Clear the checkout item from localStorage
    // add item to user's orders
    getAuthenticatedUser().then((user) => {
      let products = null;
      let checkoutData = Cookies.get("checkoutData");
      if (checkoutData) {
        checkoutData = JSON.parse(checkoutData);
        products = [
          {
            userId: user._id,
            items: {
              productId: checkoutData.product._id,
              quantity: checkoutData.quantity,
              priceAtPurchase: checkoutData.product.price,
            },
            totalAmount: checkoutData.price,
            boughtAt: checkoutData.boughtAt,
            shippingAddress: checkoutData.shippingAddress,
          },
        ];
      } else {
        toast.error("Error processing payment. Please try again.");
        router.push("/store");
      }
      axios
        .post("/api/orders", {
          userId: user._id,
          items: products,
        })
        .then(() => {
          console.log("Order added successfully!");
        });
    });
    Cookies.remove("checkoutData");
    localStorage.removeItem("checkoutItem");
    localStorage.removeItem("checkoutDetails");
  }, []);

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-white">
      <div className="bg-green-100 p-6 rounded-xl shadow-lg text-center max-w-md">
        <h1 className="text-3xl font-bold text-green-600 mb-4">
          ✅ Payment Successful
        </h1>
        <p className="text-gray-700 mb-6">
          Your order has been placed successfully!
        </p>
        <button
          onClick={() => router.push("/store")}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded text-lg"
        >
          Back to Store
        </button>
      </div>
    </div>
  );
}
