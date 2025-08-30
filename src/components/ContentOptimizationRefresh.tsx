"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  RefreshCw, 
  TrendingUp, 
  Target, 
  BarChart3, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  FileText,
  Search,
  Users,
  Eye,
  ThumbsUp,
  Zap,
  Loader2,
  Calendar,
  Award,
  Lightbulb,
  ArrowRight
} from "lucide-react";
import ContentFreshnessDetector from "@/components/ContentFreshnessDetector";
import CompetitorContentAnalyzer from "@/components/CompetitorContentAnalyzer";

interface ContentItem {
  id: string;
  title: string;
  url: string;
  lastUpdated: string;
  freshnessScore: number;
  performanceScore: number;
  optimizationScore: number;
  status: 'fresh' | 'needs_refresh' | 'outdated';
  wordCount: number;
  category: string;
}

interface CompetitorAnalysis {
  id: string;
  competitor: string;
  url: string;
  title: string;
  ranking: number;
  contentScore: number;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
}

interface RefreshRecommendation {
  id: string;
  contentId: string;
  type: 'update_statistics' | 'add_new_section' | 'improve_readability' | 'add_examples' | 'update_keywords';
  priority: 'high' | 'medium' | 'low';
  description: string;
  impact: number; // 0-100
  effort: number; // 0-100
  estimatedTime: string;
}

interface PerformanceMetrics {
  pageViews: number;
  organicTraffic: number;
  bounceRate: number;
  timeOnPage: number;
  conversions: number;
  keywordRankings: number;
  socialShares: number;
}

