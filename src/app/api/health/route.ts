  import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Simulate health data
    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: '99.9%',
      responseTime: 98,
      services: {
        database: 'healthy',
        aiModels: 'healthy',
        api: 'healthy',
        storage: 'healthy'
      },
      alerts: [
        {
          id: "1",
          type: "success",
          title: "System Performance Optimized",
          description: "All systems are running at peak efficiency",
          timestamp: "5 minutes ago"
        },
        {
          id: "2",
          type: "info",
          title: "New Features Available",
          description: "Check out the latest AI optimization tools",
          timestamp: "1 hour ago"
        },
        {
          id: "3",
          type: "warning",
          title: "API Rate Limit Approaching",
          description: "Consider upgrading your plan for higher limits",
          timestamp: "3 hours ago"
        }
      ],
      metrics: {
        cpu: 45,
        memory: 62,
        disk: 78,
        network: 34
      },
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development'
    };

    return NextResponse.json(healthData);
  } catch (error) {
    console.error('Error fetching health data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch health data' },
      { status: 500 }
    );
  }
}