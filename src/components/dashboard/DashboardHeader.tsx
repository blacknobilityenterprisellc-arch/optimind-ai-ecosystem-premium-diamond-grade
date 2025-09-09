/**
 * Premium Diamond Grade Dashboard Header Component
 *
 * Enterprise-grade header with real-time status indicators
 * and premium branding elements.
 *
 * @author: Enterprise Architecture Team
 * @version: 1.0.0
 * @compliance: SOC2, GDPR, ISO27001
 */

'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';

interface DashboardHeaderProps {
  isConnected: boolean;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ isConnected }) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Gem className="h-8 w-8 text-purple-600" />
          OptiMind AI Ecosystem
        </h1>
        <p className="text-muted-foreground mt-1">Premium Diamond Grade AI Services Platform</p>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="text-purple-600 border-purple-600">
          <Crown className="h-3 w-3 mr-1" />
          Premium Diamond
        </Badge>
        <Badge variant={isConnected ? 'default' : 'secondary'}>
          {isConnected ? <Wifi className="h-3 w-3 mr-1" /> : <WifiOff className="h-3 w-3 mr-1" />}
          {isConnected ? 'Real-time' : 'Offline'}
        </Badge>
      </div>
    </div>
  );
};

export default DashboardHeader;
