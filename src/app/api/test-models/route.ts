import { NextRequest, NextResponse } from 'next/server';
import { zaiApiService } from '@/lib/zai-api-service';

export async function GET() {
  try {
    const models = zaiApiService.getAvailableModels();
    const testResults: any[] = [];

    for (const model of models) {
      try {
        const isConnected = await zaiApiService.testModelConnection(model.id);
        testResults.push({
          modelId: model.id,
          modelName: model.name,
          isConnected,
          capabilities: model.capabilities
        });
      } catch (error: any) {
        testResults.push({
          modelId: model.id,
          modelName: model.name,
          isConnected: false,
          error: error?.message || 'Unknown error',
          capabilities: model.capabilities
        });
      }
    }

    return NextResponse.json({ testResults });
  } catch (error: any) {
    console.error('Model testing failed:', error);
    return NextResponse.json(
      { error: 'Model testing failed', details: error?.message },
      { status: 500 }
    );
  }
}