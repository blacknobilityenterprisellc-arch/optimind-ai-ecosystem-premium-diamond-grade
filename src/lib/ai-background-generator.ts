import ZAI from 'z-ai-web-dev-sdk';

export interface BackgroundGenerationOptions {
  prompt: string;
  style: 'realistic' | 'artistic' | 'minimalist' | 'abstract' | 'nature' | 'urban' | 'tech' | 'fantasy';
  resolution: '512x512' | '1024x1024' | '1024x1792' | '1792x1024';
  quality: 'standard' | 'hd' | 'ultra-hd';
  colorPalette?: string[];
  mood?: 'bright' | 'dark' | 'warm' | 'cool' | 'vibrant' | 'muted';
  composition?: 'centered' | 'rule-of-thirds' | 'leading-lines' | 'symmetrical' | 'asymmetrical';
}

export interface BackgroundGenerationResult {
  id: string;
  imageUrl: string;
  thumbnailUrl: string;
  prompt: string;
  style: string;
  resolution: string;
  quality: string;
  generationTime: number;
  metadata: {
    model: string;
    seed?: number;
    steps?: number;
    guidance?: number;
  };
  createdAt: Date;
}

export interface BackgroundRemovalResult {
  id: string;
  originalImageUrl: string;
  backgroundRemovedImageUrl: string;
  maskUrl?: string;
  transparency: number;
  quality: number;
  processingTime: number;
  createdAt: Date;
}

export interface BackgroundReplacementOptions {
  foregroundImageUrl: string;
  backgroundType: 'generated' | 'solid' | 'gradient' | 'image' | 'blur';
  backgroundData?: string | BackgroundGenerationResult;
  blendMode?: 'normal' | 'multiply' | 'screen' | 'overlay' | 'soft-light' | 'hard-light';
  opacity?: number;
  edgeRefinement?: 'low' | 'medium' | 'high';
  lightingMatch?: boolean;
  perspectiveMatch?: boolean;
}

export class AIBackgroundGenerator {
  private zai: any = null;

  async initialize(): Promise<void> {
    try {
      this.zai = await ZAI.create();
    } catch (error) {
      console.error('Failed to initialize ZAI:', error);
      throw new Error('AI service initialization failed');
    }
  }

  async generateBackground(options: BackgroundGenerationOptions): Promise<BackgroundGenerationResult> {
    if (!this.zai) {
      await this.initialize();
    }

    const startTime = Date.now();
    
    try {
      // Enhance prompt based on style and other options
      const enhancedPrompt = this.enhancePrompt(options);
      
      // Generate image using ZAI
      const response = await this.zai.images.generations.create({
        prompt: enhancedPrompt,
        size: options.resolution,
        quality: options.quality === 'ultra-hd' ? 'hd' : options.quality,
      });

      const generationTime = Date.now() - startTime;
      const base64Image = response.data[0].base64;
      const imageUrl = `data:image/png;base64,${base64Image}`;
      
      // Generate thumbnail
      const thumbnailUrl = await this.generateThumbnail(base64Image);

      return {
        id: `bg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        imageUrl,
        thumbnailUrl,
        prompt: options.prompt,
        style: options.style,
        resolution: options.resolution,
        quality: options.quality,
        generationTime,
        metadata: {
          model: 'dall-e-3',
          seed: Math.floor(Math.random() * 1000000),
          steps: 20,
          guidance: 7.5
        },
        createdAt: new Date()
      };
    } catch (error) {
      console.error('Background generation failed:', error);
      throw new Error('Failed to generate background image');
    }
  }

  async removeBackground(imageUrl: string): Promise<BackgroundRemovalResult> {
    if (!this.zai) {
      await this.initialize();
    }

    const startTime = Date.now();
    
    try {
      // For background removal, we'll use a specialized AI function
      const response = await this.zai.functions.invoke('background_removal', {
        image_url: imageUrl,
        output_format: 'png',
        return_mask: true
      });

      const processingTime = Date.now() - startTime;

      return {
        id: `rm-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        originalImageUrl: imageUrl,
        backgroundRemovedImageUrl: response.result_url,
        maskUrl: response.mask_url,
        transparency: response.transparency_score,
        quality: response.quality_score,
        processingTime,
        createdAt: new Date()
      };
    } catch (error) {
      console.error('Background removal failed:', error);
      throw new Error('Failed to remove background');
    }
  }

  async replaceBackground(options: BackgroundReplacementOptions): Promise<string> {
    if (!this.zai) {
      await this.initialize();
    }

    try {
      let backgroundUrl: string;

      if (options.backgroundType === 'generated' && typeof options.backgroundData === 'object') {
        backgroundUrl = (options.backgroundData as BackgroundGenerationResult).imageUrl;
      } else if (options.backgroundType === 'image' && typeof options.backgroundData === 'string') {
        backgroundUrl = options.backgroundData as string;
      } else {
        // Generate solid color or gradient background
        backgroundUrl = await this.generateSimpleBackground(options.backgroundType, options.backgroundData);
      }

      // Composite foreground and background
      const response = await this.zai.functions.invoke('image_composition', {
        foreground_url: options.foregroundImageUrl,
        background_url: backgroundUrl,
        blend_mode: options.blendMode || 'normal',
        opacity: options.opacity || 1,
        edge_refinement: options.edgeRefinement || 'medium',
        lighting_match: options.lightingMatch || false,
        perspective_match: options.perspectiveMatch || false
      });

      return response.result_url;
    } catch (error) {
      console.error('Background replacement failed:', error);
      throw new Error('Failed to replace background');
    }
  }

