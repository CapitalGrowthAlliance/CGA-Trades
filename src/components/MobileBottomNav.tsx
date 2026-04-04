import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Wallet, User, Brain, BarChart3, LayoutDashboard, Settings, LogOut, ChevronUp, Bot, MessageCircleQuestion } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function MobileBottomNav() {
  const location = useLocation();
  const path = location.pathname;

  if (path === '/' || path === '/admin-login' || path === '/investment/pending') {
    return null;
  }

  const navItems = [
    { id: 'home', label: 'Home', icon: Home, path: '/home' },
    { id: 'fund', label: 'Fund', icon: Wallet, path: '/fund' },
    { id: 'invest', label: 'Invest', icon: Bot, path: '/invest' },
    { id: 'support', label: 'Support', icon: MessageCircleQuestion, path: '/support', onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
  ];

  return (
    <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-md z-[100] pb-[env(safe-area-inset-bottom)]">
      <div className="bg-white dark:bg-[#121212] shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_0_20px_rgba(200,255,0,0.15)] border border-gray-100 dark:border-[#2a2a2a] rounded-[2rem] px-2 py-2 flex items-center justify-between backdrop-blur-lg bg-white/90 dark:bg-[#121212]/90">
        {navItems.map((item) => {
          const isActive = path === item.path || (item.path !== '/' && path.startsWith(item.path));
          const Icon = item.icon;
          const isInvest = item.id === 'invest';

          return (
            <Link
              key={item.id}
              to={item.path}
              onClick={item.onClick}
              className={`relative flex flex-col items-center justify-center w-16 h-14 rounded-full transition-transform active:scale-90 ${isInvest ? 'z-10' : ''}`}
            >
              {isInvest && (
                <motion.div
                  className="absolute inset-0 bg-accent-primary/20 dark:bg-accent-primary/10 rounded-full blur-md"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              )}
              
              <div className="relative flex flex-col items-center justify-center">
                <motion.div
                  animate={{ 
                    scale: isInvest ? (isActive ? 1.3 : 1.2) : (isActive ? 1.1 : 1),
                    color: isInvest ? '#c8ff00' : (isActive ? '#ff4000' : 'currentColor'),
                    filter: isInvest ? 'drop-shadow(0 0 8px rgba(200,255,0,0.6))' : 'none'
                  }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 400, 
                    damping: 25,
                    scale: isInvest ? {
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse"
                    } : undefined
                  }}
                  className={isInvest ? "text-[#c8ff00]" : (isActive ? "text-[#ff4000]" : "text-gray-500 dark:text-gray-400")}
                >
                  <Icon className={isInvest ? "w-7 h-7" : "w-6 h-6"} strokeWidth={isActive || isInvest ? 2.5 : 2} />
                </motion.div>
              </div>
              
              <span 
                className={`text-[10px] mt-1 font-medium transition-colors duration-300 ${
                  isInvest ? 'text-[#c8ff00]' : (isActive ? 'text-[#ff4000]' : 'text-gray-500 dark:text-gray-400')
                }`}
              >
                {item.label}
              </span>
              
              {isActive && !isInvest && (
                <motion.div 
                  layoutId="bottomNavIndicator"
                  className="absolute -bottom-1 w-1 h-1 bg-[#ff4000] rounded-full"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}

              {isInvest && isActive && (
                <motion.div 
                  layoutId="bottomNavIndicator"
                  className="absolute -bottom-1 w-1 h-1 bg-[#c8ff00] rounded-full shadow-[0_0_5px_#c8ff00]"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </Link>
          );
        })}

        <Link
          to="/dashboard"
          className={`relative flex flex-col items-center justify-center w-16 h-14 rounded-full transition-transform active:scale-90 ${path === '/dashboard' ? 'text-[#ff4000]' : 'text-gray-500 dark:text-gray-400'}`}
        >
          <div className="relative flex flex-col items-center justify-center">
            <motion.div
              animate={{ 
                scale: path === '/dashboard' ? 1.1 : 1,
                color: path === '/dashboard' ? '#ff4000' : 'currentColor'
              }}
            >
              <User className="w-6 h-6" strokeWidth={path === '/dashboard' ? 2.5 : 2} />
            </motion.div>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#ff4000] rounded-full border-2 border-white dark:border-[#121212]"></span>
          </div>
          <span className={`text-[10px] mt-1 font-medium ${path === '/dashboard' ? 'text-[#ff4000]' : 'text-gray-500 dark:text-gray-400'}`}>You</span>
        </Link>
      </div>
    </div>
  );
}
