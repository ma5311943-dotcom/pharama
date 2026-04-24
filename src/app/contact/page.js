"use client";

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  MessageSquare, 
  Clock, 
  ChevronLeft, 
  HeartPulse, 
  Activity, 
  Stethoscope, 
  Pill,
  ShieldCheck
} from 'lucide-react';

const floatingIcons = [
  { Icon: Pill, top: '10%', left: '5%', size: 24, delay: 0 },
  { Icon: HeartPulse, top: '22%', left: '90%', size: 28, delay: 1 },
  { Icon: Stethoscope, top: '65%', left: '7%', size: 22, delay: 0.7 },
  { Icon: Activity, top: '80%', left: '87%', size: 26, delay: 2 },
  { Icon: Pill, top: '50%', left: '93%', size: 18, delay: 0.4 },
];

export default function ContactPage() {
  const iconRefs = useRef([]);
  const coreRef = useRef(null);

  useEffect(() => {
    // Pulse the core orb
    gsap.to(coreRef.current, {
      scale: 1.15,
      opacity: 0.7,
      duration: 1.8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    // Floating background icons
    iconRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.to(el, {
        y: "random(-20, 20)",
        x: "random(-12, 12)",
        rotation: "random(-25, 25)",
        duration: "random(2.5, 5)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: floatingIcons[i]?.delay || 0,
      });
    });
  }, []);

    const handleSubmit = (e) => {
      e.preventDefault();
      import('react-hot-toast').then(({ toast }) => {
        toast.success('Message sent! We will get back to you shortly.');
      });
      e.target.reset();
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-[#EEF5FF] via-[#F5FFFE] to-[#EEF5FF] flex items-center justify-center p-5 relative overflow-hidden">
        
        {/* Ambient light blobs */}
        <div className="absolute top-[-12%] left-[-8%] w-[380px] h-[380px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-12%] right-[-8%] w-[420px] h-[420px] bg-secondary/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Floating icons */}
        {floatingIcons.map(({ Icon, top, left, size }, i) => (
          <div key={i} ref={el => iconRefs.current[i] = el} className="absolute text-primary/35 pointer-events-none" style={{ top, left }}>
            <Icon size={size} strokeWidth={1.5} />
          </div>
        ))}

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="w-full max-w-[950px] bg-white/70 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_20px_70px_-15px_rgba(0,119,182,0.12)] border border-white/80 flex flex-col lg:flex-row overflow-hidden"
        >
          
          {/* Left visual (Info Panel) */}
          <div className="flex flex-col bg-gradient-to-br from-primary/5 via-white/30 to-secondary/5 p-8 md:p-10 border-b lg:border-b-0 lg:border-r border-white/50 lg:w-[38%] relative overflow-hidden">
            
            <div className="mb-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[9px] font-bold mb-4 uppercase tracking-widest">
                <ShieldCheck className="w-3 h-3" />
                24/7 Medical Support
              </div>
              <h2 className="text-[24px] font-bold text-text-heading leading-tight mb-3">
                Let's <span className="text-primary">Connect</span>
              </h2>
              <p className="text-[12px] text-text-muted leading-relaxed opacity-80">
                Expert pharmacological advice just a message away.
              </p>
            </div>

            <div className="space-y-5">
              {[
                { icon: Phone, title: "Call Us", val: "+1 (234) 567-890", sub: "Available 24/7" },
                { icon: Mail, title: "Email Us", val: "support@pharmaease.com", sub: "2hr response time" },
                { icon: Clock, title: "Our Hours", val: "Mon-Sun: 24 Hours", sub: "Emergency care" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 group">
                  <div className="w-9 h-9 rounded-xl bg-white border border-white shadow-sm flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <item.icon className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-[9px] text-text-muted uppercase tracking-widest mb-0.5">{item.title}</h4>
                    <p className="text-[13px] font-bold text-text-heading">{item.val}</p>
                    <p className="text-[10px] text-text-muted opacity-60">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-auto pt-8 flex flex-col items-center lg:items-start">
              <div ref={coreRef} className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <p className="text-[9px] font-medium text-text-muted uppercase tracking-[0.2em]">Certified Pharmacy Care</p>
            </div>
          </div>

          {/* Right form */}
          <div className="flex-1 flex flex-col justify-center p-8 md:p-10">
            <div className="max-w-[400px] mx-auto w-full">
              <div className="mb-7">
                <h1 className="text-[24px] font-semibold text-text-heading mb-1 tracking-tight text-center lg:text-left">Send Message</h1>
                <p className="text-[10px] text-text-muted uppercase tracking-widest text-center lg:text-left">
                  We'll get back to you shortly
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[9px] text-text-muted uppercase tracking-widest mb-1.5 ml-1 font-bold">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="John Doe"
                      className="w-full bg-gray-50/80 border border-gray-100 rounded-xl px-4 py-2.5 text-[12px] focus:outline-none focus:border-primary focus:bg-white transition-all font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] text-text-muted uppercase tracking-widest mb-1.5 ml-1 font-bold">Email</label>
                    <input
                      type="email"
                      required
                      placeholder="name@email.com"
                      className="w-full bg-gray-50/80 border border-gray-100 rounded-xl px-4 py-2.5 text-[12px] focus:outline-none focus:border-primary focus:bg-white transition-all font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] text-text-muted uppercase tracking-widest mb-1.5 ml-1 font-bold">Subject</label>
                  <input
                    type="text"
                    required
                    placeholder="How can we help?"
                    className="w-full bg-gray-50/80 border border-gray-100 rounded-xl px-4 py-2.5 text-[12px] focus:outline-none focus:border-primary focus:bg-white transition-all font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[9px] text-text-muted uppercase tracking-widest mb-1.5 ml-1 font-bold">Message</label>
                  <textarea
                    rows="3"
                    required
                    placeholder="Your message here..."
                    className="w-full bg-gray-50/80 border border-gray-100 rounded-xl px-4 py-2.5 text-[12px] focus:outline-none focus:border-primary focus:bg-white transition-all font-medium resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary text-white py-3.5 rounded-xl font-bold text-[13px] hover:bg-primary-hover transition-all shadow-lg shadow-primary/15 flex items-center justify-center gap-3 mt-3 active:scale-95 cursor-pointer"
                >
                  Send Message
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>

            <p className="mt-8 text-center text-[10px] text-text-muted max-w-[300px] mx-auto opacity-70">
              By sending this message, you agree to our <span className="text-primary font-bold hover:underline cursor-pointer">Privacy Policy</span>.
            </p>
          </div>
        </div>
      </motion.div>

      <Link href="/" className="absolute font-medium bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 text-text-muted hover:text-primary transition-colors text-[11px] uppercase tracking-widest group">
        <ChevronLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
        Back to Pharmacy
      </Link>
    </div>
  );
}
