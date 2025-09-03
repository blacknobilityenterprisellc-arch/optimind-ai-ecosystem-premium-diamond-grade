/**
 * OptiMind AI Ecosystem - MCP Integration API v2.0
 * Premium Diamond Grade Model Context Protocol Endpoints
 */

import { NextRequest, NextResponse } from 'next/server';

import { mcpIntegrationV2 } from '@/lib/v2/mcp-integration';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { operation, ...params } = body;

    let result;

    switch (operation) {
      case 'create_context':
        result = await mcpIntegrationV2.createContext(
          params.sessionId,
          params.userId,
          params.data,
          params.metadata
        );
        break;

      case 'get_context':
        result = await mcpIntegrationV2.getContext(params.contextId);
        break;

      case 'update_context':
        result = await mcpIntegrationV2.updateContext(
          params.contextId,
          params.data,
          params.metadata
        );
        break;

      case 'delete_context':
        result = await mcpIntegrationV2.deleteContext(params.contextId);
        break;

      case 'send_message':
        result = await mcpIntegrationV2.sendMessage(params.message);
        break;

      case 'connect_model':
        result = await mcpIntegrationV2.connectModel(params.modelId);
        break;

      case 'disconnect_model':
        result = await mcpIntegrationV2.disconnectModel(params.connectionId);
        break;

      case 'share_context':
        result = await mcpIntegrationV2.shareContext(
          params.contextId,
          params.targetModels
        );
        break;

      case 'get_stats':
        result = mcpIntegrationV2.getStats();
        break;

      case 'get_protocol':
        result = mcpIntegrationV2.getProtocol();
        break;

      case 'get_active_connections':
        result = mcpIntegrationV2.getActiveConnections();
        break;

      case 'get_recent_messages':
        result = mcpIntegrationV2.getRecentMessages(params.limit);
        break;

      default:
        return NextResponse.json(
          { error: 'Unsupported operation', operation },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      operation,
      result,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('MCP Integration API error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error.message,
        operation: body.operation
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const stats = mcpIntegrationV2.getStats();
    const protocol = mcpIntegrationV2.getProtocol();
    const activeConnections = mcpIntegrationV2.getActiveConnections();

    return NextResponse.json({
      service: 'MCP Integration v2.0',
      status: 'operational',
      stats,
      protocol,
      activeConnections,
      capabilities: [
        'context_management',
        'message_routing',
        'model_connection',
        'context_sharing',
        'real_time_synchronization',
        'quantum_encryption',
        'persistence'
      ],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('MCP Integration GET error:', error);
    return NextResponse.json(
      { error: 'Service unavailable', message: error.message },
      { status: 503 }
    );
  }
}