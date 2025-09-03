import { NextRequest, NextResponse } from 'next/server';
import { openRouterService, OpenRouterAnalysisRequest } from '@/lib/openrouter-service';

export async function GET() {
  try {
    const models = openRouterService.getAvailableModels();
    return NextResponse.json({ 
      models,
      service: 'Open Router',
      totalModels: models.length,
      providers: [...new Set(models.map(m => m.provider))]
    });
  } catch (error) {
    console.error('Failed to get Open Router models:', error);
    return NextResponse.json(
      { error: 'Failed to get available Open Router models' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate request
    const { prompt, modelId, imageBase64, customSystemPrompt, temperature, maxTokens } = body;
    
    if (!prompt || !modelId) {
      return NextResponse.json(
        { error: 'Prompt and modelId are required' },
        { status: 400 }
      );
    }

    const request: OpenRouterAnalysisRequest = {
      prompt,
      modelId,
      imageBase64,
      customSystemPrompt,
      temperature,
      maxTokens
    };

    const result = await openRouterService.analyzeWithModel(request);
    
    return NextResponse.json({
      success: true,
      result,
      metadata: {
        modelId: result.modelId,
        modelName: result.modelName,
        processingTime: result.processingTime,
        confidence: result.confidence,
        usage: result.usage
      }
    });
    
  } catch (error: any) {
    console.error('Open Router analysis error:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Open Router analysis failed',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}