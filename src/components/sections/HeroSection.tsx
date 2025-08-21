"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Calendar } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-blue-900 via-gray-900 to-indigo-900">
      <div className="absolute inset-0 bg-black/30" />

      <div className="absolute inset-0 opacity-10">
        <div className="h-full w-full bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Discover Amazing
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              {" "}
              Events
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Find and book tickets for concerts, festivals, sports, theater, and
            more. Your next unforgettable experience is just a click away.
          </p>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 max-w-4xl mx-auto mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search events, artists, venues..."
                    className="pl-10 h-12 text-base bg-gray-800/50 border-gray-600"
                    onChange={() => {}}
                  />
                </div>
              </div>

              <div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Location"
                    className="pl-10 h-12 text-base bg-gray-800/50 border-gray-600"
                    onChange={() => {}}
                  />
                </div>
              </div>

              <div>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="date"
                    className="pl-10 h-12 text-base bg-gray-800/50 border-gray-600"
                    onChange={() => {}}
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-center">
              <Button
                size="lg"
                className="px-8 h-12 text-base font-semibold"
                onClick={() => {
                  window.location.href = `/events`;
                }}
              >
                Find Events
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">50K+</div>
              <div className="text-gray-400">Events</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">1M+</div>
              <div className="text-gray-400">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">500+</div>
              <div className="text-gray-400">Cities</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">99%</div>
              <div className="text-gray-400">Satisfaction</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
