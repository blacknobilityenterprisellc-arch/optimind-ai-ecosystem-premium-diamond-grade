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

interface OrchestratorStatus {
  isInitialized: boolean;
  activeOperations: number;
  completedOperations: number;
  config: any;
}

interface SystemHealthStatus {
  overall: string;
  components: any;
  metrics: any;
  insights: string[];
  recommendations: string[];
  lastChecked: Date;
}

interface OrchestratedResult {
  operationId: string;
  success: boolean;
  result?: any;
  insights?: string[];
  recommendations?: string[];
  confidence: number;
  processingTime: number;
  orchestratedBy: string;
  timestamp: Date;
}

export default function GLMOrchestratorDemo() {
  const [status, setStatus] = useState<OrchestratorStatus | null>(null);
  const [health, setHealth] = useState<SystemHealthStatus | null>(null);
  const [results, setResults] = useState<OrchestratedResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = async () => {
    try {
      const response = await fetch("/api/glm-orchestrator?action=status");
      const data = await response.json();
      if (data.success) {
        setStatus(data.data);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Failed to fetch orchestrator status");
    }
  };

  const fetchHealth = async () => {
    try {
      const response = await fetch("/api/glm-orchestrator?action=health");
      const data = await response.json();
      if (data.success) {
        setHealth(data.data);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Failed to fetch health status");
    }
  };

  const runAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "/api/glm-orchestrator?action=test-analysis",
      );
      const data = await response.json();
      if (data.success) {
        setResults((prev) => [...prev, data.data]);
        await fetchStatus();
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Failed to run analysis");
    } finally {
      setLoading(false);
    }
  };

  const runOptimization = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "/api/glm-orchestrator?action=test-optimization",
      );
      const data = await response.json();
      if (data.success) {
        setResults((prev) => [...prev, data.data]);
        await fetchStatus();
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Failed to run optimization");
    } finally {
      setLoading(false);
    }
  };

  const runPrediction = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "/api/glm-orchestrator?action=test-prediction",
      );
      const data = await response.json();
      if (data.success) {
        setResults((prev) => [...prev, data.data]);
        await fetchStatus();
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Failed to run prediction");
    } finally {
      setLoading(false);
    }
  };

  const runComprehensiveTest = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/glm-orchestrator", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "comprehensive-test",
        }),
      });
      const data = await response.json();
      if (data.success) {
        setResults((prev) => [...prev, ...data.data.orchestratedOperations]);
        await fetchStatus();
        await fetchHealth();
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Failed to run comprehensive test");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    fetchHealth();
  }, []);

  const getHealthColor = (status: string) => {
    switch (status) {
      case "excellent":
      case "healthy":
        return "bg-green-500";
      case "good":
      case "degraded":
        return "bg-yellow-500";
      case "fair":
        return "bg-orange-500";
      case "poor":
      case "unhealthy":
        return "bg-red-500";
      case "critical":
        return "bg-red-700";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold">GLM-4.5 Orchestrator Demo</h1>
        <p className="text-xl text-muted-foreground">
          Demonstrating GLM SDK as the Primary Orchestrator for OptiMind AI
          Ecosystem
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
          <TabsTrigger value="health">System Health</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Status</CardTitle>
                <div
                  className={`h-3 w-3 rounded-full ${status?.isInitialized ? "bg-green-500" : "bg-red-500"}`}
                />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {status?.isInitialized ? "Initialized" : "Not Initialized"}
                </div>
                <p className="text-xs text-muted-foreground">
                  GLM-4.5 Orchestrator
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Operations
                </CardTitle>
                <div className="h-3 w-3 rounded-full bg-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {status?.activeOperations || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Currently running
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Completed Operations
                </CardTitle>
                <div className="h-3 w-3 rounded-full bg-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {status?.completedOperations || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Successfully completed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  System Health
                </CardTitle>
                <div
                  className={`h-3 w-3 rounded-full ${health ? getHealthColor(health.overall) : "bg-gray-500"}`}
                />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold capitalize">
                  {health?.overall || "Unknown"}
                </div>
                <p className="text-xs text-muted-foreground">
                  Overall system status
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>GLM-4.5 Orchestrator Controls</CardTitle>
              <CardDescription>
                Execute orchestrated operations using GLM-4.5 as the primary
                orchestrator
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Button onClick={runAnalysis} disabled={loading}>
                  {loading ? "Running..." : "Run Analysis"}
                </Button>
                <Button
                  onClick={runOptimization}
                  disabled={loading}
                  variant="outline"
                >
                  {loading ? "Running..." : "Run Optimization"}
                </Button>
                <Button
                  onClick={runPrediction}
                  disabled={loading}
                  variant="outline"
                >
                  {loading ? "Running..." : "Run Prediction"}
                </Button>
                <Button
                  onClick={runComprehensiveTest}
                  disabled={loading}
                  variant="default"
                >
                  {loading ? "Running..." : "Comprehensive Test"}
                </Button>
                <Button
                  onClick={fetchHealth}
                  disabled={loading}
                  variant="outline"
                >
                  Refresh Health
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="health" className="space-y-4">
          {health ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>System Health Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Overall Status</span>
                    <Badge className={getHealthColor(health.overall)}>
                      {health.overall.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Component Status</h4>
                    {Object.entries(health.components).map(
                      ([component, status]) => (
                        <div
                          key={component}
                          className="flex items-center justify-between"
                        >
                          <span className="capitalize">
                            {component.replace(/([A-Z])/g, " $1").trim()}
                          </span>
                          <Badge className={getHealthColor(status as string)}>
                            {(status as string).toUpperCase()}
                          </Badge>
                        </div>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Response Time</span>
                    <span>{health.metrics.responseTime.toFixed(0)}ms</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Success Rate</span>
                    <span>
                      {(health.metrics.successRate * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Throughput</span>
                    <span>{health.metrics.throughput.toFixed(0)} req/s</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Error Rate</span>
                    <span>{(health.metrics.errorRate * 100).toFixed(1)}%</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Insights & Recommendations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Key Insights</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {health.insights.map((insight, index) => (
                        <li key={index} className="text-sm">
                          {insight}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Recommendations</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {health.recommendations.map((recommendation, index) => (
                        <li key={index} className="text-sm">
                          {recommendation}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-32">
                <p className="text-muted-foreground">
                  No health data available
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="operations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Orchestrated Operations</CardTitle>
              <CardDescription>
                Operations executed by the GLM-4.5 Orchestrator
              </CardDescription>
            </CardHeader>
            <CardContent>
              {results.length > 0 ? (
                <div className="space-y-4">
                  {results.map((result, index) => (
                    <Card key={result.operationId}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">
                            Operation #{index + 1}
                          </CardTitle>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                result.success ? "default" : "destructive"
                              }
                            >
                              {result.success ? "Success" : "Failed"}
                            </Badge>
                            <Badge variant="outline">
                              {result.orchestratedBy}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Confidence:</span>
                            <span className="ml-2">
                              {(result.confidence * 100).toFixed(1)}%
                            </span>
                          </div>
                          <div>
                            <span className="font-medium">
                              Processing Time:
                            </span>
                            <span className="ml-2">
                              {result.processingTime}ms
                            </span>
                          </div>
                          <div>
                            <span className="font-medium">Insights:</span>
                            <span className="ml-2">
                              {result.insights?.length || 0}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium">
                              Recommendations:
                            </span>
                            <span className="ml-2">
                              {result.recommendations?.length || 0}
                            </span>
                          </div>
                        </div>
                        {result.insights && result.insights.length > 0 && (
                          <div>
                            <h4 className="font-medium text-sm mb-1">
                              Insights:
                            </h4>
                            <ul className="list-disc list-inside text-sm space-y-1">
                              {result.insights.map((insight, idx) => (
                                <li key={idx}>{insight}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {result.recommendations &&
                          result.recommendations.length > 0 && (
                            <div>
                              <h4 className="font-medium text-sm mb-1">
                                Recommendations:
                              </h4>
                              <ul className="list-disc list-inside text-sm space-y-1">
                                {result.recommendations.map(
                                  (recommendation, idx) => (
                                    <li key={idx}>{recommendation}</li>
                                  ),
                                )}
                              </ul>
                            </div>
                          )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No operations executed yet
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Use the controls in the Overview tab to run orchestrated
                    operations
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Technical Results</CardTitle>
              <CardDescription>
                Raw JSON results from orchestrated operations
              </CardDescription>
            </CardHeader>
            <CardContent>
              {results.length > 0 ? (
                <div className="space-y-4">
                  {results.map((result, index) => (
                    <Card key={result.operationId}>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          Operation #{index + 1} - {result.operationId}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <pre className="bg-muted p-4 rounded-md overflow-auto text-sm max-h-96">
                          {JSON.stringify(result, null, 2)}
                        </pre>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No results available</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Execute operations to see technical results
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
