import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import LanguageSelector from '../components/LanguageSelector';
import NotificationDropdown from '../components/NotificationDropdown';
import MobileMenu from '../components/MobileMenu';
import { Settings, User, LayoutDashboard, ChevronDown, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { auth } from '../firebase';
import { useSite } from '../context/SiteContext';

import Footer from '../components/Footer';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const { userData } = useAuth();
  const { settings } = useSite();

  // Use real user data or fallback
  const user = userData || { fullName: 'User', profilePicture: null };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen text-text-primary flex flex-col">
      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen">
        <header className="sticky top-0 z-50 flex h-20 bg-bg-secondary/80 backdrop-blur-md border-b border-border-light items-center justify-between px-4 md:px-8 shrink-0">
          <div className="flex items-center gap-2 md:gap-8">
            <MobileMenu />
            <Link to="/home" className="shrink-0">
              <img src={settings?.logoUrl || "https://i.imgur.com/jt4vAVS.png"} alt={settings?.siteName || "CGA Logo"} className="h-5 md:h-6 w-auto shrink-0 object-contain" referrerPolicy="no-referrer" />
            </Link>
            
            <nav className="hidden lg:flex items-center gap-6">
              <Link to="/dashboard" className={`text-sm font-medium transition-colors ${location.pathname === '/dashboard' ? 'text-accent-primary' : 'text-text-secondary hover:text-text-primary'}`}>Dashboard</Link>
              <Link to="/markets" className={`text-sm font-medium transition-colors ${location.pathname === '/markets' ? 'text-accent-primary' : 'text-text-secondary hover:text-text-primary'}`}>Markets</Link>
              <Link to="/ai-insights" className={`text-sm font-medium transition-colors ${location.pathname === '/ai-insights' ? 'text-accent-primary' : 'text-text-secondary hover:text-text-primary'}`}>AI Insights</Link>
              <Link to="/our-partners" className={`text-sm font-medium transition-colors ${location.pathname === '/our-partners' ? 'text-accent-primary' : 'text-text-secondary hover:text-text-primary'}`}>Our Partners</Link>
              <Link to="/invest" className={`text-sm font-medium transition-colors ${location.pathname.startsWith('/invest') ? 'text-accent-primary' : 'text-text-secondary hover:text-text-primary'}`}>Invest</Link>
              <Link to="/fund" className={`text-sm font-medium transition-colors ${location.pathname.startsWith('/fund') ? 'text-accent-primary' : 'text-text-secondary hover:text-text-primary'}`}>Fund</Link>
              <Link to="/support" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className={`text-sm font-medium transition-colors ${location.pathname.startsWith('/support') ? 'text-accent-primary' : 'text-text-secondary hover:text-text-primary'}`}>Support</Link>
            </nav>
          </div>

          <div className="flex items-center gap-2 md:gap-6">
            <div className="hidden sm:flex items-center gap-2 md:gap-6">
              <ThemeToggle />
              <NotificationDropdown />
              <LanguageSelector />
            </div>
            
            <div className="relative" ref={profileRef}>
              <div 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 md:gap-3 cursor-pointer group p-1.5 rounded-xl hover:bg-bg-hover transition-colors"
              >
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-accent-primary/10 flex items-center justify-center text-accent-primary font-bold group-hover:ring-2 ring-accent-primary/50 transition-all overflow-hidden shrink-0">
                  {user?.profilePicture ? (
                    <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    user?.fullName?.charAt(0) || 'U'
                  )}
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-semibold group-hover:text-accent-primary transition-colors">{user?.fullName || 'User'}</p>
                  <p className="text-xs text-text-secondary">Investor</p>
                </div>
                <ChevronDown className={`w-4 h-4 text-text-secondary transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
              </div>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-56 bg-bg-secondary border border-border-light rounded-2xl shadow-2xl py-2 z-[100] backdrop-blur-xl"
                  >
                    <div className="px-4 py-3 border-b border-border-light md:hidden">
                      <p className="text-sm font-semibold">{user?.fullName || 'User'}</p>
                      <p className="text-xs text-text-secondary">Investor</p>
                    </div>
                    
                    <div className="p-2 space-y-1">
                      <Link 
                        to="/dashboard" 
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-text-secondary hover:bg-bg-hover hover:text-text-primary transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4" /> Dashboard
                      </Link>
                      <Link 
                        to="/settings" 
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-text-secondary hover:bg-bg-hover hover:text-text-primary transition-colors"
                      >
                        <Settings className="w-4 h-4" /> Settings
                      </Link>
                      <Link 
                        to="/profile" 
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-text-secondary hover:bg-bg-hover hover:text-text-primary transition-colors"
                      >
                        <User className="w-4 h-4" /> My Profile
                      </Link>
                    </div>

                    <div className="p-2 border-t border-border-light sm:hidden flex items-center justify-around">
                      <ThemeToggle />
                      <NotificationDropdown />
                      <LanguageSelector />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>
        <div className="flex-1 bg-transparent">
          {children}
        </div>
        <Footer />
      </main>
    </div>
  );
}
