import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { contractWiseService } from '@/lib/contractwise-service';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = Number.parseInt(searchParams.get('limit') || '20');
    const offset = Number.parseInt(searchParams.get('offset') || '0');

    const userId = session.user.id;
    const contracts = await contractWiseService.getUserContractAnalyses(userId, limit, offset);

    return NextResponse.json({
      success: true,
      contracts,
      total: contracts.length,
      limit,
      offset,
    });
  } catch (error: any) {
    console.error('Get contract analyses error:', error);
    return NextResponse.json(
      {
        error: error.message || 'Failed to get contract analyses',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
