import HeroSection from "@/components/sections/HeroSection";
import FeaturedEvents from "@/components/sections/FeaturedEvents";
import Categories from "@/components/sections/Categories";
import Features from "@/components/sections/Features";
import Testimonials from "@/components/sections/Testimonials";

export default function Home() {
  return (
    <div className="bg-gray-950">
      <HeroSection />
      <FeaturedEvents />
      <Categories />
      <Features />
      <Testimonials />
    </div>
  );
}
