#!/usr/bin/env tsx

/**
 * Direct Z.AI API Connection Test
 * Tests the actual Z.AI API connection with the provided key
 */

import ZAI from 'z-ai-web-dev-sdk';

async function testZAIConnection() {
  console.log('🧪 Testing Z.AI API Connection...');
  
  try {
    const zai = await ZAI.create({
      apiKey: '1dc8da695f1846c5a76483eb2252023d.pYnbmJbwCWPpNHvY'
    });

    console.log('✅ Z.AI SDK initialized successfully');

    // Test basic chat completion
    const response = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a health check assistant. Respond with "OK" only.',
        },
        {
          role: 'user',
          content: 'Health check',
        },
      ],
      max_tokens: 10,
      temperature: 0.1,
    });

    console.log('📝 Z.AI Response:', response);
    
    const content = response.choices[0]?.message?.content;
    console.log('🎯 Response content:', content);

    if (content === 'OK') {
      console.log('✅ Z.AI API connection test PASSED');
      return true;
    } else {
      console.log('⚠️ Z.AI API connection test WARNING - unexpected response');
      return false;
    }

  } catch (error) {
    console.error('❌ Z.AI API connection test FAILED:', error);
    return false;
  }
}

testZAIConnection()
  .then(success => {
    console.log(`\n🏆 Test Result: ${success ? 'SUCCESS' : 'FAILED'}`);
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('💥 Test crashed:', error);
    process.exit(1);
  });