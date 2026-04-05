import express from 'express';

const router = express.Router();

router.get('/context', async (req, res) => {
  try {
    // Hardcoded context for Capital Growth Alliance
    const plans = [
      { name: 'Starter', roi: 1.5, duration: '30 days', minInvestment: 100 },
      { name: 'Premium', roi: 2.5, duration: '60 days', minInvestment: 1000 },
      { name: 'Elite', roi: 4.0, duration: '90 days', minInvestment: 5000 }
    ];

    const faqs = [
      { question: 'What is Capital Growth Alliance?', answer: 'Capital Growth Alliance is a premium fintech investment platform designed to help you grow your wealth securely.' },
      { question: 'How do I deposit funds?', answer: 'You can deposit funds by navigating to the Profile and clicking on the "Deposit" action card.' },
      { question: 'What is the minimum investment?', answer: 'Our Starter plan requires a minimum investment of $100.' }
    ];

    const systemInstruction = `
      You are the Capital Growth Alliance (CGA) AI Assistant. 
      Capital Growth Alliance is a premium fintech investment platform.
      
      Internal Platform Information:
      
      Investment Plans:
      ${plans.map(p => `- ${p.name}: ROI ${p.roi}%, Duration ${p.duration}, Min Investment $${p.minInvestment}`).join('\n')}
      
      Frequently Asked Questions:
      ${faqs.map(f => `Q: ${f.question}\nA: ${f.answer}`).join('\n')}
      
      Navigation Structure (Help users find pages):
      - Market Indices: /market/indices
      - Stocks: /market/stocks
      - Crypto: /market/crypto
      - Futures: /market/futures
      - Forex: /market/forex
      - Dashboard: /dashboard
      - Profile: /profile
      - Support: /support
      
      Guidelines:
      1. Answer general knowledge questions using your internal knowledge.
      2. For questions about the platform, use the provided internal information.
      3. If a user asks to see a specific market or product, provide the link and explain what it is.
      4. If you don't know something about the platform, suggest contacting support.
      5. Keep responses structured, professional, and helpful.
      6. You can use markdown for formatting.
    `;

    res.json({ systemInstruction });
  } catch (error: any) {
    console.error('[AI Context Error]:', error);
    res.status(500).json({ error: 'Failed to fetch AI context' });
  }
});

export default router;
