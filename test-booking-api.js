// Test script for booking API
// This can be run in browser console for testing

async function testBookingAPI() {
  const bookingData = {
    eventId: "1",
    eventName: "chandewww",
    eventPrice: 2500.00,
    customerEmail: "bimlpirsad66@gmail.com",
    customerName: "John Doe",
    numberOfTickets: 12,
    totalAmount: 17810.00,
    paymentMethod: "CARDs",
    cardDetails: {
      name: "John Doe",
      cardNo: "1111111111111111",
      exp: "2025-12",
      cvc: "123"
    }
  };

  try {
    const response = await fetch('http://localhost:3001/bookings/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add auth token if needed
        // 'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify(bookingData)
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Booking successful:', result);
    } else {
      console.error('❌ Booking failed:', result);
    }
  } catch (error) {
    console.error('❌ Network error:', error);
  }
}

// Usage:
// testBookingAPI();

export { testBookingAPI };
