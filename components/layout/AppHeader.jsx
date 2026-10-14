"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useApp, ROLE_DEFINITIONS } from "@/context/AppContext";
import {
  Menu,
  Search,
  Bell,
  Printer,
  Sparkles,
  ChevronRight,
  Shield,
  Play,
  LogOut,
  ChevronDown,
  User,
} from "lucide-react";

export function AppHeader({ onToggleMobile, onOpenNotifications }) {
  const router = useRouter();
  const {
    activeView,
    setActiveView,
    setIsLandingView,
    data,
    setCurrentUserRole,
    notifications,
    setSearchOpen,
    setActivePrintDoc,
    setRoleGuideModalOpen,
    currentUser,
    logout,
  } = useApp();

  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const currentRole = data.currentUserRole;
  const currentRoleDef = ROLE_DEFINITIONS[currentRole] || ROLE_DEFINITIONS["Owner / Super Admin"];

  const getViewTitle = (view) => {
    const titles = {
      dashboard: "Manufacturing Command Center",
      products: "Product Master Catalog",
      materials: "Raw Materials Catalog & Stock",
      bom: "Bill of Materials (BOM Studio)",
      suppliers: "Supplier Directory Master",
      customers: "Customer Accounts Master",
      machines: "Machines & Workstations Fleet",
      employees: "Employees & Production Teams",
      planning: "Production Planning & Scheduling",
      "work-orders": "Work Order Lifecycle & Job Cards",
      "production-floor": "Shop Floor Board & Logs",
      mrp: "Material Requirements Planning (MRP Lite)",
      "material-issue": "Material Issue & Return Slips",
      "production-logs": "Shop Floor Output Shift Logs",
      "job-cards": "Job Cards & Process Routing",
      quality: "Quality Control & Multi-Gate Clearance",
      inventory: "Raw Material Store Inventory",
      wip: "Work-in-Progress (WIP) Stages & Bottlenecks",
      "finished-goods": "Sellable Finished Goods Inventory",
      "stock-movements": "Unified Stock Movement Ledger",
      scrap: "Scrap & Wastage Accounting",
      "stock-adjustments": "Physical Stock Adjustments",
      "purchase-orders": "Purchase Orders & Procurement",
      "goods-receipts": "Goods Receipt Notes (GRN)",
      "supplier-returns": "Supplier Material Returns",
      "sales-orders": "Sales Orders & Demand Allocation",
      dispatch: "Dispatch & Official Delivery Challans",
      costing: "Standard vs Actual Production Costing",
      expenses: "Operational Manufacturing Expenses",
      maintenance: "Machine Preventive & Breakdown Maintenance",
      reports: "Operational Reports & CSV Export",
      notifications: "Real-time Factory Alerts",
      settings: "Factory Parameters & Data Config",
    };
    return titles[view] || "Manufacturing Portal";
  };

  const handleSignOut = () => {
    logout();
    setUserDropdownOpen(false);
    router.push("/login");
  };

  return (
    <header className="h-16 px-3 sm:px-6 bg-white border-b border-slate-200 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
      {/* Left: Mobile trigger & Breadcrumbs */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <button
          onClick={onToggleMobile}
          className="lg:hidden p-1.5 -ml-1 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-1.5 sm:gap-2 text-sm">
          <button
            onClick={() => {
              setActiveView("dashboard");
              router.push("/dashboard");
            }}
            className="font-bold text-slate-700 hover:text-slate-900 hidden sm:inline transition-colors cursor-pointer"
          >
            ForgeFlow
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
          <span className="font-bold text-slate-900 text-sm sm:text-base tracking-tight truncate max-w-[130px] sm:max-w-xs md:max-w-md">
            {getViewTitle(activeView)}
          </span>
        </div>
      </div>

      {/* Middle/Right Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        
        {/* Quick Role Switcher Dropdown in Top Bar */}
        <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1">
          <Shield className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <select
            value={currentRole}
            onChange={(e) => setCurrentUserRole(e.target.value)}
            className="text-xs font-bold text-slate-900 bg-transparent border-0 focus:outline-hidden cursor-pointer py-0.5 max-w-[100px] sm:max-w-[160px] truncate"
            title="Switch demo user role"
          >
            {Object.keys(ROLE_DEFINITIONS).map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* Guided Scenarios Trigger */}
        <button
          onClick={() => setRoleGuideModalOpen(true)}
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors cursor-pointer shadow-2xs"
          title="Interactive Role Guided Tours"
        >
          <Play className="w-3.5 h-3.5 text-amber-600" />
          <span className="hidden xl:inline">Role Scenarios</span>
          <span className="xl:hidden">Tours</span>
        </button>

        {/* Global Search Trigger */}
        <button
          onClick={() => setSearchOpen(true)}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-500 bg-slate-100 hover:bg-slate-200/80 rounded-lg border border-slate-200 transition-colors cursor-pointer"
          title="Search plant master (⌘K)"
        >
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden xl:inline">Search...</span>
          <kbd className="hidden xl:inline text-[10px] bg-white text-slate-600 px-1 py-0.2 rounded border border-slate-300 font-mono">
            ⌘K
          </kbd>
        </button>

        {/* Quick Print Document Button */}
        <button
          onClick={() => setActivePrintDoc({ type: "workOrder", id: "WO-2026-081" })}
          className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors cursor-pointer"
          title="Print Sample Factory Document"
        >
          <Printer className="w-3.5 h-3.5 text-slate-500" />
          <span>Print Doc</span>
        </button>

        {/* Landing Page Link */}
        <button
          onClick={() => {
            if (typeof window !== "undefined") {
              try {
                sessionStorage.setItem("forgeflow_in_erp", "false");
              } catch {}
            }
            setIsLandingView(true);
            router.push("/");
          }}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-bold text-amber-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shadow-2xs cursor-pointer"
          title="Switch to Product Landing Page"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Landing Page</span>
        </button>

        {/* Notification Bell */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          title="Factory Alerts"
        >
          <Bell className="w-4 h-4" />
          {notifications?.length > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
          )}
        </button>

        {/* User Profile Avatar & Dropdown with Sign Out */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            className="flex items-center gap-1 p-1 rounded-full hover:ring-2 hover:ring-amber-500/20 transition-all cursor-pointer"
            title={currentUser?.name || "User Profile"}
          >
            {currentUser?.avatar ? (
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-slate-200"
              />
            ) : (
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center">
                {currentUser?.name?.charAt(0) || "U"}
              </div>
            )}
            <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:block" />
          </button>

          {userDropdownOpen && (
            <div className="absolute right-0 mt-1.5 w-60 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 text-xs">
              <div className="px-3.5 py-2 border-b border-slate-100">
                <p className="font-bold text-slate-900 truncate">
                  {currentUser?.name || "Active Operator"}
                </p>
                <p className="text-[11px] text-slate-500 truncate">
                  {currentUser?.email || "operator@forgeflow.in"}
                </p>
                <span className="inline-block mt-1 text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-50 text-amber-900 border border-amber-200">
                  {currentRole}
                </span>
              </div>

              <div className="py-1">
                <Link
                  href="/login"
                  onClick={() => setUserDropdownOpen(false)}
                  className="block px-3.5 py-1.5 hover:bg-slate-50 text-slate-700 font-medium cursor-pointer"
                >
                  Switch Demo Persona...
                </Link>
                <button
                  onClick={() => {
                    setRoleGuideModalOpen(true);
                    setUserDropdownOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-1.5 hover:bg-slate-50 text-slate-700 font-medium cursor-pointer"
                >
                  Role Scenarios Guide
                </button>
              </div>

              <div className="pt-1 border-t border-slate-100">
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-3.5 py-1.5 text-rose-600 hover:bg-rose-50 font-semibold cursor-pointer flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
