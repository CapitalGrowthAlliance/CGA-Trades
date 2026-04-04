import { adminDb, setAdminDb } from './firebase-admin';
import firebaseConfig from '../../firebase-applet-config.json';

export const db = adminDb;

export async function initDb() {
  const dbId = firebaseConfig.firestoreDatabaseId;
  const targetProjectId = process.env.GOOGLE_CLOUD_PROJECT || firebaseConfig.projectId;
  console.log(`[initDb] Starting initialization. Target Project: ${targetProjectId}, DB ID: ${dbId || '(default)'}`);
  
  try {
    // Test the current database
    console.log(`[initDb] Testing primary database: ${dbId || '(default)'}`);
    await runInit(adminDb);
    console.log('[initDb] Successfully initialized with primary database.');
  } catch (error: any) {
    console.error(`[initDb] Error with primary database (${dbId || 'default'}):`, error.message);
    console.error(`[initDb] Error code: ${error.code}`);
    
    // Check for NOT_FOUND (5) or PERMISSION_DENIED (7)
    if (error.code === 7 || error.code === 5 || error.message?.includes('PERMISSION_DENIED') || error.message?.includes('NOT_FOUND') || error.message?.includes('Missing or insufficient permissions')) {
      console.warn(`[initDb] Database error (${error.code}). Attempting fallback to default database...`);
      try {
        const { getFirestore } = await import('firebase-admin/firestore');
        const { getApps, initializeApp } = await import('firebase-admin/app');
        
        // Try to get the app that matches our project ID
        const apps = getApps();
        let app = apps.find(a => a.options.projectId === targetProjectId) || apps.find(a => a.name === '[DEFAULT]');
        
        if (!app) {
          console.log('[initDb] Initializing fallback app...');
          app = initializeApp({ projectId: targetProjectId }, 'fallback-' + Date.now());
        }
        
        const defaultDb = getFirestore(app);
        console.log(`[initDb] Testing default database on app: ${app.name}, Project: ${app.options.projectId || 'default'}`);
        
        // Switch BEFORE testing so that if runInit fails, we at least have the default DB set
        setAdminDb(defaultDb); 
        
        try {
          await runInit(defaultDb);
          console.log('[initDb] Successfully switched to and initialized default database.');
        } catch (runError: any) {
          if (runError.code === 5 || runError.message?.includes('NOT_FOUND')) {
            console.warn('[initDb] Default database not found (5 NOT_FOUND). Using it as fallback anyway.');
          } else {
            console.error('[initDb] Default database initialization failed, but still using it as fallback:', runError.message);
          }
        }
      } catch (fallbackError: any) {
        console.error('[initDb] Fallback to default database also failed:', fallbackError.message);
        // If fallback also fails, we might have a bigger issue (IAM roles)
        throw error; // Throw original error
      }
    } else {
      throw error;
    }
  }
}

async function runInit(database: any) {
  const databaseId = database._databaseId?.databaseId || database.databaseId || 'unknown';
  console.log(`[runInit] Initializing database: ${databaseId}`);
  console.log('runInit: Checking plans...');
  // Check if plans exist, if not insert dummy plans
  const plansRef = database.collection('plans');
  let plansSnapshot;
  try {
    plansSnapshot = await plansRef.get();
  } catch (error: any) {
    if (error.code === 5 || error.message?.includes('NOT_FOUND')) {
      console.warn('runInit: Database not found (5 NOT_FOUND). Skipping initialization of collections.');
      return; // Exit early if database doesn't exist yet
    }
    console.error('runInit: Error fetching plans:', error.message);
    throw error; // Re-throw to trigger fallback if needed
  }
  
  if (plansSnapshot.empty) {
    console.log('runInit: Inserting dummy plans...');
    const plans = [
      { id: "plan_1", name: "Regular", roi: 2.5, duration: "30 Days", minInvestment: 100 },
      { id: "plan_2", name: "Premium", roi: 2.7, duration: "90 Days", minInvestment: 1000 },
      { id: "plan_3", name: "Elite", roi: 2.9, duration: "180 Days", minInvestment: 5000 }
    ];
    
    for (const plan of plans) {
      await plansRef.doc(plan.id).set(plan);
    }
  }

  console.log('runInit: Checking FAQs...');
  // Check if FAQs exist, if not insert dummy FAQs
  const faqsRef = database.collection('faqs');
  const faqsSnapshot = await faqsRef.get();
  
  if (faqsSnapshot.empty) {
    console.log('runInit: Inserting dummy FAQs...');
    const faqs = [
      {
        id: "faq_1",
        question: "What is Capital Growth Alliance?",
        answer: "Capital Growth Alliance is a premium fintech investment platform designed to help you grow your wealth securely."
      },
      {
        id: "faq_2",
        question: "How do I deposit funds?",
        answer: 'You can deposit funds by navigating to the Profile and clicking on the "Deposit" action card. Follow the instructions to complete your transfer.'
      },
      {
        id: "faq_3",
        question: "What is the minimum investment?",
        answer: "Our Starter plan requires a minimum investment of $100."
      },
      {
        id: "faq_4",
        question: "How long does withdrawal take?",
        answer: "Withdrawals are typically processed within 24-48 business hours."
      },
      {
        id: "faq_5",
        question: "Is my money safe?",
        answer: "Yes, your funds are protected by industry-leading security protocols and cold storage solutions."
      }
    ];
    
    for (const faq of faqs) {
      await faqsRef.doc(faq.id).set(faq);
    }
  }

  // Ensure mock user exists
  console.log('runInit: Checking mock user...');
  const MOCK_USER_ID = 'user-123';
  const userRef = database.collection('users').doc(MOCK_USER_ID);
  const userDoc = await userRef.get();
  
  if (!userDoc.exists) {
    console.log('runInit: Creating mock user...');
    await userRef.set({
      fullName: 'John Doe',
      email: 'john@example.com',
      username: 'johndoe',
      balance: 1000,
      totalInvestments: 0,
      totalEarnings: 0,
      roiEarnings: 0,
      referralBonus: 0,
      roiPercentage: 0,
      referralEarnings: 0,
      referrals: [],
      activeReferralsCount: 0,
      isKYCVerified: 0,
      status: 'active',
      createdAt: new Date().toISOString()
    });
  }
}
