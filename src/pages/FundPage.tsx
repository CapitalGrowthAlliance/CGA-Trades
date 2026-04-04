import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DepositPage from './DepositPage';
import WithdrawalPage from './WithdrawalPage';
import TransactionHistoryPage from './TransactionHistoryPage';
import { useSite } from '../context/SiteContext';

export default function FundPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { featureToggles } = useSite();
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw' | 'history'>('deposit');

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get('tab');
    if (tab === 'deposit' || tab === 'withdraw' || tab === 'history') {
      setActiveTab(tab);
    } else if (featureToggles) {
      if (featureToggles.depositsEnabled === false && featureToggles.withdrawalsEnabled !== false) {
        setActiveTab('withdraw');
      } else if (featureToggles.depositsEnabled === false && featureToggles.withdrawalsEnabled === false) {
        setActiveTab('history');
      } else {
        setActiveTab('deposit');
      }
    }
  }, [location.search, featureToggles]);

  const handleTabChange = (tab: 'deposit' | 'withdraw' | 'history') => {
    setActiveTab(tab);
    navigate(`/fund?tab=${tab}`, { replace: true });
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6 transition-colors duration-300">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary">Fund Management</h1>
        <p className="text-sm text-text-secondary mt-1">Manage your deposits, withdrawals, and view transaction history.</p>
      </div>

      <div className="bg-bg-secondary rounded-2xl border border-border-light shadow-sm overflow-hidden mb-6 transition-colors duration-300">
        <div className="flex overflow-x-auto">
          {featureToggles?.depositsEnabled !== false && (
            <button
              onClick={() => handleTabChange('deposit')}
              className={`flex-1 py-4 px-6 text-sm font-medium text-center whitespace-nowrap transition-colors ${
                activeTab === 'deposit'
                  ? 'border-b-2 border-accent-primary text-accent-primary'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Deposit
            </button>
          )}
          {featureToggles?.withdrawalsEnabled !== false && (
            <button
              onClick={() => handleTabChange('withdraw')}
              className={`flex-1 py-4 px-6 text-sm font-medium text-center whitespace-nowrap transition-colors ${
                activeTab === 'withdraw'
                  ? 'border-b-2 border-accent-primary text-accent-primary'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Withdraw
            </button>
          )}
          <button
            onClick={() => handleTabChange('history')}
            className={`flex-1 py-4 px-6 text-sm font-medium text-center whitespace-nowrap transition-colors ${
              activeTab === 'history'
                ? 'border-b-2 border-accent-primary text-accent-primary'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            History
          </button>
        </div>
      </div>

      <div className="mt-6">
        {activeTab === 'deposit' && <DepositPage isComponent={true} />}
        {activeTab === 'withdraw' && <WithdrawalPage isComponent={true} />}
        {activeTab === 'history' && <TransactionHistoryPage isComponent={true} />}
      </div>
    </div>
  );
}
