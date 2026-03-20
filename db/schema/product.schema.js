// product schema for database mongo

import { z } from "zod";
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      default: "Product",
    },
    description: {
      type: String,
      required: true,
      default: "Description",
    },
    images: {
      type: [String],
      required: true,
    },
    price: {
      type: Number,
      required: true,
      default: 720,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1, // kgs
    },
    discount: {
      type: Number,
      required: true,
      default: 0,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 4,
    },
    category: {
      type: String,
      required: true,
      default: "Dog Food",
    },
    tags: {
      type: [String],
      required: true,
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.index({ name: "text", tags: "text", category: "text" });

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
