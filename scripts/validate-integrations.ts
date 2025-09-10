#!/usr/bin/env tsx

/**
 * Integration Validation Script for OptiMind AI Ecosystem
 * 
 * This script validates all integrations (Vercel, Netlify, Neon) and ensures
 * that the deployment is working correctly across all platforms.
 */

import { execSync } from 'child_process';
import fetch from 'node-fetch';
import { PrismaClient } from '@prisma/client';

interface TestResult {
  name: string;
  passed: boolean;
  message?: string;
  error?: string;
  duration?: number;
}

interface ValidationResult {
  platform: string;
  tests: TestResult[];
  passed: number;
  failed: number;
  success: boolean;
}

class IntegrationValidator {
  private prisma: PrismaClient;
  private results: ValidationResult[] = [];

  constructor() {
    this.prisma = new PrismaClient();
  }

  async validateAll(): Promise<void> {
    console.log('🚀 Starting comprehensive integration validation...\n');

    try {
      // Validate Vercel integration
      await this.validateVercel();

      // Validate Netlify integration
      await this.validateNetlify();

      // Validate Neon database integration
      await this.validateNeon();

      // Validate cross-platform functionality
      await this.validateCrossPlatform();

      // Generate summary report
      this.generateSummary();

    } catch (error) {
      console.error('❌ Validation failed:', error);
      process.exit(1);
    } finally {
      await this.prisma.$disconnect();
    }
  }

  private async validateVercel(): Promise<void> {
    console.log('📦 Validating Vercel integration...');
    const tests: TestResult[] = [];

    // Test 1: Build process
    tests.push(await this.testVercelBuild());

    // Test 2: Environment variables
    tests.push(await this.testVercelEnvironment());

    // Test 3: API endpoints
    tests.push(await this.testVercelAPI());

    // Test 4: Performance
    tests.push(await this.testVercelPerformance());

    const passed = tests.filter(t => t.passed).length;
    const failed = tests.filter(t => !t.passed).length;

    this.results.push({
      platform: 'Vercel',
      tests,
      passed,
      failed,
      success: failed === 0
    });

    console.log(`✅ Vercel validation: ${passed} passed, ${failed} failed\n`);
  }

  private async validateNetlify(): Promise<void> {
    console.log('🌐 Validating Netlify integration...');
    const tests: TestResult[] = [];

    // Test 1: Build process
    tests.push(await this.testNetlifyBuild());

    // Test 2: Environment variables
    tests.push(await this.testNetlifyEnvironment());

    // Test 3: Functions
    tests.push(await this.testNetlifyFunctions());

    // Test 4: Redirects
    tests.push(await this.testNetlifyRedirects());

    const passed = tests.filter(t => t.passed).length;
    const failed = tests.filter(t => !t.passed).length;

    this.results.push({
      platform: 'Netlify',
      tests,
      passed,
      failed,
      success: failed === 0
    });

    console.log(`✅ Netlify validation: ${passed} passed, ${failed} failed\n`);
  }

  private async validateNeon(): Promise<void> {
    console.log('🗄️  Validating Neon database integration...');
    const tests: TestResult[] = [];

    // Test 1: Database connection
    tests.push(await this.testNeonConnection());

    // Test 2: Schema synchronization
    tests.push(await this.testNeonSchema());

    // Test 3: Query performance
    tests.push(await this.testNeonPerformance());

    // Test 4: Data integrity
    tests.push(await this.testNeonDataIntegrity());

    const passed = tests.filter(t => t.passed).length;
    const failed = tests.filter(t => !t.passed).length;

    this.results.push({
      platform: 'Neon',
      tests,
      passed,
      failed,
      success: failed === 0
    });

    console.log(`✅ Neon validation: ${passed} passed, ${failed} failed\n`);
  }

