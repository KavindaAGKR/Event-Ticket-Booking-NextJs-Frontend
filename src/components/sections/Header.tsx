"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, User, ShoppingCart } from "lucide-react";
import { useAuth } from "@/services/auth/AuthProvider";

export default function Header() {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-gray-900/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center">
              <span className="text-white font-bold">M</span>
            </div>
            <span className="text-xl font-bold text-white">myEvents</span>
          </Link>
        </div>

        <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search events, artists, venues..."
              className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-800 border border-gray-700 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onFocus={() => {}}
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.currentTarget.value.trim()) {
                  window.location.href = `/events?search=${encodeURIComponent(
                    e.currentTarget.value.trim()
                  )}`;
                }
              }}
            />
          </div>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="/"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Home
          </Link>
          <Link
            href="/events"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Events
          </Link>
          {user?.role?.includes("organizer") && (
            <Link
              href="/events/my-events"
              className="text-gray-300 hover:text-white transition-colors font-medium"
            >
              My Events
            </Link>
          )}
          {user && (
            <Link
              href="/my-bookings"
              className="text-gray-300 hover:text-white transition-colors font-medium"
            >
              My Bookings
            </Link>
          )}

          <Link
            href="/about"
            className="text-gray-300 hover:text-white transition-colors"
          >
            About
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Search className="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="icon">
            <ShoppingCart className="h-5 w-5" />
          </Button>

          {user ? (
            <div className="flex items-center space-x-4">
              <Link href="/my-bookings" className="md:hidden">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-300 hover:text-white"
                >
                  My Bookings
                </Button>
              </Link>

              <Link
                href="/profile"
                className="hidden md:flex items-center space-x-2"
                title="My Profile"
              >
                <div className="hidden md:flex items-center space-x-3 px-3 py-1 rounded-full bg-gray-800 border border-gray-700 hover:border-blue-500 transition-colors">
                  <div className="h-7 w-7 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-gray-300 text-sm">
                    {user.name || "Profile"}
                  </span>
                </div>
              </Link>

              <div className="md:hidden flex items-center space-x-2">
                <Link href="/profile" title="My Profile">
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5 text-gray-300" />
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <div className="hidden md:flex items-center space-x-2">
                <Link href="/auth/signin">
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </div>

              <div className="md:hidden">
                <Link href="/auth/signin">
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
