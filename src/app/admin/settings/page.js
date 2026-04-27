"use client";

import React, { useState, useEffect } from 'react';
import {
  Bell,
  Lock,
  Globe,
  Database,
  CreditCard,
  Save,
  UserCircle,
  Loader2,
  Phone,
  Mail,
  Building,
  Smartphone
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('General');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    pharmacyName: '',
    supportEmail: '',
    easyPaisaNumber: '',
    jazzCashNumber: '',
    timezone: 'GMT+05:00 (Karachi)',
  });

  useEffect(() => {
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
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Settings saved successfully');
      } else {
        toast.error(data.message || 'Failed to save settings');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { label: 'General', icon: Globe },
    { label: 'Payments', icon: CreditCard },
    { label: 'System', icon: Database },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
        <p className="text-xs font-bold text-text-muted uppercase tracking-widest">Loading Settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-text-heading">Settings</h1>
        <p className="text-[10px] text-text-muted font-medium mt-0.5 uppercase tracking-wide">Portal Configuration</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 flex lg:flex-col overflow-x-auto lg:overflow-visible gap-2 pb-2 lg:pb-0 no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.label}
              onClick={() => setActiveTab(tab.label)}
              className={cn(
                "flex items-center gap-3 px-5 py-3.5 rounded-2xl font-bold text-xs transition-all whitespace-nowrap shrink-0",
                activeTab === tab.label
                  ? "bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]"
                  : "bg-bg-card text-text-muted border border-border-nav hover:border-primary/30"
              )}
            >
              <tab.icon className={cn("w-4 h-4", activeTab === tab.label ? "text-white" : "text-primary")} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <form onSubmit={handleSubmit} className="bg-bg-card rounded-3xl p-6 md:p-10 border border-border-nav shadow-soft relative overflow-hidden">
            <AnimatePresence mode="wait">
              {activeTab === 'General' && (
                <motion.div
                  key="general"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div>
                    <h3 className="text-sm font-black text-text-heading uppercase tracking-widest mb-6 flex items-center gap-3">
                      <Building className="w-4 h-4 text-primary" />
                      Pharmacy Information
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-text-muted ml-1">Pharmacy Display Name</label>
                        <div className="relative">
                          <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                          <input
                            type="text"
                            value={settings.pharmacyName}
                            onChange={(e) => setSettings({ ...settings, pharmacyName: e.target.value })}
                            className="w-full bg-bg-page border border-transparent rounded-xl py-3 pl-12 pr-4 focus:border-primary/30 focus:ring-4 ring-primary/5 text-xs font-bold transition-all"
                            placeholder="Enter pharmacy name"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-text-muted ml-1">Contact Email</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                          <input
                            type="email"
                            value={settings.supportEmail}
                            onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                            className="w-full bg-bg-page border border-transparent rounded-xl py-3 pl-12 pr-4 focus:border-primary/30 focus:ring-4 ring-primary/5 text-xs font-bold transition-all"
                            placeholder="support@example.com"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-black text-text-heading uppercase tracking-widest mb-6 flex items-center gap-3">
                      <Globe className="w-4 h-4 text-primary" />
                      Localization
                    </h3>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-text-muted ml-1">System Timezone</label>
                      <select
                        value={settings.timezone}
                        onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                        className="w-full bg-bg-page border border-transparent rounded-xl py-3 px-4 focus:border-primary/30 focus:ring-4 ring-primary/5 text-xs font-bold transition-all cursor-pointer appearance-none"
                      >
                        <option value="GMT+05:00 (Karachi)">GMT+05:00 (Karachi)</option>
                        <option value="GMT+00:00 (London)">GMT+00:00 (London)</option>
                        <option value="GMT-05:00 (New York)">GMT-05:00 (New York)</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'Payments' && (
                <motion.div
                  key="payments"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div>
                    <h3 className="text-sm font-black text-text-heading uppercase tracking-widest mb-6 flex items-center gap-3">
                      <Smartphone className="w-4 h-4 text-primary" />
                      Mobile Wallet Accounts
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-text-muted ml-1">EasyPaisa Account #</label>
                        <div className="relative">
                          <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                          <input
                            type="text"
                            value={settings.easyPaisaNumber}
                            onChange={(e) => setSettings({ ...settings, easyPaisaNumber: e.target.value })}
                            className="w-full bg-bg-page border border-transparent rounded-xl py-3 pl-12 pr-4 focus:border-primary/30 focus:ring-4 ring-primary/5 text-xs font-bold transition-all"
                            placeholder="03XX XXXXXXX"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-text-muted ml-1">JazzCash Account #</label>
                        <div className="relative">
                          <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500" />
                          <input
                            type="text"
                            value={settings.jazzCashNumber}
                            onChange={(e) => setSettings({ ...settings, jazzCashNumber: e.target.value })}
                            className="w-full bg-bg-page border border-transparent rounded-xl py-3 pl-12 pr-4 focus:border-primary/30 focus:ring-4 ring-primary/5 text-xs font-bold transition-all"
                            placeholder="03XX XXXXXXX"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-border-nav">
                    <h3 className="text-sm font-black text-text-heading uppercase tracking-widest mb-6 flex items-center gap-3">
                      <CreditCard className="w-4 h-4 text-blue-500" />
                      Global Payment Gateway
                    </h3>
                    <div className="p-5 bg-blue-500/5 border border-blue-500/20 rounded-2xl flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                        <Lock className="w-5 h-5 text-blue-500" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-text-heading uppercase tracking-widest">Stripe Checkout is Active</h4>
                        <p className="text-[10px] text-text-muted leading-relaxed mt-1">
                          Your Stripe Secret Key is securely configured via environment variables (<b>.env</b> file). 
                          Credit Card payments are actively being processed securely without exposing sensitive keys to this dashboard.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'System' && (
                <motion.div
                  key="system"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="p-6 bg-bg-page rounded-2xl border border-border-nav">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-xl">
                        <Database className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-text-heading">Database Maintenance</h4>
                        <p className="text-[10px] text-text-muted font-medium mt-1">Automatic backups are enabled. Last backup: Today, 04:00 AM</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-12 pt-8 border-t border-border-nav flex items-center justify-between gap-4">
              <div className="hidden sm:block">
                <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest">Last updated: {new Date().toLocaleDateString()}</p>
              </div>
              <button
                type="submit"
                disabled={saving}
                className="w-full sm:w-auto flex items-center justify-center gap-3 bg-primary text-white px-8 py-4 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-primary-hover shadow-xl shadow-primary/20 transition-all active:scale-95 disabled:opacity-50 disabled:scale-100"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>{saving ? 'Saving...' : 'Save Settings'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

