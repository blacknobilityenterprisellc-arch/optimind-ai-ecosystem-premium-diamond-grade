/**
 * OptiMind AI Agents - Practical Usage Examples
 * 
 * This file contains comprehensive examples of how to leverage the OptiMind AI Agents
 * for various enterprise scenarios and use cases.
 */

// ===== BASIC USAGE EXAMPLES =====

/**
 * Example 1: Basic Agent Information Retrieval
 */
async function getAgentInformation() {
  console.log('=== Getting Agent Information ===');
  
  try {
    // Get all agents
    const response = await fetch('/api/ai-agents?action=list-agents');
    const data = await response.json();
    
    if (data.success) {
      console.log(`Found ${data.data.length} agents:`);
      data.data.forEach(agent => {
        console.log(`- ${agent.name} (${agent.type}): ${agent.status}`);
        console.log(`  Capabilities: ${agent.capabilities.join(', ')}`);
        console.log(`  Performance: ${(agent.performance.successRate * 100).toFixed(1)}% success rate`);
      });
    }
  } catch (error) {
    console.error('Error getting agent information:', error);
  }
}

/**
 * Example 2: System Metrics Monitoring
 */
async function monitorSystemMetrics() {
  console.log('=== System Metrics Monitoring ===');
  
  try {
    const response = await fetch('/api/ai-agents?action=system-metrics');
    const data = await response.json();
    
    if (data.success) {
      const metrics = data.data;
      console.log('System Metrics:');
      console.log(`- Total Agents: ${metrics.totalAgents}`);
      console.log(`- Active Agents: ${metrics.activeAgents}`);
      console.log(`- System IQ: ${metrics.systemIntelligence.overallIQ}`);
      console.log(`- Resource Utilization:`);
      console.log(`  - CPU: ${metrics.resourceUtilization.cpu}%`);
      console.log(`  - Memory: ${metrics.resourceUtilization.memory}%`);
      console.log(`  - Network: ${metrics.resourceUtilization.network}%`);
    }
  } catch (error) {
    console.error('Error monitoring system metrics:', error);
  }
}

// ===== TASK MANAGEMENT EXAMPLES =====

/**
 * Example 3: Creating Various Types of Tasks
 */
async function createSampleTasks() {
  console.log('=== Creating Sample Tasks ===');
  
  const tasks = [
    {
      title: 'Security Vulnerability Assessment',
      description: 'Comprehensive security scan and vulnerability assessment',
      type: 'security',
      priority: 'critical'
    },
    {
      title: 'Performance Analysis',
      description: 'Analyze system performance and identify optimization opportunities',
      type: 'analysis',
      priority: 'high'
    },
    {
      title: 'Data Pattern Recognition',
      description: 'Identify patterns in user behavior data',
      type: 'prediction',
      priority: 'medium'
    },
    {
      title: 'Resource Optimization',
      description: 'Optimize resource allocation across the system',
      type: 'optimization',
      priority: 'medium'
    }
  ];

  for (const task of tasks) {
    try {
      const response = await fetch('/api/ai-agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create-task',
          payload: task
        })
      });

      const result = await response.json();
      if (result.success) {
        console.log(`✅ Task created: ${task.title}`);
        console.log(`   ID: ${result.data.id}`);
        console.log(`   Status: ${result.data.status}`);
        console.log(`   Assigned to: ${result.data.assignedAgent || 'Pending'}`);
      } else {
        console.log(`❌ Failed to create task: ${result.error}`);
      }
    } catch (error) {
      console.error(`Error creating task ${task.title}:`, error);
    }
  }
}

/**
 * Example 4: Agent Control Operations
 */
async function demonstrateAgentControl() {
  console.log('=== Agent Control Operations ===');
  
  try {
    // Get agents list
    const agentsResponse = await fetch('/api/ai-agents?action=list-agents');
    const agentsData = await agentsResponse.json();
    
    if (agentsData.success) {
      const agents = agentsData.data;
      
      for (const agent of agents) {
        console.log(`\nControlling agent: ${agent.name}`);
        
        // Test different control actions
        const actions = ['start', 'pause', 'restart'];
        
        for (const action of actions) {
          try {
            const controlResponse = await fetch('/api/ai-agents', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                action: 'control-agent',
                payload: {
                  agentId: agent.id,
                  action: action
                }
              })
            });

            const controlResult = await controlResponse.json();
            if (controlResult.success) {
              console.log(`   ✅ ${action}: ${controlResult.data.state.status}`);
            } else {
              console.log(`   ❌ ${action} failed: ${controlResult.error}`);
            }
            
            // Wait between actions
            await new Promise(resolve => setTimeout(resolve, 1000));
          } catch (error) {
            console.error(`   Error with ${action}:`, error);
          }
        }
      }
    }
  } catch (error) {
    console.error('Error in agent control demonstration:', error);
  }
}

