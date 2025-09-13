'use client';

/**
 * Enhanced AI Orchestrator Dashboard - Advanced Intelligent Intuitive Interface
 *
 * This component provides a sophisticated dashboard for interacting with the
 * enhanced AI orchestration system, featuring real-time monitoring, natural language
 * interaction, collaborative intelligence visualization, and quantum processing insights.
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Brain,
  Network,
  Zap,
  Users,
  TrendingUp,
  MessageSquare,
  Activity,
  BarChart3,
} from 'lucide-react';

interface SystemStatus {
  isInitialized: boolean;
  agentsCount: number;
  activeOperations: number;
  completedResults: number;
  collaborativeNetworks: number;
  systemIntelligence: {
    overallIQ: number;
    emotionalIntelligence: number;
    creativity: number;
    problemSolving: number;
    adaptability: number;
    collaboration: number;
    learningSpeed: number;
    innovation: number;
  };
}

interface AgentInfo {
  id: string;
  name: string;
  type: string;
  status: string;
  capabilities: string[];
  emotionalIntelligence: number;
  creativity: number;
  problemSolving: number;
  collaborationScore: number;
  cognitiveLoad: number;
  energy: number;
}

interface OperationResult {
  operationId: string;
  success: boolean;
  result: any;
  insights: Array<{
    key: string;
    confidence: number;
    source: string;
  }>;
  recommendations: Array<{
    action: string;
    priority: number;
    expectedImpact: string;
  }>;
  performance: {
    accuracy: number;
    efficiency: number;
    innovation: number;
    collaborationScore: number;
  };
  processingTime: number;
  orchestratedBy: string;
  timestamp: Date;
  metadata: Record<string, any>;
}

export default function EnhancedAIDashboard() {
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [agents, setAgents] = useState<AgentInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [naturalLanguageQuery, setNaturalLanguageQuery] = useState('');
  const [currentOperation, setCurrentOperation] = useState<string | null>(null);
  const [operationResults, setOperationResults] = useState<OperationResult[]>([]);
  const [demonstrationResults, setDemonstrationResults] = useState<any>(null);

  // Initialize the dashboard
  useEffect(() => {
    loadSystemStatus();
    const interval = setInterval(loadSystemStatus, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const loadSystemStatus = async () => {
    try {
      const response = await fetch('/api/enhanced-ai-orchestrator?action=status');
      const data = await response.json();
      if (data.success) {
        setSystemStatus(data.data);
      }
    } catch (error) {
      console.error('Failed to load system status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadAgents = async () => {
    try {
      const response = await fetch('/api/enhanced-ai-orchestrator?action=agents');
      const data = await response.json();
      if (data.success) {
        setAgents(data.data.agents);
      }
    } catch (error) {
      console.error('Failed to load agents:', error);
    }
  };

  const runDemonstration = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/enhanced-ai-orchestrator?action=demonstration');
      const data = await response.json();
      if (data.success) {
        setDemonstrationResults(data.data);
      }
    } catch (error) {
      console.error('Failed to run demonstration:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const submitNaturalLanguageQuery = async () => {
    if (!naturalLanguageQuery.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/enhanced-ai-orchestrator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'natural-language-query',
          payload: { query: naturalLanguageQuery },
        }),
      });

      const data = await response.json();
      if (data.success) {
        setCurrentOperation(data.operationId);
        setNaturalLanguageQuery('');

        // Poll for result
        pollForOperationResult(data.operationId);
      }
    } catch (error) {
      console.error('Failed to submit query:', error);
      setIsLoading(false);
    }
  };

  const submitCollaborativeAnalysis = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/enhanced-ai-orchestrator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'collaborative-analysis',
          payload: {
            domain: 'multi-domain-analysis',
            data: { analysisType: 'comprehensive-collaborative' },
            maxAgents: 3,
          },
        }),
      });

      const data = await response.json();
      if (data.success) {
        setCurrentOperation(data.operationId);
        pollForOperationResult(data.operationId);
      }
    } catch (error) {
      console.error('Failed to submit collaborative analysis:', error);
      setIsLoading(false);
    }
  };

  const submitQuantumOperation = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/enhanced-ai-orchestrator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'quantum-enhanced-operation',
          payload: {
            domain: 'quantum-computing',
            data: { operation: 'quantum-optimization' },
            maxAgents: 2,
          },
        }),
      });

      const data = await response.json();
      if (data.success) {
        setCurrentOperation(data.operationId);
        pollForOperationResult(data.operationId);
      }
    } catch (error) {
      console.error('Failed to submit quantum operation:', error);
      setIsLoading(false);
    }
  };

  const pollForOperationResult = async (operationId: string) => {
    const maxAttempts = 20;
    let attempts = 0;

    const poll = async () => {
      try {
        const response = await fetch('/api/enhanced-ai-orchestrator', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'get-result',
            payload: { operationId },
          }),
        });

        const data = await response.json();
        if (data.success && data.data) {
          setOperationResults(prev => [data.data, ...prev.slice(0, 9)]);
          setCurrentOperation(null);
          setIsLoading(false);
        } else if (attempts < maxAttempts) {
          attempts++;
          setTimeout(poll, 1000);
        } else {
          setCurrentOperation(null);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Failed to poll for result:', error);
        if (attempts < maxAttempts) {
          attempts++;
          setTimeout(poll, 1000);
        } else {
          setCurrentOperation(null);
          setIsLoading(false);
        }
      }
    };

    poll();
  };

  const getAgentTypeColor = (type: string) => {
    switch (type) {
      case 'primary':
        return 'bg-blue-500';
      case 'specialist':
        return 'bg-purple-500';
      case 'collaborative':
        return 'bg-green-500';
      case 'quantum-enhanced':
        return 'bg-indigo-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600';
      case 'learning':
        return 'text-blue-600';
      case 'collaborating':
        return 'text-purple-600';
      case 'resting':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  if (isLoading && !systemStatus) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Activity className="h-12 w-12 animate-spin mx-auto mb-4" />
          <p className="text-lg">Initializing Enhanced AI Orchestrator...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Enhanced AI Orchestrator
        </h1>
        <p className="text-xl text-gray-600">Advanced • Intelligent • Intuitive • Powerful</p>
      </div>

      {/* System Overview */}
      {systemStatus && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              System Intelligence Overview
            </CardTitle>
            <CardDescription>
              Real-time system intelligence metrics and operational status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {systemStatus.systemIntelligence.overallIQ}
                </div>
                <div className="text-sm text-gray-600">Overall IQ</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{systemStatus.agentsCount}</div>
                <div className="text-sm text-gray-600">Active Agents</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {systemStatus.activeOperations}
                </div>
                <div className="text-sm text-gray-600">Active Operations</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {systemStatus.collaborativeNetworks}
                </div>
                <div className="text-sm text-gray-600">Collaborative Networks</div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Emotional Intelligence</span>
                  <span className="text-sm">
                    {systemStatus.systemIntelligence.emotionalIntelligence}%
                  </span>
                </div>
                <Progress
                  value={systemStatus.systemIntelligence.emotionalIntelligence}
                  className="h-2"
                />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Creativity</span>
                  <span className="text-sm">{systemStatus.systemIntelligence.creativity}%</span>
                </div>
                <Progress value={systemStatus.systemIntelligence.creativity} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Problem Solving</span>
                  <span className="text-sm">{systemStatus.systemIntelligence.problemSolving}%</span>
                </div>
                <Progress value={systemStatus.systemIntelligence.problemSolving} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Collaboration</span>
                  <span className="text-sm">{systemStatus.systemIntelligence.collaboration}%</span>
                </div>
                <Progress value={systemStatus.systemIntelligence.collaboration} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="interface" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="interface">Natural Interface</TabsTrigger>
          <TabsTrigger value="agents">AI Agents</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="demonstration">Demo</TabsTrigger>
        </TabsList>

        <TabsContent value="interface" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Natural Language Interface
              </CardTitle>
              <CardDescription>
                Interact with the AI orchestrator using natural language queries
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Textarea
                  placeholder="Ask the AI orchestrator to perform complex tasks, analyze data, or solve problems..."
                  value={naturalLanguageQuery}
                  onChange={e => setNaturalLanguageQuery(e.target.value)}
                  className="flex-1"
                  rows={3}
                />
                <Button
                  onClick={submitNaturalLanguageQuery}
                  disabled={isLoading || !naturalLanguageQuery.trim()}
                  className="self-start"
                >
                  Submit Query
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  onClick={submitCollaborativeAnalysis}
                  disabled={isLoading}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Users className="h-4 w-4" />
                  Collaborative Analysis
                </Button>
                <Button
                  onClick={submitQuantumOperation}
                  disabled={isLoading}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Zap className="h-4 w-4" />
                  Quantum Processing
                </Button>
                <Button
                  onClick={loadAgents}
                  disabled={isLoading}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Network className="h-4 w-4" />
                  View Agents
                </Button>
              </div>

              {currentOperation && (
                <Alert>
                  <Activity className="h-4 w-4" />
                  <AlertDescription>
                    Processing operation: {currentOperation}. Please wait...
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="agents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                AI Agents Network
              </CardTitle>
              <CardDescription>
                Intelligent agents with specialized capabilities and collaborative abilities
              </CardDescription>
            </CardHeader>
            <CardContent>
              {agents.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 mb-4">
                    No agents loaded. Click "View Agents" to load the agent network.
                  </p>
                  <Button onClick={loadAgents} disabled={isLoading}>
                    Load Agents
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4">
                  {agents.map(agent => (
                    <Card key={agent.id} className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold">{agent.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={`text-white ${getAgentTypeColor(agent.type)}`}>
                              {agent.type}
                            </Badge>
                            <span className={`text-sm ${getStatusColor(agent.status)}`}>
                              {agent.status}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-600">Energy</div>
                          <div className="font-semibold">{agent.energy}%</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                        <div>
                          <div className="text-xs text-gray-600">EI</div>
                          <div className="text-sm font-semibold">{agent.emotionalIntelligence}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-600">Creativity</div>
                          <div className="text-sm font-semibold">{agent.creativity}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-600">Problem Solving</div>
                          <div className="text-sm font-semibold">{agent.problemSolving}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-600">Collaboration</div>
                          <div className="text-sm font-semibold">{agent.collaborationScore}</div>
                        </div>
                      </div>

                      <div className="mb-2">
                        <div className="text-xs text-gray-600 mb-1">Cognitive Load</div>
                        <Progress value={agent.cognitiveLoad} className="h-2" />
                      </div>

                      <div>
                        <div className="text-xs text-gray-600 mb-1">Capabilities</div>
                        <div className="flex flex-wrap gap-1">
                          {agent.capabilities.map((capability, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {capability}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="operations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Operation Results
              </CardTitle>
              <CardDescription>
                Recent operation results with insights and performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              {operationResults.length === 0 ? (
                <div className="text-center py-8">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">
                    No operations completed yet. Submit a query to see results.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {operationResults.map((result, index) => (
                    <Card
                      key={index}
                      className={`p-4 ${result.success ? 'border-green-200' : 'border-red-200'}`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold flex items-center gap-2">
                            {result.success ? (
                              <Badge className="bg-green-500">Success</Badge>
                            ) : (
                              <Badge className="bg-red-500">Failed</Badge>
                            )}
                            Operation {result.operationId.slice(0, 8)}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {new Date(result.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-600">Processing Time</div>
                          <div className="font-semibold">{result.processingTime}ms</div>
                        </div>
                      </div>

                      {result.success && (
                        <>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                            <div>
                              <div className="text-xs text-gray-600">Accuracy</div>
                              <div className="text-sm font-semibold">
                                {(result.performance.accuracy * 100).toFixed(1)}%
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-600">Efficiency</div>
                              <div className="text-sm font-semibold">
                                {(result.performance.efficiency * 100).toFixed(1)}%
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-600">Innovation</div>
                              <div className="text-sm font-semibold">
                                {(result.performance.innovation * 100).toFixed(1)}%
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-600">Collaboration</div>
                              <div className="text-sm font-semibold">
                                {(result.performance.collaborationScore * 100).toFixed(1)}%
                              </div>
                            </div>
                          </div>

                          {result.insights.length > 0 && (
                            <div className="mb-3">
                              <div className="text-xs text-gray-600 mb-1">Key Insights</div>
                              <div className="space-y-1">
                                {result.insights.slice(0, 3).map((insight, idx) => (
                                  <div key={idx} className="text-sm bg-blue-50 p-2 rounded">
                                    {insight.key} ({(insight.confidence * 100).toFixed(1)}%
                                    confidence)
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {result.recommendations.length > 0 && (
                            <div>
                              <div className="text-xs text-gray-600 mb-1">Recommendations</div>
                              <div className="space-y-1">
                                {result.recommendations.slice(0, 2).map((rec, idx) => (
                                  <div key={idx} className="text-sm bg-green-50 p-2 rounded">
                                    {rec.action} - {rec.expectedImpact}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="demonstration" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                System Demonstration
              </CardTitle>
              <CardDescription>
                Run a comprehensive demonstration of enhanced AI orchestration capabilities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={runDemonstration} disabled={isLoading} className="w-full">
                {isLoading ? 'Running Demonstration...' : 'Run Enhanced AI Demonstration'}
              </Button>

              {demonstrationResults && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {demonstrationResults.performance.successfulOperations}/
                        {demonstrationResults.performance.totalOperations}
                      </div>
                      <div className="text-sm text-gray-600">Operations</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {demonstrationResults.performance.averageProcessingTime.toFixed(0)}ms
                      </div>
                      <div className="text-sm text-gray-600">Avg Time</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {(demonstrationResults.performance.quantumEnhancement * 100).toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-600">Quantum Enhancement</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">
                        {demonstrationResults.systemIntelligence.overallIQ}
                      </div>
                      <div className="text-sm text-gray-600">System IQ</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Capabilities Demonstrated:</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${demonstrationResults.capabilities.naturalLanguageProcessing ? 'bg-green-500' : 'bg-red-500'}`}
                        />
                        <span className="text-sm">Natural Language</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${demonstrationResults.capabilities.collaborativeIntelligence ? 'bg-green-500' : 'bg-red-500'}`}
                        />
                        <span className="text-sm">Collaborative AI</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${demonstrationResults.capabilities.quantumProcessing ? 'bg-green-500' : 'bg-red-500'}`}
                        />
                        <span className="text-sm">Quantum Processing</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${demonstrationResults.capabilities.adaptiveLearning ? 'bg-green-500' : 'bg-red-500'}`}
                        />
                        <span className="text-sm">Adaptive Learning</span>
                      </div>
                    </div>
                  </div>

                  {demonstrationResults.operations &&
                    demonstrationResults.operations.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2">Operation Results:</h4>
                        <div className="space-y-2">
                          {demonstrationResults.operations.map((op: any, index: number) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-2 bg-gray-50 rounded"
                            >
                              <span className="text-sm font-medium capitalize">
                                {op.type.replace('-', ' ')}
                              </span>
                              <Badge className={op.result?.success ? 'bg-green-500' : 'bg-red-500'}>
                                {op.result?.success ? 'Success' : 'Failed'}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
