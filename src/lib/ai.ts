import OpenRouter from 'openrouter-client';

// Initialize Open Router client
const openrouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY || '',
  baseURL: process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1',
});

// Available AI models with their capabilities and costs
export const AI_MODELS = {
  // High-performance models
  'openai/gpt-4-turbo': {
    name: 'GPT-4 Turbo',
    provider: 'OpenAI',
    capabilities: ['chat', 'code', 'reasoning', 'creativity'],
    maxTokens: 128000,
    cost: 0.01,
    category: 'premium'
  },
  'anthropic/claude-3-opus': {
    name: 'Claude 3 Opus',
    provider: 'Anthropic',
    capabilities: ['chat', 'analysis', 'writing', 'reasoning'],
    maxTokens: 200000,
    cost: 0.015,
    category: 'premium'
  },
  'google/gemini-pro': {
    name: 'Gemini Pro',
    provider: 'Google',
    capabilities: ['chat', 'code', 'analysis', 'multimodal'],
    maxTokens: 32768,
    cost: 0.00125,
    category: 'balanced'
  },
  'meta/llama-3-70b': {
    name: 'Llama 3 70B',
    provider: 'Meta',
    capabilities: ['chat', 'code', 'reasoning'],
    maxTokens: 8192,
    cost: 0.00088,
    category: 'balanced'
  },
  
  // Fast models for simple tasks
  'openai/gpt-3.5-turbo': {
    name: 'GPT-3.5 Turbo',
    provider: 'OpenAI',
    capabilities: ['chat', 'simple-tasks'],
    maxTokens: 16385,
    cost: 0.0005,
    category: 'fast'
  },
  'anthropic/claude-3-haiku': {
    name: 'Claude 3 Haiku',
    provider: 'Anthropic',
    capabilities: ['chat', 'quick-responses'],
    maxTokens: 200000,
    cost: 0.00025,
    category: 'fast'
  },
  
  // Specialized models
  'mistral/mistral-large': {
    name: 'Mistral Large',
    provider: 'Mistral',
    capabilities: ['code', 'analysis', 'multilingual'],
    maxTokens: 32768,
    cost: 0.003,
    category: 'specialized'
  },
  'perplexity/pplx-70b-online': {
    name: 'Perplexity PPLX 70B',
    provider: 'Perplexity',
    capabilities: ['search', 'research', 'real-time-data'],
    maxTokens: 4096,
    cost: 0.001,
    category: 'specialized'
  },

  // GLM (General Language Model) Series
  'glm/glm-4-air': {
    name: 'GLM-4-Air',
    provider: 'Zhipu AI',
    capabilities: ['chat', 'reasoning', 'multilingual'],
    maxTokens: 128000,
    cost: 0.0005,
    category: 'fast'
  },
  'glm/glm-4-airx': {
    name: 'GLM-4-AirX',
    provider: 'Zhipu AI',
    capabilities: ['chat', 'reasoning', 'code', 'multilingual'],
    maxTokens: 128000,
    cost: 0.0007,
    category: 'balanced'
  },
  'glm/glm-4': {
    name: 'GLM-4',
    provider: 'Zhipu AI',
    capabilities: ['chat', 'reasoning', 'code', 'analysis', 'multilingual'],
    maxTokens: 128000,
    cost: 0.001,
    category: 'balanced'
  },
  'glm/glm-4-plus': {
    name: 'GLM-4-Plus',
    provider: 'Zhipu AI',
    capabilities: ['chat', 'reasoning', 'code', 'analysis', 'creativity', 'multilingual'],
    maxTokens: 128000,
    cost: 0.002,
    category: 'premium'
  },
  'glm/glm-4-0520': {
    name: 'GLM-4-0520',
    provider: 'Zhipu AI',
    capabilities: ['chat', 'reasoning', 'code', 'analysis', 'multilingual'],
    maxTokens: 128000,
    cost: 0.0012,
    category: 'balanced'
  },
  'glm/glm-4-0521': {
    name: 'GLM-4-0521',
    provider: 'Zhipu AI',
    capabilities: ['chat', 'reasoning', 'code', 'analysis', 'multilingual'],
    maxTokens: 128000,
    cost: 0.0012,
    category: 'balanced'
  },
  'glm/glm-4-0620': {
    name: 'GLM-4-0620',
    provider: 'Zhipu AI',
    capabilities: ['chat', 'reasoning', 'code', 'analysis', 'creativity', 'multilingual'],
    maxTokens: 128000,
    cost: 0.0015,
    category: 'premium'
  },
  'glm/glm-4-long': {
    name: 'GLM-4-Long',
    provider: 'Zhipu AI',
    capabilities: ['chat', 'reasoning', 'analysis', 'long-context', 'multilingual'],
    maxTokens: 1000000,
    cost: 0.0025,
    category: 'specialized'
  },
  'glm/glm-4-long-c': {
    name: 'GLM-4-Long-C',
    provider: 'Zhipu AI',
    capabilities: ['chat', 'reasoning', 'analysis', 'long-context', 'multilingual'],
    maxTokens: 1000000,
    cost: 0.0025,
    category: 'specialized'
  },
  'glm/glm-4v': {
    name: 'GLM-4V',
    provider: 'Zhipu AI',
    capabilities: ['chat', 'reasoning', 'vision', 'multimodal', 'multilingual'],
    maxTokens: 128000,
    cost: 0.0018,
    category: 'specialized'
  },
  'glm/glm-4v-plus': {
    name: 'GLM-4V-Plus',
    provider: 'Zhipu AI',
    capabilities: ['chat', 'reasoning', 'vision', 'multimodal', 'creativity', 'multilingual'],
    maxTokens: 128000,
    cost: 0.0022,
    category: 'premium'
  },
  'glm/glm-z1-avg': {
    name: 'GLM-Z1-Avg',
    provider: 'Zhipu AI',
    capabilities: ['chat', 'reasoning', 'code', 'multilingual'],
    maxTokens: 8192,
    cost: 0.0008,
    category: 'fast'
  },
  'glm/glm-z1-preview': {
    name: 'GLM-Z1-Preview',
    provider: 'Zhipu AI',
    capabilities: ['chat', 'reasoning', 'code', 'analysis', 'multilingual'],
    maxTokens: 32768,
    cost: 0.001,
    category: 'balanced'
  },
  'glm/glm-zero-preview': {
    name: 'GLM-Zero-Preview',
    provider: 'Zhipu AI',
    capabilities: ['chat', 'reasoning', 'code', 'analysis', 'multilingual'],
    maxTokens: 32768,
    cost: 0.0011,
    category: 'balanced'
  },
  'glm/glm-zero1': {
    name: 'GLM-Zero1',
    provider: 'Zhipu AI',
    capabilities: ['chat', 'reasoning', 'code', 'analysis', 'multilingual'],
    maxTokens: 32768,
    cost: 0.001,
    category: 'balanced'
  },
  'glm/glm-zero1-preview': {
    name: 'GLM-Zero1-Preview',
    provider: 'Zhipu AI',
    capabilities: ['chat', 'reasoning', 'code', 'analysis', 'multilingual'],
    maxTokens: 32768,
    cost: 0.0011,
    category: 'balanced'
  },
  'glm/glm-rd': {
    name: 'GLM-RD',
    provider: 'Zhipu AI',
    capabilities: ['chat', 'reasoning', 'research', 'multilingual'],
    maxTokens: 32768,
    cost: 0.0013,
    category: 'specialized'
  },
  'glm/glm-rd-plus': {
    name: 'GLM-RD-Plus',
    provider: 'Zhipu AI',
    capabilities: ['chat', 'reasoning', 'research', 'analysis', 'multilingual'],
    maxTokens: 32768,
    cost: 0.0016,
    category: 'premium'
  },
  'glm/glm-3-turbo': {
    name: 'GLM-3-Turbo',
    provider: 'Zhipu AI',
    capabilities: ['chat', 'simple-tasks', 'multilingual'],
    maxTokens: 128000,
    cost: 0.0004,
    category: 'fast'
  },
  'glm/glm-3-turbo-plus': {
    name: 'GLM-3-Turbo-Plus',
    provider: 'Zhipu AI',
    capabilities: ['chat', 'reasoning', 'multilingual'],
    maxTokens: 128000,
    cost: 0.0006,
    category: 'fast'
  },
  'glm/glm-130b': {
    name: 'GLM-130B',
    provider: 'Zhipu AI',
    capabilities: ['chat', 'reasoning', 'analysis', 'multilingual'],
    maxTokens: 2048,
    cost: 0.0008,
    category: 'balanced'
  },
  'glm/chatglm3-6b': {
    name: 'ChatGLM3-6B',
    provider: 'Zhipu AI',
    capabilities: ['chat', 'simple-tasks', 'multilingual'],
    maxTokens: 8192,
    cost: 0.0003,
    category: 'fast'
  },
  'glm/chatglm3-6b-32k': {
    name: 'ChatGLM3-6B-32K',
    provider: 'Zhipu AI',
    capabilities: ['chat', 'simple-tasks', 'long-context', 'multilingual'],
    maxTokens: 32768,
    cost: 0.0004,
    category: 'fast'
  }
};

