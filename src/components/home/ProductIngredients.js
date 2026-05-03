"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Beaker, Leaf, Zap, Droplets } from 'lucide-react';

const ProductIngredients = () => {
  const ingredients = [
    {
      title: "Pure Ibuprofen",
      desc: "Fast-acting relief for pain and inflammation.",
      icon: <Zap className="w-6 h-6 text-primary" />,
    },
    {
      title: "Natural Extracts",
      desc: "Blended with botanical elements for better absorption.",
      icon: <Leaf className="w-6 h-6 text-green-500" />,
    },
    {
      title: "Advanced Formula",
      desc: "Scientifically proven 24-hour protection.",
      icon: <Beaker className="w-6 h-6 text-blue-500" />,
    },
    {
      title: "Zero Fillers",
      desc: "Purely active ingredients with no harmful additives.",
      icon: <Droplets className="w-6 h-6 text-cyan-500" />,
    }
  ];

  return (
    <section id="ingredients-section" className="relative min-h-screen py-24 flex items-center bg-bg-card overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

        {}
        <div className="relative hidden lg:flex items-center justify-center h-[550px]">
          <div className="absolute inset-0 bg-bg-card rounded-[40px] border border-border-nav overflow-hidden shadow-inner">
            <img
              src="/assets/ingredients_bg.png"
              alt="Natural Ingredients"
              className="w-full h-full object-cover opacity-90"
            />
          </div>

          {}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <Leaf className="absolute top-[15%] left-[10%] w-8 h-8 text-green-500/40" />
            <Zap className="absolute bottom-[25%] right-[15%] w-6 h-6 text-primary/40" />
          </div>

          {}
          <div className="absolute bottom-[10%] w-40 h-8 bg-primary/10 rounded-[100%] blur-xl" />
        </div>

        <div className="relative z-10 lg:pl-10">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl lg:text-4xl font-extrabold text-text-heading mb-4 tracking-tight">
              What's Inside <br />
              <span className="text-primary">That Matters</span>
            </h2>
            <p className="text-sm lg:text-base text-text-body mb-8 opacity-70 max-w-md leading-relaxed">
              Our formula is crafted with precision, ensuring the highest standards of safety and efficacy for your family.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ingredients.map((item, index) => (
                <div key={index} className="p-5 rounded-2xl bg-bg-page border border-border-nav/50 hover:shadow-lg transition-all duration-300 group">
                  <div className="w-10 h-10 rounded-xl bg-bg-card flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <h3 className="text-base font-bold text-text-heading mb-1">{item.title}</h3>
                  <p className="text-xs text-text-body opacity-60 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ProductIngredients;
