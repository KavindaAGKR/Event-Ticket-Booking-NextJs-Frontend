"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Shield,
  CreditCard,
  Clock,
  Headphones,
  Smartphone,
  Users,
  Zap,
  Star,
} from "lucide-react";

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

export default function Features() {
  const features: Feature[] = [
    {
      id: "secure",
      title: "Secure Booking",
      description:
        "Your payments and personal information are protected with bank-level security encryption.",
      icon: <Shield className="h-6 w-6" />,
      color: "from-green-500 to-emerald-600",
    },
    {
      id: "instant",
      title: "Instant Delivery",
      description:
        "Get your tickets instantly via email and mobile app. No waiting, no hassle.",
      icon: <Zap className="h-6 w-6" />,
      color: "from-yellow-500 to-orange-600",
    },
    {
      id: "support",
      title: "24/7 Support",
      description:
        "Our dedicated support team is here to help you anytime, anywhere.",
      icon: <Headphones className="h-6 w-6" />,
      color: "from-blue-500 to-indigo-600",
    },
    {
      id: "mobile",
      title: "Mobile Ready",
      description:
        "Access your tickets on any device. Our mobile app makes event entry seamless.",
      icon: <Smartphone className="h-6 w-6" />,
      color: "from-purple-500 to-pink-600",
    },
    {
      id: "payment",
      title: "Flexible Payment",
      description:
        "Multiple payment options including credit cards, PayPal, and digital wallets.",
      icon: <CreditCard className="h-6 w-6" />,
      color: "from-teal-500 to-cyan-600",
    },
    {
      id: "group",
      title: "Group Booking",
      description:
        "Special discounts and easy management for group bookings and corporate events.",
      icon: <Users className="h-6 w-6" />,
      color: "from-red-500 to-rose-600",
    },
    {
      id: "refund",
      title: "Easy Refunds",
      description:
        "Hassle-free refund policy with quick processing for eligible events.",
      icon: <Clock className="h-6 w-6" />,
      color: "from-gray-500 to-slate-600",
    },
    {
      id: "verified",
      title: "Verified Events",
      description:
        "All events are verified and authenticated to ensure you get legitimate tickets.",
      icon: <Star className="h-6 w-6" />,
      color: "from-amber-500 to-yellow-600",
    },
  ];

  return (
    <section className="py-16 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Why Choose myEvents?
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            We're committed to providing the best event booking experience with
            features designed around your needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <Card
              key={feature.id}
              className="bg-gray-800/30 border-gray-700 hover:bg-gray-800/50 transition-all duration-300 group"
            >
              <CardContent className="p-6 text-center">
                <div
                  className={`inline-flex p-3 rounded-full bg-gradient-to-r ${feature.color} mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <div className="text-white">{feature.icon}</div>
                </div>

                <h3 className="text-lg font-semibold text-white mb-3">
                  {feature.title}
                </h3>

                <p className="text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-r from-purple-900/50 to-indigo-900/50 rounded-2xl p-8 backdrop-blur-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                99.9%
              </div>
              <div className="text-gray-400">Uptime</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                &lt;2s
              </div>
              <div className="text-gray-400">Average Load Time</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                256-bit
              </div>
              <div className="text-gray-400">SSL Encryption</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                24/7
              </div>
              <div className="text-gray-400">Monitoring</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
