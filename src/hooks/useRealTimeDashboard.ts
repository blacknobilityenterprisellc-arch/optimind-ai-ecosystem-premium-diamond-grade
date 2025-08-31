"use client";

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface DashboardMetrics {
  totalContent: number;
  avgOptimizationScore: number;
  activeProjects: number;
  systemHealth: number;
}

interface SystemAlert {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  description: string;
  timestamp: string;
}

interface ActivityUpdate {
  id: string;
  type: string;
  title: string;
  timestamp: string;
  status: string;
}

interface UseRealTimeDashboardReturn {
  metrics: DashboardMetrics | null;
  alerts: SystemAlert[];
  activities: ActivityUpdate[];
  isConnected: boolean;
  connectionError: string | null;
  requestMetricsUpdate: () => void;
  monitorActivity: (type: string, action: string) => void;
  sendSystemAlert: (alert: SystemAlert) => void;
}

export const useRealTimeDashboard = (): UseRealTimeDashboardReturn => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [activities, setActivities] = useState<ActivityUpdate[]>([]);

  useEffect(() => {
    // Initialize socket connection
    const socket = io('http://localhost:3001', {
      transports: ['websocket', 'polling'],
      timeout: 5000,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    // Connection events
    socket.on('connect', () => {
      console.log('Connected to real-time dashboard');
      setIsConnected(true);
      setConnectionError(null);
      
      // Subscribe to dashboard updates
      socket.emit('subscribe-dashboard');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from real-time dashboard');
      setIsConnected(false);
    });

    socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      setIsConnected(false);
      setConnectionError(error.message);
    });

    // Dashboard data events
    socket.on('dashboard-init', (data) => {
      console.log('Received initial dashboard data:', data);
      setMetrics(data.metrics);
      setAlerts(data.alerts);
      setActivities(data.activities);
    });

    socket.on('metrics-update', (newMetrics: DashboardMetrics) => {
      console.log('Metrics updated:', newMetrics);
      setMetrics(newMetrics);
    });

    socket.on('new-activity', (activity: ActivityUpdate) => {
      console.log('New activity:', activity);
      setActivities(prev => {
        // Keep only the latest 10 activities
        const updated = [activity, ...prev];
        return updated.slice(0, 10);
      });
    });

    socket.on('new-alert', (alert: SystemAlert) => {
      console.log('New alert:', alert);
      setAlerts(prev => {
        // Keep only the latest 5 alerts
        const updated = [alert, ...prev];
        return updated.slice(0, 5);
      });
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
      if (socketRef.current) {
        socketRef.current = null;
      }
    };
  }, []);

  // Action functions
  const requestMetricsUpdate = () => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('request-metrics-update');
    }
  };

  const monitorActivity = (type: string, action: string) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('monitor-activity', { type, action });
    }
  };

  const sendSystemAlert = (alert: SystemAlert) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('system-alert', alert);
    }
  };

  return {
    metrics,
    alerts,
    activities,
    isConnected,
    connectionError,
    requestMetricsUpdate,
    monitorActivity,
    sendSystemAlert,
  };
};