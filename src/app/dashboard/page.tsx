"use client";

import { useAuth } from "@/lib/auth/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, Ticket, User, Settings } from "lucide-react";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/auth/signin");
    }
  }, [user, router]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, { user.email}!
          </h1>
          <p className="text-gray-400">
            Manage your tickets and discover new events
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-gray-900 border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Tickets</p>
                <p className="text-2xl font-bold text-white">3</p>
              </div>
              <Ticket className="h-8 w-8 text-purple-500" />
            </div>
          </Card>

          <Card className="p-6 bg-gray-900 border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Upcoming Events</p>
                <p className="text-2xl font-bold text-white">5</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </Card>

          <Card className="p-6 bg-gray-900 border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Spent</p>
                <p className="text-2xl font-bold text-white">$420</p>
              </div>
              <Settings className="h-8 w-8 text-green-500" />
            </div>
          </Card>

          <Card className="p-6 bg-gray-900 border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Profile</p>
                <p className="text-2xl font-bold text-white">Complete</p>
              </div>
              <User className="h-8 w-8 text-orange-500" />
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* My Tickets */}
          <Card className="lg:col-span-2 p-6 bg-gray-900 border-gray-800">
            <h2 className="text-xl font-semibold text-white mb-4">
              My Tickets
            </h2>
            <div className="space-y-4">
              {[1, 2, 3].map((ticket) => (
                <div
                  key={ticket}
                  className="flex items-center justify-between p-4 bg-gray-800 rounded-lg"
                >
                  <div>
                    <h3 className="font-medium text-white">
                      Summer Music Festival
                    </h3>
                    <p className="text-gray-400 text-sm">
                      July 25, 2024 • Central Park
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-purple-400 font-medium">
                      General Admission
                    </p>
                    <p className="text-gray-400 text-sm">Qty: 2</p>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/my-bookings">
              <Button className="w-full mt-4" variant="outline">
                View All Bookings
              </Button>
            </Link>
          </Card>

          {/* Recommended Events */}
          <Card className="p-6 bg-gray-900 border-gray-800">
            <h2 className="text-xl font-semibold text-white mb-4">
              Recommended
            </h2>
            <div className="space-y-4">
              {[1, 2, 3].map((event) => (
                <div key={event} className="p-3 bg-gray-800 rounded-lg">
                  <h4 className="font-medium text-white text-sm">Jazz Night</h4>
                  <p className="text-gray-400 text-xs">Aug 15 • Blue Note</p>
                  <p className="text-purple-400 text-sm font-medium mt-1">
                    $45
                  </p>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4" size="sm">
              Explore Events
            </Button>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 flex flex-wrap gap-4">
          <Link href="/events">
            <Button>Browse Events</Button>
          </Link>
          <Link href="/my-bookings">
            <Button variant="outline">My Bookings</Button>
          </Link>
          <Button variant="outline">Manage Profile</Button>
          <Button
            variant="ghost"
            onClick={() => logout()}
            className="text-red-400 hover:text-red-300 hover:bg-red-950"
          >
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}
