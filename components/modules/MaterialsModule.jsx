"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  Layers,
  Plus,
  Search,
  Filter,
  SlidersHorizontal,
  AlertTriangle,
  Boxes,
  MapPin,
  X,
} from "lucide-react";
import { formatINR } from "@/lib/utils";

export function MaterialsModule() {
  const { data, addRawMaterial, updateRawMaterial, adjustStock, setActiveView } = useApp();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [adjustModalOpen, setAdjustModalOpen] = useState(false);
  const [selectedMat, setSelectedMat] = useState(null);
  const [adjustQty, setAdjustQty] = useState(0);
  const [adjustReason, setAdjustReason] = useState("Monthly Cycle Count Verification");

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    category: "Sheet Goods",
    unit: "SHEET",
    currentStock: 50,
    reorderLevel: 25,
    minStock: 20,
    maxStock: 200,
    unitCost: 1500,
    storageLocation: "Rack A-01, Wood Store",
    batchNo: "BATCH-2603",
  });

  const categories = ["all", "Sheet Goods", "Metal & Tubes", "Hardware & Fittings", "Chemicals & Adhesives", "Packaging"];

  const filtered = (data.rawMaterials || []).filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.code.toLowerCase().includes(search.toLowerCase()) ||
      m.storageLocation.toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === "all" || m.category === categoryFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "low" && m.currentStock <= m.reorderLevel) ||
      (statusFilter === "adequate" && m.currentStock > m.reorderLevel);
    return matchesSearch && matchesCat && matchesStatus;
  });

  const handleOpenAdd = () => {
    setFormData({
      code: `RM-MAT-${Math.floor(10 + Math.random() * 90)}`,
      name: "",
      category: "Sheet Goods",
      unit: "SHEET",
      currentStock: 40,
      reorderLevel: 25,
      minStock: 20,
      maxStock: 200,
      unitCost: 1200,
      storageLocation: "Bay 1, Store Shelf",
      batchNo: `BAT-${Math.floor(100 + Math.random() * 900)}`,
    });
    setAddModalOpen(true);
  };

  const handleOpenAdjust = (mat) => {
    setSelectedMat(mat);
    setAdjustQty(mat.currentStock);
    setAdjustReason("Monthly Physical Cycle Count Audit");
    setAdjustModalOpen(true);
  };

  const handleSaveAdjust = (e) => {
    e.preventDefault();
    if (!selectedMat) return;
    adjustStock(selectedMat.id, adjustQty, adjustReason);
    setAdjustModalOpen(false);
  };

  const handleSaveAdd = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.code.trim()) return;
    addRawMaterial(formData);
    setAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-white border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Raw Materials & Consumables</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor inventory quantities, storage locations, weighted unit costs, and reorder levels.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveView("mrp")}
            className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Check MRP Shortages
          </button>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg flex items-center gap-2 shadow-2xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Raw Material</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search material code, name, bin..."
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-slate-400"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
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

          <div className="flex items-center gap-2">
            <span className="text-slate-500">Stock Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-700 font-medium focus:outline-none"
            >
              <option value="all">All Levels</option>
              <option value="low">Low Stock Only</option>
              <option value="adequate">Adequate Stock</option>
            </select>
          </div>
        </div>
      </div>

      {/* Materials Table */}
      <div className="rounded-xl bg-white border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-4">Material Code</th>
                <th className="p-4">Item Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">Location / Bin</th>
                <th className="p-4 text-right">Unit Cost</th>
                <th className="p-4 text-right">On-Hand Stock</th>
                <th className="p-4 text-right">Reserved</th>
                <th className="p-4 text-right">Available</th>
                <th className="p-4 text-right">Reorder Level</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((mat) => {
                const available = Math.max(0, (mat.currentStock || 0) - (mat.reservedStock || 0));
                const isLow = mat.currentStock <= mat.reorderLevel;
                return (
                  <tr key={mat.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4 font-mono font-bold text-slate-900">{mat.code}</td>
                    <td className="p-4">
                      <p className="font-semibold text-slate-900">{mat.name}</p>
                      <p className="text-[11px] text-slate-500 font-mono">Lot: {mat.batchNo || "BATCH-2603"}</p>
                    </td>
                    <td className="p-4 text-slate-600">{mat.category}</td>
                    <td className="p-4 text-slate-600">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{mat.storageLocation}</span>
                      </span>
                    </td>
                    <td className="p-4 text-right font-mono text-slate-900 font-medium">
                      {formatINR(mat.unitCost)} / {mat.unit}
                    </td>
                    <td className="p-4 text-right font-mono font-bold text-slate-900">
                      {mat.currentStock} {mat.unit}
                    </td>
                    <td className="p-4 text-right font-mono text-amber-600 font-semibold">
                      {mat.reservedStock || 0} {mat.unit}
                    </td>
                    <td className="p-4 text-right font-mono text-emerald-600 font-bold">
                      {available} {mat.unit}
                    </td>
                    <td className="p-4 text-right font-mono text-slate-500">
                      {mat.reorderLevel} {mat.unit}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                          isLow ? "bg-rose-100 text-rose-800" : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {isLow ? "Low Stock" : "Adequate"}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleOpenAdjust(mat)}
                        className="px-2.5 py-1 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded font-medium text-[11px] transition-colors"
                      >
                        Adjust Stock
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adjust Stock Modal */}
      {adjustModalOpen && selectedMat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm">
                Physical Stock Adjustment: {selectedMat.code}
              </h3>
              <button onClick={() => setAdjustModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAdjust} className="p-6 space-y-4 text-xs">
              <div>
                <p className="text-slate-700 font-semibold">{selectedMat.name}</p>
                <p className="text-slate-500 text-[11px]">Location: {selectedMat.storageLocation}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div>
                  <span className="text-slate-500">Current Recorded Stock:</span>
                  <p className="text-sm font-bold font-mono text-slate-900 mt-0.5">
                    {selectedMat.currentStock} {selectedMat.unit}
                  </p>
                </div>
                <div>
                  <span className="text-slate-500">Active Reserved:</span>
                  <p className="text-sm font-bold font-mono text-amber-600 mt-0.5">
                    {selectedMat.reservedStock || 0} {selectedMat.unit}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Verified Physical Stock ({selectedMat.unit}) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  required
                  value={adjustQty}
                  onChange={(e) => setAdjustQty(Number(e.target.value))}
                  className="w-full p-2 border border-slate-200 rounded-lg font-mono text-sm focus:outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Audit Adjustment Reason *</label>
                <select
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg bg-white focus:outline-none"
                >
                  <option value="Physical Cycle Count Audit">Physical Cycle Count Audit</option>
                  <option value="Damaged / Shelf Spoilage Write-off">Damaged / Shelf Spoilage Write-off</option>
                  <option value="Supplier Replacement Delivery">Supplier Replacement Delivery</option>
                  <option value="Initial Opening Stock Correction">Initial Opening Stock Correction</option>
                </select>
              </div>

              <div className="p-3 bg-amber-50 rounded border border-amber-200 text-amber-900 text-[11px]">
                Stock adjustments immediately update usable inventory and record a compensating entry into the Stock Movements audit ledger.
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAdjustModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800"
                >
                  Confirm Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Material Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm">Add New Raw Material</h3>
              <button onClick={() => setAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAdd} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Material Code *</label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="Sheet Goods">Sheet Goods</option>
                    <option value="Metal & Tubes">Metal & Tubes</option>
                    <option value="Hardware & Fittings">Hardware & Fittings</option>
                    <option value="Chemicals & Adhesives">Chemicals & Adhesives</option>
                    <option value="Packaging">Packaging</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Material Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Commercial Plywood 18mm"
                  className="w-full p-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Unit of Measure</label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="SHEET">SHEET</option>
                    <option value="MTR">MTR</option>
                    <option value="PCS">PCS</option>
                    <option value="KG">KG</option>
                    <option value="LTR">LTR</option>
                    <option value="BOX">BOX</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Unit Cost (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.unitCost}
                    onChange={(e) => setFormData({ ...formData, unitCost: Number(e.target.value) })}
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Reorder Safety Level</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.reorderLevel}
                    onChange={(e) => setFormData({ ...formData, reorderLevel: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Storage Location / Bin</label>
                  <input
                    type="text"
                    value={formData.storageLocation}
                    onChange={(e) => setFormData({ ...formData, storageLocation: e.target.value })}
                    placeholder="Rack A-01, Wood Store"
                    className="w-full p-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800"
                >
                  Save Material
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
