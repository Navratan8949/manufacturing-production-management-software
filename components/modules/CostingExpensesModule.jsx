"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  Coins,
  Receipt,
  Plus,
  TrendingDown,
  TrendingUp,
  X,
  CreditCard,
  Building,
} from "lucide-react";
import { formatINR, formatDate } from "@/lib/utils";

export function CostingExpensesModule({ initialTab = "costing" }) {
  const { data, addExpense } = useApp();
  const [activeTab, setActiveTab] = useState(initialTab === "expenses" ? "expenses" : "costing");
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);

  const [expenseForm, setExpenseForm] = useState({
    category: "Electricity",
    amount: 15000,
    payee: "Jaipur Vidyut Vitran Nigam Ltd",
    paymentMethod: "NEFT / Bank",
    notes: "Shop floor 3-phase power load.",
  });

  const handleSaveExpense = (e) => {
    e.preventDefault();
    addExpense(expenseForm);
    setExpenseModalOpen(false);
  };

  const totalExpenses = (data.expenses || []).reduce((sum, e) => sum + Number(e.amount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-white border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Production Costing & Operational Expenses</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit BOM standard cost variances against actual floor consumption, direct power, and labor hours.
          </p>
        </div>

        <button
          onClick={() => setExpenseModalOpen(true)}
          className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg flex items-center gap-2 shadow-2xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Book Operating Expense</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 text-xs font-semibold">
        <button
          onClick={() => setActiveTab("costing")}
          className={`py-3 px-5 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "costing" ? "border-amber-500 text-slate-950 font-bold" : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Coins className="w-4 h-4" />
          <span>Work Order Cost Variances ({data.workOrders.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("expenses")}
          className={`py-3 px-5 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "expenses" ? "border-amber-500 text-slate-950 font-bold" : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>Factory Expenses ({data.expenses?.length || 0})</span>
        </button>
      </div>

      {/* Tab 1: Production Costing Variances */}
      {activeTab === "costing" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-slate-500 text-[11px]">Total Estimated Production Budget</span>
              <p className="text-xl font-bold font-mono text-slate-900 mt-1">
                {formatINR(data.workOrders.reduce((sum, w) => sum + (w.estimatedCost || 0), 0))}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-slate-500 text-[11px]">Total Actual Incurred Cost</span>
              <p className="text-xl font-bold font-mono text-amber-600 mt-1">
                {formatINR(data.workOrders.reduce((sum, w) => sum + (w.actualCost || 0), 0))}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-slate-500 text-[11px]">Overall Cost Favourability</span>
              <p className="text-xl font-bold font-mono text-emerald-600 mt-1">+8.4% Savings</p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-slate-500 text-[11px]">Weighted Scrap Cost Drag</span>
              <p className="text-xl font-bold font-mono text-slate-900 mt-1">₹888</p>
            </div>
          </div>

          <div className="rounded-xl bg-white border border-slate-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="p-4">Work Order</th>
                    <th className="p-4">Product Name</th>
                    <th className="p-4 text-right">Batch Qty</th>
                    <th className="p-4 text-right">Est. Total Cost</th>
                    <th className="p-4 text-right">Actual Incurred</th>
                    <th className="p-4 text-right">Variance (₹)</th>
                    <th className="p-4 text-right">Variance (%)</th>
                    <th className="p-4 text-right">Cost / Unit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.workOrders.map((wo) => {
                    const est = wo.estimatedCost || 10000;
                    const act = wo.actualCost || 0;
                    const diff = est - act;
                    const diffPct = est > 0 ? ((diff / est) * 100).toFixed(1) : 0;
                    const unitCost = wo.completedQuantity > 0 ? Math.round(act / wo.completedQuantity) : Math.round(est / wo.plannedQuantity);

                    return (
                      <tr key={wo.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="p-4 font-mono font-bold text-slate-900">{wo.workOrderNumber}</td>
                        <td className="p-4 font-semibold text-slate-900">{wo.productName}</td>
                        <td className="p-4 text-right font-mono font-bold text-slate-900">{wo.plannedQuantity} pcs</td>
                        <td className="p-4 text-right font-mono text-slate-700">{formatINR(est)}</td>
                        <td className="p-4 text-right font-mono font-bold text-slate-900">{formatINR(act)}</td>
                        <td
                          className={`p-4 text-right font-mono font-bold ${
                            diff >= 0 ? "text-emerald-600" : "text-rose-600"
                          }`}
                        >
                          {diff >= 0 ? `+${formatINR(diff)}` : formatINR(diff)}
                        </td>
                        <td
                          className={`p-4 text-right font-mono font-bold ${
                            diff >= 0 ? "text-emerald-600" : "text-rose-600"
                          }`}
                        >
                          {diffPct}%
                        </td>
                        <td className="p-4 text-right font-mono font-bold text-slate-900">{formatINR(unitCost)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Factory Expenses */}
      {activeTab === "expenses" && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-500">Total Factory Operating Expenses Logged:</span>
              <p className="text-xl font-bold font-mono text-slate-900 mt-0.5">{formatINR(totalExpenses)}</p>
            </div>
            <div className="flex gap-2">
              <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 font-semibold">Electricity: ₹42,500</span>
              <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 font-semibold">Consumables: ₹6,800</span>
            </div>
          </div>

          <div className="rounded-xl bg-white border border-slate-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="p-4">Expense Voucher #</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Payee / Vendor</th>
                    <th className="p-4 text-right">Amount (₹)</th>
                    <th className="p-4">Payment Method</th>
                    <th className="p-4">Notes</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(data.expenses || []).map((exp) => (
                    <tr key={exp.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-4 font-mono font-bold text-slate-900">{exp.expenseNumber}</td>
                      <td className="p-4 font-mono text-slate-500">{formatDate(exp.date)}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-800">
                          {exp.category}
                        </span>
                      </td>
                      <td className="p-4 font-semibold text-slate-900">{exp.payee}</td>
                      <td className="p-4 text-right font-mono font-bold text-slate-950">{formatINR(exp.amount)}</td>
                      <td className="p-4 text-slate-600">{exp.paymentMethod}</td>
                      <td className="p-4 text-slate-500 text-[11px] truncate max-w-xs">{exp.notes}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 uppercase">
                          {exp.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Book Expense Modal */}
      {expenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm">Book Factory Operating Charge</h3>
              <button onClick={() => setExpenseModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveExpense} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Expense Category *</label>
                  <select
                    value={expenseForm.category}
                    onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="Electricity">Electricity</option>
                    <option value="Consumables">Consumables & Tooling</option>
                    <option value="Machine Repair">Machine Repair & Spares</option>
                    <option value="Freight">Freight & Handling</option>
                    <option value="Packaging">Packaging Supplies</option>
                    <option value="Overhead">Rent & Factory Overhead</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Amount (₹) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={expenseForm.amount}
                    onChange={(e) => setExpenseForm({ ...expenseForm, amount: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-200 rounded-lg font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Vendor / Payee *</label>
                <input
                  type="text"
                  required
                  value={expenseForm.payee}
                  onChange={(e) => setExpenseForm({ ...expenseForm, payee: e.target.value })}
                  placeholder="Vendor name or power utility..."
                  className="w-full p-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Payment Method</label>
                <select
                  value={expenseForm.paymentMethod}
                  onChange={(e) => setExpenseForm({ ...expenseForm, paymentMethod: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg bg-white"
                >
                  <option value="NEFT / Bank Transfer">NEFT / Bank Transfer</option>
                  <option value="UPI / Corporate Card">UPI / Corporate Card</option>
                  <option value="Petty Cash">Petty Cash</option>
                  <option value="Cheque / DD">Cheque / Demand Draft</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Voucher Description / Notes</label>
                <textarea
                  rows={2}
                  value={expenseForm.notes}
                  onChange={(e) => setExpenseForm({ ...expenseForm, notes: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setExpenseModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800"
                >
                  Record Expense Voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
