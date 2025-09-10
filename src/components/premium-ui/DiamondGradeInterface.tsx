'use client';

import { useState } from 'react';

// Simplified interface for testing
interface PremiumFeature {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'active' | 'beta' | 'premium' | 'exclusive';
}

const premiumFeatures: PremiumFeature[] = [
  {
    id: 'glm-orchestrator',
    title: 'GLM Orchestrator',
    description: 'Advanced AI model orchestration with intelligent routing and optimization',
    category: 'Core AI',
    status: 'exclusive',
  },
  {
    id: 'content-creation',
    title: 'Premium Content Studio',
    description: 'AI-driven content generation with multi-modal capabilities',
    category: 'Content',
    status: 'premium',
  },
  {
    id: 'image-analysis',
    title: 'Vision Intelligence',
    description: 'Advanced computer vision and image processing with GPT-4V integration',
    category: 'Vision',
    status: 'premium',
  },
];

export default function DiamondGradeInterface() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredFeatures = premiumFeatures.filter(feature => {
    const matchesCategory = selectedCategory === 'all' || feature.category.toLowerCase() === selectedCategory;
    const matchesSearch = feature.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         feature.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            OptiMind AI Ecosystem
          </h1>
          <p className="text-gray-400">Diamond-Grade Premium Interface</p>
        </header>

        <div className="mb-6">
          <input
            placeholder="Search features..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-md px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFeatures.map((feature) => (
            <div key={feature.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400 mb-4">{feature.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">{feature.category}</span>
                <span className={`px-2 py-1 rounded text-xs ${
                  feature.status === 'exclusive' ? 'bg-purple-600 text-white' :
                  feature.status === 'premium' ? 'bg-blue-600 text-white' :
                  feature.status === 'beta' ? 'bg-yellow-600 text-white' :
                  'bg-gray-600 text-white'
                }`}>
                  {feature.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}