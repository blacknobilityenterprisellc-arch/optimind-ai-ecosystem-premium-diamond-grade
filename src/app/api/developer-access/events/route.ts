import type { Request } from 'next/server';
import { NextResponse } from 'next/server';

/**
 * Developer Access Events API Endpoint
 * Provides access events for monitoring and tracking
 */

import { exclusiveDeveloperAccessService } from '@/lib/exclusive-developer-access';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Validate parameters
    if (isNaN(limit) || limit < 1 || limit > 1000) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid limit parameter. Must be between 1 and 1000',
        },
        { status: 400 }
      );
    }

    if (isNaN(offset) || offset < 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid offset parameter. Must be a positive number',
        },
        { status: 400 }
      );
    }

    // Get access events
    const result = await exclusiveDeveloperAccessService.getAccessEvents(
      userId || undefined,
      limit,
      offset
    );

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
      events: result.events,
      total: result.total,
      pagination: {
        limit,
        offset,
        hasMore: offset + limit < result.total,
      },
    });
  } catch (error) {
    console.error('Error getting developer access events:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
