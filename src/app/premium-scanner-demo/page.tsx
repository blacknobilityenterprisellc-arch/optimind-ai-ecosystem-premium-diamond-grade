'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

interface ScanResult {
  scanId: string;
  initiatedBy: 'automatic' | 'manual' | 'error-triggered';
  startTime: string;
  endTime?: string;
  status: 'running' | 'completed' | 'failed';
  checkpoints: ScanCheckpoint[];
  issues: ScanIssue[];
  fixesApplied: number;
  score: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  summary: {
    totalChecks: number;
    passedChecks: number;
    failedChecks: number;
    fixedIssues: number;
    remainingIssues: number;
  };
  recommendations: string[];
}

interface ScanCheckpoint {
  id: string;
  name: string;
  category: 'performance' | 'security' | 'functionality' | 'data' | 'integration';
  status: 'pending' | 'running' | 'passed' | 'failed' | 'fixed';
  priority: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  result?: any;
  error?: string;
  fixApplied?: boolean;
  timestamp: string;
}

interface ScanIssue {
  id: string;
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  component: string;
  description: string;
  detectedAt: string;
  rootCause?: string;
  suggestedFix?: string;
  autoFixable: boolean;
  fixApplied?: boolean;
  fixTimestamp?: string;
}

interface ScannerStatus {
  activeScans: number;
  scanHistory: number;
  latestScan: ScanResult | null;
  activeScanDetails: ScanResult[];
}

