"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Loader2, Download, Sparkles, Wand2 } from "lucide-react";

export function AIBackgroundGenerator() {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("realistic");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const styles = [
    { value: "realistic", label: "Realistic" },
    { value: "abstract", label: "Abstract" },
    { value: "gradient", label: "Gradient" },
    { value: "texture", label: "Texture" },
    { value: "pattern", label: "Pattern" },
    { value: "nature", label: "Nature" },
    { value: "tech", label: "Technology" },
    { value: "minimalist", label: "Minimalist" },
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a description for the background");
      return;
    }

    setIsGenerating(true);
    setProgress(0);

    try {
      // Simulate generation progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setProgress(100);
      setGeneratedImage("https://via.placeholder.com/512x512/6366f1/ffffff?text=Generated+Background");
      
      toast.success("Background generated successfully!");
    } catch (error) {
      toast.error("Failed to generate background");
    } finally {
      setIsGenerating(false);
      clearInterval(progressInterval);
    }
  };

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = 'ai-background.png';
      link.click();
      toast.success("Background downloaded!");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Wand2 className="w-5 h-5" />
            <span>AI Background Generator</span>
            <Badge variant="secondary" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              <Sparkles className="w-3 h-3 mr-1" />
              AI Powered
            </Badge>
          </CardTitle>
          <CardDescription>
            Generate stunning backgrounds using AI. Describe what you want and let AI create it for you.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Describe your background
            </label>
            <Textarea
              placeholder="e.g., A serene mountain landscape at sunset with purple and orange sky..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Style
            </label>
            <div className="grid grid-cols-4 gap-2">
              {styles.map((styleOption) => (
                <Button
                  key={styleOption.value}
                  variant={style === styleOption.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStyle(styleOption.value)}
                  className="text-xs"
                >
                  {styleOption.label}
                </Button>
              ))}
            </div>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Background
              </>
            )}
          </Button>

          {isGenerating && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Generating background...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>

      {generatedImage && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Background</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center">
              <img
                src={generatedImage}
                alt="Generated background"
                className="max-w-full h-auto rounded-lg border"
                style={{ maxHeight: '400px' }}
              />
            </div>
            <div className="flex justify-center space-x-2">
              <Button onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" onClick={() => setGeneratedImage(null)}>
                Generate New
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}