"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { initialData } from "@/data/initialData";
import { MANUFACTURING_DEMO_USERS } from "@/components/auth/manufacturingDemoUsers";

const AppContext = createContext(null);
const STORAGE_KEY = "forgeflow_demo_v1";

export const ROLE_DEFINITIONS = {
  "Owner / Super Admin": {
    title: "Owner / Super Admin",
    description: "Complete access across all plant modules, financial books, and approvals.",
    color: "bg-purple-100 text-purple-900 border-purple-300",
    badgeColor: "bg-purple-600",
    allowedModules: [
      "dashboard", "products", "materials", "bom", "suppliers", "customers", "machines",
      "employees", "planning", "work-orders", "production-floor", "mrp", "material-issue",
      "production-logs", "job-cards", "quality", "inventory", "wip", "finished-goods",
      "stock-movements", "scrap", "stock-adjustments", "purchase-orders", "goods-receipts",
      "supplier-returns", "sales-orders", "dispatch", "costing", "expenses", "maintenance",
      "reports", "notifications", "settings", "units", "activity"
    ],
    permissions: ["ALL"],
  },
  "Production Manager": {
    title: "Production Manager",
    description: "Authorized for BOMs, planning, work orders, shop floor routing, WIP, and production analytics.",
    color: "bg-blue-100 text-blue-900 border-blue-300",
    badgeColor: "bg-blue-600",
    allowedModules: [
      "dashboard", "products", "materials", "bom", "machines", "employees",
      "planning", "work-orders", "production-floor", "mrp", "production-logs",
      "job-cards", "wip", "quality", "scrap", "costing", "reports", "notifications"
    ],
    permissions: [
      "CREATE_BOM", "EDIT_BOM", "PLAN_PRODUCTION", "CREATE_WO", "RELEASE_WO",
      "RESERVE_MATERIAL", "VIEW_WIP", "VIEW_COSTING", "UPDATE_ROUTING"
    ],
  },
  "Storekeeper": {
    title: "Storekeeper",
    description: "In charge of raw materials custody, goods receipt (GRN) posting, material issue slips, returns, and inventory counts.",
    color: "bg-amber-100 text-amber-900 border-amber-300",
    badgeColor: "bg-amber-600",
    allowedModules: [
      "dashboard", "materials", "inventory", "stock-adjustments", "material-issue",
      "goods-receipts", "supplier-returns", "stock-movements", "scrap", "notifications"
    ],
    permissions: [
      "RECEIVE_GRN", "ISSUE_MATERIAL", "ACCEPT_RETURN", "ADJUST_STOCK",
      "VIEW_RAW_MATERIALS", "CREATE_SUPPLIER_RETURN"
    ],
  },
  "Production Supervisor": {
    title: "Production Supervisor",
    description: "Directs shop floor operations, job card progress, shift output logging (good/reject/scrap), and operator labor hours.",
    color: "bg-orange-100 text-orange-900 border-orange-300",
    badgeColor: "bg-orange-600",
    allowedModules: [
      "dashboard", "production-floor", "job-cards", "production-logs", "wip",
      "work-orders", "scrap", "machines", "notifications"
    ],
    permissions: [
      "LOG_PRODUCTION", "UPDATE_JOB_CARD", "RECORD_SCRAP", "START_WO", "LOG_DOWNTIME"
    ],
  },
  "Quality Inspector": {
    title: "Quality Inspector",
    description: "Enforces ISO & BIS quality gates. Inspects incoming GRNs, tests WIP tolerances, and clears finished goods into sellable stock.",
    color: "bg-emerald-100 text-emerald-900 border-emerald-300",
    badgeColor: "bg-emerald-600",
    allowedModules: [
      "dashboard", "quality", "work-orders", "finished-goods", "goods-receipts",
      "scrap", "reports", "notifications"
    ],
    permissions: [
      "INSPECT_GRN", "INSPECT_WO", "APPROVE_QA", "QUARANTINE_DEFECT", "CLEAR_FINISHED_GOODS"
    ],
  },
  "Procurement Manager": {
    title: "Procurement Manager",
    description: "Manages suppliers, runs MRP purchase calculations, submits purchase orders, and initiates supplier returns.",
    color: "bg-cyan-100 text-cyan-900 border-cyan-300",
    badgeColor: "bg-cyan-600",
    allowedModules: [
      "dashboard", "suppliers", "materials", "mrp", "purchase-orders",
      "goods-receipts", "supplier-returns", "reports", "notifications"
    ],
    permissions: [
      "MANAGE_SUPPLIERS", "CREATE_PO", "SUBMIT_PO", "RUN_MRP", "CREATE_SUPPLIER_RETURN"
    ],
  },
  "Dispatch Manager": {
    title: "Dispatch Manager",
    description: "Oversees customer orders, allocates finished goods, assigns carrier fleets, and issues official delivery challans.",
    color: "bg-indigo-100 text-indigo-900 border-indigo-300",
    badgeColor: "bg-indigo-600",
    allowedModules: [
      "dashboard", "sales-orders", "dispatch", "finished-goods", "customers",
      "stock-movements", "reports", "notifications"
    ],
    permissions: [
      "ALLOCATE_STOCK", "CREATE_DISPATCH", "ISSUE_CHALLAN", "ASSIGN_TRANSPORTER", "MANAGE_CUSTOMERS"
    ],
  },
  "Accountant / Cost Analyst": {
    title: "Accountant / Cost Analyst",
    description: "Audits standard BOM costing vs actual variance, records factory overhead and utility vouchers, and reviews scrap drag.",
    color: "bg-teal-100 text-teal-900 border-teal-300",
    badgeColor: "bg-teal-600",
    allowedModules: [
      "dashboard", "costing", "expenses", "reports", "work-orders", "scrap", "notifications"
    ],
    permissions: [
      "VIEW_COSTING", "BOOK_EXPENSE", "ANALYZE_VARIANCE", "EXPORT_FINANCIAL_REPORTS"
    ],
  },
  "Maintenance Technician": {
    title: "Maintenance Technician",
    description: "Maintains machine fleet, conducts preventive lubrication rounds, fixes breakdown tickets, and logs machine uptime.",
    color: "bg-rose-100 text-rose-900 border-rose-300",
    badgeColor: "bg-rose-600",
    allowedModules: [
      "dashboard", "machines", "maintenance", "production-floor", "notifications"
    ],
    permissions: [
      "SCHEDULE_MAINTENANCE", "RESOLVE_TICKET", "UPDATE_MACHINE_STATUS", "RECORD_DOWNTIME_REPAIR"
    ],
  },
};

