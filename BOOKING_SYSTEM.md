# Booking System Documentation

## Overview

The booking system has been implemented with a dedicated service and page structure to handle event ticket bookings with payment processing.

## Architecture

### 1. Booking Service (`src/services/bookingService.ts`)
- **API Base URL**: `http://localhost:3001` (configurable via `NEXT_PUBLIC_API_BASE_URL_BOOKINGS`)
- **Main Endpoint**: `POST /bookings/`
- Handles all booking-related API calls
- Includes credit card validation utilities
- Uses separate API from events service for better separation of concerns

### 2. Booking Page (`src/app/booking/page.tsx`)
- Complete booking form with customer details and payment information
- Real-time form validation
- Credit card validation using Luhn algorithm
- Responsive design with booking summary sidebar
- Success/error handling with user feedback

### 3. Integration Points

#### Event Details Page
- Updated to redirect to booking page instead of direct API calls
- Passes `eventId` and `quantity` as URL parameters

#### My Bookings Page
- Updated to use new booking service
- Gracefully handles missing event data
- Maintains existing UI structure

## API Integration

### Booking Request Format
```json
{
  "eventId": "1",
  "eventName": "chandewww",
  "eventPrice": 2500.00,
  "customerEmail": "bimlpirsad66@gmail.com", 
  "customerName": "John Doe",
  "numberOfTickets": 12,
  "totalAmount": 17810.00,
  "paymentMethod": "CARDs",
  "cardDetails": {
    "name": "John Doe",
    "cardNo": "1111111111111111",
    "exp": "2025-12",
    "cvc": "123"
  }
}
```

### Environment Configuration
Add to your `.env.local`:
```bash
NEXT_PUBLIC_API_BASE_URL_BOOKINGS=http://localhost:3001
```

## Features

### Form Validation
- **Customer Details**: Name and email validation
- **Card Details**: Credit card number (Luhn algorithm), expiry date, CVC
- **Real-time feedback**: Errors clear as user types

### Security Features
- Credit card numbers stored without spaces
- Visual masking for card display
- HTTPS enforcement for production
- Token-based authentication

### User Experience
- Loading states during form submission
- Success confirmation with auto-redirect
- Error handling with clear messages
- Mobile-responsive design
- Accessible form labels and validation

## File Structure
```
src/
├── app/
│   ├── booking/
│   │   └── page.tsx          # Main booking page
│   ├── events/[eventId]/
│   │   └── page.tsx          # Updated to redirect to booking
│   └── my-bookings/
│       └── page.tsx          # Updated to use booking service
├── services/
│   └── bookingService.ts     # Booking API service
└── lib/
    └── events.ts            # Removed old booking functions
```

## Backend Requirements

Your backend at `http://localhost:3001` should implement:

### POST /bookings/
- Accept booking data in the format shown above
- Process payment with card details
- Return booking confirmation with ID and status
- Handle validation errors appropriately

### GET /bookings/my-bookings
- Return user's bookings (requires authentication)
- Include event details when possible

### PUT /bookings/{id}/cancel
- Cancel a specific booking
- Update booking status to "cancelled"

## Error Handling

The system handles various error scenarios:
- Invalid credit card numbers
- Network connectivity issues
- Backend validation errors
- Authentication failures
- Missing required fields

## Testing

To test the booking system:
1. Start your backend on port 3001
2. Navigate to an event details page
3. Click "Book Tickets"
4. Fill out the booking form with test data
5. Submit and verify the booking is created
6. Check "My Bookings" to see the confirmation

## Security Considerations

- Never store credit card details in localStorage
- Use HTTPS in production
- Implement proper backend validation
- Use secure payment processing (integrate with Stripe, PayPal, etc.)
- Sanitize all user inputs
