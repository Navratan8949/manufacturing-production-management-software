"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { Printer, X, Download } from "lucide-react";
import { formatINR, formatDate } from "@/lib/utils";

export function DocumentPrintModal() {
  const { activePrintDoc, setActivePrintDoc, data } = useApp();

  if (!activePrintDoc) return null;

  const handlePrint = () => {
    window.print();
  };

  const { company } = data;
  const docType = activePrintDoc.type || "workOrder";
  const docId = activePrintDoc.id;

  // Find linked data based on type
  let title = "FACTORY PRODUCTION DOCUMENT";
  let docNumber = docId || "DOC-2026-001";
  let docDate = new Date().toISOString().slice(0, 10);
  let recipient = null;
  let items = [];
  let notes = "";

  if (docType === "workOrder") {
    const wo = data.workOrders?.find((w) => w.id === docId || w.workOrderNumber === docId) || data.workOrders[0];
    title = "PRODUCTION WORK ORDER";
    docNumber = wo.workOrderNumber;
    docDate = wo.plannedStartDate;
    recipient = {
      title: "PRODUCTION CELL",
      name: wo.assignedTeam || "Shop Floor Assembly Team",
      supervisor: wo.supervisorName,
      targetMachine: wo.machineName,
    };
    items = [
      {
        desc: `${wo.productName} (${wo.productCode})`,
        qty: wo.plannedQuantity,
        unit: "PCS",
        spec: `BOM Version: ${wo.bomVersion || "1.0"} · Priority: ${wo.priority}`,
      },
    ];
    notes = wo.notes || "Standard manufacturing tolerances ±0.5mm. Inspect raw edges before powder coating.";
  } else if (docType === "purchaseOrder") {
    const po = data.purchaseOrders?.find((p) => p.id === docId || p.poNumber === docId) || data.purchaseOrders[0];
    title = "PURCHASE ORDER";
    docNumber = po.poNumber;
    docDate = po.orderDate;
    recipient = {
      title: "SUPPLIER VENDOR",
      name: po.supplierName,
      address: "Industrial Area, Jaipur, Rajasthan",
      deliveryDate: po.expectedDeliveryDate,
    };
    items = (po.items || []).map((i) => ({
      desc: i.name,
      qty: i.orderedQty,
      unit: i.unit,
      rate: formatINR(i.unitPrice),
      amount: formatINR(i.total),
    }));
    notes = po.notes || "Deliver along with mill test certificate and E-way bill.";
  } else if (docType === "goodsReceipt") {
    const grn = data.goodsReceipts?.find((g) => g.id === docId || g.grnNumber === docId) || data.goodsReceipts[0];
    title = "GOODS RECEIPT NOTE (GRN)";
    docNumber = grn.grnNumber;
    docDate = grn.receivedDate;
    recipient = {
      title: "SUPPLIER / CARRIER",
      name: grn.supplierName,
      refPO: grn.poNumber,
      invoiceNo: grn.supplierInvoiceNo,
    };
    items = (grn.items || []).map((i) => ({
      desc: i.name,
      ordered: i.orderedQty,
      received: i.receivedQty,
      accepted: i.acceptedQty,
      rejected: i.rejectedQty || 0,
      unit: i.unit,
    }));
    notes = grn.notes || "Accepted materials stocked in authorized store bins.";
  } else if (docType === "dispatch") {
    const dsp = data.dispatches?.find((d) => d.id === docId || d.dispatchNumber === docId) || data.dispatches[0];
    title = "DELIVERY CHALLAN & DISPATCH SLIP";
    docNumber = dsp.challanNumber || dsp.dispatchNumber;
    docDate = dsp.dispatchDate;
    recipient = {
      title: "CONSIGNEE / CUSTOMER",
      name: dsp.customerName,
      destination: dsp.deliveryAddress,
      vehicle: dsp.vehicleNumber,
      transporter: dsp.transporter,
      eWayBill: dsp.eWayBillNo || "3310-9842-1104",
    };
    items = (dsp.items || []).map((i) => ({
      desc: i.name,
      batch: i.batchNo || "BATCH-2603",
      qty: i.quantity,
      unit: i.unit,
    }));
    notes = dsp.notes || "Received in good order and satisfactory commercial condition.";
  } else if (docType === "jobCard") {
    const jc = data.jobCards?.find((j) => j.id === docId || j.jobCardNumber === docId) || data.jobCards[0];
    title = "OPERATION ROUTING JOB CARD";
    docNumber = jc.jobCardNumber;
    recipient = {
      title: "WORKSTATION",
      name: jc.workstation,
      operator: jc.assignedOperator,
      workOrder: jc.workOrderNumber,
    };
    items = [
      {
        desc: `Operation #${jc.operationSequence}: ${jc.operationName}`,
        qty: jc.plannedQuantity,
        unit: "PCS",
        time: `${jc.plannedTimeHours} hrs (Actual: ${jc.actualTimeHours || 0} hrs)`,
      },
    ];
    notes = jc.remarks || "Check cutter alignment and zero offset prior to starting cycle.";
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-300 w-full max-w-3xl overflow-hidden flex flex-col my-8">
        {/* Top Controls Bar (hidden during browser printing) */}
        <div className="px-6 py-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <Printer className="w-4 h-4 text-slate-700" />
            <span className="text-xs font-bold text-slate-800">Print Document Preview</span>
            <span className="text-[11px] text-slate-500 font-mono">({docNumber})</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={() => setActivePrintDoc(null)}
              className="p-1 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* The Printable Page Body */}
        <div className="p-8 sm:p-12 text-slate-900 bg-white print-page space-y-6">
          {/* Header */}
          <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded bg-slate-900 text-amber-400 font-black flex items-center justify-center text-sm">
                  FF
                </span>
                <h1 className="text-xl font-black tracking-tight text-slate-950 uppercase">{company.name}</h1>
              </div>
              <p className="text-xs text-slate-600 font-medium mt-1">{company.tagline}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {company.address}, {company.city}, {company.state} - {company.pincode}
              </p>
              <p className="text-[11px] text-slate-500">
                GSTIN: <span className="font-mono font-semibold">{company.gstin}</span> · Ph: {company.phone}
              </p>
            </div>

            <div className="text-right">
              <span className="inline-block px-2.5 py-1 text-xs font-black uppercase tracking-wider bg-slate-100 text-slate-900 border border-slate-300 rounded">
                {title}
              </span>
              <p className="text-sm font-bold font-mono text-slate-900 mt-2">{docNumber}</p>
              <p className="text-xs text-slate-600 mt-0.5">Date: {formatDate(docDate)}</p>
            </div>
          </div>

          {/* Recipient / Target Details */}
          {recipient && (
            <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs">
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">{recipient.title}</p>
                <p className="font-bold text-slate-900 text-sm">{recipient.name}</p>
                {recipient.address && <p className="text-slate-600 mt-0.5">{recipient.address}</p>}
                {recipient.destination && <p className="text-slate-600 mt-0.5">Destination: {recipient.destination}</p>}
                {recipient.operator && <p className="text-slate-600 mt-0.5">Assigned: {recipient.operator}</p>}
              </div>

              <div className="text-right space-y-0.5">
                {recipient.vehicle && <p className="text-slate-700">Vehicle No: <span className="font-mono font-semibold">{recipient.vehicle}</span></p>}
                {recipient.transporter && <p className="text-slate-700">Transporter: {recipient.transporter}</p>}
                {recipient.eWayBill && <p className="text-slate-700 font-mono">E-Way Bill: {recipient.eWayBill}</p>}
                {recipient.supervisor && <p className="text-slate-700">Supervisor: {recipient.supervisor}</p>}
                {recipient.targetMachine && <p className="text-slate-700">Workstation: {recipient.targetMachine}</p>}
                {recipient.refPO && <p className="text-slate-700">Against PO: <span className="font-mono font-semibold">{recipient.refPO}</span></p>}
              </div>
            </div>
          )}

          {/* Table Items */}
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3">#</th>
                  <th className="p-3">Description / Item Details</th>
                  {items[0]?.spec !== undefined && <th className="p-3">Specifications</th>}
                  {items[0]?.batch !== undefined && <th className="p-3">Batch / Lot</th>}
                  {items[0]?.ordered !== undefined && <th className="p-3 text-right">Ordered</th>}
                  {items[0]?.received !== undefined && <th className="p-3 text-right">Received</th>}
                  {items[0]?.accepted !== undefined && <th className="p-3 text-right">Accepted</th>}
                  {items[0]?.rejected !== undefined && <th className="p-3 text-right">Rejected</th>}
                  {items[0]?.qty !== undefined && <th className="p-3 text-right">Quantity</th>}
                  {items[0]?.unit !== undefined && <th className="p-3">UOM</th>}
                  {items[0]?.rate !== undefined && <th className="p-3 text-right">Unit Rate</th>}
                  {items[0]?.amount !== undefined && <th className="p-3 text-right">Amount</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {items.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="p-3 text-slate-400 font-mono">{idx + 1}</td>
                    <td className="p-3 font-semibold text-slate-900">{row.desc}</td>
                    {row.spec !== undefined && <td className="p-3 text-slate-600">{row.spec}</td>}
                    {row.batch !== undefined && <td className="p-3 font-mono text-slate-600">{row.batch}</td>}
                    {row.ordered !== undefined && <td className="p-3 text-right font-mono">{row.ordered}</td>}
                    {row.received !== undefined && <td className="p-3 text-right font-mono">{row.received}</td>}
                    {row.accepted !== undefined && <td className="p-3 text-right font-mono font-bold text-emerald-700">{row.accepted}</td>}
                    {row.rejected !== undefined && <td className="p-3 text-right font-mono text-rose-600">{row.rejected}</td>}
                    {row.qty !== undefined && <td className="p-3 text-right font-mono font-bold text-slate-900">{row.qty}</td>}
                    {row.unit !== undefined && <td className="p-3 text-slate-600">{row.unit}</td>}
                    {row.rate !== undefined && <td className="p-3 text-right font-mono">{row.rate}</td>}
                    {row.amount !== undefined && <td className="p-3 text-right font-mono font-bold">{row.amount}</td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Notes and Terms */}
          {notes && (
            <div className="p-3 bg-slate-50 rounded border border-slate-200 text-xs">
              <span className="font-bold text-slate-800">Special Instructions / Remarks: </span>
              <span className="text-slate-600">{notes}</span>
            </div>
          )}

          {/* Signature Sign-offs */}
          <div className="pt-8 grid grid-cols-3 gap-6 text-center text-xs text-slate-600">
            <div>
              <div className="h-10 border-b border-slate-300 mb-1"></div>
              <p className="font-semibold text-slate-800">Prepared By</p>
              <p className="text-[10px] text-slate-400">Stores / Production Desk</p>
            </div>
            <div>
              <div className="h-10 border-b border-slate-300 mb-1"></div>
              <p className="font-semibold text-slate-800">Quality Verified</p>
              <p className="text-[10px] text-slate-400">QC Section Lead</p>
            </div>
            <div>
              <div className="h-10 border-b border-slate-300 mb-1"></div>
              <p className="font-semibold text-slate-800">Authorized Signatory</p>
              <p className="text-[10px] text-slate-400">For ForgeFlow Industries</p>
            </div>
          </div>

          {/* Mandatory Demonstration Disclaimer Footer */}
          <div className="pt-6 border-t border-slate-200 text-center">
            <p className="text-[10px] tracking-wide text-slate-400 uppercase font-mono font-semibold">
              DEMONSTRATION DOCUMENT — NOT AN OFFICIAL TAX, COMPLIANCE OR CERTIFICATION RECORD.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
