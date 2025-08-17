import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  comment: string;
  event: string;
  location: string;
}

export default function Testimonials() {
  const testimonials: Testimonial[] = [
    {
      id: "1",
      name: "Sarah Johnson",
      avatar: "SJ",
      rating: 5,
      comment:
        "Amazing experience! The booking process was so smooth and the event was incredible. myEvents made everything so easy.",
      event: "Summer Music Festival",
      location: "New York",
    },
    {
      id: "2",
      name: "Michael Chen",
      avatar: "MC",
      rating: 5,
      comment:
        "I've used many ticketing platforms, but myEvents is by far the best. Great prices and excellent customer service.",
      event: "Tech Conference 2024",
      location: "San Francisco",
    },
    {
      id: "3",
      name: "Emma Rodriguez",
      avatar: "ER",
      rating: 5,
      comment:
        "The mobile app is fantastic! I could easily access my tickets and the QR codes worked perfectly at the venue.",
      event: "Broadway Show",
      location: "New York",
    },
    {
      id: "4",
      name: "David Kim",
      avatar: "DK",
      rating: 5,
      comment:
        "myEvents helped me discover amazing local events I never knew about. The recommendation system is spot on!",
      event: "Food Festival",
      location: "Los Angeles",
    },
    {
      id: "5",
      name: "Lisa Thompson",
      avatar: "LT",
      rating: 5,
      comment:
        "Booking group tickets was a breeze. The platform handled everything perfectly for our company event.",
      event: "Sports Game",
      location: "Chicago",
    },
    {
      id: "6",
      name: "James Wilson",
      avatar: "JW",
      rating: 5,
      comment:
        "Last-minute ticket purchase was stress-free. Got great seats at a reasonable price. Highly recommended!",
      event: "Comedy Show",
      location: "Boston",
    },
  ];

  return (
    <section className="py-16 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            What Our Customers Say
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Join millions of happy customers who trust myEvents for their event
            booking needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card
              key={testimonial.id}
              className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300"
            >
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold mr-3">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">
                      {testimonial.name}
                    </h4>
                    <div className="flex items-center space-x-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 text-yellow-400 fill-current"
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <Quote className="h-8 w-8 text-purple-400 opacity-50 absolute -top-2 -left-2" />
                  <p className="text-gray-300 leading-relaxed pl-6">
                    {testimonial.comment}
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-700">
                  <p className="text-sm text-gray-400">
                    <span className="font-medium text-purple-400">
                      {testimonial.event}
                    </span>
                    {" • "}
                    {testimonial.location}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8">
            <div className="flex items-center space-x-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <span className="text-white font-semibold">4.9/5</span>
            </div>

            <div className="text-gray-400">
              Based on <span className="text-white font-semibold">50,000+</span>{" "}
              reviews
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
