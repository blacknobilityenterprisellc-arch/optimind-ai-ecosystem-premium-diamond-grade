// Agentic Workflow Engine
// Implements thinking/non-thinking modes with GLM-4.5 and OpenRouter integration

import { zaiApiService, ZAIAnalysisRequest, ZAIAnalysisResponse } from './zai-api-service';
import {
  openRouterService,
  OpenRouterAnalysisRequest,
  OpenRouterAnalysisResponse,
} from './openrouter-service';
import { mcpService, MCPToolRequest, MCPToolResponse, MCPAgentConfig } from './mcp-service';

export interface AgenticTask {
  id: string;
  name: string;
  description: string;
  type: 'analysis' | 'generation' | 'transformation' | 'validation';
  priority: 'low' | 'medium' | 'high' | 'critical';
  complexity: 'simple' | 'moderate' | 'complex' | 'expert';
  input: any;
  expectedOutput: any;
  constraints?: any;
  deadline?: Date;
}

export interface AgenticWorkflow {
  id: string;
  name: string;
  description: string;
  tasks: AgenticTask[];
  agentConfig: MCPAgentConfig;
  reasoningMode: 'thinking' | 'non-thinking' | 'hybrid';
  autoRouting: boolean;
  budget?: {
    maxCost: number;
    currency: string;
  };
  compliance?: any;
}

export interface AgenticExecution {
  id: string;
  workflowId: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'paused';
  currentTaskId?: string;
  results: Map<string, any>;
  errors: string[];
  startTime: Date;
  endTime?: Date;
  metadata: {
    totalCost: number;
    tokensUsed: number;
    modelSwitches: number;
    toolCalls: number;
    reasoningDepth: number;
  };
}

export interface ReasoningStep {
  id: string;
  type: 'analysis' | 'planning' | 'tool-selection' | 'validation' | 'synthesis';
  content: string;
  confidence: number;
  timestamp: Date;
  dependencies?: string[];
  output?: any;
}

export interface ThinkingModeConfig {
  enabled: boolean;
  maxDepth: number;
  timeout: number; // in milliseconds
  selfReflection: boolean;
  stepByStepAnalysis: boolean;
  toolOrchestration: boolean;
  confidenceThreshold: number;
}

export interface NonThinkingModeConfig {
  enabled: boolean;
  maxTokens: number;
  temperature: number;
  responseTime: number; // target response time in milliseconds
  cacheEnabled: boolean;
}

export interface HybridModeConfig {
  thinkingConfig: ThinkingModeConfig;
  nonThinkingConfig: NonThinkingModeConfig;
  autoSwitch: boolean;
  complexityThreshold: number;
  costThreshold: number;
  timeThreshold: number;
}

class AgenticWorkflowEngine {
  private workflows: Map<string, AgenticWorkflow> = new Map();
  private executions: Map<string, AgenticExecution> = new Map();
  private reasoningHistory: Map<string, ReasoningStep[]> = new Map();
  private performanceMetrics: Map<string, any> = new Map();

  constructor() {
    this.initializeDefaultWorkflows();
  }

