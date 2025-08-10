"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Music,
  Theater,
  Users,
  Trophy,
  Utensils,
  Mic,
  Calendar,
  Camera,
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  count: number;
  color: string;
}

export default function Categories() {
  const categories: Category[] = [
    {
      id: "music",
      name: "Music & Concerts",
      icon: <Music className="h-8 w-8" />,
      count: 15420,
      color: "from-pink-500 to-purple-600",
    },
    {
      id: "sports",
      name: "Sports",
      icon: <Trophy className="h-8 w-8" />,
      count: 8730,
      color: "from-green-500 to-teal-600",
    },
    {
      id: "theater",
      name: "Theater & Arts",
      icon: <Theater className="h-8 w-8" />,
      count: 5240,
      color: "from-red-500 to-orange-600",
    },
    {
      id: "conferences",
      name: "Conferences",
      icon: <Users className="h-8 w-8" />,
      count: 3680,
      color: "from-blue-500 to-indigo-600",
    },
    {
      id: "food",
      name: "Food & Drink",
      icon: <Utensils className="h-8 w-8" />,
      count: 2190,
      color: "from-yellow-500 to-orange-500",
    },
    {
      id: "comedy",
      name: "Comedy",
      icon: <Mic className="h-8 w-8" />,
      count: 1560,
      color: "from-purple-500 to-pink-500",
    },
    {
      id: "festivals",
      name: "Festivals",
      icon: <Calendar className="h-8 w-8" />,
      count: 4320,
      color: "from-teal-500 to-cyan-600",
    },
    {
      id: "exhibitions",
      name: "Exhibitions",
      icon: <Camera className="h-8 w-8" />,
      count: 890,
      color: "from-gray-500 to-slate-600",
    },
  ];

  return (
    <section className="py-16 bg-gray-950">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Browse by Category
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Find events that match your interests from our diverse range of
            categories
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Card
              key={category.id}
              className="group cursor-pointer hover:scale-105 transition-all duration-300 bg-gray-800/30 border-gray-700 hover:border-purple-500"
              onClick={() => {
                /* Handle category selection */
              }}
            >
              <CardContent className="p-6 text-center">
                <div
                  className={`inline-flex p-4 rounded-full bg-gradient-to-r ${category.color} mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <div className="text-white">{category.icon}</div>
                </div>

                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-400 transition-colors">
                  {category.name}
                </h3>

                <p className="text-gray-400 text-sm">
                  {category.count.toLocaleString()} events
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-400 mb-4">
            Can't find what you're looking for?
          </p>
          <button
            className="text-purple-400 hover:text-purple-300 font-semibold underline underline-offset-4"
            onClick={() => {
              /* Handle view all categories */
            }}
          >
            View All Categories
          </button>
        </div>
      </div>
    </section>
  );
}
