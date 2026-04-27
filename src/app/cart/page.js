"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Truck,
  ChevronLeft,
  CreditCard,
  Loader2,
  Camera,
  CheckCircle2,
  UploadCloud,
  X
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { removeItemFromCart, addItemToCart, clearCart } from '@/redux/slices/cartSlice';
import { toast } from 'react-hot-toast';
import { cn } from '@/lib/utils';

const CartPage = () => {
  const [mounted, setMounted] = useState(false);
  const dispatch = useDispatch();
  const { items, totalAmount } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);



  const handleUpdateQuantity = (item, delta) => {
    if (delta > 0) {
      dispatch(addItemToCart(item));
    } else {
      dispatch(removeItemFromCart(item.id));
    }
  };



  const shipping = totalAmount > 0 ? 5.00 : 0;
  const total = totalAmount + shipping;

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-bg-page pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 md:px-6">

        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <Link
            href="/store"
            className="p-2.5 bg-bg-card rounded-xl border border-border-nav text-text-muted hover:text-primary transition-all shadow-sm"
          >
            <ChevronLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-2xl font-bold text-text-heading tracking-tight">
            Shopping <span className="text-primary font-medium italic">Cart</span>
          </h1>
        </div>

        {items.length > 0 ? (
          <div className="flex flex-col lg:flex-row gap-8 items-start">

            {/* Cart Items */}
            <div className="w-full lg:flex-grow space-y-4">
              <AnimatePresence mode="popLayout">
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-bg-card rounded-2xl p-4 border border-border-nav shadow-sm flex flex-row items-center gap-4 group hover:shadow-md transition-all"
                  >
                    <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-border-nav bg-bg-page">
                      <img
                        src={item.image || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800'}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    <div className="flex-grow min-w-0">
                      <h3 className="text-[13px] font-bold text-text-heading mb-0.5 truncate">{item.name}</h3>
                      <p className="text-primary font-bold text-[13px] mb-2">${item.price.toFixed(2)}</p>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center bg-bg-page rounded-lg border border-border-nav p-0.5">
                          <button
                            onClick={() => handleUpdateQuantity(item, -1)}
                            className="p-1 hover:bg-bg-card rounded-md transition-all text-text-muted hover:text-primary"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-[11px] font-bold text-text-heading">{item.quantity}</span>
                          <button
                            onClick={() => handleUpdateQuantity(item, 1)}
                            className="p-1 hover:bg-bg-card rounded-md transition-all text-text-muted hover:text-primary"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <button
                          onClick={() => dispatch(removeItemFromCart(item.id))}
                          className="text-[10px] font-bold text-red-500 hover:text-red-600 uppercase tracking-widest"
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    <div className="text-right hidden sm:block">
                      <p className="text-[14px] font-bold text-text-heading">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Order Summary */}
            <div className="w-full lg:w-[300px] shrink-0 sticky top-24">
              <div className="bg-bg-card rounded-[1.8rem] p-6 border border-border-nav shadow-soft">
                <h3 className="text-base font-bold text-text-heading mb-6">Order Summary</h3>

                <div className="space-y-3.5 mb-6">
                  <div className="flex justify-between items-center text-[13px] font-medium text-text-muted">
                    <span>Subtotal</span>
                    <span className="text-text-heading">${totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-[13px] font-medium text-text-muted">
                    <span>Shipping</span>
                    <span className="text-text-heading">${shipping.toFixed(2)}</span>
                  </div>
                  <div className="pt-4 border-t border-border-nav flex justify-between items-center">
                    <span className="text-[13px] font-bold text-text-heading uppercase tracking-wide">Total</span>
                    <span className="text-xl font-bold text-primary">${total.toFixed(2)}</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-xs hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <span>Checkout Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <p className="mt-4 text-center text-[8px] text-text-muted font-bold uppercase tracking-widest">
                  Fast & Secure Pharmaceutical Delivery
                </p>
              </div>
            </div>

          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-bg-card rounded-[2.5rem] p-20 text-center border border-border-nav shadow-soft"
          >
            <div className="w-20 h-20 bg-bg-page rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="w-10 h-10 text-gray-300" />
            </div>
            <h2 className="text-xl font-bold text-text-heading mb-2">Your Cart is Empty</h2>
            <p className="text-[12px] text-text-muted font-medium mb-8 max-w-xs mx-auto">
              Found the medication you need? Add it to your cart to proceed.
            </p>
            <Link
              href="/store"
              className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3.5 rounded-xl font-bold text-sm hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all active:scale-95"
            >
              <span>Explore Store</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        )}

      </div>


    </div>
  );
};

export default CartPage;