  private initializeDefaultWorkflows(): void {
    const defaultWorkflows: AgenticWorkflow[] = [
      {
        id: 'customer-support-summary',
        name: 'Customer Support Summary Generation',
        description: 'Generate structured summaries from customer interaction transcripts',
        tasks: [
          {
            id: 'transcript-analysis',
            name: 'Transcript Analysis',
            description: 'Analyze customer transcript for key information',
            type: 'analysis',
            priority: 'high',
            complexity: 'moderate',
            input: { transcript: '' },
            expectedOutput: { entities: [], sentiment: '', topics: [] },
          },
          {
            id: 'action-item-extraction',
            name: 'Action Item Extraction',
            description: 'Extract action items from the conversation',
            type: 'analysis',
            priority: 'medium',
            complexity: 'simple',
            input: { analysisResult: null },
            expectedOutput: { actionItems: [], priorities: [] },
          },
          {
            id: 'summary-generation',
            name: 'Summary Generation',
            description: 'Generate final structured summary',
            type: 'generation',
            priority: 'high',
            complexity: 'moderate',
            input: { analysisResult: null, actionItems: null },
            expectedOutput: { summary: '', actionItems: [], priority: '' },
          },
        ],
        agentConfig: {
          id: 'customer-service-agent',
          name: 'Customer Service AI Agent',
          description: 'Specialized agent for customer interaction analysis',
          domain: 'customer-service',
          capabilities: ['sentiment-analysis', 'ticket-classification', 'response-generation'],
          tools: ['sentiment-analysis', 'crm-sync', 'knowledge-base-search'],
          compliance: { gdpr: true },
          reasoningMode: 'hybrid',
          modelPreference: 'openrouter-auto',
        },
        reasoningMode: 'hybrid',
        autoRouting: true,
        budget: { maxCost: 0.1, currency: 'USD' },
        compliance: { gdpr: true },
      },
      {
        id: 'legal-document-analysis',
        name: 'Legal Document Analysis',
        description: 'Comprehensive analysis of legal documents with clause extraction',
        tasks: [
          {
            id: 'document-preprocessing',
            name: 'Document Preprocessing',
            description: 'Preprocess and clean the legal document',
            type: 'transformation',
            priority: 'medium',
            complexity: 'simple',
            input: { document: '' },
            expectedOutput: { cleanedText: '', metadata: {} },
          },
          {
            id: 'clause-extraction',
            name: 'Legal Clause Extraction',
            description: 'Extract and categorize legal clauses',
            type: 'analysis',
            priority: 'high',
            complexity: 'complex',
            input: { cleanedText: '' },
            expectedOutput: { clauses: [], categories: [], risks: [] },
          },
          {
            id: 'compliance-validation',
            name: 'Compliance Validation',
            description: 'Validate document against compliance requirements',
            type: 'validation',
            priority: 'high',
            complexity: 'expert',
            input: { clauses: [] },
            expectedOutput: {
              compliant: boolean,
              violations: [],
              recommendations: [],
            },
          },
          {
            id: 'risk-assessment',
            name: 'Risk Assessment',
            description: 'Assess legal and business risks',
            type: 'analysis',
            priority: 'high',
            complexity: 'expert',
            input: { clauses: [], compliance: null },
            expectedOutput: { risks: [], mitigation: [], overallRisk: '' },
          },
        ],
        agentConfig: {
          id: 'legal-agent',
          name: 'Legal AI Agent',
          description: 'Specialized agent for legal document analysis',
          domain: 'legal',
          capabilities: ['legal-clause-extraction', 'contract-analysis', 'compliance-monitoring'],
          tools: ['legal-clause-extractor', 'gdpr-compliance-check', 'knowledge-base-search'],
          compliance: { gdpr: true, soc2: true },
          reasoningMode: 'thinking',
          modelPreference: 'glm-45-auto-think',
        },
        reasoningMode: 'thinking',
        autoRouting: false,
        budget: { maxCost: 0.5, currency: 'USD' },
        compliance: { gdpr: true, soc2: true },
      },
      {
        id: 'medical-data-analysis',
        name: 'Medical Data Analysis',
        description: 'Analysis of medical data with terminology extraction and compliance checking',
        tasks: [
          {
            id: 'data-ingestion',
            name: 'Data Ingestion',
            description: 'Ingest and validate medical data',
            type: 'transformation',
            priority: 'high',
            complexity: 'moderate',
            input: { rawData: '' },
            expectedOutput: { validatedData: [], validationErrors: [] },
          },
          {
            id: 'terminology-extraction',
            name: 'Medical Terminology Extraction',
            description: 'Extract medical terminology and conditions',
            type: 'analysis',
            priority: 'high',
            complexity: 'complex',
            input: { validatedData: [] },
            expectedOutput: {
              terminology: [],
              conditions: [],
              medications: [],
            },
          },
          {
            id: 'hipaa-compliance',
            name: 'HIPAA Compliance Check',
            description: 'Ensure data meets HIPAA compliance requirements',
            type: 'validation',
            priority: 'critical',
            complexity: 'expert',
            input: { extractedData: null },
            expectedOutput: {
              compliant: boolean,
              violations: [],
              recommendations: [],
            },
          },
          {
            id: 'clinical-analysis',
            name: 'Clinical Analysis',
            description: 'Perform clinical analysis and insights generation',
            type: 'analysis',
            priority: 'high',
            complexity: 'expert',
            input: { terminology: [], compliance: null },
            expectedOutput: { insights: [], patterns: [], recommendations: [] },
          },
        ],
        agentConfig: {
          id: 'healthcare-agent',
          name: 'Healthcare AI Agent',
          description: 'Specialized agent for healthcare data processing',
          domain: 'healthcare',
          capabilities: [
            'medical-terminology-extraction',
            'patient-data-analysis',
            'compliance-checking',
          ],
          tools: ['medical-terminology-extractor', 'hipaa-compliance-check', 'data-analysis'],
          compliance: { hipaa: true, gdpr: true },
          reasoningMode: 'thinking',
          modelPreference: 'glm-45-flagship',
        },
        reasoningMode: 'thinking',
        autoRouting: false,
        budget: { maxCost: 1, currency: 'USD' },
        compliance: { hipaa: true, gdpr: true },
      },
    ];

    for (const workflow of defaultWorkflows) {
      this.workflows.set(workflow.id, workflow);
    }
  }

