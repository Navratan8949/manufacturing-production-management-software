"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  FileOutput,
  RotateCcw,
  Plus,
  Printer,
  CheckCircle2,
  X,
  Package,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export function MaterialIssueModule() {
  const { data, postMaterialReturn, setActivePrintDoc } = useApp();
  const [activeTab, setActiveTab] = useState("issues"); // 'issues' or 'returns'
  const [returnModalOpen, setReturnModalOpen] = useState(false);

  const [returnForm, setReturnForm] = useState({
    workOrderNumber: data.workOrders[0]?.workOrderNumber || "WO-2026-081",
    materialCode: data.rawMaterials[0]?.code || "RM-PLY-01",
    returnedQty: 2,
    condition: "Good Reusable Condition",
    returnedBy: "Rakesh Meena",
    notes: "Uncut standard size offcut returned to store rack.",
  });

  const handleSaveReturn = (e) => {
    e.preventDefault();
    const mat = data.rawMaterials.find((m) => m.code === returnForm.materialCode);
    postMaterialReturn({
      workOrderNumber: returnForm.workOrderNumber,
      returnedBy: returnForm.returnedBy,
      receivedBy: "Amit Verma (Storekeeper)",
      items: [
        {
          materialCode: returnForm.materialCode,
          name: mat?.name || "Raw Material",
          returnedQty: Number(returnForm.returnedQty),
          acceptedQty: Number(returnForm.returnedQty),
          damagedQty: 0,
          unit: mat?.unit || "PCS",
          condition: returnForm.condition,
        },
      ],
      notes: returnForm.notes,
    });
    setReturnModalOpen(false);
    setActiveTab("returns");
  };

  return (
    <div className="space-y-6">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-white border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Material Issue & Shop Floor Returns</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Maintain strict physical inventory custody: Track materials issued to workstations and restock unused offcuts.
          </p>
        </div>

        <button
          onClick={() => setReturnModalOpen(true)}
          className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg flex items-center gap-2 shadow-2xs transition-colors self-start sm:self-auto"
        >
          <RotateCcw className="w-4 h-4 text-amber-400" />
          <span>Record Material Return</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 text-xs font-semibold">
        <button
          onClick={() => setActiveTab("issues")}
          className={`py-3 px-5 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "issues" ? "border-amber-500 text-slate-950 font-bold" : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <FileOutput className="w-4 h-4" />
          <span>Issued Slips ({data.materialIssues?.length || 0})</span>
        </button>
        <button
          onClick={() => setActiveTab("returns")}
          className={`py-3 px-5 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "returns" ? "border-amber-500 text-slate-950 font-bold" : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <RotateCcw className="w-4 h-4" />
          <span>Material Returns to Store ({data.materialReturns?.length || 0})</span>
        </button>
      </div>

      {/* Tab 1: Material Issues */}
      {activeTab === "issues" && (
        <div className="rounded-xl bg-white border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-4">Issue Slip #</th>
                  <th className="p-4">Work Order</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Issued Items</th>
                  <th className="p-4">Issued By</th>
                  <th className="p-4">Received By (Floor)</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(data.materialIssues || []).map((iss) => (
                  <tr key={iss.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4 font-mono font-bold text-slate-900">{iss.issueNumber}</td>
                    <td className="p-4 font-mono text-slate-700 font-semibold">{iss.workOrderNumber}</td>
                    <td className="p-4 font-mono text-slate-500">{formatDate(iss.date)}</td>
                    <td className="p-4 text-slate-700">
                      {(iss.items || []).map((i, idx) => (
                        <div key={idx} className="text-[11px]">
                          <strong>{i.issuedQty}</strong> {i.unit} {i.name}
                        </div>
                      ))}
                    </td>
                    <td className="p-4 text-slate-600">{iss.issuedBy}</td>
                    <td className="p-4 text-slate-600">{iss.receivedBy}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 uppercase">
                        {iss.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setActivePrintDoc({ type: "workOrder", id: iss.workOrderNumber })}
                        className="p-1 text-slate-400 hover:text-slate-800 rounded"
                        title="Print Traveler"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Material Returns */}
      {activeTab === "returns" && (
        <div className="rounded-xl bg-white border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-4">Return Slip #</th>
                  <th className="p-4">Work Order Ref</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Returned Item</th>
                  <th className="p-4 text-right">Accepted Qty</th>
                  <th className="p-4">Material Condition</th>
                  <th className="p-4">Returned By</th>
                  <th className="p-4">Storekeeper Receiver</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(data.materialReturns || []).map((ret) => (
                  <tr key={ret.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4 font-mono font-bold text-slate-900">{ret.returnNumber}</td>
                    <td className="p-4 font-mono text-slate-700 font-semibold">{ret.workOrderNumber}</td>
                    <td className="p-4 font-mono text-slate-500">{formatDate(ret.date)}</td>
                    <td className="p-4 text-slate-900 font-medium">
                      {(ret.items || []).map((i, idx) => (
                        <div key={idx}>
                          {i.name} <span className="font-mono text-slate-400">({i.materialCode})</span>
                        </div>
                      ))}
                    </td>
                    <td className="p-4 text-right font-mono font-bold text-emerald-600">
                      {(ret.items || []).map((i, idx) => (
                        <div key={idx}>+{i.acceptedQty} {i.unit}</div>
                      ))}
                    </td>
                    <td className="p-4 text-slate-600">
                      {(ret.items || []).map((i, idx) => (
                        <div key={idx}>{i.condition}</div>
                      ))}
                    </td>
                    <td className="p-4 text-slate-600">{ret.returnedBy}</td>
                    <td className="p-4 text-slate-600">{ret.receivedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Record Material Return Modal */}
      {returnModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm">Return Unused Material to Store</h3>
              <button onClick={() => setReturnModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveReturn} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Work Order *</label>
                  <select
                    value={returnForm.workOrderNumber}
                    onChange={(e) => setReturnForm({ ...returnForm, workOrderNumber: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg bg-white"
                  >
                    {data.workOrders.map((w) => (
                      <option key={w.id} value={w.workOrderNumber}>
                        {w.workOrderNumber}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Material to Return *</label>
                  <select
                    value={returnForm.materialCode}
                    onChange={(e) => setReturnForm({ ...returnForm, materialCode: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg bg-white"
                  >
                    {data.rawMaterials.map((m) => (
                      <option key={m.id} value={m.code}>
                        {m.code} — {m.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Returned Qty *</label>
                  <input
                    type="number"
                    min="0.1"
                    step="0.1"
                    required
                    value={returnForm.returnedQty}
                    onChange={(e) => setReturnForm({ ...returnForm, returnedQty: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-200 rounded-lg font-mono text-center font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Material Condition</label>
                  <select
                    value={returnForm.condition}
                    onChange={(e) => setReturnForm({ ...returnForm, condition: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="Good Reusable Condition">Good Reusable Condition</option>
                    <option value="Usable Offcut Lengths">Usable Offcut Lengths</option>
                    <option value="Requires Edge Dressing">Requires Edge Dressing</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Returned By (Operator / Squad)</label>
                <input
                  type="text"
                  value={returnForm.returnedBy}
                  onChange={(e) => setReturnForm({ ...returnForm, returnedBy: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Inspection Notes</label>
                <textarea
                  rows={2}
                  value={returnForm.notes}
                  onChange={(e) => setReturnForm({ ...returnForm, notes: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="p-3 bg-emerald-50 rounded border border-emerald-200 text-emerald-900 text-[11px]">
                Upon confirmation, usable raw material stock will increase immediately and an audit entry will be written to the stock ledger.
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setReturnModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800"
                >
                  Confirm Restocking Return
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
