// Open Router API Integration Service
// Provides access to 35+ AI models through Open Router

export interface OpenRouterModelConfig {
  id: string;
  name: string;
  apiModel: string;
  capabilities: string[];
  maxTokens: number;
  temperature: number;
  systemPrompt: string;
  provider: string;
  pricing: {
    input: number;
    output: number;
  };
}

export interface OpenRouterAnalysisRequest {
  prompt: string;
  modelId: string;
  imageBase64?: string;
  customSystemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface OpenRouterAnalysisResponse {
  modelId: string;
  modelName: string;
  result: any;
  confidence: number;
  processingTime: number;
  timestamp: Date;
  apiResponse: any;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

// Open Router Model Configurations
export const OPENROUTER_MODELS: OpenRouterModelConfig[] = [
  // OpenAI Models
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    apiModel: 'openai/gpt-4o',
    capabilities: ['multimodal', 'reasoning', 'coding', 'analysis'],
    maxTokens: 4096,
    temperature: 0.7,
    systemPrompt: 'You are GPT-4o, a highly capable AI assistant with multimodal reasoning abilities.',
    provider: 'OpenAI',
    pricing: { input: 0.0025, output: 0.01 }
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    apiModel: 'openai/gpt-4o-mini',
    capabilities: ['fast-response', 'coding', 'analysis', 'multimodal'],
    maxTokens: 4096,
    temperature: 0.7,
    systemPrompt: 'You are GPT-4o Mini, a fast and efficient AI assistant.',
    provider: 'OpenAI',
    pricing: { input: 0.00015, output: 0.0006 }
  },
  {
    id: 'o1-preview',
    name: 'O1 Preview',
    apiModel: 'openai/o1-preview',
    capabilities: ['advanced-reasoning', 'problem-solving', 'mathematics', 'science'],
    maxTokens: 32768,
    temperature: 1.0,
    systemPrompt: 'You are O1 Preview, an advanced reasoning model with exceptional problem-solving capabilities.',
    provider: 'OpenAI',
    pricing: { input: 0.015, output: 0.06 }
  },
  {
    id: 'o1-mini',
    name: 'O1 Mini',
    apiModel: 'openai/o1-mini',
    capabilities: ['reasoning', 'problem-solving', 'coding', 'analysis'],
    maxTokens: 65536,
    temperature: 1.0,
    systemPrompt: 'You are O1 Mini, a fast reasoning model with strong problem-solving abilities.',
    provider: 'OpenAI',
    pricing: { input: 0.003, output: 0.012 }
  },
  
  // Anthropic Models
  {
    id: 'claude-3.5-sonnet',
    name: 'Claude 3.5 Sonnet',
    apiModel: 'anthropic/claude-3.5-sonnet',
    capabilities: ['reasoning', 'coding', 'analysis', 'long-context'],
    maxTokens: 8192,
    temperature: 0.7,
    systemPrompt: 'You are Claude 3.5 Sonnet, an AI assistant with strong reasoning and coding capabilities.',
    provider: 'Anthropic',
    pricing: { input: 0.0003, output: 0.0015 }
  },
  {
    id: 'claude-3.5-haiku',
    name: 'Claude 3.5 Haiku',
    apiModel: 'anthropic/claude-3.5-haiku',
    capabilities: ['fast-response', 'coding', 'analysis', 'multimodal'],
    maxTokens: 8192,
    temperature: 0.7,
    systemPrompt: 'You are Claude 3.5 Haiku, a fast and efficient AI assistant.',
    provider: 'Anthropic',
    pricing: { input: 0.00001, output: 0.00005 }
  },
  {
    id: 'claude-3-opus',
    name: 'Claude 3 Opus',
    apiModel: 'anthropic/claude-3-opus',
    capabilities: ['advanced-reasoning', 'coding', 'analysis', 'creative-writing'],
    maxTokens: 8192,
    temperature: 0.7,
    systemPrompt: 'You are Claude 3 Opus, a highly capable AI assistant with advanced reasoning abilities.',
    provider: 'Anthropic',
    pricing: { input: 0.0025, output: 0.015 }
  },
  
  // Google Models
  {
    id: 'gemini-pro',
    name: 'Gemini Pro',
    apiModel: 'google/gemini-pro',
    capabilities: ['reasoning', 'coding', 'analysis', 'multimodal'],
    maxTokens: 8192,
    temperature: 0.7,
    systemPrompt: 'You are Gemini Pro, Google\'s advanced AI assistant with multimodal capabilities.',
    provider: 'Google',
    pricing: { input: 0.000125, output: 0.0005 }
  },
  {
    id: 'gemini-flash',
    name: 'Gemini Flash',
    apiModel: 'google/gemini-flash',
    capabilities: ['fast-response', 'coding', 'analysis', 'multimodal'],
    maxTokens: 8192,
    temperature: 0.7,
    systemPrompt: 'You are Gemini Flash, a fast and efficient AI assistant from Google.',
    provider: 'Google',
    pricing: { input: 0.00001875, output: 0.000075 }
  },
  
  // Meta Models
  {
    id: 'llama-3.1-70b',
    name: 'Llama 3.1 70B',
    apiModel: 'meta-llama/llama-3.1-70b',
    capabilities: ['reasoning', 'coding', 'analysis', 'conversation'],
    maxTokens: 8192,
    temperature: 0.7,
    systemPrompt: 'You are Llama 3.1 70B, Meta\'s advanced large language model.',
    provider: 'Meta',
    pricing: { input: 0.00088, output: 0.00088 }
  },
  {
    id: 'llama-3.1-8b',
    name: 'Llama 3.1 8B',
    apiModel: 'meta-llama/llama-3.1-8b',
    capabilities: ['fast-response', 'coding', 'analysis', 'conversation'],
    maxTokens: 8192,
    temperature: 0.7,
    systemPrompt: 'You are Llama 3.1 8B, a fast and efficient language model from Meta.',
    provider: 'Meta',
    pricing: { input: 0.00018, output: 0.00018 }
  },
  
  // Mistral Models
  {
    id: 'mistral-large',
    name: 'Mistral Large',
    apiModel: 'mistralai/mistral-large',
    capabilities: ['reasoning', 'coding', 'analysis', 'multilingual'],
    maxTokens: 8192,
    temperature: 0.7,
    systemPrompt: 'You are Mistral Large, an advanced language model with strong reasoning capabilities.',
    provider: 'Mistral',
    pricing: { input: 0.0003, output: 0.0006 }
  },
  {
    id: 'mixtral-8x7b',
    name: 'Mixtral 8x7B',
    apiModel: 'mistralai/mixtral-8x7b',
    capabilities: ['reasoning', 'coding', 'analysis', 'mixture-of-experts'],
    maxTokens: 8192,
    temperature: 0.7,
    systemPrompt: 'You are Mixtral 8x7B, a mixture-of-experts language model with strong reasoning capabilities.',
    provider: 'Mistral',
    pricing: { input: 0.00024, output: 0.00024 }
  },
  
  // Perplexity Models
  {
    id: 'llama-3.1-sonar-small',
    name: 'Llama 3.1 Sonar Small',
    apiModel: 'perplexity/llama-3.1-sonar-small',
    capabilities: ['search', 'reasoning', 'analysis', 'real-time-info'],
    maxTokens: 8192,
    temperature: 0.7,
    systemPrompt: 'You are Llama 3.1 Sonar Small, a search-optimized language model with real-time information access.',
    provider: 'Perplexity',
    pricing: { input: 0.0002, output: 0.0002 }
  },
  {
    id: 'llama-3.1-sonar-large',
    name: 'Llama 3.1 Sonar Large',
    apiModel: 'perplexity/llama-3.1-sonar-large',
    capabilities: ['search', 'reasoning', 'analysis', 'real-time-info'],
    maxTokens: 8192,
    temperature: 0.7,
    systemPrompt: 'You are Llama 3.1 Sonar Large, a powerful search-optimized language model with real-time information access.',
    provider: 'Perplexity',
    pricing: { input: 0.0012, output: 0.0012 }
  }
];

class OpenRouterService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.OPENROUTER_API_KEY || '';
    this.baseUrl = process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1';
    