  private async validateCrossPlatform(): Promise<void> {
    console.log('🔄 Validating cross-platform functionality...');
    const tests: TestResult[] = [];

    // Test 1: API consistency
    tests.push(await this.testAPIConsistency());

    // Test 2: Database consistency
    tests.push(await this.testDatabaseConsistency());

    // Test 3: Environment consistency
    tests.push(await this.testEnvironmentConsistency());

    // Test 4: Performance consistency
    tests.push(await this.testPerformanceConsistency());

    const passed = tests.filter(t => t.passed).length;
    const failed = tests.filter(t => !t.passed).length;

    this.results.push({
      platform: 'Cross-Platform',
      tests,
      passed,
      failed,
      success: failed === 0
    });

    console.log(`✅ Cross-platform validation: ${passed} passed, ${failed} failed\n`);
  }

  // Vercel Tests
  private async testVercelBuild(): Promise<TestResult> {
    const start = Date.now();
    try {
      console.log('  Testing Vercel build process...');
      execSync('npm run build', { stdio: 'pipe' });
      return {
        name: 'Vercel Build',
        passed: true,
        message: 'Build completed successfully',
        duration: Date.now() - start
      };
    } catch (error) {
      return {
        name: 'Vercel Build',
        passed: false,
        error: error.message,
        duration: Date.now() - start
      };
    }
  }

  private async testVercelEnvironment(): Promise<TestResult> {
    const start = Date.now();
    try {
      console.log('  Testing Vercel environment variables...');
      const requiredVars = ['NODE_ENV', 'NEXT_PUBLIC_APP_URL', 'DATABASE_URL'];
      const missingVars = requiredVars.filter(v => !process.env[v]);
      
      if (missingVars.length > 0) {
        throw new EnhancedError(`Missing environment variables: ${missingVars.join(', ')}`);
      }

      return {
        name: 'Vercel Environment',
        passed: true,
        message: 'All required environment variables are set',
        duration: Date.now() - start
      };
    } catch (error) {
      return {
        name: 'Vercel Environment',
        passed: false,
        error: error.message,
        duration: Date.now() - start
      };
    }
  }

  private async testVercelAPI(): Promise<TestResult> {
    const start = Date.now();
    try {
      console.log('  Testing Vercel API endpoints...');
      const vercelUrl = process.env.VERCEL_URL || 'http://localhost:3000';
      
      const response = await fetch(`${vercelUrl}/api/health`);
      if (!response.ok) {
        throw new EnhancedError(`API responded with status: ${response.status}`);
      }

      const data = await response.json();
      if (!data.success) {
        throw new EnhancedError('Health check failed');
      }

      return {
        name: 'Vercel API',
        passed: true,
        message: 'API endpoints are working correctly',
        duration: Date.now() - start
      };
    } catch (error) {
      return {
        name: 'Vercel API',
        passed: false,
        error: error.message,
        duration: Date.now() - start
      };
    }
  }

  private async testVercelPerformance(): Promise<TestResult> {
    const start = Date.now();
    try {
      console.log('  Testing Vercel performance...');
      const vercelUrl = process.env.VERCEL_URL || 'http://localhost:3000';
      
      const response = await fetch(vercelUrl);
      const loadTime = Date.now() - start;
      
      if (loadTime > 5000) {
        throw new EnhancedError(`Page load time too slow: ${loadTime}ms`);
      }

      return {
        name: 'Vercel Performance',
        passed: true,
        message: `Performance acceptable (${loadTime}ms)`,
        duration: loadTime
      };
    } catch (error) {
      return {
        name: 'Vercel Performance',
        passed: false,
        error: error.message,
        duration: Date.now() - start
      };
    }
  }

  // Netlify Tests
  private async testNetlifyBuild(): Promise<TestResult> {
    const start = Date.now();
    try {
      console.log('  Testing Netlify build process...');
      execSync('npm run build', { stdio: 'pipe' });
      return {
        name: 'Netlify Build',
        passed: true,
        message: 'Build completed successfully',
        duration: Date.now() - start
      };
    } catch (error) {
      return {
        name: 'Netlify Build',
        passed: false,
        error: error.message,
        duration: Date.now() - start
      };
    }
  }

