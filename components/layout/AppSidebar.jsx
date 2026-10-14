"use client";

import React, { useState } from "react";
import { useApp, ROLE_DEFINITIONS } from "@/context/AppContext";
import {
  LayoutDashboard,
  Package,
  Layers,
  FileSpreadsheet,
  Truck,
  Users,
  Cpu,
  UserCheck,
  CalendarDays,
  ClipboardList,
  Flame,
  Calculator,
  FileOutput,
  ScrollText,
  Workflow,
  ShieldCheck,
  Boxes,
  Hourglass,
  CheckCircle2,
  ArrowLeftRight,
  Trash2,
  SlidersHorizontal,
  ShoppingCart,
  Receipt,
  RotateCcw,
  ShoppingBag,
  Send,
  Coins,
  Wrench,
  BarChart3,
  Bell,
  Settings,
  ChevronDown,
  ChevronRight,
  Sparkles,
  ExternalLink,
  RotateCw,
  Building2,
  Shield,
  Lock,
  Play,
  Filter,
  X,
} from "lucide-react";

export function AppSidebar({ mobileOpen, setMobileOpen }) {
  const {
    activeView,
    setActiveView,
    setIsLandingView,
    data,
    setCurrentUserRole,
    resetDemoData,
    kpis,
    notifications,
    canAccessModule,
    roleFilterMode,
    setRoleFilterMode,
    setRoleGuideModalOpen,
  } = useApp();

  const [collapsedGroups, setCollapsedGroups] = useState({
    finance: false,
    management: false,
  });

  const toggleGroup = (key) => {
    setCollapsedGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const navGroups = [
    {
      id: "overview",
      label: "Overview",
      items: [
        { id: "dashboard", label: "Command Center", icon: LayoutDashboard },
      ],
    },
    {
      id: "masters",
      label: "Masters",
      items: [
        { id: "products", label: "Products", icon: Package, count: data.products?.length },
        { id: "materials", label: "Raw Materials", icon: Layers, badge: kpis.materialShortagesCount > 0 ? `${kpis.materialShortagesCount} low` : null, badgeColor: "bg-amber-100 text-amber-800" },
        { id: "bom", label: "Bill of Materials (BOM)", icon: FileSpreadsheet, count: data.boms?.length },
        { id: "suppliers", label: "Suppliers", icon: Truck, count: data.suppliers?.length },
        { id: "customers", label: "Customers", icon: Users, count: data.customers?.length },
        { id: "machines", label: "Machines & Workstations", icon: Cpu, count: data.machines?.length },
        { id: "employees", label: "Employees & Teams", icon: UserCheck, count: data.employees?.length },
      ],
    },
    {
      id: "planning",
      label: "Planning & Production",
      items: [
        { id: "planning", label: "Production Planning", icon: CalendarDays },
        { id: "work-orders", label: "Work Orders", icon: ClipboardList, badge: `${kpis.inProgressWOs} active`, badgeColor: "bg-blue-100 text-blue-800" },
        { id: "production-floor", label: "Shop Floor", icon: Flame },
        { id: "mrp", label: "Material Requirements (MRP)", icon: Calculator },
        { id: "material-issue", label: "Material Issue & Return", icon: FileOutput },
        { id: "production-logs", label: "Production Logs", icon: ScrollText },
        { id: "job-cards", label: "Job Cards & Routing", icon: Workflow },
      ],
    },
    {
      id: "quality",
      label: "Quality & Inventory",
      items: [
        { id: "quality", label: "Quality Control", icon: ShieldCheck, badge: kpis.pendingQC > 0 ? `${kpis.pendingQC} pending` : null, badgeColor: "bg-rose-100 text-rose-800" },
        { id: "inventory", label: "Raw Material Inventory", icon: Boxes },
        { id: "wip", label: "Work-in-Progress (WIP)", icon: Hourglass },
        { id: "finished-goods", label: "Finished Goods", icon: CheckCircle2 },
        { id: "stock-movements", label: "Stock Ledger Movements", icon: ArrowLeftRight },
        { id: "scrap", label: "Scrap & Wastage", icon: Trash2 },
        { id: "stock-adjustments", label: "Stock Adjustments", icon: SlidersHorizontal },
      ],
    },
    {
      id: "procurement",
      label: "Procurement & Dispatch",
      items: [
        { id: "purchase-orders", label: "Purchase Orders", icon: ShoppingCart },
        { id: "goods-receipts", label: "Goods Receipts (GRN)", icon: Receipt },
        { id: "supplier-returns", label: "Supplier Returns", icon: RotateCcw },
        { id: "sales-orders", label: "Sales Orders", icon: ShoppingBag },
        { id: "dispatch", label: "Dispatch & Challans", icon: Send, badge: kpis.pendingDispatches > 0 ? `${kpis.pendingDispatches} queue` : null, badgeColor: "bg-amber-100 text-amber-800" },
      ],
    },
    {
      id: "finance",
      label: "Costing & Maintenance",
      items: [
        { id: "costing", label: "Production Costing", icon: Coins },
        { id: "expenses", label: "Operational Expenses", icon: Receipt },
        { id: "maintenance", label: "Machine Maintenance", icon: Wrench },
      ],
    },
    {
      id: "management",
      label: "Management & System",
      items: [
        { id: "reports", label: "Reports & Analytics", icon: BarChart3 },
        { id: "notifications", label: "Alerts & Notifications", icon: Bell, count: notifications.length },
        { id: "settings", label: "Factory Settings", icon: Settings },
      ],
    },
  ];

  const handleNavClick = (viewId) => {
    setActiveView(viewId);
    setIsLandingView(false);
    if (setMobileOpen) setMobileOpen(false);
  };

  const currentRoleDef = ROLE_DEFINITIONS[data.currentUserRole] || ROLE_DEFINITIONS["Owner / Super Admin"];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-72 bg-slate-950 text-slate-300 flex flex-col border-r border-slate-800 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 px-5 flex items-center justify-between border-b border-slate-800/80 bg-slate-950 shrink-0">
        <button
          onClick={() => {
            setActiveView("dashboard");
            setIsLandingView(false);
          }}
          className="flex items-center gap-3 text-left focus:outline-none group cursor-pointer"
        >
          <div className="w-9 h-9 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-md shadow-amber-500/20 group-hover:bg-amber-400 transition-colors">
            <span className="text-xl tracking-tighter">FF</span>
          </div>
          <div>
            <div className="font-bold text-white text-base leading-tight tracking-tight flex items-center gap-1.5">
              <span>ForgeFlow</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-400 px-1 py-0.2 rounded bg-amber-950/60 border border-amber-800/60">
                ERP
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium truncate max-w-[155px]">
              Jaipur Plant · VKI Zone
            </p>
          </div>
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              if (typeof window !== "undefined") {
                try {
                  sessionStorage.setItem("forgeflow_in_erp", "false");
                } catch {}
              }
              setIsLandingView(true);
              if (setMobileOpen) setMobileOpen(false);
            }}
            title="Switch to Landing Page"
            className="text-xs text-slate-400 hover:text-white p-1.5 rounded hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
          {setMobileOpen && (
            <button
              onClick={() => setMobileOpen(false)}
              title="Close sidebar"
              className="lg:hidden text-xs text-slate-400 hover:text-white p-1.5 rounded hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5 text-slate-300 hover:text-white" />
            </button>
          )}
        </div>
      </div>

      {/* Role Banner & Switcher */}
      <div className="px-3.5 py-2.5 bg-slate-900/95 border-b border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-300 truncate">
            <Shield className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="font-bold text-white truncate max-w-[110px]">{data.currentUserRole}</span>
          </div>
          <select
            value={data.currentUserRole}
            onChange={(e) => setCurrentUserRole(e.target.value)}
            className="bg-slate-800 text-amber-300 text-[11px] font-semibold rounded px-2 py-0.5 border border-slate-700 focus:outline-none focus:border-amber-400 cursor-pointer max-w-[125px]"
          >
            {Object.keys(ROLE_DEFINITIONS).map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>

        {/* View Mode Filter: All Modules vs My Role Only */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-[11px]">
          <span className="text-slate-400 font-medium flex items-center gap-1">
            <Filter className="w-3 h-3 text-slate-500" />
            <span>Scope:</span>
          </span>
          <div className="flex rounded bg-slate-950 p-0.5 border border-slate-800">
            <button
              type="button"
              onClick={() => setRoleFilterMode("all")}
              className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                roleFilterMode === "all" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              All Modules
            </button>
            <button
              type="button"
              onClick={() => setRoleFilterMode("my_role")}
              className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                roleFilterMode === "my_role" ? "bg-amber-500 text-slate-950 font-bold" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              My Role Only
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Links Scrollable Area */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4 text-xs">
        {navGroups.map((group) => {
          // Filter items if roleFilterMode is 'my_role'
          const filteredItems = roleFilterMode === "my_role"
            ? group.items.filter((item) => canAccessModule(item.id))
            : group.items;

          if (filteredItems.length === 0) return null;

          const isCollapsed = collapsedGroups[group.id];

          return (
            <div key={group.id} className="space-y-1">
              <button
                type="button"
                onClick={() => toggleGroup(group.id)}
                className="w-full flex items-center justify-between px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider hover:text-slate-200 transition-colors"
              >
                <span>{group.label}</span>
                {isCollapsed ? (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                )}
              </button>

              {!isCollapsed && (
                <div className="space-y-0.5 pl-1">
                  {filteredItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeView === item.id;
                    const isAllowed = canAccessModule(item.id);

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleNavClick(item.id)}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                          isActive
                            ? "bg-amber-500 text-slate-950 font-bold shadow-sm shadow-amber-500/20"
                            : isAllowed
                            ? "text-slate-300 hover:text-white hover:bg-slate-800/80"
                            : "text-slate-500 hover:text-slate-300 hover:bg-slate-900/60 opacity-80"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-slate-950" : isAllowed ? "text-slate-400" : "text-slate-600"}`} />
                          <span className="truncate">{item.label}</span>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {!isAllowed && (
                            <Lock className="w-3 h-3 text-slate-600" title="Restricted for current role" />
                          )}
                          {item.badge ? (
                            <span
                              className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full shrink-0 ${
                                isActive ? "bg-slate-950 text-white" : item.badgeColor || "bg-slate-800 text-slate-300"
                              }`}
                            >
                              {item.badge}
                            </span>
                          ) : item.count !== undefined ? (
                            <span className={`text-[10px] font-medium shrink-0 ${isActive ? "text-slate-950 font-bold" : "text-slate-500"}`}>
                              {item.count}
                            </span>
                          ) : null}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Info & Quick Switchers */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950 shrink-0 space-y-2">
        <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
          <span className="flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-slate-500" />
            Jaipur Facility
          </span>
          <button
            onClick={() => {
              if (confirm("Reset demo data to initial factory state?")) {
                resetDemoData();
              }
            }}
            className="flex items-center gap-1 text-slate-500 hover:text-amber-400 transition-colors cursor-pointer"
            title="Reset Seed Data"
          >
            <RotateCw className="w-3 h-3" />
            <span>Reset Demo</span>
          </button>
        </div>

        <button
          onClick={() => setRoleGuideModalOpen(true)}
          className="w-full flex items-center justify-center gap-2 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-md text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 text-amber-400" />
          <span>Role Guides & Tours</span>
        </button>

        <button
          onClick={() => {
            if (typeof window !== "undefined") {
              try {
                sessionStorage.setItem("forgeflow_in_erp", "false");
              } catch {}
            }
            setIsLandingView(true);
          }}
          className="w-full flex items-center justify-center gap-2 px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-md text-xs font-bold transition-colors cursor-pointer shadow-2xs"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Product Landing Page</span>
        </button>
      </div>
    </aside>
  );
}
