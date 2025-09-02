// AI Image Organizer Service for Premium Features
import { useState, useEffect, useCallback } from 'react';
import ZAI from 'z-ai-web-dev-sdk';

export interface OrganizationResult {
  success: boolean;
  photosOrganized: number;
  albumsCreated: number;
  tagsAdded: number;
  processingTime: number;
  error?: string;
  insights?: {
    peopleIdentified: number;
    locationsDetected: number;
    eventsRecognized: number;
    qualityImprovements: number;
  };
}

export interface SmartAlbum {
  id: string;
  name: string;
  description: string;
  type: 'people' | 'location' | 'event' | 'time' | 'quality' | 'subject';
  criteria: {
    people?: string[];
    location?: string;
    dateRange?: { start: Date; end: Date };
    quality?: { min: number; max: number };
    tags?: string[];
  };
  photoCount: number;
  autoUpdate: boolean;
  createdDate: Date;
}

export interface PhotoAnalysis {
  id: string;
  objects: string[];
  people: Array<{
    name: string;
    confidence: number;
    boundingBox?: { x: number; y: number; width: number; height: number };
  }>;
  location?: {
    name: string;
    confidence: number;
    coordinates?: { lat: number; lng: number };
  };
  scene: string;
  mood: string;
  quality: number;
  tags: string[];
  colors: string[];
  suggestedAlbums: string[];
  duplicates: Array<{
    photoId: string;
    similarity: number;
  }>;
}

class AIImageOrganizerService {
  private zai: any = null;
  private isInitialized: boolean = false;

  async initialize(): Promise<boolean> {
    try {
      this.zai = await ZAI.create();
      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize AI Image Organizer:', error);
      return false;
    }
  }

  async organizePhotos(
    photos: Array<{
      id: string;
      url: string;
      name: string;
      file?: File;
    }>,
    options: {
      enableFaceRecognition?: boolean;
      enableLocationDetection?: boolean;
      enableEventDetection?: boolean;
      enableQualityAssessment?: boolean;
      createSmartAlbums?: boolean;
      autoTag?: boolean;
    } = {}
  ): Promise<OrganizationResult> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      const startTime = Date.now();
      
      const defaultOptions = {
        enableFaceRecognition: true,
        enableLocationDetection: true,
        enableEventDetection: true,
        enableQualityAssessment: true,
        createSmartAlbums: true,
        autoTag: true,
        ...options
      };

      let photosOrganized = 0;
      let albumsCreated = 0;
      let tagsAdded = 0;
      const insights = {
        peopleIdentified: 0,
        locationsDetected: 0,
        eventsRecognized: 0,
        qualityImprovements: 0
      };

      // Process each photo with AI
      for (const photo of photos) {
        try {
          const analysis = await this.analyzePhoto(photo.url, defaultOptions);
          
          if (analysis) {
            photosOrganized++;
            
            if (analysis.people.length > 0) {
              insights.peopleIdentified += analysis.people.length;
            }
            
            if (analysis.location) {
              insights.locationsDetected++;
            }
            
            if (analysis.quality > 80) {
              insights.qualityImprovements++;
            }
            
            tagsAdded += analysis.tags.length;
          }
        } catch (error) {
          console.error(`Failed to analyze photo ${photo.id}:`, error);
        }
      }

      // Create smart albums based on analysis
      if (defaultOptions.createSmartAlbums) {
        const smartAlbums = await this.createSmartAlbums(photos);
        albumsCreated = smartAlbums.length;
      }

      const processingTime = Date.now() - startTime;

