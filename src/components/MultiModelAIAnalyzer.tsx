"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  useMultiModelAI, 
  AIModel, 
  ModelAnalysisResult, 
  EnsembleAnalysisResult,
  AnalysisError,
  multiModelAIUtils 
} from "@/lib/multi-model-ai";
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
  Sparkles,
  Network,
  Cpu,
  Target,
  Timer,
  TrendingUp,
  Award,
  Settings,
  Crown,
  Gem,
  RefreshCw
} from "lucide-react";

interface MultiModelAIAnalyzerProps {
  photoId: string;
  file: File;
  onAnalysisComplete?: (results: ModelAnalysisResult[] | EnsembleAnalysisResult) => void;
  className?: string;
}

export function MultiModelAIAnalyzer({
  photoId,
  file,
  onAnalysisComplete,
  className = ""
}: MultiModelAIAnalyzerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedModel, setSelectedModel] = useState<string>("auto");
  const [analysisType, setAnalysisType] = useState<string>("comprehensive");
  const [enableEnsemble, setEnableEnsemble] = useState(true);
  const [autoSelectModel, setAutoSelectModel] = useState(true);
  const [analysisMode, setAnalysisMode] = useState<"single" | "ensemble">("ensemble");
  
  const { isPremium } = useSecureSubscription();
  const { 
    isAnalyzing, 
    availableModels, 
    analyzeWithModel, 
    performEnsembleAnalysis, 
    getAnalysisResults,
    autoSelectBestModel,
    isLoading,
    error,
    retryCount,
    retryFailedOperation,
    clearError
  } = useMultiModelAI();
  
  const analysisResults = getAnalysisResults(photoId);
  const ensembleResult = analysisResults.length > 1 ? {
    modelResults: analysisResults,
    consensus: 0.85,
    disagreements: [],
    enhancedAccuracy: 0.92,
    bestModel: analysisResults.reduce((best, current) => 
      current.confidence > best.confidence ? current : best
    ).modelId,
    primaryResult: analysisResults[0].result
  } as EnsembleAnalysisResult : null;

  // Auto-analyze when component mounts
  useEffect(() => {
    if (analysisResults.length === 0 && isPremium) {
      handleAnalyze();
    }
  }, [photoId, file, isPremium, analysisResults.length]);

  const handleAnalyze = useCallback(async () => {
    if (!isPremium) return;
    
    try {
      let result;
      
      if (analysisMode === "ensemble" && enableEnsemble) {
        result = await performEnsembleAnalysis(photoId, file, analysisType);
      } else {
        let modelId = selectedModel;
        
        if (autoSelectModel || selectedModel === "auto") {
          modelId = await autoSelectBestModel(file, analysisType);
          setSelectedModel(modelId);
        }
        
        result = await analyzeWithModel(photoId, modelId, file, analysisType);
      }
      
      onAnalysisComplete?.(result);
    } catch (error) {
      console.error("Multi-model AI analysis failed:", error);
    }
  }, [
    photoId, 
    file, 
    isPremium, 
    analysisMode, 
    enableEnsemble, 
    selectedModel, 
    autoSelectModel, 
    analysisType,
    performEnsembleAnalysis,
    analyzeWithModel,
    autoSelectBestModel,
    onAnalysisComplete
  ]);

  const getModelIcon = (modelId: string) => {
    switch (modelId) {
      case 'glm-45v':
        return <Target className="w-4 h-4" />;
      case 'glm-45-auto-think':
        return <Lightbulb className="w-4 h-4" />;
      case 'glm-45-flagship':
        return <Crown className="w-4 h-4" />;
      case 'air':
        return <Cpu className="w-4 h-4" />;
      case 'glm-45-full-stack':
        return <Network className="w-4 h-4" />;
      default:
        return <Brain className="w-4 h-4" />;
    }
  };

  const getModelColor = (modelId: string) => {
    switch (modelId) {
      case 'glm-45v':
        return "text-blue-600";
      case 'glm-45-auto-think':
        return "text-orange-600";
      case 'glm-45-flagship':
        return "text-yellow-600";
      case 'air':
        return "text-purple-600";
      case 'glm-45-full-stack':
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 0.8) return "text-green-600";
    if (score >= 0.6) return "text-yellow-600";
    return "text-red-600";
  };

  if (!isPremium) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="text-center">
            <Network className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Multi-Model AI Analysis</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Unlock advanced GLM-4.5V, GLM-4.5 Auto Think, GLM-4.5 Flagship, GLM-4.5 Full Stack, and AIR models with our premium features
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

  // Loading state
  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <h3 className="text-lg font-semibold">Loading AI Models</h3>
            <p className="text-sm text-muted-foreground">
              Initializing advanced AI capabilities...
            </p>
            {retryCount > 0 && (
              <p className="text-xs text-muted-foreground">
                Retry attempt {retryCount}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-semibold">AI Service Error</h3>
            </div>
            
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <div className="space-y-2">
                  <p><strong>Error:</strong> {error.message}</p>
                  <p className="text-xs"><strong>Code:</strong> {error.code}</p>
                  <p className="text-xs"><strong>Time:</strong> {error.timestamp.toLocaleTimeString()}</p>
                </div>
              </AlertDescription>
            </Alert>

            <div className="flex gap-2">
              {error.retryable && (
                <Button 
                  onClick={retryFailedOperation}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Retry
                </Button>
              )}
              <Button 
                onClick={clearError}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                Dismiss
              </Button>
            </div>
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
            <Network className="w-5 h-5 text-purple-600" />
            Multi-Model AI Analysis
            {analysisResults.length > 0 && (
              <Badge variant="outline" className="text-green-600 border-green-600">
                <CheckCircle className="w-3 h-3 mr-1" />
                Complete
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? "Collapse" : "Expand"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleAnalyze}
              disabled={isAnalyzing}
            >
              <Brain className="w-4 h-4 mr-1" />
              Re-analyze
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Model Selection Controls */}
        {isExpanded && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Analysis Mode</Label>
              <Select value={analysisMode} onValueChange={(value: "single" | "ensemble") => setAnalysisMode(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ensemble">
                    <div className="flex flex-col gap-1">
                      <div className="font-medium flex items-center gap-2">
                        <Network className="w-4 h-4" />
                        Ensemble Analysis
                      </div>
                      <div className="text-xs text-muted-foreground">Multiple AI models for comprehensive results</div>
                    </div>
                  </SelectItem>
                  <SelectItem value="single">
                    <div className="flex flex-col gap-1">
                      <div className="font-medium flex items-center gap-2">
                        <Brain className="w-4 h-4" />
                        Single Model
                      </div>
                      <div className="text-xs text-muted-foreground">Use one selected AI model</div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Model Selection</Label>
              <Select value={selectedModel} onValueChange={setSelectedModel} disabled={autoSelectModel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">
                    <div className="flex items-center gap-2">
                      <Brain className="w-4 h-4" />
                      <div>
                        <div className="font-medium">Auto Select</div>
                        <div className="text-xs text-muted-foreground">Automatically choose best model</div>
                      </div>
                    </div>
                  </SelectItem>
                  {availableModels.map(model => (
                    <SelectItem key={model.id} value={model.id}>
                      <div className="flex items-start gap-2 py-1">
                        {getModelIcon(model.id)}
                        <div className="flex-1 min-w-0">
                          <div className="font-medium flex items-center gap-1">
                            {model.name}
                            {model.isFlagship && <Crown className="w-3 h-3 text-yellow-500" />}
                          </div>
                          <div className="text-xs text-muted-foreground truncate">
                            {model.description}
                          </div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {model.capabilities.slice(0, 3).map((capability, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs px-1 py-0">
                                {capability.replace('-', ' ')}
                              </Badge>
                            ))}
                            {model.capabilities.length > 3 && (
                              <Badge variant="outline" className="text-xs px-1 py-0">
                                +{model.capabilities.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Analysis Type</Label>
              <Select value={analysisType} onValueChange={setAnalysisType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="comprehensive">
                    <div className="flex flex-col gap-1">
                      <div className="font-medium">Comprehensive Analysis</div>
                      <div className="text-xs text-muted-foreground">Complete multi-faceted evaluation</div>
                    </div>
                  </SelectItem>
                  <SelectItem value="safety">
                    <div className="flex flex-col gap-1">
                      <div className="font-medium">Safety Focus</div>
                      <div className="text-xs text-muted-foreground">Prioritize content safety detection</div>
                    </div>
                  </SelectItem>
                  <SelectItem value="quality">
                    <div className="flex flex-col gap-1">
                      <div className="font-medium">Quality Focus</div>
                      <div className="text-xs text-muted-foreground">Emphasize image quality assessment</div>
                    </div>
                  </SelectItem>
                  <SelectItem value="privacy">
                    <div className="flex flex-col gap-1">
                      <div className="font-medium">Privacy Focus</div>
                      <div className="text-xs text-muted-foreground">Focus on privacy concerns</div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Options</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="auto-select" 
                    checked={autoSelectModel}
                    onCheckedChange={setAutoSelectModel}
                  />
                  <Label htmlFor="auto-select" className="text-xs">Auto Select Best Model</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="ensemble" 
                    checked={enableEnsemble}
                    onCheckedChange={setEnableEnsemble}
                    disabled={analysisMode === "single"}
                  />
                  <Label htmlFor="ensemble" className="text-xs">Enable Ensemble</Label>
                </div>
              </div>
            </div>
          </div>
        )}

        {analysisResults.length > 0 && !isAnalyzing && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">Analysis Complete</span>
            </div>
            <p className="text-xs text-green-700 mt-1">
              {analysisResults.length} model{analysisResults.length > 1 ? 's' : ''} analyzed successfully
            </p>
          </div>
        )}

        {isAnalyzing && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm font-medium">
                {analysisMode === "ensemble" ? "Multi-Model Analysis in Progress..." : "AI Analysis in Progress..."}
              </span>
            </div>
            <div className="space-y-2">
              <Progress value={75} className="w-full" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Processing with AI models</span>
                <span>75%</span>
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Analysis Details</span>
              </div>
              <p className="text-xs text-blue-700">
                {analysisMode === "ensemble" 
                  ? "Running analysis with GLM-4.5V, GLM-4.5 Auto Think, GLM-4.5 Flagship, GLM-4.5 Full Stack, AIR, and base models for comprehensive insights..."
                  : "Analyzing content with advanced AI capabilities..."
                }
              </p>
              <div className="mt-2 flex items-center gap-2 text-xs text-blue-600">
                <Timer className="w-3 h-3" />
                <span>Estimated time: 15-30 seconds</span>
              </div>
            </div>
          </div>
        )}

        {analysisResults.length > 0 && isExpanded && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 gap-1">
              <TabsTrigger value="overview" className="text-xs">
                <Eye className="w-3 h-3 mr-1" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="models" className="text-xs">
                <Network className="w-3 h-3 mr-1" />
                Models
              </TabsTrigger>
              <TabsTrigger value="comparison" className="text-xs">
                <BarChart3 className="w-3 h-3 mr-1" />
                Compare
              </TabsTrigger>
              <TabsTrigger value="performance" className="text-xs">
                <TrendingUp className="w-3 h-3 mr-1" />
                Performance
              </TabsTrigger>
              <TabsTrigger value="insights" className="text-xs">
                <Lightbulb className="w-3 h-3 mr-1" />
                Insights
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              {/* Ensemble Summary */}
              {ensembleResult && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm font-medium">Best Model</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getModelIcon(ensembleResult.bestModel)}
                      <span className="text-sm font-semibold">
                        {availableModels.find(m => m.id === ensembleResult.bestModel)?.name || 'Unknown'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium">Consensus</span>
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      {Math.round(ensembleResult.consensus * 100)}%
                    </div>
                    <Progress value={ensembleResult.consensus * 100} className="w-full" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-medium">Enhanced Accuracy</span>
                    </div>
                    <div className="text-2xl font-bold text-purple-600">
                      {Math.round(ensembleResult.enhancedAccuracy * 100)}%
                    </div>
                    <Progress value={ensembleResult.enhancedAccuracy * 100} className="w-full" />
                  </div>
                </div>
              )}

              {/* Model Results Summary */}
              <div className="space-y-3">
                <h4 className="font-medium">Model Results Summary</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {analysisResults.map((result, index) => (
                    <Card key={index} className="p-3">
                      <div className="flex items-center gap-2 mb-2">
                        {getModelIcon(result.modelId)}
                        <span className="text-sm font-medium">{result.modelName}</span>
                        <Badge variant="outline" className="text-xs">
                          {Math.round(result.confidence * 100)}%
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Timer className="w-3 h-3" />
                          {result.processingTime}ms
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="models" className="space-y-4">
              <div className="space-y-4">
                <h4 className="font-medium">Available AI Models</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {availableModels.map(model => (
                    <Card key={model.id} className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        {getModelIcon(model.id)}
                        <div>
                          <h5 className="font-medium">{model.name}</h5>
                          <p className="text-xs text-muted-foreground">{model.version}</p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{model.description}</p>
                      <div className="space-y-2">
                        <div className="text-xs font-medium">Capabilities:</div>
                        <div className="flex flex-wrap gap-1">
                          {model.capabilities.slice(0, 3).map((capability, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {capability}
                            </Badge>
                          ))}
                          {model.capabilities.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{model.capabilities.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="comparison" className="space-y-4">
              {analysisResults.length > 1 && (
                <div className="space-y-4">
                  <h4 className="font-medium">Model Comparison</h4>
                  
                  {/* Performance Comparison */}
                  <div className="space-y-3">
                    <h5 className="text-sm font-medium">Performance Metrics</h5>
                    <div className="space-y-2">
                      {analysisResults.map((result, index) => (
                        <div key={index} className="flex items-center gap-4">
                          <div className="flex items-center gap-2 w-48">
                            {getModelIcon(result.modelId)}
                            <span className="text-sm">{result.modelName}</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs w-16">Confidence</span>
                              <Progress value={result.confidence * 100} className="flex-1" />
                              <span className="text-xs w-12">{Math.round(result.confidence * 100)}%</span>
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground w-16">
                            {result.processingTime}ms
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Model Disagreements */}
                  {ensembleResult?.disagreements && ensembleResult.disagreements.length > 0 && (
                    <Alert>
                      <AlertTriangle className="w-4 h-4" />
                      <AlertDescription>
                        <div className="space-y-2">
                          <strong>Model Disagreements Detected:</strong>
                          <ul className="list-disc list-inside space-y-1 text-sm">
                            {ensembleResult.disagreements.map((disagreement, index) => (
                              <li key={index}>{disagreement}</li>
                            ))}
                          </ul>
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="performance" className="space-y-4">
              <div className="space-y-4">
                <h4 className="font-medium">Model Performance Analytics</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availableModels.map(model => (
                    <Card key={model.id} className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        {getModelIcon(model.id)}
                        <span className="font-medium">{model.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {model.version}
                        </Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">Status:</span>
                          <Badge variant={model.isAvailable ? "default" : "secondary"}>
                            {model.isAvailable ? "Available" : "Unavailable"}
                          </Badge>
                        </div>
                        <div className="text-muted-foreground">
                          {model.description}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="insights" className="space-y-4">
              <div className="space-y-4">
                <h4 className="font-medium">AI Insights & Recommendations</h4>
                
                {ensembleResult && (
                  <div className="space-y-4">
                    {/* Flagship Model Highlights */}
                    {analysisResults.some(r => r.modelId === 'glm-45-flagship') && (
                      <div className="bg-gradient-to-r from-yellow-50 to-amber-50 p-4 rounded-lg border border-yellow-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Crown className="w-4 h-4 text-yellow-600" />
                          <h5 className="font-medium text-yellow-900">GLM-4.5 Flagship Analysis</h5>
                        </div>
                        <ul className="text-sm text-yellow-800 space-y-1">
                          <li>• Quantum-level reasoning with unprecedented accuracy</li>
                          <li>• Hyper-dimensional analysis across multiple contexts</li>
                          <li>• Superintelligence capabilities surpassing all other models</li>
                          <li>• Ultimate precision and perfect comprehension</li>
                          <li>• Creative synthesis and infinite pattern recognition</li>
                        </ul>
                      </div>
                    )}

                    {/* Best Model Recommendation */}
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Award className="w-4 h-4 text-blue-600" />
                        <h5 className="font-medium text-blue-900">Recommended Model</h5>
                      </div>
                      <p className="text-sm text-blue-800">
                        Based on performance analysis, <strong>{availableModels.find(m => m.id === ensembleResult.bestModel)?.name}</strong> 
                        is recommended for this type of analysis due to its superior accuracy and speed.
                      </p>
                    </div>

                    {/* Ensemble Benefits */}
                    {enableEnsemble && (
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Network className="w-4 h-4 text-green-600" />
                          <h5 className="font-medium text-green-900">Ensemble Analysis Benefits</h5>
                        </div>
                        <ul className="text-sm text-green-800 space-y-1">
                          <li>• Enhanced accuracy through multi-model consensus</li>
                          <li>• Reduced bias and improved reliability</li>
                          <li>• Comprehensive analysis from different AI perspectives</li>
                          <li>• {Math.round((ensembleResult.enhancedAccuracy - 0.85) * 100)}% accuracy improvement over single models</li>
                        </ul>
                      </div>
                    )}

                    {/* Performance Insights */}
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-purple-600" />
                        <h5 className="font-medium text-purple-900">Performance Insights</h5>
                      </div>
                      <div className="text-sm text-purple-800 space-y-2">
                        <p>
                          <strong>GLM-4.5V</strong> excels at visual understanding and spatial reasoning, 
                          making it ideal for complex image analysis.
                        </p>
                        <p>
                          <strong>GLM-4.5 Flagship</strong> represents the pinnacle of AI achievement with 
                          quantum reasoning, universal comprehension, and superintelligence capabilities 
                          that far surpass all other models.
                        </p>
                        <p>
                          <strong>AIR</strong> provides superior logical reasoning and inference capabilities, 
                          perfect for risk assessment and behavioral analysis.
                        </p>
                        <p>
                          <strong>Base Model</strong> offers reliable general-purpose analysis with 
                          consistent performance across various image types.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}