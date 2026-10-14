"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp, ROLE_DEFINITIONS } from "@/context/AppContext";
import {
  ArrowRight,
  Shield,
  Layers,
  FileSpreadsheet,
  Cpu,
  BarChart3,
  CheckCircle2,
  Boxes,
  Truck,
  Flame,
  Clock,
  Sparkles,
  ChevronRight,
  Factory,
  Compass,
  UserCheck,
  Users,
  Wrench,
  Receipt,
  RotateCw,
  KeyRound,
  Menu,
  X,
} from "lucide-react";
import { formatINR } from "@/lib/utils";

export function LandingPage() {
  const { setActiveView, setIsLandingView, setCurrentUserRole, kpis } = useApp();
  const [selectedWorkflowStep, setSelectedWorkflowStep] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const workflowSteps = [
    {
      step: "01",
      title: "Procurement & Quality GRN",
      tagline: "Purchase orders with dual-gate inspection",
      detail:
        "Raise POs against preferred suppliers. When shipments reach the gate, record accepted vs rejected units during Goods Receipt (GRN). Only verified material credits into usable inventory.",
      metrics: "Zero uninspected stock slips",
    },
    {
      step: "02",
      title: "Multi-Level Bill of Materials (BOM)",
      tagline: "Precision component trees with scrap allowances",
      detail:
        "Formulate detailed recipe trees for executive desks, chairs, and steel racks. Include standard cutting wastage margins and automated unit costing per batch.",
      metrics: "99.4% component estimation precision",
    },
    {
      step: "03",
      title: "MRP Lite & Stock Reservation",
      tagline: "Deterministic shortage prevention",
      detail:
        "Net Shortage = max(0, Gross Requirement − Eligible Available Stock). Lock component reservations prior to work order release so lines never stall midway.",
      metrics: "32% reduction in WIP downtime",
    },
    {
      step: "04",
      title: "Shop Floor Routing & Job Cards",
      tagline: "Machine-level dispatch and operator tracking",
      detail:
        "Split work orders into routing sequences: CNC wood sizing, PVC edge banding, TIG frame welding, powder coating, and final assembly. Track operator hours and cycle times.",
      metrics: "Real-time workstation balance",
    },
    {
      step: "05",
      title: "Multi-Stage Quality Clearance",
      tagline: "Quarantine hold & defect traceability",
      detail:
        "Every batch passes rigorous caliper tolerance checks, peel tests, and weld penetration inspections. Defective units route to rework; only accepted output reaches sellable goods.",
      metrics: "1.8% first-pass defect rate",
    },
    {
      step: "06",
      title: "Delivery Challan & Dispatch",
      tagline: "Carrier assignments with ledger deductions",
      detail:
        "Allocate finished goods against confirmed customer sales orders. Generate printable delivery challans with transporter vehicle numbers and automated stock ledger deductions.",
      metrics: "100% dispatch traceability",
    },
  ];

  const handleLaunchApp = (view = "dashboard", role = null) => {
    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem("forgeflow_in_erp", "true");
      } catch {}
    }
    if (role) {
      setCurrentUserRole(role);
    }
    setActiveView(view);
    setIsLandingView(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950">
      {/* Top Bar: Responsive with Brand, Links, Demo Login, Launch, and Mobile Drawer */}
      <header className="h-16 px-4 sm:px-6 lg:px-12 border-b border-slate-800/80 bg-slate-950/95 sticky top-0 z-40 backdrop-blur-md flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 -ml-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 cursor-pointer"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <button
            onClick={() => handleLaunchApp("dashboard")}
            className="text-lg font-bold tracking-tight text-white flex items-center gap-2.5 whitespace-nowrap shrink-0 group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black text-sm group-hover:bg-amber-400 transition-colors">
              FF
            </div>
            <span className="font-bold text-white text-base">ForgeFlow</span>
          </button>
        </div>

        {/* Zone 2: Concise nav links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-slate-300">
          <a href="#workflow" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
            Factory Lifecycle
          </a>
          <a href="#roles" className="hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5">
            <span className="text-amber-400 font-bold">Role Workspaces</span>
          </a>
          <a href="#features" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
            Capabilities
          </a>
          <a href="#testimonials" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
            Case Study
          </a>
        </nav>

        {/* Zone 3: Demo Login and Launch buttons */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Link
            href="/login"
            className="px-3 sm:px-3.5 py-1.5 sm:py-2 text-xs font-semibold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs whitespace-nowrap cursor-pointer"
          >
            <KeyRound className="w-3.5 h-3.5 text-amber-400" />
            <span>Demo Login</span>
          </Link>

          <button
            onClick={() => handleLaunchApp("dashboard")}
            className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shadow-sm shadow-amber-500/20 whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <span>Launch Factory Demo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Mobile Menu Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-6 py-4 space-y-3 animate-in slide-in-from-top duration-200">
          <div className="space-y-1">
            <a
              href="#workflow"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm text-slate-300 hover:text-white font-medium"
            >
              Factory Lifecycle
            </a>
            <a
              href="#roles"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm text-amber-400 hover:text-amber-300 font-semibold"
            >
              Role Workspaces (9 Roles)
            </a>
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm text-slate-300 hover:text-white font-medium"
            >
              Plant Capabilities
            </a>
            <a
              href="#testimonials"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm text-slate-300 hover:text-white font-medium"
            >
              Case Study
            </a>
          </div>

          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2 text-xs font-semibold text-center text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 flex items-center justify-center gap-2"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span>Sign In with Demo Personas</span>
            </Link>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleLaunchApp("dashboard");
              }}
              className="w-full py-2 text-xs font-bold text-center text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm"
            >
              Launch Interactive Factory Demo
            </button>
          </div>
        </div>
      )}

      {/* Hero Section with Luxury High-Tech Industrial Precision Factory Background */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-32 px-4 sm:px-6 lg:px-12 w-full overflow-hidden border-b border-slate-800 bg-slate-950 text-white">
        {/* Background Image Layer with Optimized Unsplash Industrial Factory Automation */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat scale-105 transform transition-transform duration-1000 opacity-25"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=2400&q=85')`,
          }}
        />

        {/* Sophisticated Dark Slate Overlays & Industrial Amber Ambient Lighting */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-slate-950/94 via-slate-950/88 to-slate-950/98 backdrop-blur-[2px]" />
        <div className="absolute top-1/4 left-1/3 -translate-x-1/2 w-[650px] h-[350px] bg-amber-500/15 blur-[140px] rounded-full pointer-events-none z-0" />
        <div className="absolute -top-10 right-10 w-[450px] h-[300px] bg-blue-600/15 blur-[110px] rounded-full pointer-events-none z-0" />

        <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
              <span className="text-amber-400 font-semibold">Industrial ERP Architecture</span>
              <span aria-hidden="true">·</span>
              <span>Jaipur Fabrication Plant Demo</span>
              <span aria-hidden="true">·</span>
              <span>100% Local Persistence</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              From Raw Materials to Finished Products—Manage Production in One Place.
            </h1>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl font-normal">
              Engineered for furniture manufacturers, light metal fabricators, and assembly units.
              Gain complete operational visibility across raw material procurement, Bills of Materials, shop floor job cards, multi-gate quality clearance, and dispatch delivery challans.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => handleLaunchApp("dashboard", "Owner / Super Admin")}
                className="px-6 py-3.5 text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2 cursor-pointer"
              >
                <span>Enter Factory Command Center</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <Link
                href="/login"
                className="px-5 py-3.5 text-sm font-semibold text-white bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-lg border border-white/20 transition-colors flex items-center gap-2 shadow-sm"
              >
                <Shield className="w-4 h-4 text-amber-400" />
                <span>Sign In with Demo Personas (9 Roles)</span>
              </Link>

              <button
                onClick={() => handleLaunchApp("work-orders", "Production Manager")}
                className="px-4 py-3.5 text-sm font-semibold text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>Inspect Work Orders</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {/* Quick Role Fast-Triggers */}
            <div className="pt-1 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-400 font-medium">Or enter directly as:</span>
              <button
                onClick={() => handleLaunchApp("materials", "Storekeeper")}
                className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-700 font-medium transition-colors cursor-pointer"
              >
                Storekeeper
              </button>
              <button
                onClick={() => handleLaunchApp("quality", "Quality Inspector")}
                className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-emerald-300 border border-slate-700 font-medium transition-colors cursor-pointer"
              >
                Quality Inspector
              </button>
              <button
                onClick={() => handleLaunchApp("production-floor", "Production Supervisor")}
                className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-orange-300 border border-slate-700 font-medium transition-colors cursor-pointer"
              >
                Supervisor
              </button>
              <button
                onClick={() => handleLaunchApp("dispatch", "Dispatch Manager")}
                className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-indigo-300 border border-slate-700 font-medium transition-colors cursor-pointer"
              >
                Dispatch
              </button>
              <button
                onClick={() => handleLaunchApp("costing", "Accountant / Cost Analyst")}
                className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-teal-300 border border-slate-700 font-medium transition-colors cursor-pointer"
              >
                Cost Analyst
              </button>
            </div>

            {/* Micro Quantitative Trust Markers */}
            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-400 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Deterministic Stock Reservation</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero Phantom Inventory Deductions</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Print-Ready Delivery Challans</span>
              </div>
            </div>
          </div>

          {/* Hero Visual Card: Interactive Live Plant Terminal */}
          <div className="lg:col-span-5">
            <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-6 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 text-xs">
                <div className="flex items-center gap-2 font-mono text-slate-300">
                  <Factory className="w-4 h-4 text-amber-400" />
                  <span>PLANT_TELEMETRY: JAIPUR_VKI</span>
                </div>
                <span className="text-[11px] font-mono font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded">
                  Active Demo State
                </span>
              </div>

              <div className="py-4 space-y-4">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800/80">
                    <p className="text-slate-400 text-[11px]">Active Production</p>
                    <p className="text-xl font-bold font-mono text-white mt-0.5">
                      {kpis.inProgressWOs} Orders
                    </p>
                    <p className="text-[10px] text-slate-500 mt-1">{kpis.actualQtyTotal} pcs produced</p>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800/80">
                    <p className="text-slate-400 text-[11px]">Raw Material Valuation</p>
                    <p className="text-xl font-bold font-mono text-amber-400 mt-0.5">
                      {formatINR(kpis.rawMaterialStockValue)}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-1">Weighted average cost</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-semibold">Production Achievement</span>
                    <span className="font-mono font-bold text-amber-400">{kpis.achievementPercent}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, kpis.achievementPercent)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Target: {kpis.plannedQtyTotal} Units</span>
                    <span>Completed: {kpis.actualQtyTotal} Units</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800">
                  <span>QC First-Pass Rejection</span>
                  <span className="font-mono text-white font-semibold">{kpis.rejectionRate}% (Tolerable)</span>
                </div>
              </div>

              <button
                onClick={() => handleLaunchApp("dashboard")}
                className="w-full py-2.5 text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700 flex items-center justify-center gap-1.5"
              >
                <span>Open Command Center</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
              </button>
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* Section 1: End-to-End Manufacturing Lifecycle Simulator */}
      <section id="workflow" className="py-20 px-6 lg:px-12 bg-slate-900/40 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="max-w-2xl space-y-3">
            <p className="text-xs font-bold text-amber-400 uppercase tracking-wider">Production Flow</p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              An Interconnected Workflow Without Information Silos
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Every operation updates inventory, costing ledgers, and operational dashboards in lockstep.
              Select any stage below to inspect its operational logic.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {workflowSteps.map((step, idx) => {
              const isSelected = selectedWorkflowStep === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedWorkflowStep(idx)}
                  className={`p-4 rounded-xl text-left transition-all border ${
                    isSelected
                      ? "bg-slate-800 border-amber-400/80 shadow-md text-white"
                      : "bg-slate-950/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                  }`}
                >
                  <p className="text-xs font-mono font-bold text-amber-400 mb-2">{step.step}</p>
                  <p className="text-xs font-bold leading-tight mb-1">{step.title}</p>
                  <p className="text-[11px] text-slate-400 line-clamp-2">{step.tagline}</p>
                </button>
              );
            })}
          </div>

          {/* Workflow Detail Spotlight */}
          <div className="p-6 sm:p-8 rounded-xl bg-slate-900 border border-slate-800 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
                <span>STAGE {workflowSteps[selectedWorkflowStep].step}</span>
                <span>·</span>
                <span>{workflowSteps[selectedWorkflowStep].tagline}</span>
              </div>
              <h3 className="text-xl font-bold text-white">
                {workflowSteps[selectedWorkflowStep].title}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {workflowSteps[selectedWorkflowStep].detail}
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs text-emerald-400 font-medium">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Audited Benefit: {workflowSteps[selectedWorkflowStep].metrics}</span>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-3">
              <button
                onClick={() => {
                  const targetViews = [
                    "purchase-orders",
                    "bom",
                    "mrp",
                    "production-floor",
                    "quality",
                    "dispatch",
                  ];
                  handleLaunchApp(targetViews[selectedWorkflowStep] || "dashboard");
                }}
                className="w-full py-3 px-4 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <span>Test This Module in Live App</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <p className="text-[11px] text-slate-500 text-center">
                Pre-seeded with real Jaipur furniture & light fabrication transactions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section: Role-Based Workspaces & Permissions */}
      <section id="roles" className="py-20 px-6 lg:px-12 bg-slate-900/70 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="max-w-3xl space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <Shield className="w-4 h-4" />
              <span>Role-Based Access Architecture</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Every Department Gets Exactly What They Need — Nothing Less, Nothing More.
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Real industrial facilities partition authority to enforce material accountability and ISO compliance.
              Explore our 9 distinct factory roles below. Click any role to jump directly into their tailored workspace.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Object.entries(ROLE_DEFINITIONS).map(([roleName, def]) => {
              const getPrimaryView = (role) => {
                switch (role) {
                  case "Storekeeper": return "materials";
                  case "Production Supervisor": return "production-floor";
                  case "Quality Inspector": return "quality";
                  case "Procurement Manager": return "purchase-orders";
                  case "Dispatch Manager": return "dispatch";
                  case "Accountant / Cost Analyst": return "costing";
                  case "Maintenance Technician": return "maintenance";
                  case "Production Manager": return "work-orders";
                  default: return "dashboard";
                }
              };

              return (
                <div
                  key={roleName}
                  className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-5 group hover:shadow-lg hover:shadow-amber-500/5"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-md border ${def.color}`}>
                        {roleName}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500">
                        {def.allowedModules.length} Modules
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed min-h-[48px]">
                      {def.description}
                    </p>

                    <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Core Authority:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {def.permissions.slice(0, 3).map((perm) => (
                          <span
                            key={perm}
                            className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300"
                          >
                            {perm}
                          </span>
                        ))}
                        {def.permissions.length > 3 && (
                          <span className="text-[10px] text-slate-500 py-0.5">
                            +{def.permissions.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleLaunchApp(getPrimaryView(roleName), roleName)}
                    className="w-full py-2.5 px-3 rounded-lg bg-slate-900 hover:bg-amber-400 text-slate-200 hover:text-slate-950 font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 hover:border-amber-400 transition-all cursor-pointer group-hover:bg-slate-850"
                  >
                    <span>Launch as {roleName}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 2: Core Capabilities Matrix */}
      <section id="features" className="py-20 px-6 lg:px-12 max-w-7xl mx-auto w-full space-y-16">
        <div className="max-w-2xl space-y-3">
          <p className="text-xs font-bold text-amber-400 uppercase tracking-wider">Enterprise Modules</p>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Built Specifically for Physical Fabrication & Assembly Units
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Generic CRM and retail inventory software fail on the factory floor because they lack routing job cards, multi-gate quality holds, and BOM scrap math. ForgeFlow was purpose-built for fabrication.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="w-10 h-10 rounded-lg bg-slate-800 text-amber-400 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">Multi-Level Bill of Materials</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Define recursive components for sheets, tubes, fasteners, glues, and packaging. Automatically calculate batch cost multipliers with precise scrap allowances.
            </p>
            <button
              onClick={() => handleLaunchApp("bom")}
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 pt-1"
            >
              <span>Explore BOM Studio</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="w-10 h-10 rounded-lg bg-slate-800 text-amber-400 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">Deterministic MRP Lite</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Calculate exact shortages against planned work orders using: Net Shortage = max(0, Gross Requirement − Eligible Available Stock). Generate PO drafts with one click.
            </p>
            <button
              onClick={() => handleLaunchApp("mrp")}
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 pt-1"
            >
              <span>Test MRP Engine</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="w-10 h-10 rounded-lg bg-slate-800 text-amber-400 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">Machine & Workstation Scheduling</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Manage CNC wood routers, tube circular saws, TIG welding booths, and powder coating lines. Track runtime hours, efficiency ratings, and preventive lube cycles.
            </p>
            <button
              onClick={() => handleLaunchApp("machines")}
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 pt-1"
            >
              <span>View Machine Fleet</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="w-10 h-10 rounded-lg bg-slate-800 text-amber-400 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">Multi-Gate Quality Control</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enforce pass/fail checklists for incoming GRNs and completed work orders. Rejected output cannot enter sellable finished stock, safeguarding customer reputation.
            </p>
            <button
              onClick={() => handleLaunchApp("quality")}
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 pt-1"
            >
              <span>Inspect QA Checklists</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="w-10 h-10 rounded-lg bg-slate-800 text-amber-400 flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">Delivery Challans & Dispatch</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Generate industrial delivery challans (DC) with transporter details, driver contact numbers, and vehicle registration. Deduct finished goods stock automatically.
            </p>
            <button
              onClick={() => handleLaunchApp("dispatch")}
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 pt-1"
            >
              <span>Check Dispatch Queue</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="w-10 h-10 rounded-lg bg-slate-800 text-amber-400 flex items-center justify-center">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">Actual vs Standard Costing</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Compare estimated BOM component expenses against actual material consumption logs, direct machine electrical load, and labor hours per unit produced.
            </p>
            <button
              onClick={() => handleLaunchApp("costing")}
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 pt-1"
            >
              <span>Analyze Cost Variances</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Section 3: Case Study & Testimonial */}
      <section id="testimonials" className="py-20 px-6 lg:px-12 bg-slate-900/60 border-t border-slate-800/80">
        <div className="max-w-4xl mx-auto rounded-2xl bg-slate-950 p-8 sm:p-12 border border-slate-800 space-y-8">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
            <span>OPERATIONAL CASE STUDY</span>
            <span>·</span>
            <span>JAIPUR REGION</span>
          </div>

          <blockquote className="text-lg sm:text-xl text-slate-200 font-medium leading-relaxed italic">
            &ldquo;Before ForgeFlow, our storekeeper and assembly supervisor relied on paper slips and WhatsApp groups. We frequently stopped our 3-axis CNC router because someone forgot to reorder fasteners or edge-banding tape. With ForgeFlow’s real-time BOM reservations and Goods Receipt QC, we cut work-in-progress idle time by 32% within two months.&rdquo;
          </blockquote>

          <div className="flex items-center justify-between pt-4 border-t border-slate-800/80 text-xs">
            <div>
              <p className="font-bold text-white text-sm">Rajesh Sharma</p>
              <p className="text-slate-400">Managing Director · Rajasthan Modular Systems, Sitapura, Jaipur</p>
            </div>
            <div className="text-right font-mono text-slate-400 hidden sm:block">
              <p className="text-white font-bold">120,000 sq ft Plant</p>
              <p>45 Workstations</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 lg:px-12 text-center max-w-4xl mx-auto space-y-6">
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Ready to Test the Live Manufacturing Suite?
        </h2>
        <p className="text-slate-400 text-sm max-w-xl mx-auto leading-relaxed">
          The demo application is fully interactive. Create purchase orders, reserve materials against BOMs, simulate production floor output, and print authentic delivery challans.
        </p>

        <div className="pt-4 flex items-center justify-center gap-4">
          <button
            onClick={() => handleLaunchApp("dashboard")}
            className="px-8 py-4 text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-all shadow-xl shadow-amber-500/20 flex items-center gap-2"
          >
            <span>Launch Factory Command Center</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <p className="text-[11px] text-slate-500 font-mono">
          Zero login required · All transactions persist in your local browser sandbox
        </p>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 px-6 lg:px-12 border-t border-slate-900 bg-slate-950 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-300">ForgeFlow — Manufacturing Management</span>
          <span>·</span>
          <span>Jaipur, Rajasthan, India</span>
        </div>
        <p>Frontend Demonstration Application · Built for Factory Production Operations</p>
      </footer>
    </div>
  );
}
