/**
 * Agent Orchestrator for GLM-4.5 Orchestrated AI Ecosystem
 *
 * This module provides the main orchestration system that coordinates
 * multiple AI agents with GLM-4.5 as the primary orchestrator.
 * All operations are now orchestrated through the GLM-4.5 system.
 */
import { DynamicLoadBalancer } from './dynamic-load-balancer';
import { glmOrchestrator, GLMOrchestratorConfig } from '../glm-orchestrator';

interface AgentTask {
  id: string;
  type: string;
  priority: 'high' | 'medium' | 'low';
  capabilities: string[];
  payload: any;
  timeout?: number;
  retries?: number;
  dependencies?: string[];
}

interface AgentResult {
  taskId: string;
  success: boolean;
  data?: any;
  error?: string;
  executionTime: number;
  agentId: string;
}

interface OrchestratorConfig {
  maxConcurrentTasks: number;
  taskTimeout: number;
  maxRetries: number;
  loadBalancer: {
    strategy: 'round-robin' | 'weighted' | 'least-connections' | 'response-time';
    healthCheckInterval: number;
  };
  enableFaultTolerance: boolean;
  enableMonitoring: boolean;
}

export class AgentOrchestrator {
  private loadBalancer: DynamicLoadBalancer;
  private config: OrchestratorConfig;
  private taskQueue: AgentTask[] = [];
  private runningTasks: Map<string, Promise<AgentResult>> = new Map();
  private completedTasks: Map<string, AgentResult> = new Map();
  private taskDependencies: Map<string, string[]> = new Map();
  private isRunning = false;
  private monitoringInterval?: NodeJS.Timeout;

  constructor(config: OrchestratorConfig) {
    this.config = config;
    this.loadBalancer = new DynamicLoadBalancer({
      strategy: config.loadBalancer.strategy,
      healthCheckInterval: config.loadBalancer.healthCheckInterval,
      maxRetries: config.maxRetries,
      timeout: config.taskTimeout,
    });
  }

  /**
   * Initialize the orchestrator with GLM-4.5 as primary orchestrator
   */
  async initialize(agents: any[]): Promise<void> {
    // First, initialize the GLM orchestrator
    await glmOrchestrator.initialize();

    // Register agents with the load balancer
    agents.forEach(agent => {
      this.loadBalancer.registerAgent({
        id: agent.id,
        name: agent.name,
        type: agent.type,
        capabilities: agent.capabilities,
        performance: {
          responseTime: 0,
          successRate: 1,
          throughput: 0,
          errorRate: 0,
        },
        resources: {
          cpu: 0,
          memory: 0,
          network: 0,
        },
        health: 'healthy',
      });
    });

    if (this.config.enableMonitoring) {
      this.startMonitoring();
    }
  }

  /**
   * Start the orchestrator
   */
  start(): void {
    this.isRunning = true;
    this.processTaskQueue();
  }

