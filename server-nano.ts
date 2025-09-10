// server-nano.ts - Nano-Second Startup (Fastest Possible)
import { createServer } from 'http';
import next from 'next';

const port = parseInt(process.env.PORT || '3007', 10);
const hostname = '0.0.0.0';

// Start server immediately - no waiting
console.log('🚀 Nano-server starting...');

const nextApp = next({
  dev: true,
  hostname,
  port,
  dir: process.cwd(),
  quiet: true,
  turbopack: false, // Disable turbopack for fastest startup
  experimental: {},
  conf: {
    compress: false,
    poweredByHeader: false,
    generateEtags: false,
    generateBuildId: false,
  }
});

const server = createServer();

// Prepare Next.js first, then start listening
nextApp.prepare().then(() => {
  // Set up the request handler after preparation
  server.on('request', nextApp.getRequestHandler());
  
  // Start listening
  server.listen(port, hostname, () => {
    console.log(`⚡ Nano-server ready: http://${hostname}:${port}`);
  });
}).catch(err => {
  console.error('❌ Next.js preparation failed:', err);
  process.exit(1);
});

// Handle shutdown gracefully
process.on('SIGINT', () => {
  console.log('🛑 Shutting down...');
  server.close(() => process.exit(0));
});

process.on('SIGTERM', () => {
  console.log('🛑 Shutting down...');
  server.close(() => process.exit(0));
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});