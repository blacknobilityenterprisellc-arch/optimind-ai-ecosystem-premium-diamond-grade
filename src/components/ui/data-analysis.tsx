'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Loader2, 
  Download,
  Copy,
  FileText,
  Users,
  DollarSign,
  Activity,
  Target,
  Brain,
  Lightbulb
} from 'lucide-react';

interface DataAnalysisProps {
  className?: string;
}

interface AnalysisResult {
  content: string;
  model: string;
  cost: number;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export function DataAnalysis({ className }: DataAnalysisProps) {
  const [dataInput, setDataInput] = useState('');
  const [analysisType, setAnalysisType] = useState('general');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analysisTypes = [
    { value: 'general', label: 'General Analysis', icon: <BarChart3 className="h-4 w-4" /> },
    { value: 'trends', label: 'Trend Analysis', icon: <TrendingUp className="h-4 w-4" /> },
    { value: 'patterns', label: 'Pattern Recognition', icon: <Activity className="h-4 w-4" /> },
    { value: 'insights', label: 'Business Insights', icon: <Brain className="h-4 w-4" /> },
    { value: 'recommendations', label: 'Recommendations', icon: <Lightbulb className="h-4 w-4" /> },
    { value: 'forecasting', label: 'Forecasting', icon: <Target className="h-4 w-4" /> }
  ];

  const dataTemplates = {
    sales: `Sales Data (Last 6 Months):
January: $45,000
February: $52,000
March: $48,000
April: $61,000
May: $58,000
June: $67,000

Products:
- Product A: 120 units sold
- Product B: 89 units sold
- Product C: 156 units sold
- Product D: 73 units sold`,

    users: `User Analytics:
Total Users: 12,450
Active Users: 8,230
New Users (Last 30 days): 1,890
User Retention: 78%

Demographics:
- Age 18-24: 25%
- Age 25-34: 40%
- Age 35-44: 20%
- Age 45+: 15%

Device Usage:
- Mobile: 65%
- Desktop: 30%
- Tablet: 5%`,

    performance: `Website Performance Metrics:
Page Load Time: 2.3 seconds
Bounce Rate: 42%
Conversion Rate: 3.2%
Average Session Duration: 4:15

Top Pages:
- Homepage: 15,230 visits
- Product Page: 12,100 visits
- About Us: 8,450 visits
- Contact: 3,200 visits

Error Rate: 1.2%`
  };

  const analyzeData = async () => {
    if (!dataInput.trim()) {
      alert('Please provide data to analyze');
      return;
    }

    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/analyze-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: dataInput,
          analysisType
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setAnalysisResult({
          content: data.analysis,
          model: data.model,
          cost: data.cost,
          usage: data.usage
        });
      } else {
        alert('Failed to analyze data: ' + data.error);
      }
    } catch (error) {
      console.error('Error analyzing data:', error);
      alert('Error analyzing data');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const loadTemplate = (template: string) => {
    setDataInput(dataTemplates[template as keyof typeof dataTemplates]);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const downloadAnalysis = () => {
    if (!analysisResult) return;
    
    const blob = new Blob([analysisResult.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `data_analysis_${analysisType}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getAnalysisIcon = (type: string) => {
    const analysisTypeInfo = analysisTypes.find(t => t.value === type);
    return analysisTypeInfo?.icon || <BarChart3 className="h-4 w-4" />;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            AI Data Analysis Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Analysis Type</label>
              <Select value={analysisType} onValueChange={setAnalysisType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {analysisTypes.map((type) => (
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
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Data Input *</label>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => loadTemplate('sales')}>
                  <DollarSign className="h-4 w-4 mr-1" />
                  Sales
                </Button>
                <Button variant="outline" size="sm" onClick={() => loadTemplate('users')}>
                  <Users className="h-4 w-4 mr-1" />
                  Users
                </Button>
                <Button variant="outline" size="sm" onClick={() => loadTemplate('performance')}>
                  <Activity className="h-4 w-4 mr-1" />
                  Performance
                </Button>
              </div>
            </div>
            <Textarea
              placeholder="Paste your data here (CSV, JSON, or structured text)..."
              value={dataInput}
              onChange={(e) => setDataInput(e.target.value)}
              rows={8}
              className="font-mono text-sm"
            />
          </div>

          <div className="bg-muted p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              {getAnalysisIcon(analysisType)}
              <span className="font-medium">{analysisTypes.find(t => t.value === analysisType)?.label}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {analysisType === 'general' && 'Comprehensive analysis of your data with key insights and patterns.'}
              {analysisType === 'trends' && 'Identify trends and patterns in your data over time.'}
              {analysisType === 'patterns' && 'Discover hidden patterns and correlations in your data.'}
              {analysisType === 'insights' && 'Extract actionable business insights from your data.'}
              {analysisType === 'recommendations' && 'Get data-driven recommendations for improvement.'}
              {analysisType === 'forecasting' && 'Predict future trends based on historical data.'}
            </p>
          </div>

          <Button 
            onClick={analyzeData} 
            disabled={isAnalyzing || !dataInput.trim()}
            className="w-full"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing Data...
              </>
            ) : (
              <>
                {getAnalysisIcon(analysisType)}
                <span className="ml-2">Analyze Data</span>
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {analysisResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getAnalysisIcon(analysisType)}
                Analysis Results
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(analysisResult.content)}>
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={downloadAnalysis}>
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </CardTitle>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Model: {analysisResult.model}</Badge>
              <Badge variant="secondary">Cost: ${analysisResult.cost.toFixed(4)}</Badge>
              <Badge variant="secondary">Tokens: {analysisResult.usage.totalTokens}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px] w-full">
              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-wrap">{analysisResult.content}</div>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Analysis Types Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Available Analysis Types
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analysisTypes.map((type) => (
              <div
                key={type.value}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  analysisType === type.value ? 'border-primary bg-primary/5' : 'hover:bg-muted'
                }`}
                onClick={() => setAnalysisType(type.value)}
              >
                <div className="flex items-center gap-2 mb-2">
                  {type.icon}
                  <span className="font-medium">{type.label}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {type.value === 'general' && 'Comprehensive data analysis with key insights'}
                  {type.value === 'trends' && 'Identify trends and patterns over time'}
                  {type.value === 'patterns' && 'Discover hidden correlations and patterns'}
                  {type.value === 'insights' && 'Extract actionable business insights'}
                  {type.value === 'recommendations' && 'Get data-driven recommendations'}
                  {type.value === 'forecasting' && 'Predict future trends and outcomes'}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}