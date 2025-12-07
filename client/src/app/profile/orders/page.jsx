"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get("/api/transactions");
        if (data.success && data.type === "purchase") {
          setOrders(data.transactions);
        }
      } catch (error) {
        console.error("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div className="text-center py-20">Loading...</div>;

  if (orders.length === 0) {
      return (
          <div className="container max-w-4xl py-10 text-center">
              <div className="flex justify-center mb-6">
                  <ShoppingBag className="h-20 w-20 text-gray-300" />
              </div>
              <h1 className="text-2xl font-bold mb-4">No orders yet</h1>
              <p className="text-muted-foreground mb-8">Looks like you haven't placed any orders yet.</p>
              <Link href="/store">
                  <Button>Start Shopping</Button>
              </Link>
          </div>
      )
  }

  return (
    <div className="container max-w-4xl py-10 space-y-6">
      <h1 className="text-3xl font-bold">My Orders</h1>
      
      <div className="grid gap-6">
          {orders.map((order) => (
              <Card key={order._id}>
                  <CardHeader className="bg-gray-50 flex flex-row items-center justify-between pb-4">
                      <div className="flex gap-6 text-sm">
                          <div className="flex flex-col">
                              <span className="text-muted-foreground">Order Placed</span>
                              <span className="font-medium">{format(new Date(order.createdAt), "dd MMM yyyy")}</span>
                          </div>
                          <div className="flex flex-col">
                              <span className="text-muted-foreground">Total</span>
                              <span className="font-medium">₹{order.totalAmount}</span>
                          </div>
                          <div className="flex flex-col">
                              <span className="text-muted-foreground">Order #</span>
                              <span className="font-medium font-mono">{order._id.slice(-8)}</span>
                          </div>
                      </div>
                      <Badge variant={order.paymentStatus === "completed" ? "default" : "outline"}>
                          {order.paymentStatus}
                      </Badge>
                  </CardHeader>
                  <CardContent className="pt-6">
                      <div className="space-y-4">
                          {order.items.map((item, index) => (
                              <div key={index} className="flex gap-4 items-center">
                                  <div className="h-20 w-20 relative bg-gray-100 rounded overflow-hidden flex-shrink-0">
                                      {item.productId?.images?.[0] ? (
                                          <img src={item.productId.images[0]} alt="" className="object-cover w-full h-full" />
                                      ) : (
                                          <div className="flex items-center justify-center h-full text-xs text-muted-foreground">No Img</div>
                                      )}
                                  </div>
                                  <div className="flex-1">
                                        <h3 className="font-semibold text-lg hover:text-yellow-800 transition-colors">
                                            <Link href={`/store/${item.productId?._id}`}>{item.productId?.name || "Product Removed"}</Link>
                                        </h3>
                                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                  </div>
                                  <div className="font-medium">
                                      ₹{item.priceAtPurchase}
                                  </div>
                              </div>
                          ))}
                      </div>
                  </CardContent>
              </Card>
          ))}
      </div>
    </div>
  );
}
