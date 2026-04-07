import React, { useState, useEffect } from 'react';
import { ArrowDownRight, ArrowUpRight, UserPlus, Gift } from 'lucide-react';

interface Notification {
  id: string;
  type: 'Joined' | 'Deposit' | 'Withdrawal' | 'Received Bonus';
  name: string;
  country: string;
  amount?: string;
  time: string;
}

const COUNTRIES = [
  { name: 'United States', currency: 'USD', symbol: '$', rate: 1 },
  { name: 'United Kingdom', currency: 'GBP', symbol: '£', rate: 0.79 },
  { name: 'Canada', currency: 'CAD', symbol: 'CA$', rate: 1.35 },
  { name: 'Australia', currency: 'AUD', symbol: 'A$', rate: 1.52 },
  { name: 'Germany', currency: 'EUR', symbol: '€', rate: 0.92 },
  { name: 'France', currency: 'EUR', symbol: '€', rate: 0.92 },
  { name: 'Singapore', currency: 'SGD', symbol: 'S$', rate: 1.34 },
  { name: 'Tanzania', currency: 'TZS', symbol: 'TSh', rate: 2550 },
  { name: 'Nigeria', currency: 'NGN', symbol: '₦', rate: 1150 },
  { name: 'Uganda', currency: 'UGX', symbol: 'USh', rate: 3900 },
  { name: 'Cameroon', currency: 'XAF', symbol: 'FCFA', rate: 600 },
  { name: 'South Africa', currency: 'ZAR', symbol: 'R', rate: 19 },
  { name: 'Kenya', currency: 'KES', symbol: 'KSh', rate: 130 },
  { name: 'Ghana', currency: 'GHS', symbol: 'GH₵', rate: 13.5 },
];

const NAMES = {
  English: ['James', 'Emma', 'William', 'Olivia', 'Michael', 'Sophia', 'Alexander', 'Isabella', 'Daniel', 'Mia', 'Ethan', 'Ava', 'Matthew', 'Charlotte', 'David', 'Amelia', 'Joseph', 'Harper', 'Samuel', 'Evelyn'],
  German: ['Lukas', 'Hannah', 'Maximilian', 'Lea', 'Paul', 'Anna', 'Felix', 'Laura', 'Leon', 'Marie', 'Jonas', 'Lena', 'Tim', 'Sarah', 'Finn', 'Julia', 'Julian', 'Lisa', 'Niclas', 'Katharina'],
  French: ['Gabriel', 'Louise', 'Léo', 'Ambre', 'Raphaël', 'Alice', 'Arthur', 'Rose', 'Louis', 'Chloé', 'Jules', 'Emma', 'Hugo', 'Jade', 'Lucas', 'Lina', 'Maël', 'Mila', 'Noah', 'Léa'],
  African: ['Kwame', 'Ngozi', 'Oluwaseun', 'Amina', 'Chidi', 'Fatima', 'Kofi', 'Zainab', 'Tariq', 'Nia', 'Sipho', 'Thandi', 'Ayo', 'Bisi', 'Emeka', 'Halima', 'Juma', 'Kemi', 'Musa', 'Nneka'],
  Asian: ['Wei', 'Jian', 'Mei', 'Li', 'Ying', 'Hao', 'Chen', 'Lin', 'Jin', 'Hua', 'Qiang', 'Fang', 'Lei', 'Min', 'Bo', 'Jing', 'Tao', 'Yan', 'Feng', 'Xia']
};

// Keep track of recently used names to avoid immediate repetition
let recentNames: string[] = [];

const getRandomItem = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const generateName = (country: string) => {
  let pool: string[] = [];
  if (['Germany'].includes(country)) pool = [...NAMES.English, ...NAMES.German];
  else if (['France'].includes(country)) pool = [...NAMES.English, ...NAMES.French];
  else if (['Singapore'].includes(country)) pool = [...NAMES.English, ...NAMES.Asian];
  else if (['Tanzania', 'Nigeria', 'Uganda', 'Cameroon', 'South Africa', 'Kenya', 'Ghana'].includes(country)) {
    pool = [...NAMES.English, ...NAMES.African];
  } else {
    pool = NAMES.English;
  }

  // Filter out recently used names
  let availableNames = pool.filter(n => !recentNames.includes(n));
  if (availableNames.length === 0) {
    recentNames = []; // Reset if we run out
    availableNames = pool;
  }

  const selectedName = getRandomItem(availableNames);
  
  // Update recent names list (keep last 10)
  recentNames.push(selectedName);
  if (recentNames.length > 10) recentNames.shift();

  return selectedName;
};

