import { createServer } from 'http';

const port = 3000;
const hostname = '0.0.0.0';

const server = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('OptiMind AI Minimal Server Running\n');
});

server.listen(port, hostname, () => {
  console.log(`Minimal server running at http://${hostname}:${port}/`);
});
