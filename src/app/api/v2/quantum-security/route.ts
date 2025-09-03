/**
 * OptiMind AI Ecosystem - Quantum Security API v2.0
 * Premium Diamond Grade Quantum Security Endpoints
 */

import { NextRequest, NextResponse } from 'next/server';
import { quantumSecurityServiceV2, type QuantumSecurityRequest, type QuantumKeyManagementRequest } from '@/lib/v2/quantum-security-service';

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

    // Execute quantum security operation
    const securityRequest: QuantumSecurityRequest = {
      operation,
      ...params
    };

    const result = await quantumSecurityServiceV2.executeOperation(securityRequest);

    return NextResponse.json(result);

  } catch (error) {
    console.error('❌ Quantum Security API Error:', error);
    
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
    const limit = parseInt(searchParams.get('limit') || '100');

    // Handle different GET operations
    if (operation === 'audit') {
      if (!userId) {
        return NextResponse.json(
          { error: 'User ID is required for audit log' },
          { status: 400 }
        );
      }

      const auditResult = await quantumSecurityServiceV2.getAuditLog(userId, limit);
      return NextResponse.json(auditResult);
    }

    if (operation === 'metrics') {
      const metricsResult = await quantumSecurityServiceV2.getSecurityMetrics(userId || undefined);
      return NextResponse.json(metricsResult);
    }

    if (operation === 'health') {
      const healthResult = await quantumSecurityServiceV2.healthCheck();
      return NextResponse.json(healthResult);
    }

    return NextResponse.json(
      { error: 'Invalid operation. Use: audit, metrics, or health' },
      { status: 400 }
    );

  } catch (error) {
    console.error('❌ Quantum Security API Error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error.message 
      },
      { status: 500 }
    );
  }
}