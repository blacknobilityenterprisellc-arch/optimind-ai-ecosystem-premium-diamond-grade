'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Zap,
  Activity,
  Target,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';

interface AnalyticsData {
  totalProcessed: number;
  safeContent: number;
  flaggedContent: number;
  pendingReview: number;
  avgProcessingTime: number;
  systemHealth: 'excellent' | 'good' | 'warning' | 'critical';
  modelAccuracy: {
    vision: number;
    air: number;
    text: number;
    consensus: number;
  };
  recentActivity: Array<{
    id: string;
    timestamp: string;
    action: string;
    status: 'success' | 'warning' | 'error';
    details: string;
  }>;
  contentCategories: Array<{
    category: string;
    count: number;
    percentage: number;
  }>;
  performanceMetrics: {
    throughput: number;
    errorRate: number;
    uptime: number;
    responseTime: number;
  };
}

export function ModerationAnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Simulate fetching analytics data
  useEffect(() => {
    fetchAnalyticsData();
    const interval = setInterval(fetchAnalyticsData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchAnalyticsData = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData: AnalyticsData = {
        totalProcessed: 15420,
        safeContent: 12890,
        flaggedContent: 1840,
        pendingReview: 690,
        avgProcessingTime: 3.4,
        systemHealth: 'excellent',
        modelAccuracy: {
          vision: 94.2,
          air: 96.8,
          text: 92.1,
          consensus: 97.5
        },
        recentActivity: [
          {
            id: '1',
            timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
            action: 'Image Analysis',
            status: 'success',
            details: 'Processed 15 images in batch'
          },
          {
            id: '2',
            timestamp: new Date(Date.now() - 12 * 60000).toISOString(),
            action: 'Review Queue',
            status: 'warning',
            details: '3 items require immediate review'
          },
          {
            id: '3',
            timestamp: new Date(Date.now() - 25 * 60000).toISOString(),
            action: 'System Health',
            status: 'success',
            details: 'All models operating normally'
          }
        ],
        contentCategories: [
          { category: 'Safe Content', count: 12890, percentage: 83.6 },
          { category: 'Adult Content', count: 1240, percentage: 8.0 },
          { category: 'Violence', count: 320, percentage: 2.1 },
          { category: 'Hate Speech', count: 180, percentage: 1.2 },
          { category: 'Other', count: 100, percentage: 5.1 }
        ],
        performanceMetrics: {
          throughput: 45.2, // images per minute
          errorRate: 0.8, // percentage
          uptime: 99.9, // percentage
          responseTime: 850 // milliseconds
        }
      };
      
      setAnalytics(mockData);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'good': return 'text-blue-600 bg-blue-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Failed to load analytics data. Please try again.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Moderation Analytics</h2>
          <p className="text-muted-foreground">
            Real-time insights into content moderation performance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline" size="sm" onClick={fetchAnalyticsData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Processed</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalProcessed.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Safe Content</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{analytics.safeContent.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {((analytics.safeContent / analytics.totalProcessed) * 100).toFixed(1)}% safe rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Flagged Content</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{analytics.flaggedContent.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {((analytics.flaggedContent / analytics.totalProcessed) * 100).toFixed(1)}% flagged rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Processing Time</CardTitle>
            <Zap className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.avgProcessingTime}s</div>
            <p className="text-xs text-muted-foreground">
              95% faster than manual review
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="models">Model Performance</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="categories">Content Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* System Health */}
            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
                <CardDescription>Overall system status and performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Status</span>
                  <Badge className={getHealthColor(analytics.systemHealth)}>
                    {analytics.systemHealth.charAt(0).toUpperCase() + analytics.systemHealth.slice(1)}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Uptime</span>
                    <span>{analytics.performanceMetrics.uptime}%</span>
                  </div>
                  <Progress value={analytics.performanceMetrics.uptime} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Error Rate</span>
                    <span>{analytics.performanceMetrics.errorRate}%</span>
                  </div>
                  <Progress value={analytics.performanceMetrics.errorRate} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Response Time</span>
                    <span>{analytics.performanceMetrics.responseTime}ms</span>
                  </div>
                  <Progress value={Math.max(0, 100 - (analytics.performanceMetrics.responseTime / 10))} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Real-time performance indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Throughput</span>
                  <span className="font-semibold">{analytics.performanceMetrics.throughput} images/min</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Pending Review</span>
                  <Badge variant="outline">{analytics.pendingReview} items</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Accuracy Rate</span>
                  <span className="font-semibold text-green-600">{analytics.modelAccuracy.consensus}%</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Last Updated</span>
                  <span className="text-xs text-muted-foreground">
                    {lastUpdated.toLocaleTimeString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="models" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Model Performance</CardTitle>
              <CardDescription>Accuracy and performance metrics for each AI model</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(analytics.modelAccuracy).map(([model, accuracy]) => (
                <div key={model} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium capitalize">{model}</span>
                    <span className="text-sm font-semibold">{accuracy}%</span>
                  </div>
                  <Progress value={accuracy} className="h-3" />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest system events and actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg border">
                    {getStatusIcon(activity.status)}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{activity.action}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(activity.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{activity.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Content Categories</CardTitle>
              <CardDescription>Breakdown of analyzed content by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.contentCategories.map((category) => (
                  <div key={category.category} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{category.category}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {category.count.toLocaleString()}
                        </span>
                        <Badge variant="outline">{category.percentage.toFixed(1)}%</Badge>
                      </div>
                    </div>
                    <Progress value={category.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}