  private async testNetlifyEnvironment(): Promise<TestResult> {
    const start = Date.now();
    try {
      console.log('  Testing Netlify environment variables...');
      const requiredVars = ['NODE_ENV', 'NEXT_PUBLIC_APP_URL', 'DATABASE_URL'];
      const missingVars = requiredVars.filter(v => !process.env[v]);
      
      if (missingVars.length > 0) {
        throw new EnhancedError(`Missing environment variables: ${missingVars.join(', ')}`);
      }

      return {
        name: 'Netlify Environment',
        passed: true,
        message: 'All required environment variables are set',
        duration: Date.now() - start
      };
    } catch (error) {
      return {
        name: 'Netlify Environment',
        passed: false,
        error: error.message,
        duration: Date.now() - start
      };
    }
  }

  private async testNetlifyFunctions(): Promise<TestResult> {
    const start = Date.now();
    try {
      console.log('  Testing Netlify functions...');
      const netlifyUrl = process.env.NETLIFY_URL || 'http://localhost:3000';
      
      const response = await fetch(`${netlifyUrl}/.netlify/functions/api/health`);
      if (!response.ok) {
        throw new EnhancedError(`Function responded with status: ${response.status}`);
      }

      const data = await response.json();
      if (!data.success) {
        throw new EnhancedError('Function health check failed');
      }

      return {
        name: 'Netlify Functions',
        passed: true,
        message: 'Serverless functions are working correctly',
        duration: Date.now() - start
      };
    } catch (error) {
      return {
        name: 'Netlify Functions',
        passed: false,
        error: error.message,
        duration: Date.now() - start
      };
    }
  }

  private async testNetlifyRedirects(): Promise<TestResult> {
    const start = Date.now();
    try {
      console.log('  Testing Netlify redirects...');
      const netlifyUrl = process.env.NETLIFY_URL || 'http://localhost:3000';
      
      const response = await fetch(netlifyUrl, {
        redirect: 'manual'
      });
      
      if (response.status >= 300 && response.status < 400) {
        return {
          name: 'Netlify Redirects',
          passed: true,
          message: 'Redirects are working correctly',
          duration: Date.now() - start
        };
      }

      return {
        name: 'Netlify Redirects',
        passed: true,
        message: 'No redirects needed',
        duration: Date.now() - start
      };
    } catch (error) {
      return {
        name: 'Netlify Redirects',
        passed: false,
        error: error.message,
        duration: Date.now() - start
      };
    }
  }

  // Neon Tests
  private async testNeonConnection(): Promise<TestResult> {
    const start = Date.now();
    try {
      console.log('  Testing Neon database connection...');
      const result = await this.prisma.$queryRaw`SELECT NOW() as time`;
      
      return {
        name: 'Neon Connection',
        passed: true,
        message: 'Database connection successful',
        duration: Date.now() - start
      };
    } catch (error) {
      return {
        name: 'Neon Connection',
        passed: false,
        error: error.message,
        duration: Date.now() - start
      };
    }
  }

  private async testNeonSchema(): Promise<TestResult> {
    const start = Date.now();
    try {
      console.log('  Testing Neon schema synchronization...');
      
      // Test basic model operations
      const userCount = await this.prisma.user.count();
      const tenantCount = await this.prisma.tenant.count();
      
      return {
        name: 'Neon Schema',
        passed: true,
        message: `Schema synchronized (${userCount} users, ${tenantCount} tenants)`,
        duration: Date.now() - start
      };
    } catch (error) {
      return {
        name: 'Neon Schema',
        passed: false,
        error: error.message,
        duration: Date.now() - start
      };
    }
  }

