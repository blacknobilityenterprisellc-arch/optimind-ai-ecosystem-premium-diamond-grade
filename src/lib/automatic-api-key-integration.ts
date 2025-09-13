// OptiMind AI Ecosystem - Automatic API Key Integration System
// This system automatically detects and integrates your API keys for seamless AI service usage

import { config } from 'dotenv';

// Load environment variables
config();

// Try to import ZAI SDK, but handle gracefully if not available
let ZAI: any = null;
try {
  const zaiModule = require('z-ai-web-dev-sdk');
  ZAI = zaiModule.default || zaiModule;
} catch (error) {
  console.log('⚠️ ZAI SDK not available, continuing without it');
}

export interface APIKeyConfiguration {
  provider: string;
  key: string;
  status: 'active' | 'inactive' | 'expired';
  lastValidated: Date;
  usageCount: number;
  rateLimit: number;
  permissions: string[];
}

export interface ServiceConfiguration {
  name: string;
  enabled: boolean;
  apiKey?: string;
  baseUrl?: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
  timeout?: number;
}

export class AutomaticAPIKeyIntegration {
  private static instance: AutomaticAPIKeyIntegration;
  private apiKeys: Map<string, APIKeyConfiguration> = new Map();
  private services: Map<string, ServiceConfiguration> = new Map();
  private zai: any = null;
  private initialized = false;

  private constructor() {}

