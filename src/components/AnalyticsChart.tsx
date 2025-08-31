"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Activity,
  Target,
  Brain,
  FileText,
  Users,
  Zap,
  RefreshCw,
  Calendar,
  Clock,
  Award,
  Star
} from "lucide-react";

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string[];
    borderColor?: string;
    borderWidth?: number;
  }[];
}

interface MetricCard {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  icon: any;
  color: string;
}

interface AnalyticsChartProps {
  className?: string;
}

export default function AnalyticsChart({ className }: AnalyticsChartProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [isLoading, setIsLoading] = useState(false);
  const [chartData, setChartData] = useState<ChartData | null>(null);

  const periods = [
    { value: '24h', label: '24 Hours' },
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' }
  ];

  const metricCards: MetricCard[] = [
    {
      title: "Total Content",
      value: "1,247",
      change: "+12.5%",
      trend: "up",
      icon: FileText,
      color: "text-blue-600"
    },
    {
      title: "Optimization Score",
      value: "87%",
      change: "+5.2%",
      trend: "up",
      icon: Target,
      color: "text-green-600"
    },
    {
      title: "Active Projects",
      value: "23",
      change: "+8.1%",
      trend: "up",
      icon: Brain,
      color: "text-purple-600"
    },
    {
      title: "System Health",
      value: "96%",
      change: "Stable",
      trend: "stable",
      icon: Activity,
      color: "text-green-600"
    }
  ];

  // Generate mock chart data based on selected period
  const generateChartData = (period: string): ChartData => {
    const dataPoints = period === '24h' ? 24 : period === '7d' ? 7 : period === '30d' ? 30 : 90;
    const labels = [];
    const contentData = [];
    const optimizationData = [];
    const projectsData = [];

    for (let i = 0; i < dataPoints; i++) {
      if (period === '24h') {
        labels.push(`${i}:00`);
      } else {
        labels.push(`Day ${i + 1}`);
      }
      
      contentData.push(Math.floor(Math.random() * 50) + 100);
      optimizationData.push(Math.floor(Math.random() * 20) + 70);
      projectsData.push(Math.floor(Math.random() * 10) + 15);
    }

    return {
      labels,
      datasets: [
        {
          label: 'Content Generated',
          data: contentData,
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
          borderColor: 'rgb(59, 130, 246)',
          borderWidth: 2
        },
        {
          label: 'Optimization Score',
          data: optimizationData,
          backgroundColor: 'rgba(16, 185, 129, 0.5)',
          borderColor: 'rgb(16, 185, 129)',
          borderWidth: 2
        },
        {
          label: 'Active Projects',
          data: projectsData,
          backgroundColor: 'rgba(139, 92, 246, 0.5)',
          borderColor: 'rgb(139, 92, 246)',
          borderWidth: 2
        }
      ]
    };
  };

  const loadChartData = async (period: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      const data = generateChartData(period);
      setChartData(data);
    } catch (error) {
      console.error('Failed to load chart data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadChartData(selectedPeriod);
  }, [selectedPeriod]);

  const handleRefresh = () => {
    loadChartData(selectedPeriod);
  };

  // Simple bar chart rendering using CSS
  const renderBarChart = (data: ChartData) => {
    const maxValue = Math.max(...data.datasets.flatMap(d => d.data));
    
    return (
      <div className="space-y-4">
        {data.datasets.map((dataset, datasetIndex) => (
          <div key={datasetIndex} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{dataset.label}</span>
              <Badge variant="outline" className="text-xs">
                {dataset.data.reduce((a, b) => a + b, 0).toLocaleString()} total
              </Badge>
            </div>
            <div className="space-y-1">
              {data.labels.map((label, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span className="text-xs text-muted-foreground w-12">{label}</span>
                  <div className="flex-1 bg-muted rounded-full h-2 relative overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${(dataset.data[index] / maxValue) * 100}%`,
                        backgroundColor: dataset.backgroundColor
                      }}
                    />
                  </div>
                  <span className="text-xs font-medium w-8 text-right">
                    {dataset.data[index]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5" />
              <span>Analytics & Performance</span>
            </CardTitle>
            <CardDescription>
              Real-time metrics and performance insights
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Tabs value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <TabsList>
                {periods.map((period) => (
                  <TabsTrigger key={period.value} value={period.value}>
                    {period.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metricCards.map((metric, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <metric.icon className={`w-4 h-4 ${metric.color}`} />
                  <span className="text-sm font-medium">{metric.title}</span>
                </div>
                {metric.trend === 'up' ? (
                  <TrendingUp className="w-3 h-3 text-green-500" />
                ) : metric.trend === 'down' ? (
                  <TrendingDown className="w-3 h-3 text-red-500" />
                ) : (
                  <Activity className="w-3 h-3 text-gray-500" />
                )}
              </div>
              <div className="mt-2">
                <p className="text-xl font-bold">{metric.value}</p>
                <p className={`text-xs ${
                  metric.trend === 'up' ? 'text-green-600' :
                  metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {metric.change}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* Chart */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Performance Trends</h3>
            <div className="flex items-center space-x-2">
              <Badge variant="outline">
                <Clock className="w-3 h-3 mr-1" />
                Live Data
              </Badge>
              <Badge variant="outline">
                <Zap className="w-3 h-3 mr-1" />
                Real-time
              </Badge>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center space-y-4">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto text-muted-foreground" />
                <p className="text-muted-foreground">Loading analytics data...</p>
              </div>
            </div>
          ) : chartData ? (
            <div className="border rounded-lg p-4 bg-muted/20">
              {renderBarChart(chartData)}
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              <div className="text-center space-y-4">
                <BarChart3 className="w-8 h-8 mx-auto opacity-50" />
                <p>No data available</p>
              </div>
            </div>
          )}
        </div>

        {/* Key Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Award className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium">Top Performer</span>
            </div>
            <p className="text-lg font-bold">Content Generation</p>
            <p className="text-xs text-muted-foreground">+12.5% growth this period</p>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Star className="w-4 h-4 text-purple-500" />
              <span className="text-sm font-medium">Optimization</span>
            </div>
            <p className="text-lg font-bold">87% Avg Score</p>
            <p className="text-xs text-muted-foreground">Above target by 7%</p>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium">Efficiency</span>
            </div>
            <p className="text-lg font-bold">96% Health</p>
            <p className="text-xs text-muted-foreground">All systems optimal</p>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}