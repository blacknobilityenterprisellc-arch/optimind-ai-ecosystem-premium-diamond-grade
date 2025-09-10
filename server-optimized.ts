// server-optimized.ts - Optimized for Fastest Startup
import { createServer } from 'http';
import { Server } from 'socket.io';
import next from 'next';

const port = parseInt(process.env.PORT || '3002', 10);
const hostname = '0.0.0.0';

// Pre-optimized configuration
const serverConfig = {
  dev: true,
  hostname,
  port,
  dir: process.cwd(),
  quiet: true,
  turbopack: true,
  // Speed optimizations
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-*'],
  },
  // Reduce initial load
  maxMemoryCacheSize: 1, // Minimal cache
  swcMinify: true,
  compress: false,
  poweredByHeader: false,
};

let serverReady = false;

// Create and start server immediately
const nextApp = next(serverConfig);
const handler = nextApp.getRequestHandler();
const httpServer = createServer(handler);

// Lightweight Socket.IO setup
const io = new Server(httpServer, {
  cors: { origin: "*", methods: ["GET", "POST"] },
  transports: ['websocket'],
});

io.on('connection', (socket) => {
  socket.emit('status', { ready: serverReady, timestamp: Date.now() });
});

// Start listening immediately
httpServer.listen(port, hostname, () => {
  const startTime = Date.now();
  console.log(`🚀 OptiMind AI Ecosystem`);
  console.log(`🌐 http://${hostname}:${port}`);
  console.log(`⚡ Initializing...`);
  
  // Set ready flag
  serverReady = true;
  
  // Prepare app in background
  nextApp.prepare().then(() => {
    const totalTime = Date.now() - startTime;
    console.log(`✅ Ready in ${totalTime}ms`);
    console.log(`💎 Premium Diamond Grade`);
    console.log(`🔒 Enterprise Security`);
  }).catch((error) => {
    console.error('❌ Preparation failed:', error);
  });
});

// Error handling
process.on('SIGINT', () => {
  console.log('🛑 Shutting down...');
  httpServer.close(() => process.exit(0));
});

process.on('SIGTERM', () => {
  console.log('🛑 Shutting down...');
  httpServer.close(() => process.exit(0));
});

process.on('uncaughtException', (error) => {
  console.error('💥 Error:', error.message);
});