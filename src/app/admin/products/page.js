"use client";

import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  MoreHorizontal,
  X,
  Loader2,
  Package,
  UploadCloud,
  Image as ImageIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const ProductsAdmin = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    description: '',
    image: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isSearchOverlayOpen, setIsSearchOverlayOpen] = useState(false);
  const [dbSearchQuery, setDbSearchQuery] = useState('');
  const [dbResults, setDbResults] = useState([]);
  const [dbLoading, setDbLoading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });
      const data = await res.json();
      if (data.success) {
        setFormData(prev => ({ ...prev, image: data.url }));
        toast.success('Image uploaded successfully');
      } else {
        toast.error('Upload failed');
      }
    } catch (error) {
      toast.error('Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    if (isModalOpen || isSearchOverlayOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen, isSearchOverlayOpen]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.success) {
        setProducts(data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({ name: '', category: '', price: '', stock: '', description: '', image: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      description: product.description || '',
      image: product.image
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const url = editingProduct ? `/api/products/${editingProduct._id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock)
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(editingProduct ? 'Product updated successfully' : 'Product added successfully');
        setIsModalOpen(false);
        fetchProducts();
      } else {
        toast.error(data.error || 'Something went wrong');
      }
    } catch (error) {
      toast.error(editingProduct ? 'Failed to update product' : 'Failed to add product');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast.success('Product deleted');
        setProducts(products.filter(p => p._id !== id));
      }
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const searchDatabase = async (query) => {
    if (query.length < 3) return;
    setDbLoading(true);
    try {
      const res = await fetch(`https://rxnav.nlm.nih.gov/REST/approximateTerm.json?term=${query}`);
      const data = await res.json();
      if (data.approximateGroup?.candidate) {
        const list = data.approximateGroup.candidate
          .filter(item => item.name)
          .reduce((acc, current) => {
            const x = acc.find(item => item.rxcui === current.rxcui);
            if (!x) return acc.concat([current]);
            return acc;
          }, []);
        setDbResults(list.slice(0, 5));
      } else {
        setDbResults([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDbLoading(false);
    }
  };

  const autoFillProduct = async (drug) => {
    setDbLoading(true);
    try {
      const classRes = await fetch(`https://rxnav.nlm.nih.gov/REST/rxclass/class/byRxcui.json?rxcui=${drug.rxcui}&relaSource=ATC`);
      const classData = await classRes.json();
      const category = classData.rxclassDrugInfoList?.rxclassDrugInfo?.[0]?.rxclassMinConceptItem?.className || "General Medication";

      setFormData(prev => ({
        ...prev,
        name: drug.name,
        category: category,
        description: `${drug.name} (RXCUI: ${drug.rxcui}). ${drug.synonym || "Pharmaceutical product"}.`
      }));
      setIsSearchOverlayOpen(false);
      toast.success('Details auto-filled!');
    } catch (err) {
      toast.error('Failed to fetch deep details');
    } finally {
      setDbLoading(false);
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-text-heading">Product Inventory</h1>
          <p className="text-[10px] text-text-muted font-medium mt-0.5 uppercase tracking-wide">Manage pharmacy stock</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl font-bold text-xs hover:bg-primary-hover shadow-lg shadow-primary/10 transition-all active:scale-95 w-full sm:w-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-3.5 h-3.5" />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full bg-white border border-border-nav rounded-xl py-2.5 pl-9 pr-4 focus:outline-none focus:border-primary shadow-soft text-xs font-medium"
          />
        </div>
        <button className="flex items-center justify-center gap-2 bg-white border border-border-nav px-4 py-2.5 rounded-xl font-bold text-xs hover:bg-gray-50 transition-all shadow-soft shrink-0 cursor-pointer">
          <Filter className="w-3.5 h-3.5 text-primary" />
          <span>Filters</span>
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl border border-border-nav shadow-soft overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-bg-page/50 border-b border-border-nav">
                <th className="px-4 py-3 text-[9px] font-bold uppercase tracking-widest text-text-muted">Product</th>
                <th className="px-4 py-3 text-[9px] font-bold uppercase tracking-widest text-text-muted">Category</th>
                <th className="px-4 py-3 text-[9px] font-bold uppercase tracking-widest text-text-muted">Stock</th>
                <th className="px-4 py-3 text-[9px] font-bold uppercase tracking-widest text-text-muted">Price</th>
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
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-16 text-center">
                    <Package className="w-10 h-10 text-gray-200 mx-auto mb-2" />
                    <p className="text-xs font-bold text-text-muted">No products found.</p>
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product._id} className="hover:bg-bg-page/30 transition-colors group">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg overflow-hidden border border-border-nav bg-bg-page shrink-0">
                          <img src={product.image} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="font-bold text-text-heading text-xs truncate max-w-[150px]">{product.name}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[9px] font-bold text-text-body bg-gray-100 px-2 py-0.5 rounded-full">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-[11px] font-bold text-text-heading">{product.stock} Units</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-[11px] font-black text-primary">${product.price.toFixed(2)}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className={cn(
                        "inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-tight px-2.5 py-0.5 rounded-full",
                        product.stock > 10 ? "bg-green-100 text-green-600" :
                          product.stock > 0 ? "bg-orange-100 text-orange-600" :
                            "bg-red-100 text-red-600"
                      )}>
                        <div className={cn(
                          "w-1 h-1 rounded-full",
                          product.stock > 10 ? "bg-green-500" :
                            product.stock > 0 ? "bg-orange-500" :
                              "bg-red-500"
                        )} />
                        {product.stock > 10 ? "In Stock" : product.stock > 0 ? "Low Stock" : "Out of Stock"}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(product)}
                          className="p-1.5 hover:bg-primary/10 text-text-muted hover:text-primary rounded-lg transition-all cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="p-1.5 hover:bg-red-500/10 text-text-muted hover:text-red-500 rounded-lg transition-all cursor-pointer"
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

      {/* Product Modal (Add/Edit) */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-text-heading/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col"
            >
              <div className="p-4 sm:p-6 md:p-8 overflow-y-auto custom-scrollbar">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h2 className="text-base sm:text-lg font-bold text-text-heading">
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-1 sm:p-1.5 hover:bg-bg-page rounded-full transition-all cursor-pointer text-text-muted"
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 sm:gap-y-5">
                    {/* Left Column: Basic Info */}
                    <div className="space-y-3 sm:space-y-4">
                      <div className="space-y-1 sm:space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-text-muted">Product Name</label>
                          <button 
                            type="button"
                            onClick={() => setIsSearchOverlayOpen(true)}
                            className="text-[8px] font-black uppercase tracking-widest text-primary hover:underline flex items-center gap-1"
                          >
                            <Search className="w-2.5 h-2.5" />
                            Auto-fill from Database
                          </button>
                        </div>
                        <input
                          required
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. Paracetamol 500mg"
                          className="w-full bg-bg-page border-none rounded-xl py-2.5 sm:py-3 px-3 sm:px-4 focus:ring-1 ring-primary/20 text-[11px] font-bold"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1 sm:space-y-1.5">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-text-muted">Price ($)</label>
                          <input
                            required
                            type="number"
                            step="0.01"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            placeholder="0.00"
                            className="w-full bg-bg-page border-none rounded-xl py-2.5 sm:py-3 px-3 sm:px-4 focus:ring-1 ring-primary/20 text-[11px] font-bold"
                          />
                        </div>
                        <div className="space-y-1 sm:space-y-1.5">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-text-muted">Stock</label>
                          <input
                            required
                            type="number"
                            value={formData.stock}
                            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                            placeholder="0"
                            className="w-full bg-bg-page border-none rounded-xl py-2.5 sm:py-3 px-3 sm:px-4 focus:ring-1 ring-primary/20 text-[11px] font-bold"
                          />
                        </div>
                      </div>

                      <div className="space-y-1 sm:space-y-1.5">
                        <label className="text-[9px] font-bold uppercase tracking-wider text-text-muted">Category</label>
                        <input
                          required
                          type="text"
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          placeholder="e.g. Pain Relief"
                          className="w-full bg-bg-page border-none rounded-xl py-2.5 sm:py-3 px-3 sm:px-4 focus:ring-1 ring-primary/20 text-[11px] font-bold"
                        />
                      </div>
                    </div>

                    {/* Right Column: Image & Description */}
                    <div className="space-y-3 sm:space-y-4">
                      <div className="space-y-1 sm:space-y-1.5">
                        <label className="text-[9px] font-bold uppercase tracking-wider text-text-muted">Product Image</label>
                        <div className="relative group h-[115px]">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          />
                          <div className={cn(
                            "w-full h-full bg-bg-page border-2 border-dashed border-border-nav rounded-xl flex flex-col items-center justify-center gap-2 transition-all",
                            formData.image ? "border-primary/50 bg-primary/5" : "hover:bg-primary/5 hover:border-primary/30"
                          )}>
                            {uploading ? (
                              <Loader2 className="w-5 h-5 animate-spin text-primary" />
                            ) : formData.image ? (
                              <div className="flex items-center gap-3 px-4">
                                <div className="w-14 h-14 rounded-lg overflow-hidden border border-primary/20 shrink-0">
                                  <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-grow min-w-0 text-left">
                                  <p className="text-[9px] font-bold text-primary truncate leading-tight">Image Uploaded</p>
                                  <p className="text-[8px] text-text-muted uppercase tracking-tighter mt-0.5">Click to change</p>
                                </div>
                              </div>
                            ) : (
                              <>
                                <UploadCloud className="w-5 h-5 text-primary/50" />
                                <div className="text-center px-2">
                                  <p className="text-[9px] font-bold text-text-heading leading-tight">Drop your image here</p>
                                  <p className="text-[8px] text-text-muted uppercase tracking-tighter">PNG, JPG, WebP</p>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1 sm:space-y-1.5">
                        <label className="text-[9px] font-bold uppercase tracking-wider text-text-muted">Description</label>
                        <textarea
                          rows="2"
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          placeholder="Brief product details..."
                          className="w-full bg-bg-page border-none rounded-xl py-2.5 sm:py-3 px-3 sm:px-4 focus:ring-1 ring-primary/20 text-[11px] font-bold resize-none h-[72px]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      disabled={submitting}
                      className="w-full md:w-[200px] bg-primary text-white py-3.5 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                    >
                      {submitting ? (
                        <div className="flex items-center justify-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Saving...</span>
                        </div>
                      ) : (editingProduct ? 'Save Changes' : 'Add Product')}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Database Search Overlay */}
      <AnimatePresence>
        {isSearchOverlayOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSearchOverlayOpen(false)}
              className="absolute inset-0 bg-text-heading/20 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-border-nav"
            >
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-black uppercase tracking-widest text-text-heading">Medical DB Search</h3>
                  <button onClick={() => setIsSearchOverlayOpen(false)} className="text-text-muted hover:text-primary transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
                  <input 
                    autoFocus
                    type="text"
                    placeholder="Search medicine name..."
                    className="w-full bg-bg-page border-none rounded-xl py-2.5 pl-9 pr-4 text-[11px] font-bold focus:ring-1 ring-primary/20"
                    value={dbSearchQuery}
                    onChange={(e) => {
                      setDbSearchQuery(e.target.value);
                      searchDatabase(e.target.value);
                    }}
                  />
                </div>

                <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
                  {dbLoading && !dbResults.length ? (
                    <div className="py-8 text-center">
                      <Loader2 className="w-5 h-5 animate-spin text-primary mx-auto mb-2" />
                      <p className="text-[9px] font-bold text-text-muted uppercase">Searching database...</p>
                    </div>
                  ) : dbResults.length > 0 ? (
                    dbResults.map((drug) => (
                      <button
                        key={drug.rxcui}
                        onClick={() => autoFillProduct(drug)}
                        className="w-full text-left p-3 rounded-xl hover:bg-primary/5 border border-transparent hover:border-primary/10 transition-all group"
                      >
                        <p className="text-[11px] font-bold text-text-heading group-hover:text-primary">{drug.name}</p>
                        <p className="text-[8px] text-text-muted uppercase font-medium mt-0.5">ID: {drug.rxcui}</p>
                      </button>
                    ))
                  ) : dbSearchQuery.length > 2 ? (
                    <p className="py-8 text-center text-[9px] font-bold text-text-muted uppercase">No matches found</p>
                  ) : (
                    <p className="py-8 text-center text-[9px] font-bold text-text-muted uppercase">Start typing to search...</p>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductsAdmin;
