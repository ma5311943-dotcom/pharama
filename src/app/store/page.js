"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, ShoppingCart, Star, ChevronRight,
  LayoutGrid, List, Loader2, Package, Activity,
  ArrowRight, Sparkles, Tag, ShieldCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { gsap } from 'gsap';
import { toast } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { addItemToCart } from '@/redux/slices/cartSlice';

const StorePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role?.toLowerCase() === 'admin';
  const tabletsRef = useRef([]);
  const [tabletStyles, setTabletStyles] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    fetchProducts();
    setTabletStyles(
      Array.from({ length: 5 }).map(() => ({
        top: `${Math.random() * 80}%`,
        left: `${Math.random() * 90}%`,
        scale: 0.5 + Math.random() * 0.5,
      }))
    );
  }, []);

  useEffect(() => {
    if (tabletsRef.current.length > 0) {
      tabletsRef.current.forEach((el, i) => {
        if (!el) return;
        gsap.to(el, {
          y: "random(-40, 40)",
          x: "random(-40, 40)",
          rotation: "random(-180, 180)",
          duration: "random(8, 12)",
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.5
        });
      });
    }
  }, [tabletStyles]);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.success) {
        setProducts(data.data);
      }
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const categories = ["All", ...new Set(products.map(p => p.category))];

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = (product) => {
    if (product.stock === 0) {
      toast.error('Out of stock');
      return;
    }
    dispatch(addItemToCart(product));
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="min-h-screen bg-bg-page pt-16 pb-20 relative overflow-x-hidden">
      {}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {tabletStyles.map((style, i) => (
          <img
            key={i}
            ref={el => tabletsRef.current[i] = el}
            src="/assets/tablets.png"
            alt=""
            className="absolute w-24 h-24 opacity-[0.05]"
            style={style}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">

        <header className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full mb-4">
            <Activity className="w-3 h-3 text-primary animate-pulse" />
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-primary">Global Inventory</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-text-heading tracking-tight mb-2">
            Medical <span className="text-primary italic font-medium">Store</span>
          </h1>
          <p className="text-[12px] text-text-muted font-medium max-w-lg leading-relaxed">
            Authentic pharmaceutical products and medical essentials curated for your health.
          </p>
        </header>

        <div className="flex flex-col lg:flex-row gap-10">

          <aside className="lg:w-64 shrink-0">
            <div className="sticky top-32 space-y-8">

              <div className="relative group">
                <div className="absolute -inset-1 bg-primary/10 rounded-xl blur-sm opacity-0 group-focus-within:opacity-100 transition-all duration-500" />
                <div className="relative flex items-center bg-bg-card rounded-xl border border-border-nav p-1 shadow-soft transition-all">
                  <div className="pl-3 pr-2">
                    <Search className="w-4 h-4 text-text-muted" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search medicines..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent border-none focus:ring-0 text-[13px] font-semibold text-text-heading placeholder:text-text-muted/40 py-2"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 px-2">
                  <Tag className="w-3 h-3 text-primary" />
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Categories</h3>
                </div>
                <div className="flex flex-wrap lg:flex-col gap-2">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={cn(
                        "px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between group",
                        selectedCategory === cat
                          ? "bg-primary text-white shadow-md shadow-primary/20 lg:translate-x-1"
                          : "bg-bg-card border border-border-nav text-text-body hover:border-primary/30 hover:bg-primary/5 shadow-sm"
                      )}
                    >
                      <span>{cat}</span>
                      {selectedCategory === cat && <ChevronRight className="w-3 h-3 hidden lg:block" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="hidden lg:block p-5 bg-primary/5 rounded-[2rem] border border-primary/10">
                <ShieldCheck className="w-8 h-8 text-primary mb-3" />
                <h4 className="text-xs font-bold text-text-heading mb-1">Quality Verified</h4>
                <p className="text-[11px] text-text-muted font-medium leading-relaxed">
                  All products undergo strict quality checks before dispatch.
                </p>
              </div>

            </div>
          </aside>

          <main className="flex-grow">
            {loading ? (
              <div className="py-24 flex flex-col items-center gap-4">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Compiling Inventory...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="py-32 text-center bg-bg-card rounded-[3rem] border border-dashed border-border-nav">
                <Package className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                <h3 className="text-base font-bold text-text-heading uppercase tracking-widest">No products found</h3>
                <p className="text-[11px] text-text-muted font-medium mt-1 uppercase tracking-tighter">Adjust your filters or search terms</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                <AnimatePresence mode="popLayout">
                  {filteredProducts.map((product, i) => (
                    <motion.div
                      layout
                      key={product._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4, delay: i * 0.05 }}
                      className="group bg-bg-card rounded-[2rem] border border-border-nav shadow-soft hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden flex flex-col"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden bg-bg-page">
                        <img
                          src={product.image || 'https://via.placeholder.com/300?text=No+Image'}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                          <span className="px-3 py-1 bg-bg-card/90 backdrop-blur-md rounded-lg text-[9px] font-bold text-primary shadow-sm uppercase">
                            {product.category}
                          </span>
                        </div>

                        {product.stock === 0 && (
                          <div className="absolute inset-0 bg-bg-card/60 backdrop-blur-[2px] flex items-center justify-center">
                            <span className="bg-red-500 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-full shadow-lg -rotate-12">
                              Out of Stock
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="p-6 flex flex-col flex-grow">
                        <h3 className="text-base font-bold text-text-heading mb-4 line-clamp-1 group-hover:text-primary transition-colors">
                          {product.name}
                        </h3>

                        <div className="mt-auto flex items-center justify-between pt-5 border-t border-border-nav/50">
                          <div>
                            <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest mb-0.5">Price</p>
                            <p className="text-lg font-bold text-text-heading tracking-tight">${product.price.toFixed(2)}</p>
                          </div>

                          {!isAdmin && (
                            <button
                              disabled={product.stock === 0}
                              onClick={() => handleAddToCart(product)}
                              className={cn(
                                "p-3.5 rounded-xl transition-all active:scale-95 flex items-center gap-2 shadow-lg",
                                product.stock > 0
                                  ? "bg-primary text-white hover:bg-primary/90 shadow-primary/20"
                                  : "bg-bg-page text-gray-400 cursor-not-allowed"
                              )}
                            >
                              <ShoppingCart className="w-4 h-4" />
                              <span className="text-[11px] font-bold uppercase tracking-widest hidden sm:block">Add</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default StorePage;
