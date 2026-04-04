import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

// Use environment variables for Firebase configuration
const getEnv = (key: string) => {
  const value = import.meta.env[key];
  return value && value !== '' ? value : null;
};

const firebaseConfig = {
  apiKey: getEnv('VITE_FIREBASE_API_KEY'),
  authDomain: getEnv('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: getEnv('VITE_FIREBASE_PROJECT_ID'),
  storageBucket: getEnv('VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnv('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnv('VITE_FIREBASE_APP_ID'),
  databaseURL: getEnv('VITE_FIREBASE_DATABASE_URL'),
  firestoreDatabaseId: getEnv('VITE_FIREBASE_DATABASE_ID'),
};

// Fallback to hardcoded config if env vars are missing
import fallbackConfig from '../firebase-applet-config.json';

// Use env config only if at least apiKey and projectId are provided
const isEnvConfigValid = !!(firebaseConfig.apiKey && firebaseConfig.projectId);
const finalConfig = isEnvConfigValid ? firebaseConfig : fallbackConfig;

if (!isEnvConfigValid) {
  console.warn("Firebase: Using fallback configuration from firebase-applet-config.json because environment variables are missing or incomplete.");
}

// Log configuration (excluding sensitive data)
console.log("Firebase: Initializing with config:", {
  projectId: finalConfig.projectId,
  authDomain: finalConfig.authDomain,
  storageBucket: finalConfig.storageBucket,
  databaseURL: (finalConfig as any).databaseURL,
  firestoreDatabaseId: finalConfig.firestoreDatabaseId || '(default)',
  usingEnv: isEnvConfigValid
});

const app = initializeApp(finalConfig);

// Initialize Firestore with the correct database ID
const dbId = finalConfig.firestoreDatabaseId;
export const db = (dbId && dbId !== '(default)' && dbId !== '')
  ? getFirestore(app, dbId)
  : getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

// Validate connection to Firestore
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration. The client is offline.");
    }
  }
}

testConnection();
