import React, { useState, useEffect } from 'react';
import { Coins, Wallet, Building2, Bot } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CgaDashboardCards: React.FC = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState('14:23:10');
  const [progress] = useState(37.08); // 18.54 / 50.00 * 100

  // Mock timer update
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const parts = prev.split(':').map(Number);
        let h = parts[0], m = parts[1], s = parts[2];
        
        s--;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) { h = 23; } // Reset or stop
        
        const format = (n: number) => n.toString().padStart(2, '0');
        return `${format(h)}:${format(m)}:${format(s)}`;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-8 px-4 sm:px-6 max-w-7xl mx-auto w-full">
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {/* Card 1: Total Assets */}
        <div className="bg-bg-card rounded-[1.25rem] p-4 sm:p-6 relative border border-border-light shadow-light transition-all duration-300 overflow-hidden flex flex-col justify-between min-h-[140px] sm:min-h-[180px] hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(0,0,0,0.65)] hover:border-blue-500/20 group">
          <div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-[10px] flex items-center justify-center mb-2 sm:mb-4 bg-white/3">
              <Coins className="w-5 h-5 text-blue-400" />
            </div>
            <div className="text-text-secondary text-[0.75rem] sm:text-sm font-medium mb-1 sm:mb-2 uppercase tracking-wider">Total Assets</div>
            <div className="text-text-primary text-xl sm:text-[1.75rem] font-bold mb-3 sm:mb-5 font-sans">$5,320.75</div>
          </div>
          <button 
            onClick={() => navigate('/invest')}
            className="w-full p-3 rounded-xl font-semibold text-sm cursor-pointer transition-all duration-300 flex items-center justify-center no-underline backdrop-blur-md border border-white/10 relative overflow-hidden bg-gradient-to-br from-blue-500/10 to-blue-600/20 text-blue-400 shadow-[0_0_15px_rgba(37,99,235,0.1)] hover:from-blue-500/20 hover:to-blue-600/30 hover:shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:-translate-y-0.5"
          >
            <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-to-r from-transparent via-white/5 to-transparent rotate-[45deg] animate-cga-shine pointer-events-none" />
            Start Investing
          </button>
        </div>

        {/* Card 2: Available Balance */}
        <div className="bg-bg-card rounded-[1.25rem] p-4 sm:p-6 relative border border-border-light shadow-light transition-all duration-300 overflow-hidden flex flex-col justify-between min-h-[140px] sm:min-h-[180px] hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(0,0,0,0.65)] hover:border-purple-500/20 group">
          <div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-[10px] flex items-center justify-center mb-2 sm:mb-4 bg-white/3">
              <Wallet className="w-5 h-5 text-purple-400" />
            </div>
            <div className="text-text-secondary text-[0.75rem] sm:text-sm font-medium mb-1 sm:mb-2 uppercase tracking-wider">Available Balance</div>
            <div className="text-text-primary text-xl sm:text-[1.75rem] font-bold mb-3 sm:mb-5 font-sans">$1,250.00</div>
          </div>
        </div>

        {/* Card 3: Funding */}
        <div className="bg-bg-card rounded-[1.25rem] p-4 sm:p-6 relative border border-border-light shadow-light transition-all duration-300 overflow-hidden flex flex-col justify-between min-h-[140px] sm:min-h-[180px] hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(0,0,0,0.65)] hover:border-emerald-500/20 group">
          <div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-[10px] flex items-center justify-center mb-2 sm:mb-4 bg-white/3">
              <Building2 className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="text-text-secondary text-[0.75rem] sm:text-sm font-medium mb-1 sm:mb-2 uppercase tracking-wider">Funding</div>
            <div className="text-text-primary text-xl sm:text-[1.75rem] font-bold mb-3 sm:mb-5 font-sans">$3,500.00</div>
          </div>
          <button 
            onClick={() => navigate('/deposit')}
            className="w-full p-3 rounded-xl font-semibold text-sm cursor-pointer transition-all duration-300 flex items-center justify-center no-underline backdrop-blur-md border border-white/10 relative overflow-hidden bg-gradient-to-br from-emerald-500/10 to-emerald-600/20 text-emerald-400 shadow-[0_0_15px_rgba(5,150,105,0.1)] hover:from-emerald-500/20 hover:to-emerald-600/30 hover:shadow-[0_0_20px_rgba(5,150,105,0.2)] hover:-translate-y-0.5 hover:animate-pulse"
          >
            <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-to-r from-transparent via-white/5 to-transparent rotate-[45deg] animate-cga-shine pointer-events-none" />
            Fund Now
          </button>
        </div>

        {/* Card 4: Daily ROI Engine */}
        <div className="bg-bg-card rounded-[1.25rem] p-4 sm:p-6 relative border border-border-light shadow-light transition-all duration-300 overflow-hidden flex flex-col justify-between min-h-[140px] sm:min-h-[180px] hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(0,0,0,0.65)] hover:border-blue-500/20 group">
          <div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-[10px] flex items-center justify-center mb-2 sm:mb-4 bg-white/3">
              <Bot className="w-5 h-5 text-blue-400" />
            </div>
            <div className="text-text-secondary text-[0.75rem] sm:text-sm font-medium mb-1 sm:mb-2 uppercase tracking-wider">Daily ROI</div>
            <div className="flex justify-between text-[0.75rem] text-text-muted mb-2">
              <span>Earning: $18.54 / $50.00</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full h-[6px] bg-bg-hover rounded-full mb-4 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
          <div className="flex justify-between items-center mt-auto">
            <div className="flex flex-col">
              <span className="text-[0.65rem] text-text-muted uppercase">Active Plans</span>
              <span className="text-sm text-text-primary font-semibold">2</span>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-[0.65rem] text-text-muted uppercase">Time Left</span>
              <span className="text-sm text-text-primary font-semibold">{timeLeft}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CgaDashboardCards;
