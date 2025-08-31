// Multi-Model AI System - Client-side hooks and utilities
// This file provides React hooks for the UI components

import { useState, useEffect, useCallback } from 'react';
import { 
  ZAIAnalysisRequest, 
  ZAIAnalysisResponse, 
  ZAIModelConfig,
  ZAIServiceError,
  zaiClientService 
} from './zai-client-service';
import { 
  OpenRouterAnalysisRequest,
  OpenRouterAnalysisResponse,
  OpenRouterModelConfig,
  openRouterService
} from './openrouter-service';

export interface AIModel {
  id: string;
  name: string;
  description: string;
  capabilities: string[];
  version: string;
  provider: string;
  isAvailable: boolean;
  isFlagship?: boolean;
  service: 'zai' | 'openrouter'; // Add service type
  pricing?: {
    input: number;
    output: number;
  };
}

export interface ModelAnalysisResult {
  modelId: string;
  modelName: string;
  result: any;
  confidence: number;
  processingTime: number;
  timestamp: Date;
}

export interface EnsembleAnalysisResult {
  primaryResult: any;
  modelResults: ModelAnalysisResult[];
  consensus: number;
  disagreements: string[];
  enhancedAccuracy: number;
  bestModel: string;
}

export interface MultiModelAIOptions {
  enableGLM45V: boolean;
  enableGLM45Flagship: boolean;
  enableGLM45AutoThink: boolean;
  enableAIR: boolean;
  enableGLM45FullStack: boolean;
  enableEnsembleAnalysis: boolean;
  enableModelComparison: boolean;
  autoSelectBestModel: boolean;
  fallbackToBaseModel: boolean;
}

export interface AnalysisError {
  code: string;
  message: string;
  retryable: boolean;
  timestamp: Date;
}

// Convert ZAI and Open Router models to UI models
export const getAvailableModels = async (options: MultiModelAIOptions): Promise<AIModel[]> => {
  const [zaiModels, openRouterModels] = await Promise.all([
    zaiClientService.getAvailableModels(),
    openRouterService.getAvailableModels()
  ]);
  
  const allModels: AIModel[] = [];
  
  // Add ZAI models
  zaiModels
    .filter(model => {
      switch (model.id) {
        case 'glm-45v': return options.enableGLM45V;
        case 'glm-45-auto-think': return options.enableGLM45AutoThink;
        case 'glm-45-flagship': return options.enableGLM45Flagship;
        case 'air': return options.enableAIR;
        case 'glm-45-full-stack': return options.enableGLM45FullStack;
        default: return true;
      }
    })
    .forEach(model => {
      allModels.push({
        id: model.id,
        name: model.name,
        description: `${model.name} - ${model.capabilities.join(', ')}`,
        capabilities: model.capabilities,
        version: '1.0.0',
        provider: 'Z-AI',
        isAvailable: true,
        isFlagship: model.id === 'glm-45-flagship',
        service: 'zai'
      });
    });
  
  // Add Open Router models (prioritize these)
  openRouterModels.forEach(model => {
    allModels.push({
      id: model.id,
      name: model.name,
      description: `${model.name} - ${model.capabilities.join(', ')}`,
      capabilities: model.capabilities,
      version: '1.0.0',
      provider: model.provider,
      isAvailable: true,
      isFlagship: model.id === 'gpt-4o' || model.id === 'claude-3.5-sonnet',
      service: 'openrouter',
      pricing: model.pricing
    });
  });
  
  // Sort by priority: Open Router first, then ZAI, with flagship models at the top
  return allModels.sort((a, b) => {
    // Open Router models come first
    if (a.service !== b.service) {
      return a.service === 'openrouter' ? -1 : 1;
    }
    
    // Flagship models come first within each service
    if (a.isFlagship !== b.isFlagship) {
      return a.isFlagship ? -1 : 1;
    }
    
    // Then sort by name
    return a.name.localeCompare(b.name);
  });
};

