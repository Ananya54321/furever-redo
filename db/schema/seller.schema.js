// user schema for database mongo

import { z } from "zod";
import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  storeName: {
    type: String,
    default: "untitled",
  },
  // add other attributes as necessary
});

const Seller = mongoose.models.Seller || mongoose.model("Seller", sellerSchema);

export default Seller;
