import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, TrendingUp, User, LayoutDashboard, Settings, LogOut, ChevronRight, Globe, Package, Briefcase, Award, Zap, Brain, BarChart3, History, Wallet, MessageCircleQuestion, LogIn, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { auth } from '../firebase';
import ThemeToggle from './ThemeToggle';

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const publicMenuItems = [
    { label: 'Markets', icon: BarChart3, path: '/markets' },
    { label: 'AI Insights', icon: Brain, path: '/ai-insights' },
    { label: 'Top Investors', icon: Award, path: '/top-investors' },
    { label: 'How CGA works', icon: Zap, path: '/how-it-works' },
    { label: 'CGA Token', icon: TrendingUp, path: '/cga-token' },
    { label: 'Gift Cards', icon: Package, path: '/gift-cards' },
    { label: 'Our Partners', icon: Briefcase, path: '/our-partners' },
    { label: 'Invest', icon: TrendingUp, path: '/invest' },
    { label: 'Support', icon: MessageCircleQuestion, path: '/support' },
  ];

  const authMenuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'Plan History', icon: History, path: '/plan-history' },
    { label: 'Fund', icon: Wallet, path: '/fund' },
    { label: 'Profile', icon: User, path: '/profile' },
    { label: 'Settings', icon: Settings, path: '/settings' },
  ];

  const menuItems = user ? [...authMenuItems, ...publicMenuItems] : publicMenuItems;

  return (
    <div className="relative md:hidden" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-accent-primary flex items-center justify-center text-slate-900 hover:opacity-90 transition-opacity focus:outline-none"
      >
        {isOpen ? <X className="w-5 h-5 md:w-6 md:h-6" /> : <Menu className="w-5 h-5 md:w-6 md:h-6" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 mt-2 w-56 rounded-xl bg-bg-secondary border border-border-color shadow-2xl py-1 z-[100] backdrop-blur-xl max-h-[60vh] overflow-y-auto"
          >
            <div className="p-2 border-b border-border-light flex items-center justify-between">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Appearance</span>
              <ThemeToggle compact />
            </div>
            {!user && (
              <div className="p-2 border-b border-border-light flex flex-col gap-2">
                <Link
                  to="/signin"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-text-primary bg-bg-hover transition-colors"
                >
                  <LogIn className="w-4 h-4" /> Sign In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-bg-primary bg-accent-primary hover:bg-accent-primary/90 transition-colors"
                >
                  <UserPlus className="w-4 h-4" /> Sign Up
                </Link>
              </div>
            )}
            {menuItems.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                onClick={() => {
                  setIsOpen(false);
                  if (item.path === '/support') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                className="flex items-center gap-2.5 px-3 py-2 text-xs text-text-secondary hover:bg-black/5 dark:hover:bg-white/5 hover:text-text-primary transition-colors border-b border-border-light last:border-0"
              >
                <item.icon className="w-3.5 h-3.5" />
                {item.label}
              </Link>
            ))}
            {user && (
              <button
                onClick={async () => {
                  setIsOpen(false);
                  await auth.signOut();
                  navigate('/signin');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-500 hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                Logout
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
