import React, { useState, useEffect } from 'react';

const quotes = [
  "If you don't find a way to make money while you sleep, you will work until you die.",
  "Build assets today so your future pays you back tomorrow."
];

export default function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % quotes.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isHovered]);

  return (
    <div 
      className="w-full bg-bg-card rounded-xl p-3 overflow-hidden relative shadow-sm border border-border-light transition-all hover:bg-bg-hover"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-center h-8">
        <p key={currentIndex} className="text-text-secondary text-center font-medium text-xs md:text-sm italic tracking-wide">
          "{quotes[currentIndex]}"
        </p>
      </div>
    </div>
  );
}