      return {
        success: true,
        photosOrganized,
        albumsCreated,
        tagsAdded,
        processingTime,
        insights
      };
    } catch (error) {
      return {
        success: false,
        photosOrganized: 0,
        albumsCreated: 0,
        tagsAdded: 0,
        processingTime: 0,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async analyzePhoto(
    imageUrl: string,
    options: {
      enableFaceRecognition?: boolean;
      enableLocationDetection?: boolean;
      enableEventDetection?: boolean;
      enableQualityAssessment?: boolean;
      autoTag?: boolean;
    } = {}
  ): Promise<PhotoAnalysis | null> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      // Use Z.AI to analyze the image
      const analysisPrompt = `
        Analyze this image and provide detailed information about:
        - Objects and elements present
        - People (if face recognition is enabled)
        - Location/setting (if location detection is enabled)
        - Scene type and mood
        - Overall quality assessment
        - Suggested tags
        - Dominant colors
        - Possible events or occasions
        
        Please respond in JSON format with the following structure:
        {
          "objects": ["object1", "object2"],
          "people": [{"name": "person1", "confidence": 0.95}],
          "location": {"name": "place", "confidence": 0.8},
          "scene": "scene description",
          "mood": "mood description",
          "quality": 85,
          "tags": ["tag1", "tag2"],
          "colors": ["color1", "color2"],
          "suggestedAlbums": ["album1", "album2"]
        }
      `;

      const response = await this.zai.chat.completions.create({
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: analysisPrompt
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageUrl
                }
              }
            ]
          }
        ],
        model: 'glm-45v', // Use vision model for image analysis
          max_tokens: 1000
      });

      const analysisText = response.choices[0]?.message?.content;
      if (!analysisText) return null;

      // Parse the JSON response
      const analysis = JSON.parse(analysisText);
      
      return {
        id: Date.now().toString(),
        objects: analysis.objects || [],
        people: analysis.people || [],
        location: analysis.location,
        scene: analysis.scene || '',
        mood: analysis.mood || '',
        quality: analysis.quality || 50,
        tags: analysis.tags || [],
        colors: analysis.colors || [],
        suggestedAlbums: analysis.suggestedAlbums || [],
        duplicates: [] // Will be implemented with duplicate detection
      };
    } catch (error) {
      console.error('Failed to analyze photo:', error);
      return null;
    }
  }

  async createSmartAlbums(
    photos: Array<{ id: string; url: string; name: string }>
  ): Promise<SmartAlbum[]> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      // Analyze all photos to find patterns
      const analyses = await Promise.all(
        photos.map(photo => this.analyzePhoto(photo.url))
      );

      const validAnalyses = analyses.filter(a => a !== null) as PhotoAnalysis[];
      
      // Create smart albums based on patterns
      const smartAlbums: SmartAlbum[] = [];

      // People-based albums
      const peopleMap = new Map<string, string[]>();
      validAnalyses.forEach(analysis => {
        analysis.people.forEach(person => {
          if (!peopleMap.has(person.name)) {
            peopleMap.set(person.name, []);
          }
          peopleMap.get(person.name)!.push(analysis.id);
        });
      });

      peopleMap.forEach((photoIds, personName) => {
        if (photoIds.length >= 3) { // Only create albums for people appearing in 3+ photos
          smartAlbums.push({
            id: `people-${personName.toLowerCase().replace(/\s+/g, '-')}`,
            name: `${personName}`,
            description: `Photos featuring ${personName}`,
            type: 'people',
            criteria: { people: [personName] },
            photoCount: photoIds.length,
            autoUpdate: true,
            createdDate: new Date()
          });
        }
      });

      // Location-based albums
      const locationMap = new Map<string, string[]>();
      validAnalyses.forEach(analysis => {
        if (analysis.location) {
          const locationName = analysis.location.name;
          if (!locationMap.has(locationName)) {
            locationMap.set(locationName, []);
          }
          locationMap.get(locationName)!.push(analysis.id);
        }
      });

      locationMap.forEach((photoIds, locationName) => {
        if (photoIds.length >= 2) {
          smartAlbums.push({
            id: `location-${locationName.toLowerCase().replace(/\s+/g, '-')}`,
            name: locationName,
            description: `Photos taken at ${locationName}`,
            type: 'location',
            criteria: { location: locationName },
            photoCount: photoIds.length,
            autoUpdate: true,
            createdDate: new Date()
          });
        }
      });

      // Quality-based albums
      const highQualityPhotos = validAnalyses
        .filter(a => a.quality >= 85)
        .map(a => a.id);

      if (highQualityPhotos.length >= 5) {
        smartAlbums.push({
          id: 'quality-high',
          name: 'Best Quality',
          description: 'Highest quality photos in your collection',
          type: 'quality',
          criteria: { quality: { min: 85, max: 100 } },
          photoCount: highQualityPhotos.length,
          autoUpdate: true,
          createdDate: new Date()
        });
      }

      // Time-based albums (recent photos)
      const recentPhotos = photos
        .filter(photo => {
          const uploadDate = new Date(photo.name.includes('_') ? 
            photo.name.split('_')[1].split('.')[0] : Date.now().toString());
          const daysDiff = (Date.now() - uploadDate.getTime()) / (1000 * 60 * 60 * 24);
          return daysDiff <= 30; // Photos from last 30 days
        })
        .map(p => p.id);

      if (recentPhotos.length >= 5) {
        smartAlbums.push({
          id: 'time-recent',
          name: 'Recent Photos',
          description: 'Photos from the last 30 days',
          type: 'time',
          criteria: { 
            dateRange: { 
              start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), 
              end: new Date() 
            } 
          },
          photoCount: recentPhotos.length,
          autoUpdate: true,
          createdDate: new Date()
        });
      }

      return smartAlbums;
    } catch (error) {
      console.error('Failed to create smart albums:', error);
      return [];
    }
  }

  async detectDuplicates(
    photos: Array<{ id: string; url: string; name: string }>
  ): Promise<Array<{
    photoId: string;
    duplicates: Array<{ photoId: string; similarity: number }>;
  }>> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      const duplicateResults = [];

      for (let i = 0; i < photos.length; i++) {
        const photo1 = photos[i];
        const duplicates = [];

        for (let j = i + 1; j < photos.length; j++) {
          const photo2 = photos[j];

          // Use Z.AI to compare images for similarity
          const comparisonPrompt = `
            Compare these two images and determine if they are duplicates or very similar.
            Provide a similarity score from 0 to 1, where 1 means identical.
            Also provide a brief explanation of the differences.

            Image 1: ${photo1.name}
            Image 2: ${photo2.name}

            Respond in JSON format:
            {
              "similarity": 0.85,
              "explanation": "Images are very similar with minor differences in lighting"
            }
          `;

          const response = await this.zai.chat.completions.create({
            messages: [
              {
                role: 'user',
                content: [
                  {
                    type: 'text',
                    text: comparisonPrompt
                  },
                  {
                    type: 'image_url',
                    image_url: {
                      url: photo1.url
                    }
                  },
                  {
                    type: 'image_url',
                    image_url: {
                      url: photo2.url
                    }
                  }
                ]
              }
            ],
            model: 'glm-45v',
            max_tokens: 500
          });

          const resultText = response.choices[0]?.message?.content;
          if (resultText) {
            const result = JSON.parse(resultText);
            
            if (result.similarity > 0.8) { // 80% similarity threshold
              duplicates.push({
                photoId: photo2.id,
                similarity: result.similarity
              });
            }
          }
        }

        if (duplicates.length > 0) {
          duplicateResults.push({
            photoId: photo1.id,
            duplicates
          });
        }
      }

      return duplicateResults;
    } catch (error) {
      console.error('Failed to detect duplicates:', error);
      return [];
    }
  }

  async suggestTags(
    imageUrl: string,
    existingTags: string[] = []
  ): Promise<string[]> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      const prompt = `
        Analyze this image and suggest relevant tags for organization and search.
        Consider objects, people, locations, events, moods, colors, and styles.
        Avoid duplicating these existing tags: ${existingTags.join(', ')}
        
        Provide 10-15 relevant tags in JSON array format:
        ["tag1", "tag2", "tag3"]
      `;

      const response = await this.zai.chat.completions.create({
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: prompt
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageUrl
                }
              }
            ]
          }
        ],
        model: 'glm-45v',
        max_tokens: 200
      });

      const resultText = response.choices[0]?.message?.content;
      if (resultText) {
        return JSON.parse(resultText);
      }

      return [];
    } catch (error) {
      console.error('Failed to suggest tags:', error);
      return [];
    }
  }

  async enhancePhotoMetadata(
    photo: { id: string; url: string; name: string; existingTags?: string[] }
  ): Promise<{
    enhancedTags: string[];
    improvedQuality: number;
    suggestedAlbums: string[];
    location?: string;
    people?: string[];
  }> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      const analysis = await this.analyzePhoto(photo.url, {
        enableFaceRecognition: true,
        enableLocationDetection: true,
        enableQualityAssessment: true,
        autoTag: true
      });

      if (!analysis) {
        return {
          enhancedTags: [],
          improvedQuality: 50,
          suggestedAlbums: []
        };
      }

      // Get additional tag suggestions
      const suggestedTags = await this.suggestTags(photo.url, photo.existingTags || []);
      
      // Combine and deduplicate tags
      const allTags = [...new Set([...analysis.tags, ...suggestedTags])];

      return {
        enhancedTags: allTags,
        improvedQuality: analysis.quality,
        suggestedAlbums: analysis.suggestedAlbums,
        location: analysis.location?.name,
        people: analysis.people.map(p => p.name)
      };
    } catch (error) {
      console.error('Failed to enhance photo metadata:', error);
      return {
        enhancedTags: [],
        improvedQuality: 50,
        suggestedAlbums: []
      };
    }
  }
}

