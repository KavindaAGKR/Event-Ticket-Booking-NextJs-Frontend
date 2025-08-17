"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth/AuthProvider";
import {
  Event,
  CreateEventData,
  EVENT_CATEGORIES,
  updateEvent,
  getEventById,
} from "@/lib/events";
import ImageUploader from "../../create/ImageUploader";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  DollarSign,
  Image as ImageIcon,
} from "lucide-react";

export default function EditEventPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const eventId = params.eventId as string;

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingEvent, setIsLoadingEvent] = useState(true);
  const [error, setError] = useState("");
  const [originalEvent, setOriginalEvent] = useState<Event | null>(null);

  const [formData, setFormData] = useState<CreateEventData>({
    name: "",
    description: "",
    location: "",
    venue: "",
    startDateTime: "",
    endDateTime: "",
    ticketPrice: 0,
    totalTickets: 100,
    category: "Technology",
    imageUrl: "",
    organizerName: user?.name || "",
    organizerEmail: user?.email || "",
  });

  // Fetch event data on component mount
  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) return;

      try {
        setIsLoadingEvent(true);
        const event = await getEventById(eventId);

        if (!event) {
          setError("Event not found");
          return;
        }

        // Check if user is authorized to edit this event
        if (
          user?.email !== event.organizerEmail &&
          !user?.role?.includes("admin")
        ) {
          setError("You are not authorized to edit this event");
          return;
        }

        setOriginalEvent(event);

        // Convert the dates to the format expected by datetime-local input
        const formatDateTimeForInput = (dateTimeString: string) => {
          const date = new Date(dateTimeString);
          // Format to YYYY-MM-DDTHH:MM format
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          const hours = String(date.getHours()).padStart(2, "0");
          const minutes = String(date.getMinutes()).padStart(2, "0");
          return `${year}-${month}-${day}T${hours}:${minutes}`;
        };

        setFormData({
          name: event.name,
          description: event.description,
          location: event.location,
          venue: event.venue,
          startDateTime: formatDateTimeForInput(event.startDateTime),
          endDateTime: formatDateTimeForInput(event.endDateTime),
          ticketPrice: event.ticketPrice,
          totalTickets: event.totalTickets,
          category: event.category,
          imageUrl: event.imageUrl,
          organizerName: event.organizerName,
          organizerEmail: event.organizerEmail,
        });
      } catch (error: any) {
        console.error("Failed to fetch event:", error);
        setError(error.message || "Failed to load event");
      } finally {
        setIsLoadingEvent(false);
      }
    };

    if (user && !authLoading) {
      fetchEvent();
    }
  }, [eventId, user, authLoading]);

  // Handle authentication redirect
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/signin");
    }
  }, [user, router, authLoading]);

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

  // Show loading while fetching event
  if (isLoadingEvent) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white">Loading event...</div>
      </div>
    );
  }

  // Show error if any
  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-4">Error</h1>
          <p className="text-gray-300 mb-4">{error}</p>
          <Button onClick={() => router.push("/events/my-events")}>
            Back to My Events
          </Button>
        </div>
      </div>
    );
  }

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    console.log("Form data before submission:", formData);

    // Basic validation
    if (
      !formData.name ||
      !formData.description ||
      !formData.location ||
      !formData.venue
    ) {
      setError("Please fill in all required fields.");
      setIsLoading(false);
      return;
    }

    if (!formData.startDateTime || !formData.endDateTime) {
      setError("Please select start and end date/time.");
      setIsLoading(false);
      return;
    }

    if (new Date(formData.startDateTime) >= new Date(formData.endDateTime)) {
      setError("End date must be after start date.");
      setIsLoading(false);
      return;
    }

    if (formData.ticketPrice < 0 || formData.totalTickets <= 0) {
      setError("Please enter valid ticket price and quantity.");
      setIsLoading(false);
      return;
    }

    try {
      // Update event using utility function
      await updateEvent(eventId, formData);

      // Redirect to my events page after successful update
      router.push("/events/my-events");
    } catch (error: any) {
      console.error("Event update error:", error);
      setError(error.message || "Failed to update event. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (imageUrl: string) => {
    setFormData((prev) => ({ ...prev, imageUrl }));
  };

  const handleImageRemove = () => {
    setFormData((prev) => ({ ...prev, imageUrl: "" }));
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push("/events/my-events")}
            className="text-gray-400 hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to My Events
          </Button>
          <h1 className="text-3xl font-bold text-white mb-2">Edit Event</h1>
          <p className="text-gray-400">Update the details of your event</p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card className="bg-gray-900 border-gray-800 p-6">
                <h2 className="text-xl font-semibold text-white mb-6">
                  Basic Information
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-white font-medium mb-2">
                      Event Name *
                    </label>
                    <Input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter event name"
                      className="bg-gray-800 border-gray-700 text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="Describe your event..."
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    >
                      {EVENT_CATEGORIES.map((category: string) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </Card>

              {/* Location & Venue */}
              <Card className="bg-gray-900 border-gray-800 p-6">
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Location & Venue
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-medium mb-2">
                      Venue Name *
                    </label>
                    <Input
                      type="text"
                      name="venue"
                      value={formData.venue}
                      onChange={handleInputChange}
                      placeholder="e.g., BMICH, Galle Face Green"
                      className="bg-gray-800 border-gray-700 text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">
                      City, Country *
                    </label>
                    <Input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="e.g., Colombo, Sri Lanka"
                      className="bg-gray-800 border-gray-700 text-white"
                      required
                    />
                  </div>
                </div>
              </Card>

              {/* Date & Time */}
              <Card className="bg-gray-900 border-gray-800 p-6">
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Date & Time
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-medium mb-2">
                      Start Date & Time *
                    </label>
                    <Input
                      type="datetime-local"
                      name="startDateTime"
                      value={formData.startDateTime}
                      onChange={handleInputChange}
                      className="bg-gray-800 border-gray-700 text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">
                      End Date & Time *
                    </label>
                    <Input
                      type="datetime-local"
                      name="endDateTime"
                      value={formData.endDateTime}
                      onChange={handleInputChange}
                      className="bg-gray-800 border-gray-700 text-white"
                      required
                    />
                  </div>
                </div>
              </Card>

              {/* Ticketing */}
              <Card className="bg-gray-900 border-gray-800 p-6">
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <DollarSign className="w-5 h-5 mr-2" />
                  Ticketing
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-medium mb-2">
                      Ticket Price (LKR) *
                    </label>
                    <Input
                      type="number"
                      name="ticketPrice"
                      value={formData.ticketPrice}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      placeholder="2500.00"
                      className="bg-gray-800 border-gray-700 text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">
                      Total Tickets Available *
                    </label>
                    <Input
                      type="number"
                      name="totalTickets"
                      value={formData.totalTickets}
                      onChange={handleInputChange}
                      min="1"
                      placeholder="300"
                      className="bg-gray-800 border-gray-700 text-white"
                      required
                    />
                  </div>
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Event Image */}
              <Card className="bg-gray-900 border-gray-800 p-6">
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <ImageIcon className="w-5 h-5 mr-2" />
                  Event Image
                </h2>

                <ImageUploader
                  imageUrl={formData.imageUrl}
                  onImageUpload={handleImageUpload}
                  onImageRemove={handleImageRemove}
                />
              </Card>

              {/* Organizer Info */}
              <Card className="bg-gray-900 border-gray-800 p-6">
                <h2 className="text-xl font-semibold text-white mb-6">
                  Organizer Information
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-white font-medium mb-2">
                      Organizer Name
                    </label>
                    <Input
                      type="text"
                      name="organizerName"
                      value={formData.organizerName}
                      onChange={handleInputChange}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">
                      Contact Email
                    </label>
                    <Input
                      type="email"
                      name="organizerEmail"
                      value={formData.organizerEmail}
                      onChange={handleInputChange}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                </div>
              </Card>

              {/* Submit Button */}
              <Card className="bg-gray-900 border-gray-800 p-6">
                {error && (
                  <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-md">
                    <p className="text-red-300 text-sm">{error}</p>
                  </div>
                )}

                <div className="space-y-3">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full"
                    size="lg"
                  >
                    {isLoading ? "Updating Event..." : "Update Event"}
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => router.push("/events/my-events")}
                    className="w-full text-gray-400 hover:text-white"
                  >
                    Cancel
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
