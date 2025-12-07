"use client";
import React, { useState } from "react";
import axios from "axios";
import { getToken } from "@/../actions/userActions";
import { useRouter } from "next/navigation";
import ImageUploader from "@/components/ImageUploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarIcon, MapPin, Clock, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "react-hot-toast";

const CreateEventDialog = ({ onEventCreated }) => {
  const [open, setOpen] = useState(false);
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    image: "",
    eventDate: "",
    eventTime: "",
    location: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOnUpload = (url) => {
    setEventData((prev) => ({
      ...prev,
      image: url,
    }));
    toast.success("Image uploaded successfully!");
  };

  const handleUploadError = (error) => {
    console.error("Upload error:", error);
    toast.error(`Upload error: ${error.message || "Unknown error"}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!eventData.image) {
      toast.error("Please upload an image first!");
      return;
    }

    try {
      const token = await getToken("userToken");
      if (!token) {
        toast.error("Please log in to create an event.");
        return;
      }

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
        toast.success("Event created successfully!");
        setOpen(false);
        setEventData({
          title: "",
          description: "",
          image: "",
          eventDate: "",
          eventTime: "",
          location: "",
        });
        if (onEventCreated) onEventCreated(); 
        else router.refresh();
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error(`Error: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-accent hover:bg-accent/90 text-primary font-bold px-8 py-6 rounded-full transition-all shadow-lg hover:shadow-xl hover:scale-105">
          <Plus className="w-5 h-5 mr-2" />
          Create Event
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-primary" />
            Create New Event
          </DialogTitle>
          <DialogDescription>
            Fill in the details below to host your own pet gathering.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
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
              className="min-h-[100px] focus-visible:ring-accent"
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
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-6 text-lg"
            disabled={loading || !eventData.image}
          >
            {loading ? "Creating..." : "Publish Event"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEventDialog;
