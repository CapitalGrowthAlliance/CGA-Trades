import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { 
  ShieldCheck, Camera, Copy, CheckCircle2, AlertCircle, 
  TrendingUp, Calendar, Clock, ArrowRight, Smartphone, 
  Mail, Lock, Shield, History, Upload, FileText, 
  Settings, Globe, Bell, Trash2, ChevronRight, Check, User, Wallet, ArrowDownLeft, ArrowUpRight,
  Hash, Image, CreditCard, Building2, LogOut
} from 'lucide-react';

export default function ProfilePage() {
  const navigate = useNavigate();
  // Mock user for UI consistency without auth
  const user = { fullName: 'User', email: 'user@example.com', balance: 1000, totalEarnings: 250 };
  const [copied, setCopied] = useState(false);
  const [currency, setCurrency] = useState<'USD' | 'NGN'>('USD');
  const [isUSCitizen, setIsUSCitizen] = useState(false);
  const [kycType, setKycType] = useState<'DL' | 'NIN' | 'BVN' | 'SSN'>('DL');
  const [kycNumber, setKycNumber] = useState('');
  const [uploadMethod, setUploadMethod] = useState<'camera' | 'device' | null>(null);
  const [frontImage, setFrontImage] = useState<File | null>(null);
  const [backImage, setBackImage] = useState<File | null>(null);
  const [frontPreview, setFrontPreview] = useState<string | null>(null);
  const [backPreview, setBackPreview] = useState<string | null>(null);
  const [isKycSubmitted, setIsKycSubmitted] = useState(false);

  const handleKycTypeChange = (type: 'DL' | 'NIN' | 'BVN' | 'SSN') => {
    if (isKycSubmitted) return;
    
    setKycType(type);
    setKycNumber('');
    setUploadMethod(null);
    setFrontImage(null);
    setBackImage(null);
  };

  const handleKycSubmit = () => {
    if (!kycNumber) {
      alert(`Please enter your ${kycType} number.`);
      return;
    }
    if (kycType !== 'BVN' && (!frontImage || !backImage)) {
      alert("Please upload both front and back images of your ID.");
      return;
    }
    
    setIsKycSubmitted(true);
  };

  React.useEffect(() => {
    if (!frontImage) {
      setFrontPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(frontImage);
    setFrontPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [frontImage]);

  React.useEffect(() => {
    if (!backImage) {
      setBackPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(backImage);
    setBackPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [backImage]);

  const [paymentTab, setPaymentTab] = useState<'naira' | 'dollar' | 'crypto'>('naira');
  const [savedMethods, setSavedMethods] = useState<any[]>([]);
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');
  const [swiftCode, setSwiftCode] = useState('');
  const [bankAddress, setBankAddress] = useState('');
  const [paymentFullName, setPaymentFullName] = useState('');
  const [cryptoType, setCryptoType] = useState<'BTC' | 'USDT'>('BTC');
  const [walletAddress, setWalletAddress] = useState('');

  const handleSavePaymentMethod = () => {
    if (savedMethods.length >= 3) {
      alert("You can only save up to 3 payment methods.");
      return;
    }
    const newMethod = {
      id: Date.now().toString(),
      tab: paymentTab,
      bankName,
      accountNumber,
      accountName,
      routingNumber,
      swiftCode,
      bankAddress,
      paymentFullName,
      cryptoType,
      walletAddress,
      locked: true
    };
    setSavedMethods([...savedMethods, newMethod]);
    // Reset fields
    setBankName('');
    setAccountNumber('');
    setAccountName('');
    setRoutingNumber('');
    setSwiftCode('');
    setBankAddress('');
    setPaymentFullName('');
    setWalletAddress('');
  };

  const referralLink = "https://cga.com/ref/cga_8f92k1";

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatMoney = (amount: number) => {
    if (currency === 'NGN') {
      return `₦${(amount * 1500).toLocaleString()}`; // Mock exchange rate
    }
    return `$${amount.toLocaleString()}`;
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8 pb-32">
      
      {/* 1. PREMIUM HEADER SECTION */}
      <section className="bg-white dark:bg-[#121212] rounded-2xl p-6 md:p-8 border border-gray-100 dark:border-[#2a2a2a] shadow-sm flex flex-col md:flex-row items-center md:items-start gap-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-slate-100 to-slate-50 dark:from-[#1a1a1a] dark:to-[#121212] z-0"></div>
        
        <div className="relative z-10 flex flex-col items-center md:items-start w-full">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 w-full mt-12 md:mt-16">
            <div className="relative group cursor-pointer">
              <div className="w-28 h-28 rounded-full bg-white dark:bg-[#1a1a1a] border-4 border-white dark:border-[#121212] shadow-md flex items-center justify-center text-4xl font-bold text-gray-400 overflow-hidden">
                {user?.fullName?.charAt(0) || 'U'}
              </div>
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-8 h-8 text-white" />
              </div>
              <div className="absolute bottom-0 right-0 w-8 h-8 bg-[#ff4000] rounded-full border-2 border-white dark:border-[#121212] flex items-center justify-center">
                <Camera className="w-4 h-4 text-white" />
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-1">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  {user?.fullName || 'User Name'}
                </h1>
                <span className="inline-flex items-center justify-center gap-1 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border border-emerald-500/20 w-fit mx-auto md:mx-0">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified
                </span>
              </div>
              <p className="text-gray-500 dark:text-gray-400 font-medium mb-2">@{user?.fullName?.toLowerCase().replace(/\s+/g, '') || 'username'}</p>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-[#1a1a1a] px-3 py-1.5 rounded-lg border border-gray-100 dark:border-[#2a2a2a]">
                  <span className="font-medium text-gray-400">ID:</span>
                  <span className="font-mono text-gray-700 dark:text-gray-300">CGA-8F92K1</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <span>Joined Oct 2023</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WALLET OVERVIEW SECTION */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-[#121212] rounded-2xl border border-gray-100 dark:border-[#2a2a2a] shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                <Wallet className="w-5 h-5" />
              </div>
              <h3 className="text-gray-500 dark:text-gray-400 font-medium">Wallet Balance</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              {formatMoney(user?.balance || 0)}
            </p>
          </div>
          <a href="/fund?tab=deposit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl transition-colors text-center flex items-center justify-center gap-2">
            <ArrowDownLeft className="w-5 h-5" /> Deposit Funds
          </a>
        </div>

        <div className="bg-white dark:bg-[#121212] rounded-2xl border border-gray-100 dark:border-[#2a2a2a] shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-gray-500 dark:text-gray-400 font-medium">Withdrawable Profits</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              {formatMoney(user?.totalEarnings || 0)}
            </p>
          </div>
          <a href="/fund?tab=withdraw" className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-xl transition-colors text-center flex items-center justify-center gap-2">
            <ArrowUpRight className="w-5 h-5" /> Withdraw Profits
          </a>
        </div>
      </section>

      {/* 2. INVESTMENT OVERVIEW SECTION */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#ff4000]" /> Active Investments
          </h2>
        </div>

        <div className="bg-white dark:bg-[#121212] rounded-2xl border border-gray-100 dark:border-[#2a2a2a] shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-[0_0_15px_rgba(255,64,0,0.05)] overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-[#2a2a2a] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Premium Growth Plan</h3>
                <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-md uppercase tracking-wider">Active</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Capital locked for 90 days</p>
            </div>
            <div className="text-left md:text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Accumulated Profit</p>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{formatMoney(1250.50)}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-gray-100 dark:divide-[#2a2a2a]">
            <div className="p-4 md:p-6">
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold mb-1">Amount Invested</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{formatMoney(5000)}</p>
            </div>
            <div className="p-4 md:p-6">
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold mb-1">Daily Yield</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{formatMoney(25)} <span className="text-sm text-gray-500 font-normal">/day</span></p>
            </div>
            <div className="p-4 md:p-6">
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold mb-1">Start Date</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">Oct 15, 2023</p>
            </div>
            <div className="p-4 md:p-6">
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold mb-1">Maturity Date</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">Jan 15, 2024</p>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-[#1a1a1a] p-4 px-6 flex items-center justify-between border-t border-gray-100 dark:border-[#2a2a2a]">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-[#ff4000]" />
              <span className="text-gray-600 dark:text-gray-300">Withdrawal available in <strong className="text-gray-900 dark:text-white">45 days</strong></span>
            </div>
            <div className="w-1/3 h-2 bg-gray-200 dark:bg-[#2a2a2a] rounded-full overflow-hidden hidden md:block">
              <div className="h-full bg-[#ff4000] rounded-full" style={{ width: '50%' }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. REFERRAL SYSTEM SECTION */}
      <section className="bg-white dark:bg-[#121212] rounded-2xl border border-gray-100 dark:border-[#2a2a2a] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-[#2a2a2a]">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#ff4000]" /> Referral Program
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Invite friends and earn 5% of their first investment.</p>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Your Unique Referral Link</label>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] rounded-xl px-4 py-3 font-mono text-sm text-gray-700 dark:text-gray-300 overflow-hidden text-ellipsis whitespace-nowrap">
                  {referralLink}
                </div>
                <button 
                  onClick={handleCopy}
                  className="bg-[#ff4000] hover:bg-[#e63900] text-white px-4 py-3 rounded-xl font-medium transition-colors flex items-center gap-2 shrink-0"
                >
                  {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy Link'}</span>
                </button>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400 p-3 rounded-lg border border-blue-100 dark:border-blue-900/30">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <p>You are currently on <strong>Tier 1 (Silver)</strong>. Refer 3 more active users to reach Gold Tier.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-[#1a1a1a] rounded-xl p-4 border border-gray-100 dark:border-[#2a2a2a]">
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold mb-1">Total Referrals</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">12</p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">8 Active</p>
            </div>
            <div className="bg-gray-50 dark:bg-[#1a1a1a] rounded-xl p-4 border border-gray-100 dark:border-[#2a2a2a]">
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold mb-1">Earnings</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatMoney(450)}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 4. PERSONAL INFORMATION SECTION */}
        <section className="bg-white dark:bg-[#121212] rounded-2xl border border-gray-100 dark:border-[#2a2a2a] shadow-sm flex flex-col">
          <div className="p-6 border-b border-gray-100 dark:border-[#2a2a2a]">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <User className="w-5 h-5 text-[#ff4000]" /> Personal Information
            </h2>
          </div>
          <div className="p-6 space-y-5 flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Full Name</label>
                <input type="text" defaultValue={user?.fullName || ''} className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] rounded-xl px-4 py-2.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#ff4000]/20 focus:border-[#ff4000] outline-none transition-all" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Username</label>
                <input type="text" defaultValue="johndoe99" className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] rounded-xl px-4 py-2.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#ff4000]/20 focus:border-[#ff4000] outline-none transition-all" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center justify-between">
                Email Address
                <span className="text-emerald-500 flex items-center gap-1"><Check className="w-3 h-3" /> Verified</span>
              </label>
              <input type="email" defaultValue={user?.email || ''} className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] rounded-xl px-4 py-2.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#ff4000]/20 focus:border-[#ff4000] outline-none transition-all" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center justify-between">
                  Phone Number
                  <span className="text-emerald-500 flex items-center gap-1"><Check className="w-3 h-3" /> Verified</span>
                </label>
                <input type="tel" defaultValue="+1 (555) 123-4567" className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] rounded-xl px-4 py-2.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#ff4000]/20 focus:border-[#ff4000] outline-none transition-all" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date of Birth</label>
                <input type="date" defaultValue="1990-01-01" className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] rounded-xl px-4 py-2.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#ff4000]/20 focus:border-[#ff4000] outline-none transition-all" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Country</label>
              <select className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] rounded-xl px-4 py-2.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#ff4000]/20 focus:border-[#ff4000] outline-none transition-all appearance-none">
                <option>United States</option>
                <option>United Kingdom</option>
                <option>Nigeria</option>
                <option>Canada</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Residential Address</label>
              <textarea rows={2} defaultValue="123 Financial District, Wall Street, NY 10005" className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] rounded-xl px-4 py-2.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#ff4000]/20 focus:border-[#ff4000] outline-none transition-all resize-none"></textarea>
            </div>
          </div>
          <div className="p-6 border-t border-gray-100 dark:border-[#2a2a2a] bg-gray-50/50 dark:bg-[#1a1a1a]/50 mt-auto">
            <button className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 font-semibold py-3 rounded-xl transition-colors">
              Save Changes
            </button>
          </div>
        </section>

        <div className="space-y-8">
          {/* 5. SECURITY & AUTHENTICATION SECTION */}
          <section className="bg-white dark:bg-[#121212] rounded-2xl border border-gray-100 dark:border-[#2a2a2a] shadow-sm">
            <div className="p-6 border-b border-gray-100 dark:border-[#2a2a2a]">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#ff4000]" /> Security & Authentication
              </h2>
            </div>
            <div className="p-0 divide-y divide-gray-100 dark:divide-[#2a2a2a]">
              <div className="p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-[#2a2a2a] flex items-center justify-center text-gray-500 dark:text-gray-400 group-hover:bg-white dark:group-hover:bg-[#333] transition-colors">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Change Password</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Last changed 3 months ago</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>

              <div className="p-6 border-b border-gray-100 dark:border-[#2a2a2a]">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Two-Factor Auth (2FA)</h3>
                      <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">Enabled via Authenticator App</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 border border-gray-200 dark:border-[#2a2a2a] rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition-colors">
                    Manage
                  </button>
                </div>
                <div className="bg-gray-50 dark:bg-[#1a1a1a] rounded-xl p-4 flex items-center gap-4 border border-gray-100 dark:border-[#2a2a2a]">
                  <div className="w-16 h-16 bg-white dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700 shrink-0 flex items-center justify-center">
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=CGA-Auth-Setup" alt="QR Code Placeholder" className="w-full h-full opacity-50" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">Authenticator App Setup</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Scan this QR code with Google Authenticator or Authy to set up 2FA.</p>
                  </div>
                </div>
              </div>

              <div className="p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-[#2a2a2a] flex items-center justify-center text-gray-500 dark:text-gray-400">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">SMS Verification</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Receive security codes via SMS</p>
                  </div>
                </div>
                <button className="px-4 py-2 border border-gray-200 dark:border-[#2a2a2a] rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition-colors">
                  Enable
                </button>
              </div>

              <div className="p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-[#2a2a2a] flex items-center justify-center text-gray-500 dark:text-gray-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Email Verification</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Require email code for withdrawals</p>
                  </div>
                </div>
                <div className="relative inline-block w-12 h-6 rounded-full bg-[#ff4000] cursor-pointer">
                  <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform translate-x-6"></span>
                </div>
              </div>

              <div className="p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-[#2a2a2a] flex items-center justify-center text-gray-500 dark:text-gray-400 group-hover:bg-white dark:group-hover:bg-[#333] transition-colors">
                    <History className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Login Activity</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Manage active sessions</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>

              <div 
                className="p-6 flex items-center justify-between hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer group"
                onClick={async () => {
                  await auth.signOut();
                  navigate('/');
                }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center text-red-500 dark:text-red-400 group-hover:bg-red-200 dark:group-hover:bg-red-500/30 transition-colors">
                    <LogOut className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-red-600 dark:text-red-500">Log Out</h3>
                    <p className="text-sm text-red-500/80 dark:text-red-400/80">End your current session</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-red-400" />
              </div>
            </div>
          </section>

          {/* 6. KYC VERIFICATION SECTION */}
          <section className="bg-white dark:bg-[#121212] rounded-2xl border border-gray-100 dark:border-[#2a2a2a] shadow-sm">
            <div className="p-6 border-b border-gray-100 dark:border-[#2a2a2a] flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#ff4000]" /> KYC Verification
              </h2>
              <span className={`px-2.5 py-1 text-xs font-bold rounded-md uppercase tracking-wider ${isKycSubmitted ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'}`}>
                {isKycSubmitted ? 'Under Review' : 'Verification Required'}
              </span>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <input
                  type="checkbox"
                  id="us-citizen"
                  checked={isUSCitizen}
                  disabled={isKycSubmitted}
                  onChange={(e) => setIsUSCitizen(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-[#ff4000] focus:ring-[#ff4000]/20 disabled:opacity-50"
                />
                <label htmlFor="us-citizen" className={`text-sm font-medium cursor-pointer ${isKycSubmitted ? 'text-gray-400' : 'text-gray-700 dark:text-gray-300'}`}>
                  I am a U.S. citizen
                </label>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button
                  onClick={() => handleKycTypeChange('DL')}
                  disabled={isKycSubmitted}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-all disabled:opacity-50 ${kycType === 'DL' ? 'bg-[#ff4000] border-[#ff4000] text-white' : 'bg-gray-50 dark:bg-[#1a1a1a] border-gray-200 dark:border-[#2a2a2a] text-gray-500 hover:border-[#ff4000]/50'}`}
                >
                  Driver's License
                </button>
                <button
                  onClick={() => handleKycTypeChange('NIN')}
                  disabled={isKycSubmitted}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-all disabled:opacity-50 ${kycType === 'NIN' ? 'bg-[#ff4000] border-[#ff4000] text-white' : 'bg-gray-50 dark:bg-[#1a1a1a] border-gray-200 dark:border-[#2a2a2a] text-gray-500 hover:border-[#ff4000]/50'}`}
                >
                  National ID (NIN)
                </button>
                <button
                  onClick={() => handleKycTypeChange('BVN')}
                  disabled={isKycSubmitted}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-all disabled:opacity-50 ${kycType === 'BVN' ? 'bg-[#ff4000] border-[#ff4000] text-white' : 'bg-gray-50 dark:bg-[#1a1a1a] border-gray-200 dark:border-[#2a2a2a] text-gray-500 hover:border-[#ff4000]/50'}`}
                >
                  BVN
                </button>
                {isUSCitizen && (
                  <button
                    onClick={() => handleKycTypeChange('SSN')}
                    disabled={isKycSubmitted}
                    className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-all disabled:opacity-50 ${kycType === 'SSN' ? 'bg-[#ff4000] border-[#ff4000] text-white' : 'bg-gray-50 dark:bg-[#1a1a1a] border-gray-200 dark:border-[#2a2a2a] text-gray-500 hover:border-[#ff4000]/50'}`}
                  >
                    SSN
                  </button>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    {kycType === 'DL' ? "Driver's License Number" :
                     kycType === 'NIN' ? "National ID / NIN Number" :
                     kycType === 'BVN' ? "BVN Number" : "SSN Number"}
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <Hash className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      value={kycNumber}
                      disabled={isKycSubmitted}
                      onChange={(e) => setKycNumber(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] rounded-xl pl-12 pr-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#ff4000]/20 focus:border-[#ff4000] outline-none transition-all disabled:opacity-50"
                      placeholder={`Enter ${kycType} number`}
                    />
                  </div>
                </div>

                {kycType !== 'BVN' && (
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Upload Document</label>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => setUploadMethod('camera')}
                        disabled={isKycSubmitted}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 border-dashed transition-all disabled:opacity-50 ${uploadMethod === 'camera' ? 'border-[#ff4000] bg-[#ff4000]/5 text-[#ff4000]' : 'border-gray-200 dark:border-[#2a2a2a] text-gray-500 hover:border-[#ff4000]/30'}`}
                      >
                        <Camera className="w-6 h-6 mb-2" />
                        <span className="text-xs font-medium">Take Photo</span>
                      </button>
                      <button
                        onClick={() => setUploadMethod('device')}
                        disabled={isKycSubmitted}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 border-dashed transition-all disabled:opacity-50 ${uploadMethod === 'device' ? 'border-[#ff4000] bg-[#ff4000]/5 text-[#ff4000]' : 'border-gray-200 dark:border-[#2a2a2a] text-gray-500 hover:border-[#ff4000]/30'}`}
                      >
                        <Upload className="w-6 h-6 mb-2" />
                        <span className="text-xs font-medium">Upload from Device</span>
                      </button>
                    </div>

                    {uploadMethod && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {[
                          { label: 'Front of ID', file: frontImage, setFile: setFrontImage, preview: frontPreview },
                          { label: 'Back of ID', file: backImage, setFile: setBackImage, preview: backPreview }
                        ].map((side, idx) => (
                          <div key={idx} className="space-y-3">
                            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{side.label}</label>
                            
                            {side.file && side.preview ? (
                              <div className="space-y-3">
                                <div className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-[#2a2a2a] bg-gray-50 dark:bg-[#1a1a1a]">
                                  <img 
                                    src={side.preview} 
                                    alt={side.label} 
                                    className="w-full h-auto object-contain max-h-64"
                                  />
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  <button 
                                    onClick={() => {
                                      // In a real app, this would trigger camera again
                                      side.setFile(null);
                                      setUploadMethod('camera');
                                    }}
                                    disabled={isKycSubmitted}
                                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-gray-100 dark:bg-[#2a2a2a] text-gray-700 dark:text-gray-300 rounded-lg text-xs font-semibold hover:bg-gray-200 dark:hover:bg-[#333] transition-colors disabled:opacity-50"
                                  >
                                    <Camera className="w-3.5 h-3.5" /> Retake
                                  </button>
                                  <button 
                                    onClick={() => side.setFile(null)}
                                    disabled={isKycSubmitted}
                                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-gray-100 dark:bg-[#2a2a2a] text-gray-700 dark:text-gray-300 rounded-lg text-xs font-semibold hover:bg-gray-200 dark:hover:bg-[#333] transition-colors disabled:opacity-50"
                                  >
                                    <Upload className="w-3.5 h-3.5" /> Re-upload
                                  </button>
                                  <button 
                                    onClick={() => side.setFile(null)}
                                    disabled={isKycSubmitted}
                                    className="flex items-center justify-center p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors disabled:opacity-50"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="relative group">
                                <input
                                  type="file"
                                  accept="image/*"
                                  disabled={isKycSubmitted}
                                  capture={uploadMethod === 'camera' ? 'environment' : undefined}
                                  onChange={(e) => side.setFile(e.target.files?.[0] || null)}
                                  className={`absolute inset-0 w-full h-full opacity-0 z-10 ${isKycSubmitted ? 'cursor-default' : 'cursor-pointer'}`}
                                />
                                <div className="bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] rounded-xl p-8 flex flex-col items-center justify-center gap-3 group-hover:border-[#ff4000]/50 transition-all border-dashed border-2">
                                  <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-[#2a2a2a] flex items-center justify-center text-gray-400 group-hover:text-[#ff4000] transition-colors">
                                    {uploadMethod === 'camera' ? <Camera className="w-5 h-5" /> : <Upload className="w-5 h-5" />}
                                  </div>
                                  <div className="text-center">
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">Click to {uploadMethod === 'camera' ? 'capture' : 'upload'}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">JPG, PNG or PDF</p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <button 
                  onClick={handleKycSubmit}
                  disabled={isKycSubmitted}
                  className={`w-full font-semibold py-3 rounded-xl transition-colors shadow-lg ${isKycSubmitted ? 'bg-emerald-500 text-white shadow-emerald-500/20 cursor-default' : 'bg-[#ff4000] hover:bg-[#e63900] text-white shadow-[#ff4000]/20'}`}
                >
                  {isKycSubmitted ? (
                    <span className="flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-5 h-5" /> Submitted for Review
                    </span>
                  ) : 'Submit for Verification'}
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* 7. PAYMENT DETAILS SECTION */}
      <section className="bg-white dark:bg-[#121212] rounded-2xl border border-gray-100 dark:border-[#2a2a2a] shadow-sm">
        <div className="p-6 border-b border-gray-100 dark:border-[#2a2a2a]">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-[#ff4000]" /> Payment Details
          </h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex p-1 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] rounded-xl">
            <button
              onClick={() => setPaymentTab('naira')}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${paymentTab === 'naira' ? 'bg-white dark:bg-[#2a2a2a] shadow-sm text-[#ff4000]' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
            >
              Naira (₦)
            </button>
            <button
              onClick={() => setPaymentTab('dollar')}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${paymentTab === 'dollar' ? 'bg-white dark:bg-[#2a2a2a] shadow-sm text-[#ff4000]' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
            >
              Dollar ($)
            </button>
            <button
              onClick={() => setPaymentTab('crypto')}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${paymentTab === 'crypto' ? 'bg-white dark:bg-[#2a2a2a] shadow-sm text-[#ff4000]' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
            >
              Crypto
            </button>
          </div>

          <div className="space-y-4">
            {paymentTab !== 'crypto' ? (
              <>
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
                  <p className="text-xs text-amber-600 dark:text-amber-400 leading-relaxed">
                    <strong>Warning:</strong> Ensure the bank account name matches your profile name exactly. Mismatched names will lead to withdrawal failure.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {paymentTab === 'dollar' ? (
                    <>
                      <div className="col-span-full">
                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Full Name</label>
                        <input
                          type="text"
                          value={paymentFullName}
                          onChange={(e) => setPaymentFullName(e.target.value)}
                          className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#ff4000]/20 focus:border-[#ff4000] outline-none transition-all"
                          placeholder="Full Name as on Bank Account"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Bank Name</label>
                        <input
                          type="text"
                          value={bankName}
                          onChange={(e) => setBankName(e.target.value)}
                          className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#ff4000]/20 focus:border-[#ff4000] outline-none transition-all"
                          placeholder="e.g. JPMorgan Chase"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Account Number</label>
                        <input
                          type="text"
                          value={accountNumber}
                          onChange={(e) => setAccountNumber(e.target.value)}
                          className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#ff4000]/20 focus:border-[#ff4000] outline-none transition-all"
                          placeholder="Account Number"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Routing Number</label>
                        <input
                          type="text"
                          value={routingNumber}
                          onChange={(e) => setRoutingNumber(e.target.value)}
                          className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#ff4000]/20 focus:border-[#ff4000] outline-none transition-all"
                          placeholder="9-digit routing number"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">SWIFT Code</label>
                        <input
                          type="text"
                          value={swiftCode}
                          onChange={(e) => setSwiftCode(e.target.value)}
                          className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#ff4000]/20 focus:border-[#ff4000] outline-none transition-all"
                          placeholder="SWIFT/BIC Code"
                        />
                      </div>
                      <div className="col-span-full">
                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Bank Address</label>
                        <textarea
                          rows={2}
                          value={bankAddress}
                          onChange={(e) => setBankAddress(e.target.value)}
                          className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#ff4000]/20 focus:border-[#ff4000] outline-none transition-all resize-none"
                          placeholder="Full Bank Address"
                        ></textarea>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Bank Name</label>
                        <input
                          type="text"
                          value={bankName}
                          onChange={(e) => setBankName(e.target.value)}
                          className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#ff4000]/20 focus:border-[#ff4000] outline-none transition-all"
                          placeholder="e.g. Zenith Bank"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Account Number</label>
                        <input
                          type="text"
                          value={accountNumber}
                          onChange={(e) => setAccountNumber(e.target.value)}
                          className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#ff4000]/20 focus:border-[#ff4000] outline-none transition-all"
                          placeholder="0123456789"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Account Name</label>
                        <input
                          type="text"
                          value={accountName}
                          onChange={(e) => setAccountName(e.target.value)}
                          className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#ff4000]/20 focus:border-[#ff4000] outline-none transition-all"
                          placeholder="Must match profile"
                        />
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Select Cryptocurrency</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setCryptoType('BTC')}
                      className={`p-3 rounded-xl border text-sm font-medium transition-all ${cryptoType === 'BTC' ? 'border-[#ff4000] bg-[#ff4000]/5 text-[#ff4000]' : 'border-gray-200 dark:border-[#2a2a2a] text-gray-500 hover:border-[#ff4000]/30'}`}
                    >
                      Bitcoin (BTC)
                    </button>
                    <button
                      onClick={() => setCryptoType('USDT')}
                      className={`p-3 rounded-xl border text-sm font-medium transition-all flex flex-col items-center justify-center gap-1 ${cryptoType === 'USDT' ? 'border-[#ff4000] bg-[#ff4000]/5 text-[#ff4000]' : 'border-gray-200 dark:border-[#2a2a2a] text-gray-500 hover:border-[#ff4000]/30'}`}
                    >
                      <span>USDT (TRC20)</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">Recommended</span>
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Wallet Address</label>
                  <input
                    type="text"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#ff4000]/20 focus:border-[#ff4000] outline-none transition-all"
                    placeholder={`Enter ${cryptoType} address`}
                  />
                </div>
              </div>
            )}

            <button
              onClick={handleSavePaymentMethod}
              className="w-full bg-[#ff4000] hover:bg-[#e63900] text-white font-semibold py-3 rounded-xl transition-colors shadow-lg shadow-[#ff4000]/20"
            >
              Save Payment Method
            </button>

            {savedMethods.length > 0 && (
              <div className="mt-8 space-y-4">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Saved Methods ({savedMethods.length}/3)</h3>
                <div className="space-y-3">
                  {savedMethods.map((method) => (
                    <div key={method.id} className="bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] rounded-xl p-4 flex items-center justify-between group transition-all hover:border-[#ff4000]/30">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white dark:bg-[#2a2a2a] rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-[#333]">
                          {method.tab === 'crypto' ? <Wallet className="w-4 h-4" /> : <Building2 className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">
                            {method.tab === 'crypto' ? method.cryptoType : method.bankName}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {method.tab === 'crypto' ? 
                              `${method.walletAddress.substring(0, 6)}...${method.walletAddress.substring(method.walletAddress.length - 4)}` : 
                              `**** ${method.accountNumber.substring(method.accountNumber.length - 4)}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-tighter px-2 py-0.5 bg-emerald-500/10 text-emerald-500 rounded border border-emerald-500/20">Locked</span>
                        <Lock className="w-4 h-4 text-gray-400 opacity-50" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
