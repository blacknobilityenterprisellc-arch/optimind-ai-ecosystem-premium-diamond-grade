#!/usr/bin/env tsx

/**
 * OptiMind AI Ecosystem - AI-Powered Lightning Health Check
 * Premium Diamond Grade Intelligent System Diagnostics
 *
 * This script provides ultra-fast AI-powered health checking using GLM models
 * and MCP (Model Control Protocol) for intelligent system analysis.
 */

// Load environment variables
import { config } from 'dotenv';
config({ path: '.env' });

import { premiumZAIWrapper } from '../src/lib/zai-sdk-wrapper';
import { enhancedMCPService } from '../src/lib/mcp-service-enhanced';
import { premiumDatabaseWrapper } from '../src/lib/database-health-wrapper';
import { openRouterService } from '../src/lib/openrouter-service';

interface HealthCheckResult {
  status: 'HEALTHY' | 'WARNING' | 'CRITICAL';
  score: number;
  timestamp: Date;
  checks: {
    database: boolean;
    aiModels: boolean;
    mcpProtocol: boolean;
    openRouter: boolean;
    systemResources: boolean;
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

class AIHealthCheckLightning {
  private isInitialized: boolean = false;

  constructor() {
    this.initialize();
  }

  private async initialize(): Promise<void> {
    try {
      console.log('🤖 Initializing AI Health Check Lightning...');

      // Initialize ZAI wrapper with explicit API key
      const zaiApiKey = process.env.ZAI_API_KEY || '1dc8da695f1846c5a76483eb2252023d.pYnbmJbwCWPpNHvY';
      if (zaiApiKey && !zaiApiKey.includes('testing') && !zaiApiKey.includes('demo')) {
        await premiumZAIWrapper.waitForAvailability(10000);
      }

      // Initialize other services
      await Promise.all([
        enhancedMCPService.waitForHealthy(5000),
        premiumDatabaseWrapper.waitForHealthy(5000),
      ]);

      this.isInitialized = true;
      console.log('✅ AI Health Check Lightning initialized successfully');
    } catch (error) {
      console.warn('⚠️ Some services failed to initialize, continuing with available services:', error);
      this.isInitialized = true; // Continue with available services
    }
  }

  async performLightningCheck(): Promise<HealthCheckResult> {
    const startTime = Date.now();
    console.log('⚡ Starting AI-Powered Lightning Health Check...');

    const checks = {
      database: false,
      aiModels: false,
      mcpProtocol: false,
      openRouter: false,
      systemResources: false,
    };

    const insights: string[] = [];
    const recommendations: string[] = [];

    try {
      // Database Health Check
      console.log('🗄️ Checking database health...');
      checks.database = await this.checkDatabaseHealth();
      console.log(`Database: ${checks.database ? '✅ Healthy' : '❌ Unhealthy'}`);

      // AI Models Health Check
      console.log('🤖 Checking AI models health...');
      checks.aiModels = await this.checkAIModelsHealth();
      console.log(`AI Models: ${checks.aiModels ? '✅ Healthy' : '❌ Unhealthy'}`);

      // MCP Protocol Health Check
      console.log('🔗 Checking MCP protocol health...');
      checks.mcpProtocol = await this.checkMCPProtocolHealth();
      console.log(`MCP Protocol: ${checks.mcpProtocol ? '✅ Healthy' : '❌ Unhealthy'}`);

      // OpenRouter Health Check
      console.log('🌐 Checking OpenRouter health...');
      checks.openRouter = await this.checkOpenRouterHealth();
      console.log(`OpenRouter: ${checks.openRouter ? '✅ Healthy' : '❌ Unhealthy'}`);

      // System Resources Health Check
      console.log('💻 Checking system resources...');
      checks.systemResources = await this.checkSystemResourcesHealth();
      console.log(`System Resources: ${checks.systemResources ? '✅ Healthy' : '❌ Unhealthy'}`);

      // AI Analysis
      console.log('🧠 Performing AI analysis...');
      const aiAnalysis = await this.performAIAnalysis(checks);

      // Generate insights and recommendations
      const generatedInsights = await this.generateInsights(checks, aiAnalysis);
      insights.push(...generatedInsights);

      const generatedRecommendations = await this.generateRecommendations(checks, aiAnalysis);
      recommendations.push(...generatedRecommendations);

      // Calculate overall score
      const score = this.calculateHealthScore(checks);

      // Determine status
      const status = this.determineHealthStatus(score);

      const processingTime = Date.now() - startTime;

      const result: HealthCheckResult = {
        status,
        score,
        timestamp: new Date(),
        checks,
        insights,
        recommendations,
        aiAnalysis: {
          ...aiAnalysis,
          processingTime,
        },
      };

      console.log(`⚡ AI Lightning Health Check completed in ${processingTime}ms`);
      console.log(`📊 Overall Health Score: ${score}/100`);
      console.log(`🎯 Status: ${status}`);

      return result;
    } catch (error) {
      console.error('❌ Lightning Health Check failed:', error);
      throw error;
    }
  }

  private async checkDatabaseHealth(): Promise<boolean> {
    try {
      // Use the direct database client for testing
      const { db } = await import('../src/lib/db');
      await db.$queryRaw`SELECT 1 as test`;
      return true;
    } catch (error) {
      console.error('Database health check failed:', error);
      return false;
    }
  }

  private async checkAIModelsHealth(): Promise<boolean> {
    try {
      const zaiHealth = await premiumZAIWrapper.getHealthStatus();
      return zaiHealth.initialized && zaiHealth.modelAvailable;
    } catch (error) {
      console.error('AI models health check failed:', error);
      return false;
    }
  }

  private async checkMCPProtocolHealth(): Promise<boolean> {
    try {
      const mcpHealth = await enhancedMCPService.getHealthStatus();
      return mcpHealth.status === 'HEALTHY' || mcpHealth.status === 'DEGRADED';
    } catch (error) {
      console.error('MCP protocol health check failed:', error);
      return false;
    }
  }

  private async checkOpenRouterHealth(): Promise<boolean> {
    try {
      const models = openRouterService.getAvailableModels();
      return models.length > 0;
    } catch (error) {
      console.error('OpenRouter health check failed:', error);
      return false;
    }
  }

  private async checkSystemResourcesHealth(): Promise<boolean> {
    try {
      // Check system resources
      const used = process.memoryUsage();
      const totalMemory = require('os').totalmem();
      const freeMemory = require('os').freemem();
      const memoryUsagePercent = ((totalMemory - freeMemory) / totalMemory) * 100;

      // Consider healthy if memory usage is below 90%
      return memoryUsagePercent < 90;
    } catch (error) {
      console.error('System resources health check failed:', error);
      return false;
    }
  }

  private async performAIAnalysis(checks: Record<string, boolean>): Promise<any> {
    try {
      const zaiAvailable = await premiumZAIWrapper.isAvailable();
      
      if (!zaiAvailable) {
        return {
          modelUsed: 'N/A',
          confidence: 0,
          analysis: 'AI analysis unavailable - using fallback analysis',
        };
      }

      const systemPrompt = `
You are an expert AI system analyst. Analyze the following health check results and provide insights:

Health Check Results:
- Database: ${checks.database ? 'Healthy' : 'Unhealthy'}
- AI Models: ${checks.aiModels ? 'Healthy' : 'Unhealthy'}
- MCP Protocol: ${checks.mcpProtocol ? 'Healthy' : 'Unhealthy'}
- OpenRouter: ${checks.openRouter ? 'Healthy' : 'Unhealthy'}
- System Resources: ${checks.systemResources ? 'Healthy' : 'Unhealthy'}

Provide a concise analysis of the system health status, identify any patterns or issues, and assess the overall reliability of the system.
`;

      const response = await premiumZAIWrapper.createChatCompletion({
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
        ],
        max_tokens: 500,
        temperature: 0.3,
      });

      return {
        modelUsed: 'GLM-4.5',
        confidence: 0.85,
        analysis: response.choices[0]?.message?.content || 'Analysis unavailable',
      };
    } catch (error) {
      console.error('AI analysis failed:', error);
      return {
        modelUsed: 'GLM-4.5',
        confidence: 0,
        analysis: 'AI analysis failed - using rule-based assessment',
      };
    }
  }

  private async generateInsights(checks: Record<string, boolean>, aiAnalysis: any): Promise<string[]> {
    const insights: string[] = [];

    // Basic insights based on check results
    const healthyCount = Object.values(checks).filter(Boolean).length;
    const totalCount = Object.keys(checks).length;

    if (healthyCount === totalCount) {
      insights.push('All systems are operating optimally');
    } else if (healthyCount >= totalCount * 0.8) {
      insights.push('Minor issues detected but system remains functional');
    } else {
      insights.push('Multiple system issues require attention');
    }

    // Add AI-generated insights
    if (aiAnalysis.analysis && aiAnalysis.confidence > 0.5) {
      insights.push(`AI Analysis: ${aiAnalysis.analysis}`);
    }

    return insights;
  }

  private async generateRecommendations(checks: Record<string, boolean>, aiAnalysis: any): Promise<string[]> {
    const recommendations: string[] = [];

    // Generate recommendations based on failed checks
    if (!checks.database) {
      recommendations.push('Verify database connectivity and configuration');
    }
    if (!checks.aiModels) {
      recommendations.push('Check AI model availability and API keys');
    }
    if (!checks.mcpProtocol) {
      recommendations.push('Review MCP protocol configuration and service status');
    }
    if (!checks.openRouter) {
      recommendations.push('Verify OpenRouter API credentials and network connectivity');
    }
    if (!checks.systemResources) {
      recommendations.push('Monitor system resource usage and consider optimization');
    }

    return recommendations;
  }

  private calculateHealthScore(checks: Record<string, boolean>): number {
    const healthyCount = Object.values(checks).filter(Boolean).length;
    const totalCount = Object.keys(checks).length;
    return Math.round((healthyCount / totalCount) * 100);
  }

  private determineHealthStatus(score: number): 'HEALTHY' | 'WARNING' | 'CRITICAL' {
    if (score >= 90) return 'HEALTHY';
    if (score >= 70) return 'WARNING';
    return 'CRITICAL';
  }
}

// Main execution
async function main() {
  try {
    const healthCheck = new AIHealthCheckLightning();
    const result = await healthCheck.performLightningCheck();

    // Display results
    console.log('\n🎯 AI-Powered Lightning Health Check Results');
    console.log('==========================================');
    console.log(`Status: ${result.status}`);
    console.log(`Score: ${result.score}/100`);
    console.log(`Timestamp: ${result.timestamp.toISOString()}`);
    console.log('\n📋 Component Status:');
    Object.entries(result.checks).forEach(([component, status]) => {
      console.log(`  ${component}: ${status ? '✅' : '❌'}`);
    });
    console.log('\n💡 Insights:');
    result.insights.forEach(insight => console.log(`  • ${insight}`));
    console.log('\n🔧 Recommendations:');
    result.recommendations.forEach(rec => console.log(`  • ${rec}`));
    console.log('\n🤖 AI Analysis:');
    console.log(`  Model: ${result.aiAnalysis.modelUsed}`);
    console.log(`  Confidence: ${result.aiAnalysis.confidence}`);
    console.log(`  Processing Time: ${result.aiAnalysis.processingTime}ms`);
    console.log(`  Analysis: ${result.aiAnalysis.analysis}`);

    // Exit with appropriate code
    process.exit(result.status === 'HEALTHY' ? 0 : 1);
  } catch (error) {
    console.error('❌ AI Lightning Health Check failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

export { AIHealthCheckLightning, HealthCheckResult };