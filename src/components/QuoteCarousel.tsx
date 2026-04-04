import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Quote {
  text: string;
  author: string;
}

const quotes: Quote[] = [
  { text: "Know what you own, and know why you own it.", author: "Peter Lynch" },
  { text: "Investing should be more like watching paint dry or watching grass grow. If you want excitement, take $800 and go to Las Vegas.", author: "Paul Samuelson" },
  { text: "Do not save what is left after spending, but spend what is left after investing.", author: "Warren Buffett" },
  { text: "Too many people spend money they haven’t earned, to buy things they don’t want, to impress people they don’t like.", author: "Will Rogers" },
  { text: "Money is a terrible master but an excellent servant.", author: "P.T. Barnum" },
  { text: "The lack of money is the root of all evil.", author: "Mark Twain" },
  { text: "Risk comes from not knowing what you’re doing.", author: "Warren Buffett" },
  { text: "Don’t tell me where your priorities are. Show me where you spend your money, and I’ll tell you what they are.", author: "James W. Frick" },
  { text: "Wealth consists not in having great possessions, but in having few wants.", author: "Epictetus" },
  { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { text: "When it is a question of money, everybody is of the same religion.", author: "Voltaire" },
  { text: "A wise person should have money in their head, but not in their heart.", author: "Jonathan Swift" },
  { text: "The real measure of your wealth is how much you’d be worth if you lost all your money.", author: "Unknown" },
  { text: "The best investment you can make is in yourself.", author: "Warren Buffett" },
  { text: "The stock market is filled with individuals who know the price of everything, but the value of nothing.", author: "Philip Fisher" },
  { text: "Price is what you pay. Value is what you get.", author: "Warren Buffett" },
  { text: "Successful investing is about managing risk, not avoiding it.", author: "Benjamin Graham" },
];

export default function QuoteCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % quotes.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(nextSlide, 4000); // 4 seconds total cycle
    return () => clearInterval(timer);
  }, [nextSlide, isPaused]);

  return (
    <div 
      className="w-full bg-white dark:bg-accent-primary py-1.5 px-4 overflow-hidden border-b border-gray-100 dark:border-accent-primary/20 flex items-center justify-center h-10 sm:h-12"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl w-full h-full flex items-center justify-center relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            className="flex flex-row items-center justify-center gap-2 sm:gap-4 w-full text-center"
          >
            {/* Quote Section */}
            <motion.p
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 10, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="text-[10px] sm:text-sm text-[#000000] font-medium truncate sm:whitespace-normal"
            >
              "{quotes[currentIndex].text}"
            </motion.p>

            {/* Author Section */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ 
                duration: 0.5, 
                ease: "easeInOut",
                delay: 0.2 
              }}
              className="shrink-0"
            >
              <span className="text-[10px] sm:text-sm italic text-[#a3a3a3] whitespace-nowrap">
                — {quotes[currentIndex].author}
              </span>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
