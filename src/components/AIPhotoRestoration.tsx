"use client";

import { useState, useCallback, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { 
  useSecureSubscription,
  useAIPhotoRestoration 
} from "@/lib/ai-photo-restoration";
import { 
  History, 
  Sparkles, 
  Wand2, 
  Image as ImageIcon,
  Download,
  Share2,
  RefreshCw,
  Settings,
  Crown,
  CreditCard,
  Clock,
  CheckCircle,
  AlertTriangle,
  Eye,
  Layers,
  Grid,
  List,
  Filter,
  Sliders,
  Brush,
  Artwork,
  Camera,
  Palette,
  FileText,
  Users,
  Upload,
  Zap,
  Star,
  Heart,
  RotateCcw,
  Crop,
  Adjustments,
  Contrast,
  Sun,
  Moon,
  Droplets,
  Wind,
  Shield,
  Scissors,
  Maximize,
  Minimize,
  Healing,
  Brightness,
  Grainy,
  Moldy,
  Vintage,
  Sharpen,
  Waves,
  PencilSketch,
  Noir,
  PopArt,
  ArtNouveau,
  Baroque,
  Renaissance,
  Split,
  Merge,
  Clone,
  Patch,
  RedEye,
  Blemish,
  Wrinkle,
  Scratch,
  Dust,
  Fade,
  Crack,
  Tear,
  Stain,
  Discoloration,
  ColorCast,
  Exposure,
  WhiteBalance,
  Focus,
  MotionBlur,
  Noisy,
  Pixelated,
  Compressed,
  LowRes,
  Damaged,
  Aged,
  Faded,
  Yellowed,
  Torn,
  Creased,
  Stained,
  WaterDamaged,
  FireDamaged,
  InsectDamage,
  LightDamage,
  ChemicalDamage
} from "lucide-react";

interface RestorationType {
  id: string;
  name: string;
  description: string;
  category: 'repair' | 'enhance' | 'colorize' | 'preserve';
  icon: React.ReactNode;
  credits: number;
  isPremium: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: string;
}

interface RestorationResult {
  id: string;
  originalUrl: string;
  restoredUrl: string;
  restorationType: string;
  settings: {
    intensity: number;
    preserveDetails: boolean;
    colorAccuracy: number;
    noiseReduction: number;
  };
  timestamp: Date;
  creditsUsed: number;
  processingTime: number;
  improvements: string[];
  beforeAfter?: {
    quality: number;
    damage: number;
    colorAccuracy: number;
  };
}

interface DamageAssessment {
  overallCondition: 'excellent' | 'good' | 'fair' | 'poor' | 'very poor';
  damageTypes: string[];
  severity: number; // 0-100
  recommendedActions: string[];
  estimatedRestorationTime: string;
  successProbability: number;
}

export function AIPhotoRestoration() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedRestoration, setSelectedRestoration] = useState<string | null>(null);
  const [results, setResults] = useState<RestorationResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [currentAction, setCurrentAction] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [batchMode, setBatchMode] = useState(false);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [damageAssessment, setDamageAssessment] = useState<DamageAssessment | null>(null);
  const [autoAssess, setAutoAssess] = useState(true);
  
  const [settings, setSettings] = useState({
    intensity: 75,
    preserveDetails: true,
    colorAccuracy: 85,
    noiseReduction: 70,
    enhanceColors: true,
    removeScratches: true,
    fixFading: true,
    reduceNoise: true,
    sharpenDetails: true
  });

  const { isPremium } = useSecureSubscription();
  const {
    restorePhoto,
    assessDamage,
    getRestorationTypes,
    isProcessing: isServiceProcessing,
    error,
    credits,
    batchRestore,
    enhanceRestoration
  } = useAIPhotoRestoration();

  const restorationTypes: RestorationType[] = [
    {
      id: "general-restoration",
      name: "General Restoration",
      description: "Comprehensive restoration for various types of damage",
      category: "repair",
      icon: <Healing className="w-5 h-5" />,
      credits: 80,
      isPremium: true,
      difficulty: "medium",
      estimatedTime: "3-5 minutes"
    },
    {
      id: "scratch-removal",
      name: "Scratch & Tear Repair",
      description: "Remove scratches, tears, and physical damage",
      category: "repair",
      icon: <Healing className="w-5 h-5" />,
      credits: 60,
      isPremium: false,
      difficulty: "easy",
      estimatedTime: "2-3 minutes"
    },
    {
      id: "fade-restoration",
      name: "Fade & Color Restoration",
      description: "Restore faded colors and fix discoloration",
      category: "enhance",
      icon: <Brightness className="w-5 h-5" />,
      credits: 50,
      isPremium: false,
      difficulty: "easy",
      estimatedTime: "1-2 minutes"
    },
    {
      id: "noise-reduction",
      name: "Noise & Grain Reduction",
      description: "Remove digital noise and film grain",
      category: "enhance",
      icon: <Grainy className="w-5 h-5" />,
      credits: 40,
      isPremium: false,
      difficulty: "easy",
      estimatedTime: "1-2 minutes"
    },
    {
      id: "colorization",
      name: "AI Colorization",
      description: "Add realistic colors to black and white photos",
      category: "colorize",
      icon: <Palette className="w-5 h-5" />,
      credits: 100,
      isPremium: true,
      difficulty: "hard",
      estimatedTime: "5-8 minutes"
    },
    {
      id: "face-restoration",
      name: "Face & Portrait Restoration",
      description: "Specialized restoration for faces and portraits",
      category: "repair",
      icon: <Users className="w-5 h-5" />,
      credits: 90,
      isPremium: true,
      difficulty: "medium",
      estimatedTime: "4-6 minutes"
    },
    {
      id: "document-restoration",
      name: "Document & Text Restoration",
      description: "Restore old documents and improve text readability",
      category: "preserve",
      icon: <FileText className="w-5 h-5" />,
      credits: 70,
      isPremium: true,
      difficulty: "medium",
      estimatedTime: "3-4 minutes"
    },
    {
      id: "damage-repair",
      name: "Severe Damage Repair",
      description: "Repair heavily damaged photos with advanced AI",
      category: "repair",
      icon: <AlertTriangle className="w-5 h-5" />,
      credits: 120,
      isPremium: true,
      difficulty: "hard",
      estimatedTime: "8-12 minutes"
    },
    {
      id: "enhancement",
      name: "Photo Enhancement",
      description: "General enhancement and quality improvement",
      category: "enhance",
      icon: <Sparkles className="w-5 h-5" />,
      credits: 30,
      isPremium: false,
      difficulty: "easy",
      estimatedTime: "30-60 seconds"
    },
    {
      id: "sharpening",
      name: "Detail Sharpening",
      description: "Enhance details and improve sharpness",
      category: "enhance",
      icon: <Sharpen className="w-5 h-5" />,
      credits: 35,
      isPremium: false,
      difficulty: "easy",
      estimatedTime: "30-60 seconds"
    },
    {
      id: "mold-removal",
      name: "Mold & Stain Removal",
      description: "Remove mold, stains, and discoloration",
      category: "repair",
      icon: <Moldy className="w-5 h-5" />,
      credits: 75,
      isPremium: true,
      difficulty: "medium",
      estimatedTime: "4-6 minutes"
    },
    {
      id: "vintage-enhance",
      name: "Vintage Enhancement",
      description: "Enhance vintage photos while preserving character",
      category: "preserve",
      icon: <Vintage className="w-5 h-5" />,
      credits: 55,
      isPremium: false,
      difficulty: "medium",
      estimatedTime: "2-3 minutes"
    }
  ];

  const handleDamageAssessment = useCallback(async () => {
    if (!selectedImage || !isPremium) return;

    try {
      setIsProcessing(true);
      setCurrentAction("Assessing photo damage...");
      setProcessingProgress(0);

      const assessment = await assessDamage(selectedImage);

      if (assessment) {
        setDamageAssessment(assessment);
        
        // Auto-select restoration type based on assessment
        if (assessment.damageTypes.includes('faded') || assessment.damageTypes.includes('discoloration')) {
          setSelectedRestoration('fade-restoration');
        } else if (assessment.damageTypes.includes('scratches') || assessment.damageTypes.includes('tears')) {
          setSelectedRestoration('scratch-removal');
        } else if (assessment.damageTypes.includes('noise') || assessment.damageTypes.includes('grain')) {
          setSelectedRestoration('noise-reduction');
        } else if (assessment.severity > 70) {
          setSelectedRestoration('damage-repair');
        } else {
          setSelectedRestoration('general-restoration');
        }
      }

      setIsProcessing(false);
    } catch (error) {
      console.error('Damage assessment failed:', error);
      setIsProcessing(false);
    }
  }, [selectedImage, isPremium, assessDamage]);

  const handleRestoration = useCallback(async () => {
    if (!selectedImage || !selectedRestoration || !isPremium) return;

    try {
      setIsProcessing(true);
      setCurrentAction("Restoring photo...");
      setProcessingProgress(0);

      const result = await restorePhoto(selectedImage, selectedRestoration, settings);

      if (result.success) {
        const restorationResult: RestorationResult = {
          id: Date.now().toString(),
          originalUrl: selectedImage,
          restoredUrl: result.restoredImageUrl!,
          restorationType: selectedRestoration,
          settings,
          timestamp: new Date(),
          creditsUsed: result.creditsUsed,
          processingTime: result.processingTime,
          improvements: result.improvements || [],
          beforeAfter: result.beforeAfter
        };

        setResults(prev => [restorationResult, ...prev]);
      }

      setIsProcessing(false);
    } catch (error) {
      console.error('Photo restoration failed:', error);
      setIsProcessing(false);
    }
  }, [selectedImage, selectedRestoration, isPremium, settings, restorePhoto]);

  const handleBatchRestore = useCallback(async () => {
    if (!selectedImage || !selectedRestoration || !isPremium) return;

    try {
      setIsProcessing(true);
      setCurrentAction("Batch restoration...");
      setProcessingProgress(0);

      const variations = await batchRestore(selectedImage, selectedRestoration, 3);

      if (variations.length > 0) {
        const newResults = variations.map((variation, index) => ({
          id: `${Date.now()}-${index}`,
          originalUrl: selectedImage,
          restoredUrl: variation.restoredImageUrl!,
          restorationType: selectedRestoration,
          settings: { ...settings, intensity: settings.intensity + (index * 10) },
          timestamp: new Date(),
          creditsUsed: variation.creditsUsed,
          processingTime: variation.processingTime,
          improvements: variation.improvements || []
        }));

        setResults(prev => [...newResults, ...prev]);
      }

      setIsProcessing(false);
    } catch (error) {
      console.error('Batch restoration failed:', error);
      setIsProcessing(false);
    }
  }, [selectedImage, selectedRestoration, isPremium, settings, batchRestore]);

  const handleDownload = useCallback((result: RestorationResult) => {
    const link = document.createElement('a');
    link.href = result.restoredUrl;
    link.download = `restored-${result.restorationType}-${Date.now()}.jpg`;
    link.click();
  }, []);

  const estimateCredits = useCallback(() => {
    const restoration = restorationTypes.find(r => r.id === selectedRestoration);
    if (!restoration) return 0;

    let total = restoration.credits;
    if (settings.intensity > 80) total *= 1.2;
    if (settings.colorAccuracy > 90) total *= 1.1;
    if (batchMode) total *= 2.5;

    return Math.round(total);
  }, [selectedRestoration, settings, batchMode]);

  const getConditionColor = (condition: DamageAssessment['overallCondition']) => {
    switch (condition) {
      case 'excellent': return 'text-green-600 bg-green-50';
      case 'good': return 'text-blue-600 bg-blue-50';
      case 'fair': return 'text-yellow-600 bg-yellow-50';
      case 'poor': return 'text-orange-600 bg-orange-50';
      case 'very poor': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getDifficultyIcon = (difficulty: RestorationType['difficulty']) => {
    switch (difficulty) {
      case 'easy': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'medium': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'hard': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return <CheckCircle className="w-4 h-4" />;
    }
  };

  if (!isPremium) {
    return (
      <Card className="w-full">
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
              <History className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold">AI Photo Restoration</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Restore old, damaged, and faded photos to their former glory using advanced AI technology. 
              Repair scratches, remove noise, and enhance vintage photographs.
            </p>
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
              <div className="text-center">
                <Healing className="w-8 h-8 mx-auto text-green-500 mb-2" />
                <div className="text-xs font-medium">Damage Repair</div>
              </div>
              <div className="text-center">
                <Palette className="w-8 h-8 mx-auto text-blue-500 mb-2" />
                <div className="text-xs font-medium">Color Restore</div>
              </div>
              <div className="text-center">
                <Sparkles className="w-8 h-8 mx-auto text-purple-500 mb-2" />
                <div className="text-xs font-medium">Quality Enhance</div>
              </div>
            </div>
            <Button size="lg" className="premium-button">
              <Crown className="w-4 h-4 mr-2" />
              Unlock Photo Restoration
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <History className="w-6 h-6 text-green-600" />
            AI Photo Restoration
          </h2>
          <p className="text-muted-foreground">Restore and enhance old or damaged photos</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-green-600">
            {credits} credits
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
          >
            {viewMode === "grid" ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Processing Overlay */}
      {isProcessing && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{currentAction}</span>
                <span className="text-sm text-muted-foreground">{processingProgress}%</span>
              </div>
              <Progress value={processingProgress} className="h-2" />
              <p className="text-xs text-muted-foreground">
                AI is analyzing and restoring your photo...
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="restore" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="restore">Restore</TabsTrigger>
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
        </TabsList>

        <TabsContent value="restore" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Photo Upload & Assessment */}
            <div className="lg:col-span-1 space-y-6">
              {/* Image Upload */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Your Photo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50">
                    {selectedImage ? (
                      <div className="space-y-4">
                        <img
                          src={selectedImage}
                          alt="Selected for restoration"
                          className="max-w-full max-h-48 mx-auto rounded-lg shadow-lg"
                        />
                        <Button variant="outline" size="sm">
                          Change Photo
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <ImageIcon className="w-12 h-12 mx-auto text-gray-400" />
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Upload Photo</h3>
                          <p className="text-muted-foreground text-sm">
                            Select a photo to restore
                          </p>
                        </div>
                        <Button>
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Photo
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Damage Assessment */}
              {selectedImage && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Damage Assessment</CardTitle>
                      <Switch
                        checked={autoAssess}
                        onCheckedChange={setAutoAssess}
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {autoAssess && (
                      <Button 
                        onClick={handleDamageAssessment}
                        disabled={isProcessing}
                        className="w-full"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Assess Damage
                      </Button>
                    )}

                    {damageAssessment && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Condition</span>
                          <Badge className={getConditionColor(damageAssessment.overallCondition)}>
                            {damageAssessment.overallCondition.replace('-', ' ')}
                          </Badge>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Damage Level</span>
                            <span className="text-sm font-medium">{damageAssessment.severity}%</span>
                          </div>
                          <Progress value={damageAssessment.severity} className="h-2" />
                        </div>

                        <div>
                          <span className="text-sm font-medium">Damage Types:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {damageAssessment.damageTypes.map((damage, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {damage}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="text-xs text-muted-foreground">
                          <div>• Success rate: {damageAssessment.successProbability}%</div>
                          <div>• Estimated time: {damageAssessment.estimatedRestorationTime}</div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Restoration Controls */}
            <div className="lg:col-span-2 space-y-6">
              {/* Restoration Type Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Restoration Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {restorationTypes.map(type => (
                      <div
                        key={type.id}
                        className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                          selectedRestoration === type.id
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                        } ${type.isPremium && credits < type.credits ? 'opacity-50' : ''}`}
                        onClick={() => type.isPremium && credits >= type.credits ? setSelectedRestoration(type.id) : null}
                      >
                        <div className="text-center">
                          <div className="text-2xl mb-2">{type.icon}</div>
                          <div className="font-medium text-sm">{type.name}</div>
                          <div className="text-xs text-muted-foreground mt-1">{type.description}</div>
                          <div className="flex items-center justify-center gap-1 mt-2">
                            {getDifficultyIcon(type.difficulty)}
                            <span className="text-xs text-muted-foreground">{type.estimatedTime}</span>
                          </div>
                          {type.isPremium && <Crown className="w-3 h-3 text-yellow-500 mx-auto mt-1" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Restoration Settings */}
              {selectedRestoration && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Restoration Settings</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAdvanced(!showAdvanced)}
                      >
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Basic Settings */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">Restoration Intensity</Label>
                          <span className="text-xs text-muted-foreground">{settings.intensity}%</span>
                        </div>
                        <Slider
                          value={[settings.intensity]}
                          onValueChange={(value) => setSettings(prev => ({ ...prev, intensity: value[0] }))}
                          max={100}
                          min={0}
                          step={1}
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">Color Accuracy</Label>
                          <span className="text-xs text-muted-foreground">{settings.colorAccuracy}%</span>
                        </div>
                        <Slider
                          value={[settings.colorAccuracy]}
                          onValueChange={(value) => setSettings(prev => ({ ...prev, colorAccuracy: value[0] }))}
                          max={100}
                          min={0}
                          step={1}
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">Noise Reduction</Label>
                          <span className="text-xs text-muted-foreground">{settings.noiseReduction}%</span>
                        </div>
                        <Slider
                          value={[settings.noiseReduction]}
                          onValueChange={(value) => setSettings(prev => ({ ...prev, noiseReduction: value[0] }))}
                          max={100}
                          min={0}
                          step={1}
                        />
                      </div>
                    </div>

                    {/* Advanced Options */}
                    {showAdvanced && (
                      <div className="space-y-4 pt-4 border-t">
                        <h4 className="font-medium">Advanced Options</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="preserve-details"
                              checked={settings.preserveDetails}
                              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, preserveDetails: checked }))}
                            />
                            <Label htmlFor="preserve-details" className="text-sm">Preserve Original Details</Label>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Switch
                              id="enhance-colors"
                              checked={settings.enhanceColors}
                              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enhanceColors: checked }))}
                            />
                            <Label htmlFor="enhance-colors" className="text-sm">Enhance Colors</Label>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Switch
                              id="remove-scratches"
                              checked={settings.removeScratches}
                              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, removeScratches: checked }))}
                            />
                            <Label htmlFor="remove-scratches" className="text-sm">Remove Scratches</Label>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Switch
                              id="fix-fading"
                              checked={settings.fixFading}
                              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, fixFading: checked }))}
                            />
                            <Label htmlFor="fix-fading" className="text-sm">Fix Fading</Label>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Switch
                              id="reduce-noise"
                              checked={settings.reduceNoise}
                              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, reduceNoise: checked }))}
                            />
                            <Label htmlFor="reduce-noise" className="text-sm">Reduce Noise</Label>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Switch
                              id="sharpen-details"
                              checked={settings.sharpenDetails}
                              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, sharpenDetails: checked }))}
                            />
                            <Label htmlFor="sharpen-details" className="text-sm">Sharpen Details</Label>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Switch
                              id="batch-mode"
                              checked={batchMode}
                              onCheckedChange={setBatchMode}
                            />
                            <Label htmlFor="batch-mode" className="text-sm">Batch Mode (3 variations)</Label>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="pt-4 border-t space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Estimated Cost</span>
                        <span className="text-lg font-bold text-green-600">{estimateCredits()} credits</span>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          onClick={handleRestoration}
                          disabled={!selectedImage || !selectedRestoration || credits < estimateCredits()}
                          className="flex-1"
                        >
                          <Wand2 className="w-4 h-4 mr-2" />
                          Restore Photo
                        </Button>
                        
                        <Button 
                          variant="outline"
                          onClick={handleBatchRestore}
                          disabled={!selectedImage || !selectedRestoration || credits < estimateCredits() * 2.5}
                        >
                          <Sparkles className="w-4 h-4 mr-2" />
                          Batch
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="gallery" className="space-y-6">
          {/* Gallery Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Restoration Gallery</h3>
            <div className="text-sm text-muted-foreground">
              {results.length} photos restored
            </div>
          </div>

          {/* Gallery Grid */}
          {results.length > 0 ? (
            <div className={`grid gap-4 ${
              viewMode === "grid" 
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "grid-cols-1"
            }`}>
              {results.map(result => {
                const restoration = restorationTypes.find(r => r.id === result.restorationType);
                return (
                  <Card key={result.id} className="overflow-hidden">
                    <div className="relative aspect-square">
                      <img
                        src={result.restoredUrl}
                        alt={`Restored with ${restoration?.name}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 flex gap-1">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="w-8 h-8 p-0"
                          onClick={() => handleDownload(result)}
                        >
                          <Download className="w-3 h-3" />
                        </Button>
                      </div>
                      <div className="absolute bottom-2 left-2">
                        <Badge variant="outline" className="text-xs bg-black/50 text-white border-white/20">
                          {restoration?.name}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-3">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{result.timestamp.toLocaleDateString()}</span>
                          <span>{result.creditsUsed} credits</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {result.improvements.slice(0, 2).map((improvement, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {improvement}
                            </Badge>
                          ))}
                          {result.improvements.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{result.improvements.length - 2}
                            </Badge>
                          )}
                        </div>
                        {result.beforeAfter && (
                          <div className="text-xs text-green-600">
                            Quality improved: {result.beforeAfter.quality}%
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <History className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Photos Restored Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Restore your first photo using AI-powered restoration tools
                </p>
                <Button onClick={() => setSelectedRestoration("general-restoration")}>
                  Try General Restoration
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="services" className="space-y-6">
          {/* Service Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(['repair', 'enhance', 'colorize', 'preserve'] as const).map(category => (
              <Card key={category}>
                <CardHeader>
                  <CardTitle className="text-lg capitalize">{category} Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {restorationTypes
                      .filter(service => service.category === category)
                      .map(service => (
                        <div
                          key={service.id}
                          className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                            selectedRestoration === service.id
                              ? 'border-green-500 bg-green-50'
                              : 'border-gray-200 hover:border-gray-300'
                          } ${service.isPremium && credits < service.credits ? 'opacity-50' : ''}`}
                          onClick={() => service.isPremium && credits >= service.credits ? setSelectedRestoration(service.id) : null}
                        >
                          <div className="flex items-center gap-3">
                            <div className="text-xl">{service.icon}</div>
                            <div className="flex-1">
                              <div className="font-medium text-sm">{service.name}</div>
                              <div className="text-xs text-muted-foreground">{service.description}</div>
                              <div className="flex items-center gap-2 mt-1">
                                {getDifficultyIcon(service.difficulty)}
                                <span className="text-xs text-muted-foreground">{service.estimatedTime}</span>
                                <Badge variant="outline" className="text-xs">
                                  {service.credits} credits
                                </Badge>
                              </div>
                            </div>
                            {service.isPremium && <Crown className="w-3 h-3 text-yellow-500" />}
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Service Information */}
          {selectedRestoration && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {restorationTypes.find(s => s.id === selectedRestoration)?.icon}
                  {restorationTypes.find(s => s.id === selectedRestoration)?.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    {restorationTypes.find(s => s.id === selectedRestoration)?.description}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Difficulty</Label>
                      <div className="flex items-center gap-2 mt-1">
                        {getDifficultyIcon(restorationTypes.find(s => s.id === selectedRestoration)?.difficulty || 'medium')}
                        <span className="text-sm text-muted-foreground capitalize">
                          {restorationTypes.find(s => s.id === selectedRestoration)?.difficulty}
                        </span>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Estimated Time</Label>
                      <div className="text-sm text-muted-foreground mt-1">
                        {restorationTypes.find(s => s.id === selectedRestoration)?.estimatedTime}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Credits Required</Label>
                      <div className="text-lg font-bold text-green-600 mt-1">
                        {restorationTypes.find(s => s.id === selectedRestoration)?.credits} credits
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <Button
                      onClick={() => {
                        setSelectedImage("https://picsum.photos/seed/demo/400/300.jpg");
                        handleRestoration();
                      }}
                      disabled={credits < (restorationTypes.find(s => s.id === selectedRestoration)?.credits || 0)}
                    >
                      Try This Service
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}