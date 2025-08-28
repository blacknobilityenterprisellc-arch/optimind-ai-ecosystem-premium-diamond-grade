/**
 * API route for content moderation
 * Demonstrates the ZaiIntegration system in action
 */

import { NextRequest, NextResponse } from 'next/server';
import { ZaiIntegration } from '@/services/zaiIntegration';

export async function POST(request: NextRequest) {
  try {
    console.log('[moderation API] Starting moderation analysis...');
    
    // Parse the multipart form data
    const formData = await request.formData();
    const file = formData.get('image') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Generate a unique ID for this analysis
    const imageId = `mod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Extract metadata
    const metadata = {
      filename: file.name,
      contentType: file.type,
      size: file.size,
      uploaderId: formData.get('uploaderId') as string || 'anonymous',
      uploadTime: new Date().toISOString(),
    };

    console.log('[moderation API] Processing image:', {
      imageId,
      filename: file.name,
      size: file.size,
      contentType: file.type,
    });

    // Initialize the integration
    const integration = new ZaiIntegration({
      zaiApiKey: process.env.ZAI_API_KEY || 'demo-key',
      enableAIR: true,
      maxConcurrency: 2,
    });

    // Run the analysis
    const result = await integration.analyzeAndPersistImage(
      imageId,
      buffer,
      metadata
    );

    console.log('[moderation API] Analysis completed:', {
      success: result.success,
      imageId,
      persistedId: result.persistedId,
    });

    if (!result.success) {
      return NextResponse.json({
        success: false,
        error: result.reason || 'Analysis failed',
        details: result.error,
        imageId,
      }, { status: 500 });
    }

    // Return the successful result
    return NextResponse.json({
      success: true,
      imageId,
      persistedId: result.persistedId,
      consensus: {
        topLabel: result.consensus?.topLabel,
        score: result.consensus?.score,
        spread: result.consensus?.spread,
        recommendedAction: result.consensus?.recommendedAction,
        reasons: result.consensus?.reasons,
      },
      analysisDetails: {
        modelsUsed: [
          result.vision ? 'vision' : null,
          result.air ? 'air' : null,
          result.text ? 'text' : null,
        ].filter(Boolean),
        reviewNeeded: result.consensus?.reasons?.includes('review_needed') || false,
      },
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('[moderation API] Unhandled error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      details: (error as Error).message,
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Content Moderation API',
    version: '1.0.0',
    endpoints: {
      POST: '/api/moderation - Analyze an image for content moderation',
    },
    features: [
      'Multi-model analysis (GLM-4.5V, GLM-4.5-AIR, GLM-4.5)',
      'AJV schema validation',
      'Consensus-based decision making',
      'Automated review queue creation',
      'Comprehensive audit logging',
    ],
  });
}