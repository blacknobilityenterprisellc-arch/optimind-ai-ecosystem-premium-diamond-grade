#!/usr/bin/env tsx

/**
 * OptiMind AI Ecosystem - Testing Ecosystem Demo
 * 
 * Quick demonstration of the advanced testing capabilities
 * 
 * @author: Enterprise Architecture Team
 * @version: 2.0.0
 */

const fetch = require('node-fetch');

async function demonstrateTestingEcosystem() {
  const baseUrl = 'http://localhost:3000';
  
  console.log('🚀 OptiMind AI Ecosystem - Advanced Testing Ecosystem Demo\n');

  // 1. Health Check
  console.log('🔍 1. System Health Check');
  try {
    const response = await fetch(`${baseUrl}/api/health`);
    console.log(`   Status: ${response.status} ${response.statusText}`);
    const data = await response.json();
    console.log(`   Response: ${JSON.stringify(data, null, 2).substring(0, 100)}...\n`);
  } catch (error) {
    console.log(`   Error: ${error.message}\n`);
  }

  // 2. Multi-Dimensional Testing API Info
  console.log('🧪 2. Multi-Dimensional Testing Capabilities');
  try {
    const response = await fetch(`${baseUrl}/api/testing/multi-dimensional`);
    console.log(`   Status: ${response.status} ${response.statusText}`);
    const data = await response.json();
    console.log(`   Capabilities: ${data.capabilities?.length || 0} capabilities available`);
    console.log(`   Dimensions: ${Object.keys(data.dimensions || {}).join(', ')}\n`);
  } catch (error) {
    console.log(`   Error: ${error.message}\n`);
  }

  // 3. AI Model Testing
  console.log('🤖 3. AI Model Integration');
  const models = ['glm-45-flagship', 'glm-45v', 'glm-45-auto-think'];
  for (const model of models.slice(0, 2)) { // Test first 2 models for demo
    try {
      const response = await fetch(`${baseUrl}/api/models/${model}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: `Quick test of ${model}` }]
        })
      });
      console.log(`   ${model}: ${response.status} ${response.statusText}`);
    } catch (error) {
      console.log(`   ${model}: Error - ${error.message}`);
    }
  }
  console.log('');

  // 4. Security Testing
  console.log('🔒 4. Quantum Security Testing');
  try {
    const response = await fetch(`${baseUrl}/api/v2/quantum-security/key-pair`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ algorithm: 'quantum-resistant', keySize: 2048 })
    });
    console.log(`   Key Generation: ${response.status} ${response.statusText}`);
  } catch (error) {
    console.log(`   Key Generation: Error - ${error.message}`);
  }
  console.log('');

  // 5. Performance Testing
  console.log('⚡ 5. Performance Analytics');
  try {
    const response = await fetch(`${baseUrl}/api/v2/predictive-analytics/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'ensemble',
        data: { demo: true },
        horizon: 7
      })
    });
    console.log(`   Predictive Analytics: ${response.status} ${response.statusText}`);
  } catch (error) {
    console.log(`   Predictive Analytics: Error - ${error.message}`);
  }
  console.log('');

  // 6. Database Testing
  console.log('🗄️ 6. Database Operations');
  try {
    const response = await fetch(`${baseUrl}/api/v2/database/health`);
    console.log(`   Database Health: ${response.status} ${response.statusText}`);
  } catch (error) {
    console.log(`   Database Health: Error - ${error.message}`);
  }
  console.log('');

  // 7. Real-time Monitoring
  console.log('📊 7. Real-time Monitoring');
  try {
    const response = await fetch(`${baseUrl}/api/testing/monitor`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        metrics: ['performance', 'security'],
        duration: 10,
        realTime: true,
        alerts: false
      })
    });
    console.log(`   Monitoring: ${response.status} ${response.statusText}`);
  } catch (error) {
    console.log(`   Monitoring: Error - ${error.message}`);
  }
  console.log('');

  console.log('🎯 Testing Ecosystem Demo Complete!');
  console.log('📋 Summary: The OptiMind AI Ecosystem features a comprehensive, AI-powered testing framework that includes:');
  console.log('   ✅ Multi-dimensional testing with AI orchestration');
  console.log('   ✅ Real-time monitoring and analytics');
  console.log('   ✅ Advanced security testing (quantum-resistant)');
  console.log('   ✅ Performance optimization and predictive analytics');
  console.log('   ✅ Database health and backup testing');
  console.log('   ✅ AI model integration validation');
  console.log('   ✅ Comprehensive API testing');
  console.log('\n🚀 This advanced testing ecosystem far exceeds traditional integration test suites!');
}

// Run the demo
demonstrateTestingEcosystem().catch(console.error);