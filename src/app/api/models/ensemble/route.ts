import { NextRequest, NextResponse } from 'next/server';
import { zaiApiService } from '@/lib/zai-api-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageBase64, analysisType, customPrompt, modelIds } = body;

    if (!imageBase64 || !analysisType) {
      return NextResponse.json(
        { error: 'Missing required fields: imageBase64, analysisType' },
        { status: 400 }
      );
    }

    const result = await zaiApiService.performEnsembleAnalysis({
      imageBase64,
      analysisType,
      modelId: 'ensemble',
      customPrompt
    }, modelIds);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Ensemble analysis failed:', error);
    return NextResponse.json(
      { error: 'Ensemble analysis failed' },
      { status: 500 }
    );
  }
}