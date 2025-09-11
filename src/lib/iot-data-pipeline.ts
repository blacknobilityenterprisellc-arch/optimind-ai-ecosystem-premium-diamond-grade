/**
 * OptiMind AI Ecosystem - IoT Data Processing Pipeline
 *
 * Real-time sensor data ingestion, processing, and analysis pipeline for IoT devices.
 * This system handles high-volume data streams, performs real-time analytics,
 * and enables intelligent data processing for IoT applications.
 *
 * Features:
 * - Real-time data ingestion from multiple protocols
 * - Stream processing with windowing and aggregation
 * - Anomaly detection and pattern recognition
 * - Data quality validation and cleansing
 * - Predictive analytics and forecasting
 * - Real-time alerting and notifications
 */

import { EventEmitter } from 'events';
import { v4 as uuidv4 } from 'uuid';
import { 
  IoTDataPoint, 
  DataQuality, 
  IoTDevice, 
  IoTDeviceType,
  Alert,
  DeviceStatus 
} from './iot-integration-system';

// Pipeline Configuration
export interface PipelineConfig {
  batchSize: number;
  batchTimeout: number; // in milliseconds
  maxRetries: number;
  retryDelay: number;
  parallelProcessing: boolean;
  workerCount: number;
  enableCompression: boolean;
  enableEncryption: boolean;
  dataRetention: number; // in hours
  alertThresholds: AlertThresholdConfig[];
}

export interface AlertThresholdConfig {
  parameter: string;
  condition: 'greater_than' | 'less_than' | 'equals' | 'not_equals' | 'between' | 'anomaly';
  value: number | [number, number];
  severity: 'low' | 'medium' | 'high' | 'critical';
  windowSize: number; // for moving averages
  sensitivity: number; // for anomaly detection
}

// Data Processing Stages
export interface ProcessingStage {
  id: string;
  name: string;
  type: 'ingestion' | 'validation' | 'transformation' | 'analysis' | 'storage' | 'notification';
  config: any;
  status: 'idle' | 'processing' | 'error' | 'completed';
  metrics: StageMetrics;
}

export interface StageMetrics {
  processed: number;
  failed: number;
  averageTime: number;
  lastProcessed: Date;
  throughput: number; // records per second
}

// Data Window Types
export interface TimeWindow {
  start: Date;
  end: Date;
  size: number; // in milliseconds
  type: 'tumbling' | 'sliding' | 'session';
}

export interface DataWindow {
  id: string;
  deviceId: string;
  parameter: string;
  window: TimeWindow;
  dataPoints: IoTDataPoint[];
  statistics: WindowStatistics;
  quality: DataQuality;
}

export interface WindowStatistics {
  count: number;
  min: number;
  max: number;
  sum: number;
  average: number;
  median: number;
  variance: number;
  standardDeviation: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  rateOfChange: number;
}

// Anomaly Detection
export interface AnomalyDetector {
  id: string;
  type: 'statistical' | 'ml_based' | 'rule_based' | 'isolation_forest';
  config: any;
  sensitivity: number;
}

export interface AnomalyResult {
  id: string;
  deviceId: string;
  parameter: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  description: string;
  dataPoint: IoTDataPoint;
  context: any;
}

// Data Quality Rules
export interface QualityRule {
  id: string;
  name: string;
  type: 'range' | 'pattern' | 'consistency' | 'completeness' | 'timeliness';
  condition: any;
  action: 'accept' | 'reject' | 'flag' | 'correct';
  severity: 'low' | 'medium' | 'high';
}

// Aggregation Functions
export interface Aggregation {
  id: string;
  type: 'sum' | 'average' | 'min' | 'max' | 'count' | 'stddev' | 'percentile';
  window: TimeWindow;
  groupBy: string[];
  filters: any[];
}

export interface AggregationResult {
  id: string;
  deviceId: string;
  parameter: string;
  window: TimeWindow;
  result: number | object;
  timestamp: Date;
  quality: DataQuality;
}

// Stream Processing
export interface StreamProcessor {
  id: string;
  name: string;
  description: string;
  input: StreamDefinition;
  output: StreamDefinition;
  operations: ProcessingOperation[];
  state: 'stopped' | 'running' | 'error';
  metrics: ProcessorMetrics;
}

