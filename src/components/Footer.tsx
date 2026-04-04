import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, Clock, Bitcoin, CreditCard, ArrowRight } from 'lucide-react';
import LegalModal from './LegalModal';
import { useSite } from '../context/SiteContext';

export default function Footer() {
  const { settings } = useSite();
  const [legalModalConfig, setLegalModalConfig] = useState<{ isOpen: boolean; type: 'terms' | 'privacy' }>({
    isOpen: false,
    type: 'terms'
  });

  const openLegalModal = (type: 'terms' | 'privacy') => {
    setLegalModalConfig({ isOpen: true, type });
  };

  return (
    <footer className="bg-black text-[#F0F4FF] py-12 pb-28 lg:py-16 shrink-0 font-sans">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-12">
          
          {/* A. Tagline & Social Media */}
          <div className="space-y-6">
            <div>
              <Link to="/home" className="inline-block mb-4">
                {settings?.logoUrl ? (
                  <img src={settings.logoUrl} alt={settings.siteName || "Logo"} className="h-8 w-auto object-contain brightness-0 invert" referrerPolicy="no-referrer" />
                ) : (
                  <span className="text-2xl font-bold text-white">CGA</span>
                )}
              </Link>
              <p className="text-[#F0F4FF]/80 text-sm leading-relaxed">
                Invest with Confidence. Grow with Success.
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <a href="https://web.facebook.com/profile.php?id=61577499478415" aria-label="Facebook" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent-primary hover:text-[#0B1D3A] transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="https://www.tiktok.com/@capitalgrowthalliance?is_from_webapp=1&sender_device=pc" aria-label="TikTok" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent-primary hover:text-[#0B1D3A] transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
              <a href="https://t.me/cgatrades" aria-label="Telegram" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent-primary hover:text-[#0B1D3A] transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* B. About Us */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">About Us</h3>
            <ul className="space-y-3">
              <li><Link to="/about" onClick={() => window.scrollTo(0,0)} className="text-[#F0F4FF]/70 hover:text-accent-primary text-sm transition-colors">Company Overview</Link></li>
              <li><Link to="/team" onClick={() => window.scrollTo(0,0)} className="text-[#F0F4FF]/70 hover:text-accent-primary text-sm transition-colors">Our Team</Link></li>
              <li><Link to="/security" onClick={() => window.scrollTo(0,0)} className="text-[#F0F4FF]/70 hover:text-accent-primary text-sm transition-colors">Security & Regulation</Link></li>
              <li><Link to="#" onClick={() => window.scrollTo(0,0)} className="text-[#F0F4FF]/70 hover:text-accent-primary text-sm transition-colors">Careers</Link></li>
            </ul>
          </div>

          {/* C. Quick Links & D. Resources */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Quick Links</h3>
              <ul className="space-y-3">
                <li><Link to="/dashboard" onClick={() => window.scrollTo(0,0)} className="text-[#F0F4FF]/70 hover:text-accent-primary text-sm transition-colors">Dashboard</Link></li>
                <li><Link to="/invest" onClick={() => window.scrollTo(0,0)} className="text-[#F0F4FF]/70 hover:text-accent-primary text-sm transition-colors">Investment Plans</Link></li>
                <li><Link to="#" onClick={() => window.scrollTo(0,0)} className="text-[#F0F4FF]/70 hover:text-accent-primary text-sm transition-colors">Referral Program</Link></li>
                <li><Link to="/support" onClick={() => window.scrollTo(0,0)} className="text-[#F0F4FF]/70 hover:text-accent-primary text-sm transition-colors">Support Center</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Resources</h3>
              <ul className="space-y-3">
                <li><Link to="/faq" onClick={() => window.scrollTo(0,0)} className="text-[#F0F4FF]/70 hover:text-accent-primary text-sm transition-colors">FAQ</Link></li>
                <li><Link to="/help-guide" onClick={() => window.scrollTo(0,0)} className="text-[#F0F4FF]/70 hover:text-accent-primary text-sm transition-colors">Help Guides</Link></li>
                <li><Link to="/markets" onClick={() => window.scrollTo(0,0)} className="text-[#F0F4FF]/70 hover:text-accent-primary text-sm transition-colors">Market Insights</Link></li>
                <li><Link to="/blog" onClick={() => window.scrollTo(0,0)} className="text-[#F0F4FF]/70 hover:text-accent-primary text-sm transition-colors">Blog</Link></li>
              </ul>
            </div>
          </div>

          {/* E. Contact Info & H. Newsletter */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Contact Info</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-[#F0F4FF]/70 text-sm">
                  <Mail className="w-4 h-4 text-accent-primary shrink-0" />
                  <a href="mailto:info@cgatrades.com" className="hover:text-accent-primary transition-colors">info@cgatrades.com</a>
                </li>
                <li className="flex items-center gap-3 text-[#F0F4FF]/70 text-sm">
                  <Phone className="w-4 h-4 text-accent-primary shrink-0" />
                  <a href="tel:+12345678900" className="hover:text-accent-primary transition-colors">+1 234 567 8900</a>
                </li>
              </ul>
            </div>

            {/* H. Newsletter Signup */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Newsletter</h3>
              <div className="flex items-center bg-white/10 rounded-lg p-1 border border-white/10 focus-within:border-accent-primary/50 transition-colors">
                <input 
                  type="email" 
                  placeholder="Email address" 
                  className="bg-transparent border-none outline-none text-sm px-3 py-2 w-full text-white placeholder:text-white/50"
                />
                <button className="bg-accent-primary text-[#0B1D3A] p-2 rounded-md hover:bg-accent-hover transition-colors shrink-0">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* F. Secure Payment Methods */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <span className="text-sm text-[#F0F4FF]/70 font-medium">Secure Payments:</span>
            <div className="flex items-center gap-3">
              <div className="bg-white/10 p-2 rounded-lg" title="Visa">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <div className="bg-white/10 p-2 rounded-lg" title="Mastercard">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="8" cy="12" r="6" fill="#EB001B"/>
                  <circle cx="16" cy="12" r="6" fill="#F79E1B" fillOpacity="0.8"/>
                </svg>
              </div>
              <div className="bg-white/10 p-2 rounded-lg" title="PayPal">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106z"/>
                </svg>
              </div>
              <div className="bg-white/10 p-2 rounded-lg flex items-center gap-1" title="Cryptocurrency">
                <Bitcoin className="w-6 h-6 text-[#F7931A]" />
                <span className="text-xs font-medium text-white hidden sm:inline-block">Crypto</span>
              </div>
            </div>
          </div>

          {/* G. Legal Links */}
          <div className="flex items-center gap-6 text-sm text-[#F0F4FF]/70">
            <button onClick={() => openLegalModal('terms')} className="hover:text-accent-primary transition-colors">Terms of Service</button>
            <button onClick={() => openLegalModal('privacy')} className="hover:text-accent-primary transition-colors">Privacy Policy</button>
          </div>
        </div>
        
        <div className="mt-8 text-center text-xs text-[#F0F4FF]/50">
          <p>&copy; {new Date().getFullYear()} {settings?.siteName || 'CGA'}. All rights reserved.</p>
        </div>
      </div>

      <LegalModal 
        isOpen={legalModalConfig.isOpen} 
        type={legalModalConfig.type} 
        onClose={() => setLegalModalConfig(prev => ({ ...prev, isOpen: false }))} 
      />
    </footer>
  );
}
