/**
 * Simple demonstration of the Agent Orchestrator System
 *
 * This script provides a quick demo of the enhanced agent coordination system
 * with real-time monitoring and interactive features.
 */
import { AgentOrchestrator } from "./agent-orchestrator";

// Demo agents
const demoAgents = [
  {
    id: "text-agent",
    name: "Text Generation Agent",
    type: "primary" as const,
    capabilities: ["text-generation", "content-creation"],
  },
  {
    id: "analysis-agent",
    name: "Data Analysis Agent",
    type: "specialized" as const,
    capabilities: ["data-analysis", "pattern-recognition"],
  },
  {
    id: "search-agent",
    name: "Web Search Agent",
    type: "specialized" as const,
    capabilities: ["web-search", "research"],
  },
];

// Demo configuration
const demoConfig = {
  maxConcurrentTasks: 3,
  taskTimeout: 15000,
  maxRetries: 2,
  loadBalancer: {
    strategy: "weighted" as const,
    healthCheckInterval: 5000,
  },
  enableFaultTolerance: true,
  enableMonitoring: true,
};

export class OrchestratorDemo {
  private orchestrator: AgentOrchestrator;
  private isRunning = false;

  constructor() {
    this.orchestrator = new AgentOrchestrator(demoConfig);
  }

  async start(): Promise<void> {
    console.log("🎭 Starting Agent Orchestrator Demo");
    console.log("===================================");

    try {
      // Initialize orchestrator
      await this.orchestrator.initialize(demoAgents);
      console.log("✅ Demo initialized with", demoAgents.length, "agents");

      // Start orchestrator
      this.orchestrator.start();
      this.isRunning = true;
      console.log("✅ Orchestrator started");

      // Start monitoring
      this.startMonitoring();

      // Run demo scenarios
      await this.runDemoScenarios();
    } catch (error) {
      console.error("❌ Demo failed:", error);
    }
  }

  async stop(): Promise<void> {
    if (this.isRunning) {
      this.orchestrator.stop();
      this.orchestrator.destroy();
      this.isRunning = false;
      console.log("🛑 Demo stopped");
    }
  }

  private async runDemoScenarios(): Promise<void> {
    console.log("\n🎬 Running Demo Scenarios");
    console.log("========================");

    // Scenario 1: Basic task execution
    await this.scenario1_BasicTasks();

    // Scenario 2: Load balancing demonstration
    await this.scenario2_LoadBalancing();

    // Scenario 3: Fault tolerance
    await this.scenario3_FaultTolerance();

    // Scenario 4: Performance under load
    await this.scenario4_PerformanceTest();

    console.log("\n🎊 All demo scenarios completed!");
  }

  private async scenario1_BasicTasks(): Promise<void> {
    console.log("\n📝 Scenario 1: Basic Task Execution");
    console.log("=====================================");

    const tasks = [
      {
        type: "text-generation",
        priority: "medium" as const,
        capabilities: ["text-generation"],
        payload: { prompt: "Hello, world!" },
      },
      {
        type: "data-analysis",
        priority: "medium" as const,
        capabilities: ["data-analysis"],
        payload: { data: [1, 2, 3, 4, 5] },
      },
      {
        type: "web-search",
        priority: "medium" as const,
        capabilities: ["web-search"],
        payload: { query: "AI technology" },
      },
    ];

    const taskIds: string[] = [];

    for (const task of tasks) {
      const taskId = await this.orchestrator.submitTask(task);
      taskIds.push(taskId);
      console.log(`📋 Task submitted: ${taskId}`);
    }

    // Wait for completion
    await this.waitForTasks(taskIds);
    console.log("✅ Scenario 1 completed");
  }

  private async scenario2_LoadBalancing(): Promise<void> {
    console.log("\n⚖️ Scenario 2: Load Balancing Demo");
    console.log("=================================");

    // Submit multiple tasks of the same type to test load balancing
    const tasks = Array.from({ length: 6 }, (_, i) => ({
      type: "text-generation" as const,
      priority: "medium" as const,
      capabilities: ["text-generation"],
      payload: { prompt: `Test prompt ${i + 1}` },
    }));

    const taskIds: string[] = [];

    for (const task of tasks) {
      const taskId = await this.orchestrator.submitTask(task);
      taskIds.push(taskId);
      console.log(`📋 Task ${taskIds.length} submitted: ${taskId}`);
    }

    // Monitor load balancing in action
    console.log("📊 Monitoring load balancing...");
    await this.waitForTasks(taskIds);

    // Show load balancer statistics
    const stats = this.orchestrator.getStatus().loadBalancerStats;
    console.log("📈 Load Balancer Stats:");
    console.log(`   Total Requests: ${stats.totalRequests}`);
    console.log(`   Successful: ${stats.successfulRequests}`);
    console.log(`   Failed: ${stats.failedRequests}`);
    console.log(`   Avg Response Time: ${stats.averageResponseTime}ms`);

    console.log("✅ Scenario 2 completed");
  }

