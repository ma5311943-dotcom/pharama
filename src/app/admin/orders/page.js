"use client";

import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  Truck,
  XCircle,
  MoreHorizontal,
  Loader2,
  Calendar,
  DollarSign,
  X,
  ExternalLink,
  Trash2,
  MapPin,
  ShieldCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Drawer } from 'vaul';
const OrdersAdmin = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders', { cache: 'no-store' });
      const data = await res.json();
      if (data.success) {
        setOrders(data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (id, status) => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Order ${status}`);
        fetchOrders();
        if (selectedOrder?._id === id) {
          setSelectedOrder({ ...selectedOrder, status });
        }
      }
    } catch (error) {
      toast.error('Failed to update order');
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteOrder = async (id) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    try {
      const res = await fetch(`/api/orders/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast.success('Order deleted');
        fetchOrders();
      }
    } catch (error) {
      toast.error('Failed to delete order');
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-text-heading">Order Management</h1>
          <p className="text-[10px] text-text-muted font-medium mt-0.5 uppercase tracking-wide">Review & dispatch orders</p>
        </div>
      </div>

      {}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-3.5 h-3.5" />
          <input
            type="text"
            placeholder="Search orders..."
            className="w-full bg-bg-card border border-border-nav rounded-xl py-2.5 pl-9 pr-4 focus:outline-none focus:border-primary shadow-soft text-xs font-medium"
          />
        </div>
        <button className="flex items-center justify-center gap-2 bg-bg-card border border-border-nav px-4 py-2.5 rounded-xl font-bold text-xs hover:bg-bg-page transition-all shadow-soft shrink-0">
          <Filter className="w-3.5 h-3.5 text-primary" />
          <span>Status</span>
        </button>
      </div>

      {}
      <div className="bg-bg-card rounded-2xl border border-border-nav shadow-soft overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-bg-page/50 border-b border-border-nav">
                <th className="px-4 py-3 text-[9px] font-bold uppercase tracking-widest text-text-muted">Order Info</th>
                <th className="px-4 py-3 text-[9px] font-bold uppercase tracking-widest text-text-muted">Customer</th>
                <th className="px-4 py-3 text-[9px] font-bold uppercase tracking-widest text-text-muted">Amount</th>
                <th className="px-4 py-3 text-[9px] font-bold uppercase tracking-widest text-text-muted">Payment</th>
                <th className="px-4 py-3 text-[9px] font-bold uppercase tracking-widest text-text-muted">Status</th>
                <th className="px-4 py-3 text-[9px] font-bold uppercase tracking-widest text-text-muted text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-nav">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-4 py-16 text-center">
                    <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto mb-2" />
                    <span className="text-[10px] font-bold text-text-muted">Loading...</span>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-16 text-center">
                    <p className="text-[11px] font-bold text-text-muted">No orders found.</p>
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id} className="hover:bg-bg-page/30 transition-colors group">
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="font-bold text-text-heading text-xs">#{order._id.slice(-6).toUpperCase()}</span>
                        <span className="text-[9px] text-text-muted flex items-center gap-1">
                          <Calendar className="w-2 h-2" />
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-[9px]">
                          {order.userName?.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[11px] font-bold text-text-heading">{order.userName}</span>
                          <span className="text-[9px] text-text-muted">{order.userEmail}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-[11px] font-black text-text-heading">${order.totalAmount.toFixed(2)}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[9px] font-bold uppercase tracking-tight text-primary bg-primary/5 px-2 py-0.5 rounded-md">
                        {order.paymentMethod}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className={cn(
                        "inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-tight px-2.5 py-0.5 rounded-full",
                        order.status === "Pending" ? "bg-orange-100 text-orange-600" :
                          order.status === "Confirmed" ? "bg-blue-100 text-blue-600" :
                            order.status === "Processing" ? "bg-purple-100 text-purple-600" :
                              order.status === "Dispatched" ? "bg-cyan-100 text-cyan-600" :
                                order.status === "Out for Delivery" ? "bg-indigo-100 text-indigo-600" :
                                  order.status === "Delivered" ? "bg-green-100 text-green-600" :
                                    "bg-red-100 text-red-600"
                      )}>
                        {order.status}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 hover:bg-primary/10 text-text-muted hover:text-primary rounded-xl transition-all border border-transparent hover:border-primary/20"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => deleteOrder(order._id)}
                          className="p-2 hover:bg-red-50 text-text-muted hover:text-red-600 rounded-xl transition-all border border-transparent hover:border-red-100"
                          title="Delete Order"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        {}
                        {order.status === "Pending" && (
                          <button
                            onClick={() => updateOrderStatus(order._id, 'Confirmed')}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all text-[10px] font-bold uppercase tracking-tight border border-blue-100"
                          >
                            <CheckCircle className="w-3 h-3" />
                            <span>Confirm</span>
                          </button>
                        )}
                        {order.status === "Confirmed" && (
                          <button
                            onClick={() => updateOrderStatus(order._id, 'Processing')}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-all text-[10px] font-bold uppercase tracking-tight border border-purple-100"
                          >
                            <Loader2 className="w-3 h-3 animate-spin" />
                            <span>Process</span>
                          </button>
                        )}
                        {order.status === "Processing" && (
                          <button
                            onClick={() => updateOrderStatus(order._id, 'Dispatched')}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-50 text-cyan-600 rounded-lg hover:bg-cyan-100 transition-all text-[10px] font-bold uppercase tracking-tight border border-cyan-100"
                          >
                            <Truck className="w-3 h-3" />
                            <span>Dispatch</span>
                          </button>
                        )}
                        {order.status === "Dispatched" && (
                          <button
                            onClick={() => updateOrderStatus(order._id, 'Out for Delivery')}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-all text-[10px] font-bold uppercase tracking-tight border border-indigo-100"
                          >
                            <MapPin className="w-3 h-3" />
                            <span>Out for Delivery</span>
                          </button>
                        )}
                        {order.status === "Out for Delivery" && (
                          <button
                            onClick={() => updateOrderStatus(order._id, 'Delivered')}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-all text-[10px] font-bold uppercase tracking-tight border border-green-100"
                          >
                            <ShieldCheck className="w-3 h-3" />
                            <span>Complete</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Drawer.Root direction="right" open={!!selectedOrder} onOpenChange={(val) => !val && setSelectedOrder(null)}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm" />
          <Drawer.Content className="fixed top-2 bottom-2 right-2 w-[calc(100%-16px)] md:top-4 md:bottom-4 md:right-4 md:w-[700px] lg:w-[800px] bg-bg-card shadow-[0_0_40px_rgba(0,0,0,0.1)] rounded-2xl md:rounded-3xl z-[110] flex flex-col focus:outline-none overflow-hidden border border-border-nav">
            <Drawer.Title className="sr-only">Order Details</Drawer.Title>
            <Drawer.Description className="sr-only">View details of selected order</Drawer.Description>
            {selectedOrder && (
              <div className="p-5 md:p-8 flex-1 overflow-y-auto custom-scrollbar">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg md:text-xl font-bold text-text-heading">Order Details</h2>
                    <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest mt-0.5">#{selectedOrder._id.toUpperCase()}</p>
                  </div>
                  <button onClick={() => setSelectedOrder(null)} className="p-1.5 hover:bg-bg-page rounded-full transition-all">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
                  {}
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-bg-page p-3 rounded-xl border border-border-nav">
                        <div className="text-[9px] font-bold uppercase tracking-widest text-text-muted mb-0.5">Customer</div>
                        <div className="text-[11px] font-bold text-text-heading truncate">{selectedOrder.userName}</div>
                      </div>
                      <div className="bg-bg-page p-3 rounded-xl border border-border-nav">
                        <div className="text-[9px] font-bold uppercase tracking-widest text-text-muted mb-0.5">Total</div>
                        <div className="text-[11px] font-black text-primary">${selectedOrder.totalAmount.toFixed(2)}</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-text-heading">Products</h4>
                      <div className="space-y-2">
                        {selectedOrder.products.map((item, i) => (
                          <div key={i} className="flex items-center justify-between p-2.5 bg-bg-card rounded-xl border border-border-nav group">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg overflow-hidden bg-bg-page border border-border-nav shrink-0">
                                <img src={item.image} alt="" className="w-full h-full object-cover" />
                              </div>
                              <div>
                                <div className="text-[11px] font-bold text-text-heading line-clamp-1">{item.name}</div>
                                <div className="text-[9px] text-text-muted">${item.price} x {item.quantity}</div>
                              </div>
                            </div>
                            <div className="text-[11px] font-black text-text-heading">${(item.price * item.quantity).toFixed(2)}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-text-heading flex items-center justify-between">
                      <span>Screenshot ({selectedOrder.paymentMethod})</span>
                      <a href={selectedOrder.paymentScreenshot} target="_blank" className="text-primary hover:underline flex items-center gap-1 normal-case font-bold">
                        <ExternalLink className="w-3 h-3" />
                        View
                      </a>
                    </h4>
                    <div className="aspect-video rounded-xl overflow-hidden border-2 border-bg-page shadow-inner bg-black/5 flex items-center justify-center">
                      <img
                        src={selectedOrder.paymentScreenshot}
                        alt="Payment Screenshot"
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                      {selectedOrder.status === 'Pending' && (
                        <button
                          onClick={() => updateOrderStatus(selectedOrder._id, 'Confirmed')}
                          className="flex-grow bg-blue-600 text-white py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                        >
                          Confirm Order
                        </button>
                      )}
                      {selectedOrder.status === 'Confirmed' && (
                        <button
                          onClick={() => updateOrderStatus(selectedOrder._id, 'Processing')}
                          className="flex-grow bg-purple-600 text-white py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-purple-700 transition-all flex items-center justify-center gap-2"
                        >
                          Process Order
                        </button>
                      )}
                      {selectedOrder.status === 'Processing' && (
                        <button
                          onClick={() => updateOrderStatus(selectedOrder._id, 'Dispatched')}
                          className="flex-grow bg-cyan-600 text-white py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-cyan-700 transition-all flex items-center justify-center gap-2"
                        >
                          Dispatch Order
                        </button>
                      )}
                      {selectedOrder.status === 'Dispatched' && (
                        <button
                          onClick={() => updateOrderStatus(selectedOrder._id, 'Out for Delivery')}
                          className="flex-grow bg-indigo-600 text-white py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                        >
                          Out for Delivery
                        </button>
                      )}
                      {selectedOrder.status === 'Out for Delivery' && (
                        <button
                          onClick={() => updateOrderStatus(selectedOrder._id, 'Delivered')}
                          className="flex-grow bg-green-600 text-white py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                        >
                          Mark Delivered
                        </button>
                      )}
                      {['Pending', 'Confirmed', 'Processing'].includes(selectedOrder.status) && (
                        <button
                          onClick={() => updateOrderStatus(selectedOrder._id, 'Cancelled')}
                          className="bg-red-50 text-red-600 px-4 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-red-100 transition-all"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </div>
  );
};

export default OrdersAdmin;
