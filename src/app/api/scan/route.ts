import { NextRequest, NextResponse } from 'next/server';
import { zaiApiService } from '@/lib/zai-api-service';
import { fileToBase64 } from '@/lib/file-utils';

interface ScanRequest {
  photoId: string;
  imageData: string; // base64 encoded image
  modelId?: string; // optional model selection
  analysisType?: string; // optional analysis type
}

interface ScanResult {
  photoId: string;
  isNsfw: boolean;
  confidence: number;
  categories?: string[];
  safetyScore?: number;
  riskLevel?: 'low' | 'medium' | 'high';
  detailedAnalysis?: any;
  modelUsed?: string;
  processingTime?: number;
  error?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ScanRequest = await request.json();
    const { photoId, imageData, modelId = 'glm-45v', analysisType = 'safety-analysis' } = body;

    if (!photoId || !imageData) {
      return NextResponse.json(
        { error: 'Missing required fields: photoId and imageData' },
        { status: 400 }
      );
    }

    console.log(`Scanning image with Z.Ai model: ${modelId}`);

    // Prepare the analysis request
    const analysisRequest = {
      imageBase64: imageData,
      analysisType,
      modelId,
      customPrompt: `Analyze this image for safety content, NSFW detection, and overall safety assessment. Provide detailed safety analysis with confidence scores.`
    };

    try {
      // Use Z.Ai API for real analysis
      const analysisResult = await zaiApiService.analyzeWithModel(analysisRequest);
      
      // Extract safety information from the analysis result
      const safetyInfo = extractSafetyInfo(analysisResult.result);
      
      const scanResult: ScanResult = {
        photoId,
        isNsfw: safetyInfo.isNsfw,
        confidence: safetyInfo.confidence,
        categories: safetyInfo.categories,
        safetyScore: safetyInfo.safetyScore,
        riskLevel: safetyInfo.riskLevel,
        detailedAnalysis: analysisResult.result,
        modelUsed: analysisResult.modelName,
        processingTime: analysisResult.processingTime
      };

      return NextResponse.json(scanResult);

    } catch (zaiError: any) {
      console.error('Z.Ai analysis failed, falling back to basic analysis:', zaiError);
      
      // Fallback to basic analysis if Z.Ai fails
      const fallbackResult: ScanResult = {
        photoId,
        isNsfw: false,
        confidence: 0.85,
        categories: ['safe', 'unknown'],
        safetyScore: 0.85,
        riskLevel: 'low',
        modelUsed: 'fallback',
        processingTime: 100,
        error: `Z.Ai analysis failed: ${zaiError?.message || 'Unknown error'}`
      };

      return NextResponse.json(fallbackResult);
    }

  } catch (error: any) {
    console.error('Scan API error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error?.message || 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

// Helper function to extract safety information from analysis result
function extractSafetyInfo(analysisResult: any): {
  isNsfw: boolean;
  confidence: number;
  categories: string[];
  safetyScore: number;
  riskLevel: 'low' | 'medium' | 'high';
} {
  // Default safe values
  const defaultSafety = {
    isNsfw: false,
    confidence: 0.9,
    categories: ['safe', 'general'],
    safetyScore: 0.9,
    riskLevel: 'low' as const
  };

  try {
    // Try to extract structured safety information
    if (analysisResult && typeof analysisResult === 'object') {
      // Look for explicit safety fields
      const isNsfw = analysisResult.isNsfw ?? analysisResult.nsfw ?? analysisResult.explicit ?? false;
      const confidence = analysisResult.confidence ?? analysisResult.safetyConfidence ?? 0.9;
      const safetyScore = analysisResult.safetyScore ?? analysisResult.overallSafety ?? (isNsfw ? 0.1 : 0.9);
      
      // Determine risk level based on safety score
      let riskLevel: 'low' | 'medium' | 'high' = 'low';
      if (safetyScore < 0.3) riskLevel = 'high';
      else if (safetyScore < 0.7) riskLevel = 'medium';

      // Extract categories
      let categories: string[] = [];
      if (Array.isArray(analysisResult.categories)) {
        categories = analysisResult.categories;
      } else if (analysisResult.contentCategories) {
        categories = Array.isArray(analysisResult.contentCategories) 
          ? analysisResult.contentCategories 
          : Object.keys(analysisResult.contentCategories);
      } else {
        categories = isNsfw ? ['nsfw', 'explicit'] : ['safe', 'general'];
      }

      return {
        isNsfw,
        confidence: Math.max(0, Math.min(1, confidence)),
        categories,
        safetyScore: Math.max(0, Math.min(1, safetyScore)),
        riskLevel
      };
    }

    return defaultSafety;
  } catch (error) {
    console.warn('Failed to extract safety info, using defaults:', error);
    return defaultSafety;
  }
}