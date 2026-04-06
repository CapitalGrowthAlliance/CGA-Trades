import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, Lock, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, sendEmailVerification } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useSite } from '../context/SiteContext';

export default function SignInPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { settings } = useSite();
  const fromLocation = location.state?.from;
  const fromPath = fromLocation?.pathname || '/home';
  const fromState = fromLocation?.state;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const getErrorMessage = (code: string) => {
    switch (code) {
      case 'auth/invalid-email': return 'Invalid email address format.';
      case 'auth/user-disabled': return 'This account has been disabled.';
      case 'auth/user-not-found': return 'No account found with this email.';
      case 'auth/wrong-password': return 'Incorrect password.';
      case 'auth/invalid-credential': return 'Invalid email or password.';
      default: return 'An error occurred during sign in. Please try again.';
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        await sendEmailVerification(user);
        await auth.signOut();
        setError('Please verify your email address before signing in. A new verification email has been sent.');
        setLoading(false);
        return;
      }

      navigate(fromPath, { state: fromState, replace: true });
    } catch (err: any) {
      console.error('Sign in error:', err);
      setError(getErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setGoogleLoading(true);
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user document exists
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // Create basic user doc, they will need to complete profile later
        await setDoc(userDocRef, {
          id: user.uid,
          email: user.email,
          fullName: user.displayName || '',
          profilePicture: user.photoURL || '',
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
          needsProfileCompletion: true // Flag to prompt for username/phone
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
      console.error('Google sign in error:', err);
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(getErrorMessage(err.code));
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary flex overflow-hidden">
      {/* Left Side - Visual Content (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#050B14] items-center justify-center p-12">
        <div className="absolute inset-0 z-0 opacity-40">
          <img 
            src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=2000" 
            alt="Background" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
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
              Empowering Your <span className="text-accent-primary">Financial Future</span> with Intelligence.
            </h1>
            <p className="text-xl text-gray-400 leading-relaxed mb-8">
              Join thousands of investors who trust our institutional-grade strategies to grow their wealth securely and automatically.
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-[#050B14] bg-bg-secondary flex items-center justify-center overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <span>Trusted by 10,000+ active investors</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Sign In Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 bg-bg-primary relative">
        {/* Mobile Logo */}
        <div className="absolute top-8 left-6 lg:hidden">
          <Link to="/">
            <img src="https://i.imgur.com/jt4vAVS.png" alt="CGA Logo" className="h-8 object-contain" />
          </Link>
        </div>

        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-extrabold text-text-primary mb-2">
              Welcome back
            </h2>
            <p className="text-text-secondary mb-8">
              Don't have an account?{' '}
              <Link to="/signup" className="font-medium text-accent-primary hover:underline">
                Create one for free
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

              <form className="space-y-5" onSubmit={handleEmailSignIn}>
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
                      className="block w-full pl-11 bg-bg-primary border border-border-light rounded-xl py-3.5 text-text-primary placeholder-text-muted focus:ring-2 focus:ring-accent-primary/20 focus:border-accent-primary transition-all sm:text-sm"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="password" className="block text-sm font-medium text-text-secondary">
                      Password
                    </label>
                    <Link to="/forgot-password" className="text-xs font-medium text-accent-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-text-muted group-focus-within:text-accent-primary transition-colors" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-11 bg-bg-primary border border-border-light rounded-xl py-3.5 text-text-primary placeholder-text-muted focus:ring-2 focus:ring-accent-primary/20 focus:border-accent-primary transition-all sm:text-sm"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 bg-bg-primary border-border-light rounded text-accent-primary focus:ring-accent-primary"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-text-secondary">
                    Keep me signed in
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading || googleLoading}
                  className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-bg-primary bg-accent-primary hover:bg-accent-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Sign in
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
                    onClick={handleGoogleSignIn}
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
                        Sign in with Google
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