// ===== COLLABORATION EXAMPLES =====

/**
 * Example 5: Creating Agent Collaborations
 */
async function createAgentCollaborations() {
  console.log('=== Creating Agent Collaborations ===');
  
  try {
    // Get active agents
    const agentsResponse = await fetch('/api/ai-agents?action=list-agents');
    const agentsData = await agentsResponse.json();
    
    if (agentsData.success) {
      const activeAgents = agentsData.data.filter(agent => agent.status === 'active');
      
      if (activeAgents.length >= 2) {
        const collaborationTypes = [
          {
            type: 'collective-intelligence',
            name: 'Enterprise Intelligence Network',
            description: 'Multi-agent intelligence network for complex problem solving'
          },
          {
            type: 'task-sharing',
            name: 'Distributed Processing Team',
            description: 'Team for distributing and processing complex tasks'
          },
          {
            type: 'knowledge-exchange',
            name: 'Expertise Sharing Network',
            description: 'Network for sharing specialized knowledge and insights'
          }
        ];

        for (const collab of collaborationTypes) {
          try {
            const response = await fetch('/api/ai-agents', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                action: 'create-collaboration',
                payload: {
                  type: collab.type,
                  participants: activeAgents.slice(0, 3).map(agent => agent.id),
                  name: collab.name,
                  sharedContext: {
                    description: collab.description,
                    complexity: 'high',
                    domain: 'enterprise-ai'
                  }
                }
              })
            });

            const result = await response.json();
            if (result.success) {
              console.log(`✅ Collaboration created: ${collab.name}`);
              console.log(`   Type: ${result.data.type}`);
              console.log(`   Participants: ${result.data.participants.length}`);
              console.log(`   Synergy: ${(result.data.synergy * 100).toFixed(1)}%`);
              console.log(`   Efficiency: ${(result.data.efficiency * 100).toFixed(1)}%`);
            } else {
              console.log(`❌ Failed to create collaboration: ${result.error}`);
            }
          } catch (error) {
            console.error(`Error creating ${collab.name}:`, error);
          }
        }
      } else {
        console.log('Not enough active agents for collaboration');
      }
    }
  } catch (error) {
    console.error('Error creating collaborations:', error);
  }
}

// ===== ADVANCED USAGE EXAMPLES =====

/**
 * Example 6: Task Assignment and Progress Tracking
 */
async function demonstrateTaskLifecycle() {
  console.log('=== Task Lifecycle Management ===');
  
  try {
    // Create a high-priority task
    const taskResponse = await fetch('/api/ai-agents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'create-task',
        payload: {
          title: 'Critical System Analysis',
          description: 'Urgent analysis of critical system components',
          type: 'analysis',
          priority: 'critical'
        }
      })
    });

    const taskResult = await taskResponse.json();
    
    if (taskResult.success) {
      const taskId = taskResult.data.id;
      console.log(`✅ Critical task created: ${taskId}`);
      
      // Simulate task progress updates
      const progressStages = [25, 50, 75, 100];
      
      for (const progress of progressStages) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const progressResponse = await fetch('/api/ai-agents', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'update-task-progress',
            payload: {
              taskId: taskId,
              progress: progress
            }
          })
        });

        const progressResult = await progressResponse.json();
        if (progressResult.success) {
          console.log(`📈 Task progress: ${progress}%`);
          console.log(`   Status: ${progressResult.data.status}`);
          
          if (progress === 100) {
            console.log(`   Completed at: ${progressResult.data.completedAt}`);
          }
        }
      }
    }
  } catch (error) {
    console.error('Error in task lifecycle demonstration:', error);
  }
}

/**
 * Example 7: Performance Monitoring and Optimization
 */
