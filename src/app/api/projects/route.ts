import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Mock projects data
    const projects = [
      {
        id: '1',
        name: 'Content Optimization Project',
        description: 'AI-powered content optimization',
        status: 'active',
        createdAt: new Date().toISOString(),
        progress: 75
      },
      {
        id: '2',
        name: 'Image Analysis Project',
        description: 'Multi-model image analysis',
        status: 'active',
        createdAt: new Date().toISOString(),
        progress: 45
      }
    ];

    return NextResponse.json({ projects });
  } catch (error: any) {
    console.error('Projects API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description } = body;

    const newProject = {
      id: Math.random().toString(36).slice(2, 11),
      name,
      description,
      status: 'active',
      createdAt: new Date().toISOString(),
      progress: 0
    };

    return NextResponse.json(newProject);
  } catch (error: any) {
    console.error('Project creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create project' },
      { status: 500 }
    );
  }
}