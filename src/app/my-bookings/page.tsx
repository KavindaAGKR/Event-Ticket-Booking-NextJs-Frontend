"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/lib/auth/AuthProvider";
import {
  formatDate,
  formatTime,
  formatPrice,
  getEventStatus,
} from "@/lib/events";
import {
  getUserBookings,
  cancelBooking,
  BookingResponse,
} from "@/services/bookingService";
import {
  Calendar,
  MapPin,
  Ticket,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Eye,
  X,
} from "lucide-react";

export default function MyBookingsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cancellingBooking, setCancellingBooking] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (!user) {
      router.push("/auth/signin");
      return;
    }

    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        const userBookings = await getUserBookings();
        setBookings(userBookings);
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
        setBookings([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [user, router]);

  if (!user) {
    return null;
  }

  const handleCancelBooking = async (bookingId: string) => {
    if (
      !confirm(
        "Are you sure you want to cancel this booking? This action cannot be undone."
      )
    ) {
      return;
    }

    setCancellingBooking(bookingId);

    try {
      await cancelBooking(bookingId);

      // Update local state
      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === bookingId
            ? { ...booking, status: "cancelled" }
            : booking
        )
      );

      alert("Booking cancelled successfully!");
    } catch (error: any) {
      alert(error.message || "Failed to cancel booking. Please try again.");
    } finally {
      setCancellingBooking(null);
    }
  };

  const getStatusIcon = (status: BookingResponse["status"]) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "pending":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case "cancelled":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: BookingResponse["status"]) => {
    switch (status) {
      case "confirmed":
        return "text-green-400";
      case "pending":
        return "text-yellow-400";
      case "cancelled":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-white">Loading your bookings...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">My Bookings</h1>
          <p className="text-gray-400">
            Manage your event tickets and bookings
          </p>
        </div>

        {/* Bookings List */}
        {bookings.length > 0 ? (
          <div className="space-y-6">
            {bookings.map((booking) => {
              // Handle the case where event data might not be included
              const eventData = booking.event;
              const eventName = booking.eventName || eventData?.name || "Event";
              const quantity = booking.numberOfTickets || booking.quantity || 1;
              const totalPrice = booking.totalAmount || booking.totalPrice || 0;

              // Only show event status if we have event data
              const canCancel = booking.status !== "cancelled";

              return (
                <Card key={booking.id} className="bg-gray-900 border-gray-800">
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      {/* Event Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                          {/* Event Image */}
                          {eventData?.imageUrl && (
                            <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                              <img
                                src={eventData.imageUrl}
                                alt={eventName}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}

                          {/* Event Details */}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg font-semibold text-white">
                                {eventName}
                              </h3>
                              {eventData?.category && (
                                <span className="bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                                  {eventData.category}
                                </span>
                              )}
                            </div>

                            {eventData && (
                              <>
                                <div className="flex items-center text-gray-400 text-sm mb-2">
                                  <Calendar className="w-4 h-4 mr-2" />
                                  <span>
                                    {formatDate(
                                      eventData.startDateTime,
                                      "long"
                                    )}
                                  </span>
                                  <Clock className="w-4 h-4 ml-4 mr-2" />
                                  <span>
                                    {formatTime(eventData.startDateTime)}
                                  </span>
                                </div>

                                <div className="flex items-center text-gray-400 text-sm">
                                  <MapPin className="w-4 h-4 mr-2" />
                                  <span>
                                    {eventData.venue}, {eventData.location}
                                  </span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Booking Details */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-800 rounded-lg">
                          <div>
                            <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">
                              Booking ID
                            </p>
                            <p className="text-white font-mono text-sm">
                              {booking.id}
                            </p>
                          </div>

                          <div>
                            <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">
                              Quantity
                            </p>
                            <p className="text-white font-medium">
                              {quantity} ticket{quantity > 1 ? "s" : ""}
                            </p>
                          </div>

                          <div>
                            <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">
                              Total Price
                            </p>
                            <p className="text-white font-medium">
                              {formatPrice(totalPrice)}
                            </p>
                          </div>

                          <div>
                            <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">
                              Booked On
                            </p>
                            <p className="text-white text-sm">
                              {formatDate(booking.bookingDate)}
                            </p>
                          </div>
                        </div>

                        {/* Ticket Numbers */}
                        {booking.ticketNumbers &&
                          booking.ticketNumbers.length > 0 && (
                            <div className="mt-4">
                              <p className="text-gray-400 text-sm mb-2">
                                Ticket Numbers:
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {booking.ticketNumbers.map(
                                  (ticketNumber, index) => (
                                    <span
                                      key={index}
                                      className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs font-mono"
                                    >
                                      {ticketNumber}
                                    </span>
                                  )
                                )}
                              </div>
                            </div>
                          )}
                      </div>

                      {/* Status and Actions */}
                      <div className="flex flex-col items-center gap-4 min-w-[200px]">
                        {/* Status */}
                        <div className="flex items-center gap-2">
                          {getStatusIcon(booking.status)}
                          <span
                            className={`font-medium capitalize ${getStatusColor(
                              booking.status
                            )}`}
                          >
                            {booking.status}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-2 w-full">
                          <Link href={`/events/${booking.eventId}`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full border-gray-700"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View Event
                            </Button>
                          </Link>

                          {canCancel && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCancelBooking(booking.id)}
                              disabled={cancellingBooking === booking.id}
                              className="w-full border-red-600 text-red-400 hover:bg-red-950 hover:text-red-300"
                            >
                              {cancellingBooking === booking.id ? (
                                "Cancelling..."
                              ) : (
                                <>
                                  <X className="w-4 h-4 mr-2" />
                                  Cancel Booking
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Ticket className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-medium text-gray-300 mb-2">
                No bookings found
              </h3>
              <p className="mb-6">You haven't booked any events yet.</p>
              <Link href="/events">
                <Button>Browse Events</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
