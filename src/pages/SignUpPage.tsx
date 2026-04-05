import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, Lock, User, Phone, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, sendEmailVerification, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useSite } from '../context/SiteContext';

export default function SignUpPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { settings } = useSite();
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [referrer, setReferrer] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const ref = params.get('ref');
    if (ref) {
      setReferrer(ref);
    }
  }, [location]);

  const getErrorMessage = (code: string) => {
    switch (code) {
      case 'auth/email-already-in-use': return 'An account with this email already exists.';
      case 'auth/invalid-email': return 'Invalid email address format.';
      case 'auth/weak-password': return 'Password should be at least 6 characters.';
      default: return 'An error occurred during sign up. Please try again.';
    }
  };

  const checkUsernameUnique = async (username: string) => {
    const usernameDoc = await getDoc(doc(db, 'usernames', username.toLowerCase()));
    return !usernameDoc.exists();
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !username || !email || !phone || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      // 1. Check username uniqueness
      const isUnique = await checkUsernameUnique(username);
      if (!isUnique) {
        setError('Username is already taken. Please choose another one.');
        setLoading(false);
        return;
      }

      // 2. Create user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 3. Send verification email
      await sendEmailVerification(user);

      // 4. Save username mapping
      await setDoc(doc(db, 'usernames', username.toLowerCase()), {
        uid: user.uid
      });

      // 5. Save user data
      await setDoc(doc(db, 'users', user.uid), {
        id: user.uid,
        fullName,
        username: username.toLowerCase(),
        email,
        phone,
        referralCode: username.toLowerCase(),
        referredBy: referrer || null,
        profilePicture: '',
        createdAt: serverTimestamp(),
        role: 'user',
        isEmailVerified: 0,
        balance: 0,
        totalInvestments: 0,
        totalEarnings: 0,
        roiEarnings: 0,
        referralBonus: 0,
        roiPercentage: 0,
        referralEarnings: 0,
        referralCount: 0,
        activeReferralsCount: 0,
        isKYCVerified: 0,
        walletBalance: 0,
        activeInvestments: 0,
        withdrawableProfits: 0,
        referrals: []
      });

      // Sign out to force email verification
      await auth.signOut();
      setSuccess(true);
    } catch (err: any) {
      console.error('Sign up error:', err);
      setError(getErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setError('');
    setGoogleLoading(true);
    const provider = new GoogleAuthProvider();
    const fromLocation = location.state?.from;
    const fromPath = fromLocation?.pathname || '/home';
    const fromState = fromLocation?.state;

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          id: user.uid,
          email: user.email,
          fullName: user.displayName || '',
          profilePicture: user.photoURL || '',
          referredBy: referrer || null,
          createdAt: serverTimestamp(),
          role: 'user',
          isEmailVerified: 1,
          balance: 0,
          totalInvestments: 0,
          totalEarnings: 0,
          roiEarnings: 0,
          referralBonus: 0,
          roiPercentage: 0,
          referralEarnings: 0,
          referralCount: 0,
          activeReferralsCount: 0,
          isKYCVerified: 0,
          walletBalance: 0,
          activeInvestments: 0,
          withdrawableProfits: 0,
          referrals: [],
          needsProfileCompletion: true
        });
        navigate('/complete-profile', { state: { from: fromLocation } });
      } else {
        const userData = userDoc.data();
        if (userData.needsProfileCompletion) {
          navigate('/complete-profile', { state: { from: fromLocation } });
        } else {
          navigate(fromPath, { state: fromState, replace: true });
        }
      }
    } catch (err: any) {
      console.error('Google sign up error:', err);
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(getErrorMessage(err.code));
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-bg-secondary p-8 rounded-3xl border border-border-light shadow-2xl text-center"
        >
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-500/10 mb-6">
            <Mail className="h-8 w-8 text-green-500" />
          </div>
          <h2 className="text-3xl font-bold text-text-primary mb-4">Verify your email</h2>
          <p className="text-text-secondary mb-8 leading-relaxed">
            We've sent a verification link to <span className="text-text-primary font-semibold">{email}</span>. Please check your inbox and click the link to activate your account.
          </p>
          <Link
            to="/signin"
            className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-bg-primary bg-accent-primary hover:bg-accent-primary/90 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Return to Sign In
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary flex overflow-hidden">
      {/* Left Side - Visual Content (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#050B14] items-center justify-center p-12">
        <div className="absolute inset-0 z-0 opacity-40">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="https://cdn.dribbble.com/userupload/46332361/file/large-434d1e88ab0d05b064bd82726500259d.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-[#050B14] via-transparent to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-lg">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Link to="/" className="inline-block mb-12">
              <img src="https://i.imgur.com/jt4vAVS.png" alt="CGA Logo" className="h-12 object-contain" />
            </Link>
            <h1 className="text-5xl font-bold text-white leading-tight mb-6">
              Start Your <span className="text-accent-primary">Wealth Journey</span> Today.
            </h1>
            <p className="text-xl text-gray-400 leading-relaxed mb-8">
              Create an account in minutes and get access to institutional-grade investment tools and real-time market insights.
            </p>
            
            <div className="space-y-6">
              {[
                { title: 'Secure & Transparent', desc: 'Your assets are protected by bank-grade security.' },
                { title: 'Automated Growth', desc: 'Smart algorithms working for you 24/7.' },
                { title: 'Global Access', desc: 'Invest in global markets from anywhere.' }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-accent-primary/20 flex items-center justify-center shrink-0 mt-1">
                    <div className="w-2 h-2 rounded-full bg-accent-primary"></div>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">{item.title}</h4>
                    <p className="text-gray-500 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Sign Up Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 bg-bg-primary relative overflow-y-auto custom-scrollbar">
        {/* Mobile Logo */}
        <div className="absolute top-8 left-6 lg:hidden">
          <Link to="/">
            <img src="https://i.imgur.com/jt4vAVS.png" alt="CGA Logo" className="h-8 object-contain" />
          </Link>
        </div>

        <div className="sm:mx-auto sm:w-full sm:max-w-md py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-extrabold text-text-primary mb-2">
              Create your account
            </h2>
            <p className="text-text-secondary mb-8">
              Already have an account?{' '}
              <Link to="/signin" className="font-medium text-accent-primary hover:underline">
                Sign in here
              </Link>
            </p>

            <div className="bg-bg-secondary p-8 rounded-3xl border border-border-light shadow-xl relative overflow-hidden">
              {/* Subtle inner glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/5 to-transparent pointer-events-none"></div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-500">{error}</p>
                </motion.div>
              )}

              <form className="space-y-5" onSubmit={handleEmailSignUp}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-text-secondary mb-1.5">
                      Full Name
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-text-muted group-focus-within:text-accent-primary transition-colors" />
                      </div>
                      <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="block w-full pl-11 bg-bg-primary border border-border-light rounded-xl py-3 text-text-primary placeholder-text-muted focus:ring-2 focus:ring-accent-primary/20 focus:border-accent-primary transition-all sm:text-sm"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-text-secondary mb-1.5">
                      Username
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="text-text-muted font-bold group-focus-within:text-accent-primary transition-colors">@</span>
                      </div>
                      <input
                        id="username"
                        name="username"
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
                        className="block w-full pl-11 bg-bg-primary border border-border-light rounded-xl py-3 text-text-primary placeholder-text-muted focus:ring-2 focus:ring-accent-primary/20 focus:border-accent-primary transition-all sm:text-sm"
                        placeholder="johndoe"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-1.5">
                    Email address
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-text-muted group-focus-within:text-accent-primary transition-colors" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-11 bg-bg-primary border border-border-light rounded-xl py-3 text-text-primary placeholder-text-muted focus:ring-2 focus:ring-accent-primary/20 focus:border-accent-primary transition-all sm:text-sm"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-text-secondary mb-1.5">
                    Phone Number
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-text-muted group-focus-within:text-accent-primary transition-colors" />
                    </div>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="block w-full pl-11 bg-bg-primary border border-border-light rounded-xl py-3 text-text-primary placeholder-text-muted focus:ring-2 focus:ring-accent-primary/20 focus:border-accent-primary transition-all sm:text-sm"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-text-secondary mb-1.5">
                      Password
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-text-muted group-focus-within:text-accent-primary transition-colors" />
                      </div>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full pl-11 bg-bg-primary border border-border-light rounded-xl py-3 text-text-primary placeholder-text-muted focus:ring-2 focus:ring-accent-primary/20 focus:border-accent-primary transition-all sm:text-sm"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-secondary mb-1.5">
                      Confirm
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-text-muted group-focus-within:text-accent-primary transition-colors" />
                      </div>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="block w-full pl-11 bg-bg-primary border border-border-light rounded-xl py-3 text-text-primary placeholder-text-muted focus:ring-2 focus:ring-accent-primary/20 focus:border-accent-primary transition-all sm:text-sm"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                </div>

                {referrer && (
                  <div className="p-3 bg-accent-primary/5 border border-accent-primary/20 rounded-xl text-sm text-text-secondary">
                    Referred by: <span className="font-bold text-accent-primary">@{referrer}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || googleLoading}
                  className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-bg-primary bg-accent-primary hover:bg-accent-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Create account
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border-light" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase tracking-wider">
                    <span className="px-3 bg-bg-secondary text-text-muted">Or continue with</span>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    onClick={handleGoogleSignUp}
                    disabled={loading || googleLoading}
                    className="w-full flex justify-center items-center py-3.5 px-4 border border-border-light rounded-xl shadow-sm text-sm font-medium text-text-primary bg-bg-primary hover:bg-bg-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {googleLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                          <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                          />
                          <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                          />
                          <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                          />
                          <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                          />
                        </svg>
                        Sign up with Google
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(var(--accent-primary-rgb), 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(var(--accent-primary-rgb), 0.2);
        }
      `}</style>
    </div>
  );
}
