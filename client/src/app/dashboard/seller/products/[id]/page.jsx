"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import ProductForm from "@/components/ProductForm";

export default function EditProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/products/${id}`);
        if (data.success) {
            // Transform tags array to string for the form if needed
            // But ProductForm handles array, so just pass
          setProduct(data.product);
        }
      } catch (error) {
        console.error("Failed to fetch product");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (!product) return <div className="text-center py-10">Product not found</div>;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <ProductForm initialData={product} productId={id} />
    </div>
  );
}
