import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const days = Number.parseInt(searchParams.get('days') || '30');

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Build where clause for user-specific or global analytics
    const userWhere = userId ? { userId } : {};
    const conversationWhere = userId ? { userId } : {};
    const imageWhere = userId ? { userId } : {};
    const searchWhere = userId ? { userId } : {};

    // Get basic counts
    const [
      totalUsers,
      totalConversations,
      totalMessages,
      totalImages,
      totalSearches,
      totalProjects,
    ] = await Promise.all([
      db.user.count({ where: userId ? { id: userId } : {} }),
      db.conversation.count({ where: conversationWhere }),
      db.message.count({
        where: {
          conversation: conversationWhere,
          createdAt: { gte: startDate },
        },
      }),
      db.generatedImage.count({ where: imageWhere }),
      db.webSearch.count({ where: searchWhere }),
      db.project.count({ where: userWhere }),
    ]);

    // Get daily stats for the time period
    const dailyStats = (await db.$queryRaw`
      SELECT 
        DATE(createdAt) as date,
        COUNT(*) as conversations
      FROM Conversation 
      WHERE ${userId ? `userId = ${userId} AND` : ''} createdAt >= ${startDate}
      GROUP BY DATE(createdAt)
      ORDER BY date ASC
    `) as Array<{ date: string; conversations: number }>;

    // Get tool usage stats
    const toolUsage = await db.toolUsage.groupBy({
      by: ['toolName'],
      where: {
        ...userWhere,
        createdAt: { gte: startDate },
      },
      _count: {
        toolName: true,
      },
      orderBy: {
        _count: {
          toolName: 'desc',
        },
      },
    });

    // Get user activity (if userId is provided)
    let userActivity = null;
    if (userId) {
      userActivity = await db.conversation.findMany({
        where: {
          userId,
          createdAt: { gte: startDate },
        },
        select: {
          id: true,
          title: true,
          createdAt: true,
          _count: {
            select: {
              messages: true,
              images: true,
              searches: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      });
    }

    // Get system health metrics
    const systemHealth = {
      activeUsers: await db.user.count({
        where: {
          status: 'ACTIVE',
          createdAt: { gte: startDate },
        },
      }),
      totalApiCalls: totalMessages + totalImages + totalSearches,
      successRate: 98.5, // This would be calculated from actual error logs
    };

    return NextResponse.json({
      overview: {
        totalUsers,
        totalConversations,
        totalMessages,
        totalImages,
        totalSearches,
        totalProjects,
      },
      dailyStats,
      toolUsage,
      userActivity,
      systemHealth,
      period: {
        days,
        startDate,
        endDate: new Date(),
      },
    });
  } catch (error: any) {
    console.error('Get analytics error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
