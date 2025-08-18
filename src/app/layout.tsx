import type { Metadata } from "next";
import "../../globals.css";
import { AuthProvider } from "@/services/auth/AuthProvider";
import { ToastProvider } from "@/components/ui/toast";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";

export const metadata: Metadata = {
  title: "myEvents - Discover Amazing Events",
  description:
    "Find and book tickets for concerts, festivals, sports, theater, and more. Your next unforgettable experience is just a click away.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-gray-950 text-white antialiased">
        <ToastProvider>
          <AuthProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
