import { NextResponse } from 'next/server';
import { withRateLimit, standardRateLimit } from '@/lib/api-rate-limit-middleware';

// AI Service interface
interface AIService {
  id: string;
  name: string;
  category: string;
  description: string;
  status: 'available' | 'degraded' | 'unavailable' | 'maintenance';
  endpoint: string;
  pricing: {
    perRequest: number;
    perToken: number;
    currency: string;
  };
  limits: {
    maxTokens: number;
    maxRequests: number;
    timeout: number;
  };
  capabilities: string[];
  lastUpdated: string;
  healthScore: number;
}

// AI Service Usage Statistics
interface ServiceUsage {
  serviceId: string;
  requests: number;
  tokens: number;
  cost: number;
  averageResponseTime: number;
  successRate: number;
  lastUsed: string;
}

// Service Analytics
interface ServiceAnalytics {
  totalRequests: number;
  totalTokens: number;
  totalCost: number;
  averageResponseTime: number;
  overallSuccessRate: number;
  topServices: ServiceUsage[];
  usageTrends: {
    period: string;
    requests: number;
    cost: number;
  }[];
}

// Available AI Services
const aiServices: AIService[] = [
  {
    id: 'text-generation',
    name: 'Text Generation',
    category: 'Content Creation',
    description: 'Advanced text generation with multiple AI models',
    status: 'available',
    endpoint: '/api/content/generate',
    pricing: {
      perRequest: 0.001,
      perToken: 0.0001,
      currency: 'USD'
    },
    limits: {
      maxTokens: 4000,
      maxRequests: 100,
      timeout: 30000
    },
    capabilities: ['Blog posts', 'Articles', 'Marketing copy', 'Technical writing', 'Creative writing'],
    lastUpdated: new Date().toISOString(),
    healthScore: 98
  },
  {
    id: 'image-generation',
    name: 'Image Generation',
    category: 'Multimedia',
    description: 'Generate images from text descriptions using advanced AI',
    status: 'available',
    endpoint: '/api/images/generate',
    pricing: {
      perRequest: 0.02,
      perToken: 0,
      currency: 'USD'
    },
    limits: {
      maxTokens: 0,
      maxRequests: 50,
      timeout: 60000
    },
    capabilities: ['Photorealistic images', 'Art generation', 'Logo design', 'Concept art', 'Illustrations'],
    lastUpdated: new Date().toISOString(),
    healthScore: 95
  },
  {
    id: 'code-generation',
    name: 'Code Generation',
    category: 'Development',
    description: 'Generate code in various programming languages',
    status: 'available',
    endpoint: '/api/code-assist',
    pricing: {
      perRequest: 0.005,
      perToken: 0.0002,
      currency: 'USD'
    },
    limits: {
      maxTokens: 2000,
      maxRequests: 200,
      timeout: 45000
    },
    capabilities: ['Python', 'JavaScript', 'TypeScript', 'Java', 'C++', 'Go', 'Rust'],
    lastUpdated: new Date().toISOString(),
    healthScore: 97
  },
  {
    id: 'data-analysis',
    name: 'Data Analysis',
    category: 'Analytics',
    description: 'Analyze data and generate insights using AI',
    status: 'degraded',
    endpoint: '/api/analyze-data',
    pricing: {
      perRequest: 0.01,
      perToken: 0.0005,
      currency: 'USD'
    },
    limits: {
      maxTokens: 8000,
      maxRequests: 30,
      timeout: 120000
    },
    capabilities: ['Statistical analysis', 'Data visualization', 'Pattern recognition', 'Predictive modeling'],
    lastUpdated: new Date(Date.now() - 300000).toISOString(),
    healthScore: 82
  },
  {
    id: 'language-translation',
    name: 'Language Translation',
    category: 'Linguistics',
    description: 'Translate text between multiple languages',
    status: 'available',
    endpoint: '/api/translate',
    pricing: {
      perRequest: 0.002,
      perToken: 0.0001,
      currency: 'USD'
    },
    limits: {
      maxTokens: 5000,
      maxRequests: 150,
      timeout: 30000
    },
    capabilities: ['100+ languages', 'Document translation', 'Real-time translation', 'Context-aware translation'],
    lastUpdated: new Date().toISOString(),
    healthScore: 96
  },
  {
    id: 'sentiment-analysis',
    name: 'Sentiment Analysis',
    category: 'Analytics',
    description: 'Analyze sentiment in text data',
    status: 'available',
    endpoint: '/api/sentiment',
    pricing: {
      perRequest: 0.001,
      perToken: 0.00005,
      currency: 'USD'
    },
    limits: {
      maxTokens: 2000,
      maxRequests: 500,
      timeout: 15000
    },
    capabilities: ['Emotion detection', 'Opinion mining', 'Brand sentiment', 'Customer feedback analysis'],
    lastUpdated: new Date().toISOString(),
    healthScore: 99
  }
];

