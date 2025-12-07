"use client";
import React, { useState, useEffect } from "react";
import { X, ShoppingBag, Trash2, Plus, Minus, CreditCard, History, Package } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { format } from "date-fns";

const CartSidebar = ({ isOpen, onClose }) => {
  const [cartItems, setCartItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [activeTab, setActiveTab] = useState("cart");

  // Fetch Cart
  const fetchCart = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/cart");
      if (data.success) {
        setCartItems(data.cart || []);
      }
    } catch (error) {
      console.error("Fetch cart error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Orders
  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      const { data } = await axios.get("/api/orders");
      if (data.success) {
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error("Fetch orders error:", error);
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      if (activeTab === "cart") fetchCart();
      if (activeTab === "orders") fetchOrders();
    }
  }, [isOpen, activeTab]);

  const updateQuantity = async (productId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity < 1) return;

    try {
      // Optimistic update
      setCartItems((prev) =>
        prev.map((item) =>
          item.product._id === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );

      await axios.put("/api/cart", {
        productId,
        quantity: newQuantity,
      });
    } catch (error) {
      toast.error("Failed to update quantity");
      fetchCart(); // Revert
    }
  };

  const removeItem = async (productId) => {
    try {
      // Optimistic
      setCartItems((prev) => prev.filter((item) => item.product._id !== productId));
      
      await axios.delete(`/api/cart?productId=${productId}`);
      toast.success("Item removed");
    } catch (error) {
      toast.error("Failed to remove item");
      fetchCart();
    }
  };

  const handleCheckout = async () => {
    try {
      setCheckingOut(true);
      const { data } = await axios.post("/api/create-checkout-session", {
        items: cartItems,
         shippingAddress: {
             country: 'IN'
         }
      });

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Checkout failed");
    } finally {
      setCheckingOut(false);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + (item.product?.price || 0) * item.quantity,
      0
    );
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[450px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b flex items-center justify-between bg-primary text-white">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" /> Your Cart
            </h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex-1 overflow-hidden flex flex-col">
            <Tabs
              defaultValue="cart"
              value={activeTab}
              onValueChange={setActiveTab}
              className="flex-1 flex flex-col"
            >
              <div className="px-4 pt-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="cart">Cart</TabsTrigger>
                  <TabsTrigger value="orders">Orders</TabsTrigger>
                </TabsList>
              </div>

              {/* Cart Content */}
              <TabsContent value="cart" className="flex-1 flex flex-col overflow-hidden data-[state=inactive]:hidden">
                {loading ? (
                  <div className="flex-1 flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : cartItems.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 text-center">
                    <ShoppingBag className="w-16 h-16 mb-4 opacity-50" />
                    <p className="text-lg font-medium">Your cart is empty</p>
                    <Button variant="link" onClick={onClose} className="mt-2">
                      Continue Shopping
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="flex-1 overflow-y-auto p-4">
                      <div className="space-y-4">
                        {cartItems.map((item) => (
                          <div
                            key={item.product._id}
                            className="flex gap-4 border rounded-lg p-3 hover:bg-gray-50 transition-colors"
                          >
                            <div className="relative w-20 h-20 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                              {item.product.images?.[0] ? (
                                <Image
                                  src={item.product.images[0]}
                                  alt={item.product.name}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Img</div>
                              )}
                            </div>
                            <div className="flex-1 flex flex-col justify-between">
                              <div>
                                <h3 className="font-semibold text-sm line-clamp-1">
                                  {item.product.name}
                                </h3>
                                <p className="text-xs text-gray-500">
                                  {item.product.category}
                                </p>
                              </div>
                              <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center gap-2 border rounded-md p-1">
                                  <button
                                    className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
                                    onClick={() => updateQuantity(item.product._id, item.quantity, -1)}
                                    disabled={item.quantity <= 1}
                                  >
                                    <Minus className="w-3 h-3" />
                                  </button>
                                  <span className="text-sm w-4 text-center">
                                    {item.quantity}
                                  </span>
                                  <button
                                    className="p-1 hover:bg-gray-100 rounded"
                                    onClick={() => updateQuantity(item.product._id, item.quantity, 1)}
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                </div>
                                <span className="font-bold text-primary">
                                  ₹{item.product.price * item.quantity}
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() => removeItem(item.product._id)}
                              className="text-gray-400 hover:text-red-500 self-start"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="p-4 border-t bg-gray-50">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="text-xl font-bold">₹{calculateTotal()}</span>
                      </div>
                      <Button
                        className="w-full bg-yellow-800 hover:bg-yellow-700 text-white py-6 text-lg"
                        onClick={handleCheckout}
                        disabled={checkingOut}
                      >
                        {checkingOut ? (
                          "Processing..."
                        ) : (
                          <>
                            Checkout <CreditCard className="ml-2 w-5 h-5" />
                          </>
                        )}
                      </Button>
                    </div>
                  </>
                )}
              </TabsContent>

              {/* Orders Content */}
              <TabsContent value="orders" className="flex-1 overflow-hidden flex flex-col data-[state=inactive]:hidden">
                 {ordersLoading ? (
                  <div className="flex-1 flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : orders.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 text-center">
                        <History className="w-16 h-16 mb-4 opacity-50" />
                        <p className="text-lg font-medium">No past orders</p>
                    </div>
                ) : (
                    <div className="flex-1 overflow-y-auto p-4">
                        <div className="space-y-4">
                            {orders.map((order) => (
                                <div key={order._id} className="border rounded-lg p-3 bg-white shadow-sm">
                                    <div className="flex justify-between items-center mb-2 border-b pb-2">
                                        <div className="flex items-center gap-2">
                                            <Package className="w-4 h-4 text-primary" />
                                            <span className="text-xs font-mono text-gray-500">#{order._id.slice(-6)}</span>
                                        </div>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${order.paymentStatus === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {order.paymentStatus}
                                        </span>
                                    </div>
                                    <div className="space-y-2 mb-3">
                                        {order.items.slice(0, 3).map((item, idx) => (
                                            <div key={idx} className="flex justify-between text-sm">
                                                <span className="text-gray-600 truncate max-w-[180px]">{item.quantity}x {item.productId?.name || 'Unknown Item'}</span>
                                                <span className="font-medium text-xs">₹{item.priceAtPurchase * item.quantity}</span>
                                            </div>
                                        ))}
                                        {order.items.length > 3 && (
                                            <p className="text-xs text-gray-400 italic">+{order.items.length - 3} more items</p>
                                        )}
                                    </div>
                                    <div className="flex justify-between items-center text-sm pt-2 border-t font-medium">
                                        <span className="text-gray-500">{format(new Date(order.createdAt), "MMM d, yyyy")}</span>
                                        <span className="text-primary">Total: ₹{order.totalAmount}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartSidebar;