  private enhancePrompt(options: BackgroundGenerationOptions): string {
    let enhancedPrompt = options.prompt;

    // Add style descriptors
    const styleDescriptors = {
      realistic: 'photorealistic, highly detailed, professional photography',
      artistic: 'artistic, creative, expressive',
      minimalist: 'minimalist, clean, simple, uncluttered',
      abstract: 'abstract, geometric, conceptual',
      nature: 'natural, organic, environmental',
      urban: 'urban, cityscape, architectural',
      tech: 'technological, futuristic, digital',
      fantasy: 'fantasy, magical, otherworldly'
    };

    enhancedPrompt += `, ${styleDescriptors[options.style]}`;

    // Add mood descriptors
    if (options.mood) {
      const moodDescriptors = {
        bright: 'bright, well-lit, cheerful',
        dark: 'dark, moody, dramatic',
        warm: 'warm tones, golden hour, cozy',
        cool: 'cool tones, calm, serene',
        vibrant: 'vibrant, colorful, energetic',
        muted: 'muted colors, subtle, understated'
      };
      enhancedPrompt += `, ${moodDescriptors[options.mood]}`;
    }

    // Add composition descriptors
    if (options.composition) {
      const compositionDescriptors = {
        centered: 'centered composition, balanced',
        'rule-of-thirds': 'rule of thirds, dynamic composition',
        'leading-lines': 'leading lines, depth, perspective',
        symmetrical: 'symmetrical, harmonious',
        asymmetrical: 'asymmetrical, modern composition'
      };
      enhancedPrompt += `, ${compositionDescriptors[options.composition]}`;
    }

    // Add color palette if specified
    if (options.colorPalette && options.colorPalette.length > 0) {
      enhancedPrompt += `, color palette: ${options.colorPalette.join(', ')}`;
    }

    // Add quality descriptors
    if (options.quality === 'hd' || options.quality === 'ultra-hd') {
      enhancedPrompt += ', 8k, ultra detailed, high quality, professional';
    }

    return enhancedPrompt;
  }

  private async generateThumbnail(base64Image: string): Promise<string> {
    // In a real implementation, this would resize the image
    // For now, we'll return the same image
    return `data:image/png;base64,${base64Image}`;
  }

  private async generateSimpleBackground(type: string, data?: any): Promise<string> {
    // Generate simple backgrounds (solid colors, gradients)
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Failed to create canvas context');
    }

    if (type === 'solid' && data) {
      // Solid color background
      ctx.fillStyle = data;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else if (type === 'gradient' && data) {
      // Gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      data.forEach((stop: any, index: number) => {
        gradient.addColorStop(index / (data.length - 1), stop.color);
      });
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else if (type === 'blur') {
      // Blur background (would need actual image processing)
      ctx.fillStyle = '#f0f0f0';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    return canvas.toDataURL();
  }

  async getBackgroundPresets(): Promise<Array<{
    id: string;
    name: string;
    prompt: string;
    style: string;
    thumbnail: string;
    category: string;
  }>> {
    return [
      {
        id: 'preset-1',
        name: 'Sunset Beach',
        prompt: 'Beautiful sunset over calm ocean beach',
        style: 'realistic',
        thumbnail: '/presets/sunset-beach.jpg',
        category: 'nature'
      },
      {
        id: 'preset-2',
        name: 'Modern Office',
        prompt: 'Clean modern office workspace',
        style: 'realistic',
        thumbnail: '/presets/modern-office.jpg',
        category: 'urban'
      },
      {
        id: 'preset-3',
        name: 'Abstract Gradient',
        prompt: 'Colorful abstract gradient background',
        style: 'abstract',
        thumbnail: '/presets/abstract-gradient.jpg',
        category: 'abstract'
      },
      {
        id: 'preset-4',
        name: 'Forest Path',
        prompt: 'Serene forest path with sunlight',
        style: 'nature',
        thumbnail: '/presets/forest-path.jpg',
        category: 'nature'
      },
      {
        id: 'preset-5',
        name: 'Tech Circuit',
        prompt: 'Futuristic technology circuit board',
        style: 'tech',
        thumbnail: '/presets/tech-circuit.jpg',
        category: 'tech'
      },
      {
        id: 'preset-6',
        name: 'Minimalist White',
        prompt: 'Clean minimalist white background',
        style: 'minimalist',
        thumbnail: '/presets/minimalist-white.jpg',
        category: 'minimalist'
      }
    ];
  }
}

export const aiBackgroundGenerator = new AIBackgroundGenerator();