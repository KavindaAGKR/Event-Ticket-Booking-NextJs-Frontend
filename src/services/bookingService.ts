
export interface BookingData {
  eventId: string | number;
  eventName: string;
  eventPrice: number;
  customerEmail: string;
  customerName: string;
  numberOfTickets: number;
  totalAmount: number;
  paymentMethod: string;
  cardDetails: {
    name: string;
    cardNo: string;
    exp: string;
    cvc: string;
  };
}

export interface BookingResponse {
  id: string;
  eventId: string;
  eventName?: string;
  customerEmail: string;
  customerName: string;
  numberOfTickets: number;
  quantity?: number; 
  totalAmount: number;
  totalPrice?: number; 
  paymentMethod: string;
  bookingDate: string;
  status: "CONFIRMED" | "CANCELLED" | "PENDING" | "FAILED";
  ticketNumbers?: string[];

  event?: {
    id: string;
    name: string;
    description: string;
    location: string;
    venue: string;
    startDateTime: string;
    endDateTime: string;
    ticketPrice: number;
    totalTickets: number;
    category: string;
    imageUrl: string;
    organizerName: string;
    organizerEmail: string;
  };
}

// base URL
const BOOKING_API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL_BOOKINGS || "http://localhost:3001";

//function for API calls
async function bookingApiCall(
  endpoint: string,
  options: RequestInit = {}
): Promise<any> {
  try {
    const url = `${BOOKING_API_BASE_URL}${endpoint}`;
    const token =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

    console.log("Making booking API call to:", url);

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
    console.error("Booking API call failed:", error);
    throw error;
  }
}

// Create a new booking
export async function createBooking(
  bookingData: BookingData
): Promise<BookingResponse> {
  try {
    console.log("Creating booking with data:", bookingData);

    const response = await bookingApiCall("/bookings", {
      method: "POST",
      body: JSON.stringify(bookingData),
    });

    console.log("Booking created successfully:", response);
    return response.data || response;
  } catch (error: any) {
    console.error("Failed to create booking:", error);
    throw new Error(error.message || "Failed to create booking");
  }
}

// Get all bookings for current user
export async function getUserBookings(): Promise<BookingResponse[]> {
  try {
    const response = await bookingApiCall("/bookings");
    return response.data || [];
  } catch (error) {
    console.error("Failed to fetch user bookings:", error);
    return [];
  }
}

// Get booking by ID
export async function getBookingById(
  bookingId: string
): Promise<BookingResponse | null> {
  try {
    const response = await bookingApiCall(`/bookings/${bookingId}`);
    return response.data || null;
  } catch (error) {
    console.error("Failed to fetch booking:", error);
    return null;
  }
}

// Cancel a booking
export async function cancelBooking(booking: BookingResponse): Promise<void> {
  try {
    await bookingApiCall(`/bookings/cancel/${booking.id}`, {
      method: "PUT",
      body: JSON.stringify({ booking }),
    });
  } catch (error: any) {
    console.error("Failed to cancel booking:", error);
    throw new Error(error.message || "Failed to cancel booking");
  }
}

// Update booking status
export async function updateBookingStatus(
  bookingId: string,
  status: "confirmed" | "cancelled" | "pending"
): Promise<BookingResponse> {
  try {
    const response = await bookingApiCall(`/bookings/${bookingId}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
    return response.data || response;
  } catch (error: any) {
    console.error("Failed to update booking status:", error);
    throw new Error(error.message || "Failed to update booking status");
  }
}


// validate expiry date
export function validateExpiryDate(expiry: string): boolean {
  const expRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$|^([0-9]{4})-(0[1-9]|1[0-2])$/;

  if (!expRegex.test(expiry)) {
    return false;
  }

  let month: number, year: number;

  if (expiry.includes("/")) {
    const [monthStr, yearStr] = expiry.split("/");
    month = parseInt(monthStr);
    year = 2000 + parseInt(yearStr); 
  } else {
    const [yearStr, monthStr] = expiry.split("-");
    month = parseInt(monthStr);
    year = parseInt(yearStr);
  }

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return false;
  }

  return true;
}

export function validateCVC(cvc: string): boolean {
  return /^[0-9]{3,4}$/.test(cvc);
}

export function formatCardNumber(cardNumber: string): string {
  const cleanCardNumber = cardNumber.replace(/[\s-]/g, "");
  return cleanCardNumber.replace(/(.{4})/g, "$1 ").trim();
}

export function maskCardNumber(cardNumber: string): string {
  const cleanCardNumber = cardNumber.replace(/[\s-]/g, "");
  const firstFour = cleanCardNumber.substring(0, 4);
  const lastFour = cleanCardNumber.substring(cleanCardNumber.length - 4);
  const middleMask = "*".repeat(cleanCardNumber.length - 8);

  return `${firstFour}${middleMask}${lastFour}`
    .replace(/(.{4})/g, "$1 ")
    .trim();
}
