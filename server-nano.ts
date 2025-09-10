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

const server = createServer(nextApp.getRequestHandler());

// Listen immediately - don't wait for prepare
server.listen(port, hostname, () => {
  console.log(`⚡ Nano-server ready: http://${hostname}:${port}`);
});

// Prepare in background without blocking startup
nextApp.prepare().then(() => {
  console.log('✅ Next.js prepared');
}).catch(err => {
  console.error('Prepare failed:', err);
});

// Handle shutdown gracefully
process.on('SIGINT', () => {
  console.log('🛑 Shutting down...');
  server.close(() => process.exit(0));
});