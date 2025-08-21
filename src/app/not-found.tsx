"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Search, Sparkles } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-gray-900 to-indigo-900/20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />

      <div className="relative z-10 container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-screen">
        <div className="text-center mb-12 max-w-2xl">
          <div className="mb-8 relative">
            <div className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 bg-clip-text text-transparent">
              404
            </div>
            <div className="absolute -top-4 -right-4 animate-bounce">
              <Sparkles className="h-8 w-8 text-yellow-400" />
            </div>
            <div className="absolute -bottom-2 -left-4 animate-pulse">
              <Sparkles className="h-6 w-6 text-cyan-400" />
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Oops! No page found
          </h1>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Home className="w-5 h-5 mr-2" />
                Back to Home
              </Button>
            </Link>

            <Link href="/events">
              <Button
                size="lg"
                variant="outline"
                className="border-blue-500 text-blue-400 hover:bg-blue-500/10"
              >
                <Search className="w-5 h-5 mr-2" />
                Browse Events
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-gray-950 to-transparent pointer-events-none" />
    </div>
  );
}
