'use client';

import { useState, useEffect } from 'react';

// Enhanced interface for premium features
interface PremiumFeature {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'active' | 'beta' | 'premium' | 'exclusive';
  icon: React.ReactNode;
  metrics?: {
    usage: number;
    performance: number;
    uptime: number;
  };
  capabilities: string[];
  lastUpdated: string;
}

// Real-time system status
interface SystemStatus {
  overall: 'healthy' | 'warning' | 'critical';
  services: {
    name: string;
    status: 'healthy' | 'warning' | 'critical';
    message: string;
  }[];
  metrics: {
    cpu: number;
    memory: number;
    disk: number;
    network: number;
  };
}

const initialPremiumFeatures: PremiumFeature[] = [
  {
    id: 'glm-orchestrator',
    title: 'GLM Orchestrator',
    description: 'Advanced AI model orchestration with intelligent routing and optimization',
    category: 'Core AI',
    status: 'exclusive',
    icon: <Brain className="w-6 h-6" />,
    metrics: {
      usage: 95,
      performance: 98,
      uptime: 99.9
    },
    capabilities: ['Multi-model routing', 'Load balancing', 'Auto-scaling', 'Real-time monitoring'],
    lastUpdated: '2 minutes ago'
  },
  {
    id: 'content-creation',
    title: 'Premium Content Studio',
    description: 'AI-driven content generation with multi-modal capabilities',
    category: 'Content',
    status: 'premium',
    icon: <FileText className="w-6 h-6" />,
    metrics: {
      usage: 87,
      performance: 94,
      uptime: 99.7
    },
    capabilities: ['Text generation', 'Image creation', 'Video synthesis', 'Audio production'],
    lastUpdated: '5 minutes ago'
  },
  {
    id: 'image-analysis',
    title: 'Vision Intelligence',
    description: 'Advanced computer vision and image processing with GPT-4V integration',
    category: 'Vision',
    status: 'premium',
    icon: <ImageIcon className="w-6 h-6" />,
    metrics: {
      usage: 78,
      performance: 92,
      uptime: 99.5
    },
    capabilities: ['Object detection', 'Face recognition', 'Scene analysis', 'OCR processing'],
    lastUpdated: '1 minute ago'
  },
  {
    id: 'optimization-engine',
    title: 'Optimization Engine',
    description: 'AI-powered SEO, AEO, and GEO optimization with real-time analysis',
    category: 'Optimization',
    status: 'premium',
    icon: <Target className="w-6 h-6" />,
    metrics: {
      usage: 82,
      performance: 96,
      uptime: 99.8
    },
    capabilities: ['SEO analysis', 'Content optimization', 'Performance tracking', 'Competitor analysis'],
    lastUpdated: '3 minutes ago'
  },
  {
    id: 'security-shield',
    title: 'Security Shield',
    description: 'Enterprise-grade security with AI-powered threat detection',
    category: 'Security',
    status: 'exclusive',
    icon: <Shield className="w-6 h-6" />,
    metrics: {
      usage: 91,
      performance: 99,
      uptime: 100
    },
    capabilities: ['Threat detection', 'Access control', 'Data encryption', 'Audit logging'],
    lastUpdated: '30 seconds ago'
  },
  {
    id: 'analytics-dashboard',
    title: 'Analytics Dashboard',
    description: 'Real-time analytics and business intelligence powered by AI',
    category: 'Analytics',
    status: 'active',
    icon: <BarChart3 className="w-6 h-6" />,
    metrics: {
      usage: 75,
      performance: 89,
      uptime: 99.3
    },
    capabilities: ['Real-time metrics', 'Custom reports', 'Data visualization', 'Predictive analytics'],
    lastUpdated: '4 minutes ago'
  }
];

const categories = ['all', 'Core AI', 'Content', 'Vision', 'Optimization', 'Security', 'Analytics'];

