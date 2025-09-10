/**
 * OptiMind AI Ecosystem - Advanced Automation API v2.0
 * Premium Diamond Grade Workflow Automation and Self-Healing System
 */

import { NextResponse } from 'next/server';
import { advancedAutomationV2 } from '@/lib/v2/advanced-automation';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { operation, ...params } = body;

    let result;

    switch (operation) {
      case 'create_workflow':
        result = await advancedAutomationV2.createWorkflow(params.definition);
        break;

      case 'execute_workflow':
        result = await advancedAutomationV2.executeWorkflow(params.workflowId, params.input);
        break;

      case 'schedule_automation':
        result = await advancedAutomationV2.scheduleAutomation(params.config);
        break;

      case 'self_healing_system':
        result = await advancedAutomationV2.selfHealingSystem(params.issue);
        break;

      case 'predictive_maintenance':
        result = await advancedAutomationV2.predictiveMaintenance(params.system);
        break;

      case 'automated_scaling':
        result = await advancedAutomationV2.automatedScaling(params.metrics);
        break;

      case 'intelligent_alerting':
        result = await advancedAutomationV2.intelligentAlerting(params.alert);
        break;

      case 'autonomous_optimization':
        result = await advancedAutomationV2.autonomousOptimization(params.scope);
        break;

      case 'create_automation_policy':
        result = await advancedAutomationV2.createAutomationPolicy(params.policy);
        break;

      case 'monitor_automation_health':
        result = await advancedAutomationV2.monitorAutomationHealth(params.system);
        break;

      case 'get_automation_metrics':
        result = advancedAutomationV2.getAutomationMetrics();
        break;

      case 'health_check':
        result = await advancedAutomationV2.healthCheck();
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
    console.error('Advanced Automation API error:', error);
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
    const health = await advancedAutomationV2.healthCheck();
    const metrics = advancedAutomationV2.getAutomationMetrics();

    return NextResponse.json({
      service: 'Advanced Automation v2.0',
      status: 'operational',
      health,
      metrics,
      capabilities: [
        'workflow_automation',
        'scheduled_automation',
        'self_healing',
        'predictive_maintenance',
        'automated_scaling',
        'intelligent_alerting',
        'autonomous_optimization',
        'automation_policies',
        'health_monitoring',
      ],
      automationTypes: [
        'system_administration',
        'performance_optimization',
        'security_management',
        'compliance_automation',
        'resource_management',
        'incident_response',
        'deployment_automation',
        'monitoring_automation',
      ],
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Advanced Automation GET error:', error);
    return NextResponse.json(
      { error: 'Service unavailable', message: error.message },
      { status: 503 }
    );
  }
}