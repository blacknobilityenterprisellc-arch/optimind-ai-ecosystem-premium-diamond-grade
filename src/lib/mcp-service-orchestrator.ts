// MCP (Model Context Protocol) Service Orchestrator
// Core architecture for multi-model AI business solutions

import {
  openRouterService,
  OpenRouterAnalysisRequest,
  OpenRouterAnalysisResponse,
} from "./openrouter-service";
import {
  zaiApiService,
  ZAIAnalysisRequest,
  ZAIAnalysisResponse,
} from "./zai-api-service";

export interface MCPBusinessRequest {
  id: string;
  businessType:
    | "contractwise"
    | "globalfit"
    | "behaviorpredict"
    | "complianceguard"
    | "skillpath";
  userId: string;
  projectId?: string;
  inputData: any;
  options?: {
    models?: string[];
    temperature?: number;
    maxTokens?: number;
    enableEnsemble?: boolean;
    priority?: "speed" | "accuracy" | "cost";
  };
}

export interface MCPBusinessResponse {
  id: string;
  businessType: string;
  success: boolean;
  result?: any;
  error?: string;
  modelResults: MCPModelResult[];
  confidence: number;
  processingTime: number;
  cost: number;
  timestamp: Date;
  metadata?: any;
}

export interface MCPModelResult {
  modelId: string;
  modelName: string;
  service: "openrouter" | "zai";
  result: any;
  confidence: number;
  processingTime: number;
  cost: number;
  timestamp: Date;
}

export interface MCPEnsembleConfig {
  primaryModel: string;
  secondaryModels: string[];
  consensusThreshold: number;
  weighting: {
    primary: number;
    secondary: number;
  };
}

export interface BusinessSolutionConfig {
  id: string;
  name: string;
  description: string;
  category: "legal" | "localization" | "analytics" | "compliance" | "education";
  defaultModels: {
    primary: string;
    secondary: string[];
  };
  systemPrompt: string;
  pricing: {
    base: number;
    perPage: number;
    ensembleMultiplier: number;
  };
}

