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

// Check if critical environment variables are missing
const isConfigMissing = !firebaseConfig.apiKey || !firebaseConfig.projectId;

if (isConfigMissing) {
  console.error("Firebase: Critical environment variables (VITE_FIREBASE_API_KEY or VITE_FIREBASE_PROJECT_ID) are missing. Please check your environment configuration.");
}

// Log configuration (excluding sensitive data)
console.log("Firebase: Initializing with config:", {
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain,
  storageBucket: firebaseConfig.storageBucket,
  databaseURL: (firebaseConfig as any).databaseURL,
  firestoreDatabaseId: firebaseConfig.firestoreDatabaseId || '(default)',
  usingEnv: !isConfigMissing
});

let app;
try {
  app = initializeApp(firebaseConfig);
  console.log("Firebase: App initialized successfully");
} catch (error) {
  console.error("Firebase: Failed to initialize app:", error);
  // Create a dummy app to prevent further crashes, though the app will likely fail
  app = initializeApp({ apiKey: 'dummy', projectId: 'dummy' }, 'dummy-fallback');
}

// Initialize Firestore with the correct database ID
const dbId = firebaseConfig.firestoreDatabaseId;
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