export interface AIRequest {
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

export interface AIResponse {
  content: string;
  model: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  cost: number;
}

export interface ContentGenerationRequest {
  topic: string;
  contentType: 'blog' | 'article' | 'product-description' | 'social-media' | 'email' | 'documentation';
  tone: 'professional' | 'casual' | 'friendly' | 'formal' | 'enthusiastic';
  length: 'short' | 'medium' | 'long';
  keywords?: string[];
  targetAudience?: string;
}

export interface CodeAssistanceRequest {
  code: string;
  language: string;
  task: 'review' | 'optimize' | 'document' | 'debug' | 'generate-tests' | 'refactor';
  context?: string;
}

export interface TextEnhancementRequest {
  text: string;
  enhancement: 'grammar' | 'clarity' | 'professional' | 'creative' | 'concise' | 'expand';
  context?: string;
}

export interface SearchRequest {
  query: string;
  context?: string;
  type: 'general' | 'code' | 'research' | 'creative';
}

class AIService {
  private getModelForTask(task: string): string {
    const taskModelMap: Record<string, string> = {
      'content-generation': process.env.DEFAULT_CONTENT_MODEL || 'anthropic/claude-3-opus',
      'code-assistance': process.env.DEFAULT_CODE_MODEL || 'openai/gpt-4',
      'chat': process.env.DEFAULT_CHAT_MODEL || 'openai/gpt-4-turbo',
      'fast-response': process.env.DEFAULT_FAST_MODEL || 'openai/gpt-3.5-turbo',
      'analysis': 'anthropic/claude-3-opus',
      'research': 'perplexity/pplx-70b-online'
    };
    
    return taskModelMap[task] || process.env.DEFAULT_CHAT_MODEL || 'openai/gpt-4-turbo';
  }

