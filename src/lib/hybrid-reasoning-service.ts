// Hybrid Reasoning Service
// Implements intelligent mode switching and auto-routing between GLM-4.5 and OpenRouter models

import { zaiApiService, ZAIAnalysisRequest, ZAIAnalysisResponse } from './zai-api-service';
import { openRouterService, OpenRouterAnalysisRequest, OpenRouterAnalysisResponse } from './openrouter-service';
import { agenticWorkflowEngine, AgenticTask, ThinkingModeConfig, NonThinkingModeConfig, HybridModeConfig } from './agentic-workflow-engine';

export interface ReasoningMode {
  id: string;
  name: string;
  description: string;
  type: 'thinking' | 'non-thinking' | 'hybrid';
  characteristics: {
    depth: number;
    speed: number;
    cost: number;
    accuracy: number;
    creativity: number;
  };
  suitableFor: string[];
  models: string[];
}

export interface RoutingDecision {
  selectedMode: 'thinking' | 'non-thinking' | 'hybrid';
  selectedModel: string;
  confidence: number;
  reasoning: {
    complexity: number;
    urgency: number;
    costSensitivity: number;
    qualityRequired: number;
  };
  estimatedMetrics: {
    processingTime: number;
    cost: number;
    accuracy: number;
    tokenUsage: number;
  };
}

export interface ModeSwitchTrigger {
  type: 'complexity' | 'cost' | 'time' | 'quality' | 'error';
  threshold: number;
  condition: string;
  action: 'switch-to-thinking' | 'switch-to-non-thinking' | 'escalate' | 'retry';
}

export interface AutoRoutingConfig {
  enabled: boolean;
  strategy: 'cost-optimized' | 'quality-optimized' | 'balanced' | 'custom';
  rules: RoutingRule[];
  fallbackModel: string;
  maxRetries: number;
  timeout: number;
}

export interface RoutingRule {
  id: string;
  name: string;
  priority: number;
  conditions: RuleCondition[];
  action: RoutingAction;
  weight: number;
}

export interface RuleCondition {
  field: 'complexity' | 'urgency' | 'cost' | 'quality' | 'domain' | 'taskType' | 'userPreference';
  operator: 'equals' | 'greater-than' | 'less-than' | 'contains' | 'matches';
  value: any;
}

export interface RoutingAction {
  mode: 'thinking' | 'non-thinking' | 'hybrid';
  model: string;
  parameters: any;
}

export interface PerformanceMetrics {
  mode: string;
  model: string;
  processingTime: number;
  cost: number;
  accuracy: number;
  tokenUsage: number;
  success: boolean;
  timestamp: Date;
}

export interface HybridReasoningSession {
  id: string;
  taskId: string;
  initialMode: string;
  modeHistory: ModeTransition[];
  finalMode: string;
  totalProcessingTime: number;
  totalCost: number;
  success: boolean;
  triggers: string[];
}

export interface ModeTransition {
  from: string;
  to: string;
  timestamp: Date;
  reason: string;
  confidence: number;
  metrics: PerformanceMetrics;
}

