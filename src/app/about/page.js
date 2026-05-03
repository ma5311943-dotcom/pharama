"use client";

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Users, Trophy, Target, Heart, Sparkles, Star } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const stats = [
  { label: "Active Users", value: "100k+", icon: Users },
  { label: "Expert Doctors", value: "500+", icon: Star },
  { label: "Cities Covered", value: "50+", icon: Target },
  { label: "Years Experience", value: "15+", icon: Trophy },
];

const AboutPage = () => {
  const containerRef = useRef(null);
  const bottleRef = useRef(null);
  const tabletRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {

      gsap.to(bottleRef.current, {
        y: 20,
        rotation: 5,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      gsap.to(bottleRef.current, {
        y: 400,
        x: -50,
        rotate: -20,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1
        }
      });

      gsap.to(tabletRef.current, {
        y: -30,
        rotation: -10,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1
      });

      gsap.to(tabletRef.current, {
        y: 600,
        x: 30,
        rotate: 15,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.5
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-bg-page pt-20 pb-20 overflow-hidden relative">

      {}
      <div
        ref={bottleRef}
        className="fixed top-40 -left-10 w-24 lg:w-32 z-0 opacity-20 pointer-events-none"
      >
        <img src="/assets/brufen.png" alt="" className="w-full h-auto drop-shadow-2xl" />
      </div>

      <div
        ref={tabletRef}
        className="fixed top-[60%] -right-10 w-16 lg:w-24 z-0 opacity-20 pointer-events-none"
      >
        <img src="/assets/tablets.png" alt="" className="w-full h-auto drop-shadow-xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {}
        <div className="grid lg:grid-cols-2 gap-20 items-center mb-32">

          {}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold mb-6">
              <Sparkles className="w-4 h-4" />
              <span>Our Story</span>
            </div>

            <h1 className="text-4xl lg:text-6xl font-extrabold text-text-heading mb-8 leading-tight">
              Revolutionizing <span className="text-primary">Healthcare</span> Access for Everyone.
            </h1>

            <p className="text-lg text-text-body mb-8 font-medium leading-relaxed">
              Founded in 2010, PharmaEase started with a simple vision: making authentic medicine accessible to every household with just a few clicks.
            </p>

            <div className="space-y-4">
              {[
                "100% Authentic Medications",
                "Licensed Pharmacist Consultations",
                "Temperature-Controlled Delivery",
                "Secure Digital Prescriptions"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-text-heading">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            whileInView={{ opacity: 1, scale: 1, rotate: -5 }}
            whileHover={{ rotate: 0, scale: 1.05 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative flex justify-center"
          >
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10 rounded-[2rem] overflow-hidden shadow-2xl border-4 border-border-nav w-[280px] lg:w-[340px]"
            >
              <img
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80"
                alt="Our Expert Team"
                className="w-full h-[350px] lg:h-[400px] object-cover"
              />
            </motion.div>

            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl z-0" />
            <div className="absolute -bottom-10 -left-10 w-52 h-52 bg-secondary/10 rounded-full blur-3xl z-0" />
          </motion.div>

        </div>

        {}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-32">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-bg-card p-10 rounded-[2.5rem] border shadow-soft text-center group hover:shadow-2xl hover:bg-primary transition-all duration-500"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-6 group-hover:bg-bg-card/20 group-hover:text-white">
                <stat.icon className="w-8 h-8" />
              </div>
              <div className="text-4xl font-black text-text-heading mb-2 group-hover:text-white">{stat.value}</div>
              <div className="text-sm font-bold text-text-muted group-hover:text-white/80">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {}
        <div className="text-center mb-20">
          <h2 className="text-4xl font-extrabold text-text-heading mb-4">Values that Drive Us</h2>
          <p className="text-text-muted max-w-xl mx-auto">We prioritize integrity, safety, and care.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: "Patient Care", icon: Heart, color: "bg-red-500" },
            { title: "Safety First", icon: ShieldCheck, color: "bg-blue-500" },
            { title: "Expert Support", icon: Star, color: "bg-yellow-500" },
          ].map((value, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className="p-10 bg-bg-card rounded-[2.5rem] shadow-soft hover:shadow-2xl"
            >
              <div className={`${value.color} w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-8`}>
                <value.icon className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-extrabold mb-4">{value.title}</h3>
              <p className="text-text-muted">High-quality healthcare experience.</p>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default AboutPage;