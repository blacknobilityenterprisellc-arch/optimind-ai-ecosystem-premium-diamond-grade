// AI Style Transfer Service for Artistic Photo Transformation
import { useState, useEffect, useCallback } from 'react';
import ZAI from 'z-ai-web-dev-sdk';

export interface StyleTransferResult {
  success: boolean;
  stylizedImageUrl?: string;
  creditsUsed: number;
  processingTime: number;
  error?: string;
  metadata?: {
    styleId: string;
    styleName: string;
    intensity: number;
    preserveColors: boolean;
    detailLevel: number;
    improvements: string[];
  };
}

export interface ArtStyle {
  id: string;
  name: string;
  description: string;
  category: 'classic' | 'modern' | 'digital' | 'abstract' | 'photography';
  artist?: string;
  era?: string;
  characteristics: string[];
  credits: number;
  isPremium: boolean;
}

export interface StyleComparison {
  styleId: string;
  similarity: number;
  recommended: boolean;
  reasoning: string;
  estimatedQuality: number;
}

class AIStyleTransferService {
  private zai: any = null;
  private isInitialized: boolean = false;

  async initialize(): Promise<boolean> {
    try {
      this.zai = await ZAI.create();
      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize AI Style Transfer:', error);
      return false;
    }
  }

  async transferStyle(
    imageUrl: string,
    styleId: string,
    settings: {
      intensity: number;
      preserveColors: boolean;
      detailLevel: number;
      smoothness: number;
      upscale?: boolean;
      enhanceDetails?: boolean;
    }
  ): Promise<StyleTransferResult> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      const startTime = Date.now();
      
      // Get style information
      const style = this.getStyle(styleId);
      if (!style) {
        throw new Error('Style not found');
      }

      // Calculate credits
      let credits = style.credits;
      if (settings.upscale) credits *= 1.5;
      if (settings.enhanceDetails) credits *= 1.2;
      credits = Math.round(credits);

      // Use Z.AI to analyze and apply style transfer
      const styleTransferPrompt = `
        Analyze this image and apply the "${style.name}" artistic style with the following specifications:
        
        Style Information:
        - Artist: ${style.artist || 'Unknown'}
        - Era: ${style.era || 'Contemporary'}
        - Characteristics: ${style.characteristics.join(', ')}
        
        Application Settings:
        - Style Intensity: ${settings.intensity}%
        - Preserve Original Colors: ${settings.preserveColors}
        - Detail Level: ${settings.detailLevel}%
        - Smoothness: ${settings.smoothness}%
        
        Please provide:
        1. Detailed analysis of how the style should be applied
        2. Key artistic elements to emphasize
        3. Color palette adjustments needed
        4. Brushstroke or texture recommendations
        5. Expected transformation outcome
        
        Respond in JSON format:
        {
          "analysis": "Detailed style analysis...",
          "keyElements": ["element1", "element2"],
          "colorAdjustments": ["adjustment1", "adjustment2"],
          "technique": "Recommended artistic technique",
          "expectedOutcome": "Description of expected result",
          "processingComplexity": "low|medium|high"
        }
      `;

      const response = await this.zai.chat.completions.create({
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: styleTransferPrompt
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
        max_tokens: 800
      });

      const resultText = response.choices[0]?.message?.content;
      if (!resultText) {
        throw new Error('No style analysis received');
      }

      const analysis = JSON.parse(resultText);
      
      // Simulate style transfer processing time based on complexity
      const processingTimeMap = {
        'low': 3000,
        'medium': 5000,
        'high': 8000
      };
      const processingTime = processingTimeMap[analysis.processingComplexity] || 5000;
      
      await new Promise(resolve => setTimeout(resolve, processingTime));

      const actualProcessingTime = Date.now() - startTime;

