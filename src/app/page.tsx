'use client';

import { Brain, Sparkles, BarChart3 } from 'lucide-react';

export default function Home(): JSX.Element {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <Sparkles className="h-6 w-6 text-yellow-400 animate-pulse" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            OptiMind AI Ecosystem
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Premium Diamond Grade AI Solutions for Enterprise Transformation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <Brain className="h-8 w-8 text-purple-400" />
              <h3 className="text-xl font-semibold">AI Orchestrator</h3>
            </div>
            <p className="text-gray-300">Advanced AI model orchestration with intelligent routing</p>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <BarChart3 className="h-8 w-8 text-blue-400" />
              <h3 className="text-xl font-semibold">Analytics Dashboard</h3>
            </div>
            <p className="text-gray-300">Real-time insights and performance metrics</p>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="h-8 w-8 text-yellow-400" />
              <h3 className="text-xl font-semibold">Premium Features</h3>
            </div>
            <p className="text-gray-300">Diamond-grade tools and capabilities</p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 bg-purple-600/20 px-4 py-2 rounded-full">
            <span className="text-purple-400 font-medium">✅ Server Running Successfully</span>
          </div>
        </div>
      </div>
    </main>
  );
}