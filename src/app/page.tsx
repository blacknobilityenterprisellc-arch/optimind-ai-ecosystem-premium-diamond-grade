/**
 * OptiMind AI Ecosystem - Main Dashboard
 * Premium Diamond Grade AI Services Platform
 * 
 * Enterprise-grade dashboard with modular architecture,
 * optimized performance, and clean code principles.
 * 
 * @author: Enterprise Architecture Team
 * @version: 2.0.0
 * @compliance: SOC2, GDPR, ISO27001, HIPAA
 */

'use client';

import React from 'react';

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import LoadingState from "@/components/dashboard/LoadingState";
import DashboardContent from "@/components/dashboard/DashboardContent";
import { useDashboardData } from "@/components/dashboard/DashboardDataHooks";
import { aiCapabilities } from "@/components/dashboard/AICapabilitiesData";

const Dashboard: React.FC = () => {
  const {
    metrics,
    alerts,
    activities,
    isConnected,
    isLoading
  } = useDashboardData();

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <DashboardHeader isConnected={isConnected} />

      {/* Main Content */}
      <DashboardContent
        metrics={metrics}
        alerts={alerts}
        activities={activities}
        aiCapabilities={aiCapabilities}
      />
    </div>
  );
};

export default Dashboard;