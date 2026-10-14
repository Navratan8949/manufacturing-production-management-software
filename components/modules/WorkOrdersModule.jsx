"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  ClipboardList,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Printer,
  ChevronRight,
  Flame,
  ShieldCheck,
  Package,
  Layers,
  Coins,
  X,
} from "lucide-react";
import { formatINR, formatDate } from "@/lib/utils";

export function WorkOrdersModule() {
  const {
    data,
    createWorkOrder,
    reserveMaterialForWO,
    issueMaterialForWO,
    updateWorkOrderStatus,
    setActivePrintDoc,
    setActiveView,
    addProductionLog,
  } = useApp();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedWO, setSelectedWO] = useState(data.workOrders[0] || null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [logModalOpen, setLogModalOpen] = useState(false);

  // Quick Production Log Modal State
  const [logForm, setLogForm] = useState({
    goodQty: 2,
    rejectedQty: 0,
    scrapQty: 0.5,
    operation: "Cutting & Board Sizing",
    labourHours: 4.0,
    machineHours: 3.5,
    downtimeMinutes: 0,
    downtimeReason: "",
    operator: "Rakesh Meena",
  });

  // Create WO State
  const [createForm, setCreateForm] = useState({
    productId: data.products[0]?.id || "",
    plannedQuantity: 20,
    priority: "High",
    plannedStartDate: "2026-03-15",
    plannedCompletionDate: "2026-03-28",
    assignedMachineId: data.machines[0]?.id || "",
    supervisorName: "Vikram Singh Rathore",
    assignedTeam: "Alpha CNC Squad",
    notes: "Priority delivery batch.",
  });

  const filteredWOs = (data.workOrders || []).filter((w) => {
    const matchesSearch =
      w.workOrderNumber.toLowerCase().includes(search.toLowerCase()) ||
      w.productName.toLowerCase().includes(search.toLowerCase()) ||
      (w.customerName && w.customerName.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === "all" || w.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    const prod = data.products.find((p) => p.id === createForm.productId);
    const mch = data.machines.find((m) => m.id === createForm.assignedMachineId);

    const newWO = createWorkOrder({
      ...createForm,
      productCode: prod?.code || "PRD-001",
      productName: prod?.name || "Product",
      bomId: prod?.bomId || "BOM-001",
      bomVersion: "1.0",
      machineName: mch?.name || "CNC Alpha-1",
      estimatedCost: (prod?.standardCost || 5000) * Number(createForm.plannedQuantity),
    });

    setSelectedWO(newWO);
    setCreateModalOpen(false);
  };

  const handleSaveProductionLog = (e) => {
    e.preventDefault();
    if (!selectedWO) return;
    addProductionLog({
      ...logForm,
      workOrderNumber: selectedWO.workOrderNumber,
      productName: selectedWO.productName,
    });
    setLogModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-white border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Work Order Lifecycle & Production</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Drive manufacturing orders through reservation, shop floor issue, execution logs, and quality clearance.
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg flex items-center gap-2 shadow-2xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Work Order</span>
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
            placeholder="Search work order #, product, client..."
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-slate-400"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-500">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-700 font-medium focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="Planned">Planned</option>
            <option value="Material Reserved">Material Reserved</option>
            <option value="In Progress">In Progress</option>
            <option value="Quality Inspection">Quality Inspection</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Main Two-Column View: Work Order List & Selected WO Detailed Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Work Order Records List */}
        <div className="lg:col-span-5 rounded-xl bg-white border border-slate-200 shadow-2xs overflow-hidden divide-y divide-slate-100">
          <div className="p-3.5 bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-700 flex items-center justify-between">
            <span>Production Orders ({filteredWOs.length})</span>
            <span className="text-[11px] text-slate-500">Click to inspect</span>
          </div>

          <div className="max-h-[650px] overflow-y-auto divide-y divide-slate-100">
            {filteredWOs.map((wo) => {
              const isSelected = selectedWO?.id === wo.id;
              const progressPct =
                wo.plannedQuantity > 0 ? Math.round((wo.completedQuantity / wo.plannedQuantity) * 100) : 0;
              return (
                <button
                  key={wo.id}
                  onClick={() => setSelectedWO(wo)}
                  className={`w-full p-4 text-left transition-all flex flex-col gap-2 ${
                    isSelected ? "bg-amber-50/70 border-l-4 border-amber-500" : "hover:bg-slate-50/70"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-slate-900 text-xs">{wo.workOrderNumber}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                        wo.status === "In Progress"
                          ? "bg-blue-100 text-blue-800"
                          : wo.status === "Material Reserved"
                          ? "bg-amber-100 text-amber-800"
                          : wo.status === "Completed"
                          ? "bg-emerald-100 text-emerald-800"
                          : wo.status === "Quality Inspection"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {wo.status}
                    </span>
                  </div>

                  <div>
                    <p className="font-semibold text-slate-900 text-xs leading-tight">{wo.productName}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {wo.machineName} · Team: {wo.assignedTeam}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-[11px] text-slate-500">
                      Produced: <strong className="text-slate-900">{wo.completedQuantity}</strong> / {wo.plannedQuantity} pcs
                    </span>
                    <span className="font-mono text-slate-500 text-[11px]">{progressPct}%</span>
                  </div>

                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: `${progressPct}%` }} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Work Order Action Center & Deep Details */}
        {selectedWO && (
          <div className="lg:col-span-7 rounded-xl bg-white border border-slate-200 shadow-2xs p-6 space-y-6">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-slate-950 text-base">{selectedWO.workOrderNumber}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                      selectedWO.status === "In Progress"
                        ? "bg-blue-100 text-blue-800"
                        : selectedWO.status === "Material Reserved"
                        ? "bg-amber-100 text-amber-800"
                        : selectedWO.status === "Completed"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {selectedWO.status}
                  </span>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    {selectedWO.priority} Priority
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm mt-1">{selectedWO.productName}</h3>
                <p className="text-[11px] text-slate-500">
                  Target Customer: {selectedWO.customerName || "Internal Safety Replenishment"}
                </p>
              </div>

              <button
                onClick={() => setActivePrintDoc({ type: "workOrder", id: selectedWO.id })}
                className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-lg flex items-center gap-1.5 self-start"
              >
                <Printer className="w-3.5 h-3.5 text-slate-500" />
                <span>Print WO Traveler</span>
              </button>
            </div>

            {/* Lifecycle State Actions Button Row */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Operational Transitions
              </span>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                {/* Step 1: Reserve Material */}
                {!selectedWO.materialsReserved && selectedWO.status === "Planned" && (
                  <button
                    onClick={() => reserveMaterialForWO(selectedWO.id)}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg shadow-2xs transition-colors flex items-center gap-1.5"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Reserve Component Materials</span>
                  </button>
                )}

                {/* Step 2: Issue to Shop Floor */}
                {selectedWO.materialsReserved && !selectedWO.materialIssued && (
                  <button
                    onClick={() => issueMaterialForWO(selectedWO.id)}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg shadow-2xs transition-colors flex items-center gap-1.5"
                  >
                    <Package className="w-3.5 h-3.5 text-amber-400" />
                    <span>Confirm Material Issue (Deduct Store)</span>
                  </button>
                )}

                {/* Step 3: Log Output */}
                {selectedWO.materialIssued && selectedWO.status !== "Completed" && (
                  <button
                    onClick={() => setLogModalOpen(true)}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg shadow-2xs transition-colors flex items-center gap-1.5"
                  >
                    <Flame className="w-3.5 h-3.5" />
                    <span>Record Production Log</span>
                  </button>
                )}

                {/* Step 4: Quality Clearance */}
                {selectedWO.completedQuantity >= selectedWO.plannedQuantity && selectedWO.status !== "Completed" && (
                  <button
                    onClick={() => {
                      updateWorkOrderStatus(selectedWO.id, "Completed");
                      setActiveView("quality");
                    }}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg shadow-2xs transition-colors flex items-center gap-1.5"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Approve QA & Close Work Order</span>
                  </button>
                )}

                <button
                  onClick={() => setActiveView("production-floor")}
                  className="px-3 py-1.5 border border-slate-300 hover:bg-white text-slate-700 font-medium text-xs rounded-lg transition-colors"
                >
                  View on Shop Floor
                </button>
              </div>
            </div>

            {/* Metric Quantities Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500 text-[11px]">Planned Target</span>
                <p className="text-base font-bold font-mono text-slate-900 mt-0.5">
                  {selectedWO.plannedQuantity} pcs
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500 text-[11px]">Completed Output</span>
                <p className="text-base font-bold font-mono text-emerald-600 mt-0.5">
                  {selectedWO.completedQuantity} pcs
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500 text-[11px]">Quality Accepted</span>
                <p className="text-base font-bold font-mono text-blue-600 mt-0.5">
                  {selectedWO.acceptedQuantity} pcs
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500 text-[11px]">Defects / Rejected</span>
                <p className="text-base font-bold font-mono text-rose-600 mt-0.5">
                  {selectedWO.rejectedQuantity} pcs
                </p>
              </div>
            </div>

            {/* Production Timings and Workstation */}
            <div className="grid grid-cols-2 gap-4 text-xs p-4 rounded-lg bg-slate-50 border border-slate-200">
              <div className="space-y-1">
                <p className="text-slate-500">Planned Start: <strong className="text-slate-900 font-mono">{formatDate(selectedWO.plannedStartDate)}</strong></p>
                <p className="text-slate-500">Planned Deadline: <strong className="text-slate-900 font-mono">{formatDate(selectedWO.plannedCompletionDate)}</strong></p>
                <p className="text-slate-500">Actual Start: <span className="font-mono">{selectedWO.actualStartDate ? formatDate(selectedWO.actualStartDate) : "Not Started"}</span></p>
              </div>
              <div className="space-y-1">
                <p className="text-slate-500">Workstation: <strong className="text-slate-900">{selectedWO.machineName}</strong></p>
                <p className="text-slate-500">Supervisor: <strong className="text-slate-900">{selectedWO.supervisorName}</strong></p>
                <p className="text-slate-500">WIP Stage: <span className="font-semibold text-amber-700">{selectedWO.wipStage}</span></p>
              </div>
            </div>

            {/* Estimated vs Actual Cost */}
            <div className="p-4 rounded-lg bg-slate-900 text-white space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-medium">Estimated Manufacturing Cost:</span>
                <span className="font-mono font-bold text-slate-200">{formatINR(selectedWO.estimatedCost)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-medium">Actual Incurred Cost:</span>
                <span className="font-mono font-bold text-amber-400">{formatINR(selectedWO.actualCost)}</span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Cost Variance:</span>
                <span className="font-mono text-emerald-400 font-semibold">
                  {formatINR(selectedWO.estimatedCost - selectedWO.actualCost)} ({((1 - selectedWO.actualCost / (selectedWO.estimatedCost || 1)) * 100).toFixed(1)}% buffer)
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Production Log Entry Modal */}
      {logModalOpen && selectedWO && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm">
                Log Production Output: {selectedWO.workOrderNumber}
              </h3>
              <button onClick={() => setLogModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProductionLog} className="p-6 space-y-4 text-xs">
              <div>
                <p className="font-bold text-slate-900">{selectedWO.productName}</p>
                <p className="text-[11px] text-slate-500">
                  Target remaining: {selectedWO.plannedQuantity - selectedWO.completedQuantity} units
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Good Qty *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={logForm.goodQty}
                    onChange={(e) => setLogForm({ ...logForm, goodQty: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-200 rounded-lg font-mono text-center"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Rejected Qty</label>
                  <input
                    type="number"
                    min="0"
                    value={logForm.rejectedQty}
                    onChange={(e) => setLogForm({ ...logForm, rejectedQty: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-200 rounded-lg font-mono text-center text-rose-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Scrap (kg/mtr)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={logForm.scrapQty}
                    onChange={(e) => setLogForm({ ...logForm, scrapQty: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-200 rounded-lg font-mono text-center"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Labour Hours</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={logForm.labourHours}
                    onChange={(e) => setLogForm({ ...logForm, labourHours: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Machine Hours</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={logForm.machineHours}
                    onChange={(e) => setLogForm({ ...logForm, machineHours: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Operator / Lead</label>
                <input
                  type="text"
                  value={logForm.operator}
                  onChange={(e) => setLogForm({ ...logForm, operator: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setLogModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800"
                >
                  Post Production Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Work Order Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm">Issue New Work Order</h3>
              <button onClick={() => setCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Product to Manufacture *</label>
                <select
                  value={createForm.productId}
                  onChange={(e) => setCreateForm({ ...createForm, productId: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg bg-white"
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
                    required
                    value={createForm.plannedQuantity}
                    onChange={(e) => setCreateForm({ ...createForm, plannedQuantity: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Priority</label>
                  <select
                    value={createForm.priority}
                    onChange={(e) => setCreateForm({ ...createForm, priority: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Low Priority</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Planned Start Date</label>
                  <input
                    type="date"
                    value={createForm.plannedStartDate}
                    onChange={(e) => setCreateForm({ ...createForm, plannedStartDate: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Planned Completion Date</label>
                  <input
                    type="date"
                    value={createForm.plannedCompletionDate}
                    onChange={(e) => setCreateForm({ ...createForm, plannedCompletionDate: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Assigned Workstation</label>
                  <select
                    value={createForm.assignedMachineId}
                    onChange={(e) => setCreateForm({ ...createForm, assignedMachineId: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg bg-white"
                  >
                    {data.machines.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Production Supervisor</label>
                  <input
                    type="text"
                    value={createForm.supervisorName}
                    onChange={(e) => setCreateForm({ ...createForm, supervisorName: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg"
                  />
                </div>
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
                  Create Work Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
