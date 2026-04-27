"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
  TrendingUp,
  DollarSign,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Filter
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { cn } from '@/lib/utils';
import { gsap } from 'gsap';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const RevenuePage = () => {
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState('7');
  const containerRef = useRef(null);

  const fetchStats = async (selectedRange) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/stats?range=${selectedRange}`);
      const data = await res.json();
      if (data.success) {
        setStatsData(data);
      }
    } catch (error) {
      console.error('Failed to fetch revenue stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats(range);
  }, [range]);

  useEffect(() => {
    if (!loading) {
      const ctx = gsap.context(() => {
        gsap.fromTo(".stat-card", 
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power2.out", clearProps: "all" }
        );
        gsap.fromTo(".chart-card", 
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "power2.out", delay: 0.3, clearProps: "all" }
        );
      }, containerRef);
      return () => ctx.revert();
    }
  }, [loading]);

  const handleExport = () => {
    if (!statsData?.dailyRevenue) return;

    const headers = ["Date", "Revenue (USD)"];
    const rows = statsData.dailyRevenue.map(d => [d._id, d.amount]);

    const csvContent = [
      headers.join(","),
      ...rows.map(e => e.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `revenue_report_${range}_days.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading && !statsData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const totalRev = statsData?.stats.totalRevenue || 0;
  const totalOrders = statsData?.stats.totalOrders || 1;
  const avgOrder = totalRev / totalOrders;

  const lineData = {
    labels: statsData?.dailyRevenue.map(d => d._id) || [],
    datasets: [
      {
        fill: true,
        label: 'Daily Revenue',
        data: statsData?.dailyRevenue.map(d => d.amount) || [],
        borderColor: '#0077B6',
        backgroundColor: 'rgba(0, 119, 182, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const barData = {
    labels: statsData?.dailyRevenue.map(d => d._id).slice(-6) || [],
    datasets: [
      {
        label: 'Revenue Growth',
        data: statsData?.dailyRevenue.map(d => d.amount).slice(-6) || [],
        backgroundColor: '#00a8e8',
        borderRadius: 8,
        maxBarThickness: 40,
      },
    ],
  };

  return (
    <div ref={containerRef} className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-text-heading">Revenue Analytics</h1>
          <p className="text-[10px] text-text-muted font-medium mt-0.5 uppercase tracking-wide">Financial Performance</p>
        </div>
        <div className="flex gap-2">
          <div className="relative group">
            <select
              value={range}
              onChange={(e) => setRange(e.target.value)}
              className="appearance-none bg-bg-card border border-border-nav pl-9 pr-8 py-2 rounded-xl font-bold text-[10px] hover:bg-bg-page transition-all shadow-soft cursor-pointer focus:outline-none focus:ring-1 ring-primary/20"
            >
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
              <option value="all">All Time</option>
            </select>
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-primary pointer-events-none" />
          </div>

          <button
            onClick={handleExport}
            className="flex-grow sm:flex-grow-0 flex items-center justify-center gap-2 bg-primary text-white px-3.5 py-2 rounded-xl font-bold text-[10px] hover:bg-primary-hover shadow-lg shadow-primary/10 transition-all active:scale-95 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        {[
          { label: 'Net Profit (Est.)', value: `$${(totalRev * 0.8).toLocaleString()}`, change: '+12.5%', icon: TrendingUp, color: 'text-green-500' },
          { label: 'Total Revenue', value: `$${totalRev.toLocaleString()}`, change: '+20.1%', icon: DollarSign, color: 'text-primary' },
          { label: 'Avg Order', value: `$${avgOrder.toFixed(2)}`, change: '-2.4%', icon: CreditCard, color: 'text-orange-500' },
        ].map((stat, i) => (
          <div key={i} className="stat-card bg-bg-card p-4 md:p-5 rounded-2xl border border-border-nav shadow-soft hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-3">
              <div className="p-2.5 bg-bg-page rounded-xl group-hover:bg-primary/5 transition-colors">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div className={cn(
                "flex items-center gap-0.5 text-[9px] font-bold px-2 py-0.5 rounded-full",
                stat.change.startsWith('+') ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
              )}>
                {stat.change}
                {stat.change.startsWith('+') ? <ArrowUpRight className="w-2 h-2" /> : <ArrowDownRight className="w-2 h-2" />}
              </div>
            </div>
            <div className="text-lg md:text-xl font-bold text-text-heading mb-0.5">{stat.value}</div>
            <div className="text-[9px] text-text-muted font-bold uppercase tracking-widest">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Charts */}
        <div className="chart-card bg-bg-card p-4 md:p-6 rounded-[1.5rem] border border-border-nav shadow-soft">
          <h3 className="text-base font-bold text-text-heading mb-5">Revenue Over Time</h3>
          <div className="h-[240px] md:h-[280px]">
            <Line data={lineData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#a1a1aa' } }, y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#a1a1aa' } } } }} />
          </div>
        </div>

        <div className="chart-card bg-bg-card p-4 md:p-6 rounded-[1.5rem] border border-border-nav shadow-soft">
          <h3 className="text-base font-bold text-text-heading mb-5">Growth History</h3>
          <div className="h-[240px] md:h-[280px]">
            <Bar data={barData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false }, ticks: { color: '#a1a1aa' } }, y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#a1a1aa' } } } }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenuePage;