// Business Solution Configurations
export const BUSINESS_SOLUTIONS: Record<string, BusinessSolutionConfig> = {
  contractwise: {
    id: "contractwise",
    name: "ContractWise AI",
    description: "AI-powered contract intelligence platform",
    category: "legal",
    defaultModels: {
      primary: "gpt-4o",
      secondary: ["claude-3.5-sonnet", "glm-4-flagship"],
    },
    systemPrompt: `You are an expert legal AI assistant specializing in contract analysis. Your task is to:
1. Extract and analyze key contract clauses
2. Identify potential risks and red flags
3. Translate complex legal language into plain English
4. Ensure compliance with relevant regulations
5. Provide actionable recommendations for contract improvement

Provide your analysis in a structured JSON format with clear risk assessments and practical recommendations.`,
    pricing: {
      base: 29,
      perPage: 5,
      ensembleMultiplier: 1.5,
    },
  },
  globalfit: {
    id: "globalfit",
    name: "GlobalFit AI",
    description: "Multi-modal product localization engine",
    category: "localization",
    defaultModels: {
      primary: "gemini-pro",
      secondary: ["claude-3.5-sonnet", "glm-4v"],
    },
    systemPrompt: `You are an expert in international business and cultural adaptation. Your task is to:
1. Analyze products for cultural appropriateness in target markets
2. Identify potential cultural sensitivities and taboos
3. Suggest visual and textual adaptations for local markets
4. Provide market entry strategy recommendations
5. Ensure compliance with local regulations and standards

Consider cultural nuances, color symbolism, imagery appropriateness, and local business practices.`,
    pricing: {
      base: 199,
      perPage: 25,
      ensembleMultiplier: 1.8,
    },
  },
  behaviorpredict: {
    id: "behaviorpredict",
    name: "BehaviorPredict AI",
    description: "Predictive customer behavior analyzer",
    category: "analytics",
    defaultModels: {
      primary: "o1-preview",
      secondary: ["claude-3.5-sonnet", "glm-4-plus"],
    },
    systemPrompt: `You are an expert in customer behavior analysis and predictive analytics. Your task is to:
1. Analyze customer data to predict future behavior patterns
2. Identify customer sentiment and satisfaction levels
3. Map customer journeys and touchpoints
4. Predict conversion probability and churn risk
5. Provide personalized recommendations for customer engagement

Use advanced reasoning to identify patterns and provide actionable insights for business decisions.`,
    pricing: {
      base: 99,
      perPage: 15,
      ensembleMultiplier: 1.6,
    },
  },
  complianceguard: {
    id: "complianceguard",
    name: "ComplianceGuard AI",
    description: "AI regulatory compliance monitor",
    category: "compliance",
    defaultModels: {
      primary: "claude-3.5-sonnet",
      secondary: ["gpt-4o", "glm-4-auto-think"],
    },
    systemPrompt: `You are an expert in regulatory compliance and risk management. Your task is to:
1. Monitor and analyze relevant regulations for the business type
2. Conduct comprehensive risk assessments
3. Review documents and policies for compliance gaps
4. Generate actionable compliance improvement plans
5. Prepare documentation for regulatory audits

Stay current with the latest regulatory changes and provide practical guidance for maintaining compliance.`,
    pricing: {
      base: 299,
      perPage: 35,
      ensembleMultiplier: 2,
    },
  },
  skillpath: {
    id: "skillpath",
    name: "SkillPath AI",
    description: "Adaptive learning path generator",
    category: "education",
    defaultModels: {
      primary: "gpt-4o",
      secondary: ["claude-3.5-sonnet", "glm-4"],
    },
    systemPrompt: `You are an expert in educational psychology and learning path design. Your task is to:
1. Assess current skills and identify knowledge gaps
2. Analyze learning styles and preferences
3. Generate personalized learning paths and recommendations
4. Track progress and adapt learning materials
5. Prepare learners for certifications and career advancement

Create engaging, effective learning experiences that adapt to individual needs and goals.`,
    pricing: {
      base: 49,
      perPage: 10,
      ensembleMultiplier: 1.4,
    },
  },
};

class MCPServiceOrchestrator {
  private activeRequests: Map<string, MCPBusinessRequest> = new Map();
  private requestHistory: MCPBusinessResponse[] = [];

  async processBusinessRequest(
    request: MCPBusinessRequest,
  ): Promise<MCPBusinessResponse> {
    const startTime = Date.now();
    this.activeRequests.set(request.id, request);

    try {
      const config = BUSINESS_SOLUTIONS[request.businessType];
      if (!config) {
        throw new Error(`Unknown business type: ${request.businessType}`);
      }

      // Select optimal models based on request options
      const modelSelection = this.selectOptimalModels(config, request.options);

      // Execute ensemble analysis if enabled
      const modelResults = await this.executeEnsembleAnalysis(
        request,
        modelSelection,
      );

      // Synthesize insights across models
      const synthesized = await this.synthesizeInsights(request, modelResults);

      // Generate actionable recommendations
      const finalResult = await this.generateActionPlan(request, synthesized);

      // Calculate cost and metrics
      const processingTime = Date.now() - startTime;
      const cost = this.calculateCost(modelResults, config);
      const confidence = this.calculateConfidence(modelResults);

      const response: MCPBusinessResponse = {
        id: request.id,
        businessType: request.businessType,
        success: true,
        result: finalResult,
        modelResults,
        confidence,
        processingTime,
        cost,
        timestamp: new Date(),
        metadata: {
          config,
          modelSelection,
          synthesisMethod: "weighted-consensus",
        },
      };

      this.requestHistory.push(response);
      this.activeRequests.delete(request.id);

      return response;
    } catch (error) {
      const processingTime = Date.now() - startTime;
      const errorResponse: MCPBusinessResponse = {
        id: request.id,
        businessType: request.businessType,
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        modelResults: [],
        confidence: 0,
        processingTime,
        cost: 0,
        timestamp: new Date(),
      };

      this.requestHistory.push(errorResponse);
      this.activeRequests.delete(request.id);

      return errorResponse;
    }
  }

