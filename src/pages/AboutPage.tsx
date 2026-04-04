import React from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { motion } from 'motion/react';
import { ArrowLeft, Award, Bitcoin, ShieldCheck, Globe, TrendingUp, Users, Link, Anchor } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import LanguageSelector from '../components/LanguageSelector';

export default function AboutPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const sections = [
    {
      title: t('about.founderTitle', 'Founder and Visionary: Willis Anthony'),
      text: (
        <Trans i18nKey="about.founderText">
          <span className="notranslate">Capital Growth Alliance</span>, established by Willis Anthony in 2010, emerged in the wake of Bitcoin's launch and has been actively engaged in forex trading for over 13 years. Willis Anthony's vision was to create a platform that bridges traditional finance with the emerging digital economy.
        </Trans>
      ),
      icon: <Award className="w-8 h-8 text-accent-primary" />
    },
    {
      title: t('about.bitcoinTitle', 'The Bitcoin Connection'),
      text: t('about.bitcoinText', 'Recognizing the transformative potential of blockchain technology early on, we integrated Bitcoin and other digital assets into our core trading strategies, providing our clients with unparalleled exposure to high-growth markets.'),
      icon: <Bitcoin className="w-8 h-8 text-accent-primary" />
    },
    {
      title: t('about.forexTitle', '13 Years of Forex Expertise'),
      text: t('about.forexText', 'With over a decade of experience navigating the complexities of the foreign exchange markets, our team of seasoned traders employs advanced algorithmic strategies to deliver consistent returns.'),
      icon: <TrendingUp className="w-8 h-8 text-accent-primary" />
    },
    {
      title: t('about.intersectionTitle', 'A Unique Intersection of Traditions'),
      text: t('about.intersectionText', 'We uniquely blend the rigorous risk management of traditional finance with the innovative opportunities of decentralized finance, offering a balanced and robust investment portfolio.'),
      icon: <ShieldCheck className="w-8 h-8 text-accent-primary" />
    },
    {
      title: t('about.investorsTitle', 'Over 200,000 Investors Worldwide'),
      text: t('about.investorsText', 'Our commitment to transparency and performance has earned the trust of a global community of over 200,000 investors who rely on us for their wealth generation.'),
      icon: <Globe className="w-8 h-8 text-accent-primary" />
    },
    {
      title: t('about.millionairesTitle', 'Transforming Thousands into Millionaires'),
      text: t('about.millionairesText', 'Through our strategic investment plans and compounding returns, we have proudly assisted thousands of our clients in achieving millionaire status and financial independence.'),
      icon: <Users className="w-8 h-8 text-accent-primary" />
    },
    {
      title: t('about.partnershipsTitle', 'Strategic Partnerships'),
      text: t('about.partnershipsText', 'We collaborate with industry-leading institutions and technology providers to ensure our platform remains at the cutting edge of security and performance.'),
      icon: <Link className="w-8 h-8 text-accent-primary" />
    },
    {
      title: t('about.liquidityTitle', 'Liquidity Pool on Binance'),
      text: t('about.liquidityText', 'To guarantee seamless transactions and deep market access, we maintain a substantial liquidity pool on Binance, one of the world\'s largest cryptocurrency exchanges.'),
      icon: <Anchor className="w-8 h-8 text-accent-primary" />
    }
  ];

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary font-sans relative overflow-hidden transition-colors duration-300">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 bg-glass-bg backdrop-blur-xl border-b border-glass-border shadow-lg transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/dashboard')}
                className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-text-secondary hover:text-text-primary"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h1 className="text-xl font-bold">{t('nav.about', 'About Us')}</h1>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-16 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent-primary/20 rounded-full blur-[100px] -z-10"></div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            {t('about.heroTitle', 'About')} <span className="notranslate">Capital Growth Alliance</span>
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-24 h-1 bg-accent-primary mx-auto mb-6 rounded-full"
          ></motion.div>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-text-secondary max-w-2xl mx-auto"
          >
            {t('about.heroSubtitle', 'Pioneering the future of digital asset investment and forex trading since 2010.')}
          </motion.p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", bounce: 0.4, duration: 0.6 }}
            className="bg-bg-secondary border border-border-color rounded-2xl p-6 text-center shadow-lg hover:shadow-xl hover:shadow-accent-primary/10 transition-all duration-300"
          >
            <div className="text-4xl font-bold text-accent-primary mb-2">{t('about.stats.years', '13+')}</div>
            <div className="text-text-secondary font-medium uppercase tracking-wider text-sm">{t('about.stats.yearsLabel', 'Years of Excellence')}</div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", bounce: 0.4, duration: 0.6, delay: 0.1 }}
            className="bg-bg-secondary border border-border-color rounded-2xl p-6 text-center shadow-lg hover:shadow-xl hover:shadow-accent-primary/10 transition-all duration-300"
          >
            <div className="text-4xl font-bold text-accent-primary mb-2">{t('about.stats.investors', '200,000+')}</div>
            <div className="text-text-secondary font-medium uppercase tracking-wider text-sm">{t('about.stats.investorsLabel', 'Global Investors')}</div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", bounce: 0.4, duration: 0.6, delay: 0.2 }}
            className="bg-bg-secondary border border-border-color rounded-2xl p-6 text-center shadow-lg hover:shadow-xl hover:shadow-accent-primary/10 transition-all duration-300"
          >
            <div className="text-4xl font-bold text-accent-primary mb-2">{t('about.stats.success', '9,000+')}</div>
            <div className="text-text-secondary font-medium uppercase tracking-wider text-sm">{t('about.stats.successLabel', 'Success Stories')}</div>
          </motion.div>
        </div>

        {/* Company Story Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Founder Section with Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", bounce: 0.4, duration: 0.6 }}
            className="bg-bg-secondary border border-border-color rounded-2xl p-8 shadow-lg hover:shadow-xl hover:shadow-accent-primary/20 hover:border-accent-primary/50 transition-all duration-300 group md:col-span-2 flex flex-col md:flex-row items-center gap-8"
          >
            <div className="w-48 h-48 md:w-64 md:h-64 shrink-0 rounded-2xl overflow-hidden bg-black/5 dark:bg-white/5 border border-border-color">
              <img 
                src="https://picsum.photos/seed/founder/400/400?grayscale" 
                alt="Willis Anthony" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="w-16 h-16 rounded-2xl bg-accent-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                {sections[0].icon}
              </div>
              <h3 className="text-2xl font-bold mb-4">{sections[0].title}</h3>
              <p className="text-text-secondary leading-relaxed text-lg">{sections[0].text}</p>
            </div>
          </motion.div>

          {/* Other Sections */}
          {sections.slice(1).map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", bounce: 0.4, duration: 0.6, delay: index * 0.1 }}
              className="bg-bg-secondary border border-border-color rounded-2xl p-8 shadow-lg hover:shadow-xl hover:shadow-accent-primary/20 hover:border-accent-primary/50 transition-all duration-300 group"
            >
              <div className="w-16 h-16 rounded-2xl bg-accent-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                {section.icon}
              </div>
              <h3 className="text-xl font-bold mb-4">{section.title}</h3>
              <p className="text-text-secondary leading-relaxed">{section.text}</p>
            </motion.div>
          ))}
        </div>

        {/* Partnership Logos */}
        <div className="mb-16 text-center">
          <h3 className="text-sm font-bold text-text-secondary uppercase tracking-widest mb-8">Trusted by Industry Leaders</h3>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="flex items-center gap-2 font-bold text-xl"><Globe className="w-6 h-6" /> Binance</div>
            <div className="flex items-center gap-2 font-bold text-xl"><ShieldCheck className="w-6 h-6" /> Coinbase</div>
            <div className="flex items-center gap-2 font-bold text-xl"><TrendingUp className="w-6 h-6" /> Kraken</div>
            <div className="flex items-center gap-2 font-bold text-xl"><Anchor className="w-6 h-6" /> Bitfinex</div>
          </div>
        </div>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-accent-primary/20 to-transparent border border-accent-primary/30 rounded-3xl p-12 text-center"
        >
          <h2 className="text-3xl font-bold mb-6">{t('about.ctaTitle', 'Your Journey to Financial Success Begins Today')}</h2>
          <button 
            onClick={() => navigate('/invest')}
            className="px-8 py-4 bg-accent-primary text-slate-900 rounded-xl font-bold text-lg hover:bg-[#b3e600] transition-colors shadow-lg shadow-accent-primary/30 hover:scale-105 active:scale-95 duration-300"
          >
            {t('about.ctaButton', 'Get Started Now')}
          </button>
        </motion.div>
      </main>
    </div>
  );
}
