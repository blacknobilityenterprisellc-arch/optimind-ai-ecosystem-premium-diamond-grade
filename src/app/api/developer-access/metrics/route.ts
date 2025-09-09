/**
 * Developer Access Metrics API Endpoint
 * Provides comprehensive metrics and analytics for developer access
 */

import { exclusiveDeveloperAccessService } from '@/lib/exclusive-developer-access';

export async function GET() {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    // Get access metrics
    const result = await exclusiveDeveloperAccessService.getAccessMetrics(userId || undefined);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      metrics: result.metrics,
    });
  } catch (error) {
    console.error('Error getting developer access metrics:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
