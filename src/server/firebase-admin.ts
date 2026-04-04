import { initializeApp, getApps, getApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

const getEnv = (keys: string[]) => {
  for (const key of keys) {
    const value = process.env[key];
    if (value && value !== '') return value;
  }
  return null;
};

export const firebaseConfig = {
  projectId: getEnv(['VITE_FIREBASE_PROJECT_ID', 'FIREBASE_PROJECT_ID']),
  firestoreDatabaseId: getEnv(['VITE_FIREBASE_DATABASE_ID', 'FIREBASE_DATABASE_ID']),
};

// Lazy app initialization
let adminApp: any = null;

const getAdminApp = () => {
  if (adminApp) return adminApp;

  const existingApps = getApps();
  const targetProjectId = firebaseConfig.projectId || process.env.GOOGLE_CLOUD_PROJECT;
  const appName = 'admin-app-' + (targetProjectId || 'default');

  // 1. Check if an app with our specific name already exists
  const existingNamedApp = existingApps.find(a => a.name === appName);
  if (existingNamedApp) {
    adminApp = existingNamedApp;
    return adminApp;
  }

  // 2. Try to initialize with explicit project ID if we have one
  if (targetProjectId && targetProjectId !== 'YOUR_PROJECT_ID') {
    try {
      adminApp = initializeApp({
        projectId: targetProjectId,
      }, appName);
      return adminApp;
    } catch (e: any) {
      console.error(`[FirebaseAdmin] Named app initialization failed for ${targetProjectId}: ${e.message}`);
    }
  }

  // 3. Try default initialization (best for Cloud Run if project ID matches environment)
  try {
    if (existingApps.length === 0) {
      adminApp = initializeApp();
      return adminApp;
    }
  } catch (e: any) {
    // Ignore
  }

  // 4. Check if the default app exists and use it as fallback
  const defaultApp = existingApps.find(a => a.name === '[DEFAULT]');
  if (defaultApp) {
    adminApp = defaultApp;
    return adminApp;
  }

  // 5. Last resort: initialize with empty options
  try {
    adminApp = initializeApp({}, appName + '-final-' + Date.now());
    return adminApp;
  } catch (e: any) {
    console.error(`[FirebaseAdmin] All initialization attempts failed: ${e.message}`);
    throw e;
  }
};

let db: any;
let storage: any;

export const getAdminDb = () => {
  if (!db) {
    const dbId = firebaseConfig.firestoreDatabaseId;
    
    try {
      const app = getAdminApp();
      
      // Try to initialize with the specified database ID
      if (dbId && dbId !== '(default)' && dbId !== '') {
        try {
          db = getFirestore(app, dbId);
        } catch (dbErr: any) {
          console.error(`[FirebaseAdmin] Failed to initialize named database "${dbId}":`, dbErr.message);
          db = getFirestore(app);
        }
      } else {
        db = getFirestore(app);
      }
    } catch (e: any) {
      console.error('[FirebaseAdmin] Firestore initialization failed:', e.message);
      try {
        const fallbackApp = getApps().find(a => a.name === '[DEFAULT]') || getAdminApp();
        db = getFirestore(fallbackApp);
      } catch (e2: any) {
        console.error('[FirebaseAdmin] Firestore fallback failed:', e2.message);
      }
    }
  }
  return db;
};

// Allow switching database if needed (e.g. on PERMISSION_DENIED)
export const setAdminDb = (newDb: any) => {
  db = newDb;
};

export const getAdminStorage = () => {
  if (!storage) {
    try {
      storage = getStorage(getAdminApp());
    } catch (e) {
      console.error('[FirebaseAdmin] Storage initialization failed:', e);
    }
  }
  return storage;
};

// Export services directly as getters or simple objects if possible
// But to maintain compatibility with existing imports, we'll keep the names
// but use a simpler getter pattern if Proxy is the issue.

// Actually, let's keep the Proxy but make it more robust
export const adminDb = new Proxy({} as any, {
  get: (target, prop) => {
    if (prop === '_isProxy') return true;
    const service = getAdminDb();
    if (!service) return undefined;
    const value = service[prop];
    return typeof value === 'function' ? value.bind(service) : value;
  }
});

export const adminStorage = new Proxy({} as any, {
  get: (target, prop) => {
    const service = getAdminStorage();
    if (!service) return undefined;
    const value = service[prop];
    return typeof value === 'function' ? value.bind(service) : value;
  }
});
