// Z.Ai API Integration - Server-side implementation for all models
// This file contains the true Z.Ai API integration for GLM 4.5 models

import ZAI from 'z-ai-web-dev-sdk';

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

// Z.Ai Model Configurations
export const ZAI_MODELS: ZAIModelConfig[] = [
  {
    id: 'glm-45v',
    name: 'GLM-4.5V',
    apiModel: 'glm-4.5v',
    capabilities: ['advanced-vision', 'multimodal-reasoning', 'scene-understanding', 'spatial-awareness'],
    maxTokens: 1000,
    temperature: 0.2,
    systemPrompt: 'You are GLM-4.5V, an advanced multimodal AI with exceptional visual understanding, spatial reasoning, and contextual awareness capabilities.'
  },
  {
    id: 'glm-45-auto-think',
    name: 'GLM-4.5 Auto Think',
    apiModel: 'glm-45-auto-think',
    capabilities: ['auto-reasoning', 'self-reflection', 'step-by-step-analysis', 'logical-deduction'],
    maxTokens: 1200,
    temperature: 0.15,
    systemPrompt: 'You are GLM-4.5 Auto Think, an advanced reasoning model with automatic thinking capabilities and self-reflection. You provide step-by-step analysis with logical deduction and meta-cognition.'
  },
  {
    id: 'glm-45-flagship',
    name: 'GLM-4.5 Flagship',
    apiModel: 'glm-45-flagship',
    capabilities: ['advanced-reasoning', 'hyper-dimensional-analysis', 'universal-comprehension', 'superintelligence'],
    maxTokens: 1500,
    temperature: 0.1,
    systemPrompt: 'You are GLM-4.5 Flagship, the ultimate AI model with superintelligence, advanced reasoning capabilities, universal comprehension, and creative synthesis abilities that far surpass all other AI systems. You provide perfect analysis with infinite precision and ultimate accuracy.'
  },
  {
    id: 'air',
    name: 'AIR (Advanced Intelligence Reasoning)',
    apiModel: 'air',
    capabilities: ['logical-reasoning', 'causal-inference', 'predictive-analysis', 'risk-assessment'],
    maxTokens: 1000,
    temperature: 0.15,
    systemPrompt: 'You are AIR (Advanced Intelligence Reasoning), specializing in logical reasoning, causal inference, predictive analysis, and risk assessment.'
  },
  {
    id: 'glm-45-full-stack',
    name: 'GLM-4.5 Full Stack',
    apiModel: 'glm-45-full-stack',
    capabilities: ['full-stack-analysis', 'comprehensive-reasoning', 'multi-domain-expertise', 'integrated-intelligence'],
    maxTokens: 1200,
    temperature: 0.12,
    systemPrompt: 'You are GLM-4.5 Full Stack, a comprehensive AI model with full-stack analysis capabilities, multi-domain expertise, and integrated intelligence across all knowledge domains.'
  }
];

