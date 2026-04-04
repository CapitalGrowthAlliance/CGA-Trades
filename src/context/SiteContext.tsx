import React, { createContext, useContext, useEffect, useState } from 'react';
import { collection, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

export interface Settings {
  siteName: string;
  logoUrl: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  maintenanceMode: boolean;
}

export interface UIContent {
  homepageBanner: string;
  scrollText: string;
}

export interface InvestmentPlan {
  id: string;
  name: string;
  minAmount: number;
  maxAmount: number;
  roi: number;
  duration: number;
  isActive: boolean;
  description?: string;
}

export interface FeatureToggles {
  depositsEnabled: boolean;
  withdrawalsEnabled: boolean;
}

export interface Wallet {
  id: string;
  name: string;
  network: string;
  address: string;
  logo: string;
  qrLogo: string;
  isActive: boolean;
}

export interface BankDetails {
  bankName: string;
  accountNumber: string;
  accountName: string;
}

interface SiteContextType {
  settings: Settings | null;
  uiContent: UIContent | null;
  investmentPlans: InvestmentPlan[];
  featureToggles: FeatureToggles | null;
  wallets: Wallet[];
  bankDetails: BankDetails | null;
  loading: boolean;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export function SiteProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [uiContent, setUiContent] = useState<UIContent | null>(null);
  const [investmentPlans, setInvestmentPlans] = useState<InvestmentPlan[]>([]);
  const [featureToggles, setFeatureToggles] = useState<FeatureToggles | null>(null);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [bankDetails, setBankDetails] = useState<BankDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubSettings = onSnapshot(doc(db, 'settings', 'general'), (doc) => {
      if (doc.exists()) {
        const data = doc.data() as Settings;
        setSettings(data);
        // Apply colors dynamically
        if (data.colors) {
          if (data.colors.primary) document.documentElement.style.setProperty('--accent-primary', data.colors.primary);
          if (data.colors.secondary) document.documentElement.style.setProperty('--accent-secondary', data.colors.secondary);
          if (data.colors.accent) document.documentElement.style.setProperty('--accent-hover', data.colors.accent);
        }
        if (data.siteName) {
          document.title = data.siteName;
        }
      }
    });

    const unsubUI = onSnapshot(doc(db, 'ui_content', 'homepage'), (doc) => {
      if (doc.exists()) {
        setUiContent(doc.data() as UIContent);
      }
    });

    const unsubPlans = onSnapshot(collection(db, 'investment_plans'), (snapshot) => {
      const plans = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as InvestmentPlan));
      setInvestmentPlans(plans.filter(p => p.isActive));
    });

    const unsubToggles = onSnapshot(doc(db, 'feature_toggles', 'general'), (doc) => {
      if (doc.exists()) {
        setFeatureToggles(doc.data() as FeatureToggles);
      }
    });

    const unsubWallets = onSnapshot(collection(db, 'wallets'), (snapshot) => {
      const w = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Wallet));
      setWallets(w.filter(wallet => wallet.isActive));
    });

    const unsubBank = onSnapshot(doc(db, 'bank_details', 'general'), (doc) => {
      if (doc.exists()) {
        setBankDetails(doc.data() as BankDetails);
      }
    });

    setLoading(false);

    return () => {
      unsubSettings();
      unsubUI();
      unsubPlans();
      unsubToggles();
      unsubWallets();
      unsubBank();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-primary"></div>
      </div>
    );
  }

  if (settings?.maintenanceMode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary text-text-primary">
        <div className="text-center p-8 max-w-md bg-bg-secondary rounded-xl shadow-lg border border-border-color">
          <h1 className="text-3xl font-bold mb-4 text-accent-primary">Maintenance Mode</h1>
          <p className="text-text-secondary">
            {settings.siteName || 'Our site'} is currently undergoing scheduled maintenance. Please check back later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <SiteContext.Provider value={{ settings, uiContent, investmentPlans, featureToggles, wallets, bankDetails, loading }}>
      {children}
    </SiteContext.Provider>
  );
}

export function useSite() {
  const context = useContext(SiteContext);
  if (context === undefined) {
    throw new Error('useSite must be used within a SiteProvider');
  }
  return context;
}
