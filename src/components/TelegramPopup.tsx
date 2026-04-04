import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

export default function TelegramPopup() {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    const isHomepage = location.pathname === '/' || location.pathname === '/home';
    
    if (!isHomepage) {
      setIsVisible(false);
      return;
    }

    const handleScroll = () => {
      if (window.scrollY > 100 && !hasShown) {
        setIsVisible(true);
        setHasShown(true);
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
          setIsVisible(false);
        }, 5000);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname, hasShown]);

  // Reset hasShown when navigating back to home if we want it to show again, 
  // but user said "once per scroll trigger". I'll keep it simple for now.
  useEffect(() => {
    const isHomepage = location.pathname === '/' || location.pathname === '/home';
    if (!isHomepage) {
      setHasShown(false);
    }
  }, [location.pathname]);

  if (location.pathname !== '/' && location.pathname !== '/home') return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -100, opacity: 0 }}
          className="fixed bottom-[calc(env(safe-area-inset-bottom)+110px)] lg:bottom-6 left-6 z-[60] flex items-center gap-3"
        >
          <a
            href="https://t.me/+L7-YdHtkM09iZWNk"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-bg-secondary border border-border-light rounded-full p-1 sm:pr-4 shadow-lg hover:scale-105 transition-transform group"
          >
            <div className="w-12 h-12 bg-[#0088cc] rounded-full flex items-center justify-center shadow-md shadow-[#0088cc]/20">
              <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.888-.662 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-text-primary font-bold text-xs leading-tight">Stay updated</span>
              <span className="text-text-secondary text-[10px] leading-tight">Official Channel</span>
            </div>
          </a>
          <button
            onClick={() => setIsVisible(false)}
            className="w-6 h-6 rounded-full bg-bg-card border border-border-light flex items-center justify-center text-text-muted hover:text-text-primary transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
