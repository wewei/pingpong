import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serveStatic } from 'hono/bun';

const app = new Hono();

// Enable CORS
app.use('*', cors({
  origin: process.env.NODE_ENV === 'production' ? '*' : ['http://localhost:5173'],
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['POST', 'GET', 'OPTIONS', 'PUT', 'DELETE'],
}));

// API routes
app.get('/api/health', (c) => {
  return c.json({
    status: 'ok',
    message: 'PingPong server is running!',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/ping', (c) => {
  return c.json({ message: 'pong' });
});

app.post('/api/echo', async (c) => {
  const body = await c.req.json();
  return c.json({
    echo: body,
    timestamp: new Date().toISOString()
  });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use('/*', serveStatic({ root: './dist/client' }));

  // Fallback to index.html for SPA routing
  app.get('*', serveStatic({
    path: './dist/client/index.html'
  }));
}

const port = process.env.PORT || 3000;

console.log(`🚀 Server running at http://localhost:${port}`);

export default {
  port,
  fetch: app.fetch,
};
