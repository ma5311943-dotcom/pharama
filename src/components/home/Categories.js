"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Pill,
  Baby,
  HeartPulse,
  Sparkles,
  Stethoscope,
  Thermometer,
  ChevronRight
} from 'lucide-react';

const categories = [
  {
    name: "Prescription",
    count: "450+ Items",
    icon: Pill,
    color: "bg-blue-500",
    href: "/store"
  },
  {
    name: "OTC Medicines",
    count: "320+ Items",
    icon: Thermometer,
    color: "bg-green-500",
    href: "/store"
  },
  {
    name: "Baby Care",
    count: "180+ Items",
    icon: Baby,
    color: "bg-pink-500",
    href: "/store"
  },
  {
    name: "Health Devices",
    count: "120+ Items",
    icon: Stethoscope,
    color: "bg-purple-500",
    href: "/store"
  },
  {
    name: "Personal Care",
    count: "240+ Items",
    icon: Sparkles,
    color: "bg-orange-500",
    href: "/store"
  },
  {
    name: "Supplements",
    count: "210+ Items",
    icon: HeartPulse,
    color: "bg-red-500",
    href: "/store"
  }
];

const Categories = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-text-heading mb-4">
              Shop by <span className="text-primary">Category</span>
            </h2>
            <p className="text-text-muted max-w-xl">
              Find everything you need from our wide selection of healthcare products, organized for your convenience.
            </p>
          </div>
          <Link
            href="/store"
            className="group flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all cursor-pointer"
          >
            <span>View All Categories</span>
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={cat.href}
                className="group relative flex items-center gap-5 p-6 rounded-2xl bg-bg-page border border-transparent hover:border-primary/20 hover:bg-white hover:shadow-xl transition-all cursor-pointer overflow-hidden"
              >
                <div className={`${cat.color} p-4 rounded-xl text-white group-hover:scale-110 transition-transform duration-300`}>
                  <cat.icon className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-bold text-text-heading text-lg mb-1 group-hover:text-primary transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-sm text-text-muted">{cat.count}</p>
                </div>
                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronRight className="w-5 h-5 text-primary" />
                </div>
                <div className="absolute top-0 right-0 p-8 bg-primary/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500 pointer-events-none" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