// Predefined reasoning modes
export const REASONING_MODES: ReasoningMode[] = [
  {
    id: 'thinking-deep',
    name: 'Deep Thinking Mode',
    description: 'Comprehensive reasoning with self-reflection and tool orchestration',
    type: 'thinking',
    characteristics: {
      depth: 0.95,
      speed: 0.3,
      cost: 0.9,
      accuracy: 0.95,
      creativity: 0.85
    },
    suitableFor: ['complex-analysis', 'strategic-planning', 'creative-problem-solving', 'research'],
    models: ['glm-45-flagship', 'glm-45-auto-think', 'gpt-4o', 'claude-3.5-sonnet']
  },
  {
    id: 'thinking-balanced',
    name: 'Balanced Thinking Mode',
    description: 'Moderate reasoning with good balance of speed and depth',
    type: 'thinking',
    characteristics: {
      depth: 0.75,
      speed: 0.6,
      cost: 0.6,
      accuracy: 0.85,
      creativity: 0.7
    },
    suitableFor: ['standard-analysis', 'decision-making', 'content-generation'],
    models: ['glm-45-auto-think', 'glm-45-full-stack', 'claude-3.5-sonnet', 'gpt-4o-mini']
  },
  {
    id: 'non-thinking-fast',
    name: 'Fast Non-Thinking Mode',
    description: 'Rapid response generation with minimal reasoning',
    type: 'non-thinking',
    characteristics: {
      depth: 0.3,
      speed: 0.95,
      cost: 0.2,
      accuracy: 0.7,
      creativity: 0.4
    },
    suitableFor: ['quick-responses', 'simple-queries', 'data-retrieval', 'basic-classification'],
    models: ['glm-45-air', 'gpt-4o-mini', 'claude-3.5-haiku', 'gemini-flash']
  },
  {
    id: 'non-thinking-balanced',
    name: 'Balanced Non-Thinking Mode',
    description: 'Fast but reasonably accurate responses for everyday tasks',
    type: 'non-thinking',
    characteristics: {
      depth: 0.5,
      speed: 0.8,
      cost: 0.4,
      accuracy: 0.8,
      creativity: 0.6
    },
    suitableFor: ['customer-service', 'content-summarization', 'basic-analysis'],
    models: ['glm-45-full-stack', 'gpt-4o', 'claude-3.5-sonnet', 'gemini-pro']
  },
  {
    id: 'hybrid-adaptive',
    name: 'Adaptive Hybrid Mode',
    description: 'Intelligently switches between thinking and non-thinking based on context',
    type: 'hybrid',
    characteristics: {
      depth: 0.7,
      speed: 0.7,
      cost: 0.5,
      accuracy: 0.85,
      creativity: 0.75
    },
    suitableFor: ['mixed-workflows', 'uncertain-complexity', 'cost-sensitive-tasks'],
    models: ['glm-45-flagship', 'glm-45-auto-think', 'gpt-4o', 'openrouter-auto']
  }
];

class HybridReasoningService {
  private routingConfig: AutoRoutingConfig;
  private performanceHistory: PerformanceMetrics[] = [];
  private sessionHistory: HybridReasoningSession[] = [];
  private modeSwitchTriggers: ModeSwitchTrigger[] = [];
  private modelCapabilities: Map<string, any> = new Map();

  constructor() {
    this.initializeRoutingConfig();
    this.initializeModeSwitchTriggers();
    this.initializeModelCapabilities();
  }

  private initializeRoutingConfig(): void {
    this.routingConfig = {
      enabled: true,
      strategy: 'balanced',
      rules: [
        {
          id: 'high-complexity-thinking',
          name: 'High Complexity Tasks Use Thinking Mode',
          priority: 1,
          conditions: [
            { field: 'complexity', operator: 'greater-than', value: 0.7 }
          ],
          action: {
            mode: 'thinking',
            model: 'glm-45-flagship',
            parameters: { maxDepth: 5, selfReflection: true }
          },
          weight: 0.9
        },
        {
          id: 'low-complexity-non-thinking',
          name: 'Low Complexity Tasks Use Non-Thinking Mode',
          priority: 1,
          conditions: [
            { field: 'complexity', operator: 'less-than', value: 0.4 }
          ],
          action: {
            mode: 'non-thinking',
            model: 'glm-45-air',
            parameters: { maxTokens: 500, temperature: 0.7 }
          },
          weight: 0.8
        },
        {
          id: 'urgent-fast-mode',
          name: 'Urgent Tasks Use Fast Mode',
          priority: 2,
          conditions: [
            { field: 'urgency', operator: 'greater-than', value: 0.8 }
          ],
          action: {
            mode: 'non-thinking',
            model: 'gpt-4o-mini',
            parameters: { maxTokens: 300, temperature: 0.5 }
          },
          weight: 0.85
        },
        {
          id: 'cost-sensitive-cheap',
          name: 'Cost Sensitive Tasks Use Cheap Models',
          priority: 1,
          conditions: [
            { field: 'cost', operator: 'greater-than', value: 0.8 }
          ],
          action: {
            mode: 'non-thinking',
            model: 'gpt-4o-mini',
            parameters: { maxTokens: 250, temperature: 0.3 }
          },
          weight: 0.7
        },
        {
          id: 'quality-critical-thinking',
          name: 'Quality Critical Tasks Use Thinking Mode',
          priority: 2,
          conditions: [
            { field: 'quality', operator: 'greater-than', value: 0.8 }
          ],
          action: {
            mode: 'thinking',
            model: 'glm-45-flagship',
            parameters: { maxDepth: 3, selfReflection: true }
          },
          weight: 0.95
        },
        {
          id: 'healthcare-strict',
          name: 'Healthcare Domain Uses Strict Thinking Mode',
          priority: 3,
          conditions: [
            { field: 'domain', operator: 'equals', value: 'healthcare' }
          ],
          action: {
            mode: 'thinking',
            model: 'glm-45-flagship',
            parameters: { maxDepth: 4, selfReflection: true, compliance: 'strict' }
          },
          weight: 1
        },
        {
          id: 'legal-detailed',
          name: 'Legal Domain Uses Detailed Analysis',
          priority: 3,
          conditions: [
            { field: 'domain', operator: 'equals', value: 'legal' }
          ],
          action: {
            mode: 'thinking',
            model: 'glm-45-auto-think',
            parameters: { maxDepth: 3, selfReflection: true, jurisdiction: 'auto' }
          },
          weight: 0.9
        },
        {
          id: 'customer-service-fast',
          name: 'Customer Service Uses Fast Response',
          priority: 2,
          conditions: [
            { field: 'domain', operator: 'equals', value: 'customer-service' }
          ],
          action: {
            mode: 'non-thinking',
            model: 'gpt-4o',
            parameters: { maxTokens: 400, temperature: 0.6 }
          },
          weight: 0.8
        },
        {
          id: 'default-balanced',
          name: 'Default Balanced Approach',
          priority: 0,
          conditions: [],
          action: {
            mode: 'hybrid',
            model: 'openrouter-auto',
            parameters: { autoSwitch: true, complexityThreshold: 0.6 }
          },
          weight: 0.5
        }
      ],
      fallbackModel: 'gpt-4o',
      maxRetries: 3,
      timeout: 30000
    };
  }

