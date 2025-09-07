"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Loader2, Search, BarChart3, Globe, Target, TrendingUp, AlertTriangle } from "lucide-react";

interface CompetitorAnalysis {
  domain: string;
  score: number;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  traffic: string;
  keywords: number;
  backlinks: number;
}

export function CompetitorContentAnalyzer() {
  const [competitorUrl, setCompetitorUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<CompetitorAnalysis | null>(null);
  const [progress, setProgress] = useState(0);

  const handleAnalyze = async () => {
    if (!competitorUrl.trim()) {
      toast.error("Please enter a competitor URL");
      return;
    }

    setIsAnalyzing(true);
    setProgress(0);

    try {
      // Simulate analysis progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 4000));
      
      setProgress(100);
      
      // Mock analysis results
      const mockResults: CompetitorAnalysis = {
        domain: new URL(competitorUrl).hostname,
        score: Math.floor(Math.random() * 30) + 70, // 70-100
        strengths: [
          "Strong backlink profile",
          "Excellent content strategy",
          "High domain authority",
          "Good technical SEO"
        ],
        weaknesses: [
          "Poor mobile optimization",
          "Slow page load times",
          "Limited social presence"
        ],
        opportunities: [
          "Target their weak keywords",
          "Improve on their UX",
          "Better content depth"
        ],
        traffic: `${Math.floor(Math.random() * 50) + 20}K/mo`,
        keywords: Math.floor(Math.random() * 1000) + 500,
        backlinks: Math.floor(Math.random() * 5000) + 3000,
      };

      setAnalysisResults(mockResults);
      toast.success("Competitor analysis completed!");
    } catch (error) {
      toast.error("Failed to analyze competitor");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="w-5 h-5" />
            <span>Competitor Content Analyzer</span>
          </CardTitle>
          <CardDescription>
            Analyze your competitors' content strategies and identify opportunities to outperform them.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Enter competitor URL (e.g., https://competitor.com)"
              value={competitorUrl}
              onChange={(e) => setCompetitorUrl(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !competitorUrl.trim()}
            >
              {isAnalyzing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
            </Button>
          </div>

          {isAnalyzing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Analyzing competitor...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>

      {analysisResults && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Results for {analysisResults.domain}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Overall Score */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{analysisResults.score}</div>
                <div className="text-sm text-muted-foreground">Overall Score</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{analysisResults.traffic}</div>
                <div className="text-sm text-muted-foreground">Monthly Traffic</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{analysisResults.keywords}</div>
                <div className="text-sm text-muted-foreground">Keywords</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">{analysisResults.backlinks.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Backlinks</div>
              </div>
            </div>

            {/* Strengths */}
            <div>
              <h4 className="font-semibold mb-2 flex items-center">
                <TrendingUp className="w-4 h-4 mr-2 text-green-600" />
                Strengths
              </h4>
              <div className="flex flex-wrap gap-2">
                {analysisResults.strengths.map((strength, index) => (
                  <Badge key={index} variant="secondary" className="bg-green-100 text-green-800">
                    {strength}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Weaknesses */}
            <div>
              <h4 className="font-semibold mb-2 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2 text-red-600" />
                Weaknesses
              </h4>
              <div className="flex flex-wrap gap-2">
                {analysisResults.weaknesses.map((weakness, index) => (
                  <Badge key={index} variant="secondary" className="bg-red-100 text-red-800">
                    {weakness}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Opportunities */}
            <div>
              <h4 className="font-semibold mb-2 flex items-center">
                <Target className="w-4 h-4 mr-2 text-blue-600" />
                Opportunities
              </h4>
              <div className="flex flex-wrap gap-2">
                {analysisResults.opportunities.map((opportunity, index) => (
                  <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                    {opportunity}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex justify-center space-x-2">
              <Button variant="outline" onClick={() => setAnalysisResults(null)}>
                Analyze Another
              </Button>
              <Button>
                <BarChart3 className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}