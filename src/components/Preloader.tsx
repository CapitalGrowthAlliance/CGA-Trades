import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleLoad = () => {
      setIsLoading(false);
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden pointer-events-auto"
        >
          <div className="relative flex items-center justify-center">
            {/* Static Center Image */}
            <div className="relative z-10 w-24 h-24 md:w-32 md:h-32 flex items-center justify-center">
              <img 
                src="https://i.imgur.com/jt4vAVS.png" 
                alt="Logo" 
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Outer Arc - Rotating Clockwise */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
              className="absolute w-40 h-40 md:w-56 md:h-56 border-t-[1.5px] border-accent-primary/80 rounded-full shadow-[0_-2px_10px_rgba(200,255,0,0.2)]"
              style={{ borderRight: '1.5px solid transparent', borderBottom: '1.5px solid transparent', borderLeft: '1.5px solid transparent' }}
            />

            {/* Inner Arc - Rotating Counter-Clockwise */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="absolute w-32 h-32 md:w-44 md:h-44 border-b-[1.5px] border-accent-primary/60 rounded-full shadow-[0_2px_10px_rgba(200,255,0,0.15)]"
              style={{ borderTop: '1.5px solid transparent', borderRight: '1.5px solid transparent', borderLeft: '1.5px solid transparent' }}
            />
            
            {/* Subtle Glow Pulse */}
            <motion.div
              animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute w-64 h-64 bg-accent-primary/10 rounded-full blur-3xl"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
