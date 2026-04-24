"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Star, Clock, Truck, ShieldCheck } from 'lucide-react';
import { useSelector } from 'react-redux';

const PriceCard = () => {
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === 'admin';
  return (
    <section id="cta-section" className="relative py-16 lg:py-24 flex items-center bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

        {/* Left Side: Product Display */}
        <div className="relative h-[350px] lg:h-[500px] bg-bg-page rounded-[3rem] border border-border-nav/50 shadow-inner flex items-center justify-center overflow-hidden group">
          {/* Decorative Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-50" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 rounded-full blur-[80px]" />

          {/* Product Image with Fast Infinite Movement */}
          <motion.div
            animate={{
              y: [0, -60, 0],
              rotateY: [0, 360],
              rotateZ: [0, 10, -10, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear"
            }}
            className="relative z-10 w-full max-w-[260px] lg:max-w-[360px] drop-shadow-[0_20px_50px_rgba(0,119,182,0.4)]"
          >
            <img
              src="/assets/brufen.png"
              alt="Brufen Preview"
              className="w-full h-auto"
            />
          </motion.div>

          {/* Brand Watermark */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-0">
            <span className="text-primary font-black text-6xl opacity-[0.03] select-none uppercase tracking-tighter">PharmaEase</span>
          </div>
        </div>

        {/* Right Side: Compact Info */}
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-secondary text-secondary" />
                ))}
              </div>
              <span className="text-[11px] font-bold text-text-muted uppercase tracking-widest">(4.9/5 TrustScore)</span>
            </div>

            <h2 className="text-3xl lg:text-4xl font-black text-text-heading mb-4 leading-tight tracking-tight">
              Get Your Health <br />
              <span className="text-primary">On Track Today.</span>
            </h2>

            <p className="text-[14px] lg:text-[15px] text-text-body mb-8 opacity-70 leading-relaxed max-w-md">
              Order Brufen Syrup 120ml now and get same-day delivery. Trusted by over 10k+ health professionals nationwide.
            </p>

            <div className="flex items-center gap-4 mb-8 bg-bg-page/50 p-4 rounded-2xl border border-border-nav/30 w-fit">
              <div className="flex flex-col">
                <span className="text-[10px] text-text-muted uppercase tracking-widest font-bold">Price</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-medium text-text-heading">$14.99</span>
                  <span className="text-lg text-text-body line-through opacity-30">$19.99</span>
                </div>
              </div>
              <div className="h-10 w-px bg-border-nav mx-2" />
              <div className="bg-green-100 text-green-600 px-3 py-1 rounded-lg font-medium text-[11px] uppercase tracking-tighter">
                Save 25%
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-8">
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-border-nav shadow-sm">
                <Truck className="w-4 h-4 text-primary" />
                <span className="font-bold text-text-heading text-[11px] uppercase">Free Delivery</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-border-nav shadow-sm">
                <Clock className="w-4 h-4 text-primary" />
                <span className="font-bold text-text-heading text-[11px] uppercase">Express 2hr</span>
              </div>
            </div>

            {!isAdmin && (
              <button className="w-full sm:w-auto flex items-center justify-center gap-3 bg-primary text-white px-10 py-4 rounded-xl font-bold text-base hover:bg-primary-hover transition-all hover:-translate-y-1 shadow-lg shadow-primary/20 active:scale-95 cursor-pointer">
                <ShoppingCart className="w-5 h-5" />
                Add to Cart Now
              </button>
            )}

            <div className="mt-6 flex items-center gap-2 text-[10px] text-text-muted font-medium uppercase tracking-widest opacity-60">
              <ShieldCheck className="w-3.5 h-3.5" />
              Secure Checkout • 30-Day Returns
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PriceCard;
