/**
 * OptiMind AI Ecosystem - Predictive Insights API v2.0
 * Premium Diamond Grade Predictive Insights Endpoints
 */

import { NextRequest, NextResponse } from 'next/server';

import {
  predictiveAnalyticsServiceV2,
  type PredictiveInsightRequest,
} from '@/lib/v2/predictive-analytics-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, data, ...params } = body;

    // Validate required fields
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    if (!data || !Array.isArray(data)) {
      return NextResponse.json({ error: 'Data array is required' }, { status: 400 });
    }

    // Execute insight generation
    const insightRequest: PredictiveInsightRequest = {
      userId,
      data,
      ...params,
    };

    const result = await predictiveAnalyticsServiceV2.generateInsights(insightRequest);

    return NextResponse.json(result);
  } catch (error) {
    console.error('❌ Predictive Insights API Error:', error);

    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const limit = Number.parseInt(searchParams.get('limit') || '50');

    // Get user's predictive insights
    const result = await predictiveAnalyticsServiceV2.getUserInsights(userId, limit);

    return NextResponse.json(result);
  } catch (error) {
    console.error('❌ Predictive Insights API Error:', error);

    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
