# EventTix - Event Ticket Booking Application

A modern event ticket booking application built with Next.js 15, React 19, and Tailwind CSS, featuring a sleek dark theme UI and comprehensive authentication system.

## 🚀 Getting Started

### Prerequisites
- Node.js 18 or higher
- npm or yarn package manager
- Backend API server (see Backend API Requirements)

### Installation

1. Clone the repository and navigate to the frontend directory
2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```
Edit `.env.local` with your backend API URL:
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   │   ├── signin/        # Sign in page
│   │   ├── signup/        # Sign up page
│   │   └── verify-email/  # Email verification page
│   ├── dashboard/         # User dashboard
│   ├── about/            # About page
│   ├── layout.tsx        # Root layout with AuthProvider
│   └── page.tsx          # Homepage
├── components/
│   ├── ui/               # Reusable UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── input.tsx
│   └── sections/         # Page section components
│       ├── Header.tsx    # Navigation header with auth
│       ├── HeroSection.tsx
│       ├── FeaturedEvents.tsx
│       └── ...
├── lib/
│   └── auth/            # Authentication utilities
│       ├── AuthProvider.tsx  # React context for auth state
│       └── cognito.ts       # API calls and auth functions
└── styles/
    └── globals.css      # Global styles and dark theme
```

## 🔐 Authentication Flow

### User Journey
1. **Sign Up**: Users create an account with email/password
2. **Email Verification**: Users verify their email address
3. **Sign In**: Users log in with credentials
4. **Dashboard Access**: Authenticated users access their dashboard
5. **Persistent Session**: JWT tokens stored in localStorage

### Authentication Features
- ✅ Email/password registration and login
- ✅ Email verification system
- ✅ JWT token-based authentication
- ✅ Protected routes and navigation
- ✅ User session persistence
- ✅ Automatic token refresh (ready for implementation)
- ✅ User profile management in header
- ✅ Dashboard with user-specific content

## 🎨 UI Features

### Homepage
- **Modern Dark Theme**: Sleek gray-900/950 color scheme
- **Hero Section**: Eye-catching gradient backgrounds
- **Featured Events**: Dynamic event showcase
- **Categories**: Event type navigation
- **Features**: Key platform benefits
- **Testimonials**: Social proof section
- **Responsive Design**: Mobile-first approach

### Authentication Pages
- **Consistent Styling**: Matches dark theme
- **Form Validation**: Real-time error handling
- **Loading States**: User feedback during API calls
- **Error Messaging**: Clear, actionable error messages

### Dashboard
- **Welcome Message**: Personalized user greeting
- **Statistics Cards**: Tickets, events, spending overview
- **My Tickets**: Active ticket management
- **Recommendations**: Personalized event suggestions
- **Quick Actions**: Easy navigation and logout

## 🔧 Backend API Requirements

Your backend needs to implement these 8 endpoints (detailed in `BACKEND_API.md`):

### Authentication Endpoints
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/verify-email` - Email verification
- `POST /auth/refresh-token` - Token refresh

### User Management Endpoints
- `GET /auth/me` - Get current user profile
- `PUT /auth/me` - Update user profile
- `POST /auth/forgot-password` - Password reset request
- `POST /auth/reset-password` - Password reset confirmation

### Expected Request/Response Formats
All endpoints use JSON and return consistent response structures with `success`, `data`, `message`, and optional `token` fields.

## 🛠️ Development

### Key Technologies
- **Next.js 15**: React framework with App Router
- **React 19**: Latest React with concurrent features
- **Tailwind CSS v4**: Utility-first styling
- **TypeScript**: Type safety throughout
- **Lucide React**: Consistent iconography
- **clsx & tailwind-merge**: Dynamic styling utilities

### Component Architecture
- **UI Components**: Reusable, styled components in `components/ui/`
- **Section Components**: Page-specific sections in `components/sections/`
- **Authentication Context**: Global auth state management
- **Protected Routes**: Automatic redirect for unauthenticated users

### Styling Approach
- **Dark Theme First**: Primary gray-900/950 backgrounds
- **Purple/Pink Accents**: Gradient brand colors
- **Responsive Design**: Mobile-first breakpoints
- **Consistent Spacing**: Tailwind spacing scale
- **Hover States**: Interactive element feedback

## 🚦 Next Steps

1. **Set Up Backend**: Implement the API endpoints in `BACKEND_API.md`
2. **Configure Environment**: Update `.env.local` with your API URL
3. **Test Authentication**: Try the complete signup → verify → signin flow
4. **Add Event Data**: Create event management endpoints and pages
5. **Implement Payments**: Add Stripe or similar payment processing
6. **Deploy**: Set up production deployment with Vercel or similar

## 📄 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🤝 Contributing

This is a demonstration project showcasing modern React/Next.js development patterns, authentication flows, and UI design principles. Feel free to use as a starting point for your own event booking platform!
