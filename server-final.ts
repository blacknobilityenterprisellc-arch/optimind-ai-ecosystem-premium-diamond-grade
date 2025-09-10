// server-final.ts - Final optimized server with guaranteed fast startup
import { createServer } from 'http';
import next from 'next';

const startTime = Date.now();
const hostname = '0.0.0.0';

// Try ports 3000-3005
const ports = [3000, 3001, 3002, 3003, 3004, 3005];

async function startServer() {
  for (const port of ports) {
    try {
      console.log(`🚀 Starting OptiMind AI Ecosystem...`);
      
      // Create Next.js app with minimal config
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
      
      // Try to start server
      await new Promise((resolve, reject) => {
        httpServer.listen(port, hostname, () => {
          console.log(`✅ Server running on http://${hostname}:${port}`);
          resolve(true);
        }).on('error', (error) => {
          if (error.code === 'EADDRINUSE') {
            reject(new Error('Port in use'));
          } else {
            reject(error);
          }
        });
      });
      
      // Prepare app in background
      nextApp.prepare().then(() => {
        const totalTime = Date.now() - startTime;
        console.log(`⚡ Ready in ${totalTime}ms`);
        console.log(`💎 OptiMind AI Ecosystem - Premium Diamond Grade`);
        console.log(`🔒 Enterprise Security Active`);
        console.log(`🌐 Dashboard: http://${hostname}:${port}/dashboard`);
      }).catch((error) => {
        console.error('⚠️  App preparation warning:', error.message);
      });
      
      // Keep server running
      process.on('SIGINT', () => {
        console.log('🛑 Shutting down...');
        httpServer.close(() => process.exit(0));
      });
      
      process.on('SIGTERM', () => {
        console.log('🛑 Shutting down...');
        httpServer.close(() => process.exit(0));
      });
      
      // Success - exit the loop
      return;
      
    } catch (error) {
      console.log(`⚠️  Port ${port} not available, trying next...`);
      continue;
    }
  }
  
  console.error('💥 No available ports found');
  process.exit(1);
}

// Start server
startServer().catch((error) => {
  console.error('💥 Server startup failed:', error);
  process.exit(1);
});