import { EnhancedError } from '@/lib/error-handler';
import type { Request } from 'next/server';
import { NextResponse } from 'next/server';
import { withRateLimit, standardRateLimit } from '@/lib/api-rate-limit-middleware';

// Apply rate limiting to GET endpoint
export const GET = withRateLimit(async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number.parseInt(searchParams.get('page') || '1');
    const limit = Number.parseInt(searchParams.get('limit') || '10');

    // Mock users data
    const users = [
      {
        id: '1',
        email: 'admin@optimind.ai',
        name: 'Admin User',
        role: 'ADMIN',
        isActive: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        email: 'user@example.com',
        name: 'Test User',
        role: 'USER',
        isActive: true,
        createdAt: new Date().toISOString(),
      },
    ];

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total: users.length,
        totalPages: Math.ceil(users.length / limit),
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

    const newUser = {
      id: Math.random().toString(36).slice(2, 11),
      email,
      name,
      role: role || 'USER',
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(newUser);
  } catch (error: unknown) {
    console.error('User creation error:', error);
    return NextResponse.json({ error: (error as Error).message || 'Failed to create user' }, { status: 500 });
  }
}, standardRateLimit);