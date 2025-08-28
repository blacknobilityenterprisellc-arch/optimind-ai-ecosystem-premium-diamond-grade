"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  RefreshCw,
  Loader2,
  FileText,
  BarChart3,
  Target,
  Zap
} from "lucide-react";

interface FreshnessIssue {
  id: string;
  type: 'outdated_statistics' | 'broken_links' | 'missing_trends' | 'old_references' | 'expired_information';
  severity: 'high' | 'medium' | 'low';
  description: string;
  location: string;
  suggestion: string;
  impact: number;
}

interface FreshnessScore {
  overall: number;
  contentAge: number;
  dataFreshness: number;
  linkHealth: number;
  trendRelevance: number;
}

export default function ContentFreshnessDetector() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [contentUrl, setContentUrl] = useState("");
  const [contentText, setContentText] = useState("");
  const [freshnessScore, setFreshnessScore] = useState<FreshnessScore | null>(null);
  const [issues, setIssues] = useState<FreshnessIssue[]>([]);

  // Mock data for demonstration
  const mockFreshnessScore: FreshnessScore = {
    overall: 74,
    contentAge: 68,
    dataFreshness: 82,
    linkHealth: 91,
    trendRelevance: 55
  };

  const mockIssues: FreshnessIssue[] = [
    {
      id: "1",
      type: "outdated_statistics",
      severity: "high",
      description: "Voice search statistics from 2022 are outdated",
      location: "Section 2: Voice Search Trends",
      suggestion: "Update with 2024 voice search statistics and trends",
      impact: 85
    },
    {
      id: "2",
      type: "missing_trends",
      severity: "medium",
      description: "No mention of AI assistant optimization",
      location: "Main content",
      suggestion: "Add section on optimizing for AI assistants like ChatGPT and Claude",
      impact: 70
    },
    {
      id: "3",
      type: "old_references",
      severity: "medium",
      description: "References to deprecated Google features",
      location: "Section 4: Implementation",
      suggestion: "Update references to current Google Search features",
      impact: 60
    },
    {
      id: "4",
      type: "broken_links",
      severity: "low",
      description: "One external link returns 404 error",
      location: "Resources section",
      suggestion: "Remove or replace broken link with current resource",
      impact: 30
    }
  ];

  const handleAnalyzeFreshness = async () => {
    if (!contentUrl && !contentText) return;
    
    setIsAnalyzing(true);
    // Simulate API call
    setTimeout(() => {
      setFreshnessScore(mockFreshnessScore);
      setIssues(mockIssues);
      setIsAnalyzing(false);
    }, 3000);
  };

  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'outdated_statistics': return <BarChart3 className="w-4 h-4 text-red-500" />;
      case 'broken_links': return <Target className="w-4 h-4 text-orange-500" />;
      case 'missing_trends': return <TrendingUp className="w-4 h-4 text-blue-500" />;
      case 'old_references': return <FileText className="w-4 h-4 text-yellow-500" />;
      case 'expired_information': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <AlertTriangle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold">Content Freshness Detector</h3>
          <p className="text-muted-foreground">
            Identify outdated content and get actionable refresh recommendations
          </p>
        </div>
      </div>

      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            Analyze Content Freshness
          </CardTitle>
          <CardDescription>
            Enter your content URL or paste content text to analyze for freshness issues
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs defaultValue="url" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="url">URL Analysis</TabsTrigger>
              <TabsTrigger value="text">Text Analysis</TabsTrigger>
            </TabsList>
            
            <TabsContent value="url" className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Content URL</label>
                <Input
                  placeholder="https://example.com/your-content"
                  value={contentUrl}
                  onChange={(e) => setContentUrl(e.target.value)}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="text" className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Content Text</label>
                <Textarea
                  placeholder="Paste your content here for analysis..."
                  value={contentText}
                  onChange={(e) => setContentText(e.target.value)}
                  className="min-h-[150px]"
                />
              </div>
            </TabsContent>
          </Tabs>
          
          <Button 
            onClick={handleAnalyzeFreshness} 
            disabled={(!contentUrl && !contentText) || isAnalyzing}
            className="w-full"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing Freshness...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Analyze Freshness
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {freshnessScore && (
        <>
          {/* Freshness Score */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-green-600" />
                Freshness Score Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">
                  <span className={freshnessScore.overall >= 80 ? 'text-green-600' : freshnessScore.overall >= 60 ? 'text-yellow-600' : 'text-red-600'}>
                    {freshnessScore.overall}%
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">Overall Freshness Score</div>
                <Progress value={freshnessScore.overall} className="max-w-md mx-auto mt-2" />
              </div>

              <div className="grid md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{freshnessScore.contentAge}%</div>
                  <div className="text-sm text-muted-foreground">Content Age</div>
                  <Progress value={freshnessScore.contentAge} className="mt-1" />
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{freshnessScore.dataFreshness}%</div>
                  <div className="text-sm text-muted-foreground">Data Freshness</div>
                  <Progress value={freshnessScore.dataFreshness} className="mt-1" />
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{freshnessScore.linkHealth}%</div>
                  <div className="text-sm text-muted-foreground">Link Health</div>
                  <Progress value={freshnessScore.linkHealth} className="mt-1" />
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{freshnessScore.trendRelevance}%</div>
                  <div className="text-sm text-muted-foreground">Trend Relevance</div>
                  <Progress value={freshnessScore.trendRelevance} className="mt-1" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Freshness Issues */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                Identified Issues
              </CardTitle>
              <CardDescription>
                Issues found that need attention to improve content freshness
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {issues.map((issue) => (
                  <Card key={issue.id} className="border-l-4 border-l-red-500">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {getIssueIcon(issue.type)}
                          <Badge variant={getSeverityBadge(issue.severity)}>
                            {issue.severity}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Impact: {issue.impact}%
                        </div>
                      </div>
                      
                      <h4 className="font-semibold mb-2">{issue.description}</h4>
                      <div className="text-sm text-muted-foreground mb-2">
                        Location: {issue.location}
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="text-sm font-medium text-blue-800 mb-1">Suggestion:</div>
                        <div className="text-sm text-blue-700">{issue.suggestion}</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recommendations Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-purple-600" />
                Refresh Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold">High Priority Actions</h4>
                  <div className="space-y-2">
                    {issues.filter(i => i.severity === 'high').map((issue) => (
                      <div key={issue.id} className="flex items-center gap-2 p-2 bg-red-50 rounded">
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                        <span className="text-sm">{issue.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold">Medium Priority Actions</h4>
                  <div className="space-y-2">
                    {issues.filter(i => i.severity === 'medium').map((issue) => (
                      <div key={issue.id} className="flex items-center gap-2 p-2 bg-yellow-50 rounded">
                        <Clock className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm">{issue.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}