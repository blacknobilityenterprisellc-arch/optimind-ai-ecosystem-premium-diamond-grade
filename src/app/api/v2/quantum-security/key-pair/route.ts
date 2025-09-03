/**
 * OptiMind AI Ecosystem - Quantum Security API v2.0
 * Premium Diamond Grade Quantum-Resistant Security Endpoints
 * 
 * Generate quantum-secure key pairs for users
 */

import { NextRequest, NextResponse } from 'next/server';
import { quantumSecurityService } from '@/lib/v2/quantum-security-service';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Generate quantum key pair
    const keyPair = await quantumSecurityService.generateUserKeyPair(userId);

    return NextResponse.json({
      success: true,
      data: {
        keyId: keyPair.keyId,
        publicKey: keyPair.publicKey,
        createdAt: keyPair.createdAt,
        expiresAt: keyPair.expiresAt
      },
      message: 'Quantum key pair generated successfully'
    });

  } catch (error) {
    console.error('Quantum key pair generation failed:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate quantum key pair',
        details: error.message 
      },
      { status: 500 }
    );
  }
}