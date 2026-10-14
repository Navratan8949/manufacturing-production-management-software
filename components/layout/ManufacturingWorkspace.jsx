"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { AppHeader } from "@/components/layout/AppHeader";
import { ActiveScenarioBanner } from "@/components/layout/ActiveScenarioBanner";
import { RoleAccessRestricted } from "@/components/layout/RoleAccessRestricted";
import { RoleGuideModal } from "@/components/layout/RoleGuideModal";
import { GlobalSearchModal } from "@/components/layout/GlobalSearchModal";
import { NotificationDrawer } from "@/components/layout/NotificationDrawer";
import { DocumentPrintModal } from "@/components/print/DocumentPrintModal";
import ManufacturingLoginView from "@/components/auth/ManufacturingLoginView";

// Modules
import { DashboardModule } from "@/components/modules/DashboardModule";
import { ProductsModule } from "@/components/modules/ProductsModule";
import { MaterialsModule } from "@/components/modules/MaterialsModule";
import { BOMModule } from "@/components/modules/BOMModule";
import { WorkOrdersModule } from "@/components/modules/WorkOrdersModule";
import { MRPLiteModule } from "@/components/modules/MRPLiteModule";
import { ProductionFloorModule } from "@/components/modules/ProductionFloorModule";
import { ProcurementModule } from "@/components/modules/ProcurementModule";
import { DispatchModule } from "@/components/modules/DispatchModule";
import { QualityModule } from "@/components/modules/QualityModule";
import { WIPModule } from "@/components/modules/WIPModule";
import { InventoryLedgerModule } from "@/components/modules/InventoryLedgerModule";
import { CostingExpensesModule } from "@/components/modules/CostingExpensesModule";
import { MastersModule } from "@/components/modules/MastersModule";
import { MaterialIssueModule } from "@/components/modules/MaterialIssueModule";
import { ReportsSettingsModule } from "@/components/modules/ReportsSettingsModule";

export default function ManufacturingWorkspace() {
  const router = useRouter();
  const {
    activeView,
    canAccessModule,
    roleGuideModalOpen,
    setRoleGuideModalOpen,
    isAuthenticated,
  } = useApp();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // If user is not authenticated, render login view
  if (!isAuthenticated) {
    return (
      <ManufacturingLoginView
        onLoginSuccess={() => router.push("/dashboard")}
        onBackToLanding={() => router.push("/")}
      />
    );
  }

  const renderActiveModule = () => {
    // Role-based security gate: if current role is not authorized, show friendly access guard
    if (!canAccessModule(activeView)) {
      return <RoleAccessRestricted currentView={activeView} />;
    }

    switch (activeView) {
      case "dashboard":
        return <DashboardModule />;
      case "products":
        return <ProductsModule />;
      case "materials":
      case "inventory":
      case "stock-adjustments":
        return <MaterialsModule />;
      case "bom":
        return <BOMModule />;
      case "planning":
      case "work-orders":
        return <WorkOrdersModule />;
      case "mrp":
        return <MRPLiteModule />;
      case "production-floor":
        return <ProductionFloorModule initialTab="board" />;
      case "production-logs":
        return <ProductionFloorModule initialTab="production-logs" />;
      case "job-cards":
        return <ProductionFloorModule initialTab="job-cards" />;
      case "material-issue":
        return <MaterialIssueModule />;
      case "purchase-orders":
        return <ProcurementModule initialTab="pos" />;
      case "goods-receipts":
      case "supplier-returns":
        return <ProcurementModule initialTab="goods-receipts" />;
      case "sales-orders":
        return <DispatchModule initialTab="sales" />;
      case "dispatch":
        return <DispatchModule initialTab="dispatch" />;
      case "quality":
        return <QualityModule />;
      case "wip":
        return <WIPModule />;
      case "finished-goods":
        return <InventoryLedgerModule initialTab="finished" />;
      case "stock-movements":
        return <InventoryLedgerModule initialTab="movements" />;
      case "scrap":
        return <InventoryLedgerModule initialTab="scrap" />;
      case "costing":
        return <CostingExpensesModule initialTab="costing" />;
      case "expenses":
        return <CostingExpensesModule initialTab="expenses" />;
      case "suppliers":
        return <MastersModule initialTab="suppliers" />;
      case "customers":
        return <MastersModule initialTab="customers" />;
      case "machines":
        return <MastersModule initialTab="machines" />;
      case "employees":
        return <MastersModule initialTab="employees" />;
      case "maintenance":
        return <MastersModule initialTab="maintenance" />;
      case "reports":
        return <ReportsSettingsModule initialTab="reports" />;
      case "settings":
        return <ReportsSettingsModule initialTab="settings" />;
      default:
        return <DashboardModule />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex">
      {/* Grouped Sidebar */}
      <AppSidebar mobileOpen={mobileSidebarOpen} setMobileOpen={setMobileSidebarOpen} />

      {/* Mobile Backdrop */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-slate-950/50 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-72 flex flex-col min-h-screen">
        <AppHeader
          onToggleMobile={() => setMobileSidebarOpen((prev) => !prev)}
          onOpenNotifications={() => setNotificationsOpen(true)}
        />

        {/* Guided Walkthrough Banner (visible when a scenario is active) */}
        <ActiveScenarioBanner />

        {/* Full-width responsive workspace container with clean padding (No dead space) */}
        <main className="flex-1 p-3 sm:p-5 lg:p-6 w-full overflow-x-hidden">
          {renderActiveModule()}
        </main>
      </div>

      {/* Modals & Drawers */}
      <GlobalSearchModal />
      <NotificationDrawer isOpen={notificationsOpen} onClose={() => setNotificationsOpen(false)} />
      <DocumentPrintModal />
      <RoleGuideModal
        isOpen={roleGuideModalOpen}
        onClose={() => setRoleGuideModalOpen(false)}
      />
    </div>
  );
}
