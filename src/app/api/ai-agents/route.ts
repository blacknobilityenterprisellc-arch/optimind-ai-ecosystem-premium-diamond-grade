import type { Request } from 'next/server';
/**
 * OptiMind AI Agents API - Enterprise-Grade Agent Management System
 *
 * This endpoint provides comprehensive AI agent management capabilities including
 * agent lifecycle control, task orchestration, collaboration management,
 * and real-time performance monitoring.
 */

import { NextResponse } from 'next/server';
import { aiAgentManager } from '@/lib/ai-agent-management';

// Initialize the agent manager if not already initialized
let isManagerInitialized = false;

async function ensureManagerInitialized() {
  if (!isManagerInitialized) {
    await aiAgentManager.initialize();
    isManagerInitialized = true;
  }
}

export async function GET(request: Request) {
  try {
    await ensureManagerInitialized();
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'system-metrics';

    switch (action) {
      case 'list-agents':
        const agents = aiAgentManager.getAllAgents();
        return NextResponse.json({
          success: true,
          action: 'list-agents',
          data: agents.map(agent => ({
            id: agent.id,
            name: agent.name,
            type: agent.type,
            status: agent.state.status,
            capabilities: agent.capabilities.map(cap => cap.name),
            performance: agent.performance,
            resources: agent.resources,
            intelligence: agent.intelligence,
            tasks: agent.tasks,
            lastActivity: agent.state.lastActivity,
            uptime: agent.state.uptime,
          })),
          timestamp: new Date().toISOString(),
        });

      case 'list-tasks':
        // For now, return mock tasks data
        const tasks = [
          {
            id: 'task-001',
            title: 'System Health Analysis',
            description: 'Comprehensive analysis of system health and performance metrics',
            type: 'analysis' as const,
            priority: 'high' as const,
            status: 'in-progress' as const,
            assignedAgent: 'glm-45-primary',
            progress: 75,
            createdAt: new Date(Date.now() - 3600000),
            startedAt: new Date(Date.now() - 3300000),
            estimatedDuration: 1800000,
            actualDuration: 1650000,
          },
          {
            id: 'task-002',
            title: 'Data Pattern Recognition',
            description: 'Identify patterns in user behavior data and generate insights',
            type: 'analysis' as const,
            priority: 'medium' as const,
            status: 'pending' as const,
            progress: 0,
            createdAt: new Date(Date.now() - 1800000),
            estimatedDuration: 2400000,
          },
          {
            id: 'task-003',
            title: 'Security Vulnerability Scan',
            description: 'Perform comprehensive security scan and vulnerability assessment',
            type: 'security' as const,
            priority: 'critical' as const,
            status: 'assigned' as const,
            assignedAgent: 'gemini-specialist',
            progress: 15,
            createdAt: new Date(Date.now() - 900000),
            startedAt: new Date(Date.now() - 300000),
            estimatedDuration: 3600000,
            actualDuration: 300000,
          },
        ];
        return NextResponse.json({
          success: true,
          action: 'list-tasks',
          data: tasks,
          timestamp: new Date().toISOString(),
        });

      case 'list-collaborations':
        // For now, return mock collaborations data
        const collaborations = [
          {
            id: 'collab-001',
            name: 'Collective Intelligence Network',
            participants: ['glm-45-primary', 'gemini-specialist'],
            type: 'collective-intelligence' as const,
            status: 'active' as const,
            synergy: 0.87,
            efficiency: 0.92,
            emergentProperties: ['enhanced-reasoning', 'cross-domain-insights', 'adaptive-learning'],
            sharedContext: { domain: 'multi-domain-analysis', complexity: 'high' },
            createdAt: new Date(Date.now() - 7200000),
            lastActivity: new Date(),
          },
          {
            id: 'collab-002',
            name: 'Quantum Optimization Team',
            participants: ['quantum-enhanced', 'glm-45-primary'],
            type: 'quantum-entanglement' as const,
            status: 'forming' as const,
            synergy: 0.72,
            efficiency: 0.85,
            emergentProperties: ['quantum-speedup', 'parallel-processing', 'entangled-reasoning'],
            sharedContext: { domain: 'quantum-computing', complexity: 'quantum' },
            createdAt: new Date(Date.now() - 1800000),
            lastActivity: new Date(),
          },
        ];
        return NextResponse.json({
          success: true,
          action: 'list-collaborations',
          data: collaborations,
          timestamp: new Date().toISOString(),
        });

      case 'system-metrics':
        const metrics = aiAgentManager.getSystemMetrics();
        return NextResponse.json({
          success: true,
          action: 'system-metrics',
          data: metrics,
          timestamp: new Date().toISOString(),
        });

      case 'agent-details':
        const agentId = searchParams.get('agentId');
        if (!agentId) {
          return NextResponse.json(
            { success: false, error: 'Agent ID is required' },
            { status: 400 }
          );
        }

        const agent = aiAgentManager.getAgentById(agentId);
        if (!agent) {
          return NextResponse.json(
            { success: false, error: 'Agent not found' },
            { status: 404 }
          );
        }

        return NextResponse.json({
          success: true,
          action: 'agent-details',
          data: agent,
          timestamp: new Date().toISOString(),
        });

      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Unknown action',
            availableActions: [
              'list-agents',
              'list-tasks',
              'list-collaborations',
              'system-metrics',
              'agent-details',
            ],
            timestamp: new Date().toISOString(),
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('AI Agents API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await ensureManagerInitialized();
    const body = await request.json();
    const { action, payload } = body;

    switch (action) {
      case 'create-task':
        // For now, create a mock task and assign it to an available agent
        const newTask = {
          id: `task-${Date.now()}`,
          title: payload.title,
          description: payload.description,
          type: payload.type,
          priority: payload.priority,
          status: 'pending' as const,
          progress: 0,
          createdAt: new Date(),
          estimatedDuration: payload.estimatedDuration || 1800000, // Default 30 minutes
        };

        // Try to assign task to an available agent
        const availableAgents = aiAgentManager.getAvailableAgents();
        if (availableAgents.length > 0) {
          const bestAgent = availableAgents.reduce((best, current) => 
            current.state.cognitiveLoad < best.state.cognitiveLoad ? current : best
          );
          
          if (await aiAgentManager.assignTaskToAgent(bestAgent.id, 0.5)) {
            newTask.assignedAgent = bestAgent.id;
            newTask.status = 'assigned';
          }
        }

        return NextResponse.json({
          success: true,
          action: 'create-task',
          data: newTask,
          message: 'Task created successfully',
          timestamp: new Date().toISOString(),
        });

      case 'control-agent':
        const { agentId, controlAction } = payload;
        const success = await aiAgentManager.controlAgent(agentId, controlAction);
        
        if (!success) {
          return NextResponse.json(
            { success: false, error: 'Failed to control agent' },
            { status: 400 }
          );
        }

        const agent = aiAgentManager.getAgentById(agentId);
        return NextResponse.json({
          success: true,
          action: 'control-agent',
          data: agent,
          message: `Agent ${controlAction}ed successfully`,
          timestamp: new Date().toISOString(),
        });

      case 'create-collaboration':
        const collabId = `collab-${Date.now()}`;
        const newCollaboration = {
          id: collabId,
          name: payload.name || `Collaboration ${Date.now()}`,
          participants: payload.participants || [],
          type: payload.type || 'collective-intelligence',
          status: 'forming' as const,
          synergy: 0.5,
          efficiency: 0.5,
          emergentProperties: [],
          sharedContext: payload.sharedContext || {},
          createdAt: new Date(),
          lastActivity: new Date(),
        };

        // Update participant agents status
        newCollaboration.participants.forEach(participantId => {
          const participant = aiAgentManager.getAgentById(participantId);
          if (participant) {
            participant.state.status = 'collaborating';
          }
        });

        return NextResponse.json({
          success: true,
          action: 'create-collaboration',
          data: newCollaboration,
          message: 'Collaboration created successfully',
          timestamp: new Date().toISOString(),
        });

      case 'update-task-progress':
        const { taskId, progress } = payload;
        
        // For now, this is a mock implementation
        // In a real system, you would update the actual task progress
        const mockTaskUpdate = {
          id: taskId,
          progress: Math.min(100, Math.max(0, progress)),
          status: progress === 100 ? 'completed' : progress > 0 ? 'in-progress' : 'pending',
          completedAt: progress === 100 ? new Date() : undefined,
        };

        // If task is completed, update agent stats
        if (progress === 100) {
          // This would normally find the assigned agent and update its stats
          const agents = aiAgentManager.getAllAgents();
          agents.forEach(agent => {
            if (agent.tasks.active > 0) {
              aiAgentManager.completeTaskForAgent(agent.id, true, 1200);
            }
          });
        }

        return NextResponse.json({
          success: true,
          action: 'update-task-progress',
          data: mockTaskUpdate,
          message: 'Task progress updated successfully',
          timestamp: new Date().toISOString(),
        });

      case 'assign-task':
        const { taskId: assignTaskId, agentId: assignAgentId } = payload;
        const agentToAssign = aiAgentManager.getAgentById(assignAgentId);
        
        if (!agentToAssign) {
          return NextResponse.json(
            { success: false, error: 'Agent not found' },
            { status: 404 }
          );
        }

        const assignSuccess = await aiAgentManager.assignTaskToAgent(assignAgentId, 0.5);
        
        if (!assignSuccess) {
          return NextResponse.json(
            { success: false, error: 'Failed to assign task to agent' },
            { status: 400 }
          );
        }

        return NextResponse.json({
          success: true,
          action: 'assign-task',
          data: {
            taskId: assignTaskId,
            agentId: assignAgentId,
            agentName: agentToAssign.name,
            status: 'assigned'
          },
          message: `Task assigned to ${agentToAssign.name}`,
          timestamp: new Date().toISOString(),
        });

      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Unknown action',
            availableActions: [
              'create-task',
              'control-agent',
              'create-collaboration',
              'update-task-progress',
              'assign-task',
            ],
            timestamp: new Date().toISOString(),
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('AI Agents API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}