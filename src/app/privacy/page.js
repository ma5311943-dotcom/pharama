"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Eye, FileText, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-bg-page pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-text-muted hover:text-primary transition-colors text-xs font-bold uppercase tracking-widest mb-8 group">
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        <div className="bg-bg-card rounded-[3rem] border border-border-nav shadow-soft overflow-hidden">
          <div className="p-10 md:p-16 bg-primary/5 border-b border-border-nav text-center">
            <div className="w-20 h-20 bg-bg-card rounded-3xl flex items-center justify-center text-primary mx-auto mb-6 shadow-soft">
              <ShieldCheck className="w-10 h-10" />
            </div>
            <h1 className="text-4xl font-black text-text-heading mb-4 tracking-tight">Privacy Policy</h1>
            <p className="text-text-muted font-medium max-w-xl mx-auto">
              Your privacy is our top priority. Learn how we handle your data with care and transparency.
            </p>
          </div>

          <div className="p-10 md:p-16 space-y-12">
            <section>
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
                  <Eye className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-black text-text-heading">Information We Collect</h2>
              </div>
              <p className="text-text-body font-medium leading-relaxed mb-4">
                We collect information to provide better services to all our users. This includes:
              </p>
              <ul className="space-y-3 list-disc pl-5 text-text-muted font-medium">
                <li>Personal identifiers (name, email, phone number) when you register.</li>
                <li>Order history and pharmaceutical preferences to personalize your experience.</li>
                <li>Device information and IP addresses for security and analytics.</li>
              </ul>
            </section>

            <section>
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-green-50 rounded-2xl text-green-600">
                  <Lock className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-black text-text-heading">How We Use Data</h2>
              </div>
              <p className="text-text-body font-medium leading-relaxed mb-4">
                Your data is used strictly for pharmaceutical service delivery and security:
              </p>
              <ul className="space-y-3 list-disc pl-5 text-text-muted font-medium">
                <li>Processing your orders and ensuring authentic delivery.</li>
                <li>Verifying prescriptions and payment screenshots.</li>
                <li>Communicating critical health alerts and order updates.</li>
              </ul>
            </section>

            <section>
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-purple-50 rounded-2xl text-purple-600">
                  <FileText className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-black text-text-heading">Data Security</h2>
              </div>
              <p className="text-text-body font-medium leading-relaxed">
                We implement state-of-the-art encryption and security protocols to protect your health records. We never share your medical history with third-party advertisers. All payment screenshots are stored securely and deleted after verification.
              </p>
            </section>

            <div className="pt-10 border-t border-border-nav text-center">
              <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-4">Last Updated: April 2026</p>
              <button className="bg-primary text-white px-10 py-4 rounded-2xl font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary-hover transition-all">
                I Understand & Accept
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
