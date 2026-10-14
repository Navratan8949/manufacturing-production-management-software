"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  Play,
  CheckCircle2,
  X,
  ArrowRight,
  Sparkles,
  HelpCircle,
} from "lucide-react";

export function ActiveScenarioBanner() {
  const { activeScenario, setActiveScenario, showToast } = useApp();
  const [completedSteps, setCompletedSteps] = useState({
    1: false,
    2: false,
    3: false,
  });

  if (!activeScenario) return null;

  const toggleStep = (stepNum) => {
    setCompletedSteps((prev) => {
      const next = { ...prev, [stepNum]: !prev[stepNum] };
      if (next[1] && next[2] && next[3]) {
        showToast(`🎉 Bravo! Scenario ${activeScenario.code} completed successfully.`);
      }
      return next;
    });
  };

  const allCompleted = completedSteps[1] && completedSteps[2] && completedSteps[3];

  return (
    <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 px-4 py-3 border-b border-amber-600 shadow-sm shrink-0">
      <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        {/* Left: Scenario Info */}
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-slate-950 text-amber-400 font-mono font-black flex items-center justify-center shrink-0 text-xs shadow-xs">
            {activeScenario.code}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-950 text-sm">
                Guided Walkthrough: {activeScenario.title}
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-950 text-white uppercase tracking-wider">
                {activeScenario.role}
              </span>
            </div>
            <p className="text-[11px] text-slate-900 font-medium">
              Follow these 3 steps in the active workspace below to test this industrial lifecycle:
            </p>
          </div>
        </div>

        {/* Middle: Step checkboxes */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => toggleStep(1)}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1.5 transition-all ${
              completedSteps[1]
                ? "bg-slate-950 text-white"
                : "bg-white/80 hover:bg-white text-slate-900 border border-slate-300"
            }`}
          >
            <CheckCircle2 className={`w-3.5 h-3.5 ${completedSteps[1] ? "text-emerald-400" : "text-slate-400"}`} />
            <span>Step 1</span>
          </button>

          <button
            type="button"
            onClick={() => toggleStep(2)}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1.5 transition-all ${
              completedSteps[2]
                ? "bg-slate-950 text-white"
                : "bg-white/80 hover:bg-white text-slate-900 border border-slate-300"
            }`}
          >
            <CheckCircle2 className={`w-3.5 h-3.5 ${completedSteps[2] ? "text-emerald-400" : "text-slate-400"}`} />
            <span>Step 2</span>
          </button>

          <button
            type="button"
            onClick={() => toggleStep(3)}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1.5 transition-all ${
              completedSteps[3]
                ? "bg-slate-950 text-white"
                : "bg-white/80 hover:bg-white text-slate-900 border border-slate-300"
            }`}
          >
            <CheckCircle2 className={`w-3.5 h-3.5 ${completedSteps[3] ? "text-emerald-400" : "text-slate-400"}`} />
            <span>Step 3</span>
          </button>

          {allCompleted && (
            <span className="text-[11px] font-bold text-slate-950 bg-emerald-300 px-2 py-0.5 rounded flex items-center gap-1">
              <span>All Done!</span>
            </span>
          )}
        </div>

        {/* Right: Exit / Dismiss */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              setActiveScenario(null);
              showToast("Guided tour closed.");
            }}
            className="p-1 rounded text-slate-950 hover:bg-black/10 transition-colors"
            title="Exit Walkthrough"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
