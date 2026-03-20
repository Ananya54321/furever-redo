import mongoose from "mongoose";

const communityPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: false,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  community: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Community",
  },
  commentCount: {
    type: Number,
    default: 0,
  },
  image: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const CommunityPost =
  mongoose.models?.CommunityPost ||
  mongoose.model("CommunityPost", communityPostSchema);

export default CommunityPost;
