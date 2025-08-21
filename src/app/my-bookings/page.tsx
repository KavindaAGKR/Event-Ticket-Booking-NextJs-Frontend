"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "@/services/auth/AuthProvider";
import { formatDate, formatTime, formatPrice } from "@/services/eventsServices";
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
  Filter,
} from "lucide-react";

export default function MyBookingsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { success, error } = useToast();
  const router = useRouter();
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<BookingResponse[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [cancellingBooking, setCancellingBooking] = useState<string | null>(
    null
  );
  const [bookingToCancel, setBookingToCancel] =
    useState<BookingResponse | null>(null);
  const [statusFilter, setStatusFilter] = useState<
    BookingResponse["status"] | "ALL"
  >("ALL");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/signin");
      return;
    }

    if (!user) {
      return;
    }

    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        const userBookings = await getUserBookings();
        const sortedBookings = userBookings.sort(
          (a, b) =>
            new Date(b.bookingDate).getTime() -
            new Date(a.bookingDate).getTime()
        );
        setBookings(sortedBookings);
        setFilteredBookings(sortedBookings);
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
        setBookings([]);
        setFilteredBookings([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [user, router, authLoading]);

  useEffect(() => {
    let filtered;
    if (statusFilter === "ALL") {
      filtered = bookings;
    } else {
      filtered = bookings.filter((booking) => booking.status === statusFilter);
    }
    const sortedFiltered = filtered.sort(
      (a, b) =>
        new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime()
    );
    setFilteredBookings(sortedFiltered);
  }, [bookings, statusFilter]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white">Redirecting...</div>
      </div>
    );
  }

  const handleCancelBooking = async (booking: BookingResponse) => {
    setBookingToCancel(booking);
  };

  const confirmCancelBooking = async () => {
    if (!bookingToCancel) return;

    const bookingId = bookingToCancel.id;
    setCancellingBooking(bookingId);

    try {
      await cancelBooking(bookingToCancel);

      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === bookingId
            ? { ...booking, status: "CANCELLED" }
            : booking
        )
      );

      success(
        "Booking Cancelled",
        "Your booking has been cancelled successfully."
      );
    } catch (error: any) {
      error(
        "Cancellation Failed",
        error.message || "Failed to cancel booking. Please try again."
      );
    } finally {
      setCancellingBooking(null);
      setBookingToCancel(null);
    }
  };

  const getStatusIcon = (status: BookingResponse["status"]) => {
    switch (status) {
      case "CONFIRMED":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "PENDING":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case "CANCELLED":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "FAILED":
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: BookingResponse["status"]) => {
    switch (status) {
      case "CONFIRMED":
        return "text-green-400";
      case "PENDING":
        return "text-yellow-400";
      case "CANCELLED":
        return "text-red-400";
      case "FAILED":
        return "text-red-500";
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">My Bookings</h1>
          <p className="text-gray-400">
            Manage your event tickets and bookings
          </p>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-4 p-4 bg-gray-900 rounded-lg border border-gray-800">
            <Filter className="w-5 h-5 text-gray-400" />
            <span className="text-white font-medium">Filter by Status:</span>
            <div className="flex gap-2">
              {(
                ["ALL", "CONFIRMED", "PENDING", "CANCELLED", "FAILED"] as const
              ).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    statusFilter === status
                      ? "bg-blue-600 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  {status === "ALL"
                    ? "All"
                    : status.charAt(0) + status.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
            <div className="ml-auto text-sm text-gray-400">
              Showing {filteredBookings.length} of {bookings.length} bookings
            </div>
          </div>
        </div>

        {filteredBookings.length > 0 ? (
          <div className="space-y-6">
            {filteredBookings.map((booking) => {
              const eventData = booking.event;
              const eventName = booking.eventName || eventData?.name || "Event";
              const quantity = booking.numberOfTickets || booking.quantity || 1;
              const totalPrice = booking.totalAmount || booking.totalPrice || 0;

              const canCancel =
                booking.status == "CONFIRMED" || booking.status == "PENDING";

              return (
                <Card key={booking.id} className="bg-gray-900 border-gray-800">
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                          {eventData?.imageUrl && (
                            <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                              <img
                                src={eventData.imageUrl}
                                alt={eventName}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}

                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg font-semibold text-white">
                                {eventName}
                              </h3>
                              {eventData?.category && (
                                <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
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

                      <div className="flex flex-col items-center gap-4 min-w-[200px]">
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
                              onClick={() => handleCancelBooking(booking)}
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
              {bookings.length === 0 ? (
                <>
                  <h3 className="text-xl font-medium text-gray-300 mb-2">
                    No bookings found
                  </h3>
                  <p className="mb-6">You haven't booked any events yet.</p>
                  <Link href="/events">
                    <Button>Browse Events</Button>
                  </Link>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-medium text-gray-300 mb-2">
                    No bookings match the selected filter
                  </h3>
                  <p className="mb-6">
                    Try selecting a different status filter or clear the filter
                    to see all bookings.
                  </p>
                  <Button
                    onClick={() => setStatusFilter("ALL")}
                    variant="outline"
                  >
                    Show All Bookings
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={!!bookingToCancel}
        onClose={() => setBookingToCancel(null)}
        onConfirm={confirmCancelBooking}
        title="Cancel Booking"
        description="Are you sure you want to cancel this booking? This action cannot be undone and you may not receive a full refund."
        confirmText="Cancel Booking"
        cancelText="Keep Booking"
        variant="destructive"
        isLoading={!!cancellingBooking}
      />
    </div>
  );
}
