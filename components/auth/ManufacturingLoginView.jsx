"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { MANUFACTURING_DEMO_USERS } from "./manufacturingDemoUsers";
import {
  Shield,
  Lock,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  Factory,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
  KeyRound,
  HelpCircle,
  X,
  BadgeCheck,
  Cpu,
  Layers,
} from "lucide-react";

export default function ManufacturingLoginView({ onLoginSuccess, onBackToLanding }) {
  const { login, MANUFACTURING_DEMO_USERS: demoUsersList, showToast } = useApp();
  const demoUsers = demoUsersList || MANUFACTURING_DEMO_USERS;

  const [selectedPersona, setSelectedPersona] = useState(demoUsers[0]);
  const [email, setEmail] = useState(demoUsers[0].email);
  const [password, setPassword] = useState(demoUsers[0].password);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);

  const handleSelectPersona = (persona) => {
    setSelectedPersona(persona);
    setEmail(persona.email);
    setPassword(persona.password);
  };

  const handleQuickLogin = (persona) => {
    setIsLoading(true);
    setSelectedPersona(persona);
    setEmail(persona.email);
    setPassword(persona.password);

    setTimeout(() => {
      login(persona.email, persona.password);
      setIsLoading(false);
      if (onLoginSuccess) onLoginSuccess();
    }, 250);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      showToast("Please enter work email or operator code", "error");
      return;
    }
    setIsLoading(true);

    setTimeout(() => {
      const res = login(email, password);
      setIsLoading(false);
      if (res?.success && onLoginSuccess) {
        onLoginSuccess();
      }
    }, 250);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 flex flex-col justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="w-full max-w-4xl mx-auto space-y-6">
        
        {/* Top Navigation Row */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onBackToLanding}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl transition-all shadow-2xs cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Public Website</span>
          </button>

          <button
            type="button"
            onClick={() => setShowCredentialsModal(true)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>Plant Demo Credentials Guide</span>
          </button>
        </div>

        {/* Main Card */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left Column: Form & Personas */}
          <div className="p-6 sm:p-8 lg:p-10 lg:col-span-7 flex flex-col justify-between">
            <div className="space-y-6">
              
              {/* Header */}
              <div className="space-y-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-base shadow-xs">
                    FF
                  </div>
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                      ForgeFlow MPMS Portal
                    </h1>
                    <p className="text-xs text-slate-500 font-medium">
                      Precision Manufacturing & Production Execution System
                    </p>
                  </div>
                </div>
              </div>

              {/* 1-Click Quick Persona Selection */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Quick-Select Plant Persona (1-Click Login)</span>
                  </label>
                  <span className="text-[10px] text-slate-400 font-medium">Click to auto-fill & login</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {demoUsers.map((persona) => {
                    const isSelected = selectedPersona?.id === persona.id;
                    return (
                      <button
                        key={persona.id}
                        type="button"
                        onClick={() => handleSelectPersona(persona)}
                        onDoubleClick={() => handleQuickLogin(persona)}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1 ${
                          isSelected
                            ? "bg-amber-50/80 border-amber-400 ring-2 ring-amber-500/15 shadow-2xs"
                            : "bg-slate-50/80 border-slate-200 hover:bg-slate-100 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${persona.badgeColor}`}>
                            {persona.role.split(" ")[0]}
                          </span>
                          {isSelected && <BadgeCheck className="w-3.5 h-3.5 text-amber-600 shrink-0" />}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 truncate">
                            {persona.name}
                          </p>
                          <p className="text-[10px] text-slate-500 truncate">
                            {persona.department}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Plant Work Email / Employee Code
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. vikram.rathore@forgeflow.in"
                      className="block w-full pl-9.5 pr-3 py-2 text-xs sm:text-sm text-slate-900 bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-mono"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-700">
                      Password
                    </label>
                    <span className="text-[11px] text-amber-700 font-mono font-medium">
                      Default: admin123
                    </span>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      className="block w-full pl-9.5 pr-10 py-2 text-xs sm:text-sm text-slate-900 bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-mono"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded text-amber-600 border-slate-300 focus:ring-amber-500/20"
                    />
                    <span className="text-slate-600 font-medium">Keep session active</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedPersona) {
                        handleQuickLogin(selectedPersona);
                      }
                    }}
                    className="text-amber-700 hover:underline font-semibold text-xs cursor-pointer"
                  >
                    1-Click Fast Login →
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-2.5 px-4 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs sm:text-sm transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  {isLoading ? (
                    <span>Accessing Plant Workspace...</span>
                  ) : (
                    <>
                      <span>Enter as {selectedPersona?.name || "Authorized Operator"}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>

            <p className="text-[11px] text-slate-400 text-center pt-6 mt-4 border-t border-slate-100">
              ForgeFlow Industries Pvt. Ltd. · Factory Security Gateway v3.1
            </p>
          </div>

          {/* Right Column: Persona Scope & Privilege Breakdown */}
          <div className="bg-slate-950 text-slate-200 p-6 sm:p-8 lg:p-10 lg:col-span-5 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-800">
            <div className="space-y-6">
              
              <div>
                <span className="text-[10px] font-bold tracking-wider uppercase text-amber-400 block mb-1">
                  Active Operator Profile
                </span>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>{selectedPersona.name}</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${selectedPersona.badgeColor}`}>
                    {selectedPersona.role}
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {selectedPersona.roleLabel} · {selectedPersona.department}
                </p>
              </div>

              <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 space-y-2 text-xs">
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  {selectedPersona.description}
                </p>
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>Facility: <strong className="text-white">Jaipur Plant</strong></span>
                  <span>Default View: <strong className="text-amber-400 capitalize">{selectedPersona.defaultView}</strong></span>
                </div>
              </div>

              {/* Manufacturing Capabilities Checklist */}
              <div className="space-y-2.5">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Included Factory Modules
                </p>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Multi-level Bill of Materials (BOM) & Scrap Drag</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Shop Floor Routing & Real-time Job Card Logs</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Dual-gate Quality Assurance & Defect Quarantine</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Official Delivery Challans & Stock Ledgers</span>
                  </li>
                </ul>
              </div>

            </div>

            {/* Direct 1-Click Launch Button */}
            <div className="pt-6 mt-6 border-t border-slate-800">
              <button
                type="button"
                onClick={() => handleQuickLogin(selectedPersona)}
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-all border border-slate-700 flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:border-slate-600"
              >
                <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                <span>Launch Workspace as {selectedPersona.role}</span>
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* Demo Credentials Guide Modal */}
      {showCredentialsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-5 relative max-h-[90vh] overflow-y-auto">
            
            <button
              type="button"
              onClick={() => setShowCredentialsModal(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Shield className="w-5 h-5 text-amber-600" />
                <span>ForgeFlow MPMS — Plant Demo Credentials Reference</span>
              </h2>
              <p className="text-xs text-slate-500">
                All operator accounts share the standard password: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-800 font-bold border border-slate-200">admin123</code>
              </p>
            </div>

            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
              {demoUsers.map((u) => (
                <div key={u.id} className="p-3.5 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{u.name}</span>
                      <span className={`px-1.5 py-0.2 rounded text-[10px] font-semibold border ${u.badgeColor}`}>
                        {u.role}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Email: <code className="text-amber-700 font-mono font-medium">{u.email}</code>
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Department: {u.department} · {u.roleLabel}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setShowCredentialsModal(false);
                      handleQuickLogin(u);
                    }}
                    className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 font-semibold rounded-lg text-xs transition-colors shrink-0 flex items-center justify-center gap-1 cursor-pointer border border-amber-200"
                  >
                    <span>Login as {u.role.split(" ")[0]}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowCredentialsModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Close Reference
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
