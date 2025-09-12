import { EnhancedError } from '@/lib/error-handler';
import type { Request } from 'next/server';
import { NextResponse } from 'next/server';
import { withRateLimit, standardRateLimit } from '@/lib/api-rate-limit-middleware';
import { db } from '@/lib/db';

// Apply rate limiting to GET endpoint
export const GET = withRateLimit(async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number.parseInt(searchParams.get('page') || '1');
    const limit = Number.parseInt(searchParams.get('limit') || '10');

    // Get real users from database
    const users = await db.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: (page - 1) * limit,
    });

    const total = await db.user.count();

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: unknown) {
    console.error('Users API error:', error);
    return NextResponse.json({ error: (error as Error).message || 'Internal server error' }, { status: 500 });
  }
}, standardRateLimit);

// Apply stricter rate limiting to POST endpoint (user creation)
export const POST = withRateLimit(async (request: Request) => {
  try {
    const body = await request.json();
    const { email, name, role } = body;

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 });
    }

    const newUser = await db.user.create({
      data: {
        email,
        name,
        role: role || 'USER',
      },
    });

    return NextResponse.json(newUser);
  } catch (error: unknown) {
    console.error('User creation error:', error);
    return NextResponse.json({ error: (error as Error).message || 'Failed to create user' }, { status: 500 });
  }
}, standardRateLimit);