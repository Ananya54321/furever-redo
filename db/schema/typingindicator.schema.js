import mongoose from "mongoose";
const typingIndicatorSchema = new mongoose.Schema(
  {
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
    userTyping: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    typingStartedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const TypingIndicator =
  mongoose.models.TypingIndicator ||
  mongoose.model("TypingIndicator", typingIndicatorSchema);

export default TypingIndicator;
