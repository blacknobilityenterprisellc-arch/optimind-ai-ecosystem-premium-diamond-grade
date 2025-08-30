"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Video, 
  Music, 
  Image as ImageIcon, 
  Mic, 
  Play, 
  Pause,
  Volume2,
  Eye,
  TrendingUp,
  Upload,
  FileText,
  BarChart3,
  Zap,
  Loader2,
  CheckCircle,
  AlertTriangle,
  Headphones,
  Camera,
  Film,
  Podcast,
  Subtitles
} from "lucide-react";

interface MediaItem {
  id: string;
  type: 'video' | 'audio' | 'image' | 'podcast';
  title: string;
  url: string;
  duration?: string;
  size: string;
  format: string;
  optimizationScore: number;
  seoScore: number;
  accessibilityScore: number;
  lastOptimized: string;
  status: 'optimized' | 'needs_optimization' | 'not_optimized';
}

interface OptimizationRecommendation {
  id: string;
  mediaId: string;
  type: 'compression' | 'format_conversion' | 'metadata_enhancement' | 'alt_text_generation' | 'transcription' | 'chapter_markers';
  priority: 'high' | 'medium' | 'low';
  description: string;
  impact: number;
  effort: number;
  estimatedTime: string;
}

interface PerformanceMetrics {
  views: number;
  engagement: number;
  completion: number;
  shares: number;
  ctr: number;
  conversion: number;
}

