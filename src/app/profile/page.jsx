"use client";
import React, { useState, useEffect } from "react";
import { getAuthenticatedUser, logoutAction } from "../../../actions/loginActions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { PawPrint, Mail, Calendar, Loader2, LogOut, Package, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState({
    name: "",
    bio: "",
    profilePicture: "",
  });
  const [updating, setUpdating] = useState(false);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getAuthenticatedUser();
        if (!userData) {
          window.location.href = "/login";
          return;
        }
        setUser(userData);
        setUpdatedProfile({
          name: userData.name || "",
          bio: userData.bio || "",
          profilePicture: userData.profilePicture || "",
        });
        
        // Fetch orders after user is confirmed
        fetchOrders();
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("/api/orders");
      if (response.data.success) {
        setOrders(response.data.orders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      if (error.response?.status === 401) {
        window.location.href = "/login";
      }
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileUpdate = async () => {
    try {
      setUpdating(true);
      const response = await axios.put("/api/user/profile", updatedProfile);

      if (response.data.success) {
        setUser((prev) => ({
          ...prev,
          ...updatedProfile,
        }));
        setIsEditing(false);
        toast.success("Profile updated successfully");
      } else {
        toast.error(response.data.error || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (dateString, formatStr = "PPP") => {
    try {
      return format(new Date(dateString), formatStr);
    } catch (e) {
      return dateString;
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const getDefaultAvatar = () => {
    if (!user) return "/default-avatar.svg";
    const idLastChar = user._id
      ? user._id.slice(-1)
      : user.name?.length.toString().slice(-1) || "0";
    const num = parseInt(idLastChar, 10) % 3;
    if (num === 0) return "/default-avatar.svg";
    if (num === 1) return "/default-avatar-2.svg";
    return "/default-avatar-3.svg";
  };

  const handleLogout = async () => {
    try {
      // Dynamic import to avoid SSR issues if any
      const { CometChatUIKit } = await import("@cometchat/chat-uikit-react");
      if (CometChatUIKit) {
          try {
             await CometChatUIKit.logout();
          } catch(e) { /* ignore */ }
      }
    } catch (error) {
      console.warn("CometChat logout failed or SDK not loaded:", error);
    }
    
    // Call server logout to clear cookies
    await logoutAction();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-10 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar Area - User Info */}
          <div className="lg:col-span-1">
            <Card className="shadow-md overflow-hidden sticky top-24">
              <div className="h-24 bg-primary/10"></div>
              <CardContent className="pt-0 relative">
                <div className="flex justify-center -mt-12 mb-4">
                  <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                    {user.profilePicture ? (
                      <AvatarImage src={user.profilePicture} className="object-cover" />
                    ) : (
                      <AvatarImage src={getDefaultAvatar()} className="object-cover" />
                    )}
                    <AvatarFallback className="text-xl bg-primary text-white">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                  <p className="text-gray-500 text-sm flex items-center justify-center gap-1 mt-1">
                    <Mail className="h-3 w-3" /> {user.email}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2 justify-center">
                    <Badge variant="secondary" className="font-normal">
                       Member since {formatDate(user.createdAt, "MMM yyyy")}
                    </Badge>
                  </div>
                </div>

                {!isEditing && (
                   <div className="space-y-3">
                     <Button 
                        variant="outline" 
                        className="w-full" 
                        onClick={() => setIsEditing(true)}
                      >
                        Edit Profile
                      </Button>
                      <Button 
                        variant="destructive" 
                        className="w-full gap-2" 
                        onClick={handleLogout}
                      >
                        <LogOut size={16} /> Logout
                      </Button>
                   </div>
                )}
                
                {isEditing && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase text-gray-500">Display Name</label>
                            <Input 
                                name="name"
                                value={updatedProfile.name}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase text-gray-500">Bio</label>
                            <Textarea 
                                name="bio"
                                value={updatedProfile.bio}
                                onChange={handleInputChange}
                                rows={3}
                            />
                        </div>
                         <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase text-gray-500">Profile Image URL</label>
                            <Input 
                                name="profilePicture"
                                value={updatedProfile.profilePicture}
                                onChange={handleInputChange}
                                placeholder="https://..."
                            />
                        </div>
                        <div className="flex gap-2 pt-2">
                             <Button 
                                variant="outline" 
                                className="flex-1"
                                onClick={() => setIsEditing(false)}
                                disabled={updating}
                              >
                                Cancel
                              </Button>
                              <Button 
                                className="flex-1 bg-primary text-white hover:bg-primary/90"
                                onClick={handleProfileUpdate}
                                disabled={updating}
                              >
                                {updating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
                              </Button>
                        </div>
                    </div>
                )}

              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-1 mb-8 h-auto p-1 bg-white border shadow-sm rounded-xl">
                <TabsTrigger value="overview" className="py-3 rounded-lg data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-medium">Overview</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>About Me</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 leading-relaxed">
                      {user.bio || "No bio provided. Click 'Edit Profile' to tell us about yourself and your pets!"}
                    </p>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <ShoppingBag className="w-5 h-5 text-orange-500"/> Total Orders
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">{orders.length}</p>
                            <p className="text-sm text-gray-500">Lifetime purchases</p>
                        </CardContent>
                    </Card>
                    {/* Add more stats cards if data available */}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
} 