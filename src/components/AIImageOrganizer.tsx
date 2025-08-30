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
import { Switch } from "@/components/ui/switch";
import { 
  useSecureSubscription
} from "@/lib/secure-subscription-manager";
import { 
  FolderOpen, 
  Sparkles, 
  Grid, 
  List, 
  Calendar,
  MapPin,
  Users,
  Tag,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Clock,
  Star,
  Heart,
  Image as ImageIcon,
Camera,
  Landscape,
  Users as UsersIcon,
  Pet,
  Food,
  Car,
  Plane,
  Home,
  Work,
  Celebration,
  Nature,
  City,
  Beach,
  Mountain,
  Sunset,
  Night,
  Plus,
  Settings,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Crown,
  Zap,
  BarChart3,
  TrendingUp,
  Target,
  Lightbulb,
  Archive,
  Trash2,
  Download,
  Share2
} from "lucide-react";

interface Photo {
  id: string;
  url: string;
  name: string;
  uploadDate: Date;
  fileSize: number;
  tags: string[];
  location?: string;
  people?: string[];
  event?: string;
  quality: number;
  isFavorite: boolean;
  albums: string[];
  aiAnalysis?: {
    objects: string[];
    scene: string;
    mood: string;
    colors: string[];
    quality: number;
  };
}

interface Album {
  id: string;
  name: string;
  description: string;
  coverPhoto: string;
  photoCount: number;
  createdDate: Date;
  tags: string[];
  isSmart: boolean;
  autoUpdate: boolean;
  category: 'event' | 'people' | 'location' | 'time' | 'subject' | 'custom';
}

