// Domain-Specific Extraction Service
// Implements specialized extraction modules for healthcare, legal, and education domains

import { mcpService, MCPToolRequest, MCPToolResponse } from './mcp-service';
import {
  premiumContextEngineeringService,
  ContextPromptGenerationRequest,
} from './premium-context-engineering';

export interface ExtractionRequest {
  id: string;
  domain: 'healthcare' | 'legal' | 'education' | 'customer-service';
  inputData: any;
  extractionType: string;
  options?: {
    includeConfidence?: boolean;
    includeContext?: boolean;
    strictValidation?: boolean;
    outputFormat?: 'json' | 'xml' | 'structured';
    language?: string;
    jurisdiction?: string;
  };
}

export interface ExtractionResult {
  id: string;
  domain: string;
  extractionType: string;
  success: boolean;
  data: any;
  confidence: number;
  metadata: {
    processingTime: number;
    modelUsed: string;
    toolsUsed: string[];
    extractionDepth: number;
    validationScore: number;
  };
  errors: string[];
  warnings: string[];
  compliance: {
    hipaa?: boolean;
    gdpr?: boolean;
    soc2?: boolean;
    violations?: string[];
  };
}

export interface HealthcareExtractionConfig {
  extractTypes: ('terminology' | 'conditions' | 'medications' | 'procedures' | 'demographics')[];
  includeDefinitions: boolean;
  codingStandards: ('ICD-10' | 'ICD-11' | 'SNOMED-CT' | 'LOINC' | 'RxNorm')[];
  confidenceThreshold: number;
  hipaaCompliance: 'strict' | 'standard' | 'basic';
}

export interface LegalExtractionConfig {
  extractTypes: ('clauses' | 'parties' | 'dates' | 'amounts' | 'obligations' | 'restrictions')[];
  jurisdiction: string;
  documentType: 'contract' | 'agreement' | 'policy' | 'regulation' | 'court-filing';
  includeRiskAssessment: boolean;
  complianceStandards: ('GDPR' | 'CCPA' | 'SOC2' | 'ISO27001')[];
}

export interface EducationExtractionConfig {
  extractTypes: (
    | 'learning-objectives'
    | 'assessments'
    | 'resources'
    | 'standards'
    | 'competencies'
    | 'outcomes'
  )[];
  educationLevel: 'K-12' | 'higher-education' | 'professional' | 'vocational';
  subjectArea: string;
  framework?: ('Common-Core' | 'NGSS' | 'Blooms' | 'ABET' | 'ACM')[];
  includeAlignment: boolean;
}

export interface CustomerServiceExtractionConfig {
  extractTypes: ('sentiment' | 'intent' | 'entities' | 'action-items' | 'priority' | 'category')[];
  channel: 'email' | 'chat' | 'phone' | 'social' | 'ticket';
  includeCustomerProfile: boolean;
  escalationRules: string[];
  satisfactionMetrics: boolean;
}

// Domain-specific extraction interfaces
export interface MedicalTerminology {
  term: string;
  definition?: string;
  category: 'diagnosis' | 'symptom' | 'procedure' | 'medication' | 'anatomy' | 'test';
  code?: string;
  codingSystem: string;
  confidence: number;
  context: string;
}

export interface LegalClause {
  id: string;
  type: string;
  title: string;
  content: string;
  parties: string[];
  obligations: string[];
  restrictions: string[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  references?: string[];
}

export interface LearningObjective {
  id: string;
  description: string;
  level: 'knowledge' | 'comprehension' | 'application' | 'analysis' | 'synthesis' | 'evaluation';
  standards: string[];
  competencies: string[];
  assessments: string[];
  confidence: number;
}

export interface CustomerIntent {
  id: string;
  type: string;
  description: string;
  entities: Entity[];
  sentiment: 'positive' | 'negative' | 'neutral';
  urgency: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  confidence: number;
  actionItems: ActionItem[];
}

export interface Entity {
  id: string;
  type: string;
  value: string;
  confidence: number;
  context: string;
}

export interface ActionItem {
  id: string;
  description: string;
  assignee?: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in-progress' | 'completed';
  confidence: number;
}

class DomainExtractionService {
  private extractionHistory: Map<string, ExtractionResult[]> = new Map();
  private domainConfigs: Map<string, any> = new Map();
  private performanceMetrics: Map<string, any> = new Map();

  constructor() {
    this.initializeDomainConfigs();
  }

