"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { getToken } from "@/../actions/userActions";
import { useRouter } from "next/navigation";
import ImageUploader from "@/components/ImageUploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarIcon, MapPin, Clock } from "lucide-react";

const EventForm = () => {
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    image: "",
    eventDate: "",
    eventTime: "",
    location: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [token, setToken] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchToken = async () => {
      const userToken = await getToken("userToken");
      if (userToken) {
        setToken(userToken);
        setIsLoggedIn(true);
      } else {
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

  const handleOnUpload = (url) => {
    // The ImageUploader now passes the URL string directly
    console.log("Upload successful:", url);
    setEventData((prev) => ({
      ...prev,
      image: url,
    }));
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

      const response = await axios.post("/api/event", {
        eventData: formattedData,
        token,
      });

      if (response.data.success) {
        router.push("/events");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setMessage(`Error: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-2xl">
      <Card className="shadow-lg">
        <CardHeader className="bg-primary/5 border-b mb-6">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-primary" />
            Create New Event
          </CardTitle>
        </CardHeader>
        <CardContent>
          {message && (
            <div
              className={`p-3 mb-6 rounded-md text-sm font-medium ${
                message.includes("Error")
                  ? "bg-destructive/10 text-destructive"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Event Title</Label>
              <Input
                id="title"
                name="title"
                value={eventData.title}
                onChange={handleInputChange}
                required
                placeholder="e.g., Sunday Dog Park Meetup"
                className="focus-visible:ring-accent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="eventDate">Date</Label>
                <div className="relative">
                  <Input
                    type="date"
                    id="eventDate"
                    name="eventDate"
                    value={eventData.eventDate}
                    onChange={handleInputChange}
                    required
                    className="focus-visible:ring-accent"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="eventTime">Time</Label>
                <div className="relative">
                  <Input
                    type="time"
                    id="eventTime"
                    name="eventTime"
                    value={eventData.eventTime}
                    onChange={handleInputChange}
                    required
                    className="focus-visible:ring-accent"
                  />
                  <Clock className="w-4 h-4 text-gray-500 absolute right-3 top-3 pointer-events-none opacity-50" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <div className="relative">
                <Input
                  id="location"
                  name="location"
                  value={eventData.location}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Central Park, Hyd"
                  className="pl-10 focus-visible:ring-accent"
                />
                <MapPin className="w-4 h-4 text-gray-500 absolute left-3 top-3 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={eventData.description}
                onChange={handleInputChange}
                required
                placeholder="Tell people what your event is about..."
                className="min-h-[120px] focus-visible:ring-accent"
              />
            </div>

            <div className="space-y-2">
              <Label>Event Image</Label>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <ImageUploader
                  media={eventData.image ? [eventData.image] : []}
                  onUploadSuccess={handleOnUpload}
                  onUploadError={handleUploadError}
                />
                {!eventData.image && (
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Upload a banner image/poster for your event
                  </p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-6 text-lg mt-4"
              disabled={loading || !eventData.image}
            >
              {loading ? "Creating..." : "Publish Event"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventForm;
