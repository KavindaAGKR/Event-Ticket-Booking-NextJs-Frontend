"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth/AuthProvider";
import {
  Event,
  EVENT_CATEGORIES,
  formatDate,
  formatTime,
  formatPrice,
  getEventStatus,
  getEvents,
  getOrganizerEvents,
} from "@/lib/events";
import {
  Plus,
  Search,
  Filter,
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Clock,
} from "lucide-react";

export default function EventsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);

  // First useEffect - handle authentication and fetch events
  useEffect(() => {
    // Check authentication first
    if (!authLoading && !user) {
      router.push("/auth/signin");
      return;
    }

    if (!user) {
      return; // Wait for user to be loaded
    }

    // Fetch events from API or mock data
    const fetchEvents = async () => {
      try {
        const response = await getOrganizerEvents();
        setEvents(response);
      } catch (error) {
        console.error("Failed to fetch events:", error);
        setEvents([]);
      }
    };

    fetchEvents();
  }, [user, router, authLoading]);

  // Second useEffect - handle filtering (must be before any conditional returns)
  useEffect(() => {
    let filtered = events;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (event) =>
          event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory && selectedCategory !== "All") {
      filtered = filtered.filter(
        (event) => event.category === selectedCategory
      );
    }

    setFilteredEvents(filtered);
  }, [events, searchTerm, selectedCategory]);

  // Now we can have conditional returns after all hooks are defined
  // Show loading while authentication is being checked
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // Show loading if user is not authenticated (will redirect)
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white">Redirecting...</div>
      </div>
    );
  }

  const handleEventClick = (event: Event) => {
    router.push(`/events/${event.id}`);
  };

  const categories = ["All", ...EVENT_CATEGORIES];

  return (
    <div>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">My Events</h1>
            <p className="text-gray-400">Manage and organize your events</p>
          </div>

          {user && (
            <Link href="/events/create">
              <Button className="mt-4 md:mt-0">
                <Plus className="w-4 h-4 mr-2" />
                Create Event
              </Button>
            </Link>
          )}
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-900 border-gray-800 text-white placeholder:text-gray-400"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-gray-900 border border-gray-800 text-white rounded-md px-3 py-2 text-sm"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Events Grid */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                onClick={() => handleEventClick(event)}
                className="cursor-pointer"
              >
                <Card className="bg-gray-900 border-gray-800 hover:border-purple-500 transition-colors cursor-pointer group overflow-hidden">
                  {/* Event Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={event.imageUrl}
                      alt={event.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      <span className="bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                        {event.category}
                      </span>
                      {(() => {
                        const status = getEventStatus(
                          event.startDateTime,
                          event.endDateTime
                        );
                        const statusColors = {
                          upcoming: "bg-green-600",
                          ongoing: "bg-yellow-600",
                          ended: "bg-red-600",
                        };
                        return (
                          <span
                            className={`${statusColors[status]} text-white px-2 py-1 rounded-full text-xs font-medium capitalize`}
                          >
                            {status}
                          </span>
                        );
                      })()}
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className="bg-black/70 text-white px-2 py-1 rounded-full text-xs font-medium">
                        {formatPrice(event.ticketPrice)}
                      </span>
                    </div>
                  </div>

                  {/* Event Details */}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-400 transition-colors">
                      {event.name}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {event.description}
                    </p>

                    {/* Event Meta */}
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-400 text-sm">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>{formatDate(event.startDateTime)}</span>
                        <Clock className="w-4 h-4 ml-4 mr-2" />
                        <span>{formatTime(event.startDateTime)}</span>
                      </div>

                      <div className="flex items-center text-gray-400 text-sm">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>
                          {event.venue}, {event.location}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-gray-400 text-sm">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-2" />
                          <span>
                            {event.totalTickets - (event.soldTickets || 0)}{" "}
                            tickets
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-purple-400 font-medium">
                            {formatPrice(event.ticketPrice)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Organizer */}
                    <div className="mt-4 pt-4 border-t border-gray-800">
                      <p className="text-gray-500 text-xs">
                        Organized by{" "}
                        <span className="text-gray-300">
                          {event.organizerName}
                        </span>
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-medium text-gray-300 mb-2">
                No events found
              </h3>
              <p>
                You haven't created any events yet. Start by creating your first
                event!
              </p>
            </div>
            {user && (
              <Link href="/events/create">
                <Button className="mt-4">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Event
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
