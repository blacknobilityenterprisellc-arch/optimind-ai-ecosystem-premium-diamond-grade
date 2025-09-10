import { NextResponse } from 'next/server';

/**
 * OptiMind AI Ecosystem - Predictive Analytics API v2.0
 * Premium Diamond Grade AI-Powered Predictive Analytics Endpoints
 */


import { predictiveAnalyticsV2 } from '@/lib/v2/predictive-analytics';

export async function POST() {
  try {
    const body = await request.json();
    const { operation, ...params } = body;

    let result;

    switch (operation) {
      case 'create_model':
        result = await predictiveAnalyticsV2.createModel(params.config);
        break;

      case 'train_model':
        result = await predictiveAnalyticsV2.trainModel(
          params.modelId,
          params.trainingData,
          params.options
        );
        break;

      case 'predict':
        result = await predictiveAnalyticsV2.predict(params.modelId, params.input);
        break;

      case 'batch_predict':
        result = await predictiveAnalyticsV2.batchPredict(params.modelId, params.inputs);
        break;

      case 'get_model_performance':
        result = await predictiveAnalyticsV2.getModelPerformance(params.modelId);
        break;

      case 'get_analytics_metrics':
        result = predictiveAnalyticsV2.getAnalyticsMetrics();
        break;

      case 'deploy_model':
        await predictiveAnalyticsV2.deployModel(params.modelId);
        result = { message: 'Model deployed successfully' };
        break;

      case 'generate_prediction_report':
        result = await predictiveAnalyticsV2.generatePredictionReport(
          new Date(params.startDate),
          new Date(params.endDate)
        );
        break;

      case 'health_check':
        result = await predictiveAnalyticsV2.healthCheck();
        break;

      default:
        return NextResponse.json({ error: 'Unsupported operation', operation }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      operation,
      result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Predictive Analytics API error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error.message,
        operation: body.operation,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const health = await predictiveAnalyticsV2.healthCheck();
    const metrics = predictiveAnalyticsV2.getAnalyticsMetrics();

    return NextResponse.json({
      service: 'Predictive Analytics v2.0',
      status: 'operational',
      health,
      metrics,
      capabilities: [
        'model_creation',
        'model_training',
        'prediction',
        'batch_prediction',
        'performance_monitoring',
        'analytics_reporting',
        'model_deployment',
      ],
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Predictive Analytics GET error:', error);
    return NextResponse.json(
      { error: 'Service unavailable', message: error.message },
      { status: 503 }
    );
  }
}
