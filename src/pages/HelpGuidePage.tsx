import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Rocket, UserCog, Wallet, TrendingUp, Users, 
  ShieldCheck, Info, HelpCircle, Headset, 
  ChevronDown, ArrowRight, CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';

const sections = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: Rocket,
    content: (
      <div className="space-y-4">
        <p className="text-text-secondary">Welcome to CGA! Getting started is quick and easy. Follow these steps to begin your investment journey:</p>
        <ol className="list-decimal list-inside space-y-2 text-text-secondary ml-2">
          <li><strong>Create an Account:</strong> Click the "Sign Up" button and provide your basic information.</li>
          <li><strong>Verify Your Identity:</strong> Complete the KYC (Know Your Customer) process to secure your account.</li>
          <li><strong>Fund Your Wallet:</strong> Deposit funds using your preferred cryptocurrency or fiat method.</li>
          <li><strong>Choose a Plan:</strong> Browse our investment plans and select the one that fits your goals.</li>
        </ol>
      </div>
    )
  },
  {
    id: 'account-management',
    title: 'Account Management',
    icon: UserCog,
    content: (
      <div className="space-y-4">
        <p className="text-text-secondary">Manage your profile, security settings, and preferences from your dashboard.</p>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-accent-primary shrink-0 mt-0.5" />
            <span className="text-text-secondary"><strong>Profile Updates:</strong> Keep your contact information up to date in the Settings menu.</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-accent-primary shrink-0 mt-0.5" />
            <span className="text-text-secondary"><strong>Two-Factor Authentication (2FA):</strong> Enable 2FA for an extra layer of security on your account.</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-accent-primary shrink-0 mt-0.5" />
            <span className="text-text-secondary"><strong>Activity Logs:</strong> Monitor your login history and recent account changes.</span>
          </li>
        </ul>
      </div>
    )
  },
  {
    id: 'deposits-withdrawals',
    title: 'Deposits & Withdrawals',
    icon: Wallet,
    content: (
      <div className="space-y-4">
        <p className="text-text-secondary">We support multiple payment methods for seamless transactions.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="bg-bg-primary p-4 rounded-xl border border-border-light">
            <h4 className="font-semibold mb-2">Deposits</h4>
            <p className="text-sm text-text-secondary">Deposits are processed automatically. Supported methods include Bitcoin, Ethereum, USDT (TRC20/ERC20), and bank transfers. Minimum deposit varies by plan.</p>
          </div>
          <div className="bg-bg-primary p-4 rounded-xl border border-border-light">
            <h4 className="font-semibold mb-2">Withdrawals</h4>
            <p className="text-sm text-text-secondary">Withdrawals are processed within 24 hours. Ensure your withdrawal address is correct. Minimum withdrawal amount is $50.</p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'investment-plans',
    title: 'Investment Plans',
    icon: TrendingUp,
    content: (
      <div className="space-y-4">
        <p className="text-text-secondary">Choose from our carefully structured investment plans designed for different financial goals:</p>
        <div className="space-y-3">
          <div className="p-4 rounded-xl border border-border-light bg-bg-primary">
            <h4 className="font-semibold text-accent-primary mb-1">Regular Plans</h4>
            <p className="text-sm text-text-secondary">Perfect for beginners. Lower entry threshold with steady, reliable daily returns. Ideal for testing the platform.</p>
          </div>
          <div className="p-4 rounded-xl border border-border-light bg-bg-primary">
            <h4 className="font-semibold text-accent-primary mb-1">Premium Plans</h4>
            <p className="text-sm text-text-secondary">For serious investors. Higher returns and priority support. Requires a moderate initial capital commitment.</p>
          </div>
          <div className="p-4 rounded-xl border border-border-light bg-bg-primary">
            <h4 className="font-semibold text-accent-primary mb-1">Elite Plans</h4>
            <p className="text-sm text-text-secondary">Institutional-grade investments. Maximum yields, dedicated account managers, and exclusive market insights.</p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'referrals',
    title: 'Referrals & Earnings',
    icon: Users,
    content: (
      <div className="space-y-4">
        <p className="text-text-secondary">Earn passive income by inviting friends and family to join CGA.</p>
        <ul className="list-disc list-inside space-y-2 text-text-secondary ml-2">
          <li>Share your unique referral link found in your dashboard.</li>
          <li>Earn a percentage commission on every deposit made by your referrals.</li>
          <li>Commissions are credited instantly to your available balance.</li>
          <li>No limit on the number of people you can refer.</li>
        </ul>
      </div>
    )
  },
  {
    id: 'security',
    title: 'Security & Safety',
    icon: ShieldCheck,
    content: (
      <div className="space-y-4">
        <p className="text-text-secondary">Your security is our top priority. We employ industry-leading measures to protect your funds and data.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 bg-bg-primary p-3 rounded-lg border border-border-light">
            <ShieldCheck className="w-5 h-5 text-accent-primary" />
            <span className="text-sm font-medium">SSL Encryption</span>
          </div>
          <div className="flex items-center gap-3 bg-bg-primary p-3 rounded-lg border border-border-light">
            <ShieldCheck className="w-5 h-5 text-accent-primary" />
            <span className="text-sm font-medium">Cold Storage Funds</span>
          </div>
          <div className="flex items-center gap-3 bg-bg-primary p-3 rounded-lg border border-border-light">
            <ShieldCheck className="w-5 h-5 text-accent-primary" />
            <span className="text-sm font-medium">DDoS Protection</span>
          </div>
          <div className="flex items-center gap-3 bg-bg-primary p-3 rounded-lg border border-border-light">
            <ShieldCheck className="w-5 h-5 text-accent-primary" />
            <span className="text-sm font-medium">24/7 Monitoring</span>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'about',
    title: 'About CGA',
    icon: Info,
    content: (
      <div className="space-y-4">
        <p className="text-text-secondary">
          CGA is a premier investment platform leveraging advanced AI and expert market analysis to deliver consistent returns. 
          Our mission is to democratize access to institutional-grade wealth management tools.
        </p>
        <p className="text-text-secondary">
          With decades of combined experience in traditional finance and cryptocurrency markets, our leadership team is dedicated to transparency, innovation, and client success.
        </p>
      </div>
    )
  }
];

const faqs = [
  {
    q: "How do I reset my password?",
    a: "Click on 'Forgot Password' on the login page. Enter your registered email address, and we will send you a link to reset your password."
  },
  {
    q: "Are there any hidden fees?",
    a: "No, we believe in complete transparency. All fees associated with deposits, withdrawals, or plan management are clearly stated before you confirm any transaction."
  },
  {
    q: "Can I have multiple active investment plans?",
    a: "Yes, you can run multiple investment plans simultaneously. Each plan will operate independently and generate returns according to its specific terms."
  },
  {
    q: "What happens if I lose my 2FA device?",
    a: "If you lose access to your 2FA device, please contact our support team immediately. We will verify your identity through alternative methods to restore your access."
  }
];

export default function HelpGuidePage() {
  const [activeSection, setActiveSection] = useState(sections[0].id);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -100; // Adjust for sticky header
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary pb-24">
      {/* Header Banner */}
      <section className="pt-24 pb-12 md:pb-20 bg-gradient-to-b from-bg-secondary to-bg-primary border-b border-border-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent-primary/10 text-accent-primary mb-6"
          >
            <HelpCircle className="w-8 h-8" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-bold mb-4"
          >
            Help & <span className="text-accent-primary">Guides</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-text-secondary max-w-2xl mx-auto text-sm md:text-base"
          >
            Everything you need to know about using the CGA platform. Browse our comprehensive guides or contact support for further assistance.
          </motion.p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* Sidebar Navigation (Desktop) / Top Navigation (Mobile) */}
          <div className="lg:w-1/4 shrink-0">
            <div className="sticky top-28 bg-bg-secondary rounded-2xl border border-border-light p-4 overflow-x-auto lg:overflow-visible flex lg:flex-col gap-2 hide-scrollbar">
              {sections.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;
                return (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all whitespace-nowrap lg:whitespace-normal text-left ${
                      isActive 
                        ? 'bg-accent-primary text-slate-900 font-semibold shadow-md' 
                        : 'text-text-secondary hover:bg-bg-primary hover:text-text-primary'
                    }`}
                  >
                    <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-slate-900' : 'text-text-muted'}`} />
                    <span className="text-sm">{section.title}</span>
                  </button>
                );
              })}
              <button
                onClick={() => scrollToSection('faqs')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all whitespace-nowrap lg:whitespace-normal text-left ${
                  activeSection === 'faqs' 
                    ? 'bg-accent-primary text-slate-900 font-semibold shadow-md' 
                    : 'text-text-secondary hover:bg-bg-primary hover:text-text-primary'
                }`}
              >
                <HelpCircle className={`w-5 h-5 shrink-0 ${activeSection === 'faqs' ? 'text-slate-900' : 'text-text-muted'}`} />
                <span className="text-sm">FAQs</span>
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:w-3/4 space-y-12 md:space-y-16">
            
            {/* Guide Sections */}
            <div className="space-y-8 md:space-y-16">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <motion.section 
                    key={section.id}
                    id={section.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    onViewportEnter={() => setActiveSection(section.id)}
                    className="scroll-mt-28 bg-bg-secondary rounded-2xl border border-border-light p-5 md:p-8"
                  >
                    <div className="flex items-center gap-3 md:gap-4 mb-5 md:mb-6 pb-4 border-b border-border-light">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-bg-primary flex items-center justify-center border border-border-light shrink-0">
                        <Icon className="w-5 h-5 md:w-6 md:h-6 text-accent-primary" />
                      </div>
                      <h2 className="text-xl md:text-2xl font-bold">{section.title}</h2>
                    </div>
                    <div className="text-sm md:text-base">
                      {section.content}
                    </div>
                  </motion.section>
                );
              })}
            </div>

            {/* FAQs Section */}
            <motion.section 
              id="faqs"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              onViewportEnter={() => setActiveSection('faqs')}
              className="scroll-mt-28 bg-bg-secondary rounded-2xl border border-border-light p-5 md:p-8"
            >
              <div className="flex items-center gap-3 md:gap-4 mb-5 md:mb-6 pb-4 border-b border-border-light">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-bg-primary flex items-center justify-center border border-border-light shrink-0">
                  <HelpCircle className="w-5 h-5 md:w-6 md:h-6 text-accent-primary" />
                </div>
                <h2 className="text-xl md:text-2xl font-bold">Frequently Asked Questions</h2>
              </div>
              
              <div className="space-y-3">
                {faqs.map((faq, index) => (
                  <div 
                    key={index}
                    className="border border-border-light rounded-xl overflow-hidden bg-bg-primary"
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === index ? null : index)}
                      className="w-full flex items-center justify-between p-3 md:p-4 text-left hover:bg-bg-hover transition-colors"
                    >
                      <span className="font-medium pr-4 text-sm md:text-base">{faq.q}</span>
                      <ChevronDown className={`w-4 h-4 md:w-5 md:h-5 text-text-muted shrink-0 transition-transform ${openFaq === index ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {openFaq === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="p-3 md:p-4 pt-0 text-text-secondary text-xs md:text-sm border-t border-border-light mt-2">
                            {faq.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Contact Support CTA */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-accent-primary/20 to-bg-secondary rounded-2xl border border-accent-primary/30 p-6 md:p-8 text-center"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full bg-accent-primary/20 text-accent-primary mb-4">
                <Headset className="w-6 h-6 md:w-8 md:h-8" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold mb-2 md:mb-3">Still need help?</h2>
              <p className="text-text-secondary mb-5 md:mb-6 max-w-lg mx-auto text-sm md:text-base">
                Our dedicated support team is available 24/7 to assist you with any questions or issues you might have.
              </p>
              <Link 
                to="/support"
                className="inline-flex items-center gap-2 bg-accent-primary text-slate-900 px-5 py-2.5 md:px-6 md:py-3 rounded-xl font-semibold hover:bg-accent-hover transition-colors text-sm md:text-base"
              >
                Contact Support
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
              </Link>
            </motion.section>

          </div>
        </div>
      </div>
    </div>
  );
}
