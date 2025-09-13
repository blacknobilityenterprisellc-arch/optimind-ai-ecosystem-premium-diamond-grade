import { NextRequest, NextResponse } from 'next/server';
import { optimindIoTArchitecture } from '@/lib/iot-architecture';

/**
 * Individual IoT Device API Endpoint
 * 
 * Provides CRUD operations for individual IoT devices including
 * retrieval, update, deletion, and status management.
 */

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const device = optimindIoTArchitecture.getDevices().get(id);

    if (!device) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Device not found',
          deviceId: id
        },
        { status: 404 }
      );
    }

    // Get device sensors
    const deviceSensors = Array.from(optimindIoTArchitecture.getSensors().values())
      .filter(sensor => sensor.deviceId === id);

    return NextResponse.json({
      success: true,
      data: {
        device,
        sensors: deviceSensors,
        sensorCount: deviceSensors.length
      },
      metadata: {
        timestamp: new Date().toISOString(),
        deviceId: id
      }
    });
  } catch (error) {
    console.error('Error fetching IoT device:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch device',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const device = optimindIoTArchitecture.getDevices().get(id);
    if (!device) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Device not found',
          deviceId: id
        },
        { status: 404 }
      );
    }

    // Update device fields
    const updatedDevice = {
      ...device,
      ...body,
      id: device.id, // Prevent ID changes
      updatedAt: new Date()
    };

    // Update device in architecture (this would need a method in the architecture class)
    // For now, we'll simulate the update
    optimindIoTArchitecture.getDevices().set(id, updatedDevice);

    return NextResponse.json({
      success: true,
      data: updatedDevice,
      message: 'Device updated successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating IoT device:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update device',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const device = optimindIoTArchitecture.getDevices().get(id);
    if (!device) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Device not found',
          deviceId: id
        },
        { status: 404 }
      );
    }

    // Remove device and its sensors
    optimindIoTArchitecture.getDevices().delete(id);
    
    // Remove associated sensors
    const sensorsToDelete = Array.from(optimindIoTArchitecture.getSensors().values())
      .filter(sensor => sensor.deviceId === id);
    
    sensorsToDelete.forEach(sensor => {
      optimindIoTArchitecture.getSensors().delete(sensor.id);
    });

    return NextResponse.json({
      success: true,
      message: 'Device and associated sensors deleted successfully',
      deletedDevice: {
        id,
        name: device.name,
        sensorsDeleted: sensorsToDelete.length
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error deleting IoT device:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete device',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}