// server-ultra-fast.ts - Ultra-Fast Enterprise Server Startup
import { createServer } from 'http';
import { Server } from 'socket.io';
import next from 'next';

const dev = process.env.NODE_ENV !== 'production';
const port = parseInt(process.env.PORT || '3002', 10);
const hostname = process.env.HOSTNAME || '0.0.0.0';

// Ultra-fast server configuration - minimal overhead
const serverConfig = {
  dev,
  dir: process.cwd(),
  hostname,
  port,
  // Critical speed optimizations
  quiet: true,
  turbopack: true, // Always enabled for speed
  // Disable heavy features during startup
  experimental: {
    // No incremental cache in dev for speed
    incrementalCacheHandlerPath: undefined,
  },
  // Reduce memory usage
  maxMemoryCacheSize: 5, // 5MB instead of default 50MB
  // Faster compilation
  swcMinify: true,
  // Disable unused features
  distDir: '.next',
  // Optimize for development speed
  compress: false, // Disable compression in dev for speed
  poweredByHeader: false,
};

// Ultra-fast server setup
async function createUltraFastServer() {
  const startTime = Date.now();
  
  try {
    console.log('🚀 Starting OptiMind AI Ecosystem...');
    
    // Create Next.js app with ultra-optimized config
    const nextApp = next(serverConfig);
    const handler = nextApp.getRequestHandler();

    // Prepare app with timeout protection
    const preparePromise = Promise.race([
      nextApp.prepare(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Preparation timeout')), 10000)
      )
    ]);
    
    // Create HTTP server immediately
    const httpServer = createServer(handler);
    
    // Initialize Socket.IO with minimal settings
    const io = new Server(httpServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      },
      transports: ['websocket'], // WebSocket only for speed
      pingTimeout: 60000,
      pingInterval: 30000,
    });

    // Wait for app preparation
    await preparePromise;
    
    // Ultra-lightweight socket setup
    io.on('connection', (socket) => {
      socket.emit('connected', { status: 'ready', timestamp: Date.now() });
      
      socket.on('disconnect', () => {
        // Minimal cleanup
      });
    });

    // Start server immediately
    httpServer.listen(port, hostname, () => {
      const totalTime = Date.now() - startTime;
      console.log(`✅ OptiMind AI Ecosystem Ready!`);
      console.log(`🌐 Server: http://${hostname}:${port}`);
      console.log(`⚡ Startup: ${totalTime}ms`);
      console.log(`🔌 Socket.IO: Active`);
      console.log(`💎 Premium Mode: Enabled`);
    });

    // Minimal error handling
    const gracefulShutdown = (signal: string) => {
      console.log(`🛑 Received ${signal}, shutting down...`);
      httpServer.close(() => process.exit(0));
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    process.on('uncaughtException', (error) => {
      console.error('💥 Uncaught Exception:', error.message);
    });

  } catch (error) {
    console.error('❌ Server startup failed:', error);
    process.exit(1);
  }
}

// Start server immediately without any delays
createUltraFastServer().catch((error) => {
  console.error('💥 Critical startup failure:', error);
  process.exit(1);
});