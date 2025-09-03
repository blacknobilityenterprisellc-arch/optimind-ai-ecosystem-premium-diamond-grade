/**
 * Test file for ZaiIntegration
 * This file demonstrates how to use the integration system
 */

import { ZaiIntegration } from './zaiIntegration';
import fs from 'fs/promises';
import path from 'path';

async function testIntegration() {
  console.log('Testing ZaiIntegration...');
  
  // Initialize the integration
  const integration = new ZaiIntegration({
    zaiApiKey: process.env.ZAI_API_KEY || 'test-key',
    enableAIR: true,
    maxConcurrency: 2,
  });

  try {
    // Test with a sample image (if available)
    const testImagePath = path.join(process.cwd(), 'public', 'test-image.jpg');
    
    try {
      const imageBuffer = await fs.readFile(testImagePath);
      const imageId = `test_${Date.now()}`;
      
      console.log('Running analysis with test image...');
      
      const result = await integration.analyzeAndPersistImage(
        imageId,
        imageBuffer,
        {
          filename: 'test-image.jpg',
          contentType: 'image/jpeg',
          size: imageBuffer.length,
          uploaderId: 'test-user',
          metadata: { test: true },
        }
      );

      console.log('Analysis result:', {
        success: result.success,
        persistedId: result.persistedId,
        consensus: result.consensus ? {
          topLabel: result.consensus.topLabel,
          score: result.consensus.score,
          action: result.consensus.recommendedAction,
        } : null,
      });

    } catch (fileError) {
      console.log('Test image not found, skipping image analysis test');
    }

    // Test with a dummy buffer to verify the integration structure
    console.log('Testing integration with dummy data...');
    
    const dummyBuffer = Buffer.from('dummy image data');
    const dummyImageId = `dummy_${Date.now()}`;
    
    const dummyResult = await integration.analyzeAndPersistImage(
      dummyImageId,
      dummyBuffer,
      {
        filename: 'dummy.jpg',
        contentType: 'image/jpeg',
        size: dummyBuffer.length,
        uploaderId: 'test-user',
        metadata: { test: true, dummy: true },
      }
    );

    console.log('Dummy analysis result:', {
      success: dummyResult.success,
      reason: dummyResult.reason || 'N/A',
      error: dummyResult.error || 'N/A',
    });

  } catch (error) {
    console.error('Integration test failed:', error);
  }
}

// Export the test function
export { testIntegration };

// Run the test if this file is executed directly
if (require.main === module) {
  testIntegration().catch(console.error);
}