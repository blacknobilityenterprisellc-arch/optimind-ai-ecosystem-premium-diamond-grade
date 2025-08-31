"use client";

import { useState, useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PremiumBadge, PremiumFeature } from "@/components/PremiumBadge";
import { 
  Tag, 
  X, 
  Plus, 
  Search, 
  User, 
  Smile, 
  MapPin,
  Camera,
  Calendar,
  Sparkles,
  Brain,
  Filter,
  Loader2
} from "lucide-react";

interface AITag {
  id: string;
  name: string;
  type: "person" | "emotion" | "location" | "object" | "event" | "custom";
  confidence: number;
  color: string;
  icon?: React.ReactNode;
}

interface PhotoWithTags {
  id: string;
  name: string;
  url: string;
  tags: AITag[];
  isProcessing?: boolean;
}

interface AITaggingModuleProps {
  photos: PhotoWithTags[];
  onTagsUpdate?: (photoId: string, tags: AITag[]) => void;
  isPremium?: boolean;
  className?: string;
}

const TAG_COLORS = {
  person: "bg-blue-500/20 text-blue-400 border-blue-500/50",
  emotion: "bg-pink-500/20 text-pink-400 border-pink-500/50",
  location: "bg-green-500/20 text-green-400 border-green-500/50",
  object: "bg-purple-500/20 text-purple-400 border-purple-500/50",
  event: "bg-orange-500/20 text-orange-400 border-orange-500/50",
  custom: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50"
};

const TAG_ICONS = {
  person: <User className="w-3 h-3" />,
  emotion: <Smile className="w-3 h-3" />,
  location: <MapPin className="w-3 h-3" />,
  object: <Camera className="w-3 h-3" />,
  event: <Calendar className="w-3 h-3" />,
  custom: <Tag className="w-3 h-3" />
};

const PREDEFINED_TAGS = [
  { name: "Family", type: "person" as const },
  { name: "Friends", type: "person" as const },
  { name: "Happy", type: "emotion" as const },
  { name: "Sad", type: "emotion" as const },
  { name: "Beach", type: "location" as const },
  { name: "Mountain", type: "location" as const },
  { name: "Birthday", type: "event" as const },
  { name: "Wedding", type: "event" as const },
  { name: "Sunset", type: "object" as const },
  { name: "Nature", type: "object" as const }
];

