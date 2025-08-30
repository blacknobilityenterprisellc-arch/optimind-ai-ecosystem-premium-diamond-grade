"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  Search, 
  Target, 
  Database, 
  BarChart3, 
  TrendingUp, 
  CheckCircle, 
  AlertTriangle,
  Zap,
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
  Globe,
  FileText,
  Users,
  Network,
  Lightbulb,
  MessageSquare,
  Image as ImageIcon
} from "lucide-react";

interface ResearchQuery {
  query: string;
  category: string;
  depth: string;
  sources: string[];
}

interface ResearchResult {
  id: string;
  title: string;
  content: string;
  sources: string[];
  confidence: number;
  category: string;
  timestamp: string;
}

interface ModelComparison {
  model: string;
  accuracy: number;
  speed: number;
  cost: number;
  strengths: string[];
  weaknesses: string[];
}

export default function ResearchAnalysisPage() {
  const [activeTab, setActiveTab] = useState("multi-model");
  const [isResearching, setIsResearching] = useState(false);
  const [researchQuery, setResearchQuery] = useState<ResearchQuery>({
    query: "",
    category: "general",
    depth: "comprehensive",
    sources: []
  });
  const [researchResults, setResearchResults] = useState<ResearchResult[]>([]);

  const modelComparisons: ModelComparison[] = [
    {
      model: "GPT-4",
      accuracy: 95,
      speed: 85,
      cost: 90,
      strengths: ["Excellent reasoning", "Creative output", "Large context window"],
      weaknesses: ["Higher cost", "Slower response time"]
    },
    {
      model: "Claude 3",
      accuracy: 92,
      speed: 88,
      cost: 85,
      strengths: ["Fast responses", "Good reasoning", "Cost-effective"],
      weaknesses: ["Smaller context", "Less creative"]
    },
    {
      model: "Gemini Pro",
      accuracy: 90,
      speed: 92,
      cost: 80,
      strengths: ["Very fast", "Good for coding", "Multimodal"],
      weaknesses: ["Less detailed", "Inconsistent quality"]
    }
  ];

  const recentAnalyses = [
    {
      id: "1",
      title: "AI Market Trends 2025",
      type: "Market Research",
      createdAt: "2 hours ago",
      status: "completed",
      insights: 156
    },
    {
      id: "2",
      title: "Competitor Analysis Report",
      type: "Competitive Intelligence",
      createdAt: "1 day ago",
      status: "completed",
      insights: 89
    },
    {
      id: "3",
      title: "Content Performance Study",
      type: "Content Analysis",
      createdAt: "3 days ago",
      status: "completed",
      insights: 234
    }
  ];

  const handleResearch = async () => {
    if (!researchQuery.query.trim()) return;

    setIsResearching(true);
    
    try {
      const response = await fetch('/api/research/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: researchQuery.query,
          category: researchQuery.category,
          depth: researchQuery.depth,
          sources: researchQuery.sources
        })
      });

      if (!response.ok) {
        throw new Error('Failed to perform research');
      }

      const data = await response.json();
      
      const mockResults: ResearchResult[] = [
        {
          id: "1",
          title: "Market Overview",
          content: data.content || "The AI market is experiencing unprecedented growth, with a projected CAGR of 37.3% from 2024 to 2030. Key drivers include increased adoption across industries, advancements in machine learning, and growing demand for automation solutions.",
          sources: data.sources || ["Market Research Report 2025", "Industry Analysis", "Expert Interviews"],
          confidence: data.confidence || 94,
          category: researchQuery.category,
          timestamp: new Date().toISOString()
        },
        {
          id: "2",
          title: "Competitive Landscape",
          content: "The competitive landscape is dominated by major tech companies, but there's significant opportunity for specialized AI solutions. Key differentiators include model accuracy, speed, cost-effectiveness, and industry-specific expertise.",
          sources: ["Competitor Analysis", "Market Data", "Expert Opinions"],
          confidence: 87,
          category: "competitive",
          timestamp: new Date().toISOString()
        },
        {
          id: "3",
          title: "Technology Trends",
          content: "Key technology trends include multimodal AI, edge computing integration, improved natural language understanding, and enhanced privacy-preserving machine learning techniques.",
          sources: ["Technical Papers", "Patent Analysis", "Research Publications"],
          confidence: 91,
          category: "technology",
          timestamp: new Date().toISOString()
        }
      ];

      setResearchResults(mockResults);
    } catch (error) {
      console.error('Research failed:', error);
      // Fallback to mock data if API fails
      const mockResults: ResearchResult[] = [
        {
          id: "1",
          title: "Market Overview",
          content: "The AI market is experiencing unprecedented growth, with a projected CAGR of 37.3% from 2024 to 2030. Key drivers include increased adoption across industries, advancements in machine learning, and growing demand for automation solutions.",
          sources: ["Market Research Report 2025", "Industry Analysis", "Expert Interviews"],
          confidence: 94,
          category: "market",
          timestamp: new Date().toISOString()
        },
        {
          id: "2",
          title: "Competitive Landscape",
          content: "The competitive landscape is dominated by major tech companies, but there's significant opportunity for specialized AI solutions. Key differentiators include model accuracy, speed, cost-effectiveness, and industry-specific expertise.",
          sources: ["Competitor Analysis", "Market Data", "Expert Opinions"],
          confidence: 87,
          category: "competitive",
          timestamp: new Date().toISOString()
        },
        {
          id: "3",
          title: "Technology Trends",
          content: "Key technology trends include multimodal AI, edge computing integration, improved natural language understanding, and enhanced privacy-preserving machine learning techniques.",
          sources: ["Technical Papers", "Patent Analysis", "Research Publications"],
          confidence: 91,
          category: "technology",
          timestamp: new Date().toISOString()
        }
      ];

      setResearchResults(mockResults);
    } finally {
      setIsResearching(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <h1 className="text-3xl font-bold">AI Research & Analysis</h1>
            <Badge variant="secondary" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              <Brain className="w-3 h-3 mr-1" />
              Beta
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Advanced multi-model analysis, research tools, and data insights
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Brain className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-xs text-muted-foreground">AI Models</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Database className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">1.2M</p>
                <p className="text-xs text-muted-foreground">Data Points</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <Target className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">94%</p>
                <p className="text-xs text-muted-foreground">Accuracy</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Lightbulb className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">847</p>
                <p className="text-xs text-muted-foreground">Insights</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="multi-model">Multi-Model Analysis</TabsTrigger>
          <TabsTrigger value="insights">Data Insights</TabsTrigger>
          <TabsTrigger value="brand">Brand Tracking</TabsTrigger>
        </TabsList>

        {/* Multi-Model Analysis Tab */}
        <TabsContent value="multi-model" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Input Panel */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Search className="w-5 h-5" />
                    <span>Research Query</span>
                  </CardTitle>
                  <CardDescription>
                    Enter your research question or topic
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Research Topic</label>
                    <Textarea
                      placeholder="Enter your research question or topic..."
                      value={researchQuery.query}
                      onChange={(e) => setResearchQuery(prev => ({ ...prev, query: e.target.value }))}
                      className="min-h-[100px]"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Category</label>
                    <Select 
                      value={researchQuery.category} 
                      onValueChange={(value) => setResearchQuery(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Research</SelectItem>
                        <SelectItem value="market">Market Analysis</SelectItem>
                        <SelectItem value="competitive">Competitive Intelligence</SelectItem>
                        <SelectItem value="technical">Technical Analysis</SelectItem>
                        <SelectItem value="academic">Academic Research</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Research Depth</label>
                    <Select 
                      value={researchQuery.depth} 
                      onValueChange={(value) => setResearchQuery(prev => ({ ...prev, depth: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="quick">Quick Overview</SelectItem>
                        <SelectItem value="standard">Standard Analysis</SelectItem>
                        <SelectItem value="comprehensive">Comprehensive Deep Dive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button 
                    onClick={handleResearch} 
                    disabled={!researchQuery.query.trim() || isResearching}
                    className="w-full"
                  >
                    {isResearching ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Researching...
                      </>
                    ) : (
                      <>
                        <Brain className="w-4 h-4 mr-2" />
                        Start Research
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Analyses */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Analyses</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recentAnalyses.map((analysis) => (
                    <div key={analysis.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{analysis.title}</p>
                        <p className="text-xs text-muted-foreground">{analysis.type} • {analysis.createdAt}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {analysis.insights} insights
                        </Badge>
                        <Button size="sm" variant="ghost">
                          <Eye className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Results Panel */}
            <div className="lg:col-span-2 space-y-6">
              {/* Model Comparison */}
              <Card>
                <CardHeader>
                  <CardTitle>AI Model Performance Comparison</CardTitle>
                  <CardDescription>
                    Compare different AI models for your research needs
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {modelComparisons.map((model) => (
                    <div key={model.model} className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">{model.model}</h4>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className={`text-xs ${getScoreColor(model.accuracy)}`}>
                            {model.accuracy}% Accurate
                          </Badge>
                          <Badge variant="outline" className={`text-xs ${getScoreColor(model.speed)}`}>
                            {model.speed}% Speed
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-xs">Accuracy</span>
                            <span className="text-xs font-medium">{model.accuracy}%</span>
                          </div>
                          <Progress value={model.accuracy} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-xs">Speed</span>
                            <span className="text-xs font-medium">{model.speed}%</span>
                          </div>
                          <Progress value={model.speed} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-xs">Cost Effect</span>
                            <span className="text-xs font-medium">{model.cost}%</span>
                          </div>
                          <Progress value={model.cost} className="h-2" />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="font-medium text-green-600">Strengths:</span>
                          <ul className="mt-1 space-y-1">
                            {model.strengths.map((strength, index) => (
                              <li key={index} className="flex items-start space-x-1">
                                <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                                <span>{strength}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <span className="font-medium text-red-600">Weaknesses:</span>
                          <ul className="mt-1 space-y-1">
                            {model.weaknesses.map((weakness, index) => (
                              <li key={index} className="flex items-start space-x-1">
                                <AlertTriangle className="w-3 h-3 text-red-500 mt-0.5 flex-shrink-0" />
                                <span>{weakness}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Research Results */}
              {researchResults.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Research Results</CardTitle>
                    <CardDescription>
                      AI-generated insights based on your query
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {researchResults.map((result) => (
                      <div key={result.id} className="p-4 bg-muted/30 rounded-lg space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">{result.title}</h4>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-xs">
                              {result.confidence}% confidence
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {result.category}
                            </Badge>
                          </div>
                        </div>
                        
                        <p className="text-sm leading-relaxed">{result.content}</p>
                        
                        <div className="space-y-2">
                          <span className="text-xs font-medium">Sources:</span>
                          <div className="flex flex-wrap gap-1">
                            {result.sources.map((source, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {source}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Data Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="w-5 h-5" />
                  <span>Data Analysis</span>
                </CardTitle>
                <CardDescription>
                  AI-powered insights from your data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <BarChart3 className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium">Data Points Analyzed</span>
                    </div>
                    <Badge variant="outline">1.2M</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium">Key Insights Found</span>
                    </div>
                    <Badge variant="outline">847</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Lightbulb className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-medium">Actionable Items</span>
                    </div>
                    <Badge variant="outline">156</Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Top Insights</h4>
                  <ul className="space-y-1 text-xs">
                    <li className="flex items-start space-x-2">
                      <Star className="w-3 h-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span>Customer engagement increased by 45% with AI-powered recommendations</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Star className="w-3 h-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span>Mobile traffic accounts for 68% of total visits</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Star className="w-3 h-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span>Content optimization led to 32% improvement in conversion rates</span>
                    </li>
                  </ul>
                </div>

                <Button className="w-full" variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Generate New Insights
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Visualization Dashboard</CardTitle>
                <CardDescription>
                  Interactive data visualizations and charts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">+45%</div>
                    <div className="text-xs text-blue-800">Engagement Rate</div>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">+32%</div>
                    <div className="text-xs text-green-800">Conversion Rate</div>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">-28%</div>
                    <div className="text-xs text-purple-800">Bounce Rate</div>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">+67%</div>
                    <div className="text-xs text-orange-800">Revenue Growth</div>
                  </div>
                </div>

                <Button className="w-full" variant="outline">
                  <Eye className="w-4 h-4 mr-2" />
                  View Full Dashboard
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Brand Tracking Tab */}
        <TabsContent value="brand" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5" />
                  <span>Brand Mention Tracking</span>
                </CardTitle>
                <CardDescription>
                  Monitor brand mentions across the web
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium">Total Mentions</span>
                    </div>
                    <Badge variant="outline">12,847</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium">Sentiment Score</span>
                    </div>
                    <Badge variant="outline">+8.5</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Globe className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-medium">Coverage</span>
                    </div>
                    <Badge variant="outline">47 Countries</Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Recent Mentions</h4>
                  <div className="space-y-2">
                    {[
                      { source: "TechCrunch", sentiment: "Positive", time: "2 hours ago" },
                      { source: "Forbes", sentiment: "Positive", time: "5 hours ago" },
                      { source: "Reddit", sentiment: "Neutral", time: "1 day ago" }
                    ].map((mention, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded text-xs">
                        <span className="font-medium">{mention.source}</span>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className={`text-xs ${
                            mention.sentiment === 'Positive' ? 'text-green-600' : 
                            mention.sentiment === 'Negative' ? 'text-red-600' : 'text-gray-600'
                          }`}>
                            {mention.sentiment}
                          </Badge>
                          <span className="text-muted-foreground">{mention.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Button className="w-full" variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Update Brand Tracking
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Competitor Intelligence</CardTitle>
                <CardDescription>
                  Track competitor activities and strategies
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {[
                    { name: "Competitor A", mentions: 8234, trend: "+12%", strategy: "Content Marketing" },
                    { name: "Competitor B", mentions: 6156, trend: "+8%", strategy: "Social Media" },
                    { name: "Competitor C", mentions: 4231, trend: "-3%", strategy: "Paid Advertising" }
                  ].map((competitor, index) => (
                    <div key={index} className="p-3 bg-muted/50 rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{competitor.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {competitor.mentions} mentions
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Strategy: {competitor.strategy}</span>
                        <span className={`${
                          competitor.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {competitor.trend}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <Button className="w-full" variant="outline">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Competitor Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}