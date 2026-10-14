"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  ShieldCheck,
  Plus,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Printer,
  X,
  FileCheck,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export function QualityModule() {
  const { data, addQualityInspection, setActivePrintDoc } = useApp();
  const [modalOpen, setModalOpen] = useState(false);

  const [form, setForm] = useState({
    type: "Final Product Inspection",
    productCode: data.products[0]?.code || "FD-101",
    productName: data.products[0]?.name || "Executive Desk",
    entityRef: "WO-2026-081",
    inspector: "Priya Sharma (QA Lead)",
    sampleSize: 10,
    totalQty: 20,
    acceptedQty: 18,
    rejectedQty: 2,
    reworkQty: 0,
    defectCategory: "Edge Trimming Tolerance",
    correctiveAction: "Re-aligned router blade on CNC Alpha-1. 2 rejected frames routed to rework.",
    status: "Passed",
    checklist: [
      { item: "Dimensions match CAD drawings within ±0.5mm tolerance", passed: true },
      { item: "Weld joints free of porosity and spatter", passed: true },
      { item: "Powder coat thickness uniform (60-80 microns)", passed: true },
      { item: "Drawer soft-close slides operate smoothly under 25kg load", passed: true },
    ],
    notes: "Batch approved for sellable finished goods inventory.",
  });

  const handleToggleChecklist = (idx) => {
    const updated = [...form.checklist];
    updated[idx].passed = !updated[idx].passed;
    setForm({ ...form, checklist: updated });
  };

  const handleSaveInspection = (e) => {
    e.preventDefault();
    const prod = data.products.find((p) => p.code === form.productCode);
    addQualityInspection({
      ...form,
      productName: prod?.name || form.productName,
    });
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-white border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Quality Assurance & Gate Clearance</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Strict QA gating: Finished production batches only enter sellable finished goods upon formal clearance.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg flex items-center gap-2 shadow-2xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Inspection Report</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-slate-500 text-[11px]">Total Inspections Logged</span>
          <p className="text-xl font-bold font-mono text-slate-900 mt-1">{data.qualityInspections.length}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Incoming + In-Process + Final</p>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-slate-500 text-[11px]">Quality Pass Rate</span>
          <p className="text-xl font-bold font-mono text-emerald-600 mt-1">97.8%</p>
          <p className="text-[10px] text-emerald-700 font-semibold mt-0.5">Target: &gt;95% first-pass</p>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-slate-500 text-[11px]">Rejection Rate</span>
          <p className="text-xl font-bold font-mono text-rose-600 mt-1">2.2%</p>
          <p className="text-[10px] text-rose-700 font-semibold mt-0.5">Quarantined from sellable stock</p>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-slate-500 text-[11px]">Lead QA Inspector</span>
          <p className="text-sm font-bold text-slate-900 mt-1">Priya Sharma</p>
          <p className="text-[10px] text-slate-500 mt-0.5">ISO 9001 Certified Auditor</p>
        </div>
      </div>

      {/* Inspections History Table */}
      <div className="rounded-xl bg-white border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-xs text-slate-900">
          Inspection Records & Clearance History
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-4">Report Number</th>
                <th className="p-4">Type</th>
                <th className="p-4">Reference Batch</th>
                <th className="p-4">Inspector</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right">Inspected</th>
                <th className="p-4 text-right">Accepted</th>
                <th className="p-4 text-right">Rejected</th>
                <th className="p-4">Status</th>
                <th className="p-4">Corrective Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.qualityInspections.map((qc) => (
                <tr key={qc.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="p-4 font-mono font-bold text-slate-900">{qc.inspectionNumber}</td>
                  <td className="p-4 font-semibold text-slate-900">{qc.type}</td>
                  <td className="p-4 font-mono text-slate-700">{qc.entityRef}</td>
                  <td className="p-4 text-slate-600">{qc.inspector}</td>
                  <td className="p-4 font-mono text-slate-500">{formatDate(qc.date)}</td>
                  <td className="p-4 text-right font-mono font-bold text-slate-900">{qc.totalQty}</td>
                  <td className="p-4 text-right font-mono font-bold text-emerald-600">{qc.acceptedQty}</td>
                  <td className="p-4 text-right font-mono font-bold text-rose-600">{qc.rejectedQty || 0}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                        qc.status === "Passed"
                          ? "bg-emerald-100 text-emerald-800"
                          : qc.status === "Partially Accepted"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {qc.status}
                    </span>
                  </td>
                  <td className="p-4 text-slate-600 truncate max-w-xs">{qc.correctiveAction || "None"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Quality Inspection Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm">Create Quality Inspection & Clearance Report</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveInspection} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Inspection Type *</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="Final Product Inspection">Final Product Inspection</option>
                    <option value="Incoming Material Inspection">Incoming Material Inspection</option>
                    <option value="In-Process Workstation Inspection">In-Process Workstation Inspection</option>
                    <option value="Pre-Dispatch Audit">Pre-Dispatch Audit</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Target Product *</label>
                  <select
                    value={form.productCode}
                    onChange={(e) => setForm({ ...form, productCode: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg bg-white"
                  >
                    {data.products.map((p) => (
                      <option key={p.id} value={p.code}>
                        {p.code} — {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Batch / WO Reference</label>
                  <input
                    type="text"
                    value={form.entityRef}
                    onChange={(e) => setForm({ ...form, entityRef: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">QA Inspector</label>
                  <input
                    type="text"
                    value={form.inspector}
                    onChange={(e) => setForm({ ...form, inspector: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Inspected Qty *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={form.totalQty}
                    onChange={(e) => setForm({ ...form, totalQty: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-200 rounded-lg font-mono text-center"
                  />
                </div>
                <div>
                  <label className="block text-emerald-700 font-semibold mb-1">Accepted Qty</label>
                  <input
                    type="number"
                    min="0"
                    value={form.acceptedQty}
                    onChange={(e) => setForm({ ...form, acceptedQty: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-200 rounded-lg font-mono text-center font-bold text-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-rose-700 font-semibold mb-1">Rejected Qty</label>
                  <input
                    type="number"
                    min="0"
                    value={form.rejectedQty}
                    onChange={(e) => setForm({ ...form, rejectedQty: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-200 rounded-lg font-mono text-center font-bold text-rose-600"
                  />
                </div>
              </div>

              {/* Checklist */}
              <div>
                <label className="text-slate-700 font-bold block mb-2">Quality Audit Checklist (Click to Toggle)</label>
                <div className="space-y-1.5 border border-slate-200 rounded-lg p-3 bg-slate-50/50">
                  {form.checklist.map((c, idx) => (
                    <label key={idx} className="flex items-center gap-2 cursor-pointer p-1 rounded hover:bg-slate-100">
                      <input
                        type="checkbox"
                        checked={c.passed}
                        onChange={() => handleToggleChecklist(idx)}
                        className="rounded text-emerald-600"
                      />
                      <span className={c.passed ? "text-slate-800" : "text-rose-700 line-through"}>{c.item}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Corrective Action Taken</label>
                <textarea
                  rows={2}
                  value={form.correctiveAction}
                  onChange={(e) => setForm({ ...form, correctiveAction: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="p-3 bg-emerald-50 rounded border border-emerald-200 text-emerald-900 text-[11px]">
                Upon clearance, Accepted quantities will be transferred immediately into sellable Finished Goods stock.
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
                  Submit Inspection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
