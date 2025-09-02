import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const skip = (page - 1) * limit

    const where: any = {}
    if (userId) where.userId = userId

    const [projects, total] = await Promise.all([
      db.project.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true
            }
          },
          _count: {
            select: {
              conversations: true
            }
          }
        },
        orderBy: { updatedAt: 'desc' },
        skip,
        take: limit
      }),
      db.project.count({ where })
    ])

    return NextResponse.json({
      projects,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error: any) {
    console.error('Get projects error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Projects retrieval logic here
    return NextResponse.json({ 
      message: 'Projects retrieved',
      data: [],
      status: 'success' 
    });
  } catch (error) {
    return NextResponse.json({ 
      error: 'Failed to retrieve projects',
      status: 'error' 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, description, userId } = await request.json()

    if (!name || !userId) {
      return NextResponse.json(
        { error: 'Name and userId are required' },
        { status: 400 }
      )
    }

    const project = await db.project.create({
      data: {
        name,
        description,
        userId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        }
      }
    })

    return NextResponse.json(project, { status: 201 })
  } catch (error: any) {
    console.error('Create project error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
    const body = await request.json();
    const { project } = body;
    
    // Project creation logic here
    const createdProject = {
      id: Date.now().toString(),
      ...project,
      createdAt: new Date().toISOString()
    };
    
    return NextResponse.json({ 
      message: 'Project created',
      data: createdProject,
      status: 'success' 
    });
  } catch (error) {
    return NextResponse.json({ 
      error: 'Failed to create project',
      status: 'error' 
    }, { status: 500 });
  }
}