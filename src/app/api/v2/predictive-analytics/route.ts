/**
 * OptiMind AI Ecosystem - Predictive Analytics API v2.0
 * Premium Diamond Grade Predictive Analytics Endpoints
 */

import { NextRequest, NextResponse } from 'next/server';
import { predictiveAnalyticsServiceV2, type PredictiveAnalyticsRequest, type ModelManagementRequest } from '@/lib/v2/predictive-analytics-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { operation, ...params } = body;

    // Validate required fields
    if (!operation) {
      return NextResponse.json(
        { error: 'Operation is required' },
        { status: 400 }
      );
    }

    if (!params.userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Execute predictive analytics operation
    const analyticsRequest: PredictiveAnalyticsRequest = {
      operation,
      ...params
    };

    const result = await predictiveAnalyticsServiceV2.executeOperation(analyticsRequest);

    return NextResponse.json(result);

  } catch (error) {
    console.error('❌ Predictive Analytics API Error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const operation = searchParams.get('operation');

    // Handle different GET operations
    if (operation === 'models') {
      if (!userId) {
        return NextResponse.json(
          { error: 'User ID is required for models' },
          { status: 400 }
        );
      }

      const modelsResult = await predictiveAnalyticsServiceV2.getUserModels(userId);
      return NextResponse.json(modelsResult);
    }

    if (operation === 'insights') {
      if (!userId) {
        return NextResponse.json(
          { error: 'User ID is required for insights' },
          { status: 400 }
        );
      }

      const limit = parseInt(searchParams.get('limit') || '50');
      const insightsResult = await predictiveAnalyticsServiceV2.getUserInsights(userId, limit);
      return NextResponse.json(insightsResult);
    }

    if (operation === 'health') {
      const healthResult = await predictiveAnalyticsServiceV2.healthCheck();
      return NextResponse.json(healthResult);
    }

    return NextResponse.json(
      { error: 'Invalid operation. Use: models, insights, or health' },
      { status: 400 }
    );

  } catch (error) {
    console.error('❌ Predictive Analytics API Error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error.message 
      },
      { status: 500 }
    );
  }
}