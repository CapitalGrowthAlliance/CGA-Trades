import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Shield, Zap } from 'lucide-react';
import TestimonialsSection from '../components/TestimonialsSection';
import HomeSearch from '../components/HomeSearch';
import HomeDashboard from '../components/HomeDashboard';
import TopInvestorsSection from '../components/TopInvestorsSection';
import CgaDashboardCards from '../components/CgaDashboardCards';
import { useAuth } from '../context/AuthContext';
import { useSite } from '../context/SiteContext';

export default function HomePage() {
  const { user } = useAuth();
  const { uiContent } = useSite();
  const isAuthenticated = !!user;
  return (
    <div className="flex flex-col flex-1">
      <HomeDashboard />

      <div className="w-full max-w-2xl mx-auto mt-4 mb-8 relative z-10 px-6">
        <HomeSearch />
      </div>

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Top Investors Section */}
      <TopInvestorsSection />

      {/* Features Section */}
      <section className="py-20 px-6 lg:px-12 bg-bg-primary">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose <span className="notranslate">CGA</span>?</h2>
            <p className="text-text-secondary max-w-2xl mx-auto">We combine cutting-edge technology with financial expertise to deliver superior returns.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-bg-card p-8 rounded-2xl border border-border-light">
              <div className="w-14 h-14 bg-accent-primary/10 text-accent-primary rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">Bank-Grade Security</h3>
              <p className="text-text-secondary">Your funds are protected by industry-leading encryption and security protocols.</p>
            </div>
            <div className="bg-bg-card p-8 rounded-2xl border border-border-light">
              <div className="w-14 h-14 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center mb-6">
                <TrendingUp className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">Consistent Returns</h3>
              <p className="text-text-secondary">Our algorithmic trading strategies are designed to perform in all market conditions.</p>
            </div>
            <div className="bg-bg-card p-8 rounded-2xl border border-border-light">
              <div className="w-14 h-14 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center mb-6">
                <Zap className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">Instant Execution</h3>
              <p className="text-text-secondary">Deposits and withdrawals are processed automatically with zero delays.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 lg:px-12 text-center border-t border-border-light bg-bg-secondary">
        <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to build your portfolio?</h2>
        <p className="text-xl text-text-secondary mb-10 max-w-2xl mx-auto">Join thousands of investors who trust <span className="notranslate">CGA</span> for their financial growth.</p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/how-it-works" className="text-accent-primary font-bold hover:underline">
            Learn more about how CGA works
          </Link>
          <span className="hidden sm:inline text-text-muted">•</span>
          <Link to="/cga-token" className="text-accent-primary font-bold hover:underline flex items-center gap-1">
            <Zap className="w-4 h-4" /> Explore CGA Token
          </Link>
        </div>
      </section>
    </div>
  );
}
