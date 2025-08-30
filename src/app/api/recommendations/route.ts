import { NextRequest, NextResponse } from 'next/server';
import { aiService } from '@/lib/ai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { context, type } = body;

    // Validate required fields
    if (!context || !type) {
      return NextResponse.json(
        { error: 'Context and type are required' },
        { status: 400 }
      );
    }

    // Get recommendations using AI service
    const result = await aiService.getRecommendations(context, type);

    return NextResponse.json({
      success: true,
      recommendations: result.content,
      model: result.model,
      usage: result.usage,
      cost: result.cost
    });

  } catch (error) {
    console.error('Recommendations error:', error);
    return NextResponse.json(
      { error: 'Failed to get recommendations' },
      { status: 500 }
    );
  }
}