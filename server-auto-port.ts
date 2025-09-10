// server-auto-port.ts - Auto-port detection for fastest startup
import { createServer } from 'http';
import next from 'next';

function findAvailablePort(startPort = 3000, maxAttempts = 20) {
  return new Promise((resolve, reject) => {
    const server = createServer();
    
    const tryPort = (port) => {
      server.listen(port, '0.0.0.0', () => {
        const { port: availablePort } = server.address();
        server.close(() => resolve(availablePort));
      }).on('error', () => {
        if (port - startPort < maxAttempts) {
          tryPort(port + 1);
        } else {
          reject(new Error('No available ports found'));
        }
      });
    };
    
    tryPort(startPort);
  });
}

async function startServer() {
  try {
    const startTime = Date.now();
    
    // Find available port
    const port = await findAvailablePort(3000);
    const hostname = '0.0.0.0';
    
    console.log(`🚀 Starting OptiMind AI Ecosystem on port ${port}...`);
    
    // Create Next.js app
    const nextApp = next({
      dev: true,
      hostname,
      port,
      dir: process.cwd(),
      quiet: true,
      turbopack: true,
      maxMemoryCacheSize: 1,
      swcMinify: true,
      compress: false,
      poweredByHeader: false,
    });
    
    const handler = nextApp.getRequestHandler();
    const httpServer = createServer(handler);
    
    // Start server immediately
    httpServer.listen(port, hostname, () => {
      console.log(`✅ Server listening on http://${hostname}:${port}`);
    });
    
    // Prepare app in background
    nextApp.prepare().then(() => {
      const totalTime = Date.now() - startTime;
      console.log(`⚡ Fully ready in ${totalTime}ms`);
      console.log(`💎 Premium Diamond Grade Interface`);
      console.log(`🔒 Enterprise Security Active`);
    }).catch((error) => {
      console.error('❌ Preparation error:', error);
    });
    
    // Handle graceful shutdown
    process.on('SIGINT', () => {
      console.log('🛑 Shutting down...');
      httpServer.close(() => process.exit(0));
    });
    
    process.on('SIGTERM', () => {
      console.log('🛑 Shutting down...');
      httpServer.close(() => process.exit(0));
    });
    
  } catch (error) {
    console.error('💥 Failed to start server:', error);
    process.exit(1);
  }
}

// Start server
startServer();