export function AIImageOrganizer() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"date" | "name" | "size" | "quality">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filterBy, setFilterBy] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null);
  const [isOrganizing, setIsOrganizing] = useState(false);
  const [organizationProgress, setOrganizationProgress] = useState(0);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [autoOrganize, setAutoOrganize] = useState(true);
  const [smartAlbumsEnabled, setSmartAlbumsEnabled] = useState(true);
  const [newAlbumName, setNewAlbumName] = useState("");
  const [showCreateAlbum, setShowCreateAlbum] = useState(false);

  const { isPremium } = useSecureSubscription();

  // Initialize with mock data
  useEffect(() => {
    const mockPhotos: Photo[] = [
      {
        id: "1",
        url: "https://picsum.photos/seed/photo1/400/300.jpg",
        name: "Beach Sunset",
        uploadDate: new Date("2024-01-15"),
        fileSize: 2048000,
        tags: ["beach", "sunset", "nature", "vacation"],
        location: "Malibu, CA",
        people: ["John", "Sarah"],
        event: "Summer Vacation 2024",
        quality: 95,
        isFavorite: true,
        albums: ["Vacation 2024", "Beaches", "Sunsets"],
        aiAnalysis: {
          objects: ["ocean", "sun", "clouds", "people"],
          scene: "beach sunset",
          mood: "peaceful",
          colors: ["orange", "blue", "yellow"],
          quality: 95
        }
      },
      {
        id: "2",
        url: "https://picsum.photos/seed/photo2/400/300.jpg",
        name: "City Skyline",
        uploadDate: new Date("2024-01-20"),
        fileSize: 1536000,
        tags: ["city", "skyline", "urban", "night"],
        location: "New York, NY",
        quality: 88,
        isFavorite: false,
        albums: ["Urban", "Night Photography"],
        aiAnalysis: {
          objects: ["buildings", "lights", "sky"],
          scene: "urban skyline",
          mood: "energetic",
          colors: ["black", "blue", "yellow"],
          quality: 88
        }
      },
      {
        id: "3",
        url: "https://picsum.photos/seed/photo3/400/300.jpg",
        name: "Family Portrait",
        uploadDate: new Date("2024-01-25"),
        fileSize: 3072000,
        tags: ["family", "portrait", "people", "indoor"],
        people: ["John", "Sarah", "Mike", "Emma"],
        event: "Family Reunion",
        quality: 92,
        isFavorite: true,
        albums: ["Family", "Portraits"],
        aiAnalysis: {
          objects: ["people", "furniture"],
          scene: "indoor portrait",
          mood: "happy",
          colors: ["brown", "beige", "white"],
          quality: 92
        }
      },
      {
        id: "4",
        url: "https://picsum.photos/seed/photo4/400/300.jpg",
        name: "Mountain Hiking",
        uploadDate: new Date("2024-02-01"),
        fileSize: 2560000,
        tags: ["mountain", "hiking", "nature", "adventure"],
        location: "Rocky Mountains",
        people: ["John", "Mike"],
        event: "Hiking Trip",
        quality: 90,
        isFavorite: false,
        albums: ["Nature", "Adventure", "Hiking"],
        aiAnalysis: {
          objects: ["mountains", "trees", "hikers"],
          scene: "mountain trail",
          mood: "adventurous",
          colors: ["green", "brown", "blue"],
          quality: 90
        }
      },
      {
        id: "5",
        url: "https://picsum.photos/seed/photo5/400/300.jpg",
        name: "Birthday Party",
        uploadDate: new Date("2024-02-10"),
        fileSize: 2816000,
        tags: ["party", "birthday", "celebration", "people"],
        people: ["Sarah", "Emma", "Mike", "Lisa", "Tom"],
        event: "Emma's Birthday",
        quality: 85,
        isFavorite: true,
        albums: ["Celebrations", "Birthdays"],
        aiAnalysis: {
          objects: ["people", "cake", "decorations"],
          scene: "indoor party",
          mood: "festive",
          colors: ["pink", "white", "gold"],
          quality: 85
        }
      },
      {
        id: "6",
        url: "https://picsum.photos/seed/photo6/400/300.jpg",
        name: "Pet Portrait",
        uploadDate: new Date("2024-02-15"),
        fileSize: 1792000,
        tags: ["pet", "dog", "portrait", "cute"],
        quality: 93,
        isFavorite: true,
        albums: ["Pets", "Portraits"],
        aiAnalysis: {
          objects: ["dog", "toys"],
          scene: "indoor pet",
          mood: "playful",
          colors: ["brown", "beige", "gray"],
          quality: 93
        }
      }
    ];

    const mockAlbums: Album[] = [
      {
        id: "1",
        name: "Vacation 2024",
        description: "Our amazing summer vacation photos",
        coverPhoto: "https://picsum.photos/seed/album1/400/300.jpg",
        photoCount: 45,
        createdDate: new Date("2024-01-15"),
        tags: ["vacation", "travel", "2024"],
        isSmart: false,
        autoUpdate: false,
        category: "event"
      },
      {
        id: "2",
        name: "Family & Friends",
        description: "Photos with family and friends",
        coverPhoto: "https://picsum.photos/seed/album2/400/300.jpg",
        photoCount: 128,
        createdDate: new Date("2024-01-01"),
        tags: ["family", "friends", "people"],
        isSmart: true,
        autoUpdate: true,
        category: "people"
      },
      {
        id: "3",
        name: "Nature & Landscapes",
        description: "Beautiful nature and landscape photography",
        coverPhoto: "https://picsum.photos/seed/album3/400/300.jpg",
        photoCount: 67,
        createdDate: new Date("2024-01-10"),
        tags: ["nature", "landscape", "outdoor"],
        isSmart: true,
        autoUpdate: true,
        category: "subject"
      },
      {
        id: "4",
        name: "Best of 2024",
        description: "Highest quality photos from this year",
        coverPhoto: "https://picsum.photos/seed/album4/400/300.jpg",
        photoCount: 23,
        createdDate: new Date("2024-01-01"),
        tags: ["best", "quality", "2024"],
        isSmart: true,
        autoUpdate: true,
        category: "custom"
      }
    ];

    setPhotos(mockPhotos);
    setAlbums(mockAlbums);
  }, []);

  const handleOrganizePhotos = useCallback(async () => {
    setIsOrganizing(true);
    setOrganizationProgress(0);

    // Simulate AI organization process
    const steps = [
      { progress: 20, message: "Analyzing photo content..." },
      { progress: 40, message: "Detecting faces and objects..." },
      { progress: 60, message: "Identifying locations and events..." },
      { progress: 80, message: "Creating smart albums..." },
      { progress: 100, message: "Organization complete!" }
    ];

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setOrganizationProgress(step.progress);
    }

    // Update photos with enhanced AI analysis
    setPhotos(prev => prev.map(photo => ({
      ...photo,
      aiAnalysis: {
        ...photo.aiAnalysis!,
        quality: Math.min(100, photo.aiAnalysis!.quality + Math.floor(Math.random() * 10))
      }
    })));

    setIsOrganizing(false);
  }, []);

  const handleCreateAlbum = useCallback(() => {
    if (!newAlbumName.trim()) return;

    const newAlbum: Album = {
      id: Date.now().toString(),
      name: newAlbumName,
      description: `Auto-created album: ${newAlbumName}`,
      coverPhoto: selectedPhotos.length > 0 
        ? photos.find(p => p.id === selectedPhotos[0])?.url || "https://picsum.photos/seed/new/400/300.jpg"
        : "https://picsum.photos/seed/new/400/300.jpg",
      photoCount: selectedPhotos.length,
      createdDate: new Date(),
      tags: [],
      isSmart: false,
      autoUpdate: false,
      category: "custom"
    };

    setAlbums(prev => [...prev, newAlbum]);
    setNewAlbumName("");
    setShowCreateAlbum(false);
    setSelectedPhotos([]);
  }, [newAlbumName, selectedPhotos, photos]);

  const handleToggleFavorite = useCallback((photoId: string) => {
    setPhotos(prev => 
      prev.map(photo => 
        photo.id === photoId 
          ? { ...photo, isFavorite: !photo.isFavorite }
          : photo
      )
    );
  }, []);

  const handleSelectPhoto = useCallback((photoId: string) => {
    setSelectedPhotos(prev => 
      prev.includes(photoId) 
        ? prev.filter(id => id !== photoId)
        : [...prev, photoId]
    );
  }, []);

  const handleSelectAll = useCallback(() => {
    const filteredPhotos = getFilteredAndSortedPhotos();
    setSelectedPhotos(filteredPhotos.map(p => p.id));
  }, [photos, filterBy, searchQuery, selectedAlbum]);

  const handleClearSelection = useCallback(() => {
    setSelectedPhotos([]);
  }, []);

  const getFilteredAndSortedPhotos = useCallback(() => {
    let filtered = [...photos];

    // Apply album filter
    if (selectedAlbum) {
      filtered = filtered.filter(photo => photo.albums.includes(selectedAlbum));
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(photo => 
        photo.name.toLowerCase().includes(query) ||
        photo.tags.some(tag => tag.toLowerCase().includes(query)) ||
        photo.location?.toLowerCase().includes(query) ||
        photo.people?.some(person => person.toLowerCase().includes(query))
      );
    }

    // Apply category filter
    if (filterBy !== "all") {
      filtered = filtered.filter(photo => {
        switch (filterBy) {
          case "favorites": return photo.isFavorite;
          case "recent": return photo.uploadDate > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          case "high-quality": return photo.quality >= 90;
          case "people": return photo.people && photo.people.length > 0;
          case "locations": return photo.location;
          case "events": return photo.event;
          default: return true;
        }
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "date":
          comparison = a.uploadDate.getTime() - b.uploadDate.getTime();
          break;
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "size":
          comparison = a.fileSize - b.fileSize;
          break;
        case "quality":
          comparison = a.quality - b.quality;
          break;
      }
      return sortOrder === "desc" ? -comparison : comparison;
    });

    return filtered;
  }, [photos, selectedAlbum, searchQuery, filterBy, sortBy, sortOrder]);

  const filteredPhotos = getFilteredAndSortedPhotos();

  const getAlbumIcon = (category: Album['category']) => {
    switch (category) {
      case "event": return <Celebration className="w-5 h-5" />;
      case "people": return <Users className="w-5 h-5" />;
      case "location": return <MapPin className="w-5 h-5" />;
      case "time": return <Clock className="w-5 h-5" />;
      case "subject": return <Camera className="w-5 h-5" />;
      case "custom": return <FolderOpen className="w-5 h-5" />;
      default: return <FolderOpen className="w-5 h-5" />;
    }
  };

  const getFilterIcon = (filter: string) => {
    switch (filter) {
      case "favorites": return <Heart className="w-4 h-4" />;
      case "recent": return <Clock className="w-4 h-4" />;
      case "high-quality": return <Star className="w-4 h-4" />;
      case "people": return <Users className="w-4 h-4" />;
      case "locations": return <MapPin className="w-4 h-4" />;
      case "events": return <Calendar className="w-4 h-4" />;
      default: return <ImageIcon className="w-4 h-4" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (!isPremium) {
    return (
      <Card className="w-full">
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
              <FolderOpen className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold">AI Image Organizer</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Automatically organize your photo collection with AI-powered smart albums, 
              face recognition, and intelligent categorization.
            </p>
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
              <div className="text-center">
                <Users className="w-8 h-8 mx-auto text-blue-500 mb-2" />
                <div className="text-xs font-medium">Face Recognition</div>
              </div>
              <div className="text-center">
                <MapPin className="w-8 h-8 mx-auto text-green-500 mb-2" />
                <div className="text-xs font-medium">Location Tagging</div>
              </div>
              <div className="text-center">
                <Calendar className="w-8 h-8 mx-auto text-purple-500 mb-2" />
                <div className="text-xs font-medium">Smart Albums</div>
              </div>
            </div>
            <Button size="lg" className="premium-button">
              <Crown className="w-4 h-4 mr-2" />
              Unlock AI Organizer
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
            <FolderOpen className="w-6 h-6 text-green-600" />
            AI Image Organizer
          </h2>
          <p className="text-muted-foreground">Smart photo organization with AI-powered albums</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleOrganizePhotos}
            disabled={isOrganizing}
            className="premium-button"
          >
            {isOrganizing ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 mr-2" />
            )}
            Organize Photos
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
          >
            {viewMode === "grid" ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Organization Progress */}
      {isOrganizing && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">AI Organization Progress</span>
                <span className="text-sm text-muted-foreground">{organizationProgress}%</span>
              </div>
              <Progress value={organizationProgress} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {organizationProgress < 20 ? "Analyzing photo content..." :
                 organizationProgress < 40 ? "Detecting faces and objects..." :
                 organizationProgress < 60 ? "Identifying locations and events..." :
                 organizationProgress < 80 ? "Creating smart albums..." :
                 "Organization complete!"}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="photos" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="photos">Photos</TabsTrigger>
          <TabsTrigger value="albums">Albums</TabsTrigger>
          <TabsTrigger value="smart">Smart Features</TabsTrigger>
        </TabsList>

        <TabsContent value="photos" className="space-y-6">
          {/* Filters and Controls */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-4 items-center">
                {/* Search */}
                <div className="flex-1 min-w-64">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search photos..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Filter */}
                <Select value={filterBy} onValueChange={setFilterBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      <div className="flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" />
                        All Photos
                      </div>
                    </SelectItem>
                    <SelectItem value="favorites">
                      <div className="flex items-center gap-2">
                        <Heart className="w-4 h-4" />
                        Favorites
                      </div>
                    </SelectItem>
                    <SelectItem value="recent">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Recent
                      </div>
                    </SelectItem>
                    <SelectItem value="high-quality">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4" />
                        High Quality
                      </div>
                    </SelectItem>
                    <SelectItem value="people">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        People
                      </div>
                    </SelectItem>
                    <SelectItem value="locations">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Locations
                      </div>
                    </SelectItem>
                    <SelectItem value="events">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Events
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>

                {/* Sort */}
                <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
                  const [field, order] = value.split('-');
                  setSortBy(field as any);
                  setSortOrder(order as any);
                }}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date-desc">
                      <div className="flex items-center gap-2">
                        <SortDesc className="w-4 h-4" />
                        Newest First
                      </div>
                    </SelectItem>
                    <SelectItem value="date-asc">
                      <div className="flex items-center gap-2">
                        <SortAsc className="w-4 h-4" />
                        Oldest First
                      </div>
                    </SelectItem>
                    <SelectItem value="name-asc">
                      <div className="flex items-center gap-2">
                        <SortAsc className="w-4 h-4" />
                        Name A-Z
                      </div>
                    </SelectItem>
                    <SelectItem value="name-desc">
                      <div className="flex items-center gap-2">
                        <SortDesc className="w-4 h-4" />
                        Name Z-A
                      </div>
                    </SelectItem>
                    <SelectItem value="quality-desc">
                      <div className="flex items-center gap-2">
                        <SortDesc className="w-4 h-4" />
                        Highest Quality
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>

                {/* Selection Controls */}
                {selectedPhotos.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={handleClearSelection}>
                      Clear ({selectedPhotos.length})
                    </Button>
                    <Button size="sm" onClick={() => setShowCreateAlbum(true)}>
                      Create Album
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Create Album Dialog */}
          {showCreateAlbum && (
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Create New Album</h3>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Album name..."
                      value={newAlbumName}
                      onChange={(e) => setNewAlbumName(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleCreateAlbum()}
                      className="flex-1"
                    />
                    <Button onClick={handleCreateAlbum} disabled={!newAlbumName.trim()}>
                      Create
                    </Button>
                    <Button variant="outline" onClick={() => setShowCreateAlbum(false)}>
                      Cancel
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {selectedPhotos.length} photos will be added to this album
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Photos Grid */}
          {filteredPhotos.length > 0 ? (
            <div className={`grid gap-4 ${
              viewMode === "grid" 
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "grid-cols-1"
            }`}>
              {filteredPhotos.map(photo => (
                <Card 
                  key={photo.id} 
                  className={`overflow-hidden cursor-pointer transition-all ${
                    selectedPhotos.includes(photo.id) 
                      ? 'ring-2 ring-blue-500 bg-blue-50' 
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => handleSelectPhoto(photo.id)}
                >
                  <div className="relative aspect-square">
                    <img
                      src={photo.url}
                      alt={photo.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 flex gap-1">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="w-8 h-8 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleFavorite(photo.id);
                        }}
                      >
                        <Heart className={`w-4 h-4 ${photo.isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                      </Button>
                      {selectedPhotos.includes(photo.id) && (
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="absolute bottom-2 left-2">
                      <Badge variant="secondary" className="text-xs">
                        {photo.quality}%
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-3">
                    <div className="space-y-2">
                      <h3 className="font-medium text-sm line-clamp-1">{photo.name}</h3>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{photo.uploadDate.toLocaleDateString()}</span>
                        <span>{formatFileSize(photo.fileSize)}</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {photo.tags.slice(0, 3).map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {photo.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{photo.tags.length - 3}
                          </Badge>
                        )}
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
                <h3 className="text-lg font-semibold mb-2">No Photos Found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or search terms
                </p>
                <Button onClick={() => {
                  setSearchQuery("");
                  setFilterBy("all");
                  setSelectedAlbum(null);
                }}>
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="albums" className="space-y-6">
          {/* Albums Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Photo Albums</h3>
            <Button onClick={() => setShowCreateAlbum(true)}>
              <Plus className="w-4 h-4 mr-2" />
              New Album
            </Button>
          </div>

          {/* Albums Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {albums.map(album => (
              <Card 
                key={album.id} 
                className="overflow-hidden cursor-pointer hover:shadow-md transition-all"
                onClick={() => setSelectedAlbum(album.id)}
              >
                <div className="relative aspect-video">
                  <img
                    src={album.coverPhoto}
                    alt={album.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge variant={album.isSmart ? "default" : "secondary"} className="text-xs">
                      {album.isSmart ? "Smart" : "Manual"}
                    </Badge>
                  </div>
                  <div className="absolute bottom-2 left-2">
                    <Badge variant="outline" className="text-xs bg-black/50 text-white border-white/20">
                      {album.photoCount} photos
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {getAlbumIcon(album.category)}
                      <h4 className="font-semibold text-sm">{album.name}</h4>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{album.description}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{album.createdDate.toLocaleDateString()}</span>
                      {album.autoUpdate && (
                        <RefreshCw className="w-3 h-3" />
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {album.tags.slice(0, 3).map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="smart" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Smart Albums */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-600" />
                  Smart Albums
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Enable Smart Albums</Label>
                  <Switch
                    checked={smartAlbumsEnabled}
                    onCheckedChange={setSmartAlbumsEnabled}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Automatically create albums based on people, locations, events, and photo content.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4" />
                    <span>People-based albums</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4" />
                    <span>Location-based albums</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>Event-based albums</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Target className="w-4 h-4" />
                    <span>Subject-based albums</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Auto Organization */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-blue-600" />
                  Auto Organization
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Auto-organize new photos</Label>
                  <Switch
                    checked={autoOrganize}
                    onCheckedChange={setAutoOrganize}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Automatically organize new photos as they are uploaded using AI analysis.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Tag className="w-4 h-4" />
                    <span>Auto-tagging</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Star className="w-4 h-4" />
                    <span>Quality assessment</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4" />
                    <span>Location detection</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4" />
                    <span>Face recognition</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                AI Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{photos.length}</div>
                  <div className="text-sm text-blue-800">Total Photos</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{albums.length}</div>
                  <div className="text-sm text-green-800">Albums Created</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {Math.round(photos.reduce((sum, p) => sum + p.quality, 0) / photos.length)}%
                  </div>
                  <div className="text-sm text-purple-800">Avg Quality</div>
                </div>
              </div>
              
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span>Photo quality improved by 15% after AI enhancement</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Lightbulb className="w-4 h-4 text-yellow-600" />
                  <span>AI suggests creating albums for recent vacation photos</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span>5 people frequently appear in your photos</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}