  private initializeModeSwitchTriggers(): void {
    this.modeSwitchTriggers = [
      {
        type: 'complexity',
        threshold: 0.7,
        condition: 'task.complexity > 0.7 && currentMode === "non-thinking"',
        action: 'switch-to-thinking'
      },
      {
        type: 'cost',
        threshold: 0.1,
        condition: 'estimatedCost > 0.1 && currentMode === "thinking"',
        action: 'switch-to-non-thinking'
      },
      {
        type: 'time',
        threshold: 10000,
        condition: 'processingTime > 10000 && currentMode === "thinking"',
        action: 'switch-to-non-thinking'
      },
      {
        type: 'quality',
        threshold: 0.6,
        condition: 'confidence < 0.6 && currentMode === "non-thinking"',
        action: 'switch-to-thinking'
      },
      {
        type: 'error',
        threshold: 0.5,
        condition: 'errorRate > 0.5',
        action: 'retry'
      }
    ];
  }

  private initializeModelCapabilities(): void {
    // Initialize model capabilities for intelligent routing
    this.modelCapabilities.set('glm-45-flagship', {
      reasoning: 0.95,
      speed: 0.4,
      cost: 0.9,
      accuracy: 0.95,
      creativity: 0.85,
      multimodal: true,
      maxTokens: 8192,
      bestFor: ['complex-reasoning', 'creative-tasks', 'multimodal-analysis']
    });

    this.modelCapabilities.set('glm-45-auto-think', {
      reasoning: 0.9,
      speed: 0.6,
      cost: 0.7,
      accuracy: 0.9,
      creativity: 0.8,
      multimodal: false,
      maxTokens: 4096,
      bestFor: ['step-by-step-reasoning', 'self-reflection', 'logical-analysis']
    });

    this.modelCapabilities.set('glm-45v', {
      reasoning: 0.85,
      speed: 0.5,
      cost: 0.8,
      accuracy: 0.9,
      creativity: 0.75,
      multimodal: true,
      maxTokens: 4096,
      bestFor: ['visual-analysis', 'image-understanding', 'multimodal-tasks']
    });

    this.modelCapabilities.set('glm-45-air', {
      reasoning: 0.7,
      speed: 0.9,
      cost: 0.3,
      accuracy: 0.8,
      creativity: 0.6,
      multimodal: false,
      maxTokens: 2048,
      bestFor: ['fast-responses', 'simple-queries', 'cost-sensitive-tasks']
    });

    this.modelCapabilities.set('glm-45-full-stack', {
      reasoning: 0.8,
      speed: 0.7,
      cost: 0.6,
      accuracy: 0.85,
      creativity: 0.75,
      multimodal: true,
      maxTokens: 4096,
      bestFor: ['balanced-tasks', 'full-stack-analysis', 'multi-domain']
    });

    this.modelCapabilities.set('gpt-4o', {
      reasoning: 0.9,
      speed: 0.7,
      cost: 0.8,
      accuracy: 0.9,
      creativity: 0.85,
      multimodal: true,
      maxTokens: 4096,
      bestFor: ['general-purpose', 'multimodal', 'balanced-performance']
    });

    this.modelCapabilities.set('gpt-4o-mini', {
      reasoning: 0.7,
      speed: 0.95,
      cost: 0.2,
      accuracy: 0.8,
      creativity: 0.6,
      multimodal: true,
      maxTokens: 4096,
      bestFor: ['fast-tasks', 'cost-sensitive', 'high-volume']
    });

    this.modelCapabilities.set('claude-3.5-sonnet', {
      reasoning: 0.85,
      speed: 0.8,
      cost: 0.6,
      accuracy: 0.9,
      creativity: 0.9,
      multimodal: false,
      maxTokens: 8192,
      bestFor: ['creative-writing', 'analysis', 'long-context']
    });

    this.modelCapabilities.set('claude-3.5-haiku', {
      reasoning: 0.6,
      speed: 0.95,
      cost: 0.1,
      accuracy: 0.75,
      creativity: 0.7,
      multimodal: false,
      maxTokens: 4096,
      bestFor: ['quick-responses', 'chat', 'simple-tasks']
    });

    this.modelCapabilities.set('gemini-pro', {
      reasoning: 0.8,
      speed: 0.7,
      cost: 0.4,
      accuracy: 0.85,
      creativity: 0.7,
      multimodal: true,
      maxTokens: 8192,
      bestFor: ['general-analysis', 'multimodal', 'cost-effective']
    });

    this.modelCapabilities.set('gemini-flash', {
      reasoning: 0.6,
      speed: 0.9,
      cost: 0.15,
      accuracy: 0.75,
      creativity: 0.5,
      multimodal: true,
      maxTokens: 4096,
      bestFor: ['fast-tasks', 'simple-queries', 'high-volume']
    });
  }