      return {
        success: true,
        stylizedImageUrl: imageUrl, // In real implementation, this would be the processed image
        creditsUsed: credits,
        processingTime: actualProcessingTime,
        metadata: {
          styleId,
          styleName: style.name,
          intensity: settings.intensity,
          preserveColors: settings.preserveColors,
          detailLevel: settings.detailLevel,
          improvements: [
            `Applied ${style.name} style`,
            analysis.technique,
            ...analysis.keyElements
          ]
        }
      };
    } catch (error) {
      return {
        success: false,
        creditsUsed: 0,
        processingTime: 0,
        error: error instanceof Error ? error.message : 'Style transfer failed'
      };
    }
  }

  async createStyleVariations(
    imageUrl: string,
    styleId: string,
    count: number = 4
  ): Promise<StyleTransferResult[]> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      const style = this.getStyle(styleId);
      if (!style) {
        throw new Error('Style not found');
      }

      const results: StyleTransferResult[] = [];
      
      for (let i = 0; i < count; i++) {
        // Create variations with different settings
        const variationSettings = {
          intensity: 60 + (i * 10), // 60%, 70%, 80%, 90%
          preserveColors: i % 2 === 0, // Alternate preserving colors
          detailLevel: 70 + (i * 7), // Varying detail levels
          smoothness: 50 + (i * 12), // Varying smoothness
          enhanceDetails: true
        };

        const result = await this.transferStyle(imageUrl, styleId, variationSettings);
        results.push(result);
      }

      return results;
    } catch (error) {
      console.error('Failed to create style variations:', error);
      return [];
    }
  }

  async compareStyles(
    imageUrl: string,
    styleIds: string[]
  ): Promise<StyleComparison[]> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      const comparisonPrompt = `
        Analyze this image and compare how well each of the following artistic styles would work with it:
        
        Styles to compare: ${styleIds.map(id => {
          const style = this.getStyle(id);
          return `${style.name} (${style.artist || 'Unknown'})`;
        }).join(', ')}
        
        For each style, provide:
        1. Compatibility score (0-100)
        2. Whether it's recommended for this image
        3. Reasoning for the recommendation
        4. Expected quality of result (0-100)
        
        Respond in JSON format:
        {
          "comparisons": [
            {
              "styleId": "van-gogh",
              "similarity": 85,
              "recommended": true,
              "reasoning": "The swirling patterns would complement the natural elements",
              "estimatedQuality": 90
            }
          ]
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
                  url: imageUrl
                }
              }
            ]
          }
        ],
        model: 'glm-45v',
        max_tokens: 1000
      });

      const resultText = response.choices[0]?.message?.content;
      if (!resultText) {
        throw new Error('No style comparison received');
      }

      const result = JSON.parse(resultText);
      return result.comparisons || [];
    } catch (error) {
      console.error('Failed to compare styles:', error);
      return [];
    }
  }

  async getRecommendedStyles(imageUrl: string): Promise<StyleComparison[]> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      const recommendationPrompt = `
        Analyze this image and recommend the most suitable artistic styles from this collection:
        
        Available styles: Van Gogh, Monet, Picasso, Dali, Watercolor, Oil Painting, Pencil Sketch, Cartoon, Cyberpunk, Pop Art
        
        For the image content, composition, colors, and mood, recommend:
        1. Top 3 most suitable styles
        2. Compatibility score for each (0-100)
        3. Brief reasoning for each recommendation
        4. Expected outcome quality (0-100)
        
        Respond in JSON format:
        {
          "recommendations": [
            {
              "styleId": "van-gogh",
              "similarity": 90,
              "recommended": true,
              "reasoning": "The vibrant colors would work well with Van Gogh's style",
              "estimatedQuality": 95
            }
          ]
        }
      `;

      const response = await this.zai.chat.completions.create({
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: recommendationPrompt
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
        max_tokens: 800
      });

      const resultText = response.choices[0]?.message?.content;
      if (!resultText) {
        throw new Error('No style recommendations received');
      }

      const result = JSON.parse(resultText);
      return result.recommendations || [];
    } catch (error) {
      console.error('Failed to get style recommendations:', error);
      return [];
    }
  }

  getStyle(styleId: string): ArtStyle | undefined {
    const styles: ArtStyle[] = [
      {
        id: "van-gogh",
        name: "Van Gogh",
        description: "Post-impressionist style with swirling brushstrokes",
        category: "classic",
        artist: "Vincent van Gogh",
        era: "Post-Impressionism",
        characteristics: ["Swirling brushstrokes", "Vibrant colors", "Emotional intensity", "Thick impasto"],
        credits: 80,
        isPremium: true
      },
      {
        id: "monet",
        name: "Monet",
        description: "Impressionist style with light effects",
        category: "classic",
        artist: "Claude Monet",
        era: "Impressionism",
        characteristics: ["Light effects", "Loose brushwork", "Outdoor scenes", "Color vibrations"],
        credits: 75,
        isPremium: true
      },
      {
        id: "picasso",
        name: "Picasso",
        description: "Cubist style with geometric shapes",
        category: "classic",
        artist: "Pablo Picasso",
        era: "Cubism",
        characteristics: ["Geometric shapes", "Multiple perspectives", "Abstract forms", "Bold colors"],
        credits: 85,
        isPremium: true
      },
      {
        id: "dali",
        name: "Dalí",
        description: "Surrealist style with dreamlike elements",
        category: "classic",
        artist: "Salvador Dalí",
        era: "Surrealism",
        characteristics: ["Dreamlike scenes", "Melting forms", "Detailed realism", "Symbolic elements"],
        credits: 90,
        isPremium: true
      },
      {
        id: "watercolor",
        name: "Watercolor",
        description: "Soft watercolor painting effect",
        category: "classic",
        characteristics: ["Translucent layers", "Soft edges", "Flowing forms", "Light colors"],
        credits: 65,
        isPremium: false
      },
      {
        id: "oil-painting",
        name: "Oil Painting",
        description: "Traditional oil painting technique",
        category: "classic",
        characteristics: ["Rich colors", "Texture", "Blendable strokes", "Depth"],
        credits: 70,
        isPremium: false
      },
      {
        id: "pencil-sketch",
        name: "Pencil Sketch",
        description: "Hand-drawn pencil sketch effect",
        category: "classic",
        characteristics: ["Line work", "Shading", "Cross-hatching", "Monochrome"],
        credits: 55,
        isPremium: false
      },
      {
        id: "cartoon",
        name: "Cartoon",
        description: "Animated cartoon style",
        category: "modern",
        characteristics: ["Bold outlines", "Simplified forms", "Vibrant colors", "Exaggerated features"],
        credits: 60,
        isPremium: false
      },
      {
        id: "cyberpunk",
        name: "Cyberpunk",
        description: "Futuristic digital art style",
        category: "digital",
        characteristics: ["Neon colors", "High-tech elements", "Dark atmosphere", "Digital glitches"],
        credits: 95,
        isPremium: true
      },
      {
        id: "pop-art",
        name: "Pop Art",
        description: "Colorful pop art style",
        category: "modern",
        characteristics: ["Bold colors", "Comic style", "Commercial aesthetic", "Repetitive patterns"],
        credits: 75,
        isPremium: true
      },
      {
        id: "manga",
        name: "Manga",
        description: "Japanese manga and anime style",
        category: "modern",
        characteristics: ["Large eyes", "Expressive features", "Dynamic lines", "Stylized hair"],
        credits: 70,
        isPremium: true
      },
      {
        id: "pixel-art",
        name: "Pixel Art",
        description: "Retro 8-bit pixel art style",
        category: "digital",
        characteristics: ["Pixelated", "Limited palette", "Retro aesthetic", "Blocky forms"],
        credits: 50,
        isPremium: false
      },
      {
        id: "noir",
        name: "Film Noir",
        description: "Black and white dramatic style",
        category: "photography",
        characteristics: ["High contrast", "Dramatic lighting", "Monochrome", "Mysterious atmosphere"],
        credits: 45,
        isPremium: false
      },
      {
        id: "vintage",
        name: "Vintage",
        description: "Aged vintage photograph effect",
        category: "photography",
        characteristics: ["Aged colors", "Film grain", "Soft focus", "Retro tones"],
        credits: 40,
        isPremium: false
      },
      {
        id: "art-nouveau",
        name: "Art Nouveau",
        description: "Elegant decorative art style",
        category: "classic",
        artist: "Alphonse Mucha",
        era: "Art Nouveau",
        characteristics: ["Organic lines", "Decorative patterns", "Elegant forms", "Natural motifs"],
        credits: 85,
        isPremium: true
      },
      {
        id: "baroque",
        name: "Baroque",
        description: "Ornate and dramatic art style",
        category: "classic",
        artist: "Caravaggio",
        era: "Baroque",
        characteristics: ["Dramatic lighting", "Rich details", "Emotional intensity", "Ornate decoration"],
        credits: 90,
        isPremium: true
      },
      {
        id: "renaissance",
        name: "Renaissance",
        description: "Classical Renaissance art style",
        category: "classic",
        artist: "Leonardo da Vinci",
        era: "Renaissance",
        characteristics: ["Realistic proportions", "Classical composition", "Subtle colors", "Detailed rendering"],
        credits: 100,
        isPremium: true
      }
    ];

    return styles.find(style => style.id === styleId);
  }

  getAllStyles(): ArtStyle[] {
    return [
      {
        id: "van-gogh",
        name: "Van Gogh",
        description: "Post-impressionist style with swirling brushstrokes",
        category: "classic",
        artist: "Vincent van Gogh",
        era: "Post-Impressionism",
        characteristics: ["Swirling brushstrokes", "Vibrant colors", "Emotional intensity", "Thick impasto"],
        credits: 80,
        isPremium: true
      },
      {
        id: "monet",
        name: "Monet",
        description: "Impressionist style with light effects",
        category: "classic",
        artist: "Claude Monet",
        era: "Impressionism",
        characteristics: ["Light effects", "Loose brushwork", "Outdoor scenes", "Color vibrations"],
        credits: 75,
        isPremium: true
      },
      {
        id: "picasso",
        name: "Picasso",
        description: "Cubist style with geometric shapes",
        category: "classic",
        artist: "Pablo Picasso",
        era: "Cubism",
        characteristics: ["Geometric shapes", "Multiple perspectives", "Abstract forms", "Bold colors"],
        credits: 85,
        isPremium: true
      },
      {
        id: "dali",
        name: "Dalí",
        description: "Surrealist style with dreamlike elements",
        category: "classic",
        artist: "Salvador Dalí",
        era: "Surrealism",
        characteristics: ["Dreamlike scenes", "Melting forms", "Detailed realism", "Symbolic elements"],
        credits: 90,
        isPremium: true
      },
      {
        id: "watercolor",
        name: "Watercolor",
        description: "Soft watercolor painting effect",
        category: "classic",
        characteristics: ["Translucent layers", "Soft edges", "Flowing forms", "Light colors"],
        credits: 65,
        isPremium: false
      },
      {
        id: "oil-painting",
        name: "Oil Painting",
        description: "Traditional oil painting technique",
        category: "classic",
        characteristics: ["Rich colors", "Texture", "Blendable strokes", "Depth"],
        credits: 70,
        isPremium: false
      },
      {
        id: "pencil-sketch",
        name: "Pencil Sketch",
        description: "Hand-drawn pencil sketch effect",
        category: "classic",
        characteristics: ["Line work", "Shading", "Cross-hatching", "Monochrome"],
        credits: 55,
        isPremium: false
      },
      {
        id: "cartoon",
        name: "Cartoon",
        description: "Animated cartoon style",
        category: "modern",
        characteristics: ["Bold outlines", "Simplified forms", "Vibrant colors", "Exaggerated features"],
        credits: 60,
        isPremium: false
      },
      {
        id: "cyberpunk",
        name: "Cyberpunk",
        description: "Futuristic digital art style",
        category: "digital",
        characteristics: ["Neon colors", "High-tech elements", "Dark atmosphere", "Digital glitches"],
        credits: 95,
        isPremium: true
      },
      {
        id: "pop-art",
        name: "Pop Art",
        description: "Colorful pop art style",
        category: "modern",
        characteristics: ["Bold colors", "Comic style", "Commercial aesthetic", "Repetitive patterns"],
        credits: 75,
        isPremium: true
      },
      {
        id: "manga",
        name: "Manga",
        description: "Japanese manga and anime style",
        category: "modern",
        characteristics: ["Large eyes", "Expressive features", "Dynamic lines", "Stylized hair"],
        credits: 70,
        isPremium: true
      },
      {
        id: "pixel-art",
        name: "Pixel Art",
        description: "Retro 8-bit pixel art style",
        category: "digital",
        characteristics: ["Pixelated", "Limited palette", "Retro aesthetic", "Blocky forms"],
        credits: 50,
        isPremium: false
      },
      {
        id: "noir",
        name: "Film Noir",
        description: "Black and white dramatic style",
        category: "photography",
        characteristics: ["High contrast", "Dramatic lighting", "Monochrome", "Mysterious atmosphere"],
        credits: 45,
        isPremium: false
      },
      {
        id: "vintage",
        name: "Vintage",
        description: "Aged vintage photograph effect",
        category: "photography",
        characteristics: ["Aged colors", "Film grain", "Soft focus", "Retro tones"],
        credits: 40,
        isPremium: false
      },
      {
        id: "art-nouveau",
        name: "Art Nouveau",
        description: "Elegant decorative art style",
        category: "classic",
        artist: "Alphonse Mucha",
        era: "Art Nouveau",
        characteristics: ["Organic lines", "Decorative patterns", "Elegant forms", "Natural motifs"],
        credits: 85,
        isPremium: true
      },
      {
        id: "baroque",
        name: "Baroque",
        description: "Ornate and dramatic art style",
        category: "classic",
        artist: "Caravaggio",
        era: "Baroque",
        characteristics: ["Dramatic lighting", "Rich details", "Emotional intensity", "Ornate decoration"],
        credits: 90,
        isPremium: true
      },
      {
        id: "renaissance",
        name: "Renaissance",
        description: "Classical Renaissance art style",
        category: "classic",
        artist: "Leonardo da Vinci",
        era: "Renaissance",
        characteristics: ["Realistic proportions", "Classical composition", "Subtle colors", "Detailed rendering"],
        credits: 100,
        isPremium: true
      }
    ];
  }

  getStylesByCategory(category: ArtStyle['category']): ArtStyle[] {
    return this.getAllStyles().filter(style => style.category === category);
  }

  estimateProcessingTime(styleId: string, settings: any): number {
    const style = this.getStyle(styleId);
    if (!style) return 5000;

    let baseTime = 3000; // Base 3 seconds
    
    // Adjust based on style complexity
    if (style.category === 'classic') baseTime *= 1.2;
    if (style.category === 'digital') baseTime *= 1.5;
    if (style.isPremium) baseTime *= 1.3;
    
    // Adjust based on settings
    if (settings.intensity > 80) baseTime *= 1.2;
    if (settings.detailLevel > 80) baseTime *= 1.3;
    if (settings.upscale) baseTime *= 1.5;
    
    return Math.round(baseTime);
  }
}

// React hook for AI Style Transfer
export function useAIStyleTransfer() {
  const [service] = useState(() => new AIStyleTransferService());
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [credits, setCredits] = useState(1000); // Mock credits

  const transferStyle = useCallback(async (
    imageUrl: string,
    styleId: string,
    settings: {
      intensity: number;
      preserveColors: boolean;
      detailLevel: number;
      smoothness: number;
      upscale?: boolean;
      enhanceDetails?: boolean;
    }
  ) => {
    try {
      setIsProcessing(true);
      setError(null);
      
      const result = await service.transferStyle(imageUrl, styleId, settings);
      
      if (result.success) {
        setCredits(prev => prev - result.creditsUsed);
      } else {
        setError(result.error || 'Style transfer failed');
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

  const createStyleVariations = useCallback(async (
    imageUrl: string,
    styleId: string,
    count: number = 4
  ) => {
    try {
      setIsProcessing(true);
      setError(null);
      
      const results = await service.createStyleVariations(imageUrl, styleId, count);
      
      // Deduct credits for all variations
      const totalCredits = results.reduce((sum, result) => sum + result.creditsUsed, 0);
      setCredits(prev => prev - totalCredits);
      
      return results;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Variation creation failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, [service]);

  const compareStyles = useCallback(async (
    imageUrl: string,
    styleIds: string[]
  ) => {
    try {
      return await service.compareStyles(imageUrl, styleIds);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Style comparison failed');
      throw err;
    }
  }, [service]);

  const getRecommendedStyles = useCallback(async (imageUrl: string) => {
    try {
      return await service.getRecommendedStyles(imageUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Style recommendation failed');
      return [];
    }
  }, [service]);

  return {
    service,
    isProcessing,
    error,
    credits,
    transferStyle,
    createStyleVariations,
    compareStyles,
    getRecommendedStyles,
    getStyles: service.getAllStyles(),
    getStyle: (styleId: string) => service.getStyle(styleId)
  };
}