// Simulated usage data
const serviceUsage: ServiceUsage[] = [
  {
    serviceId: 'text-generation',
    requests: 15420,
    tokens: 2450000,
    cost: 2450.00,
    averageResponseTime: 850,
    successRate: 98.5,
    lastUsed: new Date().toISOString()
  },
  {
    serviceId: 'image-generation',
    requests: 8760,
    tokens: 0,
    cost: 1752.00,
    averageResponseTime: 3200,
    successRate: 96.2,
    lastUsed: new Date().toISOString()
  },
  {
    serviceId: 'code-generation',
    requests: 12350,
    tokens: 1850000,
    cost: 4325.00,
    averageResponseTime: 1200,
    successRate: 97.8,
    lastUsed: new Date().toISOString()
  },
  {
    serviceId: 'data-analysis',
    requests: 3200,
    tokens: 2560000,
    cost: 1600.00,
    averageResponseTime: 8500,
    successRate: 94.1,
    lastUsed: new Date(Date.now() - 300000).toISOString()
  },
  {
    serviceId: 'language-translation',
    requests: 9870,
    tokens: 4935000,
    cost: 5182.50,
    averageResponseTime: 950,
    successRate: 99.1,
    lastUsed: new Date().toISOString()
  },
  {
    serviceId: 'sentiment-analysis',
    requests: 21500,
    tokens: 1075000,
    cost: 1290.00,
    averageResponseTime: 450,
    successRate: 99.5,
    lastUsed: new Date().toISOString()
  }
];

function calculateServiceAnalytics(): ServiceAnalytics {
  const totalRequests = serviceUsage.reduce((sum, usage) => sum + usage.requests, 0);
  const totalTokens = serviceUsage.reduce((sum, usage) => sum + usage.tokens, 0);
  const totalCost = serviceUsage.reduce((sum, usage) => sum + usage.cost, 0);
  const averageResponseTime = serviceUsage.reduce((sum, usage) => sum + usage.averageResponseTime, 0) / serviceUsage.length;
  const overallSuccessRate = serviceUsage.reduce((sum, usage) => sum + usage.successRate, 0) / serviceUsage.length;

  // Sort services by usage for top services
  const topServices = [...serviceUsage].sort((a, b) => b.requests - a.requests).slice(0, 5);

  // Generate usage trends (simulated)
  const usageTrends = [
    { period: '1h ago', requests: Math.floor(totalRequests * 0.15), cost: totalCost * 0.15 },
    { period: '2h ago', requests: Math.floor(totalRequests * 0.12), cost: totalCost * 0.12 },
    { period: '3h ago', requests: Math.floor(totalRequests * 0.18), cost: totalCost * 0.18 },
    { period: '4h ago', requests: Math.floor(totalRequests * 0.10), cost: totalCost * 0.10 },
    { period: '5h ago', requests: Math.floor(totalRequests * 0.08), cost: totalCost * 0.08 }
  ];

  return {
    totalRequests,
    totalTokens,
    totalCost,
    averageResponseTime,
    overallSuccessRate,
    topServices,
    usageTrends
  };
}

function getServiceInsights(services: AIService[], usage: ServiceUsage[]): string[] {
  const insights: string[] = [];
  
  const availableServices = services.filter(s => s.status === 'available').length;
  const degradedServices = services.filter(s => s.status === 'degraded').length;
  
  if (availableServices === services.length) {
    insights.push('All AI services are fully operational');
  } else if (degradedServices > 0) {
    insights.push(`${degradedServices} service(s) showing degraded performance`);
  }
  
  const totalCost = usage.reduce((sum, u) => sum + u.cost, 0);
  const mostUsedService = usage.reduce((max, current) => current.requests > max.requests ? current : max);
  
  insights.push(`Total usage cost: $${totalCost.toFixed(2)}`);
  insights.push(`Most used service: ${services.find(s => s.id === mostUsedService.serviceId)?.name}`);
  
  const avgSuccessRate = usage.reduce((sum, u) => sum + u.successRate, 0) / usage.length;
  if (avgSuccessRate > 98) {
    insights.push('Excellent service reliability maintained');
  } else if (avgSuccessRate > 95) {
    insights.push('Good service reliability');
  } else {
    insights.push('Service reliability needs improvement');
  }
  
  return insights;
}

export const GET = withRateLimit(async () => {
  try {
    const analytics = calculateServiceAnalytics();
    const insights = getServiceInsights(aiServices, serviceUsage);
    
    // Simulate real-time updates
    serviceUsage.forEach(usage => {
      usage.requests += Math.floor(Math.random() * 5);
      usage.lastUsed = new Date().toISOString();
    });
    
    const response = {
      status: 'success',
      timestamp: new Date().toISOString(),
      data: {
        services: aiServices,
        usage: serviceUsage,
        analytics,
        insights,
        summary: {
          totalServices: aiServices.length,
          availableServices: aiServices.filter(s => s.status === 'available').length,
          totalUsage: analytics.totalRequests,
          totalCost: analytics.totalCost,
          averageHealthScore: aiServices.reduce((sum, s) => sum + s.healthScore, 0) / aiServices.length,
          lastUpdate: new Date().toISOString()
        }
      }
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching AI services data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch AI services data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}, standardRateLimit);