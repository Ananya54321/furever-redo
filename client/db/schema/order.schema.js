import mongoose from "mongoose";
const { Schema } = mongoose;

const OrderSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        priceAtPurchase: {
          type: Number,
          required: true,
        },
      },
      
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    boughtAt: {
      type: Date,
      default: Date.now,
    },
    shippingAddress: {
      fullName: String,
      mobile: String,
      addressLines: [String],
      email: String,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "completed",
    },
    paymentSessionId: {
      type: String,
      unique: true,
      sparse: true, // Allows null values but enforces uniqueness when present
    },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
