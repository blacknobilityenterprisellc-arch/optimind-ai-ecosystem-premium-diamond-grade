'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Search, 
  Loader2, 
  Star, 
  TrendingUp, 
  Target, 
  Lightbulb,
  Copy,
  Download,
  ExternalLink,
  BookOpen,
  Code,
  Globe
} from 'lucide-react';

interface SmartSearchProps {
  className?: string;
}

interface SearchResult {
  content: string;
  model: string;
  cost: number;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

interface Recommendation {
  content: string;
  model: string;
  cost: number;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export function SmartSearch({ className }: SmartSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchContext, setSearchContext] = useState('');
  const [searchType, setSearchType] = useState('general');
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const [recommendationContext, setRecommendationContext] = useState('');
  const [recommendationType, setRecommendationType] = useState('content');
  const [recommendations, setRecommendations] = useState<Recommendation | null>(null);
  const [isGettingRecommendations, setIsGettingRecommendations] = useState(false);

  const searchTypes = [
    { value: 'general', label: 'General Search', icon: <Search className="h-4 w-4" /> },
    { value: 'code', label: 'Code Search', icon: <Code className="h-4 w-4" /> },
    { value: 'research', label: 'Research', icon: <BookOpen className="h-4 w-4" /> },
    { value: 'creative', label: 'Creative Ideas', icon: <Lightbulb className="h-4 w-4" /> }
  ];

  const recommendationTypes = [
    { value: 'content', label: 'Content Ideas', icon: <BookOpen className="h-4 w-4" /> },
    { value: 'products', label: 'Product Recommendations', icon: <Target className="h-4 w-4" /> },
    { value: 'actions', label: 'Action Items', icon: <TrendingUp className="h-4 w-4" /> },
    { value: 'strategies', label: 'Strategies', icon: <Star className="h-4 w-4" /> }
  ];

  const performSearch = async () => {
    if (!searchQuery.trim()) {
      alert('Please enter a search query');
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch('/api/smart-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: searchQuery,
          context: searchContext,
          type: searchType
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setSearchResults({
          content: data.results,
          model: data.model,
          cost: data.cost,
          usage: data.usage
        });
      } else {
        alert('Failed to search: ' + data.error);
      }
    } catch (error) {
      console.error('Error searching:', error);
      alert('Error performing search');
    } finally {
      setIsSearching(false);
    }
  };

  const getRecommendations = async () => {
    if (!recommendationContext.trim()) {
      alert('Please provide context for recommendations');
      return;
    }

    setIsGettingRecommendations(true);
    try {
      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          context: recommendationContext,
          type: recommendationType
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setRecommendations({
          content: data.recommendations,
          model: data.model,
          cost: data.cost,
          usage: data.usage
        });
      } else {
        alert('Failed to get recommendations: ' + data.error);
      }
    } catch (error) {
      console.error('Error getting recommendations:', error);
      alert('Error getting recommendations');
    } finally {
      setIsGettingRecommendations(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const searchExamples = {
    general: [
      "What are the latest trends in web development?",
      "How to improve user experience design?",
      "Best practices for project management"
    ],
    code: [
      "How to implement authentication in React?",
      "Python decorators explained with examples",
      "Optimize SQL query for large datasets"
    ],
    research: [
      "Impact of AI on software development industry",
      "Case studies of successful tech startups",
      "Latest research in machine learning"
    ],
    creative: [
      "Innovative features for a mobile app",
      "Creative marketing campaign ideas",
      "Unique approaches to team building"
    ]
  };

  const recommendationExamples = {
    content: [
      "Tech blog targeting developers interested in AI and web development",
      "Social media content for a SaaS product launch",
      "Newsletter content for a programming community"
    ],
    products: [
      "E-commerce platform selling electronics and gadgets",
      "Software tools for remote team collaboration",
      "Educational platform for learning programming"
    ],
    actions: [
      "Startup looking to improve user acquisition and retention",
      "Development team wanting to improve code quality",
      "Marketing team planning to increase brand awareness"
    ],
    strategies: [
      "Business expanding into new markets",
      "Company undergoing digital transformation",
      "Team adopting agile development practices"
    ]
  };

  const loadExample = (type: 'search' | 'recommendation', example: string) => {
    if (type === 'search') {
      setSearchQuery(example);
    } else {
      setRecommendationContext(example);
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <Tabs defaultValue="search" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="search">Smart Search</TabsTrigger>
          <TabsTrigger value="recommendations">AI Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                AI-Powered Smart Search
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Search Type</label>
                  <Select value={searchType} onValueChange={setSearchType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {searchTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            {type.icon}
                            {type.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Context (Optional)</label>
                  <Input
                    placeholder="Provide context for better results..."
                    value={searchContext}
                    onChange={(e) => setSearchContext(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Search Query *</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="What would you like to search for?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && performSearch()}
                    className="flex-1"
                  />
                  <Button onClick={performSearch} disabled={isSearching || !searchQuery.trim()}>
                    {isSearching ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Quick Examples</label>
                <div className="flex flex-wrap gap-2">
                  {searchExamples[searchType as keyof typeof searchExamples].map((example, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => loadExample('search', example)}
                      className="text-xs"
                    >
                      {example}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {searchResults && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {searchTypes.find(t => t.value === searchType)?.icon}
                    Search Results
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => copyToClipboard(searchResults.content)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => {
                      const blob = new Blob([searchResults.content], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `search_results_${searchType}.txt`;
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url);
                    }}>
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Model: {searchResults.model}</Badge>
                  <Badge variant="secondary">Cost: ${searchResults.cost.toFixed(4)}</Badge>
                  <Badge variant="secondary">Tokens: {searchResults.usage.totalTokens}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] w-full">
                  <div className="prose prose-sm max-w-none">
                    <div className="whitespace-pre-wrap">{searchResults.content}</div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                AI Recommendations Engine
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Recommendation Type</label>
                  <Select value={recommendationType} onValueChange={setRecommendationType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {recommendationTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            {type.icon}
                            {type.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Context *</label>
                <Textarea
                  placeholder="Describe your situation, project, or needs to get personalized recommendations..."
                  value={recommendationContext}
                  onChange={(e) => setRecommendationContext(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Quick Examples</label>
                <div className="flex flex-wrap gap-2">
                  {recommendationExamples[recommendationType as keyof typeof recommendationExamples].map((example, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => loadExample('recommendation', example)}
                      className="text-xs"
                    >
                      {example}
                    </Button>
                  ))}
                </div>
              </div>

              <Button 
                onClick={getRecommendations} 
                disabled={isGettingRecommendations || !recommendationContext.trim()}
                className="w-full"
              >
                {isGettingRecommendations ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Getting Recommendations...
                  </>
                ) : (
                  <>
                    {recommendationTypes.find(t => t.value === recommendationType)?.icon}
                    <span className="ml-2">
                      Get {recommendationTypes.find(t => t.value === recommendationType)?.label}
                    </span>
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {recommendations && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {recommendationTypes.find(t => t.value === recommendationType)?.icon}
                    {recommendationTypes.find(t => t.value === recommendationType)?.label}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => copyToClipboard(recommendations.content)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => {
                      const blob = new Blob([recommendations.content], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `recommendations_${recommendationType}.txt`;
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url);
                    }}>
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Model: {recommendations.model}</Badge>
                  <Badge variant="secondary">Cost: ${recommendations.cost.toFixed(4)}</Badge>
                  <Badge variant="secondary">Tokens: {recommendations.usage.totalTokens}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] w-full">
                  <div className="prose prose-sm max-w-none">
                    <div className="whitespace-pre-wrap">{recommendations.content}</div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}