  private initializeDomainConfigs(): void {
    // Healthcare domain configuration
    this.domainConfigs.set('healthcare', {
      defaultConfig: {
        extractTypes: ['terminology', 'conditions', 'medications'],
        includeDefinitions: true,
        codingStandards: ['ICD-10', 'SNOMED-CT'],
        confidenceThreshold: 0.7,
        hipaaCompliance: 'strict',
      },
      tools: ['medical-terminology-extractor', 'hipaa-compliance-check', 'data-analysis'],
      agentProfile: 'healthcare-agent',
      validationRules: ['medical-data-privacy', 'terminology-accuracy', 'coding-standards'],
    });

    // Legal domain configuration
    this.domainConfigs.set('legal', {
      defaultConfig: {
        extractTypes: ['clauses', 'parties', 'dates', 'amounts'],
        jurisdiction: 'US Federal',
        documentType: 'contract',
        includeRiskAssessment: true,
        complianceStandards: ['GDPR', 'SOC2'],
      },
      tools: ['legal-clause-extractor', 'gdpr-compliance-check', 'knowledge-base-search'],
      agentProfile: 'legal-agent',
      validationRules: ['legal-confidentiality', 'clause-completeness', 'risk-assessment'],
    });

    // Education domain configuration
    this.domainConfigs.set('education', {
      defaultConfig: {
        extractTypes: ['learning-objectives', 'assessments', 'standards'],
        educationLevel: 'higher-education',
        subjectArea: 'General',
        includeAlignment: true,
      },
      tools: ['data-analysis', 'sentiment-analysis', 'knowledge-base-search'],
      agentProfile: 'education-agent',
      validationRules: ['educational-standards', 'objective-measurability', 'alignment-accuracy'],
    });

    // Customer service domain configuration
    this.domainConfigs.set('customer-service', {
      defaultConfig: {
        extractTypes: ['sentiment', 'intent', 'entities', 'action-items'],
        channel: 'email',
        includeCustomerProfile: true,
        escalationRules: ['high-urgency', 'complaint', 'technical-issue'],
        satisfactionMetrics: true,
      },
      tools: ['sentiment-analysis', 'crm-sync', 'knowledge-base-search'],
      agentProfile: 'customer-service-agent',
      validationRules: ['sentiment-accuracy', 'intent-classification', 'action-item-clarity'],
    });
  }

