/**
 * OptiMind AI Ecosystem - Advanced Compliance API v2.0
 * Premium Diamond Grade Compliance Reporting and Audit Trail System
 */

import { NextResponse } from 'next/server';
import { complianceV2 } from '@/lib/v2/compliance';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { operation, ...params } = body;

    let result;

    switch (operation) {
      case 'generate_compliance_report':
        result = await complianceV2.generateComplianceReport(params.framework, params.period);
        break;

      case 'audit_trail_analysis':
        result = await complianceV2.auditTrailAnalysis(params.timeRange, params.filters);
        break;

      case 'compliance_check':
        result = await complianceV2.complianceCheck(params.framework, params.scope);
        break;

      case 'risk_assessment':
        result = await complianceV2.riskAssessment(params.assessmentType);
        break;

      case 'policy_violation_detection':
        result = await complianceV2.policyViolationDetection(params.policies);
        break;

      case 'automated_compliance_monitoring':
        result = await complianceV2.automatedComplianceMonitoring(params.config);
        break;

      case 'compliance_documentation':
        result = await complianceV2.generateComplianceDocumentation(params.type);
        break;

      case 'regulatory_update_monitoring':
        result = await complianceV2.regulatoryUpdateMonitoring(params.regions);
        break;

      case 'compliance_training':
        result = await complianceV2.complianceTraining(params.trainingType);
        break;

      case 'get_compliance_metrics':
        result = complianceV2.getComplianceMetrics();
        break;

      case 'health_check':
        result = await complianceV2.healthCheck();
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
    console.error('Compliance API error:', error);
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
    const health = await complianceV2.healthCheck();
    const metrics = complianceV2.getComplianceMetrics();

    return NextResponse.json({
      service: 'Advanced Compliance v2.0',
      status: 'operational',
      health,
      metrics,
      capabilities: [
        'compliance_reporting',
        'audit_trail_analysis',
        'compliance_monitoring',
        'risk_assessment',
        'policy_violation_detection',
        'automated_monitoring',
        'documentation_generation',
        'regulatory_monitoring',
        'compliance_training',
      ],
      supportedFrameworks: [
        'SOC2',
        'ISO27001',
        'GDPR',
        'HIPAA',
        'PCI_DSS',
        'CCPA',
        'SOX',
      ],
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Compliance GET error:', error);
    return NextResponse.json(
      { error: 'Service unavailable', message: error.message },
      { status: 503 }
    );
  }
}