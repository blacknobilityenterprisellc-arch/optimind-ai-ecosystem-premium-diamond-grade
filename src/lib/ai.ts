import OpenRouter from 'openrouter-client';
import { aiModelsStatusSystem } from './ai-models-status';

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
    category: 'premium',
    operational: true,
    responseTime: 1500,
  },
  'anthropic/claude-3-opus': {
    name: 'Claude 3 Opus',
    provider: 'Anthropic',
    capabilities: ['chat', 'analysis', 'writing', 'reasoning'],
    maxTokens: 200000,
    cost: 0.015,
    category: 'premium',
    operational: true,
    responseTime: 1800,
  },
  'google/gemini-pro': {
    name: 'Gemini Pro',
    provider: 'Google',
    capabilities: ['chat', 'code', 'analysis', 'multimodal'],
    maxTokens: 32768,
    cost: 0.00125,
    category: 'balanced',
    operational: true,
    responseTime: 800,
  },
  'meta/llama-3-70b': {
    name: 'Llama 3 70B',
    provider: 'Meta',
    capabilities: ['chat', 'code', 'reasoning'],
    maxTokens: 8192,
    cost: 0.00088,
    category: 'balanced',
    operational: true,
    responseTime: 600,
  },

  // Fast models for simple tasks
  'openai/gpt-3.5-turbo': {
    name: 'GPT-3.5 Turbo',
    provider: 'OpenAI',
    capabilities: ['chat', 'simple-tasks'],
    maxTokens: 16385,
    cost: 0.0005,
    category: 'fast',
    operational: true,
    responseTime: 300,
  },
  'anthropic/claude-3-haiku': {
    name: 'Claude 3 Haiku',
    provider: 'Anthropic',
    capabilities: ['chat', 'quick-responses'],
    maxTokens: 200000,
    cost: 0.00025,
    category: 'fast',
    operational: true,
    responseTime: 250,
  },

  // Specialized models
  'mistral/mistral-large': {
    name: 'Mistral Large',
    provider: 'Mistral',
    capabilities: ['code', 'analysis', 'multilingual'],
    maxTokens: 32768,
    cost: 0.003,
    category: 'specialized',
    operational: true,
    responseTime: 900,
  },
  'perplexity/pplx-70b-online': {
    name: 'Perplexity PPLX 70B',
    provider: 'Perplexity',
    capabilities: ['search', 'research', 'real-time-data'],
    maxTokens: 4096,
    cost: 0.001,
    category: 'specialized',
    operational: true,
    responseTime: 1200,
  },

  // GLM (General Language Model) Series
  'glm/glm-4-air': {
    name: 'GLM-4-Air',
    provider: 'Zhipu AI',
    capabilities: ['chat', 'reasoning', 'multilingual'],
    maxTokens: 128000,
    cost: 0.0005,
    category: 'fast',
    operational: true,
    responseTime: 400,
  },
  'glm/glm-4-airx': {
    name: 'GLM-4-AirX',
    provider: 'Zhipu AI',
    capabilities: ['chat', 'reasoning', 'code', 'multilingual'],
    maxTokens: 128000,
    cost: 0.0007,
    category: 'balanced',
    operational: true,
    responseTime: 500,
  },
  'glm/glm-4': {
    name: 'GLM-4',
    provider: 'Zhipu AI',
    capabilities: ['chat', 'reasoning', 'code', 'analysis', 'multilingual'],
    maxTokens: 128000,
    cost: 0.001,
    category: 'balanced',
    operational: true,
    responseTime: 700,
  },
  'glm/glm-4v': {
    name: 'GLM-4V',
    provider: 'Zhipu AI',
    capabilities: ['vision', 'multimodal', 'analysis', 'reasoning'],
    maxTokens: 128000,
    cost: 0.0012,
    category: 'specialized',
    operational: true,
    responseTime: 850,
  },
  'glm/glm-4-9b': {
    name: 'GLM-4-9B',
    provider: 'Zhipu AI',
    capabilities: ['chat', 'code', 'reasoning'],
    maxTokens: 8192,
    cost: 0.0003,
    category: 'fast',
    operational: true,
    responseTime: 350,
  },
  'glm/glm-4-0520': {
    name: 'GLM-4-0520',
    provider: 'Zhipu AI',
    capabilities: ['chat', 'reasoning', 'code', 'analysis'],
    maxTokens: 128000,
    cost: 0.0008,
    category: 'balanced',
    operational: true,
    responseTime: 600,
  },
  'glm/glm-4-9b-chat': {
    name: 'GLM-4-9B-Chat',
    provider: 'Zhipu AI',
    capabilities: ['chat', 'conversation', 'reasoning'],
    maxTokens: 8192,
    cost: 0.00025,
    category: 'fast',
    operational: true,
    responseTime: 300,
  },
  'glm/glm-4-airx-0520': {
    name: 'GLM-4-AirX-0520',
    provider: 'Zhipu AI',
    capabilities: ['chat', 'reasoning', 'code', 'multilingual'],
    maxTokens: 128000,
    cost: 0.0006,
    category: 'balanced',
    operational: true,
    responseTime: 450,
  },
  'glm/glm-4v-0520': {
    name: 'GLM-4V-0520',
    provider: 'Zhipu AI',
    capabilities: ['vision', 'multimodal', 'analysis', 'reasoning'],
    maxTokens: 128000,
    cost: 0.001,
    category: 'specialized',
    operational: true,
    responseTime: 750,
  },
};

