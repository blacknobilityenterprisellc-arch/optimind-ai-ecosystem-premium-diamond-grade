"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Loader2,
  RefreshCw,
  Clock,
  Calendar,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
} from "lucide-react";

interface ContentAnalysis {
  url: string;
  freshnessScore: number;
  lastUpdated: string;
  recommendations: string[];
  issues: string[];
  opportunities: string[];
  wordCount: number;
  readingTime: string;
}

export function ContentFreshnessDetector() {
  const [contentUrl, setContentUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] =
    useState<ContentAnalysis | null>(null);
  const [progress, setProgress] = useState(0);

  const handleAnalyze = async () => {
    if (!contentUrl.trim()) {
      toast.error("Please enter a content URL");
      return;
    }

    setIsAnalyzing(true);
    setProgress(0);

    try {
      // Simulate analysis progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 15;
        });
      }, 250);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 3000));

      setProgress(100);

      // Mock analysis results
      const mockResults: ContentAnalysis = {
        url: contentUrl,
        freshnessScore: Math.floor(Math.random() * 40) + 60, // 60-100
        lastUpdated: new Date(
          Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000,
        )
          .toISOString()
          .split("T")[0],
        recommendations: [
          "Update statistics and data points",
          "Add recent industry developments",
          "Refresh examples and case studies",
          "Update outbound links to current resources",
        ],
        issues: [
          "Some statistics are outdated",
          "References to old industry standards",
          "Missing recent trend analysis",
        ],
        opportunities: [
          "Add new multimedia content",
          "Include expert quotes or insights",
          "Expand on emerging topics",
        ],
        wordCount: Math.floor(Math.random() * 2000) + 1000,
        readingTime: `${Math.floor(Math.random() * 8) + 3} min read`,
      };

      setAnalysisResults(mockResults);
      toast.success("Content freshness analysis completed!");
    } catch (error) {
      toast.error("Failed to analyze content freshness");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getFreshnessColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getFreshnessStatus = (score: number) => {
    if (score >= 80) return "Fresh";
    if (score >= 60) return "Needs Update";
    return "Outdated";
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <RefreshCw className="w-5 h-5" />
            <span>Content Freshness Detector</span>
          </CardTitle>
          <CardDescription>
            Analyze your content to determine if it's fresh, relevant, and
            up-to-date for your audience.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Enter content URL to analyze"
              value={contentUrl}
              onChange={(e) => setContentUrl(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !contentUrl.trim()}
            >
              {isAnalyzing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
            </Button>
          </div>

          {isAnalyzing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Analyzing content freshness...</span>
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
            <CardTitle className="flex items-center justify-between">
              <span>Freshness Analysis Results</span>
              <Badge
                variant="secondary"
                className={getFreshnessColor(analysisResults.freshnessScore)}
              >
                {getFreshnessStatus(analysisResults.freshnessScore)}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Freshness Score */}
            <div className="text-center">
              <div
                className={`text-6xl font-bold ${getFreshnessColor(analysisResults.freshnessScore)}`}
              >
                {analysisResults.freshnessScore}%
              </div>
              <div className="text-sm text-muted-foreground">
                Content Freshness Score
              </div>
              <Progress
                value={analysisResults.freshnessScore}
                className="w-full max-w-md mx-auto mt-2"
              />
            </div>

            {/* Content Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span className="font-semibold">
                    {analysisResults.lastUpdated}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Last Updated
                </div>
              </div>
              <div className="text-center">
                <div className="font-semibold">
                  {analysisResults.wordCount.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Word Count</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center">
                  <Clock className="w-4 h-4 mr-2" />
                  <span className="font-semibold">
                    {analysisResults.readingTime}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Reading Time
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div>
              <h4 className="font-semibold mb-2 flex items-center">
                <TrendingUp className="w-4 h-4 mr-2 text-green-600" />
                Recommendations
              </h4>
              <div className="space-y-1">
                {analysisResults.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{rec}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Issues */}
            <div>
              <h4 className="font-semibold mb-2 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2 text-yellow-600" />
                Issues Found
              </h4>
              <div className="space-y-1">
                {analysisResults.issues.map((issue, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{issue}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Opportunities */}
            <div>
              <h4 className="font-semibold mb-2 flex items-center">
                <TrendingUp className="w-4 h-4 mr-2 text-blue-600" />
                Opportunities
              </h4>
              <div className="space-y-1">
                {analysisResults.opportunities.map((opportunity, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{opportunity}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center space-x-2">
              <Button
                variant="outline"
                onClick={() => setAnalysisResults(null)}
              >
                Analyze Another
              </Button>
              <Button>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Content
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