const formatAmount = (amountUSD: number, countryObj: typeof COUNTRIES[0]) => {
  const localAmount = amountUSD * countryObj.rate;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: countryObj.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(localAmount).replace(countryObj.currency, countryObj.symbol).trim();
};

const generateNotification = (): Notification => {
  const countryObj = getRandomItem(COUNTRIES);
  const name = generateName(countryObj.name);
  const types: Notification['type'][] = ['Joined', 'Deposit', 'Withdrawal', 'Received Bonus'];
  const type = getRandomItem(types);
  
  let amountUSD = 0;
  if (type === 'Deposit') {
    amountUSD = Math.floor(Math.random() * (5000 - 100 + 1)) + 100; // Realistic: $100 - $5000
  } else if (type === 'Withdrawal') {
    amountUSD = Math.floor(Math.random() * (2000 - 50 + 1)) + 50; // Realistic: $50 - $2000
  } else if (type === 'Received Bonus') {
    amountUSD = Math.floor(Math.random() * (100 - 10 + 1)) + 10; // Realistic: $10 - $100
  }

  return {
    id: Math.random().toString(36).substring(7),
    type,
    name,
    country: countryObj.name,
    amount: amountUSD > 0 ? formatAmount(amountUSD, countryObj) : undefined,
    time: 'Just now',
  };
};

export default function HomeActivityNotifications() {
  const [currentNotification, setCurrentNotification] = useState<Notification | null>(null);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    // The specific intervals requested: 3, 20, 38, 59 seconds
    const intervals = [3000, 20000, 38000, 59000];
    let intervalIndex = 0;

    const scheduleNext = () => {
      // 1. Clear current notification (fade out)
      setCurrentNotification(null);

      // 2. Wait a short moment for fade out to complete, then schedule the next one
      const currentInterval = intervals[intervalIndex];
      
      timeoutId = setTimeout(() => {
        setCurrentNotification(generateNotification());
        
        // Move to next interval, loop back to start if at end
        intervalIndex = (intervalIndex + 1) % intervals.length;
        
        // Schedule the next cycle after the notification has been visible for a bit
        // We want it to be visible for a few seconds before the next interval starts
        setTimeout(scheduleNext, 5000); // Visible for 5 seconds before starting the next interval wait
      }, currentInterval);
    };

    // Start the cycle
    scheduleNext();

    return () => clearTimeout(timeoutId);
  }, []);

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'Joined': return <UserPlus className="w-4 h-4 text-blue-400" />;
      case 'Deposit': return <ArrowDownRight className="w-4 h-4 text-green-400" />;
      case 'Withdrawal': return <ArrowUpRight className="w-4 h-4 text-red-400" />;
      case 'Received Bonus': return <Gift className="w-4 h-4 text-yellow-400" />;
    }
  };

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] pointer-events-none w-full flex justify-center px-4">
      {currentNotification && (
        <div
          key={currentNotification.id}
          className="flex items-center gap-3 py-2 px-4 rounded-full bg-white/[0.03] backdrop-blur-md border border-white/5 shadow-[0_4px_20px_rgba(0,0,0,0.1)]"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5">
            {getIcon(currentNotification.type)}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-medium text-gray-200">{currentNotification.name}</span>
              <span className="text-[10px] text-gray-500">from {currentNotification.country}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[11px] text-gray-400">{currentNotification.type}</span>
              {currentNotification.amount && (
                <span className={`text-[11px] font-semibold ${
                  currentNotification.type === 'Withdrawal' ? 'text-red-400' : 
                  currentNotification.type === 'Received Bonus' ? 'text-yellow-400' : 'text-green-400'
                }`}>
                  {currentNotification.amount}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
