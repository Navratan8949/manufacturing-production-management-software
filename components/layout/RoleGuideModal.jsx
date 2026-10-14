"use client";

import React, { useState } from "react";
import { useApp, ROLE_DEFINITIONS, GUIDED_SCENARIOS } from "@/context/AppContext";
import {
  X,
  Shield,
  Play,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  UserCheck,
  Building,
  Sparkles,
  Lock,
} from "lucide-react";

export function RoleGuideModal({ isOpen, onClose }) {
  const { data, setCurrentUserRole, setActiveView, startGuidedScenario } = useApp();
  const [activeTab, setActiveTab] = useState("scenarios"); // 'scenarios' or 'roles'
  const [selectedRole, setSelectedRole] = useState(data.currentUserRole);

  if (!isOpen) return null;

  const currentRole = data.currentUserRole;

  const handleLaunchRole = (roleName) => {
    setCurrentUserRole(roleName);
    const def = ROLE_DEFINITIONS[roleName];
    const defaultView = def?.allowedModules[0] || "dashboard";
    setActiveView(defaultView);
    onClose();
  };

  const handleStartScenario = (scenarioId) => {
    startGuidedScenario(scenarioId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">Factory Roles & Guided Scenarios</h2>
                <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  Interactive Guide
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Understand who does what in a modern fabrication plant and test real-world end-to-end workflows.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 shrink-0 text-xs font-semibold">
          <button
            onClick={() => setActiveTab("scenarios")}
            className={`py-3.5 px-4 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === "scenarios"
                ? "border-amber-500 text-slate-950 font-bold bg-white"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <Play className="w-4 h-4 text-amber-500" />
            <span>Interactive Guided Tours ({GUIDED_SCENARIOS.length} Scenarios)</span>
          </button>
          <button
            onClick={() => setActiveTab("roles")}
            className={`py-3.5 px-4 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === "roles"
                ? "border-amber-500 text-slate-950 font-bold bg-white"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <UserCheck className="w-4 h-4 text-blue-500" />
            <span>All 9 Plant Roles & Permissions</span>
          </button>
        </div>

        {/* Body Scrollable */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === "scenarios" && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 flex items-start gap-3">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">How Interactive Scenarios Work:</p>
                  <p className="text-amber-900 mt-0.5">
                    Clicking &ldquo;Start Scenario&rdquo; will automatically switch your user perspective to that specific factory role, navigate to the relevant plant screen, and pin a step-by-step checklist on top so you can experience how each department operates without guessing.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {GUIDED_SCENARIOS.map((sc) => {
                  const roleDef = ROLE_DEFINITIONS[sc.role];
                  return (
                    <div
                      key={sc.id}
                      className="p-5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:shadow-xs transition-all space-y-4 flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="w-6 h-6 rounded-full bg-slate-900 text-amber-400 font-mono font-bold text-xs flex items-center justify-center">
                            {sc.code}
                          </span>
                          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${roleDef?.color || "bg-slate-100 text-slate-800"}`}>
                            Role: {sc.role}
                          </span>
                        </div>

                        <h3 className="font-bold text-slate-900 text-sm">{sc.title}</h3>

                        <div className="space-y-1.5 text-xs text-slate-600 border-l-2 border-slate-200 pl-3">
                          <p><strong className="text-slate-800">1.</strong> {sc.step1}</p>
                          <p><strong className="text-slate-800">2.</strong> {sc.step2}</p>
                          <p><strong className="text-slate-800">3.</strong> {sc.step3}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleStartScenario(sc.id)}
                        className="w-full py-2.5 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-2xs"
                      >
                        <Play className="w-3.5 h-3.5 text-amber-400" />
                        <span>Start Scenario {sc.code} as {sc.role}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === "roles" && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Left list of roles */}
              <div className="md:col-span-5 space-y-1.5 max-h-[500px] overflow-y-auto pr-2">
                {Object.entries(ROLE_DEFINITIONS).map(([roleName, def]) => {
                  const isSelected = selectedRole === roleName;
                  const isCurrent = currentRole === roleName;

                  return (
                    <button
                      key={roleName}
                      onClick={() => setSelectedRole(roleName)}
                      className={`w-full p-3 rounded-xl text-left border transition-all flex items-center justify-between ${
                        isSelected
                          ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                          : "bg-white text-slate-800 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <div className="truncate pr-2">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-xs truncate">{roleName}</p>
                          {isCurrent && (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-400 text-slate-950">
                              Active
                            </span>
                          )}
                        </div>
                        <p className={`text-[11px] truncate mt-0.5 ${isSelected ? "text-slate-300" : "text-slate-500"}`}>
                          {def.allowedModules.length} Modules Allowed
                        </p>
                      </div>
                      <ArrowRight className={`w-3.5 h-3.5 shrink-0 ${isSelected ? "text-amber-400" : "text-slate-400"}`} />
                    </button>
                  );
                })}
              </div>

              {/* Right role detail */}
              <div className="md:col-span-7 bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-5">
                {(() => {
                  const def = ROLE_DEFINITIONS[selectedRole];
                  if (!def) return null;
                  const isCurrent = currentRole === selectedRole;

                  return (
                    <>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-md border ${def.color}`}>
                              {selectedRole}
                            </span>
                            {isCurrent && (
                              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                                Currently Logged In
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                            {def.description}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                          Operational Authority & Permissions:
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {def.permissions.map((perm) => (
                            <span
                              key={perm}
                              className="text-[11px] font-mono px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 font-semibold"
                            >
                              {perm}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                          Authorized Workspace Screens ({def.allowedModules.length}):
                        </p>
                        <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                          {def.allowedModules.map((mod) => (
                            <span
                              key={mod}
                              className="text-[11px] px-2 py-0.5 rounded bg-slate-200/80 text-slate-800 font-medium"
                            >
                              {mod}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-200">
                        <button
                          onClick={() => handleLaunchRole(selectedRole)}
                          className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
                        >
                          <UserCheck className="w-4 h-4 text-amber-400" />
                          <span>Switch to {selectedRole} & Open Workspace</span>
                        </button>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
