import { NextRequest, NextResponse } from 'next/server';
import { optimindIoTArchitecture } from '@/lib/iot-architecture';

/**
 * IoT Devices API Endpoint
 * 
 * Provides RESTful API for managing IoT devices in the OptiMind AI Ecosystem.
 * Supports CRUD operations, device registration, and status monitoring.
 */

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const category = searchParams.get('category');

    // Get devices from the IoT architecture
    const devices = Array.from(optimindIoTArchitecture.getDevices().values());
    
    // Apply filters
    let filteredDevices = devices;
    if (type) {
      filteredDevices = filteredDevices.filter(device => device.type === type);
    }
    if (status) {
      filteredDevices = filteredDevices.filter(device => device.status === status);
    }
    if (category) {
      filteredDevices = filteredDevices.filter(device => {
        // Check if device has sensors of the specified category
        const deviceSensors = Array.from(optimindIoTArchitecture.getSensors().values())
          .filter(sensor => sensor.deviceId === device.id);
        return deviceSensors.some(sensor => sensor.category === category);
      });
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedDevices = filteredDevices.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: paginatedDevices,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(filteredDevices.length / limit),
        totalItems: filteredDevices.length,
        itemsPerPage: limit,
        hasNext: endIndex < filteredDevices.length,
        hasPrev: page > 1
      },
      metadata: {
        timestamp: new Date().toISOString(),
        totalDevices: devices.length,
        onlineDevices: devices.filter(d => d.status === 'online').length,
        offlineDevices: devices.filter(d => d.status === 'offline').length
      }
    });
  } catch (error) {
    console.error('Error fetching IoT devices:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch devices',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      type,
      category,
      capabilities,
      location,
      connectivity,
      metadata
    } = body;

    // Validate required fields
    if (!name || !type || !connectivity) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields',
          required: ['name', 'type', 'connectivity']
        },
        { status: 400 }
      );
    }

    // Create device object
    const deviceData = {
      name,
      type,
      category: category || 'monitoring',
      status: 'offline' as const,
      capabilities: capabilities || [],
      location: location || {},
      connectivity,
      metadata: metadata || {
        manufacturer: 'Unknown',
        model: 'Unknown',
        serialNumber: 'AUTO-' + Date.now(),
        firmwareVersion: '1.0.0',
        hardwareVersion: '1.0.0',
        purchaseDate: new Date(),
        configuration: {},
        customAttributes: {}
      },
      lastSeen: new Date(),
      health: {
        overall: 'good' as const,
        metrics: [],
        alerts: []
      }
    };

    // Register device using the IoT architecture
    const deviceId = optimindIoTArchitecture.registerDevice(deviceData);

    return NextResponse.json({
      success: true,
      data: {
        id: deviceId,
        ...deviceData
      },
      message: 'Device registered successfully',
      timestamp: new Date().toISOString()
    }, { status: 201 });
  } catch (error) {
    console.error('Error registering IoT device:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to register device',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}