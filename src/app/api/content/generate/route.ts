import { NextRequest, NextResponse } from 'next/server';
import { aiService } from '@/lib/ai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topic, contentType, tone, length, keywords, targetAudience } = body;

    // Validate required fields
    if (!topic || !contentType) {
      return NextResponse.json(
        { error: 'Topic and content type are required' },
        { status: 400 }
      );
    }

    // Generate content using AI service
    const result = await aiService.generateContent({
      topic,
      contentType,
      tone: tone || 'professional',
      length: length || 'medium',
      keywords: keywords || [],
      targetAudience: targetAudience || 'general audience'
    });

    return NextResponse.json({
      success: true,
      content: result.content,
      model: result.model,
      usage: result.usage,
      cost: result.cost
    });

  } catch (error) {
    console.error('Content generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
}