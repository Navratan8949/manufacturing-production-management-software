"use client";

import React from "react";
import { useApp, ROLE_DEFINITIONS } from "@/context/AppContext";
import {
  ShieldAlert,
  ArrowRight,
  Lock,
  UserCheck,
  CheckCircle2,
  Building,
  RotateCcw,
} from "lucide-react";

export function RoleAccessRestricted({ currentView }) {
  const { data, setCurrentUserRole, setActiveView } = useApp();

  const currentRole = data.currentUserRole;
  const currentRoleDef = ROLE_DEFINITIONS[currentRole] || ROLE_DEFINITIONS["Owner / Super Admin"];

  // Find which roles CAN access this module
  const authorizedRoles = Object.entries(ROLE_DEFINITIONS).filter(([roleName, def]) => {
    return def.permissions.includes("ALL") || def.allowedModules.includes(currentView);
  });

  const getViewLabel = (view) => {
    const map = {
      bom: "Bill of Materials (BOM Studio)",
      planning: "Production Planning & Scheduling",
      "work-orders": "Work Orders & Job Batching",
      mrp: "MRP Lite Shortage Engine",
      "production-floor": "Shop Floor Board",
      quality: "Quality Control & Inspections",
      costing: "Standard vs Actual Costing",
      expenses: "Operational Expense Vouchers",
      maintenance: "Machine Fleet Maintenance",
      dispatch: "Dispatch & Delivery Challans",
      "sales-orders": "Sales Orders & Demand",
      "purchase-orders": "Purchase Orders & Procurement",
      suppliers: "Supplier Directory Master",
      customers: "Customer Accounts Master",
      machines: "Machine Fleet Master",
      employees: "Employees & Operators Master",
      reports: "Factory Operational Reports",
      settings: "Factory Parameters & Data Config",
    };
    return map[view] || view;
  };

  const getPrimaryViewForRole = (role) => {
    switch (role) {
      case "Storekeeper":
        return "materials";
      case "Production Supervisor":
        return "production-floor";
      case "Quality Inspector":
        return "quality";
      case "Procurement Manager":
        return "purchase-orders";
      case "Dispatch Manager":
        return "dispatch";
      case "Accountant / Cost Analyst":
        return "costing";
      case "Maintenance Technician":
        return "maintenance";
      case "Production Manager":
        return "work-orders";
      default:
        return "dashboard";
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-8 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto shadow-xs">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 mb-1">
            <Lock className="w-3.5 h-3.5" />
            <span>Role-Based Access Control Enforced</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Access Restricted: {getViewLabel(currentView)}
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            You are currently operating as <strong className="text-slate-900">{currentRole}</strong>.
            This module requires authorization that is outside your active role&apos;s operational scope.
          </p>
        </div>

        {/* Why RBAC in Manufacturing info */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs text-slate-600 max-w-xl mx-auto space-y-1.5">
          <p className="font-bold text-slate-900 flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5 text-amber-500" />
            <span>Why is this partitioned in ForgeFlow?</span>
          </p>
          <p>
            Industrial plants enforce strict segregation of duties to prevent uninspected material releases,
            unauthorized BOM recipe alterations, and accounting discrepancy leaks.
          </p>
        </div>

        {/* Quick Switch to Authorized Role */}
        <div className="pt-2 space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Authorized Roles for This Screen:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {authorizedRoles.map(([roleName]) => (
              <button
                key={roleName}
                onClick={() => {
                  setCurrentUserRole(roleName);
                }}
                className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Switch to {roleName}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Return to My Allowed Workspace */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => setActiveView(getPrimaryViewForRole(currentRole))}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Return to My Role Workspace ({currentRole})</span>
          </button>

          <button
            onClick={() => {
              setCurrentUserRole("Owner / Super Admin");
            }}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200 transition-colors flex items-center gap-1.5"
          >
            <span>Elevate to Super Admin</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Modules accessible for current role */}
      <div className="rounded-xl bg-white border border-slate-200 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">
            Modules Permitted for {currentRole}:
          </h3>
          <span className="text-xs text-slate-500 font-mono">
            {currentRoleDef.allowedModules.length} Authorized Modules
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {currentRoleDef.allowedModules.map((modId) => (
            <button
              key={modId}
              onClick={() => setActiveView(modId)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              <span>{getViewLabel(modId)}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
