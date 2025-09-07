/**
 * OptiMind AI Ecosystem - Quantum Key Management API v2.0
 * Premium Diamond Grade Quantum Key Management Endpoints
 */

import { NextRequest, NextResponse } from 'next/server';

import {
  quantumSecurityServiceV2,
  type QuantumKeyManagementRequest,
} from '@/lib/v2/quantum-security-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...params } = body;

    // Validate required fields
    if (!action) {
      return NextResponse.json({ error: 'Action is required' }, { status: 400 });
    }

    if (!params.userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Execute key management operation
    const keyRequest: QuantumKeyManagementRequest = {
      action,
      ...params,
    };

    const result = await quantumSecurityServiceV2.manageKeys(keyRequest);

    return NextResponse.json(result);
  } catch (error) {
    console.error('❌ Quantum Key Management API Error:', error);

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

    // List user's quantum keys
    const result = await quantumSecurityServiceV2.manageKeys({
      userId,
      action: 'list',
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('❌ Quantum Key Management API Error:', error);

    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
