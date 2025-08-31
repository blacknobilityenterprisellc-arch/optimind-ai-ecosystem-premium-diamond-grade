import { NextRequest, NextResponse } from 'next/server';
import { zaiApiService, ZAIModelConfig } from '@/lib/zai-api-service';
<<<<<<< HEAD

export async function GET() {
  try {
    const models = zaiApiService.getAvailableModels();
    return NextResponse.json({ models });
=======
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
>>>>>>> c358f87d910e205477b71ec74630ccafe0f3c33d
  } catch (error) {
    console.error('Failed to get models:', error);
    return NextResponse.json(
      { error: 'Failed to get available models' },
      { status: 500 }
    );
  }
}