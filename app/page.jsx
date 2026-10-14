"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { LandingPage } from "@/components/landing/LandingPage";
import ManufacturingWorkspace from "@/components/layout/ManufacturingWorkspace";

export default function Page() {
  const { isLandingView, isMounted } = useApp();

  if (!isMounted || isLandingView) {
    return <LandingPage />;
  }

  return <ManufacturingWorkspace />;
}
