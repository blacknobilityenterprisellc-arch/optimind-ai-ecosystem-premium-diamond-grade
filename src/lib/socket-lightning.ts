// socket.ts - Lightning-Fast Socket.IO Setup
import { Server } from 'socket.io';

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

export const setupSocket = (io: Server) => {
  io.on('connection', socket => {
    // Join dashboard room
    socket.join('dashboard');

    // Handle dashboard subscription
    socket.on('subscribe-dashboard', () => {
      // Send initial data (minimal)
      const initialData = {
        metrics: generateMetrics(),
        alerts: [],
        activities: [],
      };

      socket.emit('dashboard-init', initialData);
    });

    // Handle metrics updates
    socket.on('request-metrics-update', () => {
      const metrics = generateMetrics();
      io.to('dashboard').emit('metrics-update', metrics);
    });

    // Handle activity monitoring
    socket.on('monitor-activity', (data: { type: string; action: string }) => {
      const activity: ActivityUpdate = {
        id: Date.now().toString(),
        type: data.type,
        title: data.action,
        timestamp: 'Just now',
        status: 'success',
      };

      io.to('dashboard').emit('new-activity', activity);
    });

    // Handle system alerts
    socket.on('system-alert', (alert: SystemAlert) => {
      io.to('dashboard').emit('new-alert', alert);
    });

    // Lightweight real-time updates (longer interval for performance)
    const updateInterval = setInterval(() => {
      if (io.sockets.adapter.rooms.has('dashboard')) {
        const metrics = generateMetrics();
        io.to('dashboard').emit('metrics-update', metrics);
      }
    }, 60000); // Increased from 30s to 60s for better performance

    // Handle messages (minimal)
    socket.on('message', (msg: { text: string; senderId: string }) => {
      socket.emit('message', {
        text: `Echo: ${msg.text}`,
        senderId: 'system',
        timestamp: new Date().toISOString(),
      });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      clearInterval(updateInterval);
      socket.leave('dashboard');
    });

    // Minimal welcome message
    socket.emit('message', {
      text: 'Connected to OptiMind AI Ecosystem',
      senderId: 'system',
      timestamp: new Date().toISOString(),
    });
  });
};

// Simplified metrics generation
function generateMetrics(): DashboardMetrics {
  return {
    totalContent: 1250,
    avgOptimizationScore: 85,
    activeProjects: 25,
    systemHealth: 95,
  };
}