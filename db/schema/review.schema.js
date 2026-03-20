const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      default: 4,
    },
    comment: {
      type: String,
      required: true,
      default: "Comment ---",
      trim: true,
    },
    media: {
      type: [String], // array of URLs
      validate: {
        validator: function (arr) {
          return arr.every((url) => typeof url === "string");
        },
        message: "All media links must be strings.",
      },
      default: [],
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product", // assuming reviews are tied to products
      required: true,
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Review = mongoose.models.Review || mongoose.model("Review", reviewSchema);

export default Review;
