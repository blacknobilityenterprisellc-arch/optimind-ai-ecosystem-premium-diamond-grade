import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { contractWiseService } from '@/lib/contractwise-service';
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
    const { contractType, requirements } = body;

    if (!contractType) {
      return NextResponse.json(
        { error: 'Contract type is required' },
        { status: 400 }
      );
    }

    const userId = session.user.id;
    const { template, suggestions } = await contractWiseService.generateContractTemplate(
      contractType,
      requirements || {},
      userId
    );

    return NextResponse.json({
      success: true,
      template,
      suggestions,
      contractType,
      generatedAt: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Contract template generation error:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Contract template generation failed',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}