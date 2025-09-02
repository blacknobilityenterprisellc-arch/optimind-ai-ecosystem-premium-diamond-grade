"use client";

import React, { useState, useEffect } from 'react';
import * as ort from 'onnxruntime-web';
import { 
  LucideImage, 
  LucideUpload, 
  LucideLoader, 
  LucideSparkles,
  LucideShield,
  LucideBrain,
  LucideCheckCircle,
  LucideAlertCircle
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface OnDeviceAnalyzerProps {
  onAnalysisComplete?: (result: string, confidence: number) => void;
  photo?: {
    id: string;
    name: string;
    url: string;
    file?: File;
  };
}

export const OnDeviceAnalyzer: React.FC<OnDeviceAnalyzerProps> = ({ 
  onAnalysisComplete, 
  photo 
}) => {
  const [modelLoaded, setModelLoaded] = useState(false);
  const [session, setSession] = useState<ort.InferenceSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');
  const [confidence, setConfidence] = useState<number>(0);
  const [image, setImage] = useState<string | null>(null);
  const [modelStatus, setModelStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [progress, setProgress] = useState(0);

  // Load the ONNX model when component mounts
  useEffect(() => {
    async function loadModel() {
      try {
        console.log('Loading V.AI GLM 4.5 ONNX model...');
        setModelStatus('loading');
        setProgress(10);
        setLoading(true);
        
        // For demo purposes, we'll simulate model loading
        // In production, replace with actual model loading:
        // const newSession = await ort.InferenceSession.create('./model/vibe_analyzer.onnx');
        
        // Simulate loading progress
        await new Promise(resolve => setTimeout(resolve, 500));
        setProgress(30);
        
        await new Promise(resolve => setTimeout(resolve, 500));
        setProgress(60);
        
        await new Promise(resolve => setTimeout(resolve, 500));
        setProgress(90);
        
        // Mock session for demo
        setSession({} as ort.InferenceSession);
        setModelLoaded(true);
        setModelStatus('ready');
        setProgress(100);
        setLoading(false);
        
        console.log('V.AI GLM 4.5 model loaded successfully!');
      } catch (error) {
        console.error('Failed to load ONNX model:', error);
        setModelStatus('error');
        setLoading(false);
      }
    }
    
    loadModel();
  }, []);

  // Handle photo prop changes
  useEffect(() => {
    if (photo) {
      setImage(photo.url);
      setResult('');
      setConfidence(0);
    }
  }, [photo]);

  // Handle the image file selection from the input
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult('');
        setConfidence(0);
      };
      reader.readAsDataURL(file);
    }
  };

  // Run the inference using the loaded model and the selected image
  const runInference = async () => {
    if (!session || !image) {
      return;
    }

    setLoading(true);
    setResult('');
    setConfidence(0);
    console.log('Running V.AI GLM 4.5 inference...');

    try {
      // Simulate inference progress
      setProgress(0);
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      clearInterval(progressInterval);
      setProgress(100);

      // Mock inference results for demonstration
      // In a real application, you would:
      // 1. Pre-process the image data (resize, normalize)
      // 2. Convert to ONNX Tensor with proper dimensions
      // 3. Run the session with the input tensor
      // 4. Post-process the output tensor
      
      const mockResults = [
        { text: "This image contains a friendly animal with high confidence", confidence: 0.95 },
        { text: "This image shows a natural landscape with good lighting", confidence: 0.87 },
        { text: "This image contains people in a social setting", confidence: 0.92 },
        { text: "This image shows architectural structures", confidence: 0.78 },
        { text: "This image contains text or documents", confidence: 0.83 }
      ];
      
      const selectedResult = mockResults[Math.floor(Math.random() * mockResults.length)];
      
      setResult(selectedResult.text);
      setConfidence(selectedResult.confidence);
      
      // Callback for parent component
      if (onAnalysisComplete) {
        onAnalysisComplete(selectedResult.text, selectedResult.confidence);
      }
      
      console.log('V.AI GLM 4.5 inference complete.');
    } catch (error) {
      console.error('Inference failed:', error);
      setResult('An error occurred during analysis.');
      setConfidence(0);
    } finally {
      setLoading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  const getStatusIcon = () => {
    if (loading) {
      return <LucideLoader size={20} className="animate-spin text-blue-500" />;
    }
    
    switch (modelStatus) {
      case 'ready':
        return <LucideSparkles size={20} className="text-emerald-500" />;
      case 'error':
        return <LucideAlertCircle size={20} className="text-red-500" />;
      default:
        return <LucideLoader size={20} className="animate-spin text-gray-500" />;
    }
  };

  const getStatusText = () => {
    if (loading) return 'Analyzing...';
    switch (modelStatus) {
      case 'ready': return 'Model Ready!';
      case 'error': return 'Model Error';
      default: return 'Initializing...';
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <LucideBrain className="w-6 h-6 text-blue-600" />
          <LucideShield className="w-6 h-6 text-green-600" />
        </div>
        <CardTitle className="text-2xl font-bold text-gray-800">
          V.AI GLM 4.5 On-Device Analyzer
        </CardTitle>
        <p className="text-gray-600">
          Secure, private photo analysis directly on your device
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Model Status */}
        <div className="flex items-center justify-center space-x-2 p-3 bg-gray-50 rounded-lg">
          {getStatusIcon()}
          <span className="text-sm font-medium text-gray-700">
            {getStatusText()}
          </span>
          {modelStatus === 'ready' && (
            <Badge variant="outline" className="text-emerald-600 border-emerald-200">
              On-Device
            </Badge>
          )}
        </div>

        {/* Progress Bar */}
        {progress > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Processing</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        )}

        {/* Image Upload and Display */}
        <div className="relative w-full aspect-video rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center overflow-hidden transition-colors hover:border-gray-400">
          {image ? (
            <img 
              src={image} 
              alt="Preview" 
              className="object-contain w-full h-full p-2" 
            />
          ) : (
            <div className="flex flex-col items-center space-y-2 text-gray-400 p-6 text-center">
              <LucideImage size={48} />
              <p className="text-sm font-medium">Select an image to analyze</p>
              <p className="text-xs text-gray-500">Click or drag a photo here</p>
            </div>
          )}
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageChange} 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
            disabled={loading}
          />
        </div>

        {/* Action Button */}
        <Button
          onClick={runInference}
          disabled={!modelLoaded || !image || loading}
          className="w-full py-3 text-lg font-semibold transition-all duration-200"
          variant={modelLoaded && image && !loading ? "default" : "secondary"}
        >
          {loading ? (
            <div className="flex items-center space-x-2">
              <LucideLoader size={20} className="animate-spin" />
              <span>Analyzing...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <LucideBrain size={20} />
              <span>Analyze Photo</span>
            </div>
          )}
        </Button>

        {/* Results */}
        {result && (
          <div className="space-y-3">
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <LucideCheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-emerald-800 mb-1">
                    Analysis Result:
                  </p>
                  <p className="text-emerald-700">{result}</p>
                  {confidence > 0 && (
                    <div className="mt-2 flex items-center space-x-2">
                      <span className="text-xs text-emerald-600">Confidence:</span>
                      <div className="flex-1 bg-emerald-200 rounded-full h-2">
                        <div 
                          className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${confidence * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-emerald-700">
                        {(confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
              <div className="flex items-center space-x-2 text-blue-700">
                <LucideShield size={16} />
                <span className="text-xs font-medium">
                  Analysis performed locally - your data never leaves your device
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {modelStatus === 'error' && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
            <div className="flex items-center space-x-2 text-red-700">
              <LucideAlertCircle size={20} />
              <span className="text-sm font-medium">
                Failed to load AI model. Please refresh the page and try again.
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};