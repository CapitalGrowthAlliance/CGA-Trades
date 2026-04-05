import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

// Import the Firebase configuration from the generated file
import firebaseAppletConfig from '../firebase-applet-config.json';

// Use environment variables for Firebase configuration with fallback to the config file
const getEnv = (key: string, fallback: string | null = null) => {
  const value = import.meta.env[key];
  return value && value !== '' ? value : fallback;
};

const firebaseConfig = {
  apiKey: getEnv('VITE_FIREBASE_API_KEY', firebaseAppletConfig.apiKey),
  authDomain: getEnv('VITE_FIREBASE_AUTH_DOMAIN', firebaseAppletConfig.authDomain),
  projectId: getEnv('VITE_FIREBASE_PROJECT_ID', firebaseAppletConfig.projectId),
  storageBucket: getEnv('VITE_FIREBASE_STORAGE_BUCKET', firebaseAppletConfig.storageBucket),
  messagingSenderId: getEnv('VITE_FIREBASE_MESSAGING_SENDER_ID', firebaseAppletConfig.messagingSenderId),
  appId: getEnv('VITE_FIREBASE_APP_ID', firebaseAppletConfig.appId),
  databaseURL: getEnv('VITE_FIREBASE_DATABASE_URL', (firebaseAppletConfig as any).databaseURL || null),
  firestoreDatabaseId: getEnv('VITE_FIREBASE_DATABASE_ID', firebaseAppletConfig.firestoreDatabaseId),
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
  usingEnv: !!import.meta.env.VITE_FIREBASE_API_KEY
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
  if (isConfigMissing) {
    console.warn("Firebase: Connection test skipped due to missing configuration.");
    return;
  }
  
  try {
    console.log("Firebase: Testing connection to Firestore...");
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log("Firebase: Connection test successful");
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Firebase: Connection failed. The client is offline. Please ensure your Firebase configuration (VITE_FIREBASE_*) is correctly set in your environment variables.");
    } else {
      console.warn("Firebase: Connection test returned an error (this is normal if the 'test/connection' document doesn't exist):", error);
    }
  }
}

testConnection();
