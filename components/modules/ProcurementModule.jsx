"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  ShoppingCart,
  Receipt,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Printer,
  X,
  Truck,
  ArrowRight,
} from "lucide-react";
import { formatINR, formatDate } from "@/lib/utils";

export function ProcurementModule({ initialTab = "pos" }) {
  const { data, createPurchaseOrder, postGoodsReceipt, setActivePrintDoc } = useApp();
  const [activeTab, setActiveTab] = useState(
    initialTab === "goods-receipts" || initialTab === "grn" ? "grn" : "pos"
  );
  const [search, setSearch] = useState("");
  const [poModalOpen, setPoModalOpen] = useState(false);
  const [grnModalOpen, setGrnModalOpen] = useState(false);
  const [selectedPOForGRN, setSelectedPOForGRN] = useState(null);

  // New PO State
  const [newPO, setNewPO] = useState({
    supplierId: data.suppliers[0]?.id || "",
    expectedDeliveryDate: "2026-03-20",
    items: [
      { materialCode: data.rawMaterials[0]?.code, name: data.rawMaterials[0]?.name, orderedQty: 20, unitPrice: data.rawMaterials[0]?.unitCost || 1000, unit: data.rawMaterials[0]?.unit || "PCS" },
    ],
    notes: "Deliver along with inspection test cert.",
  });

  // GRN State
  const [grnForm, setGrnForm] = useState({
    supplierInvoiceNo: "INV-2603",
    items: [],
    notes: "Material verified and accepted into stock.",
  });

  const handleOpenGRNModal = (po) => {
    setSelectedPOForGRN(po);
    const grnCount = (data.goodsReceipts?.length || 0) + 1;
    setGrnForm({
      supplierInvoiceNo: `INV-${5000 + grnCount}`,
      items: (po.items || []).map((i) => ({
        materialCode: i.materialCode,
        name: i.name,
        orderedQty: i.orderedQty,
        receivedQty: i.orderedQty - (i.receivedQty || 0),
        acceptedQty: i.orderedQty - (i.receivedQty || 0),
        rejectedQty: 0,
        unit: i.unit,
        unitCost: i.unitPrice,
      })),
      notes: "Goods inspected at unloading bay.",
    });
    setGrnModalOpen(true);
  };

  const handleSaveGRN = (e) => {
    e.preventDefault();
    if (!selectedPOForGRN) return;
    postGoodsReceipt({
      poNumber: selectedPOForGRN.poNumber,
      supplierName: selectedPOForGRN.supplierName,
      supplierInvoiceNo: grnForm.supplierInvoiceNo,
      receivedBy: "Amit Verma (Storekeeper)",
      inspectionStatus: "Inspected",
      items: grnForm.items,
      notes: grnForm.notes,
    });
    setGrnModalOpen(false);
    setActiveTab("grn");
  };

  const handleSavePO = (e) => {
    e.preventDefault();
    const sup = data.suppliers.find((s) => s.id === newPO.supplierId);
    const totalAmount = newPO.items.reduce((sum, i) => sum + i.orderedQty * i.unitPrice, 0);

    createPurchaseOrder({
      ...newPO,
      supplierName: sup?.name || "Supplier",
      totalAmount,
    });
    setPoModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-white border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Procurement & Goods Receipt (GRN)</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Strict receiving policy: Only quality-accepted quantities increase usable store inventory.
          </p>
        </div>

        <button
          onClick={() => setPoModalOpen(true)}
          className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg flex items-center gap-2 shadow-2xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Raise Purchase Order</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 text-xs font-semibold">
        <button
          onClick={() => setActiveTab("pos")}
          className={`py-3 px-5 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "pos" ? "border-amber-500 text-slate-950 font-bold" : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Purchase Orders ({data.purchaseOrders.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("grn")}
          className={`py-3 px-5 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "grn" ? "border-amber-500 text-slate-950 font-bold" : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>Goods Receipts Notes ({data.goodsReceipts.length})</span>
        </button>
      </div>

      {/* Tab 1: Purchase Orders */}
      {activeTab === "pos" && (
        <div className="rounded-xl bg-white border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-4">PO Number</th>
                  <th className="p-4">Supplier</th>
                  <th className="p-4">Order Date</th>
                  <th className="p-4">Expected Delivery</th>
                  <th className="p-4 text-right">Order Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.purchaseOrders.map((po) => (
                  <tr key={po.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4 font-mono font-bold text-slate-900">{po.poNumber}</td>
                    <td className="p-4 font-semibold text-slate-900">{po.supplierName}</td>
                    <td className="p-4 text-slate-500 font-mono">{formatDate(po.orderDate)}</td>
                    <td className="p-4 text-slate-500 font-mono">{formatDate(po.expectedDeliveryDate)}</td>
                    <td className="p-4 text-right font-mono font-bold text-slate-900">{formatINR(po.totalAmount)}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                          po.status === "Received"
                            ? "bg-emerald-100 text-emerald-800"
                            : po.status === "Partially Received"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {po.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {po.status !== "Received" && (
                          <button
                            onClick={() => handleOpenGRNModal(po)}
                            className="px-2.5 py-1 text-slate-950 bg-amber-400 hover:bg-amber-300 font-bold rounded text-[11px] transition-colors"
                          >
                            Receive Material
                          </button>
                        )}
                        <button
                          onClick={() => setActivePrintDoc({ type: "purchaseOrder", id: po.id })}
                          className="p-1 text-slate-400 hover:text-slate-800 rounded"
                          title="Print PO"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Goods Receipts */}
      {activeTab === "grn" && (
        <div className="rounded-xl bg-white border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-4">GRN Number</th>
                  <th className="p-4">PO Reference</th>
                  <th className="p-4">Supplier</th>
                  <th className="p-4">Received Date</th>
                  <th className="p-4">Invoice Ref</th>
                  <th className="p-4">Received Items</th>
                  <th className="p-4">Storekeeper</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.goodsReceipts.map((grn) => (
                  <tr key={grn.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4 font-mono font-bold text-slate-900">{grn.grnNumber}</td>
                    <td className="p-4 font-mono text-slate-600 font-semibold">{grn.poNumber}</td>
                    <td className="p-4 font-semibold text-slate-900">{grn.supplierName}</td>
                    <td className="p-4 text-slate-500 font-mono">{formatDate(grn.receivedDate)}</td>
                    <td className="p-4 font-mono text-slate-600">{grn.supplierInvoiceNo}</td>
                    <td className="p-4 text-slate-700">
                      {(grn.items || []).map((i, idx) => (
                        <div key={idx} className="text-[11px]">
                          <strong>{i.acceptedQty}</strong> {i.unit} {i.name}
                          {i.rejectedQty > 0 && <span className="text-rose-600 font-semibold"> ({i.rejectedQty} rejected)</span>}
                        </div>
                      ))}
                    </td>
                    <td className="p-4 text-slate-600">{grn.receivedBy}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setActivePrintDoc({ type: "goodsReceipt", id: grn.id })}
                        className="p-1 text-slate-400 hover:text-slate-800 rounded"
                        title="Print GRN Slip"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Receive Material & Post GRN Modal */}
      {grnModalOpen && selectedPOForGRN && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm">
                Receive Goods & Post GRN: {selectedPOForGRN.poNumber}
              </h3>
              <button onClick={() => setGrnModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveGRN} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Supplier</label>
                  <p className="font-bold text-slate-900">{selectedPOForGRN.supplierName}</p>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Supplier Invoice Number *</label>
                  <input
                    type="text"
                    required
                    value={grnForm.supplierInvoiceNo}
                    onChange={(e) => setGrnForm({ ...grnForm, supplierInvoiceNo: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
              </div>

              {/* Items Acceptance Table */}
              <div className="space-y-2">
                <label className="text-slate-700 font-bold block">Material Line Items & Inspection Clearance</label>
                <div className="space-y-2 border border-slate-200 rounded-lg p-3 bg-slate-50/50">
                  {grnForm.items.map((item, idx) => (
                    <div key={idx} className="p-3 bg-white rounded border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between font-semibold">
                        <span>{item.name} ({item.materialCode})</span>
                        <span className="text-slate-500 font-mono">Ordered: {item.orderedQty} {item.unit}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="text-[10px] text-slate-500 font-semibold">Received Qty</label>
                          <input
                            type="number"
                            min="1"
                            value={item.receivedQty}
                            onChange={(e) => {
                              const updated = [...grnForm.items];
                              updated[idx].receivedQty = Number(e.target.value);
                              updated[idx].acceptedQty = Math.max(0, Number(e.target.value) - updated[idx].rejectedQty);
                              setGrnForm({ ...grnForm, items: updated });
                            }}
                            className="w-full p-1.5 border border-slate-200 rounded font-mono text-center"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-emerald-700 font-semibold">Accepted (Stock In)</label>
                          <input
                            type="number"
                            min="0"
                            value={item.acceptedQty}
                            onChange={(e) => {
                              const updated = [...grnForm.items];
                              updated[idx].acceptedQty = Number(e.target.value);
                              setGrnForm({ ...grnForm, items: updated });
                            }}
                            className="w-full p-1.5 border border-slate-200 rounded font-mono text-center text-emerald-700 font-bold"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-rose-700 font-semibold">Rejected (Hold)</label>
                          <input
                            type="number"
                            min="0"
                            value={item.rejectedQty}
                            onChange={(e) => {
                              const updated = [...grnForm.items];
                              updated[idx].rejectedQty = Number(e.target.value);
                              updated[idx].acceptedQty = Math.max(0, updated[idx].receivedQty - Number(e.target.value));
                              setGrnForm({ ...grnForm, items: updated });
                            }}
                            className="w-full p-1.5 border border-slate-200 rounded font-mono text-center text-rose-700 font-bold"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded border border-amber-200 text-amber-900 text-[11px]">
                Safety Guarantee: Only Accepted quantities enter usable store stock. Rejected quantities do not enter usable stock and are quarantined for supplier return.
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setGrnModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800"
                >
                  Post Goods Receipt (GRN)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Purchase Order Modal */}
      {poModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm">Raise Purchase Order (PO)</h3>
              <button onClick={() => setPoModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePO} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Select Supplier *</label>
                  <select
                    value={newPO.supplierId}
                    onChange={(e) => setNewPO({ ...newPO, supplierId: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg bg-white"
                  >
                    {data.suppliers.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Expected Delivery Date</label>
                  <input
                    type="date"
                    value={newPO.expectedDeliveryDate}
                    onChange={(e) => setNewPO({ ...newPO, expectedDeliveryDate: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Material to Order *</label>
                <div className="flex items-center gap-2">
                  <select
                    value={newPO.items[0]?.materialCode}
                    onChange={(e) => {
                      const mat = data.rawMaterials.find((m) => m.code === e.target.value);
                      if (mat) {
                        setNewPO({
                          ...newPO,
                          items: [{ materialCode: mat.code, name: mat.name, orderedQty: 25, unitPrice: mat.unitCost, unit: mat.unit }],
                        });
                      }
                    }}
                    className="flex-1 p-2 border border-slate-200 rounded-lg bg-white"
                  >
                    {data.rawMaterials.map((m) => (
                      <option key={m.id} value={m.code}>
                        {m.code} — {m.name} (Stock: {m.currentStock} {m.unit})
                      </option>
                    ))}
                  </select>

                  <div className="w-24">
                    <input
                      type="number"
                      min="1"
                      required
                      value={newPO.items[0]?.orderedQty || 20}
                      onChange={(e) => {
                        const updated = [...newPO.items];
                        updated[0].orderedQty = Number(e.target.value);
                        setNewPO({ ...newPO, items: updated });
                      }}
                      className="w-full p-2 border border-slate-200 rounded-lg font-mono text-center"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Commercial Notes</label>
                <textarea
                  rows={2}
                  value={newPO.notes}
                  onChange={(e) => setNewPO({ ...newPO, notes: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setPoModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800"
                >
                  Issue Purchase Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
