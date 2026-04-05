import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { User, Phone, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import { auth, db } from '../firebase';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { useSite } from '../context/SiteContext';

export default function CompleteProfilePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { settings } = useSite();
  const fromLocation = location.state?.from;
  const fromPath = fromLocation?.pathname || '/';
  const fromState = fromLocation?.state;
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const user = auth.currentUser;
      if (!user) {
        navigate('/signin');
        return;
      }

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists() && !userDoc.data().needsProfileCompletion) {
        navigate(fromPath, { state: fromState, replace: true });
      }
    };

    checkAuth();
  }, [navigate, fromPath, fromState]);

  const checkUsernameUnique = async (username: string) => {
    const usernameDoc = await getDoc(doc(db, 'usernames', username.toLowerCase()));
    return !usernameDoc.exists();
  };

  const handleCompleteProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !phone) {
      setError('Please fill in all fields.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const user = auth.currentUser;
      if (!user) {
        navigate('/signin');
        return;
      }

      // 1. Check username uniqueness
      const isUnique = await checkUsernameUnique(username);
      if (!isUnique) {
        setError('Username is already taken. Please choose another one.');
        setLoading(false);
        return;
      }

      // 2. Save username mapping
      await setDoc(doc(db, 'usernames', username.toLowerCase()), {
        uid: user.uid
      });

      // 3. Update user data
      await updateDoc(doc(db, 'users', user.uid), {
        username: username.toLowerCase(),
        phone,
        referralCode: username.toLowerCase(),
        needsProfileCompletion: false
      });

      navigate(fromPath, { state: fromState, replace: true });
    } catch (err: any) {
      console.error('Profile completion error:', err);
      setError('An error occurred while saving your profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-accent-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent-secondary/5 blur-[120px]" />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center items-center gap-2 mb-8">
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
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-text-primary">
          Complete your profile
        </h2>
        <p className="mt-2 text-center text-sm text-text-secondary">
          Just a few more details to set up your account.
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

          <form className="space-y-6" onSubmit={handleCompleteProfile}>
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
              <p className="mt-1 text-xs text-text-muted">This will be used for your referral link.</p>
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
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-bg-primary bg-accent-primary hover:bg-accent-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Complete Profile
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