  // Main routing method
  async makeRoutingDecision(task: AgenticTask, context?: any): Promise<RoutingDecision> {
    const startTime = Date.now();

    // Analyze task characteristics
    const taskAnalysis = this.analyzeTaskCharacteristics(task, context);
    
    // Apply routing rules
    const routingDecision = this.applyRoutingRules(taskAnalysis, task);
    
    // Calculate estimated metrics
    const estimatedMetrics = this.calculateEstimatedMetrics(routingDecision, taskAnalysis);
    
    // Apply strategy-specific adjustments
    const adjustedDecision = this.applyStrategyAdjustments(routingDecision, this.routingConfig.strategy);
    
    const finalDecision: RoutingDecision = {
      selectedMode: adjustedDecision.mode,
      selectedModel: adjustedDecision.model,
      confidence: this.calculateDecisionConfidence(adjustedDecision, taskAnalysis),
      reasoning: taskAnalysis,
      estimatedMetrics
    };

    // Log decision for learning
    this.logRoutingDecision(finalDecision, task, Date.now() - startTime);

    return finalDecision;
  }

  private analyzeTaskCharacteristics(task: AgenticTask, context?: any): {
    complexity: number;
    urgency: number;
    costSensitivity: number;
    qualityRequired: number;
    domain: string;
    taskType: string;
  } {
    // Base complexity analysis
    let complexity = this.getComplexityScore(task.complexity);
    
    // Adjust complexity based on task type
    const typeComplexity = {
      'analysis': 0.1,
      'generation': 0.2,
      'transformation': 0.15,
      'validation': 0.25
    };
    complexity += typeComplexity[task.type] || 0;

    // Urgency based on priority and deadline
    let urgency = this.getPriorityScore(task.priority);
    if (task.deadline) {
      const timeToDeadline = task.deadline.getTime() - Date.now();
      if (timeToDeadline < 3600000) { // Less than 1 hour
        urgency += 0.3;
      } else if (timeToDeadline < 86400000) { // Less than 1 day
        urgency += 0.15;
      }
    }

    // Cost sensitivity (inverse of budget)
    let costSensitivity = 0.5; // Default medium sensitivity
    if (context?.budget) {
      const budgetRatio = context.budget / 1; // Normalize to $1
      costSensitivity = Math.max(0, Math.min(1, 1 - budgetRatio));
    }

    // Quality requirements based on task criticality
    let qualityRequired = this.getPriorityScore(task.priority);
    if (task.type === 'validation' || task.complexity === 'expert') {
      qualityRequired += 0.2;
    }

    return {
      complexity: Math.min(1, complexity),
      urgency: Math.min(1, urgency),
      costSensitivity: Math.min(1, costSensitivity),
      qualityRequired: Math.min(1, qualityRequired),
      domain: context?.domain || 'general',
      taskType: task.type
    };
  }

