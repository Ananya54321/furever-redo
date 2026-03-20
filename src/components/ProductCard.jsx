"use client";

import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

const ProductCard = ({ product }) => {
  const [adding, setAdding] = useState(false);
  const router = useRouter();

  const handleAddToCart = async (e) => {
    e.preventDefault(); // Prevent Link navigation
    e.stopPropagation();
    
    setAdding(true);
    try {
      const { data } = await axios.post("/api/cart", {
        productId: product._id,
        quantity: 1
      });
      if (data.success) {
        toast.success("Added to cart");
      }
    } catch (error) {
       console.error("Add to cart error:", error);
        if (error.response?.status === 401) {
            toast.error("Please login to buy products");
            router.push("/login");
        } else {
            toast.error(error.response?.data?.error || "Failed to add to cart");
        }
    } finally {
      setAdding(false);
    }
  };

  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300 group">
      <CardHeader className="p-0">
        <div className="relative w-full h-48 overflow-hidden rounded-t-lg bg-gray-100">
          {product.images && product.images.length > 0 ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              No Image
            </div>
          )}
          {product.discount > 0 && (
             <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
               -{product.discount}%
             </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4">
        <div className="flex justify-between items-start mb-2">
            <div>
                 <p className="text-sm text-gray-500 mb-1">{product.category}</p>
                 <CardTitle className="text-lg font-semibold line-clamp-1">{product.name}</CardTitle>
            </div>
            <div className="text-right">
                <p className="font-bold text-lg">₹{product.price}</p>
                 {product.discount > 0 && ( /* Assuming price is discounted, or showing original? Let's just show current */
                     <p className="text-xs text-gray-400 line-through">
                         ₹{Math.round(product.price / (1 - product.discount / 100))}
                     </p>
                 )}
            </div>
        </div>
        
        <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 mt-auto flex gap-2">
        <Link href={`/store/${product._id}`} className="flex-1">
          <Button variant="outline" className="w-full">
            View
          </Button>
        </Link>
        <Button 
          className="flex-1 bg-yellow-800 hover:bg-yellow-700 text-white"
          onClick={handleAddToCart}
          disabled={product.quantity === 0 || adding}
        >
          {product.quantity === 0 ? "Out" : (adding ? "..." : "Add")}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
