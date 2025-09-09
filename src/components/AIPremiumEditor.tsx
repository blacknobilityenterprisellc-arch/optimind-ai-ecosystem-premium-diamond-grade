'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export function AIPremiumEditor() {
  const [content, setContent] = useState('');
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [enhancedContent, setEnhancedContent] = useState('');

  const enhancementOptions = [
    { value: 'grammar', label: 'Grammar & Spelling' },
    { value: 'style', label: 'Style & Tone' },
    { value: 'clarity', label: 'Clarity & Readability' },
    { value: 'creativity', label: 'Creativity & Engagement' },
    { value: 'professional', label: 'Professional Polish' },
    { value: 'concise', label: 'Make More Concise' },
    { value: 'detailed', label: 'Add More Detail' },
    { value: 'seo', label: 'SEO Optimization' },
  ];

  const handleEnhance = async () => {
    if (!content.trim()) {
      toast.error('Please enter some content to enhance');
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    let progressInterval: NodeJS.Timeout;

    try {
      // Simulate enhancement progress
      progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 15;
        });
      }, 300);

      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 2500));

      setProgress(100);

      // Simple enhancement simulation
      const enhanced = content
        .split('. ')
        .map(sentence => sentence.trim() + (sentence.endsWith('.') ? '' : '.'))
        .filter(s => s.length > 0)
        .join('. ')
        .replace(/\b(\w+)\s+\1\b/g, '$1') // Remove duplicate words
        .replace(/([.!?])\s*([a-z])/g, '$1 $2') // Fix spacing
        .trim();

      setEnhancedContent(enhanced);
      toast.success('Content enhanced successfully!');
    } catch {
      toast.error('Failed to enhance content');
    } finally {
      setIsProcessing(false);
      if (progressInterval) {
        clearInterval(progressInterval);
      }
    }
  };

  const handleSave = () => {
    if (enhancedContent) {
      // Simulate saving
      toast.success('Content saved successfully!');
    }
  };

  const handleDownload = () => {
    if (enhancedContent) {
      const blob = new Blob([enhancedContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'enhanced-content.txt';
      link.click();
      URL.revokeObjectURL(url);
      toast.success('Content downloaded!');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Edit3 className="w-5 h-5" />
            <span>AI Premium Editor</span>
            <Badge
              variant="secondary"
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
            >
              <Sparkles className="w-3 h-3 mr-1" />
              Premium
            </Badge>
          </CardTitle>
          <CardDescription>
            Enhance your content with advanced AI editing capabilities. Improve grammar, style,
            clarity, and more.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Your Content</label>
            <Textarea
              placeholder="Enter your content here to enhance..."
              value={content}
              onChange={e => setContent(e.target.value)}
              className="min-h-[150px]"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Enhancement Instructions (Optional)
            </label>
            <Textarea
              placeholder="e.g., Make this more professional and engaging..."
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              className="min-h-[80px]"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {enhancementOptions.map(option => (
              <Badge
                key={option.value}
                variant="outline"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                onClick={() => setPrompt(prev => prev + (prev ? ', ' : '') + option.label)}
              >
                {option.label}
              </Badge>
            ))}
          </div>

          <Button
            onClick={handleEnhance}
            disabled={isProcessing || !content.trim()}
            className="w-full"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Enhancing...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 mr-2" />
                Enhance Content
              </>
            )}
          </Button>

          {isProcessing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Enhancing content...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>

      {enhancedContent && (
        <Card>
          <CardHeader>
            <CardTitle>Enhanced Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={enhancedContent}
              onChange={e => setEnhancedContent(e.target.value)}
              className="min-h-[200px]"
            />
            <div className="flex justify-center space-x-2">
              <Button onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" onClick={() => setEnhancedContent('')}>
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