  // Workflow Management
  registerWorkflow(workflow: AgenticWorkflow): void {
    this.workflows.set(workflow.id, workflow);
  }

  getWorkflow(workflowId: string): AgenticWorkflow | undefined {
    return this.workflows.get(workflowId);
  }

  getAvailableWorkflows(): AgenticWorkflow[] {
    return Array.from(this.workflows.values());
  }

  // Workflow Execution
  async executeWorkflow(
    workflowId: string,
    inputData: any,
    options?: {
      reasoningMode?: 'thinking' | 'non-thinking' | 'hybrid';
      forceModel?: string;
      budget?: number;
    }
  ): Promise<AgenticExecution> {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) {
      throw new EnhancedError(`Workflow ${workflowId} not found`);
    }

    const executionId = `exec-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
    const execution: AgenticExecution = {
      id: executionId,
      workflowId,
      status: 'pending',
      results: new Map(),
      errors: [],
      startTime: new Date(),
      metadata: {
        totalCost: 0,
        tokensUsed: 0,
        modelSwitches: 0,
        toolCalls: 0,
        reasoningDepth: 0,
      },
    };

    this.executions.set(executionId, execution);

    try {
      execution.status = 'running';

      const reasoningMode = options?.reasoningMode || workflow.reasoningMode;
      const context = {
        inputData,
        workflow,
        execution,
        reasoningMode,
        budget: options?.budget || workflow.budget?.maxCost || 0,
        forceModel: options?.forceModel,
      };

      // Execute tasks in sequence
      for (const task of workflow.tasks) {
        execution.currentTaskId = task.id;

        try {
          const result = await this.executeTask(task, context);
          execution.results.set(task.id, result);
        } catch (error: any) {
          execution.errors.push(`Task ${task.id} failed: ${error.message}`);
          throw error;
        }
      }

      execution.status = 'completed';
      execution.endTime = new Date();
    } catch (error: any) {
      execution.status = 'failed';
      execution.endTime = new Date();
      execution.errors.push(error.message);
    }

    return execution;
  }

  private async executeTask(task: AgenticTask, context: any): Promise<any> {
    const { reasoningMode, workflow, execution } = context;

    // Determine the best reasoning approach based on task complexity and mode
    const approach = this.determineReasoningApproach(task, reasoningMode);

    switch (approach.mode) {
      case 'thinking':
        return await this.executeWithThinkingMode(task, context, approach.config);
      case 'non-thinking':
        return await this.executeWithNonThinkingMode(task, context, approach.config);
      case 'hybrid':
        return await this.executeWithHybridMode(task, context, approach.config);
      default:
        throw new EnhancedError(`Unknown reasoning mode: ${approach.mode}`);
    }
  }

  private determineReasoningApproach(
    task: AgenticTask,
    workflowMode: string
  ): {
    mode: 'thinking' | 'non-thinking' | 'hybrid';
    config: any;
  } {
    const complexityScore = this.getComplexityScore(task.complexity);
    const priorityScore = this.getPriorityScore(task.priority);

    // Default configurations
    const thinkingConfig: ThinkingModeConfig = {
      enabled: true,
      maxDepth: 5,
      timeout: 30000,
      selfReflection: true,
      stepByStepAnalysis: true,
      toolOrchestration: true,
      confidenceThreshold: 0.8,
    };

    const nonThinkingConfig: NonThinkingModeConfig = {
      enabled: true,
      maxTokens: 1000,
      temperature: 0.7,
      responseTime: 2000,
      cacheEnabled: true,
    };

    const hybridConfig: HybridModeConfig = {
      thinkingConfig,
      nonThinkingConfig,
      autoSwitch: true,
      complexityThreshold: 0.6,
      costThreshold: 0.05,
      timeThreshold: 5000,
    };

    switch (workflowMode) {
      case 'thinking':
        return { mode: 'thinking', config: thinkingConfig };
      case 'non-thinking':
        return { mode: 'non-thinking', config: nonThinkingConfig };
      case 'hybrid':
        // Auto-switch based on task complexity
        if (complexityScore >= hybridConfig.complexityThreshold) {
          return { mode: 'thinking', config: thinkingConfig };
        } else {
          return { mode: 'non-thinking', config: nonThinkingConfig };
        }
      default:
        return { mode: 'hybrid', config: hybridConfig };
    }
  }

  private getComplexityScore(complexity: string): number {
    const scores = {
      simple: 0.2,
      moderate: 0.5,
      complex: 0.8,
      expert: 1,
    };
    return scores[complexity as keyof typeof scores] || 0.5;
  }

  private getPriorityScore(priority: string): number {
    const scores = {
      low: 0.2,
      medium: 0.5,
      high: 0.8,
      critical: 1,
    };
    return scores[priority as keyof typeof scores] || 0.5;
  }

  private async executeWithThinkingMode(
    task: AgenticTask,
    context: any,
    config: ThinkingModeConfig
  ): Promise<any> {
    const { execution, workflow } = context;
    const reasoningSteps: ReasoningStep[] = [];

    // Step 1: Task Analysis
    const analysisStep: ReasoningStep = {
      id: `${task.id}-analysis`,
      type: 'analysis',
      content: `Analyzing task: ${task.name}. Complexity: ${task.complexity}, Priority: ${task.priority}`,
      confidence: 0.9,
      timestamp: new Date(),
    };
    reasoningSteps.push(analysisStep);

    // Step 2: Planning
    const plan = this.createTaskPlan(task, config);
    const planningStep: ReasoningStep = {
      id: `${task.id}-planning`,
      type: 'planning',
      content: `Created execution plan with ${plan.steps.length} steps`,
      confidence: 0.85,
      timestamp: new Date(),
      dependencies: [analysisStep.id],
      output: plan,
    };
    reasoningSteps.push(planningStep);

    // Step 3: Tool Selection and Orchestration
    const tools = await this.selectToolsForTask(task, workflow.agentConfig);
    const toolSelectionStep: ReasoningStep = {
      id: `${task.id}-tool-selection`,
      type: 'tool-selection',
      content: `Selected ${tools.length} tools for task execution`,
      confidence: 0.8,
      timestamp: new Date(),
      dependencies: [planningStep.id],
      output: { tools: tools.map(t => t.id) },
    };
    reasoningSteps.push(toolSelectionStep);

    // Step 4: Execute with Tool Orchestration
    let toolResults: any[] = [];
    if (config.toolOrchestration && tools.length > 0) {
      toolResults = await this.orchestrateTools(task, tools, context);
      execution.metadata.toolCalls += tools.length;
    }

    // Step 5: AI Model Reasoning
    const aiResult = await this.performAIReasoning(task, context, {
      mode: 'thinking',
      context: {
        task,
        plan,
        tools,
        toolResults,
        reasoningSteps,
      },
    });

    // Step 6: Validation and Self-Reflection
    if (config.selfReflection) {
      const validationResult = await this.validateAndReflect(task, aiResult, context);
      const validationStep: ReasoningStep = {
        id: `${task.id}-validation`,
        type: 'validation',
        content: `Validated result with confidence ${validationResult.confidence}`,
        confidence: validationResult.confidence,
        timestamp: new Date(),
        dependencies: [toolSelectionStep.id],
        output: validationResult,
      };
      reasoningSteps.push(validationStep);

      if (validationResult.confidence < config.confidenceThreshold) {
        // Retry with refined approach
        return await this.retryWithRefinedApproach(task, context, validationResult, reasoningSteps);
      }
    }

    // Step 7: Synthesis
    const finalResult = this.synthesizeResults(task, aiResult, toolResults, reasoningSteps);
    const synthesisStep: ReasoningStep = {
      id: `${task.id}-synthesis`,
      type: 'synthesis',
      content: 'Synthesized final result from all reasoning steps',
      confidence: this.calculateResultConfidence(finalResult, reasoningSteps),
      timestamp: new Date(),
      dependencies: reasoningSteps.map(s => s.id),
      output: finalResult,
    };
    reasoningSteps.push(synthesisStep);

    // Store reasoning history
    this.reasoningHistory.set(`${execution.id}-${task.id}`, reasoningSteps);
    execution.metadata.reasoningDepth = Math.max(
      execution.metadata.reasoningDepth,
      reasoningSteps.length
    );

    return finalResult;
  }

  private async executeWithNonThinkingMode(
    task: AgenticTask,
    context: any,
    config: NonThinkingModeConfig
  ): Promise<any> {
    const { execution } = context;

    // Direct execution with minimal reasoning
    const startTime = Date.now();

    // Check cache first if enabled
    if (config.cacheEnabled) {
      const cachedResult = await this.checkCache(task);
      if (cachedResult) {
        return cachedResult;
      }
    }

    // Execute with AI model directly
    const result = await this.performAIReasoning(task, context, {
      mode: 'non-thinking',
      config,
    });

    // Update execution metadata
    execution.metadata.tokensUsed += this.estimateTokensUsed(task, result);
    const executionTime = Date.now() - startTime;

    // Cache result if enabled and execution was fast enough
    if (config.cacheEnabled && executionTime < config.responseTime) {
      await this.cacheResult(task, result);
    }

    return result;
  }

  private async executeWithHybridMode(
    task: AgenticTask,
    context: any,
    config: HybridModeConfig
  ): Promise<any> {
    const complexityScore = this.getComplexityScore(task.complexity);
    const { execution } = context;

    // Start with non-thinking mode for quick assessment
    const quickResult = await this.executeWithNonThinkingMode(
      task,
      context,
      config.nonThinkingConfig
    );
    const quickAssessment = await this.assessResultQuality(task, quickResult);

    // Decide whether to switch to thinking mode
    if (
      config.autoSwitch &&
      (complexityScore >= config.complexityThreshold ||
        quickAssessment.confidence < 0.7 ||
        quickAssessment.costEstimate > config.costThreshold)
    ) {
      // Switch to thinking mode for deeper analysis
      const detailedResult = await this.executeWithThinkingMode(
        task,
        context,
        config.thinkingConfig
      );
      execution.metadata.modelSwitches++;

      return {
        ...detailedResult,
        hybrid: {
          quickAssessment,
          detailedAnalysis: detailedResult,
          switchReason: 'complexity-or-quality-threshold',
        },
      };
    }

    // Return quick result with metadata
    return {
      ...quickResult,
      hybrid: {
        quickAssessment,
        mode: 'non-thinking',
        reason: 'sufficient-quality-and-speed',
      },
    };
  }

  private createTaskPlan(task: AgenticTask, config: ThinkingModeConfig): any {
    const steps = [
      'analyze-input',
      'select-approach',
      'execute-tools',
      'validate-results',
      'synthesize-output',
    ];

    if (config.stepByStepAnalysis) {
      steps.splice(2, 0, 'step-by-step-reasoning');
    }

    return {
      steps,
      estimatedDuration: this.estimateTaskDuration(task, config),
      confidence: 0.8,
    };
  }

  private async selectToolsForTask(task: AgenticTask, agentConfig: MCPAgentConfig): Promise<any[]> {
    const availableTools = mcpService.getAvailableTools();
    const relevantTools = availableTools.filter(
      tool => agentConfig.tools.includes(tool.id) || this.isToolRelevantForTask(tool, task)
    );

    // Prioritize tools based on task type and complexity
    return relevantTools
      .map(tool => ({
        tool,
        relevance: this.calculateToolRelevance(tool, task),
      }))
      .filter(item => item.relevance > 0.5)
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 3) // Limit to top 3 tools
      .map(item => item.tool);
  }

  private isToolRelevantForTask(tool: any, task: AgenticTask): boolean {
    const relevanceMap = {
      analysis: ['analysis', 'search', 'domain'],
      generation: ['system', 'analysis'],
      transformation: ['system', 'analysis'],
      validation: ['compliance', 'analysis'],
    };

    return relevanceMap[task.type]?.includes(tool.category) || false;
  }

  private calculateToolRelevance(tool: any, task: AgenticTask): number {
    let relevance = 0.5; // Base relevance

    // Boost relevance based on task type and tool category
    if (task.type === 'analysis' && tool.category === 'analysis') relevance += 0.3;
    if (task.type === 'validation' && tool.category === 'compliance') relevance += 0.3;
    if (task.complexity === 'expert' && tool.category === 'domain') relevance += 0.2;

    return Math.min(relevance, 1);
  }

  private async orchestrateTools(task: AgenticTask, tools: any[], context: any): Promise<any[]> {
    const results: any[] = [];

    for (const tool of tools) {
      try {
        const toolRequest: MCPToolRequest = {
          toolId: tool.id,
          parameters: this.prepareToolParameters(tool, task, context),
          priority: task.priority,
        };

        const toolResponse = await mcpService.executeTool(toolRequest);
        results.push({
          toolId: tool.id,
          success: toolResponse.success,
          result: toolResponse.result,
          error: toolResponse.error,
          processingTime: toolResponse.processingTime,
        });
      } catch (error: any) {
        results.push({
          toolId: tool.id,
          success: false,
          error: error.message,
          processingTime: 0,
        });
      }
    }

    return results;
  }

  private prepareToolParameters(tool: any, task: AgenticTask, context: any): any {
    // This would be customized based on the specific tool and task
    const baseParams = {
      taskId: task.id,
      taskType: task.type,
      input: task.input,
      context,
    };

    // Add tool-specific parameters
    switch (tool.id) {
      case 'sentiment-analysis':
        return { ...baseParams, text: task.input.text || '' };
      case 'data-analysis':
        return { ...baseParams, dataset: task.input.data || [] };
      case 'hipaa-compliance-check':
        return { ...baseParams, data: task.input.data || {} };
      default:
        return baseParams;
    }
  }

  private async performAIReasoning(task: AgenticTask, context: any, options: any): Promise<any> {
    const { workflow, execution, forceModel } = context;
    const agentConfig = workflow.agentConfig;

    // Prepare prompt based on reasoning mode
    const prompt = this.buildPrompt(task, options);

    try {
      // Determine which AI service to use
      if (forceModel || agentConfig.modelPreference.startsWith('glm-45')) {
        // Use Z.AI service
        const zaiRequest: ZAIAnalysisRequest = {
          imageBase64: '', // Would be populated if image input
          analysisType: task.type,
          modelId: forceModel || agentConfig.modelPreference,
          customPrompt: prompt,
        };

        const zaiResponse = await zaiApiService.analyzeWithModel(zaiRequest);
        execution.metadata.totalCost += this.estimateZAICost(zaiResponse);
        execution.metadata.tokensUsed += this.estimateTokensUsed(prompt, zaiResponse.result);

        return zaiResponse.result;
      } else {
        // Use OpenRouter service
        const openRouterRequest: OpenRouterAnalysisRequest = {
          prompt,
          modelId: forceModel || this.selectOpenRouterModel(task, agentConfig),
          temperature: options.config?.temperature || 0.7,
          maxTokens: options.config?.maxTokens || 1000,
        };

        const openRouterResponse = await openRouterService.analyzeWithModel(openRouterRequest);
        execution.metadata.totalCost += this.estimateOpenRouterCost(openRouterResponse);
        execution.metadata.tokensUsed += openRouterResponse.usage.totalTokens;

        return openRouterResponse.result;
      }
    } catch (error: any) {
      throw new EnhancedError(`AI reasoning failed: ${error.message}`);
    }
  }

  private buildPrompt(task: AgenticTask, options: any): string {
    const { mode, context } = options;

    let prompt = `Task: ${task.name}\n`;
    prompt += `Description: ${task.description}\n`;
    prompt += `Type: ${task.type}\n`;
    prompt += `Complexity: ${task.complexity}\n`;
    prompt += `Priority: ${task.priority}\n\n`;

    prompt += `Input Data:\n${JSON.stringify(task.input, null, 2)}\n\n`;

    if (mode === 'thinking') {
      prompt += `Reasoning Mode: Thinking\n`;
      prompt += `Please provide step-by-step analysis with deep reasoning.\n`;
      prompt += `Include self-reflection and confidence assessment.\n`;

      if (context?.plan) {
        prompt += `\nExecution Plan: ${JSON.stringify(context.plan, null, 2)}\n`;
      }

      if (context?.tools?.length > 0) {
        prompt += `\nAvailable Tools: ${context.tools.map((t: any) => t.name).join(', ')}\n`;
      }
    } else {
      prompt += `Reasoning Mode: Non-Thinking\n`;
      prompt += `Please provide a direct, concise response.\n`;
    }

    prompt += `\nExpected Output Format: ${JSON.stringify(task.expectedOutput, null, 2)}\n`;

    return prompt;
  }

  private selectOpenRouterModel(task: AgenticTask, agentConfig: MCPAgentConfig): string {
    // Model selection logic based on task and agent preferences
    if (task.complexity === 'expert' || task.priority === 'critical') {
      return 'gpt-4o'; // Use most capable model
    } else if (task.complexity === 'simple') {
      return 'gpt-4o-mini'; // Use faster, cheaper model
    } else {
      return 'claude-3.5-sonnet'; // Balanced model
    }
  }

  private async validateAndReflect(task: AgenticTask, result: any, context: any): Promise<any> {
    // Validate result against expected output format
    const validation = this.validateResultFormat(result, task.expectedOutput);

    // Perform self-reflection on the result quality
    const reflection = await this.performSelfReflection(task, result, context);

    return {
      valid: validation.valid,
      errors: validation.errors,
      confidence: reflection.confidence,
      improvements: reflection.improvements,
      shouldRetry: reflection.confidence < 0.7,
    };
  }

  private validateResultFormat(result: any, expectedFormat: any): any {
    // Basic format validation
    const errors: string[] = [];
    let valid = true;

    if (typeof result !== typeof expectedFormat) {
      errors.push('Result type does not match expected format');
      valid = false;
    }

    // More detailed validation would be implemented here
    return { valid, errors };
  }

  private async performSelfReflection(task: AgenticTask, result: any, context: any): Promise<any> {
    // Use AI to reflect on the result quality
    const reflectionPrompt = `
    Task: ${task.name}
    Result: ${JSON.stringify(result, null, 2)}
    