export function AITaggingModule({ 
  photos, 
  onTagsUpdate, 
  isPremium = false, 
  className 
}: AITaggingModuleProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [isGeneratingTags, setIsGeneratingTags] = useState(false);
  const [customTagName, setCustomTagName] = useState("");
  const [showAddTag, setShowAddTag] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const selectedPhotoData = photos.find(p => p.id === selectedPhoto);

  // Auto-scroll to new tags
  useEffect(() => {
    if (scrollContainerRef.current && selectedPhotoData?.tags) {
      scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollWidth;
    }
  }, [selectedPhotoData?.tags]);

  const generateAITags = async (photoId: string) => {
    if (!isPremium) return;

    setIsGeneratingTags(true);
    
    try {
      // Simulate AI tag generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockTags: AITag[] = [
        {
          id: `ai-${Date.now()}-1`,
          name: "Family",
          type: "person",
          confidence: 0.95,
          color: TAG_COLORS.person
        },
        {
          id: `ai-${Date.now()}-2`,
          name: "Happy",
          type: "emotion", 
          confidence: 0.88,
          color: TAG_COLORS.emotion
        },
        {
          id: `ai-${Date.now()}-3`,
          name: "Beach",
          type: "location",
          confidence: 0.92,
          color: TAG_COLORS.location
        },
        {
          id: `ai-${Date.now()}-4`,
          name: "Vacation",
          type: "event",
          confidence: 0.85,
          color: TAG_COLORS.event
        }
      ];

      // Update photo tags
      const updatedPhotos = photos.map(photo => 
        photo.id === photoId 
          ? { ...photo, tags: [...photo.tags, ...mockTags], isProcessing: false }
          : photo
      );

      onTagsUpdate?.(photoId, mockTags);
    } catch (error) {
      console.error("Failed to generate AI tags:", error);
    } finally {
      setIsGeneratingTags(false);
    }
  };

  const addCustomTag = (photoId: string) => {
    if (!customTagName.trim()) return;

    const newTag: AITag = {
      id: `custom-${Date.now()}`,
      name: customTagName.trim(),
      type: "custom",
      confidence: 1.0,
      color: TAG_COLORS.custom
    };

    const updatedPhotos = photos.map(photo => 
      photo.id === photoId 
        ? { ...photo, tags: [...photo.tags, newTag] }
        : photo
    );

    onTagsUpdate?.(photoId, [...selectedPhotoData!.tags, newTag]);
    setCustomTagName("");
    setShowAddTag(false);
  };

  const removeTag = (photoId: string, tagId: string) => {
    const updatedTags = selectedPhotoData?.tags.filter(tag => tag.id !== tagId) || [];
    onTagsUpdate?.(photoId, updatedTags);
  };

  const toggleFilter = (filter: string) => {
    setActiveFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const getAllTags = () => {
    const allTags = new Set<string>();
    photos.forEach(photo => {
      photo.tags.forEach(tag => allTags.add(tag.type));
    });
    return Array.from(allTags);
  };

  const getFilteredPhotos = () => {
    if (activeFilters.length === 0) return photos;
    
    return photos.filter(photo => 
      photo.tags.some(tag => activeFilters.includes(tag.type))
    );
  };

  const filteredPhotos = getFilteredPhotos();

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">AI Smart Tags</h3>
            <p className="text-sm text-gray-400">Organize photos with intelligent tagging</p>
          </div>
          {!isPremium && <PremiumBadge size="sm" text="PRO" />}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => setActiveFilters([])}
          className={activeFilters.length > 0 ? "text-yellow-400 border-yellow-400/50" : ""}
        >
          <Filter className="w-4 h-4 mr-2" />
          Clear Filters
        </Button>
      </div>

      {/* Search and Filter Bar */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search photos by tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Tag Type Filters */}
            <div className="flex flex-wrap gap-2">
              {getAllTags().map(tagType => (
                <Badge
                  key={tagType}
                  variant={activeFilters.includes(tagType) ? "default" : "outline"}
                  className={`cursor-pointer transition-all ${
                    activeFilters.includes(tagType) 
                      ? TAG_COLORS[tagType as keyof typeof TAG_COLORS]
                      : "border-gray-600 text-gray-400 hover:border-gray-500"
                  }`}
                  onClick={() => toggleFilter(tagType)}
                >
                  {TAG_ICONS[tagType as keyof typeof TAG_ICONS]}
                  <span className="ml-1 capitalize">{tagType}</span>
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Photo Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPhotos.map(photo => (
          <Card 
            key={photo.id} 
            className={`bg-gray-800/50 border-gray-700 overflow-hidden transition-all hover:border-gray-600 ${
              selectedPhoto === photo.id ? "ring-2 ring-purple-500" : ""
            }`}
          >
            <CardContent className="p-4">
              {/* Photo Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h4 className="font-medium text-white mb-1 truncate">{photo.name}</h4>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {photo.tags.length} tags
                    </Badge>
                    {photo.isProcessing && (
                      <Badge variant="outline" className="text-xs border-blue-500/50 text-blue-400">
                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                        Processing
                      </Badge>
                    )}
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedPhoto(photo.id === selectedPhoto ? null : photo.id)}
                  className="text-gray-400 hover:text-white"
                >
                  <Tag className="w-4 h-4" />
                </Button>
              </div>

              {/* Photo Preview */}
              <div className="aspect-square bg-gray-900 rounded-lg mb-4 overflow-hidden">
                <img
                  src={photo.url}
                  alt={photo.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Tags Display */}
              {selectedPhoto === photo.id && (
                <PremiumFeature isPremium={!isPremium}>
                  <div className="space-y-3">
                    {/* AI Generate Button */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">AI-Powered Tags</span>
                      <Button
                        size="sm"
                        onClick={() => generateAITags(photo.id)}
                        disabled={isGeneratingTags || !isPremium}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                      >
                        {isGeneratingTags ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Sparkles className="w-4 h-4 mr-2" />
                        )}
                        Generate AI Tags
                      </Button>
                    </div>

                    {/* Tags Container */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Current Tags</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowAddTag(!showAddTag)}
                          className="text-gray-400 hover:text-white"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Add Custom Tag */}
                      {showAddTag && (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Add custom tag..."
                            value={customTagName}
                            onChange={(e) => setCustomTagName(e.target.value)}
                            className="flex-1 px-3 py-1 bg-gray-800 border border-gray-700 rounded text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-500"
                            onKeyPress={(e) => e.key === 'Enter' && addCustomTag(photo.id)}
                          />
                          <Button
                            size="sm"
                            onClick={() => addCustomTag(photo.id)}
                            disabled={!customTagName.trim()}
                          >
                            Add
                          </Button>
                        </div>
                      )}

                      {/* Tags Scroll Container */}
                      <div
                        ref={scrollContainerRef}
                        className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
                        style={{ scrollbarWidth: "thin" }}
                      >
                        {photo.tags.map((tag) => (
                          <Badge
                            key={tag.id}
                            variant="secondary"
                            className={`flex-shrink-0 animate-in slide-in-from-right-2 ${tag.color} border cursor-pointer group`}
                          >
                            {TAG_ICONS[tag.type]}
                            <span className="ml-1">{tag.name}</span>
                            <span className="ml-1 text-xs opacity-70">
                              {Math.round(tag.confidence * 100)}%
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeTag(photo.id, tag.id);
                              }}
                              className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-400"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                        
                        {photo.tags.length === 0 && (
                          <span className="text-sm text-gray-500 whitespace-nowrap">
                            No tags yet. Generate AI tags or add custom ones.
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </PremiumFeature>
              )}

              {/* Quick Tag Preview */}
              {selectedPhoto !== photo.id && photo.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {photo.tags.slice(0, 3).map(tag => (
                    <Badge
                      key={tag.id}
                      variant="outline"
                      className={`text-xs ${tag.color} border`}
                    >
                      {tag.name}
                    </Badge>
                  ))}
                  {photo.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs border-gray-600">
                      +{photo.tags.length - 3}
                    </Badge>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredPhotos.length === 0 && (
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-12 text-center">
            <Brain className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">No Photos Found</h3>
            <p className="text-gray-400 mb-4">
              {activeFilters.length > 0 
                ? "No photos match the selected filters."
                : "Upload photos to start AI-powered tagging."
              }
            </p>
            {activeFilters.length > 0 && (
              <Button
                variant="outline"
                onClick={() => setActiveFilters([])}
              >
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}