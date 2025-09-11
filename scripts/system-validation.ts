#!/usr/bin/env tsx

/**
 * OptiMind AI Ecosystem - System Validation Script
 * 
 * Comprehensive validation of all system components and capabilities
 * 
 * @author: Enterprise Architecture Team
 * @version: 2.0.0
 */

// Load environment variables
import { config } from 'dotenv';
config({ path: '.env' });

const fetch = require('node-fetch');

const BASE_URL = `http://localhost:${process.env.PORT || 3007}`;

interface ValidationResult {
  component: string;
  status: 'pass' | 'fail' | 'warning';
  responseTime: number;
  details: string;
  metrics?: Record<string, any>;
}

class SystemValidator {
  private results: ValidationResult[] = [];

  async validateAll(): Promise<void> {
    console.log('🚀 OptiMind AI Ecosystem - System Validation\n');
    console.log('='.repeat(80));
    
    const startTime = Date.now();
    
    // Core System Validation
    await this.validateHealthEndpoints();
    await this.validateAIModels();
    await this.validateTestingCapabilities();
    await this.validateSecurityFeatures();
    await this.validateDatabaseOperations();
    await this.validateAPIEndpoints();
    await this.validateAdvancedFeatures();
    
    // Generate Report
    await this.generateValidationReport(startTime);
  }

  private async validateHealthEndpoints(): Promise<void> {
    console.log('🔍 Validating Health Endpoints...');
    
    // Basic Health
    const healthStart = Date.now();
    try {
      const response = await fetch(`${BASE_URL}/api/health`);
      const data = await response.json();
      const responseTime = Date.now() - healthStart;
      
      this.results.push({
        component: 'Basic Health Check',
        status: response.ok && data.status === 'healthy' ? 'pass' : 'fail',
        responseTime,
        details: response.ok ? `System healthy: ${data.uptime}` : `HTTP ${response.status}`,
        metrics: { uptime: data.uptime, services: Object.keys(data.services || {}).length }
      });
    } catch (error) {
      this.results.push({
        component: 'Basic Health Check',
        status: 'fail',
        responseTime: Date.now() - healthStart,
        details: error.message
      });
    }

    // V2 Health
    const v2HealthStart = Date.now();
    try {
      const response = await fetch(`${BASE_URL}/api/v2/health`);
      const data = await response.json();
      const responseTime = Date.now() - v2HealthStart;
      
      this.results.push({
        component: 'V2 Health Check',
        status: response.ok ? 'pass' : 'fail',
        responseTime,
        details: response.ok ? `V2 System: ${data.overallHealth}` : `HTTP ${response.status}`,
        metrics: { 
          overallHealth: data.overallHealth,
          capabilities: data.capabilities?.length || 0,
          uptime: data.uptime
        }
      });
    } catch (error) {
      this.results.push({
        component: 'V2 Health Check',
        status: 'fail',
        responseTime: Date.now() - v2HealthStart,
        details: error.message
      });
    }

    console.log(`✅ Health Endpoints: ${this.results.filter(r => r.component.includes('Health')).filter(r => r.status === 'pass').length}/2 passed\n`);
  }

