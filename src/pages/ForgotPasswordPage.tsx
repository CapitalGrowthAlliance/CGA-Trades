import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, AlertCircle, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { auth } from '../firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useSite } from '../context/SiteContext';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const { settings } = useSite();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const getErrorMessage = (code: string) => {
    switch (code) {
      case 'auth/invalid-email': return 'Invalid email address format.';
      case 'auth/user-not-found': return 'No account found with this email.';
      default: return 'An error occurred. Please try again.';
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
    } catch (err: any) {
      console.error('Password reset error:', err);
      setError(getErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-bg-primary flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="w-full max-w-[320px] sm:max-w-md mx-auto relative z-10">
          <div className="bg-bg-secondary py-8 px-6 shadow-lg rounded-2xl sm:rounded-xl sm:px-10 border border-border-light text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-text-primary mb-2">Check your email</h2>
            <p className="text-text-secondary mb-6">
              We've sent password reset instructions to <strong>{email}</strong>.
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
    <div className="min-h-screen bg-bg-primary flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-accent-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent-secondary/5 blur-[120px]" />
      </div>

      <div className="w-full max-w-[320px] sm:max-w-md mx-auto relative z-10">
        <Link to="/" className="flex justify-center items-center gap-2 mb-6">
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
        <h2 className="mt-4 text-center text-xl sm:text-3xl font-extrabold text-text-primary">
          Reset your password
        </h2>
        <p className="mt-2 text-center text-xs sm:text-sm text-text-secondary max-w-[260px] md:max-w-[280px] mx-auto leading-relaxed">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      <div className="mt-8 w-full max-w-[320px] sm:max-w-md mx-auto relative z-10">
        <div className="bg-bg-secondary py-8 px-6 shadow-lg rounded-2xl sm:rounded-xl sm:px-10 border border-border-light">
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

          <form className="space-y-6" onSubmit={handleResetPassword}>
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
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-bg-primary bg-accent-primary hover:bg-accent-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Send reset link
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <Link to="/signin" className="font-medium text-accent-primary hover:text-accent-primary/80 transition-colors">
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