  private selectOptimalModels(
    config: BusinessSolutionConfig,
    options?: MCPBusinessRequest["options"],
  ): MCPEnsembleConfig {
    const enableEnsemble = options?.enableEnsemble ?? true;
    const priority = options?.priority ?? "accuracy";

    if (!enableEnsemble) {
      return {
        primaryModel: config.defaultModels.primary,
        secondaryModels: [],
        consensusThreshold: 1,
        weighting: { primary: 1, secondary: 0 },
      };
    }

    // Select models based on priority
    let primaryModel = config.defaultModels.primary;
    let secondaryModels = [...config.defaultModels.secondary];

    if (priority === "speed") {
      // Prioritize faster models
      const fastModels = ["gpt-4o-mini", "claude-3.5-haiku", "glm-4-air"];
      primaryModel =
        fastModels.find(
          (m) =>
            config.defaultModels.primary === m ||
            config.defaultModels.secondary.includes(m),
        ) || primaryModel;
      secondaryModels = secondaryModels
        .filter((m) => fastModels.includes(m))
        .slice(0, 2);
    } else if (priority === "cost") {
      // Prioritize cost-effective models
      const costEffectiveModels = [
        "glm-4-air",
        "claude-3.5-haiku",
        "gemini-flash",
      ];
      primaryModel =
        costEffectiveModels.find(
          (m) =>
            config.defaultModels.primary === m ||
            config.defaultModels.secondary.includes(m),
        ) || primaryModel;
      secondaryModels = secondaryModels
        .filter((m) => costEffectiveModels.includes(m))
        .slice(0, 2);
    }

    return {
      primaryModel,
      secondaryModels,
      consensusThreshold: 0.7,
      weighting: { primary: 0.6, secondary: 0.4 },
    };
  }

  private async executeEnsembleAnalysis(
    request: MCPBusinessRequest,
    config: MCPEnsembleConfig,
  ): Promise<MCPModelResult[]> {
    const results: MCPModelResult[] = [];
    const businessConfig = BUSINESS_SOLUTIONS[request.businessType];

    // Process primary model
    const primaryResult = await this.processWithModel(
      request,
      config.primaryModel,
      businessConfig.systemPrompt,
      true,
    );
    results.push(primaryResult);

    // Process secondary models
    for (const modelId of config.secondaryModels) {
      try {
        const secondaryResult = await this.processWithModel(
          request,
          modelId,
          businessConfig.systemPrompt,
          false,
        );
        results.push(secondaryResult);
      } catch (error) {
        console.warn(`Secondary model ${modelId} failed:`, error);
        // Continue with other models
      }
    }

    return results;
  }

