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
  Sparkles,
  Crown,
  Diamond,
  Lock,
  Eye,
  Fingerprint,
  Key,
  AlertTriangle,
  CheckCircle,
  Clock,
  Award,
  Rocket,
  Settings,
  SecurityScan,
  Server,
  Cloud,
  Quantum,
  Biometric
} from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-blue-900 dark:to-purple-900">
      {/* Premium Diamond-Grade Header */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"></div>
      
      <div className="container mx-auto p-6 space-y-12">
        {/* Hero Section - Premium Diamond-Grade */}
        <div className="text-center space-y-8 py-16 relative">
          {/* Premium Badge */}
          <div className="absolute top-0 right-0">
            <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold px-4 py-2 rounded-full shadow-lg">
              <Crown className="h-4 w-4 mr-1" />
              PREMIUM DIAMOND GRADE
            </Badge>
          </div>

          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="relative">
              <Brain className="h-12 w-12 text-blue-600" />
              <div className="absolute -top-1 -right-1">
                <Diamond className="h-4 w-4 text-purple-600 fill-purple-600" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              OptiMind AI Ecosystem
            </h1>
            <div className="relative">
              <Sparkles className="h-12 w-12 text-purple-600" />
              <div className="absolute -top-1 -right-1">
                <Diamond className="h-4 w-4 text-blue-600 fill-blue-600" />
              </div>
            </div>
          </div>
          
          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Enterprise-Grade AI Platform with <span className="font-bold text-blue-600">45+ AI Tools</span>, 
            <span className="font-bold text-purple-600">35+ Advanced AI Models</span>, and 
            <span className="font-bold text-pink-600">Military-Grade Security</span>
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold px-4 py-2">
              <Star className="h-4 w-4 mr-1" />
              98% System Health
            </Badge>
            <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold px-4 py-2">
              <Activity className="h-4 w-4 mr-1" />
              Real-time Processing
            </Badge>
            <Badge className="bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold px-4 py-2">
              <Cpu className="h-4 w-4 mr-1" />
              8 AI Agents Active
            </Badge>
            <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold px-4 py-2">
              <Shield className="h-4 w-4 mr-1" />
              Military-Grade Security
            </Badge>
          </div>

          {/* Premium CTA */}
          <div className="mt-12">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold px-8 py-4 text-lg shadow-xl">
              <Rocket className="h-5 w-5 mr-2" />
              Launch Premium Experience
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </div>

        {/* Premium Diamond-Grade Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* AI Agents Card */}
          <Card className="hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-blue-200 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="flex items-center justify-center gap-2 text-lg">
                AI Agents
                <Crown className="h-5 w-5 text-yellow-500" />
              </CardTitle>
              <CardDescription className="text-sm">
                Premium AI agent management with real-time orchestration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    Active Agents
                  </span>
                  <span className="font-bold text-blue-600">8</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    Tasks Running
                  </span>
                  <span className="font-bold text-purple-600">24</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    Success Rate
                  </span>
                  <span className="font-bold text-green-600">99.2%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    Response Time
                  </span>
                  <span className="font-bold text-blue-600">12ms</span>
                </div>
                <Link href="/ai-agents">
                  <Button className="w-full mt-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white" size="sm">
                    Manage Premium Agents
                    <ArrowRight className="h-3 w-3 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced AI Card */}
          <Card className="hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-purple-200 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="flex items-center justify-center gap-2 text-lg">
                Enhanced AI
                <Diamond className="h-5 w-5 text-purple-500" />
              </CardTitle>
              <CardDescription className="text-sm">
                Quantum-enhanced AI with multi-model ensemble processing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    System IQ
                  </span>
                  <span className="font-bold text-purple-600">168</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    Processing Speed
                  </span>
                  <span className="font-bold text-blue-600">3.7x</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    Efficiency
                  </span>
                  <span className="font-bold text-green-600">97.8%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    Models Available
                  </span>
                  <span className="font-bold text-purple-600">35+</span>
                </div>
                <Link href="/enhanced-ai-orchestrator">
                  <Button className="w-full mt-6 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white" size="sm">
                    Access Enhanced AI
                    <ArrowRight className="h-3 w-3 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* GLM Orchestrator Card */}
          <Card className="hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-green-200 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mb-4">
                <Network className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="flex items-center justify-center gap-2 text-lg">
                GLM Orchestrator
                <Server className="h-5 w-5 text-green-500" />
              </CardTitle>
              <CardDescription className="text-sm">
                GLM-4.5 powered enterprise orchestration with zero-trust security
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    Operations
                  </span>
                  <span className="font-bold text-green-600">1,247</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    Response Time
                  </span>
                  <span className="font-bold text-blue-600">8ms</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    Reliability
                  </span>
                  <span className="font-bold text-green-600">99.9%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    Security Level
                  </span>
                  <span className="font-bold text-red-600">Military</span>
                </div>
                <Link href="/glm-orchestrator-demo">
                  <Button className="w-full mt-6 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white" size="sm">
                    View Orchestrator
                    <ArrowRight className="h-3 w-3 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Analytics Card */}
          <Card className="hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-orange-200 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mb-4">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="flex items-center justify-center gap-2 text-lg">
                Analytics
                <Cloud className="h-5 w-5 text-orange-500" />
              </CardTitle>
              <CardDescription className="text-sm">
                Real-time analytics with predictive insights and AI-driven recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    Data Points
                  </span>
                  <span className="font-bold text-orange-600">5.2M</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    Insights Generated
                  </span>
                  <span className="font-bold text-purple-600">28.7K</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    Prediction Accuracy
                  </span>
                  <span className="font-bold text-green-600">94.2%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    Processing Speed
                  </span>
                  <span className="font-bold text-blue-600">Real-time</span>
                </div>
                <Link href="/analytics">
                  <Button className="w-full mt-6 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white" size="sm">
                    View Analytics
                    <ArrowRight className="h-3 w-3 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Premium Diamond-Grade System Overview */}
        <Card className="bg-gradient-to-br from-white via-blue-50 to-purple-50 dark:from-slate-800 dark:via-blue-900 dark:to-purple-900 border-2 border-blue-200 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="flex items-center gap-2">
                <Activity className="h-6 w-6 text-blue-600" />
                System Overview
                <Crown className="h-5 w-5 text-yellow-500" />
              </div>
            </CardTitle>
            <CardDescription className="text-lg">
              Real-time system metrics and premium diamond-grade performance indicators
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">8</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Active Agents</div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full" style={{ width: '95%' }}></div>
                </div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-600 bg-clip-text text-transparent">24</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Running Tasks</div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full" style={{ width: '88%' }}></div>
                </div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-600 bg-clip-text text-transparent">99.8%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">System Health</div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full" style={{ width: '99.8%' }}></div>
                </div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-600 bg-clip-text text-transparent">168</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Collective IQ</div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                </div>
              </div>
            </div>

            <Tabs defaultValue="performance" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 bg-white/50 dark:bg-slate-800/50 p-1 rounded-lg">
                <TabsTrigger value="performance" className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Performance
                </TabsTrigger>
                <TabsTrigger value="resources" className="flex items-center gap-2">
                  <Server className="h-4 w-4" />
                  Resources
                </TabsTrigger>
                <TabsTrigger value="intelligence" className="flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  Intelligence
                </TabsTrigger>
                <TabsTrigger value="security" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Security
                </TabsTrigger>
              </TabsList>

              <TabsContent value="performance">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        System Efficiency
                      </span>
                      <span className="text-sm font-bold text-green-600">97.8%</span>
                    </div>
                    <Progress value={97.8} className="h-3" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-blue-500" />
                        Response Time
                      </span>
                      <span className="text-sm font-bold text-blue-600">8ms</span>
                    </div>
                    <Progress value={95} className="h-3" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-purple-500" />
                        Success Rate
                      </span>
                      <span className="text-sm font-bold text-purple-600">99.2%</span>
                    </div>
                    <Progress value={99.2} className="h-3" />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="resources">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium flex items-center gap-2">
                        <Cpu className="h-4 w-4 text-blue-500" />
                        CPU Usage
                      </span>
                      <span className="text-sm font-bold text-blue-600">42%</span>
                    </div>
                    <Progress value={42} className="h-3" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium flex items-center gap-2">
                        <Database className="h-4 w-4 text-green-500" />
                        Memory Usage
                      </span>
                      <span className="text-sm font-bold text-green-600">58%</span>
                    </div>
                    <Progress value={58} className="h-3" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium flex items-center gap-2">
                        <Network className="h-4 w-4 text-purple-500" />
                        Network I/O
                      </span>
                      <span className="text-sm font-bold text-purple-600">24%</span>
                    </div>
                    <Progress value={24} className="h-3" />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="intelligence">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium flex items-center gap-2">
                        <Brain className="h-4 w-4 text-purple-500" />
                        Collective Intelligence
                      </span>
                      <span className="text-sm font-bold text-purple-600">94%</span>
                    </div>
                    <Progress value={94} className="h-3" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        Adaptability
                      </span>
                      <span className="text-sm font-bold text-green-600">96%</span>
                    </div>
                    <Progress value={96} className="h-3" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium flex items-center gap-2">
                        <Target className="h-4 w-4 text-orange-500" />
                        Innovation
                      </span>
                      <span className="text-sm font-bold text-orange-600">92%</span>
                    </div>
                    <Progress value={92} className="h-3" />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="security">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium flex items-center gap-2">
                        <Shield className="h-4 w-4 text-green-500" />
                        Security Score
                      </span>
                      <span className="text-sm font-bold text-green-600">98%</span>
                    </div>
                    <Progress value={98} className="h-3" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium flex items-center gap-2">
                        <Fingerprint className="h-4 w-4 text-blue-500" />
                        MFA Coverage
                      </span>
                      <span className="text-sm font-bold text-blue-600">100%</span>
                    </div>
                    <Progress value={100} className="h-3" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium flex items-center gap-2">
                        <Quantum className="h-4 w-4 text-purple-500" />
                        Encryption Level
                      </span>
                      <span className="text-sm font-bold text-purple-600">Quantum</span>
                    </div>
                    <Progress value={100} className="h-3" />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Premium Diamond-Grade Quick Actions */}
        <Card className="bg-gradient-to-br from-white via-purple-50 to-pink-50 dark:from-slate-800 dark:via-purple-900 dark:to-pink-900 border-2 border-purple-200 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="flex items-center gap-2">
                <Zap className="h-6 w-6 text-purple-600" />
                Quick Actions
                <Crown className="h-5 w-5 text-yellow-500" />
              </div>
            </CardTitle>
            <CardDescription className="text-lg">
              Access premium diamond-grade features and perform enterprise operations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link href="/ai-agents">
                <Button className="w-full h-auto p-6 flex flex-col items-center gap-3 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 shadow-lg" variant="default">
                  <Users className="h-8 w-8" />
                  <span className="font-semibold">AI Agents</span>
                  <span className="text-xs opacity-90">Manage Premium Agents</span>
                </Button>
              </Link>
              <Link href="/enhanced-ai-orchestrator">
                <Button className="w-full h-auto p-6 flex flex-col items-center gap-3 bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white border-0 shadow-lg" variant="default">
                  <Brain className="h-8 w-8" />
                  <span className="font-semibold">Enhanced AI</span>
                  <span className="text-xs opacity-90">Quantum Processing</span>
                </Button>
              </Link>
              <Link href="/glm-orchestrator-demo">
                <Button className="w-full h-auto p-6 flex flex-col items-center gap-3 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-0 shadow-lg" variant="default">
                  <Network className="h-8 w-8" />
                  <span className="font-semibold">GLM Orchestrator</span>
                  <span className="text-xs opacity-90">Enterprise Control</span>
                </Button>
              </Link>
              <Link href="/analytics">
                <Button className="w-full h-auto p-6 flex flex-col items-center gap-3 bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white border-0 shadow-lg" variant="default">
                  <BarChart3 className="h-8 w-8" />
                  <span className="font-semibold">Analytics</span>
                  <span className="text-xs opacity-90">Real-time Insights</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Premium Diamond-Grade Recent Activity */}
        <Card className="bg-white/80 backdrop-blur-sm border-2 border-blue-200 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-blue-600" />
                Recent Activity
                <Diamond className="h-5 w-5 text-blue-500" />
              </div>
            </CardTitle>
            <CardDescription className="text-lg">
              Latest premium diamond-grade system events and agent activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg border-l-4 border-green-500">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-green-800 dark:text-green-200">
                    GLM-4.5 Primary Orchestrator completed quantum security analysis
                  </div>
                  <div className="text-xs text-green-600 dark:text-green-400">2 minutes ago</div>
                </div>
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Success
                </Badge>
              </div>
              
              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg border-l-4 border-blue-500">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-blue-800 dark:text-blue-200">
                    Enhanced AI Agent completed neural network optimization
                  </div>
                  <div className="text-xs text-blue-600 dark:text-blue-400">5 minutes ago</div>
                </div>
                <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  <Settings className="h-3 w-3 mr-1" />
                  Processing
                </Badge>
              </div>
              
              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg border-l-4 border-purple-500">
                <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-purple-800 dark:text-purple-200">
                    Security AI Agent deployed zero-trust architecture updates
                  </div>
                  <div className="text-xs text-purple-600 dark:text-purple-400">8 minutes ago</div>
                </div>
                <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                  <Shield className="h-3 w-3 mr-1" />
                  Secured
                </Badge>
              </div>
              
              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg border-l-4 border-orange-500">
                <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-orange-800 dark:text-orange-200">
                    Analytics Engine processed 2.4M data points with 94.2% accuracy
                  </div>
                  <div className="text-xs text-orange-600 dark:text-orange-400">12 minutes ago</div>
                </div>
                <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                  <BarChart3 className="h-3 w-3 mr-1" />
                  Analyzed
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Premium Diamond-Grade Footer */}
        <div className="text-center py-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Crown className="h-5 w-5 text-yellow-500" />
            <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Premium Diamond-Grade Enterprise AI Platform
            </span>
            <Diamond className="h-5 w-5 text-blue-500" />
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Built with Next.js 15, TypeScript, and military-grade security. 
            <span className="mx-2">•</span>
            99.9% Uptime Guarantee
            <span className="mx-2">•</span>
            24/7 Premium Support
          </p>
        </div>
      </div>
    </div>
  );
}