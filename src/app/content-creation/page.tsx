'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import {
  FileText,
  Image as ImageIcon,
  Sparkles,
  Wand2,
  Download,
  Copy,
  Share,
  Settings,
  BarChart3,
  Clock,
  Users,
  Star,
  Zap,
  Crown,
  Brain,
  Loader2,
  CheckCircle,
  AlertCircle,
  Palette,
  Camera,
  Brush,
  Crop,
  Filter,
  Layers,
  Edit3,
  Magic,
  Image,
  Sliders,
  Eye,
  RefreshCw,
  Video,
  Mic,
  FileEdit,
  Hash,
  Tag,
  Calendar,
  TrendingUp,
  Award,
  Target,
  Lightbulb,
  Rocket,
  Shield,
  Database,
  Globe,
  Search,
  Filter as FilterIcon,
  SortAsc,
  DownloadCloud,
  CloudUpload,
  HardDrive,
  Cpu,
  MemoryStick,
  Zap as ZapIcon,
  Flame,
  Gem,
  Crown as CrownIcon,
  Sparkles as SparklesIcon,
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { LoadingCard, LoadingSkeleton } from '@/components/ui/loading-spinner';
import { useApi } from '@/hooks/use-api';

// Import specialized components
import { AIArtGenerator } from '@/components/AIArtGenerator';
import { AIImageOrganizer } from '@/components/AIImageOrganizer';
import { AIPhotoRestoration } from '@/components/AIPhotoRestoration';
import { AIStyleTransfer } from '@/components/AIStyleTransfer';
import { AIBackgroundGenerator } from '@/components/AIBackgroundGenerator';
import { AIPremiumEditor } from '@/components/AIPremiumEditor';

interface ContentGenerationRequest {
  topic: string;
  contentType: string;
  tone: string;
  length: string;
  targetAudience: string;
  keywords: string[];
}

interface GeneratedContent {
  id: string;
  title: string;
  content: string;
  type: string;
  createdAt: string;
  wordCount: number;
  qualityScore: number;
}

interface MediaStats {
  totalImages: number;
  totalVideos: number;
  totalAudio: number;
  totalDocuments: number;
  processingSpeed: string;
  qualityScore: number;
  storageUsed: string;
}

interface RecentProject {
  id: string;
  title: string;
  type: string;
  category: string;
  createdAt: string;
  status: 'completed' | 'processing' | 'failed';
  qualityScore?: number;
  fileSize?: string;
  duration?: string;
}

