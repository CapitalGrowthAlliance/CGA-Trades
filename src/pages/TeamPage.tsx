import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, TrendingUp, Users, X } from 'lucide-react';

const teamMembers = [
  {
    name: "Anthony Willis",
    title: "MD/CEO",
    image: "https://i.imgur.com/GarK6oB.jpg",
    bio: [
      "As the Managing Director and CEO, Anthony Willis brings unparalleled expertise in strategic investment planning and wealth management. With a deep understanding of global financial markets, he has dedicated his career to identifying high-yield opportunities and mitigating risks for our investors.",
      "Under his leadership, the firm has consistently delivered robust returns while maintaining the highest standards of transparency and financial stewardship. Anthony's vision is to democratize access to premium investment strategies, empowering individuals and institutions alike to grow their wealth with confidence."
    ]
  },
  {
    name: "Sophia M. Willis",
    title: "AI Analyst",
    image: "https://i.imgur.com/Eu6jB4l.jpg",
    bio: [
      "Sophia M. Willis is a leading AI Analyst, specializing in predictive modeling and machine learning algorithms for financial markets. Her innovative approach to data analysis has revolutionized our trading strategies.",
      "She continuously explores new frontiers in artificial intelligence to ensure our investment decisions are backed by the most advanced technological insights available."
    ]
  },
  {
    name: "Jane T. Brown",
    title: "Marketing/Publication",
    image: "https://i.imgur.com/DWa0FhW.jpg",
    bio: [
      "Jane T. Brown leads our Marketing and Publication efforts, bringing a wealth of experience in corporate communications and brand management. She is responsible for articulating our firm's vision and values to a global audience.",
      "Her strategic campaigns and insightful publications have significantly enhanced our market presence and client engagement."
    ]
  },
  {
    name: "Chris J. Smith",
    title: "Stock Market Analyst",
    image: "https://i.imgur.com/BL6XQ84.jpg",
    bio: [
      "Chris J. Smith is a seasoned Stock Market Analyst with a keen eye for emerging trends and undervalued assets. His rigorous fundamental and technical analysis provides the foundation for many of our most successful portfolios.",
      "With a track record of accurate market forecasts, Chris plays a crucial role in navigating volatile market conditions and securing long-term growth for our clients."
    ]
  },
  {
    name: "Mia J. Wilson",
    title: "Risk Manager",
    image: "https://i.imgur.com/3ZHsTVb.jpg",
    bio: [
      "Mia J. Wilson serves as our Risk Manager, tasked with identifying, assessing, and mitigating potential financial risks. Her comprehensive risk management frameworks ensure the stability and security of our investment operations.",
      "Her proactive strategies and meticulous attention to detail safeguard our clients' assets against unforeseen market fluctuations."
    ]
  },
  {
    name: "Evelyn A. Harris",
    title: "Board Director",
    image: "https://i.imgur.com/z7slfSB.jpg",
    bio: [
      "Evelyn A. Harris is a distinguished Board Director with decades of experience in corporate governance and strategic oversight. Her leadership and vision have been instrumental in guiding the firm's long-term objectives.",
      "She brings a wealth of industry knowledge and a steadfast commitment to ethical business practices and shareholder value."
    ]
  },
  {
    name: "Harper & Mia",
    title: "Floor Traders",
    image: "https://i.imgur.com/6SUITGp.jpg",
    bio: [
      "Harper and Mia are dynamic Floor Traders known for their quick decision-making and exceptional execution skills. They thrive in fast-paced trading environments, capitalizing on real-time market movements.",
      "Their collaborative approach and deep understanding of market mechanics consistently yield optimal trading outcomes."
    ]
  },
  {
    name: "Richard, David & William",
    title: "Floor Traders",
    image: "https://i.imgur.com/VKsbeRq.jpg",
    bio: [
      "Richard, David, and William form a formidable team of Floor Traders. Their combined expertise and synergistic trading strategies allow them to navigate complex market scenarios with precision and agility.",
      "They are dedicated to maximizing returns through disciplined trading practices and continuous market monitoring."
    ]
  },
  {
    name: "Charles & Martins",
    title: "Floor Traders",
    image: "https://i.imgur.com/RDP0MeB.jpg",
    bio: [
      "Charles and Martins are highly skilled Floor Traders who specialize in executing high-volume trades with minimal market impact. Their strategic execution and market intuition are key assets to our trading floor.",
      "They consistently demonstrate resilience and adaptability in ever-changing market conditions."
    ]
  },
  {
    name: "AI Market Analysts",
    title: "AI Market Analysts",
    image: "https://i.imgur.com/9GBxsH9.jpg",
    bio: [
      "Our team of AI Market Analysts leverages cutting-edge artificial intelligence to decode complex market data and identify profitable trading opportunities. They are at the forefront of algorithmic trading innovation.",
      "By integrating advanced machine learning models, they provide actionable insights that drive our data-centric investment strategies."
    ]
  },
  {
    name: "Richard Turner Walker",
    title: "Head of Staffs",
    image: "https://i.imgur.com/Cm3IWg3.jpg",
    bio: [
      "Richard Turner Walker is our dedicated Head of Staffs, overseeing daily operations and ensuring seamless coordination across all departments. His exceptional leadership fosters a collaborative and high-performance work culture.",
      "He is committed to operational excellence and the continuous professional development of our team members."
    ]
  },
  {
    name: "Daniel Walker",
    title: "Portfolio Manager",
    image: "https://i.imgur.com/VBw7Ad9.jpg",
    bio: [
      "Daniel Walker is an expert Portfolio Manager with a proven track record of constructing robust, diversified investment portfolios. He tailors investment strategies to align with our clients' unique financial goals and risk tolerances.",
      "His strategic asset allocation and rigorous portfolio rebalancing ensure sustained growth and wealth preservation."
    ]
  },
  {
    name: "Richard Frank",
    title: "Fundamental Analyst",
    image: "https://i.imgur.com/fXITVB0.jpg",
    bio: [
      "Richard Frank is a meticulous Fundamental Analyst who delves deep into corporate financial statements and macroeconomic indicators to evaluate asset value. His in-depth research uncovers hidden investment opportunities.",
      "His analytical rigor and comprehensive market assessments are invaluable to our long-term investment planning."
    ]
  },
  {
    name: "Developers",
    title: "Developers",
    image: "https://i.imgur.com/6UdtXZE.jpg",
    bio: [
      "Our talented team of Developers builds and maintains the robust technological infrastructure that powers our trading platforms and analytical tools. They are experts in creating secure, scalable, and high-performance software solutions.",
      "Their continuous innovation ensures we remain at the cutting edge of financial technology."
    ]
  }
];

