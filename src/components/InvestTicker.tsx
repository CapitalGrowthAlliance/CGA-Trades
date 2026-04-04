import React from 'react';
import { motion } from 'motion/react';

export default function InvestTicker() {
  return (
    <div className="w-full bg-accent-primary/10 border-b border-border-light py-3 overflow-hidden whitespace-nowrap flex items-center">
      <motion.div 
        className="flex items-center gap-12 pr-12"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ 
          duration: 120, 
          repeat: Infinity, 
          ease: "linear" 
        }}
      >
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex items-center gap-6">
            <motion.span 
              className="uppercase tracking-[0.2em] font-bold text-sm md:text-base"
              animate={{ 
                color: [
                  "#c8ff00", // accent-primary (lime)
                  "#00d2ff", // blue
                  "#9d50bb", // purple
                  "#ff3366", // pink/red
                  "#c8ff00"  // back to lime
                ]
              }}
              transition={{ 
                duration: 8, 
                repeat: Infinity, 
                ease: "linear" 
              }}
            >
              AI- and robotics-powered investment.
            </motion.span>
            <span className="text-accent-primary font-bold text-xl">*</span>
            <span className="text-text-secondary lowercase font-medium tracking-normal text-sm md:text-base">
              Select from our strategically designed investment plans tailored to match your financial goals.
            </span>
            <span className="text-accent-primary font-bold text-xl">*</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
