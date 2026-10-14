"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { X, AlertTriangle, CheckCircle, Info, ArrowRight, Bell } from "lucide-react";

export function NotificationDrawer({ isOpen, onClose }) {
  const { notifications, setActiveView, setIsLandingView } = useApp();

  if (!isOpen) return null;

  const handleNavigate = (view) => {
    setActiveView(view);
    setIsLandingView(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/40 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white shadow-2xl h-full flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-amber-600" />
            <h3 className="font-bold text-slate-900 text-sm">Factory Notifications</h3>
            <span className="text-[11px] font-semibold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
              {notifications.length} Active
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Alerts List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">All Systems Nominal</p>
              <p className="text-xs text-slate-500 mt-1">No active stockout alarms or overdue quality hold tickets.</p>
            </div>
          ) : (
            notifications.map((item) => {
              const isHigh = item.severity === "high";
              const isMedium = item.severity === "medium";
              return (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-lg border text-xs space-y-2 transition-all ${
                    isHigh
                      ? "bg-rose-50/60 border-rose-200 text-rose-950"
                      : isMedium
                      ? "bg-amber-50/60 border-amber-200 text-amber-950"
                      : "bg-slate-50 border-slate-200 text-slate-900"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {isHigh ? (
                        <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                      ) : (
                        <Info className="w-4 h-4 text-amber-600 shrink-0" />
                      )}
                      <span className="font-bold text-slate-900">{item.title}</span>
                    </div>
                    <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-white/80 border border-slate-200/60">
                      {item.category}
                    </span>
                  </div>

                  <p className="text-slate-600 leading-relaxed">{item.description}</p>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-500 font-mono">{item.date}</span>
                    <button
                      onClick={() => handleNavigate(item.targetView)}
                      className="flex items-center gap-1 font-semibold text-amber-700 hover:text-amber-800 text-[11px]"
                    >
                      <span>Resolve in {item.category}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 text-[11px] text-slate-500 text-center">
          Alerts are derived dynamically from active inventory, quality hold, and maintenance records.
        </div>
      </div>
    </div>
  );
}
