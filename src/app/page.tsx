/**
 * OptiMind AI Ecosystem - Main Dashboard
 * Premium Diamond Grade AI Services Platform
 */

'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useRealTimeDashboard } from "@/hooks/useRealTimeDashboard";
import SearchAndFilter from "@/components/SearchAndFilter";
import AnalyticsChart from "@/components/AnalyticsChart";
import {
  BarChart3,
  FileText,
  Target,
  Brain,
  Image as ImageIcon,
  Settings,
  Shield,
  Users,
  Zap,
  Sparkles,
  Crown,
  TrendingUp,
  TrendingDown,
  Activity,
  Database,
  Globe,
  Search,
  CheckCircle,
  AlertTriangle,
  Clock,
  Rocket,
  Award,
  Star,
  Eye,
  RefreshCw,
  Plus,
  ArrowRight,
  Loader2,
  Cpu,
  Network,
  Palette,
  Mic,
  Video,
  Code,
  MessageSquare,
  Lightbulb,
  Fingerprint,
  Gem,
  Infinity,
  Wifi,
  WifiOff,
  AlertCircle
} from "lucide-react";

interface DashboardMetrics {
  totalContent: number;
  avgOptimizationScore: number;
  activeProjects: number;
  systemHealth: number;
  recentActivity: Array<{
    id: string;
    type: string;
    title: string;
    timestamp: string;
    status: string;
  }>;
}

interface SystemAlert {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  description: string;
  timestamp: string;
}

interface AICapability {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  badge?: string;
  stats: string;
  status: 'active' | 'beta' | 'coming-soon';
}

