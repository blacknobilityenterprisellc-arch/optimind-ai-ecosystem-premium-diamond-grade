/**
 * OptiMind AI Agents - Practical Demonstration Script
 * 
 * This script demonstrates how to leverage the OptiMind Super AI Agents
 * for various enterprise use cases and scenarios.
 */

import ZAI from 'z-ai-web-dev-sdk';

class OptiMindAIAgentsDemo {
  private zai: any;
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:3000') {
    this.baseUrl = baseUrl;
  }

  async initialize() {
    try {
      this.zai = await ZAI.create();
      console.log('🚀 OptiMind AI Agents Demo Initialized');
    } catch (error) {
      console.error('❌ Failed to initialize ZAI:', error);
    }
  }

  /**
   * Demonstrate AI Agent System Overview
   */
  async demonstrateSystemOverview() {
    console.log('\n📊 === AI Agents System Overview ===');
    
    try {
      const response = await fetch(`${this.baseUrl}/api/ai-agents?action=system-metrics`);
      const data = await response.json();
      
      if (data.success) {
        const metrics = data.data;
        console.log('🤖 System Metrics:');
        console.log(`   Total Agents: ${metrics.totalAgents}`);
        console.log(`   Active Agents: ${metrics.activeAgents}`);
        console.log(`   Total Tasks: ${metrics.totalTasks}`);
        console.log(`   Completed Tasks: ${metrics.completedTasks}`);
        console.log(`   System IQ: ${metrics.systemIntelligence.overallIQ}`);
        console.log(`   Collective Intelligence: ${metrics.systemIntelligence.collectiveIntelligence}%`);
        console.log(`   Adaptability: ${metrics.systemIntelligence.adaptability}%`);
        console.log(`   Innovation: ${metrics.systemIntelligence.innovation}%`);
        
        console.log('\n💻 Resource Utilization:');
        console.log(`   CPU: ${metrics.resourceUtilization.cpu}%`);
        console.log(`   Memory: ${metrics.resourceUtilization.memory}%`);
        console.log(`   Network: ${metrics.resourceUtilization.network}%`);
        console.log(`   Energy: ${metrics.resourceUtilization.energy}%`);
      }
    } catch (error) {
      console.error('❌ Failed to get system metrics:', error);
    }
  }

  /**
   * Demonstrate Agent Listing and Analysis
   */
  async demonstrateAgentListing() {
    console.log('\n🤖 === AI Agents Analysis ===');
    
    try {
      const response = await fetch(`${this.baseUrl}/api/ai-agents?action=list-agents`);
      const data = await response.json();
      
      if (data.success) {
        const agents = data.data;
        console.log(`📋 Found ${agents.length} AI Agents:`);
        
        agents.forEach((agent: any) => {
          console.log(`\n🔹 ${agent.name} (${agent.type})`);
          console.log(`   Status: ${agent.status}`);
          console.log(`   Overall IQ: ${agent.intelligence.overallIQ}`);
          console.log(`   Success Rate: ${(agent.performance.successRate * 100).toFixed(1)}%`);
          console.log(`   Response Time: ${agent.performance.responseTime}ms`);
          console.log(`   Active Tasks: ${agent.tasks.active}`);
          console.log(`   Completed Tasks: ${agent.tasks.completed}`);
          console.log(`   Capabilities: ${agent.capabilities.join(', ')}`);
          console.log(`   Cognitive Load: ${(agent.performance.cognitiveLoad * 100).toFixed(1)}%`);
        });
      }
    } catch (error) {
      console.error('❌ Failed to list agents:', error);
    }
  }

  /**
   * Demonstrate Task Creation and Management
   */
  async demonstrateTaskManagement() {
    console.log('\n📝 === Task Management Demo ===');
    
    const taskTypes = ['analysis', 'optimization', 'monitoring', 'security', 'prediction', 'collaboration'];
    const priorities = ['critical', 'high', 'medium', 'low'];
    
    // Create sample tasks
    const sampleTasks = [
      {
        title: 'System Health Analysis',
        description: 'Comprehensive analysis of system health and performance metrics',
        type: 'analysis',
        priority: 'high'
      },
      {
        title: 'Security Vulnerability Scan',
        description: 'Perform comprehensive security scan and vulnerability assessment',
        type: 'security',
        priority: 'critical'
      },
      {
        title: 'Performance Optimization',
        description: 'Optimize system performance and resource utilization',
        type: 'optimization',
        priority: 'medium'
      },
      {
        title: 'Predictive Analytics',
        description: 'Generate predictive insights based on historical data patterns',
        type: 'prediction',
        priority: 'medium'
      }
    ];

    for (const task of sampleTasks) {
      try {
        console.log(`\n🔄 Creating task: ${task.title}`);
        
        const response = await fetch(`${this.baseUrl}/api/ai-agents`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'create-task',
            payload: task
          })
        });

        const data = await response.json();
        
        if (data.success) {
          console.log(`✅ Task created successfully`);
          console.log(`   Task ID: ${data.data.id}`);
          console.log(`   Status: ${data.data.status}`);
          console.log(`   Assigned Agent: ${data.data.assignedAgent || 'Pending assignment'}`);
          console.log(`   Priority: ${data.data.priority}`);
          console.log(`   Estimated Duration: ${Math.round(data.data.estimatedDuration / 1000)}s`);
        } else {
          console.log(`❌ Failed to create task: ${data.error}`);
        }
      } catch (error) {
        console.error(`❌ Error creating task ${task.title}:`, error);
      }
    }
  }

  /**
   * Demonstrate Agent Control
   */
  async demonstrateAgentControl() {
    console.log('\n🎮 === Agent Control Demo ===');
    
    try {
      const response = await fetch(`${this.baseUrl}/api/ai-agents?action=list-agents`);
      const data = await response.json();
      
      if (data.success) {
        const agents = data.data;
        
        for (const agent of agents) {
          console.log(`\n🤖 Controlling Agent: ${agent.name}`);
          
          // Demonstrate different control actions
          const actions = ['start', 'pause', 'restart'];
          
          for (const action of actions) {
            try {
              console.log(`   🔄 Executing ${action} action...`);
              
              const controlResponse = await fetch(`${this.baseUrl}/api/ai-agents`, {
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

              const controlData = await controlResponse.json();
              
              if (controlData.success) {
                console.log(`   ✅ ${action} action successful`);
                console.log(`   New Status: ${controlData.data.state.status}`);
              } else {
                console.log(`   ❌ ${action} action failed: ${controlData.error}`);
              }
              
              // Wait a bit between actions
              await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (error) {
              console.error(`   ❌ Error executing ${action}:`, error);
            }
          }
        }
      }
    } catch (error) {
      console.error('❌ Failed to demonstrate agent control:', error);
    }
  }

  /**
   * Demonstrate Collaboration Creation
   */
  async demonstrateCollaboration() {
    console.log('\n🤝 === Agent Collaboration Demo ===');
    
    try {
      const response = await fetch(`${this.baseUrl}/api/ai-agents?action=list-agents`);
      const data = await response.json();
      
      if (data.success) {
        const agents = data.data;
        const activeAgents = agents.filter((agent: any) => agent.status === 'active');
        
        if (activeAgents.length >= 2) {
          console.log(`\n🔗 Creating collaboration with ${activeAgents.length} active agents`);
          
          const collaborationTypes = [
            'task-sharing',
            'knowledge-exchange',
            'collective-intelligence',
            'quantum-entanglement'
          ];
          
          for (const collabType of collaborationTypes) {
            try {
              console.log(`\n🔄 Creating ${collabType} collaboration...`);
              
              const collabResponse = await fetch(`${this.baseUrl}/api/ai-agents`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  action: 'create-collaboration',
                  payload: {
                    type: collabType,
                    participants: activeAgents.slice(0, 3).map((agent: any) => agent.id),
                    name: `${collabType}-collaboration-${Date.now()}`
                  }
                })
              });

              const collabData = await collabResponse.json();
              
              if (collabData.success) {
                console.log(`✅ Collaboration created successfully`);
                console.log(`   Collaboration ID: ${collabData.data.id}`);
                console.log(`   Name: ${collabData.data.name}`);
                console.log(`   Type: ${collabData.data.type}`);
                console.log(`   Participants: ${collabData.data.participants.length}`);
                console.log(`   Status: ${collabData.data.status}`);
                console.log(`   Synergy: ${(collabData.data.synergy * 100).toFixed(1)}%`);
                console.log(`   Efficiency: ${(collabData.data.efficiency * 100).toFixed(1)}%`);
              } else {
                console.log(`❌ Failed to create collaboration: ${collabData.error}`);
              }
            } catch (error) {
              console.error(`❌ Error creating ${collabType} collaboration:`, error);
            }
          }
        } else {
          console.log('❌ Not enough active agents for collaboration');
        }
      }
    } catch (error) {
      console.error('❌ Failed to demonstrate collaboration:', error);
    }
  }

  /**
   * Demonstrate Advanced AI Integration
   */
  async demonstrateAdvancedAI() {
    console.log('\n🧠 === Advanced AI Integration Demo ===');
    
    try {
      // Use ZAI for advanced AI processing
      const completion = await this.zai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are an expert AI agent orchestrator. Analyze the current system state and provide optimization recommendations.'
          },
          {
            role: 'user',
            content: 'Analyze the OptiMind AI Agents system and provide strategic recommendations for maximizing agent collaboration and performance optimization.'
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      });

      console.log('🎯 AI Analysis Results:');
      console.log(completion.choices[0]?.message?.content || 'No response received');
      
      // Generate an image for system visualization
      console.log('\n🖼️ Generating System Visualization...');
      
      const imageResponse = await this.zai.images.generations.create({
        prompt: 'OptiMind AI Agents system architecture showing interconnected AI agents with quantum processing capabilities, real-time collaboration, and enterprise-grade security features',
        size: '1024x1024'
      });

      console.log('✅ System visualization generated');
      console.log(`📸 Image data length: ${imageResponse.data[0].base64.length} characters`);
      
    } catch (error) {
      console.error('❌ Failed to demonstrate advanced AI:', error);
    }
  }

  /**
   * Demonstrate Performance Analytics
   */
  async demonstratePerformanceAnalytics() {
    console.log('\n📈 === Performance Analytics Demo ===');
    
    try {
      // Get current system metrics
      const metricsResponse = await fetch(`${this.baseUrl}/api/ai-agents?action=system-metrics`);
      const metricsData = await metricsResponse.json();
      
      if (metricsData.success) {
        const metrics = metricsData.data;
        
        console.log('📊 System Performance Analysis:');
        console.log(`   Overall System Health: ${((metrics.systemIntelligence.collectiveIntelligence + metrics.systemIntelligence.adaptability + metrics.systemIntelligence.innovation) / 3).toFixed(1)}%`);
        console.log(`   Agent Efficiency: ${((100 - metrics.resourceUtilization.cpu) + (100 - metrics.resourceUtilization.memory) + (100 - metrics.resourceUtilization.energy)) / 3).toFixed(1)}%`);
        console.log(`   Task Completion Rate: ${((metrics.completedTasks / metrics.totalTasks) * 100).toFixed(1)}%`);
        
        // Performance recommendations
        console.log('\n💡 Performance Recommendations:');
        
        if (metrics.resourceUtilization.cpu > 80) {
          console.log('   ⚠️  High CPU usage detected - Consider scaling resources');
        }
        
        if (metrics.resourceUtilization.memory > 80) {
          console.log('   ⚠️  High memory usage detected - Optimize agent configurations');
        }
        
        if (metrics.systemIntelligence.adaptability < 80) {
          console.log('   📈 Enable learning mode for better adaptability');
        }
        
        if (metrics.activeAgents < metrics.totalAgents * 0.8) {
          console.log('   🔄 Activate idle agents for better resource utilization');
        }
        
        // Calculate optimization potential
        const optimizationPotential = {
          cpu: Math.max(0, 100 - metrics.resourceUtilization.cpu),
          memory: Math.max(0, 100 - metrics.resourceUtilization.memory),
          network: Math.max(0, 100 - metrics.resourceUtilization.network),
          energy: Math.max(0, 100 - metrics.resourceUtilization.energy)
        };
        
        console.log('\n🎯 Optimization Potential:');
        Object.entries(optimizationPotential).forEach(([resource, potential]) => {
          console.log(`   ${resource.toUpperCase()}: ${potential.toFixed(1)}% improvement possible`);
        });
      }
    } catch (error) {
      console.error('❌ Failed to demonstrate performance analytics:', error);
    }
  }

  /**
   * Run Complete Demonstration
   */
  async runCompleteDemo() {
    console.log('🚀 Starting OptiMind AI Agents Complete Demonstration');
    console.log('=' * 60);
    
    await this.demonstrateSystemOverview();
    await this.demonstrateAgentListing();
    await this.demonstrateTaskManagement();
    await this.demonstrateAgentControl();
    await this.demonstrateCollaboration();
    await this.demonstrateAdvancedAI();
    await this.demonstratePerformanceAnalytics();
    
    console.log('\n🎉 OptiMind AI Agents Demonstration Complete!');
    console.log('💡 Visit http://localhost:3000/ai-agents to access the dashboard');
  }
}

// Export the demo class
export default OptiMindAIAgentsDemo;

// Auto-run if this file is executed directly
if (require.main === module) {
  const demo = new OptiMindAIAgentsDemo();
  demo.runCompleteDemo().catch(console.error);
}