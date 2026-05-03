"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
  Users,
  Package,
  ShoppingCart,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  Loader2
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { gsap } from 'gsap';
import { cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const stats = [
  { label: 'Total Revenue', value: '$45,231.89', change: '+20.1%', icon: TrendingUp, color: 'text-green-500', trend: 'up' },
  { label: 'Total Orders', value: '+2,350', change: '+180.1%', icon: ShoppingCart, color: 'text-primary', trend: 'up' },
  { label: 'Active Users', value: '+12,234', change: '+19%', icon: Users, color: 'text-purple-500', trend: 'up' },
  { label: 'Active Products', value: '573', change: '-4%', icon: Package, color: 'text-orange-500', trend: 'down' },
];

const chartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
  datasets: [
    {
      fill: true,
      label: 'Revenue',
      data: [3000, 4500, 3200, 5000, 4800, 6000, 7500],
      borderColor: '#0077B6',
      backgroundColor: 'rgba(0, 119, 182, 0.1)',
      tension: 0.4,
    },
  ],
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
  },
  scales: {
    y: { beginAtZero: true, grid: { display: false }, ticks: { color: '#a1a1aa' } },
    x: { grid: { display: false }, ticks: { color: '#a1a1aa' } },
  },
};

const AdminDashboard = () => {
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/stats');
        const data = await res.json();
        if (data.success) {
          setStatsData(data);
        }
      } catch (error) {
        toast.error('Failed to fetch dashboard stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();

    const ctx = gsap.context(() => {
      gsap.fromTo(".stat-card", 
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out", delay: 0.2, clearProps: "all" }
      );
      gsap.fromTo(".chart-card", 
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power3.out", delay: 0.5, clearProps: "all" }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  const dashboardStats = [
    { label: 'Total Revenue', value: `$${statsData?.stats.totalRevenue.toLocaleString()}`, change: '+12%', icon: TrendingUp, color: 'text-green-500', trend: 'up' },
    { label: 'Total Orders', value: statsData?.stats.totalOrders.toString(), change: '+5%', icon: ShoppingCart, color: 'text-primary', trend: 'up' },
    { label: 'Total Users', value: statsData?.stats.totalUsers.toString(), change: '+2%', icon: Users, color: 'text-purple-500', trend: 'up' },
    { label: 'Total Products', value: statsData?.stats.totalProducts.toString(), change: 'Stable', icon: Package, color: 'text-orange-500', trend: 'up' },
  ];

  const processedChartData = {
    labels: statsData?.dailyRevenue.map(d => d._id) || [],
    datasets: [
      {
        fill: true,
        label: 'Revenue',
        data: statsData?.dailyRevenue.map(d => d.amount) || [],
        borderColor: '#0077B6',
        backgroundColor: 'rgba(0, 119, 182, 0.1)',
        tension: 0.4,
      },
    ],
  };

  return (
    <div ref={containerRef} className="space-y-4 md:space-y-6">
      {}
      <div className="animate-in fade-in slide-in-from-left duration-700">
        <h1 className="text-xl md:text-2xl font-bold text-text-heading">Dashboard</h1>
        <p className="text-[10px] text-text-muted font-medium mt-0.5 uppercase tracking-wide">Overview & Analytics</p>
      </div>

      {}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {dashboardStats.map((stat, i) => (
          <div key={i} className="stat-card bg-bg-card p-3.5 md:p-4 rounded-2xl border border-border-nav shadow-soft hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-2">
              <div className="p-2 bg-bg-page rounded-lg group-hover:bg-primary/10 transition-colors">
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <div className={`flex items-center gap-0.5 text-[9px] font-bold ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                {stat.change}
                {stat.trend === 'up' ? <ArrowUpRight className="w-2 h-2" /> : <ArrowDownRight className="w-2 h-2" />}
              </div>
            </div>
            <div className="text-lg md:text-xl font-bold text-text-heading mt-1">{stat.value}</div>
            <div className="text-[9px] text-text-muted font-semibold uppercase tracking-wider">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">
        {}
        <div className="chart-card xl:col-span-2 bg-bg-card p-4 md:p-6 rounded-[1.5rem] border border-border-nav shadow-soft">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-bold text-text-heading">Revenue Growth</h3>
            <select className="bg-bg-page border-none rounded-lg text-[9px] font-bold px-2.5 py-1.5 focus:ring-1 ring-primary/20 cursor-pointer">
              <option>7 Days</option>
              <option>30 Days</option>
            </select>
          </div>
          <div className="h-[200px] md:h-[260px] w-full">
            <Line data={processedChartData} options={chartOptions} />
          </div>
        </div>

        {}
        <div className="chart-card bg-bg-card p-4 md:p-6 rounded-[1.5rem] border border-border-nav shadow-soft">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-base font-bold text-text-heading">Recent Orders</h3>
            <button className="text-[9px] font-bold text-primary hover:underline">View All</button>
          </div>
          <div className="space-y-3">
            {statsData?.latestOrders.map((order, i) => (
              <div key={order._id} className="flex items-center justify-between group cursor-pointer p-2 hover:bg-bg-page rounded-xl transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-primary text-[9px]">
                    {order.userName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-text-heading">{order.userName}</div>
                    <div className="text-[9px] text-text-muted">{new Date(order.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] font-bold text-text-heading">${order.totalAmount.toFixed(2)}</div>
                  <div className={cn(
                    "text-[8px] font-bold uppercase tracking-widest",
                    order.status === 'Delivered' ? 'text-green-500' : 'text-orange-500'
                  )}>{order.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