  private getComplexityScore(complexity: string): number {
    const scores = {
      'simple': 0.2,
      'moderate': 0.5,
      'complex': 0.8,
      'expert': 1
    };
    return scores[complexity as keyof typeof scores] || 0.5;
  }

  private getPriorityScore(priority: string): number {
    const scores = {
      'low': 0.2,
      'medium': 0.5,
      'high': 0.8,
      'critical': 1
    };
    return scores[priority as keyof typeof scores] || 0.5;
  }

  private applyRoutingRules(taskAnalysis: any, task: AgenticTask): RoutingAction {
    if (!this.routingConfig.enabled) {
      return {
        mode: 'hybrid',
        model: 'openrouter-auto',
        parameters: {}
      };
    }

    // Sort rules by priority (descending) and weight (descending)
    const sortedRules = [...this.routingConfig.rules]
      .sort((a, b) => {
        if (a.priority !== b.priority) {
          return b.priority - a.priority;
        }
        return b.weight - a.weight;
      });

    // Find first matching rule
    for (const rule of sortedRules) {
      if (this.evaluateRuleConditions(rule.conditions, taskAnalysis, task)) {
        return rule.action;
      }
    }

    // Fallback to default rule
    const defaultRule = this.routingConfig.rules.find(r => r.id === 'default-balanced');
    return defaultRule ? defaultRule.action : {
      mode: 'hybrid',
      model: 'openrouter-auto',
      parameters: {}
    };
  }

  private evaluateRuleConditions(conditions: RuleCondition[], taskAnalysis: any, task: AgenticTask): boolean {
    for (const condition of conditions) {
      if (!this.evaluateCondition(condition, taskAnalysis, task)) {
        return false;
      }
    }
    return true;
  }

  private evaluateCondition(condition: RuleCondition, taskAnalysis: any, task: AgenticTask): boolean {
    let fieldValue: any;

    switch (condition.field) {
      case 'complexity':
        fieldValue = taskAnalysis.complexity;
        break;
      case 'urgency':
        fieldValue = taskAnalysis.urgency;
        break;
      case 'cost':
        fieldValue = taskAnalysis.costSensitivity;
        break;
      case 'quality':
        fieldValue = taskAnalysis.qualityRequired;
        break;
      case 'domain':
        fieldValue = taskAnalysis.domain;
        break;
      case 'taskType':
        fieldValue = taskAnalysis.taskType;
        break;
      case 'userPreference':
        fieldValue = taskAnalysis.userPreference || 'balanced';
        break;
      default:
        return false;
    }

    switch (condition.operator) {
      case 'equals':
        return fieldValue === condition.value;
      case 'greater-than':
        return fieldValue > condition.value;
      case 'less-than':
        return fieldValue < condition.value;
      case 'contains':
        return String(fieldValue).includes(String(condition.value));
      case 'matches':
        return new RegExp(condition.value).test(String(fieldValue));
      default:
        return false;
    }
  }

