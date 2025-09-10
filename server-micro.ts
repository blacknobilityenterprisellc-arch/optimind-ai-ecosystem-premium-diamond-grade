// server-micro.ts - Micro-Second Startup Server
import { createServer } from 'http';
import next from 'next';

const port = parseInt(process.env.PORT || '3006', 10);
const hostname = '0.0.0.0';

console.log('🚀 Starting micro-server...');

// Micro-optimized configuration
const nextApp = next({
  dev: true,
  hostname,
  port,
  dir: process.cwd(),
  quiet: true,
  turbopack: true,
  // Disable all non-essential features
  experimental: {},
  conf: {
    compress: false,
    poweredByHeader: false,
    generateEtags: false,
    generateBuildId: false,
  }
});

const handler = nextApp.getRequestHandler();
const server = createServer(handler);

// Start server immediately - don't wait for prepare
server.listen(port, hostname, () => {
  console.log(`⚡ Micro-server ready on http://${hostname}:${port}`);
});

// Prepare in background without blocking
nextApp.prepare().catch(err => {
  console.error('Prepare failed:', err);
});

// Clean shutdown
process.on('SIGINT', () => {
  console.log('🛑 Shutting down...');
  server.close(() => process.exit(0));
});