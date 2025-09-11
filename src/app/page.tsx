'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Users, 
  Network, 
  Zap, 
  Activity, 
  BarChart3,
  TrendingUp,
  Target,
  Shield,
  Database,
  Globe,
  Cpu,
  ArrowRight,
  Star,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto p-6 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-6 py-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Brain className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              OptiMind AI Ecosystem
            </h1>
            <Sparkles className="h-8 w-8 text-purple-600" />
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Enterprise-Grade AI Platform with Advanced Agent Management, Intelligent Orchestration, 
            and Collaborative Intelligence Capabilities
          </p>
          <div className="flex items-center justify-center gap-4">
            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              <Star className="h-3 w-3 mr-1" />
              Premium Diamond Grade
            </Badge>
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              <Activity className="h-3 w-3 mr-1" />
              System Online
            </Badge>
            <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
              <Cpu className="h-3 w-3 mr-1" />
              4 AI Agents Active
            </Badge>
          </div>
        </div>

        {/* Key Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                AI Agents
              </CardTitle>
              <CardDescription>
                Manage and monitor intelligent AI agents with real-time performance tracking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Active Agents</span>
                  <span className="font-medium">4</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tasks Running</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Success Rate</span>
                  <span className="font-medium">96.8%</span>
                </div>
                <Link href="/ai-agents">
                  <Button className="w-full mt-4" size="sm">
                    Manage Agents
                    <ArrowRight className="h-3 w-3 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-600" />
                Enhanced AI
              </CardTitle>
              <CardDescription>
                Advanced AI orchestration with quantum processing and collaborative intelligence
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>System IQ</span>
                  <span className="font-medium">142</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Processing Speed</span>
                  <span className="font-medium">2.3x</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Efficiency</span>
                  <span className="font-medium">94.2%</span>
                </div>
                <Link href="/enhanced-ai-orchestrator">
                  <Button className="w-full mt-4" size="sm">
                    Access Enhanced AI
                    <ArrowRight className="h-3 w-3 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="h-5 w-5 text-green-600" />
                GLM Orchestrator
              </CardTitle>
              <CardDescription>
                GLM-4.5 powered orchestration system with intelligent task distribution
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Operations</span>
                  <span className="font-medium">847</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Response Time</span>
                  <span className="font-medium">45ms</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Reliability</span>
                  <span className="font-medium">99.2%</span>
                </div>
                <Link href="/glm-orchestrator-demo">
                  <Button className="w-full mt-4" size="sm">
                    View Orchestrator
                    <ArrowRight className="h-3 w-3 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-orange-600" />
                Analytics
              </CardTitle>
              <CardDescription>
                Comprehensive system analytics with real-time insights and performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Data Points</span>
                  <span className="font-medium">2.4M</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Insights Generated</span>
                  <span className="font-medium">15.2K</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Prediction Accuracy</span>
                  <span className="font-medium">87.5%</span>
                </div>
                <Link href="/analytics">
                  <Button className="w-full mt-4" size="sm">
                    View Analytics
                    <ArrowRight className="h-3 w-3 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              System Overview
            </CardTitle>
            <CardDescription>
              Real-time system metrics and performance indicators
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">4</div>
                <div className="text-sm text-gray-600">Active Agents</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">12</div>
                <div className="text-sm text-gray-600">Running Tasks</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">98.2%</div>
                <div className="text-sm text-gray-600">System Health</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">142</div>
                <div className="text-sm text-gray-600">Collective IQ</div>
              </div>
            </div>

            <Tabs defaultValue="performance" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
                <TabsTrigger value="intelligence">Intelligence</TabsTrigger>
              </TabsList>

              <TabsContent value="performance">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">System Efficiency</span>
                      <span className="text-sm">94.2%</span>
                    </div>
                    <Progress value={94.2} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Response Time</span>
                      <span className="text-sm">45ms</span>
                    </div>
                    <Progress value={87} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Success Rate</span>
                      <span className="text-sm">96.8%</span>
                    </div>
                    <Progress value={96.8} className="h-2" />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="resources">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">CPU Usage</span>
                      <span className="text-sm">45%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Memory Usage</span>
                      <span className="text-sm">62%</span>
                    </div>
                    <Progress value={62} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Network I/O</span>
                      <span className="text-sm">28%</span>
                    </div>
                    <Progress value={28} className="h-2" />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="intelligence">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Collective Intelligence</span>
                      <span className="text-sm">87%</span>
                    </div>
                    <Progress value={87} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Adaptability</span>
                      <span className="text-sm">91%</span>
                    </div>
                    <Progress value={91} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Innovation</span>
                      <span className="text-sm">88%</span>
                    </div>
                    <Progress value={88} className="h-2" />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Access key features and perform common operations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/ai-agents">
                <Button className="w-full h-auto p-4 flex flex-col items-center gap-2" variant="outline">
                  <Users className="h-6 w-6" />
                  <span>Manage AI Agents</span>
                </Button>
              </Link>
              <Link href="/enhanced-ai-orchestrator">
                <Button className="w-full h-auto p-4 flex flex-col items-center gap-2" variant="outline">
                  <Brain className="h-6 w-6" />
                  <span>Enhanced AI</span>
                </Button>
              </Link>
              <Link href="/glm-orchestrator-demo">
                <Button className="w-full h-auto p-4 flex flex-col items-center gap-2" variant="outline">
                  <Network className="h-6 w-6" />
                  <span>GLM Orchestrator</span>
                </Button>
              </Link>
              <Link href="/analytics">
                <Button className="w-full h-auto p-4 flex flex-col items-center gap-2" variant="outline">
                  <BarChart3 className="h-6 w-6" />
                  <span>Analytics</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Latest system events and agent activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <div className="flex-1">
                  <div className="text-sm font-medium">GLM-4.5 Primary Orchestrator completed system health analysis</div>
                  <div className="text-xs text-gray-500">2 minutes ago</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <div className="flex-1">
                  <div className="text-sm font-medium">Quantum Enhanced Processor entered learning mode</div>
                  <div className="text-xs text-gray-500">5 minutes ago</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div className="w-2 h-2 bg-purple-500 rounded-full" />
                <div className="flex-1">
                  <div className="text-sm font-medium">New collaboration formed: Collective Intelligence Network</div>
                  <div className="text-xs text-gray-500">12 minutes ago</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div className="w-2 h-2 bg-orange-500 rounded-full" />
                <div className="flex-1">
                  <div className="text-sm font-medium">Security scan initiated by DeepSeek Collaborative Agent</div>
                  <div className="text-xs text-gray-500">18 minutes ago</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
