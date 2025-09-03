/**
 * Test page for the Z.AI GLM-4.5 Content Moderation System
 * Demonstrates the complete integration pipeline
 */

'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, Shield, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface ModerationResult {
  success: boolean;
  imageId: string;
  persistedId?: string;
  consensus?: {
    topLabel: string;
    score: number;
    spread: number;
    recommendedAction: string;
    reasons: string[];
  };
  analysisDetails?: {
    modelsUsed: string[];
    reviewNeeded: boolean;
  };
  error?: string;
  details?: string;
  timestamp: string;
}

export default function TestModerationPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ModerationResult | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setResult(null);
    } else {
      alert('Please select a valid image file');
    }
  };

  const analyzeImage = async () => {
    if (!selectedFile) {
      alert('Please select an image first');
      return;
    }

    setIsAnalyzing(true);
    setProgress(0);
    setResult(null);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('uploaderId', 'test-user');

      const response = await fetch('/api/moderation', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setProgress(100);

      const data = await response.json();
      setResult(data);

    } catch (error) {
      console.error('Analysis failed:', error);
      setResult({
        success: false,
        imageId: 'error',
        error: 'Failed to analyze image',
        details: (error as Error).message,
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsAnalyzing(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'allow': return 'bg-green-500';
      case 'monitor': return 'bg-yellow-500';
      case 'quarantine': return 'bg-red-500';
      case 'hold_for_review': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'allow': return <CheckCircle className="h-4 w-4" />;
      case 'monitor': return <AlertTriangle className="h-4 w-4" />;
      case 'quarantine': return <XCircle className="h-4 w-4" />;
      case 'hold_for_review': return <AlertTriangle className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Z.AI GLM-4.5 Content Moderation System</h1>
        <p className="text-muted-foreground">
          Test the complete multi-model content moderation pipeline
        </p>
      </div>

      <div className="grid gap-6">
        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Image Upload
            </CardTitle>
            <CardDescription>
              Select an image to analyze with GLM-4.5V, GLM-4.5-AIR, and GLM-4.5 models
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="w-full"
              disabled={isAnalyzing}
            >
              {selectedFile ? selectedFile.name : 'Choose Image File'}
            </Button>

            {selectedFile && (
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-sm font-medium">{selectedFile.name}</span>
                <span className="text-sm text-muted-foreground">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
            )}

            <Button
              onClick={analyzeImage}
              disabled={!selectedFile || isAnalyzing}
              className="w-full"
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze Image'}
            </Button>

            {isAnalyzing && (
              <div className="space-y-2">
                <Progress value={progress} className="w-full" />
                <p className="text-sm text-center text-muted-foreground">
                  Running multi-model analysis...
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Section */}
        {result && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Analysis Results
              </CardTitle>
              <CardDescription>
                {result.success ? 'Analysis completed successfully' : 'Analysis failed'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {result.success ? (
                <>
                  {/* Status Badge */}
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Success
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      ID: {result.imageId}
                    </span>
                  </div>

                  {/* Consensus Results */}
                  {result.consensus && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Top Detection:</span>
                        <Badge variant="secondary">
                          {result.consensus.topLabel}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="font-medium">Confidence:</span>
                        <div className="flex items-center gap-2">
                          <Progress 
                            value={result.consensus.score * 100} 
                            className="w-24"
                          />
                          <span className="text-sm">
                            {(result.consensus.score * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="font-medium">Recommended Action:</span>
                        <Badge 
                          variant="outline" 
                          className={getActionColor(result.consensus.recommendedAction)}
                        >
                          {getActionIcon(result.consensus.recommendedAction)}
                          <span className="ml-1 capitalize">
                            {result.consensus.recommendedAction.replace('_', ' ')}
                          </span>
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="font-medium">Model Agreement:</span>
                        <span className="text-sm">
                          {(result.consensus.spread * 100).toFixed(1)}% spread
                        </span>
                      </div>

                      {/* Models Used */}
                      {result.analysisDetails?.modelsUsed && (
                        <div className="space-y-2">
                          <span className="font-medium">Models Used:</span>
                          <div className="flex gap-2">
                            {result.analysisDetails.modelsUsed.map((model, index) => (
                              <Badge key={index} variant="outline">
                                {model}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Review Status */}
                      {result.analysisDetails?.reviewNeeded && (
                        <Alert>
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            This image has been flagged for human review due to sensitive content detection.
                          </AlertDescription>
                        </Alert>
                      )}

                      {/* Reasons */}
                      {result.consensus.reasons.length > 0 && (
                        <div className="space-y-2">
                          <span className="font-medium">Analysis Reasons:</span>
                          <ul className="text-sm space-y-1">
                            {result.consensus.reasons.map((reason, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="text-muted-foreground">•</span>
                                {reason}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-1">
                      <p><strong>Error:</strong> {result.error}</p>
                      {result.details && <p className="text-sm">{result.details}</p>}
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {/* Timestamp */}
              <div className="text-xs text-muted-foreground pt-2 border-t">
                Analyzed at: {new Date(result.timestamp).toLocaleString()}
              </div>
            </CardContent>
          </Card>
        )}

        {/* System Info */}
        <Card>
          <CardHeader>
            <CardTitle>System Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div><strong>Models:</strong> GLM-4.5V + GLM-4.5-AIR + GLM-4.5</div>
            <div><strong>Validation:</strong> AJV Schema Validation</div>
            <div><strong>Consensus:</strong> Multi-model Agreement Algorithm</div>
            <div><strong>Persistence:</strong> SQLite with Prisma ORM</div>
            <div><strong>Audit:</strong> Complete logging and review queue</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}