export default function PremiumScannerDemo() {
  const [status, setStatus] = useState<ScannerStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scanHistory, setScanHistory] = useState<ScanResult[]>([]);

  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/premium-scanner?action=status');
      const data = await response.json();
      if (data.success) {
        setStatus(data.data);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to fetch scanner status');
    }
  };

  const fetchHistory = async () => {
    try {
      const response = await fetch('/api/premium-scanner?action=history');
      const data = await response.json();
      if (data.success) {
        setScanHistory(data.data.scans);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to fetch scan history');
    }
  };

  const triggerScan = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/premium-scanner?action=trigger-scan');
      const data = await response.json();
      if (data.success) {
        await fetchStatus();
        await fetchHistory();
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to trigger scan');
    } finally {
      setLoading(false);
    }
  };

  const runComprehensiveScan = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/premium-scanner', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'comprehensive-scan'
        })
      });
      const data = await response.json();
      if (data.success) {
        await fetchStatus();
        await fetchHistory();
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to run comprehensive scan');
    } finally {
      setLoading(false);
    }
  };

  const reportIssue = async () => {
    setLoading(true);
    setError(null);
    try {
      const mockIssue = {
        type: 'performance-degradation',
        severity: 'high',
        component: 'system',
        description: 'System performance degradation detected',
        detectedAt: new Date().toISOString(),
        autoFixable: true,
        fixApplied: false
      };

      const response = await fetch('/api/premium-scanner', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'report-issue',
          issue: mockIssue
        })
      });
      const data = await response.json();
      if (data.success) {
        await fetchStatus();
        await fetchHistory();
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to report issue');
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
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+': return 'bg-green-500 text-white';
      case 'A': return 'bg-green-400 text-white';
      case 'B': return 'bg-blue-400 text-white';
      case 'C': return 'bg-yellow-400 text-white';
      case 'D': return 'bg-orange-400 text-white';
      case 'F': return 'bg-red-500 text-white';
      default: return 'bg-gray-400 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'running': return 'bg-blue-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getCheckpointStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return 'bg-green-500';
      case 'failed': return 'bg-red-500';
      case 'running': return 'bg-blue-500';
      case 'fixed': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-600 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold">OptiMind AI Premium Diamond-Grade Scanner</h1>
        <p className="text-xl text-muted-foreground">
          Advanced Self-Healing System with Automatic Issue Detection and Resolution
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
          <TabsTrigger value="scanner">Scanner Status</TabsTrigger>
          <TabsTrigger value="history">Scan History</TabsTrigger>
          <TabsTrigger value="results">Detailed Results</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Scans</CardTitle>
                <div className="h-3 w-3 rounded-full bg-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{status?.activeScans || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Currently running
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Scan History</CardTitle>
                <div className="h-3 w-3 rounded-full bg-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{status?.scanHistory || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Total scans completed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Latest Grade</CardTitle>
                <div className={`h-3 w-3 rounded-full ${status?.latestScan ? getGradeColor(status.latestScan.grade) : 'bg-gray-500'}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${status?.latestScan ? getGradeColor(status.latestScan.grade) : 'text-gray-500'}`}>
                  {status?.latestScan?.grade || 'N/A'}
                </div>
                <p className="text-xs text-muted-foreground">
                  Latest scan grade
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">System Health</CardTitle>
                <div className={`h-3 w-3 rounded-full ${status?.latestScan?.score && status.latestScan.score > 80 ? 'bg-green-500' : status?.latestScan?.score && status.latestScan.score > 60 ? 'bg-yellow-500' : 'bg-red-500'}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{status?.latestScan?.score || 0}/100</div>
                <p className="text-xs text-muted-foreground">
                  Health score
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Premium Scanner Controls</CardTitle>
              <CardDescription>
                Execute advanced scanning and self-healing operations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Button onClick={triggerScan} disabled={loading}>
                  {loading ? 'Running...' : 'Trigger Scan'}
                </Button>
                <Button onClick={runComprehensiveScan} disabled={loading} variant="default">
                  {loading ? 'Running...' : 'Comprehensive Scan'}
                </Button>
                <Button onClick={reportIssue} disabled={loading} variant="outline">
                  {loading ? 'Running...' : 'Report Issue'}
                </Button>
                <Button onClick={fetchStatus} disabled={loading} variant="outline">
                  Refresh Status
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-2xl">🔍</span>
                  </div>
                  <h4 className="font-medium">1. Issue Detection</h4>
                  <p className="text-sm text-muted-foreground">
                    Automatically detects system issues and anomalies
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-2xl">🔬</span>
                  </div>
                  <h4 className="font-medium">2. Premium Scanning</h4>
                  <p className="text-sm text-muted-foreground">
                    Conducts thorough diamond-grade analysis
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

        <TabsContent value="scanner" className="space-y-4">
          {status?.activeScanDetails && status.activeScanDetails.length > 0 ? (
            <div className="space-y-4">
              {status.activeScanDetails.map((scan) => (
                <Card key={scan.scanId}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Active Scan: {scan.scanId}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(scan.status)}>
                          {scan.status.toUpperCase()}
                        </Badge>
                        <Badge variant="outline">
                          {scan.initiatedBy}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Score:</span>
                        <span className="ml-2">{scan.score}/100</span>
                      </div>
                      <div>
                        <span className="font-medium">Grade:</span>
                        <span className={`ml-2 px-2 py-1 rounded ${getGradeColor(scan.grade)}`}>
                          {scan.grade}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Fixes Applied:</span>
                        <span className="ml-2">{scan.fixesApplied}</span>
                      </div>
                      <div>
                        <span className="font-medium">Issues:</span>
                        <span className="ml-2">{scan.issues.length}</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Checkpoints Progress</h4>
                      <div className="space-y-2">
                        {scan.checkpoints.map((checkpoint) => (
                          <div key={checkpoint.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${getCheckpointStatusColor(checkpoint.status)}`} />
                              <span className="text-sm">{checkpoint.name}</span>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {checkpoint.category}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    {scan.issues.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Detected Issues</h4>
                        <div className="space-y-2">
                          {scan.issues.map((issue) => (
                            <div key={issue.id} className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${getSeverityColor(issue.severity)}`} />
                                <span className="text-sm">{issue.type}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  {issue.severity}
                                </Badge>
                                {issue.fixApplied && (
                                  <Badge variant="default" className="text-xs">
                                    Fixed
                                  </Badge>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-32">
                <p className="text-muted-foreground">No active scans running</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          {scanHistory.length > 0 ? (
            <div className="space-y-4">
              {scanHistory.map((scan) => (
                <Card key={scan.scanId}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Scan: {scan.scanId}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(scan.status)}>
                          {scan.status.toUpperCase()}
                        </Badge>
                        <Badge variant="outline">
                          {scan.initiatedBy}
                        </Badge>
                        <Badge className={getGradeColor(scan.grade)}>
                          {scan.grade}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Score:</span>
                        <span className="ml-2">{scan.score}/100</span>
                      </div>
                      <div>
                        <span className="font-medium">Duration:</span>
                        <span className="ml-2">
                          {scan.endTime ? 
                            `${Math.round((new Date(scan.endTime).getTime() - new Date(scan.startTime).getTime()) / 1000)}s` : 
                            'N/A'
                          }
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Checks:</span>
                        <span className="ml-2">{scan.summary.passedChecks}/{scan.summary.totalChecks}</span>
                      </div>
                      <div>
                        <span className="font-medium">Issues Fixed:</span>
                        <span className="ml-2">{scan.summary.fixedIssues}</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Summary</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Total Checks:</span>
                          <span className="ml-2">{scan.summary.totalChecks}</span>
                        </div>
                        <div>
                          <span className="font-medium">Passed:</span>
                          <span className="ml-2 text-green-600">{scan.summary.passedChecks}</span>
                        </div>
                        <div>
                          <span className="font-medium">Failed:</span>
                          <span className="ml-2 text-red-600">{scan.summary.failedChecks}</span>
                        </div>
                        <div>
                          <span className="font-medium">Fixed Issues:</span>
                          <span className="ml-2 text-green-600">{scan.summary.fixedIssues}</span>
                        </div>
                        <div>
                          <span className="font-medium">Remaining Issues:</span>
                          <span className="ml-2 text-orange-600">{scan.summary.remainingIssues}</span>
                        </div>
                      </div>
                    </div>

                    {scan.recommendations.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Recommendations</h4>
                        <ul className="list-disc list-inside text-sm space-y-1">
                          {scan.recommendations.map((recommendation, index) => (
                            <li key={index}>{recommendation}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-32">
                <p className="text-muted-foreground">No scan history available</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          {scanHistory.length > 0 ? (
            <div className="space-y-4">
              {scanHistory.map((scan) => (
                <Card key={scan.scanId}>
                  <CardHeader>
                    <CardTitle className="text-lg">Detailed Results - {scan.scanId}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Checkpoints Details</h4>
                        <div className="space-y-2">
                          {scan.checkpoints.map((checkpoint) => (
                            <div key={checkpoint.id} className="border rounded p-3">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <div className={`w-3 h-3 rounded-full ${getCheckpointStatusColor(checkpoint.status)}`} />
                                  <span className="font-medium">{checkpoint.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="text-xs">
                                    {checkpoint.category}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {checkpoint.priority}
                                  </Badge>
                                  <Badge className={getCheckpointStatusColor(checkpoint.status) + ' text-white text-xs'}>
                                    {checkpoint.status.toUpperCase()}
                                  </Badge>
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">{checkpoint.description}</p>
                              {checkpoint.error && (
                                <p className="text-sm text-red-600">Error: {checkpoint.error}</p>
                              )}
                              {checkpoint.result && (
                                <details className="text-sm">
                                  <summary className="cursor-pointer text-blue-600">View Result</summary>
                                  <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
                                    {JSON.stringify(checkpoint.result, null, 2)}
                                  </pre>
                                </details>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {scan.issues.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2">Issues Details</h4>
                          <div className="space-y-2">
                            {scan.issues.map((issue) => (
                              <div key={issue.id} className="border rounded p-3">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full ${getSeverityColor(issue.severity)}`} />
                                    <span className="font-medium">{issue.type}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="text-xs">
                                      {issue.component}
                                    </Badge>
                                    <Badge className={getSeverityColor(issue.severity) + ' text-white text-xs'}>
                                      {issue.severity.toUpperCase()}
                                    </Badge>
                                    {issue.fixApplied && (
                                      <Badge variant="default" className="text-xs">
                                        Fixed
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">{issue.description}</p>
                                <div className="text-xs text-muted-foreground">
                                  <p>Detected: {new Date(issue.detectedAt).toLocaleString()}</p>
                                  {issue.fixTimestamp && (
                                    <p>Fixed: {new Date(issue.fixTimestamp).toLocaleString()}</p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div>
                        <h4 className="font-medium mb-2">Raw Data</h4>
                        <details className="text-sm">
                          <summary className="cursor-pointer text-blue-600">View Complete Scan Data</summary>
                          <pre className="mt-2 p-4 bg-muted rounded text-xs overflow-auto max-h-96">
                            {JSON.stringify(scan, null, 2)}
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
                <p className="text-muted-foreground">No scan results available</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}