import { NextRequest, NextResponse } from 'next/server'
import { getAvailableModels } from '@/lib/multi-model-ai'

export async function GET() {
  try {
    const models = await getAvailableModels();
    return NextResponse.json({ models });
  } catch (error: any) {
    console.error('Models API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch models' },
      { status: 500 }
    );
  }
}