  private calculateEstimatedMetrics(decision: RoutingAction, taskAnalysis: any): {
    processingTime: number;
    cost: number;
    accuracy: number;
    tokenUsage: number;
  } {
    const modelCapabilities = this.modelCapabilities.get(decision.model);
    if (!modelCapabilities) {
      return {
        processingTime: 5000,
        cost: 0.05,
        accuracy: 0.7,
        tokenUsage: 1000
      };
    }

    // Base metrics from model capabilities
    let processingTime = 10000 / (modelCapabilities.speed || 0.5); // Inverse of speed
    let cost = (modelCapabilities.cost || 0.5) * 0.1; // Base cost multiplier
    let accuracy = modelCapabilities.accuracy || 0.7;
    let tokenUsage = 1000; // Base token usage

    // Adjust based on task characteristics
    if (decision.mode === 'thinking') {
      processingTime *= 2.5; // Thinking mode takes longer
      cost *= 2; // Higher cost
      accuracy *= 1.1; // Better accuracy
      tokenUsage *= 2; // More tokens used
    } else if (decision.mode === 'hybrid') {
      processingTime *= 1.5;
      cost *= 1.3;
      accuracy *= 1.05;
      tokenUsage *= 1.5;
    }

    // Adjust based on task complexity
    processingTime *= (1 + taskAnalysis.complexity * 0.5);
    cost *= (1 + taskAnalysis.complexity * 0.3);
    tokenUsage *= (1 + taskAnalysis.complexity * 0.4);

    // Apply quality requirements
    if (taskAnalysis.qualityRequired > 0.8) {
      processingTime *= 1.2;
      cost *= 1.2;
      accuracy *= 1.05;
    }

    return {
      processingTime: Math.round(processingTime),
      cost: Math.round(cost * 10000) / 10000, // Round to 4 decimal places
      accuracy: Math.min(1, accuracy),
      tokenUsage: Math.round(tokenUsage)
    };
  }

  private applyStrategyAdjustments(decision: RoutingAction, strategy: string): RoutingAction {
    switch (strategy) {
      case 'cost-optimized':
        // Prefer cheaper models and non-thinking mode
        if (decision.mode === 'thinking' && decision.model !== 'glm-45-air') {
          decision.mode = 'non-thinking';
          decision.model = 'gpt-4o-mini';
        }
        break;

      case 'quality-optimized':
        // Prefer more capable models and thinking mode
        if (decision.mode === 'non-thinking') {
          decision.mode = 'thinking';
          decision.model = 'glm-45-flagship';
        }
        break;

      case 'balanced':
        // Keep the decision as-is (already balanced)
        break;

      case 'custom':
        // Apply custom logic based on parameters
        if (decision.parameters?.customStrategy) {
          // Custom strategy implementation would go here
        }
        break;
    }

    return decision;
  }

  private calculateDecisionConfidence(decision: RoutingAction, taskAnalysis: any): number {
    let confidence = 0.8; // Base confidence

    // Adjust based on rule matching quality
    const modelCapabilities = this.modelCapabilities.get(decision.model);
    if (modelCapabilities) {
      // Higher confidence if model is well-suited for task
      const suitability = this.calculateModelSuitability(decision.model, taskAnalysis);
      confidence += suitability * 0.2;
    }

    // Adjust based on strategy alignment
    if (this.routingConfig.strategy === 'cost-optimized' && decision.mode === 'non-thinking') {
      confidence += 0.1;
    }
    if (this.routingConfig.strategy === 'quality-optimized' && decision.mode === 'thinking') {
      confidence += 0.1;
    }

    return Math.min(1, Math.max(0, confidence));
  }

  private calculateModelSuitability(modelId: string, taskAnalysis: any): number {
    const capabilities = this.modelCapabilities.get(modelId);
    if (!capabilities) return 0.5;

    let suitability = 0.5;

    // Check if model's best uses match task characteristics
    if (capabilities.bestFor?.includes('complex-reasoning') && taskAnalysis.complexity > 0.7) {
      suitability += 0.3;
    }
    if (capabilities.bestFor?.includes('fast-tasks') && taskAnalysis.urgency > 0.7) {
      suitability += 0.3;
    }
    if (capabilities.bestFor?.includes('cost-sensitive') && taskAnalysis.costSensitivity > 0.7) {
      suitability += 0.2;
    }

    // Check capability alignment
    if (taskAnalysis.qualityRequired > 0.8 && capabilities.accuracy > 0.8) {
      suitability += 0.2;
    }
    if (taskAnalysis.urgency > 0.7 && capabilities.speed > 0.7) {
      suitability += 0.2;
    }

    return Math.min(1, suitability);
  }

