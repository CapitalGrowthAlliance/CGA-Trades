import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import LanguageSelector from '../components/LanguageSelector';
import NotificationDropdown from '../components/NotificationDropdown';
import MobileMenu from '../components/MobileMenu';
import { Search, User, LayoutDashboard, Settings, LogOut, ChevronDown, LogIn, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import QuoteCarousel from '../components/QuoteCarousel';
import MarketTicker from '../components/MarketTicker';
import { useAuth } from '../context/AuthContext';
import { auth } from '../firebase';
import Footer from '../components/Footer';

import { useSite } from '../context/SiteContext';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const exploreRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user: authUser, userData } = useAuth();
  const { settings } = useSite();

  // Use real user data or fallback
  const user = userData || { fullName: 'User', profilePicture: null };
  const isAuthenticated = !!authUser;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (
        exploreRef.current && !exploreRef.current.contains(event.target as Node) &&
        dropdownRef.current && !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsExploreOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen text-text-primary flex flex-col">
      <div className="sticky top-0 z-[200] w-full bg-bg-primary/80 backdrop-blur-md dark:bg-black/90">
        <header className="h-16 md:h-20 border-b border-border-light flex items-center px-3 md:px-6 lg:px-12 shrink-0">
          {/* Mobile Header Layout */}
          <div className="flex md:hidden items-center justify-between w-full gap-2">
            <div className="flex items-center gap-2">
              <MobileMenu />
              <Link to="/" className="shrink-0">
                <img 
                  src={settings?.logoUrl || "https://i.imgur.com/jt4vAVS.png"} 
                  alt={settings?.siteName || "CGA Logo"} 
                  className="h-5 w-auto object-contain brightness-0 invert" 
                  referrerPolicy="no-referrer" 
                />
              </Link>
            </div>

            {/* Mobile Search Bar */}
            <div className="relative flex-1 max-w-[140px]">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full bg-[#1E2329] border-none rounded-full py-1.5 pl-8 pr-3 text-[11px] text-white placeholder:text-text-muted focus:ring-1 focus:ring-accent-primary transition-all"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <ThemeToggle compact />
              <LanguageSelector compact />
              {isAuthenticated && <NotificationDropdown />}
              
              {isAuthenticated ? (
                <Link to="/dashboard" className="w-8 h-8 rounded-full bg-accent-primary flex items-center justify-center text-slate-900 text-xs font-bold overflow-hidden shrink-0 border-2 border-transparent hover:border-accent-primary/50 transition-all">
                  {user?.profilePicture ? (
                    <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <span>{user?.fullName?.charAt(0) || 'U'}</span>
                  )}
                </Link>
              ) : (
                <Link to="/signin" className="w-8 h-8 rounded-full bg-accent-primary flex items-center justify-center text-slate-900 text-xs font-bold shrink-0">
                  <User className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>

          {/* Desktop Header Layout */}
          <div className="hidden md:flex items-center justify-between w-full">
            <div className="flex items-center gap-2 shrink-0">
              <Link to="/" className="flex items-center gap-2 shrink-0">
                <img src={settings?.logoUrl || "https://i.imgur.com/jt4vAVS.png"} alt={settings?.siteName || "CGA Logo"} className="h-6 w-auto shrink-0 object-contain" referrerPolicy="no-referrer" />
              </Link>
            </div>

            <nav className="flex items-center gap-8">
              <Link 
                to="/invest" 
                className={`relative font-medium transition-colors duration-300 after:content-[''] after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:bg-accent-primary after:transition-all after:duration-300 ${location.pathname === '/invest' ? 'text-accent-primary after:w-full' : 'text-text-primary hover:text-accent-primary after:w-0 hover:after:w-full'}`}
              >
                Invest
              </Link>
              
              <div 
                className="relative" 
                ref={exploreRef}
                onMouseEnter={() => setIsExploreOpen(true)}
                onMouseLeave={() => setIsExploreOpen(false)}
              >
                <button 
                  className={`flex items-center gap-1 font-medium transition-colors duration-300 relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:bg-accent-primary after:transition-all after:duration-300 ${isExploreOpen || ['/markets', '/ai-insights', '/how-it-works', '/cga-token', '/gift-cards', '/our-partners', '/top-investors'].includes(location.pathname) ? 'text-accent-primary after:w-full' : 'text-text-primary hover:text-accent-primary after:w-0 hover:after:w-full'}`}
                >
                  Explore
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isExploreOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Floating Explore Dropdown */}
                <AnimatePresence>
                  {isExploreOpen && (
                    <motion.div
                      ref={dropdownRef}
                      key="explore-dropdown"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="fixed top-20 left-0 w-full bg-white/95 backdrop-blur-xl border-b border-gray-200/50 shadow-lg z-[100]"
                    >
                      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-center gap-8 overflow-x-auto whitespace-nowrap no-scrollbar">
                        {[
                          { name: 'Markets', path: '/markets' },
                          { name: 'AI Insights', path: '/ai-insights' },
                          { name: 'How CGA Works', path: '/how-it-works' },
                          { name: 'CGA Token', path: '/cga-token' },
                          { name: 'Gift Cards', path: '/gift-cards' },
                          { name: 'Our Partners', path: '/our-partners' },
                          { name: 'Top Investors', path: '/top-investors' },
                        ].map((item) => (
                          <Link
                            key={item.name}
                            to={item.path}
                            onClick={() => setIsExploreOpen(false)}
                            className="font-semibold text-slate-900 hover:text-accent-primary transition-colors duration-300 px-2 py-1 hover:scale-[1.02] transform inline-block"
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link 
                to="/support" 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
                className={`relative font-medium transition-colors duration-300 after:content-[''] after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:bg-accent-primary after:transition-all after:duration-300 ${location.pathname === '/support' ? 'text-accent-primary after:w-full' : 'text-text-primary hover:text-accent-primary after:w-0 hover:after:w-full'}`}
              >
                Support
              </Link>
              <Link 
                to="/investment-guide" 
                className={`relative font-medium transition-colors duration-300 after:content-[''] after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:bg-accent-primary after:transition-all after:duration-300 ${location.pathname === '/investment-guide' ? 'text-accent-primary after:w-full' : 'text-text-primary hover:text-accent-primary after:w-0 hover:after:w-full'}`}
              >
                Guide
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              <ThemeToggle />
              <LanguageSelector />
              {isAuthenticated && <NotificationDropdown />}
              
              {isAuthenticated ? (
                <div className="relative" ref={profileRef}>
                  <div 
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 cursor-pointer group p-1 rounded-full hover:bg-bg-hover transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-accent-primary flex items-center justify-center text-slate-900 text-base font-bold hover:opacity-90 transition-opacity overflow-hidden">
                      {user?.profilePicture ? (
                        <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <span>{user?.fullName?.charAt(0) || 'U'}</span>
                      )}
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
                        <div className="px-4 py-3 border-b border-border-light">
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
                          <button
                            onClick={async () => {
                              setIsProfileOpen(false);
                              await auth.signOut();
                              navigate('/signin');
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors"
                          >
                            <LogOut className="w-4 h-4" /> Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link to="/signin" className="text-sm font-medium text-text-primary hover:text-accent-primary transition-colors px-3 py-2 rounded-lg hover:bg-bg-hover">
                    Sign In
                  </Link>
                  <Link to="/signup" className="text-sm font-medium text-bg-primary bg-accent-primary hover:bg-accent-primary/90 transition-colors px-4 py-2 rounded-lg shadow-sm">
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </header>
        {location.pathname === '/invest' && <QuoteCarousel />}
        {location.pathname === '/' && <MarketTicker />}
      </div>
      <main className="flex-1 flex flex-col overflow-x-hidden">
        {children}
      </main>
      <Footer />
    </div>
  );
}
