import React, { useState, useEffect } from 'react';
import { Coins, Wallet, Building2, Bot } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CgaDashboardCards: React.FC = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState('14:23:10');
  const [progress, setProgress] = useState(37.08); // 18.54 / 50.00 * 100

  // Mock timer update
  useEffect(() => {
    const timer = setInterval(() => {
      const parts = timeLeft.split(':').map(Number);
      let h = parts[0], m = parts[1], s = parts[2];
      
      s--;
      if (s < 0) { s = 59; m--; }
      if (m < 0) { m = 59; h--; }
      if (h < 0) { h = 23; } // Reset or stop
      
      const format = (n: number) => n.toString().padStart(2, '0');
      setTimeLeft(`${format(h)}:${format(m)}:${format(s)}`);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeLeft]);

  return (
    <>
      <style>{`
        .cga-dashboard-cards {
          padding: 2rem 1.5rem;
          max-width: 1280px;
          margin: 0 auto;
          width: 100%;
        }

        .cga-dashboard-grid {
          display: grid;
          gap: 0.75rem;
          grid-template-columns: repeat(2, 1fr);
        }

        @media (min-width: 1024px) {
          .cga-dashboard-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 1.5rem;
          }
        }

        .cga-dashboard-card {
          background: linear-gradient(135deg, #1a1c2e 0%, #0f101a 100%);
          border-radius: 1.25rem;
          padding: 1.5rem;
          position: relative;
          border: 1px solid rgba(255, 255, 255, 0.05);
          box-shadow: 0 12px 35px rgba(0,0,0,0.55);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 180px;
        }

        .cga-dashboard-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: 1.25rem;
          border: 1px solid rgba(66, 153, 225, 0.1);
          pointer-events: none;
        }

        .cga-dashboard-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 15px 40px rgba(0,0,0,0.65);
          border-color: rgba(66, 153, 225, 0.2);
        }

        .cga-dashboard-icon-wrapper {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
          background: rgba(255, 255, 255, 0.03);
        }

        .cga-dashboard-title {
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.875rem;
          font-weight: 500;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .cga-dashboard-value {
          color: #ffffff;
          font-size: 1.75rem;
          font-weight: 700;
          margin-bottom: 1.25rem;
          font-family: 'Inter', sans-serif;
        }

        .cga-dashboard-btn {
          width: 100%;
          padding: 0.75rem;
          border-radius: 0.75rem;
          font-weight: 600;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          position: relative;
          overflow: hidden;
        }

        .cga-dashboard-btn::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(45deg, transparent, rgba(255,255,255,0.05), transparent);
          transform: rotate(45deg);
          animation: cga-shine 3s infinite;
        }

        @keyframes cga-shine {
          0% { left: -100%; }
          100% { left: 100%; }
        }

        .cga-dashboard-btn-blue {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.2));
          color: #60a5fa;
          box-shadow: 0 0 15px rgba(37, 99, 235, 0.1);
        }

        .cga-dashboard-btn-blue:hover {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(37, 99, 235, 0.3));
          box-shadow: 0 0 20px rgba(37, 99, 235, 0.2);
          transform: translateY(-2px);
        }

        .cga-dashboard-btn-green {
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.2));
          color: #34d399;
          box-shadow: 0 0 15px rgba(5, 150, 105, 0.1);
        }

        .cga-dashboard-btn-green:hover {
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.3));
          box-shadow: 0 0 20px rgba(5, 150, 105, 0.2);
          transform: translateY(-2px);
          animation: cga-pulse 2s infinite;
        }

        @keyframes cga-pulse {
          0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
          100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }

        .cga-dashboard-roi-stats {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.5);
          margin-bottom: 0.5rem;
        }

        .cga-dashboard-progress-container {
          width: 100%;
          height: 6px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 3px;
          margin-bottom: 1rem;
          overflow: hidden;
        }

        .cga-dashboard-progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #3b82f6, #60a5fa);
          border-radius: 3px;
          transition: width 0.5s ease;
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
        }

        .cga-dashboard-roi-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: auto;
        }

        .cga-dashboard-footer-item {
          display: flex;
          flex-direction: column;
        }

        .cga-dashboard-footer-label {
          font-size: 0.65rem;
          color: rgba(255, 255, 255, 0.4);
          text-transform: uppercase;
        }

        .cga-dashboard-footer-value {
          font-size: 0.875rem;
          color: #ffffff;
          font-weight: 600;
        }

        @media (max-width: 639px) {
          .cga-dashboard-cards {
            padding: 1rem;
          }
          .cga-dashboard-card {
            padding: 1rem;
            min-height: 140px;
          }
          .cga-dashboard-value {
            font-size: 1.25rem;
            margin-bottom: 0.75rem;
          }
          .cga-dashboard-title {
            font-size: 0.75rem;
          }
          .cga-dashboard-icon-wrapper {
            width: 32px;
            height: 32px;
            margin-bottom: 0.5rem;
          }
        }
      `}</style>

      <section className="cga-dashboard-cards">
        <div className="cga-dashboard-grid">
          {/* Card 1: Total Assets */}
          <div className="cga-dashboard-card">
            <div>
              <div className="cga-dashboard-icon-wrapper">
                <Coins className="w-5 h-5 text-blue-400" />
              </div>
              <div className="cga-dashboard-title">Total Assets</div>
              <div className="cga-dashboard-value">$5,320.75</div>
            </div>
            <button 
              onClick={() => navigate('/invest')}
              className="cga-dashboard-btn cga-dashboard-btn-blue"
            >
              Start Investing
            </button>
          </div>

          {/* Card 2: Available Balance */}
          <div className="cga-dashboard-card">
            <div>
              <div className="cga-dashboard-icon-wrapper">
                <Wallet className="w-5 h-5 text-purple-400" />
              </div>
              <div className="cga-dashboard-title">Available Balance</div>
              <div className="cga-dashboard-value">$1,250.00</div>
            </div>
            {/* No button for balance as per requirements */}
          </div>

          {/* Card 3: Funding */}
          <div className="cga-dashboard-card">
            <div>
              <div className="cga-dashboard-icon-wrapper">
                <Building2 className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="cga-dashboard-title">Funding</div>
              <div className="cga-dashboard-value">$3,500.00</div>
            </div>
            <button 
              onClick={() => navigate('/deposit')}
              className="cga-dashboard-btn cga-dashboard-btn-green"
            >
              Fund Now
            </button>
          </div>

          {/* Card 4: Daily ROI Engine */}
          <div className="cga-dashboard-card">
            <div>
              <div className="cga-dashboard-icon-wrapper">
                <Bot className="w-5 h-5 text-blue-400" />
              </div>
              <div className="cga-dashboard-title">Daily ROI</div>
              <div className="cga-dashboard-roi-stats">
                <span>Earning: $18.54 / $50.00</span>
                <span>{progress}%</span>
              </div>
              <div className="cga-dashboard-progress-container">
                <div 
                  className="cga-dashboard-progress-bar" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
            <div className="cga-dashboard-roi-footer">
              <div className="cga-dashboard-footer-item">
                <span className="cga-dashboard-footer-label">Active Plans</span>
                <span className="cga-dashboard-footer-value">2</span>
              </div>
              <div className="cga-dashboard-footer-item" style={{ textAlign: 'right' }}>
                <span className="cga-dashboard-footer-label">Time Left</span>
                <span className="cga-dashboard-footer-value">{timeLeft}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CgaDashboardCards;
