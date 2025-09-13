/**
 * OptiMind AI Agents Demo - Practical Agent Leverage Example
 * 
 * This script demonstrates how to effectively leverage the OptiMind AI Agents
 * for various tasks including analysis, optimization, and collaboration.
 */

interface AgentTask {
  id: string;
  title: string;
  description: string;
  type: 'analysis' | 'optimization' | 'monitoring' | 'security' | 'prediction' | 'collaboration';
  priority: 'critical' | 'high' | 'medium' | 'low';
  estimatedDuration: number; // in milliseconds
}

interface AgentResponse {
  success: boolean;
  data?: any;
  error?: string;
  timestamp: string;
}

class OptiMindAgentsDemo {
  private baseUrl: string;
  private agents: any[] = [];

  constructor(baseUrl: string = 'http://localhost:3007') {
    this.baseUrl = baseUrl;
  }

  /**
   * Initialize the demo by fetching available agents
   */
  async initialize(): Promise<void> {
    try {
      console.log('🚀 Initializing OptiMind AI Agents Demo...');
      
      // Fetch system metrics and agents
      const response = await fetch(`${this.baseUrl}/api/ai-agents?action=list-agents`);
      const result = await response.json();
      
      if (result.success) {
        this.agents = result.data;
        console.log(`✅ Found ${this.agents.length} AI agents ready for tasks`);
        this.displayAgentOverview();
      } else {
        console.error('❌ Failed to initialize:', result.error);
      }
    } catch (error) {
      console.error('❌ Initialization error:', error);
    }
  }

  /**
   * Display overview of available agents
   */
  private displayAgentOverview(): void {
    console.log('\n📊 Available AI Agents:');
    console.log('─'.repeat(50));
    
    this.agents.forEach((agent, index) => {
      console.log(`${index + 1}. ${agent.name}`);
      console.log(`   Type: ${agent.type}`);
      console.log(`   Status: ${agent.status}`);
      console.log(`   Capabilities: ${agent.capabilities.slice(0, 3).join(', ')}...`);
      console.log(`   Intelligence: ${agent.intelligence.overallIQ} IQ`);
      console.log(`   Success Rate: ${(agent.performance.successRate * 100).toFixed(1)}%`);
      console.log('');
    });
  }

