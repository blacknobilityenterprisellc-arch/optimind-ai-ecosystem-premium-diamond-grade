/**
 * OptiMind AI Ecosystem - Quantum Security API v2.0
 * Premium Diamond Grade Quantum-Resistant Security Endpoints
 *
 * Decrypt quantum-secure data
 */

import { NextRequest, NextResponse } from 'next/server';

import { quantumSecurityService } from '@/lib/v2/quantum-security-service';

export async function POST(request: NextRequest) {
  try {
    const { secureMessage, userId } = await request.json();

    if (!secureMessage || !userId) {
      return NextResponse.json(
        { error: 'Secure message and user ID are required' },
        { status: 400 }
      );
    }

    const { ciphertext, iv, tag, algorithm, keyId, timestamp } = secureMessage;

    if (!ciphertext || !iv || !tag || !algorithm || !keyId) {
      return NextResponse.json({ error: 'Invalid secure message format' }, { status: 400 });
    }

    // Decrypt quantum-secure data
    const decrypted = await quantumSecurityService.decryptData(secureMessage, userId);

    return NextResponse.json({
      success: true,
      data: {
        plaintext: decrypted,
        originalTimestamp: timestamp,
      },
      message: 'Quantum-secure data decrypted successfully',
    });
  } catch (error) {
    console.error('Quantum decryption failed:', error);
    return NextResponse.json(
      {
        error: 'Failed to decrypt quantum-secure data',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
