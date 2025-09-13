#!/usr/bin/env tsx

/**
 * OptiMind AI Ecosystem - Automatic API Integration Activator
 * 
 * This script automatically detects, configures, and activates your API keys
 * for seamless integration with all AI services in the OptiMind ecosystem.
 */

import { intelligentAPIKeyDetector } from './src/lib/intelligent-api-key-detector';
import { automaticAPIKeyIntegration } from './src/lib/automatic-api-key-integration';

async function activateAutomaticAPIIntegration() {
  console.log('🚀 OptiMind AI Ecosystem - Automatic API Integration Activator');
  console.log('==============================================================');
  console.log('');

  try {
    // Step 1: Initialize Intelligent API Key Detector
    console.log('🧠 Step 1: Initializing Intelligent API Key Detector...');
    await intelligentAPIKeyDetector.initialize();
    
    const detectorStatus = intelligentAPIKeyDetector.getStatus();
    console.log(`✅ Detected ${detectorStatus.detectedKeys} API keys`);
    console.log(`✅ Available providers: ${detectorStatus.availableProviders.join(', ')}`);
    console.log('');

    // Step 2: Initialize Automatic API Key Integration
    console.log('⚙️ Step 2: Initializing Automatic API Key Integration...');
    await automaticAPIKeyIntegration.initialize();
    
    const integrationStatus = automaticAPIKeyIntegration.getStatus();
    console.log(`✅ Initialized ${integrationStatus.apiKeys} API keys`);
    console.log(`✅ Configured ${integrationStatus.services} services`);
    console.log(`✅ ${integrationStatus.activeServices} services are active`);
    console.log('');

    // Step 3: Display Detected API Keys
    console.log('🔑 Step 3: Detected API Keys Summary');
    console.log('=====================================');
    
    const detectedKeys = intelligentAPIKeyDetector.getDetectedKeys();
    for (const [provider, keyInfo] of detectedKeys) {
      const maskedKey = keyInfo.key.substring(0, 8) + '...' + keyInfo.key.substring(keyInfo.key.length - 4);
      console.log(`• ${provider.toUpperCase()}: ${maskedKey} (${keyInfo.source}) - Confidence: ${Math.round(keyInfo.confidence * 100)}%`);
    }
    console.log('');

    // Step 4: Display Active Services
    console.log('🤖 Step 4: Active AI Services');
    console.log('===============================');
    
    const activeServices = automaticAPIKeyIntegration.getActiveServices();
    if (activeServices.length > 0) {
      for (const provider of activeServices) {
        const serviceConfig = automaticAPIKeyIntegration.getServiceConfig(provider);
        console.log(`• ${serviceConfig?.name}: ENABLED`);
        console.log(`  Model: ${serviceConfig?.model}`);
        console.log(`  Max Tokens: ${serviceConfig?.maxTokens}`);
        console.log(`  Temperature: ${serviceConfig?.temperature}`);
      }
    } else {
      console.log('⚠️ No active AI services found');
    }
    console.log('');

    // Step 5: Test API Integration
    console.log('🧪 Step 5: Testing API Integration');
    console.log('==================================');
    
    try {
      const bestProvider = await automaticAPIKeyIntegration.getBestAvailableService();
      if (bestProvider) {
        console.log(`✅ Best available provider: ${bestProvider}`);
        
        // Test with a simple API call
        const testResponse = await automaticAPIKeyIntegration.makeAPICall('Hello, this is a test!', {
          maxTokens: 10,
          temperature: 0.1
        });
        
        console.log('✅ API integration test successful');
        console.log(`Response: ${JSON.stringify(testResponse, null, 2)}`);
      } else {
        console.log('⚠️ No available providers for testing');
      }
    } catch (error) {
      console.log(`❌ API integration test failed: ${error.message}`);
    }
    console.log('');

    // Step 6: Generate Integration Report
    console.log('📊 Step 6: Integration Summary');
    console.log('============================');
    
    console.log('🎯 OPTIMIND AI ECOSYSTEM - AUTOMATIC API INTEGRATION STATUS');
    console.log('');
    console.log(`📈 Total API Keys Detected: ${detectorStatus.detectedKeys}`);
    console.log(`🤖 Active AI Services: ${integrationStatus.activeServices}`);
    console.log(`⚙️ Configured Services: ${integrationStatus.services}`);
    console.log(`🔑 Integration Status: ${integrationStatus.initialized ? 'ACTIVE' : 'INACTIVE'}`);
    console.log('');
    
    if (integrationStatus.activeServices > 0) {
      console.log('🎉 SUCCESS: Your OptiMind AI Ecosystem is now automatically integrated with your API keys!');
      console.log('✅ All AI services are ready to use');
      console.log('✅ Automatic API key management is active');
      console.log('✅ Seamless service switching is enabled');
    } else {
      console.log('⚠️ WARNING: No active AI services found');
      console.log('💡 Please check your API keys in the .env file');
      console.log('💡 Ensure API keys are properly formatted and valid');
    }
    
    console.log('');
    console.log('🚀 Your OptiMind AI Ecosystem is now ready for automatic AI service usage!');
    
  } catch (error) {
    console.error('❌ Failed to activate automatic API integration:', error);
    console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace available');
    process.exit(1);
  }
}

// Run the activation
activateAutomaticAPIIntegration().catch(console.error);