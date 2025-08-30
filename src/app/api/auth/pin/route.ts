import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import crypto from 'crypto';

// Rate limiting in memory (in production, use Redis or similar)
const rateLimit = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 5 * 60 * 1000; // 5 minutes
const MAX_ATTEMPTS = 5;

export async function POST(request: NextRequest) {
  try {
    const { pin } = await request.json();
    
    if (!pin || typeof pin !== 'string' || pin.length !== 4) {
      return NextResponse.json(
        { error: 'Invalid PIN format' },
        { status: 400 }
      );
    }

    // Get client IP for rate limiting
    const forwarded = request.headers.get('x-forwarded-for');
    const clientIP = forwarded ? forwarded.split(',')[0] : 'unknown';
    
    // Check rate limit
    const now = Date.now();
    const userLimit = rateLimit.get(clientIP);
    
    if (userLimit && userLimit.count >= MAX_ATTEMPTS) {
      if (now < userLimit.resetTime) {
        return NextResponse.json(
          { error: 'Too many attempts. Please try again later.' },
          { status: 429 }
        );
      } else {
        // Reset rate limit
        rateLimit.delete(clientIP);
      }
    }

    // Get stored PIN hash from database
    const securitySettings = await db.securitySettings.findUnique({
      where: { id: 'main' }
    });

    let isValid = false;
    
    if (securitySettings) {
      const { pin_hash, salt } = securitySettings;
      
      // Hash the provided PIN with the stored salt
      const hashedPin = crypto
        .pbkdf2Sync(pin, salt, 1000, 64, 'sha512')
        .toString('hex');
      
      isValid = hashedPin === pin_hash;
    } else {
      // For demo purposes, create a default PIN if none exists
      // In production, this should be handled during setup
      const salt2 = crypto.randomBytes(16).toString('hex');
      const defaultPin = '1234'; // Only for initial setup
      const hashedPin2 = crypto
        .pbkdf2Sync(defaultPin, salt2, 1000, 64, 'sha512')
        .toString('hex');
      
      await db.securitySettings.create({
        data: {
          id: 'main',
          pin_hash: hashedPin2,
          salt: salt2
        }
      });
      
      isValid = pin === defaultPin;
    }

    // Update rate limit
    if (!isValid) {
      const currentLimit = rateLimit.get(clientIP) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW };
      currentLimit.count++;
      rateLimit.set(clientIP, currentLimit);
      
      return NextResponse.json(
        { error: 'Invalid PIN' },
        { status: 401 }
      );
    }

    // Clear rate limit on successful authentication
    rateLimit.delete(clientIP);

    // Generate session token
    const sessionToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(now + 24 * 60 * 60 * 1000); // 24 hours

    // Store session in database
    await db.session.create({
      data: {
        token: sessionToken,
        expires_at: expiresAt,
        created_at: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      sessionToken,
      expiresAt: expiresAt.toISOString()
    });

  } catch (error) {
    console.error('PIN validation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Invalid authorization header' },
        { status: 401 }
      );
    }

    const sessionToken = authHeader.substring(7);
    
    // Delete session from database
    await db.session.delete({
      where: { token: sessionToken }
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Session deletion error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}