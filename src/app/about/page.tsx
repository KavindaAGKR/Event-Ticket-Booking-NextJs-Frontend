"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  Target,
  Heart,
  Star,
  Calendar,
  Shield,
  Award,
  Globe,
} from "lucide-react";

export default function About() {
  const stats = [
    {
      label: "Events Hosted",
      value: "50K+",
      icon: <Calendar className="h-6 w-6" />,
    },
    {
      label: "Happy Customers",
      value: "1M+",
      icon: <Users className="h-6 w-6" />,
    },
    {
      label: "Cities Covered",
      value: "500+",
      icon: <Globe className="h-6 w-6" />,
    },
    {
      label: "Years of Excellence",
      value: "10+",
      icon: <Award className="h-6 w-6" />,
    },
  ];

  const values = [
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Customer First",
      description:
        "We put our customers at the heart of everything we do, ensuring exceptional experiences from booking to event day.",
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Trust & Security",
      description:
        "Your data and transactions are protected with industry-leading security measures and transparent practices.",
    },
    {
      icon: <Star className="h-8 w-8" />,
      title: "Quality Events",
      description:
        "We carefully curate and verify every event to ensure you get authentic, high-quality experiences.",
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Innovation",
      description:
        "We continuously innovate to make event discovery and booking simpler, faster, and more enjoyable.",
    },
  ];

  const team = [
    {
      name: "Sarah Johnson",
      role: "CEO & Founder",
      description:
        "Former event industry executive with 15 years of experience building memorable experiences.",
      avatar: "SJ",
    },
    {
      name: "Michael Chen",
      role: "CTO",
      description:
        "Tech visionary focused on creating seamless digital experiences for event-goers worldwide.",
      avatar: "MC",
    },
    {
      name: "Emma Rodriguez",
      role: "Head of Operations",
      description:
        "Operations expert ensuring smooth event partnerships and customer satisfaction.",
      avatar: "ER",
    },
    {
      name: "David Kim",
      role: "Head of Marketing",
      description:
        "Creative strategist helping people discover their next favorite event experience.",
      avatar: "DK",
    },
  ];

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-purple-900 via-gray-900 to-indigo-900">
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            About
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {" "}
              myEvents
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            We're passionate about connecting people with unforgettable
            experiences. From intimate gatherings to massive festivals, we make
            event discovery and booking effortless.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card
                key={index}
                className="bg-gray-800/50 border-gray-700 text-center"
              >
                <CardContent className="p-6">
                  <div className="text-purple-400 flex justify-center mb-3">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Our Mission</h2>
            <p className="text-xl text-gray-300 leading-relaxed mb-8">
              To democratize event discovery and make extraordinary experiences
              accessible to everyone. We believe that great events have the
              power to bring people together, create lasting memories, and
              enrich lives in meaningful ways.
            </p>
            <div className="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 rounded-2xl p-8 backdrop-blur-sm border border-purple-500/20">
              <blockquote className="text-2xl font-medium text-gray-200 italic">
                "Every event is an opportunity to create magic. We're here to
                make sure you never miss yours."
              </blockquote>
              <cite className="text-purple-400 mt-4 block">
                - myEvents Team
              </cite>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Our Values</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              These core principles guide everything we do and every decision we
              make
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <Card
                key={index}
                className="bg-gray-800/30 border-gray-700 hover:bg-gray-800/50 transition-all duration-300"
              >
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white">
                      {value.icon}
                    </div>
                    <CardTitle className="text-xl text-white">
                      {value.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12">Our Story</h2>

            <div className="space-y-8">
              <Card className="bg-gray-800/30 border-gray-700">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-white mb-4">
                    The Beginning (2015)
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    myEvents was born from a simple frustration: finding and
                    booking great events was unnecessarily complicated. Our
                    founders, Sarah and Michael, experienced this firsthand
                    while trying to discover local concerts and festivals. They
                    envisioned a platform that would make event discovery as
                    exciting as the events themselves.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/30 border-gray-700">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Growth & Evolution (2016-2020)
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    What started as a local event discovery tool quickly grew
                    into a comprehensive platform. We expanded from 5 cities to
                    500+, partnered with major venues and promoters, and
                    introduced features like group booking, mobile tickets, and
                    personalized recommendations. Our community of event-lovers
                    grew to over 1 million users.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/30 border-gray-700">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Innovation & Future (2021-Present)
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    Today, myEvents is at the forefront of event technology.
                    We're continuously innovating with AI-powered
                    recommendations, virtual event experiences, and seamless
                    integration with social platforms. Our mission remains the
                    same: making it effortless for people to discover and attend
                    events that matter to them.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-900/50 to-indigo-900/50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Discover Amazing Events?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join our community of event enthusiasts and never miss out on
            incredible experiences again.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="px-8"
              onClick={() => {
                /* Handle browse events */
              }}
            >
              Browse Events
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="px-8"
              onClick={() => {
                /* Handle contact */
              }}
            >
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
