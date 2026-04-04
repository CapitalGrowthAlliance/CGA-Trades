import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, EyeOff, Mail, Lock, User, Shield, ArrowRight, CheckCircle2 } from 'lucide-react';
import { auth, db } from '../firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

export default function LandingPage() {
  const [isSignIn, setIsSignIn] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isSignIn) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        if (!userCredential.user.emailVerified) {
          setError('Please verify your email before signing in.');
          await auth.signOut();
          setLoading(false);
          return;
        }
        navigate('/home');
      } else {
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match");
        }
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // Create user profile
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          fullName,
          email,
          phone,
          username,
          referralCode,
          createdAt: new Date().toISOString(),
          role: 'user',
          status: 'pending_verification'
        });

        await sendEmailVerification(userCredential.user);
        setSuccess('Account created! Please check your email to verify your account.');
        await auth.signOut();
        setIsSignIn(true);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Check if user exists
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', result.user.uid), {
          fullName: result.user.displayName || '',
          email: result.user.email || '',
          createdAt: new Date().toISOString(),
          role: 'user',
          status: 'active'
        });
      }
      navigate('/home');
    } catch (err: any) {
      setError(err.message || 'Google authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#050B14] overflow-hidden relative flex items-center justify-center lg:justify-between px-4 lg:px-24 font-sans">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="w-full h-full object-cover opacity-40"
        >
          <source src="https://cdn.dribbble.com/userupload/46332361/file/large-434d1e88ab0d05b064bd82726500259d.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#050B14]/80 via-transparent to-[#050B14]/80"></div>
      </div>

      {/* Logo at Top Left */}
      <div className="absolute top-8 left-6 lg:left-12 z-20">
        <img src="https://i.imgur.com/jt4vAVS.png" alt="CGA Logo" className="h-10 object-contain" />
      </div>

      {/* Left-Side Text */}
      <div className="hidden lg:flex flex-col justify-center relative z-10 max-w-2xl w-full pr-12 h-[300px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={isSignIn ? 'signin' : 'signup'}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex flex-col justify-center"
          >
            <h1 className="text-5xl xl:text-6xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-[#c8ff00] via-green-400 to-[#c8ff00] animate-gradient-x drop-shadow-[0_0_15px_rgba(200,255,0,0.4)] pb-4">
              {isSignIn 
                ? "You are already in motion. Log in and keep building." 
                : "You’re one step away from a smarter financial future. Welcome to CGA."}
            </h1>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-[480px] lg:w-[480px] my-auto">
        {/* Glassmorphism Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 sm:p-10 shadow-[0_8px_32px_rgba(0,0,0,0.15)] relative overflow-hidden max-h-[85vh] overflow-y-auto custom-scrollbar">
            {/* Subtle inner glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
            
            <div className="relative z-10">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">
                  {isSignIn ? 'Welcome Back' : 'Create Account'}
                </h2>
                <p className="text-sm text-gray-400">
                  {isSignIn ? 'Sign in to access your dashboard' : 'Join the next generation of fintech'}
                </p>
              </div>

              {error && (
                <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-2 text-red-400 text-sm">
                  <Shield className="w-4 h-4 mt-0.5 shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              {success && (
                <div className="mb-6 p-3 bg-green-500/10 border border-green-500/20 rounded-xl flex items-start gap-2 text-green-400 text-sm">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                  <p>{success}</p>
                </div>
              )}

              <form onSubmit={handleAuth} className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {!isSignIn && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, y: -10 }}
                      animate={{ opacity: 1, height: 'auto', y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4 overflow-hidden"
                    >
                      <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#c8ff00] transition-colors z-10" />
                        <input 
                          type="text" 
                          placeholder="Full Name" 
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full bg-white/90 border border-white/40 rounded-xl py-3 pl-12 pr-4 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-[#c8ff00]/50 focus:bg-white transition-all shadow-sm"
                        />
                      </div>

                      <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#c8ff00] transition-colors z-10" />
                        <input 
                          type="text" 
                          placeholder="Username" 
                          required
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="w-full bg-white/90 border border-white/40 rounded-xl py-3 pl-12 pr-4 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-[#c8ff00]/50 focus:bg-white transition-all shadow-sm"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#c8ff00] transition-colors z-10" />
                  <input 
                    type="email" 
                    placeholder="Email Address" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/90 border border-white/40 rounded-xl py-3 pl-12 pr-4 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-[#c8ff00]/50 focus:bg-white transition-all shadow-sm"
                  />
                </div>

                <AnimatePresence mode="popLayout">
                  {!isSignIn && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, y: -10 }}
                      animate={{ opacity: 1, height: 'auto', y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4 overflow-hidden"
                    >
                      <div className="relative group phone-input-container">
                        <PhoneInput
                          country={'us'}
                          value={phone}
                          onChange={phone => setPhone(phone)}
                          enableSearch={true}
                          disableSearchIcon={true}
                          searchPlaceholder="Search country..."
                          containerClass="w-full"
                          inputClass="!w-full !bg-white/90 !border !border-white/40 !rounded-xl !py-3 !pl-12 !pr-4 !text-gray-900 !h-auto focus:!outline-none focus:!border-[#c8ff00]/50 focus:!bg-white !transition-all !shadow-sm"
                          buttonClass="!bg-transparent !border-none !rounded-l-xl !pl-2 hover:!bg-black/5"
                          dropdownClass="!bg-white !text-gray-900 !border-gray-200 !rounded-xl !shadow-2xl custom-phone-dropdown"
                          searchClass="!bg-gray-100 !text-gray-900 !border-gray-200 !rounded-lg !mb-2 !p-2"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#c8ff00] transition-colors z-10" />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/90 border border-white/40 rounded-xl py-3 pl-12 pr-12 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-[#c8ff00]/50 focus:bg-white transition-all shadow-sm"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900 transition-colors z-10"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                <AnimatePresence mode="popLayout">
                  {!isSignIn && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, y: -10 }}
                      animate={{ opacity: 1, height: 'auto', y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4 overflow-hidden"
                    >
                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#c8ff00] transition-colors z-10" />
                        <input 
                          type={showPassword ? "text" : "password"} 
                          placeholder="Confirm Password" 
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full bg-white/90 border border-white/40 rounded-xl py-3 pl-12 pr-4 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-[#c8ff00]/50 focus:bg-white transition-all shadow-sm"
                        />
                      </div>

                      <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#c8ff00] transition-colors z-10" />
                        <input 
                          type="text" 
                          placeholder="Referral Code (Optional)" 
                          value={referralCode}
                          onChange={(e) => setReferralCode(e.target.value)}
                          className="w-full bg-white/90 border border-white/40 rounded-xl py-3 pl-12 pr-4 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-[#c8ff00]/50 focus:bg-white transition-all shadow-sm"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {isSignIn && (
                  <div className="flex justify-end">
                    <button 
                      type="button" 
                      onClick={() => navigate('/forgot-password')}
                      className="text-xs text-gray-400 hover:text-white transition-colors"
                    >
                      Forgot Password?
                    </button>
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#c8ff00] to-green-400 text-black font-bold py-3.5 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50 mt-6"
                >
                  {loading ? 'Processing...' : (isSignIn ? 'Sign In' : 'Create Account')}
                  {!loading && <ArrowRight className="w-5 h-5" />}
                </button>

                <div className="text-center mt-4">
                  <button 
                    type="button"
                    onClick={() => setIsSignIn(!isSignIn)}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {isSignIn ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                  </button>
                </div>

                <div className="relative py-4 flex items-center">
                  <div className="flex-grow border-t border-white/10"></div>
                  <span className="px-4 text-xs text-gray-500">OR</span>
                  <div className="flex-grow border-t border-white/10"></div>
                </div>

                <button 
                  type="button"
                  onClick={handleGoogleAuth}
                  disabled={loading}
                  className="w-full bg-white/5 border border-white/10 text-white font-medium py-3.5 rounded-xl hover:bg-white/10 transition-colors flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Continue with Google
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>

      <style>{`
        @keyframes gradient-x {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient-x {
          animation: gradient-x 6s ease infinite;
          background-size: 200% 200%;
        }
        .phone-input-container .react-tel-input .flag-dropdown {
          background-color: transparent !important;
          border: none !important;
        }
        .phone-input-container .react-tel-input .selected-flag {
          background-color: transparent !important;
        }
        .phone-input-container .react-tel-input .selected-flag:hover,
        .phone-input-container .react-tel-input .selected-flag:focus {
          background-color: rgba(0, 0, 0, 0.05) !important;
        }
        .custom-phone-dropdown .country:hover,
        .custom-phone-dropdown .country.highlight {
          background-color: rgba(0, 0, 0, 0.05) !important;
        }
        .custom-phone-dropdown::-webkit-scrollbar {
          width: 6px;
        }
        .custom-phone-dropdown::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 4px;
        }
        .custom-phone-dropdown::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 4px;
        }
        .custom-phone-dropdown::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.3);
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}
