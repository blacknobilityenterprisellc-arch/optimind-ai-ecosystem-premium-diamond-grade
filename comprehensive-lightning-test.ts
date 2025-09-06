#!/usr/bin/env tsx

/**
 * Comprehensive OptiMind AI Lightning Health Check Test
 * Tests all services with real API keys and comprehensive reporting
 */

import { premiumZAIWrapper } from './src/lib/zai-sdk-wrapper';
import { enhancedMCPService } from './src/lib/mcp-service-enhanced';
import { premiumDatabaseWrapper } from './src/lib/database-health-wrapper';
import { openRouterService } from './src/lib/openrouter-service';

interface ComprehensiveHealthResult {
  status: 'HEALTHY' | 'WARNING' | 'CRITICAL';
  score: number;
  timestamp: Date;
  components: {
    zai: { status: boolean; details: any; responseTime: number };
    database: { status: boolean; details: any; responseTime: number };
    mcp: { status: boolean; details: any; responseTime: number };
    openrouter: { status: boolean; details: any; responseTime: number };
    system: { status: boolean; details: any; responseTime: number };
  };
  insights: string[];
  recommendations: string[];
  aiAnalysis: {
    modelUsed: string;
    confidence: number;
    processingTime: number;
    analysis: string;
  };
}

class ComprehensiveLightningTest {
  private results: ComprehensiveHealthResult;

  constructor() {
    this.results = {
      status: 'CRITICAL',
      score: 0,
      timestamp: new Date(),
      components: {
        zai: { status: false, details: null, responseTime: 0 },
        database: { status: false, details: null, responseTime: 0 },
        mcp: { status: false, details: null, responseTime: 0 },
        openrouter: { status: false, details: null, responseTime: 0 },
        system: { status: false, details: null, responseTime: 0 },
      },
      insights: [],
      recommendations: [],
      aiAnalysis: {
        modelUsed: 'N/A',
        confidence: 0,
        processingTime: 0,
        analysis: '',
      },
    };
  }

  async runComprehensiveTest(): Promise<ComprehensiveHealthResult> {
    console.log('🚀 Starting Comprehensive OptiMind AI Lightning Health Check...');
    const startTime = Date.now();

    try {
      // Test all components
      await Promise.all([
        this.testZAI(),
        this.testDatabase(),
        this.testMCP(),
        this.testOpenRouter(),
        this.testSystem(),
      ]);

      // Calculate overall score and status
      this.calculateOverallScore();

      // Generate AI-powered analysis
      await this.generateAIAnalysis();

      const totalTime = Date.now() - startTime;
      console.log(`⚡ Comprehensive Health Check completed in ${totalTime}ms`);

      this.displayResults();
      return this.results;

    } catch (error) {
      console.error('❌ Comprehensive test failed:', error);
      throw error;
    }
  }

  private async testZAI(): Promise<void> {
    const testStart = Date.now();
    
    try {
      console.log('🤖 Testing Z.AI Service...');
      
      // Initialize ZAI wrapper with real API key
      const zaiInstance = premiumZAIWrapper.getInstance({
        apiKey: '1dc8da695f1846c5a76483eb2252023d.pYnbmJbwCWPpNHvY',
        fallbackMode: false,
      });

      // Wait for availability
      const available = await zaiInstance.waitForAvailability(10000);
      
      if (available) {
        // Test actual API call
        const response = await zaiInstance.createChatCompletion({
          messages: [
            { role: 'system', content: 'You are a health check assistant. Respond with "OK" only.' },
            { role: 'user', content: 'Health check' }
          ],
          max_tokens: 10,
          temperature: 0.1,
        });

        const content = response.choices[0]?.message?.content;
        const success = content === 'OK';
        
        this.results.components.zai = {
          status: success,
          details: { 
            model: response.model || 'GLM-4-Plus',
            usage: response.usage,
            content: content 
          },
          responseTime: Date.now() - testStart,
        };

        console.log(`Z.AI Service: ${success ? '✅ Healthy' : '❌ Unhealthy'}`);
      } else {
        throw new Error('Z.AI service not available');
      }

    } catch (error) {
      console.error('Z.AI test failed:', error);
      this.results.components.zai = {
        status: false,
        details: { error: error instanceof Error ? error.message : 'Unknown error' },
        responseTime: Date.now() - testStart,
      };
      console.log('Z.AI Service: ❌ Unhealthy');
    }
  }

  private async testDatabase(): Promise<void> {
    const testStart = Date.now();
    
    try {
      console.log('🗄️ Testing Database Service...');
      
      // Test database connection
      const healthStatus = await premiumDatabaseWrapper.getHealthStatus();
      const success = healthStatus.connected;
      
      this.results.components.database = {
        status: success,
        details: healthStatus,
        responseTime: Date.now() - testStart,
      };

      console.log(`Database Service: ${success ? '✅ Healthy' : '❌ Unhealthy'}`);

    } catch (error) {
      console.error('Database test failed:', error);
      this.results.components.database = {
        status: false,
        details: { error: error instanceof Error ? error.message : 'Unknown error' },
        responseTime: Date.now() - testStart,
      };
      console.log('Database Service: ❌ Unhealthy');
    }
  }

