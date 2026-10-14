"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import {
  ClipboardList,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Coins,
  Send,
  Boxes,
  Cpu,
  ArrowRight,
  TrendingUp,
  Clock,
  Printer,
  Plus,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { formatINR, formatDate } from "@/lib/utils";

export function DashboardModule() {
  const { data, kpis, setActiveView, setActivePrintDoc, setRoleGuideModalOpen } = useApp();
  const currentRole = data.currentUserRole;

  const productionChartData = [
    { name: "Executive Desk", planned: 20, actual: 18 },
    { name: "Mesh Chair", planned: 30, actual: 30 },
    { name: "Storage Rack", planned: 15, actual: 0 },
    { name: "4-Seat Pod", planned: 8, actual: 0 },
  ];

  const statusDistribution = [
    { name: "In Progress", value: (data.workOrders || []).filter((w) => w.status === "In Progress").length, color: "#3B82F6" },
    { name: "Reserved", value: (data.workOrders || []).filter((w) => w.status === "Material Reserved").length, color: "#F59E0B" },
    { name: "Completed", value: (data.workOrders || []).filter((w) => w.status === "Completed").length, color: "#10B981" },
    { name: "Planned", value: (data.workOrders || []).filter((w) => w.status === "Planned").length, color: "#64748B" },
  ];

  const renderRoleFocusCard = () => {
    switch (currentRole) {
      case "Storekeeper":
        return {
          title: "Storekeeper Active Operations",
          description: "Raw material custody, physical bins, goods receipt, and job card material issue slips.",
          badge: "Inventory & Custody",
          color: "border-amber-300 bg-amber-50/50",
          actions: [
            { label: "Goods Receipt (GRN)", view: "goods-receipts" },
            { label: "Material Issue Slips", view: "material-issue" },
            { label: "Raw Materials Catalog", view: "materials" },
            { label: "Stock Adjustments", view: "stock-adjustments" },
          ],
        };
      case "Quality Inspector":
        return {
          title: "Quality Assurance Active Clearance",
          description: "Inspect incoming supplier shipments, verify in-process WIP tolerances, and release sellable goods.",
          badge: "ISO & Tolerance Gate",
          color: "border-emerald-300 bg-emerald-50/50",
          actions: [
            { label: "Pending Inspections", view: "quality" },
            { label: "Inspect Completed Work Orders", view: "work-orders" },
            { label: "Finished Goods Hold", view: "finished-goods" },
          ],
        };
      case "Production Supervisor":
        return {
          title: "Shop Floor Supervisor Board",
          description: "Shift output monitoring, operator job card dispatch, machine hours, and floor scrap accounting.",
          badge: "Fabrication & Assembly",
          color: "border-orange-300 bg-orange-50/50",
          actions: [
            { label: "Shop Floor Routing Board", view: "production-floor" },
            { label: "Record Shift Output", view: "production-logs" },
            { label: "Active Work Orders", view: "work-orders" },
          ],
        };
      case "Production Manager":
        return {
          title: "Production Planning & BOM Studio",
          description: "Recipe formulations, batch multipliers, MRP shortage calculations, and line release schedules.",
          badge: "BOM & Scheduling",
          color: "border-blue-300 bg-blue-50/50",
          actions: [
            { label: "Create Work Order", view: "work-orders" },
            { label: "Bill of Materials (BOM)", view: "bom" },
            { label: "MRP Shortage Check", view: "mrp" },
            { label: "Routing & WIP", view: "wip" },
          ],
        };
      case "Dispatch Manager":
        return {
          title: "Logistics & Delivery Challans",
          description: "Customer sales orders, finished goods stock reservation, carrier assignments, and dispatch challans.",
          badge: "Dispatch & Outbound",
          color: "border-indigo-300 bg-indigo-50/50",
          actions: [
            { label: "Dispatch Queue & Challans", view: "dispatch" },
            { label: "Sales Orders", view: "sales-orders" },
            { label: "Finished Goods Available", view: "finished-goods" },
          ],
        };
      case "Accountant / Cost Analyst":
        return {
          title: "Financial Audits & Cost Ledger",
          description: "Standard vs actual cost variance analysis, overhead vouchers, scrap drag, and stock ledger exports.",
          badge: "Costing & Ledgers",
          color: "border-teal-300 bg-teal-50/50",
          actions: [
            { label: "Cost Variance Analysis", view: "costing" },
            { label: "Book Operating Expense", view: "expenses" },
            { label: "Export Stock Ledger CSV", view: "stock-movements" },
          ],
        };
      case "Maintenance Technician":
        return {
          title: "Machine Fleet & Maintenance",
          description: "Preventive lubrication cycles, hydraulic inspections, breakdown tickets, and workstation health.",
          badge: "Fleet Uptime",
          color: "border-rose-300 bg-rose-50/50",
          actions: [
            { label: "Maintenance Tickets", view: "maintenance" },
            { label: "Workstation Fleet", view: "machines" },
          ],
        };
      case "Procurement Manager":
        return {
          title: "Procurement & Vendor Directory",
          description: "Supplier price lists, MRP purchase requirements, purchase order authorizations, and returns.",
          badge: "Purchasing",
          color: "border-cyan-300 bg-cyan-50/50",
          actions: [
            { label: "Raise Purchase Order", view: "purchase-orders" },
            { label: "Suppliers Directory", view: "suppliers" },
            { label: "Run MRP Purchasing", view: "mrp" },
          ],
        };
      default:
        return {
          title: "Executive Plant Command Overview",
          description: "Full administrative visibility across procurement, fabrication, quality, dispatches, and finances.",
          badge: "Super Admin",
          color: "border-purple-300 bg-purple-50/50",
          actions: [
            { label: "Create Work Order", view: "work-orders" },
            { label: "Run MRP Check", view: "mrp" },
            { label: "Raise PO", view: "purchase-orders" },
            { label: "Explore Roles Guide", onClick: () => setRoleGuideModalOpen(true) },
          ],
        };
    }
  };

  const roleCard = renderRoleFocusCard();

  return (
    <div className="space-y-6">
      {/* Top Banner & Role Quick Hub */}
      <div className={`p-5 rounded-xl border ${roleCard.color} shadow-2xs space-y-4`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                {roleCard.title}
              </h2>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-900 text-white">
                {currentRole}
              </span>
            </div>
            <p className="text-xs text-slate-600">
              {roleCard.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {roleCard.actions.map((act, idx) => (
              <button
                key={idx}
                onClick={act.onClick || (() => setActiveView(act.view))}
                className="px-3 py-1.5 text-xs font-semibold text-slate-900 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg shadow-2xs transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>{act.label}</span>
                <ArrowRight className="w-3 h-3 text-slate-500" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Primary KPI Grid (12 Derived Metrics) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <button
          onClick={() => setActiveView("work-orders")}
          className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-left transition-all shadow-2xs group"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-medium">Work Orders</span>
            <ClipboardList className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-xl font-bold font-mono text-slate-900 mt-1">{kpis.totalWOs}</p>
          <p className="text-[10px] text-blue-600 font-semibold mt-1">{kpis.inProgressWOs} in progress</p>
        </button>

        <button
          onClick={() => setActiveView("planning")}
          className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-left transition-all shadow-2xs group"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-medium">Planned Qty</span>
            <TrendingUp className="w-4 h-4 text-slate-600" />
          </div>
          <p className="text-xl font-bold font-mono text-slate-900 mt-1">{kpis.plannedQtyTotal} pcs</p>
          <p className="text-[10px] text-slate-500 mt-1">Across active batches</p>
        </button>

        <button
          onClick={() => setActiveView("production-floor")}
          className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-left transition-all shadow-2xs group"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-medium">Completed Qty</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xl font-bold font-mono text-emerald-600 mt-1">{kpis.actualQtyTotal} pcs</p>
          <p className="text-[10px] text-emerald-700 font-semibold mt-1">{kpis.achievementPercent}% target achieved</p>
        </button>

        <button
          onClick={() => setActiveView("materials")}
          className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-left transition-all shadow-2xs group"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-medium">Raw Material Val.</span>
            <Boxes className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-lg font-bold font-mono text-slate-900 mt-1 truncate">
            {formatINR(kpis.rawMaterialStockValue)}
          </p>
          <p className="text-[10px] text-slate-500 mt-1">{data.rawMaterials.length} items stocked</p>
        </button>

        <button
          onClick={() => setActiveView("finished-goods")}
          className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-left transition-all shadow-2xs group"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-medium">Finished Goods Val.</span>
            <CheckCircle2 className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-lg font-bold font-mono text-slate-900 mt-1 truncate">
            {formatINR(kpis.finishedGoodsStockValue)}
          </p>
          <p className="text-[10px] text-slate-500 mt-1">Available for dispatch</p>
        </button>

        <button
          onClick={() => setActiveView("materials")}
          className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-left transition-all shadow-2xs group"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-medium">Material Shortages</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-xl font-bold font-mono text-rose-600 mt-1">{kpis.materialShortagesCount}</p>
          <p className="text-[10px] text-rose-700 font-semibold mt-1">Below reorder mark</p>
        </button>
      </div>

      {/* Secondary Metric Bar */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
          <span className="text-slate-500 text-[11px]">QC Rejection Rate</span>
          <p className="text-base font-bold font-mono text-slate-800 mt-0.5">{kpis.rejectionRate}%</p>
        </div>
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
          <span className="text-slate-500 text-[11px]">Pending Final QC</span>
          <p className="text-base font-bold font-mono text-slate-800 mt-0.5">{kpis.pendingQC} Work Orders</p>
        </div>
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
          <span className="text-slate-500 text-[11px]">Pending Dispatches</span>
          <p className="text-base font-bold font-mono text-slate-800 mt-0.5">{kpis.pendingDispatches} Orders</p>
        </div>
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
          <span className="text-slate-500 text-[11px]">Total Prod Cost</span>
          <p className="text-base font-bold font-mono text-slate-800 mt-0.5">{formatINR(kpis.totalProdCost)}</p>
        </div>
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
          <span className="text-slate-500 text-[11px]">Avg Cost / Unit</span>
          <p className="text-base font-bold font-mono text-slate-800 mt-0.5">{formatINR(kpis.avgCostPerUnit)}</p>
        </div>
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
          <span className="text-slate-500 text-[11px]">Workstation Health</span>
          <p className="text-base font-bold font-mono text-emerald-600 mt-0.5">5 / 6 Operational</p>
        </div>
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Planned vs Actual Production Recharts Bar Chart */}
        <div className="lg:col-span-8 p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Planned vs Actual Output by Product</h3>
              <p className="text-xs text-slate-500">Current production cycle yield in units</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-slate-300" />
                <span className="text-slate-600">Planned Target</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-amber-500" />
                <span className="text-slate-900 font-medium">Actual Output</span>
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productionChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748B" }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#64748B" }} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0F172A", borderRadius: "8px", border: "none", color: "#FFF", fontSize: "12px" }}
                />
                <Bar dataKey="planned" fill="#CBD5E1" radius={[4, 4, 0, 0]} name="Planned Target" />
                <Bar dataKey="actual" fill="#F59E0B" radius={[4, 4, 0, 0]} name="Actual Good Units" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Work Order Status Distribution */}
        <div className="lg:col-span-4 p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Work Order Pipeline Status</h3>
            <p className="text-xs text-slate-500">Distribution across operational stages</p>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#0F172A", borderRadius: "8px", border: "none", color: "#FFF", fontSize: "12px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
            {statusDistribution.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-600">{item.name}:</span>
                <span className="font-bold text-slate-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Two Column Section: Live Work Orders & Material Shortage Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Active Work Orders */}
        <div className="lg:col-span-7 p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Active Work Orders</h3>
              <p className="text-xs text-slate-500">Shop floor progress & allocated workstations</p>
            </div>
            <button
              onClick={() => setActiveView("work-orders")}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {data.workOrders.slice(0, 4).map((wo) => {
              const progressPct = wo.plannedQuantity > 0 ? Math.round((wo.completedQuantity / wo.plannedQuantity) * 100) : 0;
              return (
                <div key={wo.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="truncate">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900">{wo.workOrderNumber}</span>
                      <span className="text-slate-700 font-medium truncate">{wo.productName}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {wo.machineName} · Supervisor: {wo.supervisorName}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <span className="font-mono font-bold text-slate-900">{wo.completedQuantity} / {wo.plannedQuantity}</span>
                      <div className="w-20 bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
                        <div className="bg-amber-500 h-full rounded-full" style={{ width: `${progressPct}%` }} />
                      </div>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                        wo.status === "In Progress"
                          ? "bg-blue-100 text-blue-800"
                          : wo.status === "Material Reserved"
                          ? "bg-amber-100 text-amber-800"
                          : wo.status === "Completed"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {wo.status}
                    </span>

                    <button
                      onClick={() => setActivePrintDoc({ type: "workOrder", id: wo.id })}
                      className="p-1 text-slate-400 hover:text-slate-700"
                      title="Print Work Order Slip"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Material Shortage Radar */}
        <div className="lg:col-span-5 p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Material Shortage Radar</h3>
              <p className="text-xs text-slate-500">Items nearing or breaching safety reorder mark</p>
            </div>
            <button
              onClick={() => setActiveView("materials")}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
            >
              <span>Manage Stocks</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5 text-xs">
            {data.rawMaterials
              .filter((m) => m.currentStock <= m.reorderLevel * 1.5)
              .map((mat) => {
                const isCritical = mat.currentStock <= mat.reorderLevel;
                return (
                  <div
                    key={mat.id}
                    className={`p-3 rounded-lg border flex items-center justify-between ${
                      isCritical ? "bg-rose-50/60 border-rose-200" : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900">{mat.code}</span>
                        <span className="text-slate-800 font-medium">{mat.name}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Location: {mat.storageLocation} · Cost: ₹{mat.unitCost}/{mat.unit}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className={`font-mono font-bold ${isCritical ? "text-rose-700" : "text-slate-700"}`}>
                        {mat.currentStock} / {mat.reorderLevel} {mat.unit}
                      </span>
                      <p className="text-[10px] uppercase font-semibold text-slate-500 mt-0.5">
                        {isCritical ? "Shortage Alert" : "Safety Margin"}
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>

          <button
            onClick={() => setActiveView("mrp")}
            className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            Launch MRP Lite & Generate Purchase Draft
          </button>
        </div>
      </div>
    </div>
  );
}
