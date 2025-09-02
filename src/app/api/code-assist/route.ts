import { NextRequest, NextResponse } from 'next/server';
import { aiService } from '@/lib/ai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, language, task, context } = body;

    // Validate required fields
    if (!code || !language || !task) {
      return NextResponse.json(
        { error: 'Code, language, and task are required' },
        { status: 400 }
      );
    }

    // Get code assistance using AI service
    const result = await aiService.assistCode({
      code,
      language,
      task,
      context: context || ''
    });

    return NextResponse.json({
      success: true,
      result: result.content,
      model: result.model,
      usage: result.usage,
      cost: result.cost
    });

  } catch (error) {
    console.error('Code assistance error:', error);
    return NextResponse.json(
      { error: 'Failed to assist with code' },
      { status: 500 }
    );
  }
}