export default function ContentOptimizationRefresh() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedContent, setSelectedContent] = useState("");
  const [competitorUrl, setCompetitorUrl] = useState("");
  const [analysisResults, setAnalysisResults] = useState<any>(null);

  // Mock data for demonstration
  const contentItems: ContentItem[] = [
    {
      id: "1",
      title: "Voice Search Optimization Guide 2024",
      url: "/blog/voice-search-optimization",
      lastUpdated: "2024-01-15",
      freshnessScore: 85,
      performanceScore: 78,
      optimizationScore: 72,
      status: 'needs_refresh',
      wordCount: 2500,
      category: "Guide"
    },
    {
      id: "2",
      title: "AI Content Creation Best Practices",
      url: "/blog/ai-content-creation",
      lastUpdated: "2024-02-20",
      freshnessScore: 92,
      performanceScore: 85,
      optimizationScore: 88,
      status: 'fresh',
      wordCount: 3200,
      category: "Article"
    },
    {
      id: "3",
      title: "Local SEO Strategies for Small Businesses",
      url: "/blog/local-seo-strategies",
      lastUpdated: "2023-11-10",
      freshnessScore: 45,
      performanceScore: 52,
      optimizationScore: 48,
      status: 'outdated',
      wordCount: 1800,
      category: "Strategy"
    }
  ];

  const competitorAnalyses: CompetitorAnalysis[] = [
    {
      id: "1",
      competitor: "Competitor A",
      url: "https://competitor-a.com/voice-search-guide",
      title: "Complete Voice Search Optimization",
      ranking: 1,
      contentScore: 88,
      strengths: ["Comprehensive coverage", "Recent statistics", "Video examples"],
      weaknesses: ["Long loading time", "Poor mobile optimization"],
      opportunities: ["Add case studies", "Include expert quotes"]
    },
    {
      id: "2",
      competitor: "Competitor B",
      url: "https://competitor-b.com/voice-seo",
      title: "Voice SEO: The Ultimate Guide",
      ranking: 3,
      contentScore: 82,
      strengths: ["Clear structure", "Actionable tips", "Good examples"],
      weaknesses: ["Outdated information", "Missing recent trends"],
      opportunities: ["Update statistics", "Add 2024 trends"]
    }
  ];

  const refreshRecommendations: RefreshRecommendation[] = [
    {
      id: "1",
      contentId: "1",
      type: "update_statistics",
      priority: "high",
      description: "Update voice search statistics with 2024 data",
      impact: 85,
      effort: 30,
      estimatedTime: "2 hours"
    },
    {
      id: "2",
      contentId: "1",
      type: "add_new_section",
      priority: "medium",
      description: "Add section on AI assistant optimization",
      impact: 75,
      effort: 60,
      estimatedTime: "4 hours"
    },
    {
      id: "3",
      contentId: "3",
      type: "update_keywords",
      priority: "high",
      description: "Refresh keyword strategy for local SEO",
      impact: 90,
      effort: 45,
      estimatedTime: "3 hours"
    }
  ];

  const performanceMetrics: PerformanceMetrics = {
    pageViews: 15420,
    organicTraffic: 8930,
    bounceRate: 42,
    timeOnPage: 245,
    conversions: 186,
    keywordRankings: 12,
    socialShares: 342
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'fresh': return 'text-green-600';
      case 'needs_refresh': return 'text-yellow-600';
      case 'outdated': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'fresh': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'needs_refresh': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'outdated': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <div className="w-4 h-4 rounded-full bg-gray-400" />;
    }
  };

  const handleAnalyzeContent = async () => {
    if (!selectedContent) return;
    
    setIsAnalyzing(true);
    // Simulate API call
    setTimeout(() => {
      setAnalysisResults({
        freshness: 78,
        performance: 82,
        optimization: 75,
        recommendations: refreshRecommendations.filter(r => r.contentId === selectedContent)
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  const handleAnalyzeCompetitor = async () => {
    if (!competitorUrl) return;
    
    setIsAnalyzing(true);
    // Simulate API call
    setTimeout(() => {
      setAnalysisResults({
        competitor: competitorAnalyses[0],
        gaps: ["Missing case studies", "No video content", "Limited examples"],
        opportunities: ["Add expert interviews", "Include data visualizations", "Create comparison charts"]
      });
      setIsAnalyzing(false);
    }, 2500);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Badge variant="secondary" className="px-4 py-2">
            <RefreshCw className="w-4 h-4 mr-2" />
            Module 2
          </Badge>
        </div>
        <h2 className="text-4xl font-bold">Content Optimization & Refresh</h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Keep your content fresh, competitive, and performing at its best with AI-powered optimization and refresh strategies
        </p>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Input Section */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600" />
                Content Analysis
              </CardTitle>
              <CardDescription>
                Analyze your content for freshness and optimization opportunities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Select Content</label>
                <Select value={selectedContent} onValueChange={setSelectedContent}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose content to analyze" />
                  </SelectTrigger>
                  <SelectContent>
                    {contentItems.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button 
                onClick={handleAnalyzeContent} 
                disabled={!selectedContent || isAnalyzing}
                className="w-full"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Analyze Content
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                Competitor Analysis
              </CardTitle>
              <CardDescription>
                Analyze competitor content to identify gaps and opportunities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Competitor URL</label>
                <Input
                  placeholder="Enter competitor URL..."
                  value={competitorUrl}
                  onChange={(e) => setCompetitorUrl(e.target.value)}
                />
              </div>
              <Button 
                onClick={handleAnalyzeCompetitor} 
                disabled={!competitorUrl || isAnalyzing}
                className="w-full"
                variant="outline"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Analyze Competitor
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-green-600" />
                Content Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Total Content</span>
                  <span className="text-sm font-medium">{contentItems.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Fresh Content</span>
                  <span className="text-sm font-medium text-green-600">
                    {contentItems.filter(c => c.status === 'fresh').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Needs Refresh</span>
                  <span className="text-sm font-medium text-yellow-600">
                    {contentItems.filter(c => c.status === 'needs_refresh').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Outdated</span>
                  <span className="text-sm font-medium text-red-600">
                    {contentItems.filter(c => c.status === 'outdated').length}
                  </span>
                </div>
              </div>
              <div className="pt-2">
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Average Freshness Score</span>
                  <span className="text-sm font-medium">74%</span>
                </div>
                <Progress value={74} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="freshness">Freshness</TabsTrigger>
              <TabsTrigger value="competitor">Competitor</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-blue-600" />
                      Content Freshness
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {contentItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(item.status)}
                          <div>
                            <div className="font-medium text-sm">{item.title}</div>
                            <div className="text-xs text-muted-foreground">
                              {item.category} • {item.wordCount} words
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-sm font-medium ${getStatusColor(item.status)}`}>
                            {item.freshnessScore}%
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(item.lastUpdated).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-yellow-600" />
                      Refresh Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {refreshRecommendations.slice(0, 3).map((rec) => (
                      <div key={rec.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant={rec.priority === 'high' ? 'destructive' : 'secondary'}>
                            {rec.priority}
                          </Badge>
                          <div className="text-xs text-muted-foreground">
                            {rec.estimatedTime}
                          </div>
                        </div>
                        <div className="text-sm font-medium mb-1">{rec.description}</div>
                        <div className="flex items-center justify-between text-xs">
                          <span>Impact: {rec.impact}%</span>
                          <span>Effort: {rec.effort}%</span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Performance Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{performanceMetrics.pageViews.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Page Views</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{performanceMetrics.organicTraffic.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Organic Traffic</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{performanceMetrics.bounceRate}%</div>
                      <div className="text-sm text-muted-foreground">Bounce Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{performanceMetrics.conversions}</div>
                      <div className="text-sm text-muted-foreground">Conversions</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="content" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    Content Inventory
                  </CardTitle>
                  <CardDescription>
                    Manage and track all your content items
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {contentItems.map((item) => (
                      <Card key={item.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h4 className="font-semibold mb-1">{item.title}</h4>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                                <span>{item.category}</span>
                                <span>{item.wordCount} words</span>
                                <span>Last updated: {new Date(item.lastUpdated).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                {getStatusIcon(item.status)}
                                <Badge variant="outline" className={getStatusColor(item.status)}>
                                  {item.status.replace('_', ' ')}
                                </Badge>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-4 mt-4">
                            <div>
                              <div className="text-sm text-muted-foreground">Freshness</div>
                              <div className="flex items-center gap-2">
                                <Progress value={item.freshnessScore} className="flex-1 h-2" />
                                <span className="text-sm font-medium">{item.freshnessScore}%</span>
                              </div>
                            </div>
                            <div>
                              <div className="text-sm text-muted-foreground">Performance</div>
                              <div className="flex items-center gap-2">
                                <Progress value={item.performanceScore} className="flex-1 h-2" />
                                <span className="text-sm font-medium">{item.performanceScore}%</span>
                              </div>
                            </div>
                            <div>
                              <div className="text-sm text-muted-foreground">Optimization</div>
                              <div className="flex items-center gap-2">
                                <Progress value={item.optimizationScore} className="flex-1 h-2" />
                                <span className="text-sm font-medium">{item.optimizationScore}%</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="freshness" className="space-y-6">
              <ContentFreshnessDetector />
            </TabsContent>

            <TabsContent value="competitor" className="space-y-6">
              <CompetitorContentAnalyzer />
            </TabsContent>

            <TabsContent value="performance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-green-600" />
                    Performance Tracking
                  </CardTitle>
                  <CardDescription>
                    Monitor content performance and identify optimization opportunities
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold">Traffic Metrics</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm">Page Views</span>
                          <span className="text-sm font-medium">{performanceMetrics.pageViews.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Organic Traffic</span>
                          <span className="text-sm font-medium text-green-600">{performanceMetrics.organicTraffic.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Bounce Rate</span>
                          <span className="text-sm font-medium">{performanceMetrics.bounceRate}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Time on Page</span>
                          <span className="text-sm font-medium">{Math.floor(performanceMetrics.timeOnPage / 60)}m {performanceMetrics.timeOnPage % 60}s</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold">Engagement Metrics</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm">Conversions</span>
                          <span className="text-sm font-medium text-green-600">{performanceMetrics.conversions}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Keyword Rankings</span>
                          <span className="text-sm font-medium">{performanceMetrics.keywordRankings}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Social Shares</span>
                          <span className="text-sm font-medium">{performanceMetrics.socialShares}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Conversion Rate</span>
                          <span className="text-sm font-medium">{((performanceMetrics.conversions / performanceMetrics.pageViews) * 100).toFixed(2)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-semibold mb-4">Performance Trends</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-lg font-bold text-green-600">+23%</div>
                        <div className="text-sm text-muted-foreground">Traffic Growth</div>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-lg font-bold text-blue-600">+15%</div>
                        <div className="text-sm text-muted-foreground">Engagement Rate</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-lg font-bold text-purple-600">+8%</div>
                        <div className="text-sm text-muted-foreground">Conversion Rate</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}