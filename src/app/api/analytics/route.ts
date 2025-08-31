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
  }
}