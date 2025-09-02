import { NextRequest, NextResponse } from 'next/server';
import { zaiApiService } from '@/lib/zai-api-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageBase64, analysisType, customPrompt } = body;

    if (!imageBase64 || !analysisType) {
      return NextResponse.json(
        { error: 'Missing required fields: imageBase64, analysisType' },
        { status: 400 }
      );
    }

    const result = await zaiApiService.analyzeWithModel({
      imageBase64,
      analysisType,
      modelId: 'glm-45-auto-think',
      customPrompt
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('GLM-4.5 Auto Think analysis failed:', error);
    return NextResponse.json(
      { error: 'GLM-4.5 Auto Think analysis failed' },
      { status: 500 }
    );
  }
}