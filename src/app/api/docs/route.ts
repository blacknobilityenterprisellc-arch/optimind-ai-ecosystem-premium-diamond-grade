
// Simplified OpenAPI Specification for OptiMind AI Ecosystem
const openApiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'OptiMind AI Ecosystem API',
    version: '1.0.0',
    description: 'Enterprise-grade AI ecosystem with 45+ AI models and comprehensive services',
    contact: {
      name: 'OptiMind AI Ecosystem Team',
      email: 'support@optimind.ai',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server',
    },
  ],
  paths: {
    '/api/health': {
      get: {
        summary: 'System Health Check',
        description: 'Get comprehensive system health status and metrics',
        tags: ['System'],
        responses: {
          '200': {
            description: 'System health status',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'healthy' },
                    timestamp: { type: 'string' },
                    uptime: { type: 'string', example: '99.9%' },
                    responseTime: { type: 'number', example: 98 },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/users': {
      get: {
        summary: 'Get Users',
        description: 'Retrieve a list of all users with pagination',
        tags: ['Users'],
        responses: {
          '200': {
            description: 'List of users',
          },
        },
      },
    },
    '/api/glm-orchestrator': {
      get: {
        summary: 'GLM Orchestrator Status',
        description: 'Get GLM-4.5 orchestrator status and configuration',
        tags: ['AI Orchestrator'],
        responses: {
          '200': {
            description: 'GLM orchestrator status',
          },
        },
      },
    },
  },
  tags: [
    {
      name: 'System',
      description: 'System health and monitoring endpoints',
    },
    {
      name: 'Users',
      description: 'User management endpoints',
    },
    {
      name: 'AI Orchestrator',
      description: 'AI model orchestration and management',
    },
  ],
};

export async function GET() {
  try {
    // Add CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, { status: 200, headers: corsHeaders });
    }

    return NextResponse.json(openApiSpec, { headers: corsHeaders });
  } catch (error) {
    console.error('Error generating OpenAPI spec:', error);
    return NextResponse.json(
      { error: 'Failed to generate OpenAPI specification' },
      { status: 500 }
    );
  }
}