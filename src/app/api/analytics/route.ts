<<<<<<< HEAD
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const days = parseInt(searchParams.get('days') || '30')

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Build where clause for user-specific or global analytics
    const userWhere = userId ? { userId } : {}
    const conversationWhere = userId ? { userId } : {}
    const imageWhere = userId ? { userId } : {}
    const searchWhere = userId ? { userId } : {}

    // Get basic counts
    const [
      totalUsers,
      totalConversations,
      totalMessages,
      totalImages,
      totalSearches,
      totalProjects
    ] = await Promise.all([
      db.user.count({ where: userId ? { id: userId } : {} }),
      db.conversation.count({ where: conversationWhere }),
      db.message.count({
        where: {
          conversation: conversationWhere,
          createdAt: { gte: startDate }
        }
      }),
      db.generatedImage.count({ where: imageWhere }),
      db.webSearch.count({ where: searchWhere }),
      db.project.count({ where: userWhere })
    ])

    // Get daily stats for the time period
    const dailyStats = await db.$queryRaw`
      SELECT 
        DATE(createdAt) as date,
        COUNT(*) as conversations
      FROM Conversation 
      WHERE ${userId ? `userId = ${userId} AND` : ''} createdAt >= ${startDate}
      GROUP BY DATE(createdAt)
      ORDER BY date ASC
    ` as Array<{ date: string; conversations: number }>

    // Get tool usage stats
    const toolUsage = await db.toolUsage.groupBy({
      by: ['toolName'],
      where: {
        ...userWhere,
        createdAt: { gte: startDate }
      },
      _count: {
        toolName: true
      },
      orderBy: {
        _count: {
          toolName: 'desc'
        }
      }
    })

    // Get user activity (if userId is provided)
    let userActivity = null
    if (userId) {
      userActivity = await db.conversation.findMany({
        where: {
          userId,
          createdAt: { gte: startDate }
        },
        select: {
          id: true,
          title: true,
          createdAt: true,
          _count: {
            select: {
              messages: true,
              images: true,
              searches: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      })
    }

    // Get system health metrics
    const systemHealth = {
      activeUsers: await db.user.count({
        where: {
          status: 'ACTIVE',
          createdAt: { gte: startDate }
        }
      }),
      totalApiCalls: totalMessages + totalImages + totalSearches,
      successRate: 98.5 // This would be calculated from actual error logs
    }

    return NextResponse.json({
      overview: {
        totalUsers,
        totalConversations,
        totalMessages,
        totalImages,
        totalSearches,
        totalProjects
      },
      dailyStats,
      toolUsage,
      userActivity,
      systemHealth,
      period: {
        days,
        startDate,
        endDate: new Date()
      }
    })
  } catch (error: any) {
    console.error('Get analytics error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
=======
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Simulate analytics data
    const analyticsData = {
      totalContent: 1247,
      avgOptimizationScore: 87,
      activeProjects: 23,
      systemHealth: 96,
      recentActivity: [
        {
          id: "1",
          type: "content",
          title: "AI Content Generation Completed",
          timestamp: "2 minutes ago",
          status: "success"
        },
        {
          id: "2",
          type: "optimization",
          title: "SEO Analysis Updated",
          timestamp: "15 minutes ago",
          status: "success"
        },
        {
          id: "3",
          type: "research",
          title: "Multi-Model Analysis Started",
          timestamp: "1 hour ago",
          status: "in_progress"
        },
        {
          id: "4",
          type: "system",
          title: "System Maintenance Scheduled",
          timestamp: "2 hours ago",
          status: "info"
        }
      ],
      performanceMetrics: {
        contentGeneration: {
          total: 1247,
          thisMonth: 156,
          growth: 12.5
        },
        optimization: {
          avgScore: 87,
          improvement: 5.2,
          projects: 23
        },
        system: {
          uptime: 99.9,
          responseTime: 98,
          health: 96
        }
      },
      aiCapabilities: [
        {
          id: "content",
          title: "AI Content & Creation",
          usage: 247,
          growth: 15.2
        },
        {
          id: "optimization",
          title: "AI Optimization",
          usage: 189,
          growth: 8.7
        },
        {
          id: "research",
          title: "AI Research & Analysis",
          usage: 847,
          growth: 22.1
        },
        {
          id: "image",
          title: "AI Image Generation",
          usage: 1200,
          growth: 18.9
        },
        {
          id: "voice",
          title: "AI Voice & Audio",
          usage: 342,
          growth: 12.3
        },
        {
          id: "video",
          title: "AI Video Creation",
          usage: 89,
          growth: 25.6
        },
        {
          id: "code",
          title: "AI Code Generation",
          usage: 15000,
          growth: 31.4
        },
        {
          id: "chat",
          title: "AI Chat & Conversations",
          usage: 2300,
          growth: 19.8
        },
        {
          id: "design",
          title: "AI Design & Creative",
          usage: 156,
          growth: 14.2
        }
      ]
    };

    return NextResponse.json(analyticsData);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
>>>>>>> c358f87d910e205477b71ec74630ccafe0f3c33d
  }
}