    Please assess the quality of this result and provide:
    1. Confidence score (0-1)
    2. Potential improvements
    3. Any issues or concerns
    `;

    try {
      const reflectionResult = await this.performAIReasoning(task, context, {
        mode: 'non-thinking',
        config: { maxTokens: 500, temperature: 0.3 },
      });

      return {
        confidence: reflectionResult.confidence || 0.8,
        improvements: reflectionResult.improvements || [],
        issues: reflectionResult.issues || [],
      };
    } catch {
      return {
        confidence: 0.7,
        improvements: [],
        issues: ['Reflection failed'],
      };
    }
  }

  private async retryWithRefinedApproach(
    task: AgenticTask,
    context: any,
    validationResult: any,
    reasoningSteps: ReasoningStep[]
  ): Promise<any> {
    // Refine approach based on validation results
    const refinedContext = {
      ...context,
      previousResult: validationResult,
      improvements: validationResult.improvements,
    };

    // Retry with refined prompt or parameters
    return await this.performAIReasoning(task, refinedContext, {
      mode: 'thinking',
      context: {
        ...refinedContext,
        reasoningSteps,
        retryAttempt: true,
      },
    });
  }

  private synthesizeResults(
    task: AgenticTask,
    aiResult: any,
    toolResults: any[],
    reasoningSteps: ReasoningStep[]
  ): any {
    // Combine AI reasoning results with tool results
    const synthesis = {
      aiResult,
      toolResults: toolResults.filter(r => r.success),
      reasoningSummary: reasoningSteps.map(s => ({
        type: s.type,
        confidence: s.confidence,
        content: `${s.content.slice(0, 100)}...`,
      })),
      metadata: {
        totalSteps: reasoningSteps.length,
        successfulToolCalls: toolResults.filter(r => r.success).length,
        failedToolCalls: toolResults.filter(r => !r.success).length,
        overallConfidence: this.calculateResultConfidence(aiResult, reasoningSteps),
      },
    };

    return synthesis;
  }

  private calculateResultConfidence(result: any, reasoningSteps: ReasoningStep[]): number {
    if (reasoningSteps.length === 0) return 0.5;

    const confidences = reasoningSteps.map(s => s.confidence);
    const avgConfidence = confidences.reduce((sum, c) => sum + c, 0) / confidences.length;

    // Weight later steps more heavily
    const weightedSum = confidences.reduce((sum, c, i) => sum + c * (i + 1), 0);
    const weightedAvg = weightedSum / confidences.reduce((sum, _, i) => sum + (i + 1), 0);

    return (avgConfidence + weightedAvg) / 2;
  }

  private async assessResultQuality(task: AgenticTask, result: any): Promise<any> {
    // Quick quality assessment for hybrid mode decision making
    return {
      confidence: 0.8, // Would be calculated based on result analysis
      costEstimate: 0.02, // Would be estimated based on tokens used
      qualityScore: 0.75, // Would be calculated based on various metrics
    };
  }

  private estimateTaskDuration(task: AgenticTask, config: ThinkingModeConfig): number {
    // Estimate task duration based on complexity and configuration
    const baseTime = {
      simple: 1000,
      moderate: 3000,
      complex: 8000,
      expert: 15000,
    };

    return baseTime[task.complexity as keyof typeof baseTime] * (config.maxDepth / 3);
  }

  private estimateTokensUsed(input: any, output: any): number {
    // Rough token estimation
    const inputStr = JSON.stringify(input);
    const outputStr = JSON.stringify(output);
    return Math.ceil((inputStr.length + outputStr.length) / 4);
  }

  private estimateZAICost(response: ZAIAnalysisResponse): number {
    // Estimate cost based on Z.AI pricing (would be configurable)
    return (this.estimateTokensUsed({}, response.result) / 1000) * 0.002;
  }

  private estimateOpenRouterCost(response: OpenRouterAnalysisResponse): number {
    // Use OpenRouter's cost estimation
    return response.usage
      ? (response.usage.promptTokens / 1000) * 0.002 +
          (response.usage.completionTokens / 1000) * 0.01
      : 0.01;
  }

  private async checkCache(task: AgenticTask): Promise<any | null> {
    // Cache implementation would go here
    return getRealData(); // Placeholder
  }

  private async cacheResult(task: AgenticTask, result: any): Promise<void> {
    // Cache implementation would go here
  }

  // Execution Management
  getExecution(executionId: string): AgenticExecution | undefined {
    return this.executions.get(executionId);
  }

  getExecutions(): AgenticExecution[] {
    return Array.from(this.executions.values());
  }

  getReasoningHistory(
    executionId: string,
    taskId?: string
  ): ReasoningStep[] | Map<string, ReasoningStep[]> {
    if (taskId) {
      return this.reasoningHistory.get(`${executionId}-${taskId}`) || [];
    }
    return this.reasoningHistory;
  }

  // Performance Metrics
  getPerformanceMetrics(workflowId?: string): any {
    if (workflowId) {
      return this.performanceMetrics.get(workflowId);
    }
    return Object.fromEntries(this.performanceMetrics);
  }

  updatePerformanceMetrics(workflowId: string, execution: AgenticExecution): void {
    const existing = this.performanceMetrics.get(workflowId) || {
      totalExecutions: 0,
      successfulExecutions: 0,
      averageExecutionTime: 0,
      averageCost: 0,
      averageTokensUsed: 0,
    };

    const executionTime = execution.endTime
      ? execution.endTime.getTime() - execution.startTime.getTime()
      : 0;

    const updated = {
      totalExecutions: existing.totalExecutions + 1,
      successfulExecutions:
        existing.successfulExecutions + (execution.status === 'completed' ? 1 : 0),
      averageExecutionTime:
        (existing.averageExecutionTime * existing.totalExecutions + executionTime) /
        (existing.totalExecutions + 1),
      averageCost:
        (existing.averageCost * existing.totalExecutions + execution.metadata.totalCost) /
        (existing.totalExecutions + 1),
      averageTokensUsed:
        (existing.averageTokensUsed * existing.totalExecutions + execution.metadata.tokensUsed) /
        (existing.totalExecutions + 1),
    };

    this.performanceMetrics.set(workflowId, updated);
  }
}

// Export singleton instance
export const agenticWorkflowEngine = new AgenticWorkflowEngine();

// Enhanced error class with better error handling
class EnhancedError extends Error {
  constructor(
    message: string,
    public code: string = 'UNKNOWN_ERROR',
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message);
    this.name = 'EnhancedError';
    Error.captureStackTrace(this, EnhancedError);
  }
  
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      details: this.details,
      stack: this.stack
    };
  }
}