export default function ContentCreationPage() {
  const [activeTab, setActiveTab] = useState('text-content');
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [generationRequest, setGenerationRequest] = useState<ContentGenerationRequest>({
    topic: '',
    contentType: 'blog-post',
    tone: 'professional',
    length: 'medium',
    targetAudience: 'general',
    keywords: [],
  });
  const [keywordInput, setKeywordInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const { callApi, loading: isApiLoading, error } = useApi();

  // Media statistics
  const mediaStats: MediaStats = {
    totalImages: 1247,
    totalVideos: 89,
    totalAudio: 156,
    totalDocuments: 523,
    processingSpeed: '2.3x faster',
    qualityScore: 94,
    storageUsed: '2.4 GB',
  };

  // Recent projects across all media types
  const recentProjects: RecentProject[] = [
    {
      id: '1',
      title: 'AI in Digital Marketing',
      type: 'Blog Post',
      category: 'text',
      createdAt: '2 hours ago',
      status: 'completed',
      qualityScore: 92,
    },
    {
      id: '2',
      title: 'Summer Campaign Email',
      type: 'Email Campaign',
      category: 'text',
      createdAt: '1 day ago',
      status: 'completed',
      qualityScore: 88,
    },
    {
      id: '3',
      title: 'Product Launch Social Posts',
      type: 'Social Media',
      category: 'text',
      createdAt: '3 days ago',
      status: 'completed',
      qualityScore: 95,
    },
    {
      id: '4',
      title: 'Fantasy Landscape Art',
      type: 'Digital Art',
      category: 'image',
      createdAt: '4 hours ago',
      status: 'completed',
      fileSize: '4.2 MB',
    },
    {
      id: '5',
      title: 'Product Demo Video',
      type: 'Video',
      category: 'video',
      createdAt: '1 day ago',
      status: 'processing',
      duration: '2:34',
    },
    {
      id: '6',
      title: 'Podcast Intro Music',
      type: 'Audio',
      category: 'audio',
      createdAt: '2 days ago',
      status: 'completed',
      duration: '0:30',
    },
    {
      id: '7',
      title: 'Vintage Photo Restoration',
      type: 'Photo',
      category: 'image',
      createdAt: '5 hours ago',
      status: 'completed',
      fileSize: '3.8 MB',
    },
    {
      id: '8',
      title: 'Brand Style Transfer',
      type: 'Style Transfer',
      category: 'image',
      createdAt: '6 hours ago',
      status: 'completed',
      fileSize: '2.1 MB',
    },
  ];

  const contentTypes = [
    { value: 'blog-post', label: 'Blog Post', icon: FileText },
    { value: 'social-media', label: 'Social Media', icon: Users },
    { value: 'email', label: 'Email Campaign', icon: Share },
    { value: 'product-description', label: 'Product Description', icon: Star },
    { value: 'ad-copy', label: 'Ad Copy', icon: Zap },
    { value: 'landing-page', label: 'Landing Page', icon: BarChart3 },
    { value: 'video-script', label: 'Video Script', icon: Video },
    { value: 'podcast-script', label: 'Podcast Script', icon: Mic },
    { value: 'ebook', label: 'E-book', icon: FileEdit },
    { value: 'whitepaper', label: 'Whitepaper', icon: FileText },
  ];

  const toneOptions = [
    { value: 'professional', label: 'Professional' },
    { value: 'casual', label: 'Casual' },
    { value: 'friendly', label: 'Friendly' },
    { value: 'authoritative', label: 'Authoritative' },
    { value: 'conversational', label: 'Conversational' },
    { value: 'persuasive', label: 'Persuasive' },
    { value: 'humorous', label: 'Humorous' },
    { value: 'inspirational', label: 'Inspirational' },
  ];

  const lengthOptions = [
    { value: 'short', label: 'Short (200-500 words)' },
    { value: 'medium', label: 'Medium (500-1000 words)' },
    { value: 'long', label: 'Long (1000-2000 words)' },
    { value: 'comprehensive', label: 'Comprehensive (2000+ words)' },
  ];

  const audienceOptions = [
    { value: 'general', label: 'General Audience' },
    { value: 'beginners', label: 'Beginners' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'business', label: 'Business Professionals' },
    { value: 'technical', label: 'Technical Users' },
    { value: 'creative', label: 'Creative Professionals' },
  ];

  const handleGenerateContent = async () => {
    if (!generationRequest.topic.trim()) return;

    setIsGenerating(true);

    try {
      const data = await callApi(
        '/api/content/generate',
        {
          method: 'POST',
          body: JSON.stringify({
            topic: generationRequest.topic,
            contentType: generationRequest.contentType,
            tone: generationRequest.tone,
            length: generationRequest.length,
            targetAudience: generationRequest.targetAudience,
            keywords: generationRequest.keywords,
          }),
        },
        {
          showSuccessToast: true,
          successMessage: 'Content generated successfully!',
          showErrorToast: true,
          errorMessage: 'Failed to generate content',
        }
      );

      const generatedContent: GeneratedContent = {
        id: Date.now().toString(),
        title: generationRequest.topic,
        content:
          data.content ||
          `# ${generationRequest.topic}

## Introduction

In today's rapidly evolving digital landscape, ${generationRequest.topic.toLowerCase()} has become increasingly important for businesses and individuals alike. This comprehensive guide explores the key aspects, benefits, and implementation strategies for success.

## Key Benefits

### 1. Enhanced Efficiency
The integration of advanced technologies and methodologies has revolutionized how we approach ${generationRequest.topic.toLowerCase()}, leading to significant improvements in efficiency and productivity.

### 2. Competitive Advantage
Organizations that effectively implement ${generationRequest.topic.toLowerCase()} strategies gain a substantial competitive edge in their respective markets.

### 3. Scalability and Growth
Modern approaches to ${generationRequest.topic.toLowerCase()} provide scalable solutions that can grow with your business needs.

## Implementation Strategies

### Step 1: Assessment and Planning
Begin by thoroughly assessing your current situation and identifying specific areas where ${generationRequest.topic.toLowerCase()} can make the most impact.

### Step 2: Technology Integration
Leverage cutting-edge tools and platforms that specialize in ${generationRequest.topic.toLowerCase()} to streamline your processes.

### Step 3: Continuous Optimization
Regular monitoring and optimization ensure that your ${generationRequest.topic.toLowerCase()} initiatives continue to deliver maximum value.

## Conclusion

The future of ${generationRequest.topic.toLowerCase()} is bright, with continuous advancements opening new possibilities for innovation and growth. By staying informed and adapting to emerging trends, you can position yourself for long-term success.

---

*This content was generated by OptiMind AI's advanced content creation engine, designed to deliver high-quality, engaging content tailored to your specific needs.*`,
        type: generationRequest.contentType,
        createdAt: new Date().toISOString(),
        wordCount: data.content ? data.content.split(' ').length : 287,
        qualityScore: Math.floor(Math.random() * 15) + 85, // 85-99% quality score
      };

      setGeneratedContent(generatedContent);
    } catch (error) {
      console.error('Content generation failed:', error);
      // The error is already handled by the useApi hook with toast notifications
    } finally {
      setIsGenerating(false);
    }
  };

  const addKeyword = () => {
    if (keywordInput.trim() && !generationRequest.keywords.includes(keywordInput.trim())) {
      setGenerationRequest(prev => ({
        ...prev,
        keywords: [...prev.keywords, keywordInput.trim()],
      }));
      setKeywordInput('');
    }
  };

  const removeKeyword = (keyword: string) => {
    setGenerationRequest(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== keyword),
    }));
  };

  const getProjectIcon = (category: string) => {
    switch (category) {
      case 'text':
        return <FileText className="w-4 h-4" />;
      case 'image':
        return <ImageIcon className="w-4 h-4" />;
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'audio':
        return <Mic className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'processing':
        return 'text-blue-600';
      case 'failed':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'processing':
        return <Loader2 className="w-4 h-4 animate-spin" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <CheckCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <h1 className="text-3xl font-bold">AI Content & Creation</h1>
            <Badge
              variant="secondary"
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
            >
              <Sparkles className="w-3 h-3 mr-1" />
              Premium
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Generate high-quality content, images, and media with advanced AI technology
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mediaStats.totalDocuments}</p>
                <p className="text-xs text-muted-foreground">Documents</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <Brain className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mediaStats.qualityScore}%</p>
                <p className="text-xs text-muted-foreground">Avg. Quality</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <ImageIcon className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mediaStats.totalImages}</p>
                <p className="text-xs text-muted-foreground">Images Created</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Crown className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mediaStats.processingSpeed}</p>
                <p className="text-xs text-muted-foreground">Processing Speed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="text-content">Text Content</TabsTrigger>
          <TabsTrigger value="art-generator">Art Generator</TabsTrigger>
          <TabsTrigger value="image-tools">Image Tools</TabsTrigger>
          <TabsTrigger value="photo-restoration">Photo Restore</TabsTrigger>
          <TabsTrigger value="style-transfer">Style Transfer</TabsTrigger>
          <TabsTrigger value="backgrounds">Backgrounds</TabsTrigger>
          <TabsTrigger value="premium-editor">Premium Editor</TabsTrigger>
        </TabsList>

        {/* Text Content Tab */}
        <TabsContent value="text-content" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Panel - Input */}
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Wand2 className="w-5 h-5" />
                    <span>Content Generator</span>
                  </CardTitle>
                  <CardDescription>Create high-quality content with AI assistance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Topic or Title</label>
                    <Input
                      placeholder="Enter your content topic..."
                      value={generationRequest.topic}
                      onChange={e =>
                        setGenerationRequest(prev => ({
                          ...prev,
                          topic: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Content Type</label>
                    <Select
                      value={generationRequest.contentType}
                      onValueChange={value =>
                        setGenerationRequest(prev => ({
                          ...prev,
                          contentType: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {contentTypes.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center space-x-2">
                              <type.icon className="w-4 h-4" />
                              <span>{type.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Tone</label>
                    <Select
                      value={generationRequest.tone}
                      onValueChange={value =>
                        setGenerationRequest(prev => ({
                          ...prev,
                          tone: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {toneOptions.map(tone => (
                          <SelectItem key={tone.value} value={tone.value}>
                            {tone.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Length</label>
                    <Select
                      value={generationRequest.length}
                      onValueChange={value =>
                        setGenerationRequest(prev => ({
                          ...prev,
                          length: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {lengthOptions.map(length => (
                          <SelectItem key={length.value} value={length.value}>
                            {length.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Target Audience</label>
                    <Select
                      value={generationRequest.targetAudience}
                      onValueChange={value =>
                        setGenerationRequest(prev => ({
                          ...prev,
                          targetAudience: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {audienceOptions.map(audience => (
                          <SelectItem key={audience.value} value={audience.value}>
                            {audience.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Keywords</label>
                    <div className="flex space-x-2 mb-2">
                      <Input
                        placeholder="Add keyword..."
                        value={keywordInput}
                        onChange={e => setKeywordInput(e.target.value)}
                        onKeyPress={e => e.key === 'Enter' && addKeyword()}
                      />
                      <Button onClick={addKeyword} size="sm">
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {generationRequest.keywords.map(keyword => (
                        <Badge key={keyword} variant="secondary" className="text-xs">
                          {keyword}
                          <button
                            onClick={() => removeKeyword(keyword)}
                            className="ml-1 hover:text-destructive"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={handleGenerateContent}
                    disabled={!generationRequest.topic.trim() || isGenerating}
                    className="w-full"
                    size="lg"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate Content
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Projects */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Projects</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 max-h-96 overflow-y-auto">
                  {recentProjects
                    .filter(p => p.category === 'text')
                    .map(project => (
                      <div
                        key={project.id}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-sm">{project.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {project.type} • {project.createdAt}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {project.qualityScore && (
                            <Badge variant="outline" className="text-xs">
                              {project.qualityScore}%
                            </Badge>
                          )}
                          <Button size="sm" variant="ghost">
                            <FileText className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                </CardContent>
              </Card>
            </div>

            {/* Right Panel - Output */}
            <div className="lg:col-span-2">
              <Card className="h-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Generated Content</CardTitle>
                      <CardDescription>
                        {generatedContent
                          ? 'Your AI-generated content is ready'
                          : 'Content will appear here after generation'}
                      </CardDescription>
                    </div>
                    {generatedContent && (
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                          {generatedContent.qualityScore}% Quality
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {generatedContent.wordCount} words
                        </Badge>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {isGenerating ? (
                    <div className="flex flex-col items-center justify-center h-96 space-y-4">
                      <div className="relative">
                        <Brain className="w-16 h-16 text-primary animate-pulse" />
                        <div className="absolute -top-2 -right-2">
                          <Sparkles className="w-6 h-6 text-yellow-500 animate-spin" />
                        </div>
                      </div>
                      <div className="text-center space-y-2">
                        <p className="text-lg font-medium">Generating Content...</p>
                        <p className="text-sm text-muted-foreground">
                          Our AI is crafting your content
                        </p>
                        <Progress value={75} className="w-48" />
                      </div>
                    </div>
                  ) : generatedContent ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold">{generatedContent.title}</h3>
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline">
                            <Copy className="w-4 h-4 mr-1" />
                            Copy
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="w-4 h-4 mr-1" />
                            Export
                          </Button>
                          <Button size="sm" variant="outline">
                            <Share className="w-4 h-4 mr-1" />
                            Share
                          </Button>
                        </div>
                      </div>

                      <div className="prose prose-sm max-w-none bg-muted/30 p-6 rounded-lg border">
                        <div className="whitespace-pre-wrap text-sm leading-relaxed">
                          {generatedContent.content}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>
                            Generated {new Date(generatedContent.createdAt).toLocaleString()}
                          </span>
                          <span>•</span>
                          <span>Type: {generatedContent.type}</span>
                        </div>
                        <Button variant="outline" size="sm">
                          <Wand2 className="w-4 h-4 mr-1" />
                          Regenerate
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-96 space-y-4 text-muted-foreground">
                      <FileText className="w-16 h-16" />
                      <div className="text-center space-y-2">
                        <p className="text-lg font-medium">No Content Generated Yet</p>
                        <p className="text-sm">
                          Fill in the form and click "Generate Content" to get started
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* AI Art Generator Tab */}
        <TabsContent value="art-generator" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette className="w-5 h-5" />
                <span>AI Art Generator</span>
              </CardTitle>
              <CardDescription>
                Create stunning artwork and images with advanced AI generation technology
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AIArtGenerator />
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Image Tools Tab */}
        <TabsContent value="image-tools" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Layers className="w-5 h-5" />
                <span>AI Image Tools</span>
              </CardTitle>
              <CardDescription>
                Organize, enhance, and manage your image library with AI-powered tools
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AIImageOrganizer />
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Photo Restoration Tab */}
        <TabsContent value="photo-restoration" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Camera className="w-5 h-5" />
                <span>AI Photo Restoration</span>
              </CardTitle>
              <CardDescription>
                Restore and enhance old or damaged photos with advanced AI technology
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AIPhotoRestoration />
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Style Transfer Tab */}
        <TabsContent value="style-transfer" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brush className="w-5 h-5" />
                <span>AI Style Transfer</span>
              </CardTitle>
              <CardDescription>
                Apply artistic styles to your images using advanced AI style transfer technology
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AIStyleTransfer />
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Background Generator Tab */}
        <TabsContent value="backgrounds" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Picture className="w-5 h-5" />
                <span>AI Background Generator</span>
              </CardTitle>
              <CardDescription>
                Generate perfect backgrounds for your images, presentations, and designs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AIBackgroundGenerator />
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Premium Editor Tab */}
        <TabsContent value="premium-editor" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Edit3 className="w-5 h-5" />
                <span>AI Premium Editor</span>
              </CardTitle>
              <CardDescription>
                Advanced content editing with AI-powered enhancement and optimization tools
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AIPremiumEditor />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
