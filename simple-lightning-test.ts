#!/usr/bin/env tsx

/**
 * Simple Lightning Test for OptiMind AI Ecosystem
 * Tests basic system components without requiring external services
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

interface TestResult {
  name: string;
  status: 'PASS' | 'FAIL' | 'SKIP';
  message: string;
  duration: number;
}

class SimpleLightningTest {
  private results: TestResult[] = [];
  private startTime: number;

  constructor() {
    this.startTime = Date.now();
    console.log('⚡ Starting Simple Lightning Test...');
  }

  async runTests(): Promise<void> {
    // Test 1: Basic File Structure
    await this.testFileStructure();

    // Test 2: Package.json Configuration
    await this.testPackageJson();

    // Test 3: TypeScript Configuration
    await this.testTypeScriptConfig();

    // Test 4: Database Schema
    await this.testDatabaseSchema();

    // Test 5: Environment Variables
    await this.testEnvironmentVariables();

    // Test 6: Basic Imports
    await this.testBasicImports();

    this.generateReport();
  }

  private async testFileStructure(): Promise<void> {
    const start = Date.now();
    const requiredFiles = [
      'package.json',
      'tsconfig.json',
      'src/app/page.tsx',
      'src/app/layout.tsx',
      'prisma/schema.prisma',
      '.env'
    ];

    let missingFiles: string[] = [];
    for (const file of requiredFiles) {
      if (!existsSync(file)) {
        missingFiles.push(file);
      }
    }

    const result: TestResult = {
      name: 'File Structure',
      status: missingFiles.length === 0 ? 'PASS' : 'FAIL',
      message: missingFiles.length === 0 
        ? 'All required files present' 
        : `Missing files: ${missingFiles.join(', ')}`,
      duration: Date.now() - start
    };

    this.results.push(result);
    console.log(`${result.status === 'PASS' ? '✅' : '❌'} File Structure: ${result.message}`);
  }

  private async testPackageJson(): Promise<void> {
    const start = Date.now();
    try {
      const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
      
      const requiredDeps = ['next', 'react', 'react-dom', '@prisma/client', 'z-ai-web-dev-sdk'];
      const missingDeps = requiredDeps.filter(dep => !packageJson.dependencies?.[dep]);
      
      const result: TestResult = {
        name: 'Package.json Configuration',
        status: missingDeps.length === 0 ? 'PASS' : 'FAIL',
        message: missingDeps.length === 0 
          ? 'All required dependencies present' 
          : `Missing dependencies: ${missingDeps.join(', ')}`,
        duration: Date.now() - start
      };

      this.results.push(result);
      console.log(`${result.status === 'PASS' ? '✅' : '❌'} Package.json: ${result.message}`);
    } catch (error) {
      const result: TestResult = {
        name: 'Package.json Configuration',
        status: 'FAIL',
        message: `Error reading package.json: ${error}`,
        duration: Date.now() - start
      };
      this.results.push(result);
      console.log(`❌ Package.json: ${result.message}`);
    }
  }

  private async testTypeScriptConfig(): Promise<void> {
    const start = Date.now();
    try {
      const tsConfig = JSON.parse(readFileSync('tsconfig.json', 'utf8'));
      
      const requiredOptions = ['compilerOptions', 'include', 'exclude'];
      const missingOptions = requiredOptions.filter(opt => !tsConfig[opt]);
      
      const result: TestResult = {
        name: 'TypeScript Configuration',
        status: missingOptions.length === 0 ? 'PASS' : 'FAIL',
        message: missingOptions.length === 0 
          ? 'TypeScript configuration is valid' 
          : `Missing options: ${missingOptions.join(', ')}`,
        duration: Date.now() - start
      };

      this.results.push(result);
      console.log(`${result.status === 'PASS' ? '✅' : '❌'} TypeScript Config: ${result.message}`);
    } catch (error) {
      const result: TestResult = {
        name: 'TypeScript Configuration',
        status: 'FAIL',
        message: `Error reading tsconfig.json: ${error}`,
        duration: Date.now() - start
      };
      this.results.push(result);
      console.log(`❌ TypeScript Config: ${result.message}`);
    }
  }

  private async testDatabaseSchema(): Promise<void> {
    const start = Date.now();
    try {
      const schema = readFileSync('prisma/schema.prisma', 'utf8');
      
      const hasProvider = schema.includes('provider =');
      const hasDatasource = schema.includes('datasource db');
      const hasModels = schema.includes('model ');
      
      const result: TestResult = {
        name: 'Database Schema',
        status: (hasProvider && hasDatasource && hasModels) ? 'PASS' : 'FAIL',
        message: (hasProvider && hasDatasource && hasModels)
          ? 'Database schema is properly configured'
          : 'Database schema is missing required components',
        duration: Date.now() - start
      };

      this.results.push(result);
      console.log(`${result.status === 'PASS' ? '✅' : '❌'} Database Schema: ${result.message}`);
    } catch (error) {
      const result: TestResult = {
        name: 'Database Schema',
        status: 'FAIL',
        message: `Error reading schema: ${error}`,
        duration: Date.now() - start
      };
      this.results.push(result);
      console.log(`❌ Database Schema: ${result.message}`);
    }
  }

  private async testEnvironmentVariables(): Promise<void> {
    const start = Date.now();
    const requiredEnvVars = ['NODE_ENV', 'DATABASE_URL', 'NEXT_PUBLIC_APP_URL'];
    
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    const result: TestResult = {
      name: 'Environment Variables',
      status: missingVars.length === 0 ? 'PASS' : 'FAIL',
      message: missingVars.length === 0 
        ? 'All required environment variables are set' 
        : `Missing environment variables: ${missingVars.join(', ')}`,
      duration: Date.now() - start
    };

    this.results.push(result);
    console.log(`${result.status === 'PASS' ? '✅' : '❌'} Environment Variables: ${result.message}`);
  }

  private async testBasicImports(): Promise<void> {
    const start = Date.now();
    const importTests = [
      { name: 'ZAI SDK', module: 'z-ai-web-dev-sdk' },
      { name: 'Prisma Client', module: '@prisma/client' },
      { name: 'Next.js', module: 'next' },
      { name: 'React', module: 'react' }
    ];

    let failedImports: string[] = [];
    
    for (const test of importTests) {
      try {
        require.resolve(test.module);
      } catch (error) {
        failedImports.push(test.name);
      }
    }

    const result: TestResult = {
      name: 'Basic Imports',
      status: failedImports.length === 0 ? 'PASS' : 'FAIL',
      message: failedImports.length === 0 
        ? 'All basic imports are working' 
        : `Failed imports: ${failedImports.join(', ')}`,
      duration: Date.now() - start
    };

    this.results.push(result);
    console.log(`${result.status === 'PASS' ? '✅' : '❌'} Basic Imports: ${result.message}`);
  }

  private generateReport(): void {
    const totalDuration = Date.now() - this.startTime;
    const passedTests = this.results.filter(r => r.status === 'PASS').length;
    const totalTests = this.results.length;
    const successRate = Math.round((passedTests / totalTests) * 100);

    console.log('\n🎯 SIMPLE LIGHTNING TEST RESULTS');
    console.log('================================');
    console.log(`📊 Overall Results: ${passedTests}/${totalTests} tests passed (${successRate}% success rate)`);
    console.log(`⏱️  Total Duration: ${totalDuration}ms`);
    console.log(`⚡ Average Test Time: ${Math.round(totalDuration / totalTests)}ms`);

    console.log('\n📋 Test Details:');
    this.results.forEach(result => {
      const icon = result.status === 'PASS' ? '✅' : result.status === 'FAIL' ? '❌' : '⚠️';
      console.log(`  ${icon} ${result.name}: ${result.message} (${result.duration}ms)`);
    });

    console.log('\n🏆 System Status:');
    if (successRate >= 80) {
      console.log('🎉 EXCELLENT: System is ready for lightning-fast operations!');
    } else if (successRate >= 60) {
      console.log('👍 GOOD: System is mostly functional with minor issues.');
    } else if (successRate >= 40) {
      console.log('⚠️  WARNING: System needs attention before full deployment.');
    } else {
      console.log('🚨 CRITICAL: System requires immediate attention.');
    }

    console.log('\n💡 Recommendations:');
    if (successRate < 100) {
      const failedTests = this.results.filter(r => r.status === 'FAIL');
      failedTests.forEach(test => {
        console.log(`   - Fix ${test.name}: ${test.message}`);
      });
    }

    if (successRate >= 80) {
      console.log('   - System is ready for development and testing');
      console.log('   - Consider running the full application for comprehensive testing');
    }

    console.log('\n⚡ Lightning Test Complete!');
    console.log('================================');
  }
}

// Main execution
async function main() {
  try {
    const test = new SimpleLightningTest();
    await test.runTests();
    
    const exitCode = test.results.every(r => r.status === 'PASS') ? 0 : 1;
    process.exit(exitCode);
  } catch (error) {
    console.error('❌ Simple Lightning Test failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

export { SimpleLightningTest };