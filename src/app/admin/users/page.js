"use client";

import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  MoreHorizontal,
  Mail,
  Calendar,
  Shield,
  Trash2,
  Edit,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.success) {
        setUsers(data.data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setUsers(prev => prev.filter(user => user._id !== id));
        toast.success('User deleted successfully');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-text-heading">User Management</h1>
          <p className="text-[10px] text-text-muted font-medium mt-0.5 uppercase tracking-wide">Manage accounts</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-3.5 h-3.5" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-bg-card border border-border-nav rounded-xl py-2.5 pl-9 pr-4 focus:outline-none focus:border-primary shadow-soft text-xs font-medium"
          />
        </div>
        <div className="bg-bg-card border border-border-nav px-4 py-2.5 rounded-xl font-bold text-[10px] text-primary shadow-soft flex items-center gap-2">
          <Shield className="w-3.5 h-3.5" />
          {users.length} TOTAL USERS
        </div>
      </div>

      <div className="bg-bg-card rounded-2xl border border-border-nav shadow-soft overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-bg-page/50 border-b border-border-nav">
                <th className="px-4 py-3 text-[9px] font-bold uppercase tracking-widest text-text-muted">User</th>
                <th className="px-4 py-3 text-[9px] font-bold uppercase tracking-widest text-text-muted">Role</th>
                <th className="px-4 py-3 text-[9px] font-bold uppercase tracking-widest text-text-muted">Joined</th>
                <th className="px-4 py-3 text-[9px] font-bold uppercase tracking-widest text-text-muted text-center">Status</th>
                <th className="px-4 py-3 text-[9px] font-bold uppercase tracking-widest text-text-muted text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-nav">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-4 py-16 text-center">
                    <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto mb-2" />
                    <span className="text-[10px] font-bold text-text-muted">Fetching Database...</span>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-4 py-16 text-center text-text-muted text-[10px] font-bold uppercase tracking-widest">
                    No users found matching your search
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-bg-page/30 transition-colors group">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-[10px] uppercase">
                          {user.name.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[11px] font-bold text-text-heading">{user.name}</span>
                          <span className="text-[9px] text-text-muted flex items-center gap-1">
                            <Mail className="w-2.5 h-2.5" />
                            {user.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className={cn(
                        "inline-flex items-center gap-1 text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md",
                        user.role?.toLowerCase() === 'admin' ? "bg-purple-100 text-purple-600" : "bg-blue-100 text-blue-600"
                      )}>
                        <Shield className="w-2.5 h-2.5" />
                        {user.role}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-[9px] font-bold text-text-muted flex items-center gap-1">
                        <Calendar className="w-2.5 h-2.5" />
                        {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className={cn(
                        "w-1.5 h-1.5 rounded-full mx-auto bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]"
                      )} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="p-1.5 hover:bg-red-500/10 text-text-muted hover:text-red-500 rounded-lg transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
