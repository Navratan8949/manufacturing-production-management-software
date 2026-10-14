"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  Flame,
  Workflow,
  ScrollText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Printer,
  Cpu,
  User,
  X,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export function ProductionFloorModule({ initialTab = "board" }) {
  const { data, addProductionLog, updateJobCardStatus, setActivePrintDoc } = useApp();
  const [activeTab, setActiveTab] = useState(
    initialTab === "job-cards" || initialTab === "cards"
      ? "cards"
      : initialTab === "production-logs" || initialTab === "logs"
      ? "logs"
      : "board"
  );
  const [logModalOpen, setLogModalOpen] = useState(false);
  const [selectedWOForLog, setSelectedWOForLog] = useState(data.workOrders[0] || null);

  const [logForm, setLogForm] = useState({
    operation: "Board Sizing & CNC Routing",
    goodQty: 5,
    rejectedQty: 0,
    scrapQty: 0.8,
    labourHours: 4.5,
    machineHours: 4.0,
    downtimeMinutes: 15,
    downtimeReason: "Tool cutter replacement",
    operator: "Rakesh Meena",
    shift: "Morning Shift (07:00 - 15:30)",
  });

  const handleOpenLogModal = (wo) => {
    setSelectedWOForLog(wo);
    setLogModalOpen(true);
  };

  const handleSaveLog = (e) => {
    e.preventDefault();
    if (!selectedWOForLog) return;
    addProductionLog({
      ...logForm,
      workOrderNumber: selectedWOForLog.workOrderNumber,
      productName: selectedWOForLog.productName,
    });
    setLogModalOpen(false);
    setActiveTab("logs");
  };

  return (
    <div className="space-y-6">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-white border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Shop Floor & Production Logging</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Supervisor control center: Track job card routings, operator labor hours, downtime, and scrap output.
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedWOForLog(data.workOrders[0]);
            setLogModalOpen(true);
          }}
          className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg flex items-center gap-2 shadow-2xs transition-colors self-start sm:self-auto"
        >
          <Flame className="w-4 h-4 text-amber-400" />
          <span>Record Production Output</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 text-xs font-semibold">
        <button
          onClick={() => setActiveTab("board")}
          className={`py-3 px-5 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "board" ? "border-amber-500 text-slate-950 font-bold" : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Flame className="w-4 h-4" />
          <span>Active Floor Work Orders ({data.workOrders.filter((w) => w.status === "In Progress" || w.status === "Material Reserved").length})</span>
        </button>
        <button
          onClick={() => setActiveTab("cards")}
          className={`py-3 px-5 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "cards" ? "border-amber-500 text-slate-950 font-bold" : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Workflow className="w-4 h-4" />
          <span>Job Cards & Routing ({data.jobCards?.length || 0})</span>
        </button>
        <button
          onClick={() => setActiveTab("logs")}
          className={`py-3 px-5 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "logs" ? "border-amber-500 text-slate-950 font-bold" : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <ScrollText className="w-4 h-4" />
          <span>Output & Shift Logs ({data.productionLogs?.length || 0})</span>
        </button>
      </div>

      {/* Tab 1: Active Shop Floor Board */}
      {activeTab === "board" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.workOrders
            .filter((w) => w.status === "In Progress" || w.status === "Material Reserved" || w.status === "Planned")
            .map((wo) => {
              const progressPct =
                wo.plannedQuantity > 0 ? Math.round((wo.completedQuantity / wo.plannedQuantity) * 100) : 0;
              return (
                <div
                  key={wo.id}
                  className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-slate-900 text-xs">{wo.workOrderNumber}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                          wo.status === "In Progress"
                            ? "bg-blue-100 text-blue-800"
                            : wo.status === "Material Reserved"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {wo.status}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm leading-tight">{wo.productName}</h3>

                    <div className="space-y-1 text-xs text-slate-600 pt-1">
                      <p className="flex items-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{wo.machineName}</span>
                      </p>
                      <p className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>Team: {wo.assignedTeam}</span>
                      </p>
                      <p className="text-[11px] text-amber-700 font-semibold pt-0.5">
                        Stage: {wo.wipStage}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2 border-t border-slate-100 text-xs">
                    <div>
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="text-slate-500">Output Progress</span>
                        <span className="font-mono font-bold text-slate-900">
                          {wo.completedQuantity} / {wo.plannedQuantity} pcs ({progressPct}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-amber-500 h-full rounded-full transition-all" style={{ width: `${progressPct}%` }} />
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <button
                        onClick={() => handleOpenLogModal(wo)}
                        className="flex-1 py-1.5 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded text-xs transition-colors shadow-2xs flex items-center justify-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Log Shift Output</span>
                      </button>
                      <button
                        onClick={() => setActivePrintDoc({ type: "workOrder", id: wo.id })}
                        className="p-1.5 text-slate-500 hover:text-slate-800 rounded border border-slate-200"
                        title="Print Traveler"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {/* Tab 2: Job Cards & Process Routing */}
      {activeTab === "cards" && (
        <div className="rounded-xl bg-white border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-4">Job Card #</th>
                  <th className="p-4">Work Order Ref</th>
                  <th className="p-4">Seq</th>
                  <th className="p-4">Operation Name</th>
                  <th className="p-4">Workstation</th>
                  <th className="p-4">Assigned Operator</th>
                  <th className="p-4 text-right">Progress Qty</th>
                  <th className="p-4 text-right">Cycle Hours</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(data.jobCards || []).map((card) => (
                  <tr key={card.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4 font-mono font-bold text-slate-900">{card.jobCardNumber}</td>
                    <td className="p-4 font-mono text-slate-600">{card.workOrderNumber}</td>
                    <td className="p-4 font-mono text-slate-500">#{card.operationSequence}</td>
                    <td className="p-4 font-semibold text-slate-900">{card.operationName}</td>
                    <td className="p-4 text-slate-600">{card.workstation}</td>
                    <td className="p-4 text-slate-600">{card.assignedOperator}</td>
                    <td className="p-4 text-right font-mono font-bold text-slate-900">
                      {card.completedQuantity} / {card.plannedQuantity} pcs
                    </td>
                    <td className="p-4 text-right font-mono text-slate-600">
                      {card.actualTimeHours || 0} / {card.plannedTimeHours} hrs
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                          card.status === "Completed"
                            ? "bg-emerald-100 text-emerald-800"
                            : card.status === "In Progress"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {card.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {card.status !== "Completed" && (
                          <button
                            onClick={() => updateJobCardStatus(card.id, "Completed", card.plannedQuantity)}
                            className="px-2 py-1 text-slate-900 bg-slate-100 hover:bg-slate-200 font-semibold rounded text-[11px]"
                          >
                            Mark Done
                          </button>
                        )}
                        <button
                          onClick={() => setActivePrintDoc({ type: "jobCard", id: card.id })}
                          className="p-1 text-slate-400 hover:text-slate-700"
                          title="Print Job Card"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Production Output Logs */}
      {activeTab === "logs" && (
        <div className="rounded-xl bg-white border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-4">Log ID</th>
                  <th className="p-4">Date & Shift</th>
                  <th className="p-4">Work Order</th>
                  <th className="p-4">Operation</th>
                  <th className="p-4 text-right">Good Output</th>
                  <th className="p-4 text-right">Rejected</th>
                  <th className="p-4 text-right">Scrap</th>
                  <th className="p-4 text-right">Machine Hrs</th>
                  <th className="p-4">Operator</th>
                  <th className="p-4">Downtime Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(data.productionLogs || []).map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4 font-mono font-bold text-slate-900">{log.id}</td>
                    <td className="p-4 text-slate-600">
                      <div>{formatDate(log.date)}</div>
                      <div className="text-[11px] text-slate-400">{log.shift}</div>
                    </td>
                    <td className="p-4 font-mono text-slate-900 font-semibold">{log.workOrderNumber}</td>
                    <td className="p-4 text-slate-700">{log.operation}</td>
                    <td className="p-4 text-right font-mono font-bold text-emerald-600">+{log.goodQty} pcs</td>
                    <td className="p-4 text-right font-mono font-bold text-rose-600">{log.rejectedQty || 0} pcs</td>
                    <td className="p-4 text-right font-mono text-slate-600">{log.scrapQty || 0}</td>
                    <td className="p-4 text-right font-mono text-slate-900">{log.machineHours} hrs</td>
                    <td className="p-4 text-slate-700">{log.operator}</td>
                    <td className="p-4 text-slate-500 text-[11px]">
                      {log.downtimeMinutes > 0 ? `${log.downtimeMinutes}m (${log.downtimeReason})` : "Zero downtime"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Production Log Modal */}
      {logModalOpen && selectedWOForLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm">
                Log Output for {selectedWOForLog.workOrderNumber}
              </h3>
              <button onClick={() => setLogModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveLog} className="p-6 space-y-4 text-xs">
              <div>
                <p className="font-bold text-slate-900">{selectedWOForLog.productName}</p>
                <p className="text-[11px] text-slate-500">
                  Target remaining: {selectedWOForLog.plannedQuantity - selectedWOForLog.completedQuantity} units
                </p>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Manufacturing Operation *</label>
                <input
                  type="text"
                  required
                  value={logForm.operation}
                  onChange={(e) => setLogForm({ ...logForm, operation: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg"
                />
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
                    className="w-full p-2 border border-slate-200 rounded-lg font-mono text-center font-bold text-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Rejected Qty</label>
                  <input
                    type="number"
                    min="0"
                    value={logForm.rejectedQty}
                    onChange={(e) => setLogForm({ ...logForm, rejectedQty: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-200 rounded-lg font-mono text-center font-bold text-rose-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Scrap (unit)</label>
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
                    value={logForm.machineHours}
                    onChange={(e) => setLogForm({ ...logForm, machineHours: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Operator</label>
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
                  Post Output to WO
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
