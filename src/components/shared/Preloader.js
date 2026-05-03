"use client";

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Pill } from 'lucide-react';

const Preloader = () => {
  const containerRef = useRef(null);
  const pillRef = useRef(null);
  const textRef = useRef(null);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {

    document.body.style.overflow = 'hidden';

    const tl = gsap.timeline({
      onComplete: () => {
        setIsDone(true);
        document.body.style.overflow = 'auto';
      }
    });

    gsap.set(pillRef.current, { y: -200, rotation: -180, scale: 0.5, opacity: 0 });
    gsap.set(textRef.current, { y: 100, opacity: 0 });
    gsap.set(containerRef.current, { clipPath: 'circle(150% at 50% 50%)' });

    tl.to(pillRef.current, {
      y: 0,
      rotation: 0,
      scale: 1.2,
      opacity: 1,
      duration: 1.2,
      ease: "bounce.out"
    })

    .to(textRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power4.out"
    }, "-=0.6")

    .to({}, { duration: 0.6 })

    .to([pillRef.current, textRef.current], {
      scale: 0,
      opacity: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: "back.in(1.7)"
    })

    .to(containerRef.current, {
      clipPath: "circle(0% at 50% 50%)",
      duration: 1.2,
      ease: "expo.inOut"
    });

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  if (isDone) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-bg-page pointer-events-auto"
    >
      <div className="relative z-10 flex flex-col items-center gap-6">
        
        {}
        <div ref={pillRef} className="p-5 bg-primary/10 rounded-3xl border border-primary/20 shadow-[0_0_50px_rgba(0,168,232,0.3)]">
          <Pill className="w-16 h-16 text-primary" />
        </div>

        {}
        <div className="overflow-hidden">
          <h2 ref={textRef} className="text-text-heading text-4xl sm:text-5xl font-black tracking-[0.2em] uppercase">
            Pharma<span className="text-primary">Ease</span>
          </h2>
        </div>

      </div>
    </div>
  );
};

export default Preloader;
