import ZAI from 'z-ai-web-dev-sdk';

export interface AIModel {
  id: string;
  name: string;
  description: string;
  capabilities: string[];
  maxTokens: number;
  supportsVision: boolean;
  supportsCode: boolean;
  supportsMultimodal: boolean;
}

export interface AIRequest {
  prompt: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
  context?: string[];
  image?: string; // Base64 encoded image
}

export interface AIResponse {
  content: string;
  model: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  confidence?: number;
  metadata?: Record<string, any>;
}

export class AIService {
  private zai: any = null;
  private isInitialized = false;

  // Available AI Models
  public static readonly MODELS: AIModel[] = [
    {
      id: 'glm-4.5v',
      name: 'GLM-4.5V',
      description: 'Advanced vision and spatial reasoning model',
      capabilities: ['image-analysis', 'visual-reasoning', 'multimodal', 'code-generation'],
      maxTokens: 8192,
      supportsVision: true,
      supportsCode: true,
      supportsMultimodal: true,
    },
    {
      id: 'glm-4.5-flagship',
      name: 'GLM-4.5 Flagship',
      description: 'Superintelligence with universal comprehension',
      capabilities: ['text-generation', 'reasoning', 'code-generation', 'analysis', 'translation'],
      maxTokens: 16384,
      supportsVision: false,
      supportsCode: true,
      supportsMultimodal: false,
    },
    {
      id: 'glm-4.5-auto-think',
      name: 'GLM-4.5 Auto Think',
      description: 'Self-reflection and meta-cognition model',
      capabilities: ['self-reflection', 'meta-cognition', 'complex-reasoning', 'planning'],
      maxTokens: 8192,
      supportsVision: false,
      supportsCode: true,
      supportsMultimodal: false,
    },
    {
      id: 'air',
      name: 'AIR',
      description: 'Advanced intelligence reasoning and causal inference',
      capabilities: ['causal-reasoning', 'inference', 'analysis', 'prediction'],
      maxTokens: 8192,
      supportsVision: false,
      supportsCode: true,
      supportsMultimodal: false,
    },
    {
      id: 'glm-4.5-full-stack',
      name: 'GLM-4.5 Full Stack',
      description: 'Cross-domain integration expertise',
      capabilities: ['full-stack-development', 'system-design', 'architecture', 'integration'],
      maxTokens: 16384,
      supportsVision: false,
      supportsCode: true,
      supportsMultimodal: false,
    },
  ];

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      this.zai = await ZAI.create();
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize ZAI:', error);
      throw new Error('AI service initialization failed');
    }
  }

  async generateText(request: AIRequest): Promise<AIResponse> {
    await this.initialize();

    try {
      const model = request.model || 'glm-4.5-flagship';
      const messages = this.buildMessages(request);

      const completion = await this.zai.chat.completions.create({
        messages,
        model,
        temperature: request.temperature || 0.7,
        max_tokens: request.maxTokens || 2048,
      });

      return {
        content: completion.choices[0]?.message?.content || '',
        model,
        usage: {
          promptTokens: completion.usage?.prompt_tokens || 0,
          completionTokens: completion.usage?.completion_tokens || 0,
          totalTokens: completion.usage?.total_tokens || 0,
        },
        confidence: this.calculateConfidence(completion),
        metadata: {
          timestamp: new Date().toISOString(),
          modelInfo: AIService.MODELS.find(m => m.id === model),
        },
      };
    } catch (error) {
      console.error('AI generation error:', error);
      throw new Error('Failed to generate AI response');
    }
  }

  async analyzeImage(imageBase64: string, prompt?: string): Promise<AIResponse> {
    await this.initialize();

    try {
      const messages = [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: prompt || 'Analyze this image in detail.',
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`,
              },
            },
          ],
        },
      ];

      const completion = await this.zai.chat.completions.create({
        messages,
        model: 'glm-4.5v',
        temperature: 0.3,
        max_tokens: 2048,
      });

      return {
        content: completion.choices[0]?.message?.content || '',
        model: 'glm-4.5v',
        usage: {
          promptTokens: completion.usage?.prompt_tokens || 0,
          completionTokens: completion.usage?.completion_tokens || 0,
          totalTokens: completion.usage?.total_tokens || 0,
        },
        confidence: this.calculateConfidence(completion),
        metadata: {
          timestamp: new Date().toISOString(),
          analysisType: 'image_analysis',
        },
      };
    } catch (error) {
      console.error('Image analysis error:', error);
      throw new Error('Failed to analyze image');
    }
  }

  async generateCode(request: AIRequest & { language?: string }): Promise<AIResponse> {
    await this.initialize();

    const systemPrompt = `You are an expert programmer. Generate clean, efficient, and well-documented code${request.language ? ` in ${request.language}` : ''}. Include explanations and best practices.`;

    try {
      const messages = this.buildMessages({
        ...request,
        systemPrompt,
      });

      const model = request.model || 'glm-4.5-full-stack';
      const completion = await this.zai.chat.completions.create({
        messages,
        model,
        temperature: 0.2,
        max_tokens: 4096,
      });

      return {
        content: completion.choices[0]?.message?.content || '',
        model,
        usage: {
          promptTokens: completion.usage?.prompt_tokens || 0,
          completionTokens: completion.usage?.completion_tokens || 0,
          totalTokens: completion.usage?.total_tokens || 0,
        },
        confidence: this.calculateConfidence(completion),
        metadata: {
          timestamp: new Date().toISOString(),
          language: request.language,
          analysisType: 'code_generation',
        },
      };
    } catch (error) {
      console.error('Code generation error:', error);
      throw new Error('Failed to generate code');
    }
  }

  async ensembleAnalysis(
    request: AIRequest,
    models: string[] = ['glm-4.5-flagship', 'air', 'glm-4.5-auto-think']
  ): Promise<AIResponse[]> {
    const responses: AIResponse[] = [];

    for (const model of models) {
      try {
        const response = await this.generateText({
          ...request,
          model,
          temperature: 0.1, // Lower temperature for consistency
        });
        responses.push(response);
      } catch (error) {
        console.error(`Ensemble analysis failed for model ${model}:`, error);
      }
    }

    return responses;
  }

  private buildMessages(request: AIRequest): any[] {
    const messages: any[] = [];

    if (request.systemPrompt) {
      messages.push({
        role: 'system',
        content: request.systemPrompt,
      });
    }

    if (request.context) {
      for (const [index, context] of request.context.entries()) {
        messages.push({
          role: index % 2 === 0 ? 'user' : 'assistant',
          content: context,
        });
      }
    }

    messages.push({
      role: 'user',
      content: request.prompt,
    });

    return messages;
  }

  private calculateConfidence(completion: any): number {
    // Simple confidence calculation based on various factors
    const baseConfidence = 0.8;
    const usage = completion.usage;

    if (!usage) return baseConfidence;

    // Adjust confidence based on token usage
    const tokenRatio = usage.completion_tokens / usage.total_tokens;
    const tokenConfidence = Math.min(1, tokenRatio * 1.5);

    return Math.max(0.1, Math.min(1, baseConfidence + (tokenConfidence - 0.5) * 0.3));
  }

  getAvailableModels(): AIModel[] {
    return AIService.MODELS;
  }

  getModelById(id: string): AIModel | undefined {
    return AIService.MODELS.find(model => model.id === id);
  }
}

// Export singleton instance
export const aiService = new AIService();
