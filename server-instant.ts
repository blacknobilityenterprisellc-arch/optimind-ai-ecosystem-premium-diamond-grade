// server-instant.ts - Instant Startup Server
import { createServer } from 'http';
import next from 'next';

const port = parseInt(process.env.PORT || '3004', 10);
const hostname = '0.0.0.0';

// Clear any existing processes on this port
try {
  const { execSync } = require('child_process');
  execSync(`fuser -k ${port}/tcp`, { stdio: 'ignore' });
} catch (e) {
  // Ignore errors if port is already free
}

// Absolute minimal configuration for instant startup
const nextApp = next({
  dev: true,
  hostname,
  port,
  dir: process.cwd(),
  quiet: true,
  turbopack: true,
});

const handler = nextApp.getRequestHandler();
const server = createServer(handler);

// Start server immediately
server.listen(port, hostname, () => {
  console.log(`⚡ Instant server ready on http://${hostname}:${port}`);
});

// Prepare app in background
nextApp.prepare().then(() => {
  console.log('✅ Next.js prepared');
}).catch(console.error);

// Basic error handling
process.on('SIGINT', () => server.close(() => process.exit(0)));
process.on('SIGTERM', () => server.close(() => process.exit(0)));