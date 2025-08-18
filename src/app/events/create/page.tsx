"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/services/auth/AuthProvider";
import {
  CreateEventData,
  EVENT_CATEGORIES,
  createEvent,
} from "@/services/eventsServices";
import ImageUploader from "./ImageUploader";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  DollarSign,
  Image as ImageIcon,
} from "lucide-react";

export default function CreateEventPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

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

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/signin");
    }
  }, [user, router, authLoading]);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        organizerName: user.name || "",
        organizerEmail: user.email || "",
      }));
    }
  }, [user]);

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
      await createEvent(formData);
      router.push("/events");
    } catch (error: any) {
      setError(error.message || "Failed to create event. Please try again.");
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
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push("/events")}
            className="text-gray-400 hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Events
          </Button>
          <h1 className="text-3xl font-bold text-white mb-2">
            Create New Event
          </h1>
          <p className="text-gray-400">
            Fill in the details below to create your event
          </p>
        </div>
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
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
            <div className="lg:col-span-1 space-y-6">
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
              <Card className="bg-gray-900 border-gray-800 p-6">
                {error && (
                  <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-md">
                    <p className="text-red-300 text-sm">{error}</p>
                  </div>
                )}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full"
                  size="lg"
                >
                  {isLoading ? "Creating Event..." : "Create Event"}
                </Button>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
