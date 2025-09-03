import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { contractWiseService, ContractAnalysisRequest } from '@/lib/contractwise-service';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      contractTitle,
      contractType,
      contractText,
      fileUrl,
      extractedText,
      jurisdiction,
      industry,
      priority,
      projectId
    } = body;

    // Validate required fields
    if (!contractTitle || !contractType) {
      return NextResponse.json(
        { error: 'Contract title and type are required' },
        { status: 400 }
      );
    }

    // Validate that we have either contract text or extracted text
    if (!contractText && !extractedText && !fileUrl) {
      return NextResponse.json(
        { error: 'Contract text, extracted text, or file URL is required' },
        { status: 400 }
      );
    }

    const analysisRequest: ContractAnalysisRequest = {
      contractTitle,
      contractType,
      contractText,
      fileUrl,
      extractedText,
      jurisdiction,
      industry,
      priority
    };

    const userId = session.user.id;
    const { result, dbRecord } = await contractWiseService.analyzeContract(
      analysisRequest,
      userId,
      projectId
    );

    return NextResponse.json({
      success: true,
      result,
      id: dbRecord.id,
      createdAt: dbRecord.createdAt,
      processingTime: result.metadata.processingTime,
      cost: result.metadata.cost,
      confidence: result.metadata.overallConfidence
    });

  } catch (error: any) {
    console.error('Contract analysis error:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Contract analysis failed',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}