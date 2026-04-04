import React from 'react';
import { motion } from 'motion/react';
import { 
  Brain, 
  Cpu, 
  ShieldCheck, 
  BarChart3, 
  Lock, 
  Zap, 
  ArrowRight, 
  ChevronRight,
  LineChart,
  PieChart,
  Activity,
  Globe,
  Database,
  UserCheck,
  MessageSquare,
  TrendingUp,
  Target,
  LayoutDashboard,
  Settings
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const chartData = [
  { name: 'Day 1', value: 100 },
  { name: 'Day 5', value: 115 },
  { name: 'Day 10', value: 132 },
  { name: 'Day 15', value: 155 },
  { name: 'Day 20', value: 184 },
  { name: 'Day 25', value: 218 },
  { name: 'Day 30', value: 265 },
];

const GlassPanel = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className={`bg-white/5 dark:bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.2)] ${className}`}
  >
    {children}
  </motion.div>
);

const SectionHeader = ({ title, subtitle, icon: Icon }: { title: string, subtitle: string, icon: any }) => (
  <div className="flex flex-col items-center text-center mb-12">
    <div className="w-16 h-16 bg-accent-primary/10 rounded-2xl flex items-center justify-center mb-6 border border-accent-primary/20 shadow-[0_0_20px_rgba(200,255,0,0.2)]">
      <Icon className="w-8 h-8 text-accent-primary" />
    </div>
    <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4 tracking-tight">{title}</h2>
    <p className="text-text-secondary max-w-2xl text-lg leading-relaxed">{subtitle}</p>
  </div>
);

