<<<<<<< HEAD
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'UserId is required' },
        { status: 400 }
      )
    }

    let settings = await db.userSettings.findUnique({
      where: { userId }
    })

    // If settings don't exist, create default settings
    if (!settings) {
      settings = await db.userSettings.create({
        data: {
          userId,
          theme: 'LIGHT',
          language: 'en',
          timezone: 'UTC',
          notificationsEnabled: true,
          emailNotifications: true
        }
      })
    }

    return NextResponse.json(settings)
  } catch (error: any) {
    console.error('Get settings error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, theme, language, timezone, notificationsEnabled, emailNotifications } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { error: 'UserId is required' },
        { status: 400 }
      )
    }

    // Check if settings exist, if not create new, otherwise update
    const existingSettings = await db.userSettings.findUnique({
      where: { userId }
    })

    let settings
    if (existingSettings) {
      settings = await db.userSettings.update({
        where: { userId },
        data: {
          ...(theme !== undefined && { theme }),
          ...(language !== undefined && { language }),
          ...(timezone !== undefined && { timezone }),
          ...(notificationsEnabled !== undefined && { notificationsEnabled }),
          ...(emailNotifications !== undefined && { emailNotifications })
        }
      })
    } else {
      settings = await db.userSettings.create({
        data: {
          userId,
          theme: theme || 'LIGHT',
          language: language || 'en',
          timezone: timezone || 'UTC',
          notificationsEnabled: notificationsEnabled !== undefined ? notificationsEnabled : true,
          emailNotifications: emailNotifications !== undefined ? emailNotifications : true
        }
      })
    }

    return NextResponse.json(settings)
  } catch (error: any) {
    console.error('Update settings error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
=======
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // TODO: Implement settings retrieval
    return NextResponse.json({
      settings: {},
      message: 'Settings endpoint - implementation pending'
    });
  } catch (error) {
    console.error('Settings error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { settings } = body;
    
    // TODO: Implement settings update
    return NextResponse.json({
      settings,
      message: 'Settings updated successfully'
    });
  } catch (error) {
    console.error('Settings update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
>>>>>>> c358f87d910e205477b71ec74630ccafe0f3c33d
  }
}