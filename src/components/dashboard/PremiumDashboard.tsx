'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Brain,
  Users,
  Network,
  Activity,
  BarChart3,
  Cpu,
  Database,
  Wifi,
  Shield,
  TrendingUp,
  Target,
  CheckCircle,
  AlertTriangle,
  Crown,
  Diamond,
  Zap,
  Globe,
  Server,
  Cloud,
  Atom,
  RefreshCw,
  Play,
  Pause,
  Settings,
  Eye,
  Lock,
  Key,
} from 'lucide-react';

interface SystemMetrics {
  cpu: number;
  memory: number;
  network: number;
  health: number;
  activeAgents: number;
  tasksRunning: number;
  successRate: number;
  uptime: string;
}

interface AgentStatus {
  id: string;
  name: string;
  status: 'active' | 'idle' | 'processing' | 'error';
  tasks: number;
  performance: number;
  lastActivity: string;
}

export default function PremiumDashboard() {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpu: 78,
    memory: 65,
    network: 98,
    health: 100,
    activeAgents: 12,
    tasksRunning: 48,
    successRate: 99.8,
    uptime: '99.99%',
  });

  const [agents, setAgents] = useState<AgentStatus[]>([
    {
      id: '1',
      name: 'GLM-4.5 Agent',
      status: 'active',
      tasks: 8,
      performance: 98,
      lastActivity: '2s ago',
    },
    {
      id: '2',
      name: 'Analytics Agent',
      status: 'processing',
      tasks: 12,
      performance: 95,
      lastActivity: '1s ago',
    },
    {
      id: '3',
      name: 'Security Agent',
      status: 'active',
      tasks: 3,
      performance: 100,
      lastActivity: '5s ago',
    },
    {
      id: '4',
      name: 'Data Processing',
      status: 'idle',
      tasks: 0,
      performance: 85,
      lastActivity: '1m ago',
    },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        cpu: Math.max(20, Math.min(95, prev.cpu + (Math.random() - 0.5) * 2)),
        memory: Math.max(30, Math.min(85, prev.memory + (Math.random() - 0.5) * 2)),
        network: Math.max(90, Math.min(100, prev.network + (Math.random() - 0.5) * 1)),
        tasksRunning: Math.max(
          20,
          Math.min(80, prev.tasksRunning + Math.floor((Math.random() - 0.5) * 4))
        ),
        successRate: Math.max(95, Math.min(100, prev.successRate + (Math.random() - 0.5) * 0.2)),
      }));

      setAgents(prev =>
        prev.map(agent => ({
          ...agent,
          performance: Math.max(70, Math.min(100, agent.performance + (Math.random() - 0.5) * 2)),
          tasks:
            agent.status === 'processing'
              ? agent.tasks + Math.floor(Math.random() * 2)
              : agent.tasks,
        }))
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'processing':
        return 'text-blue-600 bg-blue-100';
      case 'idle':
        return 'text-yellow-600 bg-yellow-100';
      case 'error':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* System Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  System Health
                </p>
                <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">
                  {metrics.health}%
                </p>
              </div>
              <div className="p-3 bg-blue-500 rounded-full">
                <Activity className="h-6 w-6 text-white" />
              </div>
            </div>
            <Progress value={metrics.health} className="mt-4 h-2" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">
                  Active Agents
                </p>
                <p className="text-2xl font-bold text-green-800 dark:text-green-200">
                  {metrics.activeAgents}
                </p>
              </div>
              <div className="p-3 bg-green-500 rounded-full">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-600 dark:text-green-400">All operational</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">
                  Processing Speed
                </p>
                <p className="text-2xl font-bold text-purple-800 dark:text-purple-200">4.2x</p>
              </div>
              <div className="p-3 bg-purple-500 rounded-full">
                <Zap className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-purple-500" />
              <span className="text-sm text-purple-600 dark:text-purple-400">Optimized</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600 dark:text-orange-400">
                  Success Rate
                </p>
                <p className="text-2xl font-bold text-orange-800 dark:text-orange-200">
                  {metrics.successRate}%
                </p>
              </div>
              <div className="p-3 bg-orange-500 rounded-full">
                <Target className="h-6 w-6 text-white" />
              </div>
            </div>
            <Progress value={metrics.successRate} className="mt-4 h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Tabs */}
      <Card className="bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Diamond className="h-5 w-5 text-purple-600" />
            Enterprise Dashboard
            <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black">
              <Crown className="h-3 w-3 mr-1" />
              Premium
            </Badge>
          </CardTitle>
          <CardDescription>
            Real-time monitoring and control of the OptiMind AI Ecosystem
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="agents">AI Agents</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Cpu className="h-5 w-5 text-blue-600" />
                    System Resources
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">CPU Usage</span>
                      <span className="text-sm font-bold text-blue-600">
                        {metrics.cpu.toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={metrics.cpu} className="h-2" />

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Memory Usage</span>
                      <span className="text-sm font-bold text-green-600">
                        {metrics.memory.toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={metrics.memory} className="h-2" />

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Network</span>
                      <span className="text-sm font-bold text-purple-600">
                        {metrics.network.toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={metrics.network} className="h-2" />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Server className="h-5 w-5 text-green-600" />
                    Server Status
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium">Main Server</span>
                      </div>
                      <Badge className="bg-green-500 text-white">Online</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-medium">AI Processing</span>
                      </div>
                      <Badge className="bg-blue-500 text-white">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-purple-500" />
                        <span className="text-sm font-medium">Database</span>
                      </div>
                      <Badge className="bg-purple-500 text-white">Synced</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="agents" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {agents.map(agent => (
                  <Card key={agent.id} className="border-gray-200 dark:border-gray-700">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Brain className="h-8 w-8 text-blue-600" />
                          <div>
                            <h4 className="font-semibold">{agent.name}</h4>
                            <Badge className={`text-xs ${getStatusColor(agent.status)}`}>
                              {agent.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-blue-600">{agent.performance}%</p>
                          <p className="text-xs text-gray-500">Performance</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Active Tasks</span>
                          <span className="font-medium">{agent.tasks}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Last Activity</span>
                          <span className="font-medium">{agent.lastActivity}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="performance" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-blue-600" />
                      Analytics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Data Processed</span>
                        <span className="font-bold">8.7M records</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Response Time</span>
                        <span className="font-bold">8ms avg</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Accuracy</span>
                        <span className="font-bold">96.8%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Database className="h-5 w-5 text-green-600" />
                      Database
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Storage Used</span>
                        <span className="font-bold">2.4 TB</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Queries/sec</span>
                        <span className="font-bold">1,247</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Uptime</span>
                        <span className="font-bold">99.99%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Wifi className="h-5 w-5 text-purple-600" />
                      Network
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Bandwidth</span>
                        <span className="font-bold">10 Gbps</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Latency</span>
                        <span className="font-bold">&lt;5ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Connections</span>
                        <span className="font-bold">15,847</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Shield className="h-5 w-5 text-red-600" />
                    Security Status
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium">Firewall</span>
                      </div>
                      <Badge className="bg-green-500 text-white">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium">Encryption</span>
                      </div>
                      <Badge className="bg-green-500 text-white">AES-256</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium">Authentication</span>
                      </div>
                      <Badge className="bg-green-500 text-white">2FA</Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    Recent Alerts
                  </h3>
                  <div className="space-y-2">
                    <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border-l-4 border-yellow-400">
                      <p className="text-sm font-medium">High CPU Usage Detected</p>
                      <p className="text-xs text-gray-600">2 hours ago - Resolved</p>
                    </div>
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-400">
                      <p className="text-sm font-medium">System Update Available</p>
                      <p className="text-xs text-gray-600">5 hours ago - Scheduled</p>
                    </div>
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-400">
                      <p className="text-sm font-medium">Security Scan Completed</p>
                      <p className="text-xs text-gray-600">1 day ago - No threats found</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
