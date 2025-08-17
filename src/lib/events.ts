export interface Event {
  id?: string;
  name: string;
  description: string;
  location: string;
  venue: string;
  startDateTime: string;
  endDateTime: string;
  ticketPrice: number;
  totalTickets: number;
  soldTickets?: number;
  category: string;
  imageUrl: string;
  organizerName: string;
  organizerEmail: string;
}

export interface CreateEventData extends Omit<Event, "id"> {}

export interface EventFilters {
  search?: string;
  category?: string;
  location?: string;
  priceRange?: [number, number];
  dateRange?: [string, string];
}

// API base URL
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL_EVENTS || "http://localhost:3002";

// Helper function for API calls
async function apiCall(
  endpoint: string,
  options: RequestInit = {}
): Promise<any> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const token =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("API call failed:", error);
    throw error;
  }
}

// Fetch all events
export async function getEvents(filters?: EventFilters): Promise<Event[]> {
  try {
    const queryParams = new URLSearchParams();

    if (filters?.search) queryParams.append("search", filters.search);
    if (filters?.category && filters.category !== "All") {
      queryParams.append("category", filters.category);
    }
    if (filters?.location) queryParams.append("location", filters.location);

    const queryString = queryParams.toString();
    const endpoint = `/events/get-all-events`;

    const response = await apiCall(endpoint);
    return response.data || [];
  } catch (error) {
    console.error("Failed to fetch events:", error);
    return [];
  }
}

// Fetch all events
export async function getOrganizerEvents(
  filters?: EventFilters
): Promise<Event[]> {
  try {
    // const queryParams = new URLSearchParams();

    // if (filters?.search) queryParams.append("search", filters.search);
    // if (filters?.category && filters.category !== "All") {
    //   queryParams.append("category", filters.category);
    // }
    // if (filters?.location) queryParams.append("location", filters.location);

    //const queryString = queryParams.toString();
    console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
    const endpoint = `/events/my-events`;

    const response = await apiCall(endpoint);
    return response.data || [];
  } catch (error) {
    console.error("Failed to fetch events:", error);
    return [];
  }
}

// Fetch single event by ID
export async function getEventById(eventId: string): Promise<Event | null> {
  try {
    const response = await apiCall(`/events/${eventId}`);
    return response.data || null;
  } catch (error) {
    console.error("Failed to fetch event:", error);
    return null;
  }
}

// Create new event
export async function createEvent(eventData: CreateEventData): Promise<Event> {
  try {
    console.log("Creating event with data:", eventData);

    // Format datetime fields to proper ISO-8601 format
    const formattedEventData = {
      ...eventData,
      startDateTime: formatDateTimeForBackend(eventData.startDateTime),
      endDateTime: formatDateTimeForBackend(eventData.endDateTime),
    };

    console.log("Formatted event data:", formattedEventData);

    const response = await apiCall("/events/create", {
      method: "POST",
      body: JSON.stringify(formattedEventData),
    });
    return response.data;
  } catch (error: any) {
    console.error("Failed to create event:", error);
    throw new Error(error.message || "Failed to create event");
  }
}

// Update existing event
export async function updateEvent(
  eventId: string,
  eventData: Partial<CreateEventData>
): Promise<Event> {
  try {
    // Format datetime fields if they exist
    const formattedEventData = { ...eventData };
    if (eventData.startDateTime) {
      formattedEventData.startDateTime = formatDateTimeForBackend(
        eventData.startDateTime
      );
    }
    if (eventData.endDateTime) {
      formattedEventData.endDateTime = formatDateTimeForBackend(
        eventData.endDateTime
      );
    }

    const response = await apiCall(`/events/${eventId}`, {
      method: "PUT",
      body: JSON.stringify(formattedEventData),
    });
    return response.data;
  } catch (error: any) {
    console.error("Failed to update event:", error);
    throw new Error(error.message || "Failed to update event");
  }
}

