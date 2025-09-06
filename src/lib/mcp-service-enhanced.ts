/**
 * OptiMind AI Ecosystem - Premium Diamond Grade Enhanced MCP Service
 * Model Context Protocol service with comprehensive tool management and health monitoring
 */

import { premiumZAIWrapper } from './zai-sdk-wrapper';
import { openRouterService } from './openrouter-service';

export interface EnhancedMCPTool {
  id: string;
  name: string;
  description: string;
  category: 'search' | 'analysis' | 'system' | 'compliance' | 'domain' | 'ai';
  inputSchema: any;
  outputSchema: any;
  provider: 'zai' | 'openrouter' | 'internal';
  version: string;
  securityLevel: 'public' | 'restricted' | 'confidential';
  cost?: {
    input: number;
    output: number;
    currency: string;
  };
  performance?: {
    averageResponseTime: number;
    successRate: number;
    lastUsed: Date;
  };
}

export interface EnhancedMCPServiceHealth {
  status: 'HEALTHY' | 'DEGRADED' | 'UNHEALTHY';
  toolsAvailable: number;
  toolsHealthy: number;
  lastCheck: Date;
  responseTime: number;
  errors: string[];
  recommendations: string[];
}

class EnhancedMCPService {
  private static instance: EnhancedMCPService;
  private tools: Map<string, EnhancedMCPTool> = new Map();
  private toolUsage: Map<string, number> = new Map();
  private healthStatus: EnhancedMCPServiceHealth;
  private isInitialized: boolean = false;

  private constructor() {
    this.healthStatus = {
      status: 'UNHEALTHY',
      toolsAvailable: 0,
      toolsHealthy: 0,
      lastCheck: new Date(),
      responseTime: 0,
      errors: [],
      recommendations: [],
    };

    this.initialize();
  }

  static getInstance(): EnhancedMCPService {
    if (!EnhancedMCPService.instance) {
      EnhancedMCPService.instance = new EnhancedMCPService();
    }
    return EnhancedMCPService.instance;
  }

  private async initialize(): Promise<void> {
    try {
      console.log('🔗 Initializing Enhanced MCP Service...');

      // Initialize tools
      await this.initializeTools();
      
      // Perform initial health check
      await this.performHealthCheck();
      
      this.isInitialized = true;
      console.log('✅ Enhanced MCP Service initialized successfully');

    } catch (error) {
      console.error('❌ Enhanced MCP Service initialization failed:', error);
      this.setupFallbackMode();
    }
  }