// React hook for AI Image Organizer
export function useAIImageOrganizer() {
  const [service] = useState(() => new AIImageOrganizerService());
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<{
    smartAlbums: SmartAlbum[];
    duplicateGroups: Array<{
      photoId: string;
      duplicates: Array<{ photoId: string; similarity: number }>;
    }>;
    tagSuggestions: Map<string, string[]>;
  }>({
    smartAlbums: [],
    duplicateGroups: [],
    tagSuggestions: new Map()
  });

  const organizePhotos = useCallback(async (
    photos: Array<{
      id: string;
      url: string;
      name: string;
      file?: File;
    }>,
    options?: {
      enableFaceRecognition?: boolean;
      enableLocationDetection?: boolean;
      enableEventDetection?: boolean;
      enableQualityAssessment?: boolean;
      createSmartAlbums?: boolean;
      autoTag?: boolean;
    }
  ) => {
    try {
      setIsProcessing(true);
      setError(null);
      
      const result = await service.organizePhotos(photos, options);
      
      if (!result.success) {
        setError(result.error || 'Organization failed');
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, [service]);

  const createSmartAlbum = useCallback(async (
    photos: Array<{ id: string; url: string; name: string }>
  ) => {
    try {
      setIsProcessing(true);
      setError(null);
      
      const smartAlbums = await service.createSmartAlbums(photos);
      setSuggestions(prev => ({ ...prev, smartAlbums }));
      
      return smartAlbums;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Smart album creation failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, [service]);

  const analyzePhoto = useCallback(async (imageUrl: string) => {
    try {
      return await service.analyzePhoto(imageUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Photo analysis failed');
      throw err;
    }
  }, [service]);

  const detectDuplicates = useCallback(async (
    photos: Array<{ id: string; url: string; name: string }>
  ) => {
    try {
      setIsProcessing(true);
      setError(null);
      
      const duplicates = await service.detectDuplicates(photos);
      setSuggestions(prev => ({ ...prev, duplicateGroups: duplicates }));
      
      return duplicates;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Duplicate detection failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, [service]);

  const suggestTags = useCallback(async (imageUrl: string, existingTags: string[] = []) => {
    try {
      const tags = await service.suggestTags(imageUrl, existingTags);
      return tags;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Tag suggestion failed');
      throw err;
    }
  }, [service]);

  const enhancePhotoMetadata = useCallback(async (
    photo: { id: string; url: string; name: string; existingTags?: string[] }
  ) => {
    try {
      return await service.enhancePhotoMetadata(photo);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Metadata enhancement failed');
      throw err;
    }
  }, [service]);

  return {
    service,
    isProcessing,
    error,
    suggestions,
    organizePhotos,
    createSmartAlbum,
    analyzePhoto,
    detectDuplicates,
    suggestTags,
    enhancePhotoMetadata
  };
}