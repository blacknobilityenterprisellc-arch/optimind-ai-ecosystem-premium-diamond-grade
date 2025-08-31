"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAIEnhancement, AIAnalysisResult } from "@/lib/ai-enhancement";
import { useSecureSubscription } from "@/lib/secure-subscription-manager";
import { 
  Brain, 
  Shield, 
  Eye, 
  Heart, 
  Star, 
  Zap, 
  Camera,
  FileText,
  Users,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Tag,
  Lock,
  Sparkles
} from "lucide-react";

interface AIEnhancedAnalyzerProps {
  photoId: string;
  file: File;
  onAnalysisComplete?: (result: AIAnalysisResult) => void;
  className?: string;
}

export function AIEnhancedAnalyzer({
  photoId,
  file,
  onAnalysisComplete,
  className = ""
}: AIEnhancedAnalyzerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [description, setDescription] = useState("");
  const [privacyConcerns, setPrivacyConcerns] = useState<string[]>([]);
  const [privacySuggestions, setPrivacySuggestions] = useState<string[]>([]);
  
  const { isPremium } = useSecureSubscription();
  const { 
    isAnalyzing, 
    analyzePhoto, 
    getAnalysisResult, 
    generateDescription, 
    getPrivacyConcerns,
    getPrivacySuggestions 
  } = useAIEnhancement();
  
  const analysisResult = getAnalysisResult(photoId);

  // Auto-analyze when component mounts
  useEffect(() => {
    if (!analysisResult && isPremium) {
      handleAnalyze();
    }
  }, [photoId, file, isPremium, analysisResult]);

  const handleAnalyze = useCallback(async () => {
    if (!isPremium) return;
    
    try {
      const result = await analyzePhoto(photoId, file);
      onAnalysisComplete?.(result);
      
      // Generate additional insights
      const desc = await generateDescription(photoId);
      setDescription(desc);
      
      const concerns = await getPrivacyConcerns(photoId);
      setPrivacyConcerns(concerns);
      
      const suggestions = await getPrivacySuggestions(photoId);
      setPrivacySuggestions(suggestions);
    } catch (error) {
      console.error("AI analysis failed:", error);
    }
  }, [photoId, file, isPremium, analyzePhoto, onAnalysisComplete, generateDescription, getPrivacyConcerns, getPrivacySuggestions]);

  const getSafetyColor = (score: number) => {
    if (score >= 0.8) return "text-green-600";
    if (score >= 0.6) return "text-yellow-600";
    return "text-red-600";
  };

  const getQualityColor = (score: number) => {
    if (score >= 0.8) return "text-green-600";
    if (score >= 0.6) return "text-yellow-600";
    return "text-red-600";
  };

  const getAestheticColor = (score: number) => {
    if (score >= 0.8) return "text-purple-600";
    if (score >= 0.6) return "text-blue-600";
    return "text-gray-600";
  };

  if (!isPremium) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="text-center">
            <Brain className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">AI-Powered Analysis</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Unlock advanced AI analysis with our premium features
            </p>
            <Button className="w-full">
              <Sparkles className="w-4 h-4 mr-2" />
              Upgrade to Premium
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            AI Analysis
            {analysisResult && (
              <Badge variant="outline" className="text-green-600 border-green-600">
                <CheckCircle className="w-3 h-3 mr-1" />
                Complete
              </Badge>
            )}
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "Collapse" : "Expand"}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {isAnalyzing && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm font-medium">AI Analysis in Progress...</span>
            </div>
            <Progress value={75} className="w-full" />
            <p className="text-xs text-muted-foreground">
              Analyzing content, detecting objects, recognizing emotions, and assessing quality...
            </p>
          </div>
        )}

        {analysisResult && isExpanded && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 gap-1">
              <TabsTrigger value="overview" className="text-xs">
                <Eye className="w-3 h-3 mr-1" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="content" className="text-xs">
                <Tag className="w-3 h-3 mr-1" />
                Content
              </TabsTrigger>
              <TabsTrigger value="quality" className="text-xs">
                <BarChart3 className="w-3 h-3 mr-1" />
                Quality
              </TabsTrigger>
              <TabsTrigger value="privacy" className="text-xs">
                <Lock className="w-3 h-3 mr-1" />
                Privacy
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              {/* Safety Assessment */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium">Safety Score</span>
                  </div>
                  <div className="text-2xl font-bold">
                    <span className={getSafetyColor(analysisResult.safetyScore)}>
                      {Math.round(analysisResult.safetyScore * 100)}%
                    </span>
                  </div>
                  <Progress value={analysisResult.safetyScore * 100} className="w-full" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium">Aesthetic Score</span>
                  </div>
                  <div className="text-2xl font-bold">
                    <span className={getAestheticColor(analysisResult.aestheticScore)}>
                      {Math.round(analysisResult.aestheticScore * 100)}%
                    </span>
                  </div>
                  <Progress value={analysisResult.aestheticScore * 100} className="w-full" />
                </div>
              </div>

              {/* Content Summary */}
              <div className="space-y-3">
                <h4 className="font-medium">Content Summary</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="w-3 h-3 text-blue-600" />
                    <span>{analysisResult.faces} faces</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-3 h-3 text-green-600" />
                    <span>{analysisResult.text.length} text elements</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Camera className="w-3 h-3 text-purple-600" />
                    <span>{analysisResult.objects.length} objects</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart className="w-3 h-3 text-red-600" />
                    <span>{analysisResult.emotions.length} emotions</span>
                  </div>
                </div>
              </div>

              {/* AI Description */}
              {description && (
                <div className="space-y-2">
                  <h4 className="font-medium">AI Description</h4>
                  <p className="text-sm text-muted-foreground italic">
                    {description}
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="content" className="space-y-4">
              {/* Objects */}
              {analysisResult.objects.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Detected Objects</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.objects.map((obj, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {obj}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Emotions */}
              {analysisResult.emotions.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Emotions Detected</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.emotions.map((emotion, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        <Heart className="w-2 h-2 mr-1" />
                        {emotion}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Text Content */}
              {analysisResult.text.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Text Content</h4>
                  <div className="space-y-1">
                    {analysisResult.text.map((text, index) => (
                      <div key={index} className="text-sm bg-gray-50 p-2 rounded">
                        {text}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Categories */}
              {analysisResult.categories.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Categories</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.categories.map((category, index) => (
                      <Badge key={index} variant="default" className="text-xs">
                        <Tag className="w-2 h-2 mr-1" />
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Enhanced Tags */}
              {analysisResult.enhancedTags.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">AI-Generated Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.enhancedTags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        <Sparkles className="w-2 h-2 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="quality" className="space-y-4">
              {/* Quality Metrics */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Overall Quality</span>
                    <span className={`text-sm font-bold ${getQualityColor(analysisResult.quality)}`}>
                      {Math.round(analysisResult.quality * 100)}%
                    </span>
                  </div>
                  <Progress value={analysisResult.quality * 100} className="w-full" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <span className="text-sm font-medium">Brightness</span>
                    <Progress value={analysisResult.metadata.brightness * 100} className="w-full" />
                    <span className="text-xs text-muted-foreground">
                      {Math.round(analysisResult.metadata.brightness * 100)}%
                    </span>
                  </div>
                  <div className="space-y-2">
                    <span className="text-sm font-medium">Contrast</span>
                    <Progress value={analysisResult.metadata.contrast * 100} className="w-full" />
                    <span className="text-xs text-muted-foreground">
                      {Math.round(analysisResult.metadata.contrast * 100)}%
                    </span>
                  </div>
                  <div className="space-y-2">
                    <span className="text-sm font-medium">Saturation</span>
                    <Progress value={analysisResult.metadata.saturation * 100} className="w-full" />
                    <span className="text-xs text-muted-foreground">
                      {Math.round(analysisResult.metadata.saturation * 100)}%
                    </span>
                  </div>
                  <div className="space-y-2">
                    <span className="text-sm font-medium">Sharpness</span>
                    <Progress value={analysisResult.metadata.sharpness * 100} className="w-full" />
                    <span className="text-xs text-muted-foreground">
                      {Math.round(analysisResult.metadata.sharpness * 100)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* AI Suggestions */}
              {analysisResult.suggestions.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">AI Suggestions</h4>
                  <div className="space-y-2">
                    {analysisResult.suggestions.map((suggestion, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm">
                        <Lightbulb className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <span>{suggestion}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="privacy" className="space-y-4">
              {/* Privacy Concerns */}
              {privacyConcerns.length > 0 ? (
                <Alert>
                  <AlertTriangle className="w-4 h-4" />
                  <AlertDescription>
                    <div className="space-y-2">
                      <strong>Privacy Concerns Detected:</strong>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {privacyConcerns.map((concern, index) => (
                          <li key={index}>{concern}</li>
                        ))}
                      </ul>
                    </div>
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert>
                  <CheckCircle className="w-4 h-4" />
                  <AlertDescription>
                    No significant privacy concerns detected in this image.
                  </AlertDescription>
                </Alert>
              )}

              {/* Privacy Suggestions */}
              {privacySuggestions.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Privacy Protection Suggestions</h4>
                  <div className="space-y-2">
                    {privacySuggestions.map((suggestion, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm p-3 bg-blue-50 rounded-lg">
                        <Lock className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>{suggestion}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Content Safety */}
              <div className="space-y-2">
                <h4 className="font-medium">Content Safety</h4>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span className="text-sm">
                    This image is marked as {analysisResult.isNsfw ? 'sensitive' : 'safe'} content
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Confidence: {Math.round(analysisResult.confidence * 100)}%
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}

        {!analysisResult && !isAnalyzing && (
          <div className="text-center">
            <Brain className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">AI-Powered Analysis</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Get comprehensive insights about your photo with advanced AI
            </p>
            <Button onClick={handleAnalyze} className="w-full">
              <Zap className="w-4 h-4 mr-2" />
              Analyze with AI
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}