  private logRoutingDecision(decision: RoutingDecision, task: AgenticTask, processingTime: number): void {
    // Log for future learning and optimization
    const logEntry = {
      timestamp: new Date(),
      taskId: task.id,
      taskType: task.type,
      taskComplexity: task.complexity,
      taskPriority: task.priority,
      decision,
      processingTime,
      routingConfig: this.routingConfig.strategy
    };

    // In a real implementation, this would be stored in a database
    console.log('Routing decision logged:', logEntry);
  }

  // Mode switching during execution
  async checkModeSwitchTriggers(session: HybridReasoningSession, currentMetrics: PerformanceMetrics): Promise<{
    shouldSwitch: boolean;
    newMode?: string;
    reason?: string;
  }> {
    for (const trigger of this.modeSwitchTriggers) {
      if (this.evaluateTriggerCondition(trigger, session, currentMetrics)) {
        return {
          shouldSwitch: true,
          newMode: this.getNewModeFromAction(trigger.action),
          reason: `Trigger ${trigger.type} exceeded threshold: ${trigger.condition}`
        };
      }
    }

    return { shouldSwitch: false };
  }

  private evaluateTriggerCondition(trigger: ModeSwitchTrigger, session: HybridReasoningSession, metrics: PerformanceMetrics): boolean {
    // Create evaluation context
    const context = {
      task: { complexity: 0.5 }, // Would be extracted from session
      currentMode: session.finalMode,
      estimatedCost: metrics.cost,
      processingTime: metrics.processingTime,
      confidence: metrics.accuracy,
      errorRate: metrics.success ? 0 : 1
    };

    try {
      // Simple condition evaluation (in production, use proper expression evaluation)
      return this.evaluateConditionString(trigger.condition, context);
    } catch (error) {
      console.warn('Trigger condition evaluation failed:', error);
      return false;
    }
  }

  private evaluateConditionString(condition: string, context: any): boolean {
    // Simplified condition evaluation
    if (condition.includes('>') && condition.includes('&&')) {
      const parts = condition.split('&&');
      return parts.every(part => this.evaluateSimpleCondition(part.trim(), context));
    }
    return this.evaluateSimpleCondition(condition, context);
  }

