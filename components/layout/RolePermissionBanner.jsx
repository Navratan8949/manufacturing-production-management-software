"use client";

import React, { useState } from "react";
import { useApp, ROLE_DEFINITIONS, GUIDED_SCENARIOS } from "@/context/AppContext";
import {
  Shield,
  Compass,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  X,
  Sparkles,
  Info,
} from "lucide-react";

export function RolePermissionBanner() {
  const {
    data,
    setCurrentUserRole,
    activeScenario,
    setActiveScenario,
    startGuidedScenario,
    setActiveView,
  } = useApp();

  const [expanded, setExpanded] = useState(false);
  const currentRoleDef = ROLE_DEFINITIONS[data.currentUserRole] || ROLE_DEFINITIONS["Owner / Super Admin"];

  return (
    <div className="mb-5 space-y-2">
      {/* Active Guided Scenario Card (if active) */}
      {activeScenario && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-slate-900/5 border border-amber-300 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-black flex items-center justify-center text-[11px]">
                {activeScenario.code}
              </span>
              <span className="font-bold text-slate-900 text-sm">{activeScenario.title}</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-900 uppercase">
                Active Perspective: {activeScenario.role}
              </span>
            </div>
            <p className="text-slate-600 pl-7 text-[11px] leading-relaxed">
              <strong>Step 1:</strong> {activeScenario.step1} <span className="text-slate-400">·</span>{" "}
              <strong>Step 2:</strong> {activeScenario.step2} <span className="text-slate-400">·</span>{" "}
              <strong>Step 3:</strong> {activeScenario.step3}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
            <button
              onClick={() => setActiveView(activeScenario.targetView)}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs shadow-2xs flex items-center gap-1 transition-colors"
            >
              <span>Go to Step Screen</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setActiveScenario(null)}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              title="Close Guide"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Interactive Role & Scenario Control Bar */}
      <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-3 text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          {/* Active Role and Capabilities Summary */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
              <Shield className="w-4 h-4 text-amber-500" />
              <span>Active Demo Role:</span>
            </span>

            <span className={`px-2.5 py-0.5 rounded-md font-bold text-xs border ${currentRoleDef.color}`}>
              {data.currentUserRole}
            </span>

            <span className="text-slate-500 text-[11px] hidden lg:inline">
              {currentRoleDef.description}
            </span>
          </div>

          {/* Quick toggle for expanded scenario suite */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 font-semibold text-slate-600 hover:text-slate-900 px-2 py-1 rounded hover:bg-slate-100 transition-colors"
            >
              <Compass className="w-3.5 h-3.5 text-amber-600" />
              <span>{expanded ? "Hide Tour Scenarios" : "6 Guided Tours & Role Switcher"}</span>
              {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Expanded 1-click Role Switcher and Scenario Matrix */}
        {expanded && (
          <div className="pt-3 border-t border-slate-100 space-y-3 animate-in fade-in duration-150">
            {/* 1-click Role Selector */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Switch Perspective (9 Simulated Factory Roles):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {Object.keys(ROLE_DEFINITIONS).map((roleName) => {
                  const isCurrent = data.currentUserRole === roleName;
                  return (
                    <button
                      key={roleName}
                      onClick={() => setCurrentUserRole(roleName)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                        isCurrent
                          ? "bg-slate-900 text-white shadow-2xs font-bold"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {roleName}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 1-click Scenario Jump Buttons */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Guided End-to-End Scenarios:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {GUIDED_SCENARIOS.map((sc) => (
                  <button
                    key={sc.id}
                    onClick={() => startGuidedScenario(sc.id)}
                    className="p-2.5 rounded-lg border border-slate-200 hover:border-amber-400 bg-slate-50 hover:bg-amber-50/50 text-left transition-colors flex items-start gap-2 group"
                  >
                    <span className="w-5 h-5 rounded bg-slate-900 text-amber-400 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                      {sc.code}
                    </span>
                    <div className="truncate">
                      <p className="font-bold text-slate-900 text-xs leading-tight truncate">{sc.title}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5 truncate">Role: {sc.role}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
