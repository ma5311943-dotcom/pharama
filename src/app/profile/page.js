"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile, logout, clearError } from '@/redux/slices/authSlice';
import { User, Package, Heart, Settings, MapPin, LogOut, ChevronRight, Camera, Check, X, Loader2, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';

import toast from 'react-hot-toast';
import Link from 'next/link';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, loading, error } = useSelector((state) => state.auth);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [orderCount, setOrderCount] = useState(0);

  useEffect(() => {
    const fetchOrderCount = async () => {
      if (!user?._id) return;
      try {
        const res = await fetch(`/api/orders/user/${user._id}`);
        const data = await res.json();
        if (data.success) {
          setOrderCount(data.data.length);
        }
      } catch (error) {
        console.error('Error fetching order count');
      }
    };
    fetchOrderCount();
  }, [user]);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name, email: user.email });
    }
  }, [user]);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    router.push('/login');
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error('Name and email are required');
      return;
    }

    const result = await dispatch(updateProfile({ ...formData, userId: user._id }));
    if (!result.error) {
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } else {
      toast.error(result.payload || 'Update failed');
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-bg-page py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {}
        <div className="bg-bg-card rounded-2xl p-6 md:p-8 border border-border-nav shadow-xl mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 bg-primary/5 rounded-full -mr-8 -mt-8" />

          <div className="relative flex flex-col md:flex-row items-center gap-5">
            <div className="relative shrink-0">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary border-4 border-border-nav shadow-lg overflow-hidden">
                <User className="w-10 h-10" />
              </div>
              <button className="absolute bottom-0 right-0 p-1.5 bg-bg-card rounded-full shadow-md border border-border-nav hover:bg-bg-page transition-colors cursor-pointer">
                <Camera className="w-3 h-3 text-text-muted" />
              </button>
            </div>

            <div className="text-center md:text-left flex-grow">
              {isEditing ? (
                <form className="space-y-2" onSubmit={handleUpdate}>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-bg-page border border-border-nav rounded-xl pl-9 pr-4 py-2 text-sm font-medium focus:outline-none focus:border-primary"
                      placeholder="Full Name"
                    />
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-bg-page border border-border-nav rounded-xl pl-9 pr-4 py-2 text-sm font-medium focus:outline-none focus:border-primary"
                      placeholder="Email Address"
                    />
                  </div>
                  {error && <p className="text-[10px] text-red-500 font-medium px-1">{error}</p>}
                </form>
              ) : (
                <>
                  <h1 className="text-xl font-semibold text-text-heading mb-0.5">{user.name}</h1>
                  <p className="text-text-muted text-sm font-medium mb-3">{user.email}</p>
                </>
              )}

              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                <div className="px-3 py-1 bg-secondary/10 text-secondary text-xs font-medium rounded-full">
                  Role: <span className="uppercase">{user.role}</span>
                </div>
                <div className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                  Verified Account
                </div>
              </div>
            </div>

            <div className="flex gap-2 shrink-0">
              {isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="p-2.5 bg-bg-page text-text-muted border border-border-nav rounded-xl hover:bg-bg-card transition-all cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleUpdate}
                    disabled={loading}
                    className="flex items-center gap-1.5 bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-primary-hover shadow-md shadow-primary/15 transition-all cursor-pointer disabled:opacity-70"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    <span>Save</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1.5 bg-bg-page text-text-heading border border-border-nav px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-bg-card hover:shadow-soft transition-all cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {}
        <div className="grid md:grid-cols-2 gap-6">

          {}
          <div className="space-y-6">
            {[
              { label: "My Orders", icon: Package, count: `${orderCount} Orders`, color: "bg-blue-500", href: "/profile/orders" },
              { label: "Saved Addresses", icon: MapPin, count: "0 Places", color: "bg-green-500", href: "/profile/address" }
            ].map(item => (
              <Link
                key={item.label}
                href={item.href}
                className="w-full"
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="w-full flex items-center justify-between p-6 bg-bg-card rounded-3xl border border-border-nav shadow-soft hover:shadow-lg transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                    <div className={`${item.color} p-3 rounded-2xl text-white`}>
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-text-heading">
                        {item.label}
                      </div>
                      <div className="text-xs text-text-muted font-medium">
                        {item.count}
                      </div>
                    </div>
                  </div>

                  <ChevronRight className="w-6 h-6 text-gray-300 group-hover:text-primary transition-colors" />
                </motion.div>
              </Link>
            ))}
          </div>

          {}
          <div className="bg-bg-card rounded-[2rem] p-8 border border-border-nav shadow-soft">
            <h3 className="text-xl font-semibold text-text-heading mb-6">
              Recent Activity
            </h3>

            <div className="space-y-6">
              <div className="text-center py-10">
                <Package className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                <p className="text-sm text-text-muted font-medium">No recent activity found</p>
              </div>
            </div>

            <button className="w-full mt-8 py-3 text-sm font-medium text-primary hover:underline cursor-pointer">
              View All History
            </button>
          </div>

        </div>

        {}
        <div className="mt-12 text-center">
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 font-medium hover:scale-105 transition-transform cursor-pointer"
          >
            <LogOut className="w-5 h-5 text-red-500" />
            <span className='text-red-500'>Sign Out of Account</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;