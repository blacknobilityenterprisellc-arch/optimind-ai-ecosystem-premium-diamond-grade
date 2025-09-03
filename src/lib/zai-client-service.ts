// Z.Ai API Client Service - Client-side implementation
// This file provides client-side functions that call the server-side API endpoints

export interface ZAIModelConfig {
  id: string;
  name: string;
  apiModel: string;
  capabilities: string[];
  maxTokens: number;
  temperature: number;
  systemPrompt: string;
}

export interface ZAIAnalysisRequest {
  imageBase64: string;
  analysisType: string;
  modelId: string;
  customPrompt?: string;
}

export interface ZAIAnalysisResponse {
  modelId: string;
  modelName: string;
  result: any;
  confidence: number;
  processingTime: number;
  timestamp: Date;
  apiResponse: any;
}

export interface ZAIServiceError {
  code: string;
  message: string;
  details?: any;
  retryable: boolean;
}

// Client-side service that calls API endpoints
class ZAIClientService {
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 1000; // 1 second
  private readonly TIMEOUT = 30000; // 30 seconds

  private async fetchWithRetry(
    url: string,
    options: RequestInit = {},
    retries = this.MAX_RETRIES
  ): Promise<Response> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT);

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error: ZAIServiceError = {
          code: `HTTP_${response.status}`,
          message: errorData.error || `HTTP ${response.status}: ${response.statusText}`,
          details: errorData,
          retryable: response.status >= 500 || response.status === 429,
        };
        throw error;
      }

      return response;
    } catch (error: any) {
      if (error?.name === 'AbortError') {
        const timeoutError: ZAIServiceError = {
          code: 'TIMEOUT',
          message: 'Request timeout',
          retryable: true,
        };
        throw timeoutError;
      }

      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        const networkError: ZAIServiceError = {
          code: 'NETWORK_ERROR',
          message: 'Network connection failed',
          retryable: true,
        };
        throw networkError;
      }

      if (retries > 0 && error.retryable) {
        await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY));
        return this.fetchWithRetry(url, options, retries - 1);
      }

      throw error;
    }
  }

  async getAvailableModels(): Promise<ZAIModelConfig[]> {
    try {
      const response = await this.fetchWithRetry('/api/models');
      const data = await response.json();
      return data.models;
    } catch (error) {
      console.error('Failed to get available models:', error);
      throw this.normalizeError(error);
    }
  }

  async analyzeWithModel(request: ZAIAnalysisRequest): Promise<ZAIAnalysisResponse> {
    try {
      const endpoint = `/api/models/${request.modelId}`;
      const response = await this.fetchWithRetry(endpoint, {
        method: 'POST',
        body: JSON.stringify({
          imageBase64: request.imageBase64,
          analysisType: request.analysisType,
          customPrompt: request.customPrompt
        }),
      });

      const result = await response.json();
      return {
        ...result,
        timestamp: new Date(result.timestamp)
      };
    } catch (error) {
      console.error(`Analysis failed for model ${request.modelId}:`, error);
      throw this.normalizeError(error);
    }
  }

  async performEnsembleAnalysis(request: ZAIAnalysisRequest, modelIds: string[] = []): Promise<any> {
    try {
      const response = await this.fetchWithRetry('/api/models/ensemble', {
        method: 'POST',
        body: JSON.stringify({
          imageBase64: request.imageBase64,
          analysisType: request.analysisType,
          customPrompt: request.customPrompt,
          modelIds
        }),
      });

      return await response.json();
    } catch (error) {
      console.error('Ensemble analysis failed:', error);
      throw this.normalizeError(error);
    }
  }

  async testModelConnection(modelId: string): Promise<boolean> {
    try {
      const response = await this.fetchWithRetry('/api/test-models');
      const data = await response.json();
      const modelTest = data.testResults.find((r: any) => r.modelId === modelId);
      return modelTest?.isConnected || false;
    } catch (error) {
      console.error(`Model connection test failed for ${modelId}:`, error);
      return false;
    }
  }

  async getModelInfo(modelId: string): Promise<ZAIModelConfig | null> {
    try {
      const models = await this.getAvailableModels();
      return models.find(m => m.id === modelId) || null;
    } catch (error) {
      console.error(`Failed to get model info for ${modelId}:`, error);
      return null;
    }
  }

  private normalizeError(error: any): ZAIServiceError {
    if (error.code && error.message) {
      return error as ZAIServiceError;
    }

    return {
      code: 'UNKNOWN_ERROR',
      message: error.message || 'An unknown error occurred',
      retryable: false,
      details: error,
    };
  }

  // Utility method to check if a model is available
  async isModelAvailable(modelId: string): Promise<boolean> {
    try {
      const models = await this.getAvailableModels();
      return models.some(m => m.id === modelId);
    } catch {
      return false;
    }
  }

  // Utility method to get model capabilities
  async getModelCapabilities(modelId: string): Promise<string[]> {
    try {
      const modelInfo = await this.getModelInfo(modelId);
      return modelInfo?.capabilities || [];
    } catch {
      return [];
    }
  }
}

// Export singleton instance
export const zaiClientService = new ZAIClientService();