  private async validateAIModels(): Promise<void> {
    console.log('🤖 Validating AI Models...');
    
    // Get Available Models
    const modelsStart = Date.now();
    try {
      const response = await fetch(`${BASE_URL}/api/models`);
      const data = await response.json();
      const responseTime = Date.now() - modelsStart;
      
      this.results.push({
        component: 'AI Models Availability',
        status: response.ok && data.models ? 'pass' : 'fail',
        responseTime,
        details: response.ok ? `${data.models.length} models available` : `HTTP ${response.status}`,
        metrics: { modelCount: data.models?.length || 0 }
      });
    } catch (error) {
      this.results.push({
        component: 'AI Models Availability',
        status: 'fail',
        responseTime: Date.now() - modelsStart,
        details: error.message
      });
    }

    // Test Chat Functionality
    const chatStart = Date.now();
    try {
      const response = await fetch(`${BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'glm-45-flagship',
          messages: [{ role: 'user', content: 'System validation test' }]
        })
      });
      const data = await response.json();
      const responseTime = Date.now() - chatStart;
      
      this.results.push({
        component: 'Chat Functionality',
        status: response.ok && data.response ? 'pass' : 'fail',
        responseTime,
        details: response.ok ? `Chat response: ${data.response.substring(0, 50)}...` : `HTTP ${response.status}`,
        metrics: { 
          model: data.model,
          totalTokens: data.usage?.totalTokens || 0,
          responseTime
        }
      });
    } catch (error) {
      this.results.push({
        component: 'Chat Functionality',
        status: 'fail',
        responseTime: Date.now() - chatStart,
        details: error.message
      });
    }

    console.log(`✅ AI Models: ${this.results.filter(r => r.component.includes('AI') || r.component.includes('Chat')).filter(r => r.status === 'pass').length}/2 passed\n`);
  }

  private async validateTestingCapabilities(): Promise<void> {
    console.log('🧪 Validating Testing Capabilities...');
    
    // Multi-Dimensional Testing Info
    const testingStart = Date.now();
    try {
      const response = await fetch(`${BASE_URL}/api/testing/multi-dimensional`);
      const data = await response.json();
      const responseTime = Date.now() - testingStart;
      
      this.results.push({
        component: 'Testing API Info',
        status: response.ok && data.capabilities ? 'pass' : 'fail',
        responseTime,
        details: response.ok ? `${data.capabilities.length} capabilities available` : `HTTP ${response.status}`,
        metrics: { 
          capabilities: data.capabilities?.length || 0,
          dimensions: Object.keys(data.dimensions || {}).length
        }
      });
    } catch (error) {
      this.results.push({
        component: 'Testing API Info',
        status: 'fail',
        responseTime: Date.now() - testingStart,
        details: error.message
      });
    }

    // Test Multi-Dimensional Testing Execution
    const executionStart = Date.now();
    try {
      const response = await fetch(`${BASE_URL}/api/testing/multi-dimensional`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testSuite: {
            name: 'System Validation',
            description: 'Comprehensive system validation',
            dimensions: ['integration', 'security'],
            targetCoverage: 90,
            priority: 'high'
          },
          configuration: {
            environment: 'validation',
            parallelExecution: false,
            timeout: 60000,
            retryAttempts: 1,
            reportingLevel: 'basic'
          },
          context: {
            applicationType: 'AI Ecosystem',
            framework: 'Next.js',
            criticalPaths: ['API', 'Database'],
            riskAreas: ['performance', 'security']
          }
        })
      });
      const data = await response.json();
      const responseTime = Date.now() - executionStart;
      
      this.results.push({
        component: 'Multi-Dimensional Testing',
        status: response.ok && data.status ? 'pass' : 'fail',
        responseTime,
        details: response.ok ? `Testing status: ${data.status}` : `HTTP ${response.status}`,
        metrics: { 
          status: data.status,
          totalTests: data.metrics?.totalTests || 0,
          efficiency: data.metrics?.efficiency || 0
        }
      });
    } catch (error) {
      this.results.push({
        component: 'Multi-Dimensional Testing',
        status: 'fail',
        responseTime: Date.now() - executionStart,
        details: error.message
      });
    }

    console.log(`✅ Testing Capabilities: ${this.results.filter(r => r.component.includes('Testing')).filter(r => r.status === 'pass').length}/2 passed\n`);
  }

  private async validateSecurityFeatures(): Promise<void> {
    console.log('🔒 Validating Security Features...');
    
    // Quantum Security Key Generation
    const securityStart = Date.now();
    try {
      const response = await fetch(`${BASE_URL}/api/v2/quantum-security/key-pair`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ algorithm: 'quantum-resistant', keySize: 2048 })
      });
      const data = await response.json();
      const responseTime = Date.now() - securityStart;
      
      this.results.push({
        component: 'Quantum Security',
        status: response.ok ? 'pass' : 'fail',
        responseTime,
        details: response.ok ? 'Key generation successful' : `HTTP ${response.status}`,
        metrics: { 
          algorithm: data.algorithm,
          keySize: data.keySize,
          keyId: data.keyId
        }
      });
    } catch (error) {
      this.results.push({
        component: 'Quantum Security',
        status: 'fail',
        responseTime: Date.now() - securityStart,
        details: error.message
      });
    }

    console.log(`✅ Security Features: ${this.results.filter(r => r.component.includes('Security')).filter(r => r.status === 'pass').length}/1 passed\n`);
  }

  private async validateDatabaseOperations(): Promise<void> {
    console.log('🗄️ Validating Database Operations...');
    
    // Database Health
    const dbStart = Date.now();
    try {
      const response = await fetch(`${BASE_URL}/api/v2/database/health`);
      const data = await response.json();
      const responseTime = Date.now() - dbStart;
      
      this.results.push({
        component: 'Database Health',
        status: response.ok ? 'pass' : 'fail',
        responseTime,
        details: response.ok ? `Database status: ${data.status}` : `HTTP ${response.status}`,
        metrics: { 
          connections: data.connections,
          responseTime: data.responseTime,
          issues: data.issues?.length || 0
        }
      });
    } catch (error) {
      this.results.push({
        component: 'Database Health',
        status: 'fail',
        responseTime: Date.now() - dbStart,
        details: error.message
      });
    }

    console.log(`✅ Database Operations: ${this.results.filter(r => r.component.includes('Database')).filter(r => r.status === 'pass').length}/1 passed\n`);
  }

  private async validateAPIEndpoints(): Promise<void> {
    console.log('🌐 Validating API Endpoints...');
    
    const endpoints = [
      '/api/users',
      '/api/projects',
      '/api/content',
      '/api/settings',
      '/api/analytics'
    ];

    for (const endpoint of endpoints) {
      const start = Date.now();
      try {
        const response = await fetch(`${BASE_URL}${endpoint}`);
        const responseTime = Date.now() - start;
        
        this.results.push({
          component: `API: ${endpoint}`,
          status: response.ok ? 'pass' : 'fail',
          responseTime,
          details: response.ok ? 'Endpoint responding' : `HTTP ${response.status}`,
          metrics: { endpoint, responseTime }
        });
      } catch (error) {
        this.results.push({
          component: `API: ${endpoint}`,
          status: 'fail',
          responseTime: Date.now() - start,
          details: error.message
        });
      }
    }

    const passedAPIs = this.results.filter(r => r.component.startsWith('API:')).filter(r => r.status === 'pass').length;
    console.log(`✅ API Endpoints: ${passedAPIs}/${endpoints.length} passed\n`);
  }

  private async validateAdvancedFeatures(): Promise<void> {
    console.log('🚀 Validating Advanced Features...');
    
    // Predictive Analytics
    const predictiveStart = Date.now();
    try {
      const response = await fetch(`${BASE_URL}/api/v2/predictive-analytics/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'ensemble',
          data: { validation: true },
          horizon: 7
        })
      });
      const data = await response.json();
      const responseTime = Date.now() - predictiveStart;
      
      this.results.push({
        component: 'Predictive Analytics',
        status: response.ok ? 'pass' : 'fail',
        responseTime,
        details: response.ok ? 'Prediction generated' : `HTTP ${response.status}`,
        metrics: { 
          model: data.model,
          horizon: data.horizon,
          predictions: data.predictions?.length || 0
        }
      });
    } catch (error) {
      this.results.push({
        component: 'Predictive Analytics',
        status: 'fail',
        responseTime: Date.now() - predictiveStart,
        details: error.message
      });
    }

    // Database Manager
    const dbManagerStart = Date.now();
    try {
      const response = await fetch(`${BASE_URL}/api/v2/database-manager`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operation: 'health-check' })
      });
      const data = await response.json();
      const responseTime = Date.now() - dbManagerStart;
      
      this.results.push({
        component: 'Database Manager',
        status: response.ok ? 'pass' : 'fail',
        responseTime,
        details: response.ok ? 'Database manager operational' : `HTTP ${response.status}`,
        metrics: { 
          operation: data.operation,
          status: data.status,
          performance: data.performance
        }
      });
    } catch (error) {
      this.results.push({
        component: 'Database Manager',
        status: 'fail',
        responseTime: Date.now() - dbManagerStart,
        details: error.message
      });
    }

    console.log(`✅ Advanced Features: ${this.results.filter(r => r.component.includes('Predictive') || r.component.includes('Database Manager')).filter(r => r.status === 'pass').length}/2 passed\n`);
  }

  private async generateValidationReport(startTime: number): Promise<void> {
    console.log('📋 Generating Validation Report...\n');
    
    const totalTests = this.results.length;
    const passedTests = this.results.filter(r => r.status === 'pass').length;
    const failedTests = this.results.filter(r => r.status === 'fail').length;
    const warningTests = this.results.filter(r => r.status === 'warning').length;
    const successRate = Math.round((passedTests / totalTests) * 100);
    const totalTime = Date.now() - startTime;

    console.log('='.repeat(80));
    console.log('🎯 OPTIMIND AI ECOSYSTEM - SYSTEM VALIDATION REPORT');
    console.log('='.repeat(80));
    console.log(`📊 Overall Results: ${passedTests}/${totalTests} tests passed (${successRate}% success rate)`);
    console.log(`⚠️  Failed: ${failedTests}, Warnings: ${warningTests}`);
    console.log(`⏱️  Total Validation Time: ${totalTime}ms`);
    console.log('');

    // Results by Category
    const categories = {
      'Health Endpoints': this.results.filter(r => r.component.includes('Health')),
      'AI Models': this.results.filter(r => r.component.includes('AI') || r.component.includes('Chat')),
      'Testing Capabilities': this.results.filter(r => r.component.includes('Testing')),
      'Security Features': this.results.filter(r => r.component.includes('Security')),
      'Database Operations': this.results.filter(r => r.component.includes('Database')),
      'API Endpoints': this.results.filter(r => r.component.startsWith('API:')),
      'Advanced Features': this.results.filter(r => r.component.includes('Predictive') || r.component.includes('Database Manager'))
    };

    for (const [category, tests] of Object.entries(categories)) {
      if (tests.length > 0) {
        const passed = tests.filter(t => t.status === 'pass').length;
        const categoryRate = Math.round((passed / tests.length) * 100);
        console.log(`🔍 ${category}: ${passed}/${tests.length} (${categoryRate}%)`);
        
        if (tests.filter(t => t.status === 'fail').length > 0) {
          tests.filter(t => t.status === 'fail').forEach(test => {
            console.log(`   ❌ ${test.component}: ${test.details}`);
          });
        }
      }
    }

    console.log('');

    // Performance Summary
    const avgResponseTime = Math.round(this.results.reduce((sum, r) => sum + r.responseTime, 0) / totalTests);
    const fastestTest = this.results.reduce((min, r) => r.responseTime < min.responseTime ? r : min);
    const slowestTest = this.results.reduce((max, r) => r.responseTime > max.responseTime ? r : max);

    console.log('⚡ Performance Summary:');
    console.log(`   Average Response Time: ${avgResponseTime}ms`);
    console.log(`   Fastest Component: ${fastestTest.component} (${fastestTest.responseTime}ms)`);
    console.log(`   Slowest Component: ${slowestTest.component} (${slowestTest.responseTime}ms)`);

    console.log('');

    // Overall Assessment
    if (successRate >= 90) {
      console.log('🎉 EXCELLENT: OptiMind AI Ecosystem is operating at peak performance!');
      console.log('   All critical systems are functioning optimally.');
    } else if (successRate >= 75) {
      console.log('👍 GOOD: OptiMind AI Ecosystem is performing well.');
      console.log('   Minor issues detected but core functionality is solid.');
    } else if (successRate >= 50) {
      console.log('⚠️  WARNING: OptiMind AI Ecosystem requires attention.');
      console.log('   Several components need optimization or troubleshooting.');
    } else {
      console.log('🚨 CRITICAL: OptiMind AI Ecosystem requires immediate attention.');
      console.log('   Major issues detected that need urgent resolution.');
    }

    console.log('');

    // Recommendations
    console.log('💡 Recommendations:');
    if (failedTests > 0) {
      console.log(`   - Address ${failedTests} failed components prioritizing critical systems`);
    }
    if (avgResponseTime > 1000) {
      console.log('   - Optimize performance for slow responding components');
    }
    if (successRate >= 90) {
      console.log('   - Continue monitoring and maintain current performance levels');
      console.log('   - Consider scaling for increased load');
    }

    console.log('');
    console.log(`🏆 Validation Complete - OptiMind AI Ecosystem Status: ${  
      successRate >= 90 ? 'OPERATIONAL' : successRate >= 75 ? 'FUNCTIONAL' : 'NEEDS ATTENTION'}`);
    console.log('='.repeat(80));
    console.log('Report generated at:', new Date().toISOString());
    console.log('='.repeat(80));
  }
}

// Run the validation
if (require.main === module) {
  const validator = new SystemValidator();
  validator.validateAll().catch(console.error);
}

module.exports = { SystemValidator };