export interface StreamDefinition {
  deviceId?: string;
  parameter?: string;
  protocol?: string;
  qualityFilter?: DataQuality[];
  timeRange?: TimeWindow;
}

export interface ProcessingOperation {
  id: string;
  type: 'filter' | 'map' | 'aggregate' | 'join' | 'window' | 'detect' | 'transform';
  config: any;
  condition?: any;
}

export interface ProcessorMetrics {
  recordsProcessed: number;
  averageLatency: number;
  throughput: number;
  errorRate: number;
  lastUpdated: Date;
}

class IoTDataPipeline extends EventEmitter {
  private config: PipelineConfig;
  private stages: Map<string, ProcessingStage> = new Map();
  private dataWindows: Map<string, DataWindow[]> = new Map();
  private anomalyDetectors: Map<string, AnomalyDetector> = new Map();
  private qualityRules: Map<string, QualityRule> = new Map();
  private streamProcessors: Map<string, StreamProcessor> = new Map();
  private aggregations: Map<string, Aggregation> = new Map();
  private dataBuffer: IoTDataPoint[] = [];
  private isRunning: boolean = false;
  private processingInterval?: NodeJS.Timeout;

  constructor(config: Partial<PipelineConfig> = {}) {
    super();
    this.config = {
      batchSize: config.batchSize || 100,
      batchTimeout: config.batchTimeout || 5000,
      maxRetries: config.maxRetries || 3,
      retryDelay: config.retryDelay || 1000,
      parallelProcessing: config.parallelProcessing ?? true,
      workerCount: config.workerCount || 4,
      enableCompression: config.enableCompression ?? true,
      enableEncryption: config.enableEncryption ?? true,
      dataRetention: config.dataRetention || 24,
      alertThresholds: config.alertThresholds || [],
    };

    this.initializePipeline();
  }

  private initializePipeline(): void {
    console.log('🔄 Initializing OptiMind AI Ecosystem - IoT Data Processing Pipeline...');
    
    // Initialize processing stages
    this.initializeStages();
    
    // Initialize anomaly detectors
    this.initializeAnomalyDetectors();
    
    // Initialize quality rules
    this.initializeQualityRules();
    
    // Initialize default aggregations
    this.initializeAggregations();
    
    console.log('✅ IoT Data Processing Pipeline initialized successfully');
  }

  private initializeStages(): void {
    const stages: ProcessingStage[] = [
      {
        id: 'ingestion',
        name: 'Data Ingestion',
        type: 'ingestion',
        config: { bufferSize: 10000, compression: this.config.enableCompression },
        status: 'idle',
        metrics: { processed: 0, failed: 0, averageTime: 0, lastProcessed: new Date(), throughput: 0 },
      },
      {
        id: 'validation',
        name: 'Data Validation',
        type: 'validation',
        config: { strictMode: true, autoCorrect: true },
        status: 'idle',
        metrics: { processed: 0, failed: 0, averageTime: 0, lastProcessed: new Date(), throughput: 0 },
      },
      {
        id: 'transformation',
        name: 'Data Transformation',
        type: 'transformation',
        config: { normalization: true, unitConversion: true },
        status: 'idle',
        metrics: { processed: 0, failed: 0, averageTime: 0, lastProcessed: new Date(), throughput: 0 },
      },
      {
        id: 'analysis',
        name: 'Real-time Analysis',
        type: 'analysis',
        config: { anomalyDetection: true, patternRecognition: true },
        status: 'idle',
        metrics: { processed: 0, failed: 0, averageTime: 0, lastProcessed: new Date(), throughput: 0 },
      },
      {
        id: 'storage',
        name: 'Data Storage',
        type: 'storage',
        config: { retention: this.config.dataRetention, compression: this.config.enableCompression },
        status: 'idle',
        metrics: { processed: 0, failed: 0, averageTime: 0, lastProcessed: new Date(), throughput: 0 },
      },
      {
        id: 'notification',
        name: 'Alert Notification',
        type: 'notification',
        config: { channels: ['email', 'webhook', 'sms'], priority: true },
        status: 'idle',
        metrics: { processed: 0, failed: 0, averageTime: 0, lastProcessed: new Date(), throughput: 0 },
      },
    ];

    stages.forEach(stage => {
      this.stages.set(stage.id, stage);
    });
  }

