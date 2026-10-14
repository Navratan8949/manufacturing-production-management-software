"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  Hourglass,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Layers,
  Cpu,
  User,
} from "lucide-react";
import { formatINR } from "@/lib/utils";

export function WIPModule() {
  const { data, showToast } = useApp();

  const stages = [
    { id: 1, name: "Material Prep & Sizing", bay: "Bay A (Woodworking)", team: "Alpha CNC Squad" },
    { id: 2, name: "Edge Banding & Drilling", bay: "Bay C (Finishing)", team: "Assembly & Finishing" },
    { id: 3, name: "Frame Fabrication & Welding", bay: "Bay B (Metal Prep)", team: "Beta Fabrication" },
    { id: 4, name: "Surface Powder Coating", bay: "Bay D (Paint Booth)", team: "Surface Prep Crew" },
    { id: 5, name: "Final Fitment Assembly", bay: "Bay E (Assembly)", team: "Alpha Assembly Squad" },
  ];

  const [wipItems, setWipItems] = useState([
    {
      id: "WIP-01",
      workOrderNumber: "WO-2026-081",
      productName: "Office Executive Desk (Teak Finish)",
      stageId: 3,
      stageName: "Frame Fabrication & Welding",
      qtyInStage: 20,
      completedInStage: 18,
      waitingQty: 2,
      rejectedQty: 1,
      workstation: "Welding Rig Lincoln-3",
      assignedTeam: "Beta Fabrication Squad",
      dwellHours: 14.5,
      bottleneck: true,
    },
    {
      id: "WIP-02",
      workOrderNumber: "WO-2026-082",
      productName: "Heavy-Duty Steel Storage Rack",
      stageId: 1,
      stageName: "Material Prep & Sizing",
      qtyInStage: 15,
      completedInStage: 0,
      waitingQty: 15,
      rejectedQty: 0,
      workstation: "Metal Tube Circular Saw MC-2",
      assignedTeam: "Beta Fabrication Squad",
      dwellHours: 4.0,
      bottleneck: false,
    },
  ]);

  const handleAdvanceStage = (wipId) => {
    setWipItems((prev) =>
      prev.map((item) => {
        if (item.id === wipId) {
          const nextStageId = Math.min(5, item.stageId + 1);
          const nextStage = stages.find((s) => s.id === nextStageId);
          showToast(`Advanced ${item.workOrderNumber} to Stage: ${nextStage?.name}`);
          return {
            ...item,
            stageId: nextStageId,
            stageName: nextStage?.name || item.stageName,
            workstation: nextStage?.bay || item.workstation,
            dwellHours: 0.5,
            bottleneck: false,
          };
        }
        return item;
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-white border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Work-in-Progress (WIP) Stages & Bottlenecks</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Track intermediate parts between machine operations without double-counting production yield.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-100 text-amber-800">
            1 Active Floor Bottleneck
          </span>
        </div>
      </div>

      {/* Visual Production Routing Pipeline */}
      <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-4 text-xs">
        <h3 className="font-bold text-slate-900 text-sm">Industrial Fabrication Routing Pipeline</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          {stages.map((stg) => {
            const countInStage = wipItems.filter((w) => w.stageId === stg.id).length;
            return (
              <div
                key={stg.id}
                className={`p-3.5 rounded-xl border flex flex-col justify-between space-y-3 ${
                  countInStage > 0 ? "bg-amber-50/60 border-amber-300 shadow-2xs" : "bg-slate-50 border-slate-200"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-slate-500 text-[10px]">STAGE 0{stg.id}</span>
                    {countInStage > 0 && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-slate-950">
                        {countInStage} Batch Active
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs mt-1 leading-tight">{stg.name}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">{stg.bay}</p>
                </div>

                <div className="text-[10px] text-slate-400 border-t border-slate-200/60 pt-2">
                  <span>Squad: {stg.team}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active WIP Batches Table */}
      <div className="rounded-xl bg-white border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
          <h3 className="font-bold text-slate-900">Active Work-in-Progress Batches on Floor</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-4">Work Order</th>
                <th className="p-4">Product Name</th>
                <th className="p-4">Current WIP Stage</th>
                <th className="p-4">Workstation / Bay</th>
                <th className="p-4 text-right">In Stage</th>
                <th className="p-4 text-right">Completed</th>
                <th className="p-4 text-right">Stage Defect</th>
                <th className="p-4 text-right">Dwell Time</th>
                <th className="p-4">Bottleneck Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {wipItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="p-4 font-mono font-bold text-slate-900">{item.workOrderNumber}</td>
                  <td className="p-4 font-semibold text-slate-900">{item.productName}</td>
                  <td className="p-4 text-amber-700 font-bold">{item.stageName}</td>
                  <td className="p-4 text-slate-600">{item.workstation}</td>
                  <td className="p-4 text-right font-mono font-bold text-slate-900">{item.qtyInStage} pcs</td>
                  <td className="p-4 text-right font-mono font-bold text-emerald-600">{item.completedInStage} pcs</td>
                  <td className="p-4 text-right font-mono font-bold text-rose-600">{item.rejectedQty} pcs</td>
                  <td className="p-4 text-right font-mono text-slate-700">{item.dwellHours} hrs</td>
                  <td className="p-4">
                    {item.bottleneck ? (
                      <span className="flex items-center gap-1 font-bold text-rose-600 text-[11px]">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>High Dwell Idle</span>
                      </span>
                    ) : (
                      <span className="text-emerald-700 font-semibold">Flowing Normal</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleAdvanceStage(item.id)}
                      className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded text-[11px] flex items-center gap-1 ml-auto"
                    >
                      <span>Pass Next Stage</span>
                      <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
