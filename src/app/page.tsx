/**
 * OptiMind AI Ecosystem - Main Dashboard
 * Premium Diamond Grade AI Services Platform
 */

'use client';

import { useState, useEffect } from "react";
import React from "react";
import {
  FileText,
  Image as ImageIcon,
  Shield,
  Users,
  TrendingUp,
  Activity,
  Database,
  Search,
  CheckCircle,
  AlertTriangle,
  Rocket,
  Gem,
  Wifi,
  WifiOff,
  AlertCircle,
  Crown,
  ArrowRight,
  Loader2,
  Code
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useRealTimeDashboard } from "@/hooks/useRealTimeDashboard";
import AnalyticsChart from "@/components/AnalyticsChart";

// Constants for magic numbers
const DEFAULT_CONTENT_COUNT = 1247;
const DEFAULT_OPTIMIZATION_SCORE = 87;
const DEFAULT_ACTIVE_PROJECTS = 23;
const DEFAULT_SYSTEM_HEALTH = 96;
const MAX_ALERTS_DISPLAY = 5;

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
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  badge?: string;
  stats: string;
  status: 'active' | 'beta' | 'coming-soon';
}

// Helper components
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

const DashboardHeader = ({ isConnected }: { isConnected: boolean }) => (
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
);

const MetricsCards = ({ metrics }: { metrics?: DashboardMetrics | null }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Content</CardTitle>
        <FileText className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{metrics?.totalContent.toLocaleString()}</div>
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
        <div className="text-2xl font-bold">{metrics?.avgOptimizationScore}%</div>
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
        <div className="text-2xl font-bold">{metrics?.activeProjects}</div>
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
        <div className="text-2xl font-bold">{metrics?.systemHealth}%</div>
        <Progress value={metrics?.systemHealth} className="mt-2" />
      </CardContent>
    </Card>
  </div>
);

const AICapabilitiesGrid = ({ aiCapabilities }: { aiCapabilities: AICapability[] }) => (
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
);

const SystemAlertsSection = ({ alerts }: { alerts: SystemAlert[] }) => {
  if (alerts.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Alerts</CardTitle>
        <CardDescription>Recent system notifications and alerts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alerts.slice(0, MAX_ALERTS_DISPLAY).map((alert) => (
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
  );
};

const AICapabilitiesDetailed = ({ aiCapabilities }: { aiCapabilities: AICapability[] }) => (
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
);

const ActivitySection = ({ activities }: { activities: DashboardMetrics['recentActivity'] }) => (
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
                  <span className="text-xs text-muted-foreground">
                    {new Date(activity.timestamp).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {activity.type} - {activity.status}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted-foreground">No recent activity</p>
        )}
      </div>
    </CardContent>
  </Card>
);

const useDashboardData = () => {
  const {
    metrics: realTimeMetrics,
    alerts: realTimeAlerts,
    activities: realTimeActivities,
    isConnected,
    connectionError
  } = useRealTimeDashboard();

  const [fallbackMetrics, setFallbackMetrics] = useState<DashboardMetrics | null>(null);
  const [fallbackAlerts, setFallbackAlerts] = useState<SystemAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
              totalContent: metricsData.totalContent || DEFAULT_CONTENT_COUNT,
              avgOptimizationScore: metricsData.avgOptimizationScore || DEFAULT_OPTIMIZATION_SCORE,
              activeProjects: metricsData.activeProjects || DEFAULT_ACTIVE_PROJECTS,
              systemHealth: metricsData.systemHealth || DEFAULT_SYSTEM_HEALTH,
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

  return {
    metrics,
    alerts,
    activities,
    isConnected,
    isLoading
  };
};

const getAICapabilities = (): AICapability[] => [
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

export default function Dashboard() {
  const { metrics, alerts, activities, isConnected, isLoading } = useDashboardData();
  const aiCapabilities = getAICapabilities();

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
      <DashboardHeader isConnected={isConnected} />

      {/* Key Metrics */}
      {metrics && <MetricsCards metrics={metrics} />}

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
          <AICapabilitiesGrid aiCapabilities={aiCapabilities} />

          {/* Recent Alerts */}
          <SystemAlertsSection alerts={alerts} />
        </TabsContent>

        <TabsContent value="capabilities" className="space-y-4">
          <AICapabilitiesDetailed aiCapabilities={aiCapabilities} />
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <ActivitySection activities={activities} />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <AnalyticsChart />
        </TabsContent>
      </Tabs>
    </div>
  );
}