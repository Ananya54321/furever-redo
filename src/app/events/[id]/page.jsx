"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, MapPin, Heart, ArrowLeft, Users, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import { getToken } from "@/../actions/userActions";
import Link from "next/link";
import Image from "next/image";

export default function EventDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/event/${id}`);
        if (response.data.success) {
          setEvent(response.data.event);
        } else {
          toast.error("Failed to fetch event details");
          router.push("/events");
        }
      } catch (error) {
        console.error("Error fetching event:", error);
        toast.error("An error occurred");
        router.push("/events");
      } finally {
        setLoading(false);
      }
    };

    const initUser = async () => {
      const token = await getToken("userToken");
      if (token) {
        try {
          const decoded = jwtDecode(token);
          setUserId(decoded.id);
        } catch (e) {
          console.error("Token decode error", e);
        }
      }
    };

    if (id) {
      fetchEventDetails();
      initUser();
    }
  }, [id, router]);

  const handleToggleInterest = async () => {
    if (!userId) {
      toast.error("Please login to register interest");
      router.push("/login");
      return;
    }

    const previousEvent = { ...event };
    const isInterested = event.interested?.includes(userId);

    // Optimistic update
    setEvent({
      ...event,
      interested: isInterested
        ? event.interested.filter((id) => id !== userId)
        : [...(event.interested || []), userId],
    });

    try {
      const { data } = await axios.put("/api/event", { eventId: id });
      if (!data.success) {
        throw new Error(data.error);
      }
      toast.success(data.message);
    } catch (error) {
      console.error("Interest error:", error);
      toast.error("Failed to update interest");
      setEvent(previousEvent); // Rollback
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-secondary/20">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-secondary/20">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Event not found</h2>
        <Link href="/events">
          <Button>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Events
          </Button>
        </Link>
      </div>
    );
  }

  const isInterested = event.interested?.includes(userId);

  return (
    <div className="min-h-screen bg-secondary/30 pb-20">
      {/* Header */}
      <div className="bg-primary text-white py-8 px-4">
        <div className="container mx-auto">
          <Link href="/events">
            <Button variant="ghost" className="text-white hover:bg-white/10 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Events
            </Button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-4">
        <Card className="overflow-hidden shadow-xl">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Event Image */}
            <div className="h-96 md:h-auto relative bg-gray-100">
              <Image
                src={event.image || "/placeholder-event.jpg"}
                alt={event.title}
                fill
                className="object-cover"
              />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-md">
                <p className="text-xs font-semibold text-gray-500 mb-1">EVENT DATE</p>
                <p className="text-2xl font-bold text-primary">
                  {format(new Date(event.eventDate), "MMM d")}
                </p>
                <p className="text-sm text-gray-600">
                  {format(new Date(event.eventDate), "yyyy")}
                </p>
              </div>
            </div>

            {/* Event Details */}
            <CardContent className="p-8 flex flex-col">
              <div className="mb-6">
                <h1 className="text-4xl font-bold text-primary mb-4 titlefont">
                  {event.title}
                </h1>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-start text-gray-700">
                    <Calendar className="w-5 h-5 mr-3 text-accent mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Date</p>
                      <p>{format(new Date(event.eventDate), "EEEE, MMMM d, yyyy")}</p>
                    </div>
                  </div>
                  <div className="flex items-start text-gray-700">
                    <Clock className="w-5 h-5 mr-3 text-accent mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Time</p>
                      <p>{event.eventTime}</p>
                    </div>
                  </div>
                  <div className="flex items-start text-gray-700">
                    <MapPin className="w-5 h-5 mr-3 text-accent mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Location</p>
                      <p>{event.location}</p>
                    </div>
                  </div>
                  <div className="flex items-start text-gray-700">
                    <Users className="w-5 h-5 mr-3 text-accent mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Interested</p>
                      <p>
                        {event.interested?.length || 0}{" "}
                        {event.interested?.length === 1 ? "person" : "people"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-3">
                    About this Event
                  </h2>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                    {event.description}
                  </p>
                </div>
              </div>

              <div className="mt-auto pt-6">
                <Button
                  size="lg"
                  variant={isInterested ? "secondary" : "default"}
                  className={`w-full ${
                    isInterested
                      ? "bg-red-50 text-red-600 hover:bg-red-100 border-2 border-red-200"
                      : "bg-primary hover:bg-primary/90"
                  }`}
                  onClick={handleToggleInterest}
                >
                  <Heart
                    className={`w-5 h-5 mr-2 ${isInterested ? "fill-red-600" : ""}`}
                  />
                  {isInterested ? "You're Interested!" : "Mark as Interested"}
                </Button>
                {!userId && (
                  <p className="text-sm text-gray-500 text-center mt-2">
                    Please login to mark your interest
                  </p>
                )}
              </div>
            </CardContent>
          </div>
        </Card>
      </div>
    </div>
  );
}