  /**
   * Create and assign a task to the best available agent
   */
  async createTask(task: AgentTask): Promise<AgentResponse> {
    try {
      console.log(`🎯 Creating task: "${task.title}"`);
      
      const response = await fetch(`${this.baseUrl}/api/ai-agents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create-task',
          payload: task
        })
      });

      const result = await response.json();
      
      if (result.success) {
        console.log(`✅ Task created successfully!`);
        console.log(`   Task ID: ${result.data.id}`);
        console.log(`   Assigned to: ${result.data.assignedAgent || 'Pending assignment'}`);
        console.log(`   Status: ${result.data.status}`);
        console.log(`   Priority: ${result.data.priority}`);
      } else {
        console.error(`❌ Failed to create task: ${result.error}`);
      }

      return result;
    } catch (error) {
      console.error('❌ Task creation error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error', timestamp: new Date().toISOString() };
    }
  }

  /**
   * Demonstrate collaborative intelligence by creating a collaboration
   */
  async createCollaboration(): Promise<AgentResponse> {
    try {
      console.log('🤝 Creating AI Agent Collaboration...');
      
      const response = await fetch(`${this.baseUrl}/api/ai-agents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create-collaboration',
          payload: {
            name: 'Collective Intelligence Task Force',
            type: 'collective-intelligence',
            participants: this.agents.slice(0, 2).map(a => a.id)
          }
        })
      });

      const result = await response.json();
      
      if (result.success) {
        console.log(`✅ Collaboration created successfully!`);
        console.log(`   Collaboration ID: ${result.data.id}`);
        console.log(`   Participants: ${result.data.participants.length} agents`);
        console.log(`   Type: ${result.data.type}`);
        console.log(`   Status: ${result.data.status}`);
      } else {
        console.error(`❌ Failed to create collaboration: ${result.error}`);
      }

      return result;
    } catch (error) {
      console.error('❌ Collaboration creation error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error', timestamp: new Date().toISOString() };
    }
  }

  /**
   * Get system metrics and display them
   */
  async displaySystemMetrics(): Promise<void> {
    try {
      console.log('📈 Fetching System Metrics...');
      
      const response = await fetch(`${this.baseUrl}/api/ai-agents?action=system-metrics`);
      const result = await response.json();
      
      if (result.success) {
        const metrics = result.data;
        console.log('\n📊 System Intelligence Overview:');
        console.log('─'.repeat(40));
        console.log(`Total Agents: ${metrics.totalAgents}`);
        console.log(`Active Agents: ${metrics.activeAgents}`);
        console.log(`Collective IQ: ${metrics.systemIntelligence.overallIQ}`);
        console.log(`Collective Intelligence: ${metrics.systemIntelligence.collectiveIntelligence}%`);
        console.log(`Adaptability: ${metrics.systemIntelligence.adaptability}%`);
        console.log(`Innovation: ${metrics.systemIntelligence.innovation}%`);
        console.log('');
        
        console.log('💻 Resource Utilization:');
        console.log(`CPU: ${metrics.resourceUtilization.cpu}%`);
        console.log(`Memory: ${metrics.resourceUtilization.memory}%`);
        console.log(`Network: ${metrics.resourceUtilization.network}%`);
        console.log(`Energy: ${metrics.resourceUtilization.energy}%`);
      } else {
        console.error('❌ Failed to fetch metrics:', result.error);
      }
    } catch (error) {
      console.error('❌ Metrics fetch error:', error);
    }
  }

  /**
   * Run a comprehensive demo showcasing agent capabilities
   */
  async runDemo(): Promise<void> {
    console.log('🎭 Starting OptiMind AI Agents Comprehensive Demo');
    console.log('═'.repeat(60));

    // Initialize
    await this.initialize();

    // Display system metrics
    await this.displaySystemMetrics();

    // Create sample tasks
    const sampleTasks: AgentTask[] = [
      {
        id: 'demo-analysis-001',
        title: 'System Performance Analysis',
        description: 'Analyze current system performance and identify optimization opportunities',
        type: 'analysis',
        priority: 'high',
        estimatedDuration: 1800000 // 30 minutes
      },
      {
        id: 'demo-security-001',
        title: 'Security Vulnerability Assessment',
        description: 'Perform comprehensive security scan and vulnerability assessment',
        type: 'security',
        priority: 'critical',
        estimatedDuration: 3600000 // 60 minutes
      },
      {
        id: 'demo-optimization-001',
        title: 'Resource Optimization',
        description: 'Optimize resource allocation and improve system efficiency',
        type: 'optimization',
        priority: 'medium',
        estimatedDuration: 2400000 // 40 minutes
      },
      {
        id: 'demo-prediction-001',
        title: 'Predictive Analytics',
        description: 'Generate predictive insights based on system behavior patterns',
        type: 'prediction',
        priority: 'medium',
        estimatedDuration: 3000000 // 50 minutes
      }
    ];

    // Create tasks
    console.log('\n🎯 Creating Sample Tasks:');
    console.log('─'.repeat(30));
    
    for (const task of sampleTasks) {
      await this.createTask(task);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Small delay between tasks
    }

    // Create collaboration
    console.log('\n🤝 Creating Agent Collaboration:');
    console.log('─'.repeat(30));
    await this.createCollaboration();

    // Final metrics display
    console.log('\n📊 Final System Status:');
    console.log('─'.repeat(30));
    await this.displaySystemMetrics();

    console.log('\n🎉 Demo completed successfully!');
    console.log('💡 Key Takeaways:');
    console.log('   • AI Agents can be dynamically assigned tasks based on capabilities');
    console.log('   • System monitors agent performance and resource utilization');
    console.log('   • Collaborative intelligence enables enhanced problem-solving');
    console.log('   • Real-time metrics provide insights into system health');
    console.log('   • Tasks are automatically optimized for best agent fit');
  }
}

// Auto-run demo if this file is executed directly
if (require.main === module) {
  const demo = new OptiMindAgentsDemo();
  demo.runDemo().catch(console.error);
}

export default OptiMindAgentsDemo;