    if (!this.apiKey) {
      console.warn('Open Router API key not found. Set OPENROUTER_API_KEY in your environment variables.');
    }
  }

  getAvailableModels(): OpenRouterModelConfig[] {
    return OPENROUTER_MODELS;
  }

  async analyzeWithModel(request: OpenRouterAnalysisRequest): Promise<OpenRouterAnalysisResponse> {
    if (!this.apiKey) {
      throw new Error('Open Router API key not configured');
    }

    const modelConfig = OPENROUTER_MODELS.find(m => m.id === request.modelId);
    if (!modelConfig) {
      throw new Error(`Model ${request.modelId} not found`);
    }

    const startTime = Date.now();
    
    try {
      const response = await this.callOpenRouterApi(request, modelConfig);
      const result = this.parseResponse(response);
      
      const processingTime = Date.now() - startTime;
      
      return {
        modelId: request.modelId,
        modelName: modelConfig.name,
        result,
        confidence: result.confidence || 0.8,
        processingTime,
        timestamp: new Date(),
        apiResponse: response,
        usage: {
          promptTokens: response.usage?.prompt_tokens || 0,
          completionTokens: response.usage?.completion_tokens || 0,
          totalTokens: response.usage?.total_tokens || 0
        }
      };
    } catch (error: any) {
      console.error(`Open Router analysis failed for model ${request.modelId}:`, error);
      throw new Error(`Open Router analysis failed: ${error?.message || 'Unknown error'}`);
    }
  }

  private async callOpenRouterApi(request: OpenRouterAnalysisRequest, modelConfig: OpenRouterModelConfig): Promise<any> {
    const messages = [];
    
    // Add system message
    messages.push({
      role: 'system',
      content: request.customSystemPrompt || modelConfig.systemPrompt
    });
    
    // Add user message
    const userContent: any[] = [request.prompt];
    
    // Add image if provided
    if (request.imageBase64) {
      userContent.push({
        type: 'image_url',
        image_url: {
          url: `data:image/jpeg;base64,${request.imageBase64}`
        }
      });
    }
    
    messages.push({
      role: 'user',
      content: userContent.length === 1 ? userContent[0] : userContent
    });

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://your-app-url.com', // Replace with your app URL
        'X-Title': 'AI Premium Photo Editor' // Replace with your app name
      },
      body: JSON.stringify({
        model: modelConfig.apiModel,
        messages,
        max_tokens: request.maxTokens || modelConfig.maxTokens,
        temperature: request.temperature || modelConfig.temperature,
        stream: false
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Open Router API error: ${response.status} - ${errorText}`);
    }

    return await response.json();
  }

  private parseResponse(response: any): any {
    const content = response.choices[0]?.message?.content || '{}';
    
    try {
      return JSON.parse(content);
    } catch (error) {
      console.warn('Failed to parse JSON response from Open Router, returning raw content:', error);
      return {
        rawResponse: content,
        confidence: 0.7,
        parsed: false
      };
    }
  }

  async getModelInfo(modelId: string): Promise<OpenRouterModelConfig | null> {
    return OPENROUTER_MODELS.find(m => m.id === modelId) || null;
  }

  async testModelConnection(modelId: string): Promise<boolean> {
    try {
      if (!this.apiKey) {
        return false;
      }

      const modelConfig = OPENROUTER_MODELS.find(m => m.id === modelId);
      if (!modelConfig) return false;

      // Test with a simple prompt
      const response = await this.callOpenRouterApi({
        prompt: 'Test connection - please respond with "Connection successful"',
        modelId
      }, modelConfig);

      const content = response.choices[0]?.message?.content || '';
      return content.toLowerCase().includes('successful');
    } catch (error) {
      console.error(`Open Router model connection test failed for ${modelId}:`, error);
      return false;
    }
  }

  async getAvailableModelsFromAPI(): Promise<any[]> {
    try {
      if (!this.apiKey) {
        throw new Error('Open Router API key not configured');
      }

      const response = await fetch(`${this.baseUrl}/models`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch models: ${response.status}`);
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Failed to fetch models from Open Router API:', error);
      return [];
    }
  }

  async estimateCost(modelId: string, promptTokens: number, completionTokens: number): Promise<number> {
    const modelConfig = OPENROUTER_MODELS.find(m => m.id === modelId);
    if (!modelConfig) {
      throw new Error(`Model ${modelId} not found`);
    }

    const inputCost = (promptTokens / 1000) * modelConfig.pricing.input;
    const outputCost = (completionTokens / 1000) * modelConfig.pricing.output;
    
    return inputCost + outputCost;
  }
}

// Export singleton instance
export const openRouterService = new OpenRouterService();