export default function Dashboard() {
  const {
    metrics: realTimeMetrics,
    alerts: realTimeAlerts,
    activities: realTimeActivities,
    isConnected,
    connectionError,
    requestMetricsUpdate,
    monitorActivity,
    sendSystemAlert
  } = useRealTimeDashboard();

  const [fallbackMetrics, setFallbackMetrics] = useState<DashboardMetrics | null>(null);
  const [fallbackAlerts, setFallbackAlerts] = useState<SystemAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOptions, setFilterOptions] = useState({
    status: [] as string[],
    type: [] as string[],
    dateRange: 'all' as string,
    sortBy: 'timestamp' as string,
    sortOrder: 'desc' as 'asc' | 'desc'
  });

  // Load fallback data if WebSocket is not available
  useEffect(() => {
    if (!isConnected && !connectionError) {
      const loadFallbackData = async () => {
        setIsLoading(true);
        try {
          const [metricsResponse, alertsResponse] = await Promise.all([
            fetch('/api/analytics'),
            fetch('/api/health')
          ]);

          if (metricsResponse.ok) {
            const metricsData = await metricsResponse.json();
            setFallbackMetrics({
              totalContent: metricsData.totalContent || 1247,
              avgOptimizationScore: metricsData.avgOptimizationScore || 87,
              activeProjects: metricsData.activeProjects || 23,
              systemHealth: metricsData.systemHealth || 96,
              recentActivity: metricsData.recentActivity || []
            });
          }

          if (alertsResponse.ok) {
            const healthData = await alertsResponse.json();
            setFallbackAlerts(healthData.alerts || []);
          }
        } catch (error) {
          console.error('Failed to load fallback data:', error);
        } finally {
          setIsLoading(false);
        }
      };

      loadFallbackData();
    }
  }, [isConnected, connectionError]);

  // Use real-time data if available, otherwise use fallback
  const metrics = realTimeMetrics || fallbackMetrics;
  const alerts = realTimeAlerts.length > 0 ? realTimeAlerts : fallbackAlerts;
  const activities = realTimeActivities.length > 0 ? realTimeActivities : (metrics?.recentActivity || []);

  // AI Capabilities
  const aiCapabilities: AICapability[] = [
    {
      id: 'content-creation',
      title: 'AI Content Creation',
      description: 'Generate high-quality content with advanced AI models',
      icon: FileText,
      color: 'text-blue-600',
      badge: 'Premium',
      stats: '1,247 items',
      status: 'active'
    },
    {
      id: 'image-analysis',
      title: 'Multi-Model Image Analysis',
      description: 'Advanced image recognition and content moderation',
      icon: ImageIcon,
      color: 'text-purple-600',
      badge: 'Enterprise',
      stats: '99.2% accuracy',
      status: 'active'
    },
    {
      id: 'code-assistance',
      title: 'AI Code Assistant',
      description: 'Intelligent code generation and optimization',
      icon: Code,
      color: 'text-green-600',
      stats: '45 languages',
      status: 'active'
    },
    {
      id: 'research-analysis',
      title: 'Research & Analysis',
      description: 'Deep research and competitive analysis',
      icon: Search,
      color: 'text-orange-600',
      badge: 'Beta',
      stats: 'Real-time',
      status: 'beta'
    },
    {
      id: 'security-monitoring',
      title: 'Security Monitoring',
      description: 'Advanced threat detection and security analysis',
      icon: Shield,
      color: 'text-red-600',
      badge: 'Enterprise',
      stats: '24/7 monitoring',
      status: 'active'
    },
    {
      id: 'blockchain-storage',
      title: 'Blockchain Storage',
      description: 'Secure decentralized storage solutions',
      icon: Database,
      color: 'text-indigo-600',
      stats: 'Immutable',
      status: 'coming-soon'
    }
  ];

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error': return <AlertCircle className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'success': return <CheckCircle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'beta': return 'bg-yellow-500';
      case 'coming-soon': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading OptiMind AI Ecosystem...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Gem className="h-8 w-8 text-purple-600" />
            OptiMind AI Ecosystem
          </h1>
          <p className="text-muted-foreground mt-1">
            Premium Diamond Grade AI Services Platform
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-purple-600 border-purple-600">
            <Crown className="h-3 w-3 mr-1" />
            Premium Diamond
          </Badge>
          <Badge variant={isConnected ? "default" : "secondary"}>
            {isConnected ? <Wifi className="h-3 w-3 mr-1" /> : <WifiOff className="h-3 w-3 mr-1" />}
            {isConnected ? "Real-time" : "Offline"}
          </Badge>
        </div>
      </div>

      {/* Key Metrics */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Content</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalContent.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Optimization</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.avgOptimizationScore}%</div>
              <p className="text-xs text-muted-foreground">
                +5% from last week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.activeProjects}</div>
              <p className="text-xs text-muted-foreground">
                +3 new this week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Health</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.systemHealth}%</div>
              <Progress value={metrics.systemHealth} className="mt-2" />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="capabilities">AI Capabilities</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* AI Capabilities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {aiCapabilities.map((capability) => (
              <Card key={capability.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <capability.icon className={`h-6 w-6 ${capability.color}`} />
                    <div className="flex items-center gap-2">
                      {capability.badge && (
                        <Badge variant="outline" className="text-xs">
                          {capability.badge}
                        </Badge>
                      )}
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getStatusColor(capability.status)} text-white border-none`}
                      >
                        {capability.status.replace('-', ' ')}
                      </Badge>
                    </div>
                  </div>
                  <CardTitle className="text-lg">{capability.title}</CardTitle>
                  <CardDescription>{capability.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{capability.stats}</span>
                    <Button variant="outline" size="sm">
                      Explore <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recent Alerts */}
          {alerts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>System Alerts</CardTitle>
                <CardDescription>Recent system notifications and alerts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {alerts.slice(0, 5).map((alert) => (
                    <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg border">
                      {getAlertIcon(alert.type)}
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{alert.title}</h4>
                          <span className="text-xs text-muted-foreground">
                            {new Date(alert.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {alert.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="capabilities" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {aiCapabilities.map((capability) => (
              <Card key={capability.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <capability.icon className={`h-8 w-8 ${capability.color}`} />
                    <div className="flex items-center gap-2">
                      {capability.badge && (
                        <Badge variant="outline">{capability.badge}</Badge>
                      )}
                      <Badge 
                        variant="outline" 
                        className={`${getStatusColor(capability.status)} text-white border-none`}
                      >
                        {capability.status.replace('-', ' ')}
                      </Badge>
                    </div>
                  </div>
                  <CardTitle>{capability.title}</CardTitle>
                  <CardDescription>{capability.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Performance</span>
                      <span className="font-medium">{capability.stats}</span>
                    </div>
                    <Button className="w-full">
                      Launch {capability.title}
                      <Rocket className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest system activities and events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities.length > 0 ? (
                  activities.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg border">
                      <Activity className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{activity.title}</h4>
                          <Badge variant="outline">{activity.type}</Badge>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-sm text-muted-foreground">
                            {new Date(activity.timestamp).toLocaleString()}
                          </span>
                          <Badge variant="secondary">{activity.status}</Badge>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    No recent activity found
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Analytics</CardTitle>
                <CardDescription>System performance metrics over time</CardDescription>
              </CardHeader>
              <CardContent>
                <AnalyticsChart />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Usage Statistics</CardTitle>
                <CardDescription>AI service usage patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Content Generation</span>
                    <div className="flex items-center gap-2">
                      <Progress value={85} className="w-20" />
                      <span className="text-sm font-medium">85%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Image Analysis</span>
                    <div className="flex items-center gap-2">
                      <Progress value={92} className="w-20" />
                      <span className="text-sm font-medium">92%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Code Assistance</span>
                    <div className="flex items-center gap-2">
                      <Progress value={78} className="w-20" />
                      <span className="text-sm font-medium">78%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Research Analysis</span>
                    <div className="flex items-center gap-2">
                      <Progress value={65} className="w-20" />
                      <span className="text-sm font-medium">65%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}