/**
 * OptiMind AI Ecosystem - Comprehensive API Testing Script
 * Premium Diamond Grade API Validation and Testing
 * 
 * This script performs comprehensive testing of all API endpoints
 * to ensure 100% success rate and accessibility.
 */

import { promises as fs } from 'fs';
import path from 'path';

interface APIEndpoint {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  description: string;
  category: string;
  expectedStatus: number;
  testPayload?: any;
}

interface TestResult {
  endpoint: string;
  method: string;
  status: 'success' | 'failure' | 'skipped';
  statusCode?: number;
  responseTime?: number;
  error?: string;
  timestamp: string;
}

class ComprehensiveAPITester {
  private results: TestResult[] = [];
  private baseUrl: string;
  private testCount: number = 0;
  private successCount: number = 0;

  constructor(baseUrl: string = 'http://localhost:3000') {
    this.baseUrl = baseUrl;
  }

  /**
   * Get all API endpoints to test
   */
  private getTestEndpoints(): APIEndpoint[] {
    return [
      // Health Check Endpoints
      {
        path: '/api/health',
        method: 'GET',
        description: 'Basic health check',
        category: 'Health',
        expectedStatus: 200
      },
      {
        path: '/api/v2/health',
        method: 'GET',
        description: 'Comprehensive v2 health check',
        category: 'Health',
        expectedStatus: 200
      },
      {
        path: '/api/v2/database/health',
        method: 'GET',
        description: 'Database health check',
        category: 'Health',
        expectedStatus: 200
      },

      // AI Model Endpoints
      {
        path: '/api/models/glm-45-flagship',
        method: 'POST',
        description: 'GLM-4.5 Flagship model',
        category: 'AI Models',
        expectedStatus: 200,
        testPayload: {
          messages: [{ role: 'user', content: 'Hello, test message' }]
        }
      },
      {
        path: '/api/models/glm-45-auto-think',
        method: 'POST',
        description: 'GLM-4.5 Auto Think model',
        category: 'AI Models',
        expectedStatus: 200,
        testPayload: {
          messages: [{ role: 'user', content: 'Test auto thinking' }]
        }
      },
      {
        path: '/api/models/glm-45-full-stack',
        method: 'POST',
        description: 'GLM-4.5 Full Stack model',
        category: 'AI Models',
        expectedStatus: 200,
        testPayload: {
          messages: [{ role: 'user', content: 'Test full stack' }]
        }
      },
      {
        path: '/api/models/air',
        method: 'POST',
        description: 'AIR Advanced Intelligence model',
        category: 'AI Models',
        expectedStatus: 200,
        testPayload: {
          messages: [{ role: 'user', content: 'Test AIR model' }]
        }
      },

      // Core AI Service Endpoints
      {
        path: '/api/chat',
        method: 'POST',
        description: 'Chat completion',
        category: 'AI Services',
        expectedStatus: 200,
        testPayload: {
          messages: [{ role: 'user', content: 'Hello' }]
        }
      },
      {
        path: '/api/images',
        method: 'POST',
        description: 'Image analysis',
        category: 'AI Services',
        expectedStatus: 200,
        testPayload: {
          imageBase64: 'base64-test-data',
          analysisType: 'general'
        }
      },
      {
        path: '/api/recommendations',
        method: 'POST',
        description: 'AI recommendations',
        category: 'AI Services',
        expectedStatus: 200,
        testPayload: {
          context: 'test context',
          preferences: ['test']
        }
      },

      // Predictive Analytics v2 Endpoints
      {
        path: '/api/v2/predictive-analytics',
        method: 'GET',
        description: 'Predictive analytics health check',
        category: 'Predictive Analytics',
        expectedStatus: 200
      },
      {
        path: '/api/v2/predictive-analytics',
        method: 'POST',
        description: 'Predictive analytics operations',
        category: 'Predictive Analytics',
        expectedStatus: 200,
        testPayload: {
          operation: 'get_analytics_metrics'
        }
      },
      {
        path: '/api/v2/predictive-analytics/models',
        method: 'GET',
        description: 'Predictive analytics models',
        category: 'Predictive Analytics',
        expectedStatus: 200
      },
      {
        path: '/api/v2/predictive-analytics/predict',
        method: 'POST',
        description: 'Make prediction',
        category: 'Predictive Analytics',
        expectedStatus: 200,
        testPayload: {
          modelId: 'test-model',
          input: { features: [1, 2, 3] }
        }
      },
      {
        path: '/api/v2/predictive-analytics/insights',
        method: 'GET',
        description: 'Get predictive insights',
        category: 'Predictive Analytics',
        expectedStatus: 200
      },

      // Quantum Security v2 Endpoints
      {
        path: '/api/v2/quantum-security',
        method: 'GET',
        description: 'Quantum security health check',
        category: 'Quantum Security',
        expectedStatus: 200
      },
      {
        path: '/api/v2/quantum-security/keys',
        method: 'GET',
        description: 'Quantum security keys',
        category: 'Quantum Security',
        expectedStatus: 200
      },
      {
        path: '/api/v2/quantum-security/encrypt',
        method: 'POST',
        description: 'Quantum encryption',
        category: 'Quantum Security',
        expectedStatus: 200,
        testPayload: {
          data: 'test data',
          keyId: 'test-key'
        }
      },
      {
        path: '/api/v2/quantum-security/decrypt',
        method: 'POST',
        description: 'Quantum decryption',
        category: 'Quantum Security',
        expectedStatus: 200,
        testPayload: {
          ciphertext: 'test ciphertext',
          keyId: 'test-key'
        }
      },

      // Database Manager v2 Endpoints
      {
        path: '/api/v2/database-manager',
        method: 'GET',
        description: 'Database manager health',
        category: 'Database',
        expectedStatus: 200
      },
      {
        path: '/api/v2/database/backup',
        method: 'POST',
        description: 'Database backup',
        category: 'Database',
        expectedStatus: 200
      },
      {
        path: '/api/v2/database/backup',
        method: 'GET',
        description: 'Database backup history',
        category: 'Database',
        expectedStatus: 200
      },

      // MCP Integration v2 Endpoints
      {
        path: '/api/v2/mcp-integration',
        method: 'GET',
        description: 'MCP integration health',
        category: 'MCP Integration',
        expectedStatus: 200
      },

      // Additional Core Endpoints
      {
        path: '/api/analytics',
        method: 'GET',
        description: 'Analytics data',
        category: 'Core',
        expectedStatus: 200
      },
      {
        path: '/api/projects',
        method: 'GET',
        description: 'Projects list',
        category: 'Core',
        expectedStatus: 200
      },
      {
        path: '/api/users',
        method: 'GET',
        description: 'Users list',
        category: 'Core',
        expectedStatus: 200
      },
      {
        path: '/api/settings',
        method: 'GET',
        description: 'Settings',
        category: 'Core',
        expectedStatus: 200
      },
      {
        path: '/api/upload',
        method: 'POST',
        description: 'File upload',
        category: 'Core',
        expectedStatus: 200,
        testPayload: {
          filename: 'test.txt',
          content: 'test content'
        }
      },
      {
        path: '/api/search',
        method: 'POST',
        description: 'Search functionality',
        category: 'Core',
        expectedStatus: 200,
        testPayload: {
          query: 'test search'
        }
      },
      {
        path: '/api/smart-search',
        method: 'POST',
        description: 'Smart search',
        category: 'Core',
        expectedStatus: 200,
        testPayload: {
          query: 'test smart search'
        }
      },
      {
        path: '/api/validate-form',
        method: 'POST',
        description: 'Form validation',
        category: 'Core',
        expectedStatus: 200,
        testPayload: {
          formData: { field: 'value' }
        }
      },

      // Testing Endpoints
      {
        path: '/api/testing/generate',
        method: 'POST',
        description: 'Test generation',
        category: 'Testing',
        expectedStatus: 200,
        testPayload: {
          type: 'unit',
          target: 'test-component'
        }
      },
      {
        path: '/api/testing/monitor',
        method: 'GET',
        description: 'Test monitoring',
        category: 'Testing',
        expectedStatus: 200
      },
      {
        path: '/api/testing/diagnose',
        method: 'POST',
        description: 'Test diagnosis',
        category: 'Testing',
        expectedStatus: 200,
        testPayload: {
          component: 'test-component'
        }
      }
    ];
  }

