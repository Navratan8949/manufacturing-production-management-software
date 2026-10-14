"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  BarChart3,
  Settings,
  Download,
  RotateCw,
  Building2,
  Shield,
  FileSpreadsheet,
  CheckCircle2,
  Trash2,
  Upload,
} from "lucide-react";
import { formatINR, formatDate } from "@/lib/utils";

export function ReportsSettingsModule({ initialTab = "reports" }) {
  const { data, resetDemoData, setCurrentUserRole, showToast } = useApp();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [reportType, setReportType] = useState("production");

  const downloadReportCSV = () => {
    let headers = [];
    let rows = [];

    if (reportType === "production") {
      headers = ["WO Number", "Product Name", "Planned Qty", "Completed Qty", "Status", "Estimated Cost", "Actual Cost"];
      rows = (data.workOrders || []).map((w) => [
        w.workOrderNumber,
        `"${w.productName}"`,
        w.plannedQuantity,
        w.completedQuantity,
        w.status,
        w.estimatedCost,
        w.actualCost,
      ]);
    } else if (reportType === "inventory") {
      headers = ["Code", "Item Name", "Category", "On-Hand Stock", "Reserved", "Available", "Unit Cost", "Total Value"];
      rows = (data.rawMaterials || []).map((m) => [
        m.code,
        `"${m.name}"`,
        m.category,
        m.currentStock,
        m.reservedStock,
        Math.max(0, m.currentStock - m.reservedStock),
        m.unitCost,
        m.currentStock * m.unitCost,
      ]);
    } else if (reportType === "quality") {
      headers = ["Report #", "Type", "Reference", "Inspector", "Inspected Qty", "Accepted Qty", "Rejected Qty", "Status"];
      rows = (data.qualityInspections || []).map((q) => [
        q.inspectionNumber,
        `"${q.type}"`,
        q.entityRef,
        `"${q.inspector}"`,
        q.totalQty,
        q.acceptedQty,
        q.rejectedQty,
        q.status,
      ]);
    }

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ForgeFlow_${reportType}_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportJSON = () => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `forgeflow_factory_backup_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast("Factory demo dataset exported to JSON file.");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-white border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Executive Reports & System Parameters</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Export audit-ready CSV registers, configure factory shift metadata, and manage local browser state.
          </p>
        </div>

        {activeTab === "reports" && (
          <button
            onClick={downloadReportCSV}
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg flex items-center gap-2 shadow-2xs transition-colors self-start sm:self-auto"
          >
            <Download className="w-4 h-4" />
            <span>Export Table to CSV</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 text-xs font-semibold">
        <button
          onClick={() => setActiveTab("reports")}
          className={`py-3 px-5 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "reports" ? "border-amber-500 text-slate-950 font-bold" : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Operational Registers</span>
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={`py-3 px-5 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "settings" ? "border-amber-500 text-slate-950 font-bold" : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Plant Settings & Data</span>
        </button>
      </div>

      {/* Tab 1: Reports Center */}
      {activeTab === "reports" && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center gap-4 text-xs">
            <span className="font-bold text-slate-700">Select Register:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setReportType("production")}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                  reportType === "production" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Production Register
              </button>
              <button
                onClick={() => setReportType("inventory")}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                  reportType === "inventory" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Stock Valuation Register
              </button>
              <button
                onClick={() => setReportType("quality")}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                  reportType === "quality" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Quality Compliance Register
              </button>
            </div>
          </div>

          <div className="rounded-xl bg-white border border-slate-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                {reportType === "production" && (
                  <>
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="p-4">WO Number</th>
                        <th className="p-4">Product Name</th>
                        <th className="p-4 text-right">Planned Qty</th>
                        <th className="p-4 text-right">Completed Qty</th>
                        <th className="p-4 text-right">Estimated Cost</th>
                        <th className="p-4 text-right">Actual Incurred</th>
                        <th className="p-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {data.workOrders.map((w) => (
                        <tr key={w.id} className="hover:bg-slate-50/60">
                          <td className="p-4 font-mono font-bold text-slate-900">{w.workOrderNumber}</td>
                          <td className="p-4 font-semibold text-slate-900">{w.productName}</td>
                          <td className="p-4 text-right font-mono font-bold">{w.plannedQuantity} pcs</td>
                          <td className="p-4 text-right font-mono text-emerald-600 font-bold">{w.completedQuantity} pcs</td>
                          <td className="p-4 text-right font-mono">{formatINR(w.estimatedCost)}</td>
                          <td className="p-4 text-right font-mono font-bold text-slate-900">{formatINR(w.actualCost)}</td>
                          <td className="p-4">
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 uppercase">
                              {w.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </>
                )}

                {reportType === "inventory" && (
                  <>
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="p-4">Material Code</th>
                        <th className="p-4">Item Name</th>
                        <th className="p-4">Category</th>
                        <th className="p-4 text-right">On-Hand Stock</th>
                        <th className="p-4 text-right">Reserved</th>
                        <th className="p-4 text-right">Available</th>
                        <th className="p-4 text-right">Unit Rate</th>
                        <th className="p-4 text-right">Total Valuation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {data.rawMaterials.map((m) => (
                        <tr key={m.id} className="hover:bg-slate-50/60">
                          <td className="p-4 font-mono font-bold text-slate-900">{m.code}</td>
                          <td className="p-4 font-semibold text-slate-900">{m.name}</td>
                          <td className="p-4 text-slate-600">{m.category}</td>
                          <td className="p-4 text-right font-mono font-bold">{m.currentStock} {m.unit}</td>
                          <td className="p-4 text-right font-mono text-amber-600">{m.reservedStock || 0} {m.unit}</td>
                          <td className="p-4 text-right font-mono text-emerald-600 font-bold">
                            {Math.max(0, m.currentStock - (m.reservedStock || 0))} {m.unit}
                          </td>
                          <td className="p-4 text-right font-mono">{formatINR(m.unitCost)}</td>
                          <td className="p-4 text-right font-mono font-bold text-slate-900">
                            {formatINR(m.currentStock * m.unitCost)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </>
                )}

                {reportType === "quality" && (
                  <>
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="p-4">Report Number</th>
                        <th className="p-4">Inspection Type</th>
                        <th className="p-4">Batch Reference</th>
                        <th className="p-4">Inspector</th>
                        <th className="p-4 text-right">Inspected</th>
                        <th className="p-4 text-right">Accepted</th>
                        <th className="p-4 text-right">Rejected</th>
                        <th className="p-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {data.qualityInspections.map((q) => (
                        <tr key={q.id} className="hover:bg-slate-50/60">
                          <td className="p-4 font-mono font-bold text-slate-900">{q.inspectionNumber}</td>
                          <td className="p-4 font-semibold text-slate-900">{q.type}</td>
                          <td className="p-4 font-mono text-slate-600">{q.entityRef}</td>
                          <td className="p-4 text-slate-600">{q.inspector}</td>
                          <td className="p-4 text-right font-mono font-bold">{q.totalQty}</td>
                          <td className="p-4 text-right font-mono font-bold text-emerald-600">{q.acceptedQty}</td>
                          <td className="p-4 text-right font-mono font-bold text-rose-600">{q.rejectedQty || 0}</td>
                          <td className="p-4">
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 uppercase">
                              {q.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </>
                )}
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Settings & Data Backup */}
      {activeTab === "settings" && (
        <div className="space-y-6 text-xs">
          {/* Company Profile Details */}
          <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Building2 className="w-4 h-4 text-amber-500" />
              <span>Plant & Company Profile</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <span className="text-slate-500">Legal Business Name</span>
                <p className="font-bold text-slate-900 text-sm mt-0.5">{data.company.name}</p>
              </div>
              <div>
                <span className="text-slate-500">Operating Industry</span>
                <p className="font-bold text-slate-900 text-sm mt-0.5">{data.company.tagline}</p>
              </div>
              <div>
                <span className="text-slate-500">Facility Location</span>
                <p className="font-bold text-slate-900 text-sm mt-0.5">{data.company.city}, {data.company.state}</p>
              </div>
              <div>
                <span className="text-slate-500">GSTIN Identification</span>
                <p className="font-mono font-bold text-slate-900 text-sm mt-0.5">{data.company.gstin}</p>
              </div>
              <div>
                <span className="text-slate-500">Functional Currency</span>
                <p className="font-bold text-slate-900 text-sm mt-0.5">INR (₹) Indian Rupee</p>
              </div>
              <div>
                <span className="text-slate-500">Quality Standards</span>
                <p className="font-bold text-emerald-700 text-sm mt-0.5">{data.company.certifications.join(" · ")}</p>
              </div>
            </div>
          </div>

          {/* Demo User Role Perspective Switcher */}
          <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-500" />
              <span>Demo Role Simulation</span>
            </h3>
            <p className="text-slate-500">
              Test how different factory roles interact with the system. Current active role: <strong className="text-slate-900">{data.currentUserRole}</strong>.
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              {[
                "Owner / Super Admin",
                "Production Manager",
                "Storekeeper",
                "Production Supervisor",
                "Quality Inspector",
                "Procurement Manager",
                "Dispatch Manager",
                "Accountant / Cost Analyst",
                "Maintenance Technician",
              ].map((role) => (
                <button
                  key={role}
                  onClick={() => setCurrentUserRole(role)}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                    data.currentUserRole === role
                      ? "bg-amber-500 text-slate-950 font-bold shadow-2xs"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {/* Local Persistence & Reset Controls */}
          <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <RotateCw className="w-4 h-4 text-amber-500" />
              <span>Local Browser Persistence & Backup</span>
            </h3>
            <p className="text-slate-500">
              All transactions, work orders, stock adjustments, and logs are persisted locally inside this browser under key <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">forgeflow_demo_v1</code>.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={handleExportJSON}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold flex items-center gap-2 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export Demo State to JSON</span>
              </button>

              <button
                onClick={() => {
                  if (confirm("Reset all manufacturing database records to initial Jaipur plant seed?")) {
                    resetDemoData();
                  }
                }}
                className="px-4 py-2 border border-rose-300 text-rose-700 hover:bg-rose-50 rounded-lg font-semibold flex items-center gap-2 transition-colors"
              >
                <RotateCw className="w-4 h-4" />
                <span>Reset to Initial Factory Seed</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
