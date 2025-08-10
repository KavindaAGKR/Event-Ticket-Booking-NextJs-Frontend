"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Star } from "lucide-react";

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  venue: string;
  price: string;
  image: string;
  rating: number;
  category: string;
  featured: boolean;
}

export default function FeaturedEvents() {
  // Mock data - replace with API call
  const featuredEvents: Event[] = [
    {
      id: "1",
      title: "Summer Music Festival 2025",
      date: "Aug 15, 2025",
      time: "6:00 PM",
      location: "New York, NY",
      venue: "Central Park",
      price: "From $89",
      image: "/api/placeholder/400/300",
      rating: 4.8,
      category: "Music",
      featured: true,
    },
    {
      id: "2",
      title: "Broadway Musical - The Lion King",
      date: "Aug 20, 2025",
      time: "7:30 PM",
      location: "New York, NY",
      venue: "Minskoff Theatre",
      price: "From $125",
      image: "/api/placeholder/400/300",
      rating: 4.9,
      category: "Theater",
      featured: true,
    },
    {
      id: "3",
      title: "Tech Conference 2025",
      date: "Sep 5, 2025",
      time: "9:00 AM",
      location: "San Francisco, CA",
      venue: "Moscone Center",
      price: "From $199",
      image: "/api/placeholder/400/300",
      rating: 4.7,
      category: "Conference",
      featured: true,
    },
    {
      id: "4",
      title: "Comedy Night with Top Comedians",
      date: "Aug 25, 2025",
      time: "8:00 PM",
      location: "Los Angeles, CA",
      venue: "Comedy Store",
      price: "From $45",
      image: "/api/placeholder/400/300",
      rating: 4.6,
      category: "Comedy",
      featured: true,
    },
    {
      id: "5",
      title: "Food & Wine Festival",
      date: "Sep 12, 2025",
      time: "12:00 PM",
      location: "Miami, FL",
      venue: "South Beach",
      price: "From $79",
      image: "/api/placeholder/400/300",
      rating: 4.5,
      category: "Food",
      featured: true,
    },
    {
      id: "6",
      title: "NBA Finals Game 7",
      date: "Jun 18, 2025",
      time: "8:00 PM",
      location: "Boston, MA",
      venue: "TD Garden",
      price: "From $299",
      image: "/api/placeholder/400/300",
      rating: 4.9,
      category: "Sports",
      featured: true,
    },
  ];

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
          {featuredEvents.map((event) => (
            <Card
              key={event.id}
              className="group hover:scale-105 transition-all duration-300 overflow-hidden"
            >
              <div className="relative h-48 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
                  <div className="text-white text-6xl font-bold opacity-20">
                    {event.category.charAt(0)}
                  </div>
                </div>
                <div className="absolute top-3 left-3">
                  <span className="bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    {event.category}
                  </span>
                </div>
                <div className="absolute top-3 right-3 flex items-center space-x-1 bg-black/50 rounded-full px-2 py-1">
                  <Star className="h-3 w-3 text-yellow-400 fill-current" />
                  <span className="text-white text-xs">{event.rating}</span>
                </div>
              </div>

              <CardHeader className="pb-3">
                <CardTitle className="text-lg line-clamp-2 group-hover:text-purple-400 transition-colors">
                  {event.title}
                </CardTitle>
                <div className="flex items-center text-gray-400 text-sm space-x-4">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>
                      {event.date} • {event.time}
                    </span>
                  </div>
                </div>
                <div className="flex items-center text-gray-400 text-sm">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>
                    {event.venue}, {event.location}
                  </span>
                </div>
              </CardHeader>

              <CardFooter className="pt-0 flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold text-white">
                    {event.price}
                  </span>
                </div>
                <Button
                  size="sm"
                  onClick={() => {
                    /* Handle ticket booking */
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
            onClick={() => {
              /* Handle view all events */
            }}
          >
            View All Events
          </Button>
        </div>
      </div>
    </section>
  );
}
