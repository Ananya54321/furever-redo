import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { X, Image as ImageIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ImageUploader from "@/components/ImageUploader";

export default function PostForm({ onSubmit, currentUser }) {
  const [postData, setPostData] = useState({
    title: "",
    content: "",
    image: "",
  });
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!postData.content.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      onSubmit(postData);
      setPostData({ title: "", content: "", image: "" });
      setMessage("");
    } catch (error) {
      console.error("Error in form submission:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOnUpload = (result) => {
    console.log("Upload successful:", result);
    const imageUrl = result.info.secure_url;
    setPostData((prev) => ({
      ...prev,
      image: imageUrl,
    }));
    setMessage("Image uploaded successfully!");
  };

  const handleUploadError = (error) => {
    console.error("Upload error:", error);
    setMessage(`Upload error: ${error.message || "Unknown error"}`);
  };

  const handleRemoveImage = () => {
    setPostData((prev) => ({
      ...prev,
      image: "",
    }));
    setMessage("Image removed successfully!");
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="border-b border-gray-200 pb-4 mb-4">
      <form onSubmit={handleSubmit} className="w-full">
        <div className="flex p-4">
          <Avatar className="h-10 w-10 mr-3 mt-1">
            <AvatarImage
              src={currentUser?.profilePicture}
              alt={currentUser?.name || "User"}
            />
            <AvatarFallback className="bg-primary/10 text-primary">
              {currentUser ? getInitials(currentUser.name) : "U"}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <Input
              value={postData.title}
              onChange={(e) =>
                setPostData({ ...postData, title: e.target.value })
              }
              placeholder="Add a title (optional)"
              className="border-0 p-0 text-base font-medium placeholder:text-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0 mb-2"
            />

            <Textarea
              value={postData.content}
              onChange={(e) =>
                setPostData({ ...postData, content: e.target.value })
              }
              placeholder="What's happening?"
              className="border-0 p-0 text-primary resize-none focus-visible:ring-0 focus-visible:ring-offset-0 min-h-[80px]"
              required
            />

            {message && (
              <div
                className={`my-2 p-2 text-sm rounded-md ${
                  message.includes("Error") || message.includes("error")
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
                }`}>
                <div className="flex items-center justify-between">
                  <span>{message}</span>
                  <button
                    type="button"
                    className="text-gray-500 hover:text-gray-700"
                    onClick={() => setMessage("")}>
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Image Preview */}
            {postData.image && (
              <div className="relative mt-3 rounded-xl overflow-hidden border">
                <img
                  src={postData.image}
                  alt="Preview"
                  className="w-full h-auto max-h-[300px] object-cover"
                />
                <button
                  type="button"
                  className="absolute top-2 right-2 bg-black/70 text-white p-1 rounded-full"
                  onClick={handleRemoveImage}>
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between px-4 py-3 border-t">
          <div className="flex items-center">
            <ImageUploader
              image={postData.image}
              onUploadSuccess={handleOnUpload}
              onUploadError={handleUploadError}
              onRemoveImage={handleRemoveImage}
              className="text-primary hover:text-primary/80"
              iconClassName="h-5 w-5"
            />
          </div>

          <Button
            type="submit"
            disabled={!postData.content.trim() || isSubmitting}
            className="rounded-full px-4 bg-primary hover:bg-primary/90 text-white">
            {isSubmitting ? "Posting..." : "Post"}
          </Button>
        </div>
      </form>
    </div>
  );
}