  private async scenario3_FaultTolerance(): Promise<void> {
    console.log("\n🛡️ Scenario 3: Fault Tolerance");
    console.log("===============================");

    // Submit a task that will fail
    const failingTask = {
      type: "invalid-task",
      priority: "medium" as const,
      capabilities: ["invalid-capability"],
      payload: { test: "data" },
    };

    const failingTaskId = await this.orchestrator.submitTask(failingTask);
    console.log(`📋 Failing task submitted: ${failingTaskId}`);

    // Submit a valid task after the failing one
    const validTask = {
      type: "text-generation",
      priority: "medium" as const,
      capabilities: ["text-generation"],
      payload: { prompt: "This should work" },
    };

    const validTaskId = await this.orchestrator.submitTask(validTask);
    console.log(`📋 Valid task submitted: ${validTaskId}`);

    // Wait for completion
    await this.waitForTasks([failingTaskId, validTaskId]);

    // Check results
    const failingResult = await this.orchestrator.getTaskResult(failingTaskId);
    const validResult = await this.orchestrator.getTaskResult(validTaskId);

    console.log("📊 Results:");
    console.log(
      `   Failing task: ${failingResult?.success ? "❌ Unexpected success" : "✅ Failed as expected"}`,
    );
    console.log(
      `   Valid task: ${validResult?.success ? "✅ Success" : "❌ Unexpected failure"}`,
    );

    console.log("✅ Scenario 3 completed");
  }

  private async scenario4_PerformanceTest(): Promise<void> {
    console.log("\n⚡ Scenario 4: Performance Under Load");
    console.log("====================================");

    // Submit many tasks to test performance
    const taskCount = 10;
    const tasks = Array.from({ length: taskCount }, (_, i) => ({
      type: ["text-generation", "data-analysis", "web-search"][i % 3] as const,
      priority: ["high", "medium", "low"][i % 3] as const,
      capabilities: [["text-generation"], ["data-analysis"], ["web-search"]][
        i % 3
      ],
      payload: { prompt: `Performance test ${i + 1}` },
    }));

    console.log(`📋 Submitting ${taskCount} tasks...`);

    const taskIds: string[] = [];
    const startTime = Date.now();

    for (const task of tasks) {
      const taskId = await this.orchestrator.submitTask(task);
      taskIds.push(taskId);
    }

    console.log("⏳ Waiting for completion...");
    await this.waitForTasks(taskIds);

    const totalTime = Date.now() - startTime;
    const stats = this.orchestrator.getStatus().loadBalancerStats;

    console.log("📊 Performance Results:");
    console.log(`   Total Time: ${totalTime}ms`);
    console.log(
      `   Tasks/Second: ${(taskCount / (totalTime / 1000)).toFixed(2)}`,
    );
    console.log(
      `   Success Rate: ${((stats.successfulRequests / stats.totalRequests) * 100).toFixed(2)}%`,
    );
    console.log(`   Avg Response Time: ${stats.averageResponseTime}ms`);

    console.log("✅ Scenario 4 completed");
  }

  private async waitForTasks(taskIds: string[]): Promise<void> {
    const maxWaitTime = 30000; // 30 seconds
    const startTime = Date.now();

    while (Date.now() - startTime < maxWaitTime) {
      const completedCount = taskIds.filter(async (taskId) => {
        const result = await this.orchestrator.getTaskResult(taskId);
        return result !== null;
      }).length;

      if (completedCount === taskIds.length) {
        break;
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  private startMonitoring(): void {
    setInterval(() => {
      if (this.isRunning) {
        const status = this.orchestrator.getStatus();
        console.log(
          `📊 Status: ${status.runningTasks} running, ${status.queueLength} queued, ${status.completedTasks} completed`,
        );
      }
    }, 5000);
  }
}

// Quick demo function
export async function quickDemo(): Promise<void> {
  const demo = new OrchestratorDemo();
  await demo.start();

  // Let it run for a bit
  await new Promise((resolve) => setTimeout(resolve, 10000));

  await demo.stop();
}

// Run demo if this file is executed directly
if (require.main === module) {
  quickDemo().catch(console.error);
}
