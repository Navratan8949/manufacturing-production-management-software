"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  FileSpreadsheet,
  Plus,
  Trash2,
  CheckCircle2,
  Calculator,
  ArrowRight,
  ClipboardList,
  Printer,
  X,
} from "lucide-react";
import { formatINR } from "@/lib/utils";

export function BOMModule() {
  const { data, addBOM, createWorkOrder, setActiveView, setActivePrintDoc } = useApp();
  const [selectedBOMId, setSelectedBOMId] = useState(data.boms[0]?.id || "");
  const [batchMultiplier, setBatchMultiplier] = useState(20);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // New BOM form state
  const [newBOMData, setNewBOMData] = useState({
    bomNumber: "BOM-NEW-04",
    productId: data.products[0]?.id || "",
    version: "1.0",
    scrapAllowancePercent: 4.0,
    items: [
      { materialCode: data.rawMaterials[0]?.code, name: data.rawMaterials[0]?.name, qty: 1.0, unit: data.rawMaterials[0]?.unit, unitCost: data.rawMaterials[0]?.unitCost },
    ],
    notes: "Engineering specification revision.",
  });

  const activeBOM = data.boms.find((b) => b.id === selectedBOMId) || data.boms[0];

  const handleAddItemRow = () => {
    const mat = data.rawMaterials[0];
    setNewBOMData({
      ...newBOMData,
      items: [
        ...newBOMData.items,
        { materialCode: mat.code, name: mat.name, qty: 1.0, unit: mat.unit, unitCost: mat.unitCost },
      ],
    });
  };

  const handleRemoveItemRow = (idx) => {
    setNewBOMData({
      ...newBOMData,
      items: newBOMData.items.filter((_, i) => i !== idx),
    });
  };

  const handleItemMaterialChange = (idx, matCode) => {
    const mat = data.rawMaterials.find((m) => m.code === matCode);
    if (!mat) return;
    const updated = [...newBOMData.items];
    updated[idx] = {
      ...updated[idx],
      materialCode: mat.code,
      name: mat.name,
      unit: mat.unit,
      unitCost: mat.unitCost,
    };
    setNewBOMData({ ...newBOMData, items: updated });
  };

  const handleSaveBOM = (e) => {
    e.preventDefault();
    const prod = data.products.find((p) => p.id === newBOMData.productId);
    const estMatCost = newBOMData.items.reduce((sum, i) => sum + i.qty * i.unitCost, 0);
    const estLabour = Math.round(estMatCost * 0.35);
    const estMachine = Math.round(estMatCost * 0.18);
    const estOverhead = Math.round(estMatCost * 0.12);

    const bomToSave = {
      ...newBOMData,
      productCode: prod?.code || "PRD-NEW",
      productName: prod?.name || "Custom Product",
      batchSize: 1,
      estimatedMaterialCost: estMatCost,
      estimatedLabourCost: estLabour,
      estimatedMachineCost: estMachine,
      estimatedOverheadCost: estOverhead,
      totalEstimatedCost: estMatCost + estLabour + estMachine + estOverhead,
      effectiveDate: new Date().toISOString().slice(0, 10),
    };
    addBOM(bomToSave);
    setSelectedBOMId(bomToSave.id);
    setCreateModalOpen(false);
  };

  const handleLaunchWorkOrder = () => {
    if (!activeBOM) return;
    const wo = createWorkOrder({
      productId: activeBOM.productId,
      productCode: activeBOM.productCode,
      productName: activeBOM.productName,
      bomId: activeBOM.id,
      bomVersion: activeBOM.version,
      plannedQuantity: batchMultiplier,
      priority: "High",
      plannedStartDate: new Date().toISOString().slice(0, 10),
      plannedCompletionDate: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
      assignedMachineId: data.machines[0]?.id,
      machineName: data.machines[0]?.name,
      supervisorName: data.employees[0]?.name,
      assignedTeam: data.employees[0]?.assignedTeam,
      estimatedCost: (activeBOM.totalEstimatedCost || 8000) * batchMultiplier,
      notes: `Launched directly from BOM ${activeBOM.bomNumber}`,
    });
    setActiveView("work-orders");
  };

  return (
    <div className="space-y-6">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-white border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Bill of Materials (BOM) Studio</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Architect component trees, cutting wastage allowances, batch scaling, and component costing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCreateModalOpen(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg flex items-center gap-2 shadow-2xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create New BOM</span>
          </button>
        </div>
      </div>

      {/* BOM Selector & Version Bar */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <span className="font-semibold text-slate-700">Active BOM:</span>
          <select
            value={selectedBOMId}
            onChange={(e) => setSelectedBOMId(e.target.value)}
            className="px-3 py-1.5 border border-slate-200 rounded-lg bg-slate-50 font-bold text-slate-900 focus:outline-none"
          >
            {data.boms.map((b) => (
              <option key={b.id} value={b.id}>
                {b.bomNumber} — {b.productName} (v{b.version})
              </option>
            ))}
          </select>
        </div>

        {/* Batch Scaling Simulator */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Calculator className="w-4 h-4 text-amber-500" />
          <span className="text-slate-600 font-medium">Batch Scale Simulator:</span>
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              min="1"
              value={batchMultiplier}
              onChange={(e) => setBatchMultiplier(Math.max(1, Number(e.target.value)))}
              className="w-20 px-2 py-1 border border-slate-200 rounded text-center font-mono font-bold text-slate-900"
            />
            <span className="text-slate-500 font-medium">Units</span>
          </div>

          <button
            onClick={handleLaunchWorkOrder}
            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded font-bold transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <ClipboardList className="w-3.5 h-3.5" />
            <span>Plan Work Order</span>
          </button>
        </div>
      </div>

      {activeBOM && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-slate-500 text-[11px]">Product & Version</span>
              <p className="text-sm font-bold text-slate-900 mt-1">{activeBOM.productName}</p>
              <p className="text-[11px] text-slate-500 font-mono mt-0.5">{activeBOM.productCode} · v{activeBOM.version}</p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-slate-500 text-[11px]">Standard Unit Material Cost</span>
              <p className="text-base font-bold font-mono text-slate-900 mt-1">
                {formatINR(activeBOM.estimatedMaterialCost)}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">Scrap buffer: {activeBOM.scrapAllowancePercent}%</p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-slate-500 text-[11px]">Total Unit Production Cost</span>
              <p className="text-base font-bold font-mono text-emerald-600 mt-1">
                {formatINR(activeBOM.totalEstimatedCost)}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">Labor + Machine + Overhead</p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-slate-500 text-[11px]">Batch ({batchMultiplier} Units) Total Cost</span>
              <p className="text-base font-bold font-mono text-amber-600 mt-1">
                {formatINR((activeBOM.totalEstimatedCost || 0) * batchMultiplier)}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">Estimated manufacturing budget</p>
            </div>
          </div>

          {/* Component Materials Table with Batch Multiplier Math */}
          <div className="rounded-xl bg-white border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-xs">
                  Component Breakdown — Scaled for {batchMultiplier}x {activeBOM.productName}
                </h3>
                <p className="text-[11px] text-slate-500">
                  Includes {activeBOM.scrapAllowancePercent}% standard cutting wastage margin
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-100 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="p-4">Material Code</th>
                    <th className="p-4">Component Material</th>
                    <th className="p-4 text-right">Qty / Unit</th>
                    <th className="p-4 text-right font-bold text-slate-900">Total Req ({batchMultiplier} units)</th>
                    <th className="p-4 text-right">Available in Store</th>
                    <th className="p-4 text-right">Unit Rate</th>
                    <th className="p-4 text-right">Batch Component Cost</th>
                    <th className="p-4">Stock Feasibility</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(activeBOM.items || []).map((item, idx) => {
                    const scrapMultiplier = 1 + (activeBOM.scrapAllowancePercent || 0) / 100;
                    const scaledQty = Number((item.qty * batchMultiplier * scrapMultiplier).toFixed(2));
                    const storeMat = data.rawMaterials.find((m) => m.code === item.materialCode);
                    const availableStock = storeMat ? Math.max(0, storeMat.currentStock - storeMat.reservedStock) : 0;
                    const isSufficient = availableStock >= scaledQty;

                    return (
                      <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                        <td className="p-4 font-mono font-bold text-slate-900">{item.materialCode}</td>
                        <td className="p-4 font-semibold text-slate-900">{item.name}</td>
                        <td className="p-4 text-right font-mono text-slate-600">
                          {item.qty} {item.unit}
                        </td>
                        <td className="p-4 text-right font-mono font-bold text-slate-950">
                          {scaledQty} {item.unit}
                        </td>
                        <td className="p-4 text-right font-mono font-semibold text-slate-700">
                          {availableStock} {item.unit}
                        </td>
                        <td className="p-4 text-right font-mono text-slate-600">
                          {formatINR(item.unitCost)}
                        </td>
                        <td className="p-4 text-right font-mono font-bold text-slate-900">
                          {formatINR(scaledQty * item.unitCost)}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                              isSufficient ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                            }`}
                          >
                            {isSufficient ? "Stock Available" : `Shortage: ${(scaledQty - availableStock).toFixed(1)} ${item.unit}`}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Create BOM Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm">Create New Bill of Materials (BOM)</h3>
              <button onClick={() => setCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveBOM} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">BOM Number *</label>
                  <input
                    type="text"
                    required
                    value={newBOMData.bomNumber}
                    onChange={(e) => setNewBOMData({ ...newBOMData, bomNumber: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Finished Product *</label>
                  <select
                    value={newBOMData.productId}
                    onChange={(e) => setNewBOMData({ ...newBOMData, productId: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg bg-white"
                  >
                    {data.products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.code} — {p.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Scrap Margin (%)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={newBOMData.scrapAllowancePercent}
                    onChange={(e) => setNewBOMData({ ...newBOMData, scrapAllowancePercent: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
              </div>

              {/* Component Rows */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-slate-700 font-bold">Component Materials (Recipe)</label>
                  <button
                    type="button"
                    onClick={handleAddItemRow}
                    className="px-2.5 py-1 text-slate-900 bg-slate-100 hover:bg-slate-200 rounded font-semibold text-[11px] flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Component</span>
                  </button>
                </div>

                <div className="space-y-2 border border-slate-200 rounded-lg p-3 bg-slate-50/50">
                  {newBOMData.items.map((row, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <select
                        value={row.materialCode}
                        onChange={(e) => handleItemMaterialChange(idx, e.target.value)}
                        className="flex-1 p-2 border border-slate-200 rounded bg-white text-xs"
                      >
                        {data.rawMaterials.map((m) => (
                          <option key={m.id} value={m.code}>
                            {m.code} — {m.name} ({m.unit})
                          </option>
                        ))}
                      </select>

                      <div className="flex items-center gap-1 w-28">
                        <input
                          type="number"
                          step="0.05"
                          min="0.01"
                          required
                          value={row.qty}
                          onChange={(e) => {
                            const updated = [...newBOMData.items];
                            updated[idx].qty = Number(e.target.value);
                            setNewBOMData({ ...newBOMData, items: updated });
                          }}
                          className="w-full p-2 border border-slate-200 rounded bg-white font-mono text-center"
                        />
                        <span className="text-[11px] text-slate-500 font-mono">{row.unit}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveItemRow(idx)}
                        disabled={newBOMData.items.length <= 1}
                        className="p-2 text-slate-400 hover:text-rose-600 disabled:opacity-30"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Engineering Notes</label>
                <textarea
                  rows={2}
                  value={newBOMData.notes}
                  onChange={(e) => setNewBOMData({ ...newBOMData, notes: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800"
                >
                  Save & Activate BOM
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
