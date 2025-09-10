import type { Request } from 'next/server';
import { NextResponse } from 'next/server';

/**
 * OptiMind AI Ecosystem - Predictive Analytics API v2.0
 * Premium Diamond Grade AI-Powered Predictive Analytics Endpoints
 *
 * Submit and execute prediction jobs
 */

import { predictiveAnalyticsService } from '@/lib/v2/predictive-analytics-service';

export async function POST(request: Request) {
  try {
    const { modelId, input, priority = 'medium' } = await request.json();

    if (!modelId || !input?.features) {
      return NextResponse.json(
        { error: 'Model ID and input features are required' },
        { status: 400 }
      );
    }

    if (!Array.isArray(input.features) || input.features.length === 0) {
      return NextResponse.json(
        { error: 'Input features must be a non-empty array' },
        { status: 400 }
      );
    }

    // Submit prediction job
    const jobId = await predictiveAnalyticsService.submitPrediction(modelId, input, priority);

    return NextResponse.json({
      success: true,
      data: {
        jobId,
        status: 'pending',
        message: 'Prediction job submitted successfully',
      },
      message: 'Prediction job submitted successfully',
    });
  } catch (error) {
    console.error('Prediction submission failed:', error);
    return NextResponse.json(
      {
        error: 'Failed to submit prediction job',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('jobId');

    if (jobId) {
      // Get specific prediction job
      const job = await predictiveAnalyticsService.getPredictionJob(jobId);

      if (!job) {
        return NextResponse.json({ error: 'Prediction job not found' }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        data: job,
        message: 'Prediction job retrieved successfully',
      });
    } else {
      // Get all prediction jobs (simplified - in production you'd want pagination)
      return NextResponse.json({
        success: true,
        data: {
          message: 'Use jobId parameter to get specific prediction job',
          example: '/api/v2/predictive-analytics/predict?jobId=your-job-id',
        },
        message: 'Prediction jobs endpoint - use jobId parameter',
      });
    }
  } catch (error) {
    console.error('Failed to get prediction job:', error);
    return NextResponse.json(
      {
        error: 'Failed to get prediction job',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
