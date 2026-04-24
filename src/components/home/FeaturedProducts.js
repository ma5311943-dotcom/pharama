"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ProductCard from '../ui/ProductCard';
import { ChevronRight, Loader2 } from 'lucide-react';

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          // Just take the first 4 for featured
          setProducts(data.data.slice(0, 4));
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-20 bg-bg-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-text-heading mb-4">
              Best Selling <span className="text-primary">Medicines</span>
            </h2>
            <p className="text-text-muted max-w-xl">
              Our most trusted healthcare products, chosen by thousands of families every day.
            </p>
          </div>
          <Link
            href="/store"
            className="group flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all cursor-pointer"
          >
            <span>Explore Store</span>
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-border-nav">
             <p className="text-text-muted font-bold">No products available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
