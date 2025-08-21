import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serveStatic } from 'hono/bun';
import { userService } from './db/services';

const app = new Hono();

// Enable CORS
app.use('*', cors({
  origin: process.env.NODE_ENV === 'production' ? '*' : ['http://localhost:5173', 'http://localhost:5174'],
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['POST', 'GET', 'OPTIONS', 'PUT', 'DELETE'],
}));

// Health check routes
app.get('/api/health', (c) => {
  return c.json({
    status: 'ok',
    message: 'PingPong server is running!',
    timestamp: new Date().toISOString(),
    database: 'connected'
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

// User API routes
app.get('/api/users', async (c) => {
  try {
    const limit = Number(c.req.query('limit')) || 10;
    const offset = Number(c.req.query('offset')) || 0;
    const users = await userService.listUsers(limit, offset);
    return c.json({
      data: users,
      pagination: { limit, offset }
    });
  } catch (error) {
    return c.json({ error: 'Failed to fetch users' }, 500);
  }
});

app.get('/api/users/:id', async (c) => {
  try {
    const id = Number(c.req.param('id'));
    const user = await userService.getUserById(id);
    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }
    return c.json({ data: user });
  } catch (error) {
    return c.json({ error: 'Failed to fetch user' }, 500);
  }
});

app.post('/api/users', async (c) => {
  try {
    const userData = await c.req.json();
    const user = await userService.createUser(userData);
    return c.json({ data: user }, 201);
  } catch (error) {
    return c.json({ error: 'Failed to create user' }, 500);
  }
});

// Database stats endpoint
app.get('/api/stats', async (c) => {
  try {
    const userCount = await userService.getUserCount();

    return c.json({
      data: {
        users: userCount,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    return c.json({ error: 'Failed to fetch stats' }, 500);
  }
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
console.log(`📊 Database: SQLite (${process.env.DATABASE_URL || './dev.db'})`);

export default {
  port,
  fetch: app.fetch,
};