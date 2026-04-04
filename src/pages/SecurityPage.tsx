import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, Server, FileText, AlertTriangle, Scale, CheckCircle2, UserCheck, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import LanguageSelector from '../components/LanguageSelector';

export default function SecurityPage() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    {
      icon: <Lock className="w-8 h-8 text-accent-primary" />,
      title: "Fund Security & Segregation",
      content: "Client funds are held in segregated accounts at top-tier, globally recognized banks. This ensures that your capital is completely separated from our operational funds and cannot be used for any other purpose than your investments."
    },
    {
      icon: <Server className="w-8 h-8 text-accent-primary" />,
      title: "Military-Grade Encryption",
      content: "All data transmitted between your device and our servers is protected by 256-bit SSL encryption. Our infrastructure utilizes advanced cryptographic protocols to ensure your personal and financial information remains strictly confidential."
    },
    {
      icon: <UserCheck className="w-8 h-8 text-accent-primary" />,
      title: "Account Protection & 2FA",
      content: "We employ multi-layered security for account access. We strongly recommend all users enable Two-Factor Authentication (2FA). Our systems actively monitor for suspicious login attempts and unusual account activity."
    },
    {
      icon: <Scale className="w-8 h-8 text-accent-primary" />,
      title: "Anti-Money Laundering (AML)",
      content: "We maintain strict compliance with international AML and KYC (Know Your Customer) regulations. Our robust verification processes prevent illicit activities and ensure a safe trading environment for all legitimate investors."
    },
    {
      icon: <AlertTriangle className="w-8 h-8 text-accent-primary" />,
      title: "Risk Disclosure",
      content: "Trading forex, cryptocurrencies, and other financial instruments carries a high level of risk and may not be suitable for all investors. Past performance is not indicative of future results. Never invest money you cannot afford to lose."
    },
    {
      icon: <FileText className="w-8 h-8 text-accent-primary" />,
      title: "Regulatory Disclaimer",
      content: "While we operate with the highest standards of integrity and security, we are a private investment platform. We are not a bank, and investments are not insured by government entities such as the FDIC or SIPC."
    }
  ];

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary pt-8 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Hero Section */}
        <div className="text-center mb-16 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent-primary/20 rounded-full blur-[100px] -z-10"></div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-20 h-20 mx-auto bg-accent-primary/10 rounded-2xl flex items-center justify-center mb-6 text-accent-primary border border-accent-primary/20 shadow-[0_0_30px_rgba(200,255,0,0.15)]"
          >
            <Shield className="w-10 h-10" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-bold mb-6"
          >
            Institutional-Grade <span className="text-accent-primary">Security</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-text-secondary max-w-2xl mx-auto"
          >
            Your trust is our most valuable asset. We employ industry-leading security measures, strict regulatory compliance, and transparent operational practices to protect your investments and personal data.
          </motion.p>
        </div>

        {/* Security Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-bg-secondary border border-border-color rounded-2xl p-6 shadow-lg hover:shadow-xl hover:shadow-accent-primary/5 hover:border-accent-primary/30 transition-all duration-300 group"
            >
              <div className="w-14 h-14 rounded-xl bg-accent-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                {section.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{section.title}</h3>
              <p className="text-text-secondary leading-relaxed text-sm">
                {section.content}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Compliance Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-accent-primary/10 to-transparent border border-accent-primary/20 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent-primary/10 rounded-full blur-[80px] -z-10"></div>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Compliance Inquiries</h2>
          <p className="text-text-secondary mb-8 max-w-2xl mx-auto">
            Have questions about our security practices, data protection policies, or regulatory compliance? Our dedicated compliance team is here to provide full transparency.
          </p>
          <button 
            onClick={() => navigate('/support')}
            className="px-8 py-4 bg-accent-primary text-slate-900 rounded-xl font-bold hover:bg-[#b3e600] transition-colors shadow-lg shadow-accent-primary/20 hover:scale-105 active:scale-95 duration-300"
          >
            Contact Compliance Team
          </button>
        </motion.div>
      </div>
    </div>
  );
}
