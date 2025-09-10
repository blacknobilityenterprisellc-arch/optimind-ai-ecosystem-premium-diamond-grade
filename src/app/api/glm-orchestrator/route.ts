/**
 * GLM-4.5 Orchestrator API Endpoint
 *
 * This endpoint demonstrates the GLM SDK as the primary orchestrator
 * for the OptiMind AI Ecosystem, providing centralized coordination
 * of all AI agents and system components.
 */

import { glmOrchestrator } from '@/lib/glm-orchestrator';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'status';

    // Initialize orchestrator if not already initialized
    if (!glmOrchestrator.getStatus().isInitialized) {
      await glmOrchestrator.initialize();
    }

    switch (action) {
      case 'health':
        const healthStatus = await glmOrchestrator.analyzeSystemHealth();
        return NextResponse.json({
          success: true,
          action: 'health-analysis',
          orchestrator: 'GLM-4.5',
          data: healthStatus,
          timestamp: new Date().toISOString(),
        });

      case 'status':
        const status = glmOrchestrator.getStatus();
        return NextResponse.json({
          success: true,
          action: 'status',
          orchestrator: 'GLM-4.5',
          data: status,
          timestamp: new Date().toISOString(),
        });

      case 'test-analysis':
        const analysisOperation = {
          type: 'analysis' as const,
          priority: 'high' as const,
          payload: {
            target: 'system-performance',
            metrics: ['response-time', 'throughput', 'error-rate'],
          },
          agentRequirements: ['glm-4.5-flagship', 'glm-4.5-auto-think'],
          expectedOutcome: 'performance-analysis-report',
        };

        const analysisId = await glmOrchestrator.submitOperation(analysisOperation);
        const analysisResult = await glmOrchestrator.getOperationResult(analysisId);

        return NextResponse.json({
          success: true,
          action: 'test-analysis',
          orchestrator: 'GLM-4.5',
          operationId: analysisId,
          data: analysisResult,
          timestamp: new Date().toISOString(),
        });

      case 'test-optimization':
        const optimizationOperation = {
          type: 'optimization' as const,
          priority: 'medium' as const,
          payload: {
            target: 'resource-allocation',
            parameters: ['cpu', 'memory', 'network'],
          },
          agentRequirements: ['glm-4.5-full-stack'],
          expectedOutcome: 'optimized-resource-allocation',
        };

        const optimizationId = await glmOrchestrator.submitOperation(optimizationOperation);
        const optimizationResult = await glmOrchestrator.getOperationResult(optimizationId);

        return NextResponse.json({
          success: true,
          action: 'test-optimization',
          orchestrator: 'GLM-4.5',
          operationId: optimizationId,
          data: optimizationResult,
          timestamp: new Date().toISOString(),
        });

      case 'test-prediction':
        const predictionOperation = {
          type: 'prediction' as const,
          priority: 'high' as const,
          payload: {
            task: 'system-behavior-prediction',
            timeframe: 'next-30-days',
            metrics: ['performance', 'security', 'scalability'],
          },
          agentRequirements: ['glm-4.5-flagship', 'glm-4.5-auto-think'],
          expectedOutcome: 'predictive-analysis-report',
        };

        const predictionId = await glmOrchestrator.submitOperation(predictionOperation);
        const predictionResult = await glmOrchestrator.getOperationResult(predictionId);

        return NextResponse.json({
          success: true,
          action: 'test-prediction',
          orchestrator: 'GLM-4.5',
          operationId: predictionId,
          data: predictionResult,
          timestamp: new Date().toISOString(),
        });

      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Unknown action',
            availableActions: [
              'health',
              'status',
              'test-analysis',
              'test-optimization',
              'test-prediction',
            ],
            timestamp: new Date().toISOString(),
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('GLM Orchestrator API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        orchestrator: 'GLM-4.5',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, payload } = body;

    // Initialize orchestrator if not already initialized
    if (!glmOrchestrator.getStatus().isInitialized) {
      await glmOrchestrator.initialize();
    }

    switch (action) {
      case 'submit-operation':
        const operation = {
          type: payload.type || 'analysis',
          priority: payload.priority || 'medium',
          payload: payload.data || {},
          agentRequirements: payload.agentRequirements || ['glm-4.5-flagship'],
          expectedOutcome: payload.expectedOutcome || 'operation-completion',
        };

        const operationId = await glmOrchestrator.submitOperation(operation);

        return NextResponse.json({
          success: true,
          action: 'submit-operation',
          orchestrator: 'GLM-4.5',
          operationId,
          message: 'Operation submitted successfully',
          timestamp: new Date().toISOString(),
        });

      case 'get-result':
        if (!payload.operationId) {
          return NextResponse.json(
            {
              success: false,
              error: 'Operation ID is required',
              timestamp: new Date().toISOString(),
            },
            { status: 400 }
          );
        }

        const result = await glmOrchestrator.getOperationResult(payload.operationId);

        return NextResponse.json({
          success: true,
          action: 'get-result',
          orchestrator: 'GLM-4.5',
          operationId: payload.operationId,
          data: result,
          timestamp: new Date().toISOString(),
        });

      case 'comprehensive-test':
        // Import and run the comprehensive test
        const { glmOrchestratorTest } = await import('@/lib/glm-orchestrator-test');
        const testReport = await glmOrchestratorTest.runComprehensiveTest();

        return NextResponse.json({
          success: true,
          action: 'comprehensive-test',
          orchestrator: 'GLM-4.5',
          data: testReport,
          timestamp: new Date().toISOString(),
        });

      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Unknown action',
            availableActions: ['submit-operation', 'get-result', 'comprehensive-test'],
            timestamp: new Date().toISOString(),
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('GLM Orchestrator API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        orchestrator: 'GLM-4.5',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
