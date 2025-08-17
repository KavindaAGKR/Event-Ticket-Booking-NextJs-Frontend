"use client";

import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  Apple,
  Play,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-950 border-t border-gray-800">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
                <span className="text-white font-bold">M</span>
              </div>
              <span className="text-xl font-bold text-white">myEvents</span>
            </div>

            <p className="text-gray-400 mb-4 leading-relaxed">
              Your premier destination for discovering and booking amazing
              events. From concerts to conferences, we've got you covered.
            </p>

            <div className="flex space-x-4">
              <button
                className="p-2 bg-gray-800 rounded-full hover:bg-purple-600 transition-colors"
                onClick={() => {
                  /* Handle Facebook */
                }}
              >
                <Facebook className="h-5 w-5 text-white" />
              </button>
              <button
                className="p-2 bg-gray-800 rounded-full hover:bg-purple-600 transition-colors"
                onClick={() => {
                  /* Handle Twitter */
                }}
              >
                <Twitter className="h-5 w-5 text-white" />
              </button>
              <button
                className="p-2 bg-gray-800 rounded-full hover:bg-purple-600 transition-colors"
                onClick={() => {
                  /* Handle Instagram */
                }}
              >
                <Instagram className="h-5 w-5 text-white" />
              </button>
              <button
                className="p-2 bg-gray-800 rounded-full hover:bg-purple-600 transition-colors"
                onClick={() => {
                  /* Handle YouTube */
                }}
              >
                <Youtube className="h-5 w-5 text-white" />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/events"
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  Browse Events
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  href="/venues"
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  Venues
                </Link>
              </li>
              <li>
                <Link
                  href="/organizers"
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  For Organizers
                </Link>
              </li>
              <li>
                <Link
                  href="/gift-cards"
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  Gift Cards
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/help"
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/refunds"
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/safety"
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  Safety Guidelines
                </Link>
              </li>
              <li>
                <Link
                  href="/accessibility"
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  Accessibility
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Apps */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">
              Get in Touch
            </h4>
            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-3 text-gray-400">
                <Mail className="h-4 w-4" />
                <span>support@myevents.com</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <Phone className="h-4 w-4" />
                <span>+94 756 456 123</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <MapPin className="h-4 w-4" />
                <span>Colombo, Sri Lanka</span>
              </div>
            </div>

            <div>
              <h5 className="text-white font-semibold mb-3">
                Download Our App
              </h5>
              <div className="space-y-2">
                <button
                  className="flex items-center space-x-2 bg-gray-800 rounded-lg px-4 py-2 hover:bg-gray-700 transition-colors w-full"
                  onClick={() => {
                    /* Handle App Store */
                  }}
                >
                  <Apple className="h-5 w-5 text-white" />
                  <div className="text-left">
                    <div className="text-xs text-gray-400">Download on the</div>
                    <div className="text-sm text-white font-semibold">
                      App Store
                    </div>
                  </div>
                </button>

                <button
                  className="flex items-center space-x-2 bg-gray-800 rounded-lg px-4 py-2 hover:bg-gray-700 transition-colors w-full"
                  onClick={() => {
                    /* Handle Google Play */
                  }}
                >
                  <Play className="h-5 w-5 text-white" />
                  <div className="text-left">
                    <div className="text-xs text-gray-400">Get it on</div>
                    <div className="text-sm text-white font-semibold">
                      Google Play
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © 2025 myEvents. All rights reserved.
            </div>

            <div className="flex space-x-6 text-sm">
              <Link
                href="/privacy"
                className="text-gray-400 hover:text-purple-400 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-gray-400 hover:text-purple-400 transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="/cookies"
                className="text-gray-400 hover:text-purple-400 transition-colors"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