  private async initializeTools(): Promise<void> {
    const tools: EnhancedMCPTool[] = [
      // AI Model Tools
      {
        id: 'zai-chat-completion',
        name: 'ZAI Chat Completion',
        description: 'Generate text completions using ZAI models',
        category: 'ai',
        inputSchema: {
          type: 'object',
          properties: {
            messages: { type: 'array', description: 'Array of message objects' },
            model: { type: 'string', description: 'Model to use' },
            temperature: { type: 'number', description: 'Temperature setting' },
            maxTokens: { type: 'number', description: 'Maximum tokens to generate' },
          },
          required: ['messages'],
        },
        outputSchema: {
          type: 'object',
          properties: {
            content: { type: 'string', description: 'Generated content' },
            usage: { type: 'object', description: 'Token usage information' },
          },
        },
        provider: 'zai',
        version: '1.0.0',
        securityLevel: 'public',
        cost: { input: 0.001, output: 0.002, currency: 'USD' },
      },
      {
        id: 'openrouter-chat-completion',
        name: 'OpenRouter Chat Completion',
        description: 'Generate text completions using OpenRouter models',
        category: 'ai',
        inputSchema: {
          type: 'object',
          properties: {
            messages: { type: 'array', description: 'Array of message objects' },
            model: { type: 'string', description: 'Model to use' },
            temperature: { type: 'number', description: 'Temperature setting' },
            maxTokens: { type: 'number', description: 'Maximum tokens to generate' },
          },
          required: ['messages', 'model'],
        },
        outputSchema: {
          type: 'object',
          properties: {
            content: { type: 'string', description: 'Generated content' },
            usage: { type: 'object', description: 'Token usage information' },
          },
        },
        provider: 'openrouter',
        version: '1.0.0',
        securityLevel: 'public',
        cost: { input: 0.002, output: 0.004, currency: 'USD' },
      },
      {
        id: 'zai-image-generation',
        name: 'ZAI Image Generation',
        description: 'Generate images using ZAI models',
        category: 'ai',
        inputSchema: {
          type: 'object',
          properties: {
            prompt: { type: 'string', description: 'Image generation prompt' },
            size: { type: 'string', description: 'Image size' },
            style: { type: 'string', description: 'Image style' },
          },
          required: ['prompt'],
        },
        outputSchema: {
          type: 'object',
          properties: {
            imageData: { type: 'string', description: 'Base64 encoded image data' },
            metadata: { type: 'object', description: 'Image metadata' },
          },
        },
        provider: 'zai',
        version: '1.0.0',
        securityLevel: 'public',
        cost: { input: 0.01, output: 0.02, currency: 'USD' },
      },
      {
        id: 'web-search',
        name: 'Web Search',
        description: 'Search the web for real-time information',
        category: 'search',
        inputSchema: {
          type: 'object',
          properties: {
            query: { type: 'string', description: 'Search query' },
            numResults: { type: 'number', description: 'Number of results' },
            safeSearch: { type: 'boolean', description: 'Enable safe search' },
          },
          required: ['query'],
        },
        outputSchema: {
          type: 'object',
          properties: {
            results: { type: 'array', description: 'Search results' },
            searchTime: { type: 'number', description: 'Search execution time' },
          },
        },
        provider: 'zai',
        version: '1.0.0',
        securityLevel: 'public',
      },
      {
        id: 'data-analysis',
        name: 'Data Analysis',
        description: 'Perform statistical analysis on datasets',
        category: 'analysis',
        inputSchema: {
          type: 'object',
          properties: {
            dataset: { type: 'array', description: 'Dataset to analyze' },
            analysisType: { type: 'string', description: 'Type of analysis' },
            parameters: { type: 'object', description: 'Analysis parameters' },
          },
          required: ['dataset', 'analysisType'],
        },
        outputSchema: {
          type: 'object',
          properties: {
            summary: { type: 'object', description: 'Analysis summary' },
            statistics: { type: 'object', description: 'Statistical results' },
            insights: { type: 'array', description: 'Generated insights' },
          },
        },
        provider: 'internal',
        version: '1.0.0',
        securityLevel: 'public',
      },
      {
        id: 'system-health-check',
        name: 'System Health Check',
        description: 'Perform comprehensive system health monitoring',
        category: 'system',
        inputSchema: {
          type: 'object',
          properties: {
            components: { 
              type: 'array', 
              description: 'Components to check',
              items: { type: 'string' }
            },
            detailed: { type: 'boolean', description: 'Perform detailed analysis' },
          },
        },
        outputSchema: {
          type: 'object',
          properties: {
            overallStatus: { type: 'string', description: 'Overall system status' },
            componentStatus: { type: 'object', description: 'Individual component status' },
            recommendations: { type: 'array', description: 'System recommendations' },
          },
        },
        provider: 'internal',
        version: '1.0.0',
        securityLevel: 'restricted',
      },
    ];

    // Register tools
    for (const tool of tools) {
      this.tools.set(tool.id, tool);
      this.toolUsage.set(tool.id, 0);
    }
  }

  private setupFallbackMode(): void {
    console.log('⚠️ Setting up fallback MCP service mode');
    
    // Create minimal fallback tools
    const fallbackTools: EnhancedMCPTool[] = [
      {
        id: 'fallback-chat',
        name: 'Fallback Chat',
        description: 'Basic chat functionality for development',
        category: 'ai',
        inputSchema: { type: 'object', properties: { message: { type: 'string' } } },
        outputSchema: { type: 'object', properties: { response: { type: 'string' } } },
        provider: 'internal',
        version: '1.0.0',
        securityLevel: 'public',
      },
    ];

    this.tools.clear();
    for (const tool of fallbackTools) {
      this.tools.set(tool.id, tool);
      this.toolUsage.set(tool.id, 0);
    }

    this.healthStatus = {
      status: 'DEGRADED',
      toolsAvailable: this.tools.size,
      toolsHealthy: this.tools.size,
      lastCheck: new Date(),
      responseTime: 10,
      errors: ['Using fallback mode'],
      recommendations: ['Configure proper AI service credentials'],
    };

    this.isInitialized = true;
  }

