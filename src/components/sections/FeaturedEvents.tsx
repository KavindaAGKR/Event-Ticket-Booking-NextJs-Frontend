"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Calendar } from "lucide-react";
import {
  Event,
  getEvents,
  formatDate,
  formatTime,
  formatPrice,
  getEventStatus,
} from "@/services/eventsServices";

export default function FeaturedEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchFeaturedEvents = async () => {
      try {
        setIsLoading(true);
        const allEvents = await getEvents();
        setEvents(allEvents.slice(0, 10));
      } catch (error) {
        console.error("Failed to fetch featured events:", error);
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedEvents();
  }, []);

  const handleEventClick = (eventId: string) => {
    router.push(`/events/${eventId}`);
  };

  const handleViewAllEvents = () => {
    router.push("/events");
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Featured Events
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Discover the hottest events happening near you. Book your tickets
              now and don't miss out!
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="animate-pulse">
                <div className="h-48 bg-gray-800"></div>
                <CardHeader>
                  <div className="h-4 bg-gray-800 rounded mb-2"></div>
                  <div className="h-3 bg-gray-800 rounded w-3/4"></div>
                </CardHeader>
                <CardFooter>
                  <div className="h-8 bg-gray-800 rounded w-20"></div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Featured Events
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Discover the hottest events happening near you. Book your tickets
            now and don't miss out!
          </p>
        </div>

        {events.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {events.map((event) => (
                <Card
                  key={event.id}
                  className="group hover:scale-105 transition-all duration-300 overflow-hidden cursor-pointer bg-gray-800 border-gray-700 hover:border-purple-500"
                  onClick={() => handleEventClick(event.id!)}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={event.imageUrl}
                      alt={event.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        const parent = target.parentElement;
                        if (parent) {
                          const fallback = parent.querySelector(".fallback-bg");
                          if (fallback) {
                            fallback.classList.remove("hidden");
                            fallback.classList.add("flex");
                          }
                        }
                      }}
                    />
                    // ...existing code...
                    <div className="fallback-bg hidden absolute inset-0 bg-gradient-to-br from-purple-600 to-indigo-600 items-center justify-center">
                      <div className="text-white text-6xl font-bold opacity-20">
                        {event.category.charAt(0)}
                      </div>
                    </div>
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      <span className="bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
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
                    <div className="absolute top-3 right-3">
                      <span className="bg-black/70 text-white px-2 py-1 rounded-full text-xs font-medium">
                        {formatPrice(event.ticketPrice)}
                      </span>
                    </div>
                  </div>

                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg line-clamp-2 group-hover:text-purple-400 transition-colors text-white">
                      {event.name}
                    </CardTitle>
                    <div className="flex items-center text-gray-400 text-sm space-x-4">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(event.startDateTime)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{formatTime(event.startDateTime)}</span>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-400 text-sm">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="line-clamp-1">
                        {event.venue}, {event.location}
                      </span>
                    </div>
                  </CardHeader>

                  <CardFooter className="pt-0 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-2xl font-bold text-white">
                        {formatPrice(event.ticketPrice)}
                      </span>
                      <span className="text-xs text-gray-400">
                        {event.totalTickets - (event.soldTickets || 0)} left
                      </span>
                    </div>
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEventClick(event.id!);
                      }}
                      className="group-hover:bg-purple-500 transition-colors"
                    >
                      Get Tickets
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Button
                variant="outline"
                size="lg"
                onClick={handleViewAllEvents}
                className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white"
              >
                View All Events
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-medium text-gray-300 mb-2">
                No Featured Events
              </h3>
              <p>Check back later for exciting events!</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
