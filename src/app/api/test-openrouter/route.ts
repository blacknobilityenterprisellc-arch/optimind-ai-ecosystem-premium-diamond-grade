import { NextRequest, NextResponse } from 'next/server';
import { openRouterService } from '@/lib/openrouter-service';

export async function GET() {
  try {
    // Test Open Router service initialization
    const models = openRouterService.getAvailableModels();
    
    // Test connection to a model
    const testModel = models[0];
    const connectionTest = await openRouterService.testModelConnection(testModel.id);
    
    return NextResponse.json({
      success: true,
      service: 'Open Router',
      totalModels: models.length,
      providers: [...new Set(models.map(m => m.provider))],
      testModel: {
        id: testModel.id,
        name: testModel.name,
        provider: testModel.provider,
        connectionStatus: connectionTest
      },
      sampleModels: models.slice(0, 5).map(m => ({
        id: m.id,
        name: m.name,
        provider: m.provider,
        capabilities: m.capabilities.slice(0, 3)
      }))
    });
  } catch (error: any) {
    console.error('Open Router test failed:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Open Router test failed',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, modelId = 'gpt-4o' } = body;
    
    if (!prompt) {
      return NextResponse.json({
        success: false,
        error: 'Prompt is required'
      }, { status: 400 });
    }

    const result = await openRouterService.analyzeWithModel({
      prompt,
      modelId
    });

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
    console.error('Open Router analysis test failed:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Open Router analysis failed',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}