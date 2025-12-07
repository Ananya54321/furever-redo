"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Trash2, Minus, Plus, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);

  const fetchCart = async () => {
    try {
      const { data } = await axios.get("/api/cart");
      if (data.success) {
        setCart(data.cart);
      }
    } catch (error) {
        console.error("Cart fetch error:", error);
        // If 401, maybe redirect or show empty
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (productId, newQuantity) => {
      try {
          const { data } = await axios.put("/api/cart", {
              productId,
              quantity: newQuantity
          });
          if (data.success) setCart(data.cart);
      } catch (error) {
          toast.error("Failed to update quantity");
      }
  };

  const removeItem = async (productId) => {
      try {
          const { data } = await axios.delete(`/api/cart?productId=${productId}`);
          if (data.success) setCart(data.cart);
      } catch (error) {
          toast.error("Failed to remove item");
      }
  };

  const handleCheckout = async () => {
      setCheckingOut(true);
      try {
          // Mock shipping address for now - in real app would get from form
          const shippingAddress = {
              fullName: "Test User",
              mobile: "1234567890",
              addressLines: ["123 Street", "City"],
              email: "test@example.com"
          };

          const { data } = await axios.post("/api/create-checkout-session", { 
              items: cart,
              shippingAddress 
          });
          
          if (data.success && data.url) {
              window.location.href = data.url;
          } else {
              toast.error("Failed to start payment");
          }
      } catch (error) {
          console.error(error);
          toast.error(error.response?.data?.error || "Checkout failed");
      } finally {
          setCheckingOut(false);
      }
  };

  const calculateTotal = () => {
      return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }

  if (loading) return <div className="py-20 text-center">Loading cart...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      {cart.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-xl text-gray-600 mb-4">Your cart is empty</p>
          <Link href="/store">
            <Button>Start Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <Card key={item.product._id}>
                <CardContent className="p-4 flex gap-4">
                  <div className="relative w-24 h-24 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                    {item.product.images?.[0] && (
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                    )}
                  </div>
                  <div className="flex-grow">
                      <div className="flex justify-between mb-2">
                          <Link href={`/store/${item.product._id}`} className="font-semibold hover:underline">
                              {item.product.name}
                          </Link>
                          <p className="font-bold">₹{item.product.price * item.quantity}</p>
                      </div>
                      <p className="text-sm text-gray-500 mb-4">{item.product.category}</p>
                      
                      <div className="flex justify-between items-center">
                          <div className="flex items-center border rounded-md h-8">
                               <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 rounded-none"
                                onClick={() => updateQuantity(item.product._id, Math.max(1, item.quantity - 1))}
                               >
                                   <Minus className="h-3 w-3" />
                               </Button>
                               <span className="w-8 text-center text-sm">{item.quantity}</span>
                               <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 rounded-none"
                                onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                               >
                                   <Plus className="h-3 w-3" />
                               </Button>
                          </div>
                          
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => removeItem(item.product._id)}
                          >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Remove
                          </Button>
                      </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="lg:col-span-1">
             <Card>
                 <CardContent className="p-6">
                     <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                     <div className="flex justify-between mb-2">
                         <span>Subtotal</span>
                         <span>₹{calculateTotal()}</span>
                     </div>
                     <div className="flex justify-between mb-4">
                         <span>Shipping</span>
                         <span>Free</span>
                     </div>
                     <Separator className="my-4" />
                     <div className="flex justify-between text-lg font-bold mb-6">
                         <span>Total</span>
                         <span>₹{calculateTotal()}</span>
                     </div>
                     
                     <Button 
                        className="w-full bg-yellow-800 hover:bg-yellow-700 text-white" 
                        size="lg"
                        onClick={handleCheckout}
                        disabled={checkingOut}
                     >
                         {checkingOut ? "Processing..." : "Checkout"}
                     </Button>
                     
                     <div className="mt-4 text-center">
                         <Link href="/store" className="text-sm text-gray-500 hover:underline flex items-center justify-center gap-1">
                             <ArrowLeft className="h-3 w-3" />
                             Continue Shopping
                         </Link>
                     </div>
                 </CardContent>
             </Card>
          </div>
        </div>
      )}
    </div>
  );
}
