/**
 * OptiMind AI Agents - Advanced Leverage Demo
 * 
 * This script demonstrates advanced techniques for leveraging AI agents
 * including task optimization, collaboration, and intelligent resource allocation.
 */

class AgentLeverageDemo {
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:3007') {
    this.baseUrl = baseUrl;
  }

  /**
   * Get detailed agent information and capabilities
   */
  async getAgentDetails(agentId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/ai-agents?action=agent-details&agentId=${agentId}`);
      const result = await response.json();
      
      if (result.success) {
        return result.data;
      } else {
        console.error(`Failed to get agent details: ${result.error}`);
        return null;
      }
    } catch (error) {
      console.error('Error fetching agent details:', error);
      return null;
    }
  }

  /**
   * Analyze agent capabilities and suggest optimal tasks
   */
  async analyzeAgentCapabilities(): Promise<void> {
    console.log('🔍 Analyzing Agent Capabilities...');
    console.log('─'.repeat(40));

    try {
      // Get all agents
      const response = await fetch(`${this.baseUrl}/api/ai-agents?action=list-agents`);
      const result = await response.json();
      
      if (result.success) {
        const agents = result.data;
        
        for (const agent of agents) {
          console.log(`\n🤖 Agent: ${agent.name}`);
          console.log(`   Type: ${agent.type}`);
          console.log(`   Status: ${agent.status}`);
          console.log(`   Intelligence: ${agent.intelligence.overallIQ} IQ`);
          console.log(`   Active Tasks: ${agent.tasks.active}/${agent.tasks.completed + agent.tasks.active + agent.tasks.failed}`);
          
          // Analyze capabilities
          console.log(`   Top Capabilities:`);
          agent.capabilities.forEach((capability: string, index: number) => {
            console.log(`     ${index + 1}. ${capability}`);
          });
          
          // Performance analysis
          console.log(`   Performance Metrics:`);
          console.log(`     • Success Rate: ${(agent.performance.successRate * 100).toFixed(1)}%`);
          console.log(`     • Response Time: ${agent.performance.responseTime}ms`);
          console.log(`     • Cognitive Load: ${(agent.performance.cognitiveLoad * 100).toFixed(1)}%`);
          console.log(`     • Efficiency: ${(agent.performance.efficiency * 100).toFixed(1)}%`);
          
          // Resource utilization
          console.log(`   Resource Usage:`);
          console.log(`     • CPU: ${(agent.resources.cpu * 100).toFixed(1)}%`);
          console.log(`     • Memory: ${(agent.resources.memory * 100).toFixed(1)}%`);
          console.log(`     • Network: ${(agent.resources.network * 100).toFixed(1)}%`);
          
          // Suggest optimal tasks
          console.log(`   Recommended Tasks:`);
          this.suggestOptimalTasks(agent);
          
          console.log('─'.repeat(40));
        }
      }
    } catch (error) {
      console.error('Error analyzing capabilities:', error);
    }
  }

  /**
   * Suggest optimal tasks based on agent capabilities
   */
  private suggestOptimalTasks(agent: any): void {
    const suggestions = [];
    
    if (agent.capabilities.includes('natural-language-processing')) {
      suggestions.push('• Content analysis and generation');
      suggestions.push('• Customer support automation');
    }
    
    if (agent.capabilities.includes('data-analysis')) {
      suggestions.push('• Business intelligence reporting');
      suggestions.push('• Performance metrics analysis');
    }
    
    if (agent.capabilities.includes('reasoning')) {
      suggestions.push('• Complex problem solving');
      suggestions.push('• Decision support systems');
    }
    
    if (agent.capabilities.includes('orchestration')) {
      suggestions.push('• Workflow automation');
      suggestions.push('• Multi-agent coordination');
    }
    
    if (agent.capabilities.includes('pattern-recognition')) {
      suggestions.push('• Anomaly detection');
      suggestions.push('• Predictive modeling');
    }
    
    // Add suggestions based on performance metrics
    if (agent.performance.successRate > 0.95) {
      suggestions.push('• High-stakes mission-critical tasks');
    }
    
    if (agent.performance.responseTime < 50) {
      suggestions.push('• Real-time processing tasks');
    }
    
    if (agent.performance.cognitiveLoad < 0.5) {
      suggestions.push('• Additional concurrent tasks');
    }
    
    suggestions.forEach(suggestion => console.log(`     ${suggestion}`));
  }

  /**
   * Create intelligent task assignments
   */
  async createIntelligentTaskAssignments(): Promise<void> {
    console.log('\n🎯 Creating Intelligent Task Assignments...');
    console.log('─'.repeat(40));

    const tasks = [
      {
        title: 'Real-time Data Analysis',
        description: 'Analyze streaming data for immediate insights',
        type: 'analysis',
        priority: 'high'
      },
      {
        title: 'Security Audit',
        description: 'Comprehensive security vulnerability assessment',
        type: 'security',
        priority: 'critical'
      },
      {
        title: 'Performance Optimization',
        description: 'Identify and resolve performance bottlenecks',
        type: 'optimization',
        priority: 'medium'
      },
      {
        title: 'Predictive Modeling',
        description: 'Create predictive models for future trends',
        type: 'prediction',
        priority: 'medium'
      }
    ];

    // Get available agents
    const agentsResponse = await fetch(`${this.baseUrl}/api/ai-agents?action=list-agents`);
    const agentsResult = await agentsResponse.json();
    
    if (!agentsResult.success) {
      console.error('Failed to get agents:', agentsResult.error);
      return;
    }

    const agents = agentsResult.data;
    const availableAgents = agents.filter((agent: any) => 
      agent.status === 'active' && agent.tasks.active < 3
    );

    console.log(`Found ${availableAgents.length} available agents for ${tasks.length} tasks`);

    // Assign tasks to best-fit agents
    for (const task of tasks) {
      const bestAgent = this.findBestAgentForTask(task, availableAgents);
      
      if (bestAgent) {
        console.log(`\nAssigning "${task.title}" to ${bestAgent.name}`);
        console.log(`   Reason: ${this.getAssignmentReason(task, bestAgent)}`);
        
        // Create the task
        await this.createTask({
          ...task,
          estimatedDuration: this.estimateTaskDuration(task.type)
        });
      } else {
        console.log(`\nNo suitable agent found for "${task.title}" - task queued`);
      }
    }
  }

  /**
   * Find the best agent for a specific task
   */
  private findBestAgentForTask(task: any, agents: any[]): any | null {
    let bestAgent = null;
    let bestScore = 0;

    for (const agent of agents) {
      let score = 0;
      
      // Score based on agent type and task type
      if (task.type === 'analysis' && agent.type === 'specialist') score += 30;
      if (task.type === 'security' && agent.type === 'primary') score += 30;
      if (task.type === 'optimization' && agent.type === 'primary') score += 25;
      if (task.type === 'prediction' && agent.type === 'specialist') score += 25;
      
      // Score based on capabilities
      if (task.type === 'analysis' && agent.capabilities.includes('data-analysis')) score += 20;
      if (task.type === 'security' && agent.capabilities.includes('reasoning')) score += 20;
      if (task.type === 'optimization' && agent.capabilities.includes('orchestration')) score += 20;
      if (task.type === 'prediction' && agent.capabilities.includes('pattern-recognition')) score += 20;
      
      // Score based on performance metrics
      score += agent.performance.successRate * 15;
      score += (1 - agent.performance.cognitiveLoad) * 10;
      score += agent.performance.efficiency * 10;
      
      // Score based on current load
      if (agent.tasks.active === 0) score += 15;
      if (agent.tasks.active === 1) score += 10;
      if (agent.tasks.active === 2) score += 5;
      
      if (score > bestScore) {
        bestScore = score;
        bestAgent = agent;
      }
    }

    return bestAgent;
  }

  /**
   * Get assignment reason for debugging
   */
  private getAssignmentReason(task: any, agent: any): string {
    const reasons = [];
    
    if (task.type === 'analysis' && agent.type === 'specialist') {
      reasons.push('specialist in analysis');
    }
    if (task.type === 'security' && agent.type === 'primary') {
      reasons.push('primary security handler');
    }
    if (agent.capabilities.includes('data-analysis')) {
      reasons.push('strong data analysis capability');
    }
    if (agent.performance.successRate > 0.95) {
      reasons.push('high success rate');
    }
    if (agent.performance.cognitiveLoad < 0.5) {
      reasons.push('low cognitive load');
    }
    
    return reasons.join(', ');
  }

  /**
   * Estimate task duration based on type
   */
  private estimateTaskDuration(taskType: string): number {
    switch (taskType) {
      case 'analysis': return 1800000; // 30 minutes
      case 'security': return 3600000; // 60 minutes
      case 'optimization': return 2400000; // 40 minutes
      case 'prediction': return 3000000; // 50 minutes
      default: return 1800000; // 30 minutes
    }
  }

  /**
   * Create a task
   */
  private async createTask(task: any): Promise<void> {
    try {
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
        console.log(`   ✅ Task created: ${result.data.id}`);
      } else {
        console.log(`   ❌ Task creation failed: ${result.error}`);
      }
    } catch (error) {
      console.log(`   ❌ Task creation error: ${error}`);
    }
  }

  /**
   * Monitor and optimize agent performance
   */
  async monitorAndOptimize(): Promise<void> {
    console.log('\n📊 Monitoring and Optimizing Agent Performance...');
    console.log('─'.repeat(40));

    try {
      // Get system metrics
      const metricsResponse = await fetch(`${this.baseUrl}/api/ai-agents?action=system-metrics`);
      const metricsResult = await metricsResponse.json();
      
      if (metricsResult.success) {
        const metrics = metricsResult.data;
        
        console.log('System Performance Overview:');
        console.log(`• Total Agents: ${metrics.totalAgents}`);
        console.log(`• Active Agents: ${metrics.activeAgents}`);
        console.log(`• Collective IQ: ${metrics.systemIntelligence.overallIQ}`);
        console.log(`• System Efficiency: ${metrics.systemIntelligence.collectiveIntelligence}%`);
        
        console.log('\nResource Utilization:');
        console.log(`• CPU: ${metrics.resourceUtilization.cpu}%`);
        console.log(`• Memory: ${metrics.resourceUtilization.memory}%`);
        console.log(`• Network: ${metrics.resourceUtilization.network}%`);
        console.log(`• Energy: ${metrics.resourceUtilization.energy}%`);
        
        // Generate optimization recommendations
        console.log('\n💡 Optimization Recommendations:');
        this.generateOptimizationRecommendations(metrics);
      }
    } catch (error) {
      console.error('Error monitoring performance:', error);
    }
  }

  /**
   * Generate optimization recommendations
   */
  private generateOptimizationRecommendations(metrics: any): void {
    const recommendations = [];
    
    // CPU optimization
    if (metrics.resourceUtilization.cpu > 70) {
      recommendations.push('• Consider CPU scaling or load balancing');
    }
    
    // Memory optimization
    if (metrics.resourceUtilization.memory > 70) {
      recommendations.push('• Implement memory optimization strategies');
    }
    
    // Network optimization
    if (metrics.resourceUtilization.network > 60) {
      recommendations.push('• Optimize network communication patterns');
    }
    
    // Energy efficiency
    if (metrics.resourceUtilization.energy > 80) {
      recommendations.push('• Implement energy-saving measures');
    }
    
    // Intelligence optimization
    if (metrics.systemIntelligence.collectiveIntelligence < 80) {
      recommendations.push('• Enhance agent collaboration protocols');
    }
    
    if (metrics.systemIntelligence.adaptability < 80) {
      recommendations.push('• Improve agent learning algorithms');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('• System is operating optimally');
    }
    
    recommendations.forEach(rec => console.log(rec));
  }

  /**
   * Run the complete agent leverage demo
   */
  async runDemo(): Promise<void> {
    console.log('🚀 OptiMind AI Agents - Advanced Leverage Demo');
    console.log('═'.repeat(60));
    console.log('This demo showcases advanced techniques for leveraging AI agents');
    console.log('including intelligent task assignment, performance optimization,');
    console.log('and resource management.');
    console.log('');

    // Step 1: Analyze agent capabilities
    await this.analyzeAgentCapabilities();
    
    // Step 2: Create intelligent task assignments
    await this.createIntelligentTaskAssignments();
    
    // Step 3: Monitor and optimize performance
    await this.monitorAndOptimize();
    
    console.log('\n🎉 Advanced Agent Leverage Demo Completed!');
    console.log('');
    console.log('🔑 Key Insights:');
    console.log('   • Agents can be optimally matched to tasks based on capabilities');
    console.log('   • Performance metrics drive intelligent task assignment');
    console.log('   • Resource utilization is continuously monitored and optimized');
    console.log('   • System provides actionable optimization recommendations');
    console.log('   • Collective intelligence emerges from agent collaboration');
    console.log('');
    console.log('📈 Business Impact:');
    console.log('   • Improved operational efficiency');
    console.log('   • Better resource utilization');
    console.log('   • Enhanced decision-making capabilities');
    console.log('   • Scalable and adaptable AI operations');
  }
}

// Auto-run demo if this file is executed directly
if (require.main === module) {
  const demo = new AgentLeverageDemo();
  demo.runDemo().catch(console.error);
}

export default AgentLeverageDemo;