// Default options
export const DEFAULT_OPTIONS: MultiModelAIOptions = {
  enableGLM45V: true,
  enableGLM45Flagship: true,
  enableGLM45AutoThink: true,
  enableAIR: true,
  enableGLM45FullStack: true,
  enableEnsembleAnalysis: true,
  enableModelComparison: true,
  autoSelectBestModel: true,
  fallbackToBaseModel: true
};

// React hook for multi-model AI functionality
export function useMultiModelAI(options: MultiModelAIOptions = DEFAULT_OPTIONS) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [availableModels, setAvailableModels] = useState<AIModel[]>([]);
  const [analysisResults, setAnalysisResults] = useState<Map<string, ModelAnalysisResult[]>>(new Map());
  const [modelStatus, setModelStatus] = useState<Map<string, boolean>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<AnalysisError | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const loadModels = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const models = await getAvailableModels(options);
        setAvailableModels(models);
        await checkModelStatus(models);
        setRetryCount(0); // Reset retry count on success
      } catch (err) {
        console.error('Failed to load models:', err);
        const serviceError = err as ZAIServiceError;
        setError({
          code: serviceError.code,
          message: serviceError.message,
          retryable: serviceError.retryable,
          timestamp: new Date()
        });
        setRetryCount(prev => prev + 1);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadModels();
  }, [options, retryCount]); // Retry when retryCount changes

  const checkModelStatus = useCallback(async (models: AIModel[]) => {
    const statusMap = new Map<string, boolean>();
    
    for (const model of models) {
      try {
        let isOnline: boolean;
        
        if (model.service === 'openrouter') {
          isOnline = await openRouterService.testModelConnection(model.id);
        } else {
          isOnline = await zaiClientService.testModelConnection(model.id);
        }
        
        statusMap.set(model.id, isOnline);
      } catch (error) {
        console.error(`Failed to check status for model ${model.id}:`, error);
        statusMap.set(model.id, false);
      }
    }
    
    setModelStatus(statusMap);
  }, []);

  const analyzeWithModel = useCallback(async (
    photoId: string, 
    modelId: string, 
    imageFile: File, 
    analysisType: string
  ): Promise<ModelAnalysisResult> => {
    setIsAnalyzing(true);
    setError(null);
    
    try {
      // Convert file to base64
      const base64Image = await fileToBase64(imageFile);
      
      // Determine which service to use based on model
      const model = availableModels.find(m => m.id === modelId);
      if (!model) {
        throw new Error(`Model ${modelId} not found`);
      }
      
      let result: ModelAnalysisResult;
      
      if (model.service === 'openrouter') {
        const request: OpenRouterAnalysisRequest = {
          prompt: `Analyze this image for ${analysisType}`,
          modelId,
          imageBase64: base64Image
        };

        const response = await openRouterService.analyzeWithModel(request);
        
        result = {
          modelId: response.modelId,
          modelName: response.modelName,
          result: response.result,
          confidence: response.confidence,
          processingTime: response.processingTime,
          timestamp: response.timestamp
        };
      } else {
        // Use ZAI service
        const request: ZAIAnalysisRequest = {
          imageBase64: base64Image,
          analysisType,
          modelId
        };

        const response = await zaiClientService.analyzeWithModel(request);
        
        result = {
          modelId: response.modelId,
          modelName: response.modelName,
          result: response.result,
          confidence: response.confidence,
          processingTime: response.processingTime,
          timestamp: response.timestamp
        };
      }

      setAnalysisResults(prev => {
        const newMap = new Map(prev);
        const existing = newMap.get(photoId) || [];
        newMap.set(photoId, [...existing, result]);
        return newMap;
      });

      return result;
    } catch (err) {
      console.error('Model analysis failed:', err);
      const serviceError = err as ZAIServiceError;
      setError({
        code: serviceError.code || 'ANALYSIS_FAILED',
        message: serviceError.message || 'Analysis failed',
        retryable: serviceError.retryable || true,
        timestamp: new Date()
      });
      throw err;
    } finally {
      setIsAnalyzing(false);
    }
  }, [availableModels]);

  const performEnsembleAnalysis = useCallback(async (
    photoId: string, 
    imageFile: File, 
    analysisType: string,
    modelIds?: string[]
  ): Promise<EnsembleAnalysisResult> => {
    if (!options.enableEnsembleAnalysis) {
      throw new Error('Ensemble analysis not enabled');
    }

    setIsAnalyzing(true);
    setError(null);
    
    try {
      const base64Image = await fileToBase64(imageFile);
      
      const request: ZAIAnalysisRequest = {
        imageBase64: base64Image,
        analysisType,
        modelId: modelIds?.[0] || 'ensemble' // Fallback model ID
      };

      const ensembleResponse = await zaiClientService.performEnsembleAnalysis(request, modelIds);
      
      const modelResults: ModelAnalysisResult[] = ensembleResponse.ensembleResult.modelResults.map(r => ({
        modelId: r.modelId,
        modelName: r.modelName,
        result: r.result,
        confidence: r.confidence,
        processingTime: r.processingTime,
        timestamp: r.timestamp
      }));

      const result: EnsembleAnalysisResult = {
        primaryResult: ensembleResponse.ensembleResult.primaryResult,
        modelResults,
        consensus: ensembleResponse.ensembleResult.consensus,
        disagreements: [],
        enhancedAccuracy: ensembleResponse.ensembleResult.consensus * 0.9 + 0.1,
        bestModel: ensembleResponse.ensembleResult.bestModel
      };

      setAnalysisResults(prev => {
        const newMap = new Map(prev);
        newMap.set(photoId, modelResults);
        return newMap;
      });

      return result;
    } catch (err) {
      console.error('Ensemble analysis failed:', err);
      const serviceError = err as ZAIServiceError;
      setError({
        code: serviceError.code,
        message: serviceError.message,
        retryable: serviceError.retryable,
        timestamp: new Date()
      });
      throw err;
    } finally {
      setIsAnalyzing(false);
    }
  }, [options.enableEnsembleAnalysis]);

  const getAnalysisResults = useCallback((photoId: string): ModelAnalysisResult[] => {
    return analysisResults.get(photoId) || [];
  }, [analysisResults]);

  const getModelStatus = useCallback((modelId: string): boolean => {
    return modelStatus.get(modelId) || false;
  }, [modelStatus]);

  const autoSelectBestModel = useCallback(async (
    imageFile: File, 
    analysisType: string
  ): Promise<string> => {
    if (!options.autoSelectBestModel) {
      return 'gpt-4o'; // Default to Open Router's GPT-4o
    }

    const models = await getAvailableModels(options);
    if (models.length === 0) return 'gpt-4o';

    // Prioritize Open Router models, especially flagship ones
    const openRouterFlagship = models.find(m => 
      m.service === 'openrouter' && m.isFlagship
    );
    if (openRouterFlagship) {
      return openRouterFlagship.id;
    }

    // Then any Open Router model
    const openRouterModel = models.find(m => m.service === 'openrouter');
    if (openRouterModel) {
      return openRouterModel.id;
    }

    // Fallback to ZAI flagship
    const zaiFlagship = models.find(m => 
      m.service === 'zai' && m.isFlagship
    );
    if (zaiFlagship) {
      return zaiFlagship.id;
    }

    // Final fallback
    return models[0]?.id || 'gpt-4o';
  }, [options]);

  const refreshModelStatus = useCallback(() => {
    checkModelStatus(availableModels);
  }, [availableModels, checkModelStatus]);

  const retryFailedOperation = useCallback(() => {
    setRetryCount(prev => prev + 1);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isAnalyzing,
    availableModels,
    analysisResults,
    modelStatus,
    isLoading,
    error,
    retryCount,
    analyzeWithModel,
    performEnsembleAnalysis,
    getAnalysisResults,
    getModelStatus,
    autoSelectBestModel,
    refreshModelStatus,
    retryFailedOperation,
    clearError
  };
}

// Helper function to convert file to base64
async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Export utility functions
export const multiModelAIUtils = {
  getAvailableModels,
  fileToBase64,
  DEFAULT_OPTIONS
};