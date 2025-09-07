import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
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
  } catch (error: any) {
    console.error('Users API error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
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
  } catch (error: any) {
    console.error('User creation error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create user' }, { status: 500 });
  }
}
