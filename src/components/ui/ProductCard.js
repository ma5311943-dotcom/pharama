"use client";

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Plus, Star } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addItemToCart } from '@/redux/slices/cartSlice';
import { toast } from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const cardRef = useRef(null);
  const {
    _id,
    id,
    name,
    category,
    price,
    oldPrice,
    discount,
    rating = 4.5,
    reviews = 0,
    image,
    stock
  } = product;

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === 'admin';

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (stock === 0) {
      toast.error('Out of stock');
      return;
    }
    dispatch(addItemToCart(product));
    toast.success(`${name} added to cart!`);
  };

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="group relative bg-bg-card rounded-2xl border border-border-nav p-4 hover:shadow-2xl hover:border-primary/20 transition-all duration-300 flex flex-col h-full cursor-pointer overflow-hidden"
    >
      {}
      <div 
        className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl z-0"
        style={{
          background: `radial-gradient(400px circle at var(--mouse-x, 0) var(--mouse-y, 0), rgba(0, 168, 232, 0.12), transparent 40%)`
        }}
      />
      
      <div className="relative z-10 aspect-square rounded-xl overflow-hidden bg-bg-page mb-4">
        <img
          src={image || 'https://via.placeholder.com/300?text=No+Image'}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {(discount || (oldPrice && price < oldPrice)) && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">
            {discount || Math.round((1 - price / oldPrice) * 100)}% OFF
          </div>
        )}
        {!isAdmin && (
          <button
            onClick={handleAddToCart}
            className="absolute bottom-2 right-2 p-2 bg-bg-card/90 backdrop-blur-md rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-primary hover:text-white translate-y-2 group-hover:translate-y-0"
          >
            <Plus className="w-5 h-5" />
          </button>
        )}
        {stock === 0 && (
          <div className="absolute inset-0 bg-bg-card/40 backdrop-blur-[1px] flex items-center justify-center">
            <span className="bg-red-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">Out of Stock</span>
          </div>
        )}
      </div>

      <div className="relative z-10 flex-grow">
        <div className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1">
          {category}
        </div>
        <h3 className="font-bold text-text-heading mb-1 line-clamp-1 group-hover:text-primary transition-colors">
          {name}
        </h3>
        <div className="flex items-center gap-1 mb-3">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className={`w-3 h-3 ${s <= Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
            ))}
          </div>
          <span className="text-[10px] text-text-muted">({reviews > 0 ? reviews : 'New'})</span>
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-between mt-auto pt-4 border-t border-border-nav/30">
        <div>
          <span className="text-xl font-extrabold text-text-heading">${price.toFixed(2)}</span>
          {oldPrice && (
            <span className="ml-2 text-xs text-text-muted line-through">${oldPrice.toFixed(2)}</span>
          )}
        </div>
        {!isAdmin && (
          <button
            onClick={handleAddToCart}
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default ProductCard;
