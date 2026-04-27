"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { ReduxProvider } from "@/redux/Provider";
import { Toaster } from 'react-hot-toast';
import CustomCursor from "@/components/ui/CustomCursor";
import Preloader from "@/components/shared/Preloader";
import SmoothScroll from "@/components/shared/SmoothScroll";
import AIAssistant from "@/components/ui/AIAssistant";
import CartSync from "@/components/shared/CartSync";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');
  const isAuthPage = pathname === '/login' || pathname === '/register';
  const hideShell = isAuthPage;
  const showFooter = !isAdminPage && !isAuthPage;

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col bg-bg-page" suppressHydrationWarning>
        <ReduxProvider>
          <CartSync />
          <CustomCursor />
          <Preloader />
          <Toaster position="top-center" reverseOrder={false} />
          {hideShell ? (
            <main id="main-wrapper" className="h-full">
              {children}
            </main>
          ) : (
            <>
              {isAdminPage ? (
                <>
                  <Navbar />
                  <main id="main-wrapper" className="flex-grow">
                    {children}
                  </main>
                </>
              ) : (
                <SmoothScroll>
                  <Navbar />
                  <main id="main-wrapper" className="flex-grow pt-20">
                    {children}
                  </main>
                  {showFooter && <Footer />}
                  <AIAssistant />
                </SmoothScroll>
              )}
            </>
          )}
        </ReduxProvider>
      </body>
    </html>
  );
}