  private evaluateSimpleCondition(condition: string, context: any): boolean {
    // Handle simple comparisons like "task.complexity > 0.7"
    const match = condition.match(/(\w+(?:\.\w+)*)\s*([><=!]+)\s*([\d.]+)/);
    if (!match) return false;

    const [, field, operator, valueStr] = match;
    const fieldValue = this.getNestedValue(context, field);
    const value = Number.parseFloat(valueStr);

    switch (operator) {
      case '>': return fieldValue > value;
      case '<': return fieldValue < value;
      case '>=': return fieldValue >= value;
      case '<=': return fieldValue <= value;
      case '==': return fieldValue === value;
      case '!=': return fieldValue !== value;
      default: return false;
    }
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  private getNewModeFromAction(action: string): string {
    switch (action) {
      case 'switch-to-thinking': return 'thinking';
      case 'switch-to-non-thinking': return 'non-thinking';
      case 'escalate': return 'thinking';
      case 'retry': return 'hybrid';
      default: return 'hybrid';
    }
  }

  // Performance tracking and optimization
  async recordPerformanceMetrics(metrics: PerformanceMetrics): Promise<void> {
    this.performanceHistory.push(metrics);
    
    // Keep only recent history (last 1000 entries)
    if (this.performanceHistory.length > 1000) {
      this.performanceHistory = this.performanceHistory.slice(-1000);
    }

    // Update routing rules based on performance
    this.updateRoutingRulesBasedOnPerformance();
  }

  private updateRoutingRulesBasedOnPerformance(): void {
    // Analyze performance patterns and adjust routing rules
    const recentPerformance = this.performanceHistory.slice(-100); // Last 100 entries
    
    // Group by mode and model
    const performanceByMode = new Map<string, PerformanceMetrics[]>();
    for (const metrics of recentPerformance) {
      const key = `${metrics.mode}-${metrics.model}`;
      if (!performanceByMode.has(key)) {
        performanceByMode.set(key, []);
      }
      performanceByMode.get(key)!.push(metrics);
    }

    // Calculate average performance for each mode-model combination
    const avgPerformance = new Map<string, any>();
    for (const [key, metricsList] of performanceByMode) {
      const avgAccuracy = metricsList.reduce((sum, m) => sum + m.accuracy, 0) / metricsList.length;
      const avgCost = metricsList.reduce((sum, m) => sum + m.cost, 0) / metricsList.length;
      const avgTime = metricsList.reduce((sum, m) => sum + m.processingTime, 0) / metricsList.length;
      const successRate = metricsList.filter(m => m.success).length / metricsList.length;

      avgPerformance.set(key, {
        accuracy: avgAccuracy,
        cost: avgCost,
        processingTime: avgTime,
        successRate
      });
    }

    // Update rule weights based on performance
    for (const rule of this.routingConfig.rules) {
      const key = `${rule.action.mode}-${rule.action.model}`;
      const performance = avgPerformance.get(key);
      
      if (performance) {
        // Adjust weight based on success rate and accuracy
        const performanceScore = (performance.successRate * 0.6 + performance.accuracy * 0.4);
        rule.weight = Math.max(0.1, Math.min(1, performanceScore));
      }
    }
  }

  // Public API methods
  getAvailableReasoningModes(): ReasoningMode[] {
    return REASONING_MODES;
  }

  getRoutingConfig(): AutoRoutingConfig {
    return { ...this.routingConfig };
  }

  updateRoutingConfig(config: Partial<AutoRoutingConfig>): void {
    this.routingConfig = { ...this.routingConfig, ...config };
  }

  getPerformanceHistory(mode?: string, model?: string): PerformanceMetrics[] {
    let history = [...this.performanceHistory];
    
    if (mode) {
      history = history.filter(m => m.mode === mode);
    }
    if (model) {
      history = history.filter(m => m.model === model);
    }
    
    return history;
  }

  getPerformanceAnalytics(): any {
    const history = this.performanceHistory;
    
    if (history.length === 0) {
      return {
        totalRequests: 0,
        averageAccuracy: 0,
        averageCost: 0,
        averageProcessingTime: 0,
        successRate: 0,
        modeUsage: {},
        modelUsage: {}
      };
    }

    const totalRequests = history.length;
    const averageAccuracy = history.reduce((sum, m) => sum + m.accuracy, 0) / totalRequests;
    const averageCost = history.reduce((sum, m) => sum + m.cost, 0) / totalRequests;
    const averageProcessingTime = history.reduce((sum, m) => sum + m.processingTime, 0) / totalRequests;
    const successRate = history.filter(m => m.success).length / totalRequests;

    // Mode usage statistics
    const modeUsage = new Map<string, number>();
    const modelUsage = new Map<string, number>();

    for (const metrics of history) {
      modeUsage.set(metrics.mode, (modeUsage.get(metrics.mode) || 0) + 1);
      modelUsage.set(metrics.model, (modelUsage.get(metrics.model) || 0) + 1);
    }

    return {
      totalRequests,
      averageAccuracy: Math.round(averageAccuracy * 100) / 100,
      averageCost: Math.round(averageCost * 10000) / 10000,
      averageProcessingTime: Math.round(averageProcessingTime),
      successRate: Math.round(successRate * 100) / 100,
      modeUsage: Object.fromEntries(modeUsage),
      modelUsage: Object.fromEntries(modelUsage)
    };
  }

  getModelCapabilities(modelId?: string): any {
    if (modelId) {
      return this.modelCapabilities.get(modelId);
    }
    return Object.fromEntries(this.modelCapabilities);
  }

  async optimizeRoutingStrategy(): Promise<void> {
    // Analyze performance data and suggest optimal routing strategy
    const analytics = this.getPerformanceAnalytics();
    
    // Determine best strategy based on current performance
    let recommendedStrategy = 'balanced';
    
    if (analytics.averageCost > 0.05 && analytics.successRate > 0.9) {
      recommendedStrategy = 'cost-optimized';
    } else if (analytics.averageAccuracy < 0.8 && analytics.averageCost < 0.03) {
      recommendedStrategy = 'quality-optimized';
    }

    // Update routing config with recommendation
    this.routingConfig.strategy = recommendedStrategy;
    
    console.log(`Routing strategy optimized to: ${recommendedStrategy}`);
  }
}

// Export singleton instance
export const hybridReasoningService = new HybridReasoningService();