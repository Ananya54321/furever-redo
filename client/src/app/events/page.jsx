"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import CreateEventDialog from "@/components/CreateEventDialog";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Heart, Ticket, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { getToken } from "@/../actions/userActions";
import { toast } from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/event");
      if (response.data.success) {
        setEvents(response.data.events);
      } else {
        setError("Failed to fetch events");
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      setError("An error occurred while fetching events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      await fetchEvents();
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
    init();
  }, []);

  const handleToggleInterest = async (eventId) => {
    if (!userId) {
      toast.error("Please login to register interest");
      return;
    }

    // Optimistic update
    const previousEvents = [...events];
    setEvents(events.map(ev => {
      if (ev._id === eventId) {
        const isInterested = ev.interested?.includes(userId);
        const newInterested = isInterested 
          ? ev.interested.filter(id => id !== userId)
          : [...(ev.interested || []), userId];
        return { ...ev, interested: newInterested };
      }
      return ev;
    }));

    try {
      const { data } = await axios.put("/api/event", { eventId });
      if (!data.success) {
        throw new Error(data.error);
      }
      toast.success(data.message);
    } catch (error) {
      console.error("Interest error:", error);
      toast.error("Failed to update interest");
      setEvents(previousEvents); // Rollback
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-secondary/20">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
      </div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-secondary/30 pb-20">
      {/* Header Section */}
      <div className="bg-primary text-secondary py-16 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl titlefont font-bold mb-4 text-white">
                Community Events
              </h1>
              <p className="text-accent text-lg max-w-2xl">
                Discover meetups, adoption drives, and pet parties near you.
                Join the FurEver community!
              </p>
            </div>
            <CreateEventDialog onEventCreated={fetchEvents} />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-10">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl shadow-sm mb-8">
            {error}
          </div>
        )}

        {events.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 bg-white rounded-2xl shadow-sm border border-border"
          >
            <div className="w-20 h-20 bg-secondary/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Ticket className="w-10 h-10 text-primary/50" />
            </div>
            <h3 className="text-2xl font-bold text-primary mb-2">No Upcoming Events</h3>
            <p className="text-gray-500 mb-8">Be the first to create a gathering for our community!</p>
            <CreateEventDialog onEventCreated={fetchEvents} />
          </motion.div>
        ) : (
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {events.map((event) => {
              const isInterested = event.interested?.includes(userId);
              return (
                <motion.div
                  key={event._id}
                  variants={item}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full"
                >
                  <div className="h-56 overflow-hidden relative">
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors z-10" />
                    <img
                      src={event.image || "/placeholder-event.jpg"}
                      alt={event.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary z-20 shadow-sm">
                      {format(new Date(event.eventDate), "MMM d")}
                    </div>
                  </div>
                  
                  <div className="p-6 flex-grow flex flex-col">
                    <h2 className="text-2xl font-bold mb-3 text-primary line-clamp-1 titlefont group-hover:text-accent transition-colors">
                      {event.title}
                    </h2>
                    <p className="text-gray-500 mb-6 line-clamp-2 text-sm flex-grow">
                      {event.description}
                    </p>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-gray-600 text-sm">
                        <Calendar className="w-4 h-4 mr-3 text-accent" />
                        <span>
                          {format(new Date(event.eventDate), "EEEE, MMMM d, yyyy")}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600 text-sm">
                        <Clock className="w-4 h-4 mr-3 text-accent" />
                        <span>{event.eventTime}</span>
                      </div>
                      <div className="flex items-center text-gray-600 text-sm">
                        <MapPin className="w-4 h-4 mr-3 text-accent" />
                        <span className="truncate">{event.location}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Link href={`/events/${event._id}`} className="flex-1">
                        <Button
                          variant="outline"
                          className="w-full hover:bg-primary hover:text-white transition-all duration-300"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </Link>
                      <Button
                        variant={isInterested ? "secondary" : "outline"}
                        className={`flex-1 transition-all duration-300 ${isInterested ? "bg-red-50 text-red-600 hover:bg-red-100" : "hover:text-red-500 hover:border-red-500"}`}
                        onClick={() => handleToggleInterest(event._id)}
                      >
                        <Heart className={`w-4 h-4 mr-2 ${isInterested ? "fill-red-600" : ""}`} />
                        {isInterested ? "Interested" : "Interested?"}
                        {event.interested?.length > 0 && (
                          <span className="ml-2 text-xs bg-white/50 px-2 py-0.5 rounded-full">
                            {event.interested.length}
                          </span>
                        )}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
}
