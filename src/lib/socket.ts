import { Server } from 'socket.io';

<<<<<<< HEAD
=======
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

>>>>>>> ef631a04b041f300087971414fcec38beffaf1ab
export const setupSocket = (io: Server) => {
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    
<<<<<<< HEAD
    // Handle messages
    socket.on('message', (msg: { text: string; senderId: string }) => {
      // Echo: broadcast message only the client who send the message
=======
    // Join dashboard room for real-time updates
    socket.join('dashboard');
    
    // Handle dashboard subscription
    socket.on('subscribe-dashboard', () => {
      console.log('Client subscribed to dashboard updates:', socket.id);
      
      // Send initial dashboard data
      const initialData = {
        metrics: generateMetrics(),
        alerts: generateAlerts(),
        activities: generateActivities()
      };
      
      socket.emit('dashboard-init', initialData);
    });
    
    // Handle real-time metrics updates
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
        status: 'success'
      };
      
      io.to('dashboard').emit('new-activity', activity);
    });
    
    // Handle system alerts
    socket.on('system-alert', (alert: SystemAlert) => {
      io.to('dashboard').emit('new-alert', alert);
    });
    
    // Simulate real-time updates every 30 seconds
    const updateInterval = setInterval(() => {
      if (io.sockets.adapter.rooms.has('dashboard')) {
        const metrics = generateMetrics();
        io.to('dashboard').emit('metrics-update', metrics);
        
        // Occasionally add new activities
        if (Math.random() > 0.7) {
          const activities = generateActivities();
          const randomActivity = activities[Math.floor(Math.random() * activities.length)];
          io.to('dashboard').emit('new-activity', randomActivity);
        }
      }
    }, 30000);
    
    // Handle messages (legacy support)
    socket.on('message', (msg: { text: string; senderId: string }) => {
>>>>>>> ef631a04b041f300087971414fcec38beffaf1ab
      socket.emit('message', {
        text: `Echo: ${msg.text}`,
        senderId: 'system',
        timestamp: new Date().toISOString(),
      });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
<<<<<<< HEAD
=======
      clearInterval(updateInterval);
      socket.leave('dashboard');
>>>>>>> ef631a04b041f300087971414fcec38beffaf1ab
    });

    // Send welcome message
    socket.emit('message', {
<<<<<<< HEAD
      text: 'Welcome to WebSocket Echo Server!',
=======
      text: 'Welcome to OptiMind AI Ecosystem Real-time Dashboard!',
>>>>>>> ef631a04b041f300087971414fcec38beffaf1ab
      senderId: 'system',
      timestamp: new Date().toISOString(),
    });
  });
<<<<<<< HEAD
};
=======
};

// Helper functions to generate realistic data
function generateMetrics(): DashboardMetrics {
  return {
    totalContent: Math.floor(Math.random() * 100) + 1200,
    avgOptimizationScore: Math.floor(Math.random() * 20) + 80,
    activeProjects: Math.floor(Math.random() * 10) + 20,
    systemHealth: Math.floor(Math.random() * 10) + 90
  };
}

function generateAlerts(): SystemAlert[] {
  const alertTypes = ['info', 'warning', 'error', 'success'] as const;
  const alerts: SystemAlert[] = [];
  
  for (let i = 0; i < 3; i++) {
    alerts.push({
      id: Date.now().toString() + i,
      type: alertTypes[Math.floor(Math.random() * alertTypes.length)],
      title: `System Alert ${i + 1}`,
      description: `This is a sample system alert description.`,
      timestamp: `${Math.floor(Math.random() * 60) + 1} minutes ago`
    });
  }
  
  return alerts;
}

function generateActivities(): ActivityUpdate[] {
  const activityTypes = ['content', 'optimization', 'research', 'system'];
  const statuses = ['success', 'in_progress', 'info', 'error'];
  const activities: ActivityUpdate[] = [];
  
  const titles = [
    'AI Content Generation Completed',
    'SEO Analysis Updated',
    'Multi-Model Analysis Started',
    'System Maintenance Scheduled',
    'Performance Optimization Applied',
    'Data Sync Completed',
    'Security Scan Finished',
    'API Rate Limit Reset'
  ];
  
  for (let i = 0; i < 4; i++) {
    activities.push({
      id: Date.now().toString() + i,
      type: activityTypes[Math.floor(Math.random() * activityTypes.length)],
      title: titles[Math.floor(Math.random() * titles.length)],
      timestamp: `${Math.floor(Math.random() * 120) + 1} minutes ago`,
      status: statuses[Math.floor(Math.random() * statuses.length)]
    });
  }
  
  return activities;
}
>>>>>>> ef631a04b041f300087971414fcec38beffaf1ab
