/**
 * OptiMind AI Ecosystem - Quantum Security API v2.0
 * Premium Diamond Grade Quantum-Resistant Security Endpoints
 * 
 * Encrypt data with quantum-resistant cryptography
 */

import { NextRequest, NextResponse } from 'next/server';
import { quantumSecurityService } from '@/lib/v2/quantum-security-service';

export async function POST(request: NextRequest) {
  try {
    const { data, userId, resourceId } = await request.json();

    if (!data || !userId) {
      return NextResponse.json(
        { error: 'Data and user ID are required' },
        { status: 400 }
      );
    }

    // Encrypt data with quantum security
    const secureMessage = await quantumSecurityService.encryptData(data, userId, resourceId);

    return NextResponse.json({
      success: true,
      data: {
        ciphertext: secureMessage.ciphertext,
        iv: secureMessage.iv,
        tag: secureMessage.tag,
        algorithm: secureMessage.algorithm,
        keyId: secureMessage.keyId,
        timestamp: secureMessage.timestamp
      },
      message: 'Data encrypted with quantum security successfully'
    });

  } catch (error) {
    console.error('Quantum encryption failed:', error);
    return NextResponse.json(
      { 
        error: 'Failed to encrypt data with quantum security',
        details: error.message 
      },
      { status: 500 }
    );
  }
}