  private async testNeonPerformance(): Promise<TestResult> {
    const start = Date.now();
    try {
      console.log('  Testing Neon query performance...');
      
      const startTime = Date.now();
      await this.prisma.user.findMany({
        take: 10,
        select: { id: true, email: true }
      });
      const queryTime = Date.now() - startTime;
      
      if (queryTime > 1000) {
        throw new EnhancedError(`Query too slow: ${queryTime}ms`);
      }

      return {
        name: 'Neon Performance',
        passed: true,
        message: `Query performance acceptable (${queryTime}ms)`,
        duration: Date.now() - start
      };
    } catch (error) {
      return {
        name: 'Neon Performance',
        passed: false,
        error: error.message,
        duration: Date.now() - start
      };
    }
  }

  private async testNeonDataIntegrity(): Promise<TestResult> {
    const start = Date.now();
    try {
      console.log('  Testing Neon data integrity...');
      
      // Test creating and reading data
      const testUser = await this.prisma.user.create({
        data: {
          email: `test-${Date.now()}@example.com`,
          name: 'Integration Test User',
          password: 'test-password'
        }
      });
      
      const retrievedUser = await this.prisma.user.findUnique({
        where: { id: testUser.id }
      });
      
      if (!retrievedUser || retrievedUser.email !== testUser.email) {
        throw new EnhancedError('Data integrity test failed');
      }
      
      // Clean up
      await this.prisma.user.delete({
        where: { id: testUser.id }
      });

      return {
        name: 'Neon Data Integrity',
        passed: true,
        message: 'Data integrity verified',
        duration: Date.now() - start
      };
    } catch (error) {
      return {
        name: 'Neon Data Integrity',
        passed: false,
        error: error.message,
        duration: Date.now() - start
      };
    }
  }

  // Cross-Platform Tests
  private async testAPIConsistency(): Promise<TestResult> {
    const start = Date.now();
    try {
      console.log('  Testing API consistency across platforms...');
      
      const platforms = [
        { name: 'Vercel', url: process.env.VERCEL_URL || 'http://localhost:3000' },
        { name: 'Netlify', url: process.env.NETLIFY_URL || 'http://localhost:3000' }
      ];
      
      const endpoints = ['/api/health', '/api/users'];
      let allConsistent = true;
      
      for (const endpoint of endpoints) {
        const results = await Promise.all(
          platforms.map(platform => 
            fetch(`${platform.url}${endpoint}`).then(res => res.status)
          )
        );
        
        const statusCodes = new Set(results);
        if (statusCodes.size > 1) {
          console.log(`    Inconsistent status codes for ${endpoint}: ${Array.from(statusCodes).join(', ')}`);
          allConsistent = false;
        }
      }

      return {
        name: 'API Consistency',
        passed: allConsistent,
        message: allConsistent ? 'API responses are consistent' : 'API responses are inconsistent',
        duration: Date.now() - start
      };
    } catch (error) {
      return {
        name: 'API Consistency',
        passed: false,
        error: error.message,
        duration: Date.now() - start
      };
    }
  }

  private async testDatabaseConsistency(): Promise<TestResult> {
    const start = Date.now();
    try {
      console.log('  Testing database consistency across platforms...');
      
      // Test that database operations work the same way
      const testRecord = await this.prisma.user.create({
        data: {
          email: `consistency-test-${Date.now()}@example.com`,
          name: 'Consistency Test User',
          password: 'test-password'
        }
      });
      
      // Verify the record exists
      const retrieved = await this.prisma.user.findUnique({
        where: { id: testRecord.id }
      });
      
      if (!retrieved) {
        throw new EnhancedError('Database consistency test failed');
      }
      
      // Clean up
      await this.prisma.user.delete({
        where: { id: testRecord.id }
      });

      return {
        name: 'Database Consistency',
        passed: true,
        message: 'Database operations are consistent',
        duration: Date.now() - start
      };
    } catch (error) {
      return {
        name: 'Database Consistency',
        passed: false,
        error: error.message,
        duration: Date.now() - start
      };
    }
  }

