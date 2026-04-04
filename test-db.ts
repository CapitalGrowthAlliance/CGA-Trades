import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import firebaseConfig from './firebase-applet-config.json' assert { type: 'json' };

async function test() {
  console.log('Testing Firestore connection...');
  console.log('Project ID:', firebaseConfig.projectId);
  console.log('Database ID:', firebaseConfig.firestoreDatabaseId);

  try {
    const app = initializeApp({
      projectId: firebaseConfig.projectId,
    }, 'test-app-' + Date.now());

    const dbId = "(default)";
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
