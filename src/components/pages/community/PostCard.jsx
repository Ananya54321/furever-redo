import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  Heart,
  MessageCircle,
  Repeat,
  Send,
  MoreHorizontal,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const PostCard = ({
  post,
  comments,
  commentCount,
  onComment,
  isCommenting,
  onCancelComment,
  onSubmitComment,
  currentUser,
}) => {
  const [commentText, setCommentText] = useState("");
  const [likeCount, setLikeCount] = useState(post.likes || 0);
  const [isLiked, setIsLiked] = useState(false);

  const handleLikeToggle = () => {
    if (isLiked) {
      setLikeCount((prev) => prev - 1);
    } else {
      setLikeCount((prev) => prev + 1);
    }
    setIsLiked(!isLiked);
    // Here you would normally call an API to update the like count
  };

  const handleCommentSubmit = () => {
    onSubmitComment(commentText);
    setCommentText("");
  };

  const formatDate = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return "recently";
    }
  };

  return (
    <div className="w-full">
      {/* Post header */}
      <div className="flex items-start mb-3">
        <Avatar className="h-10 w-10 mr-3">
          <AvatarFallback className="bg-primary/10 text-primary">
            {post.author?.name?.charAt(0) || "U"}
          </AvatarFallback>
          {post.author?.image && <AvatarImage src={post.author.image} />}
        </Avatar>

        <div className="flex-1">
          <div className="flex items-center">
            <p className="font-medium text-primary">
              {post.author?.name || "Anonymous"}
            </p>
            <span className="mx-1.5 text-secondary">•</span>
            <p className="text-sm text-secondary">
              {formatDate(post.createdAt)}
            </p>
            <button className="ml-auto text-secondary">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>

          {/* Username (Threads style) */}
          <p className="text-xs text-secondary mb-2">
            {post.author?.email || "Email"}
          </p>
        </div>
      </div>

      {/* Post content */}
      <div className="pl-[52px]">
        {post.title && (
          <h3 className="font-medium text-primary mb-1">{post.title}</h3>
        )}

        <p className="text-primary mb-3 whitespace-pre-wrap">{post.content}</p>

        {post.image && (
          <div className="rounded-xl overflow-hidden mb-3 border">
            <img
              src={post.image}
              alt={post.title || "Post image"}
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        {/* Post actions */}
        <div className="flex items-center gap-5 my-2">
          <button
            onClick={handleLikeToggle}
            className={`flex items-center ${
              isLiked ? "text-red-500" : "text-secondary hover:text-primary"
            }`}>
            <Heart
              className={`h-[18px] w-[18px] ${isLiked ? "fill-red-500" : ""}`}
            />
          </button>

          <button
            onClick={() => onComment(post._id)}
            className="flex items-center text-secondary hover:text-primary">
            <MessageCircle className="h-[18px] w-[18px]" />
          </button>

          <button className="flex items-center text-secondary hover:text-primary">
            <Repeat className="h-[18px] w-[18px]" />
          </button>

          <button className="flex items-center text-secondary hover:text-primary">
            <Send className="h-[18px] w-[18px]" />
          </button>
        </div>

        {/* Like & comment count */}
        <div className="flex text-xs text-secondary mt-1 mb-2 gap-3">
          {likeCount > 0 && <span>{likeCount} likes</span>}
          {commentCount > 0 && <span>{commentCount} replies</span>}
        </div>

        {/* Comments */}
        {comments && comments.length > 0 && (
          <div className="mt-2">
            {comments.slice(0, 2).map((comment) => (
              <div key={comment._id} className="flex items-start mt-3">
                <Avatar className="h-6 w-6 mr-2">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs">
                    {comment.author?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                  {comment.author?.image && (
                    <AvatarImage src={comment.author.image} />
                  )}
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-baseline">
                    <span className="font-medium text-sm text-primary mr-2">
                      {comment.user?.name || "Anonymous"}
                    </span>
                    <span className="text-xs text-secondary">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-primary">{comment.comment}</p>
                </div>
              </div>
            ))}

            {comments.length > 2 && (
              <button className="text-sm text-secondary mt-2 hover:text-primary">
                View all {comments.length} replies
              </button>
            )}
          </div>
        )}

        {/* Comment form */}
        {isCommenting && (
          <div className="mt-3 flex items-start">
            <Avatar className="h-8 w-8 mr-2">
              <AvatarFallback className="bg-primary/10 text-primary">
                {currentUser?.name?.charAt(0) || "U"}
              </AvatarFallback>
              {currentUser?.image && <AvatarImage src={currentUser.image} />}
            </Avatar>
            <div className="flex-1">
              <Textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a reply..."
                className="resize-none min-h-[60px] text-sm p-2"
              />
              <div className="flex justify-end gap-2 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onCancelComment}
                  className="text-secondary h-8">
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleCommentSubmit}
                  disabled={!commentText.trim()}
                  className="bg-accent hover:bg-accent/90 text-white h-8">
                  Reply
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;
