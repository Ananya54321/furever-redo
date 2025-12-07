"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";

export default function ProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/products/${id}`);
        if (data.success) {
          setProduct(data.product);
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
      setAdding(true);
      try {
          const { data } = await axios.post("/api/cart", {
              productId: product._id,
              quantity
          });
          if (data.success) {
              toast.success("Added to cart");
              router.push("/store/cart");
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

  if (loading) return <div className="flex justify-center items-center py-20">Loading...</div>;
  if (!product) return <div className="text-center py-20">Product not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Image Section */}
        <div className="bg-gray-100 rounded-lg overflow-hidden relative min-h-[400px]">
             {product.images && product.images.length > 0 ? (
                <Image
                  src={product.images[0]} // For now just showing first image
                  alt={product.name}
                  fill
                  className="object-contain"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  No Image
                </div>
              )}
        </div>

        {/* Details Section */}
        <div>
           <div className="mb-2">
             <span className="text-sm font-medium text-yellow-600 bg-yellow-100 px-2 py-1 rounded">
               {product.category}
             </span>
           </div>
           
           <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
           
           <div className="flex items-end gap-3 mb-6">
                <span className="text-3xl font-bold">₹{product.price}</span>
                {product.discount > 0 && (
                     <span className="text-lg text-gray-400 line-through mb-1">
                         ₹{Math.round(product.price / (1 - product.discount / 100))}
                     </span>
                 )}
           </div>

           <p className="text-gray-600 mb-6 leading-relaxed">
               {product.description}
           </p>

           <Separator className="my-6" />

           <div className="flex items-center gap-6 mb-8">
               <div className="flex items-center border rounded-md">
                   <Button 
                     variant="ghost" 
                     size="icon" 
                     onClick={() => setQuantity(Math.max(1, quantity - 1))}
                     disabled={quantity <= 1}
                   >
                       <Minus className="h-4 w-4" />
                   </Button>
                   <span className="w-12 text-center font-medium">{quantity}</span>
                   <Button 
                     variant="ghost" 
                     size="icon" 
                     onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                     disabled={quantity >= product.quantity}
                   >
                       <Plus className="h-4 w-4" />
                   </Button>
               </div>
               <span className="text-sm text-gray-500">
                   {product.quantity > 0 ? `${product.quantity} in stock` : "Out of stock"}
               </span>
           </div>

           <Button 
             size="lg" 
             className="w-full md:w-auto bg-yellow-800 hover:bg-yellow-700 text-white gap-2"
             onClick={handleAddToCart}
             disabled={product.quantity === 0 || adding}
           >
               <ShoppingCart className="h-5 w-5" />
               {product.quantity === 0 ? "Out of Stock" : (adding ? "Adding..." : "Add to Cart")}
           </Button>

           {product.start && (
               <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                   <h3 className="font-semibold mb-2">Seller Info</h3>
                   <p>{product.owner?.storeName || product.owner?.name}</p>
               </div>
           )}
        </div>
      </div>
    </div>
  );
}
