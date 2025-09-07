/**
 * Test script for the Agent Orchestrator System
 *
 * This script demonstrates the enhanced agent coordination system with
 * dynamic load balancing, fault tolerance, and intelligent task distribution.
 */
import { AgentOrchestrator } from './agent-orchestrator';

// Test agents configuration
const testAgents = [
  {
    id: 'glm-4.5-primary',
    name: 'GLM-4.5 Primary Agent',
    type: 'primary' as const,
    capabilities: ['text-generation', 'data-analysis', 'web-search', 'code-generation'],
  },
  {
    id: 'glm-4.5-support',
    name: 'GLM-4.5 Support Agent',
    type: 'supporting' as const,
    capabilities: ['text-generation', 'data-analysis', 'image-generation'],
  },
  {
    id: 'specialized-analyzer',
    name: 'Specialized Data Analyzer',
    type: 'specialized' as const,
    capabilities: ['data-analysis', 'statistical-analysis', 'pattern-recognition'],
  },
  {
    id: 'web-search-agent',
    name: 'Web Search Specialist',
    type: 'specialized' as const,
    capabilities: ['web-search', 'content-analysis', 'research'],
  },
  {
    id: 'creative-agent',
    name: 'Creative Content Generator',
    type: 'specialized' as const,
    capabilities: ['text-generation', 'image-generation', 'creative-writing'],
  },
];

// Orchestrator configuration
const orchestratorConfig = {
  maxConcurrentTasks: 5,
  taskTimeout: 30000,
  maxRetries: 3,
  loadBalancer: {
    strategy: 'weighted' as const,
    healthCheckInterval: 10000,
  },
  enableFaultTolerance: true,
  enableMonitoring: true,
};

// Test tasks
const testTasks = [
  {
    type: 'text-generation',
    priority: 'high' as const,
    capabilities: ['text-generation'],
    payload: {
      prompt:
        'Write a comprehensive overview of artificial intelligence and its impact on society.',
    },
  },
  {
    type: 'data-analysis',
    priority: 'medium' as const,
    capabilities: ['data-analysis'],
    payload: {
      data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      analysisType: 'statistical',
    },
  },
  {
    type: 'web-search',
    priority: 'medium' as const,
    capabilities: ['web-search'],
    payload: {
      query: 'latest developments in quantum computing',
      num: 5,
    },
  },
  {
    type: 'image-generation',
    priority: 'low' as const,
    capabilities: ['image-generation'],
    payload: {
      prompt: 'A futuristic city with flying cars and neon lights',
      size: '1024x1024',
    },
  },
  {
    type: 'text-generation',
    priority: 'high' as const,
    capabilities: ['text-generation'],
    payload: {
      prompt: 'Explain the concept of machine learning in simple terms.',
    },
  },
  {
    type: 'data-analysis',
    priority: 'high' as const,
    capabilities: ['data-analysis', 'statistical-analysis'],
    payload: {
      dataset: 'sales_data_q3_2024',
      metrics: ['revenue', 'growth', 'conversion_rate'],
    },
  },
  {
    type: 'web-search',
    priority: 'low' as const,
    capabilities: ['web-search', 'content-analysis'],
    payload: {
      query: 'best practices for sustainable software development',
      num: 8,
    },
  },
  {
    type: 'text-generation',
    priority: 'medium' as const,
    capabilities: ['text-generation', 'creative-writing'],
    payload: {
      prompt: 'Write a short story about a time traveler who visits ancient Rome.',
    },
  },
];

// Test scenarios with dependencies
const testTasksWithDependencies = [
  {
    type: 'data-analysis',
    priority: 'high' as const,
    capabilities: ['data-analysis'],
    payload: { dataset: 'initial_data' },
    dependencies: [], // No dependencies
  },
  {
    type: 'text-generation',
    priority: 'medium' as const,
    capabilities: ['text-generation'],
    payload: { prompt: 'Generate report based on analysis' },
    dependencies: ['task_1'], // Depends on first task
  },
  {
    type: 'web-search',
    priority: 'medium' as const,
    capabilities: ['web-search'],
    payload: { query: 'additional research topics' },
    dependencies: [], // No dependencies
  },
  {
    type: 'text-generation',
    priority: 'high' as const,
    capabilities: ['text-generation'],
    payload: { prompt: 'Create comprehensive final report' },
    dependencies: ['task_1', 'task_2', 'task_3'], // Depends on all previous tasks
  },
];

