/**
 * OptiMind AI Ecosystem - Predictive Model Management API v2.0
 * Premium Diamond Grade Predictive Model Management Endpoints
 */

import { NextRequest, NextResponse } from 'next/server';

import { predictiveAnalyticsServiceV2, type ModelManagementRequest } from '@/lib/v2/predictive-analytics-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...params } = body;

    // Validate required fields
    if (!action) {
      return NextResponse.json(
        { error: 'Action is required' },
        { status: 400 }
      );
    }

    if (!params.userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Execute model management operation
    const modelRequest: ModelManagementRequest = {
      action,
      ...params
    };

    const result = await predictiveAnalyticsServiceV2.manageModels(modelRequest);

    return NextResponse.json(result);

  } catch (error) {
    console.error('❌ Predictive Model Management API Error:', error);
    
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

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // List user's predictive models
    const result = await predictiveAnalyticsServiceV2.getUserModels(userId);

    return NextResponse.json(result);

  } catch (error) {
    console.error('❌ Predictive Model Management API Error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error.message 
      },
      { status: 500 }
    );
  }
}