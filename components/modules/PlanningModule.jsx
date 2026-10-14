"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  CalendarDays,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Cpu,
  Layers,
  ArrowRight,
  ClipboardList,
} from "lucide-react";
import { formatINR, formatDate } from "@/lib/utils";

export function PlanningModule() {
  const { data, createWorkOrder, setActiveView, canPerformAction, showToast } = useApp();

  const [selectedProductId, setSelectedProductId] = useState(data.products[0]?.id || "");
  const [plannedQty, setPlannedQty] = useState(25);
  const [targetMachineId, setTargetMachineId] = useState(data.machines[0]?.id || "");
  const [priority, setPriority] = useState("High");
  const [startDate, setStartDate] = useState("2026-03-18");
  const [endDate, setEndDate] = useState("2026-03-28");

  const selectedProduct = data.products.find((p) => p.id === selectedProductId) || data.products[0];
  const linkedBOM = data.boms.find((b) => b.productId === selectedProductId || b.productCode === selectedProduct?.code);
  const selectedMachine = data.machines.find((m) => m.id === targetMachineId) || data.machines[0];

  // Calculate material feasibility
  const feasibility = (linkedBOM?.items || []).map((item) => {
    const totalRequired = Number((item.qty * plannedQty * (1 + (linkedBOM.scrapAllowancePercent || 0) / 100)).toFixed(1));
    const storeMat = data.rawMaterials.find((m) => m.code === item.materialCode);
    const available = storeMat ? Math.max(0, storeMat.currentStock - storeMat.reservedStock) : 0;
    const isSufficient = available >= totalRequired;
    return {
      materialCode: item.materialCode,
      name: item.name,
      totalRequired,
      available,
      unit: item.unit,
      isSufficient,
      shortage: Math.max(0, totalRequired - available),
    };
  });

  const hasShortages = feasibility.some((f) => !f.isSufficient);
  const estimatedCost = (selectedProduct?.standardCost || 5000) * plannedQty;

  const handleLaunchPlan = () => {
    if (!canPerformAction("PLAN_PRODUCTION")) {
      showToast("Permission denied: Production planning requires Production Manager or Admin.", "error");
      return;
    }

    createWorkOrder({
      productId: selectedProduct.id,
      productCode: selectedProduct.code,
      productName: selectedProduct.name,
      bomId: linkedBOM?.id,
      bomVersion: linkedBOM?.version || "1.0",
      plannedQuantity: plannedQty,
      priority,
      plannedStartDate: startDate,
      plannedCompletionDate: endDate,
      assignedMachineId: selectedMachine.id,
      machineName: selectedMachine.name,
      supervisorName: "Vikram Singh Rathore",
      assignedTeam: selectedMachine.assignedTeam || "Alpha CNC Squad",
      estimatedCost,
      notes: "Planned via Master Production Scheduling (MPS) workspace.",
    });

    setActiveView("work-orders");
  };

  return (
    <div className="space-y-6">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-white border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Master Production Planning (MPS)</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Simulate batch schedules, verify material feasibility, evaluate machine loads, and release work orders.
          </p>
        </div>

        <button
          onClick={handleLaunchPlan}
          className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg flex items-center gap-2 shadow-2xs transition-colors self-start sm:self-auto"
        >
          <ClipboardList className="w-4 h-4 text-amber-400" />
          <span>Release Planned Work Order</span>
        </button>
      </div>

      {/* Main Planning Configuration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Planning Parameters */}
        <div className="lg:col-span-5 rounded-xl bg-white border border-slate-200 shadow-2xs p-5 space-y-4 text-xs">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-amber-500" />
            <span>Target Batch Parameters</span>
          </h3>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Target Finished Product *</label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full p-2 border border-slate-200 rounded-lg bg-white font-medium"
            >
              {data.products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.code} — {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Target Quantity *</label>
              <input
                type="number"
                min="1"
                value={plannedQty}
                onChange={(e) => setPlannedQty(Math.max(1, Number(e.target.value)))}
                className="w-full p-2 border border-slate-200 rounded-lg font-mono font-bold text-center"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-lg bg-white font-medium"
              >
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Assigned Workstation / Machine *</label>
            <select
              value={targetMachineId}
              onChange={(e) => setTargetMachineId(e.target.value)}
              className="w-full p-2 border border-slate-200 rounded-lg bg-white"
            >
              {data.machines.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.location})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Planned Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Target Deadline</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-lg"
              />
            </div>
          </div>

          <div className="p-3 bg-slate-900 text-white rounded-lg space-y-1">
            <span className="text-[11px] text-slate-400">Estimated Batch Cost Budget</span>
            <p className="text-lg font-bold font-mono text-amber-400">{formatINR(estimatedCost)}</p>
            <p className="text-[10px] text-slate-400">
              Linked BOM: {linkedBOM ? `${linkedBOM.bomNumber} (v${linkedBOM.version})` : "Standard master defaults"}
            </p>
          </div>
        </div>

        {/* Right Column: Pre-Execution Feasibility & Shortage Check */}
        <div className="lg:col-span-7 rounded-xl bg-white border border-slate-200 shadow-2xs p-5 space-y-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Material Availability Feasibility Check</h3>
              <p className="text-slate-500 text-[11px]">
                Checking store availability for {plannedQty}x {selectedProduct?.name}
              </p>
            </div>
            <span
              className={`px-2.5 py-1 rounded font-bold text-xs ${
                hasShortages ? "bg-rose-100 text-rose-800" : "bg-emerald-100 text-emerald-800"
              }`}
            >
              {hasShortages ? "Material Shortage Detected" : "100% Stock Feasible"}
            </span>
          </div>

          <div className="space-y-2">
            {feasibility.length === 0 ? (
              <p className="text-slate-500 py-4 text-center">No Bill of Materials linked to this item.</p>
            ) : (
              feasibility.map((f, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border flex items-center justify-between ${
                    f.isSufficient ? "bg-slate-50 border-slate-200" : "bg-rose-50 border-rose-200"
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900">{f.materialCode}</span>
                      <span className="text-slate-800 font-semibold">{f.name}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Store Available: <strong>{f.available}</strong> {f.unit}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="font-mono font-bold text-slate-900 text-sm">
                      {f.totalRequired} {f.unit}
                    </span>
                    <p className="text-[10px] font-semibold mt-0.5">
                      {f.isSufficient ? (
                        <span className="text-emerald-700">Stock OK</span>
                      ) : (
                        <span className="text-rose-700 font-bold">Shortage: -{f.shortage} {f.unit}</span>
                      )}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {hasShortages && (
            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-900 text-[11px] flex items-center justify-between">
              <span>Shortages found. Run MRP Lite to draft purchase orders for missing components.</span>
              <button
                onClick={() => setActiveView("mrp")}
                className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded"
              >
                Launch MRP
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
