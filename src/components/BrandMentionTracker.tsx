"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  Search, 
  Globe, 
  MessageSquare, 
  Star, 
  Eye,
  Share2,
  Award,
  Calendar,
  BarChart3,
  Loader2,
  CheckCircle,
  AlertCircle,
  Brain
} from "lucide-react";

interface BrandMention {
  id: string;
  source: string;
  url: string;
  title: string;
  snippet: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  authority: number;
  date: string;
  type: 'ai_overview' | 'featured_snippet' | 'organic_result' | 'social_media';
}

interface BrandMetrics {
  totalMentions: number;
  aiOverviewMentions: number;
  featuredSnippetMentions: number;
  authorityScore: number;
  sentimentScore: number;
  monthlyGrowth: number;
  topSources: string[];
}

export default function BrandMentionTracker() {
  const [isTracking, setIsTracking] = useState(false);
  const [brandName, setBrandName] = useState("");
  const [timeRange, setTimeRange] = useState("30");
  const [metrics, setMetrics] = useState<BrandMetrics | null>(null);
  const [mentions, setMentions] = useState<BrandMention[]>([]);

  // Mock data for demonstration
  const mockMetrics: BrandMetrics = {
    totalMentions: 1247,
    aiOverviewMentions: 342,
    featuredSnippetMentions: 189,
    authorityScore: 78,
    sentimentScore: 85,
    monthlyGrowth: 23,
    topSources: ["Google AI Overview", "Featured Snippets", "Search Results", "Social Media"]
  };

  const mockMentions: BrandMention[] = [
    {
      id: "1",
      source: "Google AI Overview",
      url: "https://example.com/ai-overview",
      title: "Best AI Optimization Tools 2025",
      snippet: "According to OptiMind AI, the leading platform for AI-powered optimization...",
      sentiment: "positive",
      authority: 95,
      date: "2024-01-15",
      type: "ai_overview"
    },
    {
      id: "2",
      source: "Featured Snippet",
      url: "https://example.com/featured",
      title: "How to Optimize for Voice Search",
      snippet: "OptiMind AI provides comprehensive voice search optimization tools that help...",
      sentiment: "positive",
      authority: 88,
      date: "2024-01-14",
      type: "featured_snippet"
    },
    {
      id: "3",
      source: "Tech Blog",
      url: "https://example.com/tech-blog",
      title: "The Future of SEO and AI",
      snippet: "Platforms like OptiMind AI are revolutionizing how we approach digital optimization...",
      sentiment: "neutral",
      authority: 72,
      date: "2024-01-13",
      type: "organic_result"
    },
    {
      id: "4",
      source: "Social Media",
      url: "https://example.com/social",
      title: "AI Tools Discussion",
      snippet: "Just started using OptiMind AI and the results are impressive!",
      sentiment: "positive",
      authority: 45,
      date: "2024-01-12",
      type: "social_media"
    }
  ];

  const handleTrackBrand = async () => {
    if (!brandName) return;
    
    setIsTracking(true);
    // Simulate API call
    setTimeout(() => {
      setMetrics(mockMetrics);
      setMentions(mockMentions);
      setIsTracking(false);
    }, 2000);
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'negative': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <div className="w-4 h-4 rounded-full bg-gray-400" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'ai_overview': return <Brain className="w-4 h-4 text-blue-500" />;
      case 'featured_snippet': return <Star className="w-4 h-4 text-yellow-500" />;
      case 'social_media': return <Share2 className="w-4 h-4 text-purple-500" />;
      default: return <Search className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold">Brand Mention Tracking</h3>
          <p className="text-muted-foreground">
            Monitor your brand's presence across AI overviews, featured snippets, and organic results
          </p>
        </div>
      </div>

      {/* Tracking Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5 text-blue-600" />
            Track Brand Mentions
          </CardTitle>
          <CardDescription>
            Enter your brand name to monitor mentions across AI-powered search results
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Enter your brand name..."
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="w-32">
              <select 
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
                <option value="365">Last year</option>
              </select>
            </div>
            <Button 
              onClick={handleTrackBrand}
              disabled={!brandName || isTracking}
            >
              {isTracking ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Tracking...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Track Mentions
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {metrics && (
        <>
          {/* Metrics Overview */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Mentions</p>
                    <p className="text-2xl font-bold">{metrics.totalMentions.toLocaleString()}</p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-blue-600" />
                </div>
                <div className="mt-2">
                  <div className="flex items-center gap-1 text-sm text-green-600">
                    <TrendingUp className="w-4 h-4" />
                    +{metrics.monthlyGrowth}% this month
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">AI Overview Mentions</p>
                    <p className="text-2xl font-bold">{metrics.aiOverviewMentions}</p>
                  </div>
                  <Brain className="w-8 h-8 text-purple-600" />
                </div>
                <div className="mt-2">
                  <Progress value={(metrics.aiOverviewMentions / metrics.totalMentions) * 100} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {((metrics.aiOverviewMentions / metrics.totalMentions) * 100).toFixed(1)}% of total
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Featured Snippets</p>
                    <p className="text-2xl font-bold">{metrics.featuredSnippetMentions}</p>
                  </div>
                  <Star className="w-8 h-8 text-yellow-600" />
                </div>
                <div className="mt-2">
                  <Progress value={(metrics.featuredSnippetMentions / metrics.totalMentions) * 100} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {((metrics.featuredSnippetMentions / metrics.totalMentions) * 100).toFixed(1)}% of total
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Authority Score</p>
                    <p className="text-2xl font-bold">{metrics.authorityScore}%</p>
                  </div>
                  <Award className="w-8 h-8 text-green-600" />
                </div>
                <div className="mt-2">
                  <Progress value={metrics.authorityScore} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    Sentiment: {metrics.sentimentScore}% positive
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Mentions List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-green-600" />
                Recent Mentions
              </CardTitle>
              <CardDescription>
                Latest brand mentions across AI overviews, featured snippets, and organic results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="all">All Mentions</TabsTrigger>
                  <TabsTrigger value="ai_overview">AI Overview</TabsTrigger>
                  <TabsTrigger value="featured_snippet">Featured Snippets</TabsTrigger>
                  <TabsTrigger value="organic">Organic Results</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-4">
                  <div className="space-y-4">
                    {mentions.map((mention) => (
                      <Card key={mention.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              {getTypeIcon(mention.type)}
                              <Badge variant="outline">{mention.source}</Badge>
                              <Badge 
                                variant={mention.sentiment === 'positive' ? 'default' : 'secondary'}
                                className={getSentimentColor(mention.sentiment)}
                              >
                                {mention.sentiment}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="w-4 h-4" />
                              {mention.date}
                            </div>
                          </div>
                          
                          <h4 className="font-semibold mb-2">{mention.title}</h4>
                          <p className="text-sm text-muted-foreground mb-3">{mention.snippet}</p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center gap-1">
                                {getSentimentIcon(mention.sentiment)}
                                <span>Authority: {mention.authority}%</span>
                              </div>
                              <Badge variant="outline">{mention.type.replace('_', ' ')}</Badge>
                            </div>
                            <Button variant="outline" size="sm">
                              View Source
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="ai_overview" className="space-y-4">
                  <div className="space-y-4">
                    {mentions.filter(m => m.type === 'ai_overview').map((mention) => (
                      <Card key={mention.id} className="border-l-4 border-l-blue-500">
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Brain className="w-4 h-4 text-blue-500" />
                              <Badge variant="outline">{mention.source}</Badge>
                              <Badge 
                                variant={mention.sentiment === 'positive' ? 'default' : 'secondary'}
                                className={getSentimentColor(mention.sentiment)}
                              >
                                {mention.sentiment}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="w-4 h-4" />
                              {mention.date}
                            </div>
                          </div>
                          
                          <h4 className="font-semibold mb-2">{mention.title}</h4>
                          <p className="text-sm text-muted-foreground mb-3">{mention.snippet}</p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center gap-1">
                                {getSentimentIcon(mention.sentiment)}
                                <span>Authority: {mention.authority}%</span>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">
                              View Source
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="featured_snippet" className="space-y-4">
                  <div className="space-y-4">
                    {mentions.filter(m => m.type === 'featured_snippet').map((mention) => (
                      <Card key={mention.id} className="border-l-4 border-l-yellow-500">
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Star className="w-4 h-4 text-yellow-500" />
                              <Badge variant="outline">{mention.source}</Badge>
                              <Badge 
                                variant={mention.sentiment === 'positive' ? 'default' : 'secondary'}
                                className={getSentimentColor(mention.sentiment)}
                              >
                                {mention.sentiment}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="w-4 h-4" />
                              {mention.date}
                            </div>
                          </div>
                          
                          <h4 className="font-semibold mb-2">{mention.title}</h4>
                          <p className="text-sm text-muted-foreground mb-3">{mention.snippet}</p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center gap-1">
                                {getSentimentIcon(mention.sentiment)}
                                <span>Authority: {mention.authority}%</span>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">
                              View Source
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="organic" className="space-y-4">
                  <div className="space-y-4">
                    {mentions.filter(m => m.type === 'organic_result').map((mention) => (
                      <Card key={mention.id} className="border-l-4 border-l-green-500">
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Search className="w-4 h-4 text-green-500" />
                              <Badge variant="outline">{mention.source}</Badge>
                              <Badge 
                                variant={mention.sentiment === 'positive' ? 'default' : 'secondary'}
                                className={getSentimentColor(mention.sentiment)}
                              >
                                {mention.sentiment}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="w-4 h-4" />
                              {mention.date}
                            </div>
                          </div>
                          
                          <h4 className="font-semibold mb-2">{mention.title}</h4>
                          <p className="text-sm text-muted-foreground mb-3">{mention.snippet}</p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center gap-1">
                                {getSentimentIcon(mention.sentiment)}
                                <span>Authority: {mention.authority}%</span>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">
                              View Source
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}