  private async testMCP(): Promise<void> {
    const testStart = Date.now();
    
    try {
      console.log('🔗 Testing MCP Service...');
      
      // Test MCP service health
      const healthStatus = await enhancedMCPService.getHealthStatus();
      const success = healthStatus.status === 'HEALTHY' || healthStatus.status === 'DEGRADED';
      
      this.results.components.mcp = {
        status: success,
        details: healthStatus,
        responseTime: Date.now() - testStart,
      };

      console.log(`MCP Service: ${success ? '✅ Healthy' : '❌ Unhealthy'}`);

    } catch (error) {
      console.error('MCP test failed:', error);
      this.results.components.mcp = {
        status: false,
        details: { error: error instanceof Error ? error.message : 'Unknown error' },
        responseTime: Date.now() - testStart,
      };
      console.log('MCP Service: ❌ Unhealthy');
    }
  }

  private async testOpenRouter(): Promise<void> {
    const testStart = Date.now();
    
    try {
      console.log('🌐 Testing OpenRouter Service...');
      
      // Test OpenRouter models availability
      const models = openRouterService.getAvailableModels();
      const success = models.length > 0;
      
      this.results.components.openrouter = {
        status: success,
        details: { 
          modelCount: models.length,
          models: models.slice(0, 5).map(m => m.name) // Show first 5 models
        },
        responseTime: Date.now() - testStart,
      };

      console.log(`OpenRouter Service: ${success ? '✅ Healthy' : '❌ Unhealthy'}`);

    } catch (error) {
      console.error('OpenRouter test failed:', error);
      this.results.components.openrouter = {
        status: false,
        details: { error: error instanceof Error ? error.message : 'Unknown error' },
        responseTime: Date.now() - testStart,
      };
      console.log('OpenRouter Service: ❌ Unhealthy');
    }
  }

  private async testSystem(): Promise<void> {
    const testStart = Date.now();
    
    try {
      console.log('💻 Testing System Resources...');
      
      // Check system resources
      const used = process.memoryUsage();
      const totalMemory = require('os').totalmem();
      const freeMemory = require('os').freemem();
      const memoryUsagePercent = ((totalMemory - freeMemory) / totalMemory) * 100;
      const cpuUsage = process.cpuUsage();

      const success = memoryUsagePercent < 90;
      
      this.results.components.system = {
        status: success,
        details: {
          memoryUsage: Math.round(memoryUsagePercent * 100) / 100,
          memoryUsed: Math.round(used.heapUsed / 1024 / 1024), // MB
          memoryTotal: Math.round(totalMemory / 1024 / 1024), // MB
          cpuUsage: cpuUsage,
        },
        responseTime: Date.now() - testStart,
      };

      console.log(`System Resources: ${success ? '✅ Healthy' : '❌ Unhealthy'}`);

    } catch (error) {
      console.error('System test failed:', error);
      this.results.components.system = {
        status: false,
        details: { error: error instanceof Error ? error.message : 'Unknown error' },
        responseTime: Date.now() - testStart,
      };
      console.log('System Resources: ❌ Unhealthy');
    }
  }

  private calculateOverallScore(): void {
    const components = this.results.components;
    const healthyCount = Object.values(components).filter(c => c.status).length;
    const totalCount = Object.keys(components).length;
    
    this.results.score = Math.round((healthyCount / totalCount) * 100);
    
    if (this.results.score >= 90) {
      this.results.status = 'HEALTHY';
    } else if (this.results.score >= 70) {
      this.results.status = 'WARNING';
    } else {
      this.results.status = 'CRITICAL';
    }

    // Generate insights
    this.generateInsights();
  }

  private generateInsights(): void {
    const { components } = this.results;
    const insights: string[] = [];
    
    const healthyCount = Object.values(components).filter(c => c.status).length;
    const totalCount = Object.keys(components).length;

    if (healthyCount === totalCount) {
      insights.push('🎉 All systems are operating optimally');
    } else if (healthyCount >= totalCount * 0.8) {
      insights.push('⚠️ Minor issues detected but system remains functional');
    } else {
      insights.push('🚨 Multiple system issues require immediate attention');
    }

    // Component-specific insights
    if (!components.zai.status) {
      insights.push('🤖 Z.AI service requires attention for AI-powered features');
    }
    if (!components.database.status) {
      insights.push('🗄️ Database connectivity issues may affect data persistence');
    }
    if (!components.mcp.status) {
      insights.push('🔗 MCP service issues may impact tool orchestration');
    }
    if (!components.openrouter.status) {
      insights.push('🌐 OpenRouter service limits multi-model AI capabilities');
    }
    if (!components.system.status) {
      insights.push('💻 System resource constraints may affect performance');
    }

    this.results.insights = insights;
  }

