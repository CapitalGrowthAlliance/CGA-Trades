import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Check, Clock, ArrowRight, XCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

type TransactionStatus = 'processing' | 'approved' | 'declined';

export default function InvestmentPendingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  
  const [status, setStatus] = useState<TransactionStatus>('processing');
  const [timeLeft, setTimeLeft] = useState(1799); // 29:59

  // Extract state passed from InvestmentFundingPage
  const { transactionId } = location.state || {};

  useEffect(() => {
    // Redirect back if no transaction data is found
    if (!transactionId) {
      navigate('/dashboard');
    }
  }, [transactionId, navigate]);

  useEffect(() => {
    if (!transactionId || status !== 'processing') return;

    const storageKey = `tx_timer_${transactionId}`;
    let endTime = localStorage.getItem(storageKey);

    if (!endTime) {
      // Set end time to 29:59 (1799 seconds) from now
      endTime = (Date.now() + 1799 * 1000).toString();
      localStorage.setItem(storageKey, endTime);
    }

    const updateTimer = () => {
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((parseInt(endTime as string) - now) / 1000));
      setTimeLeft(remaining);
      
      if (remaining <= 0) {
        clearInterval(timer);
      }
    };

    updateTimer(); // Initial call
    const timer = setInterval(updateTimer, 1000);

    return () => clearInterval(timer);
  }, [transactionId, status]);

  useEffect(() => {
    if (!authUser || !transactionId) return;

    const q = query(
      collection(db, 'transactions'),
      where('userId', '==', authUser.uid),
      where('transactionId', '==', transactionId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const tx = snapshot.docs[0].data();
        if (tx.status === 'COMPLETED') {
          setStatus('approved');
        } else if (tx.status === 'FAILED' || tx.status === 'DECLINED') {
          setStatus('declined');
        } else {
          setStatus('processing');
        }
      }
    }, (error) => {
      console.error('Error fetching transaction status:', error);
    });

    return () => unsubscribe();
  }, [authUser, transactionId]);

  if (!transactionId) return null;

  const handleReturnToDashboard = () => {
    if (transactionId) {
      localStorage.removeItem(`tx_timer_${transactionId}`);
    }
    navigate('/dashboard');
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const renderStatusIcon = () => {
    if (status === 'processing') {
      return (
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="relative w-24 h-24 mb-8"
        >
          <div className="absolute inset-0 rounded-full bg-amber-500/10 border-4 border-amber-500/20 flex items-center justify-center">
            <Clock className="w-10 h-10 text-amber-500" />
          </div>
          <motion.div 
            className="absolute inset-0 rounded-full border-t-4 border-amber-500"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>
      );
    }
    
    if (status === 'approved') {
      return (
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="relative w-24 h-24 mb-8"
        >
          <div className="absolute inset-0 rounded-full bg-blue-500/10 border-4 border-blue-500/20 flex items-center justify-center">
            <Check className="w-12 h-12 text-blue-500" />
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative w-24 h-24 mb-8"
      >
        <div className="absolute inset-0 rounded-full bg-red-500/10 border-4 border-red-500/20 flex items-center justify-center">
          <XCircle className="w-12 h-12 text-red-500" />
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-bg-primary/90 backdrop-blur-sm text-text-primary font-sans flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-bg-secondary border border-border-light rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl flex flex-col items-center text-center relative"
      >
        {renderStatusIcon()}

        <h1 className="text-2xl font-bold tracking-tight mb-2">
          {status === 'processing' && 'Processing Payment'}
          {status === 'approved' && 'Payment Successful'}
          {status === 'declined' && 'Payment Declined'}
        </h1>

        <p className="text-text-secondary text-sm mb-6">
          {status === 'processing' && 'Your payment has been received and is currently under review.'}
          {status === 'approved' && 'Your payment has been successfully verified and your investment is now active.'}
          {status === 'declined' && 'Your payment could not be verified. Please contact support or try again.'}
        </p>

        {status === 'processing' && (
          <div className="flex flex-col items-center mb-6">
            <div className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-bg-hover border border-border-light">
              <Clock className="w-4 h-4 text-amber-500" />
              <span className="text-sm text-text-secondary">Processing time may take up to</span>
              <span className="font-mono font-bold text-base text-amber-500 tracking-wider">
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>
        )}

        <button
          onClick={handleReturnToDashboard}
          className="w-full h-12 rounded-xl font-bold text-slate-900 bg-accent-primary hover:bg-[#b3e600] transition-all duration-200 flex items-center justify-center gap-2 hover:-translate-y-0.5 hover:shadow-[0_4px_15px_rgba(200,255,0,0.3)]"
        >
          Return to Dashboard
          <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>
    </div>
  );
}