  /**
   * Stop the orchestrator
   */
  stop(): void {
    this.isRunning = false;
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }
    this.loadBalancer.stopHealthChecks();
  }

  /**
   * Submit a task for execution
   */
  async submitTask(task: Omit<AgentTask, 'id'>): Promise<string> {
    const taskId = this.generateTaskId();
    const fullTask: AgentTask = {
      ...task,
      id: taskId,
      timeout: task.timeout || this.config.taskTimeout,
      retries: task.retries || this.config.maxRetries,
    };

    this.taskQueue.push(fullTask);

    if (task.dependencies) {
      this.taskDependencies.set(taskId, task.dependencies);
    }

    // Process queue immediately if not already running
    if (this.isRunning && this.runningTasks.size < this.config.maxConcurrentTasks) {
      this.processTaskQueue();
    }

    return taskId;
  }

  /**
   * Get task result by ID
   */
  async getTaskResult(taskId: string): Promise<AgentResult | null> {
    if (this.completedTasks.has(taskId)) {
      return this.completedTasks.get(taskId)!;
    }

    if (this.runningTasks.has(taskId)) {
      return await this.runningTasks.get(taskId)!;
    }

    return null;
  }

  /**
   * Get orchestrator status and statistics
   */
  getStatus() {
    return {
      isRunning: this.isRunning,
      queueLength: this.taskQueue.length,
      runningTasks: this.runningTasks.size,
      completedTasks: this.completedTasks.size,
      loadBalancerStats: this.loadBalancer.getStats(),
    };
  }

  /**
   * Process the task queue
   */
  private async processTaskQueue(): Promise<void> {
    if (!this.isRunning) return;

    while (this.taskQueue.length > 0 && this.runningTasks.size < this.config.maxConcurrentTasks) {
      const task = this.findNextExecutableTask();

      if (!task) break;

      // Remove task from queue
      const taskIndex = this.taskQueue.findIndex(t => t.id === task.id);
      if (taskIndex !== -1) {
        this.taskQueue.splice(taskIndex, 1);
      }

      // Execute task
      const taskPromise = this.executeTask(task);
      this.runningTasks.set(task.id, taskPromise);

      // Handle task completion
      taskPromise
        .then(result => {
          this.completedTasks.set(task.id, result);
          this.runningTasks.delete(task.id);
        })
        .catch(error => {
          this.completedTasks.set(task.id, {
            taskId: task.id,
            success: false,
            error: error.message,
            executionTime: 0,
            agentId: 'unknown',
          });
          this.runningTasks.delete(task.id);
        })
        .finally(() => {
          // Process next task
          if (this.isRunning) {
            this.processTaskQueue();
          }
        });
    }
  }

  /**
   * Find the next executable task considering dependencies
   */
  private findNextExecutableTask(): AgentTask | null {
    for (const task of this.taskQueue) {
      const dependencies = this.taskDependencies.get(task.id) || [];

      // Check if all dependencies are completed
      const allDependenciesCompleted = dependencies.every(
        depId => this.completedTasks.has(depId) && this.completedTasks.get(depId)?.success
      );

      if (allDependenciesCompleted) {
        return task;
      }
    }
    return null;
  }

  /**
   * Execute a single task
   */
  private async executeTask(task: AgentTask): Promise<AgentResult> {
    const startTime = Date.now();

    try {
      const result = await this.loadBalancer.executeTask(
        {
          capabilities: task.capabilities,
          priority: task.priority,
          payload: task.payload,
        },
        async agent => {
          // Execute the task using the selected agent
          return await this.executeWithAgent(task, agent);
        }
      );

      const executionTime = Date.now() - startTime;
      return {
        taskId: task.id,
        success: true,
        data: result,
        executionTime,
        agentId: 'selected-agent', // This would be the actual agent ID
      };
    } catch (error) {
      const executionTime = Date.now() - startTime;
      return {
        taskId: task.id,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        executionTime,
        agentId: 'unknown',
      };
    }
  }

  /**
   * Execute task with a specific agent - now orchestrated through GLM-4.5
   */
  private async executeWithAgent(task: AgentTask, agent: any): Promise<any> {
    // Submit the task to the GLM orchestrator for execution
    const operationType = this.mapTaskTypeToOperationType(task.type);

    const operationId = await glmOrchestrator.submitOperation({
      type: operationType,
      priority: task.priority,
      payload: {
        task,
        agent,
        originalPayload: task.payload,
      },
      agentRequirements: task.capabilities,
      expectedOutcome: `Execute ${task.type} task using agent ${agent.name}`,
      timeout: task.timeout || this.config.taskTimeout,
    });

    // Wait for the GLM orchestrator to complete the operation
    const result = await glmOrchestrator.getOperationResult(operationId);

    if (!result || !result.success) {
      throw new Error(result ? `Operation failed: ${JSON.stringify(result)}` : 'Operation failed');
    }

    return result.result;
  }

  /**
   * Map task type to GLM orchestrator operation type
   */
  private mapTaskTypeToOperationType(
    taskType: string
  ): 'analysis' | 'optimization' | 'monitoring' | 'security' | 'prediction' {
    switch (taskType) {
      case 'text-generation':
      case 'data-analysis':
        return 'analysis';
      case 'image-generation':
        return 'optimization';
      case 'web-search':
        return 'monitoring';
      case 'security-scan':
        return 'security';
      case 'prediction':
        return 'prediction';
      default:
        return 'analysis';
    }
  }

  /**
   * Start monitoring system
   */
  private startMonitoring(): void {
    this.monitoringInterval = setInterval(() => {
      this.logSystemStatus();
    }, 30000); // Log every 30 seconds
  }

  /**
   * Log system status
   */
  private logSystemStatus(): void {
    const status = this.getStatus();
    console.log('Agent Orchestrator Status:', {
      ...status,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Generate unique task ID
   */
  private generateTaskId(): string {
    return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    this.stop();
    this.loadBalancer.destroy();
    this.taskQueue = [];
    this.runningTasks.clear();
    this.completedTasks.clear();
    this.taskDependencies.clear();
    glmOrchestrator.destroy();
  }
}