  async performHealthCheck(): Promise<EnhancedMCPServiceHealth> {
    const startTime = Date.now();
    const errors: string[] = [];
    const recommendations: string[] = [];
    let healthyTools = 0;

    try {
      // Check ZAI service
      const zaiHealth = await premiumZAIWrapper.getHealthStatus();
      if (!zaiHealth.initialized) {
        errors.push('ZAI service not initialized');
        recommendations.push('Check ZAI API configuration');
      } else if (!zaiHealth.modelAvailable) {
        errors.push('ZAI models not available');
        recommendations.push('Check ZAI model availability');
      } else {
        healthyTools += Array.from(this.tools.values()).filter(t => t.provider === 'zai').length;
      }

      // Check OpenRouter service
      const openRouterModels = openRouterService.getAvailableModels();
      if (openRouterModels.length === 0) {
        errors.push('OpenRouter models not available');
        recommendations.push('Check OpenRouter API configuration');
      } else {
        healthyTools += Array.from(this.tools.values()).filter(t => t.provider === 'openrouter').length;
      }

      // Internal tools are always available
      healthyTools += Array.from(this.tools.values()).filter(t => t.provider === 'internal').length;

      const responseTime = Date.now() - startTime;

      // Determine overall status
      let status: 'HEALTHY' | 'DEGRADED' | 'UNHEALTHY';
      const healthRatio = healthyTools / this.tools.size;
      
      if (healthRatio >= 0.9 && errors.length === 0) {
        status = 'HEALTHY';
      } else if (healthRatio >= 0.5) {
        status = 'DEGRADED';
      } else {
        status = 'UNHEALTHY';
      }

      this.healthStatus = {
        status,
        toolsAvailable: this.tools.size,
        toolsHealthy: healthyTools,
        lastCheck: new Date(),
        responseTime,
        errors,
        recommendations,
      };

    } catch (error) {
      this.healthStatus = {
        status: 'UNHEALTHY',
        toolsAvailable: this.tools.size,
        toolsHealthy: 0,
        lastCheck: new Date(),
        responseTime: Date.now() - startTime,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        recommendations: ['Check MCP service configuration'],
      };
    }

    return this.healthStatus;
  }

  getAvailableTools(): EnhancedMCPTool[] {
    return Array.from(this.tools.values());
  }

  getTool(toolId: string): EnhancedMCPTool | undefined {
    return this.tools.get(toolId);
  }

  getToolsByCategory(category: string): EnhancedMCPTool[] {
    return Array.from(this.tools.values()).filter(tool => tool.category === category);
  }

  getToolsByProvider(provider: string): EnhancedMCPTool[] {
    return Array.from(this.tools.values()).filter(tool => tool.provider === provider);
  }

  async executeTool(toolId: string, parameters: any): Promise<any> {
    const tool = this.tools.get(toolId);
    if (!tool) {
      throw new Error(`Tool ${toolId} not found`);
    }

    const startTime = Date.now();
    this.toolUsage.set(toolId, (this.toolUsage.get(toolId) || 0) + 1);

    try {
      let result: any;

      switch (tool.provider) {
        case 'zai':
          result = await this.executeZAITool(tool, parameters);
          break;
        case 'openrouter':
          result = await this.executeOpenRouterTool(tool, parameters);
          break;
        case 'internal':
          result = await this.executeInternalTool(tool, parameters);
          break;
        default:
          throw new Error(`Unknown provider: ${tool.provider}`);
      }

      // Update tool performance metrics
      if (tool.performance) {
        tool.performance.averageResponseTime = Date.now() - startTime;
        tool.performance.lastUsed = new Date();
      }

      return result;

    } catch (error) {
      console.error(`Tool execution failed for ${toolId}:`, error);
      throw error;
    }
  }

