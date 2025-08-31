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
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { 
  useSecureSubscription,
  useAIArtGenerator 
} from "@/lib/ai-art-generator";
import { 
  Palette, 
  Sparkles, 
  Wand2, 
  Image as ImageIcon,
  Download,
  Share2,
  Heart,
  Copy,
  RefreshCw,
  Settings,
  Grid,
  List,
  Filter,
  Zap,
  Crown,
  CreditCard,
  Clock,
  CheckCircle,
  AlertTriangle,
  Layers,
  Brush,
  Camera,
  Sun,
  Moon,
  Mountain,
  Waves,
  Building,
  TreePine,
  Users,
  Car,
  Plane,
  Rocket,
  Star,
  Gem
} from "lucide-react";

interface ArtGenerationConfig {
  prompt: string;
  negativePrompt?: string;
  style: string;
  model: string;
  width: number;
  height: number;
  steps: number;
  guidance: number;
  seed?: number;
  enhanceDetails: boolean;
  fixFaces: boolean;
  upscale: boolean;
}

interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  config: ArtGenerationConfig;
  timestamp: Date;
  isFavorite: boolean;
  creditsUsed: number;
  processingTime: number;
}

interface ArtStyle {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  preview: string;
  credits: number;
}

export function AIArtGenerator() {
  const [config, setConfig] = useState<ArtGenerationConfig>({
    prompt: "",
    negativePrompt: "",
    style: "realistic",
    model: "flux-pro",
    width: 1024,
    height: 1024,
    steps: 30,
    guidance: 7.5,
    enhanceDetails: true,
    fixFaces: false,
    upscale: false
  });

  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [currentGeneration, setCurrentGeneration] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedStyle, setSelectedStyle] = useState<string>("realistic");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [batchMode, setBatchMode] = useState(false);
  const [batchCount, setBatchCount] = useState(4);

  const { isPremium } = useSecureSubscription();
  const {
    generateArt,
    isGenerating: isServiceGenerating,
    error,
    credits,
    styles,
    models
  } = useAIArtGenerator();

  const artStyles: ArtStyle[] = [
    {
      id: "realistic",
      name: "Photorealistic",
      description: "Ultra-realistic photographic quality",
      icon: <Camera className="w-5 h-5" />,
      preview: "📸",
      credits: 100
    },
    {
      id: "artistic",
      name: "Artistic",
      description: "Painterly and artistic styles",
      icon: <Palette className="w-5 h-5" />,
      preview: "🎨",
      credits: 120
    },
    {
      id: "anime",
      name: "Anime",
      description: "Japanese anime and manga style",
      icon: <Star className="w-5 h-5" />,
      preview: "🌸",
      credits: 90
    },
    {
      id: "fantasy",
      name: "Fantasy",
      description: "Magical and fantastical scenes",
      icon: <Gem className="w-5 h-5" />,
      preview: "🏰",
      credits: 110
    },
    {
      id: "sci-fi",
      name: "Sci-Fi",
      description: "Futuristic and science fiction",
      icon: <Rocket className="w-5 h-5" />,
      preview: "🚀",
      credits: 115
    },
    {
      id: "abstract",
      name: "Abstract",
      description: "Abstract and conceptual art",
      icon: <Brush className="w-5 h-5" />,
      preview: "🎭",
      credits: 95
    },
    {
      id: "landscape",
      name: "Landscape",
      description: "Natural landscapes and scenery",
      icon: <Mountain className="w-5 h-5" />,
      preview: "🏔️",
      credits: 85
    },
    {
      id: "portrait",
      name: "Portrait",
      description: "Character and portrait focus",
      icon: <Users className="w-5 h-5" />,
      preview: "👤",
      credits: 105
    }
  ];

  const presetPrompts = [
    "A serene mountain landscape at sunset with golden light",
    "Futuristic cyberpunk city with neon lights and flying cars",
    "Magical forest with glowing mushrooms and ancient trees",
    "Underwater scene with colorful coral reefs and tropical fish",
    "Steampunk airship floating above Victorian-era city",
    "Cosmic nebula with distant galaxies and stars",
    "Medieval castle on a hill surrounded by mist",
    "Modern minimalist living room with large windows"
  ];

  const handleGenerate = useCallback(async () => {
    if (!config.prompt.trim() || !isPremium) return;

    try {
      setIsGenerating(true);
      setGenerationProgress(0);
      setCurrentGeneration(Date.now().toString());

      const imagesToGenerate = batchMode ? batchCount : 1;
      const newImages: GeneratedImage[] = [];

      for (let i = 0; i < imagesToGenerate; i++) {
        const progress = ((i + 1) / imagesToGenerate) * 100;
        setGenerationProgress(progress);

        const result = await generateArt(config);
        
        if (result.success) {
          const generatedImage: GeneratedImage = {
            id: `${Date.now()}-${i}`,
            url: result.imageUrl!,
            prompt: config.prompt,
            config: { ...config },
            timestamp: new Date(),
            isFavorite: false,
            creditsUsed: result.creditsUsed,
            processingTime: result.processingTime
          };
          newImages.push(generatedImage);
        }

        // Small delay for visual feedback
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      setGeneratedImages(prev => [...newImages, ...prev]);
      setGenerationProgress(100);
      
      setTimeout(() => {
        setCurrentGeneration(null);
        setIsGenerating(false);
      }, 1000);

    } catch (error) {
      console.error('Generation failed:', error);
      setIsGenerating(false);
      setCurrentGeneration(null);
    }
  }, [config, isPremium, generateArt, batchMode, batchCount]);

  const handleDownload = useCallback(async (image: GeneratedImage) => {
    try {
      const response = await fetch(image.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ai-art-${image.id}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
    }
  }, []);

  const handleCopyPrompt = useCallback((prompt: string) => {
    navigator.clipboard.writeText(prompt);
  }, []);

  const handleToggleFavorite = useCallback((imageId: string) => {
    setGeneratedImages(prev => 
      prev.map(img => 
        img.id === imageId 
          ? { ...img, isFavorite: !img.isFavorite }
          : img
      )
    );
  }, []);

  const handleStyleSelect = useCallback((styleId: string) => {
    setSelectedStyle(styleId);
    setConfig(prev => ({ ...prev, style: styleId }));
  }, []);

  const estimateCredits = useCallback(() => {
    const baseCredits = artStyles.find(s => s.id === selectedStyle)?.credits || 100;
    const multiplier = batchMode ? batchCount : 1;
    let total = baseCredits * multiplier;

    if (config.upscale) total *= 1.5;
    if (config.enhanceDetails) total *= 1.2;
    if (config.fixFaces) total *= 1.1;

    return Math.round(total);
  }, [selectedStyle, batchMode, batchCount, config.upscale, config.enhanceDetails, config.fixFaces]);

  if (!isPremium) {
    return (
      <Card className="w-full">
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Palette className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold">AI Art Generator</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Create stunning artwork from text descriptions using advanced AI models. 
              Access multiple artistic styles and generate high-quality images.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-md mx-auto">
              {artStyles.slice(0, 4).map(style => (
                <div key={style.id} className="text-center">
                  <div className="text-2xl mb-1">{style.preview}</div>
                  <div className="text-xs font-medium">{style.name}</div>
                </div>
              ))}
            </div>
            <Button size="lg" className="premium-button">
              <Crown className="w-4 h-4 mr-2" />
              Unlock AI Art Generator
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
            <Palette className="w-6 h-6 text-purple-600" />
            AI Art Generator
          </h2>
          <p className="text-muted-foreground">Create stunning artwork from text descriptions</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-purple-600">
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

      <Tabs defaultValue="create" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="create">Create Art</TabsTrigger>
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
          <TabsTrigger value="styles">Styles</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-6">
          {/* Style Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Choose Art Style</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {artStyles.map(style => (
                  <div
                    key={style.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedStyle === style.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleStyleSelect(style.id)}
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-2">{style.preview}</div>
                      <div className="font-medium text-sm">{style.name}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {style.credits} credits
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Generation Controls */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Prompt Input */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Describe Your Artwork</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="prompt">Prompt</Label>
                  <Textarea
                    id="prompt"
                    placeholder="Describe what you want to create..."
                    value={config.prompt}
                    onChange={(e) => setConfig(prev => ({ ...prev, prompt: e.target.value }))}
                    rows={4}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="negative-prompt">Negative Prompt (Optional)</Label>
                  <Textarea
                    id="negative-prompt"
                    placeholder="What to avoid in the image..."
                    value={config.negativePrompt}
                    onChange={(e) => setConfig(prev => ({ ...prev, negativePrompt: e.target.value }))}
                    rows={2}
                    className="mt-2"
                  />
                </div>

                {/* Quick Prompts */}
                <div>
                  <Label className="text-sm font-medium">Quick Prompts</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {presetPrompts.slice(0, 4).map((prompt, idx) => (
                      <Button
                        key={idx}
                        variant="outline"
                        size="sm"
                        onClick={() => setConfig(prev => ({ ...prev, prompt }))}
                        className="text-xs"
                      >
                        {prompt.slice(0, 30)}...
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Advanced Settings */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Advanced Settings</CardTitle>
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Model</Label>
                    <Select value={config.model} onValueChange={(value) => setConfig(prev => ({ ...prev, model: value }))}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="flux-pro">FLUX Pro</SelectItem>
                        <SelectItem value="flux-schnell">FLUX Schnell</SelectItem>
                        <SelectItem value="sd-xl">Stable Diffusion XL</SelectItem>
                        <SelectItem value="midjourney">MidJourney</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Size</Label>
                    <Select value={`${config.width}x${config.height}`} onValueChange={(value) => {
                      const [width, height] = value.split('x').map(Number);
                      setConfig(prev => ({ ...prev, width, height }));
                    }}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="512x512">512×512</SelectItem>
                        <SelectItem value="1024x1024">1024×1024</SelectItem>
                        <SelectItem value="1024x768">1024×768</SelectItem>
                        <SelectItem value="768x1024">768×1024</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Advanced Options */}
                {showAdvanced && (
                  <div className="space-y-4 pt-4 border-t">
                    <div>
                      <Label>Steps: {config.steps}</Label>
                      <Slider
                        value={[config.steps]}
                        onValueChange={(value) => setConfig(prev => ({ ...prev, steps: value[0] }))}
                        max={50}
                        min={10}
                        step={1}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label>Guidance: {config.guidance}</Label>
                      <Slider
                        value={[config.guidance]}
                        onValueChange={(value) => setConfig(prev => ({ ...prev, guidance: value[0] }))}
                        max={20}
                        min={1}
                        step={0.5}
                        className="mt-2"
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="enhance-details"
                          checked={config.enhanceDetails}
                          onCheckedChange={(checked) => setConfig(prev => ({ ...prev, enhanceDetails: checked }))}
                        />
                        <Label htmlFor="enhance-details">Enhance Details (+20% credits)</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="fix-faces"
                          checked={config.fixFaces}
                          onCheckedChange={(checked) => setConfig(prev => ({ ...prev, fixFaces: checked }))}
                        />
                        <Label htmlFor="fix-faces">Fix Faces (+10% credits)</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="upscale"
                          checked={config.upscale}
                          onCheckedChange={(checked) => setConfig(prev => ({ ...prev, upscale: checked }))}
                        />
                        <Label htmlFor="upscale">4K Upscale (+50% credits)</Label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Batch Mode */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="batch-mode"
                      checked={batchMode}
                      onCheckedChange={setBatchMode}
                    />
                    <Label htmlFor="batch-mode">Batch Mode</Label>
                  </div>
                  {batchMode && (
                    <Select value={batchCount.toString()} onValueChange={(value) => setBatchCount(parseInt(value))}>
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="4">4</SelectItem>
                        <SelectItem value="8">8</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>

                {/* Generate Button */}
                <div className="pt-4 border-t space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Estimated Cost</span>
                    <span className="text-lg font-bold text-purple-600">{estimateCredits()} credits</span>
                  </div>
                  
                  <Button 
                    onClick={handleGenerate}
                    disabled={!config.prompt.trim() || isGenerating || credits < estimateCredits()}
                    className="w-full"
                    size="lg"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-4 h-4 mr-2" />
                        Generate Artwork
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Generation Progress */}
          {isGenerating && currentGeneration && (
            <Card>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Generating Artwork</span>
                    <span className="text-sm text-muted-foreground">{Math.round(generationProgress)}%</span>
                  </div>
                  <Progress value={generationProgress} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {generationProgress < 25 ? "Initializing AI model..." :
                     generationProgress < 50 ? "Processing your prompt..." :
                     generationProgress < 75 ? "Generating artwork..." :
                     generationProgress < 100 ? "Finalizing details..." :
                     "Complete!"}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="gallery" className="space-y-6">
          {/* Gallery Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Generated Artwork</h3>
            <div className="text-sm text-muted-foreground">
              {generatedImages.length} images created
            </div>
          </div>

          {/* Gallery Grid */}
          {generatedImages.length > 0 ? (
            <div className={`grid gap-4 ${
              viewMode === "grid" 
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "grid-cols-1"
            }`}>
              {generatedImages.map(image => (
                <Card key={image.id} className="overflow-hidden">
                  <div className="relative aspect-square">
                    <img
                      src={image.url}
                      alt={image.prompt}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 flex gap-1">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="w-8 h-8 p-0"
                        onClick={() => handleToggleFavorite(image.id)}
                      >
                        <Heart className={`w-4 h-4 ${image.isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-3">
                    <div className="space-y-2">
                      <p className="text-sm font-medium line-clamp-2">{image.prompt}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{image.timestamp.toLocaleDateString()}</span>
                        <span>{image.creditsUsed} credits</span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => handleDownload(image)}
                        >
                          <Download className="w-3 h-3 mr-1" />
                          Download
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCopyPrompt(image.prompt)}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Artwork Generated Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first AI-generated artwork using the Create Art tab
                </p>
                <Button onClick={() => setConfig(prev => ({ ...prev, prompt: presetPrompts[0] }))}>
                  Try a Sample Prompt
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="styles" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {artStyles.map(style => (
              <Card key={style.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{style.preview}</div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-1">{style.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{style.description}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">{style.credits} credits</Badge>
                        <Button
                          size="sm"
                          variant={selectedStyle === style.id ? "default" : "outline"}
                          onClick={() => handleStyleSelect(style.id)}
                        >
                          {selectedStyle === style.id ? "Selected" : "Select"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}