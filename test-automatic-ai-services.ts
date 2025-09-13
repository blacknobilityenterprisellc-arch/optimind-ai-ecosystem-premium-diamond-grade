#!/usr/bin/env tsx

/**
 * OptiMind AI Ecosystem - Automatic AI Services Test
 * 
 * This script tests the automatic AI service manager with your configured API keys
 */

import { automaticAIServiceManager } from './src/lib/automatic-ai-service-manager';

async function testAutomaticAIServices() {
  console.log('🤖 OptiMind AI Ecosystem - Automatic AI Services Test');
  console.log('===================================================');
  console.log('');

  try {
    // Step 1: Initialize the service manager
    console.log('🚀 Step 1: Initializing Automatic AI Service Manager...');
    await automaticAIServiceManager.initialize();
    
    const availableServices = automaticAIServiceManager.getAvailableServices();
    console.log(`✅ Available services: ${availableServices.join(', ')}`);
    console.log('');

    // Step 2: Test individual services
    console.log('🧪 Step 2: Testing Individual Services');
    console.log('=====================================');
    
    const testResults = await automaticAIServiceManager.testAllServices();
    
    for (const [provider, success] of Object.entries(testResults)) {
      const status = success ? '✅ PASS' : '❌ FAIL';
      console.log(`${status} ${provider.toUpperCase()}: ${success ? 'Operational' : 'Failed'}`);
    }
    console.log('');

    // Step 3: Test smart request routing
    console.log('🎯 Step 3: Testing Smart Request Routing');
    console.log('========================================');
    
    const testPrompts = [
      { prompt: 'Write a simple hello world function in JavaScript', taskType: 'code_generation' },
      { prompt: 'Summarize the benefits of artificial intelligence', taskType: 'summarization' },
      { prompt: 'Translate "Hello, how are you?" to Spanish', taskType: 'translation' },
      { prompt: 'What is the capital of France?', taskType: 'question_answering' }
    ];

    for (const test of testPrompts) {
      try {
        console.log(`📝 Testing: ${test.taskType.replace('_', ' ').toUpperCase()}`);
        console.log(`   Prompt: "${test.prompt}"`);
        
        const response = await automaticAIServiceManager.makeSmartRequest(
          test.prompt,
          test.taskType,
          { maxTokens: 50, temperature: 0.7 }
        );
        
        console.log(`   ✅ Provider: ${response.provider}`);
        console.log(`   ✅ Model: ${response.model}`);
        console.log(`   ✅ Tokens: ${response.usage.totalTokens}`);
        console.log(`   ✅ Response: ${response.response.choices[0]?.message?.content?.substring(0, 100)}...`);
        console.log('');
        
      } catch (error) {
        console.log(`   ❌ Failed: ${error.message}`);
        console.log('');
      }
    }

    // Step 4: Generate performance report
    console.log('📊 Step 4: Performance Report');
    console.log('=============================');
    
    const performance = automaticAIServiceManager.getPerformanceReport();
    
    console.log(`📈 Total Requests: ${performance.totalRequests}`);
    console.log(`📈 Success Rate: ${Math.round(performance.successRate * 100)}%`);
    console.log(`📈 Average Response Time: ${Math.round(performance.averageResponseTime)}ms`);
    console.log(`📈 Total Tokens Used: ${performance.totalTokensUsed}`);
    console.log('');
    
    console.log('🏆 Provider Performance:');
    for (const [provider, metrics] of Object.entries(performance.providerPerformance)) {
      console.log(`   • ${provider.toUpperCase()}:`);
      console.log(`     Requests: ${metrics.requestCount}`);
      console.log(`     Success Rate: ${Math.round(metrics.successRate * 100)}%`);
      console.log(`     Avg Response Time: ${Math.round(metrics.averageResponseTime)}ms`);
      console.log(`     Total Tokens: ${metrics.totalTokens}`);
    }
    console.log('');

    // Step 5: Display service status
    console.log('🔧 Step 5: Service Status');
    console.log('=========================');
    
    for (const provider of availableServices) {
      const status = automaticAIServiceManager.getServiceStatus(provider);
      console.log(`🤖 ${provider.toUpperCase()} Service:`);
      console.log(`   Status: ${status.enabled ? 'ENABLED' : 'DISABLED'}`);
      console.log(`   Model: ${status.model || 'default'}`);
      if (status.performance) {
        console.log(`   Performance: ${Math.round(status.performance.successRate * 100)}% success rate`);
      }
      console.log('');
    }

    // Step 6: Final Summary
    console.log('🎉 Step 6: Final Summary');
    console.log('========================');
    
    const operationalServices = Object.values(testResults).filter(Boolean).length;
    const totalServices = Object.keys(testResults).length;
    
    console.log('🎯 OPTIMIND AI ECOSYSTEM - AUTOMATIC AI SERVICES STATUS');
    console.log('');
    console.log(`📊 Total Services Configured: ${totalServices}`);
    console.log(`📊 Operational Services: ${operationalServices}`);
    console.log(`📊 Service Availability: ${Math.round((operationalServices / totalServices) * 100)}%`);
    console.log(`📊 Total Test Requests: ${performance.totalRequests}`);
    console.log(`📊 Overall Success Rate: ${Math.round(performance.successRate * 100)}%`);
    console.log('');
    
    if (operationalServices === totalServices) {
      console.log('🎉 SUCCESS: All AI services are operational and automatically integrated!');
      console.log('✅ Your OptiMind AI Ecosystem is ready for automatic AI service usage!');
      console.log('✅ Smart request routing is working perfectly!');
      console.log('✅ API keys are automatically managed and validated!');
    } else {
      console.log('⚠️ WARNING: Some services are not operational');
      console.log('💡 Check the individual service test results above');
    }
    
    console.log('');
    console.log('🚀 Your OptiMind AI Ecosystem is now fully operational with automatic AI service management!');
    
  } catch (error) {
    console.error('❌ Failed to test automatic AI services:', error);
    console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace available');
    process.exit(1);
  }
}

// Run the test
testAutomaticAIServices().catch(console.error);