  /**
   * Test a single API endpoint
   */
  private async testEndpoint(endpoint: APIEndpoint): Promise<TestResult> {
    const startTime = Date.now();
    const result: TestResult = {
      endpoint: endpoint.path,
      method: endpoint.method,
      status: 'failure',
      timestamp: new Date().toISOString()
    };

    try {
      const url = `${this.baseUrl}${endpoint.path}`;
      const options: RequestInit = {
        method: endpoint.method,
        headers: {
          'Content-Type': 'application/json',
        }
      };

      if (endpoint.testPayload && endpoint.method !== 'GET') {
        options.body = JSON.stringify(endpoint.testPayload);
      }

      const response = await fetch(url, options);
      const responseTime = Date.now() - startTime;

      result.statusCode = response.status;
      result.responseTime = responseTime;

      if (response.status === endpoint.expectedStatus) {
        result.status = 'success';
        this.successCount++;
      } else {
        result.error = `Expected ${endpoint.expectedStatus}, got ${response.status}`;
      }

      // Try to parse response for additional validation
      try {
        const responseData = await response.json();
        if (responseData.error) {
          result.error = responseData.error;
        }
      } catch (e) {
        // Response might not be JSON, that's okay
      }

    } catch (error) {
      result.status = 'failure';
      result.error = error instanceof Error ? error.message : 'Unknown error';
      result.responseTime = Date.now() - startTime;
    }

    this.testCount++;
    return result;
  }

