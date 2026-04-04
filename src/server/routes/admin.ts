import { Router, Request } from 'express';
import { db } from '../db';
import { randomUUID } from 'crypto';
import { FieldValue } from 'firebase-admin/firestore';

const router = Router();

// GET /api/admin/deposits
router.get('/deposits', async (req: Request, res) => {
  try {
    let transactionsSnapshot;
    try {
      transactionsSnapshot = await db.collection('transactions')
        .where('type', '==', 'WALLET_DEPOSIT')
        .orderBy('createdAt', 'desc')
        .get();
    } catch (queryError: any) {
      if (queryError.code === 5 || queryError.message?.includes('NOT_FOUND')) {
        throw queryError;
      }
      console.warn('Admin deposits query with orderBy failed, falling back to simple query:', queryError.message);
      transactionsSnapshot = await db.collection('transactions')
        .where('type', '==', 'WALLET_DEPOSIT')
        .get();
      
      const deposits = await Promise.all(transactionsSnapshot.docs.map(async (doc) => {
        const data = doc.data();
        const userDoc = await db.collection('users').doc(data.userId).get();
        const userData = userDoc.data();
        return {
          id: doc.id,
          ...data,
          fullName: userData?.fullName || 'Unknown',
          email: userData?.email || 'Unknown'
        };
      }));
      
      deposits.sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      return res.json(deposits);
    }
    
    const deposits = await Promise.all(transactionsSnapshot.docs.map(async (doc) => {
// ... (rest of the mapping logic)
      const data = doc.data();
      const userDoc = await db.collection('users').doc(data.userId).get();
      const userData = userDoc.data();
      return {
        id: doc.id,
        ...data,
        fullName: userData?.fullName || 'Unknown',
        email: userData?.email || 'Unknown'
      };
    }));
    
    res.json(deposits);
  } catch (error: any) {
    if (error.code === 5 || error.message?.includes('NOT_FOUND')) {
      console.warn('Admin deposits database not found, returning empty array');
      return res.json([]);
    }
    console.error('Admin deposits error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/admin/deposits/:id/approve
router.post('/deposits/:id/approve', async (req: Request, res) => {
  try {
    const { id } = req.params;
    const transactionRef = db.collection('transactions').doc(id);
    const transactionDoc = await transactionRef.get();
    
    if (!transactionDoc.exists) return res.status(404).json({ error: 'Deposit not found' });
    const transaction = transactionDoc.data()!;
    
    if (transaction.type !== 'WALLET_DEPOSIT') return res.status(400).json({ error: 'Invalid transaction type' });
    if (transaction.status !== 'PENDING') return res.status(400).json({ error: 'Deposit already processed' });

    const userRef = db.collection('users').doc(transaction.userId);
    const userDoc = await userRef.get();
    if (!userDoc.exists) return res.status(404).json({ error: 'User not found' });

    await db.runTransaction(async (t) => {
      t.update(transactionRef, { status: 'APPROVED' });
      t.update(userRef, { balance: (userDoc.data()?.balance || 0) + transaction.amount });
      
      const notificationId = randomUUID();
      t.set(db.collection('notifications').doc(notificationId), {
        userId: transaction.userId,
        message: `Your deposit of $${transaction.amount} has been approved.`,
        type: 'deposit',
        read: false,
        timestamp: FieldValue.serverTimestamp()
      });

      if (transaction.planName) {
        const plansSnapshot = await db.collection('plans').where('name', '==', transaction.planName).limit(1).get();
        if (!plansSnapshot.empty) {
          const plan = plansSnapshot.docs[0];
          const investmentId = randomUUID();
          t.set(db.collection('investments').doc(investmentId), {
            userId: transaction.userId,
            planId: plan.id,
            planName: plan.data().name,
            amount: transaction.amount,
            roi: plan.data().roi,
            duration: plan.data().duration,
            status: 'inactive',
            createdAt: new Date().toISOString()
          });
        }
      }
    });

    res.json({ message: 'Deposit approved' });
  } catch (error) {
    console.error('Approve deposit error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/admin/deposits/:id/reject
router.post('/deposits/:id/reject', async (req: Request, res) => {
  try {
    const { id } = req.params;
    const transactionRef = db.collection('transactions').doc(id);
    const transactionDoc = await transactionRef.get();
    
    if (!transactionDoc.exists) return res.status(404).json({ error: 'Deposit not found' });
    const transaction = transactionDoc.data()!;
    
    await db.runTransaction(async (t) => {
      t.update(transactionRef, { status: 'REJECTED' });
      
      const notificationId = randomUUID();
      t.set(db.collection('notifications').doc(notificationId), {
        userId: transaction.userId,
        message: `Your deposit of $${transaction.amount} has been rejected.`,
        type: 'deposit',
        read: false,
        timestamp: FieldValue.serverTimestamp()
      });
    });

    res.json({ message: 'Deposit rejected' });
  } catch (error) {
    console.error('Reject deposit error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/admin/investments
router.get('/investments', async (req: Request, res) => {
  try {
    let investmentsSnapshot;
    try {
      investmentsSnapshot = await db.collection('investments')
        .orderBy('createdAt', 'desc')
        .get();
    } catch (queryError: any) {
      if (queryError.code === 5 || queryError.message?.includes('NOT_FOUND')) {
        throw queryError;
      }
      console.warn('Admin investments query with orderBy failed, falling back to simple query:', queryError.message);
      investmentsSnapshot = await db.collection('investments').get();
      
      const investments = await Promise.all(investmentsSnapshot.docs.map(async (doc) => {
        const data = doc.data();
        const userDoc = await db.collection('users').doc(data.userId).get();
        const userData = userDoc.data();
        return {
          id: doc.id,
          ...data,
          fullName: userData?.fullName || 'Unknown',
          email: userData?.email || 'Unknown'
        };
      }));
      
      investments.sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      return res.json(investments);
    }
    
    const investments = await Promise.all(investmentsSnapshot.docs.map(async (doc) => {
      const data = doc.data();
      const userDoc = await db.collection('users').doc(data.userId).get();
      const userData = userDoc.data();
      return {
        id: doc.id,
        ...data,
        fullName: userData?.fullName || 'Unknown',
        email: userData?.email || 'Unknown'
      };
    }));
    
    res.json(investments);
  } catch (error: any) {
    if (error.code === 5 || error.message?.includes('NOT_FOUND')) {
      console.warn('Admin investments database not found, returning empty array');
      return res.json([]);
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/admin/investments/:id/status
router.post('/investments/:id/status', async (req: Request, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'active', 'inactive', 'paused'
    await db.collection('investments').doc(id).update({ status });
    res.json({ message: 'Investment status updated' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/admin/users
router.get('/users', async (req: Request, res) => {
  try {
    let usersSnapshot;
    try {
      usersSnapshot = await db.collection('users')
        .orderBy('createdAt', 'desc')
        .get();
    } catch (queryError: any) {
      if (queryError.code === 5 || queryError.message?.includes('NOT_FOUND')) {
        throw queryError;
      }
      console.warn('Admin users query with orderBy failed, falling back to simple query:', queryError.message);
      usersSnapshot = await db.collection('users').get();
      
      const users = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      users.sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      return res.json(users);
    }
    
    const users = usersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    res.json(users);
  } catch (error: any) {
    if (error.code === 5 || error.message?.includes('NOT_FOUND')) {
      console.warn('Admin users database not found, returning empty array');
      return res.json([]);
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/admin/users/:id/status
router.post('/users/:id/status', async (req: Request, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await db.collection('users').doc(id).update({ status });
    res.json({ message: 'User status updated' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/admin/users/:id/balance
router.post('/users/:id/balance', async (req: Request, res) => {
  try {
    const { id } = req.params;
    const { balance } = req.body;
    await db.collection('users').doc(id).update({ balance });
    res.json({ message: 'User balance updated' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/admin/withdrawals/:id/approve
router.post('/withdrawals/:id/approve', async (req: Request, res) => {
  try {
    const { id } = req.params;
    const transactionRef = db.collection('transactions').doc(id);
    const transactionDoc = await transactionRef.get();
    
    if (!transactionDoc.exists) return res.status(404).json({ error: 'Withdrawal not found' });
    const transaction = transactionDoc.data()!;
    
    if (transaction.type !== 'WITHDRAWAL') return res.status(400).json({ error: 'Invalid transaction type' });
    if (transaction.status !== 'PENDING') return res.status(400).json({ error: 'Withdrawal already processed' });

    await db.runTransaction(async (t) => {
      t.update(transactionRef, { status: 'COMPLETED' });
      
      const notificationId = randomUUID();
      t.set(db.collection('notifications').doc(notificationId), {
        userId: transaction.userId,
        message: `Your withdrawal of $${transaction.amount} has been processed successfully.`,
        type: 'withdrawal',
        read: false,
        timestamp: FieldValue.serverTimestamp()
      });
    });

    res.json({ message: 'Withdrawal approved' });
  } catch (error) {
    console.error('Approve withdrawal error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/admin/withdrawals/:id/reject
router.post('/withdrawals/:id/reject', async (req: Request, res) => {
  try {
    const { id } = req.params;
    const transactionRef = db.collection('transactions').doc(id);
    const transactionDoc = await transactionRef.get();
    
    if (!transactionDoc.exists) return res.status(404).json({ error: 'Withdrawal not found' });
    const transaction = transactionDoc.data()!;
    
    if (transaction.type !== 'WITHDRAWAL') return res.status(400).json({ error: 'Invalid transaction type' });
    if (transaction.status !== 'PENDING') return res.status(400).json({ error: 'Withdrawal already processed' });

    const userRef = db.collection('users').doc(transaction.userId);
    const userDoc = await userRef.get();
    if (!userDoc.exists) return res.status(404).json({ error: 'User not found' });

    await db.runTransaction(async (t) => {
      t.update(transactionRef, { status: 'REJECTED' });
      
      // Refund the balance
      t.update(userRef, { balance: (userDoc.data()?.balance || 0) + transaction.amount });
      
      const notificationId = randomUUID();
      t.set(db.collection('notifications').doc(notificationId), {
        userId: transaction.userId,
        message: `Your withdrawal of $${transaction.amount} has been rejected and funds have been returned to your balance.`,
        type: 'withdrawal',
        read: false,
        timestamp: FieldValue.serverTimestamp()
      });
    });

    res.json({ message: 'Withdrawal rejected' });
  } catch (error) {
    console.error('Reject withdrawal error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/admin/users/:id/bonus
router.post('/users/:id/bonus', async (req: Request, res) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;
    
    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const userRef = db.collection('users').doc(id);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) return res.status(404).json({ error: 'User not found' });

    await db.runTransaction(async (t) => {
      const currentBonus = userDoc.data()?.referralBonus || 0;
      const currentBalance = userDoc.data()?.balance || 0;
      
      t.update(userRef, { 
        referralBonus: currentBonus + amount,
        balance: currentBalance + amount
      });
      
      const notificationId = randomUUID();
      t.set(db.collection('notifications').doc(notificationId), {
        userId: id,
        message: `You have received a referral bonus of $${amount}.`,
        type: 'bonus',
        read: false,
        timestamp: FieldValue.serverTimestamp()
      });
    });

    res.json({ message: 'Referral bonus added' });
  } catch (error) {
    console.error('Add bonus error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
