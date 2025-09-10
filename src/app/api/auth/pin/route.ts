import crypto from 'crypto';
import { NextResponse, NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { withRateLimit, authRateLimiter } from '@/lib/ai-rate-limiter';
import { withValidation, ValidationSchemas } from '@/lib/input-validation';

// Apply strict rate limiting and validation for auth
const rateLimitMiddleware = withRateLimit(authRateLimiter);
const validationMiddleware = withValidation(ValidationSchemas.Auth.PIN);

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting first
    const rateLimitResult = await rateLimitMiddleware(request);
    if (rateLimitResult) {
      return rateLimitResult;
    }

    // Apply input validation
    const validationResult = await validationMiddleware(request);
    if (!validationResult.success) {
      return validationResult.response!;
    }

    const { pin } = validationResult.data!;

    // Get stored PIN hash from database
    const securitySettings = await db.securitySettings.findUnique({
      where: { id: 'main' },
    });

    let isValid = false;

    if (securitySettings) {
      const { pin_hash, salt } = securitySettings;

      // Hash the provided PIN with the stored salt
      const hashedPin = crypto.pbkdf2Sync(pin, salt, 1000, 64, 'sha512').toString('hex');

      isValid = hashedPin === pin_hash;
    } else {
      // For demo purposes, create a default PIN if none exists
      // In production, this should be handled during setup
      const salt2 = crypto.randomBytes(16).toString('hex');
      const defaultPin = '1234'; // Only for initial setup
      const hashedPin2 = crypto.pbkdf2Sync(defaultPin, salt2, 1000, 64, 'sha512').toString('hex');

      await db.securitySettings.create({
        data: {
          id: 'main',
          pin_hash: hashedPin2,
          salt: salt2,
        },
      });

      isValid = pin === defaultPin;
    }

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid PIN' }, { status: 401 });
    }

    // Generate session token
    const now = Date.now();
    const sessionToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(now + 24 * 60 * 60 * 1000); // 24 hours

    // Store session in database
    await db.session.create({
      data: {
        token: sessionToken,
        expires_at: expiresAt,
        created_at: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      sessionToken,
      expiresAt: expiresAt.toISOString(),
    });
  } catch (error) {
    console.error('PIN validation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Invalid authorization header' }, { status: 401 });
    }

    const sessionToken = authHeader.slice(7);

    // Delete session from database
    await db.session.delete({
      where: { token: sessionToken },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Session deletion error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
