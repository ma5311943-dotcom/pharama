"use client";

import React from "react";
import { MapPin, Phone, Clock, Navigation, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

const NearbyPharmacy = () => {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          {/* Info Side */}
          <div className="lg:w-1/2 space-y-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20"
            >
              <MapPin className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest">
                Find Us Near You
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-4xl lg:text-5xl font-black text-text-heading leading-tight tracking-tight">
                Locate Our{" "}
                <span className="text-primary italic">
                  Partner Pharmacies
                </span>{" "}
                Anywhere
              </h2>
              <p className="mt-6 text-text-body text-lg max-w-xl leading-relaxed">
                Find the nearest PharmaEase branch or partner store to pick up
                your prescriptions instantly. We are available in over{" "}
                <span className="font-bold text-primary">500+ locations</span>{" "}
                across the country.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            >
              <div className="p-6 bg-bg-page rounded-3xl border border-border-nav hover:border-primary/30 transition-all group">
                <Clock className="w-8 h-8 text-primary mb-4" />
                <h4 className="text-sm font-bold text-text-heading mb-1">
                  Open 24/7
                </h4>
                <p className="text-xs text-text-muted">
                  Emergency services available at all major hubs.
                </p>
              </div>

              <div className="p-6 bg-bg-page rounded-3xl border border-border-nav hover:border-primary/30 transition-all group">
                <Navigation className="w-8 h-8 text-secondary mb-4" />
                <h4 className="text-sm font-bold text-text-heading mb-1">
                  Instant Pick-up
                </h4>
                <p className="text-xs text-text-muted">
                  Order online and collect within 15 minutes.
                </p>
              </div>
            </motion.div>

          </div>

          {/* Map Side */}
          <div className="lg:w-1/2 w-full h-[500px] rounded-[3rem] overflow-hidden border-[12px] border-white shadow-2xl relative">
            {/* Scroll Lock Overlay */}
            <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
              <div className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-full border border-white shadow-xl text-[10px] font-black uppercase tracking-[0.2em] text-primary select-none">
                Use Ctrl + Scroll to Zoom
              </div>
            </div>

            <iframe
              src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d115681.29592731265!2d67.01819!3d24.8607!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1spharmacy!5e0!3m2!1sen!2s!4v1713958000000!5m2!1sen!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="grayscale-[0.2] contrast-[1.1] brightness-[1.05] relative z-10"
            ></iframe>

            {/* Map Overlay Badge */}
            <div className="absolute bottom-8 left-8 right-8 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-white shadow-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white">
                  <Navigation className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                    Closest Hub
                  </p>
                  <p className="text-sm font-bold text-text-heading">
                    Main Medical Center, Karachi
                  </p>
                </div>
              </div>

              <button className="bg-primary text-white p-2.5 rounded-xl hover:scale-110 transition-all shadow-lg shadow-primary/20">
                <Phone className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NearbyPharmacy;