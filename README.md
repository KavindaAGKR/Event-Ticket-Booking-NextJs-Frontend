# Event Ticket Booking System – Frontend

This is the frontend application of the Event Ticket Booking System, built with Next.js. It provides a user-friendly interface for browsing events, booking tickets, managing accounts, and interacting with backend services. The frontend is fully integrated with AWS Amplify, API Gateway, Cognito authentication, and S3 for image hosting.

## 🚀 Tech Stack

- **Next.js** (React framework)
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Node.js & npm** for package management
- **AWS Amplify** for hosting & CI/CD
- **AWS S3** for storing event images
- **AWS API Gateway** for connecting with backend services
- **AWS Cognito** for authentication

## 📦 Project Setup

### 1. Clone the Repository
```bash
git clone https://github.com/KavindaAGKR/Event-Ticket-Booking-NextJs-Frontend.git
cd Event-Ticket-Booking-NextJs-Frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration

Create a `.env.local` file in the root directory and add the following environment variables:

```env
NEXT_PUBLIC_AWS_REGION=ap-southeast-1
NEXT_PUBLIC_AWS_ACCESS_KEY_ID=your_aws_access_key_id
NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
NEXT_PUBLIC_AWS_S3_BUCKET_NAME=your_s3_bucket_name
NEXT_PUBLIC_API_BASE_URL=https://cloud-api.cisk.site
NEXT_PUBLIC_API_BASE_URL_BOOKINGS=https://cloud-api.cisk.site
```

#### Environment Variables Explanation:

- **NEXT_PUBLIC_AWS_REGION**: The AWS region where your services are deployed (e.g., `ap-southeast-1` for Asia Pacific Singapore)
- **NEXT_PUBLIC_AWS_ACCESS_KEY_ID**: Your AWS access key ID for S3 image uploads and other AWS services
- **NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY**: Your AWS secret access key (keep this secure and never commit to version control)
- **NEXT_PUBLIC_AWS_S3_BUCKET_NAME**: The name of your S3 bucket where event images are stored
- **NEXT_PUBLIC_API_BASE_URL**: The base URL of your backend API for events and authentication
- **NEXT_PUBLIC_API_BASE_URL_BOOKINGS**: The base URL for booking-related API endpoints

> **Security Note**: Never commit your `.env.local` file to version control. Add it to your `.gitignore` file to prevent accidental exposure of sensitive credentials.

### 4. Run in Development Mode

The frontend runs locally on port 4000.

```bash
npm run dev
```

Now open [http://localhost:4000](http://localhost:4000) in your browser.

### 5. Build for Production
```bash
npm run build
```

### 6. Start Production Server
```bash
npm start
```

## 📂 Folder Structure

```
├── src/
│   ├── app/                    # Next.js 13+ App Router pages
│   │   ├── auth/              # Authentication pages (signin, signup, verify)
│   │   ├── booking/           # Booking page
│   │   ├── events/            # Event pages (list, details, create, edit)
│   │   ├── my-bookings/       # User's booking history
│   │   └── profile/           # User profile page
│   ├── components/            # Reusable UI components
│   │   ├── sections/          # Page sections (Header, Footer, etc.)
│   │   └── ui/               # Basic UI components (Button, Card, etc.)
│   ├── lib/                   # Utility functions
│   └── services/              # API service functions
│       ├── auth/             # Authentication services
│       ├── bookingService.ts  # Booking API calls
│       ├── eventsServices.ts  # Events API calls
│       └── imageUploadService.ts # S3 image upload service
├── public/                    # Static assets (favicon, icons)
├── package.json              # Project dependencies and scripts
└── README.md                 # This file
```

## 🔗 Deployment Flow

1. **Code Push**: Code is pushed to GitHub repository
2. **Auto Build**: AWS Amplify automatically pulls the latest code and builds it using CodeBuild/CodePipeline
3. **Hosting**: The app is hosted with a custom domain (https://cloud.cisk.site), secured with AWS Certificate Manager (SSL)
4. **Image Storage**: Event images uploaded to AWS S3 are displayed via URLs saved in the backend database
5. **API Communication**: The frontend communicates with backend services through AWS API Gateway

## 🔧 Key Features

- **Event Management**: Browse, search, and view event details
- **User Authentication**: Sign up, sign in, email verification using AWS Cognito
- **Ticket Booking**: Book tickets with payment processing
- **Image Upload**: Upload event images to AWS S3
- **Responsive Design**: Mobile-friendly interface
- **User Dashboard**: Manage bookings and profile

## 👩‍💻 Developer Notes

- Ensure **Node.js v18+** is installed
- API endpoints are configured through environment variables
- For production deployment, update Amplify build settings if needed
- The app uses TypeScript for type safety
- Tailwind CSS is used for styling
- All API calls include proper error handling and loading states

## 🚨 Common Issues & Solutions

### CORS Issues
If you encounter CORS errors when making API calls, ensure your backend API includes proper CORS headers for your frontend domain.

### Image Upload Issues
Verify that your AWS credentials have proper S3 permissions and the bucket name is correct in the environment variables.

### Authentication Issues
Check that your AWS Cognito configuration matches the frontend setup and all required scopes are enabled.

## 📝 License

This project is part of the Event Ticket Booking System and is intended for educational/demonstration purposes.
