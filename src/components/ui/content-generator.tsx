'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Wand2, Copy, Download } from 'lucide-react';

interface ContentGeneratorProps {
  className?: string;
}

export function ContentGenerator({ className }: ContentGeneratorProps) {
  const [topic, setTopic] = useState('');
  const [contentType, setContentType] = useState('');
  const [tone, setTone] = useState('professional');
  const [length, setLength] = useState('medium');
  const [keywords, setKeywords] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationInfo, setGenerationInfo] = useState<{
    model: string;
    cost: number;
    usage: { promptTokens: number; completionTokens: number; totalTokens: number };
  } | null>(null);

  const contentTypes = [
    { value: 'blog', label: 'Blog Post' },
    { value: 'article', label: 'Article' },
    { value: 'product-description', label: 'Product Description' },
    { value: 'social-media', label: 'Social Media Post' },
    { value: 'email', label: 'Email' },
    { value: 'documentation', label: 'Documentation' }
  ];

  const tones = [
    { value: 'professional', label: 'Professional' },
    { value: 'casual', label: 'Casual' },
    { value: 'friendly', label: 'Friendly' },
    { value: 'formal', label: 'Formal' },
    { value: 'enthusiastic', label: 'Enthusiastic' }
  ];

  const lengths = [
    { value: 'short', label: 'Short (200-500 words)' },
    { value: 'medium', label: 'Medium (500-1000 words)' },
    { value: 'long', label: 'Long (1000+ words)' }
  ];

  const generateContent = async () => {
    if (!topic || !contentType) {
      alert('Please fill in the topic and content type');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/content/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          contentType,
          tone,
          length,
          keywords: keywords.split(',').map(k => k.trim()).filter(k => k),
          targetAudience
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setGeneratedContent(data.content);
        setGenerationInfo({
          model: data.model,
          cost: data.cost,
          usage: data.usage
        });
      } else {
        alert('Failed to generate content: ' + data.error);
      }
    } catch (error) {
      console.error('Error generating content:', error);
      alert('Error generating content');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent);
  };

  const downloadContent = () => {
    const blob = new Blob([generatedContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${topic.replace(/\s+/g, '_')}_${contentType}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5" />
            AI Content Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Topic *</label>
              <Input
                placeholder="Enter your topic..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Content Type *</label>
              <Select value={contentType} onValueChange={setContentType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select content type" />
                </SelectTrigger>
                <SelectContent>
                  {contentTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tone</label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {tones.map((toneOption) => (
                    <SelectItem key={toneOption.value} value={toneOption.value}>
                      {toneOption.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Length</label>
              <Select value={length} onValueChange={setLength}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {lengths.map((lengthOption) => (
                    <SelectItem key={lengthOption.value} value={lengthOption.value}>
                      {lengthOption.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Target Audience</label>
              <Input
                placeholder="e.g., developers, marketers"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Keywords (comma-separated)</label>
            <Input
              placeholder="e.g., AI, technology, innovation"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
            />
          </div>

          <Button 
            onClick={generateContent} 
            disabled={isGenerating || !topic || !contentType}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Generate Content
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {generatedContent && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Generated Content
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={copyToClipboard}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
                <Button variant="outline" size="sm" onClick={downloadContent}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </CardTitle>
            {generationInfo && (
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Model: {generationInfo.model}</Badge>
                <Badge variant="secondary">Cost: ${generationInfo.cost.toFixed(4)}</Badge>
                <Badge variant="secondary">Tokens: {generationInfo.usage.totalTokens}</Badge>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] w-full border rounded-md p-4">
              <div className="whitespace-pre-wrap">{generatedContent}</div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}