  private initializeAnomalyDetectors(): void {
    const detectors: AnomalyDetector[] = [
      {
        id: 'statistical_outlier',
        type: 'statistical',
        config: { method: 'zscore', threshold: 3.0 },
        sensitivity: 0.8,
      },
      {
        id: 'moving_average_anomaly',
        type: 'statistical',
        config: { method: 'moving_average', windowSize: 10, threshold: 2.0 },
        sensitivity: 0.7,
      },
      {
        id: 'pattern_anomaly',
        type: 'ml_based',
        config: { model: 'isolation_forest', contamination: 0.1 },
        sensitivity: 0.9,
      },
    ];

    detectors.forEach(detector => {
      this.anomalyDetectors.set(detector.id, detector);
    });
  }

  private initializeQualityRules(): void {
    const rules: QualityRule[] = [
      {
        id: 'range_validation',
        name: 'Range Validation',
        type: 'range',
        condition: { min: -1000, max: 1000 },
        action: 'flag',
        severity: 'medium',
      },
      {
        id: 'timestamp_validation',
        name: 'Timestamp Validation',
        type: 'timeliness',
        condition: { maxAge: 300000 }, // 5 minutes
        action: 'reject',
        severity: 'high',
      },
      {
        id: 'completeness_check',
        name: 'Completeness Check',
        type: 'completeness',
        condition: { requiredFields: ['deviceId', 'parameter', 'value', 'timestamp'] },
        action: 'reject',
        severity: 'high',
      },
      {
        id: 'consistency_check',
        name: 'Consistency Check',
        type: 'consistency',
        condition: { dataType: 'number' },
        action: 'flag',
        severity: 'medium',
      },
    ];

    rules.forEach(rule => {
      this.qualityRules.set(rule.id, rule);
    });
  }

  private initializeAggregations(): void {
    const aggregations: Aggregation[] = [
      {
        id: '1min_average',
        type: 'average',
        window: { start: new Date(), end: new Date(), size: 60000, type: 'tumbling' },
        groupBy: ['deviceId', 'parameter'],
        filters: [],
      },
      {
        id: '5min_sum',
        type: 'sum',
        window: { start: new Date(), end: new Date(), size: 300000, type: 'tumbling' },
        groupBy: ['deviceId', 'parameter'],
        filters: [],
      },
      {
        id: '1hour_max',
        type: 'max',
        window: { start: new Date(), end: new Date(), size: 3600000, type: 'tumbling' },
        groupBy: ['deviceId', 'parameter'],
        filters: [],
      },
    ];

    aggregations.forEach(agg => {
      this.aggregations.set(agg.id, agg);
    });
  }

  // Pipeline Control Methods
  async start(): Promise<void> {
    if (this.isRunning) {
      console.log('⚠️ Pipeline is already running');
      return;
    }

    this.isRunning = true;
    
    // Start batch processing
    this.processingInterval = setInterval(() => {
      this.processBatch();
    }, this.config.batchTimeout);

    // Start window management
    this.startWindowManagement();

    // Start stream processors
    this.startStreamProcessors();

    console.log('🚀 IoT Data Processing Pipeline started');
    this.emit('started');
  }

  async stop(): Promise<void> {
    if (!this.isRunning) {
      console.log('⚠️ Pipeline is not running');
      return;
    }

    this.isRunning = false;
    
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
    }

    // Process remaining data
    if (this.dataBuffer.length > 0) {
      await this.processBatch();
    }

