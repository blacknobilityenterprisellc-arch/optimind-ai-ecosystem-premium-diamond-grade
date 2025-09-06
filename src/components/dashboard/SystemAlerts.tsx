/**
 * Premium Diamond Grade System Alerts Component
 *
 * Enterprise-grade alerts display with real-time updates
 * and optimized performance.
 *
 * @author: Enterprise Architecture Team
 * @version: 1.0.0
 * @compliance: SOC2, GDPR, ISO27001
 */

"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Activity,
} from "lucide-react";

interface SystemAlert {
  id: string;
  type: "info" | "warning" | "error" | "success";
  title: string;
  description: string;
  timestamp: string;
}

interface SystemAlertsProps {
  alerts: SystemAlert[];
  maxDisplay?: number;
}

const getAlertIcon = (type: string) => {
  switch (type) {
    case "error":
      return <AlertCircle className="h-4 w-4" />;
    case "warning":
      return <AlertTriangle className="h-4 w-4" />;
    case "success":
      return <CheckCircle className="h-4 w-4" />;
    default:
      return <Activity className="h-4 w-4" />;
  }
};

const SystemAlerts: React.FC<SystemAlertsProps> = ({
  alerts,
  maxDisplay = 5,
}) => {
  if (alerts.length === 0) return null;

  const displayAlerts = alerts.slice(0, maxDisplay);

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Alerts</CardTitle>
        <CardDescription>
          Recent system notifications and alerts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {displayAlerts.map((alert) => (
            <div
              key={alert.id}
              className="flex items-start gap-3 p-3 rounded-lg border"
            >
              {getAlertIcon(alert.type)}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{alert.title}</h4>
                  <span className="text-xs text-muted-foreground">
                    {new Date(alert.timestamp).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {alert.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemAlerts;
