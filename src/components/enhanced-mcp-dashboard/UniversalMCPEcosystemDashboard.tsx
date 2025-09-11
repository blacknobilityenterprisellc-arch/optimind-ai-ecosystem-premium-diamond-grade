'use client';

import { useState, useEffect } from 'react';
import { 
  Brain, 
  Globe, 
  Users, 
  Building2, 
  Smartphone, 
  Zap, 
  Shield, 
  TrendingUp,
  Settings,
  Activity,
  BarChart3,
  Target,
  Layers,
  Network,
  DollarSign,
  CheckCircle,
  AlertTriangle,
  Clock
} from 'lucide-react';

// Import the enhancement system
import { universalMCPEnhancementSystem } from '@/lib/universal-mcp-enhancement-system';

interface SystemHealth {
  mcpIntegration: any;
  mcpOrchestrator: any;
  regions: Array<{ id: string; status: string; latency: number }>;
  services: Array<{ id: string; status: string; uptime: number }>;
  models: Array<{ id: string; status: string; performance: number }>;
}

interface DashboardMetrics {
  totalUsers: number;
  activeServices: number;
  supportedRegions: number;
  integrationPartners: number;
  systemUptime: number;
  averageLatency: number;
}

export default function UniversalMCPEcosystemDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'segments' | 'services' | 'regions' | 'integrations' | 'mobile' | 'optimization'>('overview');
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedSegment, setSelectedSegment] = useState<string>('individual');
  const [pricingCalculation, setPricingCalculation] = useState<any>(null);

  // Initialize dashboard
  useEffect(() => {
    loadSystemHealth();
    loadMetrics();
  }, []);

  const loadSystemHealth = async () => {
    try {
      const response = await fetch('/api/universal-mcp/enhancement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operation: 'get_system_health' })
      });
      const data = await response.json();
      if (data.success) {
        setSystemHealth(data.result);
      }
    } catch (error) {
      console.error('Failed to load system health:', error);
    }
  };

  const loadMetrics = async () => {
    try {
      const response = await fetch('/api/universal-mcp/enhancement');
      const data = await response.json();
      if (data.success) {
        setMetrics({
          totalUsers: data.summary.userSegments * 1000, // Simulated
          activeServices: data.summary.serviceCategories,
          supportedRegions: data.summary.supportedRegions,
          integrationPartners: data.summary.integrationPartners,
          systemUptime: 99.9,
          averageLatency: 45
        });
      }
    } catch (error) {
      console.error('Failed to load metrics:', error);
    }
  };

  const calculatePricing = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/universal-mcp/enhancement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          operation: 'calculate_pricing',
          segmentId: selectedSegment,
          users: 100,
          transactions: 10000
        })
      });
      const data = await response.json();
      if (data.success) {
        setPricingCalculation(data.result);
      }
    } catch (error) {
      console.error('Failed to calculate pricing:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
      case 'operational':
      case 'connected':
      case 'optimized':
        return 'text-green-500';
      case 'warning':
      case 'connecting':
        return 'text-yellow-500';
      case 'offline':
      case 'error':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
      case 'operational':
      case 'connected':
      case 'optimized':
        return <CheckCircle className="w-4 h-4" />;
      case 'warning':
      case 'connecting':
        return <AlertTriangle className="w-4 h-4" />;
      case 'offline':
      case 'error':
        return <Clock className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Brain className="w-10 h-10 text-purple-400" />
                <div className="absolute -top-1 -right-1">
                  <Zap className="w-3 h-3 text-yellow-400" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Universal MCP Ecosystem
                </h1>
                <p className="text-gray-400">Multi-Sector AI Services Platform v3.0</p>
              </div>
            </div>
            
            {systemHealth && (
              <div className="flex items-center space-x-2 bg-gray-800/50 rounded-lg px-4 py-2">
                {getStatusIcon(systemHealth.mcpIntegration?.status || 'operational')}
                <span className={`text-sm font-medium ${getStatusColor(systemHealth.mcpIntegration?.status || 'operational')}`}>
                  System Operational
                </span>
              </div>
            )}
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-2 bg-gray-800/50 rounded-lg p-2">
            {[
              { key: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
              { key: 'segments', label: 'User Segments', icon: <Users className="w-4 h-4" /> },
              { key: 'services', label: 'Services', icon: <Target className="w-4 h-4" /> },
              { key: 'regions', label: 'Regions', icon: <Globe className="w-4 h-4" /> },
              { key: 'integrations', label: 'Integrations', icon: <Network className="w-4 h-4" /> },
              { key: 'mobile', label: 'Mobile', icon: <Smartphone className="w-4 h-4" /> },
              { key: 'optimization', label: 'AI Optimization', icon: <Brain className="w-4 h-4" /> }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
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

        {/* Main Content */}
        <div className="space-y-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && metrics && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <Users className="w-8 h-8 text-blue-400" />
                  <span className="text-sm text-gray-400">Total Users</span>
                </div>
                <div className="text-2xl font-bold">{metrics.totalUsers.toLocaleString()}</div>
                <div className="text-sm text-green-400">+12.5% from last month</div>
              </div>

              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <Target className="w-8 h-8 text-purple-400" />
                  <span className="text-sm text-gray-400">Active Services</span>
                </div>
                <div className="text-2xl font-bold">{metrics.activeServices}</div>
                <div className="text-sm text-green-400">All systems operational</div>
              </div>

              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <Globe className="w-8 h-8 text-green-400" />
                  <span className="text-sm text-gray-400">Global Regions</span>
                </div>
                <div className="text-2xl font-bold">{metrics.supportedRegions}</div>
                <div className="text-sm text-green-400">99.9% uptime</div>
              </div>

              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <Network className="w-8 h-8 text-yellow-400" />
                  <span className="text-sm text-gray-400">Partners</span>
                </div>
                <div className="text-2xl font-bold">{metrics.integrationPartners}</div>
                <div className="text-sm text-green-400">Enterprise ready</div>
              </div>
            </div>
          )}

          {/* User Segments Tab */}
          {activeTab === 'segments' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  User Segments
                </h3>
                <div className="space-y-4">
                  {[
                    { id: 'individual', name: 'Individual Users', color: 'blue' },
                    { id: 'smb', name: 'Small & Medium Business', color: 'green' },
                    { id: 'enterprise', name: 'Large Enterprises', color: 'purple' },
                    { id: 'niche', name: 'Niche Industries', color: 'yellow' }
                  ].map((segment) => (
                    <div
                      key={segment.id}
                      className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                        selectedSegment === segment.id
                          ? `border-${segment.color}-500 bg-${segment.color}-500/20`
                          : 'border-gray-600 hover:border-gray-500'
                      }`}
                      onClick={() => setSelectedSegment(segment.id)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{segment.name}</span>
                        <div className={`w-3 h-3 rounded-full bg-${segment.color}-500`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <DollarSign className="w-5 h-5 mr-2" />
                  Pricing Calculator
                </h3>
                <div className="space-y-4">
                  <button
                    onClick={calculatePricing}
                    disabled={isLoading}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isLoading ? 'Calculating...' : 'Calculate Pricing'}
                  </button>

                  {pricingCalculation && (
                    <div className="space-y-3 p-4 bg-gray-900 rounded-lg">
                      <div className="flex justify-between">
                        <span>Base Cost:</span>
                        <span className="font-medium">${pricingCalculation.baseCost}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>User Cost:</span>
                        <span className="font-medium">${pricingCalculation.userCost}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Transaction Cost:</span>
                        <span className="font-medium">${pricingCalculation.transactionCost}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Discount:</span>
                        <span className="font-medium text-green-400">
                          {(pricingCalculation.discount * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="border-t border-gray-700 pt-3 flex justify-between">
                        <span className="font-semibold">Total Cost:</span>
                        <span className="font-bold text-purple-400">
                          ${pricingCalculation.totalCost.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Services Tab */}
          {activeTab === 'services' && (
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Service Categories
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    name: 'Content Creation Studio',
                    description: 'AI-powered content generation for all formats',
                    features: ['Text Generation', 'Multimedia Creation', 'Content Strategy'],
                    price: '$29-$299/month'
                  },
                  {
                    name: 'Business Intelligence',
                    description: 'Advanced analytics and business intelligence',
                    features: ['Data Visualization', 'Predictive Analytics', 'Real-time Monitoring'],
                    price: '$49-$599/month'
                  },
                  {
                    name: 'Customer Experience',
                    description: 'Comprehensive customer experience management',
                    features: ['Personalization Engine', 'Sentiment Analysis', 'Journey Orchestration'],
                    price: '$79-$799/month'
                  }
                ].map((service, index) => (
                  <div key={index} className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                    <h4 className="font-semibold mb-2">{service.name}</h4>
                    <p className="text-sm text-gray-400 mb-3">{service.description}</p>
                    <div className="space-y-2 mb-3">
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center text-sm">
                          <CheckCircle className="w-3 h-3 text-green-400 mr-2" />
                          {feature}
                        </div>
                      ))}
                    </div>
                    <div className="text-sm font-medium text-purple-400">{service.price}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Regions Tab */}
          {activeTab === 'regions' && systemHealth && (
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Globe className="w-5 h-5 mr-2" />
                Global Regions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {systemHealth.regions.map((region) => (
                  <div key={region.id} className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{region.id.toUpperCase()}</span>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(region.status)}
                        <span className={`text-xs ${getStatusColor(region.status)}`}>
                          {region.status}
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-400">
                      Latency: {region.latency}ms
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Integrations Tab */}
          {activeTab === 'integrations' && metrics && (
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Network className="w-5 h-5 mr-2" />
                Integration Partners
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: 'Stripe', category: 'Payment', status: 'connected' },
                  { name: 'Salesforce', category: 'CRM', status: 'connected' },
                  { name: 'Slack', category: 'Communication', status: 'connected' },
                  { name: 'QuickBooks', category: 'ERP', status: 'connected' },
                  { name: 'Google Analytics', category: 'Analytics', status: 'connected' }
                ].map((partner, index) => (
                  <div key={index} className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{partner.name}</span>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(partner.status)}
                        <span className={`text-xs ${getStatusColor(partner.status)}`}>
                          {partner.status}
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-400">{partner.category}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mobile Tab */}
          {activeTab === 'mobile' && (
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Smartphone className="w-5 h-5 mr-2" />
                Mobile Applications
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    platform: 'iOS',
                    features: ['Push Notifications', 'Biometric Auth', 'Offline Mode', 'AR Integration'],
                    status: 'available'
                  },
                  {
                    platform: 'Android',
                    features: ['Push Notifications', 'Biometric Auth', 'Offline Mode', 'Widget Support'],
                    status: 'available'
                  },
                  {
                    platform: 'Cross-Platform',
                    features: ['Push Notifications', 'Biometric Auth', 'Offline Mode', 'PWA Support'],
                    status: 'available'
                  }
                ].map((app, index) => (
                  <div key={index} className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">{app.platform}</h4>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(app.status)}
                        <span className={`text-xs ${getStatusColor(app.status)}`}>
                          {app.status}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {app.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center text-sm">
                          <CheckCircle className="w-3 h-3 text-green-400 mr-2" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Optimization Tab */}
          {activeTab === 'optimization' && systemHealth && (
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Brain className="w-5 h-5 mr-2" />
                AI Model Optimization
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {systemHealth.models.map((model) => (
                  <div key={model.id} className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium">{model.id.toUpperCase()}</span>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(model.status)}
                        <span className={`text-xs ${getStatusColor(model.status)}`}>
                          {model.status}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Performance:</span>
                        <span className="font-medium text-green-400">
                          {(model.performance * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-green-400 h-2 rounded-full" 
                          style={{ width: `${model.performance * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-8 pt-6 border-t border-gray-700">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="text-sm text-gray-400 mb-4 sm:mb-0">
              Universal MCP Ecosystem v3.0 - Premium Diamond Grade
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span>System Status: Operational</span>
              <span>•</span>
              <span>Last Updated: {new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}