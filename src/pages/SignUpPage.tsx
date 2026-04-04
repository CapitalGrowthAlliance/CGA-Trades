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
      <div className="min-h-screen bg-bg-primary flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
          <div className="bg-bg-secondary py-8 px-4 shadow sm:rounded-xl sm:px-10 border border-border-light text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <Mail className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-text-primary mb-2">Check your email</h2>
            <p className="text-text-secondary mb-6">
              We've sent a verification link to <strong>{email}</strong>. Please verify your email to continue.
            </p>
            <Link
              to="/signin"
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-bg-primary bg-accent-primary hover:bg-accent-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-primary transition-colors"
            >
              Return to Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-accent-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent-secondary/5 blur-[120px]" />
      </div>

      {/* Mobile Logo at Top Left */}
      <div className="absolute top-6 left-6 z-20 sm:hidden">
        <Link to="/">
          <img src="https://i.imgur.com/jt4vAVS.png" alt="CGA Logo" className="h-8 object-contain" />
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Link to="/" className="hidden sm:flex justify-center items-center gap-2 mb-8">
          {settings?.logoUrl ? (
            <img src={settings.logoUrl} alt={settings.siteName || "Logo"} className="h-8 w-auto object-contain" referrerPolicy="no-referrer" />
          ) : (
            <>
              <div className="w-10 h-10 bg-accent-primary rounded-lg flex items-center justify-center">
                <span className="text-bg-primary font-bold text-xl">C</span>
              </div>
              <span className="text-2xl font-bold text-text-primary">CGA</span>
            </>
          )}
        </Link>
        <h2 className="mt-12 sm:mt-6 text-center text-3xl font-extrabold text-text-primary">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-text-secondary">
          Already have an account?{' '}
          <Link to="/signin" className="font-medium text-accent-primary hover:text-accent-primary/80 transition-colors">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-bg-secondary py-8 px-4 shadow sm:rounded-xl sm:px-10 border border-border-light">
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 bg-red-500/10 border border-red-500/50 rounded-lg p-4 flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-500">{error}</p>
            </motion.div>
          )}

          <form className="space-y-6" onSubmit={handleEmailSignUp}>
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-text-secondary">
                Full Name
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-text-muted" />
                </div>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="block w-full pl-10 bg-bg-primary border border-border-light rounded-lg py-3 text-text-primary placeholder-text-muted focus:ring-accent-primary focus:border-accent-primary sm:text-sm transition-colors"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-text-secondary">
                Username
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-text-muted font-bold">@</span>
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
                  className="block w-full pl-10 bg-bg-primary border border-border-light rounded-lg py-3 text-text-primary placeholder-text-muted focus:ring-accent-primary focus:border-accent-primary sm:text-sm transition-colors"
                  placeholder="johndoe"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-secondary">
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-text-muted" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 bg-bg-primary border border-border-light rounded-lg py-3 text-text-primary placeholder-text-muted focus:ring-accent-primary focus:border-accent-primary sm:text-sm transition-colors"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-text-secondary">
                Phone Number
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-text-muted" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="block w-full pl-10 bg-bg-primary border border-border-light rounded-lg py-3 text-text-primary placeholder-text-muted focus:ring-accent-primary focus:border-accent-primary sm:text-sm transition-colors"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-secondary">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-text-muted" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 bg-bg-primary border border-border-light rounded-lg py-3 text-text-primary placeholder-text-muted focus:ring-accent-primary focus:border-accent-primary sm:text-sm transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-secondary">
                Confirm Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-text-muted" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full pl-10 bg-bg-primary border border-border-light rounded-lg py-3 text-text-primary placeholder-text-muted focus:ring-accent-primary focus:border-accent-primary sm:text-sm transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {referrer && (
              <div className="text-sm text-text-secondary">
                Referred by: <span className="font-medium text-accent-primary">@{referrer}</span>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading || googleLoading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-bg-primary bg-accent-primary hover:bg-accent-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border-light" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-bg-secondary text-text-muted">Or continue with</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleGoogleSignUp}
                disabled={loading || googleLoading}
                className="w-full flex justify-center items-center py-3 px-4 border border-border-light rounded-lg shadow-sm text-sm font-medium text-text-primary bg-bg-primary hover:bg-bg-primary/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {googleLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
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
      </div>
    </div>
  );
}
