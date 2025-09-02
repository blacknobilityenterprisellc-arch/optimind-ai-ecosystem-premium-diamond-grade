import { NextRequest, NextResponse } from 'next/server';
import { aiService } from '@/lib/ai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { data, analysisType } = body;

    // Validate required fields
    if (!data || !analysisType) {
      return NextResponse.json(
        { error: 'Data and analysis type are required' },
        { status: 400 }
      );
    }

    // Analyze data using AI service
    const result = await aiService.analyzeData(data, analysisType);

    return NextResponse.json({
      success: true,
      analysis: result.content,
      model: result.model,
      usage: result.usage,
      cost: result.cost
    });

  } catch (error) {
    console.error('Data analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze data' },
      { status: 500 }
    );
  }
}