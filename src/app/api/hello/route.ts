import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name') || 'World';
    
    // Simulate some processing time
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const response = {
      message: `Hello, ${name}!`,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      features: [
        'Next.js 15',
        'TypeScript 5',
        'Tailwind CSS 4',
        'shadcn/ui',
        'Prisma ORM',
        'NextAuth.js',
        'Socket.io',
        'Zustand',
        'TanStack Query'
      ],
      stats: {
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        version: process.version
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, message } = body;

    if (!name || !message) {
      return NextResponse.json(
        { error: 'Name and message are required' },
        { status: 400 }
      );
    }

    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 300));

    const response = {
      success: true,
      data: {
        id: Math.random().toString(36).slice(2, 11),
        name,
        message,
        timestamp: new Date().toISOString(),
        processed: true
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}