"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { getToken } from "@/../actions/userActions";
import { useRouter } from "next/navigation";
import ImageUploader from "@/components/ImageUploader";

const ReportForm = () => {
  const [reportData, setReportData] = useState({
    title: "",
    description: "",
    image: "",
    reportDate: "",
    reportTime: "",
    location: "",
  });
  const [imageUploaded, setImageUploaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [token, setToken] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchToken = async () => {
      const userToken = await getToken("userToken");
      console.log("User token from cookies:", userToken);
      if (userToken) {
        setToken(userToken);
        setIsLoggedIn(true);
      } else {
        console.error("No token found");
        setMessage("Please log in to create a report.");
      }
    };

    fetchToken();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReportData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOnUpload = (result) => {
    console.log("Upload successful:", result);
    const imageUrl = result.info.secure_url;
    setReportData((prev) => ({
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
    if (!reportData.image) {
      setMessage("Please upload an image first!");
      return;
    }

    try {
      setLoading(true);
      const formattedData = {
        ...reportData,
        reportDate: new Date(reportData.reportDate).toISOString(),
      };

      console.log("Submitting report data:", formattedData);

      const response = await axios.post("/api/report", {
        reportData: formattedData,
        token,
      });

      if (response.data.success) {
        setMessage("Report created successfully!");
        router.push("/reports");
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
      <h1 className="text-2xl font-bold mb-4">Add New Report</h1>

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
          You need to be logged in to create a report.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Report Title</label>
            <input
              type="text"
              name="title"
              value={reportData.title}
              onChange={handleInputChange}
              required
              className="w-full p-2 border rounded focus:ring focus:ring-blue-200 focus:outline-none"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Description</label>
            <textarea
              name="description"
              value={reportData.description}
              onChange={handleInputChange}
              required
              className="w-full p-2 border rounded focus:ring focus:ring-blue-200 focus:outline-none"
              rows="3"></textarea>
          </div>
          <label className="block mb-1 font-medium">Report Image</label>

          <ImageUploader
            image={reportData.image}
            onUploadSuccess={handleOnUpload}
            onUploadError={handleUploadError}
          />

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

export default ReportForm;