export default function TeamPage() {
  const [selectedMember, setSelectedMember] = useState<typeof teamMembers[0] | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bg-primary pb-24 -mt-20">
      {/* Hero Section */}
      <section className="relative pt-24 pb-8 md:pb-20 bg-gradient-to-b from-bg-secondary to-bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-bg-secondary/80 to-bg-primary/90" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold text-accent-primary mb-2 md:mb-6"
            >
              Meet The Team
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-sm md:text-lg text-text-secondary leading-snug md:leading-normal px-2 md:px-0"
            >
              Guided by experience, driven by innovation. Our leadership team brings decades of expertise in global financial markets to help you achieve financial freedom.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Team Members Grid */}
      <section className="pt-6 pb-16 md:py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
            {teamMembers.map((member, index) => (
              <motion.div 
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                onClick={() => {
                  setSelectedMember(member);
                  setIsPreviewOpen(false);
                }}
                className="bg-bg-secondary border border-border-light rounded-2xl overflow-hidden shadow-lg cursor-pointer group hover:border-accent-primary/50 transition-colors"
              >
                <div className="aspect-[4/5] relative overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
                  <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-5">
                    <h3 className="text-sm sm:text-xl font-bold text-white mb-0 sm:mb-1">{member.name}</h3>
                    <p className="text-accent-primary text-[10px] sm:text-sm font-medium">{member.title}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values / Stats */}
      <section className="py-16 bg-bg-secondary border-y border-border-light">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-6 text-center"
            >
              <div className="w-16 h-16 mx-auto bg-accent-primary/10 rounded-2xl flex items-center justify-center mb-6 text-accent-primary">
                <TrendingUp className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">Strategic Growth</h3>
              <p className="text-text-secondary">Focused on long-term, sustainable wealth generation through diversified portfolios.</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-6 text-center"
            >
              <div className="w-16 h-16 mx-auto bg-accent-primary/10 rounded-2xl flex items-center justify-center mb-6 text-accent-primary">
                <Award className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">Excellence</h3>
              <p className="text-text-secondary">Committed to the highest standards of financial stewardship and market analysis.</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-6 text-center"
            >
              <div className="w-16 h-16 mx-auto bg-accent-primary/10 rounded-2xl flex items-center justify-center mb-6 text-accent-primary">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">Client-Centric</h3>
              <p className="text-text-secondary">Putting our investors first with transparent reporting and dedicated support.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Modal */}
      <AnimatePresence mode="wait">
        {selectedMember && !isPreviewOpen && (
          <div key="profile-modal" className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMember(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl bg-bg-secondary border border-border-light rounded-2xl shadow-2xl overflow-hidden z-10 max-h-[80vh] flex flex-col md:flex-row"
            >
              <button
                onClick={() => setSelectedMember(null)}
                className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors z-20"
              >
                <X className="w-5 h-5" />
              </button>

              <div 
                className="w-full md:w-2/5 h-56 md:h-auto shrink-0 relative cursor-pointer group"
                onClick={() => setIsPreviewOpen(true)}
              >
                <img 
                  src={selectedMember.image} 
                  alt={selectedMember.name} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <span className="bg-black/60 text-white text-xs px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                    Click to expand
                  </span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-bg-secondary to-transparent md:hidden pointer-events-none" />
              </div>

              <div className="w-full md:w-3/5 p-6 sm:p-8 overflow-y-auto custom-scrollbar">
                <div className="mb-6">
                  <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-2">{selectedMember.name}</h2>
                  <p className="text-accent-primary font-medium text-lg">{selectedMember.title}</p>
                </div>
                
                <div className="space-y-4 text-text-secondary leading-relaxed">
                  {selectedMember.bio.map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
        
        {selectedMember && isPreviewOpen && (
          <div key="preview-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPreviewOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10 w-full max-w-4xl max-h-[90vh] flex flex-col items-center justify-center"
            >
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="absolute -top-12 right-0 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-20"
              >
                <X className="w-6 h-6" />
              </button>
              <img 
                src={selectedMember.image} 
                alt={selectedMember.name} 
                className="w-full h-auto max-h-[85vh] object-contain rounded-lg shadow-2xl"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
