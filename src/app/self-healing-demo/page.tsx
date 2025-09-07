"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

interface HealingReport {
  healingId: string;
  timestamp: string;
  initialIssues: number;
  issuesDetected: number;
  issuesFixed: number;
  issuesRemaining: number;
  scanScore: number;
  scanGrade: string;
  healingTime: number;
  success: boolean;
  summary: string;
}

interface SystemStatus {
  selfHealing: {
    isInitialized: boolean;
    config: any;
  };
  scanner: any;
  errorHandler: any;
  healingHistory: {
    total: number;
    successful: number;
    averageScore: number;
  };
}

export default function SelfHealingDemo() {
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [healingHistory, setHealingHistory] = useState<HealingReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = async () => {
    try {
      const response = await fetch("/api/self-healing?action=status");
      const data = await response.json();
      if (data.success) {
        setSystemStatus(data.data);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Failed to fetch system status");
    }
  };

  const fetchHistory = async () => {
    try {
      const response = await fetch("/api/self-healing?action=history");
      const data = await response.json();
      if (data.success) {
        setHealingHistory(data.data.healingReports);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Failed to fetch healing history");
    }
  };

  const triggerHealing = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/self-healing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "trigger-healing",
        }),
      });
      const data = await response.json();
      if (data.success) {
        await fetchStatus();
        await fetchHistory();
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Failed to trigger healing");
    } finally {
      setLoading(false);
    }
  };

  const handleSystemError = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/self-healing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "handle-error",
          error: {
            message: "Simulated critical system error",
            context: {
              component: "system-core",
              operation: "critical-process",
              severity: "critical",
            },
          },
        }),
      });
      const data = await response.json();
      if (data.success) {
        await fetchStatus();
        await fetchHistory();
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Failed to handle system error");
    } finally {
      setLoading(false);
    }
  };

  const monitorHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/self-healing?action=monitor-health");
      const data = await response.json();
      if (data.success) {
        await fetchStatus();
        await fetchHistory();
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Failed to monitor health");
    } finally {
      setLoading(false);
    }
  };

  const runComprehensiveHealing = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/self-healing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "comprehensive-healing",
        }),
      });
      const data = await response.json();
      if (data.success) {
        await fetchStatus();
        await fetchHistory();
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Failed to run comprehensive healing");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    fetchHistory();

    // Set up periodic status updates
    const interval = setInterval(() => {
      fetchStatus();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A+":
        return "bg-green-500 text-white";
      case "A":
        return "bg-green-400 text-white";
      case "B":
        return "bg-blue-400 text-white";
      case "C":
        return "bg-yellow-400 text-white";
      case "D":
        return "bg-orange-400 text-white";
      case "F":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-400 text-white";
    }
  };

  const getStatusColor = (success: boolean) => {
    return success ? "bg-green-500" : "bg-red-500";
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold">OptiMind AI Self-Healing System</h1>
        <p className="text-xl text-muted-foreground">
          Advanced Automatic Error Detection, Analysis, and Resolution
        </p>
      </div>

      {error && (
        <Alert>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="system">System Status</TabsTrigger>
          <TabsTrigger value="healing">Healing History</TabsTrigger>
          <TabsTrigger value="details">Detailed Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  System Status
                </CardTitle>
                <div
                  className={`h-3 w-3 rounded-full ${systemStatus?.selfHealing.isInitialized ? "bg-green-500" : "bg-red-500"}`}
                />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {systemStatus?.selfHealing.isInitialized
                    ? "Active"
                    : "Inactive"}
                </div>
                <p className="text-xs text-muted-foreground">
                  Self-Healing System
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Healings
                </CardTitle>
                <div className="h-3 w-3 rounded-full bg-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {systemStatus?.healingHistory.total || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Healing cycles completed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Success Rate
                </CardTitle>
                <div className="h-3 w-3 rounded-full bg-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {systemStatus?.healingHistory.total
                    ? Math.round(
                        (systemStatus.healingHistory.successful /
                          systemStatus.healingHistory.total) *
                          100,
                      )
                    : 0}
                  %
                </div>
                <p className="text-xs text-muted-foreground">
                  Healing success rate
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Score</CardTitle>
                <div
                  className={`h-3 w-3 rounded-full ${systemStatus?.healingHistory.averageScore && systemStatus.healingHistory.averageScore > 80 ? "bg-green-500" : systemStatus?.healingHistory.averageScore && systemStatus.healingHistory.averageScore > 60 ? "bg-yellow-500" : "bg-red-500"}`}
                />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {systemStatus?.healingHistory.averageScore
                    ? Math.round(systemStatus.healingHistory.averageScore)
                    : 0}
                  /100
                </div>
                <p className="text-xs text-muted-foreground">
                  Average healing score
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Self-Healing Controls</CardTitle>
              <CardDescription>
                Execute self-healing operations and system monitoring
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Button onClick={triggerHealing} disabled={loading}>
                  {loading ? "Running..." : "Trigger Healing"}
                </Button>
                <Button
                  onClick={handleSystemError}
                  disabled={loading}
                  variant="destructive"
                >
                  {loading ? "Running..." : "Simulate Error"}
                </Button>
                <Button
                  onClick={monitorHealth}
                  disabled={loading}
                  variant="outline"
                >
                  {loading ? "Running..." : "Monitor Health"}
                </Button>
                <Button
                  onClick={runComprehensiveHealing}
                  disabled={loading}
                  variant="default"
                >
                  {loading ? "Running..." : "Comprehensive Healing"}
                </Button>
                <Button
                  onClick={fetchStatus}
                  disabled={loading}
                  variant="outline"
                >
                  Refresh Status
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How Self-Healing Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-2xl">🚨</span>
                  </div>
                  <h4 className="font-medium">1. Error Detection</h4>
                  <p className="text-sm text-muted-foreground">
                    Global error handler detects system issues automatically
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-2xl">🔬</span>
                  </div>
                  <h4 className="font-medium">2. Premium Scanning</h4>
                  <p className="text-sm text-muted-foreground">
                    Diamond-Grade scanner analyzes issues thoroughly
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-2xl">🔧</span>
                  </div>
                  <h4 className="font-medium">3. Auto-Fix & Grade</h4>
                  <p className="text-sm text-muted-foreground">
                    Applies fixes and provides performance grade
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          {systemStatus ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Self-Healing Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Auto Detection</span>
                    <Badge
                      variant={
                        systemStatus.selfHealing.config.enableAutoDetection
                          ? "default"
                          : "secondary"
                      }
                    >
                      {systemStatus.selfHealing.config.enableAutoDetection
                        ? "Enabled"
                        : "Disabled"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Auto Fix</span>
                    <Badge
                      variant={
                        systemStatus.selfHealing.config.enableAutoFix
                          ? "default"
                          : "secondary"
                      }
                    >
                      {systemStatus.selfHealing.config.enableAutoFix
                        ? "Enabled"
                        : "Disabled"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Real-time Monitoring</span>
                    <Badge
                      variant={
                        systemStatus.selfHealing.config.enableRealTimeMonitoring
                          ? "default"
                          : "secondary"
                      }
                    >
                      {systemStatus.selfHealing.config.enableRealTimeMonitoring
                        ? "Enabled"
                        : "Disabled"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Notifications</span>
                    <Badge
                      variant={
                        systemStatus.selfHealing.config.notificationEnabled
                          ? "default"
                          : "secondary"
                      }
                    >
                      {systemStatus.selfHealing.config.notificationEnabled
                        ? "Enabled"
                        : "Disabled"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Scan Interval</span>
                    <span>
                      {systemStatus.selfHealing.config.scanInterval / 1000}s
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Error Threshold</span>
                    <span>
                      {systemStatus.selfHealing.config.errorThreshold}%
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Scanner Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Active Scans</span>
                    <span>{systemStatus.scanner.activeScans || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Scan History</span>
                    <span>{systemStatus.scanner.scanHistory || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Scanner Status</span>
                    <Badge variant="outline">
                      {systemStatus.scanner.scannerStatus || "idle"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Error Handler Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Monitoring Status</span>
                    <Badge
                      variant={
                        systemStatus.errorHandler.isMonitoring
                          ? "default"
                          : "secondary"
                      }
                    >
                      {systemStatus.errorHandler.isMonitoring
                        ? "Active"
                        : "Inactive"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Error Threshold</span>
                    <span>{systemStatus.errorHandler.errorThreshold}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Scanner Status</span>
                    <Badge variant="outline">
                      {systemStatus.errorHandler.scannerStatus || "idle"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-32">
                <p className="text-muted-foreground">
                  No system status available
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="healing" className="space-y-4">
          {healingHistory.length > 0 ? (
            <div className="space-y-4">
              {healingHistory.map((healing) => (
                <Card key={healing.healingId}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        Healing Cycle: {healing.healingId}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(healing.success)}>
                          {healing.success ? "SUCCESS" : "FAILED"}
                        </Badge>
                        <Badge className={getGradeColor(healing.scanGrade)}>
                          {healing.scanGrade}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Score:</span>
                        <span className="ml-2">{healing.scanScore}/100</span>
                      </div>
                      <div>
                        <span className="font-medium">Duration:</span>
                        <span className="ml-2">
                          {(healing.healingTime / 1000).toFixed(1)}s
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Issues Fixed:</span>
                        <span className="ml-2">
                          {healing.issuesFixed}/{healing.issuesDetected}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Remaining:</span>
                        <span className="ml-2">{healing.issuesRemaining}</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Progress Overview</h4>
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Issues Detected</span>
                            <span>{healing.issuesDetected}</span>
                          </div>
                          <Progress value={100} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Issues Fixed</span>
                            <span>
                              {healing.issuesFixed} (
                              {healing.issuesDetected > 0
                                ? Math.round(
                                    (healing.issuesFixed /
                                      healing.issuesDetected) *
                                      100,
                                  )
                                : 0}
                              %)
                            </span>
                          </div>
                          <Progress
                            value={
                              healing.issuesDetected > 0
                                ? (healing.issuesFixed /
                                    healing.issuesDetected) *
                                  100
                                : 0
                            }
                            className="h-2"
                          />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>System Health</span>
                            <span>{healing.scanScore}%</span>
                          </div>
                          <Progress value={healing.scanScore} className="h-2" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Summary</h4>
                      <p className="text-sm">{healing.summary}</p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Timestamp</h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(healing.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-32">
                <p className="text-muted-foreground">
                  No healing history available
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          {healingHistory.length > 0 ? (
            <div className="space-y-4">
              {healingHistory.map((healing) => (
                <Card key={healing.healingId}>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Detailed Report - {healing.healingId}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Healing Metrics</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Initial Issues:</span>
                              <span>{healing.initialIssues}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Issues Detected:</span>
                              <span>{healing.issuesDetected}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Issues Fixed:</span>
                              <span className="text-green-600">
                                {healing.issuesFixed}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Issues Remaining:</span>
                              <span
                                className={
                                  healing.issuesRemaining > 0
                                    ? "text-red-600"
                                    : "text-green-600"
                                }
                              >
                                {healing.issuesRemaining}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Success Rate:</span>
                              <span>
                                {healing.issuesDetected > 0
                                  ? Math.round(
                                      (healing.issuesFixed /
                                        healing.issuesDetected) *
                                        100,
                                    )
                                  : 100}
                                %
                              </span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">
                            Performance Metrics
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Scan Score:</span>
                              <span
                                className={
                                  healing.scanScore > 80
                                    ? "text-green-600"
                                    : healing.scanScore > 60
                                      ? "text-yellow-600"
                                      : "text-red-600"
                                }
                              >
                                {healing.scanScore}/100
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Scan Grade:</span>
                              <span
                                className={`px-2 py-1 rounded ${getGradeColor(healing.scanGrade)}`}
                              >
                                {healing.scanGrade}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Healing Time:</span>
                              <span>
                                {(healing.healingTime / 1000).toFixed(1)}{" "}
                                seconds
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Overall Success:</span>
                              <span
                                className={
                                  healing.success
                                    ? "text-green-600"
                                    : "text-red-600"
                                }
                              >
                                {healing.success ? "Successful" : "Failed"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Healing Summary</h4>
                        <p className="text-sm">{healing.summary}</p>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Technical Details</h4>
                        <details className="text-sm">
                          <summary className="cursor-pointer text-blue-600">
                            View Raw Healing Data
                          </summary>
                          <pre className="mt-2 p-4 bg-muted rounded text-xs overflow-auto max-h-96">
                            {JSON.stringify(healing, null, 2)}
                          </pre>
                        </details>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-32">
                <p className="text-muted-foreground">
                  No detailed reports available
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
