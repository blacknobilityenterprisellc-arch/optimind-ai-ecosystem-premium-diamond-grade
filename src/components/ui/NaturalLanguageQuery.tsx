'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Sparkles, Lightbulb, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface QueryExample {
  category: string;
  examples: string[];
  icon: string;
}

interface NaturalLanguageQueryProps {
  onQuery: (query: string) => void;
  loading?: boolean;
}

export default function NaturalLanguageQuery({ onQuery, loading = false }: NaturalLanguageQueryProps) {
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [showExamples, setShowExamples] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const queryExamples: QueryExample[] = [
    {
      category: 'People & Faces',
      examples: [
        'Show me photos with Sarah and Tom',
        'Find pictures of my family at the beach',
        'Photos where everyone is smiling',
        'Show me group photos from last year'
      ],
      icon: '👥'
    },
    {
      category: 'Locations & Places',
      examples: [
        'Beach sunset photos',
        'Mountain hiking adventures',
        'City skyline at night',
        'Photos taken in Paris'
      ],
      icon: '📍'
    },
    {
      category: 'Time & Events',
      examples: [
        'Photos from summer vacation 2023',
        'Birthday party pictures',
        'Christmas morning photos',
        'Show me recent photos from this month'
      ],
      icon: '📅'
    },
    {
      category: 'Style & Quality',
      examples: [
        'High quality landscape photos',
        'Black and white portraits',
        'Photos with good lighting',
        'Artistic nature photography'
      ],
      icon: '🎨'
    },
    {
      category: 'Emotions & Actions',
      examples: [
        'People laughing and having fun',
        'Candid moments with friends',
        'Action sports photography',
        'Romantic dinner photos'
      ],
      icon: '😊'
    },
    {
      category: 'Technical & Advanced',
      examples: [
        'Photos taken with my DSLR camera',
        'Low light night photography',
        'Photos with shallow depth of field',
        'Drone aerial shots'
      ],
      icon: '⚙️'
    }
  ];

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = () => {
    if (query.trim()) {
      onQuery(query.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const startVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setQuery(transcript);
          setIsListening(false);
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
          toast({
            title: "Voice Input Error",
            description: "Unable to process voice input. Please try again.",
            variant: "destructive",
          });
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.start();
      } else {
        toast({
          title: "Voice Input Not Supported",
          description: "Your browser does not support speech recognition.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Voice Input Not Supported",
        description: "Your browser does not support speech recognition.",
        variant: "destructive",
      });
    }
  };

  const handleExampleClick = (example: string) => {
    setQuery(example);
    setShowExamples(false);
    setTimeout(() => handleSubmit(), 100);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-800">
            <Sparkles className="w-6 h-6" />
            Natural Language Search
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="w-4 h-4 text-purple-600" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Search your photos using everyday language. Our AI understands context, relationships, and natural expressions.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Describe what you're looking for... (e.g., 'beach sunset with family')"
                  className="pr-24 border-purple-300 focus:border-purple-500"
                  disabled={loading}
                />
                
                <Button
                  variant="ghost"
                  size="sm"
                  className={`absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 ${
                    isListening ? 'animate-pulse bg-red-100' : ''
                  }`}
                  onClick={startVoiceInput}
                  disabled={loading}
                >
                  <Mic className={`w-4 h-4 ${isListening ? 'text-red-600' : 'text-gray-600'}`} />
                </Button>
              </div>
              
              <Dialog open={showExamples} onOpenChange={setShowExamples}>
                <DialogTrigger asChild>
                  <Button variant="outline" disabled={loading}>
                    <Lightbulb className="w-4 h-4 mr-2" />
                    Examples
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Search Examples</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {queryExamples.map((category, index) => (
                      <Card key={index} className="border-gray-200">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm flex items-center gap-2">
                            <span className="text-lg">{category.icon}</span>
                            {category.category}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-2">
                            {category.examples.map((example, exampleIndex) => (
                              <Badge
                                key={exampleIndex}
                                variant="outline"
                                className="cursor-pointer hover:bg-purple-100 hover:border-purple-300 text-xs p-2 justify-start"
                                onClick={() => handleExampleClick(example)}
                              >
                                {example}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>

              <Button 
                onClick={handleSubmit} 
                disabled={loading || !query.trim()}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {loading ? (
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="bg-purple-100 rounded-lg p-3">
            <h4 className="font-medium text-sm text-purple-800 mb-2">💡 Pro Tips:</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-purple-700">
              <div>• Use natural, conversational language</div>
              <div>• Combine people, places, and time</div>
              <div>• Describe emotions or activities</div>
              <div>• Mention camera types or styles</div>
              <div>• Use relative terms like 'recent'</div>
              <div>• Try voice input for hands-free search</div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="text-center p-3 bg-white rounded-lg border border-purple-200">
              <div className="text-2xl mb-1">🧠</div>
              <div className="text-xs font-medium text-purple-800">Semantic Search</div>
              <div className="text-xs text-gray-600">Understands meaning</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border border-purple-200">
              <div className="text-2xl mb-1">🎯</div>
              <div className="text-xs font-medium text-purple-800">Context Aware</div>
              <div className="text-xs text-gray-600">Gets the context</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border border-purple-200">
              <div className="text-2xl mb-1">🔍</div>
              <div className="text-xs font-medium text-purple-800">Multi-Modal</div>
              <div className="text-xs text-gray-600">Search by any criteria</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border border-purple-200">
              <div className="text-2xl mb-1">📈</div>
              <div className="text-xs font-medium text-purple-800">Smart Ranking</div>
              <div className="text-xs text-gray-600">Best results first</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}