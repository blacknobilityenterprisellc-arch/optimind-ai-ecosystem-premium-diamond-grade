'use client';

/**
 * OptiMind AI Agents Dashboard - Enterprise-Grade Agent Management System
 *
 * This component provides a comprehensive dashboard for managing and monitoring
 * AI agents within the OptiMind ecosystem, featuring real-time agent status,
 * performance metrics, collaboration capabilities, and intelligent task orchestration.
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Brain,
  Network,
  Zap,
  Users,
  TrendingUp,
  MessageSquare,
  Activity,
  BarChart3,
  Settings,
  Play,
  Pause,
  RotateCcw,
  Plus,
  Target,
  Shield,
  Lightbulb,
  Cpu,
  Database,
  Globe,
  Clock,
} from 'lucide-react';

interface AgentStatus {
  id: string;
  name: string;
  type: 'primary' | 'specialist' | 'collaborative' | 'quantum-enhanced' | 'learning';
  status: 'active' | 'idle' | 'learning' | 'collaborating' | 'processing' | 'error';
  capabilities: string[];
  performance: {
    accuracy: number;
    efficiency: number;
    responseTime: number;
    successRate: number;
    cognitiveLoad: number;
  };
  resources: {
    cpu: number;
    memory: number;
    network: number;
    energy: number;
  };
  intelligence: {
    overallIQ: number;
    emotionalIntelligence: number;
    creativity: number;
    problemSolving: number;
    adaptability: number;
    collaboration: number;
  };
  tasks: {
    completed: number;
    active: number;
    failed: number;
    avgProcessingTime: number;
  };
  lastActivity: Date;
  uptime: number;
}

interface AgentTask {
  id: string;
  title: string;
  description: string;
  type: 'analysis' | 'optimization' | 'monitoring' | 'security' | 'prediction' | 'collaboration';
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'pending' | 'assigned' | 'in-progress' | 'completed' | 'failed';
  assignedAgent?: string;
  dependencies?: string[];
  progress: number;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  estimatedDuration: number;
  actualDuration?: number;
  result?: any;
}

interface AgentCollaboration {
  id: string;
  name: string;
  participants: string[];
  type: 'task-sharing' | 'knowledge-exchange' | 'collective-intelligence' | 'quantum-entanglement';
  status: 'active' | 'forming' | 'dissolving' | 'completed';
  synergy: number;
  efficiency: number;
  emergentProperties: string[];
  sharedContext: any;
  createdAt: Date;
  lastActivity: Date;
}

interface SystemMetrics {
  totalAgents: number;
  activeAgents: number;
  totalTasks: number;
  completedTasks: number;
  activeCollaborations: number;
  systemIntelligence: {
    overallIQ: number;
    collectiveIntelligence: number;
    adaptability: number;
    innovation: number;
  };
  performance: {
    throughput: number;
    latency: number;
    efficiency: number;
    reliability: number;
  };
  resourceUtilization: {
    cpu: number;
    memory: number;
    network: number;
    energy: number;
  };
}

export default function OptiMindAgentsDashboard() {
  const [agents, setAgents] = useState<AgentStatus[]>([]);
  const [tasks, setTasks] = useState<AgentTask[]>([]);
  const [collaborations, setCollaborations] = useState<AgentCollaboration[]>([]);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    type: 'analysis' as AgentTask['type'],
    priority: 'medium' as AgentTask['priority'],
  });

  // Initialize dashboard
  useEffect(() => {
    loadSystemData();
    const interval = setInterval(loadSystemData, 3000); // Refresh every 3 seconds
    return () => clearInterval(interval);
  }, []);

  const loadSystemData = async () => {
    try {
      const [agentsRes, tasksRes, collabsRes, metricsRes] = await Promise.all([
        fetch('/api/ai-agents?action=list-agents'),
        fetch('/api/ai-agents?action=list-tasks'),
        fetch('/api/ai-agents?action=list-collaborations'),
        fetch('/api/ai-agents?action=system-metrics'),
      ]);

      const [agentsData, tasksData, collabsData, metricsData] = await Promise.all([
        agentsRes.json(),
        tasksRes.json(),
        collabsRes.json(),
        metricsRes.json(),
      ]);

      if (agentsData.success) setAgents(agentsData.data);
      if (tasksData.success) setTasks(tasksData.data);
      if (collabsData.success) setCollaborations(collabsData.data);
      if (metricsData.success) setSystemMetrics(metricsData.data);
    } catch (error) {
      console.error('Failed to load system data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createTask = async () => {
    if (!newTask.title.trim()) return;

    try {
      const response = await fetch('/api/ai-agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create-task',
          payload: newTask,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setNewTask({ title: '', description: '', type: 'analysis', priority: 'medium' });
        loadSystemData();
      }
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const controlAgent = async (agentId: string, action: 'start' | 'pause' | 'restart') => {
    try {
      const response = await fetch('/api/ai-agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'control-agent',
          payload: { agentId, action },
        }),
      });

      if (response.ok) {
        loadSystemData();
      }
    } catch (error) {
      console.error('Failed to control agent:', error);
    }
  };

  const createCollaboration = async () => {
    try {
      const response = await fetch('/api/ai-agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create-collaboration',
          payload: {
            type: 'collective-intelligence',
            participants: agents
              .filter(a => a.status === 'active')
              .slice(0, 3)
              .map(a => a.id),
          },
        }),
      });

      if (response.ok) {
        loadSystemData();
      }
    } catch (error) {
      console.error('Failed to create collaboration:', error);
    }
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
      case 'learning':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-50';
      case 'idle':
        return 'text-gray-600 bg-gray-50';
      case 'learning':
        return 'text-blue-600 bg-blue-50';
      case 'collaborating':
        return 'text-purple-600 bg-purple-50';
      case 'processing':
        return 'text-orange-600 bg-orange-50';
      case 'error':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'text-red-600 bg-red-50';
      case 'high':
        return 'text-orange-600 bg-orange-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'low':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Activity className="h-12 w-12 animate-spin mx-auto mb-4" />
          <p className="text-lg">Initializing OptiMind AI Agents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          OptiMind AI Agents
        </h1>
        <p className="text-xl text-gray-600">
          Enterprise-Grade Agent Management & Orchestration System
        </p>
      </div>

      {/* System Overview */}
      {systemMetrics && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              System Intelligence Overview
            </CardTitle>
            <CardDescription>
              Real-time system metrics and collective intelligence status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{systemMetrics.totalAgents}</div>
                <div className="text-sm text-gray-600">Total Agents</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {systemMetrics.activeAgents}
                </div>
                <div className="text-sm text-gray-600">Active Agents</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {systemMetrics.activeCollaborations}
                </div>
                <div className="text-sm text-gray-600">Collaborations</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {Math.round(systemMetrics.systemIntelligence.overallIQ)}
                </div>
                <div className="text-sm text-gray-600">Collective IQ</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">System Intelligence</h4>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Collective Intelligence</span>
                      <span className="text-sm">
                        {Math.round(systemMetrics.systemIntelligence.collectiveIntelligence)}%
                      </span>
                    </div>
                    <Progress
                      value={systemMetrics.systemIntelligence.collectiveIntelligence}
                      className="h-2"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Adaptability</span>
                      <span className="text-sm">
                        {Math.round(systemMetrics.systemIntelligence.adaptability)}%
                      </span>
                    </div>
                    <Progress
                      value={systemMetrics.systemIntelligence.adaptability}
                      className="h-2"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Innovation</span>
                      <span className="text-sm">
                        {Math.round(systemMetrics.systemIntelligence.innovation)}%
                      </span>
                    </div>
                    <Progress value={systemMetrics.systemIntelligence.innovation} className="h-2" />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Resource Utilization</h4>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">CPU</span>
                      <span className="text-sm">
                        {Math.round(systemMetrics.resourceUtilization.cpu)}%
                      </span>
                    </div>
                    <Progress value={systemMetrics.resourceUtilization.cpu} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Memory</span>
                      <span className="text-sm">
                        {Math.round(systemMetrics.resourceUtilization.memory)}%
                      </span>
                    </div>
                    <Progress value={systemMetrics.resourceUtilization.memory} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Network</span>
                      <span className="text-sm">
                        {Math.round(systemMetrics.resourceUtilization.network)}%
                      </span>
                    </div>
                    <Progress value={systemMetrics.resourceUtilization.network} className="h-2" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="agents" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="agents">AI Agents</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="collaborations">Collaborations</TabsTrigger>
          <TabsTrigger value="create">Create</TabsTrigger>
        </TabsList>

        <TabsContent value="agents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                AI Agents Network
              </CardTitle>
              <CardDescription>
                Intelligent agents with specialized capabilities and performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {agents.map(agent => (
                  <Card key={agent.id} className="p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${getAgentTypeColor(agent.type)}`} />
                        <div>
                          <h3 className="font-semibold">{agent.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={getStatusColor(agent.status)}>{agent.status}</Badge>
                            <Badge variant="outline">{agent.type}</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => controlAgent(agent.id, 'start')}
                          disabled={agent.status === 'active'}
                        >
                          <Play className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => controlAgent(agent.id, 'pause')}
                          disabled={agent.status !== 'active'}
                        >
                          <Pause className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => controlAgent(agent.id, 'restart')}
                        >
                          <RotateCcw className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Performance</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Accuracy</span>
                            <span>{Math.round(agent.performance.accuracy)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Efficiency</span>
                            <span>{Math.round(agent.performance.efficiency)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Response Time</span>
                            <span>{agent.performance.responseTime}ms</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-2">Intelligence</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Overall IQ</span>
                            <span>{Math.round(agent.intelligence.overallIQ)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Problem Solving</span>
                            <span>{Math.round(agent.intelligence.problemSolving)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Collaboration</span>
                            <span>{Math.round(agent.intelligence.collaboration)}%</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-2">Tasks</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Completed</span>
                            <span>{agent.tasks.completed}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Active</span>
                            <span>{agent.tasks.active}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Failed</span>
                            <span>{agent.tasks.failed}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Capabilities</h4>
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Task Management
              </CardTitle>
              <CardDescription>
                Monitor and manage agent tasks with real-time progress tracking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tasks.map(task => (
                  <Card key={task.id} className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold">{task.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                        <Badge variant="outline">{task.type}</Badge>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-4 text-sm">
                        <span className={getStatusColor(task.status)}>{task.status}</span>
                        {task.assignedAgent && (
                          <span>
                            Assigned to: {agents.find(a => a.id === task.assignedAgent)?.name}
                          </span>
                        )}
                        <span>Created: {new Date(task.createdAt).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="mb-2">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Progress</span>
                        <span className="text-sm">{Math.round(task.progress)}%</span>
                      </div>
                      <Progress value={task.progress} className="h-2" />
                    </div>

                    {task.dependencies && task.dependencies.length > 0 && (
                      <div className="mt-2">
                        <span className="text-sm font-medium">Dependencies:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {task.dependencies.map((dep, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {dep}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="collaborations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="h-5 w-5" />
                Agent Collaborations
              </CardTitle>
              <CardDescription>
                Multi-agent collaborations with emergent intelligence and synergy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">
                    Active collaborations leveraging collective intelligence
                  </p>
                  <Button onClick={createCollaboration} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Collaboration
                  </Button>
                </div>

                {collaborations.map(collab => (
                  <Card key={collab.id} className="p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold">{collab.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getStatusColor(collab.status)}>{collab.status}</Badge>
                          <Badge variant="outline">{collab.type}</Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          Synergy: {Math.round(collab.synergy)}%
                        </div>
                        <div className="text-sm text-gray-600">
                          Efficiency: {Math.round(collab.efficiency)}%
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Participants</h4>
                        <div className="space-y-1">
                          {collab.participants.map((participantId, index) => {
                            const agent = agents.find(a => a.id === participantId);
                            return (
                              <div key={index} className="flex items-center gap-2 text-sm">
                                <div
                                  className={`w-2 h-2 rounded-full ${getAgentTypeColor(agent?.type || '')}`}
                                />
                                {agent?.name || participantId}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-2">Emergent Properties</h4>
                        <div className="flex flex-wrap gap-1">
                          {collab.emergentProperties.map((property, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {property}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 text-xs text-gray-500">
                      Created: {new Date(collab.createdAt).toLocaleString()} | Last Activity:{' '}
                      {new Date(collab.lastActivity).toLocaleString()}
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Create New Task
              </CardTitle>
              <CardDescription>
                Create and assign tasks to AI agents with specific requirements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Task Title</label>
                <Input
                  placeholder="Enter task title..."
                  value={newTask.title}
                  onChange={e => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Description</label>
                <Textarea
                  placeholder="Describe the task in detail..."
                  value={newTask.description}
                  onChange={e => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Task Type</label>
                  <Select
                    value={newTask.type}
                    onValueChange={(value: AgentTask['type']) =>
                      setNewTask(prev => ({ ...prev, type: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="analysis">Analysis</SelectItem>
                      <SelectItem value="optimization">Optimization</SelectItem>
                      <SelectItem value="monitoring">Monitoring</SelectItem>
                      <SelectItem value="security">Security</SelectItem>
                      <SelectItem value="prediction">Prediction</SelectItem>
                      <SelectItem value="collaboration">Collaboration</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Priority</label>
                  <Select
                    value={newTask.priority}
                    onValueChange={(value: AgentTask['priority']) =>
                      setNewTask(prev => ({ ...prev, priority: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={createTask} disabled={!newTask.title.trim()} className="w-full">
                Create Task
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