  private async executeZAITool(tool: EnhancedMCPTool, parameters: any): Promise<any> {
    try {
      const zai = await premiumZAIWrapper.getZAIInstance();

      switch (tool.id) {
        case 'zai-chat-completion':
          return await zai.chat.completions.create({
            messages: parameters.messages,
            model: parameters.model || 'glm-45-flagship',
            temperature: parameters.temperature || 0.7,
            max_tokens: parameters.maxTokens || 1000,
          });

        case 'zai-image-generation':
          return await zai.images.generations.create({
            prompt: parameters.prompt,
            size: parameters.size || '1024x1024',
          });

        case 'web-search':
          return await zai.functions.invoke('web_search', {
            query: parameters.query,
            num: parameters.numResults || 10,
          });

        default:
          throw new Error(`Unknown ZAI tool: ${tool.id}`);
      }
    } catch (error) {
      throw new Error(`ZAI tool execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async executeOpenRouterTool(tool: EnhancedMCPTool, parameters: any): Promise<any> {
    try {
      switch (tool.id) {
        case 'openrouter-chat-completion':
          return await openRouterService.analyzeWithModel({
            prompt: parameters.messages[parameters.messages.length - 1].content,
            modelId: parameters.model,
            temperature: parameters.temperature,
            maxTokens: parameters.maxTokens,
          });

        default:
          throw new Error(`Unknown OpenRouter tool: ${tool.id}`);
      }
    } catch (error) {
      throw new Error(`OpenRouter tool execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async executeInternalTool(tool: EnhancedMCPTool, parameters: any): Promise<any> {
    switch (tool.id) {
      case 'data-analysis':
        return this.performDataAnalysis(parameters.dataset, parameters.analysisType, parameters.parameters);

      case 'system-health-check':
        return this.performSystemHealthCheck(parameters.components, parameters.detailed);

      case 'fallback-chat':
        return {
          response: `Fallback response to: "${parameters.message}"`,
          timestamp: new Date().toISOString(),
        };

      default:
        throw new Error(`Unknown internal tool: ${tool.id}`);
    }
  }

  private performDataAnalysis(dataset: any[], analysisType: string, parameters: any): any {
    // Mock data analysis
    return {
      summary: {
        totalRecords: dataset.length,
        analysisType,
        timestamp: new Date().toISOString(),
      },
      statistics: {
        mean: dataset.reduce((a, b) => a + b, 0) / dataset.length,
        min: Math.min(...dataset),
        max: Math.max(...dataset),
      },
      insights: [
        'Data analysis completed successfully',
        'Consider additional parameters for deeper insights',
      ],
    };
  }

  private async performSystemHealthCheck(components: string[] = [], detailed: boolean = false): Promise<any> {
    const componentStatus: Record<string, any> = {};
    
    if (components.length === 0 || components.includes('zai')) {
      const zaiHealth = await premiumZAIWrapper.getHealthStatus();
      componentStatus.zai = zaiHealth;
    }

    if (components.length === 0 || components.includes('openrouter')) {
      componentStatus.openrouter = {
        available: openRouterService.getAvailableModels().length > 0,
        modelCount: openRouterService.getAvailableModels().length,
      };
    }

    if (components.length === 0 || components.includes('mcp')) {
      componentStatus.mcp = await this.getHealthStatus();
    }

    return {
      overallStatus: this.healthStatus.status,
      componentStatus,
      recommendations: this.healthStatus.recommendations,
      detailed,
      timestamp: new Date().toISOString(),
    };
  }

  async getHealthStatus(): Promise<EnhancedMCPServiceHealth> {
    // Refresh health status if needed
    const now = new Date();
    const timeSinceLastCheck = now.getTime() - this.healthStatus.lastCheck.getTime();
    
    if (timeSinceLastCheck > 60000) { // Check every minute
      await this.performHealthCheck();
    }
    
    return { ...this.healthStatus };
  }

  getToolUsageStats(): Record<string, number> {
    return Object.fromEntries(this.toolUsage);
  }

  async getToolPerformanceStats(): Promise<Record<string, any>> {
    const stats: Record<string, any> = {};
    
    for (const [toolId, tool] of this.tools) {
      stats[toolId] = {
        usageCount: this.toolUsage.get(toolId) || 0,
        performance: tool.performance,
        category: tool.category,
        provider: tool.provider,
      };
    }
    
    return stats;
  }

  isHealthy(): boolean {
    return this.healthStatus.status === 'HEALTHY';
  }

  async waitForHealthy(timeout: number = 30000): Promise<boolean> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      if (this.isHealthy()) {
        return true;
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      await this.performHealthCheck();
    }
    
    return false;
  }
}

// Export singleton instance
export const enhancedMCPService = EnhancedMCPService.getInstance();

// Export convenience functions
export const getAvailableTools = () => enhancedMCPService.getAvailableTools();
export const executeMCPTool = (toolId: string, params: any) => enhancedMCPService.executeTool(toolId, params);
export const getMCPHealthStatus = () => enhancedMCPService.getHealthStatus();