export const GUIDED_SCENARIOS = [
  {
    id: "scenario-a",
    code: "A",
    title: "Scenario A: Procurement & GRN Receiving",
    role: "Storekeeper",
    targetView: "purchase-orders",
    step1: "Open Purchase Orders and review PO-2026-112 (Timber & Steel tubes).",
    step2: "Click 'Receive Material' to post Goods Receipt Note GRN-2026-045.",
    step3: "Observe that ONLY accepted quantities increase usable store inventory, while rejected stock is quarantined.",
  },
  {
    id: "scenario-b",
    code: "B",
    title: "Scenario B: BOM & Production Planning",
    role: "Production Manager",
    targetView: "bom",
    step1: "Inspect BOM-FD101-V1 (Office Executive Desk) recipe with 4.5% scrap factor.",
    step2: "Use the Batch Scale Simulator (enter 20 units) to see gross component needs.",
    step3: "Click 'Plan Work Order' to generate WO-2026-084 and reserve component stocks.",
  },
  {
    id: "scenario-c",
    code: "C",
    title: "Scenario C: Shop Floor Production Logs",
    role: "Production Supervisor",
    targetView: "production-floor",
    step1: "Select active Work Order WO-2026-081 on the Shop Floor Board.",
    step2: "Click 'Record Production Output' to log 5 good units, 0 rejects, and 4 machine hours.",
    step3: "Verify real-time completion progress increases without double-counting.",
  },
  {
    id: "scenario-d",
    code: "D",
    title: "Scenario D: Quality Inspection & Clearance",
    role: "Quality Inspector",
    targetView: "quality",
    step1: "Open Quality Assurance to review pending final inspection for completed desks.",
    step2: "Click 'New Inspection Report' and complete the 4-point tolerance checklist.",
    step3: "Notice that approved units transfer immediately into Sellable Finished Goods.",
  },
  {
    id: "scenario-e",
    code: "E",
    title: "Scenario E: Sales Order & Delivery Challan",
    role: "Dispatch Manager",
    targetView: "dispatch",
    step1: "Review confirmed sales order SO-2026-055 for Pink City Coworking Hubs.",
    step2: "Click 'Dispatch Goods' to allocate finished stock and assign vehicle RJ-14-GA-8821.",
    step3: "Click 'Print Challan' to generate the official industrial delivery slip.",
  },
  {
    id: "scenario-f",
    code: "F",
    title: "Scenario F: Cost Variance & Audit Ledger",
    role: "Accountant / Cost Analyst",
    targetView: "costing",
    step1: "Open Production Costing to compare estimated BOM budget vs actual incurred cost.",
    step2: "Inspect material, labor, machine, and scrap drag variances.",
    step3: "Navigate to Stock Movement Ledger to download the full CSV transaction trail.",
  },
];

const emptySubscribe = () => () => {};