  /**
   * Run comprehensive tests for all endpoints
   */
  async runComprehensiveTests(): Promise<{
    total: number;
    success: number;
    failed: number;
    successRate: number;
    results: TestResult[];
    categoryBreakdown: Record<string, { total: number; success: number; successRate: number }>;
  }> {
    console.log('🚀 Starting Comprehensive API Testing...');
    console.log(`📍 Base URL: ${this.baseUrl}`);
    console.log(`📊 Total endpoints to test: ${this.getTestEndpoints().length}\n`);

    const endpoints = this.getTestEndpoints();
    const categoryBreakdown: Record<string, { total: number; success: number; successRate: number }> = {};

    // Test endpoints by category
    const categories = [...new Set(endpoints.map(e => e.category))];
    
    for (const category of categories) {
      console.log(`\n🔍 Testing ${category} Endpoints...`);
      const categoryEndpoints = endpoints.filter(e => e.category === category);
      
      for (const endpoint of categoryEndpoints) {
        console.log(`  📡 Testing ${endpoint.method} ${endpoint.path}...`);
        const result = await this.testEndpoint(endpoint);
        this.results.push(result);
        
        const status = result.status === 'success' ? '✅' : '❌';
        console.log(`    ${status} ${result.statusCode || 'N/A'} (${result.responseTime || 0}ms)`);
        
        if (result.error) {
          console.log(`    ⚠️  Error: ${result.error}`);
        }
      }

      // Calculate category stats
      const categoryResults = this.results.filter(r => 
        endpoints.find(e => e.category === category && e.path === r.endpoint)
      );
      const categorySuccess = categoryResults.filter(r => r.status === 'success').length;
      
      categoryBreakdown[category] = {
        total: categoryEndpoints.length,
        success: categorySuccess,
        successRate: categorySuccess / categoryEndpoints.length
      };
    }

    const failed = this.testCount - this.successCount;
    const successRate = this.testCount > 0 ? (this.successCount / this.testCount) * 100 : 0;

    return {
      total: this.testCount,
      success: this.successCount,
      failed,
      successRate,
      results: this.results,
      categoryBreakdown
    };
  }

