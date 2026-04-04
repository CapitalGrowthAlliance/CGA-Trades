import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import storageRoutes from './src/server/routes/storage';
import userRoutes from './src/server/routes/user';
import chatRoutes from './src/server/routes/chat';
import aiRoutes from './src/server/routes/ai';
import marketRoutes from './src/server/routes/markets';
import adminRoutes from './src/server/routes/admin';
import { initDb } from './src/server/db';
import { adminDb } from './src/server/firebase-admin';
import dotenv from 'dotenv';
dotenv.config();

const getEnv = (keys: string[]) => {
  for (const key of keys) {
    const value = process.env[key];
    if (value && value !== '') return value;
  }
  return null;
};

const firebaseConfig = {
  projectId: getEnv(['VITE_FIREBASE_PROJECT_ID', 'FIREBASE_PROJECT_ID']),
  firestoreDatabaseId: getEnv(['VITE_FIREBASE_DATABASE_ID', 'FIREBASE_DATABASE_ID']),
};

// Handle __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();

// Initialize Database before anything else
initDb().catch((err) => {
  console.error('Database initialization failed:', err);
});

// Middleware
app.use(express.json());

// API Routes
app.use('/api/storage', storageRoutes);
app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/markets', marketRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', async (req, res) => {
  try {
    const projectId = firebaseConfig.projectId;
    const databaseId = firebaseConfig.firestoreDatabaseId || '(default)';
    
    // adminDb is a proxy, so this will trigger initialization only when called
    const snapshot = await adminDb.collection('health').limit(1).get();
    res.json({ 
      status: 'ok', 
      firestore: 'connected',
      details: {
        projectId,
        databaseId,
        empty: snapshot.empty
      }
    });
  } catch (error: any) {
    console.error('[HealthCheck] Firestore health check failed:', error.message || error);
    res.status(500).json({ 
      status: 'error', 
      firestore: error instanceof Error ? error.message : String(error),
      code: error.code,
      details: {
        projectId: firebaseConfig.projectId,
        databaseId: firebaseConfig.firestoreDatabaseId || '(default)'
      }
    });
  }
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
    // Server started
  });
}

// Only start the server if this file is run directly
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  startServer().catch(console.error);
}
