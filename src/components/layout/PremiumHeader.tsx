'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Brain, 
  Crown, 
  Diamond, 
  Sparkles, 
  Activity, 
  Zap, 
  Shield, 
  CheckCircle, 
  Star,
  Users,
  Cpu,
  Database,
  Server,
  Wifi,
  Globe,
  TrendingUp,
  Target,
  Award,
  Rocket,
  Settings,
  Bell,
  Search,
  User,
  LogOut
} from 'lucide-react';

export default function PremiumHeader() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [systemStats, setSystemStats] = useState({
    cpu: 78,
    memory: 65,
    network: 98,
    health: 100,
    activeAgents: 12,
    tasksRunning: 48,
    successRate: 99.8
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      // Simulate real-time system updates
      setSystemStats(prev => ({
        ...prev,
        cpu: Math.max(20, Math.min(95, prev.cpu + (Math.random() - 0.5) * 2)),
        memory: Math.max(30, Math.min(85, prev.memory + (Math.random() - 0.5) * 2)),
        network: Math.max(90, Math.min(100, prev.network + (Math.random() - 0.5) * 1)),
        tasksRunning: Math.max(20, Math.min(80, prev.tasksRunning + Math.floor((Math.random() - 0.5) * 4)))
      }));
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  return (
    <header className="bg-gradient-to-r from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-blue-900 dark:to-purple-900 border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 py-6">
        {/* Top Status Bar */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Brain className="h-8 w-8 text-blue-600" />
                <Diamond className="h-3 w-3 text-purple-600 fill-purple-600 absolute -top-1 -right-1" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  OptiMind AI Ecosystem
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Premium Diamond Grade Enterprise Platform
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <CheckCircle className="h-3 w-3 mr-1" />
              {systemStats.health}% System Health
            </Badge>
            <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <Activity className="h-3 w-3 mr-1" />
              {systemStats.activeAgents} AI Agents
            </Badge>
            <Badge className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <Cpu className="h-3 w-3 mr-1" />
              {systemStats.tasksRunning} Tasks
            </Badge>
            <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black">
              <Crown className="h-3 w-3 mr-1" />
              Premium
            </Badge>
          </div>
        </div>

        {/* System Status Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">CPU Usage</p>
                  <p className="text-lg font-bold text-blue-600">{systemStats.cpu.toFixed(1)}%</p>
                </div>
                <Cpu className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Memory</p>
                  <p className="text-lg font-bold text-green-600">{systemStats.memory.toFixed(1)}%</p>
                </div>
                <Database className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Network</p>
                  <p className="text-lg font-bold text-purple-600">{systemStats.network.toFixed(1)}%</p>
                </div>
                <Wifi className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-orange-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Success Rate</p>
                  <p className="text-lg font-bold text-orange-600">{systemStats.successRate}%</p>
                </div>
                <Target className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-red-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Security</p>
                  <p className="text-lg font-bold text-red-600">Military</p>
                </div>
                <Shield className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-yellow-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Uptime</p>
                  <p className="text-lg font-bold text-yellow-600">99.99%</p>
                </div>
                <Server className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
              <Rocket className="h-4 w-4 mr-2" />
              Quick Launch
            </Button>
            <Button size="sm" variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button size="sm" variant="outline" className="border-green-200 text-green-600 hover:bg-green-50">
              <TrendingUp className="h-4 w-4 mr-2" />
              Analytics
            </Button>
          </div>

          <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
            <span>{currentTime.toLocaleDateString()}</span>
            <span>•</span>
            <span>{currentTime.toLocaleTimeString()}</span>
            <Badge className="bg-green-100 text-green-800 border-green-200">
              <CheckCircle className="h-3 w-3 mr-1" />
              All Systems Operational
            </Badge>
          </div>
        </div>
      </div>
    </header>
  );
}