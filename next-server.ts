import next from 'next';

const dev = process.env.NODE_ENV !== 'production';
const port = 3000;
const hostname = '0.0.0.0';

const app = next({ dev, hostname, port });

app.prepare().then(() => {
  console.log(`Next.js app ready on http://${hostname}:${port}`);
}).catch((ex) => {
  console.error(ex.stack);
  process.exit(1);
});
