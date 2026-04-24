"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  ChevronLeft,
  CreditCard,
  Loader2,
  Camera,
  CheckCircle2,
  UploadCloud,
  X,
  ShieldCheck,
  Truck,
  ShoppingCart
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart } from '@/redux/slices/cartSlice';
import { toast } from 'react-hot-toast';
import { cn } from '@/lib/utils';

const CheckoutPage = () => {
  const [mounted, setMounted] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [settings, setSettings] = useState(null);

  const dispatch = useDispatch();
  const { items, totalAmount } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data.success) {
        setSettings(data.data);
      }
    } catch (error) {
      console.error('Failed to load settings');
    }
  };

  // Redirect if cart is empty or user is not logged in
  useEffect(() => {
    if (mounted) {
      if (!user) {
        toast.error('Please login to checkout');
        router.push('/login');
      } else if (items.length === 0) {
        router.push('/cart');
      }
    }
  }, [mounted, items, user, router]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setScreenshot(file);
      const reader = new FileReader();
      reader.onloadend = () => setScreenshotPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const uploadScreenshot = async () => {
    if (!screenshot) return null;
    const formData = new FormData();
    formData.append('file', screenshot);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      return data.success ? data.url : null;
    } catch {
      return null;
    }
  };

  const shipping = totalAmount > 0 ? 5.00 : 0;
  const total = totalAmount + shipping;

  const handlePlaceOrder = async () => {
    if (!paymentMethod || !screenshot) {
      toast.error('Please select payment method and upload receipt');
      return;
    }

    setIsSubmitting(true);
    try {
      const imageUrl = await uploadScreenshot();
      if (!imageUrl) {
        toast.error('Failed to upload receipt');
        setIsSubmitting(false);
        return;
      }

      const orderData = {
        user: user._id,
        userName: user.name,
        userEmail: user.email,
        products: items.map(item => ({
          product: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        totalAmount: total,
        paymentMethod,
        paymentScreenshot: imageUrl
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      const data = await res.json();
      if (data.success) {
        toast.success('Order placed successfully!');
        dispatch(clearCart());
        router.push('/profile/orders');
      } else {
        toast.error(data.error || 'Failed to place order');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-bg-page pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 md:px-6">

        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <Link
            href="/cart"
            className="p-2.5 bg-white rounded-xl border border-border-nav text-text-muted hover:text-primary transition-all shadow-sm"
          >
            <ChevronLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-text-heading tracking-tight">
              Secure <span className="text-primary font-medium italic">Checkout</span>
            </h1>
            <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest mt-1">Complete your order</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Column: Form */}
          <div className="lg:col-span-3 space-y-6">
            {/* Amount Due Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-[2rem] border border-border-nav shadow-soft flex items-center justify-between"
            >
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-1">Total Amount Due</div>
                <div className="text-3xl font-bold text-primary tracking-tight">${total.toFixed(2)}</div>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <CreditCard className="w-7 h-7" />
              </div>
            </motion.div>

            {/* Payment Method Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white p-6 sm:p-8 rounded-[2.5rem] border border-border-nav shadow-soft space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-4 bg-primary/40 rounded-full" />
                  <h3 className="text-[11px] font-bold uppercase tracking-widest text-text-heading">Select Payment Method</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { name: 'JazzCash', color: 'bg-red-50 text-red-600 border-red-200' },
                    { name: 'EasyPaisa', color: 'bg-green-50 text-green-600 border-green-200' },
                  ].map((method) => (
                    <button
                      key={method.name}
                      onClick={() => setPaymentMethod(method.name)}
                      className={cn(
                        "py-5 rounded-2xl border-2 font-bold text-[11px] uppercase tracking-widest transition-all",
                        paymentMethod === method.name
                          ? method.color + " shadow-md border-transparent scale-[1.02]"
                          : "border-border-nav hover:border-primary/40 text-text-body bg-bg-page/30"
                      )}
                    >
                      {method.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-bg-page p-6 rounded-2xl border border-border-nav">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-4">Instructions</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    {
                      step: '01',
                      text: paymentMethod === 'JazzCash'
                        ? `Transfer to ${settings?.jazzCashNumber || '03719044201'} (JazzCash)`
                        : paymentMethod === 'EasyPaisa'
                          ? `Transfer to ${settings?.easyPaisaNumber || '0319 580 36 89'} (EasyPaisa)`
                          : 'Select a method to see number'
                    },
                    { step: '02', text: 'Screenshot the receipt' },
                    { step: '03', text: 'Upload it below' },
                    { step: '04', text: 'Wait for confirmation' },
                  ].map(s => (
                    <div key={s.step} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-lg bg-white border border-border-nav flex items-center justify-center text-[10px] font-bold text-primary shrink-0 shadow-sm">
                        {s.step}
                      </div>
                      <p className={cn(
                        "text-[11px] font-semibold transition-colors",
                        s.step === '01' && paymentMethod ? "text-primary" : "text-text-body"
                      )}>{s.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upload Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-4 bg-primary/40 rounded-full" />
                  <h3 className="text-[11px] font-bold uppercase tracking-widest text-text-heading">Upload Payment Screenshot</h3>
                </div>
                <div className="relative group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  />
                  <div className={cn(
                    "h-48 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-3 transition-all overflow-hidden",
                    screenshotPreview
                      ? "border-primary/30"
                      : "border-border-nav group-hover:border-primary/30 bg-bg-page/50"
                  )}>
                    {screenshotPreview ? (
                      <div className="relative w-full h-full p-2">
                        <img
                          src={screenshotPreview}
                          alt="Preview"
                          className="w-full h-full object-contain rounded-xl"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center rounded-xl">
                          <div className="bg-white p-3 rounded-full shadow-lg">
                            <Camera className="text-primary w-6 h-6" />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <UploadCloud className="w-6 h-6 text-primary" />
                        </div>
                        <div className="text-center">
                          <p className="text-[11px] font-bold text-text-heading uppercase tracking-widest">Click or drag to upload</p>
                          <p className="text-[9px] text-text-muted mt-1">Supports JPG, PNG, WEBP</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Action Button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              disabled={isSubmitting}
              onClick={handlePlaceOrder}
              className="w-full bg-primary text-white py-5 rounded-2xl font-bold text-sm hover:bg-primary-hover shadow-lg hover:shadow-primary/20 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Confirm Payment & Place Order</span>
                </>
              )}
            </motion.button>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-[2.5rem] p-6 border border-border-nav shadow-soft sticky top-24"
            >
              <h3 className="text-base font-bold text-text-heading mb-6">Order Summary</h3>

              <div className="max-h-[300px] overflow-y-auto pr-2 custom-scrollbar mb-6 space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg border border-border-nav overflow-hidden shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <h4 className="text-[11px] font-bold text-text-heading truncate">{item.name}</h4>
                      <p className="text-[10px] text-text-muted">{item.quantity} x ${item.price.toFixed(2)}</p>
                    </div>
                    <div className="text-[11px] font-bold text-text-heading">
                      ${(item.quantity * item.price).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3.5 pt-6 border-t border-gray-100">
                <div className="flex justify-between items-center text-[12px] font-medium text-text-muted">
                  <span>Subtotal</span>
                  <span className="text-text-heading">${totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-[12px] font-medium text-text-muted">
                  <span>Shipping</span>
                  <span className="text-text-heading">${shipping.toFixed(2)}</span>
                </div>
                <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-[12px] font-bold text-text-heading uppercase tracking-wide">Total</span>
                  <span className="text-xl font-bold text-primary">${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-8 p-4 bg-bg-page rounded-2xl border border-border-nav space-y-3">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4 text-green-500" />
                  <span className="text-[10px] font-bold text-text-heading uppercase tracking-widest">Secure Checkout</span>
                </div>
                <div className="flex items-center gap-3">
                  <Truck className="w-4 h-4 text-primary" />
                  <span className="text-[10px] font-bold text-text-heading uppercase tracking-widest">Fast Delivery</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