  public static getInstance(): AutomaticAPIKeyIntegration {
    if (!AutomaticAPIKeyIntegration.instance) {
      AutomaticAPIKeyIntegration.instance = new AutomaticAPIKeyIntegration();
    }
    return AutomaticAPIKeyIntegration.instance;
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      console.log('🚀 Initializing Automatic API Key Integration System...');
      
      // Initialize ZAI SDK if available
      if (ZAI) {
        try {
          this.zai = await ZAI.create();
          console.log('✅ ZAI SDK initialized successfully');
        } catch (error) {
          console.log('⚠️ Failed to initialize ZAI SDK, continuing without it');
        }
      }
      
      // Auto-detect API keys from environment
      await this.detectAPIKeys();
      
      // Auto-configure services
      await this.configureServices();
      
      // Validate API keys
      await this.validateAPIKeys();
      
      this.initialized = true;
      console.log('✅ Automatic API Key Integration System initialized successfully!');
      
    } catch (error) {
      console.error('❌ Failed to initialize Automatic API Key Integration:', error);
      throw error;
    }
  }

  private async detectAPIKeys(): Promise<void> {
    console.log('🔍 Auto-detecting API keys...');
    
    // Define expected API key environment variables
    const expectedKeys = [
      { env: 'ZAI_API_KEY', provider: 'zai' },
      { env: 'OPENROUTER_API_KEY', provider: 'openrouter' },
      { env: 'OPENAI_API_KEY', provider: 'openai' },
      { env: 'GEMINI_API_KEY', provider: 'gemini' },
      { env: 'ANTHROPIC_API_KEY', provider: 'anthropic' },
      { env: 'GROQ_API_KEY', provider: 'groq' },
      { env: 'GLM_API_KEY', provider: 'glm' },
    ];

    for (const { env, provider } of expectedKeys) {
      const keyValue = process.env[env];
      
      if (keyValue && keyValue !== `your_${provider.toLowerCase()}_api_key_here` && keyValue.length > 10) {
        console.log(`✅ Found ${provider} API key`);
        
        this.apiKeys.set(provider, {
          provider,
          key: keyValue,
          status: 'active',
          lastValidated: new Date(),
          usageCount: 0,
          rateLimit: 1000,
          permissions: ['read', 'write', 'admin']
        });
      } else {
        console.log(`⚠️ ${provider} API key not found or using placeholder`);
      }
    }
  }

  private async configureServices(): Promise<void> {
    console.log('⚙️ Auto-configuring services...');
    
    // Configure ZAI Service
    if (this.apiKeys.has('zai')) {
      this.services.set('zai', {
        name: 'ZAI Service',
        enabled: true,
        apiKey: this.apiKeys.get('zai')?.key,
        model: 'glm-4',
        maxTokens: 4000,
        temperature: 0.7,
        timeout: 30000
      });
    }

    // Configure OpenRouter Service
    if (this.apiKeys.has('openrouter')) {
      this.services.set('openrouter', {
        name: 'OpenRouter Service',
        enabled: true,
        apiKey: this.apiKeys.get('openrouter')?.key,
        baseUrl: 'https://openrouter.ai/api/v1',
        model: 'anthropic/claude-3.5-sonnet',
        maxTokens: 4000,
        temperature: 0.7,
        timeout: 30000
      });
    }

    // Configure OpenAI Service
    if (this.apiKeys.has('openai')) {
      this.services.set('openai', {
        name: 'OpenAI Service',
        enabled: true,
        apiKey: this.apiKeys.get('openai')?.key,
        baseUrl: 'https://api.openai.com/v1',
        model: 'gpt-4',
        maxTokens: 4000,
        temperature: 0.7,
        timeout: 30000
      });
    }

    // Configure Gemini Service
    if (this.apiKeys.has('gemini')) {
      this.services.set('gemini', {
        name: 'Gemini Service',
        enabled: true,
        apiKey: this.apiKeys.get('gemini')?.key,
        baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
        model: 'gemini-pro',
        maxTokens: 4000,
        temperature: 0.7,
        timeout: 30000
      });
    }

    // Configure Anthropic Service
    if (this.apiKeys.has('anthropic')) {
      this.services.set('anthropic', {
        name: 'Anthropic Service',
        enabled: true,
        apiKey: this.apiKeys.get('anthropic')?.key,
        baseUrl: 'https://api.anthropic.com',
        model: 'claude-3-sonnet-20240229',
        maxTokens: 4000,
        temperature: 0.7,
        timeout: 30000
      });
    }

    // Configure GLM Service
    if (this.apiKeys.has('glm')) {
      this.services.set('glm', {
        name: 'GLM Service',
        enabled: true,
        apiKey: this.apiKeys.get('glm')?.key,
        model: 'glm-4',
        maxTokens: 4000,
        temperature: 0.7,
        timeout: 30000
      });
    }

    console.log(`✅ Configured ${this.services.size} services`);
  }

  private async validateAPIKeys(): Promise<void> {
    console.log('🔑 Validating API keys...');
    
    for (const [provider, config] of this.apiKeys) {
      try {
        let isValid = false;
        
        switch (provider) {
          case 'zai':
            // Test with ZAI SDK if available
            if (this.zai) {
              try {
                await this.zai.chat.completions.create({
                  messages: [{ role: 'user', content: 'test' }],
                  max_tokens: 1
                });
                isValid = true;
              } catch (error) {
                console.log(`⚠️ ZAI API key validation failed: ${error.message}`);
              }
            } else {
              // Fallback to format validation
              isValid = this.validateKeyFormat(config.key, provider);
            }
            break;
            
          case 'openrouter':
          case 'openai':
          case 'gemini':
          case 'anthropic':
          case 'glm':
            // For other services, we'll validate by checking key format
            isValid = this.validateKeyFormat(config.key, provider);
            break;
        }
        
        if (isValid) {
          config.status = 'active';
          config.lastValidated = new Date();
          console.log(`✅ ${provider} API key validated successfully`);
        } else {
          config.status = 'inactive';
          console.log(`❌ ${provider} API key validation failed`);
        }
        
      } catch (error) {
        config.status = 'inactive';
        console.log(`❌ ${provider} API key validation error:`, error.message);
      }
    }
  }

  private validateKeyFormat(key: string, provider: string): boolean {
    // Basic key format validation
    const patterns: Record<string, RegExp> = {
      'openrouter': /^sk-or-[a-zA-Z0-9]{48,}$/,
      'openai': /^sk-[a-zA-Z0-9]{48,}$/,
      'gemini': /^[a-zA-Z0-9_-]{20,}$/,
      'anthropic': /^sk-ant-[a-zA-Z0-9_-]{86,}$/,
      'glm': /^[a-zA-Z0-9_-]{20,}$/,
      'zai': /^[a-zA-Z0-9_-]{20,}$/,
      'groq': /^gsk_[a-zA-Z0-9_-]{48,}$/
    };
    
    const pattern = patterns[provider];
    if (!pattern) return true; // Unknown provider, assume valid
    
    return pattern.test(key);
  }

  public getServiceConfig(provider: string): ServiceConfiguration | undefined {
    return this.services.get(provider);
  }

  public getAPIKey(provider: string): string | undefined {
    return this.apiKeys.get(provider)?.key;
  }

  public isServiceEnabled(provider: string): boolean {
    const service = this.services.get(provider);
    return service?.enabled || false;
  }

  public getActiveServices(): string[] {
    return Array.from(this.services.entries())
      .filter(([_, config]) => config.enabled)
      .map(([provider, _]) => provider);
  }

  public async refreshAPIKeys(): Promise<void> {
    console.log('🔄 Refreshing API keys...');
    await this.detectAPIKeys();
    await this.configureServices();
    await this.validateAPIKeys();
    console.log('✅ API keys refreshed successfully');
  }

  public getStatus(): {
    initialized: boolean;
    apiKeys: number;
    services: number;
    activeServices: number;
    providers: string[];
  } {
    return {
      initialized: this.initialized,
      apiKeys: this.apiKeys.size,
      services: this.services.size,
      activeServices: this.getActiveServices().length,
      providers: Array.from(this.apiKeys.keys())
    };
  }

  // Method to automatically use the best available service
  public async getBestAvailableService(): Promise<string | null> {
    const activeServices = this.getActiveServices();
    
    // Priority order: zai > openrouter > openai > anthropic > gemini > glm > groq
    const priority = ['zai', 'openrouter', 'openai', 'anthropic', 'gemini', 'glm', 'groq'];
    
    for (const provider of priority) {
      if (activeServices.includes(provider)) {
        return provider;
      }
    }
    
    return null;
  }

  // Method to automatically make API calls with the best available service
  public async makeAPICall(prompt: string, options?: any): Promise<any> {
    if (!this.initialized) {
      await this.initialize();
    }
    
    const bestProvider = await this.getBestAvailableService();
    
    if (!bestProvider) {
      throw new Error('No active AI services available');
    }
    
    const serviceConfig = this.getServiceConfig(bestProvider);
    const apiKey = this.getAPIKey(bestProvider);
    
    if (!serviceConfig || !apiKey) {
      throw new Error(`Service configuration not found for ${bestProvider}`);
    }
    
    try {
      switch (bestProvider) {
        case 'zai':
          if (this.zai) {
            const response = await this.zai.chat.completions.create({
              messages: [{ role: 'user', content: prompt }],
              max_tokens: options?.maxTokens || serviceConfig.maxTokens,
              temperature: options?.temperature || serviceConfig.temperature
            });
            return response;
          }
          break;
          
        case 'openrouter':
        case 'openai':
        case 'gemini':
        case 'anthropic':
        case 'glm':
          // For other services, you would implement their specific API calls
          // This is a placeholder for the actual implementation
          return {
            provider: bestProvider,
            response: `API call to ${bestProvider} would be made here`,
            status: 'simulated',
            message: 'Service integration ready for implementation'
          };
      }
      
      throw new Error(`API call not implemented for ${bestProvider}`);
      
    } catch (error) {
      console.error(`API call failed for ${bestProvider}:`, error);
      throw error;
    }
  }
}

// Export singleton instance
export const automaticAPIKeyIntegration = AutomaticAPIKeyIntegration.getInstance();

// Auto-initialize on module load
if (typeof window === 'undefined') {
  // Server-side auto-initialization
  automaticAPIKeyIntegration.initialize().catch(console.error);
}