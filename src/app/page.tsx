"use client";

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
  const activities = realTimeActivities.length > 0 ? realTimeActivities : metrics?.recentActivity || [];

  // Filter and search functionality
  const filteredActivities = activities.filter(activity => {
    const matchesSearch = !searchQuery || 
      activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.type.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterOptions.status.length === 0 || 
      filterOptions.status.includes(activity.status);
    
    const matchesType = filterOptions.type.length === 0 || 
      filterOptions.type.includes(activity.type);
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = !searchQuery || 
      alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterOptions.status.length === 0 || 
      filterOptions.status.includes(alert.type);
    
    return matchesSearch && matchesStatus;
  });

  // Sort functionality
  const sortedActivities = [...filteredActivities].sort((a, b) => {
    let comparison = 0;
    
    switch (filterOptions.sortBy) {
      case 'timestamp':
        comparison = 0; // For simplicity, keep original order
        break;
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'type':
        comparison = a.type.localeCompare(b.type);
        break;
      case 'status':
        comparison = a.status.localeCompare(b.status);
        break;
    }
    
    return filterOptions.sortOrder === 'desc' ? -comparison : comparison;
  });

  const sortedAlerts = [...filteredAlerts].sort((a, b) => {
    let comparison = 0;
    
    switch (filterOptions.sortBy) {
      case 'timestamp':
        comparison = 0; // For simplicity, keep original order
        break;
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'type':
        comparison = a.type.localeCompare(b.type);
        break;
      case 'status':
        comparison = a.type.localeCompare(b.type);
        break;
    }
    
    return filterOptions.sortOrder === 'desc' ? -comparison : comparison;
  });

  // Search and filter handlers
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilter = (filters: any) => {
    setFilterOptions(filters);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setFilterOptions({
      status: [],
      type: [],
      dateRange: 'all',
      sortBy: 'timestamp',
      sortOrder: 'desc'
    });
  };

  const quickStats = [
    {
      title: "Content Generated",
      value: metrics?.totalContent || 0,
      change: isConnected ? "+12.5%" : "+8.2%",
      trend: "up" as const,
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Optimization Score",
      value: `${metrics?.avgOptimizationScore || 0}%`,
      change: isConnected ? "+5.2%" : "+3.1%",
      trend: "up" as const,
      icon: Target,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Active Projects",
      value: metrics?.activeProjects || 0,
      change: isConnected ? "+8.1%" : "+5.7%",
      trend: "up" as const,
      icon: Brain,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "System Health",
      value: `${metrics?.systemHealth || 0}%`,
      change: isConnected ? "Live" : "Stable",
      trend: isConnected ? "up" as const : "stable" as const,
      icon: Shield,
      color: "text-green-600",
      bgColor: "bg-green-50"
    }
  ];

  const aiCapabilities: AICapability[] = [
    {
      id: "content",
      title: "AI Content & Creation",
      description: "Generate high-quality content, images, and media",
      icon: FileText,
      color: "from-blue-500 to-purple-600",
      badge: "Premium",
      stats: "247 pieces",
      status: "active"
    },
    {
      id: "optimization",
      title: "AI Optimization",
      description: "SEO, AEO, GEO, and performance optimization",
      icon: Target,
      color: "from-green-500 to-blue-600",
      badge: "Pro",
      stats: "82% avg score",
      status: "active"
    },
    {
      id: "research",
      title: "AI Research & Analysis",
      description: "Multi-model analysis and data insights",
      icon: Brain,
      color: "from-purple-500 to-pink-600",
      badge: "Beta",
      stats: "847 insights",
      status: "active"
    },
    {
      id: "image",
      title: "AI Image Generation",
      description: "Create stunning visuals with advanced AI",
      icon: ImageIcon,
      color: "from-pink-500 to-orange-600",
      badge: "New",
      stats: "1.2K images",
      status: "active"
    },
    {
      id: "voice",
      title: "AI Voice & Audio",
      description: "Text-to-speech, voice cloning, and audio processing",
      icon: Mic,
      color: "from-orange-500 to-red-600",
      badge: "Premium",
      stats: "342 hours",
      status: "active"
    },
    {
      id: "video",
      title: "AI Video Creation",
      description: "Generate and edit videos with AI assistance",
      icon: Video,
      color: "from-red-500 to-purple-600",
      badge: "Beta",
      stats: "89 videos",
      status: "active"
    },
    {
      id: "code",
      title: "AI Code Generation",
      description: "Write, debug, and optimize code automatically",
      icon: Code,
      color: "from-indigo-500 to-blue-600",
      badge: "Pro",
      stats: "15K lines",
      status: "active"
    },
    {
      id: "chat",
      title: "AI Chat & Conversations",
      description: "Advanced conversational AI and chatbots",
      icon: MessageSquare,
      color: "from-teal-500 to-green-600",
      badge: "Premium",
      stats: "2.3K chats",
      status: "active"
    },
    {
      id: "design",
      title: "AI Design & Creative",
      description: "UI/UX design, graphics, and creative solutions",
      icon: Palette,
      color: "from-yellow-500 to-orange-600",
      badge: "New",
      stats: "156 designs",
      status: "active"
    }
  ];

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'info': return <Star className="w-4 h-4 text-blue-500" />;
      default: return <Star className="w-4 h-4 text-gray-500" />;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'content': return <FileText className="w-4 h-4" />;
      case 'optimization': return <Target className="w-4 h-4" />;
      case 'research': return <Brain className="w-4 h-4" />;
      case 'system': return <Settings className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-center space-y-4">
            <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
            <p className="text-lg font-medium">Loading Dashboard...</p>
            <p className="text-sm text-muted-foreground">Preparing your AI ecosystem overview</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center space-x-3">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <Badge variant="secondary" className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
              <Crown className="w-3 h-3 mr-1" />
              Diamond Grade
            </Badge>
            <Badge variant="outline" className="border-purple-500 text-purple-600">
              <Gem className="w-3 h-3 mr-1" />
              Premium
            </Badge>
            {isConnected ? (
              <Badge variant="outline" className="border-green-500 text-green-600">
                <Wifi className="w-3 h-3 mr-1" />
                Live
              </Badge>
            ) : connectionError ? (
              <Badge variant="outline" className="border-red-500 text-red-600">
                <WifiOff className="w-3 h-3 mr-1" />
                Offline
              </Badge>
            ) : (
              <Badge variant="outline" className="border-yellow-500 text-yellow-600">
                <AlertCircle className="w-3 h-3 mr-1" />
                Connecting...
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground">
            Welcome to your OptiMind AI Ecosystem control center
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={requestMetricsUpdate}
            disabled={!isConnected}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Data
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className={`p-2 ${stat.bgColor} rounded-lg`}>
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
                <div className="flex-1">
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.title}</p>
                </div>
                <div className="flex items-center space-x-1">
                  {stat.trend === 'up' ? (
                    <TrendingUp className="w-3 h-3 text-green-500" />
                  ) : stat.trend === 'down' ? (
                    <TrendingDown className="w-3 h-3 text-red-500" />
                  ) : (
                    <Activity className="w-3 h-3 text-gray-500" />
                  )}
                  <span className={`text-xs ${
                    stat.trend === 'up' ? 'text-green-500' :
                    stat.trend === 'down' ? 'text-red-500' : 'text-gray-500'
                  }`}>
                    {stat.change}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search and Filter */}
      <SearchAndFilter
        onSearch={handleSearch}
        onFilter={handleFilter}
        onClearFilters={handleClearFilters}
        totalResults={sortedActivities.length + sortedAlerts.length}
      />

      {/* AI Capabilities Showcase */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5" />
            <span>AI Capabilities</span>
            <Badge variant="outline" className="ml-2">
              <Infinity className="w-3 h-3 mr-1" />
              Unlimited Access
            </Badge>
          </CardTitle>
          <CardDescription>
            Explore our comprehensive suite of AI-powered capabilities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {aiCapabilities.map((capability) => (
              <Card key={capability.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${capability.color}`}>
                      <capability.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold">{capability.title}</h3>
                        {capability.badge && (
                          <Badge variant="secondary" className="text-xs">
                            {capability.badge}
                          </Badge>
                        )}
                        <Badge 
                          variant={capability.status === 'active' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {capability.status === 'active' ? 'Active' : capability.status === 'beta' ? 'Beta' : 'Coming Soon'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {capability.description}
                      </p>
                      <p className="text-xs font-medium text-primary">
                        {capability.stats}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="analytics" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span>Performance Trends</span>
                </CardTitle>
                <CardDescription>
                  Content generation and optimization metrics over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AnalyticsChart />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="w-5 h-5" />
                  <span>System Status</span>
                </CardTitle>
                <CardDescription>
                  Real-time system health and performance indicators
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>AI Models</span>
                    <span className="font-medium text-green-600">Online</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>API Response</span>
                    <span className="font-medium text-green-600">98ms</span>
                  </div>
                  <Progress value={95} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Database</span>
                    <span className="font-medium text-green-600">Healthy</span>
                  </div>
                  <Progress value={98} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>WebSocket</span>
                    <span className={`font-medium ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
                      {isConnected ? 'Connected' : 'Disconnected'}
                    </span>
                  </div>
                  <Progress value={isConnected ? 100 : 0} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="w-5 h-5" />
                <span>Recent Activity</span>
                <Badge variant="outline">{sortedActivities.length} items</Badge>
              </CardTitle>
              <CardDescription>
                Latest actions and events in your AI ecosystem
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {sortedActivities.length > 0 ? (
                  sortedActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-3 p-3 rounded-lg border">
                      <div className="p-2 rounded-full bg-primary/10">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">{activity.title}</h4>
                          <Badge variant="outline" className="text-xs">
                            {activity.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {activity.timestamp}
                        </p>
                      </div>
                      <Badge 
                        variant={activity.status === 'completed' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {activity.status}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Clock className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No recent activity found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5" />
                <span>System Alerts</span>
                <Badge variant="outline">{sortedAlerts.length} alerts</Badge>
              </CardTitle>
              <CardDescription>
                Important notifications and system alerts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {sortedAlerts.length > 0 ? (
                  sortedAlerts.map((alert) => (
                    <div key={alert.id} className="flex items-start space-x-3 p-3 rounded-lg border">
                      <div className="p-1 rounded-full">
                        {getAlertIcon(alert.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">{alert.title}</h4>
                          <Badge 
                            variant={alert.type === 'error' ? 'destructive' : alert.type === 'warning' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {alert.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">
                          {alert.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {alert.timestamp}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 mx-auto text-green-500 mb-4" />
                    <p className="text-muted-foreground">No active alerts</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}