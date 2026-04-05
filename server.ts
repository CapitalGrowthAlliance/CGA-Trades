import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import aiRoutes from './src/server/routes/ai';
import marketRoutes from './src/server/routes/markets';
import dotenv from 'dotenv';
dotenv.config();

// Handle __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();

// Middleware
app.use(express.json());

// API Routes (Non-Firebase dependent)
app.use('/api/ai', aiRoutes);
app.use('/api/markets', marketRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    environment: process.env.NODE_ENV || 'development'
  });
});

async function startServer() {
  const PORT = 3000;

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    try {
      const { createServer: createViteServer } = await import('vite');
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    } catch (err) {
      console.error('Failed to set up Vite middleware:', err);
    }
  } else {
    // Serve static files in production
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// Only start the server if this file is run directly
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  startServer().catch(console.error);
}
