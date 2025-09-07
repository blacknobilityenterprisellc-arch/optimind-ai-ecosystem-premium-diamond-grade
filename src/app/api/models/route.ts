import { NextRequest, NextResponse } from 'next/server';

import { getAvailableModels } from '@/lib/multi-model-ai';

export async function GET() {
  try {
    // Get all available models with all options enabled
    const models = await getAvailableModels({
      enableGLM45V: true,
      enableGLM45AutoThink: true,
      enableGLM45FullStack: true,
      enableGLM45Flagship: true,
      enableAIR: true,
      enableOpenRouter: true,
    });
    return NextResponse.json({ models });
  } catch (error: any) {
    console.error('Models API error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch models' }, { status: 500 });
  }
}
