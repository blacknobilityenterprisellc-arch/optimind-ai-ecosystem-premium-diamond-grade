import { NextResponse } from 'next/server';
import { withRateLimit, standardRateLimit } from '@/lib/api-rate-limit-middleware';

// AI Model status interface
interface AIModelStatus {
  id: string;
  name: string;
  provider: string;
  status: 'online' | 'offline' | 'degraded' | 'maintenance';
  performance: {
    responseTime: number;
    accuracy: number;
    throughput: number;
    uptime: number;
  };
  usage: {
    requests: number;
    tokens: number;
    cost: number;
  };
  capabilities: string[];
  lastUpdated: string;
  healthScore: number;
}

// Real-time model metrics
interface ModelMetrics {
  totalRequests: number;
  totalTokens: number;
  averageResponseTime: number;
  systemLoad: number;
  activeModels: number;
  degradedModels: number;
  offlineModels: number;
}

// Enhanced AI model data
const aiModels: AIModelStatus[] = [
  {
    id: 'glm-4.5',
    name: 'GLM-4.5 Flagship',
    provider: 'Z.AI',
    status: 'online',
    performance: {
      responseTime: 850,
      accuracy: 96.8,
      throughput: 1250,
      uptime: 99.95
    },
    usage: {
      requests: 15420,
      tokens: 2450000,
      cost: 2450.00
    },
    capabilities: ['Text Generation', 'Code Generation', 'Reasoning', 'Analysis', 'Translation'],
    lastUpdated: new Date().toISOString(),
    healthScore: 98
  },
  {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    provider: 'OpenAI',
    status: 'online',
    performance: {
      responseTime: 1200,
      accuracy: 95.2,
      throughput: 980,
      uptime: 99.85
    },
    usage: {
      requests: 12350,
      tokens: 1980000,
      cost: 3960.00
    },
    capabilities: ['Text Generation', 'Code Generation', 'Analysis', 'Creative Writing', 'Problem Solving'],
    lastUpdated: new Date().toISOString(),
    healthScore: 95
  },
  {
    id: 'claude-3.5',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    status: 'online',
    performance: {
      responseTime: 950,
      accuracy: 97.1,
      throughput: 1100,
      uptime: 99.90
    },
    usage: {
      requests: 9870,
      tokens: 1650000,
      cost: 2475.00
    },
    capabilities: ['Text Generation', 'Analysis', 'Reasoning', 'Creative Writing', 'Research'],
    lastUpdated: new Date().toISOString(),
    healthScore: 97
  },
  {
    id: 'gemini-pro',
    name: 'Gemini Pro',
    provider: 'Google',
    status: 'degraded',
    performance: {
      responseTime: 1800,
      accuracy: 92.5,
      throughput: 750,
      uptime: 98.20
    },
    usage: {
      requests: 6540,
      tokens: 980000,
      cost: 980.00
    },
    capabilities: ['Text Generation', 'Code Generation', 'Analysis', 'Translation', 'Multimodal'],
    lastUpdated: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
    healthScore: 82
  },
  {
    id: 'grok-beta',
    name: 'Grok Beta',
    provider: 'xAI',
    status: 'online',
    performance: {
      responseTime: 750,
      accuracy: 94.8,
      throughput: 1350,
      uptime: 99.70
    },
    usage: {
      requests: 8760,
      tokens: 1320000,
      cost: 1320.00
    },
    capabilities: ['Text Generation', 'Analysis', 'Real-time Data', 'Reasoning', 'News Processing'],
    lastUpdated: new Date().toISOString(),
    healthScore: 94
  },
  {
    id: 'deepseek-v2.5',
    name: 'DeepSeek V2.5',
    provider: 'DeepSeek',
    status: 'maintenance',
    performance: {
      responseTime: 0,
      accuracy: 0,
      throughput: 0,
      uptime: 95.50
    },
    usage: {
      requests: 0,
      tokens: 0,
      cost: 0
    },
    capabilities: ['Text Generation', 'Code Generation', 'Analysis', 'Mathematics', 'Reasoning'],
    lastUpdated: new Date(Date.now() - 600000).toISOString(), // 10 minutes ago
    healthScore: 0
  }
];

function calculateModelMetrics(): ModelMetrics {
  const onlineModels = aiModels.filter(m => m.status === 'online');
  const degradedModels = aiModels.filter(m => m.status === 'degraded');
  const offlineModels = aiModels.filter(m => m.status === 'offline');
  
  const totalRequests = aiModels.reduce((sum, model) => sum + model.usage.requests, 0);
  const totalTokens = aiModels.reduce((sum, model) => sum + model.usage.tokens, 0);
  const averageResponseTime = onlineModels.length > 0 
    ? onlineModels.reduce((sum, model) => sum + model.performance.responseTime, 0) / onlineModels.length 
    : 0;
  
  const systemLoad = Math.min(100, (totalRequests / 100000) * 100); // Simulated load calculation
  
  return {
    totalRequests,
    totalTokens,
    averageResponseTime,
    systemLoad,
    activeModels: onlineModels.length,
    degradedModels: degradedModels.length,
    offlineModels: offlineModels.length
  };
}

function getModelHealthInsights(models: AIModelStatus[]): string[] {
  const insights: string[] = [];
  
  const onlineCount = models.filter(m => m.status === 'online').length;
  const degradedCount = models.filter(m => m.status === 'degraded').length;
  const maintenanceCount = models.filter(m => m.status === 'maintenance').length;
  
  if (onlineCount === models.length) {
    insights.push('All AI models are operating normally');
  } else if (degradedCount > 0) {
    insights.push(`${degradedCount} model(s) showing degraded performance`);
  }
  
  if (maintenanceCount > 0) {
    insights.push(`${maintenanceCount} model(s) currently under maintenance`);
  }
  
  const avgHealthScore = models.reduce((sum, model) => sum + model.healthScore, 0) / models.length;
  if (avgHealthScore > 95) {
    insights.push('Overall system health is excellent');
  } else if (avgHealthScore > 85) {
    insights.push('Overall system health is good');
  } else {
    insights.push('System health requires attention');
  }
  
  return insights;
}

export const GET = withRateLimit(async () => {
  try {
    const metrics = calculateModelMetrics();
    const insights = getModelHealthInsights(aiModels);
    
    // Simulate real-time updates by randomly adjusting some metrics
    aiModels.forEach(model => {
      if (model.status === 'online') {
        // Small random variations to simulate real-time data
        model.performance.responseTime += (Math.random() - 0.5) * 50;
        model.performance.responseTime = Math.max(100, Math.min(3000, model.performance.responseTime));
        
        model.usage.requests += Math.floor(Math.random() * 10);
        model.usage.tokens += Math.floor(Math.random() * 1000);
        
        model.lastUpdated = new Date().toISOString();
      }
    });
    
    const response = {
      status: 'success',
      timestamp: new Date().toISOString(),
      data: {
        models: aiModels,
        metrics,
        insights,
        summary: {
          totalModels: aiModels.length,
          operationalModels: aiModels.filter(m => m.status === 'online' || m.status === 'degraded').length,
          averageHealthScore: metrics.systemLoad > 80 ? 85 : 92, // Simulated health score
          lastUpdate: new Date().toISOString()
        }
      }
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching AI model status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch AI model status', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}, standardRateLimit);