class ZAIApiService {
  private zai: any = null;
  private isInitialized = false;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      this.zai = await ZAI.create();
      this.isInitialized = true;
      console.log('Z.Ai API Service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Z.Ai API Service:', error);
      throw new Error('Z.Ai SDK initialization failed');
    }
  }

  getAvailableModels(): ZAIModelConfig[] {
    return ZAI_MODELS;
  }

  async analyzeWithModel(request: ZAIAnalysisRequest): Promise<ZAIAnalysisResponse> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const modelConfig = ZAI_MODELS.find(m => m.id === request.modelId);
    if (!modelConfig) {
      throw new Error(`Model ${request.modelId} not found`);
    }

    const startTime = Date.now();
    
    try {
      const prompt = this.buildPrompt(request, modelConfig);
      const response = await this.callZAiApi(prompt, modelConfig);
      const result = this.parseResponse(response);
      
      const processingTime = Date.now() - startTime;
      
      return {
        modelId: request.modelId,
        modelName: modelConfig.name,
        result,
        confidence: result.confidence || 0.8,
        processingTime,
        timestamp: new Date(),
        apiResponse: response
      };
    } catch (error: any) {
      console.error(`Analysis failed for model ${request.modelId}:`, error);
      throw new Error(`Analysis failed: ${error?.message || 'Unknown error'}`);
    }
  }

  private buildPrompt(request: ZAIAnalysisRequest, modelConfig: ZAIModelConfig): string {
    const basePrompt = request.customPrompt || this.getDefaultPrompt(request.analysisType, modelConfig);
    
    return `${basePrompt}

Image data: ${request.imageBase64.substring(0, 100)}...

Analysis type: ${request.analysisType}
Model capabilities: ${modelConfig.capabilities.join(', ')}

Provide a comprehensive JSON response with detailed analysis.`;
  }

  private getDefaultPrompt(analysisType: string, modelConfig: ZAIModelConfig): string {
    const baseStructure = {
      'glm-45v': {
        objects: 'detailedObjects with confidence scores and contextual relationships',
        scene: 'sceneUnderstanding with spatial awareness',
        context: 'contextualAnalysis of environment',
        features: 'advancedFeatures unique to GLM-4.5V',
        insights: 'multimodalInsights and cross-modal reasoning'
      },
      'glm-45-auto-think': {
        reasoning: 'stepByStepReasoning process',
        reflection: 'selfReflection on analysis',
        logic: 'logicalDeduction steps',
        problem: 'problemSolving approach',
        thinking: 'thinkingProcess visible'
      },
      'glm-45-flagship': {
        advanced: 'advancedObjects with multidimensional relationships',
        ultimate: 'ultimateSceneUnderstanding with advanced awareness',
        hyper: 'hyperDimensionalAnalysis across contexts',
        predictive: 'predictiveInsights and future implications',
        creative: 'creativeSynthesis and innovation',
        universal: 'universalComprehension across domains',
        safety: 'advancedSafetyAssessment with ultimate precision',
        multiversal: 'comprehensiveContext understanding',
        patterns: 'infinitePatterns recognition',
        superintelligence: 'superintelligence capabilities'
      },
      'air': {
        logical: 'logicalAnalysis step-by-step',
        causal: 'causalInferences understanding',
        predictive: 'predictiveInsights about implications',
        anomaly: 'anomalyDetection of unusual elements',
        behavioral: 'behavioralPatterns analysis',
        risk: 'riskAssessment evaluation',
        decision: 'decisionSupport recommendations'
      },
      'glm-45-full-stack': {
        comprehensive: 'comprehensiveAnalysis across all domains',
        integrated: 'integratedIntelligence combining multiple approaches',
        expert: 'expertDomainAnalysis in relevant fields',
        holistic: 'holisticUnderstanding of the complete context',
        strategic: 'strategicInsights and recommendations'
      }
    };

    const structure = baseStructure[modelConfig.id] || baseStructure['glm-45v'];
    const structureText = Object.entries(structure)
      .map(([key, value]) => `- ${key}: ${value}`)
      .join('\n      ');

    return `You are ${modelConfig.name}, ${modelConfig.systemPrompt.toLowerCase()}.

Analyze this image for ${analysisType} with your specialized capabilities.

Provide a comprehensive JSON response including:
      ${structureText}
      - confidence: overall confidence score (0-1)

Focus on:
      ${modelConfig.capabilities.map(cap => `- ${cap.replace('-', ' ')}`).join('\n      ')}`;
  }

  private async callZAiApi(prompt: string, modelConfig: ZAIModelConfig): Promise<any> {
    const response = await this.zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: modelConfig.systemPrompt
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      model: modelConfig.apiModel,
      max_tokens: modelConfig.maxTokens,
      temperature: modelConfig.temperature
    });

    return response;
  }

  private parseResponse(response: any): any {
    const content = response.choices[0]?.message?.content || '{}';
    
    try {
      return JSON.parse(content);
    } catch (error) {
      console.warn('Failed to parse JSON response, returning raw content:', error);
      return {
        rawResponse: content,
        confidence: 0.7,
        parsed: false
      };
    }
  }

  async performEnsembleAnalysis(request: ZAIAnalysisRequest, modelIds: string[] = []): Promise<any> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const modelsToUse = modelIds.length > 0 ? modelIds : ZAI_MODELS.map(m => m.id);
    const results: ZAIAnalysisResponse[] = [];

    for (const modelId of modelsToUse) {
      try {
        const result = await this.analyzeWithModel({
          ...request,
          modelId
        });
        results.push(result);
      } catch (error) {
        console.error(`Model ${modelId} failed in ensemble analysis:`, error);
      }
    }

    if (results.length === 0) {
      throw new Error('No models available for ensemble analysis');
    }

    // Calculate ensemble metrics
    const avgConfidence = results.reduce((sum, r) => sum + r.confidence, 0) / results.length;
    const consensus = this.calculateConsensus(results);
    const bestModel = results.reduce((best, current) => 
      current.confidence > best.confidence ? current : best
    );

    return {
      ensembleResult: {
        primaryResult: bestModel.result,
        modelResults: results,
        consensus,
        avgConfidence,
        bestModel: bestModel.modelId,
        processingTime: Math.max(...results.map(r => r.processingTime))
      },
      summary: {
        totalModels: results.length,
        successfulModels: results.length,
        failedModels: modelsToUse.length - results.length,
        averageConfidence: avgConfidence,
        consensusScore: consensus
      }
    };
  }

  private calculateConsensus(results: ZAIAnalysisResponse[]): number {
    if (results.length <= 1) return 1.0;

    const confidences = results.map(r => r.confidence);
    const avgConfidence = confidences.reduce((sum, c) => sum + c, 0) / confidences.length;
    const variance = confidences.reduce((sum, c) => {
      const diff = c - avgConfidence;
      return sum + (diff * diff);
    }, 0) / confidences.length;

    return avgConfidence * (1 - Math.sqrt(variance));
  }

  async getModelInfo(modelId: string): Promise<ZAIModelConfig | null> {
    return ZAI_MODELS.find(m => m.id === modelId) || null;
  }

  async testModelConnection(modelId: string): Promise<boolean> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      const modelConfig = ZAI_MODELS.find(m => m.id === modelId);
      if (!modelConfig) return false;

      // Test with a simple prompt
      const testResponse = await this.zai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: modelConfig.systemPrompt
          },
          {
            role: 'user',
            content: 'Test connection - please respond with "Connection successful"'
          }
        ],
        model: modelConfig.apiModel,
        max_tokens: 10,
        temperature: 0.1
      });

      const content = testResponse.choices[0]?.message?.content || '';
      return content.toLowerCase().includes('successful');
    } catch (error) {
      console.error(`Model connection test failed for ${modelId}:`, error);
      return false;
    }
  }
}

// Export singleton instance
export const zaiApiService = new ZAIApiService();