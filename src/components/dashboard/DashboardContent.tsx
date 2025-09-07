/**
 * Premium Diamond Grade Dashboard Content Component
 *
 * Enterprise-grade main content area with optimized performance
 * and clean architecture.
 *
 * @author: Enterprise Architecture Team
 * @version: 1.0.0
 * @compliance: SOC2, GDPR, ISO27001
 */

'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AnalyticsChart from '@/components/AnalyticsChart';
import AICapabilitiesGrid from '@/components/dashboard/AICapabilitiesGrid';
import SystemAlerts from '@/components/dashboard/SystemAlerts';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import { AICapability } from './DashboardDataHooks';

interface DashboardContentProps {
  metrics: any;
  alerts: any[];
  activities: any[];
  aiCapabilities: AICapability[];
}

const DashboardContent: React.FC<DashboardContentProps> = ({
  metrics,
  alerts,
  activities,
  aiCapabilities,
}) => {
  return (
    <>
      {/* Key Metrics */}
      <AICapabilitiesGrid capabilities={aiCapabilities} />

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="capabilities">AI Capabilities</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* AI Capabilities Grid */}
          <AICapabilitiesGrid capabilities={aiCapabilities} />

          {/* Recent Alerts */}
          <SystemAlerts alerts={alerts} />
        </TabsContent>

        <TabsContent value="capabilities" className="space-y-4">
          <AICapabilitiesGrid capabilities={aiCapabilities} compact={true} />
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <ActivityFeed activities={activities} />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <AnalyticsChart />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default DashboardContent;
