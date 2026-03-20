"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, LayoutDashboard, ShoppingCart } from "lucide-react";
import axios from "axios";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get("/api/user/profile");
        if (data.success) {
          setUser(data.user);
        }
      } catch (error) {
        console.error("Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Welcome, {user?.name || "User"}!</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <ShoppingBag className="h-6 w-6 text-yellow-700" />
                    Marketplace
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-gray-600 mb-4">Browse products for your pets.</p>
                <Link href="/store">
                    <Button className="w-full">Go to Store</Button>
                </Link>
            </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="h-6 w-6 text-yellow-700" />
                    My Cart
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-gray-600 mb-4">View items in your shopping cart.</p>
                <Link href="/store/cart">
                    <Button className="w-full" variant="outline">View Cart</Button>
                </Link>
            </CardContent>
        </Card>

        {user?.userType === "seller" && (
          <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                      <LayoutDashboard className="h-6 w-6 text-yellow-700" />
                      Seller Tools
                  </CardTitle>
              </CardHeader>
              <CardContent>
                  <p className="text-gray-600 mb-4">Manage your products (Sellers only).</p>
                  <Link href="/dashboard/seller/products">
                      <Button className="w-full" variant="secondary">Manage Products</Button>
                  </Link>
              </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
