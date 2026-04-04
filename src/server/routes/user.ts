import { Router, Request } from 'express';
import { db } from '../db';
import { randomUUID } from 'crypto';

const router = Router();

// Mock userId for consistent behavior without auth
const MOCK_USER_ID = 'user-123';

// GET /api/user/profile
router.get('/profile', async (req: Request, res) => {
  try {
    const userId = MOCK_USER_ID;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const userDoc = await db.collection('users').doc(userId).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ id: userDoc.id, ...userDoc.data() });
  } catch (error: any) {
    if (error.code === 5 || error.message?.includes('NOT_FOUND')) {
      console.warn('Profile database not found, returning mock user');
      return res.json({
        id: MOCK_USER_ID,
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
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/user/balance
router.get('/balance', async (req: Request, res) => {
  try {
    const userId = MOCK_USER_ID;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const userDoc = await db.collection('users').doc(userId).get();
    const userData = userDoc.data();
    
    res.json({
      balance: userData?.balance || 0,
      totalInvestments: userData?.totalInvestments || 0,
      totalEarnings: userData?.totalEarnings || 0,
      roiPercentage: userData?.roiPercentage || 0,
      referralEarnings: userData?.referralEarnings || 0
    });
  } catch (error: any) {
    if (error.code === 5 || error.message?.includes('NOT_FOUND')) {
      console.warn('Balance database not found, returning default balance');
      return res.json({
        balance: 0,
        totalInvestments: 0,
        totalEarnings: 0,
        roiPercentage: 0,
        referralEarnings: 0
      });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/user/investments
router.get('/investments', async (req: Request, res) => {
  try {
    const userId = MOCK_USER_ID;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    let investmentsSnapshot;
    try {
      investmentsSnapshot = await db.collection('investments')
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .get();
    } catch (queryError: any) {
      if (queryError.code === 5 || queryError.message?.includes('NOT_FOUND')) {
        throw queryError; // Let outer catch handle it
      }
      
      console.warn('Investments query with orderBy failed, falling back to simple query:', queryError.message);
      investmentsSnapshot = await db.collection('investments')
        .where('userId', '==', userId)
        .get();
      
      // Sort in memory if fallback was used
      const investments = investmentsSnapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
      investments.sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      return res.json(investments);
    }
    
    const investments = investmentsSnapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
    res.json(investments);
  } catch (error: any) {
    if (error.code === 5 || error.message?.includes('NOT_FOUND')) {
      console.warn('Investments database not found, returning empty array');
      return res.json([]);
    }
    
    console.error('Investments error:', error.message || error);
    res.status(500).json({ 
      error: 'Failed to fetch investments',
      debug: { message: error.message, code: error.code }
    });
  }
});

// GET /api/user/transactions
router.get('/transactions', async (req: Request, res) => {
  try {
    const userId = MOCK_USER_ID;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    let transactionsSnapshot;
    try {
      transactionsSnapshot = await db.collection('transactions')
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .limit(50)
        .get();
    } catch (queryError: any) {
      if (queryError.code === 5 || queryError.message?.includes('NOT_FOUND')) {
        throw queryError; // Let outer catch handle it
      }
      
      console.warn('Transactions query with orderBy failed, falling back to simple query:', queryError.message);
      transactionsSnapshot = await db.collection('transactions')
        .where('userId', '==', userId)
        .limit(50)
        .get();
      
      // Sort in memory if fallback was used
      const transactions = transactionsSnapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
      transactions.sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      return res.json(transactions);
    }
    
    const transactions = transactionsSnapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
    res.json(transactions);
  } catch (error: any) {
    if (error.code === 5 || error.message?.includes('NOT_FOUND')) {
      console.warn('Transactions database not found, returning empty array');
      return res.json([]);
    }
    
    console.error('Transactions error:', {
      message: error.message,
      code: error.code
    });
    res.status(500).json({ 
      error: 'Failed to fetch transactions',
      debug: { message: error.message, code: error.code }
    });
  }
});

// GET /api/user/plans
router.get('/plans', async (req: Request, res) => {
  try {
    const plansSnapshot = await db.collection('plans').get();
    const plans = plansSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(plans);
  } catch (error: any) {
    if (error.code === 5 || error.message?.includes('NOT_FOUND')) {
      console.warn('Plans database not found, returning default plans');
      return res.json([
        { id: "plan_1", name: "Regular", roi: 2.5, duration: "30 Days", minInvestment: 100 },
        { id: "plan_2", name: "Premium", roi: 2.7, duration: "90 Days", minInvestment: 1000 },
        { id: "plan_3", name: "Elite", roi: 2.9, duration: "180 Days", minInvestment: 5000 }
      ]);
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/user/dashboard
router.get('/dashboard', async (req: Request, res) => {
  try {
    const userId = MOCK_USER_ID;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const [userDoc, allInvestmentsSnapshot] = await Promise.all([
      db.collection('users').doc(userId).get(),
      db.collection('investments').where('userId', '==', userId).get()
    ]);

    if (!userDoc.exists) {
      console.error(`Dashboard error: User ${userId} not found`);
      return res.status(404).json({ error: 'User not found' });
    }
    const userData = userDoc.data()!;

    // Filter active investments in memory to avoid composite index requirement
    const activeInvestments = allInvestmentsSnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter((inv: any) => inv.status === 'active');

    // Metrics:
    // Total Equity = sum of all amounts the user has invested (USD + NGN)
    // ROI Earnings = sum of earnings from daily ROI only
    // Referral Bonus = current referral bonus balance
    // Withdrawable Balance = ROI Earnings + available referral bonus

    // Note: For simplicity in this mock, we assume all amounts are already in a common base for "Total Equity" 
    // or we just sum them as raw numbers if they are displayed with currency in the UI.
    // However, the requirement says "sum of all amounts (USD + NGN)". 
    // In a real app, we'd convert them to a base currency. 
    // For this dashboard, we'll provide the sum and the list of active investments with their respective currencies.
    
    const totalEquity = activeInvestments.reduce((sum, inv) => sum + (inv.amount || 0), 0);
    const roiEarnings = userData.roiEarnings || 0;
    const referralBonus = userData.referralBonus || 0;
    const withdrawableBalance = roiEarnings + referralBonus;

    // Referral Stats
    const referrals = userData.referrals || [];
    const totalReferrals = referrals.length;
    // Active referrals = referrals who have at least one investment
    let activeReferralsCount = 0;
    if (totalReferrals > 0) {
      try {
        // Filter out any falsy values to prevent Firestore errors
        const referralChunk = referrals.filter(Boolean).slice(0, 10);
        
        if (referralChunk.length > 0) {
          const referredInvestments = await db.collection('investments')
            .where('userId', 'in', referralChunk)
            .get();
          
          const uniqueActiveUsersInChunk = new Set(referredInvestments.docs.map(doc => doc.data().userId));
          activeReferralsCount = userData.activeReferralsCount || uniqueActiveUsersInChunk.size;
        } else {
          activeReferralsCount = userData.activeReferralsCount || 0;
        }
      } catch (queryError: any) {
        console.warn('Referral query failed:', queryError.message || queryError);
        activeReferralsCount = userData.activeReferralsCount || 0;
      }
    }

    res.json({
      metrics: {
        totalEquity,
        roiEarnings,
        referralBonus,
        withdrawableBalance,
        totalReferrals,
        activeReferrals: activeReferralsCount
      },
      activeInvestments: activeInvestments.map(inv => ({
        id: inv.id,
        planName: inv.planName,
        dailyRoi: inv.roi,
        amount: inv.amount,
        currency: inv.currency || 'USD'
      }))
    });
  } catch (error: any) {
    if (error.code === 5 || error.message?.includes('NOT_FOUND')) {
      console.warn('Dashboard database not found, returning default dashboard');
      return res.json({
        metrics: {
          totalEquity: 0,
          roiEarnings: 0,
          referralBonus: 0,
          withdrawableBalance: 0,
          totalReferrals: 0,
          activeReferrals: 0
        },
        activeInvestments: []
      });
    }
    console.error('Dashboard error:', error.message || error, error.stack);
    res.status(500).json({ error: 'Server error', details: error.message || String(error) });
  }
});

// POST /api/user/invest
router.post('/invest', async (req: Request, res) => {
  try {
    const userId = MOCK_USER_ID;
    const { planId, amount, currency } = req.body;

    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    if (!planId || !amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid plan or amount' });
    }

    const userRef = db.collection('users').doc(userId);
    const planRef = db.collection('plans').doc(planId);

    const [userDoc, planDoc] = await Promise.all([userRef.get(), planRef.get()]);

    if (!userDoc.exists) return res.status(404).json({ error: 'User not found' });
    if (!planDoc.exists) return res.status(404).json({ error: 'Plan not found' });

    const userData = userDoc.data()!;
    const planData = planDoc.data()!;

    if (amount < planData.minInvestment) return res.status(400).json({ error: `Minimum investment is $${planData.minInvestment}` });
    
    // In a real app, we'd check balance for the specific currency
    if (userData.balance < amount) return res.status(400).json({ error: 'Insufficient balance' });

    const investmentId = randomUUID();
    const transactionId = randomUUID();
    const now = new Date().toISOString();

    await db.runTransaction(async (t) => {
      t.update(userRef, {
        balance: userData.balance - amount,
        totalInvestments: (userData.totalInvestments || 0) + amount
      });

      t.set(db.collection('investments').doc(investmentId), {
        userId,
        planId,
        planName: planData.name,
        amount,
        currency: currency || 'USD',
        roi: planData.roi,
        duration: planData.duration,
        status: 'active', // Set to active immediately for dashboard visibility in this demo
        activationTime: now,
        createdAt: now
      });

      t.set(db.collection('transactions').doc(transactionId), {
        userId,
        type: 'PLAN_SUBSCRIPTION',
        amount,
        currency: currency || 'USD',
        planName: planData.name,
        status: 'INVESTMENT SUCCESSFUL',
        createdAt: now
      });
    });

    res.json({ message: 'Investment successful' });
  } catch (error) {
    console.error('Invest error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/user/deposit
router.post('/deposit', async (req: Request, res) => {
  try {
    const userId = MOCK_USER_ID;
    const { amount, currency, paymentMethod, depositProof, planName } = req.body;

    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const transactionId = randomUUID();
    await db.collection('transactions').doc(transactionId).set({
      userId,
      type: 'WALLET_DEPOSIT',
      currency: currency || 'USD',
      amount,
      paymentMethod: paymentMethod || '',
      depositProof: depositProof || '',
      planName: planName || null,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    });

    res.json({ message: 'Deposit submitted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/user/withdraw
router.post('/withdraw', async (req: Request, res) => {
  try {
    const userId = MOCK_USER_ID;
    const { amount, currency, methodId } = req.body;

    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    if (currency === 'NGN' && amount < 5000) {
      return res.status(400).json({ error: 'Minimum NGN withdrawal is ₦5,000' });
    }
    if (currency === 'USD' && amount < 25) {
      return res.status(400).json({ error: 'Minimum USD withdrawal is $25' });
    }

    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();
    const userData = userDoc.data();
    
    if (!userData || userData.totalEarnings < amount) {
      return res.status(400).json({ error: 'Insufficient withdrawable profit' });
    }

    const fee = amount * 0.20;
    let withdrawalMethodStr = methodId || 'Saved Method';
    
    if (methodId) {
      const methodDoc = await db.collection('withdrawal_methods').doc(methodId).get();
      if (methodDoc.exists && methodDoc.data()?.userId === userId) {
        const method = methodDoc.data()!;
        if (method.type === 'NGN') {
          withdrawalMethodStr = `${method.bankName} - ${method.accountNumber}`;
        } else {
          withdrawalMethodStr = `USDT TRC20 - ${method.walletAddress}`;
        }
      }
    }

    const transactionId = randomUUID();
    const now = new Date().toISOString();

    await db.runTransaction(async (t) => {
      t.update(userRef, {
        totalEarnings: userData.totalEarnings - amount
      });
      t.set(db.collection('transactions').doc(transactionId), {
        userId,
        type: 'WITHDRAWAL',
        currency: currency || 'USD',
        amount,
        fee,
        withdrawalMethod: withdrawalMethodStr,
        status: 'PENDING',
        createdAt: now
      });
    });

    res.json({ message: 'Withdrawal requested successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/user/withdrawal-methods
router.get('/withdrawal-methods', async (req: Request, res) => {
  try {
    const userId = MOCK_USER_ID;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    let methodsSnapshot;
    try {
      methodsSnapshot = await db.collection('withdrawal_methods')
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .get();
    } catch (queryError: any) {
      if (queryError.code === 5 || queryError.message?.includes('NOT_FOUND')) {
        throw queryError;
      }
      methodsSnapshot = await db.collection('withdrawal_methods')
        .where('userId', '==', userId)
        .get();
    }
    
    const methods = methodsSnapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
    res.json(methods);
  } catch (error: any) {
    if (error.code === 5 || error.message?.includes('NOT_FOUND')) {
      console.warn('Withdrawal methods database not found, returning empty array');
      return res.json([]);
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/user/withdrawal-methods
router.post('/withdrawal-methods', async (req: Request, res) => {
  try {
    const userId = MOCK_USER_ID;
    const { type, bankName, accountNumber, accountName, walletAddress } = req.body;

    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    if (!type) {
      return res.status(400).json({ error: 'Type is required' });
    }

    const userDoc = await db.collection('users').doc(userId).get();
    const userData = userDoc.data();

    if (type === 'NGN') {
      if (!bankName || !accountNumber || !accountName) {
        return res.status(400).json({ error: 'Bank details are required for NGN' });
      }
      if (accountName.toLowerCase() !== (userData?.fullName || '').toLowerCase()) {
        return res.status(400).json({ error: 'Account Name must match your profile name' });
      }
    } else if (type === 'USD') {
      if (!walletAddress) {
        return res.status(400).json({ error: 'Wallet address is required for USD' });
      }
    }

    const methodId = randomUUID();
    await db.collection('withdrawal_methods').doc(methodId).set({
      userId,
      type,
      bankName: bankName || null,
      accountNumber: accountNumber || null,
      accountName: accountName || null,
      walletAddress: walletAddress || null,
      createdAt: new Date().toISOString()
    });

    res.json({ message: 'Withdrawal method saved successfully', id: methodId });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/user/kyc
router.post('/kyc', async (req: Request, res) => {
  try {
    const userId = MOCK_USER_ID;
    const { documentType, documentNumber } = req.body;

    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    if (!documentType || !documentNumber) {
      return res.status(400).json({ error: 'Document type and number are required' });
    }

    await db.collection('users').doc(userId).update({ isKYCVerified: 1 });

    res.json({ message: 'KYC submitted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/user/profile
router.put('/profile', async (req: Request, res) => {
  try {
    const userId = MOCK_USER_ID;
    const { username, profilePicture } = req.body;

    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    // Check if username is taken by another user
    const existingUsers = await db.collection('users')
      .where('username', '==', username)
      .get();
    
    const isTaken = existingUsers.docs.some(doc => doc.id !== userId);
    if (isTaken) {
      return res.status(400).json({ error: 'Username is already taken' });
    }

    await db.collection('users').doc(userId).update({
      username,
      profilePicture: profilePicture || null
    });

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/user/investments/:id/activate
router.post('/investments/:id/activate', async (req: Request, res) => {
  try {
    const userId = MOCK_USER_ID;
    const { id } = req.params;

    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const investmentRef = db.collection('investments').doc(id);
    const investmentDoc = await investmentRef.get();
    
    if (!investmentDoc.exists || investmentDoc.data()?.userId !== userId) {
      return res.status(404).json({ error: 'Investment not found' });
    }
    
    const investment = investmentDoc.data()!;
    if (investment.status === 'active') return res.status(400).json({ error: 'Investment is already active' });

    await investmentRef.update({
      status: 'active',
      activationTime: new Date().toISOString()
    });
    
    res.json({ message: 'Investment activated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
