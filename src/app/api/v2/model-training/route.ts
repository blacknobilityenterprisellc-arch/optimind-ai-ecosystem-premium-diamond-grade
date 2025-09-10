import type { Request } from 'next/server';
/**
 * OptiMind AI Ecosystem - Custom Model Training API v2.0
 * Premium Diamond Grade AI Model Training and Fine-Tuning System
 */

import { NextResponse } from 'next/server';
import { modelTrainingV2 } from '@/lib/v2/model-training';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { operation, ...params } = body;

    let result;

    switch (operation) {
      case 'create_training_job':
        result = await modelTrainingV2.createTrainingJob(params.config);
        break;

      case 'start_training':
        result = await modelTrainingV2.startTraining(params.jobId, params.data);
        break;

      case 'fine_tune_model':
        result = await modelTrainingV2.fineTuneModel(
          params.baseModel,
          params.dataset,
          params.config
        );
        break;

      case 'monitor_training':
        result = await modelTrainingV2.monitorTraining(params.jobId);
        break;

      case 'evaluate_model':
        result = await modelTrainingV2.evaluateModel(params.modelId, params.testData);
        break;

      case 'deploy_trained_model':
        result = await modelTrainingV2.deployTrainedModel(params.modelId, params.config);
        break;

      case 'create_custom_dataset':
        result = await modelTrainingV2.createCustomDataset(params.data, params.metadata);
        break;

      case 'hyperparameter_optimization':
        result = await modelTrainingV2.hyperparameterOptimization(params.config);
        break;

      case 'model_ensemble_training':
        result = await modelTrainingV2.modelEnsembleTraining(params.models, params.config);
        break;

      case 'export_model':
        result = await modelTrainingV2.exportModel(params.modelId, params.format);
        break;

      case 'get_training_metrics':
        result = modelTrainingV2.getTrainingMetrics();
        break;

      case 'health_check':
        result = await modelTrainingV2.healthCheck();
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
    console.error('Model Training API error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error.message,
        operation: body?.operation,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const health = await modelTrainingV2.healthCheck();
    const metrics = modelTrainingV2.getTrainingMetrics();

    return NextResponse.json({
      service: 'Custom Model Training v2.0',
      status: 'operational',
      health,
      metrics,
      capabilities: [
        'custom_model_training',
        'fine_tuning',
        'hyperparameter_optimization',
        'model_evaluation',
        'ensemble_training',
        'dataset_creation',
        'model_deployment',
        'model_export',
        'training_monitoring',
      ],
      supportedModels: [
        'GLM-4.5',
        'GLM-4.5V',
        'GLM-4.5-Auto-Think',
        'AIR',
        'GLM-4.5-Full-Stack',
        'Custom-Ensemble',
      ],
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Model Training GET error:', error);
    return NextResponse.json(
      { error: 'Service unavailable', message: error.message },
      { status: 503 }
    );
  }
}
