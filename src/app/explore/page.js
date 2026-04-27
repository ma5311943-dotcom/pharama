"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Search, Brain, HeartPulse, Activity, ShieldPlus, Baby, Pill as PillIcon, Sparkles, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

const drugClasses = [
  { id: 1, name: "Antibiotics", icon: ShieldPlus, color: "bg-blue-500", count: 120, description: "Medicines used to treat bacterial infections." },
  { id: 2, name: "Analgesics", icon: PillIcon, color: "bg-red-500", count: 85, description: "Pain relief medications ranging from mild to potent." },
  { id: 3, name: "Cardiology", icon: HeartPulse, color: "bg-pink-500", count: 150, description: "Specialized drugs for heart and cardiovascular health." },
  { id: 4, name: "Pediatrics", icon: Baby, color: "bg-orange-500", count: 65, description: "Safe and effective medications for children." },
  { id: 5, name: "Mental Health", icon: Brain, color: "bg-purple-500", count: 95, description: "Support for cognitive and emotional wellbeing." },
  { id: 6, name: "Diabetes", icon: Activity, color: "bg-green-500", count: 110, description: "Glucose management and insulin therapy support." },
];

const ExplorePage = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const router = useRouter();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen bg-bg-page pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold mb-6"
          >
            <Sparkles className="w-4 h-4" />
            <span>Discover Knowledge</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl lg:text-6xl font-extrabold text-text-heading mb-6"
          >
            Explore <span className="text-primary">Medical Library</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-text-body mb-12 max-w-2xl mx-auto font-medium"
          >
            Search through thousands of authentic medications, understand their uses, and find the right category for your health needs.
          </motion.p>

          <div className="relative max-w-3xl mx-auto">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-primary w-6 h-6" />
            <input 
              type="text" 
              placeholder="Search by drug name, chemical class, or condition..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full bg-bg-card border-2 border-primary/20 rounded-[2rem] py-6 pl-16 pr-8 text-lg font-medium focus:outline-none focus:border-primary shadow-2xl shadow-primary/10 transition-all"
            />
            <button 
              onClick={handleSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-primary text-white px-8 py-3.5 rounded-[1.5rem] font-bold hover:bg-primary-hover shadow-lg transition-all cursor-pointer"
            >
              Search
            </button>
          </div>
        </div>

        {/* Drug Categories Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {drugClasses.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-bg-card rounded-[2.5rem] p-10 border border-border-nav shadow-soft hover:shadow-2xl transition-all group cursor-pointer"
            >
              <div className={`${item.color} w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg shadow-current/20 group-hover:scale-110 transition-transform`}>
                <item.icon className="w-8 h-8" />
              </div>

              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-extrabold text-text-heading">{item.name}</h3>
                <span className="text-xs font-black text-primary bg-primary/5 px-3 py-1 rounded-full">{item.count}+ Items</span>
              </div>

              <p className="text-text-muted font-medium mb-8 leading-relaxed">
                {item.description}
              </p>

              <button className="flex items-center gap-2 text-primary font-bold hover:gap-4 transition-all group-hover:text-primary-hover">
                <span>Browse Category</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </motion.div>
          ))}
        </div>

        {/* Info Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 bg-primary rounded-[3rem] p-12 lg:p-20 relative overflow-hidden text-white"
        >
          <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-extrabold mb-6 leading-tight">Need Professional Advice on Your Medication?</h2>
              <p className="text-white/80 text-lg font-medium mb-10">Our licensed pharmacists are available 24/7 to help you understand your prescription and guide you toward the best healthcare choices.</p>
              <button className="bg-bg-card text-primary px-10 py-5 rounded-2xl font-bold text-lg hover:bg-bg-page transition-all shadow-xl active:scale-95 cursor-pointer">
                Consult a Pharmacist
              </button>
            </div>
            <div className="hidden lg:flex justify-end">
              <div className="bg-bg-card/10 backdrop-blur-xl p-8 rounded-[2.5rem] border border-border-nav/20">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-bg-card text-primary flex items-center justify-center">
                    <HeartPulse className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-bold">Rapid Support</div>
                    <div className="text-sm text-white/60">Average response: 5 mins</div>
                  </div>
                </div>
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex gap-2">
                      <div className="w-2 h-2 bg-secondary rounded-full mt-2" />
                      <div className="text-sm text-white/80 font-medium">Authentic, laboratory-tested medications only.</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-bg-card/5 rounded-full -mr-20 -mt-20 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/20 rounded-full -ml-20 -mb-20 blur-3xl" />
        </motion.div>
      </div>
    </div>
  );
};

export default ExplorePage;
