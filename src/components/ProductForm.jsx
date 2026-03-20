"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ImageUploader from "@/components/ImageUploader";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

export default function ProductForm({ initialData, productId }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(initialData || {
      name: "",
      description: "",
      price: "",
      quantity: 1,
      category: "",
      tags: "",
      discount: 0,
      images: [],
      // Potential Amazon-like fields:
      sku: "",
      brand: "",
      dimensions: "",
      weight: ""
  });

  const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (url) => {
      setFormData(prev => ({ ...prev, images: [...prev.images, url] }));
  };

  const removeImage = (index) => {
      setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  }

  const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
          // Prepare payload
          const payload = {
              ...formData,
              price: parseFloat(formData.price),
              quantity: parseInt(formData.quantity),
              discount: parseFloat(formData.discount || 0),
              tags: typeof formData.tags === 'string' ? formData.tags.split(",").map(t => t.trim()) : formData.tags,
          };

          if (productId) {
              await axios.put(`/api/products/${productId}`, payload);
              toast.success("Product updated successfully");
          } else {
              await axios.post("/api/products", payload);
              toast.success("Product created successfully");
          }
          
          router.push("/dashboard/seller/products");
          router.refresh();
      } catch (error) {
          console.error(error);
          toast.error(error.response?.data?.error || "Operation failed");
      } finally {
          setLoading(false);
      }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight">
                {productId ? "Edit Product" : "Add Product"}
            </h1>
            <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {productId ? "Save Changes" : "Create Product"}
                </Button>
            </div>
        </div>

        <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="pricing">Pricing</TabsTrigger>
                <TabsTrigger value="inventory">Inventory</TabsTrigger>
                <TabsTrigger value="media">Media</TabsTrigger>
            </TabsList>
            
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <TabsContent value="general" className="space-y-6 mt-0">
                        <Card>
                            <CardHeader>
                                <CardTitle>Product Details</CardTitle>
                                <CardDescription>Basic information about your product.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Product Name</Label>
                                    <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required placeholder="e.g., Premium Dog Food 5kg" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} required className="min-h-[150px]" placeholder="Detailed product description..." />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="category">Category</Label>
                                    <Input id="category" name="category" value={formData.category} onChange={handleInputChange} required placeholder="Category" /> 
                                    {/* Ideally a Select component */}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="tags">Tags</Label>
                                    <Input id="tags" name="tags" value={formData.tags} onChange={handleInputChange} placeholder="Comma separated tags" />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="pricing" className="space-y-6 mt-0">
                        <Card>
                            <CardHeader>
                                <CardTitle>Pricing</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="price">Base Price (₹)</Label>
                                        <Input type="number" id="price" name="price" value={formData.price} onChange={handleInputChange} required min="0" step="0.01" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="discount">Discount (%)</Label>
                                        <Input type="number" id="discount" name="discount" value={formData.discount} onChange={handleInputChange} min="0" max="100" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="inventory" className="space-y-6 mt-0">
                        <Card>
                            <CardHeader>
                                <CardTitle>Inventory & Logistics</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="quantity">Stock Quantity</Label>
                                        <Input type="number" id="quantity" name="quantity" value={formData.quantity} onChange={handleInputChange} required min="0" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="sku">SKU (Optional)</Label>
                                        <Input id="sku" name="sku" value={formData.sku || ""} onChange={handleInputChange} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="media" className="space-y-6 mt-0">
                        <Card>
                            <CardHeader>
                                <CardTitle>Product Images</CardTitle>
                                <CardDescription>Upload high-quality images. First image will be the cover.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <ImageUploader media={formData.images} onUploadSuccess={handleImageUpload} />
                                
                                <div className="grid grid-cols-3 gap-4 mt-4">
                                    {formData.images.map((img, i) => (
                                        <div key={i} className="relative aspect-square border rounded-md overflow-hidden group">
                                            <img src={img} alt={`Product ${i+1}`} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <Button type="button" variant="destructive" size="sm" onClick={() => removeImage(i)}>Delete</Button>
                                            </div>
                                            {i === 0 && (
                                                <div className="absolute top-2 left-2 bg-yellow-600 text-white text-xs px-2 py-1 rounded">Cover</div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </div>
            </div>
        </Tabs>
      </div>
    </form>
  );
}
