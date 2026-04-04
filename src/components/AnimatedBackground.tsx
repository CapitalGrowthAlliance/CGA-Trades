import React, { useMemo } from 'react';

interface AnimatedBackgroundProps {
  primaryColor?: string; // Hex color
  className?: string;
}

/**
 * Converts a hex color to HSL
 */
const hexToHSL = (hex: string): { h: number; s: number; l: number } => {
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex.substring(1, 3), 16);
    g = parseInt(hex.substring(3, 5), 16);
    b = parseInt(hex.substring(5, 7), 16);
  }
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
};

const hslToCSS = (h: number, s: number, l: number, a: number = 1) => {
  return `hsla(${h}, ${s}%, ${l}%, ${a})`;
};

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ 
  primaryColor = '#c8ff00', 
  className = "" 
}) => {
  const colors = useMemo(() => {
    const base = hexToHSL(primaryColor);
    
    return {
      primary: hslToCSS(base.h, base.s, base.l, 1),
      dark: hslToCSS(base.h, base.s, Math.max(5, base.l - 40), 1),
      light: hslToCSS(base.h, base.s, Math.min(95, base.l + 20), 1),
      accent: hslToCSS((base.h + 180) % 360, base.s * 0.8, base.l, 1),
      deep: hslToCSS(base.h, base.s * 0.2, 2, 1),
    };
  }, [primaryColor]);

  return (
    <div 
      className={`fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-bg-primary ${className}`}
      style={{
        '--primary': colors.primary,
        '--dark': colors.dark,
        '--light': colors.light,
        '--accent': colors.accent,
        '--deep': colors.deep,
      } as React.CSSProperties}
    >
      {/* Layer 0: Forex Chart Background (Very Shallow) */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]">
        <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 1000 1000">
          {/* Grid lines */}
          <g stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" opacity="0.3">
            {[...Array(11)].map((_, i) => (
              <line key={`h-${i}`} x1="0" y1={i * 100} x2="1000" y2={i * 100} />
            ))}
            {[...Array(11)].map((_, i) => (
              <line key={`v-${i}`} x1={i * 100} y1="0" x2={i * 100} y2="1000" />
            ))}
          </g>
          
          {/* Candlesticks */}
          <g stroke="currentColor" strokeWidth="2" opacity="0.6">
            <line x1="50" y1="850" x2="50" y2="750" /><rect x="45" y="780" width="10" height="50" fill="currentColor" />
            <line x1="100" y1="820" x2="100" y2="720" /><rect x="95" y="740" width="10" height="60" fill="transparent" />
            <line x1="150" y1="800" x2="150" y2="650" /><rect x="145" y="680" width="10" height="100" fill="currentColor" />
            <line x1="200" y1="720" x2="200" y2="620" /><rect x="195" y="640" width="10" height="60" fill="transparent" />
            <line x1="250" y1="700" x2="250" y2="600" /><rect x="245" y="620" width="10" height="60" fill="transparent" />
            <line x1="300" y1="680" x2="300" y2="580" /><rect x="295" y="600" width="10" height="60" fill="currentColor" />
            <line x1="350" y1="650" x2="350" y2="500" /><rect x="345" y="520" width="10" height="110" fill="currentColor" />
            <line x1="400" y1="580" x2="400" y2="480" /><rect x="395" y="500" width="10" height="60" fill="transparent" />
            <line x1="450" y1="550" x2="450" y2="450" /><rect x="445" y="480" width="10" height="50" fill="transparent" />
            <line x1="500" y1="520" x2="500" y2="420" /><rect x="495" y="440" width="10" height="60" fill="currentColor" />
            <line x1="550" y1="500" x2="550" y2="350" /><rect x="545" y="380" width="10" height="90" fill="currentColor" />
            <line x1="600" y1="450" x2="600" y2="350" /><rect x="595" y="370" width="10" height="60" fill="transparent" />
            <line x1="650" y1="400" x2="650" y2="300" /><rect x="645" y="320" width="10" height="60" fill="transparent" />
            <line x1="700" y1="380" x2="700" y2="280" /><rect x="695" y="300" width="10" height="60" fill="currentColor" />
            <line x1="750" y1="350" x2="750" y2="200" /><rect x="745" y="220" width="10" height="110" fill="currentColor" />
            <line x1="800" y1="280" x2="800" y2="180" /><rect x="795" y="200" width="10" height="60" fill="transparent" />
            <line x1="850" y1="250" x2="850" y2="150" /><rect x="845" y="180" width="10" height="50" fill="transparent" />
            <line x1="900" y1="220" x2="900" y2="120" /><rect x="895" y="140" width="10" height="60" fill="currentColor" />
            <line x1="950" y1="200" x2="950" y2="50" /><rect x="945" y="80" width="10" height="100" fill="currentColor" />
          </g>

          {/* Moving Average Lines */}
          <path 
            d="M0 800 Q 150 750 250 650 T 450 500 T 650 350 T 850 200 T 1000 100" 
            fill="none" 
            stroke="var(--primary)" 
            strokeWidth="4" 
            opacity="0.8"
          />
          <path 
            d="M0 850 Q 150 800 250 700 T 450 550 T 650 400 T 850 250 T 1000 150" 
            fill="none" 
            stroke="var(--accent)" 
            strokeWidth="2" 
            opacity="0.5"
          />
        </svg>
      </div>

      {/* Crisp Layered Gradients (No Blur) */}
      <div className="absolute inset-0 animate-gradient-shift opacity-40 dark:opacity-20">
        <div 
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(135deg, var(--primary) 0%, transparent 50%),
              linear-gradient(225deg, var(--accent) 0%, transparent 50%),
              linear-gradient(45deg, var(--dark) 0%, transparent 50%),
              linear-gradient(315deg, var(--light) 0%, transparent 50%)
            `,
            backgroundSize: '200% 200%',
          }}
        />
      </div>

      {/* Dotted Halftone Wave Effect (Sharp) */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Layer 1: Small Dots */}
        <div 
          className="absolute inset-0 opacity-[0.1] dark:opacity-[0.15]"
          style={{
            backgroundImage: `radial-gradient(circle, var(--text-primary) 1px, transparent 1px)`,
            backgroundSize: '16px 16px',
            maskImage: 'linear-gradient(to bottom right, black, transparent, black)',
            WebkitMaskImage: 'linear-gradient(to bottom right, black, transparent, black)',
          }}
        />

        {/* Layer 2: Large Halftone-style Dots with Wave Mask */}
        <div 
          className="absolute inset-0 opacity-[0.08] dark:opacity-[0.12] animate-wave-shift"
          style={{
            backgroundImage: `radial-gradient(circle, var(--text-primary) 3px, transparent 3px)`,
            backgroundSize: '40px 40px',
            maskImage: 'url("data:image/svg+xml,%3Csvg width=\'1000\' height=\'1000\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 500 Q 250 200 500 500 T 1000 500 V 1000 H 0 Z\' fill=\'black\'/%3E%3C/svg%3E")',
            maskRepeat: 'repeat-x',
            maskSize: '100% 100%',
            WebkitMaskImage: 'url("data:image/svg+xml,%3Csvg width=\'1000\' height=\'1000\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 500 Q 250 200 500 500 T 1000 500 V 1000 H 0 Z\' fill=\'black\'/%3E%3C/svg%3E")',
            WebkitMaskRepeat: 'repeat-x',
            WebkitMaskSize: '100% 100%',
          }}
        />

        {/* Layer 3: Dynamic Sharp Wave (SVG) */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06]">
          <svg width="100%" height="100%" viewBox="0 0 1000 1000" preserveAspectRatio="none">
            <path 
              d="M0 600 Q 250 400 500 600 T 1000 600 V 1000 H 0 Z" 
              fill="currentColor" 
              className="animate-wave-path"
            />
          </svg>
        </div>
      </div>

      {/* UI Protection: Sharp Contrast Layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-bg-primary/10 via-transparent to-bg-primary/30" />
      
      {/* Subtle Grain (Sharp) */}
      <div 
        className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
};

export default AnimatedBackground;
