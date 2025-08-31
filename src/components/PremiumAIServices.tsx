"use client";

import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  usePremiumAIServices, 
  PremiumAIService,
  AIProcessingResult 
} from "@/lib/premium-ai-services";
import { useSecureSubscription } from "@/lib/secure-subscription-manager";
import { 
  Brain, 
  Sparkles, 
  Shield, 
  FolderOpen, 
  Wand2, 
  Users, 
  Zap,
  CheckCircle,
  AlertTriangle,
  Clock,
  Settings,
  RefreshCw,
  Play,
  Pause,
  BarChart3,
  Target,
  Image as ImageIcon,
  Filter,
  Layers,
  Crown,
  CreditCard
} from "lucide-react";

interface PremiumAIServicesProps {
  photos?: Array<{ id: string; file: File; url: string }>;
  onProcessingComplete?: (results: Map<string, AIProcessingResult>) => void;
  className?: string;
}

export function PremiumAIServices({
  photos = [],
  onProcessingComplete,
  className = ""
}: PremiumAIServicesProps) {
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [processingMode, setProcessingMode] = useState<"single" | "batch">("single");
  const [autoProcess, setAutoProcess] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [showResults, setShowResults] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(0);

  const { isPremium } = useSecureSubscription();
  const {
    services,
    isProcessing: isServiceProcessing,
    error,
    results,
    processImage,
    batchProcessImages,
    getResult,
    clearResults
  } = usePremiumAIServices();

  const categories = [
    { id: "all", name: "All Services", icon: Brain },
    { id: "analysis", name: "Analysis", icon: Target },
    { id: "enhancement", name: "Enhancement", icon: Wand2 },
    { id: "security", name: "Security", icon: Shield },
    { id: "organization", name: "Organization", icon: FolderOpen }
  ];

  const availableServices = services.getServices(activeCategory === "all" ? undefined : activeCategory);
  const selectedServiceData = selectedService ? services.getService(selectedService) : null;
  const totalCost = selectedServiceData ? 
    services.estimateCost(selectedService, selectedPhotos.length) : 0;

  const handleProcessSingle = useCallback(async () => {
    if (!selectedService || selectedPhotos.length === 0 || !isPremium) return;

    try {
      setIsProcessing(true);
      setCurrentProgress(0);

      const photo = photos.find(p => p.id === selectedPhotos[0]);
      if (!photo) return;

      const result = await processImage(selectedService, photo.id, photo.file);
      
      setCurrentProgress(100);
      onProcessingComplete?.(results);
      
      setTimeout(() => {
        setShowResults(true);
        setIsProcessing(false);
      }, 1000);
    } catch (error) {
      console.error('Processing failed:', error);
      setIsProcessing(false);
    }
  }, [selectedService, selectedPhotos, photos, isPremium, processImage, results, onProcessingComplete]);

  const handleProcessBatch = useCallback(async () => {
    if (!selectedService || selectedPhotos.length === 0 || !isPremium) return;

    try {
      setIsProcessing(true);
      setCurrentProgress(0);

      const imagesToProcess = selectedPhotos
        .map(id => photos.find(p => p.id === id))
        .filter(Boolean) as Array<{ id: string; file: File; url: string }>;

      const totalImages = imagesToProcess.length;
      
      for (let i = 0; i < imagesToProcess.length; i++) {
        const progress = ((i + 1) / totalImages) * 100;
        setCurrentProgress(progress);
        
        // Add small delay for visual feedback
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      await batchProcessImages(selectedService, imagesToProcess);
      
      setCurrentProgress(100);
      onProcessingComplete?.(results);
      
      setTimeout(() => {
        setShowResults(true);
        setIsProcessing(false);
      }, 1000);
    } catch (error) {
      console.error('Batch processing failed:', error);
      setIsProcessing(false);
    }
  }, [selectedService, selectedPhotos, photos, isPremium, batchProcessImages, results, onProcessingComplete]);

  const togglePhotoSelection = useCallback((photoId: string) => {
    setSelectedPhotos(prev => 
      prev.includes(photoId) 
        ? prev.filter(id => id !== photoId)
        : [...prev, photoId]
    );
  }, []);

  const selectAllPhotos = useCallback(() => {
    setSelectedPhotos(photos.map(p => p.id));
  }, [photos]);

  const clearSelection = useCallback(() => {
    setSelectedPhotos([]);
  }, []);

  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.icon : Brain;
  };

  const getServiceIcon = (service: PremiumAIService) => {
    switch (service.category) {
      case 'analysis': return <Target className="w-5 h-5" />;
      case 'enhancement': return <Wand2 className="w-5 h-5" />;
      case 'security': return <Shield className="w-5 h-5" />;
      case 'organization': return <FolderOpen className="w-5 h-5" />;
      default: return <Brain className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (categoryId: string) => {
    switch (categoryId) {
      case 'analysis': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'enhancement': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'security': return 'text-red-600 bg-red-50 border-red-200';
      case 'organization': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (!isPremium) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="text-center">
            <Crown className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Premium AI Services</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Access advanced AI-powered photo analysis, enhancement, and organization features
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
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-600" />
          Premium AI Services
          <Badge variant="outline" className="text-purple-600 border-purple-600">
            {availableServices.length} Services
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Category Tabs */}
        <Tabs value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="grid w-full grid-cols-5 gap-2">
            {categories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="flex items-center gap-2 p-3"
              >
                <category.icon className="w-4 h-4" />
                <span className="text-sm">{category.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeCategory} className="space-y-6">
            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableServices.map((service) => (
                <Card
                  key={service.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    selectedService === service.id
                      ? 'ring-2 ring-purple-500 bg-purple-50'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedService(service.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`p-2 rounded-lg ${getCategoryColor(service.category)}`}>
                        {getServiceIcon(service)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm mb-1">{service.name}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {service.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {service.capabilities.slice(0, 3).map((capability, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {capability}
                        </Badge>
                      ))}
                      {service.capabilities.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{service.capabilities.length - 3}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        {service.premium.premium} credits
                      </span>
                      {service.isPremium && (
                        <Crown className="w-3 h-3 text-yellow-500" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Processing Controls */}
            {selectedServiceData && (
              <Card className="border-dashed">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{selectedServiceData.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {selectedServiceData.description}
                        </p>
                      </div>
                      <Badge className={getCategoryColor(selectedServiceData.category)}>
                        {selectedServiceData.category}
                      </Badge>
                    </div>

                    {/* Photo Selection */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <Label className="text-sm font-medium">Select Photos</Label>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={selectAllPhotos}
                            disabled={photos.length === 0}
                          >
                            Select All
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={clearSelection}
                            disabled={selectedPhotos.length === 0}
                          >
                            Clear
                          </Button>
                        </div>
                      </div>

                      {photos.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 max-h-48 overflow-y-auto p-2 border rounded-lg">
                          {photos.map((photo) => (
                            <div
                              key={photo.id}
                              className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                                selectedPhotos.includes(photo.id)
                                  ? 'border-purple-500 ring-2 ring-purple-200'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                              onClick={() => togglePhotoSelection(photo.id)}
                            >
                              <img
                                src={photo.url}
                                alt={photo.file.name}
                                className="w-full h-20 object-cover"
                              />
                              {selectedPhotos.includes(photo.id) && (
                                <div className="absolute top-1 right-1 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                                  <CheckCircle className="w-3 h-3 text-white" />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <Alert>
                          <ImageIcon className="w-4 h-4" />
                          <AlertDescription>
                            Upload photos first to use AI services
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>

                    {/* Processing Options */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Processing Mode</Label>
                        <Select value={processingMode} onValueChange={(value: "single" | "batch") => setProcessingMode(value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="single">Single Photo</SelectItem>
                            <SelectItem value="batch">Batch Processing</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Auto Process</Label>
                        <div className="flex items-center space-x-2">
                          <Switch 
                            id="auto-process" 
                            checked={autoProcess}
                            onCheckedChange={setAutoProcess}
                          />
                          <Label htmlFor="auto-process" className="text-xs">Process new uploads automatically</Label>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Estimated Cost</Label>
                        <div className="text-lg font-semibold text-purple-600">
                          {totalCost} credits
                        </div>
                      </div>
                    </div>

                    {/* Progress */}
                    {(isProcessing || isServiceProcessing) && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Processing...</span>
                          <span>{Math.round(currentProgress)}%</span>
                        </div>
                        <Progress value={currentProgress} className="h-2" />
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <Button
                        onClick={processingMode === "single" ? handleProcessSingle : handleProcessBatch}
                        disabled={
                          selectedPhotos.length === 0 ||
                          isProcessing ||
                          isServiceProcessing
                        }
                        className="flex-1"
                      >
                        {isProcessing || isServiceProcessing ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 mr-2" />
                            {processingMode === "single" ? "Process Photo" : `Process ${selectedPhotos.length} Photos`}
                          </>
                        )}
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() => setShowResults(!showResults)}
                        disabled={results.size === 0}
                      >
                        <BarChart3 className="w-4 h-4 mr-2" />
                        {showResults ? "Hide Results" : "Show Results"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Results Display */}
            {showResults && results.size > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Processing Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Array.from(results.entries()).map(([photoId, result]) => {
                      const photo = photos.find(p => p.id === photoId);
                      return (
                        <div key={photoId} className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg">
                          {photo && (
                            <img
                              src={photo.url}
                              alt={photo.file.name}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                          )}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-medium">{photo?.file.name || 'Unknown'}</h4>
                              <Badge variant={result.success ? "default" : "destructive"}>
                                {result.success ? "Success" : "Failed"}
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground space-y-1">
                              <div>Processing time: {result.processingTime}ms</div>
                              <div>Credits used: {result.creditsUsed}</div>
                              {result.error && (
                                <div className="text-red-600">Error: {result.error}</div>
                              )}
                            </div>
                            {result.result && (
                              <details className="mt-2">
                                <summary className="text-sm cursor-pointer hover:text-muted-foreground">
                                  View detailed results
                                </summary>
                                <pre className="text-xs bg-background p-2 rounded mt-2 overflow-x-auto">
                                  {JSON.stringify(result.result, null, 2)}
                                </pre>
                              </details>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Error Display */}
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  {error}
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}