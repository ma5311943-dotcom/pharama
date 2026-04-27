"use client";


import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingCart, Trash2, ArrowRight, Star, ChevronLeft, Sparkles, Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { setWishlist } from '@/redux/slices/wishlistSlice';

const WishlistPage = () => {
  const { user } = useSelector((state) => state.auth);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const fetchWishlist = async () => {
    if (!user?._id) return;
    try {
      const res = await fetch(`/api/wishlist?userId=${user._id}`);
      const data = await res.json();
      if (data.success) {
        setWishlistItems(data.data);
        dispatch(setWishlist(data.data));
      }
    } catch (error) {
      toast.error('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (user?._id) {
      fetchWishlist();
    } else {
      setLoading(false);
    }
  }, [user]);

  const removeItem = async (productId) => {
    try {
      const res = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user._id, productId }),
      });
      const data = await res.json();
      if (data.success) {
        setWishlistItems(data.data);
        dispatch(setWishlist(data.data));
        toast.success('Removed from wishlist');
      }
    } catch (error) {
      toast.error('Failed to update wishlist');
    }
  };

  return (
    <div className="min-h-screen bg-bg-page pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <Link href="/store" className="p-3 bg-bg-card rounded-xl border border-border-nav text-text-muted hover:text-primary transition-colors shadow-soft">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-4xl font-extrabold text-text-heading">My <span className="text-secondary">Wishlist</span></h1>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-secondary/10 text-secondary rounded-full font-bold text-sm">
            <Sparkles className="w-4 h-4" />
            <span>{wishlistItems.length} Favorite Items</span>
          </div>
        </div>

        {loading ? (
          <div className="py-32 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Loading Favorites...</p>
          </div>
        ) : wishlistItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode='popLayout'>
              {wishlistItems.map((item, i) => (
                <motion.div
                  key={item._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5, rotate: -5 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-bg-card rounded-[2.5rem] border border-border-nav overflow-hidden shadow-soft hover:shadow-2xl transition-all group flex flex-col"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 right-4">
                      <button
                        onClick={() => removeItem(item._id)}
                        className="p-3 bg-bg-card/90 backdrop-blur-md rounded-2xl text-danger hover:bg-danger hover:text-white shadow-xl transition-all cursor-pointer"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <span className="text-[10px] font-black uppercase tracking-widest text-secondary bg-bg-card/90 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-lg">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-8 flex flex-col flex-grow">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm font-black text-text-heading">{item.rating}</span>
                      </div>
                      <span className="text-2xl font-black text-secondary">${item.price}</span>
                    </div>

                    <h3 className="text-xl font-extrabold text-text-heading mb-8 line-clamp-1">
                      {item.name}
                    </h3>

                    <button className="w-full bg-secondary text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-secondary/90 shadow-lg hover:shadow-secondary/25 transition-all active:scale-95 cursor-pointer">
                      <ShoppingCart className="w-5 h-5" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-bg-card rounded-[3rem] p-20 text-center border border-border-nav shadow-soft"
          >
            <div className="w-32 h-32 bg-bg-page rounded-full flex items-center justify-center mx-auto mb-8">
              <Heart className="w-16 h-16 text-gray-300" />
            </div>
            <h2 className="text-3xl font-extrabold text-text-heading mb-4">Your Wishlist is Empty</h2>
            <p className="text-text-muted font-medium mb-10 max-w-sm mx-auto">Found something you like? Add it to your wishlist to keep track of it!</p>
            <Link
              href="/store"
              className="inline-flex items-center gap-2 bg-secondary text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-secondary/90 shadow-lg transition-all"
            >
              <span>Explore Products</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        )}

      </div>
    </div>
  );
};

export default WishlistPage;
