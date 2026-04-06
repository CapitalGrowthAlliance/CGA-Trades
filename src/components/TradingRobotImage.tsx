import React from 'react';
import { motion } from 'motion/react';
import { Bot } from 'lucide-react';

export default function TradingRobotImage({ 
  className = "w-24 h-24 md:w-32 md:h-32",
  src = "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800"
}: { 
  className?: string;
  src?: string;
}) {
  const isVideo = src?.endsWith('.mp4') || src?.endsWith('.webm');

  return (
    <div className={`relative rounded-xl overflow-hidden border-2 border-accent-primary/50 shadow-[0_0_15px_rgba(200,255,0,0.3)] bg-bg-secondary ${className}`}>
      {isVideo ? (
        <video 
          src={src} 
          autoPlay 
          loop 
          muted 
          playsInline
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            e.currentTarget.parentElement?.classList.add('flex', 'items-center', 'justify-center');
          }}
        />
      ) : (
        <img 
          src={src} 
          alt="AI Trading Robot" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            e.currentTarget.parentElement?.classList.add('flex', 'items-center', 'justify-center');
          }}
        />
      )}
      {/* Fallback icon if image fails */}
      <Bot className="w-1/2 h-1/2 text-accent-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10" />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none z-20"></div>
    </div>
  );
}
