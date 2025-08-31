"use client";

import { useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PremiumFeature, PremiumBadge } from "@/components/PremiumBadge";
import { Paywall } from "@/components/Paywall";
import { DropZone } from "@/components/DropZone";
import { 
  aiBackgroundGenerator, 
  BackgroundGenerationOptions,
  BackgroundGenerationResult,
  BackgroundRemovalResult,
  BackgroundReplacementOptions
} from "@/lib/ai-background-generator";
import { useToast } from "@/hooks/use-toast";
import { 
  Wand2, 
  Image as ImageIcon, 
  Download, 
  RefreshCw, 
  Palette, 
  Crop, 
  Layers,
  Sparkles,
  Zap,
  Eye,
  Settings,
  Grid,
  List,
  Filter,
  Magic,
  Eraser,
  Replace,
  Save,
  Share,
  Heart,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2
} from "lucide-react";

interface BackgroundPreset {
  id: string;
  name: string;
  prompt: string;
  style: string;
  thumbnail: string;
  category: string;
}

export default function AIBackgroundGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRemovingBackground, setIsRemovingBackground] = useState(false);
  const [isReplacingBackground, setIsReplacingBackground] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showPaywall, setShowPaywall] = useState(false);
  const [activeTab, setActiveTab] = useState("generate");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [backgroundRemovedImage, setBackgroundRemovedImage] = useState<BackgroundRemovalResult | null>(null);
  
  // Generation options
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState<BackgroundGenerationOptions['style']>('realistic');
  const [resolution, setResolution] = useState<BackgroundGenerationOptions['resolution']>('1024x1024');
  const [quality, setQuality] = useState<BackgroundGenerationOptions['quality']>('hd');
  const [mood, setMood] = useState<BackgroundGenerationOptions['mood']>('bright');
  const [composition, setComposition] = useState<BackgroundGenerationOptions['composition']>('centered');
  
  // Generated backgrounds
  const [generatedBackgrounds, setGeneratedBackgrounds] = useState<BackgroundGenerationResult[]>([]);
  const [presets, setPresets] = useState<BackgroundPreset[]>([]);
  
  const { toast } = useToast();

  const styleOptions = [
    { value: 'realistic', label: 'Realistic', icon: <Eye className="w-4 h-4" /> },
    { value: 'artistic', label: 'Artistic', icon: <Palette className="w-4 h-4" /> },
    { value: 'minimalist', label: 'Minimalist', icon: <Grid className="w-4 h-4" /> },
    { value: 'abstract', label: 'Abstract', icon: <Sparkles className="w-4 h-4" /> },
    { value: 'nature', label: 'Nature', icon: <Filter className="w-4 h-4" /> },
    { value: 'urban', label: 'Urban', icon: <Crop className="w-4 h-4" /> },
    { value: 'tech', label: 'Tech', icon: <Zap className="w-4 h-4" /> },
    { value: 'fantasy', label: 'Fantasy', icon: <Magic className="w-4 h-4" /> }
  ];

  const resolutionOptions = [
    { value: '512x512', label: '512×512 (Square)' },
    { value: '1024x1024', label: '1024×1024 (Square HD)' },
    { value: '1024x1792', label: '1024×1792 (Portrait)' },
    { value: '1792x1024', label: '1792×1024 (Landscape)' }
  ];

  const qualityOptions = [
    { value: 'standard', label: 'Standard' },
    { value: 'hd', label: 'High Definition' },
    { value: 'ultra-hd', label: 'Ultra HD' }
  ];

  const moodOptions = [
    { value: 'bright', label: 'Bright & Cheerful' },
    { value: 'dark', label: 'Dark & Moody' },
    { value: 'warm', label: 'Warm & Cozy' },
    { value: 'cool', label: 'Cool & Serene' },
    { value: 'vibrant', label: 'Vibrant & Energetic' },
    { value: 'muted', label: 'Muted & Subtle' }
  ];

  const compositionOptions = [
    { value: 'centered', label: 'Centered' },
    { value: 'rule-of-thirds', label: 'Rule of Thirds' },
    { value: 'leading-lines', label: 'Leading Lines' },
    { value: 'symmetrical', label: 'Symmetrical' },
    { value: 'asymmetrical', label: 'Asymmetrical' }
  ];

  const handleGenerateBackground = useCallback(async () => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt Required",
        description: "Please enter a description for the background you want to generate.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + Math.random() * 20, 90));
      }, 500);

      const options: BackgroundGenerationOptions = {
        prompt,
        style,
        resolution,
        quality,
        mood,
        composition
      };

      const result = await aiBackgroundGenerator.generateBackground(options);
      
      clearInterval(progressInterval);
      setProgress(100);

      setGeneratedBackgrounds(prev => [result, ...prev]);
      
      toast({
        title: "Background Generated",
        description: `Your ${style} background has been created successfully!`,
      });
    } catch (error) {
      console.error('Generation failed:', error);
      toast({
        title: "Generation Failed",
        description: "Unable to generate background. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
      setProgress(0);
    }
  }, [prompt, style, resolution, quality, mood, composition, toast]);

  const handleRemoveBackground = useCallback(async (imageUrl: string) => {
    setIsRemovingBackground(true);
    setProgress(0);

    try {
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + Math.random() * 25, 90));
      }, 400);

      const result = await aiBackgroundGenerator.removeBackground(imageUrl);
      
      clearInterval(progressInterval);
      setProgress(100);

      setBackgroundRemovedImage(result);
      
      toast({
        title: "Background Removed",
        description: "Background has been successfully removed from your image.",
      });
    } catch (error) {
      console.error('Background removal failed:', error);
      toast({
        title: "Removal Failed",
        description: "Unable to remove background. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRemovingBackground(false);
      setProgress(0);
    }
  }, [toast]);

  const handleReplaceBackground = useCallback(async (options: BackgroundReplacementOptions) => {
    setIsReplacingBackground(true);
    setProgress(0);

    try {
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + Math.random() * 20, 90));
      }, 500);

      const result = await aiBackgroundGenerator.replaceBackground(options);
      
      clearInterval(progressInterval);
      setProgress(100);

      toast({
        title: "Background Replaced",
        description: "Your image background has been successfully replaced!",
      });
    } catch (error) {
      console.error('Background replacement failed:', error);
      toast({
        title: "Replacement Failed",
        description: "Unable to replace background. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsReplacingBackground(false);
      setProgress(0);
    }
  }, [toast]);

  const handleImageUpload = useCallback((files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      toast({
        title: "Image Uploaded",
        description: "Image ready for background processing.",
      });
    }
  }, [toast]);

  const handlePresetSelect = useCallback((preset: BackgroundPreset) => {
    setPrompt(preset.prompt);
    setStyle(preset.style as BackgroundGenerationOptions['style']);
    toast({
      title: "Preset Applied",
      description: `"${preset.name}" preset has been applied.`,
    });
  }, [toast]);

  const downloadImage = useCallback((imageUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = filename;
    link.click();
  }, []);

  const formatTime = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000);
    const ms = milliseconds % 1000;
    return `${seconds}.${ms.toString().padStart(3, '0')}s`;
  };

  // Load presets on component mount
  useState(() => {
    aiBackgroundGenerator.getBackgroundPresets().then(setPresets);
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            AI Background Generator
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Create stunning backgrounds, remove existing backgrounds, or replace them with AI-generated alternatives
          </p>
        </div>
        <div className="flex items-center gap-3">
          <PremiumFeature>
            <PremiumBadge className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Pro Feature
            </PremiumBadge>
          </PremiumFeature>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
          >
            {viewMode === "grid" ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="generate" className="flex items-center gap-2">
            <Wand2 className="w-4 h-4" />
            Generate
          </TabsTrigger>
          <TabsTrigger value="remove" className="flex items-center gap-2">
            <Eraser className="w-4 h-4" />
            Remove
          </TabsTrigger>
          <TabsTrigger value="replace" className="flex items-center gap-2">
            <Replace className="w-4 h-4" />
            Replace
          </TabsTrigger>
        </TabsList>

        {/* Generate Background Tab */}
        <TabsContent value="generate" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Controls */}
            <div className="lg:col-span-1 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Generation Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Description</label>
                    <Textarea
                      placeholder="Describe the background you want to create..."
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Style</label>
                    <Select value={style} onValueChange={(value: BackgroundGenerationOptions['style']) => setStyle(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {styleOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              {option.icon}
                              {option.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Resolution</label>
                    <Select value={resolution} onValueChange={(value: BackgroundGenerationOptions['resolution']) => setResolution(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {resolutionOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Quality</label>
                    <Select value={quality} onValueChange={(value: BackgroundGenerationOptions['quality']) => setQuality(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {qualityOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Mood</label>
                    <Select value={mood} onValueChange={(value: BackgroundGenerationOptions['mood']) => setMood(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {moodOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Composition</label>
                    <Select value={composition} onValueChange={(value: BackgroundGenerationOptions['composition']) => setComposition(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {compositionOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    onClick={handleGenerateBackground}
                    disabled={isGenerating || !prompt.trim()}
                    className="w-full"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-4 h-4 mr-2" />
                        Generate Background
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Presets */}
              <Card>
                <CardHeader>
                  <CardTitle>Preset Backgrounds</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {presets.map((preset) => (
                      <Button
                        key={preset.id}
                        variant="ghost"
                        className="w-full justify-start text-left h-auto p-3"
                        onClick={() => handlePresetSelect(preset)}
                      >
                        <div className="space-y-1">
                          <div className="font-medium text-sm">{preset.name}</div>
                          <div className="text-xs text-slate-500">{preset.prompt}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results */}
            <div className="lg:col-span-2">
              {isGenerating && (
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Generating background...</span>
                        <span className="text-sm text-slate-500">{Math.round(progress)}%</span>
                      </div>
                      <Progress value={progress} className="w-full" />
                      <div className="text-center text-sm text-slate-500">
                        Creating your {style} background with {quality} quality
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {generatedBackgrounds.length > 0 && (
                <div className={`grid gap-4 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"}`}>
                  {generatedBackgrounds.map((background) => (
                    <Card key={background.id} className="overflow-hidden">
                      <div className="relative">
                        <img
                          src={background.imageUrl}
                          alt={background.prompt}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-2 right-2 flex gap-2">
                          <Badge variant="secondary">{background.style}</Badge>
                          <Badge variant="outline">{background.resolution}</Badge>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-medium text-sm mb-1">{background.prompt}</h4>
                            <div className="flex items-center gap-4 text-xs text-slate-500">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatTime(background.generationTime)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Star className="w-3 h-3" />
                                {background.quality}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => downloadImage(background.imageUrl, `background-${background.id}.png`)}
                            >
                              <Download className="w-4 h-4 mr-1" />
                              Download
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedImage(background.imageUrl);
                                setActiveTab("replace");
                              }}
                            >
                              <Replace className="w-4 h-4 mr-1" />
                              Use as Background
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {generatedBackgrounds.length === 0 && !isGenerating && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <ImageIcon className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No backgrounds generated yet</h3>
                    <p className="text-slate-500 mb-4">
                      Create your first AI-generated background by entering a description and clicking "Generate Background"
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Remove Background Tab */}
        <TabsContent value="remove" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload Image</CardTitle>
              </CardHeader>
              <CardContent>
                <DropZone
                  onFilesAdded={handleImageUpload}
                  acceptedTypes="image/*"
                  maxFiles={1}
                  className="min-h-[300px]"
                />
                {selectedImage && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Selected Image</h4>
                    <div className="relative">
                      <img
                        src={selectedImage}
                        alt="Selected for background removal"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <Button
                        size="sm"
                        variant="destructive"
                        className="absolute top-2 right-2"
                        onClick={() => setSelectedImage(null)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Background Removal</CardTitle>
              </CardHeader>
              <CardContent>
                {isRemovingBackground && (
                  <div className="space-y-4 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Removing background...</span>
                      <span className="text-sm text-slate-500">{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="w-full" />
                  </div>
                )}

                {backgroundRemovedImage && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Result</h4>
                      <div className="relative">
                        <img
                          src={backgroundRemovedImage.backgroundRemovedImageUrl}
                          alt="Background removed"
                          className="w-full h-48 object-cover rounded-lg border-2 border-dashed border-slate-300"
                        />
                        <div className="absolute top-2 left-2">
                          <Badge variant="secondary">
                            Transparency: {Math.round(backgroundRemovedImage.transparency * 100)}%
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => downloadImage(backgroundRemovedImage.backgroundRemovedImageUrl, 'background-removed.png')}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedImage(backgroundRemovedImage.backgroundRemovedImageUrl);
                          setActiveTab("replace");
                        }}
                      >
                        <Replace className="w-4 h-4 mr-1" />
                        Replace Background
                      </Button>
                    </div>
                  </div>
                )}

                <Button
                  onClick={() => selectedImage && handleRemoveBackground(selectedImage)}
                  disabled={!selectedImage || isRemovingBackground}
                  className="w-full"
                >
                  {isRemovingBackground ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Removing Background...
                    </>
                  ) : (
                    <>
                      <Eraser className="w-4 h-4 mr-2" />
                      Remove Background
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Replace Background Tab */}
        <TabsContent value="replace" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Foreground Image</CardTitle>
              </CardHeader>
              <CardContent>
                <DropZone
                  onFilesAdded={handleImageUpload}
                  acceptedTypes="image/*"
                  maxFiles={1}
                  className="min-h-[200px]"
                />
                {selectedImage && (
                  <div className="mt-4">
                    <div className="relative">
                      <img
                        src={selectedImage}
                        alt="Foreground image"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Background Options</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Background Type</label>
                    <Select defaultValue="generated">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="generated">AI Generated</SelectItem>
                        <SelectItem value="solid">Solid Color</SelectItem>
                        <SelectItem value="gradient">Gradient</SelectItem>
                        <SelectItem value="blur">Blurred Original</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {isReplacingBackground && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Replacing background...</span>
                        <span className="text-sm text-slate-500">{Math.round(progress)}%</span>
                      </div>
                      <Progress value={progress} className="w-full" />
                    </div>
                  )}

                  <Button
                    onClick={() => {
                      if (selectedImage) {
                        handleReplaceBackground({
                          foregroundImageUrl: selectedImage,
                          backgroundType: 'generated',
                          blendMode: 'normal',
                          opacity: 1,
                          edgeRefinement: 'medium'
                        });
                      }
                    }}
                    disabled={!selectedImage || isReplacingBackground}
                    className="w-full"
                  >
                    {isReplacingBackground ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Replacing Background...
                      </>
                    ) : (
                      <>
                        <Replace className="w-4 h-4 mr-2" />
                        Replace Background
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Paywall Modal */}
      {showPaywall && (
        <Paywall
          onClose={() => setShowPaywall(false)}
          onSubscribe={(plan) => {
            console.log(`Subscribed to ${plan} plan`);
            setShowPaywall(false);
          }}
          onStartTrial={() => {
            console.log('Started trial');
            setShowPaywall(false);
          }}
        />
      )}
    </div>
  );
}