async function monitorAndOptimizePerformance() {
  console.log('=== Performance Monitoring and Optimization ===');
  
  try {
    // Get initial metrics
    const initialMetrics = await fetch('/api/ai-agents?action=system-metrics');
    const initialData = await initialMetrics.json();
    
    if (initialData.success) {
      console.log('Initial System State:');
      logSystemMetrics(initialData.data);
      
      // Monitor for a period
      const monitoringDuration = 30000; // 30 seconds
      const interval = 5000; // 5 seconds
      const iterations = monitoringDuration / interval;
      
      for (let i = 0; i < iterations; i++) {
        await new Promise(resolve => setTimeout(resolve, interval));
        
        const currentMetrics = await fetch('/api/ai-agents?action=system-metrics');
        const currentData = await currentMetrics.json();
        
        if (currentData.success) {
          console.log(`\nMonitoring Cycle ${i + 1}:`);
          logSystemMetrics(currentData.data);
          
          // Check for optimization opportunities
          const optimization = analyzeOptimizationOpportunities(initialData.data, currentData.data);
          if (optimization.length > 0) {
            console.log('💡 Optimization Recommendations:');
            optimization.forEach(rec => console.log(`   - ${rec}`));
          }
        }
      }
    }
  } catch (error) {
    console.error('Error in performance monitoring:', error);
  }
}

function logSystemMetrics(metrics) {
  console.log(`  Active Agents: ${metrics.activeAgents}/${metrics.totalAgents}`);
  console.log(`  System IQ: ${metrics.systemIntelligence.overallIQ}`);
  console.log(`  Resource Usage - CPU: ${metrics.resourceUtilization.cpu}%, Memory: ${metrics.resourceUtilization.memory}%`);
  console.log(`  Tasks: ${metrics.completedTasks}/${metrics.totalTasks} completed`);
}

function analyzeOptimizationOpportunities(initial, current) {
  const recommendations = [];
  
  // Check resource usage
  if (current.resourceUtilization.cpu > 80) {
    recommendations.push('High CPU usage - consider scaling resources');
  }
  
  if (current.resourceUtilization.memory > 80) {
    recommendations.push('High memory usage - optimize agent configurations');
  }
  
  // Check agent utilization
  const agentUtilization = current.activeAgents / current.totalAgents;
  if (agentUtilization < 0.5) {
    recommendations.push('Low agent utilization - activate idle agents');
  }
  
  // Check task completion rate
  const completionRate = current.completedTasks / current.totalTasks;
  if (completionRate < 0.8) {
    recommendations.push('Low task completion rate - review task assignments');
  }
  
  return recommendations;
}

// ===== ENTERPRISE USE CASES =====

/**
 * Example 8: Enterprise Security Operations
 */
async function enterpriseSecurityOperations() {
  console.log('=== Enterprise Security Operations Demo ===');
  
  const securityTasks = [
    {
      title: 'Threat Detection Analysis',
      description: 'Analyze system logs for potential security threats',
      type: 'security',
      priority: 'critical'
    },
    {
      title: 'Vulnerability Assessment',
      description: 'Comprehensive vulnerability scan of all system components',
      type: 'security',
      priority: 'high'
    },
    {
      title: 'Security Policy Review',
      description: 'Review and update security policies based on latest threats',
      type: 'analysis',
      priority: 'medium'
    }
  ];

  console.log('🔒 Executing security operations...');
  
  for (const task of securityTasks) {
    try {
      const response = await fetch('/api/ai-agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create-task',
          payload: task
        })
      });

      const result = await response.json();
      if (result.success) {
        console.log(`🛡️  Security task created: ${task.title}`);
        console.log(`   Assigned to: ${result.data.assignedAgent || 'Security Specialist'}`);
        console.log(`   Priority: ${result.data.priority}`);
      }
    } catch (error) {
      console.error(`Error creating security task ${task.title}:`, error);
    }
  }
}

/**
 * Example 9: Business Intelligence Operations
 */
async function businessIntelligenceOperations() {
  console.log('=== Business Intelligence Operations Demo ===');
  
  const biTasks = [
    {
      title: 'Market Trend Analysis',
      description: 'Analyze market trends and generate business insights',
      type: 'analysis',
      priority: 'high'
    },
    {
      title: 'Customer Behavior Prediction',
      description: 'Predict customer behavior based on historical data',
      type: 'prediction',
      priority: 'medium'
    },
    {
      title: 'Performance Metrics Optimization',
      description: 'Optimize business performance metrics',
      type: 'optimization',
      priority: 'medium'
    }
  ];

  console.log('📊 Executing business intelligence operations...');
  
  for (const task of biTasks) {
    try {
      const response = await fetch('/api/ai-agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create-task',
          payload: task
        })
      });

      const result = await response.json();
      if (result.success) {
        console.log(`📈 BI task created: ${task.title}`);
        console.log(`   Type: ${result.data.type}`);
        console.log(`   Status: ${result.data.status}`);
      }
    } catch (error) {
      console.error(`Error creating BI task ${task.title}:`, error);
    }
  }
}