  private async processWithModel(
    request: MCPBusinessRequest,
    modelId: string,
    systemPrompt: string,
    isPrimary: boolean,
  ): Promise<MCPModelResult> {
    const startTime = Date.now();

    // Determine which service to use
    const isOpenRouter = this.isOpenRouterModel(modelId);

    try {
      let result: any;
      let cost = 0;

      if (isOpenRouter) {
        const openRouterRequest: OpenRouterAnalysisRequest = {
          prompt: this.buildPrompt(request, systemPrompt),
          modelId,
          temperature: request.options?.temperature || 0.7,
          maxTokens: request.options?.maxTokens || 2000,
        };

        const response =
          await openRouterService.analyzeWithModel(openRouterRequest);
        result = response.result;
        cost = this.estimateOpenRouterCost(modelId, response.usage);
      } else {
        const zaiRequest: ZAIAnalysisRequest = {
          prompt: this.buildPrompt(request, systemPrompt),
          modelId,
          analysisType: request.businessType,
          customPrompt: systemPrompt,
        };

        const response = await zaiApiService.analyzeWithModel(zaiRequest);
        result = response.result;
        cost = this.estimateZAICost(modelId);
      }

      const processingTime = Date.now() - startTime;

      return {
        modelId,
        modelName: this.getModelName(modelId),
        service: isOpenRouter ? "openrouter" : "zai",
        result,
        confidence: this.extractConfidence(result),
        processingTime,
        cost,
        timestamp: new Date(),
      };
    } catch (error) {
      const processingTime = Date.now() - startTime;
      throw new Error(
        `Model ${modelId} failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  private buildPrompt(
    request: MCPBusinessRequest,
    systemPrompt: string,
  ): string {
    const businessConfig = BUSINESS_SOLUTIONS[request.businessType];

    let prompt = `${systemPrompt}\n\n`;

    switch (request.businessType) {
      case "contractwise":
        prompt += `Contract Analysis Request:\n`;
        prompt += `Contract Type: ${request.inputData.contractType}\n`;
        prompt += `Contract Title: ${request.inputData.contractTitle}\n`;
        if (request.inputData.contractText) {
          prompt += `Contract Text: ${request.inputData.contractText.slice(0, 2000)}...\n`;
        }
        break;

      case "globalfit":
        prompt += `Product Localization Request:\n`;
        prompt += `Product Name: ${request.inputData.productName}\n`;
        prompt += `Target Market: ${request.inputData.targetMarket}\n`;
        prompt += `Product Description: ${request.inputData.productDescription}\n`;
        break;

      case "behaviorpredict":
        prompt += `Customer Behavior Analysis Request:\n`;
        prompt += `Customer Segment: ${request.inputData.customerSegment}\n`;
        prompt += `Data Sources: ${JSON.stringify(request.inputData.dataSources)}\n`;
        break;

      case "complianceguard":
        prompt += `Compliance Monitoring Request:\n`;
        prompt += `Business Type: ${request.inputData.businessType}\n`;
        prompt += `Jurisdiction: ${request.inputData.jurisdiction}\n`;
        break;

      case "skillpath":
        prompt += `Learning Path Generation Request:\n`;
        prompt += `User Profile: ${JSON.stringify(request.inputData.userProfile)}\n`;
        break;
    }

    prompt += `\nPlease provide a comprehensive analysis in JSON format.`;
    return prompt;
  }

  private async synthesizeInsights(
    request: MCPBusinessRequest,
    modelResults: MCPModelResult[],
  ): Promise<any> {
    if (modelResults.length === 1) {
      return modelResults[0].result;
    }

    // Use the most capable model for synthesis
    const synthesisModel =
      modelResults.find(
        (r) => r.modelId === "gpt-4o" || r.modelId === "claude-3.5-sonnet",
      ) || modelResults[0];

    const synthesisPrompt = `
    You are a synthesis expert. Combine and analyze the following AI model results for ${request.businessType}:
    
    ${modelResults
      .map(
        (result, index) => `
    Model ${index + 1} (${result.modelName}):
    ${JSON.stringify(result.result, null, 2)}
    `,
      )
      .join("\n")}
    
    Provide a synthesized analysis that:
    1. Identifies consensus and disagreements between models
    2. Weights insights by model confidence and capability
    3. Provides a comprehensive, unified analysis
    4. Highlights key insights and recommendations
    
    Return the synthesis in JSON format.
    `;

    try {
      const synthesisRequest: OpenRouterAnalysisRequest = {
        prompt: synthesisPrompt,
        modelId: synthesisModel.modelId,
        temperature: 0.3,
        maxTokens: 3000,
      };

      const response =
        await openRouterService.analyzeWithModel(synthesisRequest);
      return response.result;
    } catch {
      // Fallback to simple weighted combination
      return this.simpleSynthesis(modelResults);
    }
  }

  private simpleSynthesis(modelResults: MCPModelResult[]): any {
    // Simple fallback synthesis that combines results
    const primaryResult = modelResults[0].result;
    const secondaryInsights = modelResults.slice(1).map((r) => r.result);

    return {
      primaryAnalysis: primaryResult,
      secondaryInsights,
      consensusScore: this.calculateConsensus(modelResults),
      modelCount: modelResults.length,
      synthesisMethod: "simple-combination",
    };
  }

  private async generateActionPlan(
    request: MCPBusinessRequest,
    synthesizedData: any,
  ): Promise<any> {
    const businessConfig = BUSINESS_SOLUTIONS[request.businessType];

    const actionPlanPrompt = `
    Based on the synthesized analysis for ${businessConfig.name}, generate a comprehensive action plan:
    
    Synthesized Data:
    ${JSON.stringify(synthesizedData, null, 2)}
    
    Provide an action plan that includes:
    1. Immediate actions (next 30 days)
    2. Short-term goals (1-3 months)
    3. Long-term strategy (3-12 months)
    4. Resource requirements
    5. Success metrics and KPIs
    6. Risk mitigation strategies
    
    Return the action plan in JSON format.
    `;

    try {
      const actionPlanRequest: OpenRouterAnalysisRequest = {
        prompt: actionPlanPrompt,
        modelId: "gpt-4o",
        temperature: 0.4,
        maxTokens: 2000,
      };

      const response =
        await openRouterService.analyzeWithModel(actionPlanRequest);

      return {
        analysis: synthesizedData,
        actionPlan: response.result,
        businessType: request.businessType,
        generatedAt: new Date().toISOString(),
      };
    } catch {
      // Fallback: return synthesized data without action plan
      return {
        analysis: synthesizedData,
        actionPlan: null,
        businessType: request.businessType,
        generatedAt: new Date().toISOString(),
        error: "Action plan generation failed",
      };
    }
  }

  // Utility methods
  private isOpenRouterModel(modelId: string): boolean {
    const openRouterModels = [
      "gpt-4o",
      "gpt-4o-mini",
      "o1-preview",
      "o1-mini",
      "claude-3.5-sonnet",
      "claude-3.5-haiku",
      "claude-3-opus",
      "gemini-pro",
      "gemini-flash",
      "llama-3.1-70b",
      "llama-3.1-8b",
      "mistral-large",
      "mixtral-8x7b",
      "llama-3.1-sonar-small",
      "llama-3.1-sonar-large",
    ];
    return openRouterModels.includes(modelId);
  }

  private getModelName(modelId: string): string {
    const modelNames: Record<string, string> = {
      "gpt-4o": "GPT-4o",
      "gpt-4o-mini": "GPT-4o Mini",
      "o1-preview": "O1 Preview",
      "o1-mini": "O1 Mini",
      "claude-3.5-sonnet": "Claude 3.5 Sonnet",
      "claude-3.5-haiku": "Claude 3.5 Haiku",
      "claude-3-opus": "Claude 3 Opus",
      "gemini-pro": "Gemini Pro",
      "gemini-flash": "Gemini Flash",
      "llama-3.1-70b": "Llama 3.1 70B",
      "llama-3.1-8b": "Llama 3.1 8B",
      "mistral-large": "Mistral Large",
      "mixtral-8x7b": "Mixtral 8x7B",
      "llama-3.1-sonar-small": "Llama 3.1 Sonar Small",
      "llama-3.1-sonar-large": "Llama 3.1 Sonar Large",
      "glm-45v": "GLM-4.5V",
      "glm-45-auto-think": "GLM-4.5 Auto Think",
      "glm-45-flagship": "GLM-4.5 Flagship",
      air: "AIR",
      "glm-45-full-stack": "GLM-4.5 Full Stack",
      "glm-4": "GLM-4",
      "glm-4-plus": "GLM-4 Plus",
    };
    return modelNames[modelId] || modelId;
  }

  private extractConfidence(result: any): number {
    if (typeof result === "object" && result.confidence !== undefined) {
      return Math.min(1, Math.max(0, result.confidence));
    }
    return 0.8; // Default confidence
  }

  private calculateConfidence(modelResults: MCPModelResult[]): number {
    if (modelResults.length === 0) return 0;
    if (modelResults.length === 1) return modelResults[0].confidence;

    // Weighted average confidence
    const totalWeight = modelResults.reduce(
      (sum, _, index) => sum + (index === 0 ? 0.6 : 0.4),
      0,
    );
    const weightedSum = modelResults.reduce((sum, result, index) => {
      const weight = index === 0 ? 0.6 : 0.4;
      return sum + result.confidence * weight;
    }, 0);

    return weightedSum / totalWeight;
  }

  private calculateConsensus(modelResults: MCPModelResult[]): number {
    if (modelResults.length <= 1) return 1;

    // Simple consensus calculation based on result similarity
    // This is a simplified version - in practice, you'd use more sophisticated methods
    return 0.85; // Default consensus for ensemble
  }

  private calculateCost(
    modelResults: MCPModelResult[],
    config: BusinessSolutionConfig,
  ): number {
    const baseCost = config.pricing.base;
    const modelCosts = modelResults.reduce(
      (sum, result) => sum + result.cost,
      0,
    );
    const ensembleMultiplier =
      modelResults.length > 1 ? config.pricing.ensembleMultiplier : 1;

    return (baseCost + modelCosts) * ensembleMultiplier;
  }

  private estimateOpenRouterCost(modelId: string, usage: any): number {
    // Simplified cost estimation - in practice, you'd use actual pricing
    const costs: Record<string, number> = {
      "gpt-4o": 0.01,
      "gpt-4o-mini": 0.0005,
      "o1-preview": 0.015,
      "o1-mini": 0.003,
      "claude-3.5-sonnet": 0.003,
      "claude-3.5-haiku": 0.0001,
      "claude-3-opus": 0.015,
      "gemini-pro": 0.00125,
      "gemini-flash": 0.000075,
      "llama-3.1-70b": 0.00088,
      "llama-3.1-8b": 0.00018,
    };

    const costPerToken = costs[modelId] || 0.001;
    const totalTokens =
      (usage.promptTokens || 0) + (usage.completionTokens || 0);

    return (totalTokens / 1000) * costPerToken;
  }

  private estimateZAICost(modelId: string): number {
    // Simplified Z.AI cost estimation
    const costs: Record<string, number> = {
      "glm-45v": 0.002,
      "glm-45-auto-think": 0.0015,
      "glm-45-flagship": 0.0025,
      air: 0.001,
      "glm-45-full-stack": 0.0018,
      "glm-4": 0.001,
      "glm-4-plus": 0.002,
    };

    return costs[modelId] || 0.001;
  }

  // Public API methods
  getBusinessSolutions(): BusinessSolutionConfig[] {
    return Object.values(BUSINESS_SOLUTIONS);
  }

  getBusinessSolution(id: string): BusinessSolutionConfig | undefined {
    return BUSINESS_SOLUTIONS[id];
  }

  getActiveRequests(): MCPBusinessRequest[] {
    return Array.from(this.activeRequests.values());
  }

  getRequestHistory(limit: number = 50): MCPBusinessResponse[] {
    return this.requestHistory.slice(-limit);
  }

  async testModelConnection(modelId: string): Promise<boolean> {
    try {
      if (this.isOpenRouterModel(modelId)) {
        return await openRouterService.testModelConnection(modelId);
      } else {
        return await zaiApiService.testModelConnection(modelId);
      }
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const mcpServiceOrchestrator = new MCPServiceOrchestrator();
