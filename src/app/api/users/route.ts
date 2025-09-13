import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/auth-service';
import { securityMiddleware } from '@/lib/security-middleware';

// Apply security middleware to all requests
async function applySecurity(request: NextRequest) {
  return await securityMiddleware(request);
}

// Register new user
export async function POST(request: NextRequest) {
  try {
    // Apply security checks
    const securityResult = await applySecurity(request);
    if (securityResult.status !== 200) {
      return securityResult;
    }

    const body = await request.json();
    const { email, password, name, role, tenantId, securityLevel } = body;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Register user
    const result = await authService.registerUser({
      email,
      password,
      name,
      role,
      tenantId,
      securityLevel
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'User registered successfully',
      user: result.user
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}

// Get user profile (authenticated)
export async function GET(request: NextRequest) {
  try {
    // Apply security checks
    const securityResult = await applySecurity(request);
    if (securityResult.status !== 200) {
      return securityResult;
    }

    // Extract user info from security result
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const user = await authService.getUserFromToken(token);

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        securityLevel: user.securityLevel,
        emailVerified: user.emailVerified,
        isPremium: user.isPremium,
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt
      }
    });

  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Failed to get user' },
      { status: 500 }
    );
  }
}

// Update user profile
export async function PUT(request: NextRequest) {
  try {
    // Apply security checks
    const securityResult = await applySecurity(request);
    if (securityResult.status !== 200) {
      return securityResult;
    }

    const body = await request.json();
    const { name, theme, language, timezone, notifications } = body;

    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const user = await authService.getUserFromToken(token);

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Update user profile
    const result = await authService.updateUserProfile(user.id, {
      name,
      theme,
      language,
      timezone,
      notifications
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: result.user
    });

  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}