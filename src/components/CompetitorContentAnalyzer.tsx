"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search,
  Target,
  Users,
  TrendingUp,
  BarChart3,
  Eye,
  ThumbsUp,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Globe,
  Zap,
  Award,
  FileText,
  ArrowRight
} from "lucide-react";

interface CompetitorContent {
  id: string;
  url: string;
  title: string;
  domain: string;
  wordCount: number;
  publishDate: string;
  contentScore: number;
  seoScore: number;
  readabilityScore: number;
  engagementScore: number;
  backlinks: number;
  socialShares: number;
  ranking: number;
}

interface ContentGap {
  id: string;
  type: 'missing_topic' | 'content_depth' | 'format_opportunity' | 'keyword_gap' | 'multimedia_gap';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  competitorCount: number;
  estimatedImpact: number;
}

interface StrengthWeakness {
  id: string;
  competitor: string;
  type: 'strength' | 'weakness';
  category: string;
  description: string;
  impact: number;
}

export default function CompetitorContentAnalyzer() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [competitorUrls, setCompetitorUrls] = useState<string[]>(["", ""]);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data for demonstration
  const mockCompetitorContent: CompetitorContent[] = [
    {
      id: "1",
      url: "https://competitor-a.com/voice-search-guide",
      title: "Complete Voice Search Optimization Guide 2024",
      domain: "competitor-a.com",
      wordCount: 4200,
      publishDate: "2024-01-15",
      contentScore: 88,
      seoScore: 85,
      readabilityScore: 92,
      engagementScore: 78,
      backlinks: 245,
      socialShares: 1200,
      ranking: 1
    },
    {
      id: "2",
      url: "https://competitor-b.com/voice-seo",
      title: "Voice SEO: The Ultimate Guide",
      domain: "competitor-b.com",
      wordCount: 3800,
      publishDate: "2024-02-01",
      contentScore: 82,
      seoScore: 79,
      readabilityScore: 85,
      engagementScore: 72,
      backlinks: 189,
      socialShares: 890,
      ranking: 3
    }
  ];

  const mockContentGaps: ContentGap[] = [
    {
      id: "1",
      type: "missing_topic",
      title: "AI Assistant Optimization",
      description: "None of the competitors cover optimization for AI assistants like ChatGPT and Claude",
      priority: "high",
      competitorCount: 0,
      estimatedImpact: 90
    },
    {
      id: "2",
      type: "content_depth",
      title: "Case Studies Section",
      description: "Competitors lack real-world case studies and examples",
      priority: "medium",
      competitorCount: 1,
      estimatedImpact: 75
    },
    {
      id: "3",
      type: "multimedia_gap",
      title: "Video Content Integration",
      description: "Missing video tutorials and visual explanations",
      priority: "medium",
      competitorCount: 2,
      estimatedImpact: 65
    },
    {
      id: "4",
      type: "keyword_gap",
      title: "Long-tail Voice Queries",
      description: "Opportunity to target specific long-tail voice search keywords",
      priority: "high",
      competitorCount: 1,
      estimatedImpact: 85
    }
  ];

  const mockStrengthsWeaknesses: StrengthWeakness[] = [
    {
      id: "1",
      competitor: "Competitor A",
      type: "strength",
      category: "Content Depth",
      description: "Comprehensive coverage with detailed examples",
      impact: 85
    },
    {
      id: "2",
      competitor: "Competitor A",
      type: "weakness",
      category: "Readability",
      description: "Technical jargon makes it hard for beginners",
      impact: 60
    },
    {
      id: "3",
      competitor: "Competitor B",
      type: "strength",
      category: "Structure",
      description: "Clear, well-organized content hierarchy",
      impact: 80
    },
    {
      id: "4",
      competitor: "Competitor B",
      type: "weakness",
      category: "Freshness",
      description: "Some statistics and examples are outdated",
      impact: 70
    }
  ];

  const handleAnalyzeCompetitors = async () => {
    const validUrls = competitorUrls.filter(url => url.trim() !== "");
    if (validUrls.length === 0) return;
    
    setIsAnalyzing(true);
    // Simulate API call
    setTimeout(() => {
      setAnalysisResults({
        competitors: mockCompetitorContent,
        gaps: mockContentGaps,
        analysis: mockStrengthsWeaknesses,
        summary: {
          averageContentScore: 85,
          averageSeoScore: 82,
          topOpportunities: 4,
          contentGapsFound: 12
        }
      });
      setIsAnalyzing(false);
    }, 3500);
  };

  const addCompetitorUrl = () => {
    setCompetitorUrls([...competitorUrls, ""]);
  };

  const removeCompetitorUrl = (index: number) => {
    setCompetitorUrls(competitorUrls.filter((_, i) => i !== index));
  };

  const updateCompetitorUrl = (index: number, value: string) => {
    const newUrls = [...competitorUrls];
    newUrls[index] = value;
    setCompetitorUrls(newUrls);
  };

  const getGapIcon = (type: string) => {
    switch (type) {
      case 'missing_topic': return <Target className="w-4 h-4 text-red-500" />;
      case 'content_depth': return <FileText className="w-4 h-4 text-blue-500" />;
      case 'format_opportunity': return <Eye className="w-4 h-4 text-purple-500" />;
      case 'keyword_gap': return <Search className="w-4 h-4 text-green-500" />;
      case 'multimedia_gap': return <Zap className="w-4 h-4 text-orange-500" />;
      default: return <AlertTriangle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold">Competitor Content Analyzer</h3>
          <p className="text-muted-foreground">
            Analyze competitor content to identify gaps, opportunities, and improvement areas
          </p>
        </div>
      </div>

      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            Competitor URLs
          </CardTitle>
          <CardDescription>
            Enter competitor URLs to analyze their content strategy and identify opportunities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {competitorUrls.map((url, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder="Enter competitor URL..."
                  value={url}
                  onChange={(e) => updateCompetitorUrl(index, e.target.value)}
                  className="flex-1"
                />
                {competitorUrls.length > 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeCompetitorUrl(index)}
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={addCompetitorUrl}
              disabled={competitorUrls.length >= 5}
            >
              Add Competitor
            </Button>
            <Button
              onClick={handleAnalyzeCompetitors}
              disabled={competitorUrls.filter(url => url.trim() !== "").length === 0 || isAnalyzing}
              className="flex-1"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing Competitors...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Analyze Competitors
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {analysisResults && (
        <>
          {/* Summary Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-green-600" />
                Analysis Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{analysisResults.summary.averageContentScore}%</div>
                  <div className="text-sm text-muted-foreground">Avg Content Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{analysisResults.summary.averageSeoScore}%</div>
                  <div className="text-sm text-muted-foreground">Avg SEO Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{analysisResults.summary.topOpportunities}</div>
                  <div className="text-sm text-muted-foreground">Top Opportunities</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{analysisResults.summary.contentGapsFound}</div>
                  <div className="text-sm text-muted-foreground">Content Gaps Found</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Analysis Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="competitors">Competitors</TabsTrigger>
              <TabsTrigger value="gaps">Content Gaps</TabsTrigger>
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="competitors" className="space-y-6">
              <div className="space-y-4">
                {analysisResults.competitors.map((competitor: CompetitorContent) => (
                  <Card key={competitor.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="font-semibold mb-1">{competitor.title}</h4>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                            <span className="flex items-center gap-1">
                              <Globe className="w-4 h-4" />
                              {competitor.domain}
                            </span>
                            <span>Rank: #{competitor.ranking}</span>
                            <span>{competitor.wordCount} words</span>
                            <span>{new Date(competitor.publishDate).toLocaleDateString()}</span>
                          </div>
                          <Badge variant="outline" className="mb-3">
                            {competitor.backlinks} backlinks • {competitor.socialShares} shares
                          </Badge>
                        </div>
                        <Button variant="outline" size="sm">
                          View Content
                        </Button>
                      </div>

                      <div className="grid grid-cols-4 gap-4">
                        <div>
                          <div className="text-sm text-muted-foreground">Content Score</div>
                          <div className="flex items-center gap-2">
                            <Progress value={competitor.contentScore} className="flex-1 h-2" />
                            <span className="text-sm font-medium">{competitor.contentScore}%</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">SEO Score</div>
                          <div className="flex items-center gap-2">
                            <Progress value={competitor.seoScore} className="flex-1 h-2" />
                            <span className="text-sm font-medium">{competitor.seoScore}%</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Readability</div>
                          <div className="flex items-center gap-2">
                            <Progress value={competitor.readabilityScore} className="flex-1 h-2" />
                            <span className="text-sm font-medium">{competitor.readabilityScore}%</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Engagement</div>
                          <div className="flex items-center gap-2">
                            <Progress value={competitor.engagementScore} className="flex-1 h-2" />
                            <span className="text-sm font-medium">{competitor.engagementScore}%</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="gaps" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-red-600" />
                    Content Gap Analysis
                  </CardTitle>
                  <CardDescription>
                    Opportunities where you can outperform competitors
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analysisResults.gaps.map((gap: ContentGap) => (
                      <Card key={gap.id} className="border-l-4 border-l-green-500">
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              {getGapIcon(gap.type)}
                              <Badge variant={gap.priority === 'high' ? 'destructive' : 'secondary'}>
                                {gap.priority}
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Impact: {gap.estimatedImpact}%
                            </div>
                          </div>
                          
                          <h4 className="font-semibold mb-2">{gap.title}</h4>
                          <p className="text-sm text-muted-foreground mb-3">{gap.description}</p>
                          
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-muted-foreground">
                              {gap.competitorCount} competitors cover this
                            </div>
                            <Button variant="outline" size="sm">
                              Create Content <ArrowRight className="w-4 h-4 ml-1" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analysis" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      Competitor Strengths
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {analysisResults.analysis
                      .filter((item: StrengthWeakness) => item.type === 'strength')
                      .map((item: StrengthWeakness) => (
                        <div key={item.id} className="p-3 bg-green-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="outline" className="text-green-700">
                              {item.category}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {item.competitor}
                            </span>
                          </div>
                          <p className="text-sm text-green-800">{item.description}</p>
                          <div className="text-xs text-green-600 mt-1">
                            Impact: {item.impact}%
                          </div>
                        </div>
                      ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                      Competitor Weaknesses
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {analysisResults.analysis
                      .filter((item: StrengthWeakness) => item.type === 'weakness')
                      .map((item: StrengthWeakness) => (
                        <div key={item.id} className="p-3 bg-red-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="outline" className="text-red-700">
                              {item.category}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {item.competitor}
                            </span>
                          </div>
                          <p className="text-sm text-red-800">{item.description}</p>
                          <div className="text-xs text-red-600 mt-1">
                            Impact: {item.impact}%
                          </div>
                        </div>
                      ))}
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-purple-600" />
                    Strategic Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-semibold">Immediate Actions</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 p-2 bg-blue-50 rounded">
                          <Zap className="w-4 h-4 text-blue-500" />
                          <span className="text-sm">Target AI assistant optimization gap</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-green-50 rounded">
                          <TrendingUp className="w-4 h-4 text-green-500" />
                          <span className="text-sm">Create comprehensive case studies</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-semibold">Long-term Strategy</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 p-2 bg-purple-50 rounded">
                          <Eye className="w-4 h-4 text-purple-500" />
                          <span className="text-sm">Develop video content series</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-orange-50 rounded">
                          <FileText className="w-4 h-4 text-orange-500" />
                          <span className="text-sm">Build out long-tail keyword strategy</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}