export default function DiamondGradeInterface() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFeature, setSelectedFeature] = useState<PremiumFeature | null>(null);
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [features, setFeatures] = useState<PremiumFeature[]>(initialPremiumFeatures);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'features' | 'monitoring' | 'analytics'>('features');

  // Fetch system status
  useEffect(() => {
    fetchSystemStatus();
    fetchAIModelStatus();
    const interval = setInterval(() => {
      fetchSystemStatus();
      fetchAIModelStatus();
    }, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchSystemStatus = async () => {
    try {
      const response = await fetch('/api/health');
      const data = await response.json();
      setSystemStatus({
        overall: data.status === 'healthy' ? 'healthy' : data.status === 'warning' ? 'warning' : 'critical',
        services: data.services || [],
        metrics: data.metrics || { cpu: 0, memory: 0, disk: 0, network: 0 }
      });
    } catch (error) {
      console.error('Failed to fetch system status:', error);
    }
  };

  const fetchAIModelStatus = async () => {
    try {
      const response = await fetch('/api/ai-models/status');
      const data = await response.json();
      if (data.status === 'success') {
        // Update features with real-time data
        setFeatures(prev => prev.map(feature => {
          const model = data.data.models.find((m: any) => m.id === feature.id);
          if (model) {
            return {
              ...feature,
              metrics: {
                usage: Math.round((model.usage.requests / 1000) * 100), // Convert to percentage
                performance: model.healthScore,
                uptime: model.performance.uptime
              },
              lastUpdated: new Date(model.lastUpdated).toLocaleTimeString()
            };
          }
          return feature;
        }));
      }
    } catch (error) {
      console.error('Failed to fetch AI model status:', error);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchSystemStatus();
    await fetchAIModelStatus();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const filteredFeatures = features.filter(feature => {
    const matchesCategory =
      selectedCategory === 'all' || feature.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      feature.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feature.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feature.capabilities.some(cap => cap.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'active':
        return 'text-green-500';
      case 'warning':
      case 'beta':
        return 'text-yellow-500';
      case 'critical':
        return 'text-red-500';
      case 'premium':
        return 'text-blue-500';
      case 'exclusive':
        return 'text-purple-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'active':
        return <CheckCircle className="w-4 h-4" />;
      case 'warning':
      case 'beta':
        return <AlertCircle className="w-4 h-4" />;
      case 'critical':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <div className="flex items-center space-x-3 mb-4 sm:mb-0">
              <div className="relative">
                <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-purple-400" />
                <div className="absolute -top-1 -right-1">
                  <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-1">
                  OptiMind AI Ecosystem
                </h1>
                <p className="text-sm sm:text-base text-gray-400">Diamond-Grade Premium Interface</p>
              </div>
            </div>
            
            {/* System Status */}
            {systemStatus && (
              <div className="flex items-center space-x-2 bg-gray-800/50 rounded-lg px-3 py-2">
                {getStatusIcon(systemStatus.overall)}
                <span className={`text-sm font-medium ${getStatusColor(systemStatus.overall)}`}>
                  {systemStatus.overall.toUpperCase()}
                </span>
                <button
                  onClick={handleRefresh}
                  className="p-1 hover:bg-gray-700 rounded transition-colors"
                  disabled={isRefreshing}
                >
                  <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                </button>
              </div>
            )}
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-1 bg-gray-800/50 rounded-lg p-1 mb-6">
            {[
              { key: 'features', label: 'Features', icon: <Brain className="w-4 h-4" /> },
              { key: 'monitoring', label: 'Monitoring', icon: <Activity className="w-4 h-4" /> },
              { key: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </header>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                placeholder="Search features, capabilities..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Main Content */}
        {activeTab === 'features' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFeatures.map(feature => (
              <div
                key={feature.id}
                className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-purple-500 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 cursor-pointer"
                onClick={() => setSelectedFeature(feature)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-600/20 rounded-lg">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">{feature.title}</h3>
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          feature.status === 'exclusive' ? 'bg-purple-600 text-white' :
                          feature.status === 'premium' ? 'bg-blue-600 text-white' :
                          feature.status === 'beta' ? 'bg-yellow-600 text-white' :
                          'bg-gray-600 text-white'
                        }`}>
                          {feature.status}
                        </span>
                        <span className="text-xs text-gray-500">{feature.category}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-gray-400 text-sm mb-4">{feature.description}</p>

                {/* Metrics */}
                {feature.metrics && (
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-400">{feature.metrics.usage}%</div>
                      <div className="text-xs text-gray-500">Usage</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-400">{feature.metrics.performance}%</div>
                      <div className="text-xs text-gray-500">Performance</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-400">{feature.metrics.uptime}%</div>
                      <div className="text-xs text-gray-500">Uptime</div>
                    </div>
                  </div>
                )}

                {/* Capabilities */}
                <div className="mb-4">
                  <div className="text-xs text-gray-500 mb-2">Capabilities:</div>
                  <div className="flex flex-wrap gap-1">
                    {feature.capabilities.slice(0, 3).map((capability, index) => (
                      <span key={index} className="text-xs bg-gray-700 px-2 py-1 rounded">
                        {capability}
                      </span>
                    ))}
                    {feature.capabilities.length > 3 && (
                      <span className="text-xs bg-gray-700 px-2 py-1 rounded">
                        +{feature.capabilities.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Updated {feature.lastUpdated}</span>
                  <div className="flex items-center space-x-1">
                    {getStatusIcon(feature.status)}
                    <span className={getStatusColor(feature.status)}>{feature.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'monitoring' && systemStatus && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* System Overview */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
                <Activity className="w-5 h-5" />
                <span>System Overview</span>
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{systemStatus.metrics.cpu}%</div>
                  <div className="text-sm text-gray-500">CPU Usage</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{systemStatus.metrics.memory}%</div>
                  <div className="text-sm text-gray-500">Memory</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">{systemStatus.metrics.disk}%</div>
                  <div className="text-sm text-gray-500">Disk</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">{systemStatus.metrics.network}%</div>
                  <div className="text-sm text-gray-500">Network</div>
                </div>
              </div>
            </div>

            {/* Service Status */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Service Status</span>
              </h3>
              <div className="space-y-3">
                {systemStatus.services.map((service, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(service.status)}
                      <span className="text-sm">{service.name}</span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      service.status === 'healthy' ? 'bg-green-600 text-white' :
                      service.status === 'warning' ? 'bg-yellow-600 text-white' :
                      'bg-red-600 text-white'
                    }`}>
                      {service.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Analytics Dashboard</span>
            </h3>
            <div className="text-center py-12">
              <BarChart3 className="w-16 h-16 mx-auto text-gray-600 mb-4" />
              <p className="text-gray-400">Advanced analytics coming soon...</p>
            </div>
          </div>
        )}

        {/* Feature Detail Modal */}
        {selectedFeature && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-600/20 rounded-lg">
                    {selectedFeature.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{selectedFeature.title}</h3>
                    <p className="text-gray-400">{selectedFeature.category}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedFeature(null)}
                  className="p-2 hover:bg-gray-700 rounded-lg"
                >
                  ×
                </button>
              </div>
              
              <p className="text-gray-300 mb-6">{selectedFeature.description}</p>
              
              <div className="mb-6">
                <h4 className="font-semibold mb-3">Capabilities</h4>
                <div className="grid grid-cols-2 gap-2">
                  {selectedFeature.capabilities.map((capability, index) => (
                    <div key={index} className="bg-gray-700 px-3 py-2 rounded text-sm">
                      {capability}
                    </div>
                  ))}
                </div>
              </div>

              {selectedFeature.metrics && (
                <div className="mb-6">
                  <h4 className="font-semibold mb-3">Performance Metrics</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">{selectedFeature.metrics.usage}%</div>
                      <div className="text-sm text-gray-500">Usage</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">{selectedFeature.metrics.performance}%</div>
                      <div className="text-sm text-gray-500">Performance</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">{selectedFeature.metrics.uptime}%</div>
                      <div className="text-sm text-gray-500">Uptime</div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Last updated: {selectedFeature.lastUpdated}</span>
                <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  Launch Feature
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
