"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/lib/auth/AuthProvider";
import {
  Event,
  formatDate,
  formatTime,
  formatPrice,
  getEventStatus,
  getEventById,
} from "@/lib/events";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Clock,
  Share2,
  Heart,
  Ticket,
  Mail,
  Globe,
} from "lucide-react";

export default function EventDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [ticketCount, setTicketCount] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      const eventId = params.eventId as string;
      if (eventId) {
        try {
          setIsLoading(true);
          const eventData = await getEventById(eventId);
          setEvent(eventData);
        } catch (error) {
          console.error("Failed to fetch event:", error);
          setEvent(null);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchEvent();
  }, [params.eventId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-white">Loading event details...</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Event Not Found
          </h2>
          <p className="text-gray-400 mb-6">
            The event you're looking for doesn't exist.
          </p>
          <Button onClick={() => router.push("/events")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Events
          </Button>
        </div>
      </div>
    );
  }

  const handleBookTickets = async () => {
    if (!user) {
      router.push("/auth/signin");
      return;
    }

    // Redirect to booking page with event details
    const bookingUrl = `/booking?eventId=${event.id}&quantity=${ticketCount}`;
    router.push(bookingUrl);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.name,
        text: event.description,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Event link copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-6">
        <Button
          variant="ghost"
          onClick={() => router.push("/events")}
          className="text-gray-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Events
        </Button>
      </div>

      {/* Event Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <img
          src={event.imageUrl}
          alt={event.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/50 to-transparent" />

        {/* Event Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <div className="flex items-center gap-4 mb-4">
              <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                {event.category}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsLiked(!isLiked)}
                className={isLiked ? "text-red-500" : "text-gray-400"}
              >
                <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleShare}
                className="text-gray-400 hover:text-white"
              >
                <Share2 className="w-5 h-5" />
              </Button>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {event.name}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-gray-300">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                <span>{formatDate(event.startDateTime)}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                <span>
                  {formatTime(event.startDateTime)} -{" "}
                  {formatTime(event.endDateTime)}
                </span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                <span>
                  {event.venue}, {event.location}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Event Details */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-900 border-gray-800 p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-6">
                About This Event
              </h2>
              <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                {event.description}
              </p>
            </Card>

            {/* Event Details */}
            <Card className="bg-gray-900 border-gray-800 p-8">
              <h3 className="text-xl font-bold text-white mb-6">
                Event Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-white mb-2">Date & Time</h4>
                  <div className="text-gray-400 space-y-1">
                    <p>{formatDate(event.startDateTime)}</p>
                    <p>
                      {formatTime(event.startDateTime)} -{" "}
                      {formatTime(event.endDateTime)}
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-2">Location</h4>
                  <div className="text-gray-400 space-y-1">
                    <p>{event.venue}</p>
                    <p>{event.location}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-2">Organizer</h4>
                  <div className="text-gray-400 space-y-1">
                    <p>{event.organizerName}</p>
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      <a
                        href={`mailto:${event.organizerEmail}`}
                        className="hover:text-white transition-colors"
                      >
                        {event.organizerEmail}
                      </a>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-2">Category</h4>
                  <p className="text-gray-400">{event.category}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-gray-900 border-gray-800 p-8 sticky top-8">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-white mb-2">
                  {formatPrice(event.ticketPrice)}
                </div>
                <p className="text-gray-400">per ticket</p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between text-gray-400">
                  <span className="flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    Available tickets
                  </span>
                  <span className="text-white font-medium">
                    {event.totalTickets - (event.soldTickets || 0)}
                  </span>
                </div>
              </div>

              {/* Ticket Quantity */}
              <div className="mb-6">
                <label className="block text-white font-medium mb-2">
                  Quantity
                </label>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
                    className="border-gray-700"
                  >
                    -
                  </Button>
                  <span className="text-white font-medium w-8 text-center">
                    {ticketCount}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setTicketCount(ticketCount + 1)}
                    className="border-gray-700"
                  >
                    +
                  </Button>
                </div>
              </div>

              {/* Total Price */}
              <div className="border-t border-gray-800 pt-4 mb-6">
                <div className="flex items-center justify-between text-lg">
                  <span className="text-gray-400">Total</span>
                  <span className="text-white font-bold">
                    {formatPrice(event.ticketPrice * ticketCount)}
                  </span>
                </div>
              </div>

              {/* Book Button */}
              <Button
                onClick={handleBookTickets}
                className="w-full mb-4"
                size="lg"
              >
                <Ticket className="w-4 h-4 mr-2" />
                {user ? "Book Tickets" : "Sign In to Book"}
              </Button>

              <p className="text-gray-500 text-sm text-center">
                Secure booking powered by myEvents
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
