"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Target, 
  Search, 
  Globe, 
  Activity, 
  BarChart3, 
  TrendingUp, 
  CheckCircle, 
  AlertTriangle,
  Zap,
  Brain,
  Crown,
  Loader2,
  Settings,
  RefreshCw,
  Download,
  Eye,
  Star,
  Award,
  Rocket,
  Shield,
  Database
} from "lucide-react";

interface OptimizationScore {
  category: string;
  score: number;
  status: 'excellent' | 'good' | 'fair' | 'poor';
  recommendations: string[];
}

interface CompetitorAnalysis {
  domain: string;
  score: number;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
}

export default function OptimizationPage() {
  const [activeTab, setActiveTab] = useState("seo");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [analysisResults, setAnalysisResults] = useState<any>(null);

  const optimizationScores: OptimizationScore[] = [
    {
      category: "Technical SEO",
      score: 92,
      status: "excellent",
      recommendations: ["Implement schema markup", "Optimize Core Web Vitals"]
    },
    {
      category: "Content Quality",
      score: 78,
      status: "good",
      recommendations: ["Add more comprehensive content", "Include target keywords"]
    },
    {
      category: "Backlink Profile",
      score: 65,
      status: "fair",
      recommendations: ["Build high-quality backlinks", "Disavow toxic links"]
    },
    {
      category: "User Experience",
      score: 88,
      status: "good",
      recommendations: ["Improve mobile responsiveness", "Reduce page load time"]
    }
  ];

  const competitorData: CompetitorAnalysis[] = [
    {
      domain: "competitor1.com",
      score: 85,
      strengths: ["Strong backlink profile", "Excellent content strategy"],
      weaknesses: ["Poor mobile optimization", "Slow page load"],
      opportunities: ["Target their weak keywords", "Improve on their UX"]
    },
    {
      domain: "competitor2.com",
      score: 78,
      strengths: ["Great technical SEO", "Fast loading speeds"],
      weaknesses: ["Thin content", "Poor user engagement"],
      opportunities: ["Create comprehensive content", "Improve user experience"]
    }
  ];

  const performanceMetrics = [
    { name: "Organic Traffic", value: "45,231", change: "+12.5%", trend: "up" },
    { name: "Keyword Rankings", value: "1,234", change: "+8.3%", trend: "up" },
    { name: "Conversion Rate", value: "3.2%", change: "+0.4%", trend: "up" },
    { name: "Page Load Speed", value: "1.8s", change: "-0.3s", trend: "down" }
  ];

  const handleAnalyze = async () => {
    if (!urlInput.trim()) return;

    setIsAnalyzing(true);
    
    try {
      const response = await fetch('/api/optimization/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: urlInput,
          type: 'seo'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to analyze website');
      }

      const data = await response.json();
      
      setAnalysisResults({
        overallScore: data.score || 82,
        recommendations: data.recommendations || [
          "Optimize meta descriptions for better CTR",
          "Improve internal linking structure",
          "Add more comprehensive content to key pages",
          "Implement structured data markup",
          "Optimize images for better loading speed"
        ],
        opportunities: data.opportunities || [
          "Target long-tail keywords with high intent",
          "Create content around featured snippet opportunities",
          "Build relationships with industry influencers"
        ]
      });
    } catch (error) {
      console.error('Analysis failed:', error);
      // Fallback to mock data if API fails
      setAnalysisResults({
        overallScore: 82,
        recommendations: [
          "Optimize meta descriptions for better CTR",
          "Improve internal linking structure",
          "Add more comprehensive content to key pages",
          "Implement structured data markup",
          "Optimize images for better loading speed"
        ],
        opportunities: [
          "Target long-tail keywords with high intent",
          "Create content around featured snippet opportunities",
          "Build relationships with industry influencers"
        ]
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'fair': return 'text-yellow-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return <Star className="w-4 h-4" />;
      case 'good': return <CheckCircle className="w-4 h-4" />;
      case 'fair': return <AlertTriangle className="w-4 h-4" />;
      case 'poor': return <AlertTriangle className="w-4 h-4" />;
      default: return <CheckCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <h1 className="text-3xl font-bold">AI Optimization Center</h1>
            <Badge variant="secondary" className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
              <Target className="w-3 h-3 mr-1" />
              Pro
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Comprehensive SEO, AEO, GEO, and performance optimization tools
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <Search className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">82%</p>
                <p className="text-xs text-muted-foreground">SEO Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Target className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">156</p>
                <p className="text-xs text-muted-foreground">Keywords Ranked</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Globe className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">24</p>
                <p className="text-xs text-muted-foreground">Countries Reached</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Rocket className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">+45%</p>
                <p className="text-xs text-muted-foreground">Growth Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="seo">SEO Analysis</TabsTrigger>
          <TabsTrigger value="aeo">AEO Enhancement</TabsTrigger>
          <TabsTrigger value="geo">GEO Targeting</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        {/* SEO Analysis Tab */}
        <TabsContent value="seo" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Input Panel */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Search className="w-5 h-5" />
                    <span>SEO Analysis</span>
                  </CardTitle>
                  <CardDescription>
                    Analyze your website's SEO performance
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Website URL</label>
                    <Input
                      placeholder="https://example.com"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                    />
                  </div>
                  
                  <Button 
                    onClick={handleAnalyze} 
                    disabled={!urlInput.trim() || isAnalyzing}
                    className="w-full"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Brain className="w-4 h-4 mr-2" />
                        Analyze SEO
                      </>
                    )}
                  </Button>

                  {analysisResults && (
                    <div className="space-y-3 pt-4 border-t">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600">
                          {analysisResults.overallScore}%
                        </div>
                        <p className="text-sm text-muted-foreground">Overall Score</p>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Top Recommendations</h4>
                        <ul className="space-y-1">
                          {analysisResults.recommendations.slice(0, 3).map((rec: string, index: number) => (
                            <li key={index} className="text-xs flex items-start space-x-2">
                              <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Results Panel */}
            <div className="lg:col-span-2 space-y-6">
              {/* Optimization Scores */}
              <Card>
                <CardHeader>
                  <CardTitle>Optimization Scores</CardTitle>
                  <CardDescription>
                    Detailed breakdown of your SEO performance
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {optimizationScores.map((score) => (
                    <div key={score.category} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-sm">{score.category}</span>
                          {getStatusIcon(score.status)}
                        </div>
                        <span className={`text-sm font-medium ${getStatusColor(score.status)}`}>
                          {score.score}%
                        </span>
                      </div>
                      <Progress value={score.score} className="h-2" />
                      <div className="text-xs text-muted-foreground">
                        {score.recommendations[0]}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Performance Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                  <CardDescription>
                    Key performance indicators over the last 30 days
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {performanceMetrics.map((metric) => (
                      <div key={metric.name} className="p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{metric.name}</span>
                          <TrendingUp className={`w-4 h-4 ${metric.trend === 'up' ? 'text-green-500' : 'text-red-500'}`} />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold">{metric.value}</span>
                          <span className={`text-xs ${metric.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                            {metric.change}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* AEO Enhancement Tab */}
        <TabsContent value="aeo" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5" />
                  <span>Answer Engine Optimization</span>
                </CardTitle>
                <CardDescription>
                  Optimize your content for voice search and featured snippets
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium">Featured Snippet Ready</span>
                    </div>
                    <Badge variant="outline">85%</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium">Voice Search Optimized</span>
                    </div>
                    <Badge variant="outline">92%</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-medium">Schema Markup</span>
                    </div>
                    <Badge variant="outline">78%</Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">AEO Opportunities</h4>
                  <ul className="space-y-1 text-xs">
                    <li className="flex items-start space-x-2">
                      <Star className="w-3 h-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span>Add FAQ schema to increase snippet chances by 40%</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Star className="w-3 h-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span>Optimize for question-based keywords</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Star className="w-3 h-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span>Improve content readability for voice assistants</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Content Structure Analysis</CardTitle>
                <CardDescription>
                  How well your content is structured for AI understanding
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Heading Structure</span>
                      <span className="text-sm font-medium">88%</span>
                    </div>
                    <Progress value={88} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Content Readability</span>
                      <span className="text-sm font-medium">92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Answer Quality</span>
                      <span className="text-sm font-medium">85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Schema Implementation</span>
                      <span className="text-sm font-medium">76%</span>
                    </div>
                    <Progress value={76} className="h-2" />
                  </div>
                </div>

                <Button className="w-full" variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Generate AEO Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* GEO Targeting Tab */}
        <TabsContent value="geo" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="w-5 h-5" />
                  <span>Global Engine Optimization</span>
                </CardTitle>
                <CardDescription>
                  Optimize your content for global search engines and regions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Globe className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium">Global Reach</span>
                    </div>
                    <Badge variant="outline">24 Countries</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium">Multi-language Support</span>
                    </div>
                    <Badge variant="outline">8 Languages</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Database className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-medium">Regional SEO</span>
                    </div>
                    <Badge variant="outline">12 Regions</Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">GEO Opportunities</h4>
                  <ul className="space-y-1 text-xs">
                    <li className="flex items-start space-x-2">
                      <Award className="w-3 h-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span>Expand into Asian markets with localized content</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Award className="w-3 h-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span>Optimize for Baidu and Yandex search engines</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Award className="w-3 h-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span>Implement hreflang tags for better international SEO</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Regional Performance</CardTitle>
                <CardDescription>
                  Performance breakdown by region and language
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {[
                    { region: "North America", traffic: "45%", score: 88 },
                    { region: "Europe", traffic: "32%", score: 82 },
                    { region: "Asia", traffic: "15%", score: 76 },
                    { region: "Other", traffic: "8%", score: 71 }
                  ].map((region) => (
                    <div key={region.region} className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">{region.region}</span>
                        <span className="text-sm text-muted-foreground">{region.traffic}</span>
                      </div>
                      <Progress value={region.score} className="h-2" />
                    </div>
                  ))}
                </div>

                <Button className="w-full" variant="outline">
                  <Eye className="w-4 h-4 mr-2" />
                  View Detailed GEO Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-5 h-5" />
                  <span>System Performance</span>
                </CardTitle>
                <CardDescription>
                  Monitor your website's technical performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium">Page Load Speed</span>
                    </div>
                    <Badge variant="outline">1.8s</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium">Mobile Responsiveness</span>
                    </div>
                    <Badge variant="outline">95%</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm font-medium">Core Web Vitals</span>
                    </div>
                    <Badge variant="outline">Needs Work</Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Performance Recommendations</h4>
                  <ul className="space-y-1 text-xs">
                    <li className="flex items-start space-x-2">
                      <Zap className="w-3 h-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span>Optimize images to reduce page load time by 40%</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Zap className="w-3 h-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span>Implement lazy loading for better performance</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Zap className="w-3 h-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span>Enable browser caching for static resources</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Competitor Analysis</CardTitle>
                <CardDescription>
                  Compare your performance against key competitors
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {competitorData.map((competitor) => (
                  <div key={competitor.domain} className="p-3 bg-muted/50 rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{competitor.domain}</span>
                      <Badge variant="outline">{competitor.score}%</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <div className="space-y-1">
                        <div><strong>Strengths:</strong> {competitor.strengths.join(', ')}</div>
                        <div><strong>Opportunities:</strong> {competitor.opportunities[0]}</div>
                      </div>
                    </div>
                  </div>
                ))}

                <Button className="w-full" variant="outline">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Full Competitor Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}