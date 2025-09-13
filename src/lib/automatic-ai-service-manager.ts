// OptiMind AI Ecosystem - Automatic AI Service Manager
// Seamlessly manages and switches between your AI services automatically

import { automaticAPIKeyIntegration } from './automatic-api-key-integration';

export interface AIServiceRequest {
  prompt: string;
  options?: {
    maxTokens?: number;
    temperature?: number;
    model?: string;
    timeout?: number;
    provider?: string;
  };
}

export interface AIServiceResponse {
  provider: string;
  model: string;
  response: any;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  timestamp: Date;
  success: boolean;
  error?: string;
}

export class AutomaticAIServiceManager {
  private static instance: AutomaticAIServiceManager;
  private requestHistory: AIServiceResponse[] = [];
  private performanceMetrics: Map<string, any> = new Map();
  private initialized = false;

  private constructor() {}

  public static getInstance(): AutomaticAIServiceManager {
    if (!AutomaticAIServiceManager.instance) {
      AutomaticAIServiceManager.instance = new AutomaticAIServiceManager();
    }
    return AutomaticAIServiceManager.instance;
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      console.log('🤖 Initializing Automatic AI Service Manager...');
      
      // Initialize the API key integration system
      await automaticAPIKeyIntegration.initialize();
      
      this.initialized = true;
      console.log('✅ Automatic AI Service Manager initialized successfully!');
      
    } catch (error) {
      console.error('❌ Failed to initialize Automatic AI Service Manager:', error);
      throw error;
    }
  }

  async makeRequest(request: AIServiceRequest): Promise<AIServiceResponse> {
    if (!this.initialized) {
      await this.initialize();
    }

    const startTime = Date.now();
    
    try {
      // Get the best available service or use specified provider
      let provider = request.options?.provider;
      if (!provider) {
        provider = await automaticAPIKeyIntegration.getBestAvailableService();
      }

      if (!provider) {
        throw new Error('No available AI services');
      }

      console.log(`🤖 Making AI request using ${provider}...`);

      // Make the API call
      const response = await automaticAPIKeyIntegration.makeAPICall(
        request.prompt,
        request.options
      );

      const endTime = Date.now();
      const duration = endTime - startTime;

      // Create response object
      const serviceResponse: AIServiceResponse = {
        provider,
        model: request.options?.model || 'default',
        response,
        usage: {
          promptTokens: response.usage?.prompt_tokens || 0,
          completionTokens: response.usage?.completion_tokens || 0,
          totalTokens: response.usage?.total_tokens || 0
        },
        timestamp: new Date(),
        success: true
      };

      // Update performance metrics
      this.updatePerformanceMetrics(provider, {
        requestCount: 1,
        totalTokens: serviceResponse.usage.totalTokens,
        averageResponseTime: duration,
        successRate: 1
      });

      // Add to request history
      this.requestHistory.push(serviceResponse);

      console.log(`✅ AI request completed successfully using ${provider}`);
      return serviceResponse;

    } catch (error) {
      const endTime = Date.now();
      const duration = endTime - startTime;

      // Create error response
      const errorResponse: AIServiceResponse = {
        provider: request.options?.provider || 'unknown',
        model: request.options?.model || 'default',
        response: null,
        usage: {
          promptTokens: 0,
          completionTokens: 0,
          totalTokens: 0
        },
        timestamp: new Date(),
        success: false,
        error: error.message
      };

      // Update performance metrics with failure
      const provider = request.options?.provider || 'unknown';
      this.updatePerformanceMetrics(provider, {
        requestCount: 1,
        totalTokens: 0,
        averageResponseTime: duration,
        successRate: 0
      });

      // Add to request history
      this.requestHistory.push(errorResponse);

      console.error(`❌ AI request failed using ${provider}:`, error.message);
      throw error;
    }
  }

  private updatePerformanceMetrics(provider: string, metrics: any): void {
    const existing = this.performanceMetrics.get(provider) || {
      requestCount: 0,
      totalTokens: 0,
      totalResponseTime: 0,
      successCount: 0,
      averageResponseTime: 0,
      successRate: 0
    };

    existing.requestCount += metrics.requestCount;
    existing.totalTokens += metrics.totalTokens;
    existing.totalResponseTime += metrics.averageResponseTime;
    existing.successCount += metrics.successRate;

    existing.averageResponseTime = existing.totalResponseTime / existing.requestCount;
    existing.successRate = existing.successCount / existing.requestCount;

    this.performanceMetrics.set(provider, existing);
  }

  async getBestProviderForTask(taskType: string): Promise<string | null> {
    const activeServices = automaticAPIKeyIntegration.getActiveServices();
    
    // Task-specific provider selection logic
    const taskProviderMapping: Record<string, string[]> = {
      'code_generation': ['zai', 'openrouter', 'openai'],
      'creative_writing': ['openrouter', 'anthropic', 'gemini'],
      'analysis': ['zai', 'gemini', 'openrouter'],
      'translation': ['gemini', 'openrouter'],
      'summarization': ['zai', 'openrouter', 'gemini'],
      'question_answering': ['zai', 'openrouter', 'gemini'],
      'general': ['zai', 'openrouter', 'gemini']
    };

    const preferredProviders = taskProviderMapping[taskType] || taskProviderMapping['general'];

    // Find the first available preferred provider
    for (const provider of preferredProviders) {
      if (activeServices.includes(provider)) {
        return provider;
      }
    }

    // Fallback to any available provider
    return activeServices.length > 0 ? activeServices[0] : null;
  }

  async makeSmartRequest(prompt: string, taskType: string = 'general', options?: any): Promise<AIServiceResponse> {
    const bestProvider = await this.getBestProviderForTask(taskType);
    
    return this.makeRequest({
      prompt,
      options: {
        ...options,
        provider: bestProvider || undefined
      }
    });
  }

  getPerformanceReport(): {
    totalRequests: number;
    successRate: number;
    averageResponseTime: number;
    totalTokensUsed: number;
    providerPerformance: Record<string, any>;
    requestHistory: AIServiceResponse[];
  } {
    const totalRequests = this.requestHistory.length;
    const successfulRequests = this.requestHistory.filter(r => r.success).length;
    const successRate = totalRequests > 0 ? successfulRequests / totalRequests : 0;
    
    const totalResponseTime = this.requestHistory.reduce((sum, r) => {
      return sum + (r.timestamp.getTime() - this.requestHistory[0]?.timestamp.getTime() || 0);
    }, 0);
    
    const averageResponseTime = totalRequests > 0 ? totalResponseTime / totalRequests : 0;
    
    const totalTokensUsed = this.requestHistory.reduce((sum, r) => sum + r.usage.totalTokens, 0);
    
    const providerPerformance: Record<string, any> = {};
    for (const [provider, metrics] of this.performanceMetrics) {
      providerPerformance[provider] = metrics;
    }

    return {
      totalRequests,
      successRate,
      averageResponseTime,
      totalTokensUsed,
      providerPerformance,
      requestHistory: this.requestHistory.slice(-100) // Last 100 requests
    };
  }

  getAvailableServices(): string[] {
    return automaticAPIKeyIntegration.getActiveServices();
  }

  getServiceStatus(provider: string): {
    enabled: boolean;
    apiKey?: string;
    model?: string;
    performance?: any;
  } {
    const serviceConfig = automaticAPIKeyIntegration.getServiceConfig(provider);
    const performance = this.performanceMetrics.get(provider);

    return {
      enabled: serviceConfig?.enabled || false,
      apiKey: serviceConfig?.apiKey,
      model: serviceConfig?.model,
      performance
    };
  }

  async testAllServices(): Promise<Record<string, boolean>> {
    const results: Record<string, boolean> = {};
    const activeServices = this.getAvailableServices();

    for (const provider of activeServices) {
      try {
        await this.makeRequest({
          prompt: 'Test message',
          options: {
            provider,
            maxTokens: 5,
            temperature: 0.1
          }
        });
        results[provider] = true;
        console.log(`✅ ${provider} service test successful`);
      } catch (error) {
        results[provider] = false;
        console.log(`❌ ${provider} service test failed: ${error.message}`);
      }
    }

    return results;
  }

  clearHistory(): void {
    this.requestHistory = [];
    this.performanceMetrics.clear();
    console.log('🗑️ Service manager history cleared');
  }
}

// Export singleton instance
export const automaticAIServiceManager = AutomaticAIServiceManager.getInstance();

// Auto-initialize on module load
if (typeof window === 'undefined') {
  // Server-side auto-initialization
  automaticAIServiceManager.initialize().catch(console.error);
}