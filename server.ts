// server.ts - Lightning-Fast Enterprise-Grade Next.js Standalone + Socket.IO
import { createServer } from 'http';
import { Server } from 'socket.io';
import next from 'next';
import { setupSocket } from './src/lib/socket-lightning';

const dev = process.env.NODE_ENV !== 'production';
const port = parseInt(process.env.PORT || '3000', 10);
const hostname = process.env.HOSTNAME || '0.0.0.0';

// Lightning-fast server configuration
const serverConfig = {
  dev,
  dir: process.cwd(),
  hostname,
  port,
  // Speed optimizations
  quiet: true, // Reduce console noise for faster startup
  turbopack: process.env.TURBOPACK === '1' || process.argv.includes('--turbo'),
  // Remove heavy features for development speed
  experimental: {
    // Only enable in production
    ...(process.env.NODE_ENV === 'production' && {
      incrementalCacheHandlerPath: require.resolve('./cache-handler.js'),
    }),
  },
};

// Lightning-fast server with Socket.IO integration
async function createLightningServer() {
  const startTime = Date.now();
  
  try {
    // Create Next.js app with optimized config
    const nextApp = next(serverConfig);
    const handler = nextApp.getRequestHandler();

    // Prepare app in parallel with other setup
    const preparePromise = nextApp.prepare();
    
    // Create HTTP server immediately
    const httpServer = createServer(handler);
    
    // Initialize Socket.IO with optimized settings
    const io = new Server(httpServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      },
      // Optimized transports for speed
      transports: ['websocket'],
      pingTimeout: 30000,
      pingInterval: 15000,
    });

    // Wait for app preparation
    await preparePromise;
    
    // Setup socket handlers (lightweight)
    setupSocket(io);

    // Start server
    httpServer.listen(port, hostname, () => {
      const totalTime = Date.now() - startTime;
      console.log(`🚀 OptiMind AI Ecosystem running on http://${hostname}:${port}`);
      console.log(`⚡ Startup time: ${totalTime}ms`);
      console.log(`🔌 Socket.IO ready`);
    });

    // Essential error handling (minimal)
    process.on('SIGTERM', () => {
      httpServer.close(() => process.exit(0));
    });

    process.on('SIGINT', () => {
      httpServer.close(() => process.exit(0));
    });

    process.on('uncaughtException', (error) => {
      console.error('❌ Uncaught Exception:', error.message);
    });

  } catch (error) {
    console.error('❌ Server startup failed:', error);
    process.exit(1);
  }
}

// Minimal startup header
console.log('⚡ OptiMind AI Ecosystem - Lightning Mode');

// Start server immediately
createLightningServer().catch((error) => {
  console.error('💥 Server startup failed:', error);
  process.exit(1);
});