function useIsMounted() {
  return React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export function AppProvider({ children }) {
  const [data, setData] = useState(initialData);
  const [activeView, setActiveView] = useState("dashboard");
  const [isLandingView, setIsLandingView] = useState(true);
  const isMounted = useIsMounted();
  const [activePrintDoc, setActivePrintDoc] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [roleGuideModalOpen, setRoleGuideModalOpen] = useState(false);
  const [roleFilterMode, setRoleFilterMode] = useState("all"); // 'all' or 'my_role'
  const [activeScenario, setActiveScenario] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("forgeflow_authenticated");
      return stored !== null ? stored === "true" : true;
    }
    return true;
  });

  const currentUser = useMemo(() => {
    const matched = MANUFACTURING_DEMO_USERS.find(
      (u) => u.role === data.currentUserRole
    );
    if (matched) return matched;
    return MANUFACTURING_DEMO_USERS[0];
  }, [data.currentUserRole]);

  // Asynchronously load client-side storage after hydration
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          setData(JSON.parse(stored));
        }
      } catch (e) {
        console.warn("Error parsing localStorage demo data", e);
      }

      try {
        const inERP = sessionStorage.getItem("forgeflow_in_erp");
        if (inERP === "true") {
          setIsLandingView(false);
        }
      } catch (e) {
        console.warn("Error reading sessionStorage", e);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // Sync to localStorage only after component has mounted and loaded stored data
  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn("Could not write to localStorage", e);
    }
  }, [data, isMounted]);

  const showToast = (message, type = "success") => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => {
      setToastMessage((prev) => (prev?.message === message ? null : prev));
    }, 4000);
  };

  const addActivity = (action, entityRef, description) => {
    const newLog = {
      id: `ACT-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString().replace("T", " ").slice(0, 16),
      action,
      entityRef,
      role: data.currentUserRole,
      user: data.currentUserRole.split(" ")[0],
      description,
    };
    setData((prev) => ({
      ...prev,
      activityLogs: [newLog, ...(prev.activityLogs || [])],
    }));
  };

  const addStockMovement = (movement) => {
    const newMov = {
      id: `MOV-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().slice(0, 10),
      user: data.currentUserRole,
      ...movement,
    };
    setData((prev) => ({
      ...prev,
      stockMovements: [newMov, ...(prev.stockMovements || [])],
    }));
  };

  // Switch demo user role
  const setCurrentUserRole = (role) => {
    setData((prev) => ({ ...prev, currentUserRole: role }));
    showToast(`Perspective switched to ${role}`);
    addActivity("ROLE_CHANGED", "User Session", `Switched active demo perspective to ${role}`);
  };

  // Auth Methods
  const login = (emailOrRole, password) => {
    const matched = MANUFACTURING_DEMO_USERS.find(
      (u) =>
        u.email?.toLowerCase() === emailOrRole?.trim().toLowerCase() ||
        u.role?.toLowerCase() === emailOrRole?.trim().toLowerCase() ||
        u.name?.toLowerCase() === emailOrRole?.trim().toLowerCase() ||
        u.employeeId?.toLowerCase() === emailOrRole?.trim().toLowerCase()
    );

    if (matched) {
      setData((prev) => ({ ...prev, currentUserRole: matched.role }));
      setActiveView(matched.defaultView || "dashboard");
      setIsLandingView(false);
      setIsAuthenticated(true);
      if (typeof window !== "undefined") {
        localStorage.setItem("forgeflow_authenticated", "true");
        sessionStorage.setItem("forgeflow_in_erp", "true");
      }
      showToast(`Welcome, ${matched.name}! Signed in as ${matched.role}`);
      return { success: true, user: matched };
    }

    // Fallback
    setIsAuthenticated(true);
    setIsLandingView(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("forgeflow_authenticated", "true");
      sessionStorage.setItem("forgeflow_in_erp", "true");
    }
    showToast(`Signed in as ${data.currentUserRole}`);
    return { success: true };
  };

  const logout = () => {
    setIsAuthenticated(false);
    setIsLandingView(true);
    if (typeof window !== "undefined") {
      localStorage.setItem("forgeflow_authenticated", "false");
      sessionStorage.setItem("forgeflow_in_erp", "false");
    }
    showToast("Signed out of ForgeFlow MPMS", "info");
  };

  const switchDemoUser = (userId) => {
    const user = MANUFACTURING_DEMO_USERS.find((u) => u.id === userId || u.employeeId === userId);
    if (user) {
      return login(user.email, user.password);
    }
  };

  // Permission verification helper
  const canAccessModule = (moduleKey) => {
    const currentDef = ROLE_DEFINITIONS[data.currentUserRole] || ROLE_DEFINITIONS["Owner / Super Admin"];
    if (currentDef.permissions.includes("ALL")) return true;
    return currentDef.allowedModules.includes(moduleKey);
  };

  const canPerformAction = (permissionKey) => {
    const currentDef = ROLE_DEFINITIONS[data.currentUserRole] || ROLE_DEFINITIONS["Owner / Super Admin"];
    if (currentDef.permissions.includes("ALL")) return true;
    return currentDef.permissions.includes(permissionKey);
  };

  // Launch guided scenario
  const startGuidedScenario = (scenarioId) => {
    const scenario = GUIDED_SCENARIOS.find((s) => s.id === scenarioId);
    if (!scenario) return;
    setActiveScenario(scenario);
    setCurrentUserRole(scenario.role);
    setActiveView(scenario.targetView);
    setIsLandingView(false);
    showToast(`Guided Tour Active: ${scenario.title} as ${scenario.role}`);
  };

  // Reset to initial seed
  const resetDemoData = () => {
    setData(initialData);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    showToast("Demo database reset to initial factory seed.");
  };

  // Products
  const addProduct = (prod) => {
    const newProduct = {
      ...prod,
      id: `PRD-${Date.now().toString().slice(-4)}`,
      currentStock: Number(prod.currentStock || 0),
      reservedStock: 0,
      qualityHoldStock: 0,
      active: true,
    };
    setData((prev) => ({
      ...prev,
      products: [newProduct, ...prev.products],
    }));
    addActivity("PRODUCT_CREATED", newProduct.code, `Registered product ${newProduct.name}`);
    showToast(`Product ${newProduct.name} created.`);
  };

  const updateProduct = (prod) => {
    setData((prev) => ({
      ...prev,
      products: prev.products.map((p) => (p.id === prod.id ? prod : p)),
    }));
    addActivity("PRODUCT_UPDATED", prod.code, `Updated specifications for ${prod.name}`);
    showToast(`Product ${prod.name} updated.`);
  };

  const toggleProductStatus = (id) => {
    setData((prev) => ({
      ...prev,
      products: prev.products.map((p) => {
        if (p.id === id) {
          const updated = { ...p, active: !p.active };
          addActivity("PRODUCT_STATUS", p.code, `Changed status to ${updated.active ? "Active" : "Inactive"}`);
          return updated;
        }
        return p;
      }),
    }));
  };

  // Raw Materials
  const addRawMaterial = (mat) => {
    const newMat = {
      ...mat,
      id: `MAT-${Date.now().toString().slice(-4)}`,
      currentStock: Number(mat.currentStock || 0),
      reservedStock: 0,
      status: Number(mat.currentStock) <= Number(mat.reorderLevel) ? "Low Stock" : "Adequate",
    };
    setData((prev) => ({
      ...prev,
      rawMaterials: [newMat, ...prev.rawMaterials],
    }));
    addActivity("MATERIAL_CREATED", newMat.code, `Added raw material ${newMat.name}`);
    showToast(`Material ${newMat.name} added.`);
  };

  const updateRawMaterial = (mat) => {
    setData((prev) => ({
      ...prev,
      rawMaterials: prev.rawMaterials.map((m) =>
        m.id === mat.id
          ? {
              ...mat,
              status: Number(mat.currentStock) <= Number(mat.reorderLevel) ? "Low Stock" : "Adequate",
            }
          : m
      ),
    }));
    addActivity("MATERIAL_UPDATED", mat.code, `Updated material master for ${mat.name}`);
    showToast(`Material ${mat.name} updated.`);
  };

  const adjustStock = (matId, newQty, reason = "Physical Cycle Count Audit") => {
    setData((prev) => {
      const mat = prev.rawMaterials.find((m) => m.id === matId);
      if (!mat) return prev;
      const delta = Number(newQty) - mat.currentStock;
      const updatedMaterials = prev.rawMaterials.map((m) =>
        m.id === matId
          ? {
              ...m,
              currentStock: Number(newQty),
              status: Number(newQty) <= m.reorderLevel ? "Low Stock" : "Adequate",
            }
          : m
      );

      addStockMovement({
        type: delta >= 0 ? "ADJUSTMENT_ADD" : "ADJUSTMENT_DEDUCT",
        itemType: "Raw Material",
        itemCode: mat.code,
        itemName: mat.name,
        quantity: delta,
        unit: mat.unit,
        referenceDoc: "STK-ADJ-" + Date.now().toString().slice(-4),
        warehouse: mat.storageLocation,
        notes: `Manual inventory adjustment: ${reason}`,
      });

      addActivity("STOCK_ADJUSTED", mat.code, `Adjusted stock by ${delta > 0 ? "+" : ""}${delta} ${mat.unit} (${reason})`);
      return { ...prev, rawMaterials: updatedMaterials };
    });
    showToast("Stock quantity adjusted and logged in audit ledger.");
  };

  // Bill of Materials (BOM)
  const addBOM = (bom) => {
    const newBOM = {
      ...bom,
      id: `BOM-${Date.now().toString().slice(-4)}`,
      status: "Active",
    };
    setData((prev) => ({
      ...prev,
      boms: [newBOM, ...prev.boms],
    }));
    addActivity("BOM_CREATED", newBOM.bomNumber, `Registered BOM for ${newBOM.productName}`);
    showToast(`BOM ${newBOM.bomNumber} activated.`);
  };

  const updateBOM = (bom) => {
    setData((prev) => ({
      ...prev,
      boms: prev.boms.map((b) => (b.id === bom.id ? bom : b)),
    }));
    addActivity("BOM_UPDATED", bom.bomNumber, `Updated revision for ${bom.bomNumber}`);
    showToast(`BOM ${bom.bomNumber} updated.`);
  };

  // Suppliers & Customers
  const addSupplier = (sup) => {
    const newSup = { ...sup, id: `SUP-${Date.now().toString().slice(-4)}`, active: true, payableBalance: 0 };
    setData((prev) => ({ ...prev, suppliers: [newSup, ...prev.suppliers] }));
    showToast(`Supplier ${newSup.name} added.`);
  };

  const addCustomer = (cust) => {
    const newCust = { ...cust, id: `CUST-${Date.now().toString().slice(-4)}`, active: true, ordersCount: 0, totalRevenue: 0 };
    setData((prev) => ({ ...prev, customers: [newCust, ...prev.customers] }));
    showToast(`Customer ${newCust.name} added.`);
  };

  // Work Orders & Planning
  const createWorkOrder = (woData) => {
    const count = (data.workOrders?.length || 80) + 1;
    const newWO = {
      ...woData,
      id: `WO-2026-${count}`,
      workOrderNumber: `WO-2026-${count}`,
      releasedQuantity: 0,
      completedQuantity: 0,
      acceptedQuantity: 0,
      rejectedQuantity: 0,
      actualStartDate: null,
      actualCompletionDate: null,
      materialsReserved: false,
      materialIssued: false,
      actualCost: 0,
      wipStage: "Planned",
      status: "Planned",
    };

    setData((prev) => ({
      ...prev,
      workOrders: [newWO, ...prev.workOrders],
    }));

    addActivity("WORK_ORDER_CREATED", newWO.workOrderNumber, `Created planned work order for ${newWO.plannedQuantity}x ${newWO.productName}`);
    showToast(`Work order ${newWO.workOrderNumber} planned.`);
    return newWO;
  };

  const reserveMaterialForWO = (woId) => {
    setData((prev) => {
      const wo = prev.workOrders.find((w) => w.id === woId);
      if (!wo) return prev;
      const bom = prev.boms.find((b) => b.id === wo.bomId || b.productCode === wo.productCode);
      if (!bom) {
        showToast("No active BOM linked to this product.", "error");
        return prev;
      }

      // Check if materials available and reserve
      const updatedMaterials = prev.rawMaterials.map((mat) => {
        const item = bom.items?.find((i) => i.materialCode === mat.code || i.materialId === mat.id);
        if (item) {
          const reqQty = item.qty * wo.plannedQuantity * (1 + (bom.scrapAllowancePercent || 0) / 100);
          return {
            ...mat,
            reservedStock: mat.reservedStock + reqQty,
          };
        }
        return mat;
      });

      const updatedWOs = prev.workOrders.map((w) =>
        w.id === woId
          ? {
              ...w,
              materialsReserved: true,
              status: "Material Reserved",
              wipStage: "Material Reserved",
            }
          : w
      );

      addActivity("MATERIAL_RESERVED", wo.workOrderNumber, `Reserved component stocks for ${wo.plannedQuantity}x ${wo.productName}`);
      return { ...prev, rawMaterials: updatedMaterials, workOrders: updatedWOs };
    });
    showToast("Material reserved successfully for work order.");
  };

  const issueMaterialForWO = (woId) => {
    setData((prev) => {
      const wo = prev.workOrders.find((w) => w.id === woId);
      if (!wo) return prev;
      const bom = prev.boms.find((b) => b.id === wo.bomId || b.productCode === wo.productCode);
      if (!bom) return prev;

      const issueSlipItems = [];
      const updatedMaterials = prev.rawMaterials.map((mat) => {
        const item = bom.items?.find((i) => i.materialCode === mat.code || i.materialId === mat.id);
        if (item) {
          const reqQty = Number((item.qty * wo.plannedQuantity * (1 + (bom.scrapAllowancePercent || 0) / 100)).toFixed(1));
          issueSlipItems.push({
            materialCode: mat.code,
            name: mat.name,
            requestedQty: reqQty,
            issuedQty: reqQty,
            unit: mat.unit,
          });

          addStockMovement({
            type: "ISSUE_PRODUCTION",
            itemType: "Raw Material",
            itemCode: mat.code,
            itemName: mat.name,
            quantity: -reqQty,
            unit: mat.unit,
            referenceDoc: `${wo.workOrderNumber}`,
            warehouse: mat.storageLocation,
            notes: `Material issued to shop floor for ${wo.workOrderNumber}`,
          });

          return {
            ...mat,
            currentStock: Math.max(0, mat.currentStock - reqQty),
            reservedStock: Math.max(0, mat.reservedStock - reqQty),
            status: mat.currentStock - reqQty <= mat.reorderLevel ? "Low Stock" : "Adequate",
          };
        }
        return mat;
      });

      const newIssueSlip = {
        id: `ISS-${Date.now().toString().slice(-4)}`,
        issueNumber: `ISS-2026-${(prev.materialIssues?.length || 30) + 1}`,
        workOrderNumber: wo.workOrderNumber,
        date: new Date().toISOString().slice(0, 10),
        issuedBy: "Amit Verma (Storekeeper)",
        receivedBy: wo.supervisorName || "Vikram Singh Rathore",
        status: "Issued",
        items: issueSlipItems,
        notes: `Production issue release against BOM ${bom.bomNumber}`,
      };

      const updatedWOs = prev.workOrders.map((w) =>
        w.id === woId
          ? {
              ...w,
              materialIssued: true,
              releasedQuantity: w.plannedQuantity,
              status: "In Progress",
              actualStartDate: w.actualStartDate || new Date().toISOString().slice(0, 10),
              wipStage: "Shop Floor Production",
            }
          : w
      );

      addActivity("MATERIAL_ISSUED", newIssueSlip.issueNumber, `Issued materials to production for ${wo.workOrderNumber}`);
      return {
        ...prev,
        rawMaterials: updatedMaterials,
        materialIssues: [newIssueSlip, ...(prev.materialIssues || [])],
        workOrders: updatedWOs,
      };
    });
    showToast("Materials issued to shop floor & on-hand inventory updated.");
  };

  const addProductionLog = (logData) => {
    setData((prev) => {
      const wo = prev.workOrders.find((w) => w.workOrderNumber === logData.workOrderNumber);
      const good = Number(logData.goodQty || 0);
      const rejected = Number(logData.rejectedQty || 0);

      const newLog = {
        ...logData,
        id: `LOG-${Date.now().toString().slice(-4)}`,
        date: logData.date || new Date().toISOString().slice(0, 10),
      };

      let updatedWOs = prev.workOrders;
      if (wo) {
        const newCompleted = Math.min(wo.plannedQuantity, (wo.completedQuantity || 0) + good);
        const newAccepted = (wo.acceptedQuantity || 0) + good;
        const newRejected = (wo.rejectedQuantity || 0) + rejected;
        const isDone = newCompleted >= wo.plannedQuantity;

        updatedWOs = prev.workOrders.map((w) =>
          w.id === wo.id
            ? {
                ...w,
                completedQuantity: newCompleted,
                acceptedQuantity: newAccepted,
                rejectedQuantity: newRejected,
                actualCost: (w.actualCost || 0) + good * (w.estimatedCost / w.plannedQuantity || 4000),
                status: isDone ? "Quality Inspection" : "In Progress",
                wipStage: isDone ? "Pending Final QC" : w.wipStage,
              }
            : w
        );
      }

      addActivity("PRODUCTION_LOG_POSTED", logData.workOrderNumber, `Logged output: ${good} good, ${rejected} rejected`);
      return {
        ...prev,
        productionLogs: [newLog, ...(prev.productionLogs || [])],
        workOrders: updatedWOs,
      };
    });
    showToast("Production log recorded successfully.");
  };

  const updateWorkOrderStatus = (woId, newStatus) => {
    setData((prev) => {
      const updatedWOs = prev.workOrders.map((w) =>
        w.id === woId
          ? {
              ...w,
              status: newStatus,
              actualCompletionDate: newStatus === "Completed" ? new Date().toISOString().slice(0, 10) : w.actualCompletionDate,
            }
          : w
      );
      addActivity("WORK_ORDER_STATUS", woId, `Status transitioned to ${newStatus}`);
      return { ...prev, workOrders: updatedWOs };
    });
    showToast(`Work order status updated to ${newStatus}.`);
  };

  // Quality Inspection
  const addQualityInspection = (qcData) => {
    setData((prev) => {
      const count = (prev.qualityInspections?.length || 50) + 1;
      const newQC = {
        ...qcData,
        id: `QC-${Date.now().toString().slice(-4)}`,
        inspectionNumber: `QC-2026-${count}`,
        date: qcData.date || new Date().toISOString().slice(0, 10),
      };

      // If this was a final product inspection for a Work Order, release accepted goods into Sellable Stock!
      let updatedProducts = prev.products;
      if (qcData.type === "Final Product Inspection" && qcData.productCode) {
        const accepted = Number(qcData.acceptedQty || 0);
        if (accepted > 0) {
          updatedProducts = prev.products.map((p) =>
            p.code === qcData.productCode
              ? {
                  ...p,
                  currentStock: p.currentStock + accepted,
                }
              : p
          );

          addStockMovement({
            type: "PRODUCTION_RECEIPT",
            itemType: "Finished Good",
            itemCode: qcData.productCode,
            itemName: qcData.productName || qcData.productCode,
            quantity: accepted,
            unit: "PCS",
            referenceDoc: newQC.inspectionNumber,
            warehouse: "Finished Goods Bay E",
            notes: `Accepted finished goods moved to sellable inventory after QC clearance`,
          });
        }
      }

      addActivity("QUALITY_INSPECTION_COMPLETED", newQC.inspectionNumber, `Completed ${newQC.type}: ${newQC.status}`);
      return {
        ...prev,
        qualityInspections: [newQC, ...(prev.qualityInspections || [])],
        products: updatedProducts,
      };
    });
    showToast("Quality inspection recorded & eligible stock updated.");
  };

  // Purchase Orders & GRN
  const createPurchaseOrder = (poData) => {
    const count = (data.purchaseOrders?.length || 110) + 1;
    const newPO = {
      ...poData,
      id: `PO-2026-${count}`,
      poNumber: `PO-2026-${count}`,
      status: "Submitted",
      orderDate: new Date().toISOString().slice(0, 10),
    };
    setData((prev) => ({
      ...prev,
      purchaseOrders: [newPO, ...prev.purchaseOrders],
    }));
    addActivity("PURCHASE_ORDER_SUBMITTED", newPO.poNumber, `Issued PO to ${newPO.supplierName} for ₹${newPO.totalAmount}`);
    showToast(`Purchase order ${newPO.poNumber} submitted.`);
    return newPO;
  };

  const postGoodsReceipt = (grnData) => {
    setData((prev) => {
      const count = (prev.goodsReceipts?.length || 40) + 1;
      const newGRN = {
        ...grnData,
        id: `GRN-${Date.now().toString().slice(-4)}`,
        grnNumber: `GRN-2026-${count}`,
        receivedDate: new Date().toISOString().slice(0, 10),
      };

      // Only accepted quantities increase usable inventory
      const updatedMaterials = [...prev.rawMaterials];
      (newGRN.items || []).forEach((item) => {
        const accepted = Number(item.acceptedQty || 0);
        if (accepted > 0) {
          const idx = updatedMaterials.findIndex((m) => m.code === item.materialCode);
          if (idx !== -1) {
            updatedMaterials[idx] = {
              ...updatedMaterials[idx],
              currentStock: updatedMaterials[idx].currentStock + accepted,
              status: updatedMaterials[idx].currentStock + accepted <= updatedMaterials[idx].reorderLevel ? "Low Stock" : "Adequate",
            };

            addStockMovement({
              type: "RECEIPT_GRN",
              itemType: "Raw Material",
              itemCode: item.materialCode,
              itemName: item.name,
              quantity: accepted,
              unit: item.unit || "PCS",
              referenceDoc: newGRN.grnNumber,
              warehouse: updatedMaterials[idx].storageLocation,
              notes: `Goods receipt against ${newGRN.poNumber}. Accepted: ${accepted}, Rejected: ${item.rejectedQty || 0}`,
            });
          }
        }
      });

      // Update PO status
      const updatedPOs = prev.purchaseOrders.map((po) =>
        po.poNumber === newGRN.poNumber
          ? {
              ...po,
              status: "Received",
            }
          : po
      );

      addActivity("GOODS_RECEIPT_POSTED", newGRN.grnNumber, `Received material against ${newGRN.poNumber}`);
      return {
        ...prev,
        goodsReceipts: [newGRN, ...(prev.goodsReceipts || [])],
        rawMaterials: updatedMaterials,
        purchaseOrders: updatedPOs,
      };
    });
    showToast("Goods Receipt Note posted and usable inventory updated.");
  };

  // Supplier Returns
  const postSupplierReturn = (returnData) => {
    const count = Date.now().toString().slice(-4);
    const newReturn = {
      ...returnData,
      id: `SRT-${count}`,
      returnNumber: `SRT-2026-${count}`,
      date: new Date().toISOString().slice(0, 10),
      status: "Dispatched to Supplier",
    };

    addStockMovement({
      type: "SUPPLIER_RETURN",
      itemType: "Raw Material",
      itemCode: returnData.materialCode,
      itemName: returnData.materialName,
      quantity: -Number(returnData.quantity),
      unit: returnData.unit,
      referenceDoc: newReturn.returnNumber,
      warehouse: "Quarantine Bin",
      notes: `Rejected stock returned to vendor: ${returnData.reason}`,
    });

    addActivity("SUPPLIER_RETURN_POSTED", newReturn.returnNumber, `Returned ${returnData.quantity} ${returnData.unit} to ${returnData.supplierName}`);
    showToast(`Supplier return ${newReturn.returnNumber} dispatched.`);
  };

  // Sales Orders & Dispatches
  const createSalesOrder = (soData) => {
    const count = (data.salesOrders?.length || 50) + 1;
    const newSO = {
      ...soData,
      id: `SO-2026-${count}`,
      soNumber: `SO-2026-${count}`,
      orderDate: new Date().toISOString().slice(0, 10),
      status: "Confirmed",
      dispatchStatus: "Pending Dispatch",
    };
    setData((prev) => ({
      ...prev,
      salesOrders: [newSO, ...prev.salesOrders],
    }));
    addActivity("SALES_ORDER_CONFIRMED", newSO.soNumber, `Received order from ${newSO.customerName}`);
    showToast(`Sales order ${newSO.soNumber} booked.`);
    return newSO;
  };

  const postDispatch = (dspData) => {
    setData((prev) => {
      const count = (prev.dispatches?.length || 20) + 1;
      const newDSP = {
        ...dspData,
        id: `DSP-2026-${count}`,
        dispatchNumber: `DSP-2026-${count}`,
        challanNumber: `DC-2026-${count}`,
        dispatchDate: new Date().toISOString().slice(0, 10),
        status: "Dispatched",
      };

      // Reduce finished goods inventory
      const updatedProducts = [...prev.products];
      (newDSP.items || []).forEach((item) => {
        const qty = Number(item.quantity || 0);
        const idx = updatedProducts.findIndex((p) => p.code === item.productCode);
        if (idx !== -1) {
          updatedProducts[idx] = {
            ...updatedProducts[idx],
            currentStock: Math.max(0, updatedProducts[idx].currentStock - qty),
            reservedStock: Math.max(0, (updatedProducts[idx].reservedStock || 0) - qty),
          };

          addStockMovement({
            type: "DISPATCH_SALES",
            itemType: "Finished Good",
            itemCode: item.productCode,
            itemName: item.name,
            quantity: -qty,
            unit: item.unit || "PCS",
            referenceDoc: newDSP.challanNumber,
            warehouse: "Finished Goods Bay E",
            notes: `Dispatched to ${newDSP.customerName} via ${newDSP.transporter}`,
          });
        }
      });

      // Update Sales Order
      const updatedSOs = prev.salesOrders.map((so) =>
        so.soNumber === newDSP.salesOrderNumber
          ? {
              ...so,
              dispatchStatus: "Dispatched",
            }
          : so
      );

      addActivity("DISPATCH_CONFIRMED", newDSP.challanNumber, `Dispatched goods to ${newDSP.customerName}`);
      return {
        ...prev,
        dispatches: [newDSP, ...(prev.dispatches || [])],
        products: updatedProducts,
        salesOrders: updatedSOs,
      };
    });
    showToast("Dispatch confirmed, finished goods reduced & Delivery Challan created.");
  };

  // Scrap
  const addScrapRecord = (scrapData) => {
    const count = (data.scrapRecords?.length || 10) + 1;
    const newScrap = {
      ...scrapData,
      id: `SCR-${Date.now().toString().slice(-4)}`,
      scrapReference: `SCR-2026-${count}`,
      date: new Date().toISOString().slice(0, 10),
    };
    setData((prev) => ({
      ...prev,
      scrapRecords: [newScrap, ...(prev.scrapRecords || [])],
    }));
    addActivity("SCRAP_RECORDED", newScrap.scrapReference, `Logged ${newScrap.scrapQty} ${newScrap.unit} scrap (${newScrap.reason})`);
    showToast("Scrap record added to registry.");
  };

  // Maintenance
  const addMaintenanceTicket = (ticket) => {
    const count = (data.maintenanceTickets?.length || 10) + 1;
    const newTicket = {
      ...ticket,
      id: `MT-${Date.now().toString().slice(-4)}`,
      ticketNumber: `MT-2026-${count}`,
      reportedDate: new Date().toISOString().slice(0, 10),
      status: "Scheduled",
    };
    setData((prev) => ({
      ...prev,
      maintenanceTickets: [newTicket, ...(prev.maintenanceTickets || [])],
    }));
    addActivity("MAINTENANCE_TICKET_LOGGED", newTicket.ticketNumber, `Ticket for ${newTicket.machineName}`);
    showToast(`Maintenance ticket ${newTicket.ticketNumber} logged.`);
  };

  const updateMaintenanceStatus = (ticketId, newStatus) => {
    setData((prev) => ({
      ...prev,
      maintenanceTickets: prev.maintenanceTickets.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              status: newStatus,
              completionDate: newStatus === "Completed" ? new Date().toISOString().slice(0, 10) : t.completionDate,
            }
          : t
      ),
    }));
    showToast(`Maintenance ticket marked ${newStatus}`);
  };

  // Expenses
  const addExpense = (expense) => {
    const count = (data.expenses?.length || 20) + 1;
    const newExp = {
      ...expense,
      id: `EXP-${Date.now().toString().slice(-4)}`,
      expenseNumber: `EXP-2026-${count}`,
      date: expense.date || new Date().toISOString().slice(0, 10),
      status: "Paid",
    };
    setData((prev) => ({
      ...prev,
      expenses: [newExp, ...(prev.expenses || [])],
    }));
    addActivity("EXPENSE_RECORDED", newExp.expenseNumber, `₹${newExp.amount} for ${newExp.category} (${newExp.payee})`);
    showToast(`Expense ${newExp.expenseNumber} booked.`);
  };

  // Job cards
  const updateJobCardStatus = (cardId, newStatus, completedQty = null) => {
    setData((prev) => ({
      ...prev,
      jobCards: prev.jobCards.map((j) =>
        j.id === cardId
          ? {
              ...j,
              status: newStatus,
              completedQuantity: completedQty !== null ? Number(completedQty) : j.completedQuantity,
            }
          : j
      ),
    }));
    showToast(`Job Card ${cardId} status set to ${newStatus}`);
  };

  // Material Return from floor to store
  const postMaterialReturn = (returnData) => {
    const count = (data.materialReturns?.length || 4) + 1;
    const newReturn = {
      id: `RET-${Date.now().toString().slice(-4)}`,
      returnNumber: `RET-2026-${count}`,
      date: new Date().toISOString().slice(0, 10),
      ...returnData,
    };

    // Increase usable stock only for accepted return quantities
    setData((prev) => {
      const updatedMaterials = [...prev.rawMaterials];
      (newReturn.items || []).forEach((item) => {
        const accepted = Number(item.acceptedQty || 0);
        if (accepted > 0) {
          const idx = updatedMaterials.findIndex((m) => m.code === item.materialCode);
          if (idx !== -1) {
            updatedMaterials[idx] = {
              ...updatedMaterials[idx],
              currentStock: updatedMaterials[idx].currentStock + accepted,
              status: updatedMaterials[idx].currentStock + accepted <= updatedMaterials[idx].reorderLevel ? "Low Stock" : "Adequate",
            };

            addStockMovement({
              type: "MATERIAL_RETURN",
              itemType: "Raw Material",
              itemCode: item.materialCode,
              itemName: item.name,
              quantity: accepted,
              unit: item.unit || "PCS",
              referenceDoc: newReturn.returnNumber,
              warehouse: updatedMaterials[idx].storageLocation,
              notes: `Unused material returned from floor for ${newReturn.workOrderNumber}`,
            });
          }
        }
      });

      addActivity("MATERIAL_RETURN_POSTED", newReturn.returnNumber, `Restocked unused materials from ${newReturn.workOrderNumber}`);
      return {
        ...prev,
        materialReturns: [newReturn, ...(prev.materialReturns || [])],
        rawMaterials: updatedMaterials,
      };
    });

    showToast("Material return restocked to store inventory.");
  };

  // Derived KPI metrics
  const kpis = useMemo(() => {
    const workOrders = data.workOrders || [];
    const rawMaterials = data.rawMaterials || [];
    const products = data.products || [];
    const qc = data.qualityInspections || [];
    const salesOrders = data.salesOrders || [];

    const totalWOs = workOrders.length;
    const inProgressWOs = workOrders.filter((w) => w.status === "In Progress" || w.status === "Released").length;
    const plannedQtyTotal = workOrders.reduce((sum, w) => sum + (Number(w.plannedQuantity) || 0), 0);
    const actualQtyTotal = workOrders.reduce((sum, w) => sum + (Number(w.completedQuantity) || 0), 0);
    const achievementPercent = plannedQtyTotal > 0 ? ((actualQtyTotal / plannedQtyTotal) * 100).toFixed(1) : 0;

    const rawMaterialStockValue = rawMaterials.reduce((sum, m) => sum + (Number(m.currentStock) || 0) * (Number(m.unitCost) || 0), 0);
    const finishedGoodsStockValue = products.reduce((sum, p) => sum + (Number(p.currentStock) || 0) * (Number(p.standardCost) || 0), 0);

    const materialShortages = rawMaterials.filter((m) => (Number(m.currentStock) || 0) <= (Number(m.reorderLevel) || 0));

    const totalInspected = qc.reduce((sum, q) => sum + (Number(q.totalQty) || 0), 0);
    const totalRejected = qc.reduce((sum, q) => sum + (Number(q.rejectedQty) || 0), 0);
    const rejectionRate = totalInspected > 0 ? ((totalRejected / totalInspected) * 100).toFixed(1) : 1.8;

    const pendingQC = qc.filter((q) => q.status === "Pending" || q.status === "In Progress").length;
    const pendingDispatches = salesOrders.filter((s) => s.dispatchStatus !== "Dispatched").length;

    const totalProdCost = workOrders.reduce((sum, w) => sum + (Number(w.actualCost) || 0), 0);
    const avgCostPerUnit = actualQtyTotal > 0 ? Math.round(totalProdCost / actualQtyTotal) : 0;

    return {
      totalWOs,
      inProgressWOs,
      plannedQtyTotal,
      actualQtyTotal,
      achievementPercent,
      rawMaterialStockValue,
      finishedGoodsStockValue,
      materialShortagesCount: materialShortages.length,
      materialShortages,
      rejectionRate,
      pendingQC,
      pendingDispatches,
      totalProdCost,
      avgCostPerUnit,
    };
  }, [data]);

  // Derived in-app notifications
  const notifications = useMemo(() => {
    const list = [];
    (data.rawMaterials || []).forEach((m) => {
      if (m.currentStock <= m.reorderLevel) {
        list.push({
          id: `NOTIF-MAT-${m.id}`,
          title: `Low Material Alert: ${m.name}`,
          description: `Stock at ${m.currentStock} ${m.unit} is below reorder threshold of ${m.reorderLevel} ${m.unit}.`,
          severity: "high",
          category: "Inventory",
          targetView: "materials",
          date: "Active",
        });
      }
    });

    (data.workOrders || []).forEach((w) => {
      if (w.status === "Quality Inspection") {
        list.push({
          id: `NOTIF-WO-${w.id}`,
          title: `Pending Final QC: ${w.workOrderNumber}`,
          description: `Work order for ${w.productName} completed manufacturing and is waiting for QA clearance.`,
          severity: "medium",
          category: "Production",
          targetView: "quality",
          date: "Action Required",
        });
      }
    });

    (data.maintenanceTickets || []).forEach((m) => {
      if (m.status === "Scheduled") {
        list.push({
          id: `NOTIF-MNT-${m.id}`,
          title: `Preventive Maintenance: ${m.machineName}`,
          description: m.problemDescription,
          severity: "normal",
          category: "Maintenance",
          targetView: "maintenance",
          date: m.plannedDate,
        });
      }
    });

    return list;
  }, [data.rawMaterials, data.workOrders, data.maintenanceTickets]);

  const value = {
    data,
    setData,
    activeView,
    setActiveView,
    isLandingView,
    setIsLandingView,
    isMounted,
    activePrintDoc,
    setActivePrintDoc,
    searchOpen,
    setSearchOpen,
    toastMessage,
    showToast,
    kpis,
    notifications,
    activeScenario,
    setActiveScenario,
    startGuidedScenario,
    roleGuideModalOpen,
    setRoleGuideModalOpen,
    roleFilterMode,
    setRoleFilterMode,
    canAccessModule,
    canPerformAction,
    setCurrentUserRole,
    // Auth
    isAuthenticated,
    currentUser,
    login,
    logout,
    switchDemoUser,
    MANUFACTURING_DEMO_USERS,
    resetDemoData,
    addProduct,
    updateProduct,
    toggleProductStatus,
    addRawMaterial,
    updateRawMaterial,
    adjustStock,
    addBOM,
    updateBOM,
    addSupplier,
    addCustomer,
    createWorkOrder,
    reserveMaterialForWO,
    issueMaterialForWO,
    addProductionLog,
    updateWorkOrderStatus,
    addQualityInspection,
    createPurchaseOrder,
    postGoodsReceipt,
    postSupplierReturn,
    createSalesOrder,
    postDispatch,
    addScrapRecord,
    addMaintenanceTicket,
    updateMaintenanceStatus,
    addExpense,
    updateJobCardStatus,
    postMaterialReturn,
    addStockMovement,
    addActivity,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
      {/* Toast Notification Container */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-900 text-white shadow-xl border border-slate-700 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div
            className={`w-2 h-2 rounded-full shrink-0 ${
              toastMessage.type === "error" ? "bg-rose-500" : toastMessage.type === "warning" ? "bg-amber-400" : "bg-emerald-400"
            }`}
          />
          <p className="text-sm font-medium pr-2">{toastMessage.message}</p>
        </div>
      )}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