// ===== UTILITY FUNCTIONS =====

/**
 * Example 10: Comprehensive System Health Check
 */
async function comprehensiveSystemHealthCheck() {
  console.log('=== Comprehensive System Health Check ===');
  
  try {
    // Get all system information
    const [agentsResponse, tasksResponse, metricsResponse] = await Promise.all([
      fetch('/api/ai-agents?action=list-agents'),
      fetch('/api/ai-agents?action=list-tasks'),
      fetch('/api/ai-agents?action=system-metrics')
    ]);

    const [agentsData, tasksData, metricsData] = await Promise.all([
      agentsResponse.json(),
      tasksResponse.json(),
      metricsResponse.json()
    ]);

    if (agentsData.success && tasksData.success && metricsData.success) {
      console.log('🏥 System Health Report:');
      
      // Agent Health
      const agents = agentsData.data;
      const healthyAgents = agents.filter(a => a.state.status === 'active').length;
      console.log(`  Agent Health: ${healthyAgents}/${agents.length} agents healthy`);
      
      // Task Health
      const tasks = tasksData.data;
      const activeTasks = tasks.filter(t => t.status === 'in-progress').length;
      const completedTasks = tasks.filter(t => t.status === 'completed').length;
      console.log(`  Task Status: ${activeTasks} active, ${completedTasks} completed`);
      
      // System Health
      const metrics = metricsData.data;
      const systemHealth = (
        metrics.systemIntelligence.collectiveIntelligence +
        metrics.systemIntelligence.adaptability +
        metrics.systemIntelligence.innovation
      ) / 3;
      
      console.log(`  System Health: ${systemHealth.toFixed(1)}%`);
      console.log(`  Resource Utilization: ${metrics.resourceUtilization.cpu}% CPU, ${metrics.resourceUtilization.memory}% Memory`);
      
      // Overall Assessment
      let overallHealth = 'EXCELLENT';
      if (systemHealth < 80) overallHealth = 'GOOD';
      if (systemHealth < 60) overallHealth = 'FAIR';
      if (systemHealth < 40) overallHealth = 'POOR';
      
      console.log(`  Overall Assessment: ${overallHealth}`);
      
      // Recommendations
      console.log('\n💡 Recommendations:');
      if (metrics.resourceUtilization.cpu > 80) {
        console.log('  - Consider scaling CPU resources');
      }
      if (metrics.resourceUtilization.memory > 80) {
        console.log('  - Optimize memory usage');
      }
      if (healthyAgents < agents.length * 0.8) {
        console.log('  - Check and restart inactive agents');
      }
      if (activeTasks > tasks.length * 0.5) {
        console.log('  - Monitor task completion rates');
      }
    }
  } catch (error) {
    console.error('Error in system health check:', error);
  }
}

// ===== MAIN DEMO FUNCTION =====

/**
 * Run all demonstrations
 */
async function runAllDemonstrations() {
  console.log('🚀 Starting OptiMind AI Agents Complete Demonstration');
  console.log('=' * 60);
  
  // Basic usage
  await getAgentInformation();
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  await monitorSystemMetrics();
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Task management
  await createSampleTasks();
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  await demonstrateAgentControl();
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Collaboration
  await createAgentCollaborations();
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Advanced usage
  await demonstrateTaskLifecycle();
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  await monitorAndOptimizePerformance();
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Enterprise use cases
  await enterpriseSecurityOperations();
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  await businessIntelligenceOperations();
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // System health
  await comprehensiveSystemHealthCheck();
  
  console.log('\n🎉 All demonstrations completed!');
  console.log('💡 Access the dashboard at: http://localhost:3000/ai-agents');
}

// Export functions for external use
module.exports = {
  getAgentInformation,
  monitorSystemMetrics,
  createSampleTasks,
  demonstrateAgentControl,
  createAgentCollaborations,
  demonstrateTaskLifecycle,
  monitorAndOptimizePerformance,
  enterpriseSecurityOperations,
  businessIntelligenceOperations,
  comprehensiveSystemHealthCheck,
  runAllDemonstrations
};

// Auto-run if this file is executed directly
if (require.main === module) {
  runAllDemonstrations().catch(console.error);
}