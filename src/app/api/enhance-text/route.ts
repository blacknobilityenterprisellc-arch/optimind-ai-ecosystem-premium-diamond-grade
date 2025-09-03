import { NextRequest, NextResponse } from 'next/server';
import { aiService } from '@/lib/ai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, enhancement, context } = body;

    // Validate required fields
    if (!text || !enhancement) {
      return NextResponse.json(
        { error: 'Text and enhancement type are required' },
        { status: 400 }
      );
    }

    // Enhance text using AI service
    const result = await aiService.enhanceText({
      text,
      enhancement,
      context: context || ''
    });

    return NextResponse.json({
      success: true,
      enhancedText: result.content,
      model: result.model,
      usage: result.usage,
      cost: result.cost
    });

  } catch (error) {
    console.error('Text enhancement error:', error);
    return NextResponse.json(
      { error: 'Failed to enhance text' },
      { status: 500 }
    );
  }
}