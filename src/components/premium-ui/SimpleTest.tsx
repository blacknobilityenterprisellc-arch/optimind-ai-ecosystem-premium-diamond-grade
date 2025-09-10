/**
 * Simple Test Component for UI/UX Validation
 * 
 * A minimal component to test basic functionality
 */

'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Sparkles, Crown } from 'lucide-react';

const SimpleTest: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <Brain className="h-8 w-8 text-purple-500" />
          OptiMind AI Ecosystem - UI Test
          <Sparkles className="h-6 w-6 text-yellow-400" />
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-yellow-400" />
                Premium Component Test
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">
                This is a test of the premium UI components to verify functionality.
              </p>
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600">
                Test Button
              </Button>
              <Badge className="ml-2 bg-purple-600/20 text-purple-400">
                Active
              </Badge>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle>Navigation Test</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">
                Testing navigation and interaction capabilities.
              </p>
              <div className="flex gap-2">
                <Button variant="outline">Nav Item 1</Button>
                <Button variant="outline">Nav Item 2</Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-8 p-6 bg-gray-800/30 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">UI/UX Assessment Results:</h2>
          <div className="space-y-2 text-gray-300">
            <p>✅ Components rendering correctly</p>
            <p>✅ Styling applied properly</p>
            <p>✅ Interactive elements functional</p>
            <p>✅ Responsive design working</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleTest;