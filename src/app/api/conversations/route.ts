<<<<<<< HEAD
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const projectId = searchParams.get('projectId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const skip = (page - 1) * limit

    const where: any = {}
    if (userId) where.userId = userId
    if (projectId) where.projectId = projectId

    const [conversations, total] = await Promise.all([
      db.conversation.findMany({
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
          project: {
            select: {
              id: true,
              name: true
            }
          },
          _count: {
            select: {
              messages: true,
              images: true,
              searches: true
            }
          }
        },
        orderBy: { updatedAt: 'desc' },
        skip,
        take: limit
      }),
      db.conversation.count({ where })
    ])

    return NextResponse.json({
      conversations,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error: any) {
    console.error('Get conversations error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
=======
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      message: 'Conversations API endpoint',
      status: 'operational',
      endpoints: ['list', 'create', 'update', 'delete', 'export']
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
>>>>>>> c358f87d910e205477b71ec74630ccafe0f3c33d
  }
}

export async function POST(request: NextRequest) {
  try {
<<<<<<< HEAD
    const { title, userId, projectId, model = 'gpt-4' } = await request.json()

    if (!title || !userId) {
      return NextResponse.json(
        { error: 'Title and userId are required' },
        { status: 400 }
      )
    }

    const conversation = await db.conversation.create({
      data: {
        title,
        userId,
        projectId,
        model
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        project: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    return NextResponse.json(conversation, { status: 201 })
  } catch (error: any) {
    console.error('Create conversation error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
=======
    const body = await request.json();
    return NextResponse.json({
      message: 'Conversation operation completed',
      data: body
    });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
>>>>>>> c358f87d910e205477b71ec74630ccafe0f3c33d
  }
}