import { NextRequest, NextResponse } from 'next/server';
import { optimindIoTArchitecture } from '@/lib/iot-architecture';

/**
 * IoT Sensor Data API Endpoint
 * 
 * Provides API for ingesting and retrieving sensor data readings.
 * Supports real-time data collection, batch processing, and data queries.
 */

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sensorId = searchParams.get('sensorId');
    const deviceId = searchParams.get('deviceId');
    const startTime = searchParams.get('startTime');
    const endTime = searchParams.get('endTime');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '100');

    // Get all sensors and filter by criteria
    const sensors = Array.from(optimindIoTArchitecture.getSensors().values());
    let targetSensors = sensors;

    if (sensorId) {
      targetSensors = sensors.filter(s => s.id === sensorId);
    }
    if (deviceId) {
      targetSensors = sensors.filter(s => s.deviceId === deviceId);
    }

    // Collect data points from all target sensors
    let allDataPoints: any[] = [];
    
    targetSensors.forEach(sensor => {
      sensor.data.forEach(dataPoint => {
        // Apply time filters if specified
        if (startTime && new Date(dataPoint.timestamp) < new Date(startTime)) {
          return;
        }
        if (endTime && new Date(dataPoint.timestamp) > new Date(endTime)) {
          return;
        }
        
        allDataPoints.push({
          ...dataPoint,
          sensorId: sensor.id,
          sensorName: sensor.name,
          deviceName: sensors.find(s => s.id === sensor.deviceId)?.name || 'Unknown'
        });
      });
    });

    // Sort by timestamp (newest first)
    allDataPoints.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = allDataPoints.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: paginatedData,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(allDataPoints.length / limit),
        totalItems: allDataPoints.length,
        itemsPerPage: limit,
        hasNext: endIndex < allDataPoints.length,
        hasPrev: page > 1
      },
      metadata: {
        timestamp: new Date().toISOString(),
        totalDataPoints: allDataPoints.length,
        sensorsQueried: targetSensors.length,
        timeRange: {
          startTime: startTime || 'unlimited',
          endTime: endTime || 'unlimited'
        }
      }
    });
  } catch (error) {
    console.error('Error fetching sensor data:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch sensor data',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sensorId, value, unit, quality, metadata, batchData } = body;

    // Handle batch data ingestion
    if (batchData && Array.isArray(batchData)) {
      const results = [];
      const errors = [];

      for (const dataPoint of batchData) {
        try {
          const result = await processSingleDataPoint(dataPoint);
          results.push(result);
        } catch (error) {
          errors.push({
            dataPoint,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }

      return NextResponse.json({
        success: true,
        data: {
          processed: results.length,
          failed: errors.length,
          results,
          errors
        },
        message: `Batch processing completed: ${results.length} successful, ${errors.length} failed`,
        timestamp: new Date().toISOString()
      });
    }

    // Handle single data point ingestion
    if (!sensorId || value === undefined) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields',
          required: ['sensorId', 'value']
        },
        { status: 400 }
      );
    }

    const result = await processSingleDataPoint({
      sensorId,
      value,
      unit,
      quality,
      metadata,
      timestamp: new Date()
    });

    return NextResponse.json({
      success: true,
      data: result,
      message: 'Sensor data ingested successfully',
      timestamp: new Date().toISOString()
    }, { status: 201 });
  } catch (error) {
    console.error('Error ingesting sensor data:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to ingest sensor data',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

async function processSingleDataPoint(dataPoint: any) {
  const { sensorId, value, unit, quality, metadata, timestamp } = dataPoint;

  // Validate sensor exists
  const sensor = optimindIoTArchitecture.getSensors().get(sensorId);
  if (!sensor) {
    throw new Error(`Sensor not found: ${sensorId}`);
  }

  // Validate data quality
  const dataQuality = quality || {
    accuracy: 95,
    completeness: 100,
    consistency: 95,
    timeliness: 100,
    validity: true,
    confidence: 90
  };

  // Create data point
  const newDataPoint = {
    timestamp: timestamp || new Date(),
    value,
    unit: unit || sensor.specifications.range ? 'units' : 'unknown',
    quality: dataQuality,
    metadata: metadata || {}
  };

  // Add data point to sensor
  sensor.data.push(newDataPoint);

  // Keep only last 1000 data points per sensor (configurable)
  if (sensor.data.length > 1000) {
    sensor.data = sensor.data.slice(-1000);
  }

  // Update sensor health metrics
  updateSensorHealth(sensor, newDataPoint);

  return {
    sensorId,
    dataPoint: newDataPoint,
    status: 'ingested'
  };
}

function updateSensorHealth(sensor: any, dataPoint: any) {
  // Update last reading time
  sensor.health.lastReading = new Date(dataPoint.timestamp);

  // Calculate uptime based on data frequency
  const now = new Date();
  const timeSinceLastReading = now.getTime() - new Date(dataPoint.timestamp).getTime();
  const expectedInterval = 1000 / sensor.specifications.samplingRate; // in ms
  
  if (timeSinceLastReading > expectedInterval * 5) { // 5x expected interval
    sensor.health.uptime = Math.max(0, sensor.health.uptime - 5);
  } else {
    sensor.health.uptime = Math.min(100, sensor.health.uptime + 1);
  }

  // Check calibration status
  const calibrationExpiry = new Date(sensor.calibration.nextCalibration);
  if (now > calibrationExpiry) {
    sensor.health.calibrationStatus = 'expired';
  }

  // Update error rate based on data quality
  if (dataPoint.quality.accuracy < 80 || dataPoint.quality.validity === false) {
    sensor.health.errorRate = Math.min(100, sensor.health.errorRate + 1);
  } else {
    sensor.health.errorRate = Math.max(0, sensor.health.errorRate - 0.1);
  }

  // Update overall health status
  if (sensor.health.errorRate > 20 || sensor.health.calibrationStatus === 'expired') {
    sensor.health.status = 'faulty';
  } else if (sensor.health.errorRate > 10 || sensor.health.uptime < 90) {
    sensor.health.status = 'degraded';
  } else {
    sensor.health.status = 'healthy';
  }
}