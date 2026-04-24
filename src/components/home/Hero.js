"use client";

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { ShoppingBag, Upload, ShieldCheck, Search } from 'lucide-react';
import { useSelector } from 'react-redux';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const Hero = () => {
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === 'admin';
  const heroRef = useRef(null);
  const tabletsRef = useRef([]);
  const contentRef = useRef(null);

  // ✅ FIX: safe random positions (no hydration mismatch)
  const [tabletStyles, setTabletStyles] = React.useState([]);

  useEffect(() => {
    // generate positions ONLY on client
    setTabletStyles(
      Array.from({ length: 6 }).map(() => ({
        top: `${20 + Math.random() * 60}%`,
        left: `${10 + Math.random() * 80}%`,
      }))
    );

    // Floating tablets motion
    tabletsRef.current.forEach((el, i) => {
      if (!el) return;

      gsap.to(el, {
        y: "random(-50, 50)",
        x: "random(-50, 50)",
        rotation: "random(-180, 180)",
        duration: "random(6, 10)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: i * 0.4
      });
    });

    gsap.to(contentRef.current, {
      opacity: 0,
      x: -60,
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "center top",
        scrub: true
      }
    });

  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-[90vh] flex items-center overflow-visible bg-bg-page pt-14 pb-20"
      id="hero-section"
    >

      {/* Floating tablets (FIXED) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {tabletStyles.map((style, i) => (
          <img
            key={i}
            ref={el => tabletsRef.current[i] = el}
            src="/assets/tablets.png"
            alt="Floating Tablet"
            className="absolute w-16 h-16 opacity-40 grayscale-0"
            style={{
              top: style.top,
              left: style.left,
            }}
          />
        ))}
      </div>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto px-6 sm:px-12 lg:px-16 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center text-center lg:text-left">

          <div ref={contentRef} className="flex flex-col items-center lg:items-start">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold mb-5">
                <ShieldCheck className="w-4 h-4" />
                Certified Online Pharmacy
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold text-text-heading leading-[1.05] mb-5">
                Your Health, <br />
                <span className="text-primary">Our Priority.</span>
              </h1>

              <p className="text-sm sm:text-base lg:text-lg text-text-body mb-8 max-w-lg opacity-80 leading-relaxed mx-auto lg:mx-0">
                Experience modern healthcare with PharmaEase. Authentic medicines delivered fast, safe, and reliable.
              </p>

              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                <Link
                  href="/store"
                  className="flex items-center gap-2 bg-primary text-white px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl font-bold text-base sm:text-lg hover:bg-primary-hover transition-all hover:-translate-y-1 active:scale-95 shadow-lg shadow-primary/20"
                >
                  <ShoppingBag className="w-5 h-5" />
                  Store
                </Link>

                <Link
                  href="/search"
                  className="flex items-center gap-2 bg-secondary text-white px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl font-bold text-base sm:text-lg hover:opacity-90 transition-all hover:-translate-y-1 active:scale-95 shadow-lg shadow-secondary/20"
                >
                  <Search className="w-5 h-5" />
                  Search Drugs
                </Link>

                {!isAdmin && (
                  <Link
                    href="/cart"
                    className="flex items-center gap-2 bg-white text-text-heading border border-border-nav px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl font-bold text-base sm:text-lg hover:bg-gray-50 transition-all hover:-translate-y-1 active:scale-95"
                  >
                    <Upload className="w-5 h-5 text-primary" />
                    Check Cart
                  </Link>
                )}
              </div>

            </motion.div>
          </div>

          {/* desktop spacing */}
          <div className="hidden lg:block h-[420px]" />

          {/* mobile fallback */}
          <div className="lg:hidden mt-12 flex justify-center w-full relative">
            <div className="w-full max-w-[220px]">
              <img
                src="/assets/brufen.png"
                alt="Brufen"
                className="w-full h-auto drop-shadow-[0_25px_25px_rgba(255,165,0,0.2)]"
              />
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-primary/10 rounded-full blur-3xl -z-10" />
          </div>

        </div>
      </div>

    </section>
  );
};

export default Hero;