import React from 'react';
import { motion } from 'framer-motion';

const partners = [
  {
    name: 'Binance',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Binance_Logo.svg',
    yearEstablished: 2017,
    industry: 'Crypto Exchange',
    description: 'Binance is the world\'s leading cryptocurrency exchange by trading volume, providing a robust ecosystem for digital asset trading, decentralized finance (DeFi), and blockchain innovation. It serves as a foundational pillar for global crypto liquidity.',
    highlights: [
      'Deepest global liquidity pools',
      'Advanced API integrations',
      'Institutional-grade security infrastructure'
    ]
  },
  {
    name: 'TradingView',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/3/33/TradingView_Logo.svg',
    yearEstablished: 2011,
    industry: 'Financial Charting & Analysis',
    description: 'TradingView is a globally renowned charting platform and social network used by millions of traders and investors to spot opportunities across global markets. It provides the essential analytical backbone for modern trading.',
    highlights: [
      'Advanced technical analysis tools',
      'Real-time global market data',
      'Custom Pine Script indicators'
    ]
  },
  {
    name: 'Headway',
    logo: 'https://i.imgur.com/K5f4q2X.png', // Placeholder for Headway logo, using a generic or text if needed. Let's use a clear text or generic icon if logo isn't available, but we'll use a high quality placeholder.
    yearEstablished: 2023,
    industry: 'Forex Broker',
    description: 'Headway is an innovative international broker offering seamless access to global financial markets with a focus on transparency, low latency, and client-centric trading conditions. It represents the new generation of agile brokerage services.',
    highlights: [
      'Ultra-fast execution speeds',
      'Diverse asset classes',
      'Robust regulatory compliance'
    ]
  },
  {
    name: 'Exness',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Exness_logo.svg/2560px-Exness_logo.svg.png',
    yearEstablished: 2008,
    industry: 'Multi-Asset Broker',
    description: 'Exness is a premier multi-asset broker known for its scientific approach to trading, offering some of the most stable and reliable trading conditions in the industry. It caters to high-volume professional traders globally.',
    highlights: [
      'Proprietary algorithmic pricing',
      'Instant automated withdrawals',
      'Transparent historical tick data'
    ]
  },
  {
    name: 'Oanda',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/OANDA_logo.svg/2560px-OANDA_logo.svg.png',
    yearEstablished: 1996,
    industry: 'Forex Broker & Data Provider',
    description: 'OANDA is a trusted global leader in online multi-asset trading services, currency data, and analytics, serving retail and corporate clients worldwide. Their historical data accuracy is an industry standard.',
    highlights: [
      'Institutional-grade execution',
      'Award-winning trading platforms',
      'Precise currency data APIs'
    ]
  },
  {
    name: 'Coinbase',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Coinbase_Logo_2013.v.svg',
    yearEstablished: 2012,
    industry: 'Crypto Exchange',
    description: 'Coinbase is a secure, publicly traded platform that makes it easy to buy, sell, and store cryptocurrency, serving as a primary gateway for institutional and retail crypto adoption in regulated markets.',
    highlights: [
      'Strict regulatory compliance',
      'Coinbase Prime for institutions',
      'Secure cold storage infrastructure'
    ]
  },
  {
    name: 'KuCoin',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/KuCoin_logo.svg/2560px-KuCoin_logo.svg.png',
    yearEstablished: 2017,
    industry: 'Crypto Exchange',
    description: 'Known as the "People\'s Exchange," KuCoin is a global cryptocurrency exchange that provides a wide array of digital assets, advanced trading features, and a strong focus on community-driven growth.',
    highlights: [
      'Extensive altcoin selection',
      'High-performance matching engine',
      'Robust security protocols'
    ]
  },
  {
    name: 'OKX',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/OKX_Logo.svg/2560px-OKX_Logo.svg.png',
    yearEstablished: 2017,
    industry: 'Crypto Exchange & Web3',
    description: 'OKX is a leading global cryptocurrency spot and derivatives exchange and Web3 ecosystem, offering advanced financial services to traders globally using cutting-edge blockchain technology.',
    highlights: [
      'Comprehensive derivatives market',
      'Advanced Web3 wallet integration',
      'Deep cross-pair liquidity'
    ]
  },
  {
    name: 'IC Markets',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/IC_Markets_logo.svg/2560px-IC_Markets_logo.svg.png',
    yearEstablished: 2007,
    industry: 'Forex CFD Provider',
    description: 'IC Markets is one of the world\'s largest True ECN forex brokers, providing trading solutions for active day traders and scalpers as well as novices to the forex market with unparalleled execution speeds.',
    highlights: [
      'Raw spread connectivity',
      'Enterprise-grade hardware',
      'Minimal latency routing'
    ]
  },
  {
    name: 'OctaFX',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/OctaFX_logo.svg/2560px-OctaFX_logo.svg.png',
    yearEstablished: 2011,
    industry: 'Forex Broker',
    description: 'OctaFX is a globally recognized forex broker providing state-of-the-art trading platforms, tight spreads, and a commitment to helping traders achieve their financial goals through superior trading conditions.',
    highlights: [
      'No-dealing desk execution',
      'Comprehensive educational resources',
      'Localized global support'
    ]
  }
];