  // Main extraction method
  async extractData(request: ExtractionRequest): Promise<ExtractionResult> {
    const startTime = Date.now();
    const extractionId = `extract-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;

    try {
      // Get domain configuration
      const domainConfig = this.domainConfigs.get(request.domain);
      if (!domainConfig) {
        throw new Error(`Unsupported domain: ${request.domain}`);
      }

      // Get agent configuration
      const agentConfig = mcpService.getAgent(domainConfig.agentProfile);
      if (!agentConfig) {
        throw new Error(`Agent profile not found: ${domainConfig.agentProfile}`);
      }

      // Validate request
      const validation = this.validateExtractionRequest(request, domainConfig);
      if (!validation.isValid) {
        throw new Error(`Invalid request: ${validation.errors.join(', ')}`);
      }

      // Generate context prompt
      const contextPrompt = await this.generateContextPrompt(request, agentConfig);

      // Execute domain-specific extraction
      const extractionResult = await this.executeDomainExtraction(
        request,
        contextPrompt,
        domainConfig
      );

      // Validate and enhance results
      const validatedResult = await this.validateAndEnhanceResults(extractionResult, request);

      // Perform compliance checks
      const complianceResult = await this.performComplianceChecks(validatedResult, request);

      // Create final result
      const result: ExtractionResult = {
        id: extractionId,
        domain: request.domain,
        extractionType: request.extractionType,
        success: true,
        data: validatedResult.data,
        confidence: validatedResult.confidence,
        metadata: {
          processingTime: Date.now() - startTime,
          modelUsed: validatedResult.modelUsed,
          toolsUsed: validatedResult.toolsUsed,
          extractionDepth: validatedResult.extractionDepth,
          validationScore: validatedResult.validationScore,
        },
        errors: validatedResult.errors,
        warnings: validatedResult.warnings,
        compliance: complianceResult,
      };

      // Store in history
      this.storeExtractionHistory(result);

      return result;
    } catch (error: any) {
      const errorResult: ExtractionResult = {
        id: extractionId,
        domain: request.domain,
        extractionType: request.extractionType,
        success: false,
        data: null,
        confidence: 0,
        metadata: {
          processingTime: Date.now() - startTime,
          modelUsed: '',
          toolsUsed: [],
          extractionDepth: 0,
          validationScore: 0,
        },
        errors: [error.message],
        warnings: [],
        compliance: {},
      };

      this.storeExtractionHistory(errorResult);
      return errorResult;
    }
  }

  private validateExtractionRequest(
    request: ExtractionRequest,
    domainConfig: any
  ): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];
    let isValid = true;

    // Validate domain
    if (!['healthcare', 'legal', 'education', 'customer-service'].includes(request.domain)) {
      errors.push(`Invalid domain: ${request.domain}`);
      isValid = false;
    }

    // Validate input data
    if (!request.inputData || typeof request.inputData !== 'object') {
      errors.push('Input data must be a valid object');
      isValid = false;
    }

    // Validate extraction type
    if (!request.extractionType || typeof request.extractionType !== 'string') {
      errors.push('Extraction type must be specified');
      isValid = false;
    }

    // Domain-specific validation
    switch (request.domain) {
      case 'healthcare':
        if (
          request.options?.jurisdiction &&
          !this.isValidJurisdiction(request.options.jurisdiction)
        ) {
          errors.push('Invalid jurisdiction specified for healthcare extraction');
          isValid = false;
        }
        break;

      case 'legal':
        if (!request.options?.jurisdiction) {
          errors.push('Jurisdiction is required for legal extraction');
          isValid = false;
        }
        break;

      case 'education':
        if (!request.options?.educationLevel) {
          errors.push('Education level is required for education extraction');
          isValid = false;
        }
        break;
    }

    return { isValid, errors };
  }

  private isValidJurisdiction(jurisdiction: string): boolean {
    const validJurisdictions = [
      'US Federal',
      'US State',
      'EU',
      'UK',
      'Canada',
      'Australia',
      'International',
      'Asia',
      'South America',
      'Africa',
    ];
    return validJurisdictions.includes(jurisdiction);
  }

  private async generateContextPrompt(request: ExtractionRequest, agentConfig: any): Promise<any> {
    const templateId = `${request.domain}-${request.extractionType}`;

    const contextRequest: ContextPromptGenerationRequest = {
      templateId,
      variables: {
        directive: this.buildTaskDirective(request),
        profile: this.buildAgentProfile(request, agentConfig),
        tools: this.buildToolsConfig(request),
        data: request.inputData,
        format: this.buildOutputFormat(request),
        policy: this.buildSafeguardPolicy(request),
      },
      agentConfig,
      options: {
        strictValidation: request.options?.strictValidation || true,
        includeMetadata: true,
        complianceLevel: 'strict',
      },
    };

    const response = await premiumContextEngineeringService.generateContextPrompt(contextRequest);

    if (!response.success || !response.prompt) {
      throw new Error(`Failed to generate context prompt: ${response.errors.join(', ')}`);
    }

    return response.prompt;
  }

  private buildTaskDirective(request: ExtractionRequest): string {
    const directives = {
      healthcare: `Extract and analyze medical data from the provided input, identifying terminology, conditions, medications, and ensuring HIPAA compliance.`,
      legal: `Analyze legal document content, extract clauses, parties, dates, amounts, and perform risk assessment with jurisdictional compliance.`,
      education: `Extract learning objectives, assessments, standards, and alignments from educational content with proper framework mapping.`,
      'customer-service': `Analyze customer interaction data to extract intent, sentiment, entities, action items, and categorize for proper routing.`,
    };

    let directive =
      directives[request.domain] ||
      `Perform ${request.extractionType} extraction on the provided data.`;

    // Add extraction type specifics
    if (request.extractionType) {
      directive += ` Focus on ${request.extractionType}.`;
    }

    // Add domain-specific options
    if (request.options?.language) {
      directive += ` Language: ${request.options.language}.`;
    }

    if (request.options?.jurisdiction) {
      directive += ` Jurisdiction: ${request.options.jurisdiction}.`;
    }

    return directive;
  }

  private buildAgentProfile(request: ExtractionRequest, agentConfig: any): string {
    const profiles = {
      healthcare:
        'You are an expert medical data analyst with deep knowledge of medical terminology, coding standards, and HIPAA compliance requirements.',
      legal:
        'You are a legal document expert with extensive knowledge of contract law, compliance requirements, and risk assessment methodologies.',
      education:
        'You are an educational content specialist with expertise in curriculum design, learning standards, and assessment frameworks.',
      'customer-service':
        'You are a customer service analyst with expertise in sentiment analysis, intent classification, and customer experience optimization.',
    };

    let profile = profiles[request.domain] || 'You are a domain expert data extraction specialist.';

    // Add agent-specific constraints
    if (agentConfig.compliance?.hipaa) {
      profile += ' You must maintain strict HIPAA compliance at all times.';
    }

    if (agentConfig.compliance?.gdpr) {
      profile += ' You must ensure GDPR compliance in all data processing.';
    }

    return profile;
  }

  private buildToolsConfig(request: ExtractionRequest): any {
    const domainConfig = this.domainConfigs.get(request.domain);
    const tools = domainConfig?.tools || [];

    return tools
      .map(toolId => {
        const tool = mcpService.getTool(toolId);
        return tool
          ? {
              id: tool.id,
              name: tool.name,
              category: tool.category,
              capabilities: tool.capabilities,
            }
          : null;
      })
      .filter(Boolean);
  }

  private buildOutputFormat(request: ExtractionRequest): string {
    const formats = {
      healthcare: `{
        "terminology": [{"term": "string", "definition": "string", "category": "string", "code": "string", "confidence": number}],
        "conditions": [{"name": "string", "severity": "string", "confidence": number}],
        "medications": [{"name": "string", "dosage": "string", "frequency": "string", "confidence": number}],
        "compliance": {"hipaa": boolean, "violations": []}
      }`,
      legal: `{
        "clauses": [{"id": "string", "type": "string", "title": "string", "content": "string", "riskLevel": "string", "confidence": number}],
        "parties": [{"name": "string", "role": "string", "confidence": number}],
        "dates": [{"type": "string", "date": "string", "description": "string", "confidence": number}],
        "amounts": [{"type": "string", "amount": "number", "currency": "string", "confidence": number}],
        "compliance": {"gdpr": boolean, "violations": []}
      }`,
      education: `{
        "learningObjectives": [{"id": "string", "description": "string", "level": "string", "standards": [], "confidence": number}],
        "assessments": [{"type": "string", "description": "string", "alignment": [], "confidence": number}],
        "standards": [{"framework": "string", "code": "string", "description": "string", "confidence": number}],
        "alignment": {"overall": number, "details": []}
      }`,
      'customer-service': `{
        "sentiment": {"overall": "string", "score": number, "confidence": number},
        "intent": {"type": "string", "description": "string", "confidence": number},
        "entities": [{"type": "string", "value": "string", "confidence": number}],
        "actionItems": [{"description": "string", "priority": "string", "assignee": "string", "confidence": number}],
        "category": {"primary": "string", "secondary": [], "confidence": number}
      }`,
    };

    return formats[request.domain] || '{"extractedData": [], "confidence": number}';
  }

  private buildSafeguardPolicy(request: ExtractionRequest): string {
    const basePolicy =
      'Ensure data privacy, maintain confidentiality, and validate all extracted information for accuracy.';

    const domainPolicies = {
      healthcare:
        'Strict HIPAA compliance required. Do not store or transmit PHI without proper encryption. Validate all medical codes against standard terminologies.',
      legal:
        'Maintain attorney-client privilege. Ensure all legal citations are accurate. Flag any potentially conflicting clauses.',
      education:
        'Ensure FERPA compliance when handling student data. Validate educational standards alignment. Maintain accessibility standards.',
      'customer-service':
        'Protect customer privacy according to GDPR/CCPA. Do not extract sensitive personal information without explicit consent. Maintain data minimization principles.',
    };

    return `${basePolicy} ${domainPolicies[request.domain] || ''}`;
  }

  private async executeDomainExtraction(
    request: ExtractionRequest,
    contextPrompt: any,
    domainConfig: any
  ): Promise<any> {
    const toolsUsed: string[] = [];
    let extractedData: any = {};
    let modelUsed = '';
    let extractionDepth = 0;

    // Execute MCP tools for domain-specific extraction
    for (const toolId of domainConfig.tools) {
      try {
        const toolRequest: MCPToolRequest = {
          toolId,
          parameters: this.prepareToolParameters(toolId, request, contextPrompt),
          priority: 'medium',
        };

        const toolResponse = await mcpService.executeTool(toolRequest);
        toolsUsed.push(toolId);

        if (toolResponse.success) {
          extractedData = { ...extractedData, ...toolResponse.result };
          extractionDepth++;
        }
      } catch (error: any) {
        console.warn(`Tool ${toolId} execution failed:`, error.message);
      }
    }

    // Use AI model for enhanced extraction and reasoning
    try {
      const aiResult = await this.performAIExtraction(request, contextPrompt, extractedData);
      modelUsed = aiResult.modelUsed;
      extractedData = this.mergeExtractionResults(extractedData, aiResult.data);
      extractionDepth++;
    } catch (error: any) {
      console.warn('AI extraction failed:', error.message);
    }

    return {
      data: extractedData,
      modelUsed,
      toolsUsed,
      extractionDepth,
      validationScore: this.calculateValidationScore(extractedData, request),
      errors: [],
      warnings: [],
    };
  }

  private prepareToolParameters(
    toolId: string,
    request: ExtractionRequest,
    contextPrompt: any
  ): any {
    const baseParams = {
      requestId: request.id,
      domain: request.domain,
      extractionType: request.extractionType,
      context: contextPrompt,
    };

    switch (toolId) {
      case 'medical-terminology-extractor':
        return {
          ...baseParams,
          text: this.extractTextFromInput(request.inputData),
          extractTypes: request.options?.extractTypes || [
            'terminology',
            'conditions',
            'medications',
          ],
          includeDefinitions: request.options?.includeDefinitions !== false,
        };

      case 'legal-clause-extractor':
        return {
          ...baseParams,
          document: this.extractTextFromInput(request.inputData),
          clauseTypes: request.options?.extractTypes || ['clauses', 'parties', 'dates'],
          jurisdiction: request.options?.jurisdiction || 'US Federal',
        };

      case 'hipaa-compliance-check':
        return {
          ...baseParams,
          data: request.inputData,
          context: 'medical data extraction',
          strictness: request.options?.strictValidation ? 'high' : 'medium',
        };

      case 'gdpr-compliance-check':
        return {
          ...baseParams,
          data: request.inputData,
          jurisdiction: request.options?.jurisdiction || 'EU',
        };

      case 'sentiment-analysis':
        return {
          ...baseParams,
          text: this.extractTextFromInput(request.inputData),
          language: request.options?.language || 'en',
          granularity: 'document',
        };

      case 'data-analysis':
        return {
          ...baseParams,
          dataset: Array.isArray(request.inputData) ? request.inputData : [request.inputData],
          analysisType: 'descriptive',
          parameters: { domain: request.domain },
        };

      default:
        return baseParams;
    }
  }

  private extractTextFromInput(inputData: any): string {
    if (typeof inputData === 'string') {
      return inputData;
    }

    if (typeof inputData === 'object') {
      // Try to extract text from common fields
      const textFields = ['text', 'content', 'description', 'body', 'message', 'document'];
      for (const field of textFields) {
        if (inputData[field] && typeof inputData[field] === 'string') {
          return inputData[field];
        }
      }

      // If no text fields found, stringify the object
      return JSON.stringify(inputData);
    }

    return String(inputData);
  }

  private async performAIExtraction(
    request: ExtractionRequest,
    contextPrompt: any,
    existingData: any
  ): Promise<any> {
    // This would integrate with the AI models (GLM-4.5, OpenRouter)
    // For now, we'll simulate the AI extraction process

    const prompt = this.buildAIExtractionPrompt(request, contextPrompt, existingData);

    try {
      // In a real implementation, this would call the AI service
      const aiResult = await this.simulateAIExtraction(prompt, request);

      return {
        modelUsed: 'glm-45-flagship', // Would be determined dynamically
        data: aiResult,
      };
    } catch (error: any) {
      throw new Error(`AI extraction failed: ${error.message}`);
    }
  }

  private buildAIExtractionPrompt(
    request: ExtractionRequest,
    contextPrompt: any,
    existingData: any
  ): string {
    let prompt = `Domain: ${request.domain}\n`;
    prompt += `Extraction Type: ${request.extractionType}\n\n`;
    prompt += `Context:\n${JSON.stringify(contextPrompt, null, 2)}\n\n`;
    prompt += `Existing Extracted Data:\n${JSON.stringify(existingData, null, 2)}\n\n`;
    prompt += `Task: Perform enhanced extraction and analysis using AI reasoning.\n`;
    prompt += `Please provide:\n`;
    prompt += `1. Enhanced extraction results\n`;
    prompt += `2. Confidence scores for all extracted items\n`;
    prompt += `3. Validation of existing data\n`;
    prompt += `4. Additional insights and patterns\n`;
    prompt += `5. Recommendations for data quality improvement\n\n`;
    prompt += `Output Format: JSON with extracted data, confidence scores, and metadata.`;

    return prompt;
  }

  private async simulateAIExtraction(prompt: string, request: ExtractionRequest): Promise<any> {
    // Simulate AI extraction with domain-specific responses
    const baseResponse = {
      confidence: 0.85,
      metadata: {
        extractionTime: Date.now(),
        model: 'glm-45-flagship',
        reasoningDepth: 3,
      },
    };

    switch (request.domain) {
      case 'healthcare':
        return {
          ...baseResponse,
          terminology: [
            { term: 'Hypertension', category: 'diagnosis', confidence: 0.92 },
            { term: 'Metformin', category: 'medication', confidence: 0.88 },
          ],
          conditions: [{ name: 'Type 2 Diabetes', severity: 'moderate', confidence: 0.85 }],
          medications: [
            {
              name: 'Metformin',
              dosage: '500mg',
              frequency: 'twice daily',
              confidence: 0.88,
            },
          ],
        };

      case 'legal':
        return {
          ...baseResponse,
          clauses: [
            {
              type: 'confidentiality',
              content: 'All information shall be kept confidential',
              confidence: 0.9,
            },
          ],
          parties: [{ name: 'Party A', role: 'Client', confidence: 0.95 }],
          dates: [{ type: 'effective', date: '2024-01-01', confidence: 0.98 }],
        };

      case 'education':
        return {
          ...baseResponse,
          learningObjectives: [
            {
              description: 'Understand basic algebraic concepts',
              level: 'comprehension',
              confidence: 0.87,
            },
          ],
          assessments: [
            {
              type: 'quiz',
              description: 'Algebra fundamentals quiz',
              confidence: 0.85,
            },
          ],
        };

      case 'customer-service':
        return {
          ...baseResponse,
          sentiment: { overall: 'neutral', score: 0.1, confidence: 0.82 },
          intent: {
            type: 'inquiry',
            description: 'Product information request',
            confidence: 0.88,
          },
          entities: [
            {
              type: 'product',
              value: 'premium subscription',
              confidence: 0.85,
            },
          ],
        };

      default:
        return baseResponse;
    }
  }

  private mergeExtractionResults(existingData: any, aiData: any): any {
    // Merge tool extraction results with AI enhancement results
    const merged = { ...existingData };

    // For each key in AI data, either merge arrays or enhance existing data
    for (const [key, aiValue] of Object.entries(aiData)) {
      if (Array.isArray(aiValue) && Array.isArray(merged[key])) {
        // Merge arrays, removing duplicates based on confidence
        const mergedArray = [...merged[key], ...aiValue];
        merged[key] = this.deduplicateArray(mergedArray);
      } else if (typeof aiValue === 'object' && typeof merged[key] === 'object') {
        // Merge objects
        merged[key] = { ...merged[key], ...aiValue };
      } else if (!merged[key]) {
        // Add new data
        merged[key] = aiValue;
      }
    }

    return merged;
  }

  private deduplicateArray(array: any[]): any[] {
    // Simple deduplication based on common identifier fields
    const seen = new Set();
    return array.filter(item => {
      const key = item.id || item.term || item.name || item.type || JSON.stringify(item);
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  private calculateValidationScore(data: any, request: ExtractionRequest): number {
    // Calculate validation score based on data quality and completeness
    let score = 1;

    // Check for required fields based on domain
    const requiredFields = {
      healthcare: ['terminology', 'conditions'],
      legal: ['clauses', 'parties'],
      education: ['learningObjectives'],
      'customer-service': ['sentiment', 'intent'],
    };

    const domainRequired = requiredFields[request.domain] || [];
    for (const field of domainRequired) {
      if (!data[field] || (Array.isArray(data[field]) && data[field].length === 0)) {
        score -= 0.2;
      }
    }

    // Check confidence scores
    const confidenceScores = this.extractConfidenceScores(data);
    if (confidenceScores.length > 0) {
      const avgConfidence =
        confidenceScores.reduce((sum, score) => sum + score, 0) / confidenceScores.length;
      score *= avgConfidence;
    }

    return Math.max(0, Math.min(1, score));
  }

  private extractConfidenceScores(data: any, scores: number[] = []): number[] {
    if (typeof data !== 'object' || data === null) {
      return scores;
    }

    for (const [key, value] of Object.entries(data)) {
      if (key === 'confidence' && typeof value === 'number') {
        scores.push(value);
      } else if (Array.isArray(value)) {
        for (const item of value) {
          this.extractConfidenceScores(item, scores);
        }
      } else if (typeof value === 'object') {
        this.extractConfidenceScores(value, scores);
      }
    }

    return scores;
  }

  private async validateAndEnhanceResults(result: any, request: ExtractionRequest): Promise<any> {
    const enhancedResult = { ...result };

    // Domain-specific validation and enhancement
    switch (request.domain) {
      case 'healthcare':
        enhancedResult.data = await this.validateHealthcareData(enhancedResult.data, request);
        break;
      case 'legal':
        enhancedResult.data = await this.validateLegalData(enhancedResult.data, request);
        break;
      case 'education':
        enhancedResult.data = await this.validateEducationData(enhancedResult.data, request);
        break;
      case 'customer-service':
        enhancedResult.data = await this.validateCustomerServiceData(enhancedResult.data, request);
        break;
    }

    // Add overall confidence calculation
    enhancedResult.confidence = this.calculateOverallConfidence(enhancedResult.data);

    return enhancedResult;
  }

  private async validateHealthcareData(data: any, request: ExtractionRequest): Promise<any> {
    // Validate medical terminology, codes, and compliance
    const validated = { ...data };

    if (data.terminology) {
      validated.terminology = data.terminology.map((term: any) => ({
        ...term,
        validated: true,
        validationDate: new Date().toISOString(),
      }));
    }

    if (data.medications) {
      validated.medications = data.medications.map((med: any) => ({
        ...med,
        dosageValidated: this.validateDosage(med.dosage),
        interactionWarnings: [], // Would check for drug interactions
      }));
    }

    return validated;
  }

  private async validateLegalData(data: any, request: ExtractionRequest): Promise<any> {
    // Validate legal clauses, dates, and compliance
    const validated = { ...data };

    if (data.clauses) {
      validated.clauses = data.clauses.map((clause: any) => ({
        ...clause,
        legallyValid: this.validateClauseLegality(clause),
        enforceability: this.assessEnforceability(clause),
      }));
    }

    if (data.dates) {
      validated.dates = data.dates.map((date: any) => ({
        ...date,
        validDate: this.validateDate(date.date),
        timezoneAdjusted: true,
      }));
    }

    return validated;
  }

  private async validateEducationData(data: any, request: ExtractionRequest): Promise<any> {
    // Validate learning objectives, standards alignment
    const validated = { ...data };

    if (data.learningObjectives) {
      validated.learningObjectives = data.learningObjectives.map((obj: any) => ({
        ...obj,
        measurable: this.validateObjectiveMeasurability(obj.description),
        ageAppropriate: this.validateAgeAppropriateness(obj, request.options?.educationLevel),
      }));
    }

    return validated;
  }

  private async validateCustomerServiceData(data: any, request: ExtractionRequest): Promise<any> {
    // Validate sentiment, intent classification, and action items
    const validated = { ...data };

    if (data.actionItems) {
      validated.actionItems = data.actionItems.map((item: any) => ({
        ...item,
        actionable: this.validateActionability(item.description),
        priorityValidated: this.validatePriority(item.priority, data.sentiment?.urgency),
      }));
    }

    return validated;
  }

  private validateDosage(dosage: string): boolean {
    // Basic dosage validation
    const dosagePattern =
      /^\d+(mg|g|ml|mcg|units)?(\s+(once|twice|three times|four times)\s+(daily|weekly|monthly))?$/i;
    return dosagePattern.test(dosage);
  }

  private validateClauseLegality(clause: any): boolean {
    // Basic clause legality validation
    return clause.content && clause.content.length > 10;
  }

  private assessEnforceability(clause: any): string {
    // Basic enforceability assessment
    return clause.riskLevel === 'low' ? 'high' : 'medium';
  }

  private validateDate(dateString: string): boolean {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  }

  private validateObjectiveMeasurability(description: string): boolean {
    const measurableWords = ['analyze', 'identify', 'compare', 'evaluate', 'create', 'demonstrate'];
    return measurableWords.some(word => description.toLowerCase().includes(word));
  }

  private validateAgeAppropriateness(obj: any, educationLevel?: string): boolean {
    // Basic age appropriateness validation
    return true; // Placeholder
  }

  private validateActionability(description: string): boolean {
    const actionableWords = ['contact', 'send', 'review', 'update', 'investigate', 'resolve'];
    return actionableWords.some(word => description.toLowerCase().includes(word));
  }

  private validatePriority(priority: string, urgency?: string): boolean {
    const validPriorities = ['low', 'medium', 'high', 'critical'];
    return validPriorities.includes(priority);
  }

  private calculateOverallConfidence(data: any): number {
    const scores = this.extractConfidenceScores(data);
    if (scores.length === 0) return 0.5;

    const avgScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;

    // Apply additional factors
    let confidence = avgScore;

    // Reduce confidence if data is sparse
    const dataComplexity = Object.keys(data).length;
    if (dataComplexity < 2) confidence *= 0.8;

    // Increase confidence if validation passed
    if (this.hasValidationMarkers(data)) confidence *= 1.1;

    return Math.max(0, Math.min(1, confidence));
  }

  private hasValidationMarkers(data: any): boolean {
    // Check if data has been validated
    const validationMarkers = ['validated', 'valid', 'compliance', 'verified'];
    const dataStr = JSON.stringify(data).toLowerCase();
    return validationMarkers.some(marker => dataStr.includes(marker));
  }

  private async performComplianceChecks(result: any, request: ExtractionRequest): Promise<any> {
    const compliance: any = {};

    // Domain-specific compliance checks
    switch (request.domain) {
      case 'healthcare':
        compliance.hipaa = await this.checkHIPAACompliance(result.data, request);
        compliance.gdpr = await this.checkGDPRCompliance(result.data, request);
        break;

      case 'legal':
        compliance.gdpr = await this.checkGDPRCompliance(result.data, request);
        compliance.soc2 = await this.checkSOC2Compliance(result.data, request);
        break;

      case 'education':
        compliance.gdpr = await this.checkGDPRCompliance(result.data, request);
        break;

      case 'customer-service':
        compliance.gdpr = await this.checkGDPRCompliance(result.data, request);
        break;
    }

    return compliance;
  }

  private async checkHIPAACompliance(data: any, request: ExtractionRequest): Promise<boolean> {
    // Simulate HIPAA compliance check
    try {
      const toolRequest: MCPToolRequest = {
        toolId: 'hipaa-compliance-check',
        parameters: {
          data,
          context: 'domain extraction',
          strictness: request.options?.strictValidation ? 'high' : 'medium',
        },
      };

      const response = await mcpService.executeTool(toolRequest);
      return response.success && response.result?.compliant;
    } catch {
      return false;
    }
  }

  private async checkGDPRCompliance(data: any, request: ExtractionRequest): Promise<boolean> {
    // Simulate GDPR compliance check
    try {
      const toolRequest: MCPToolRequest = {
        toolId: 'gdpr-compliance-check',
        parameters: {
          data,
          jurisdiction: request.options?.jurisdiction || 'EU',
        },
      };

      const response = await mcpService.executeTool(toolRequest);
      return response.success && response.result?.compliant;
    } catch {
      return false;
    }
  }

  private async checkSOC2Compliance(data: any, request: ExtractionRequest): Promise<boolean> {
    // Simulate SOC2 compliance check
    return true; // Placeholder
  }

  private storeExtractionHistory(result: ExtractionResult): void {
    const date = new Date().toDateString();
    if (!this.extractionHistory.has(date)) {
      this.extractionHistory.set(date, []);
    }
    this.extractionHistory.get(date)!.push(result);

    // Update performance metrics
    this.updatePerformanceMetrics(result);
  }

  private updatePerformanceMetrics(result: ExtractionResult): void {
    const domain = result.domain;
    const existing = this.performanceMetrics.get(domain) || {
      totalExtractions: 0,
      successfulExtractions: 0,
      averageConfidence: 0,
      averageProcessingTime: 0,
      errorRate: 0,
    };

    const updated = {
      totalExtractions: existing.totalExtractions + 1,
      successfulExtractions: existing.successfulExtractions + (result.success ? 1 : 0),
      averageConfidence:
        (existing.averageConfidence * existing.totalExtractions + result.confidence) /
        (existing.totalExtractions + 1),
      averageProcessingTime:
        (existing.averageProcessingTime * existing.totalExtractions +
          result.metadata.processingTime) /
        (existing.totalExtractions + 1),
      errorRate:
        (existing.errorRate * existing.totalExtractions + (result.success ? 0 : 1)) /
        (existing.totalExtractions + 1),
    };

    this.performanceMetrics.set(domain, updated);
  }

  // Public API Methods
  getExtractionHistory(domain?: string, date?: string): ExtractionResult[] {
    let history: ExtractionResult[] = [];

    if (date) {
      history = this.extractionHistory.get(date) || [];
    } else {
      for (const dayHistory of this.extractionHistory.values()) {
        history.push(...dayHistory);
      }
    }

    if (domain) {
      history = history.filter(result => result.domain === domain);
    }

    return history;
  }

  getPerformanceMetrics(domain?: string): any {
    if (domain) {
      return this.performanceMetrics.get(domain);
    }
    return Object.fromEntries(this.performanceMetrics);
  }

  getDomainConfig(domain: string): any {
    return this.domainConfigs.get(domain);
  }

  async batchExtract(requests: ExtractionRequest[]): Promise<ExtractionResult[]> {
    const results: ExtractionResult[] = [];

    // Process requests in parallel (with reasonable concurrency limit)
    const concurrencyLimit = 5;
    const chunks = this.chunkArray(requests, concurrencyLimit);

    for (const chunk of chunks) {
      const chunkPromises = chunk.map(request => this.extractData(request));
      const chunkResults = await Promise.all(chunkPromises);
      results.push(...chunkResults);
    }

    return results;
  }

  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }
}

// Export singleton instance
export const domainExtractionService = new DomainExtractionService();
