"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Loader2, RefreshCw, Zap, CheckCircle, AlertTriangle, TrendingUp, Download } from "lucide-react";

interface OptimizationResult {
  originalScore: number;
  optimizedScore: number;
  improvements: string[];
  optimizedContent: string;
  recommendations: string[];
  metrics: {
    readability: number;
    keywordDensity: number;
    engagement: number;
    seoScore: number;
  };
}

export function ContentOptimizationRefresh() {
  const [content, setContent] = useState("");
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null);
  const [progress, setProgress] = useState(0);

  const optimizationOptions = [
    { value: "seo", label: "SEO Optimization" },
    { value: "readability", label: "Readability" },
    { value: "engagement", label: "User Engagement" },
    { value: "keywords", label: "Keyword Optimization" },
    { value: "structure", label: "Content Structure" },
    { value: "headings", label: "Heading Optimization" },
  ];

  const handleOptimize = async () => {
    if (!content.trim()) {
      toast.error("Please enter content to optimize");
      return;
    }

    setIsOptimizing(true);
    setProgress(0);

    try {
      // Simulate optimization progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 12;
        });
      }, 400);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      setProgress(100);
      
      // Mock optimization results
      const originalScore = Math.floor(Math.random() * 30) + 50; // 50-80
      const optimizedScore = Math.floor(Math.random() * 20) + 80; // 80-100
      
      const mockResult: OptimizationResult = {
        originalScore,
        optimizedScore,
        improvements: [
          "Improved keyword placement and density",
          "Enhanced readability with better sentence structure",
          "Added engaging subheadings and formatting",
          "Optimized meta description potential",
          "Improved content flow and logical structure"
        ],
        optimizedContent: content
          .split('\n\n')
          .map(paragraph => paragraph.trim())
          .filter(p => p.length > 0)
          .map((paragraph, index) => {
            if (index === 0) {
              return `## ${paragraph}\n\nThis comprehensive guide explores the key aspects of ${paragraph.toLowerCase().split(' ')[0]} in detail, providing actionable insights and strategies for success.`;
            }
            return `${paragraph}\n\nThis section delves deeper into the topic, offering practical examples and expert insights to enhance understanding.`;
          })
          .join('\n\n'),
        recommendations: [
          "Add more specific examples and case studies",
          "Include relevant statistics and data points",
          "Consider adding multimedia elements",
          "Implement schema markup for better SEO",
          "Add internal links to related content"
        ],
        metrics: {
          readability: Math.floor(Math.random() * 30) + 70,
          keywordDensity: Math.floor(Math.random() * 25) + 75,
          engagement: Math.floor(Math.random() * 35) + 65,
          seoScore: Math.floor(Math.random() * 25) + 75,
        }
      };

      setOptimizationResult(mockResult);
      toast.success("Content optimization completed!");
    } catch (error) {
      toast.error("Failed to optimize content");
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleDownload = () => {
    if (optimizationResult) {
      const blob = new Blob([optimizationResult.optimizedContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'optimized-content.txt';
      link.click();
      URL.revokeObjectURL(url);
      toast.success("Optimized content downloaded!");
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <RefreshCw className="w-5 h-5" />
            <span>Content Optimization Refresh</span>
          </CardTitle>
          <CardDescription>
            Refresh and optimize your content for better SEO, readability, and user engagement.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Enter your content to optimize
            </label>
            <Textarea
              placeholder="Paste your content here for optimization..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[200px]"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Optimization Focus Areas
            </label>
            <div className="flex flex-wrap gap-2">
              {optimizationOptions.map((option) => (
                <Badge
                  key={option.value}
                  variant="outline"
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                >
                  {option.label}
                </Badge>
              ))}
            </div>
          </div>

          <Button
            onClick={handleOptimize}
            disabled={isOptimizing || !content.trim()}
            className="w-full"
          >
            {isOptimizing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Optimizing...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Optimize Content
              </>
            )}
          </Button>

          {isOptimizing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Optimizing content...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>

      {optimizationResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Optimization Results</span>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +{optimizationResult.optimizedScore - optimizationResult.originalScore}%
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Score Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-600">{optimizationResult.originalScore}%</div>
                <div className="text-sm text-muted-foreground">Original Score</div>
                <Progress value={optimizationResult.originalScore} className="w-full mt-2" />
              </div>
              <div className="text-center">
                <div className={`text-3xl font-bold ${getScoreColor(optimizationResult.optimizedScore)}`}>
                  {optimizationResult.optimizedScore}%
                </div>
                <div className="text-sm text-muted-foreground">Optimized Score</div>
                <Progress value={optimizationResult.optimizedScore} className="w-full mt-2" />
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{optimizationResult.metrics.readability}%</div>
                <div className="text-xs text-muted-foreground">Readability</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{optimizationResult.metrics.keywordDensity}%</div>
                <div className="text-xs text-muted-foreground">Keywords</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{optimizationResult.metrics.engagement}%</div>
                <div className="text-xs text-muted-foreground">Engagement</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{optimizationResult.metrics.seoScore}%</div>
                <div className="text-xs text-muted-foreground">SEO Score</div>
              </div>
            </div>

            {/* Improvements */}
            <div>
              <h4 className="font-semibold mb-2 flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                Improvements Made
              </h4>
              <div className="space-y-1">
                {optimizationResult.improvements.map((improvement, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{improvement}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div>
              <h4 className="font-semibold mb-2 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2 text-blue-600" />
                Additional Recommendations
              </h4>
              <div className="space-y-1">
                {optimizationResult.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <AlertTriangle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{rec}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Optimized Content */}
            <div>
              <h4 className="font-semibold mb-2">Optimized Content</h4>
              <Textarea
                value={optimizationResult.optimizedContent}
                onChange={(e) => setOptimizationResult(prev => 
                  prev ? { ...prev, optimizedContent: e.target.value } : null
                )}
                className="min-h-[200px]"
              />
            </div>

            <div className="flex justify-center space-x-2">
              <Button variant="outline" onClick={() => setOptimizationResult(null)}>
                Optimize New Content
              </Button>
              <Button onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" />
                Download Optimized
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}