  async chat(request: AIRequest): Promise<AIResponse> {
    try {
      const model = request.model || this.getModelForTask('chat');
      
      const response = await openrouter.chat.completions.create({
        model,
        messages: request.messages,
        temperature: request.temperature || 0.7,
        max_tokens: request.maxTokens || 1000,
        stream: request.stream || false,
      });

      const content = response.choices[0]?.message?.content || '';
      const usage = response.usage || { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 };
      const modelInfo = AI_MODELS[model as keyof typeof AI_MODELS];
      const cost = (usage.prompt_tokens * (modelInfo?.cost || 0.01) / 1000) + 
                   (usage.completion_tokens * (modelInfo?.cost || 0.01) / 1000);

      return {
        content,
        model,
        usage: {
          promptTokens: usage.prompt_tokens,
          completionTokens: usage.completion_tokens,
          totalTokens: usage.total_tokens
        },
        cost
      };
    } catch (error) {
      console.error('AI Chat Error:', error);
      throw new Error(`Failed to get AI response: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async generateContent(request: ContentGenerationRequest): Promise<AIResponse> {
    const systemPrompt = this.buildContentGenerationPrompt(request);
    
    return this.chat({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Generate ${request.contentType} about: ${request.topic}` }
      ],
      model: this.getModelForTask('content-generation'),
      temperature: 0.8,
      maxTokens: request.length === 'short' ? 500 : request.length === 'medium' ? 1000 : 2000
    });
  }

  async assistCode(request: CodeAssistanceRequest): Promise<AIResponse> {
    const systemPrompt = this.buildCodeAssistancePrompt(request);
    
    return this.chat({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Code:\n${request.code}\n\nTask: ${request.task}${request.context ? `\nContext: ${request.context}` : ''}` }
      ],
      model: this.getModelForTask('code-assistance'),
      temperature: 0.3,
      maxTokens: 1500
    });
  }

  async enhanceText(request: TextEnhancementRequest): Promise<AIResponse> {
    const systemPrompt = `You are an expert editor. Enhance the given text to make it more ${request.enhancement}. Maintain the original meaning while improving the quality.`;
    
    return this.chat({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Text to enhance: ${request.text}${request.context ? `\nContext: ${request.context}` : ''}` }
      ],
      model: this.getModelForTask('content-generation'),
      temperature: 0.6,
      maxTokens: 1000
    });
  }

  async smartSearch(request: SearchRequest): Promise<AIResponse> {
    const systemPrompt = this.buildSearchPrompt(request);
    
    return this.chat({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: request.query }
      ],
      model: request.type === 'research' ? 'perplexity/pplx-70b-online' : this.getModelForTask('chat'),
      temperature: 0.5,
      maxTokens: 1000
    });
  }

  async analyzeData(data: any, analysisType: string): Promise<AIResponse> {
    const systemPrompt = `You are a data analysis expert. Analyze the provided data and provide insights for: ${analysisType}. Include trends, patterns, and actionable recommendations.`;
    
    return this.chat({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: JSON.stringify(data, null, 2) }
      ],
      model: this.getModelForTask('analysis'),
      temperature: 0.4,
      maxTokens: 1500
    });
  }

  async getRecommendations(context: string, type: 'content' | 'products' | 'actions' | 'strategies'): Promise<AIResponse> {
    const systemPrompt = `You are an expert recommendation engine. Based on the provided context, generate personalized ${type} recommendations. Explain the reasoning behind each recommendation.`;
    
    return this.chat({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: context }
      ],
      model: this.getModelForTask('analysis'),
      temperature: 0.7,
      maxTokens: 1200
    });
  }

  private buildContentGenerationPrompt(request: ContentGenerationRequest): string {
    let prompt = `You are a professional ${request.contentType} writer. `;
    
    prompt += `Write in a ${request.tone} tone. `;
    prompt += `The content should be ${request.length} in length. `;
    
    if (request.targetAudience) {
      prompt += `Target audience: ${request.targetAudience}. `;
    }
    
    if (request.keywords && request.keywords.length > 0) {
      prompt += `Include these keywords naturally: ${request.keywords.join(', ')}. `;
    }
    
    prompt += `Create engaging, well-structured content that provides value to the reader.`;
    
    return prompt;
  }

  private buildCodeAssistancePrompt(request: CodeAssistanceRequest): string {
    const prompts = {
      review: 'Review the following code for bugs, performance issues, and best practices. Provide specific suggestions for improvement.',
      optimize: 'Optimize the following code for better performance and readability. Explain your changes.',
      document: 'Generate comprehensive documentation for the following code, including function descriptions, parameter explanations, and usage examples.',
      debug: 'Debug the following code. Identify any issues and provide corrected code with explanations.',
      'generate-tests': 'Generate comprehensive unit tests for the following code. Include various test cases and edge cases.',
      refactor: 'Refactor the following code to improve its structure, readability, and maintainability. Explain your refactoring decisions.'
    };
    
    return `You are an expert ${request.language} developer. ${prompts[request.task]}`;
  }

  private buildSearchPrompt(request: SearchRequest): string {
    const prompts = {
      general: 'You are a helpful assistant. Provide comprehensive and accurate information to answer the query.',
      code: 'You are a programming expert. Provide code examples and technical explanations to answer the query.',
      research: 'You are a research assistant. Provide detailed, well-researched information with citations and sources.',
      creative: 'You are a creative expert. Provide innovative and imaginative responses to the query.'
    };
    
    return prompts[request.type];
  }

  // Utility method to get model recommendations based on requirements
  getRecommendedModel(requirements: {
    task: string;
    complexity: 'simple' | 'medium' | 'complex';
    speed: 'fast' | 'balanced' | 'quality';
    budget: 'low' | 'medium' | 'high';
  }): string {
    const { task, complexity, speed, budget } = requirements;
    
    // Simple logic for model selection - can be enhanced
    if (speed === 'fast' && budget === 'low') {
      return 'openai/gpt-3.5-turbo';
    }
    
    if (complexity === 'complex' && budget === 'high') {
      return 'anthropic/claude-3-opus';
    }
    
    if (task.includes('code')) {
      return 'openai/gpt-4';
    }
    
    if (task.includes('research') || task.includes('search')) {
      return 'perplexity/pplx-70b-online';
    }
    
    return 'openai/gpt-4-turbo';
  }

  // Get cost estimate for a request
  getCostEstimate(model: string, estimatedTokens: number): number {
    const modelInfo = AI_MODELS[model as keyof typeof AI_MODELS];
    if (!modelInfo) return 0;
    
    return (estimatedTokens * modelInfo.cost) / 1000;
  }
}

export const aiService = new AIService();
export default aiService;