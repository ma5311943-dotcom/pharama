"use client";

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Pill } from 'lucide-react';

const Preloader = () => {
  const containerRef = useRef(null);
  const logoRef = useRef(null);
  const panelsRef = useRef([]);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // Lock scroll while loading
    document.body.style.overflow = 'hidden';

    const tl = gsap.timeline({
      onComplete: () => {
        setIsDone(true);
        document.body.style.overflow = 'auto';
      }
    });

    // 1. Initial State
    gsap.set(panelsRef.current, { scaleY: 1 });
    gsap.set(logoRef.current, { opacity: 0, scale: 0.8, filter: "blur(10px)" });

    // 2. Animation Sequence
    tl.to(logoRef.current, {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      duration: 1,
      ease: "power4.out"
    })
      .to(logoRef.current, {
        y: -40,
        opacity: 0,
        filter: "blur(20px)",
        duration: 0.8,
        ease: "power2.in",
        delay: 0.3
      })
      .to(panelsRef.current, {
        scaleY: 0,
        skewY: 2,
        duration: 1.2,
        stagger: {
          amount: 0.5,
          from: "center"
        },
        ease: "expo.inOut"
      }, "-=0.4");

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  if (isDone) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-auto"
    >
      {/* 5-Panel Shutter Background */}
      <div className="absolute inset-0 flex">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            ref={(el) => (panelsRef.current[i] = el)}
            className="flex-1 bg-[#1B2A3B] origin-top border-x border-white/5"
          />
        ))}
      </div>

      {/* Center Logo Content */}
      <div ref={logoRef} className="relative z-10 flex flex-col items-center gap-4">
        <div className="p-5 bg-primary rounded-3xl shadow-[0_0_50px_rgba(var(--color-primary-rgb),0.3)]">
          <Pill className="w-16 h-16 text-white" />
        </div>
        <h2 className="text-white text-4xl font-black tracking-[0.2em] uppercase">
          Pharma<span className="text-primary">Ease</span>
        </h2>
        <div className="w-12 h-[2px] bg-primary/50 mt-2" />
      </div>
    </div>
  );
};

export default Preloader;
