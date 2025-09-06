import { createServer } from 'http';
import next from 'next';

console.log("Starting debug server...");

const dev = process.env.NODE_ENV !== 'production';
const port = parseInt(process.env.PORT || '3000', 10);
const hostname = process.env.HOSTNAME || '0.0.0.0';

console.log(`Environment: ${dev ? 'development' : 'production'}`);
console.log(`Port: ${port}`);
console.log(`Hostname: ${hostname}`);

try {
  console.log("Creating Next.js app...");
  const nextApp = next({ dev, hostname, port });
  
  console.log("Preparing Next.js app...");
  nextApp.prepare().then(() => {
    console.log("Next.js app prepared successfully");
    
    const handler = nextApp.getRequestHandler();
    
    console.log("Creating HTTP server...");
    const httpServer = createServer(handler);
    
    console.log(`Starting server on http://${hostname}:${port}`);
    httpServer.listen(port, hostname, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
    
    process.on('SIGTERM', () => {
      console.log('SIGTERM received, shutting down gracefully');
      httpServer.close(() => {
        process.exit(0);
      });
    });
  }).catch((error) => {
    console.error('Error preparing Next.js app:', error);
    process.exit(1);
  });
} catch (error) {
  console.error('Error creating server:', error);
  process.exit(1);
}
