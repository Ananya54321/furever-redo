"use client";
import React, { useState, useEffect } from "react";
import { CldUploadWidget } from "next-cloudinary";
import axios from "axios";
import { getToken } from "@/../actions/userActions";

const EventForm = () => {
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    image: "",
    eventDate: "",
    eventTime: "",
    location: "",
  });
  const [imageUploaded, setImageUploaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [token, setToken] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchToken = async () => {
      const userToken = await getToken("userToken");
      console.log("User token from cookies:", userToken);
      if (userToken) {
        setToken(userToken);
        setIsLoggedIn(true);
      } else {
        console.error("No token found");
        setMessage("Please log in to create an event.");
      }
    };

    fetchToken();
  }, []);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOnUpload = (result) => {
    console.log("Upload successful:", result);
    const imageUrl = result.info.secure_url;
    setEventData((prev) => ({
      ...prev,
      image: imageUrl,
    }));
    setImageUploaded(true);
    setMessage("Image uploaded successfully!");
  };

  const handleUploadError = (error) => {
    console.error("Upload error:", error);
    setMessage(`Upload error: ${error.message || "Unknown error"}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      setMessage("Please log in to create an event.");
      return;
    }
    if (!eventData.image) {
      setMessage("Please upload an image first!");
      return;
    }

    try {
      setLoading(true);
      const formattedData = {
        ...eventData,
        eventDate: new Date(eventData.eventDate).toISOString(),
      };

      console.log("Submitting event data:", formattedData);

      const response = await axios.post("/api/event", {
        eventData: formattedData,
        token,
      });

      if (response.data.success) {
        setMessage("Event created successfully!");
        setEventData({
          title: "",
          description: "",
          image: "",
          eventDate: "",
          eventTime: "",
          location: "",
        });
        setImageUploaded(false);
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setMessage(`Error: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add New Event</h1>

      {message && (
        <div
          className={`p-2 mb-4 ${
            message.includes("Error") || message.includes("error")
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          } rounded`}>
          {message}
        </div>
      )}

      {!isLoggedIn ? (
        <div className="p-4 bg-yellow-100 text-yellow-800 rounded">
          You need to be logged in to create an event.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Event Title</label>
            <input
              type="text"
              name="title"
              value={eventData.title}
              onChange={handleInputChange}
              required
              className="w-full p-2 border rounded focus:ring focus:ring-blue-200 focus:outline-none"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Description</label>
            <textarea
              name="description"
              value={eventData.description}
              onChange={handleInputChange}
              required
              className="w-full p-2 border rounded focus:ring focus:ring-blue-200 focus:outline-none"
              rows="3"></textarea>
          </div>

          <div>
            <label className="block mb-1 font-medium">Event Image</label>
            <div className="mb-2">
              <CldUploadWidget
                uploadPreset="Furrever"
                onSuccess={handleOnUpload}
                onError={handleUploadError}
                options={{
                  sources: ["local", "url", "camera"],
                  multiple: false,
                  maxFiles: 1,
                }}>
                {({ open }) => (
                  <button
                    type="button"
                    onClick={() => open()}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
                    {eventData.image ? "Change Image" : "Upload Image"}
                  </button>
                )}
              </CldUploadWidget>
            </div>

            {imageUploaded && eventData.image && (
              <div className="mt-2">
                <img
                  src={eventData.image}
                  alt="Event preview"
                  className="h-40 object-contain border rounded p-1"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium">Event Date</label>
            <input
              type="date"
              name="eventDate"
              value={eventData.eventDate}
              onChange={handleInputChange}
              required
              className="w-full p-2 border rounded focus:ring focus:ring-blue-200 focus:outline-none"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Event Time</label>
            <input
              type="time"
              name="eventTime"
              value={eventData.eventTime}
              onChange={handleInputChange}
              required
              className="w-full p-2 border rounded focus:ring focus:ring-blue-200 focus:outline-none"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Location</label>
            <input
              type="text"
              name="location"
              value={eventData.location}
              onChange={handleInputChange}
              required
              className="w-full p-2 border rounded focus:ring focus:ring-blue-200 focus:outline-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading || !eventData.image}>
              {loading ? "Creating Event..." : "Create Event"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default EventForm;
