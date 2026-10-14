"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  Truck,
  Users,
  Cpu,
  UserCheck,
  Wrench,
  Plus,
  X,
  Calendar,
  CheckCircle2,
  Clock,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import { formatINR, formatDate } from "@/lib/utils";

export function MastersModule({ initialTab = "suppliers" }) {
  const { data, addSupplier, addCustomer, addMaintenanceTicket, updateMaintenanceStatus } = useApp();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [supModalOpen, setSupModalOpen] = useState(false);
  const [custModalOpen, setCustModalOpen] = useState(false);
  const [mntModalOpen, setMntModalOpen] = useState(false);

  // Supplier form
  const [supForm, setSupForm] = useState({
    code: "SUP-JAIPUR-05",
    name: "",
    contactPerson: "",
    phone: "+91 98290 12345",
    email: "",
    city: "Jaipur",
    address: "VKI Industrial Area",
    paymentTerms: "Net 30 Days",
  });

  // Customer form
  const [custForm, setCustForm] = useState({
    code: "CST-RAJ-05",
    name: "",
    contactPerson: "",
    phone: "+91 94140 54321",
    email: "",
    city: "Jaipur",
    billingAddress: "Sitapura Industrial Area",
    creditTerms: "Net 30 Days",
  });

  // Maintenance form
  const [mntForm, setMntForm] = useState({
    machineId: data.machines[0]?.id || "",
    type: "Preventive",
    problemDescription: "Hydraulic oil pressure test and filter change.",
    technician: "Manoj Saini (Maintenance)",
    plannedDate: "2026-03-20",
    labourCost: 1200,
    partsCost: 2500,
  });

  const handleSaveSupplier = (e) => {
    e.preventDefault();
    if (!supForm.name.trim()) return;
    addSupplier(supForm);
    setSupModalOpen(false);
  };

  const handleSaveCustomer = (e) => {
    e.preventDefault();
    if (!custForm.name.trim()) return;
    addCustomer(custForm);
    setCustModalOpen(false);
  };

  const handleSaveMnt = (e) => {
    e.preventDefault();
    const mch = data.machines.find((m) => m.id === mntForm.machineId);
    addMaintenanceTicket({
      ...mntForm,
      machineName: mch?.name || "Machine",
    });
    setMntModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-white border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Plant Masters & Resources Directory</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Suppliers, Commercial Customers, Factory Machine Fleet, Labor Skills, and Maintenance Tickets.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === "suppliers" && (
            <button
              onClick={() => setSupModalOpen(true)}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg flex items-center gap-2 shadow-2xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Supplier</span>
            </button>
          )}
          {activeTab === "customers" && (
            <button
              onClick={() => setCustModalOpen(true)}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg flex items-center gap-2 shadow-2xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Customer</span>
            </button>
          )}
          {activeTab === "maintenance" && (
            <button
              onClick={() => setMntModalOpen(true)}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg flex items-center gap-2 shadow-2xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Log Maintenance Ticket</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 text-xs font-semibold">
        <button
          onClick={() => setActiveTab("suppliers")}
          className={`py-3 px-5 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "suppliers" ? "border-amber-500 text-slate-950 font-bold" : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Suppliers ({data.suppliers.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("customers")}
          className={`py-3 px-5 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "customers" ? "border-amber-500 text-slate-950 font-bold" : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Customers ({data.customers.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("machines")}
          className={`py-3 px-5 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "machines" ? "border-amber-500 text-slate-950 font-bold" : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>Machines & Workstations ({data.machines.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("employees")}
          className={`py-3 px-5 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "employees" ? "border-amber-500 text-slate-950 font-bold" : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Employees & Teams ({data.employees.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("maintenance")}
          className={`py-3 px-5 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "maintenance" ? "border-amber-500 text-slate-950 font-bold" : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span>Maintenance Tickets ({data.maintenanceTickets?.length || 0})</span>
        </button>
      </div>

      {/* Tab 1: Suppliers */}
      {activeTab === "suppliers" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.suppliers.map((sup) => (
            <div key={sup.id} className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono font-bold text-slate-900 text-xs">{sup.code}</span>
                  <h3 className="font-bold text-slate-900 text-sm mt-0.5">{sup.name}</h3>
                </div>
                <span className="text-[11px] font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                  {sup.paymentTerms}
                </span>
              </div>

              <div className="space-y-1 text-xs text-slate-600">
                <p className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>Contact: {sup.contactPerson}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-mono">{sup.phone}</span>
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{sup.address}, {sup.city}</span>
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Payable Balance:</span>
                <span className="font-mono font-bold text-rose-700">{formatINR(sup.payableBalance)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Customers */}
      {activeTab === "customers" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.customers.map((cust) => (
            <div key={cust.id} className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono font-bold text-slate-900 text-xs">{cust.code}</span>
                  <h3 className="font-bold text-slate-900 text-sm mt-0.5">{cust.name}</h3>
                </div>
                <span className="text-[11px] font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                  {cust.creditTerms}
                </span>
              </div>

              <div className="space-y-1 text-xs text-slate-600">
                <p className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>Contact: {cust.contactPerson}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-mono">{cust.phone}</span>
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{cust.billingAddress}, {cust.city}</span>
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Total Billed Revenue:</span>
                <span className="font-mono font-bold text-emerald-600">{formatINR(cust.totalRevenue)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Machines */}
      {activeTab === "machines" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.machines.map((mch) => (
            <div key={mch.id} className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-slate-900 text-xs">{mch.code}</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                    mch.status === "Running"
                      ? "bg-emerald-100 text-emerald-800"
                      : mch.status === "Available"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {mch.status}
                </span>
              </div>

              <h3 className="font-bold text-slate-900 text-sm">{mch.name}</h3>

              <div className="space-y-1 text-xs text-slate-600">
                <p>Location: <strong className="text-slate-900">{mch.location}</strong></p>
                <p>Rated Output: <span>{mch.ratedCapacityPerHour}</span></p>
                <p>Operating Efficiency: <strong className="text-emerald-700 font-mono">{mch.efficiencyPercent}%</strong></p>
                <p className="text-[11px] text-slate-400 font-mono">Next Maintenance: {formatDate(mch.nextMaintenanceDate)}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: Employees & Teams */}
      {activeTab === "employees" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.employees.map((emp) => (
            <div key={emp.id} className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-slate-900 text-xs">{emp.code}</span>
                <span className="text-[10px] font-semibold uppercase bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                  {emp.department}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-sm">{emp.name}</h3>
                <p className="text-xs text-amber-700 font-semibold">{emp.role}</p>
              </div>

              <div className="space-y-1 text-xs text-slate-600">
                <p>Shift: <span>{emp.shift}</span></p>
                <p>Squad: <strong>{emp.assignedTeam}</strong></p>
                <p className="text-[11px] text-slate-500">Skills: {emp.skills.join(", ")}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 5: Maintenance Tickets */}
      {activeTab === "maintenance" && (
        <div className="rounded-xl bg-white border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-4">Ticket Number</th>
                  <th className="p-4">Machine</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Problem Description</th>
                  <th className="p-4">Planned Date</th>
                  <th className="p-4">Assigned Tech</th>
                  <th className="p-4 text-right">Est. Cost</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(data.maintenanceTickets || []).map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4 font-mono font-bold text-slate-900">{ticket.ticketNumber}</td>
                    <td className="p-4 font-semibold text-slate-900">{ticket.machineName}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 uppercase">
                        {ticket.type}
                      </span>
                    </td>
                    <td className="p-4 text-slate-700 max-w-xs">{ticket.problemDescription}</td>
                    <td className="p-4 text-slate-500 font-mono">{formatDate(ticket.plannedDate)}</td>
                    <td className="p-4 text-slate-600">{ticket.technician}</td>
                    <td className="p-4 text-right font-mono font-bold text-slate-900">
                      {formatINR((ticket.labourCost || 0) + (ticket.partsCost || 0))}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                          ticket.status === "Completed" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {ticket.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {ticket.status !== "Completed" && (
                        <button
                          onClick={() => updateMaintenanceStatus(ticket.id, "Completed")}
                          className="px-2.5 py-1 text-slate-900 bg-slate-100 hover:bg-slate-200 font-semibold rounded text-[11px]"
                        >
                          Mark Completed
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Supplier Modal */}
      {supModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm">Register Supplier Vendor</h3>
              <button onClick={() => setSupModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSupplier} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Company / Business Name *</label>
                <input
                  type="text"
                  required
                  value={supForm.name}
                  onChange={(e) => setSupForm({ ...supForm, name: e.target.value })}
                  placeholder="e.g. Jaipur Plywood Traders"
                  className="w-full p-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Contact Person</label>
                  <input
                    type="text"
                    value={supForm.contactPerson}
                    onChange={(e) => setSupForm({ ...supForm, contactPerson: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Phone</label>
                  <input
                    type="text"
                    value={supForm.phone}
                    onChange={(e) => setSupForm({ ...supForm, phone: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Address & City</label>
                <input
                  type="text"
                  value={supForm.address}
                  onChange={(e) => setSupForm({ ...supForm, address: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSupModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800"
                >
                  Save Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      {custModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm">Register Customer Account</h3>
              <button onClick={() => setCustModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCustomer} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Client / Business Name *</label>
                <input
                  type="text"
                  required
                  value={custForm.name}
                  onChange={(e) => setCustForm({ ...custForm, name: e.target.value })}
                  placeholder="e.g. Rajasthan IT Hubs LLP"
                  className="w-full p-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Contact Person</label>
                  <input
                    type="text"
                    value={custForm.contactPerson}
                    onChange={(e) => setCustForm({ ...custForm, contactPerson: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Phone</label>
                  <input
                    type="text"
                    value={custForm.phone}
                    onChange={(e) => setCustForm({ ...custForm, phone: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Delivery Address & City</label>
                <input
                  type="text"
                  value={custForm.billingAddress}
                  onChange={(e) => setCustForm({ ...custForm, billingAddress: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCustModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800"
                >
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Log Maintenance Modal */}
      {mntModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm">Schedule Machine Maintenance</h3>
              <button onClick={() => setMntModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveMnt} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Target Machine *</label>
                <select
                  value={mntForm.machineId}
                  onChange={(e) => setMntForm({ ...mntForm, machineId: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg bg-white"
                >
                  {data.machines.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.code} — {m.name} ({m.location})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Maintenance Type</label>
                  <select
                    value={mntForm.type}
                    onChange={(e) => setMntForm({ ...mntForm, type: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="Preventive">Preventive</option>
                    <option value="Breakdown">Breakdown</option>
                    <option value="Inspection">Periodic Inspection</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Planned Date</label>
                  <input
                    type="date"
                    value={mntForm.plannedDate}
                    onChange={(e) => setMntForm({ ...mntForm, plannedDate: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Task / Problem Description *</label>
                <textarea
                  rows={2}
                  required
                  value={mntForm.problemDescription}
                  onChange={(e) => setMntForm({ ...mntForm, problemDescription: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setMntModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800"
                >
                  Schedule Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