  private async generateAIAnalysis(): Promise<void> {
    const analysisStart = Date.now();
    
    try {
      // Use Z.AI to generate analysis if available
      if (this.results.components.zai.status) {
        const zaiInstance = premiumZAIWrapper.getInstance({
          apiKey: '1dc8da695f1846c5a76483eb2252023d.pYnbmJbwCWPpNHvY',
        });

        const systemPrompt = `
You are an expert AI system analyst for the OptiMind AI Ecosystem. Analyze the following health check results:

Component Status:
- Z.AI Service: ${this.results.components.zai.status ? 'Healthy' : 'Unhealthy'}
- Database Service: ${this.results.components.database.status ? 'Healthy' : 'Unhealthy'}
- MCP Service: ${this.results.components.mcp.status ? 'Healthy' : 'Unhealthy'}
- OpenRouter Service: ${this.results.components.openrouter.status ? 'Healthy' : 'Unhealthy'}
- System Resources: ${this.results.components.system.status ? 'Healthy' : 'Unhealthy'}

Overall Score: ${this.results.score}/100
Status: ${this.results.status}

Provide a concise analysis of the system health status, identify any patterns or issues, and assess the overall reliability of the OptiMind AI Ecosystem.
`;

        const response = await zaiInstance.createChatCompletion({
          messages: [{ role: 'system', content: systemPrompt }],
          max_tokens: 300,
          temperature: 0.3,
        });

        this.results.aiAnalysis = {
          modelUsed: 'GLM-4-Plus',
          confidence: 0.9,
          processingTime: Date.now() - analysisStart,
          analysis: response.choices[0]?.message?.content || 'Analysis unavailable',
        };
      } else {
        // Fallback analysis
        this.results.aiAnalysis = {
          modelUsed: 'Rule-Based',
          confidence: 0.7,
          processingTime: Date.now() - analysisStart,
          analysis: `System analysis shows ${this.results.score}% health with ${this.results.status} status. ${this.results.insights.join(' ')}`,
        };
      }

    } catch (error) {
      console.warn('AI analysis generation failed:', error);
      this.results.aiAnalysis = {
        modelUsed: 'N/A',
        confidence: 0,
        processingTime: Date.now() - analysisStart,
        analysis: 'AI analysis unavailable',
      };
    }
  }

  private generateRecommendations(): string[] {
    const { components } = this.results;
    const recommendations: string[] = [];

    if (!components.zai.status) {
      recommendations.push('Verify Z.AI API key configuration and network connectivity');
    }
    if (!components.database.status) {
      recommendations.push('Check database configuration and connection strings');
    }
    if (!components.mcp.status) {
      recommendations.push('Review MCP service configuration and tool registration');
    }
    if (!components.openrouter.status) {
      recommendations.push('Configure OpenRouter API credentials for multi-model access');
    }
    if (!components.system.status) {
      recommendations.push('Monitor system resource usage and consider optimization');
    }

    return recommendations;
  }

  private displayResults(): void {
    console.log('\n🎯 COMPREHENSIVE OPTIMIND AI LIGHTNING HEALTH CHECK RESULTS');
    console.log('=' * 70);
    console.log(`Status: ${this.results.status}`);
    console.log(`Score: ${this.results.score}/100`);
    console.log(`Timestamp: ${this.results.timestamp.toISOString()}`);
    
    console.log('\n📋 Component Status:');
    Object.entries(this.results.components).forEach(([component, status]) => {
      const icon = status.status ? '✅' : '❌';
      console.log(`  ${component.charAt(0).toUpperCase() + component.slice(1)}: ${icon} (${status.responseTime}ms)`);
    });

    console.log('\n💡 Insights:');
    this.results.insights.forEach(insight => console.log(`  • ${insight}`));

    console.log('\n🔧 Recommendations:');
    const recommendations = this.generateRecommendations();
    recommendations.forEach(rec => console.log(`  • ${rec}`));

    console.log('\n🤖 AI Analysis:');
    console.log(`  Model: ${this.results.aiAnalysis.modelUsed}`);
    console.log(`  Confidence: ${this.results.aiAnalysis.confidence}`);
    console.log(`  Processing Time: ${this.results.aiAnalysis.processingTime}ms`);
    console.log(`  Analysis: ${this.results.aiAnalysis.analysis}`);
  }
}

// Main execution
async function main() {
  try {
    const test = new ComprehensiveLightningTest();
    const result = await test.runComprehensiveTest();
    
    // Exit with appropriate code
    process.exit(result.status === 'HEALTHY' ? 0 : 1);
  } catch (error) {
    console.error('💥 Comprehensive test failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

export { ComprehensiveLightningTest, ComprehensiveHealthResult };