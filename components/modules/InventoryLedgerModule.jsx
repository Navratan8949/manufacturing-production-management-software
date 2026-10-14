"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  Boxes,
  Hourglass,
  ArrowLeftRight,
  Trash2,
  Download,
  Search,
  CheckCircle2,
  AlertTriangle,
  Plus,
} from "lucide-react";
import { formatINR, formatDate } from "@/lib/utils";

export function InventoryLedgerModule({ initialTab = "finished" }) {
  const { data, addScrapRecord } = useApp();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [search, setSearch] = useState("");

  const downloadCSV = () => {
    const headers = ["Date", "Type", "Item Type", "Item Code", "Item Name", "Quantity", "Unit", "Ref Document", "Warehouse", "User", "Notes"];
    const rows = (data.stockMovements || []).map((m) => [
      m.date,
      m.type,
      m.itemType,
      m.itemCode,
      `"${m.itemName}"`,
      m.quantity,
      m.unit,
      m.referenceDoc,
      `"${m.warehouse}"`,
      `"${m.user}"`,
      `"${m.notes}"`,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ForgeFlow_Stock_Ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-white border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Inventory, WIP & Stock Ledger Movements</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Complete audit trail across Finished Goods, Work-in-Progress intermediate stages, and Scrap.
          </p>
        </div>

        {activeTab === "movements" && (
          <button
            onClick={downloadCSV}
            className="px-4 py-2 text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg flex items-center gap-2 shadow-2xs transition-colors self-start sm:self-auto"
          >
            <Download className="w-4 h-4" />
            <span>Export Stock Ledger (CSV)</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 text-xs font-semibold">
        <button
          onClick={() => setActiveTab("finished")}
          className={`py-3 px-5 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "finished" ? "border-amber-500 text-slate-950 font-bold" : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Boxes className="w-4 h-4" />
          <span>Finished Goods Inventory ({data.products.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("wip")}
          className={`py-3 px-5 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "wip" ? "border-amber-500 text-slate-950 font-bold" : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Hourglass className="w-4 h-4" />
          <span>Work-in-Progress (WIP) Stages</span>
        </button>
        <button
          onClick={() => setActiveTab("movements")}
          className={`py-3 px-5 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "movements" ? "border-amber-500 text-slate-950 font-bold" : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <ArrowLeftRight className="w-4 h-4" />
          <span>Stock Movement Ledger ({data.stockMovements?.length || 0})</span>
        </button>
        <button
          onClick={() => setActiveTab("scrap")}
          className={`py-3 px-5 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "scrap" ? "border-amber-500 text-slate-950 font-bold" : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Trash2 className="w-4 h-4" />
          <span>Scrap & Wastage ({data.scrapRecords?.length || 0})</span>
        </button>
      </div>

      {/* Tab 1: Finished Goods */}
      {activeTab === "finished" && (
        <div className="rounded-xl bg-white border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-4">SKU / Code</th>
                  <th className="p-4">Product Name</th>
                  <th className="p-4 text-right">Physical On-Hand</th>
                  <th className="p-4 text-right">Customer Reserved</th>
                  <th className="p-4 text-right">Sellable Available</th>
                  <th className="p-4 text-right">Quality Hold</th>
                  <th className="p-4 text-right">Unit Cost</th>
                  <th className="p-4 text-right">Total Valuation</th>
                  <th className="p-4">Warehouse Bay</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.products.map((prod) => {
                  const available = Math.max(0, (prod.currentStock || 0) - (prod.reservedStock || 0));
                  const valuation = (prod.currentStock || 0) * (prod.standardCost || 0);
                  return (
                    <tr key={prod.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-4 font-mono font-bold text-slate-900">{prod.code}</td>
                      <td className="p-4 font-semibold text-slate-900">{prod.name}</td>
                      <td className="p-4 text-right font-mono font-bold text-slate-900">
                        {prod.currentStock} {prod.unit}
                      </td>
                      <td className="p-4 text-right font-mono text-amber-600 font-semibold">
                        {prod.reservedStock || 0} {prod.unit}
                      </td>
                      <td className="p-4 text-right font-mono text-emerald-600 font-bold">
                        {available} {prod.unit}
                      </td>
                      <td className="p-4 text-right font-mono text-purple-600 font-semibold">
                        {prod.qualityHoldStock || 0} {prod.unit}
                      </td>
                      <td className="p-4 text-right font-mono text-slate-600">{formatINR(prod.standardCost)}</td>
                      <td className="p-4 text-right font-mono font-bold text-slate-900">{formatINR(valuation)}</td>
                      <td className="p-4 text-slate-500">Bay E, Finished Goods Store</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Work-in-Progress (WIP) */}
      {activeTab === "wip" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-slate-500 text-[11px]">Active WIP Batches</span>
              <p className="text-xl font-bold font-mono text-slate-900 mt-1">
                {data.workOrders.filter((w) => w.status === "In Progress" || w.status === "Material Reserved").length} Orders
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-slate-500 text-[11px]">Units Currently on Floor</span>
              <p className="text-xl font-bold font-mono text-amber-600 mt-1">35 Units</p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-slate-500 text-[11px]">Average WIP Dwell Time</span>
              <p className="text-xl font-bold font-mono text-slate-900 mt-1">3.4 Days</p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-slate-500 text-[11px]">Bottleneck Alert</span>
              <p className="text-sm font-bold text-slate-900 mt-1">Welding Rig Bay B</p>
            </div>
          </div>

          <div className="rounded-xl bg-white border border-slate-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="p-4">Work Order</th>
                    <th className="p-4">Product</th>
                    <th className="p-4">Current Stage / Bay</th>
                    <th className="p-4 text-right">In-Stage Qty</th>
                    <th className="p-4 text-right">Completed</th>
                    <th className="p-4">Assigned Workstation</th>
                    <th className="p-4">Team</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.workOrders
                    .filter((w) => w.status === "In Progress" || w.status === "Material Reserved")
                    .map((wo) => (
                      <tr key={wo.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="p-4 font-mono font-bold text-slate-900">{wo.workOrderNumber}</td>
                        <td className="p-4 font-semibold text-slate-900">{wo.productName}</td>
                        <td className="p-4 font-semibold text-amber-700">{wo.wipStage}</td>
                        <td className="p-4 text-right font-mono font-bold text-slate-900">{wo.plannedQuantity} pcs</td>
                        <td className="p-4 text-right font-mono text-emerald-600 font-bold">{wo.completedQuantity} pcs</td>
                        <td className="p-4 text-slate-600">{wo.machineName}</td>
                        <td className="p-4 text-slate-600">{wo.assignedTeam}</td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-100 text-blue-800 uppercase">
                            {wo.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Stock Movement Ledger */}
      {activeTab === "movements" && (
        <div className="rounded-xl bg-white border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-4">Date</th>
                  <th className="p-4">Movement Type</th>
                  <th className="p-4">Item Code</th>
                  <th className="p-4">Description</th>
                  <th className="p-4 text-right">Quantity Delta</th>
                  <th className="p-4">Reference Document</th>
                  <th className="p-4">Storage Location</th>
                  <th className="p-4">Operator / User</th>
                  <th className="p-4">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(data.stockMovements || []).map((mov) => {
                  const isPositive = mov.quantity > 0;
                  return (
                    <tr key={mov.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-4 font-mono text-slate-500">{formatDate(mov.date)}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-100 text-slate-800">
                          {mov.type}
                        </span>
                      </td>
                      <td className="p-4 font-mono font-bold text-slate-900">{mov.itemCode}</td>
                      <td className="p-4 font-medium text-slate-800">{mov.itemName}</td>
                      <td
                        className={`p-4 text-right font-mono font-bold ${
                          isPositive ? "text-emerald-600" : "text-rose-600"
                        }`}
                      >
                        {isPositive ? `+${mov.quantity}` : mov.quantity} {mov.unit}
                      </td>
                      <td className="p-4 font-mono text-slate-600 font-semibold">{mov.referenceDoc}</td>
                      <td className="p-4 text-slate-600">{mov.warehouse}</td>
                      <td className="p-4 text-slate-600">{mov.user}</td>
                      <td className="p-4 text-slate-500 text-[11px] truncate max-w-xs">{mov.notes}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Scrap & Wastage */}
      {activeTab === "scrap" && (
        <div className="rounded-xl bg-white border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-4">Scrap Ref</th>
                  <th className="p-4">Work Order</th>
                  <th className="p-4">Material / Item</th>
                  <th className="p-4">Operation</th>
                  <th className="p-4 text-right">Scrap Qty</th>
                  <th className="p-4 text-right">Estimated Loss</th>
                  <th className="p-4">Reason / Defect</th>
                  <th className="p-4">Recovery Action</th>
                  <th className="p-4">Reported By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(data.scrapRecords || []).map((scr) => (
                  <tr key={scr.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4 font-mono font-bold text-slate-900">{scr.scrapReference}</td>
                    <td className="p-4 font-mono text-slate-700">{scr.workOrderNumber}</td>
                    <td className="p-4 font-semibold text-slate-900">
                      {scr.itemName} <span className="font-mono text-slate-400">({scr.itemCode})</span>
                    </td>
                    <td className="p-4 text-slate-600">{scr.operation}</td>
                    <td className="p-4 text-right font-mono font-bold text-rose-600">
                      {scr.scrapQty} {scr.unit}
                    </td>
                    <td className="p-4 text-right font-mono font-bold text-slate-900">{formatINR(scr.estimatedCost)}</td>
                    <td className="p-4 text-slate-700">{scr.reason}</td>
                    <td className="p-4 text-slate-600 truncate max-w-xs">{scr.recoveryAction}</td>
                    <td className="p-4 text-slate-600">{scr.reportedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
