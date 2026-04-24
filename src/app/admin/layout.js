"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { Pill, Menu } from 'lucide-react';
import Sidebar from "@/components/admin/Sidebar";
import { gsap } from 'gsap';

export default function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const mainRef = useRef(null);
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else if (user.role !== 'admin') {
      router.push('/');
    }
  }, [user, router]);

  useEffect(() => {
    if (user && user.role === 'admin') {
      gsap.fromTo(mainRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power4.out" }
      );
    }
  }, [user]);

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-bg-page pt-20">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="flex-grow flex flex-col min-w-0 relative lg:pl-64">
        {/* Mobile Sidebar Toggle - Top Left */}
        {!isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden fixed top-24 left-4 z-[40] bg-white border border-border-nav text-text-heading p-2.5 rounded-xl shadow-lg hover:bg-gray-50 active:scale-95 transition-all flex items-center gap-2"
          >
            <Menu className="w-5 h-5 text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-tight">Admin Menu</span>
          </button>
        )}

        <main
          ref={mainRef}
          className="flex-grow p-4 md:p-6 lg:p-8 pt-20 lg:pt-8 w-full relative"
        >
          <div className="max-w-[1440px] mx-auto pb-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