export default function OurPartnersPage() {
  return (
    <div className="min-h-screen bg-bg-primary pt-24 pb-0 flex flex-col">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex-1 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Our Partners</h1>
          <p className="text-text-secondary text-lg max-w-3xl mx-auto">
            We collaborate with the world's leading financial institutions, exchanges, and technology providers to deliver unparalleled liquidity, security, and execution speed to our clients.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 mb-24">
          {partners.map((partner, index) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="bg-bg-secondary border border-border-light rounded-2xl p-6 hover:border-accent-primary/50 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 flex flex-col h-full"
            >
              <div className="h-16 flex items-center justify-start mb-6 bg-white/5 rounded-xl p-4 border border-white/5">
                {/* We use a fallback text if the image fails to load, but we try to load the logo */}
                <img 
                  src={partner.logo} 
                  alt={`${partner.name} logo`} 
                  className="max-h-8 max-w-[120px] object-contain filter brightness-0 invert opacity-90"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                  }}
                  referrerPolicy="no-referrer"
                />
                <span className="hidden text-xl font-bold text-white tracking-tight">{partner.name}</span>
              </div>

              <div className="mb-4">
                <h2 className="text-2xl font-bold text-white mb-1">{partner.name}</h2>
                <p className="text-accent-primary text-sm font-medium mb-3">{partner.industry}</p>
                <div className="flex flex-col gap-1 text-xs text-text-muted bg-black/20 p-3 rounded-lg border border-white/5">
                  <div className="flex justify-between">
                    <span>Established:</span>
                    <span className="text-white font-medium">{partner.yearEstablished}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Partnered with CGA since:</span>
                    <span className="text-white font-medium">{partner.yearEstablished + 1}</span>
                  </div>
                </div>
              </div>

              <div className="flex-1 mb-6">
                <p className="text-sm text-text-secondary leading-relaxed">
                  {partner.description}
                </p>
              </div>

              <div className="mt-auto pt-4 border-t border-border-light">
                <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Key Highlights</h3>
                <ul className="space-y-2">
                  {partner.highlights.map((highlight, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent-primary mt-1.5 shrink-0" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mandatory Bottom Section */}
      <div className="w-full bg-bg-secondary border-t border-border-light py-16 mt-auto">
        <div className="max-w-5xl mx-auto px-6 lg:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-black/40 border border-accent-primary/20 rounded-2xl p-8 md:p-12 shadow-[0_0_40px_rgba(200,255,0,0.05)]"
          >
            <p className="text-lg md:text-xl text-white leading-relaxed font-medium">
              "We trade with No-Dealing Desk (NDD) brokers: Straight Through Processing (STP). STP brokers route their clients' orders directly to liquidity providers and we also are solidified by our liquidity pool on <a href="https://www.binance.com/en/swap/pool" target="_blank" rel="noopener noreferrer" className="text-accent-primary hover:underline">https://www.binance.com/en/swap/pool</a> web3 built on coinbase, kucoin.com and okx.com"
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
