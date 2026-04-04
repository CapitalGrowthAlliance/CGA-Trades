import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import dotenv from 'dotenv';

dotenv.config();

const firebaseConfig = {
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID,
  firestoreDatabaseId: process.env.VITE_FIREBASE_DATABASE_ID || process.env.FIREBASE_DATABASE_ID,
};

async function test() {
  console.log('Testing Firestore connection...');
  console.log('Project ID:', firebaseConfig.projectId);
  console.log('Database ID:', firebaseConfig.firestoreDatabaseId);

  try {
    if (!firebaseConfig.projectId) {
      throw new Error('VITE_FIREBASE_PROJECT_ID or FIREBASE_PROJECT_ID is missing');
    }

    const app = initializeApp({
      projectId: firebaseConfig.projectId,
    }, 'test-app-' + Date.now());

    const dbId = firebaseConfig.firestoreDatabaseId || "(default)";
    const db = (dbId && dbId !== '(default)') ? getFirestore(app, dbId) : getFirestore(app);

    console.log('Attempting to fetch plans...');
    const snapshot = await db.collection('plans').get();
    console.log('Success! Found', snapshot.size, 'plans.');
  } catch (error: any) {
    console.error('Error:', error.message);
    console.error('Code:', error.code);
  }
}

test();
