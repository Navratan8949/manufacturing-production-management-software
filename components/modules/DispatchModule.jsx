"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  ShoppingBag,
  Send,
  Plus,
  Printer,
  Truck,
  CheckCircle2,
  X,
  Clock,
  ArrowRight,
} from "lucide-react";
import { formatINR, formatDate } from "@/lib/utils";

export function DispatchModule({ initialTab = "sales" }) {
  const { data, createSalesOrder, postDispatch, setActivePrintDoc } = useApp();
  const [activeTab, setActiveTab] = useState(
    initialTab === "dispatch" || initialTab === "dispatches" ? "dispatches" : "sales"
  );
  const [soModalOpen, setSoModalOpen] = useState(false);
  const [dispatchModalOpen, setDispatchModalOpen] = useState(false);
  const [selectedSOForDispatch, setSelectedSOForDispatch] = useState(null);

  // New SO state with static clean initial defaults
  const [newSO, setNewSO] = useState({
    customerId: data.customers[0]?.id || "",
    productId: data.products[0]?.id || "",
    orderedQty: 10,
    requestedDeliveryDate: "2026-03-25",
    notes: "Site delivery at Tonk Road Jaipur.",
  });

  // Dispatch Form state
  const [dispatchForm, setDispatchForm] = useState({
    transporter: "Rajasthan Golden Logistics",
    vehicleNumber: "RJ-14-GA-8821",
    driverName: "Mohan Lal",
    driverPhone: "+91 94140 77122",
    eWayBillNo: "3310-9842-1104",
    deliveryAddress: "C-Scheme, Jaipur",
    dispatchQty: 5,
    notes: "Goods packaged in corrugated crates with moisture barrier.",
  });

  const handleOpenDispatchModal = (so) => {
    setSelectedSOForDispatch(so);
    const item = so.items?.[0];
    const pendingQty = item ? item.orderedQty - (item.dispatchedQty || 0) : 5;
    const prod = data.products.find((p) => p.id === item?.productId || p.code === item?.productCode);
    const available = prod ? prod.currentStock : 0;

    const count = (data.dispatches?.length || 0) + 1;
    setDispatchForm({
      transporter: "Rajasthan Golden Logistics",
      vehicleNumber: `RJ-14-GA-${4000 + count}`,
      driverName: "Ram Singh",
      driverPhone: "+91 98290 44109",
      eWayBillNo: `3310-${9000 + count}-2603`,
      deliveryAddress: so.customerName + " Site, Jaipur",
      dispatchQty: Math.min(pendingQty, available || pendingQty),
      notes: "Gate pass verified and loaded safely.",
    });
    setDispatchModalOpen(true);
  };

  const handleSaveDispatch = (e) => {
    e.preventDefault();
    if (!selectedSOForDispatch) return;
    const soItem = selectedSOForDispatch.items?.[0];

    postDispatch({
      salesOrderNumber: selectedSOForDispatch.soNumber,
      customerName: selectedSOForDispatch.customerName,
      transporter: dispatchForm.transporter,
      vehicleNumber: dispatchForm.vehicleNumber,
      driverName: dispatchForm.driverName,
      driverPhone: dispatchForm.driverPhone,
      eWayBillNo: dispatchForm.eWayBillNo,
      deliveryAddress: dispatchForm.deliveryAddress,
      items: [
        {
          productCode: soItem?.productCode || "FD-101",
          name: soItem?.name || "Office Desk",
          batchNo: "BATCH-2603",
          quantity: Number(dispatchForm.dispatchQty),
          unit: "PCS",
        },
      ],
      notes: dispatchForm.notes,
    });

    setDispatchModalOpen(false);
    setActiveTab("dispatches");
  };

  const handleSaveSO = (e) => {
    e.preventDefault();
    const cust = data.customers.find((c) => c.id === newSO.customerId);
    const prod = data.products.find((p) => p.id === newSO.productId);
    const totalAmount = (prod?.sellingPrice || 10000) * Number(newSO.orderedQty);

    createSalesOrder({
      customerId: newSO.customerId,
      customerName: cust?.name || "Customer",
      requestedDeliveryDate: newSO.requestedDeliveryDate,
      totalAmount,
      items: [
        {
          productId: prod?.id,
          productCode: prod?.code,
          name: prod?.name,
          orderedQty: Number(newSO.orderedQty),
          allocatedQty: Math.min(prod?.currentStock || 0, Number(newSO.orderedQty)),
          dispatchedQty: 0,
          unitPrice: prod?.sellingPrice,
          total: totalAmount,
        },
      ],
      notes: newSO.notes,
    });
    setSoModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-white border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Sales Orders, Allocation & Dispatch</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Allocate sellable finished goods, generate official delivery challans, and track transporter fleet.
          </p>
        </div>

        <button
          onClick={() => setSoModalOpen(true)}
          className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg flex items-center gap-2 shadow-2xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Book Sales Order</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 text-xs font-semibold">
        <button
          onClick={() => setActiveTab("sales")}
          className={`py-3 px-5 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "sales" ? "border-amber-500 text-slate-950 font-bold" : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Sales Demand Orders ({data.salesOrders.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("dispatches")}
          className={`py-3 px-5 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "dispatches" ? "border-amber-500 text-slate-950 font-bold" : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Send className="w-4 h-4" />
          <span>Dispatched Challans ({data.dispatches.length})</span>
        </button>
      </div>

      {/* Tab 1: Sales Orders */}
      {activeTab === "sales" && (
        <div className="rounded-xl bg-white border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-4">SO Number</th>
                  <th className="p-4">Customer Account</th>
                  <th className="p-4">Ordered Product</th>
                  <th className="p-4 text-right">Ordered Qty</th>
                  <th className="p-4 text-right">Allocated</th>
                  <th className="p-4 text-right">Dispatched</th>
                  <th className="p-4 text-right">Order Value</th>
                  <th className="p-4">Dispatch Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.salesOrders.map((so) => {
                  const item = so.items?.[0];
                  return (
                    <tr key={so.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-4 font-mono font-bold text-slate-900">{so.soNumber}</td>
                      <td className="p-4 font-semibold text-slate-900">{so.customerName}</td>
                      <td className="p-4 text-slate-700">
                        {item?.name} <span className="font-mono text-slate-400">({item?.productCode})</span>
                      </td>
                      <td className="p-4 text-right font-mono font-bold text-slate-900">{item?.orderedQty} pcs</td>
                      <td className="p-4 text-right font-mono text-amber-600 font-semibold">{item?.allocatedQty} pcs</td>
                      <td className="p-4 text-right font-mono text-emerald-600 font-bold">{item?.dispatchedQty || 0} pcs</td>
                      <td className="p-4 text-right font-mono font-bold text-slate-900">{formatINR(so.totalAmount)}</td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                            so.dispatchStatus === "Dispatched"
                              ? "bg-emerald-100 text-emerald-800"
                              : so.dispatchStatus === "Partially Dispatched"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {so.dispatchStatus}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {so.dispatchStatus !== "Dispatched" && (
                          <button
                            onClick={() => handleOpenDispatchModal(so)}
                            className="px-2.5 py-1 text-slate-950 bg-amber-400 hover:bg-amber-300 font-bold rounded text-[11px] transition-colors"
                          >
                            Dispatch Goods
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Dispatches */}
      {activeTab === "dispatches" && (
        <div className="rounded-xl bg-white border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-4">Challan #</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Dispatch Date</th>
                  <th className="p-4">Transporter & Fleet</th>
                  <th className="p-4">Driver Contact</th>
                  <th className="p-4">Dispatched Items</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.dispatches.map((dsp) => (
                  <tr key={dsp.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4 font-mono font-bold text-slate-900">{dsp.challanNumber}</td>
                    <td className="p-4 font-semibold text-slate-900">{dsp.customerName}</td>
                    <td className="p-4 text-slate-500 font-mono">{formatDate(dsp.dispatchDate)}</td>
                    <td className="p-4 text-slate-700">
                      <div>{dsp.transporter}</div>
                      <div className="font-mono text-slate-500 text-[11px] font-semibold">{dsp.vehicleNumber}</div>
                    </td>
                    <td className="p-4 text-slate-600">
                      <div>{dsp.driverName}</div>
                      <div className="font-mono text-[11px] text-slate-400">{dsp.driverPhone}</div>
                    </td>
                    <td className="p-4 text-slate-700">
                      {(dsp.items || []).map((i, idx) => (
                        <div key={idx} className="font-semibold text-[11px]">
                          {i.quantity} {i.unit} {i.name}
                        </div>
                      ))}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setActivePrintDoc({ type: "dispatch", id: dsp.id })}
                        className="px-2.5 py-1 text-slate-700 bg-slate-100 hover:bg-slate-200 font-semibold rounded text-[11px] flex items-center gap-1 ml-auto"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print Challan</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Dispatch Creation Modal */}
      {dispatchModalOpen && selectedSOForDispatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm">
                Generate Delivery Challan for {selectedSOForDispatch.customerName}
              </h3>
              <button onClick={() => setDispatchModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveDispatch} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Transporter Carrier *</label>
                  <input
                    type="text"
                    required
                    value={dispatchForm.transporter}
                    onChange={(e) => setDispatchForm({ ...dispatchForm, transporter: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Vehicle Registration # *</label>
                  <input
                    type="text"
                    required
                    value={dispatchForm.vehicleNumber}
                    onChange={(e) => setDispatchForm({ ...dispatchForm, vehicleNumber: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg font-mono uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Driver Name & Contact</label>
                  <input
                    type="text"
                    value={dispatchForm.driverName}
                    onChange={(e) => setDispatchForm({ ...dispatchForm, driverName: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">E-Way Bill Ref</label>
                  <input
                    type="text"
                    value={dispatchForm.eWayBillNo}
                    onChange={(e) => setDispatchForm({ ...dispatchForm, eWayBillNo: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Quantity to Dispatch (PCS) *</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={dispatchForm.dispatchQty}
                  onChange={(e) => setDispatchForm({ ...dispatchForm, dispatchQty: Number(e.target.value) })}
                  className="w-full p-2 border border-slate-200 rounded-lg font-mono text-center font-bold text-sm"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Destination Address</label>
                <input
                  type="text"
                  value={dispatchForm.deliveryAddress}
                  onChange={(e) => setDispatchForm({ ...dispatchForm, deliveryAddress: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded border border-amber-200 text-amber-900 text-[11px]">
                Upon confirmation, finished goods inventory will be reduced immediately and logged into the stock movement ledger.
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setDispatchModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800"
                >
                  Confirm Dispatch & Issue Challan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Book Sales Order Modal */}
      {soModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm">Book New Sales Order</h3>
              <button onClick={() => setSoModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSO} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Customer Account *</label>
                <select
                  value={newSO.customerId}
                  onChange={(e) => setNewSO({ ...newSO, customerId: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg bg-white"
                >
                  {data.customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.city})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Product *</label>
                  <select
                    value={newSO.productId}
                    onChange={(e) => setNewSO({ ...newSO, productId: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg bg-white"
                  >
                    {data.products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.code} — {p.name} (Stock: {p.currentStock})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Ordered Quantity *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newSO.orderedQty}
                    onChange={(e) => setNewSO({ ...newSO, orderedQty: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-200 rounded-lg font-mono text-center"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Requested Delivery Date</label>
                <input
                  type="date"
                  value={newSO.requestedDeliveryDate}
                  onChange={(e) => setNewSO({ ...newSO, requestedDeliveryDate: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSoModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800"
                >
                  Confirm Sales Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
