"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      return;
    }

    const createOrder = async () => {
      try {
        // We need an endpoint that verifies the session and creates the order.
        // Re-using POST /api/orders but we might need to adjust it to handle "session_id" 
        // OR we just create the order here if we trust the client (we shouldn't).
        // Best practice: Call API with session_id, API verifies with Stripe, then creates Order.
        // Let's modify the standard /api/orders to accept session_id for verification.
        
        const { data } = await axios.post("/api/orders", { 
            paymentSessionId: sessionId 
        });
        
        if (data.success) {
          setOrder(data.order);
          // Optional: Clear local cart state if any, though DB cart is cleared by server
        }
      } catch (err) {
        console.error("Order creation failed:", err);
        setError(err.response?.data?.error || "Failed to finalize order. Please contact support.");
      } finally {
        setLoading(false);
      }
    };

    createOrder();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-800"></div>
        <p className="text-gray-600">Processing your order...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 text-center">
        <div className="text-red-500 text-5xl">⚠️</div>
        <h1 className="text-2xl font-bold text-gray-800">Something went wrong</h1>
        <p className="text-gray-600 max-w-md">{error}</p>
        <Link href="/store/cart">
          <Button variant="outline">Return to Cart</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 flex items-center justify-center">
      <Card className="max-w-lg w-full text-center">
        <CardContent className="pt-10 pb-8 px-8">
            <div className="flex justify-center mb-6">
                <CheckCircle2 className="h-20 w-20 text-green-500" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment Successful!</h1>
            <p className="text-gray-600 mb-8">
                Thank you for your purchase. Your order has been placed successfully.
            </p>
            
            {order && (
                <div className="bg-gray-50 rounded-lg p-4 mb-8 text-left text-sm">
                    <p><strong>Order ID:</strong> {order._id}</p>
                    <p><strong>Amount Paid:</strong> ₹{order.totalAmount}</p>
                    <p><strong>Status:</strong> {order.paymentStatus}</p>
                </div>
            )}

            <div className="flex flex-col gap-3">
                <Link href="/store">
                    <Button className="w-full bg-yellow-800 hover:bg-yellow-700">
                        Continue Shopping
                    </Button>
                </Link>
                <Link href="/profile/orders">
                    <Button variant="outline" className="w-full">
                        View My Orders
                    </Button>
                </Link>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function SuccessPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SuccessContent />
        </Suspense>
    )
}
