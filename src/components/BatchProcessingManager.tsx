'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Upload, 
  Play, 
  Pause, 
  Square, 
  Trash2, 
  Download, 
  RefreshCw,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  List,
  Zap,
  BarChart3,
  FileText,
  Image as ImageIcon
} from 'lucide-react';

interface BatchItem {
  id: string;
  filename: string;
  size: number;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  progress: number;
  result?: any;
  error?: string;
  startTime?: Date;
  endTime?: Date;
  processingTime?: number;
}

interface BatchJob {
  id: string;
  name: string;
  status: 'idle' | 'running' | 'paused' | 'completed' | 'failed';
  items: BatchItem[];
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  totalItems: number;
  processedItems: number;
  successfulItems: number;
  failedItems: number;
  settings: {
    maxConcurrency: number;
    priority: 'low' | 'medium' | 'high';
    retryFailed: boolean;
    maxRetries: number;
  };
}

export function BatchProcessingManager() {
  const [jobs, setJobs] = useState<BatchJob[]>([]);
  const [activeJob, setActiveJob] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // Simulate processing
  const processBatchItem = useCallback(async (jobId: string, itemId: string): Promise<void> => {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        setJobs(prev => prev.map(job => {
          if (job.id === jobId) {
            const updatedItems = job.items.map(item => {
              if (item.id === itemId && item.status === 'processing') {
                const newProgress = Math.min(item.progress + Math.random() * 20, 100);
                if (newProgress >= 100) {
                  clearInterval(interval);
                  // Simulate success/failure
                  const isSuccess = Math.random() > 0.1; // 90% success rate
                  return {
                    ...item,
                    progress: 100,
                    status: isSuccess ? 'completed' as const : 'failed' as const,
                    endTime: new Date(),
                    processingTime: Date.now() - (item.startTime?.getTime() || Date.now()),
                    result: isSuccess ? { confidence: Math.random() * 0.3 + 0.7 } : undefined,
                    error: isSuccess ? undefined : 'Processing failed due to model timeout'
                  };
                }
                return { ...item, progress: newProgress };
              }
              return item;
            });

            // Update job statistics
            const processed = updatedItems.filter(item => 
              item.status === 'completed' || item.status === 'failed'
            ).length;
            const successful = updatedItems.filter(item => item.status === 'completed').length;
            const failed = updatedItems.filter(item => item.status === 'failed').length;

            return {
              ...job,
              items: updatedItems,
              processedItems: processed,
              successfulItems: successful,
              failedItems: failed,
              status: processed === job.totalItems ? 'completed' as const : job.status
            };
          }
          return job;
        }));
        
        // Check if all items are processed
        const job = jobs.find(j => j.id === jobId);
        if (job && job.items.every(item => item.status !== 'processing')) {
          clearInterval(interval);
          resolve();
        }
      }, 500);
    });
  }, [jobs]);

  const startBatchProcessing = useCallback(async (jobId: string) => {
    setJobs(prev => prev.map(job => 
      job.id === jobId 
        ? { ...job, status: 'running', startedAt: new Date() }
        : job
    ));
    
    setIsProcessing(true);
    
    const job = jobs.find(j => j.id === jobId);
    if (!job) return;

    // Process items with concurrency control
    const processingQueue = job.items
      .filter(item => item.status === 'pending')
      .map(item => item.id);

    const maxConcurrency = job.settings.maxConcurrency;
    const processingPromises: Promise<void>[] = [];

    for (let i = 0; i < processingQueue.length; i += maxConcurrency) {
      const batch = processingQueue.slice(i, i + maxConcurrency);
      
      // Mark items as processing
      setJobs(prev => prev.map(job => {
        if (job.id === jobId) {
          const updatedItems = job.items.map(item => 
            batch.includes(item.id) 
              ? { ...item, status: 'processing', startTime: new Date() }
              : item
          );
          return { ...job, items: updatedItems };
        }
        return job;
      }));

      // Process the batch
      const batchPromises = batch.map(itemId => processBatchItem(jobId, itemId));
      processingPromises.push(...batchPromises);
      
      // Wait for batch to complete
      await Promise.all(batchPromises);
    }

    await Promise.all(processingPromises);
    setIsProcessing(false);
  }, [jobs, processBatchItem]);

  const pauseBatchProcessing = useCallback((jobId: string) => {
    setJobs(prev => prev.map(job => 
      job.id === jobId && job.status === 'running'
        ? { ...job, status: 'paused' }
        : job
    ));
    setIsProcessing(false);
  }, []);

  const cancelBatchProcessing = useCallback((jobId: string) => {
    setJobs(prev => prev.map(job => {
      if (job.id === jobId) {
        const updatedItems = job.items.map(item => 
          item.status === 'processing' || item.status === 'pending'
            ? { ...item, status: 'cancelled', endTime: new Date() }
            : item
        );
        return {
          ...job,
          status: 'failed',
          items: updatedItems,
          completedAt: new Date()
        };
      }
      return job;
    }));
    setIsProcessing(false);
  }, []);

  const createNewJob = useCallback((files: File[]) => {
    const newJob: BatchJob = {
      id: `job_${Date.now()}`,
      name: `Batch ${jobs.length + 1}`,
      status: 'idle',
      items: files.map((file, index) => ({
        id: `item_${Date.now()}_${index}`,
        filename: file.name,
        size: file.size,
        status: 'pending' as const,
        progress: 0
      })),
      createdAt: new Date(),
      totalItems: files.length,
      processedItems: 0,
      successfulItems: 0,
      failedItems: 0,
      settings: {
        maxConcurrency: 3,
        priority: 'medium',
        retryFailed: true,
        maxRetries: 3
      }
    };

    setJobs(prev => [newJob, ...prev]);
    setActiveJob(newJob.id);
    setSelectedFiles([]);
  }, [jobs.length]);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      setSelectedFiles(files);
    }
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'processing': return <Zap className="h-4 w-4 text-blue-600" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'paused': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'cancelled': return <XCircle className="h-4 w-4 text-gray-600" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${(ms / 60000).toFixed(1)}m`;
  };

  const activeJobData = activeJob ? jobs.find(job => job.id === activeJob) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Batch Processing</h2>
          <p className="text-muted-foreground">
            Process multiple images with queue management
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Results
          </Button>
          <Button variant="outline" onClick={() => setJobs([])}>
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        </div>
      </div>

      {/* Create New Batch */}
      <Card>
        <CardHeader>
          <CardTitle>Create New Batch Job</CardTitle>
          <CardDescription>
            Select multiple images to process in batch
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="batch-file-input"
              />
              <Button
                onClick={() => document.getElementById('batch-file-input')?.click()}
                variant="outline"
              >
                <Upload className="h-4 w-4 mr-2" />
                Select Images
              </Button>
              
              {selectedFiles.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''} selected
                  </span>
                  <Badge variant="outline">
                    {selectedFiles.reduce((total, file) => total + file.size, 0) > 0 
                      ? formatFileSize(selectedFiles.reduce((total, file) => total + file.size, 0))
                      : '0 Bytes'
                    }
                  </Badge>
                  <Button
                    onClick={() => createNewJob(selectedFiles)}
                    disabled={selectedFiles.length === 0}
                  >
                    Create Job
                  </Button>
                </div>
              )}
            </div>

            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Selected Files:</h4>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between text-sm p-2 bg-muted rounded">
                      <span className="truncate">{file.name}</span>
                      <span className="text-muted-foreground">{formatFileSize(file.size)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Batch Jobs List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Jobs Queue */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <List className="h-5 w-5" />
                Jobs Queue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {jobs.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No batch jobs created yet
                  </p>
                ) : (
                  jobs.map(job => (
                    <div
                      key={job.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        activeJob === job.id 
                          ? 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setActiveJob(job.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">{job.name}</span>
                        {getStatusIcon(job.status)}
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>{job.processedItems}/{job.totalItems} items</span>
                          <Badge className={getStatusColor(job.status)} variant="outline">
                            {job.status}
                          </Badge>
                        </div>
                        <Progress 
                          value={job.totalItems > 0 ? (job.processedItems / job.totalItems) * 100 : 0} 
                          className="h-1" 
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Job Details */}
        <div className="lg:col-span-2">
          {activeJobData ? (
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="items">Items</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                {/* Job Header */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>{activeJobData.name}</CardTitle>
                        <CardDescription>
                          Created {activeJobData.createdAt.toLocaleString()}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        {activeJobData.status === 'idle' && (
                          <Button
                            onClick={() => startBatchProcessing(activeJobData.id)}
                            disabled={isProcessing}
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Start
                          </Button>
                        )}
                        {activeJobData.status === 'running' && (
                          <Button
                            onClick={() => pauseBatchProcessing(activeJobData.id)}
                            variant="outline"
                          >
                            <Pause className="h-4 w-4 mr-2" />
                            Pause
                          </Button>
                        )}
                        {activeJobData.status === 'paused' && (
                          <Button
                            onClick={() => startBatchProcessing(activeJobData.id)}
                            disabled={isProcessing}
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Resume
                          </Button>
                        )}
                        {(activeJobData.status === 'running' || activeJobData.status === 'paused') && (
                          <Button
                            onClick={() => cancelBatchProcessing(activeJobData.id)}
                            variant="destructive"
                          >
                            <Square className="h-4 w-4 mr-2" />
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{activeJobData.totalItems}</div>
                        <div className="text-sm text-muted-foreground">Total Items</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{activeJobData.successfulItems}</div>
                        <div className="text-sm text-muted-foreground">Successful</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">{activeJobData.failedItems}</div>
                        <div className="text-sm text-muted-foreground">Failed</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">
                          {activeJobData.totalItems > 0 
                            ? Math.round((activeJobData.processedItems / activeJobData.totalItems) * 100)
                            : 0}%
                        </div>
                        <div className="text-sm text-muted-foreground">Complete</div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Progress 
                        value={activeJobData.totalItems > 0 
                          ? (activeJobData.processedItems / activeJobData.totalItems) * 100 
                          : 0
                        } 
                        className="h-2" 
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Processing Stats */}
                {activeJobData.startedAt && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Processing Statistics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Started:</span>
                          <div className="font-medium">
                            {activeJobData.startedAt.toLocaleString()}
                          </div>
                        </div>
                        {activeJobData.completedAt && (
                          <div>
                            <span className="text-muted-foreground">Completed:</span>
                            <div className="font-medium">
                              {activeJobData.completedAt.toLocaleString()}
                            </div>
                          </div>
                        )}
                        <div>
                          <span className="text-muted-foreground">Duration:</span>
                          <div className="font-medium">
                            {activeJobData.completedAt && activeJobData.startedAt
                              ? formatDuration(activeJobData.completedAt.getTime() - activeJobData.startedAt.getTime())
                              : 'In progress'
                            }
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="items" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Processing Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {activeJobData.items.map(item => (
                        <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3 flex-1">
                            {getStatusIcon(item.status)}
                            <div className="flex-1">
                              <div className="font-medium text-sm">{item.filename}</div>
                              <div className="text-xs text-muted-foreground">
                                {formatFileSize(item.size)}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-24">
                              <Progress value={item.progress} className="h-2" />
                            </div>
                            <Badge className={getStatusColor(item.status)} variant="outline">
                              {item.status}
                            </Badge>
                            {item.processingTime && (
                              <span className="text-xs text-muted-foreground">
                                {formatDuration(item.processingTime)}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Job Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 text-sm">
                      <div className="flex justify-between">
                        <span>Max Concurrency:</span>
                        <span className="font-medium">{activeJobData.settings.maxConcurrency}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Priority:</span>
                        <Badge variant="outline">{activeJobData.settings.priority}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Retry Failed Items:</span>
                        <span className="font-medium">
                          {activeJobData.settings.retryFailed ? 'Yes' : 'No'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Max Retries:</span>
                        <span className="font-medium">{activeJobData.settings.maxRetries}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <List className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Active Job</h3>
                <p className="text-muted-foreground">
                  Select a job from the queue to view details
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}