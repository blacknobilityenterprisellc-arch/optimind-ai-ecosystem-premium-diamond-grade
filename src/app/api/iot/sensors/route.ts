import { optimindIoTArchitecture } from '@/lib/iot-architecture';

/**
 * IoT Sensors API Endpoint
 *
 * Provides RESTful API for managing IoT sensors in the OptiMind AI Ecosystem.
 * Supports sensor registration, data retrieval, and monitoring operations.
 */

export async function GET() {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const deviceId = searchParams.get('deviceId');
    const category = searchParams.get('category');

    // Get sensors from the IoT architecture
    const sensors = Array.from(optimindIoTArchitecture.getSensors().values());

    // Apply filters
    let filteredSensors = sensors;
    if (deviceId) {
      filteredSensors = filteredSensors.filter(sensor => sensor.deviceId === deviceId);
    }
    if (type) {
      filteredSensors = filteredSensors.filter(sensor => sensor.type === type);
    }
    if (category) {
      filteredSensors = filteredSensors.filter(sensor => sensor.category === category);
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedSensors = filteredSensors.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: paginatedSensors,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(filteredSensors.length / limit),
        totalItems: filteredSensors.length,
        itemsPerPage: limit,
        hasNext: endIndex < filteredSensors.length,
        hasPrev: page > 1,
      },
      metadata: {
        timestamp: new Date().toISOString(),
        totalSensors: sensors.length,
        healthySensors: sensors.filter(s => s.health.status === 'healthy').length,
        degradedSensors: sensors.filter(s => s.health.status === 'degraded').length,
        faultySensors: sensors.filter(s => s.health.status === 'faulty').length,
      },
    });
  } catch (error) {
    console.error('Error fetching IoT sensors:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch sensors',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const body = await request.json();
    const { deviceId, name, type, category, specifications, calibration } = body;

    // Validate required fields
    if (!deviceId || !name || !type || !category) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
          required: ['deviceId', 'name', 'type', 'category'],
        },
        { status: 400 }
      );
    }

    // Check if device exists
    const device = optimindIoTArchitecture.getDevices().get(deviceId);
    if (!device) {
      return NextResponse.json(
        {
          success: false,
          error: 'Device not found',
          deviceId,
        },
        { status: 404 }
      );
    }

    // Create sensor object
    const sensorData = {
      deviceId,
      name,
      type,
      category,
      specifications: specifications || {
        range: [0, 100],
        precision: 0.1,
        accuracy: 1.0,
        resolution: 0.01,
        responseTime: 1000,
        samplingRate: 1,
        operatingConditions: {
          temperature: [-40, 85],
          humidity: [0, 100],
        },
        powerRequirements: {
          voltage: 3.3,
          current: 0.01,
          powerConsumption: 0.033,
        },
      },
      calibration: calibration || {
        lastCalibrated: new Date(),
        nextCalibration: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
        method: 'factory',
        standards: ['ISO/IEC 17025'],
        coefficients: {},
        certified: true,
      },
      data: [],
      alerts: [],
      health: {
        status: 'healthy' as const,
        errorRate: 0,
        calibrationStatus: 'valid' as const,
        uptime: 100,
      },
    };

    // Register sensor using the IoT architecture
    const sensorId = optimindIoTArchitecture.registerSensor(sensorData);

    return NextResponse.json(
      {
        success: true,
        data: {
          id: sensorId,
          ...sensorData,
        },
        message: 'Sensor registered successfully',
        timestamp: new Date().toISOString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error registering IoT sensor:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to register sensor',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
