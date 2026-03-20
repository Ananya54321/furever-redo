"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import toast from "react-hot-toast";

export default function SellerProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSellerProducts = async () => {
    setLoading(true);
    try {
      const profileRes = await axios.get("/api/user/profile"); 
      const myId = profileRes.data.user._id;
      
      const { data } = await axios.get("/api/products"); 
      if (data.success) {
          const myProducts = data.products.filter(p => p.owner?._id === myId || p.owner === myId);
          setProducts(myProducts);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellerProducts();
  }, []);

  const handleDelete = async (id) => {
      if (!confirm("Are you sure you want to delete this product?")) return;
      try {
          await axios.delete(`/api/products/${id}`);
          toast.success("Product deleted");
          fetchSellerProducts();
      } catch (error) {
          toast.error("Failed to delete product");
      }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Products</h1>
            <p className="text-muted-foreground">Manage your product catalog</p>
          </div>
          <Link href="/dashboard/seller/products/new">
            <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Product
            </Button>
          </Link>
      </div>

      <div className="border rounded-lg">
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[80px]">Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Inventory</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {loading ? (
                   <TableRow>
                       <TableCell colSpan={7} className="h-24 text-center">Loading...</TableCell>
                   </TableRow>
                ) : products.length > 0 ? (
                    products.map((product) => (
                        <TableRow key={product._id}>
                            <TableCell>
                                {product.images?.[0] && (
                                    <img src={product.images[0]} alt="" className="h-10 w-10 rounded-md object-cover" />
                                )}
                            </TableCell>
                            <TableCell className="font-medium">{product.name}</TableCell>
                            <TableCell>
                                <Badge variant={product.quantity > 0 ? (product.quantity > 10 ? "default" : "secondary") : "destructive"}>
                                    {product.quantity > 0 ? "Active" : "Out of Stock"}
                                </Badge>
                            </TableCell>
                            <TableCell>₹{product.price}</TableCell>
                            <TableCell>{product.quantity} in stock</TableCell>
                            <TableCell>{product.category}</TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <span className="sr-only">Open menu</span>
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(product._id)}>
                                            Copy ID
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <Link href={`/dashboard/seller/products/${product._id}`}>
                                            <DropdownMenuItem>Edit</DropdownMenuItem>
                                        </Link>
                                        <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(product._id)}>
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                       <TableCell colSpan={7} className="h-24 text-center">No products found.</TableCell>
                   </TableRow>
                )}
            </TableBody>
        </Table>
      </div>
    </div>
  );
}
