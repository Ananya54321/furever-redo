"use client";
import React, { useState } from "react";
import { CldUploadWidget } from "next-cloudinary";

const ImageUploader = ({ media, onUploadSuccess, onUploadError }) => {
  const [previewUrls, setPreviewUrls] = useState(media || []);

  const handleUploadSuccess = (result) => {
    const uploadedMediaUrl = result.info.secure_url;
    // Add the new media URL to the preview list
    setPreviewUrls((prev) => [...prev, uploadedMediaUrl]);
    if (onUploadSuccess) {
      onUploadSuccess(uploadedMediaUrl);
    }
  };

  const handleUploadError = (error) => {
    console.error("Error uploading media:", error);
    if (onUploadError) {
      onUploadError(error);
    }
  };

  return (
    <div>
      <div className="mb-2">
        <CldUploadWidget
          uploadPreset="Furrever"
          onSuccess={handleUploadSuccess}
          onError={handleUploadError}
          options={{
            sources: ["local", "url", "camera"],
            multiple: true,  // Enable multiple file uploads
            maxFiles: 10,    // Set a limit on the number of files (e.g., max 10)
            accept: "image/*,video/*", // Allow image and video files
          }}
        >
          {({ open }) => (
            <button
              type="button"
              onClick={() => open()}
              className="px-4 py-2 bg-[#788553] rounded-lg text-white transition"
            >
              {media && media.length > 0 ? "Change Media" : "Upload Media"}
            </button>
          )}
        </CldUploadWidget>
      </div>

      {/* Show previews of uploaded images and videos */}
      {previewUrls.length > 0 && (
        <div className="mt-3 grid grid-cols-3 gap-3">
          {previewUrls.map((url, idx) => (
            <div key={idx} className="relative group">
              {/* Display preview for images */}
              {url.match(/\.(jpeg|jpg|gif|png)$/) ? (
                <img
                  src={url}
                  alt={`Media Preview ${idx}`}
                  className="h-40 object-contain border rounded p-1"
                />
              ) : url.match(/\.(mp4|webm|ogg)$/) ? (
                // Display preview for videos
                <video
                  className="h-40 object-contain border rounded p-1"
                  controls
                >
                  <source src={url} type="video/mp4" />
                  <source src={url} type="video/webm" />
                  <source src={url} type="video/ogg" />
                  Your browser does not support the video tag.
                </video>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
