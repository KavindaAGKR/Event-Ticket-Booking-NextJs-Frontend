"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth/AuthProvider";
import {
  getEventById,
  Event,
  formatPrice,
  formatDate,
  formatTime,
} from "@/lib/events";
import {
  createBooking,
  BookingData,
  validateExpiryDate,
  validateCVC,
  formatCardNumber,
} from "@/services/bookingService";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Clock,
  CreditCard,
  Lock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export default function BookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  // Get URL parameters
  const eventId = searchParams.get("eventId");
  const quantity = parseInt(searchParams.get("quantity") || "1");

  // State management
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form state
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    numberOfTickets: quantity,
    paymentMethod: "CARDs",
    cardDetails: {
      name: "",
      cardNo: "",
      exp: "",
      cvc: "",
    },
  });

  // Fetch event data
  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) {
        router.push("/events");
        return;
      }

      try {
        setIsLoading(true);
        const eventData = await getEventById(eventId);

        if (!eventData) {
          router.push("/events");
          return;
        }

        setEvent(eventData);

        // Pre-fill user data if available
        if (user) {
          setFormData((prev) => ({
            ...prev,
            customerName: user.name || "",
            customerEmail: user.email || "",
          }));
        }
      } catch (error) {
        console.error("Failed to fetch event:", error);
        router.push("/events");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [eventId, router, user]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!user && !isLoading) {
      router.push(
        "/auth/signin?redirect=" +
          encodeURIComponent(`/booking?eventId=${eventId}&quantity=${quantity}`)
      );
    }
  }, [user, isLoading, router, eventId, quantity]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name.startsWith("card.")) {
      const cardField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        cardDetails: {
          ...prev.cardDetails,
          [cardField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Format card number input
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setFormData((prev) => ({
      ...prev,
      cardDetails: {
        ...prev.cardDetails,
        cardNo: formatted.replace(/\s/g, ""), // Store without spaces
      },
    }));

    if (errors["card.cardNo"]) {
      setErrors((prev) => ({ ...prev, "card.cardNo": "" }));
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Customer details validation
    if (!formData.customerName.trim()) {
      newErrors.customerName = "Name is required";
    }

    if (!formData.customerEmail.trim()) {
      newErrors.customerEmail = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
      newErrors.customerEmail = "Invalid email format";
    }

    if (formData.numberOfTickets < 1) {
      newErrors.numberOfTickets = "At least 1 ticket is required";
    }

    // Card details validation
    if (!formData.cardDetails.name.trim()) {
      newErrors["card.name"] = "Cardholder name is required";
    }

    if (!formData.cardDetails.cardNo) {
      newErrors["card.cardNo"] = "Card number is required";
    }

    if (!formData.cardDetails.exp) {
      newErrors["card.exp"] = "Expiry date is required";
    } else if (!validateExpiryDate(formData.cardDetails.exp)) {
      newErrors["card.exp"] = "Invalid expiry date";
    }

    if (!formData.cardDetails.cvc) {
      newErrors["card.cvc"] = "CVC is required";
    } else if (!validateCVC(formData.cardDetails.cvc)) {
      newErrors["card.cvc"] = "Invalid CVC";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !event) {
      return;
    }

    setIsSubmitting(true);

    try {
      const totalAmount = event.ticketPrice * formData.numberOfTickets;

      const bookingData: BookingData = {
        eventId: event.id || eventId!,
        eventName: event.name,
        eventPrice: event.ticketPrice,
        customerEmail: formData.customerEmail,
        customerName: formData.customerName,
        numberOfTickets: formData.numberOfTickets,
        totalAmount: totalAmount,
        paymentMethod: formData.paymentMethod,
        cardDetails: formData.cardDetails,
      };

      const result = await createBooking(bookingData);
      console.log("Booking successful:", result);

      setBookingSuccess(true);

      // Redirect to confirmation page after 3 seconds
      setTimeout(() => {
        router.push("/my-bookings");
      }, 3000);
    } catch (error: any) {
      console.error("Booking failed:", error);
      setErrors({
        submit: error.message || "Failed to create booking. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white">Loading booking details...</div>
      </div>
    );
  }

  if (!event || !user) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white">Redirecting...</div>
      </div>
    );
  }

  if (bookingSuccess) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <Card className="bg-gray-900 border-gray-800 p-8 max-w-md mx-auto text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">
            Booking Confirmed!
          </h2>
          <p className="text-gray-400 mb-6">
            Your booking for {event.name} has been confirmed. You will receive a
            confirmation email shortly.
          </p>
          <p className="text-sm text-gray-500">
            Redirecting to your bookings...
          </p>
        </Card>
      </div>
    );
  }

  const totalAmount = event.ticketPrice * formData.numberOfTickets;

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <div className="container mx-auto px-4 py-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="text-gray-400 hover:text-white mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Complete Your Booking
          </h1>
          <p className="text-gray-400">
            Secure checkout for your event tickets
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Event Summary */}
          <div className="lg:col-span-1">
            <Card className="bg-gray-900 border-gray-800 p-6 sticky top-8">
              <h3 className="text-lg font-bold text-white mb-4">
                Booking Summary
              </h3>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-white">{event.name}</h4>
                  <p className="text-sm text-gray-400 line-clamp-2">
                    {event.description}
                  </p>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-400">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{formatDate(event.startDateTime)}</span>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>
                      {formatTime(event.startDateTime)} -{" "}
                      {formatTime(event.endDateTime)}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>
                      {event.venue}, {event.location}
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-800 pt-4 space-y-2">
                  <div className="flex justify-between text-gray-400">
                    <span>Ticket Price</span>
                    <span>{formatPrice(event.ticketPrice)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Quantity</span>
                    <span>{formData.numberOfTickets}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-white border-t border-gray-800 pt-2">
                    <span>Total</span>
                    <span>{formatPrice(totalAmount)}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Customer Details */}
              <Card className="bg-gray-900 border-gray-800 p-6">
                <h3 className="text-lg font-bold text-white mb-4">
                  Customer Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-medium mb-2">
                      Full Name *
                    </label>
                    <Input
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleInputChange}
                      className="bg-gray-800 border-gray-700 text-white"
                      placeholder="Enter your full name"
                    />
                    {errors.customerName && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.customerName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">
                      Email Address *
                    </label>
                    <Input
                      name="customerEmail"
                      type="email"
                      value={formData.customerEmail}
                      onChange={handleInputChange}
                      className="bg-gray-800 border-gray-700 text-white"
                      placeholder="Enter your email"
                    />
                    {errors.customerEmail && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.customerEmail}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-white font-medium mb-2">
                    Number of Tickets *
                  </label>
                  <Input
                    name="numberOfTickets"
                    type="number"
                    min="1"
                    value={formData.numberOfTickets}
                    onChange={handleInputChange}
                    className="bg-gray-800 border-gray-700 text-white max-w-32"
                  />
                  {errors.numberOfTickets && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.numberOfTickets}
                    </p>
                  )}
                </div>
              </Card>

              {/* Payment Details */}
              <Card className="bg-gray-900 border-gray-800 p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Payment Details
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-white font-medium mb-2">
                      Cardholder Name *
                    </label>
                    <Input
                      name="card.name"
                      value={formData.cardDetails.name}
                      onChange={handleInputChange}
                      className="bg-gray-800 border-gray-700 text-white"
                      placeholder="Name on card"
                    />
                    {errors["card.name"] && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors["card.name"]}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">
                      Card Number *
                    </label>
                    <Input
                      name="cardNo"
                      value={formatCardNumber(formData.cardDetails.cardNo)}
                      onChange={handleCardNumberChange}
                      className="bg-gray-800 border-gray-700 text-white"
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                    />
                    {errors["card.cardNo"] && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors["card.cardNo"]}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white font-medium mb-2">
                        Expiry Date *
                      </label>
                      <Input
                        name="card.exp"
                        value={formData.cardDetails.exp}
                        onChange={handleInputChange}
                        className="bg-gray-800 border-gray-700 text-white"
                        placeholder="2025-12"
                      />
                      {errors["card.exp"] && (
                        <p className="text-red-400 text-sm mt-1">
                          {errors["card.exp"]}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-white font-medium mb-2">
                        CVC *
                      </label>
                      <Input
                        name="card.cvc"
                        value={formData.cardDetails.cvc}
                        onChange={handleInputChange}
                        className="bg-gray-800 border-gray-700 text-white"
                        placeholder="123"
                        maxLength={4}
                      />
                      {errors["card.cvc"] && (
                        <p className="text-red-400 text-sm mt-1">
                          {errors["card.cvc"]}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center mt-4 text-sm text-gray-400">
                  <Lock className="w-4 h-4 mr-2" />
                  <span>Your payment information is secure and encrypted</span>
                </div>
              </Card>

              {/* Error Message */}
              {errors.submit && (
                <Card className="bg-red-900/20 border-red-800 p-4">
                  <div className="flex items-center text-red-400">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    <span>{errors.submit}</span>
                  </div>
                </Card>
              )}

              {/* Submit Button */}
              <Card className="bg-gray-900 border-gray-800 p-6">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-3 text-lg"
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    <>
                      <Lock className="w-5 h-5 mr-2" />
                      Complete Booking - {formatPrice(totalAmount)}
                    </>
                  )}
                </Button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  By completing this booking, you agree to our Terms of Service
                  and Privacy Policy
                </p>
              </Card>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
