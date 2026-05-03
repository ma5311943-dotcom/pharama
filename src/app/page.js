"use client";

import React, { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

const Hero = dynamic(() => import("@/components/home/Hero"), { ssr: true });
const Categories = dynamic(() => import("@/components/home/Categories"), { ssr: true });
const FeaturedProducts = dynamic(() => import("@/components/home/FeaturedProducts"), { ssr: true });
const ProductIngredients = dynamic(() => import("@/components/home/ProductIngredients"));
const QualityHighlight = dynamic(() => import("@/components/home/QualityHighlight"));
const PriceCard = dynamic(() => import("@/components/home/PriceCard"));
const Team = dynamic(() => import("@/components/home/Team"));
const NearbyPharmacy = dynamic(() => import("@/components/home/NearbyPharmacy"), { ssr: false });
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  const containerRef = useRef(null);
  const bottleRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.5,
        }
      });

      gsap.set(bottleRef.current, { xPercent: -50, yPercent: -50 });

      tl.to(bottleRef.current, {
        top: "140%",
        left: "20%",
        rotate: 15,
        scale: 0.7,
        ease: "power2.inOut"
      });

      tl.to(bottleRef.current, {
        top: "235%",
        left: "80%",
        rotate: -20,
        scale: 1.1,
        ease: "power2.inOut"
      });

      tl.to(bottleRef.current, {
        top: "340%",
        left: "25%",
        rotate: 10,
        scale: 0.9,
        ease: "power2.inOut"
      });

      tl.to(bottleRef.current, {
        top: "475%",
        left: "50%",
        rotate: 360,
        scale: 1.5,
        ease: "power2.inOut"
      });

      tl.to(bottleRef.current, {
        top: "585%",
        left: "28%",
        rotate: 5,
        scale: 1.2,
        ease: "power2.inOut"
      });

      gsap.to(bottleRef.current, {
        y: -15,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={containerRef} className="relative">
      {}
      <div
        ref={bottleRef}
        className="fixed top-1/2 left-[75%] -translate-x-1/2 -translate-y-1/2 w-[280px] lg:w-[350px] z-[100] pointer-events-none hidden lg:block"
      >
        <img
          src="/assets/brufen.png"
          alt="Brufen Bottle"
          className="w-full h-auto drop-shadow-[0_30px_40px_rgba(255,140,0,0.5)] drop-shadow-[0_0_60px_rgba(255,165,0,0.3)] contrast-[1.1]"
        />
      </div>
      <Hero />
      <Team />
      <NearbyPharmacy />
      <Categories />
      <FeaturedProducts />
      <ProductIngredients />
      <QualityHighlight />
      <PriceCard />

    </main>
  );
}
