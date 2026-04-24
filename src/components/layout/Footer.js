"use client";

import React from 'react';
import Link from 'next/link';
import { Pill, Mail, Phone, MapPin, Globe, Share2, MessageCircle, Send, Info } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#1B2A3B] text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-10">

          {/* BRAND */}
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-primary p-2 rounded-xl">
                <Pill className="text-white w-6 h-6" />
              </div>

              <span className="text-xl font-semibold tracking-tight">
                Pharma<span className="text-primary">Ease</span>
              </span>
            </div>

            <p className="text-gray-300 mb-4 leading-snug">
              Your most trusted online pharmacy partner. Providing quality medicines and healthcare products with professional care.
            </p>

            <div className="flex space-x-3">
              {[Globe, Share2, MessageCircle, Info].map((Icon, i) => (
                <Link key={i} href="#" className="p-2 bg-white/5 rounded-lg hover:bg-primary transition-colors">
                  <Icon className="w-4 h-4 text-gray-200" />
                </Link>
              ))}
            </div>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h4 className="text-base text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="/store" className="hover:text-primary">Medical Store</Link></li>
              <li><Link href="/explore" className="hover:text-primary">Explore Drugs</Link></li>
              <li><Link href="/about" className="hover:text-primary">About Company</Link></li>
              <li><Link href="/contact" className="hover:text-primary">Contact Support</Link></li>
              <li><Link href="/privacy" className="hover:text-primary">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* CUSTOMER SERVICE */}
          <div>
            <h4 className="text-base text-white font-semibold mb-4">Customer Service</h4>

            <ul className="space-y-3 text-gray-300">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                <span>+1 (234) 567-890</span>
              </li>

              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                <span>support@pharmaease.com</span>
              </li>

              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary mt-1" />
                <span>123 Health Ave, Medical District, NY 10001</span>
              </li>
            </ul>
          </div>

          {/* NEWSLETTER */}
          <div className="col-span-2 lg:col-span-1">
            <h4 className="text-base text-white font-semibold mb-4">Newsletter</h4>

            <p className="text-gray-300 mb-3">
              Subscribe to get updates on health tips and offers.
            </p>

            <div className="relative">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white placeholder:text-gray-400 focus:outline-none focus:border-primary"
              />

              <button className="absolute right-2 top-1.5 p-2 bg-primary text-white rounded-lg hover:bg-primary-hover">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* BOTTOM */}
        <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-3 text-gray-400 text-xs">
          <p>© 2026 PharmaEase. All rights reserved.</p>

          <div className="flex gap-4">
            <Link href="#" className="hover:text-white">Terms of Service</Link>
            <Link href="#" className="hover:text-white">Cookie Policy</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;