// Delete event
export async function deleteEvent(eventId: string): Promise<void> {
  try {
    await apiCall(`/events/${eventId}`, {
      method: "DELETE",
    });
  } catch (error: any) {
    console.error("Failed to delete event:", error);
    throw new Error(error.message || "Failed to delete event");
  }
}

// Utility functions
export const formatDateTimeForBackend = (dateTimeString: string): string => {
  console.log("Original datetime string:", dateTimeString);

  // If empty or null, throw error
  if (!dateTimeString) {
    throw new Error("DateTime string is required");
  }

  // If the datetime string is already in full ISO format, return as is
  if (
    dateTimeString.includes("Z") ||
    dateTimeString.match(/[+-]\d{2}:\d{2}$/)
  ) {
    console.log("Already in ISO format:", dateTimeString);
    return dateTimeString;
  }

  // Handle datetime-local format (YYYY-MM-DDTHH:MM) or similar variations
  if (dateTimeString.includes("T")) {
    let formatted: string;

    // Check if it has seconds
    if (dateTimeString.match(/T\d{2}:\d{2}:\d{2}/)) {
      // Has seconds but no timezone
      if (dateTimeString.match(/T\d{2}:\d{2}:\d{2}$/)) {
        formatted = `${dateTimeString}.000Z`;
      } else if (dateTimeString.match(/T\d{2}:\d{2}:\d{2}\.\d{3}$/)) {
        // Has seconds and milliseconds but no timezone
        formatted = `${dateTimeString}Z`;
      } else {
        formatted = dateTimeString;
      }
    } else {
      // No seconds, add them
      formatted = `${dateTimeString}:00.000Z`;
    }

    console.log("Formatted datetime:", formatted);
    return formatted;
  }

  // Fallback: try to parse and format as ISO string
  const date = new Date(dateTimeString);
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date format: ${dateTimeString}`);
  }

  const isoString = date.toISOString();
  console.log("Fallback ISO string:", isoString);
  return isoString;
};

export const formatDate = (
  dateString: string,
  format: "short" | "long" = "short"
) => {
  const options: Intl.DateTimeFormatOptions =
    format === "long"
      ? { weekday: "long", year: "numeric", month: "long", day: "numeric" }
      : { weekday: "short", year: "numeric", month: "short", day: "numeric" };

  return new Date(dateString).toLocaleDateString("en-US", options);
};

export const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
  }).format(price);
};

export const isEventUpcoming = (startDateTime: string) => {
  return new Date(startDateTime) > new Date();
};

export const isEventOngoing = (startDateTime: string, endDateTime: string) => {
  const now = new Date();
  return new Date(startDateTime) <= now && new Date(endDateTime) >= now;
};

export const getEventStatus = (startDateTime: string, endDateTime: string) => {
  const now = new Date();
  const start = new Date(startDateTime);
  const end = new Date(endDateTime);

  if (now < start) return "upcoming";
  if (now >= start && now <= end) return "ongoing";
  return "ended";
};

export const generateEventImageUrl = (eventName: string, category: string) => {
  // Generate appropriate Unsplash URLs based on event category
  const categoryKeywords: Record<string, string> = {
    Technology: "technology-conference",
    Music: "music-concert",
    "Food & Drink": "food-festival",
    Sports: "sports-event",
    Arts: "art-exhibition",
    Business: "business-conference",
    Education: "education-seminar",
    "Health & Wellness": "wellness-event",
    Entertainment: "entertainment-show",
    Other: "event-gathering",
  };

  const keyword = categoryKeywords[category] || "event";
  return `https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop&auto=format&q=80&sig=${encodeURIComponent(
    eventName
  )}`;
};

// Event categories
export const EVENT_CATEGORIES = [
  "Technology",
  "Music",
  "Food & Drink",
  "Sports",
  "Arts",
  "Business",
  "Education",
  "Health & Wellness",
  "Entertainment",
  "Other",
];
