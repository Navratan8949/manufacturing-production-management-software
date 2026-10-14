"use client";

import React from "react";
import { useRouter } from "next/navigation";
import ManufacturingLoginView from "@/components/auth/ManufacturingLoginView";

export default function LoginPage() {
  const router = useRouter();

  const handleLoginSuccess = () => {
    router.push("/dashboard");
  };

  const handleBackToLanding = () => {
    router.push("/");
  };

  return (
    <ManufacturingLoginView
      onLoginSuccess={handleLoginSuccess}
      onBackToLanding={handleBackToLanding}
    />
  );
}
