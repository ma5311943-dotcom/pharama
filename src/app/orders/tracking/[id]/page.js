"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  Package,
  CheckCircle2,
  Clock,
  Truck,
  MapPin,
  ShieldCheck,
  ChevronRight,
  ArrowLeft,
  Loader2,
  Calendar,
  User
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const orderStatuses = [
  { status: 'Pending', icon: Clock, color: 'text-orange-500', bg: 'bg-orange-50', desc: 'Order received and awaiting confirmation' },
  { status: 'Confirmed', icon: CheckCircle2, color: 'text-blue-500', bg: 'bg-blue-50', desc: 'Payment verified and order confirmed' },
  { status: 'Processing', icon: Package, color: 'text-purple-500', bg: 'bg-purple-50', desc: 'Pharmacist is preparing your items' },
  { status: 'Dispatched', icon: Truck, color: 'text-primary', bg: 'bg-primary/5', desc: 'Order left our facility' },
  { status: 'Out for Delivery', icon: MapPin, color: 'text-green-500', bg: 'bg-green-50', desc: 'Rider is on the way to your location' },
  { status: 'Delivered', icon: ShieldCheck, color: 'text-green-600', bg: 'bg-green-100', desc: 'Package handed over successfully' }
];

const OrderTracking = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${id}`);
        const data = await res.json();
        if (data.success) {
          setOrder(data.data);
        }
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-page">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-bg-page p-6 text-center">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-soft border border-border-nav max-w-sm">
          <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-text-heading mb-2">Order Not Found</h2>
          <p className="text-text-muted text-sm mb-6">We couldn't find an order with this ID. Please check your link.</p>
          <Link href="/store" className="bg-primary text-white px-8 py-3 rounded-xl font-bold text-sm block">
            Go to Store
          </Link>
        </div>
      </div>
    );
  }

  const currentStatusIndex = orderStatuses.findIndex(s => s.status === order.status);

  return (
    <div className="min-h-screen bg-bg-page pt-28 pb-20 px-4 md:px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/profile" className="p-2 hover:bg-white rounded-full transition-all group">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </Link>
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-1">Order Tracking</p>
            <h1 className="text-xl font-bold text-text-heading truncate max-w-[200px]">#{order._id.slice(-8)}</h1>
          </div>
        </div>

        {/* Main Tracking Card */}
        <div className="bg-white rounded-[2.5rem] border border-border-nav shadow-soft overflow-hidden mb-6 relative">

          {/* Progress Bar Background */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gray-100 z-20">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(currentStatusIndex / (orderStatuses.length - 1)) * 100}%` }}
              transition={{ duration: 1.5, ease: "circOut" }}
              className="h-full bg-primary"
            />
          </div>

          {/* Status Header - More Dynamic */}
          <div className="p-6 md:p-10 bg-primary/[0.02] border-b border-border-nav flex flex-col md:flex-row md:items-center justify-between gap-6 relative">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-white rounded-3xl shadow-xl border border-primary/10 flex items-center justify-center text-primary relative overflow-hidden group">
                <div className="absolute inset-0 bg-primary/5 scale-0 group-hover:scale-100 transition-transform duration-500 rounded-3xl" />
                <Truck className="w-10 h-10 relative z-10" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-3xl font-bold text-text-heading tracking-tight">{order.status}</h2>
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                </div>
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-primary" />
                  Last Updated: {new Date(order.updatedAt || order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
            <div className="flex flex-col md:items-end">
              <span className="text-[9px] font-bold text-text-muted uppercase tracking-[0.3em] mb-1">Payment Verified</span>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-primary">${order.totalAmount.toFixed(2)}</span>
                <ShieldCheck className="w-5 h-5 text-green-500" />
              </div>
            </div>
          </div>

          {/* Tracking Timeline */}
          <div className="p-6 md:p-10">
            <div className="relative">
              {orderStatuses.map((step, index) => {
                const isCompleted = index <= currentStatusIndex;
                const isCurrent = index === currentStatusIndex;

                return (
                  <div key={step.status} className="flex gap-6 mb-8 last:mb-0 relative">
                    {/* Line */}
                    {index !== orderStatuses.length - 1 && (
                      <div className={cn(
                        "absolute left-[17px] top-[40px] w-[2px] h-[calc(100%+32px)] z-0 transition-colors duration-500",
                        index < currentStatusIndex ? "bg-primary" : "bg-gray-100"
                      )} />
                    )}

                    {/* Icon */}
                    <div className={cn(
                      "w-9 h-9 rounded-full flex items-center justify-center shrink-0 z-10 transition-all duration-500",
                      isCompleted ? "bg-primary text-white shadow-lg shadow-primary/20 scale-110" : "bg-bg-page text-gray-300"
                    )}>
                      <step.icon className={cn("w-4 h-4", isCurrent && "animate-pulse")} />
                    </div>

                    {/* Info */}
                    <div className={cn("flex-grow pt-1 transition-all", isCompleted ? "opacity-100" : "opacity-40")}>
                      <h3 className="text-sm font-bold text-text-heading uppercase tracking-tight mb-1">{step.status}</h3>
                      <p className="text-xs font-medium text-text-muted leading-relaxed">{step.desc}</p>
                    </div>

                    {isCompleted && !isCurrent && (
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-1" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Order Details Mini-Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl border border-border-nav shadow-soft p-6 md:p-8">
            <h3 className="text-sm font-bold text-text-heading uppercase tracking-widest mb-6 flex items-center gap-3">
              <Package className="w-4 h-4 text-primary" />
              Package Items
            </h3>
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {order.products.map((item, i) => (
                <div key={i} className="flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl border border-border-nav overflow-hidden bg-bg-page shrink-0">
                      <img src={item.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-text-heading truncate">{item.name}</p>
                      <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-text-heading">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 pt-6 border-t border-border-nav flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary/10 rounded-lg text-secondary">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-text-heading uppercase tracking-tight">Authentic Guarantee</p>
                  <p className="text-[10px] text-text-muted font-medium">100% Original Medicines</p>
                </div>
              </div>
            </div>
          </div>

          {/* Customer & Payment Info */}
          <div className="bg-white rounded-3xl border border-border-nav shadow-soft p-6 md:p-8 flex flex-col">
            <h3 className="text-sm font-bold text-text-heading uppercase tracking-widest mb-6 flex items-center gap-3">
              <User className="w-4 h-4 text-primary" />
              Order Information
            </h3>
            
            <div className="space-y-6 flex-grow">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest mb-1">Customer Name</p>
                  <p className="text-sm font-bold text-text-heading">{order.userName || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest mb-1">Email Address</p>
                  <p className="text-sm font-bold text-text-heading truncate">{order.userEmail || 'N/A'}</p>
                </div>
              </div>

              <div>
                <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest mb-1">Payment Method</p>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-bg-page border border-border-nav rounded-lg">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    order.paymentMethod === 'JazzCash' ? 'bg-red-500' : 'bg-green-500'
                  )} />
                  <span className="text-xs font-bold text-text-heading">{order.paymentMethod}</span>
                </div>
              </div>

              <div>
                <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest mb-2">Payment Receipt</p>
                <div className="relative group aspect-video rounded-2xl border border-border-nav overflow-hidden bg-bg-page">
                  <img 
                    src={order.paymentScreenshot} 
                    alt="Receipt" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                    <button 
                      onClick={() => window.open(order.paymentScreenshot, '_blank')}
                      className="bg-white text-text-heading px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-xl"
                    >
                      View Full Receipt
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
