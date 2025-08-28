import { NextRequest, NextResponse } from 'next/server';
import { zaiApiService, ZAIModelConfig } from '@/lib/zai-api-service';
import { openRouterService, OpenRouterModelConfig } from '@/lib/openrouter-service';

export async function GET() {
  try {
    const zaiModels = zaiApiService.getAvailableModels();
    const openRouterModels = openRouterService.getAvailableModels();
    
    return NextResponse.json({ 
      zaiModels,
      openRouterModels,
      totalZaiModels: zaiModels.length,
      totalOpenRouterModels: openRouterModels.length,
      openRouterProviders: [...new Set(openRouterModels.map(m => m.provider))]
    });
  } catch (error) {
    console.error('Failed to get models:', error);
    return NextResponse.json(
      { error: 'Failed to get available models' },
      { status: 500 }
    );
  }
}