import { NextRequest, NextResponse } from 'next/server';
import { optimindIoTArchitecture } from '@/lib/iot-architecture';

/**
 * IoT Analytics API Endpoint
 * 
 * Provides comprehensive analytics for IoT devices and sensors including
 * performance metrics, trends, insights, and predictive analysis.
 */

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'overview';
    const deviceId = searchParams.get('deviceId');
    const sensorId = searchParams.get('sensorId');
    const timeRange = searchParams.get('timeRange') || '24h'; // 1h, 24h, 7d, 30d

    switch (type) {
      case 'overview':
        return getOverviewAnalytics();
      case 'device':
        return getDeviceAnalytics(deviceId);
      case 'sensor':
        return getSensorAnalytics(sensorId);
      case 'performance':
        return getPerformanceAnalytics(timeRange);
      case 'predictions':
        return getPredictiveAnalytics();
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid analytics type' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error generating IoT analytics:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate analytics',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

async function getOverviewAnalytics() {
  const devices = Array.from(optimindIoTArchitecture.getDevices().values());
  const sensors = Array.from(optimindIoTArchitecture.getSensors().values());

  // Calculate overview metrics
  const totalDevices = devices.length;
  const onlineDevices = devices.filter(d => d.status === 'online').length;
  const offlineDevices = devices.filter(d => d.status === 'offline').length;
  const maintenanceDevices = devices.filter(d => d.status === 'maintenance').length;

  const totalSensors = sensors.length;
  const healthySensors = sensors.filter(s => s.health.status === 'healthy').length;
  const degradedSensors = sensors.filter(s => s.health.status === 'degraded').length;
  const faultySensors = sensors.filter(s => s.health.status === 'faulty').length;

  // Calculate data ingestion metrics
  const totalDataPoints = sensors.reduce((sum, sensor) => sum + sensor.data.length, 0);
  const recentDataPoints = sensors.reduce((sum, sensor) => {
    const recent = sensor.data.filter(d => 
      new Date(d.timestamp).getTime() > Date.now() - 24 * 60 * 60 * 1000
    );
    return sum + recent.length;
  }, 0);

  // Calculate health metrics
  const averageUptime = sensors.reduce((sum, sensor) => sum + sensor.health.uptime, 0) / sensors.length || 0;
  const averageErrorRate = sensors.reduce((sum, sensor) => sum + sensor.health.errorRate, 0) / sensors.length || 0;

  // Device type distribution
  const deviceTypeDistribution = devices.reduce((acc, device) => {
    acc[device.type] = (acc[device.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Sensor category distribution
  const sensorCategoryDistribution = sensors.reduce((acc, sensor) => {
    acc[sensor.category] = (acc[sensor.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return NextResponse.json({
    success: true,
    data: {
      devices: {
        total: totalDevices,
        online: onlineDevices,
        offline: offlineDevices,
        maintenance: maintenanceDevices,
        onlinePercentage: totalDevices > 0 ? (onlineDevices / totalDevices * 100).toFixed(1) : 0
      },
      sensors: {
        total: totalSensors,
        healthy: healthySensors,
        degraded: degradedSensors,
        faulty: faultySensors,
        healthyPercentage: totalSensors > 0 ? (healthySensors / totalSensors * 100).toFixed(1) : 0
      },
      data: {
        totalDataPoints,
        recentDataPoints,
        dataIngestionRate: recentDataPoints / 24, // points per hour
        averageDataPointsPerSensor: totalSensors > 0 ? (totalDataPoints / totalSensors).toFixed(1) : 0
      },
      health: {
        averageUptime: averageUptime.toFixed(1),
        averageErrorRate: averageErrorRate.toFixed(2),
        systemHealth: averageUptime > 95 && averageErrorRate < 5 ? 'excellent' : 
                       averageUptime > 85 && averageErrorRate < 10 ? 'good' : 'needs_attention'
      },
      distribution: {
        deviceTypes: deviceTypeDistribution,
        sensorCategories: sensorCategoryDistribution
      }
    },
    metadata: {
      timestamp: new Date().toISOString(),
      analyticsType: 'overview',
      timeRange: 'current'
    }
  });
}

async function getDeviceAnalytics(deviceId?: string) {
  if (!deviceId) {
    return NextResponse.json(
      { success: false, error: 'Device ID is required' },
      { status: 400 }
    );
  }

  const device = optimindIoTArchitecture.getDevices().get(deviceId);
  if (!device) {
    return NextResponse.json(
      { success: false, error: 'Device not found' },
      { status: 404 }
    );
  }

  // Get device sensors
  const deviceSensors = Array.from(optimindIoTArchitecture.getSensors().values())
    .filter(sensor => sensor.deviceId === deviceId);

  // Calculate device-specific metrics
  const totalSensors = deviceSensors.length;
  const healthySensors = deviceSensors.filter(s => s.health.status === 'healthy').length;
  const faultySensors = deviceSensors.filter(s => s.health.status === 'faulty').length;

  // Calculate connectivity metrics
  const connectivityQuality = device.connectivity.quality;
  const connectionUptime = connectivityQuality.uptime;

  // Calculate data metrics
  const totalDataPoints = deviceSensors.reduce((sum, sensor) => sum + sensor.data.length, 0);
  const recentActivity = deviceSensors.some(sensor => {
    const latestData = sensor.data[sensor.data.length - 1];
    return latestData && new Date(latestData.timestamp).getTime() > Date.now() - 5 * 60 * 1000; // 5 minutes
  });

  // Calculate device health score
  const sensorHealthScore = totalSensors > 0 ? (healthySensors / totalSensors) * 100 : 0;
  const connectivityScore = connectionUptime;
  const activityScore = recentActivity ? 100 : 0;
  const overallHealthScore = (sensorHealthScore * 0.5 + connectivityScore * 0.3 + activityScore * 0.2);

  return NextResponse.json({
    success: true,
    data: {
      device: {
        id: device.id,
        name: device.name,
        type: device.type,
        status: device.status,
        location: device.location
      },
      sensors: {
        total: totalSensors,
        healthy: healthySensors,
        faulty: faultySensors,
        healthPercentage: totalSensors > 0 ? (healthySensors / totalSensors * 100).toFixed(1) : 0
      },
      connectivity: {
        protocol: device.connectivity.protocol,
        signalStrength: connectivityQuality.signalStrength,
        latency: connectivityQuality.latency,
        uptime: connectivityQuality.uptime,
        reliability: connectivityQuality.reliability
      },
      performance: {
        totalDataPoints,
        recentActivity,
        dataIngestionRate: totalDataPoints > 0 ? (totalDataPoints / 24).toFixed(1) : 0 // points per hour
      },
      health: {
        sensorHealth: sensorHealthScore.toFixed(1),
        connectivityScore: connectivityScore.toFixed(1),
        activityScore: activityScore.toFixed(1),
        overallHealth: overallHealthScore.toFixed(1),
        healthStatus: overallHealthScore >= 90 ? 'excellent' :
                     overallHealthScore >= 75 ? 'good' :
                     overallHealthScore >= 60 ? 'fair' : 'poor'
      }
    },
    metadata: {
      timestamp: new Date().toISOString(),
      analyticsType: 'device',
      deviceId
    }
  });
}

async function getSensorAnalytics(sensorId?: string) {
  if (!sensorId) {
    return NextResponse.json(
      { success: false, error: 'Sensor ID is required' },
      { status: 400 }
    );
  }

  const sensor = optimindIoTArchitecture.getSensors().get(sensorId);
  if (!sensor) {
    return NextResponse.json(
      { success: false, error: 'Sensor not found' },
      { status: 404 }
    );
  }

  // Calculate sensor-specific analytics
  const dataPoints = sensor.data;
  const totalDataPoints = dataPoints.length;
  
  // Calculate statistical metrics
  if (dataPoints.length > 0) {
    const values = dataPoints.map(d => typeof d.value === 'number' ? d.value : 0);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
    
    // Calculate trend (simple linear regression)
    const trend = calculateTrend(values);
    
    // Calculate data quality metrics
    const avgAccuracy = dataPoints.reduce((sum, d) => sum + d.quality.accuracy, 0) / dataPoints.length;
    const avgConfidence = dataPoints.reduce((sum, d) => sum + d.quality.confidence, 0) / dataPoints.length;

    return NextResponse.json({
      success: true,
      data: {
        sensor: {
          id: sensor.id,
          name: sensor.name,
          type: sensor.type,
          category: sensor.category,
          deviceId: sensor.deviceId
        },
        specifications: sensor.specifications,
        health: sensor.health,
        statistics: {
          totalDataPoints,
          min,
          max,
          average: avg.toFixed(2),
          trend: trend.direction,
          trendStrength: trend.strength
        },
        quality: {
          averageAccuracy: avgAccuracy.toFixed(1),
          averageConfidence: avgConfidence.toFixed(1),
          dataQualityScore: ((avgAccuracy + avgConfidence) / 2).toFixed(1)
        },
        recentActivity: {
          lastReading: sensor.health.lastReading,
          dataFrequency: calculateDataFrequency(dataPoints),
          isActive: sensor.health.status === 'healthy'
        }
      },
      metadata: {
        timestamp: new Date().toISOString(),
        analyticsType: 'sensor',
        sensorId
      }
    });
  }

  return NextResponse.json({
    success: true,
    data: {
      sensor: {
        id: sensor.id,
        name: sensor.name,
        type: sensor.type,
        category: sensor.category,
        deviceId: sensor.deviceId
      },
      specifications: sensor.specifications,
      health: sensor.health,
      statistics: {
        totalDataPoints: 0,
        message: 'No data available for analysis'
      },
      recentActivity: {
        lastReading: sensor.health.lastReading,
        dataFrequency: 'none',
        isActive: false
      }
    },
    metadata: {
      timestamp: new Date().toISOString(),
      analyticsType: 'sensor',
      sensorId
    }
  });
}

async function getPerformanceAnalytics(timeRange: string) {
  const sensors = Array.from(optimindIoTArchitecture.getSensors().values());
  
  // Calculate time range in milliseconds
  const timeRanges: Record<string, number> = {
    '1h': 60 * 60 * 1000,
    '24h': 24 * 60 * 60 * 1000,
    '7d': 7 * 24 * 60 * 60 * 1000,
    '30d': 30 * 24 * 60 * 60 * 1000
  };

  const timeRangeMs = timeRanges[timeRange] || timeRanges['24h'];
  const cutoffTime = Date.now() - timeRangeMs;

  // Calculate performance metrics
  const performanceMetrics = sensors.map(sensor => {
    const recentData = sensor.data.filter(d => 
      new Date(d.timestamp).getTime() > cutoffTime
    );

    return {
      sensorId: sensor.id,
      sensorName: sensor.name,
      deviceId: sensor.deviceId,
      dataPointsCount: recentData.length,
      averageAccuracy: recentData.length > 0 ? 
        recentData.reduce((sum, d) => sum + d.quality.accuracy, 0) / recentData.length : 0,
      uptime: sensor.health.uptime,
      errorRate: sensor.health.errorRate,
      healthStatus: sensor.health.status
    };
  });

  // Calculate system-wide performance metrics
  const totalDataPoints = performanceMetrics.reduce((sum, m) => sum + m.dataPointsCount, 0);
  const averageAccuracy = performanceMetrics.reduce((sum, m) => sum + m.averageAccuracy, 0) / performanceMetrics.length || 0;
  const averageUptime = performanceMetrics.reduce((sum, m) => sum + m.uptime, 0) / performanceMetrics.length || 0;
  const averageErrorRate = performanceMetrics.reduce((sum, m) => sum + m.errorRate, 0) / performanceMetrics.length || 0;

  return NextResponse.json({
    success: true,
    data: {
      systemPerformance: {
        totalDataPoints,
        averageAccuracy: averageAccuracy.toFixed(1),
        averageUptime: averageUptime.toFixed(1),
        averageErrorRate: averageErrorRate.toFixed(2),
        performanceScore: ((averageAccuracy + averageUptime) / 2 - averageErrorRate).toFixed(1)
      },
      sensorPerformance: performanceMetrics,
      topPerformers: performanceMetrics
        .filter(m => m.healthStatus === 'healthy')
        .sort((a, b) => (b.averageAccuracy + b.uptime) - (a.averageAccuracy + a.uptime))
        .slice(0, 10),
      needsAttention: performanceMetrics
        .filter(m => m.healthStatus !== 'healthy' || m.errorRate > 10)
        .sort((a, b) => (b.errorRate + (100 - b.uptime)) - (a.errorRate + (100 - a.uptime)))
        .slice(0, 10)
    },
    metadata: {
      timestamp: new Date().toISOString(),
      analyticsType: 'performance',
      timeRange
    }
  });
}

async function getPredictiveAnalytics() {
  const devices = Array.from(optimindIoTArchitecture.getDevices().values());
  const sensors = Array.from(optimindIoTArchitecture.getSensors().values());

  // Generate predictive insights
  const predictions = [];

  // Device health predictions
  devices.forEach(device => {
    const deviceSensors = sensors.filter(s => s.deviceId === device.id);
    const faultySensors = deviceSensors.filter(s => s.health.status === 'faulty').length;
    const degradedSensors = deviceSensors.filter(s => s.health.status === 'degraded').length;
    
    if (faultySensors > 0 || degradedSensors > deviceSensors.length * 0.3) {
      predictions.push({
        type: 'device_health',
        deviceId: device.id,
        deviceName: device.name,
        prediction: 'maintenance_required',
        confidence: 0.8,
        timeframe: '7 days',
        reason: `${faultySensors} faulty and ${degradedSensors} degraded sensors detected`
      });
    }
  });

  // Sensor calibration predictions
  sensors.forEach(sensor => {
    const calibrationExpiry = new Date(sensor.calibration.nextCalibration);
    const daysToExpiry = Math.ceil((calibrationExpiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    
    if (daysToExpiry <= 30 && daysToExpiry > 0) {
      predictions.push({
        type: 'calibration',
        sensorId: sensor.id,
        sensorName: sensor.name,
        prediction: 'calibration_due',
        confidence: 0.9,
        timeframe: `${daysToExpiry} days`,
        reason: `Calibration expires on ${calibrationExpiry.toDateString()}`
      });
    }
  });

  // Data quality predictions
  sensors.forEach(sensor => {
    if (sensor.health.errorRate > 15) {
      predictions.push({
        type: 'data_quality',
        sensorId: sensor.id,
        sensorName: sensor.name,
        prediction: 'quality_degradation',
        confidence: 0.7,
        timeframe: '14 days',
        reason: `High error rate detected: ${sensor.health.errorRate.toFixed(1)}%`
      });
    }
  });

  return NextResponse.json({
    success: true,
    data: {
      predictions,
      summary: {
        totalPredictions: predictions.length,
        highPriority: predictions.filter(p => p.confidence > 0.8).length,
        mediumPriority: predictions.filter(p => p.confidence > 0.6 && p.confidence <= 0.8).length,
        lowPriority: predictions.filter(p => p.confidence <= 0.6).length
      },
      recommendations: generateRecommendations(predictions)
    },
    metadata: {
      timestamp: new Date().toISOString(),
      analyticsType: 'predictions'
    }
  });
}

function calculateTrend(values: number[]): { direction: 'increasing' | 'decreasing' | 'stable', strength: number } {
  if (values.length < 2) {
    return { direction: 'stable', strength: 0 };
  }

  // Simple linear regression
  const n = values.length;
  const x = Array.from({ length: n }, (_, i) => i);
  const sumX = x.reduce((sum, val) => sum + val, 0);
  const sumY = values.reduce((sum, val) => sum + val, 0);
  const sumXY = x.reduce((sum, xi, i) => sum + xi * values[i], 0);
  const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  
  if (Math.abs(slope) < 0.01) {
    return { direction: 'stable', strength: 0 };
  } else if (slope > 0) {
    return { direction: 'increasing', strength: Math.min(slope * 10, 100) };
  } else {
    return { direction: 'decreasing', strength: Math.min(Math.abs(slope) * 10, 100) };
  }
}

function calculateDataFrequency(dataPoints: any[]): string {
  if (dataPoints.length < 2) {
    return 'insufficient_data';
  }

  const sortedData = [...dataPoints].sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const intervals = [];
  for (let i = 1; i < sortedData.length; i++) {
    const interval = new Date(sortedData[i].timestamp).getTime() - 
                     new Date(sortedData[i - 1].timestamp).getTime();
    intervals.push(interval);
  }

  const averageInterval = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;
  
  if (averageInterval < 60000) { // Less than 1 minute
    return 'high_frequency';
  } else if (averageInterval < 300000) { // Less than 5 minutes
    return 'medium_frequency';
  } else if (averageInterval < 3600000) { // Less than 1 hour
    return 'low_frequency';
  } else {
    return 'very_low_frequency';
  }
}

function generateRecommendations(predictions: any[]): string[] {
  const recommendations: string[] = [];

  const maintenancePredictions = predictions.filter(p => p.type === 'device_health');
  if (maintenancePredictions.length > 0) {
    recommendations.push(`Schedule maintenance for ${maintenancePredictions.length} devices showing health issues`);
  }

  const calibrationPredictions = predictions.filter(p => p.type === 'calibration');
  if (calibrationPredictions.length > 0) {
    recommendations.push(`Plan calibration for ${calibrationPredictions.length} sensors expiring soon`);
  }

  const qualityPredictions = predictions.filter(p => p.type === 'data_quality');
  if (qualityPredictions.length > 0) {
    recommendations.push(`Investigate data quality issues for ${qualityPredictions.length} sensors`);
  }

  if (predictions.length === 0) {
    recommendations.push('All systems operating within normal parameters');
  }

  return recommendations;
}