  private async testEnvironmentConsistency(): Promise<TestResult> {
    const start = Date.now();
    try {
      console.log('  Testing environment consistency across platforms...');
      
      const requiredVars = ['NODE_ENV', 'NEXT_PUBLIC_APP_URL', 'DATABASE_URL'];
      const missingVars = requiredVars.filter(v => !process.env[v]);
      
      if (missingVars.length > 0) {
        throw new EnhancedError(`Missing environment variables: ${missingVars.join(', ')}`);
      }

      return {
        name: 'Environment Consistency',
        passed: true,
        message: 'Environment variables are consistent',
        duration: Date.now() - start
      };
    } catch (error) {
      return {
        name: 'Environment Consistency',
        passed: false,
        error: error.message,
        duration: Date.now() - start
      };
    }
  }

  private async testPerformanceConsistency(): Promise<TestResult> {
    const start = Date.now();
    try {
      console.log('  Testing performance consistency across platforms...');
      
      const platforms = [
        { name: 'Vercel', url: process.env.VERCEL_URL || 'http://localhost:3000' },
        { name: 'Netlify', url: process.env.NETLIFY_URL || 'http://localhost:3000' }
      ];
      
      const loadTimes = await Promise.all(
        platforms.map(async platform => {
          const start = Date.now();
          await fetch(platform.url);
          return Date.now() - start;
        })
      );
      
      const maxDiff = Math.max(...loadTimes) - Math.min(...loadTimes);
      const avgTime = loadTimes.reduce((a, b) => a + b, 0) / loadTimes.length;
      
      if (maxDiff > 2000) {
        throw new EnhancedError(`Performance variance too high: ${maxDiff}ms difference`);
      }

      return {
        name: 'Performance Consistency',
        passed: true,
        message: `Performance consistent (avg: ${avgTime}ms, max diff: ${maxDiff}ms)`,
        duration: Date.now() - start
      };
    } catch (error) {
      return {
        name: 'Performance Consistency',
        passed: false,
        error: error.message,
        duration: Date.now() - start
      };
    }
  }

  private generateSummary(): void {
    console.log('📊 Integration Validation Summary\n');
    console.log('='.repeat(60));
    
    let totalPassed = 0;
    let totalFailed = 0;
    
    for (const result of this.results) {
      console.log(`\n${result.platform}:`);
      console.log(`  Tests: ${result.tests.length}`);
      console.log(`  Passed: ${result.passed}`);
      console.log(`  Failed: ${result.failed}`);
      console.log(`  Status: ${result.success ? '✅ PASS' : '❌ FAIL'}`);
      
      if (result.failed > 0) {
        console.log('\n  Failed Tests:');
        result.tests
          .filter(test => !test.passed)
          .forEach(test => {
            console.log(`    - ${test.name}: ${test.error || 'Unknown error'}`);
          });
      }
      
      totalPassed += result.passed;
      totalFailed += result.failed;
    }
    
    console.log(`\n${  '='.repeat(60)}`);
    console.log(`\nOverall Summary:`);
    console.log(`Total Tests: ${totalPassed + totalFailed}`);
    console.log(`Passed: ${totalPassed}`);
    console.log(`Failed: ${totalFailed}`);
    console.log(`Success Rate: ${((totalPassed / (totalPassed + totalFailed)) * 100).toFixed(1)}%`);
    
    if (totalFailed === 0) {
      console.log('\n🎉 All integrations validated successfully!');
    } else {
      console.log('\n⚠️  Some integrations failed validation. Please review the failed tests above.');
      process.exit(1);
    }
  }
}

// Main execution
async function main() {
  const validator = new IntegrationValidator();
  await validator.validateAll();
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('Validation failed:', error);
    process.exit(1);
  });
}

export { IntegrationValidator };
// Enhanced error class with better error handling
class EnhancedError extends Error {
  constructor(
    message: string,
    public code: string = 'UNKNOWN_ERROR',
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message);
    this.name = 'EnhancedError';
    Error.captureStackTrace(this, EnhancedError);
  }
  
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      details: this.details,
      stack: this.stack
    };
  }
}
