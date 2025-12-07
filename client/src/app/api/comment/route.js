import User from "@/../db/schema/user.schema";
import Comment from "@/../db/schema/comment.schema";
import CommunityPost from "@/../db/schema/communitypost.schema";
import { connectToDatabase } from "@/../db/dbConfig";
import { NextResponse } from "next/server";
import { getUserByToken } from "@/../actions/userActions";

connectToDatabase();

export async function POST(request) {
  try {
    const { postId, commentText, token } = await request.json();

    if (!postId) {
      return NextResponse.json(
        { success: false, error: "Post ID is required" },
        { status: 400 }
      );
    }

    if (!commentText || commentText === "") {
      return NextResponse.json(
        { success: false, error: "Comment text is required" },
        { status: 400 }
      );
    }
    if (!token) {
      return NextResponse.json(
        { success: false, error: "Token is required" },
        { status: 401 }
      );
    }
    const response = await getUserByToken(token, "user");
    if (!response.success) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }
    const user = response.user;

    const post = await CommunityPost.findById(postId);
    if (!post) {
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 }
      );
    }
    const newComment = new Comment({
      comment: commentText,
      user: user._id,
      post: postId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await newComment.save();

    post.commentCount += 1;
    await post.save();

    return NextResponse.json({
      success: true,
      message: "Comment posted successfully!",
      comment: newComment,
    });
  } catch (err) {
    console.error("Error in createComment:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const postId = url.searchParams.get("postId");

    if (!postId) {
      return NextResponse.json(
        { success: false, error: "Post ID is required" },
        { status: 400 }
      );
    }

    const comments = await Comment.find({ post: postId })
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .lean();
    console.log(comments);
    return NextResponse.json({
      success: true,
      comments,
    });
  } catch (err) {
    console.error("Error getting comments:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
