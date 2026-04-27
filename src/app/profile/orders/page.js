"use client";

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Package,
  ChevronRight,
  ArrowLeft,
  Loader2,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  MapPin
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const MyOrders = () => {
  const { user } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?._id) return;
      try {
        const res = await fetch(`/api/orders/user/${user._id}`);
        const data = await res.json();
        if (data.success) {
          setOrders(data.data);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  const getStatusInfo = (status) => {
    switch (status) {
      case 'Pending': return { icon: Clock, color: 'text-orange-500', bg: 'bg-orange-50' };
      case 'Confirmed': return { icon: CheckCircle2, color: 'text-blue-500', bg: 'bg-blue-50' };
      case 'Dispatched': return { icon: Truck, color: 'text-primary', bg: 'bg-primary/5' };
      case 'Delivered': return { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' };
      case 'Cancelled': return { icon: XCircle, color: 'text-red-500', bg: 'bg-red-50' };
      default: return { icon: Package, color: 'text-gray-500', bg: 'bg-bg-page' };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-page">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-page pt-28 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/profile" className="p-2 hover:bg-bg-card rounded-full transition-all">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl font-bold text-text-heading">My Orders</h1>
        </div>

        {orders.length === 0 ? (
          <div className="bg-bg-card rounded-[2.5rem] p-20 text-center border border-border-nav shadow-soft">
            <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-text-heading mb-2">No orders yet</h2>
            <p className="text-text-muted text-sm mb-8">You haven't placed any orders yet. Start shopping now!</p>
            <Link href="/store" className="bg-primary text-white px-10 py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 inline-block">
              Go to Store
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const statusInfo = getStatusInfo(order.status);
              return (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={order._id}
                  className="bg-bg-card rounded-[2rem] border border-border-nav shadow-soft overflow-hidden group hover:shadow-xl transition-all"
                >
                  <div className="p-6 md:p-8">
                    <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                      <div className="flex items-center gap-4">
                        <div className={cn("p-3 rounded-2xl", statusInfo.bg)}>
                          <statusInfo.icon className={cn("w-6 h-6", statusInfo.color)} />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-0.5">Order ID</p>
                          <h3 className="text-sm font-bold text-text-heading">#{order._id.slice(-8)}</h3>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={cn("px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider", statusInfo.bg, statusInfo.color)}>
                          {order.status}
                        </div>
                        <p className="text-xs font-bold text-text-muted">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 py-6 border-y border-gray-50 overflow-x-auto scrollbar-hide">
                      {order.products.map((item, i) => (
                        <div key={i} className="flex-shrink-0 w-16 h-16 rounded-xl border border-border-nav overflow-hidden bg-bg-page relative group/img">
                          <img src={item.image} alt="" className="w-full h-full object-cover group-hover/img:scale-110 transition-transform" />
                          {item.quantity > 1 && (
                            <div className="absolute bottom-0 right-0 bg-primary text-white text-[8px] font-bold px-1.5 py-0.5 rounded-tl-lg">
                              x{item.quantity}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 flex flex-wrap items-center justify-between gap-6">
                      <div className="flex gap-8">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-text-muted uppercase tracking-widest font-bold">Total Price</span>
                          <span className="text-xl font-bold text-primary">${order.totalAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] text-text-muted uppercase tracking-widest font-bold">Paid Via</span>
                          <span className="text-sm font-bold text-text-heading mt-1">{order.paymentMethod}</span>
                        </div>
                      </div>
                      <Link
                        href={`/orders/tracking/${order._id}`}
                        className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold text-xs hover:bg-primary-hover transition-all active:scale-95 shadow-lg shadow-black/10"
                      >
                        Track Order
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
