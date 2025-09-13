import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-6">
            OptiMind AI Ecosystem
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Enterprise-grade AI platform with 45+ AI tools and 35+ advanced AI models
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" className="px-8">
              Get Started
            </Button>
            <Button variant="outline" size="lg" className="px-8">
              Learn More
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 border-border/50 hover:border-primary/50 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🤖 AI Agents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Advanced AI agents with full capabilities, intelligence, and power
              </p>
            </CardContent>
          </Card>

          <Card className="p-6 border-border/50 hover:border-primary/50 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🎨 UI/UX Design
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Modern, responsive interface with beautiful shadcn/ui components
              </p>
            </CardContent>
          </Card>

          <Card className="p-6 border-border/50 hover:border-primary/50 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🏢 Enterprise Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Complete enterprise-grade functionality and security
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Dashboard Preview */}
        <div className="bg-card/50 border border-border/50 rounded-lg p-8">
          <h2 className="text-2xl font-semibold mb-6 text-center">AI-Powered Dashboard</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-background rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-primary">45+</div>
              <div className="text-sm text-muted-foreground">AI Tools</div>
            </div>
            <div className="bg-background rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-primary">35+</div>
              <div className="text-sm text-muted-foreground">AI Models</div>
            </div>
            <div className="bg-background rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-primary">100%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
            <div className="bg-background rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-primary">∞</div>
              <div className="text-sm text-muted-foreground">Scalability</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}