export default function NonTextMultimodalOptimization() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [mediaUrl, setMediaUrl] = useState("");
  const [analysisResults, setAnalysisResults] = useState<any>(null);

  // Mock data for demonstration
  const mediaItems: MediaItem[] = [
    {
      id: "1",
      type: "video",
      title: "Voice Search Optimization Tutorial",
      url: "/media/voice-search-tutorial.mp4",
      duration: "15:42",
      size: "245 MB",
      format: "MP4",
      optimizationScore: 72,
      seoScore: 68,
      accessibilityScore: 45,
      lastOptimized: "2024-01-10",
      status: 'needs_optimization'
    },
    {
      id: "2",
      type: "podcast",
      title: "AI in Digital Marketing Episode 12",
      url: "/media/ai-marketing-ep12.mp3",
      duration: "32:15",
      size: "78 MB",
      format: "MP3",
      optimizationScore: 85,
      seoScore: 78,
      accessibilityScore: 90,
      lastOptimized: "2024-02-05",
      status: 'optimized'
    },
    {
      id: "3",
      type: "image",
      title: "SEO Strategy Infographic",
      url: "/media/seo-strategy-infographic.png",
      size: "2.4 MB",
      format: "PNG",
      optimizationScore: 58,
      seoScore: 42,
      accessibilityScore: 25,
      lastOptimized: "2023-12-20",
      status: 'not_optimized'
    }
  ];

  const optimizationRecommendations: OptimizationRecommendation[] = [
    {
      id: "1",
      mediaId: "1",
      type: "compression",
      priority: "high",
      description: "Compress video to reduce file size while maintaining quality",
      impact: 85,
      effort: 30,
      estimatedTime: "10 minutes"
    },
    {
      id: "2",
      mediaId: "1",
      type: "transcription",
      priority: "high",
      description: "Generate accurate transcription and closed captions",
      impact: 90,
      effort: 60,
      estimatedTime: "25 minutes"
    },
    {
      id: "3",
      mediaId: "3",
      type: "alt_text_generation",
      priority: "high",
      description: "Generate descriptive alt text for better accessibility and SEO",
      impact: 75,
      effort: 15,
      estimatedTime: "5 minutes"
    },
    {
      id: "4",
      mediaId: "2",
      type: "chapter_markers",
      priority: "medium",
      description: "Add chapter markers and timestamps for better navigation",
      impact: 65,
      effort: 25,
      estimatedTime: "15 minutes"
    }
  ];

  const performanceMetrics: PerformanceMetrics = {
    views: 15420,
    engagement: 73,
    completion: 68,
    shares: 342,
    ctr: 4.2,
    conversion: 8.5
  };

  const getMediaIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-5 h-5 text-blue-600" />;
      case 'audio': return <Music className="w-5 h-5 text-green-600" />;
      case 'image': return <ImageIcon className="w-5 h-5 text-purple-600" />;
      case 'podcast': return <Podcast className="w-5 h-5 text-orange-600" />;
      default: return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimized': return 'text-green-600';
      case 'needs_optimization': return 'text-yellow-600';
      case 'not_optimized': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'optimized': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'needs_optimization': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'not_optimized': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <div className="w-4 h-4 rounded-full bg-gray-400" />;
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleAnalyzeMedia = async () => {
    if (!selectedFile && !mediaUrl) return;
    
    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
      setAnalysisResults({
        optimization: 78,
        accessibility: 65,
        seo: 72,
        recommendations: optimizationRecommendations
      });
      setIsProcessing(false);
    }, 3000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Badge variant="secondary" className="px-4 py-2">
            <Zap className="w-4 h-4 mr-2" />
            Module 3
          </Badge>
        </div>
        <h2 className="text-4xl font-bold">Non-Text & Multimodal Optimization</h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Optimize videos, audio, images, and podcasts for maximum reach, accessibility, and SEO performance
        </p>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Input Section */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-blue-600" />
                Media Upload
              </CardTitle>
              <CardDescription>
                Upload media files or enter URLs for optimization analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Upload File</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept="video/*,audio/*,image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="media-upload"
                  />
                  <label htmlFor="media-upload" className="cursor-pointer">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600">
                      {selectedFile ? selectedFile.name : 'Click to upload or drag and drop'}
                    </p>
                    <p className="text-xs text-gray-500">
                      Video, Audio, Images up to 500MB
                    </p>
                  </label>
                </div>
              </div>
              
              <div className="text-center text-sm text-gray-500">OR</div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Media URL</label>
                <Input
                  placeholder="https://example.com/media-file.mp4"
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                />
              </div>
              
              <Button 
                onClick={handleAnalyzeMedia} 
                disabled={(!selectedFile && !mediaUrl) || isProcessing}
                className="w-full"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Analyze Media
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                Media Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Total Media Files</span>
                  <span className="text-sm font-medium">{mediaItems.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Optimized</span>
                  <span className="text-sm font-medium text-green-600">
                    {mediaItems.filter(m => m.status === 'optimized').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Needs Optimization</span>
                  <span className="text-sm font-medium text-yellow-600">
                    {mediaItems.filter(m => m.status === 'needs_optimization').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Not Optimized</span>
                  <span className="text-sm font-medium text-red-600">
                    {mediaItems.filter(m => m.status === 'not_optimized').length}
                  </span>
                </div>
              </div>
              <div className="pt-2">
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Average Optimization Score</span>
                  <span className="text-sm font-medium">72%</span>
                </div>
                <Progress value={72} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="video">Video</TabsTrigger>
              <TabsTrigger value="audio">Audio</TabsTrigger>
              <TabsTrigger value="images">Images</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="w-5 h-5 text-blue-600" />
                      Media Library
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {mediaItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          {getMediaIcon(item.type)}
                          <div>
                            <div className="font-medium text-sm">{item.title}</div>
                            <div className="text-xs text-muted-foreground">
                              {item.format} • {item.size} {item.duration && `• ${item.duration}`}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-sm font-medium ${getStatusColor(item.status)}`}>
                            {item.optimizationScore}%
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {getStatusIcon(item.status)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-yellow-600" />
                      Optimization Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {optimizationRecommendations.slice(0, 3).map((rec) => (
                      <div key={rec.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant={rec.priority === 'high' ? 'destructive' : 'secondary'}>
                            {rec.priority}
                          </Badge>
                          <div className="text-xs text-muted-foreground">
                            {rec.estimatedTime}
                          </div>
                        </div>
                        <div className="text-sm font-medium mb-1">{rec.description}</div>
                        <div className="flex items-center justify-between text-xs">
                          <span>Impact: {rec.impact}%</span>
                          <span>Effort: {rec.effort}%</span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Performance Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-green-600" />
                    Media Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{performanceMetrics.views.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Total Views</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{performanceMetrics.engagement}%</div>
                      <div className="text-sm text-muted-foreground">Engagement Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{performanceMetrics.completion}%</div>
                      <div className="text-sm text-muted-foreground">Completion Rate</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="video" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="w-5 h-5 text-blue-600" />
                    Video Optimization
                  </CardTitle>
                  <CardDescription>
                    Optimize video content for better performance, accessibility, and SEO
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold">Optimization Features</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm">Video compression without quality loss</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm">Auto-generated captions and transcripts</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm">Chapter markers and timestamps</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm">Thumbnail optimization</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm">SEO metadata generation</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold">Benefits</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm">Faster loading times</span>
                          <span className="text-sm font-medium text-green-600">+65%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Better accessibility</span>
                          <span className="text-sm font-medium text-green-600">+85%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">SEO improvement</span>
                          <span className="text-sm font-medium text-green-600">+45%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">User engagement</span>
                          <span className="text-sm font-medium text-green-600">+55%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-semibold mb-4">Current Video Files</h4>
                    <div className="space-y-3">
                      {mediaItems.filter(m => m.type === 'video').map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Video className="w-5 h-5 text-blue-500" />
                            <div>
                              <div className="font-medium">{item.title}</div>
                              <div className="text-sm text-muted-foreground">
                                {item.duration} • {item.size} • {item.format}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="text-sm font-medium">Optimization: {item.optimizationScore}%</div>
                              <div className="text-xs text-muted-foreground">SEO: {item.seoScore}%</div>
                            </div>
                            <Button variant="outline" size="sm">
                              Optimize
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="audio" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Headphones className="w-5 h-5 text-green-600" />
                    Audio & Podcast Optimization
                  </CardTitle>
                  <CardDescription>
                    Enhance audio content with transcription, chapters, and SEO optimization
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold">Audio Features</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm">Audio quality enhancement</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm">Automatic transcription</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm">Chapter markers and timestamps</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm">Podcast RSS optimization</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm">Show notes generation</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold">Benefits</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm">Better discoverability</span>
                          <span className="text-sm font-medium text-green-600">+75%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">User experience</span>
                          <span className="text-sm font-medium text-green-600">+60%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Accessibility</span>
                          <span className="text-sm font-medium text-green-600">+90%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">SEO performance</span>
                          <span className="text-sm font-medium text-green-600">+50%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-semibold mb-4">Audio Files</h4>
                    <div className="space-y-3">
                      {mediaItems.filter(m => m.type === 'audio' || m.type === 'podcast').map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            {getMediaIcon(item.type)}
                            <div>
                              <div className="font-medium">{item.title}</div>
                              <div className="text-sm text-muted-foreground">
                                {item.duration} • {item.size} • {item.format}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="text-sm font-medium">Optimization: {item.optimizationScore}%</div>
                              <div className="text-xs text-muted-foreground">Accessibility: {item.accessibilityScore}%</div>
                            </div>
                            <Button variant="outline" size="sm">
                              Optimize
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="images" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="w-5 h-5 text-purple-600" />
                    Image Optimization
                  </CardTitle>
                  <CardDescription>
                    Optimize images for faster loading, better SEO, and improved accessibility
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold">Image Features</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm">Auto-compression and resizing</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm">AI-powered alt text generation</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm">Format conversion (WebP, AVIF)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm">Lazy loading optimization</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm">EXIF metadata optimization</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold">Benefits</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm">Page load speed</span>
                          <span className="text-sm font-medium text-green-600">+70%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">SEO ranking</span>
                          <span className="text-sm font-medium text-green-600">+40%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Accessibility score</span>
                          <span className="text-sm font-medium text-green-600">+85%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">User experience</span>
                          <span className="text-sm font-medium text-green-600">+50%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-semibold mb-4">Image Files</h4>
                    <div className="space-y-3">
                      {mediaItems.filter(m => m.type === 'image').map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <ImageIcon className="w-5 h-5 text-purple-500" />
                            <div>
                              <div className="font-medium">{item.title}</div>
                              <div className="text-sm text-muted-foreground">
                                {item.size} • {item.format}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="text-sm font-medium">Optimization: {item.optimizationScore}%</div>
                              <div className="text-xs text-muted-foreground">SEO: {item.seoScore}%</div>
                            </div>
                            <Button variant="outline" size="sm">
                              Optimize
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-green-600" />
                    Media Performance Tracking
                  </CardTitle>
                  <CardDescription>
                    Monitor media performance across platforms and optimize for better results
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold">Engagement Metrics</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm">Total Views</span>
                          <span className="text-sm font-medium">{performanceMetrics.views.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Engagement Rate</span>
                          <span className="text-sm font-medium text-green-600">{performanceMetrics.engagement}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Completion Rate</span>
                          <span className="text-sm font-medium">{performanceMetrics.completion}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Social Shares</span>
                          <span className="text-sm font-medium">{performanceMetrics.shares}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold">Conversion Metrics</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm">Click-through Rate</span>
                          <span className="text-sm font-medium text-blue-600">{performanceMetrics.ctr}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Conversion Rate</span>
                          <span className="text-sm font-medium text-green-600">{performanceMetrics.conversion}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Avg. Watch Time</span>
                          <span className="text-sm font-medium">12:34</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Retention Rate</span>
                          <span className="text-sm font-medium">68%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-semibold mb-4">Performance Trends</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-lg font-bold text-blue-600">+28%</div>
                        <div className="text-sm text-muted-foreground">View Growth</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-lg font-bold text-green-600">+18%</div>
                        <div className="text-sm text-muted-foreground">Engagement</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-lg font-bold text-purple-600">+12%</div>
                        <div className="text-sm text-muted-foreground">Conversion</div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-semibold mb-4">Platform Performance</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <Video className="w-4 h-4 text-blue-500" />
                          <span className="text-sm font-medium">YouTube</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <span>8.5K views</span>
                          <span className="text-green-600">+15%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <Podcast className="w-4 h-4 text-orange-500" />
                          <span className="text-sm font-medium">Spotify</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <span>3.2K plays</span>
                          <span className="text-green-600">+22%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <ImageIcon className="w-4 h-4 text-purple-500" />
                          <span className="text-sm font-medium">Website</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <span>12.1K views</span>
                          <span className="text-green-600">+8%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}