"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  Package,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  FileSpreadsheet,
  Edit2,
  X,
} from "lucide-react";
import { formatINR } from "@/lib/utils";

export function ProductsModule() {
  const { data, addProduct, updateProduct, toggleProductStatus, setActiveView } = useApp();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    category: "Executive Furniture",
    type: "Finished Good",
    unit: "PCS",
    leadTimeDays: 4,
    standardCost: 5000,
    sellingPrice: 8500,
    minStock: 5,
    maxStock: 30,
    reorderLevel: 8,
    currentStock: 0,
    description: "",
  });

  const categories = ["all", "Executive Furniture", "Seating", "Industrial Storage", "Modular Systems"];

  const filtered = (data.products || []).filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.code.toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === "all" || p.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setFormData({
      code: `FD-${Math.floor(100 + Math.random() * 900)}`,
      name: "",
      category: "Executive Furniture",
      type: "Finished Good",
      unit: "PCS",
      leadTimeDays: 4,
      standardCost: 5000,
      sellingPrice: 9000,
      minStock: 5,
      maxStock: 30,
      reorderLevel: 8,
      currentStock: 10,
      description: "",
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (prod) => {
    setEditingProduct(prod);
    setFormData(prod);
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.code.trim()) return;

    if (editingProduct) {
      updateProduct({ ...editingProduct, ...formData });
    } else {
      addProduct(formData);
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-white border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Product Master Catalog</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage finished goods, standard BOM references, safety buffers, and selling rates.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg flex items-center gap-2 shadow-2xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by code or product title..."
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-slate-400"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-500">Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-2.5 py-1.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-700 font-medium focus:outline-none"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === "all" ? "All Categories" : c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-xl bg-white border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-4">SKU / Code</th>
                <th className="p-4">Product Name</th>
                <th className="p-4">Category</th>
                <th className="p-4 text-right">On-Hand Stock</th>
                <th className="p-4 text-right">Reserved</th>
                <th className="p-4 text-right">Available</th>
                <th className="p-4 text-right">Standard Cost</th>
                <th className="p-4 text-right">Selling Price</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((prod) => {
                const available = Math.max(0, (prod.currentStock || 0) - (prod.reservedStock || 0));
                return (
                  <tr key={prod.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4 font-mono font-bold text-slate-900">{prod.code}</td>
                    <td className="p-4">
                      <p className="font-semibold text-slate-900">{prod.name}</p>
                      <p className="text-[11px] text-slate-500 truncate max-w-xs">{prod.description}</p>
                    </td>
                    <td className="p-4 text-slate-600">{prod.category}</td>
                    <td className="p-4 text-right font-mono font-bold text-slate-900">
                      {prod.currentStock} {prod.unit}
                    </td>
                    <td className="p-4 text-right font-mono text-amber-600 font-medium">
                      {prod.reservedStock || 0} {prod.unit}
                    </td>
                    <td className="p-4 text-right font-mono text-emerald-600 font-bold">
                      {available} {prod.unit}
                    </td>
                    <td className="p-4 text-right font-mono text-slate-600">{formatINR(prod.standardCost)}</td>
                    <td className="p-4 text-right font-mono font-bold text-slate-900">{formatINR(prod.sellingPrice)}</td>
                    <td className="p-4">
                      <button
                        onClick={() => toggleProductStatus(prod.id)}
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                          prod.active ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {prod.active ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(prod)}
                          className="p-1 text-slate-400 hover:text-slate-800 rounded"
                          title="Edit Product"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setActiveView("bom")}
                          className="p-1 text-slate-400 hover:text-amber-600 rounded"
                          title="View Linked BOM"
                        >
                          <FileSpreadsheet className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm">
                {editingProduct ? `Edit Product: ${editingProduct.code}` : "Register New Finished Product"}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Product Code / SKU *</label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg font-mono focus:outline-none focus:border-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-slate-400"
                  >
                    <option value="Executive Furniture">Executive Furniture</option>
                    <option value="Seating">Seating</option>
                    <option value="Industrial Storage">Industrial Storage</option>
                    <option value="Modular Systems">Modular Systems</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Ergonomic Office Desk"
                  className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Standard Cost (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.standardCost}
                    onChange={(e) => setFormData({ ...formData, standardCost: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.sellingPrice}
                    onChange={(e) => setFormData({ ...formData, sellingPrice: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Opening Stock</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.currentStock}
                    onChange={(e) => setFormData({ ...formData, currentStock: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Specifications & Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Dimensions, finish details, hardware specifications..."
                  className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800"
                >
                  {editingProduct ? "Save Changes" : "Register Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
