'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { 
  Send, 
  Loader2, 
  Bot, 
  User, 
  Settings, 
  Copy, 
  Download, 
  Trash2,
  Zap,
  Brain,
  Code,
  MessageSquare
} from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  model?: string;
  cost?: number;
  tokens?: number;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  model: string;
  totalCost: number;
}

interface AIChatProps {
  className?: string;
}

export function AIChat({ className }: AIChatProps) {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('openai/gpt-4-turbo');
  const [temperature, setTemperature] = useState([0.7]);
  const [maxTokens, setMaxTokens] = useState([1000]);
  const [availableModels, setAvailableModels] = useState<any>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load available models on component mount
  useEffect(() => {
    loadModels();
    loadSessions();
  }, []);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentSession?.messages]);

  const loadModels = async () => {
    try {
      const response = await fetch('/api/chat');
      const data = await response.json();
      setAvailableModels(data.models);
      setSelectedModel(data.defaultModel);
    } catch (error) {
      console.error('Error loading models:', error);
    }
  };

  const loadSessions = () => {
    // In a real app, this would load from localStorage or a database
    const savedSessions = localStorage.getItem('ai-chat-sessions');
    if (savedSessions) {
      const parsed = JSON.parse(savedSessions);
      setSessions(parsed);
      if (parsed.length > 0) {
        setCurrentSession(parsed[0]);
      }
    }
  };

  const saveSessions = (updatedSessions: ChatSession[]) => {
    localStorage.setItem('ai-chat-sessions', JSON.stringify(updatedSessions));
    setSessions(updatedSessions);
  };

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      createdAt: new Date(),
      model: selectedModel,
      totalCost: 0
    };
    
    const updatedSessions = [newSession, ...sessions];
    saveSessions(updatedSessions);
    setCurrentSession(newSession);
  };

  const deleteSession = (sessionId: string) => {
    const updatedSessions = sessions.filter(s => s.id !== sessionId);
    saveSessions(updatedSessions);
    
    if (currentSession?.id === sessionId) {
      setCurrentSession(updatedSessions[0] || null);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || !currentSession || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    // Update current session with user message
    const updatedSession = {
      ...currentSession,
      messages: [...currentSession.messages, userMessage],
      title: currentSession.messages.length === 0 ? input.slice(0, 50) + '...' : currentSession.title
    };

    setCurrentSession(updatedSession);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedSession.messages.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          model: selectedModel,
          temperature: temperature[0],
          maxTokens: maxTokens[0]
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        const assistantMessage: Message = {
          role: 'assistant',
          content: data.response,
          timestamp: new Date(),
          model: data.model,
          cost: data.cost,
          tokens: data.usage.totalTokens
        };

        const finalSession = {
          ...updatedSession,
          messages: [...updatedSession.messages, assistantMessage],
          totalCost: updatedSession.totalCost + data.cost
        };

        setCurrentSession(finalSession);
        
        // Update sessions list
        const updatedSessions = sessions.map(s => 
          s.id === finalSession.id ? finalSession : s
        );
        saveSessions(updatedSessions);
      } else {
        alert('Failed to get response: ' + data.error);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Error sending message');
    } finally {
      setIsLoading(false);
    }
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const exportSession = () => {
    if (!currentSession) return;
    
    const exportData = {
      title: currentSession.title,
      model: currentSession.model,
      createdAt: currentSession.createdAt,
      messages: currentSession.messages,
      totalCost: currentSession.totalCost
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-session-${currentSession.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearSession = () => {
    if (!currentSession) return;
    
    const clearedSession = {
      ...currentSession,
      messages: [],
      title: 'New Chat',
      totalCost: 0
    };
    
    setCurrentSession(clearedSession);
    
    const updatedSessions = sessions.map(s => 
      s.id === clearedSession.id ? clearedSession : s
    );
    saveSessions(updatedSessions);
  };

  const getModelIcon = (model: string) => {
    if (model.includes('gpt')) return <Bot className="h-4 w-4" />;
    if (model.includes('claude')) return <Brain className="h-4 w-4" />;
    if (model.includes('gemini')) return <Zap className="h-4 w-4" />;
    if (model.includes('llama') || model.includes('mistral')) return <Code className="h-4 w-4" />;
    return <MessageSquare className="h-4 w-4" />;
  };

  const getModelCategory = (model: string) => {
    const modelInfo = availableModels[model];
    return modelInfo?.category || 'unknown';
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <Card className="h-[700px]">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              AI Assistant Chat
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={createNewSession}>
                New Chat
              </Button>
              {currentSession && (
                <>
                  <Button variant="outline" size="sm" onClick={exportSession}>
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={clearSession}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex h-[580px]">
          {/* Sidebar */}
          <div className="w-64 border-r pr-4 mr-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Chat Sessions</h3>
                <ScrollArea className="h-[200px]">
                  <div className="space-y-2">
                    {sessions.map((session) => (
                      <div
                        key={session.id}
                        className={`p-2 rounded cursor-pointer text-sm ${
                          currentSession?.id === session.id
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-muted'
                        }`}
                        onClick={() => setCurrentSession(session)}
                      >
                        <div className="flex items-center justify-between">
                          <span className="truncate">{session.title}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteSession(session.id);
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="text-xs opacity-70">
                          {session.messages.length} messages • ${session.totalCost.toFixed(4)}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Model Settings</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-muted-foreground">AI Model</label>
                    <Select value={selectedModel} onValueChange={setSelectedModel}>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(availableModels).map(([key, model]: [string, any]) => (
                          <SelectItem key={key} value={key}>
                            <div className="flex items-center gap-2">
                              {getModelIcon(key)}
                              <div>
                                <div className="font-medium">{model.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {model.provider} • ${model.cost}/1K tokens
                                </div>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-xs text-muted-foreground">
                      Temperature: {temperature[0]}
                    </label>
                    <Slider
                      value={temperature}
                      onValueChange={setTemperature}
                      max={2}
                      min={0}
                      step={0.1}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-muted-foreground">
                      Max Tokens: {maxTokens[0]}
                    </label>
                    <Slider
                      value={maxTokens}
                      onValueChange={setMaxTokens}
                      max={4000}
                      min={100}
                      step={100}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col">
            {currentSession ? (
              <>
                <ScrollArea className="flex-1 mb-4 p-4 border rounded-lg">
                  <div className="space-y-4">
                    {currentSession.messages.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Start a conversation with AI</p>
                        <p className="text-sm">Ask questions, get help, or just chat!</p>
                      </div>
                    ) : (
                      currentSession.messages.map((message, index) => (
                        <div
                          key={index}
                          className={`flex gap-3 ${
                            message.role === 'user' ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <div
                            className={`flex gap-2 max-w-[80%] ${
                              message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                            }`}
                          >
                            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                              message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                            }`}>
                              {message.role === 'user' ? (
                                <User className="h-4 w-4" />
                              ) : (
                                getModelIcon(message.model || selectedModel)
                              )}
                            </div>
                            <div className="space-y-1">
                              <div
                                className={`p-3 rounded-lg ${
                                  message.role === 'user'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted'
                                }`}
                              >
                                <p className="whitespace-pre-wrap">{message.content}</p>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>
                                  {message.timestamp.toLocaleTimeString()}
                                </span>
                                {message.model && (
                                  <Badge variant="outline" className="text-xs">
                                    {availableModels[message.model]?.name || message.model}
                                  </Badge>
                                )}
                                {message.cost && (
                                  <span>${message.cost.toFixed(4)}</span>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyMessage(message.content)}
                                  className="h-4 w-4 p-0"
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                    {isLoading && (
                      <div className="flex gap-3 justify-start">
                        <div className="flex gap-2 max-w-[80%]">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-muted">
                            {getModelIcon(selectedModel)}
                          </div>
                          <div className="space-y-1">
                            <div className="p-3 rounded-lg bg-muted">
                              <div className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>AI is thinking...</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                <div className="flex gap-2">
                  <Input
                    placeholder="Type your message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button onClick={sendMessage} disabled={isLoading || !input.trim()}>
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {availableModels[selectedModel]?.name || selectedModel}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {getModelCategory(selectedModel)}
                    </Badge>
                  </div>
                  <div>
                    Session Cost: ${currentSession.totalCost.toFixed(4)}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No chat session selected</p>
                  <p className="text-sm">Create a new chat to get started</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}