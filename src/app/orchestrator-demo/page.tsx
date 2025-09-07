/**
 * Agent Orchestrator Demo Page
 *
 * This page provides a web interface to demonstrate the enhanced
 * agent coordination system with real-time monitoring.
 */
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface OrchestratorStatus {
  orchestrator: {
    status: string;
    version: string;
    capabilities: string[];
    agents: string[];
    features: string[];
  };
}

interface DemoResponse {
  message: string;
  status: string;
  running?: boolean;
  error?: string;
}

export default function OrchestratorDemoPage() {
  const [status, setStatus] = useState<OrchestratorStatus | null>(null);
  const [demoRunning, setDemoRunning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const response = await fetch("/api/orchestrator/demo");
      const data = await response.json();
      setStatus(data);
    } catch (err) {
      setError("Failed to fetch orchestrator status");
    }
  };

  const startDemo = async () => {
    setLoading(true);
    setError(null);
    addLog("Starting orchestrator demo...");

    try {
      const response = await fetch("/api/orchestrator/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "start" }),
      });

      const result: DemoResponse = await response.json();

      if (response.ok) {
        setDemoRunning(true);
        addLog(`✅ ${result.message}`);

        // Start polling for status updates
        const interval = setInterval(() => {
          fetchStatus();
        }, 2000);

        // Stop polling after 30 seconds
        setTimeout(() => {
          clearInterval(interval);
        }, 30000);
      } else {
        setError(result.error || "Failed to start demo");
        addLog(`❌ ${result.error || "Failed to start demo"}`);
      }
    } catch (err) {
      setError("Failed to start demo");
      addLog("❌ Failed to start demo");
    } finally {
      setLoading(false);
    }
  };

  const stopDemo = async () => {
    setLoading(true);
    setError(null);
    addLog("Stopping orchestrator demo...");

    try {
      const response = await fetch("/api/orchestrator/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "stop" }),
      });

      const result: DemoResponse = await response.json();

      if (response.ok) {
        setDemoRunning(false);
        addLog(`✅ ${result.message}`);
      } else {
        setError(result.error || "Failed to stop demo");
        addLog(`❌ ${result.error || "Failed to stop demo"}`);
      }
    } catch (err) {
      setError("Failed to stop demo");
      addLog("❌ Failed to stop demo");
    } finally {
      setLoading(false);
    }
  };

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, `[${timestamp}] ${message}`]);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold">Agent Orchestrator Demo</h1>
        <p className="text-lg text-muted-foreground">
          Enhanced AI Agent Coordination System
        </p>
      </div>

      {/* Status Overview */}
      {status && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              System Status
              <Badge
                variant={
                  status.orchestrator.status === "running"
                    ? "default"
                    : "secondary"
                }
              >
                {status.orchestrator.status}
              </Badge>
            </CardTitle>
            <CardDescription>
              Version {status.orchestrator.version}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Capabilities</h3>
                <div className="flex flex-wrap gap-1">
                  {status.orchestrator.capabilities.map((cap, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {cap}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Available Agents</h3>
                <div className="flex flex-wrap gap-1">
                  {status.orchestrator.agents.map((agent, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {agent}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Features</h3>
                <div className="flex flex-wrap gap-1">
                  {status.orchestrator.features.map((feature, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Demo Controls</CardTitle>
          <CardDescription>
            Start and stop the orchestrator demonstration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-center">
            <Button
              onClick={startDemo}
              disabled={loading || demoRunning}
              className="flex items-center gap-2"
            >
              {loading ? "Starting..." : "Start Demo"}
            </Button>
            <Button
              onClick={stopDemo}
              disabled={loading || !demoRunning}
              variant="outline"
              className="flex items-center gap-2"
            >
              {loading ? "Stopping..." : "Stop Demo"}
            </Button>
            <Button
              onClick={clearLogs}
              variant="ghost"
              disabled={logs.length === 0}
            >
              Clear Logs
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Activity Log */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Log</CardTitle>
          <CardDescription>
            Real-time system activity and events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-4 rounded-md h-64 overflow-y-auto font-mono text-sm">
            {logs.length === 0 ? (
              <p className="text-muted-foreground">
                No activity yet. Start the demo to see logs.
              </p>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="mb-1">
                  {log}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
          <CardDescription>
            Technical details about the orchestrator system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-semibold mb-2">Architecture</h3>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Dynamic Load Balancer</li>
                <li>• Multi-Agent Coordination</li>
                <li>• Fault Tolerance System</li>
                <li>• Real-time Monitoring</li>
                <li>• Performance Optimization</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Key Features</h3>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Intelligent Task Distribution</li>
                <li>• Automatic Failover</li>
                <li>• Task Dependencies</li>
                <li>• Health Monitoring</li>
                <li>• Performance Metrics</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