    console.log('🛑 IoT Data Processing Pipeline stopped');
    this.emit('stopped');
  }

  // Data Ingestion Methods
  async ingestData(dataPoint: IoTDataPoint): Promise<void> {
    if (!this.isRunning) {
      throw new Error('Pipeline is not running');
    }

    // Add to buffer
    this.dataBuffer.push(dataPoint);
    
    // Process batch if buffer is full
    if (this.dataBuffer.length >= this.config.batchSize) {
      await this.processBatch();
    }

    // Add to data windows
    await this.addToDataWindow(dataPoint);
  }

  async ingestBatch(dataPoints: IoTDataPoint[]): Promise<void> {
    for (const dataPoint of dataPoints) {
      await this.ingestData(dataPoint);
    }
  }

  // Batch Processing
  private async processBatch(): Promise<void> {
    if (this.dataBuffer.length === 0) {
      return;
    }

    const batch = [...this.dataBuffer];
    this.dataBuffer = [];

    try {
      // Process through each stage
      let processedData = batch;
      
      for (const stage of this.stages.values()) {
        const startTime = Date.now();
        stage.status = 'processing';
        
        try {
          processedData = await this.processStage(stage, processedData);
          stage.metrics.processed += processedData.length;
          stage.metrics.lastProcessed = new Date();
          stage.status = 'completed';
        } catch (error) {
          stage.metrics.failed += batch.length;
          stage.status = 'error';
          console.error(`❌ Stage ${stage.name} failed:`, error);
          this.emit('stage-error', { stage, error, batch });
        }
        
        const processingTime = Date.now() - startTime;
        stage.metrics.averageTime = (stage.metrics.averageTime + processingTime) / 2;
        stage.metrics.throughput = processedData.length / (processingTime / 1000);
      }

      console.log(`📊 Processed batch: ${batch.length} data points`);
      this.emit('batch-processed', { batchSize: batch.length, processedData });
    } catch (error) {
      console.error('❌ Batch processing failed:', error);
      this.emit('batch-error', { error, batch });
    }
  }

  private async processStage(stage: ProcessingStage, data: IoTDataPoint[]): Promise<IoTDataPoint[]> {
    switch (stage.type) {
      case 'ingestion':
        return await this.processIngestion(stage, data);
      case 'validation':
        return await this.processValidation(stage, data);
      case 'transformation':
        return await this.processTransformation(stage, data);
      case 'analysis':
        return await this.processAnalysis(stage, data);
      case 'storage':
        return await this.processStorage(stage, data);
      case 'notification':
        return await this.processNotification(stage, data);
      default:
        throw new Error(`Unknown stage type: ${stage.type}`);
    }
  }

  private async processIngestion(stage: ProcessingStage, data: IoTDataPoint[]): Promise<IoTDataPoint[]> {
    // Data ingestion - basic validation and preparation
    return data.filter(point => {
      return point.deviceId && point.parameter && point.timestamp;
    });
  }

  private async processValidation(stage: ProcessingStage, data: IoTDataPoint[]): Promise<IoTDataPoint[]> {
    const validatedData: IoTDataPoint[] = [];
    
    for (const point of data) {
      let isValid = true;
      let quality = DataQuality.GOOD;
      
      // Apply quality rules
      for (const rule of this.qualityRules.values()) {
        const result = this.applyQualityRule(rule, point);
        if (!result.valid) {
          isValid = false;
          quality = DataQuality.BAD;
          
          if (rule.action === 'reject') {
            break;
          }
        }
      }
      
      if (isValid) {
        validatedData.push({ ...point, quality });
      }
    }
    
    return validatedData;
  }

  private async processTransformation(stage: ProcessingStage, data: IoTDataPoint[]): Promise<IoTDataPoint[]> {
    const transformedData: IoTDataPoint[] = [];
    
    for (const point of data) {
      const transformed = { ...point };
      
      // Apply transformations
      if (typeof point.value === 'number') {
        // Normalize values if needed
        if (point.parameter === 'temperature' && point.value > 1000) {
          transformed.value = point.value / 10; // Convert from millidegrees
        }
        
        // Add derived metrics
        if (point.metadata) {
          point.metadata.processed = true;
          point.metadata.transformedAt = new Date().toISOString();
        }
      }
      
      transformedData.push(transformed);
    }
    
    return transformedData;
  }

  private async processAnalysis(stage: ProcessingStage, data: IoTDataPoint[]): Promise<IoTDataPoint[]> {
    const analyzedData: IoTDataPoint[] = [];
    
    for (const point of data) {
      // Perform anomaly detection
      const anomalies = await this.detectAnomalies(point);
      
      // Add analysis metadata
      const analyzedPoint = { ...point };
      if (!analyzedPoint.metadata) {
        analyzedPoint.metadata = {};
      }
      
      analyzedPoint.metadata.anomalies = anomalies;
      analyzedPoint.metadata.analyzedAt = new Date().toISOString();
      
      // Emit anomalies if found
      if (anomalies.length > 0) {
        for (const anomaly of anomalies) {
          this.emit('anomaly-detected', anomaly);
        }
      }
      
      analyzedData.push(analyzedPoint);
    }
    
    return analyzedData;
  }

  private async processStorage(stage: ProcessingStage, data: IoTDataPoint[]): Promise<IoTDataPoint[]> {
    // In a real implementation, this would store data in a database
    // For now, we'll just simulate storage
    console.log(`💾 Storing ${data.length} data points`);
    
    // Apply data retention
    const cutoff = new Date(Date.now() - this.config.dataRetention * 60 * 60 * 1000);
    const recentData = data.filter(point => point.timestamp > cutoff);
    
    return recentData;
  }

  private async processNotification(stage: ProcessingStage, data: IoTDataPoint[]): Promise<IoTDataPoint[]> {
    // Check for alert conditions and send notifications
    for (const point of data) {
      const alerts = await this.checkAlertConditions(point);
      
      for (const alert of alerts) {
        this.emit('alert', alert);
      }
    }
    
    return data;
  }

  // Data Window Management
  private async addToDataWindow(dataPoint: IoTDataPoint): Promise<void> {
    const key = `${dataPoint.deviceId}:${dataPoint.parameter}`;
    
    if (!this.dataWindows.has(key)) {
      this.dataWindows.set(key, []);
    }
    
    const windows = this.dataWindows.get(key)!;
    
    // Add to appropriate windows
    for (const window of windows) {
      if (this.isInWindow(dataPoint, window.window)) {
        window.dataPoints.push(dataPoint);
        this.updateWindowStatistics(window);
      }
    }
    
    // Create new windows if needed
    await this.createDataWindows(dataPoint);
  }

  private isInWindow(dataPoint: IoTDataPoint, window: TimeWindow): boolean {
    return dataPoint.timestamp >= window.start && dataPoint.timestamp <= window.end;
  }

  private async createDataWindows(dataPoint: IoTDataPoint): Promise<void> {
    const key = `${dataPoint.deviceId}:${dataPoint.parameter}`;
    const windows = this.dataWindows.get(key)!;
    
    // Create windows for different time periods
    const windowSizes = [60000, 300000, 900000]; // 1min, 5min, 15min
    
    for (const size of windowSizes) {
      const windowStart = new Date(dataPoint.timestamp.getTime() - (dataPoint.timestamp.getTime() % size));
      const windowEnd = new Date(windowStart.getTime() + size);
      
      // Check if window already exists
      const existingWindow = windows.find(w => 
        w.window.start.getTime() === windowStart.getTime() && 
        w.window.size === size
      );
      
      if (!existingWindow) {
        const newWindow: DataWindow = {
          id: uuidv4(),
          deviceId: dataPoint.deviceId,
          parameter: dataPoint.parameter,
          window: {
            start: windowStart,
            end: windowEnd,
            size,
            type: 'tumbling',
          },
          dataPoints: [dataPoint],
          statistics: this.calculateInitialStatistics([dataPoint]),
          quality: DataQuality.GOOD,
        };
        
        windows.push(newWindow);
      }
    }
  }

  private updateWindowStatistics(window: DataWindow): void {
    const numericValues = window.dataPoints
      .filter(dp => typeof dp.value === 'number')
      .map(dp => dp.value as number);
    
    if (numericValues.length === 0) return;
    
    window.statistics = {
      count: numericValues.length,
      min: Math.min(...numericValues),
      max: Math.max(...numericValues),
      sum: numericValues.reduce((sum, val) => sum + val, 0),
      average: numericValues.reduce((sum, val) => sum + val, 0) / numericValues.length,
      median: this.calculateMedian(numericValues),
      variance: this.calculateVariance(numericValues),
      standardDeviation: Math.sqrt(this.calculateVariance(numericValues)),
      trend: this.calculateTrend(numericValues),
      rateOfChange: this.calculateRateOfChange(numericValues),
    };
  }

  private calculateInitialStatistics(dataPoints: IoTDataPoint[]): WindowStatistics {
    const numericValues = dataPoints
      .filter(dp => typeof dp.value === 'number')
      .map(dp => dp.value as number);
    
    if (numericValues.length === 0) {
      return {
        count: 0,
        min: 0,
        max: 0,
        sum: 0,
        average: 0,
        median: 0,
        variance: 0,
        standardDeviation: 0,
        trend: 'stable',
        rateOfChange: 0,
      };
    }
    
    return {
      count: numericValues.length,
      min: Math.min(...numericValues),
      max: Math.max(...numericValues),
      sum: numericValues.reduce((sum, val) => sum + val, 0),
      average: numericValues.reduce((sum, val) => sum + val, 0) / numericValues.length,
      median: this.calculateMedian(numericValues),
      variance: this.calculateVariance(numericValues),
      standardDeviation: Math.sqrt(this.calculateVariance(numericValues)),
      trend: this.calculateTrend(numericValues),
      rateOfChange: this.calculateRateOfChange(numericValues),
    };
  }

  // Anomaly Detection
  private async detectAnomalies(dataPoint: IoTDataPoint): Promise<AnomalyResult[]> {
    const anomalies: AnomalyResult[] = [];
    
    if (typeof dataPoint.value !== 'number') {
      return anomalies;
    }
    
    for (const detector of this.anomalyDetectors.values()) {
      const anomaly = await this.runAnomalyDetection(detector, dataPoint);
      if (anomaly) {
        anomalies.push(anomaly);
      }
    }
    
    return anomalies;
  }

  private async runAnomalyDetection(detector: AnomalyDetector, dataPoint: IoTDataPoint): Promise<AnomalyResult | null> {
    const value = dataPoint.value as number;
    
    switch (detector.type) {
      case 'statistical':
        return this.detectStatisticalAnomaly(detector, dataPoint, value);
      case 'ml_based':
        return this.detectMLAnomaly(detector, dataPoint, value);
      case 'rule_based':
        return this.detectRuleBasedAnomaly(detector, dataPoint, value);
      default:
        return null;
    }
  }

  private detectStatisticalAnomaly(detector: AnomalyDetector, dataPoint: IoTDataPoint, value: number): AnomalyResult | null {
    const key = `${dataPoint.deviceId}:${dataPoint.parameter}`;
    const windows = this.dataWindows.get(key) || [];
    
    if (windows.length === 0) {
      return null;
    }
    
    const recentWindow = windows[windows.length - 1];
    const stats = recentWindow.statistics;
    
    if (detector.config.method === 'zscore') {
      const zscore = Math.abs((value - stats.average) / stats.standardDeviation);
      const threshold = detector.config.threshold || 3.0;
      
      if (zscore > threshold) {
        return {
          id: uuidv4(),
          deviceId: dataPoint.deviceId,
          parameter: dataPoint.parameter,
          timestamp: dataPoint.timestamp,
          severity: zscore > threshold * 1.5 ? 'high' : 'medium',
          confidence: Math.min(zscore / threshold, 1.0),
          description: `Statistical outlier detected (Z-score: ${zscore.toFixed(2)})`,
          dataPoint,
          context: { zscore, threshold, method: 'zscore' },
        };
      }
    }
    
    return null;
  }

  private detectMLAnomaly(detector: AnomalyDetector, dataPoint: IoTDataPoint, value: number): AnomalyResult | null {
    // Simplified ML-based anomaly detection
    // In a real implementation, this would use actual ML models
    const key = `${dataPoint.deviceId}:${dataPoint.parameter}`;
    const windows = this.dataWindows.get(key) || [];
    
    if (windows.length < 2) {
      return null;
    }
    
    const recentWindow = windows[windows.length - 1];
    const previousWindow = windows[windows.length - 2];
    
    const recentAvg = recentWindow.statistics.average;
    const previousAvg = previousWindow.statistics.average;
    const change = Math.abs(recentAvg - previousAvg);
    
    const threshold = detector.config.threshold || 0.5;
    
    if (change > threshold) {
      return {
        id: uuidv4(),
        deviceId: dataPoint.deviceId,
        parameter: dataPoint.parameter,
        timestamp: dataPoint.timestamp,
        severity: change > threshold * 2 ? 'high' : 'medium',
        confidence: Math.min(change / threshold, 1.0),
        description: `ML-based anomaly detected (change: ${change.toFixed(2)})`,
        dataPoint,
        context: { change, threshold, method: 'ml_based' },
      };
    }
    
    return null;
  }

  private detectRuleBasedAnomaly(detector: AnomalyDetector, dataPoint: IoTDataPoint, value: number): AnomalyResult | null {
    // Rule-based anomaly detection using predefined rules
    const rules = this.config.alertThresholds.filter(threshold => 
      threshold.parameter === dataPoint.parameter && threshold.condition === 'anomaly'
    );
    
    for (const rule of rules) {
      if (typeof rule.value === 'number') {
        if (Math.abs(value - rule.value) > rule.value * 0.1) { // 10% deviation
          return {
            id: uuidv4(),
            deviceId: dataPoint.deviceId,
            parameter: dataPoint.parameter,
            timestamp: dataPoint.timestamp,
            severity: rule.severity,
            confidence: 0.8,
            description: `Rule-based anomaly detected (value: ${value}, expected: ${rule.value})`,
            dataPoint,
            context: { rule, deviation: Math.abs(value - rule.value) },
          };
        }
      }
    }
    
    return null;
  }

  // Quality Rule Application
  private applyQualityRule(rule: QualityRule, dataPoint: IoTDataPoint): { valid: boolean; message?: string } {
    switch (rule.type) {
      case 'range':
        if (typeof dataPoint.value === 'number') {
          const { min, max } = rule.condition;
          if (dataPoint.value < min || dataPoint.value > max) {
            return { valid: false, message: `Value ${dataPoint.value} outside range [${min}, ${max}]` };
          }
        }
        break;
        
      case 'timeliness':
        const maxAge = rule.condition.maxAge;
        const age = Date.now() - dataPoint.timestamp.getTime();
        if (age > maxAge) {
          return { valid: false, message: `Data point is too old (${age}ms > ${maxAge}ms)` };
        }
        break;
        
      case 'completeness':
        const requiredFields = rule.condition.requiredFields;
        for (const field of requiredFields) {
          if (!(field in dataPoint)) {
            return { valid: false, message: `Missing required field: ${field}` };
          }
        }
        break;
        
      case 'consistency':
        if (rule.condition.dataType === 'number' && typeof dataPoint.value !== 'number') {
          return { valid: false, message: `Expected number, got ${typeof dataPoint.value}` };
        }
        break;
    }
    
    return { valid: true };
  }

  // Alert Condition Checking
  private async checkAlertConditions(dataPoint: IoTDataPoint): Promise<Alert[]> {
    const alerts: Alert[] = [];
    
    if (typeof dataPoint.value !== 'number') {
      return alerts;
    }
    
    const value = dataPoint.value as number;
    
    for (const threshold of this.config.alertThresholds) {
      if (threshold.parameter !== dataPoint.parameter) {
        continue;
      }
      
      let triggered = false;
      
      switch (threshold.condition) {
        case 'greater_than':
          triggered = value > (threshold.value as number);
          break;
        case 'less_than':
          triggered = value < (threshold.value as number);
          break;
        case 'equals':
          triggered = value === (threshold.value as number);
          break;
        case 'not_equals':
          triggered = value !== (threshold.value as number);
          break;
        case 'between':
          const [min, max] = threshold.value as [number, number];
          triggered = value >= min && value <= max;
          break;
        case 'anomaly':
          // Anomaly detection is handled separately
          break;
      }
      
      if (triggered) {
        alerts.push({
          id: uuidv4(),
          deviceId: dataPoint.deviceId,
          type: 'threshold',
          severity: threshold.severity,
          message: `${threshold.parameter} threshold exceeded: ${value}`,
          timestamp: dataPoint.timestamp,
          acknowledged: false,
          resolved: false,
          metadata: {
            parameter: threshold.parameter,
            value,
            threshold: threshold.value,
            condition: threshold.condition,
          },
        });
      }
    }
    
    return alerts;
  }

  // Utility Methods
  private calculateMedian(values: number[]): number {
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0 
      ? (sorted[mid - 1] + sorted[mid]) / 2 
      : sorted[mid];
  }

  private calculateVariance(values: number[]): number {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDifferences = values.map(val => Math.pow(val - mean, 2));
    return squaredDifferences.reduce((sum, val) => sum + val, 0) / values.length;
  }

  private calculateTrend(values: number[]): 'increasing' | 'decreasing' | 'stable' {
    if (values.length < 2) return 'stable';
    
    const firstHalf = values.slice(0, Math.floor(values.length / 2));
    const secondHalf = values.slice(Math.floor(values.length / 2));
    
    const firstAvg = firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length;
    
    const diff = secondAvg - firstAvg;
    const threshold = Math.abs(firstAvg) * 0.05; // 5% threshold
    
    if (Math.abs(diff) < threshold) {
      return 'stable';
    } else if (diff > 0) {
      return 'increasing';
    } else {
      return 'decreasing';
    }
  }

  private calculateRateOfChange(values: number[]): number {
    if (values.length < 2) return 0;
    
    const first = values[0];
    const last = values[values.length - 1];
    
    return ((last - first) / first) * 100;
  }

  private startWindowManagement(): void {
    // Clean up old windows periodically
    setInterval(() => {
      this.cleanupOldWindows();
    }, 60000); // Every minute
  }

  private cleanupOldWindows(): void {
    const cutoff = new Date(Date.now() - this.config.dataRetention * 60 * 60 * 1000);
    
    for (const [key, windows] of this.dataWindows.entries()) {
      const activeWindows = windows.filter(window => window.window.end > cutoff);
      this.dataWindows.set(key, activeWindows);
    }
  }

  private startStreamProcessors(): void {
    // Start any configured stream processors
    for (const processor of this.streamProcessors.values()) {
      if (processor.state === 'stopped') {
        processor.state = 'running';
        console.log(`🔄 Started stream processor: ${processor.name}`);
      }
    }
  }

  // Query Methods
  getPipelineStatus(): any {
    return {
      isRunning: this.isRunning,
      bufferSize: this.dataBuffer.length,
      stages: Array.from(this.stages.values()).map(stage => ({
        id: stage.id,
        name: stage.name,
        status: stage.status,
        metrics: stage.metrics,
      })),
      dataWindows: this.dataWindows.size,
      anomalyDetectors: this.anomalyDetectors.size,
      streamProcessors: Array.from(this.streamProcessors.values()).map(p => ({
        id: p.id,
        name: p.name,
        state: p.state,
        metrics: p.metrics,
      })),
    };
  }

  getDataWindows(deviceId?: string, parameter?: string): DataWindow[] {
    const allWindows: DataWindow[] = [];
    
    for (const windows of this.dataWindows.values()) {
      allWindows.push(...windows);
    }
    
    return allWindows.filter(window => {
      if (deviceId && window.deviceId !== deviceId) return false;
      if (parameter && window.parameter !== parameter) return false;
      return true;
    });
  }

  getRecentData(deviceId: string, parameter: string, limit: number = 100): IoTDataPoint[] {
    const key = `${deviceId}:${parameter}`;
    const windows = this.dataWindows.get(key) || [];
    
    const allDataPoints: IoTDataPoint[] = [];
    for (const window of windows) {
      allDataPoints.push(...window.dataPoints);
    }
    
    return allDataPoints
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }
}

// Export singleton instance
export const iotDataPipeline = new IoTDataPipeline();

// Export types and utilities
export {
  IoTDataPipeline,
  PipelineConfig,
  ProcessingStage,
  DataWindow,
  AnomalyDetector,
  QualityRule,
  StreamProcessor,
};