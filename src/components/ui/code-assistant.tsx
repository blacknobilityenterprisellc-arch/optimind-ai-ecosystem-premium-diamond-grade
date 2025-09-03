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
  Loader2, 
  Code, 
  FileText, 
  Search, 
  Bug, 
  Zap, 
  Copy, 
  Download,
  CheckCircle,
  AlertTriangle,
  Lightbulb
} from 'lucide-react';

interface CodeAssistantProps {
  className?: string;
}

interface CodeResult {
  content: string;
  model: string;
  cost: number;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export function CodeAssistant({ className }: CodeAssistantProps) {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [task, setTask] = useState('review');
  const [context, setContext] = useState('');
  const [result, setResult] = useState<CodeResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);

  const languages = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
    { value: 'csharp', label: 'C#' },
    { value: 'go', label: 'Go' },
    { value: 'rust', label: 'Rust' },
    { value: 'php', label: 'PHP' },
    { value: 'ruby', label: 'Ruby' },
    { value: 'swift', label: 'Swift' },
    { value: 'kotlin', label: 'Kotlin' }
  ];

  const tasks = [
    { 
      value: 'review', 
      label: 'Code Review', 
      icon: <Search className="h-4 w-4" />,
      description: 'Review code for bugs, performance issues, and best practices'
    },
    { 
      value: 'optimize', 
      label: 'Optimize', 
      icon: <Zap className="h-4 w-4" />,
      description: 'Optimize code for better performance and readability'
    },
    { 
      value: 'document', 
      label: 'Document', 
      icon: <FileText className="h-4 w-4" />,
      description: 'Generate comprehensive documentation and comments'
    },
    { 
      value: 'debug', 
      label: 'Debug', 
      icon: <Bug className="h-4 w-4" />,
      description: 'Identify and fix bugs in the code'
    },
    { 
      value: 'generate-tests', 
      label: 'Generate Tests', 
      icon: <CheckCircle className="h-4 w-4" />,
      description: 'Create unit tests and test cases'
    },
    { 
      value: 'refactor', 
      label: 'Refactor', 
      icon: <Code className="h-4 w-4" />,
      description: 'Refactor code for better structure and maintainability'
    }
  ];

  const processCode = async () => {
    if (!code.trim() || !language || !task) {
      alert('Please fill in all required fields');
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch('/api/code-assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          language,
          task,
          context
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setResult({
          content: data.result,
          model: data.model,
          cost: data.cost,
          usage: data.usage
        });
      } else {
        alert('Failed to process code: ' + data.error);
      }
    } catch (error) {
      console.error('Error processing code:', error);
      alert('Error processing code');
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = async () => {
    if (!result) return;
    
    try {
      await navigator.clipboard.writeText(result.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const downloadResult = () => {
    if (!result) return;
    
    const taskInfo = tasks.find(t => t.value === task);
    const filename = `${taskInfo?.label.toLowerCase().replace(/\s+/g, '_')}_${language}.${language === 'javascript' ? 'js' : language}`;
    
    const blob = new Blob([result.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getTaskIcon = (taskValue: string) => {
    const taskInfo = tasks.find(t => t.value === taskValue);
    return taskInfo?.icon || <Code className="h-4 w-4" />;
  };

  const getTaskDescription = (taskValue: string) => {
    const taskInfo = tasks.find(t => t.value === taskValue);
    return taskInfo?.description || '';
  };

  const codeExamples = {
    javascript: `// Example JavaScript function
function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i].price * items[i].quantity;
  }
  return total;
}`,
    python: `# Example Python function
def calculate_total(items):
    total = 0
    for item in items:
        total += item['price'] * item['quantity']
    return total`,
    java: `// Example Java method
public double calculateTotal(List<Item> items) {
    double total = 0.0;
    for (Item item : items) {
        total += item.getPrice() * item.getQuantity();
    }
    return total;
}`
  };

  const loadExample = () => {
    const example = codeExamples[language as keyof typeof codeExamples];
    if (example) {
      setCode(example);
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            AI Code Assistant
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Programming Language</label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Task</label>
              <Select value={task} onValueChange={setTask}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {tasks.map((taskOption) => (
                    <SelectItem key={taskOption.value} value={taskOption.value}>
                      <div className="flex items-center gap-2">
                        {taskOption.icon}
                        {taskOption.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Code *</label>
              <Button variant="outline" size="sm" onClick={loadExample}>
                Load Example
              </Button>
            </div>
            <Textarea
              placeholder={`Enter your ${language} code here...`}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows={8}
              className="font-mono text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Context (Optional)</label>
            <Textarea
              placeholder="Provide additional context about the code, project, or specific requirements..."
              value={context}
              onChange={(e) => setContext(e.target.value)}
              rows={3}
            />
          </div>

          <div className="bg-muted p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              {getTaskIcon(task)}
              <span className="font-medium">{tasks.find(t => t.value === task)?.label}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {getTaskDescription(task)}
            </p>
          </div>

          <Button 
            onClick={processCode} 
            disabled={isProcessing || !code.trim()}
            className="w-full"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                {getTaskIcon(task)}
                <span className="ml-2">{tasks.find(t => t.value === task)?.label} Code</span>
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getTaskIcon(task)}
                {tasks.find(t => t.value === task)?.label} Result
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={copyToClipboard}>
                  {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
                <Button variant="outline" size="sm" onClick={downloadResult}>
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </CardTitle>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Model: {result.model}</Badge>
              <Badge variant="secondary">Cost: ${result.cost.toFixed(4)}</Badge>
              <Badge variant="secondary">Tokens: {result.usage.totalTokens}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] w-full">
              <pre className="whitespace-pre-wrap text-sm bg-muted p-4 rounded-md">
                <code>{result.content}</code>
              </pre>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map((taskOption) => (
              <Button
                key={taskOption.value}
                variant="outline"
                className="h-auto p-4 flex flex-col items-start gap-2"
                onClick={() => {
                  setTask(taskOption.value);
                  if (!code) loadExample();
                }}
              >
                <div className="flex items-center gap-2 w-full">
                  {taskOption.icon}
                  <span className="font-medium">{taskOption.label}</span>
                </div>
                <p className="text-xs text-muted-foreground text-left">
                  {taskOption.description}
                </p>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}