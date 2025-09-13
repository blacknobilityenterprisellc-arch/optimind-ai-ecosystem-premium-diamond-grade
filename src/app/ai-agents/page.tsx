'use client';

/**
 * OptiMind AI Agents Page - Enterprise-Grade Agent Management Interface
 *
 * This page provides the main interface for accessing and managing the
 * AI Agents system within the OptiMind ecosystem.
 */

import OptiMindAgentsDashboard from '@/components/ai-agents/OptiMindAgentsDashboard';

export default function AIAgentsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <OptiMindAgentsDashboard />
    </div>
  );
}