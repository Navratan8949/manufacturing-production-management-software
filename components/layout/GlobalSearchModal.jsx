"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import {
  Search,
  X,
  Package,
  Layers,
  FileSpreadsheet,
  ClipboardList,
  ShoppingCart,
  Receipt,
  ShoppingBag,
  Send,
  Users,
  Truck,
  ArrowRight,
} from "lucide-react";

export function GlobalSearchModal() {
  const { searchOpen, setSearchOpen, data, setActiveView, setIsLandingView } = useApp();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setSearchOpen]);

  if (!searchOpen) return null;

  const q = query.toLowerCase().trim();

  const results = [];

  if (q.length > 0) {
    // Products
    data.products?.forEach((p) => {
      if (p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q)) {
        results.push({
          type: "Product",
          title: `${p.code} · ${p.name}`,
          subtitle: `Stock: ${p.currentStock} ${p.unit} · ₹${p.sellingPrice}`,
          icon: Package,
          view: "products",
        });
      }
    });

    // Materials
    data.rawMaterials?.forEach((m) => {
      if (m.name.toLowerCase().includes(q) || m.code.toLowerCase().includes(q)) {
        results.push({
          type: "Raw Material",
          title: `${m.code} · ${m.name}`,
          subtitle: `Stock: ${m.currentStock} ${m.unit} · Loc: ${m.storageLocation}`,
          icon: Layers,
          view: "materials",
        });
      }
    });

    // Work Orders
    data.workOrders?.forEach((w) => {
      if (w.workOrderNumber.toLowerCase().includes(q) || w.productName.toLowerCase().includes(q)) {
        results.push({
          type: "Work Order",
          title: `${w.workOrderNumber} · ${w.productName}`,
          subtitle: `Status: ${w.status} · Qty: ${w.plannedQuantity} pcs`,
          icon: ClipboardList,
          view: "work-orders",
        });
      }
    });

    // BOMs
    data.boms?.forEach((b) => {
      if (b.bomNumber.toLowerCase().includes(q) || b.productName.toLowerCase().includes(q)) {
        results.push({
          type: "Bill of Materials",
          title: `${b.bomNumber} · ${b.productName}`,
          subtitle: `Version ${b.version} · Est Cost: ₹${b.totalEstimatedCost}`,
          icon: FileSpreadsheet,
          view: "bom",
        });
      }
    });

    // Purchase Orders
    data.purchaseOrders?.forEach((po) => {
      if (po.poNumber.toLowerCase().includes(q) || po.supplierName.toLowerCase().includes(q)) {
        results.push({
          type: "Purchase Order",
          title: `${po.poNumber} · ${po.supplierName}`,
          subtitle: `Status: ${po.status} · ₹${po.totalAmount}`,
          icon: ShoppingCart,
          view: "purchase-orders",
        });
      }
    });

    // Sales Orders
    data.salesOrders?.forEach((so) => {
      if (so.soNumber.toLowerCase().includes(q) || so.customerName.toLowerCase().includes(q)) {
        results.push({
          type: "Sales Order",
          title: `${so.soNumber} · ${so.customerName}`,
          subtitle: `Status: ${so.status} · ₹${so.totalAmount}`,
          icon: ShoppingBag,
          view: "sales-orders",
        });
      }
    });

    // Suppliers & Customers
    data.suppliers?.forEach((s) => {
      if (s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q)) {
        results.push({
          type: "Supplier",
          title: `${s.code} · ${s.name}`,
          subtitle: `${s.city} · ${s.contactPerson}`,
          icon: Truck,
          view: "suppliers",
        });
      }
    });

    data.customers?.forEach((c) => {
      if (c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)) {
        results.push({
          type: "Customer",
          title: `${c.code} · ${c.name}`,
          subtitle: `${c.city} · ${c.contactPerson}`,
          icon: Users,
          view: "customers",
        });
      }
    });

    // Dispatches
    data.dispatches?.forEach((d) => {
      if (d.dispatchNumber.toLowerCase().includes(q) || d.challanNumber.toLowerCase().includes(q) || d.customerName.toLowerCase().includes(q)) {
        results.push({
          type: "Dispatch Challan",
          title: `${d.challanNumber} · ${d.customerName}`,
          subtitle: `Vehicle: ${d.vehicleNumber} · Status: ${d.status}`,
          icon: Send,
          view: "dispatch",
        });
      }
    });
  }

  const handleSelect = (view) => {
    setActiveView(view);
    setIsLandingView(false);
    setSearchOpen(false);
    setQuery("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Input bar */}
        <div className="flex items-center px-4 py-3 border-b border-slate-200 gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, materials, work orders, POs, customers..."
            className="w-full text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-slate-400 hover:text-slate-600 p-1">
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setSearchOpen(false)}
            className="text-xs font-semibold px-2 py-1 text-slate-500 bg-slate-100 hover:bg-slate-200 rounded"
          >
            ESC
          </button>
        </div>

        {/* Results view */}
        <div className="max-h-96 overflow-y-auto p-2">
          {query.trim().length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              <p className="font-semibold text-slate-700 mb-1">Quick Factory Search</p>
              <p>Type a code like &quot;FD-101&quot;, &quot;WO-2026-081&quot;, &quot;RM-PLY&quot;, or customer name to locate records.</p>
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              <p className="font-semibold text-slate-700">No records found matching &quot;{query}&quot;</p>
              <p className="mt-1">Try searching by code, supplier, or product title.</p>
            </div>
          ) : (
            <div className="space-y-1">
              {results.slice(0, 15).map((item, idx) => {
                const Icon = item.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelect(item.view)}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-100 text-left transition-colors group"
                  >
                    <div className="flex items-center gap-3 truncate">
                      <div className="w-8 h-8 rounded-md bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 group-hover:bg-amber-100 group-hover:text-amber-800 transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-slate-900 truncate">{item.title}</span>
                          <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                            {item.type}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate">{item.subtitle}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-800 transition-colors shrink-0" />
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