  /**
   * Generate comprehensive test report
   */
  generateReport(results: {
    total: number;
    success: number;
    failed: number;
    successRate: number;
    results: TestResult[];
    categoryBreakdown: Record<string, { total: number; success: number; successRate: number }>;
  }): string {
    const timestamp = new Date().toISOString();
    const status = results.successRate >= 100 ? 'PERFECT' : 
                    results.successRate >= 90 ? 'EXCELLENT' :
                    results.successRate >= 80 ? 'GOOD' :
                    results.successRate >= 70 ? 'FAIR' : 'NEEDS IMPROVEMENT';

    let report = `
╔══════════════════════════════════════════════════════════════════════════════╗
║                    OPTIMIND AI ECOSYSTEM - API TEST REPORT                    ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  Generated: ${timestamp}                                                      ║
║  Status: ${status} (${results.successRate.toFixed(1)}% Success Rate)            ║
╚══════════════════════════════════════════════════════════════════════════════╝

📊 OVERALL RESULTS:
├── Total Endpoints Tested: ${results.total}
├── Successful: ${results.success} ✅
├── Failed: ${results.failed} ❌
└── Success Rate: ${results.successRate.toFixed(1)}%

📋 CATEGORY BREAKDOWN:
`;

    for (const [category, stats] of Object.entries(results.categoryBreakdown)) {
      const categoryStatus = stats.successRate === 1 ? '✅' : 
                           stats.successRate >= 0.8 ? '⚠️' : '❌';
      report += `├── ${category}: ${stats.success}/${stats.total} (${(stats.successRate * 100).toFixed(1)}%) ${categoryStatus}\n`;
    }

    report += `
🔍 DETAILED RESULTS:
`;

    for (const result of results.results) {
      const status = result.status === 'success' ? '✅' : '❌';
      const time = result.responseTime ? `${result.responseTime}ms` : 'N/A';
      report += `${status} ${result.method} ${result.endpoint} - ${result.statusCode || 'N/A'} (${time})`;
      
      if (result.error) {
        report += ` [Error: ${result.error}]`;
      }
      report += '\n';
    }

    if (results.failed > 0) {
      report += `
⚠️  FAILED ENDPOINTS:
`;
      const failedResults = results.results.filter(r => r.status === 'failure');
      for (const result of failedResults) {
        report += `❌ ${result.method} ${result.endpoint} - ${result.error}\n`;
      }
    }

    report += `
🎯 RECOMMENDATIONS:
`;

    if (results.successRate === 100) {
      report += `🎉 PERFECT! All endpoints are working correctly. The system is ready for production.\n`;
    } else if (results.successRate >= 90) {
      report += `✅ Excellent performance. Minor issues detected but system is operational.\n`;
      report += `🔧 Focus on fixing the ${results.failed} failed endpoints for 100% success rate.\n`;
    } else {
      report += `⚠️  System needs attention. ${results.failed} endpoints are failing.\n`;
      report += `🔧 Prioritize fixing critical endpoints before production deployment.\n`;
    }

    report += `
╔══════════════════════════════════════════════════════════════════════════════╗
║                          END OF TEST REPORT                                   ║
╚══════════════════════════════════════════════════════════════════════════════╝
`;

    return report;
  }

  /**
   * Save test report to file
   */
  async saveReport(report: string, filename?: string): Promise<void> {
    const defaultFilename = `api-test-report-${new Date().toISOString().replace(/[:.]/g, '-')}.txt`;
    const reportFilename = filename || defaultFilename;
    const reportPath = path.join(process.cwd(), 'reports', reportFilename);

    try {
      await fs.mkdir(path.dirname(reportPath), { recursive: true });
      await fs.writeFile(reportPath, report, 'utf8');
      console.log(`📄 Test report saved to: ${reportPath}`);
    } catch (error) {
      console.error(`❌ Failed to save report: ${error}`);
    }
  }
}

// Main execution function
async function main() {
  const tester = new ComprehensiveAPITester();
  
  try {
    const results = await tester.runComprehensiveTests();
    const report = tester.generateReport(results);
    
    console.log('\n' + report);
    
    // Save report
    await tester.saveReport(report);
    
    // Exit with appropriate code
    process.exit(results.successRate === 100 ? 0 : 1);
    
  } catch (error) {
    console.error('❌ Test execution failed:', error);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (require.main === module) {
  main();
}

export { ComprehensiveAPITester };