export async function runOrchestratorTest() {
  console.log('🚀 Starting Agent Orchestrator Test');
  console.log('=====================================');

  // Initialize orchestrator
  const orchestrator = new AgentOrchestrator(orchestratorConfig);

  try {
    // Initialize with test agents
    await orchestrator.initialize(testAgents);
    console.log('✅ Orchestrator initialized with', testAgents.length, 'agents');

    // Start orchestrator
    orchestrator.start();
    console.log('✅ Orchestrator started');

    // Submit basic test tasks
    console.log('\n📝 Submitting basic test tasks...');
    const basicTaskIds: string[] = [];

    for (const task of testTasks) {
      const taskId = await orchestrator.submitTask(task);
      basicTaskIds.push(taskId);
      console.log(`📋 Task submitted: ${taskId} (${task.type})`);
    }

    // Submit tasks with dependencies
    console.log('\n🔗 Submitting tasks with dependencies...');
    const dependencyTaskIds: string[] = [];

    for (const task of testTasksWithDependencies) {
      const taskId = await orchestrator.submitTask({
        ...task,
        dependencies: task.dependencies
          .map(depId => dependencyTaskIds[parseInt(depId.split('_')[1]) - 1])
          .filter(Boolean),
      });
      dependencyTaskIds.push(taskId);
      console.log(`🔗 Task submitted: ${taskId} (${task.type})`);
    }

    // Monitor progress
    console.log('\n📊 Monitoring task execution...');
    const allTaskIds = [...basicTaskIds, ...dependencyTaskIds];

    let completedCount = 0;
    const maxWaitTime = 60000; // 60 seconds
    const startTime = Date.now();

    while (completedCount < allTaskIds.length && Date.now() - startTime < maxWaitTime) {
      await new Promise(resolve => setTimeout(resolve, 2000));

      completedCount = allTaskIds.filter(taskId => {
        const result = orchestrator.getStatus().completedTasks;
        return result >= allTaskIds.indexOf(taskId) + 1;
      }).length;

      const status = orchestrator.getStatus();
      console.log(
        `⏳ Progress: ${completedCount}/${allTaskIds.length} completed, ` +
          `${status.runningTasks} running, ${status.queueLength} queued`
      );
    }

    // Collect and display results
    console.log('\n📈 Task Results:');
    console.log('===============');

    for (const taskId of allTaskIds) {
      const result = await orchestrator.getTaskResult(taskId);
      if (result) {
        console.log(`\n📋 Task ${taskId}:`);
        console.log(`   Status: ${result.success ? '✅ Success' : '❌ Failed'}`);
        console.log(`   Execution Time: ${result.executionTime}ms`);
        console.log(`   Agent: ${result.agentId}`);

        if (result.error) {
          console.log(`   Error: ${result.error}`);
        } else if (result.data) {
          console.log(`   Data: ${JSON.stringify(result.data).substring(0, 100)}...`);
        }
      }
    }

    // Display final statistics
    console.log('\n📊 Final Statistics:');
    console.log('====================');
    const finalStatus = orchestrator.getStatus();
    console.log(`Total Tasks: ${allTaskIds.length}`);
    console.log(`Completed: ${finalStatus.completedTasks}`);
    console.log(`Failed: ${allTaskIds.length - finalStatus.completedTasks}`);
    console.log(`Average Response Time: ${finalStatus.loadBalancerStats.averageResponseTime}ms`);
    console.log(
      `Success Rate: ${((finalStatus.loadBalancerStats.successfulRequests / finalStatus.loadBalancerStats.totalRequests) * 100).toFixed(2)}%`
    );

    // Test fault tolerance
    console.log('\n🛡️ Testing Fault Tolerance...');
    console.log('===========================');

    // Submit a task that will likely fail
    const failingTask = {
      type: 'unknown-task-type',
      priority: 'medium' as const,
      capabilities: ['non-existent-capability'],
      payload: { test: 'data' },
    };

    const failingTaskId = await orchestrator.submitTask(failingTask);
    console.log(`📋 Failing task submitted: ${failingTaskId}`);

    // Wait for the task to complete (or fail)
    await new Promise(resolve => setTimeout(resolve, 5000));

    const failingResult = await orchestrator.getTaskResult(failingTaskId);
    if (failingResult) {
      console.log(`❌ Task failed as expected: ${failingResult.error}`);
    }

    console.log('\n🎉 Orchestrator Test Complete!');
    console.log('=============================');
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    // Clean up
    orchestrator.destroy();
    console.log('🧹 Orchestrator cleaned up');
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  runOrchestratorTest().catch(console.error);
}
