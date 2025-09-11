'use client';

/**
 * OptiMind AI Agents Page - Enterprise-Grade Agent Management Interface
 *
 * This page provides the main interface for accessing and managing the
 * AI Agents system within the OptiMind ecosystem.
 */

import OptiMindAgentsDashboard from '@/components/ai-agents/OptiMindAgentsDashboard';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'OptiMind AI Agents - Enterprise-Grade Agent Management',
  description: 'Advanced AI agent management system with real-time monitoring, task orchestration, and collaborative intelligence capabilities.',
  keywords: [
    'OptiMind AI',
    'AI Agents',
    'Agent Management',
    'Task Orchestration',
    'Collaborative Intelligence',
    'Enterprise AI',
    'Multi-Agent Systems',
  ],
};

export default function AIAgentsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <OptiMindAgentsDashboard />
    </div>
  );
}