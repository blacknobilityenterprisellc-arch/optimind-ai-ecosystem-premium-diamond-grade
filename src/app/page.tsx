import React from 'react';
import * as components from '@/components/ui';

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            OptiMind AI Ecosystem
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Enterprise-grade AI platform with 45+ AI tools and 35+ advanced AI models
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <components.Card className="p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-3">🤖 AI Agents</h2>
            <p className="text-muted-foreground">
              Advanced AI agents with full capabilities, intelligence, and intuition
            </p>
          </components.Card>
          
          <components.Card className="p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-3">🎨 UI/UX Design</h2>
            <p className="text-muted-foreground">
              Modern, responsive interface with beautiful shadcn/ui components
            </p>
          </components.Card>
          
          <components.Card className="p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-3">🏢 Enterprise Features</h2>
            <p className="text-muted-foreground">
              Complete enterprise-grade functionality and security
            </p>
          </components.Card>
        </div>
        
        <div className="text-center">
          <components.Button className="px-6 py-3 text-lg">
            Get Started with OptiMind AI
          </components.Button>
        </div>
      </div>
    </div>
  );
}