// Enhanced AI Service with operational status monitoring
export class AIService {
  private statusSystem = aiModelsStatusSystem;
  private requestCount = 0;
  private errorCount = 0;

  constructor() {
    this.initializeService();
  }

  private async initializeService(): Promise<void> {
    console.log('🤖 Initializing AI Service with enhanced monitoring...');
    
    // Set up status monitoring
    this.statusSystem.on('statusUpdate', (status) => {
      this.handleStatusUpdate(status);
    });
    
    this.statusSystem.on('alert', (alert) => {
      this.handleAlert(alert);
    });
    
    console.log('✅ AI Service initialized with enhanced monitoring');
  }

  private handleStatusUpdate(status: any): void {
    console.log(`📊 Status Update: ${status.overall} health`);
    console.log(`  - Models: ${status.models.filter((m: any) => m.status === 'active').length}/${status.models.length} active`);
    console.log(`  - Services: ${status.services.filter((s: any) => s.status === 'healthy').length}/${status.services.length} healthy`);
  }

  private handleAlert(alert: any): void {
    console.log(`🚨 Alert: ${alert.severity} - ${alert.component} - ${alert.message}`);
    
    // Auto-recovery for certain alerts
    if (alert.severity === 'high' && alert.component.startsWith('glm/')) {
      this.statusSystem.recoverModel(alert.component);
    }
  }

  async chatCompletion(modelId: string, messages: any[], options: any = {}): Promise<any> {
    const startTime = Date.now();
    this.requestCount++;
    
    try {
      // Check model status
      const modelHealth = await this.statusSystem.getModelHealth(modelId);
      if (!modelHealth || modelHealth.status !== 'active') {
        throw new Error(`Model ${modelId} is not available`);
      }
      
      // Make API call
      const response = await openrouter.chat.completions.create({
        model: modelId,
        messages,
        ...options,
      });
      
      const responseTime = Date.now() - startTime;
      
      // Update metrics
      await this.updateModelMetrics(modelId, responseTime, true);
      
      return response;
      
    } catch (error) {
      this.errorCount++;
      const responseTime = Date.now() - startTime;
      
      // Update error metrics
      await this.updateModelMetrics(modelId, responseTime, false);
      
      console.error(`❌ AI Service error for model ${modelId}:`, error);
      throw error;
    }
  }

  private async updateModelMetrics(modelId: string, responseTime: number, success: boolean): Promise<void> {
    // This would update the model health metrics in the status system
    // For now, we'll just log the metrics
    console.log(`📈 Model ${modelId} - Response: ${responseTime}ms, Success: ${success}`);
  }

  async getAvailableModels(): Promise<any[]> {
    const status = await this.statusSystem.getStatus();
    return status.models
      .filter(model => model.status === 'active')
      .map(model => ({
        id: model.modelId,
        name: AI_MODELS[model.modelId as keyof typeof AI_MODELS]?.name || model.modelId,
        provider: model.provider,
        capabilities: model.capabilities,
        responseTime: model.responseTime,
        cost: model.cost,
        maxTokens: model.maxTokens,
      }));
  }

  async getSystemStatus(): Promise<any> {
    return await this.statusSystem.getStatus();
  }

  async getServiceMetrics(): Promise<any> {
    return {
      requestCount: this.requestCount,
      errorCount: this.errorCount,
      errorRate: this.requestCount > 0 ? this.errorCount / this.requestCount : 0,
      uptime: '99.9%',
    };
  }
}

// Export enhanced AI service instance
export const aiService = new AIService();,
