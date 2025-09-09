/**
 * OptiMind AI Ecosystem - Main UI Component
 *
 * The primary React component that displays the OptiMind AI Ecosystem
 * interface with all its capabilities and features.
 *
 * This component showcases the premium diamond grade AI solutions
 * for enterprise transformation.
 */

'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Brain,
  Shield,
  Zap,
  BarChart3,
  Image as ImageIcon,
  MessageSquare,
  Search,
  Eye,
  Sparkles,
  Cpu,
  Rocket,
} from 'lucide-react';

interface EcosystemFeature {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: string;
  category: string;
  status: 'active' | 'beta' | 'coming-soon';
  stats: string;
}

const getEcosystemFeatures = (): EcosystemFeature[] => [
  {
    id: 'glm-orchestrator',
    title: 'GLM Orchestrator',
    description: 'Advanced AI model orchestration with intelligent routing and optimization',
    icon: Brain,
    color: 'text-purple-500',
    category: 'core-ai',
    status: 'active',
    stats: '45+ Models Integrated',
  },
  {
    id: 'intelligent-security',
    title: 'Intelligent Security',
    description: 'AI-powered security monitoring and threat detection',
    icon: Shield,
    color: 'text-green-500',
    category: 'security',
    status: 'active',
    stats: '99.9% Uptime',
  },
  {
    id: 'content-creation',
    title: 'Content Creation',
    description: 'AI-driven content generation and optimization',
    icon: MessageSquare,
    color: 'text-blue-500',
    category: 'content',
    status: 'active',
    stats: '1M+ Words Generated',
  },
  {
    id: 'image-analysis',
    title: 'Image Analysis',
    description: 'Advanced computer vision and image processing',
    icon: ImageIcon,
    color: 'text-orange-500',
    category: 'vision',
    status: 'active',
    stats: '50K+ Images Processed',
  },
  {
    id: 'research-analysis',
    title: 'Research Analysis',
    description: 'Intelligent research and data analysis capabilities',
    icon: Search,
    color: 'text-indigo-500',
    category: 'analytics',
    status: 'active',
    stats: '10K+ Research Papers',
  },
  {
    id: 'moderation',
    title: 'Content Moderation',
    description: 'AI-powered content moderation and filtering',
    icon: Eye,
    color: 'text-red-500',
    category: 'security',
    status: 'active',
    stats: '99.5% Accuracy',
  },
  {
    id: 'optimization',
    title: 'Performance Optimization',
    description: 'Continuous optimization and performance enhancement',
    icon: Zap,
    color: 'text-yellow-500',
    category: 'optimization',
    status: 'active',
    stats: '87% Avg. Improvement',
  },
  {
    id: 'developer-access',
    title: 'Developer Access',
    description: 'Secure API access and developer tools',
    icon: Cpu,
    color: 'text-cyan-500',
    category: 'development',
    status: 'beta',
    stats: '100+ APIs Available',
  },
  {
    id: 'analytics-dashboard',
    title: 'Analytics Dashboard',
    description: 'Comprehensive analytics and insights',
    icon: BarChart3,
    color: 'text-pink-500',
    category: 'analytics',
    status: 'active',
    stats: 'Real-time Insights',
  },
];

const getCategories = (ecosystemFeatures: EcosystemFeature[]) => [
  { id: 'all', label: 'All Features', count: ecosystemFeatures.length },
  {
    id: 'core-ai',
    label: 'Core AI',
    count: ecosystemFeatures.filter(f => f.category === 'core-ai').length,
  },
  {
    id: 'security',
    label: 'Security',
    count: ecosystemFeatures.filter(f => f.category === 'security').length,
  },
  {
    id: 'content',
    label: 'Content',
    count: ecosystemFeatures.filter(f => f.category === 'content').length,
  },
  {
    id: 'vision',
    label: 'Vision',
    count: ecosystemFeatures.filter(f => f.category === 'vision').length,
  },
  {
    id: 'analytics',
    label: 'Analytics',
    count: ecosystemFeatures.filter(f => f.category === 'analytics').length,
  },
  {
    id: 'optimization',
    label: 'Optimization',
    count: ecosystemFeatures.filter(f => f.category === 'optimization').length,
  },
  {
    id: 'development',
    label: 'Development',
    count: ecosystemFeatures.filter(f => f.category === 'development').length,
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-500';
    case 'beta':
      return 'bg-yellow-500';
    case 'coming-soon':
      return 'bg-gray-500';
    default:
      return 'bg-gray-500';
  }
};