export default function HowItWorksPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-[#050505] relative overflow-hidden">
      {/* Futuristic Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent-primary/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-32">
        {/* Hero Section */}
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-primary/10 border border-accent-primary/20 text-accent-primary text-sm font-bold mb-8"
          >
            <Zap className="w-4 h-4" />
            THE FUTURE OF TRADING
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-8 tracking-tighter">
            How <span className="text-accent-primary">CGA</span> Works
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Experience the synergy of advanced Artificial Intelligence and professional human expertise. 
            Our platform automates wealth generation with military-grade precision.
          </p>
        </div>

        {/* 1. Market Analysis */}
        <section className="mb-32">
          <SectionHeader 
            icon={Brain}
            title="1. Market Analysis with AI Intelligence"
            subtitle="Our AI-driven algorithms continuously scan global financial markets to identify profitable investment opportunities."
          />
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4 md:gap-8 items-center">
            <GlassPanel className="relative overflow-hidden group p-4 md:p-8">
              <div className="absolute top-0 right-0 p-2 md:p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Globe className="w-16 md:w-32 h-16 md:h-32" />
              </div>
              <h3 className="text-lg md:text-2xl font-bold text-white mb-3 md:mb-6">Advanced Algorithms</h3>
              <p className="text-slate-400 mb-4 md:mb-8 leading-relaxed text-xs md:text-base hidden sm:block">
                At Capital Growth Alliance (CGA), our system monitors stocks, commodities, indices, cryptocurrencies, and other tradable assets. 
              </p>
              <ul className="space-y-2 md:space-y-4">
                {[
                  { title: "ML", fullTitle: "Machine Learning", desc: "Models evaluate market volatility." },
                  { title: "SA", fullTitle: "Sentiment Analysis", desc: "AI reads news feeds." },
                  { title: "RS", fullTitle: "Risk Scoring", desc: "Optimal allocation." }
                ].map((item, i) => (
                  <li key={i} className="flex gap-2 md:gap-4">
                    <div className="w-4 h-4 md:w-6 md:h-6 rounded-full bg-accent-primary/20 flex items-center justify-center shrink-0 mt-1">
                      <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-accent-primary" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-[10px] md:text-sm">{item.fullTitle}</h4>
                      <p className="text-slate-500 text-[8px] md:text-sm hidden md:block">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </GlassPanel>
            <div className="relative">
              <div className="absolute inset-0 bg-accent-primary/20 blur-3xl rounded-full" />
              <GlassPanel className="relative border-accent-primary/20 p-4 md:p-8">
                <div className="h-[150px] md:h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#c8ff00" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#c8ff00" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                      <XAxis dataKey="name" stroke="#ffffff40" fontSize={10} />
                      <YAxis stroke="#ffffff40" fontSize={10} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff20', borderRadius: '12px' }}
                        itemStyle={{ color: '#c8ff00' }}
                      />
                      <Area type="monotone" dataKey="value" stroke="#c8ff00" fillOpacity={1} fill="url(#colorValue)" strokeWidth={3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-6 flex justify-between items-center">
                  <div className="text-xs text-slate-500 uppercase font-bold tracking-widest">AI Market Trend Prediction</div>
                  <div className="flex items-center gap-2 text-emerald-500 text-sm font-bold">
                    <TrendingUp className="w-4 h-4" /> +165% Accuracy
                  </div>
                </div>
              </GlassPanel>
            </div>
          </div>
        </section>

        {/* 2. Trade Execution */}
        <section className="mb-32">
          <SectionHeader 
            icon={Cpu}
            title="2. Trade Execution by Intelligent Systems"
            subtitle="Automated execution, precision targeting, and portfolio diversification with minimal human error."
          />
          <GlassPanel className="p-4 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: Zap, title: "High-Speed Trading", desc: "The system can execute hundreds of trades in milliseconds, capturing micro-opportunities." },
                { icon: Target, title: "Precision Targeting", desc: "Orders are placed at optimal price points to maximize returns and minimize slippage." },
                { icon: PieChart, title: "Portfolio Diversification", desc: "Trades are balanced across multiple assets to reduce overall risk exposure." }
              ].map((card, i) => (
                <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-accent-primary/30 transition-colors">
                  <card.icon className="w-10 h-10 text-accent-primary mb-6" />
                  <h3 className="text-xl font-bold text-white mb-4">{card.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{card.desc}</p>
                </div>
              ))}
            </div>
          </GlassPanel>
        </section>

        {/* 3. Professional Oversight */}
        <section className="mb-32">
          <SectionHeader 
            icon={UserCheck}
            title="3. Professional Oversight & Expert Monitoring"
            subtitle="Human intelligence complements artificial intelligence for maximum security and performance."
          />
          <GlassPanel className="bg-gradient-to-br from-accent-primary/5 to-transparent">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                    <Activity className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-2">Continuous Monitoring</h4>
                    <p className="text-slate-400 text-sm">Traders monitor AI outputs for anomalies and verify high-stakes trades 24/7.</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0">
                    <Settings className="w-6 h-6 text-purple-500" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-2">Manual Intervention</h4>
                    <p className="text-slate-400 text-sm">Professionals can adjust strategies if unusual market conditions arise.</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-2">Security Protocols</h4>
                    <p className="text-slate-400 text-sm">Every transaction is encrypted and logged for full auditability and transparency.</p>
                  </div>
                </div>
              </div>
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10">
                <img 
                  src="https://picsum.photos/seed/trading-floor/800/450" 
                  alt="Professional Monitoring" 
                  className="w-full h-full object-cover opacity-50"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <div className="flex items-center gap-2 text-accent-primary font-bold text-xs uppercase tracking-widest">
                    <div className="w-2 h-2 rounded-full bg-accent-primary animate-ping" />
                    Live Expert Oversight Active
                  </div>
                </div>
              </div>
            </div>
          </GlassPanel>
        </section>

        {/* 4. Profit Distribution */}
        <section className="mb-32">
          <SectionHeader 
            icon={BarChart3}
            title="4. Profit Distribution & Growth Tracking"
            subtitle="Transparent earnings with automated daily ROI based on your investment tier."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { tier: "Regular", range: "$100 – $49,999", roi: "2.5%", color: "from-blue-400 to-blue-600" },
              { tier: "Premium", range: "$50,000 – $999,999", roi: "2.7%", color: "from-accent-primary to-emerald-400" },
              { tier: "Elite", range: "$1,000,000 – $10,000,000+", roi: "2.9%", color: "from-purple-400 to-purple-600" }
            ].map((plan, i) => (
              <GlassPanel key={i} className="text-center group hover:scale-[1.02] transition-transform">
                <div className={`text-sm font-bold uppercase tracking-widest mb-4 text-slate-500`}>{plan.tier}</div>
                <div className={`text-4xl font-black mb-2 bg-clip-text text-transparent bg-gradient-to-r ${plan.color}`}>
                  {plan.roi}
                </div>
                <div className="text-xs text-slate-400 mb-6">Daily ROI</div>
                <div className="py-2 px-4 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-white">
                  {plan.range}
                </div>
              </GlassPanel>
            ))}
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            <GlassPanel className="flex items-start gap-6">
              <div className="w-12 h-12 rounded-xl bg-accent-primary/10 flex items-center justify-center shrink-0">
                <LayoutDashboard className="w-6 h-6 text-accent-primary" />
              </div>
              <div>
                <h4 className="text-white font-bold mb-2">Transparent Earnings</h4>
                <p className="text-slate-400 text-sm">Each user’s dashboard displays real-time profit updates and detailed performance metrics.</p>
              </div>
            </GlassPanel>
            <GlassPanel className="flex items-start gap-6">
              <div className="w-12 h-12 rounded-xl bg-accent-primary/10 flex items-center justify-center shrink-0">
                <Zap className="w-6 h-6 text-accent-primary" />
              </div>
              <div>
                <h4 className="text-white font-bold mb-2">Automated Withdrawals</h4>
                <p className="text-slate-400 text-sm">Users can schedule withdrawals or reinvest for compounding growth automatically.</p>
              </div>
            </GlassPanel>
          </div>
        </section>

        {/* 5. Security & Technology */}
        <section className="mb-32">
          <SectionHeader 
            icon={ShieldCheck}
            title="5. Security & Technology"
            subtitle="CGA employs military-grade security protocols to safeguard every transaction and personal detail."
          />
          <div className="flex overflow-x-auto pb-8 md:grid md:grid-cols-3 gap-8 no-scrollbar snap-x">
            {[
              { icon: Lock, title: "Data Encryption", desc: "All user data and transactions are encrypted with advanced military-grade algorithms." },
              { icon: UserCheck, title: "2FA Security", desc: "Extra security layer ensures only authorized access via two-factor authentication." },
              { icon: Database, title: "System Redundancy", desc: "Backup servers ensure uninterrupted service and prevent any potential downtime." }
            ].map((item, i) => (
              <div key={i} className="text-center p-8 min-w-[280px] md:min-w-0 snap-center bg-white/5 rounded-3xl border border-white/10 md:bg-transparent md:border-0">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
                  <item.icon className="w-8 h-8 text-accent-primary" />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 6. Visual Insights */}
        <section className="mb-32">
          <SectionHeader 
            icon={LineChart}
            title="6. Visual Insights & Interactive Reporting"
            subtitle="Detailed analytics to help users understand how their investments grow over time."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <GlassPanel className="flex flex-col items-center text-center">
              <Activity className="w-10 h-10 text-accent-primary mb-6" />
              <h4 className="text-white font-bold mb-3">Real-Time Charts</h4>
              <p className="text-slate-400 text-sm">Track portfolio performance with dynamic graphs and live data streams.</p>
            </GlassPanel>
            <GlassPanel className="flex flex-col items-center text-center">
              <Brain className="w-10 h-10 text-accent-primary mb-6" />
              <h4 className="text-white font-bold mb-3">Predictive Insights</h4>
              <p className="text-slate-400 text-sm">AI generates predictive models to show potential future earnings based on market data.</p>
            </GlassPanel>
            <GlassPanel className="flex flex-col items-center text-center md:col-span-2 lg:col-span-1">
              <Database className="w-10 h-10 text-accent-primary mb-6" />
              <h4 className="text-white font-bold mb-3">Custom Reports</h4>
              <p className="text-slate-400 text-sm">Users can export summaries of their investment performance in multiple formats.</p>
            </GlassPanel>
          </div>
        </section>

        {/* 7. Getting Started */}
        <section className="mb-32" id="get-started-now">
          <SectionHeader 
            icon={Zap}
            title="7. Getting Started"
            subtitle="Follow these simple steps to begin your journey towards financial freedom."
          />
          <div className="flex overflow-x-auto pb-8 md:grid md:grid-cols-5 gap-4 relative no-scrollbar snap-x">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-accent-primary/0 via-accent-primary/20 to-accent-primary/0 -translate-y-1/2" />
            
            {[
              { step: "01", title: "Sign Up", desc: "Create an account on CGA with basic info." },
              { step: "02", title: "Deposit", desc: "Fund your account via secure channels." },
              { step: "03", title: "Choose Plan", desc: "Select Regular, Premium, or Elite." },
              { step: "04", title: "AI Trades", desc: "Sit back as AI analyzes and executes." },
              { step: "05", title: "Withdraw", desc: "Track ROI and withdraw profits." }
            ].map((item, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center text-center group min-w-[200px] md:min-w-0 snap-center">
                <div className="w-12 h-12 rounded-full bg-slate-900 border-2 border-accent-primary/30 flex items-center justify-center text-accent-primary font-black mb-6 group-hover:border-accent-primary group-hover:shadow-[0_0_15px_rgba(200,255,0,0.5)] transition-all">
                  {item.step}
                </div>
                <h4 className="text-white font-bold mb-2">{item.title}</h4>
                <p className="text-slate-500 text-xs leading-relaxed px-4">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <GlassPanel className="text-center py-16 border-accent-primary/20 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent-primary to-transparent" />
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">Ready to Invest?</h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button 
              onClick={() => navigate('/invest')}
              className="px-10 py-4 bg-accent-primary text-slate-900 font-bold rounded-2xl hover:bg-[#b3e600] hover:shadow-[0_0_30px_rgba(200,255,0,0.4)] transition-all flex items-center gap-2 group"
            >
              Get Started Now
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => navigate('/contact')}
              className="px-10 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition-all flex items-center gap-2"
            >
              <MessageSquare className="w-5 h-5" />
              Contact Us Now
            </button>
          </div>
          <p className="mt-12 text-slate-500 text-sm max-w-2xl mx-auto">
            By combining advanced AI, expert oversight, and automated execution, CGA provides a safe, transparent, and highly profitable investment platform.
          </p>
        </GlassPanel>
      </div>
    </div>
  );
}
