import { NextRequest, NextResponse } from 'next/server';
import { zaiApiService, ZAIModelConfig } from '@/lib/zai-api-service';

export async function GET() {
  try {
    const models = zaiApiService.getAvailableModels();
    return NextResponse.json({ models });
  } catch (error) {
    console.error('Failed to get models:', error);
    return NextResponse.json(
      { error: 'Failed to get available models' },
      { status: 500 }
    );
  }
}