const HeroSection = () => (
  <div className="text-center space-y-4">
    <div className="flex items-center justify-center gap-2">
      <Brain className="h-8 w-8 text-purple-500" />
      <h2 className="text-2xl font-bold">Ecosystem Capabilities</h2>
    </div>
    <p className="text-gray-400 max-w-2xl mx-auto">
      Explore our comprehensive suite of AI-powered tools and services designed for enterprise
      transformation
    </p>
  </div>
);

const CategoryFilter = ({
  categories,
  selectedCategory,
  setSelectedCategory,
}: {
  categories: Array<{ id: string; label: string; count: number }>;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}) => (
  <div className="flex flex-wrap gap-2 justify-center">
    {categories.map(category => (
      <Button
        key={category.id}
        variant={selectedCategory === category.id ? 'default' : 'outline'}
        size="sm"
        onClick={() => setSelectedCategory(category.id)}
        className="flex items-center gap-2"
      >
        {category.label}
        <Badge variant="secondary" className="text-xs">
          {category.count}
        </Badge>
      </Button>
    ))}
  </div>
);

const FeaturesGrid = ({ features }: { features: EcosystemFeature[] }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {features.map(feature => (
      <Card
        key={feature.id}
        className="hover:shadow-lg transition-all duration-300 border-gray-700 bg-gray-800/50"
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <feature.icon className={`h-6 w-6 ${feature.color}`} />
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={`text-xs ${getStatusColor(feature.status)} text-white border-none`}
              >
                {feature.status.replace('-', ' ')}
              </Badge>
            </div>
          </div>
          <CardTitle className="text-lg text-white">{feature.title}</CardTitle>
          <CardDescription className="text-gray-400">{feature.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">{feature.stats}</span>
            <Button variant="outline" size="sm" className="text-xs">
              Explore
              <Rocket className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

const EcosystemStats = () => (
  <Card className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-purple-500/30">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-white">
        <BarChart3 className="h-5 w-5" />
        Ecosystem Statistics
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-400">45+</div>
          <div className="text-sm text-gray-400">AI Models</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-400">99.9%</div>
          <div className="text-sm text-gray-400">Uptime</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-400">1M+</div>
          <div className="text-sm text-gray-400">API Calls</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-400">24/7</div>
          <div className="text-sm text-gray-400">Support</div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const QuickActions = () => (
  <Card className="bg-gray-800/50 border-gray-700">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-white">
        <Sparkles className="h-5 w-5" />
        Quick Actions
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button className="bg-purple-600 hover:bg-purple-700" size="lg">
          <Brain className="h-4 w-4 mr-2" />
          Try GLM Orchestrator
        </Button>
        <Button variant="outline" size="lg" className="border-gray-600">
          <MessageSquare className="h-4 w-4 mr-2" />
          Create Content
        </Button>
        <Button variant="outline" size="lg" className="border-gray-600">
          <ImageIcon className="h-4 w-4 mr-2" />
          Analyze Image
        </Button>
      </div>
    </CardContent>
  </Card>
);

const OptiMindEcosystem: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const ecosystemFeatures = getEcosystemFeatures();
  const categories = getCategories(ecosystemFeatures);

  const filteredFeatures =
    selectedCategory === 'all'
      ? ecosystemFeatures
      : ecosystemFeatures.filter(feature => feature.category === selectedCategory);

  return (
    <div className="w-full space-y-8">
      <HeroSection />
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <FeaturesGrid features={filteredFeatures} />
      <EcosystemStats />
      <QuickActions />
    </div>
  );
};

export default OptiMindEcosystem;
