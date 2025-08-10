"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, Menu, User, ShoppingCart, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthProvider";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-gray-900/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
              <span className="text-white font-bold">M</span>
            </div>
            <span className="text-xl font-bold text-white">myEvents</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="/events"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Events
          </Link>
          <Link
            href="/categories"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Categories
          </Link>
          <Link
            href="/venues"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Venues
          </Link>
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

        {/* Search Bar */}
        <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search events, artists, venues..."
              className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-800 border border-gray-700 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              onFocus={() => {
                /* Handle search focus */
              }}
            />
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Search className="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="icon">
            <ShoppingCart className="h-5 w-5" />
          </Button>

          {user ? (
            <div className="flex items-center space-x-4">
              {/* Mobile My Bookings Link */}
              <Link href="/my-bookings" className="md:hidden">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-300 hover:text-white"
                >
                  My Bookings
                </Button>
              </Link>

              {/* User Info - Desktop */}
              <Link
                href="/dashboard"
                className="hidden md:flex items-center space-x-2"
              >
                <div className="hidden md:flex items-center space-x-3 px-3 py-1 rounded-full bg-gray-800 border border-gray-700">
                  <div className="h-7 w-7 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-gray-300 text-sm">{user.name}</span>
                  {/* <button
                  onClick={() => logout()}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                </button> */}
                </div>
              </Link>

              {/* Mobile User Menu */}
              <div className="md:hidden flex items-center space-x-2">
                <Link href="/dashboard">
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5 text-gray-300" />
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              {/* Desktop Sign In/Up */}
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

              {/* Mobile Sign In */}
              <div className="md:hidden">
                <Link href="/auth/signin">
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* Remove the standalone mobile menu button since we have mobile controls above */}
        </div>
      </div>
    </header>
  );
}
