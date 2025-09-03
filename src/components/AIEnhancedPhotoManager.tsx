"use client";

import { useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OptimizedImage } from "./OptimizedImage";
import { AIEnhancedAnalyzer } from "./AIEnhancedAnalyzer";
import { useAIEnhancement, AIAnalysisResult } from "@/lib/ai-enhancement";
import { useSecureSubscription } from "@/lib/secure-subscription-manager";
import { 
  Search, 
  SortAsc, 
  SortDesc, 
  Download, 
  Trash2, 
  Archive, 
  Grid, 
  List,
  MoreVertical,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Image as ImageIcon,
  Brain,
  Sparkles,
  Eye,
  Tag,
  BarChart3,
  Lock,
  Filter,
  Calendar,
  HardDrive
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EnhancedPhotoItem {
  id: string;
  name: string;
  url: string;
  status: "safe" | "flagged" | "pending" | "scanning";
  scanDate?: Date;
  fileSize: number;
  confidence?: number;
  categories?: string[];
  selected?: boolean;
  file?: File;
  aiAnalysis?: AIAnalysisResult;
  aiDescription?: string;
  privacyConcerns?: string[];
  privacySuggestions?: string[];
  lastAnalyzed?: Date;
}

interface AIEnhancedPhotoManagerProps {
  photos: EnhancedPhotoItem[];
  onPhotosUpdate: (photos: EnhancedPhotoItem[]) => void;
  isPremium: boolean;
}

type SortOption = "name" | "date" | "size" | "status" | "confidence" | "quality" | "aesthetic" | "safety";
type SortDirection = "asc" | "desc";
type ViewMode = "grid" | "list" | "analytics";
type FilterOption = "all" | "safe" | "flagged" | "pending" | "scanning" | "has-faces" | "has-text" | "high-quality" | "privacy-concerns";

export function AIEnhancedPhotoManager({ photos, onPhotosUpdate, isPremium }: AIEnhancedPhotoManagerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [statusFilter, setStatusFilter] = useState<FilterOption>("all");
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [selectedPhotoForAnalysis, setSelectedPhotoForAnalysis] = useState<string | null>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const { toast } = useToast();
  const { analyzePhoto, getAnalysisResult } = useAIEnhancement();

  // Advanced filtering and sorting
  const filteredAndSortedPhotos = useMemo(() => {
    let filtered = photos.filter(photo => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          photo.name.toLowerCase().includes(query) ||
          photo.categories?.some(cat => cat.toLowerCase().includes(query)) ||
          photo.aiAnalysis?.objects.some(obj => obj.toLowerCase().includes(query)) ||
          photo.aiAnalysis?.emotions.some(emotion => emotion.toLowerCase().includes(query)) ||
          photo.aiAnalysis?.enhancedTags.some(tag => tag.toLowerCase().includes(query))
        );
      }
      
      // Advanced status filter
      switch (statusFilter) {
        case "has-faces":
          return (photo.aiAnalysis?.faces || 0) > 0;
        case "has-text":
          return (photo.aiAnalysis?.text.length || 0) > 0;
        case "high-quality":
          return (photo.aiAnalysis?.quality || 0) > 0.8;
        case "privacy-concerns":
          return (photo.privacyConcerns?.length || 0) > 0;
        default:
          if (statusFilter !== "all" && photo.status !== statusFilter) {
            return false;
          }
      }
      
      return true;
    });

    // Advanced sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "date":
          aValue = a.scanDate ? new Date(a.scanDate).getTime() : 0;
          bValue = b.scanDate ? new Date(b.scanDate).getTime() : 0;
          break;
        case "size":
          aValue = a.fileSize;
          bValue = b.fileSize;
          break;
        case "status":
          aValue = a.status;
          bValue = b.status;
          break;
        case "confidence":
          aValue = a.confidence || 0;
          bValue = b.confidence || 0;
          break;
        case "quality":
          aValue = a.aiAnalysis?.quality || 0;
          bValue = b.aiAnalysis?.quality || 0;
          break;
        case "aesthetic":
          aValue = a.aiAnalysis?.aestheticScore || 0;
          bValue = b.aiAnalysis?.aestheticScore || 0;
          break;
        case "safety":
          aValue = a.aiAnalysis?.safetyScore || 0;
          bValue = b.aiAnalysis?.safetyScore || 0;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [photos, searchQuery, sortBy, sortDirection, statusFilter]);

  const selectedPhotos = photos.filter(photo => photo.selected);
  const hasSelectedPhotos = selectedPhotos.length > 0;

  // Analytics data
  const analyticsData = useMemo(() => {
    const totalPhotos = photos.length;
    const analyzedPhotos = photos.filter(p => p.aiAnalysis).length;
    const safePhotos = photos.filter(p => p.status === "safe").length;
    const flaggedPhotos = photos.filter(p => p.status === "flagged").length;
    const photosWithFaces = photos.filter(p => (p.aiAnalysis?.faces || 0) > 0).length;
    const photosWithText = photos.filter(p => (p.aiAnalysis?.text.length || 0) > 0).length;
    const highQualityPhotos = photos.filter(p => (p.aiAnalysis?.quality || 0) > 0.8).length;
    const privacyConcernPhotos = photos.filter(p => (p.privacyConcerns?.length || 0) > 0).length;
    
    const avgQuality = analyzedPhotos > 0 
      ? photos.filter(p => p.aiAnalysis).reduce((sum, p) => sum + (p.aiAnalysis?.quality || 0), 0) / analyzedPhotos 
      : 0;
    
    const avgSafety = analyzedPhotos > 0 
      ? photos.filter(p => p.aiAnalysis).reduce((sum, p) => sum + (p.aiAnalysis?.safetyScore || 0), 0) / analyzedPhotos 
      : 0;

    return {
      totalPhotos,
      analyzedPhotos,
      safePhotos,
      flaggedPhotos,
      photosWithFaces,
      photosWithText,
      highQualityPhotos,
      privacyConcernPhotos,
      avgQuality,
      avgSafety,
      analysisRate: totalPhotos > 0 ? (analyzedPhotos / totalPhotos) * 100 : 0
    };
  }, [photos]);

  const handleSelectPhoto = useCallback((photoId: string, selected: boolean) => {
    const updatedPhotos = photos.map(photo =>
      photo.id === photoId ? { ...photo, selected } : photo
    );
    onPhotosUpdate(updatedPhotos);
    setShowBulkActions(updatedPhotos.some(p => p.selected));
  }, [photos, onPhotosUpdate]);

  const handleSelectAll = useCallback((selected: boolean) => {
    const updatedPhotos = photos.map(photo => ({ ...photo, selected }));
    onPhotosUpdate(updatedPhotos);
    setShowBulkActions(selected);
  }, [photos, onPhotosUpdate]);

  const handleBulkAction = useCallback(async (action: string) => {
    const selectedPhotoIds = selectedPhotos.map(p => p.id);
    
    switch (action) {
      case "delete":
        if (confirm(`Are you sure you want to delete ${selectedPhotoIds.length} photos?`)) {
          const updatedPhotos = photos.filter(photo => !photo.selected);
          onPhotosUpdate(updatedPhotos);
          toast({
            title: "Photos Deleted",
            description: `Successfully deleted ${selectedPhotoIds.length} photos`,
          });
        }
        break;
        
      case "archive":
        const archivedPhotos = photos.map(photo =>
          photo.selected ? { ...photo, categories: [...(photo.categories || []), "archived"] } : photo
        );
        onPhotosUpdate(archivedPhotos);
        toast({
          title: "Photos Archived",
          description: `Successfully archived ${selectedPhotoIds.length} photos`,
        });
        break;
        
      case "analyze":
        if (!isPremium) {
          toast({
            title: "Premium Feature",
            description: "AI analysis is available for premium users only",
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "AI Analysis Started",
          description: `Analyzing ${selectedPhotoIds.length} photos with AI...`,
        });

        // Analyze selected photos
        for (const photo of selectedPhotos) {
          if (photo.file) {
            try {
              const result = await analyzePhoto(photo.id, photo.file);
              const updatedPhotos = photos.map(p => 
                p.id === photo.id 
                  ? { 
                      ...p, 
                      aiAnalysis: result,
                      lastAnalyzed: new Date(),
                      status: (result.isNsfw ? "flagged" : "safe") as "safe" | "flagged" | "pending" | "scanning",
                      confidence: result.confidence
                    } 
                  : p
              );
              onPhotosUpdate(updatedPhotos);
            } catch (error) {
              console.error(`Failed to analyze photo ${photo.id}:`, error);
            }
          }
        }

        toast({
          title: "AI Analysis Complete",
          description: `Successfully analyzed ${selectedPhotoIds.length} photos`,
        });
        break;
        
      case "download":
        if (!isPremium) {
          toast({
            title: "Premium Feature",
            description: "Bulk download is available for premium users only",
            variant: "destructive",
          });
          return;
        }
        
        // Simulate download
        selectedPhotos.forEach(photo => {
          const link = document.createElement('a');
          link.href = photo.url;
          link.download = photo.name;
          link.click();
        });
        
        toast({
          title: "Download Started",
          description: `Downloading ${selectedPhotoIds.length} photos`,
        });
        break;
        
      case "clear-selection":
        const clearedPhotos = photos.map(photo => ({ ...photo, selected: false }));
        onPhotosUpdate(clearedPhotos);
        setShowBulkActions(false);
        break;
    }
  }, [selectedPhotos, photos, onPhotosUpdate, toast, isPremium, analyzePhoto]);

  const handleAnalyzePhoto = useCallback(async (photoId: string) => {
    const photo = photos.find(p => p.id === photoId);
    if (!photo?.file || !isPremium) return;

    setSelectedPhotoForAnalysis(photoId);
    
    try {
      const result = await analyzePhoto(photoId, photo.file);
      const updatedPhotos = photos.map(p => 
        p.id === photoId 
          ? { 
              ...p, 
              aiAnalysis: result,
              lastAnalyzed: new Date(),
              status: (result.isNsfw ? "flagged" : "safe") as "safe" | "flagged" | "pending" | "scanning",
              confidence: result.confidence
            } 
          : p
      );
      onPhotosUpdate(updatedPhotos);
      
      toast({
        title: "AI Analysis Complete",
        description: "Photo analyzed successfully with AI",
      });
    } catch (error) {
      console.error("AI analysis failed:", error);
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze photo with AI",
        variant: "destructive",
      });
    } finally {
      setSelectedPhotoForAnalysis(null);
    }
  }, [photos, onPhotosUpdate, isPremium, analyzePhoto]);

  const getStatusIcon = (status: EnhancedPhotoItem["status"]) => {
    switch (status) {
      case "safe":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "flagged":
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case "scanning":
        return <Clock className="w-4 h-4 text-blue-500 animate-spin" />;
      case "pending":
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: EnhancedPhotoItem["status"]) => {
    switch (status) {
      case "safe":
        return "bg-green-100 text-green-800 border-green-200";
      case "flagged":
        return "bg-red-100 text-red-800 border-red-200";
      case "scanning":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "pending":
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (date?: Date) => {
    if (!date) return "Not scanned";
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            {/* Search */}
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search photos by name, tags, objects, emotions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Advanced Filter */}
            <Select value={statusFilter} onValueChange={(value: FilterOption) => setStatusFilter(value)}>
              <SelectTrigger className="w-full lg:w-48 flex-shrink-0">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Photos</SelectItem>
                <SelectItem value="safe">Safe</SelectItem>
                <SelectItem value="flagged">Flagged</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="scanning">Scanning</SelectItem>
                <SelectItem value="has-faces">Has Faces</SelectItem>
                <SelectItem value="has-text">Has Text</SelectItem>
                <SelectItem value="high-quality">High Quality</SelectItem>
                <SelectItem value="privacy-concerns">Privacy Concerns</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <SortAsc className="w-4 h-4 mr-2" />
                  Sort
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSortBy("name")}>
                  Sort by Name
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("date")}>
                  Sort by Date
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("size")}>
                  Sort by Size
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("status")}>
                  Sort by Status
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("confidence")}>
                  Sort by Confidence
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("quality")}>
                  Sort by Quality
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("aesthetic")}>
                  Sort by Aesthetic
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("safety")}>
                  Sort by Safety
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Sort Direction */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
            >
              {sortDirection === "asc" ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
            </Button>

            {/* View Mode */}
            <div className="flex gap-1 flex-shrink-0">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="flex-shrink-0"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="flex-shrink-0"
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "analytics" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("analytics")}
                className="flex-shrink-0"
              >
                <BarChart3 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {showBulkActions && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                <Checkbox
                  checked={selectedPhotos.length === filteredAndSortedPhotos.length}
                  onCheckedChange={handleSelectAll}
                />
                <span className="text-sm font-medium truncate">
                  {selectedPhotos.length} of {filteredAndSortedPhotos.length} photos selected
                </span>
              </div>
              
              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction("analyze")}
                  disabled={!isPremium}
                  className="flex-shrink-0"
                >
                  <Brain className="w-4 h-4 mr-2" />
                  Analyze
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction("archive")}
                  className="flex-shrink-0"
                >
                  <Archive className="w-4 h-4 mr-2" />
                  Archive
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction("download")}
                  disabled={!isPremium}
                  className="flex-shrink-0"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleBulkAction("delete")}
                  className="flex-shrink-0"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleBulkAction("clear-selection")}
                  className="flex-shrink-0"
                >
                  Clear Selection
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analytics View */}
      {viewMode === "analytics" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              Photo Analytics Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{analyticsData.totalPhotos}</div>
                <div className="text-sm text-blue-800">Total Photos</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{analyticsData.analyzedPhotos}</div>
                <div className="text-sm text-green-800">Analyzed by AI</div>
                <div className="text-xs text-green-600">{analyticsData.analysisRate.toFixed(1)}% rate</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{analyticsData.photosWithFaces}</div>
                <div className="text-sm text-purple-800">Contains Faces</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{analyticsData.privacyConcernPhotos}</div>
                <div className="text-sm text-yellow-800">Privacy Concerns</div>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium">Quality Metrics</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Average Quality</span>
                    <span className="font-medium">{(analyticsData.avgQuality * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>High Quality Photos</span>
                    <span className="font-medium">{analyticsData.highQualityPhotos}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Average Safety Score</span>
                    <span className="font-medium">{(analyticsData.avgSafety * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium">Content Analysis</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Safe Photos</span>
                    <span className="font-medium text-green-600">{analyticsData.safePhotos}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Flagged Photos</span>
                    <span className="font-medium text-red-600">{analyticsData.flaggedPhotos}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Photos with Text</span>
                    <span className="font-medium">{analyticsData.photosWithText}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>Showing {filteredAndSortedPhotos.length} of {photos.length} photos</span>
        {searchQuery && (
          <span>Filtered by: "{searchQuery}"</span>
        )}
      </div>

      {/* Photo Grid/List */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredAndSortedPhotos.map((photo) => (
            <Card key={photo.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                {/* Photo */}
                <div className="relative aspect-square bg-gray-100">
                  <OptimizedImage
                    src={photo.url}
                    alt={photo.name}
                    width={300}
                    height={300}
                    aspectRatio={1}
                    className="w-full h-full"
                  />
                  
                  {/* Selection Checkbox */}
                  <div className="absolute top-2 left-2">
                    <Checkbox
                      checked={photo.selected}
                      onCheckedChange={(checked) => handleSelectPhoto(photo.id, checked as boolean)}
                      className="bg-white/80 backdrop-blur"
                    />
                  </div>

                  {/* Status Badge */}
                  <div className="absolute top-1 right-1 max-w-[60px]">
                    <Badge className={`text-xs ${getStatusColor(photo.status)} leading-none`} size="sm">
                      {getStatusIcon(photo.status)}
                      <span className="ml-0.5 truncate block">{photo.status}</span>
                    </Badge>
                  </div>

                  {/* AI Analysis Badge */}
                  {photo.aiAnalysis && (
                    <div className="absolute bottom-1 left-1">
                      <Badge variant="outline" className="text-xs bg-purple-100 text-purple-800 border-purple-200 leading-none" size="sm">
                        <Brain className="w-2 h-2 mr-1" />
                        AI
                      </Badge>
                    </div>
                  )}

                  {/* Privacy Concern Badge */}
                  {photo.privacyConcerns && photo.privacyConcerns.length > 0 && (
                    <div className="absolute bottom-1 right-1">
                      <Badge variant="outline" className="text-xs bg-red-100 text-red-800 border-red-200 leading-none" size="sm">
                        <Lock className="w-2 h-2 mr-1" />
                        Privacy
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Photo Info */}
                <div className="p-2 space-y-1">
                  <div className="flex items-start justify-between gap-1">
                    <h3 className="text-xs font-medium truncate flex-1 min-w-0" title={photo.name}>
                      {photo.name}
                    </h3>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 flex-shrink-0">
                          <MoreVertical className="w-3 h-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleAnalyzePhoto(photo.id)}>
                          <Brain className="w-4 h-4 mr-2" />
                          Analyze with AI
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Archive className="w-4 h-4 mr-2" />
                          Archive
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{formatFileSize(photo.fileSize)}</span>
                    {photo.lastAnalyzed && (
                      <span>{formatDate(photo.lastAnalyzed)}</span>
                    )}
                  </div>
                  
                  {/* AI Analysis Summary */}
                  {photo.aiAnalysis && (
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Brain className="w-3 h-3" />
                      <span>Q: {(photo.aiAnalysis.quality * 100).toFixed(0)}%</span>
                      <span>S: {(photo.aiAnalysis.safetyScore * 100).toFixed(0)}%</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {filteredAndSortedPhotos.map((photo) => (
                <div key={photo.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    {/* Thumbnail */}
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <OptimizedImage
                        src={photo.url}
                        alt={photo.name}
                        width={64}
                        height={64}
                        aspectRatio={1}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Photo Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-medium truncate">{photo.name}</h3>
                        <Badge className={`text-xs ${getStatusColor(photo.status)} leading-none`} size="sm">
                          {getStatusIcon(photo.status)}
                          <span className="ml-1">{photo.status}</span>
                        </Badge>
                        {photo.aiAnalysis && (
                          <Badge variant="outline" className="text-xs bg-purple-100 text-purple-800 border-purple-200 leading-none" size="sm">
                            <Brain className="w-2 h-2 mr-1" />
                            AI
                          </Badge>
                        )}
                        {photo.privacyConcerns && photo.privacyConcerns.length > 0 && (
                          <Badge variant="outline" className="text-xs bg-red-100 text-red-800 border-red-200 leading-none" size="sm">
                            <Lock className="w-2 h-2 mr-1" />
                            Privacy
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <HardDrive className="w-3 h-3" />
                          {formatFileSize(photo.fileSize)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(photo.scanDate)}
                        </span>
                        {photo.aiAnalysis && (
                          <span className="flex items-center gap-1">
                            <Brain className="w-3 h-3" />
                            Q: {(photo.aiAnalysis.quality * 100).toFixed(0)}% S: {(photo.aiAnalysis.safetyScore * 100).toFixed(0)}%
                          </span>
                        )}
                      </div>
                      
                      {/* Tags */}
                      {photo.aiAnalysis?.enhancedTags && photo.aiAnalysis.enhancedTags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {photo.aiAnalysis.enhancedTags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              <Tag className="w-2 h-2 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                          {photo.aiAnalysis.enhancedTags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{photo.aiAnalysis.enhancedTags.length - 3} more
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Checkbox
                        checked={photo.selected}
                        onCheckedChange={(checked) => handleSelectPhoto(photo.id, checked as boolean)}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAnalyzePhoto(photo.id)}
                        disabled={!isPremium}
                      >
                        <Brain className="w-4 h-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleAnalyzePhoto(photo.id)}>
                            <Brain className="w-4 h-4 mr-2" />
                            Analyze with AI
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Archive className="w-4 h-4 mr-2" />
                            Archive
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Analysis Panel */}
      {selectedPhotoForAnalysis && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">AI Analysis</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedPhotoForAnalysis(null)}
                >
                  ×
                </Button>
              </div>
              
              <AIEnhancedAnalyzer
                photoId={selectedPhotoForAnalysis}
                file={photos.find(p => p.id === selectedPhotoForAnalysis)?.file || new File([], '')}
                onAnalysisComplete={(result) => {
                  const updatedPhotos = photos.map(p => 
                    p.id === selectedPhotoForAnalysis 
                      ? { 
                          ...p, 
                          aiAnalysis: result,
                          lastAnalyzed: new Date(),
                          status: (result.isNsfw ? "flagged" : "safe") as "safe" | "flagged" | "pending" | "scanning",
                          confidence: result.confidence
                        } 
                      : p
                  );
                  onPhotosUpdate(updatedPhotos);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}