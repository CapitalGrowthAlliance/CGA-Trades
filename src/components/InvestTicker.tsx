import React from 'react';

export default function InvestTicker() {
  return (
    <div className="w-full bg-accent-primary/10 border-b border-border-light py-3 overflow-hidden whitespace-nowrap flex items-center">
      <div className="flex items-center gap-12 pr-12">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center gap-6">
            <span className="uppercase tracking-[0.2em] font-bold text-sm md:text-base text-accent-primary">
              AI- and robotics-powered investment.
            </span>
            <span className="text-accent-primary font-bold text-xl">*</span>
            <span className="text-text-secondary lowercase font-medium tracking-normal text-sm md:text-base">
              Select from our strategically designed investment plans tailored to match your financial goals.
            </span>
            <span className="text-accent-primary font-bold text-xl">*</span>
          </div>
        ))}
      </div>
    </div>
  );
}
