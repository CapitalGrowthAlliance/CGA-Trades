import express from 'express';
import { db } from '../db';

const router = express.Router();

// Get all FAQs
router.get('/faqs', async (req, res) => {
  try {
    const faqsSnapshot = await db.collection('faqs').get();
    const faqs = faqsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(faqs);
  } catch (error: any) {
    if (error.code === 5 || error.message?.includes('NOT_FOUND')) {
      console.warn('[ChatRoute] Database not found, returning default FAQs');
      return res.json([
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
      ]);
    }

    const databaseId = (db as any)._databaseId?.databaseId || (db as any).databaseId || 'unknown';
    const projectId = (db as any)._databaseId?.projectId || (db as any).projectId || 'unknown';
    const isProxy = (db as any)._isProxy || false;
    
    console.error('[ChatRoute] Error fetching FAQs:', error.message || error);
    
    res.status(500).json({ 
      error: 'Failed to fetch FAQs', 
      debug: {
        message: error.message,
        code: error.code,
        projectId,
        databaseId,
        isProxy
      }
    });
  }
});

// Submit a support ticket
router.post('/ticket', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    const id = `ticket_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    await db.collection('support_tickets').doc(id).set({
      name,
      email,
      message,
      status: 'open',
      createdAt: new Date().toISOString()
    });

    res.status(201).json({ success: true, message: 'Ticket submitted successfully' });
  } catch (error) {
    console.error('Error submitting ticket:', error);
    res.status(500).json({ error: 'Failed to submit ticket' });
  }
});

export default router;
