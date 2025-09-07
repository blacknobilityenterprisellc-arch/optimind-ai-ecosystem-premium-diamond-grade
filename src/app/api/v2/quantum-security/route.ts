/**
 * OptiMind AI Ecosystem - Quantum Security API v2.0
 * Premium Diamond Grade Quantum-Resistant Security Endpoints
 */

import { NextRequest, NextResponse } from 'next/server';

import { quantumSecurityV2 } from '@/lib/v2/quantum-security';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { operation, ...params } = body;

    let result;

    switch (operation) {
      case 'generate_key_pair':
        result = await quantumSecurityV2.generateQuantumKeyPair(
          params.userId || 'anonymous',
          params.expiresInSeconds || 86400
        );
        break;

      case 'encrypt':
        result = await quantumSecurityV2.encryptQuantumSecure(
          params.data,
          params.keyId,
          params.userId || 'anonymous'
        );
        break;

      case 'decrypt':
        result = await quantumSecurityV2.decryptQuantumSecure(
          params.secureMessage,
          params.userId || 'anonymous'
        );
        break;

      case 'quantum_hash':
        result = await quantumSecurityV2.quantumHash(params.data, params.salt);
        break;

      case 'quantum_sign':
        result = await quantumSecurityV2.quantumSign(
          params.data,
          params.keyId,
          params.userId || 'anonymous'
        );
        break;

      case 'verify_signature':
        result = await quantumSecurityV2.quantumVerifySignature(
          params.data,
          params.signature,
          params.keyId,
          params.userId || 'anonymous'
        );
        break;

      case 'key_exchange':
        result = await quantumSecurityV2.quantumKeyExchange(params.userId || 'anonymous');
        break;

      case 'health_check':
        result = await quantumSecurityV2.healthCheck();
        break;

      case 'get_metrics':
        result = quantumSecurityV2.getSecurityMetrics();
        break;

      case 'get_audit_log':
        result = quantumSecurityV2.getAuditLog(params.userId);
        break;

      case 'cleanup_expired_keys':
        quantumSecurityV2.cleanupExpiredKeys();
        result = { message: 'Expired keys cleaned up successfully' };
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
    console.error('Quantum Security API error:', error);
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
    const health = await quantumSecurityV2.healthCheck();
    const metrics = quantumSecurityV2.getSecurityMetrics();

    return NextResponse.json({
      service: 'Quantum Security v2.0',
      status: 'operational',
      health,
      metrics,
      capabilities: [
        'quantum_key_generation',
        'quantum_encryption',
        'quantum_decryption',
        'quantum_hashing',
        'quantum_signing',
        'quantum_verification',
        'quantum_key_exchange',
        'security_audit',
      ],
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Quantum Security GET error:', error);
    return NextResponse.json(
      { error: 'Service unavailable', message: error.message },
      { status: 503 }
    );
  }
}
