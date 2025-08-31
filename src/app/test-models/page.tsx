"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { multiModelAIUtils } from "@/lib/multi-model-ai";
import { 
  Brain, 
  Network, 
  Cpu, 
  CheckCircle, 
  AlertTriangle, 
  RefreshCw,
  Target,
  Zap,
  Shield,
  Crown,
  Lightbulb
} from "lucide-react";

interface ModelStatus {
  id: string;
  name: string;
  version: string;
  provider: string;
  isAvailable: boolean;
  capabilities: string[];
  status: string;
}

interface TestResult {
  modelId: string;
  modelName: string;
  testPrompt: string;
  response: string;
  confidence: number;
  processingTime: number;
  capabilities: string[];
  timestamp: string;
  status: string;
}

export default function TestModelsPage() {
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);
  const [modelStatuses, setModelStatuses] = useState<ModelStatus[]>([]);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [availableModels, setAvailableModels] = useState<any[]>([]);

  useEffect(() => {
    const loadModels = async () => {
      try {
        const models = await multiModelAIUtils.getAvailableModels(multiModelAIUtils.DEFAULT_OPTIONS);
        setAvailableModels(models);
      } catch (err) {
        console.error('Failed to load models:', err);
      }
    };
    loadModels();
  }, []);

  const getModelIcon = (modelId: string) => {
    switch (modelId) {
      case 'glm-45v':
        return <Target className="w-5 h-5" />;
      case 'glm-45-auto-think':
        return <Lightbulb className="w-5 h-5" />;
      case 'glm-45-flagship':
        return <Crown className="w-5 h-5" />;
      case 'air':
        return <Cpu className="w-5 h-5" />;
      case 'glm-45-full-stack':
        return <Network className="w-5 h-5" />;
      default:
        return <Brain className="w-5 h-5" />;
    }
  };

  const getModelColor = (modelId: string) => {
    switch (modelId) {
      case 'glm-45v':
        return "text-blue-600";
      case 'glm-45-auto-think':
        return "text-orange-600";
      case 'glm-45-flagship':
        return "text-yellow-600";
      case 'air':
        return "text-purple-600";
      case 'glm-45-full-stack':
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  const checkModelStatus = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/test-models');
      const data = await response.json();
      
      if (data.success) {
        setModelStatuses(data.models);
      } else {
        setError(data.message || 'Failed to check model status');
      }
    } catch (error) {
      setError('Network error while checking model status');
      console.error('Model status check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const testModel = async (modelId: string) => {
    setTesting(true);
    setError(null);
    
    try {
      const response = await fetch('/api/test-models', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          modelId,
          testPrompt: 'Test advanced AI capabilities for image analysis and security scanning'
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setTestResults(prev => {
          const filtered = prev.filter(r => r.modelId !== modelId);
          return [...filtered, data.result];
        });
      } else {
        setError(data.message || 'Failed to test model');
      }
    } catch (error) {
      setError('Network error while testing model');
      console.error('Model test failed:', error);
    } finally {
      setTesting(false);
    }
  };

  const testAllModels = async () => {
    setTesting(true);
    setError(null);
    
    const promises = availableModels.map(model => testModel(model.id));
    await Promise.all(promises);
    setTesting(false);
  };

  useEffect(() => {
    checkModelStatus();
  }, []);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Network className="w-8 h-8 text-purple-600" />
            <h1 className="text-3xl font-bold">Multi-Model AI Test Center</h1>
          </div>
          <p className="text-muted-foreground">
            Test and validate GLM-4.5V, GLM-4.5 Auto Think, GLM-4.5 Flagship, AIR, and Base AI models
          </p>
        </div>

        {/* Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              System Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <Button 
                onClick={checkModelStatus} 
                disabled={loading}
                variant="outline"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Check Status
              </Button>
              <Button 
                onClick={testAllModels} 
                disabled={testing}
              >
                <Zap className="w-4 h-4 mr-2" />
                Test All Models
              </Button>
            </div>
            
            {error && (
              <Alert>
                <AlertTriangle className="w-4 h-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Model Status Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              Model Status Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableModels.map(model => {
                const status = modelStatuses.find(s => s.id === model.id);
                const isAvailable = status?.isAvailable || false;
                
                return (
                  <Card key={model.id} className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      {getModelIcon(model.id)}
                      <div>
                        <h3 className="font-medium">{model.name}</h3>
                        <p className="text-xs text-muted-foreground">{model.version}</p>
                      </div>
                      <div className="ml-auto">
                        {isAvailable ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-yellow-600" />
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium">Status:</span>
                        <Badge 
                          variant={isAvailable ? "default" : "secondary"}
                          className={isAvailable ? "bg-green-100 text-green-800" : ""}
                        >
                          {isAvailable ? "Operational" : "Unavailable"}
                        </Badge>
                      </div>
                      
                      <div className="text-xs text-muted-foreground">
                        <div className="font-medium mb-1">Capabilities:</div>
                        <div className="flex flex-wrap gap-1">
                          {model.capabilities.slice(0, 3).map((capability, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {capability}
                            </Badge>
                          ))}
                          {model.capabilities.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{model.capabilities.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => testModel(model.id)}
                        disabled={testing}
                        className="w-full mt-2"
                      >
                        Test Model
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Test Results */}
        {testResults.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Test Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {testResults.map((result, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      {getModelIcon(result.modelId)}
                      <h3 className="font-medium">{result.modelName}</h3>
                      <Badge variant="outline" className="text-xs">
                        {Math.round(result.confidence * 100)}% confidence
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {result.processingTime}ms
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <span className="text-xs font-medium text-muted-foreground">Test Prompt:</span>
                        <p className="text-sm">{result.testPrompt}</p>
                      </div>
                      
                      <div>
                        <span className="text-xs font-medium text-muted-foreground">Response:</span>
                        <p className="text-sm bg-gray-50 p-2 rounded">{result.response}</p>
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Confidence: {Math.round(result.confidence * 100)}%</span>
                        <span>Processing Time: {result.processingTime}ms</span>
                        <span>Status: {result.status}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* System Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Network className="w-5 h-5" />
              System Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Available Models</h4>
                <ul className="space-y-1 text-sm">
                  {availableModels.map(model => (
                    <li key={model.id} className="flex items-center gap-2">
                      {getModelIcon(model.id)}
                      <span>{model.name} ({model.version})</span>
                      <Badge variant="outline" className="text-xs">
                        {model.provider}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Model Capabilities</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>GLM-4.5V:</strong> Advanced visual understanding, multimodal reasoning, scene understanding
                  </div>
                  <div>
                    <strong>GLM-4.5 Auto Think:</strong> Automatic thinking, self-reflection, step-by-step reasoning, meta-cognition
                  </div>
                  <div>
                    <strong>GLM-4.5 Flagship:</strong> Quantum reasoning, universal comprehension, superintelligence, ultimate accuracy
                  </div>
                  <div>
                    <strong>AIR:</strong> Logical reasoning, causal inference, predictive analysis, risk assessment
                  </div>
                  <div>
                    <strong>GLM-4.5 Full Stack:</strong> Full-stack analysis, comprehensive reasoning, multi-domain expertise, integrated intelligence
                  </div>
                  <div>
                    <strong>Base Model:</strong> Comprehensive analysis with safety detection and quality assessment
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}