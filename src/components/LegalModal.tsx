import React from 'react';
import { X } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'terms' | 'privacy';
}

export default function LegalModal({ isOpen, onClose, type }: LegalModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-bg-secondary border border-border-light rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between p-6 border-b border-border-light shrink-0">
          <h2 className="text-2xl font-bold text-text-primary">
            {type === 'terms' ? 'Terms of Service' : 'Privacy Policy'}
          </h2>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary transition-colors p-2 rounded-full hover:bg-white/5">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          <div className="prose prose-invert prose-lg max-w-none">
            <p className="text-text-secondary mb-8"><strong>Last Updated:</strong> June 28, 2024</p>

            {type === 'terms' ? (
              <div className="space-y-8 text-text-secondary leading-relaxed text-base">
                <section>
                  <h3 className="text-xl font-bold text-white mb-3">1. Introduction</h3>
                  <p>
                    Welcome to Capital Growth Alliance (CGA). These Terms of Service govern your access to and use of our platform, services, infrastructure, and all associated financial tools. By accessing or using the platform, you agree to be fully bound by these Terms.
                  </p>
                  <p className="mt-3">
                    CGA operates as a digital investment platform leveraging global financial technologies, liquidity access systems, and strategic integrations to deliver structured investment opportunities to users worldwide.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-bold text-white mb-3">2. Operational Framework and Strategic Integrations</h3>
                  <p>
                    CGA operates within a global financial ecosystem and utilizes liquidity access and analytical tools across multiple third-party infrastructures. The platform may interact with or draw liquidity insights from major exchanges and financial service providers including but not limited to:
                  </p>
                  <ul className="list-disc pl-6 mt-3 space-y-1">
                    <li>Binance</li>
                    <li>Bybit</li>
                    <li>Coinbase</li>
                    <li>KuCoin</li>
                    <li>OKEx</li>
                    <li>TradingView</li>
                    <li>Headway</li>
                    <li>Exness</li>
                    <li>Oanda</li>
                    <li>IC Markets</li>
                    <li>OctaFX</li>
                  </ul>
                  <p className="mt-3">
                    CGA may utilize liquidity pool structures and trading data environments sourced through such platforms to optimize operational efficiency, market insights, and financial modeling. However, these entities do not manage user accounts on CGA, and users do not have direct accounts with these providers through CGA unless independently created.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-bold text-white mb-3">3. Eligibility and Account Registration</h3>
                  <p>
                    Users must be at least 18 years old and capable of entering a legally binding agreement. All registration information must be accurate and maintained up to date.
                  </p>
                  <p className="mt-3">
                    Users are responsible for all activities conducted under their accounts.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-bold text-white mb-3">4. Nature of Services</h3>
                  <p>
                    CGA provides structured digital investment plans, referral-based earning systems, and account management tools. All services are provided on an "as-is" basis without guarantees of uninterrupted operation or guaranteed returns.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-bold text-white mb-3">5. Investment Risk Disclosure</h3>
                  <p>
                    All financial activities involve risk. Users acknowledge that:
                  </p>
                  <ul className="list-disc pl-6 mt-3 space-y-1">
                    <li>Returns are not guaranteed</li>
                    <li>Market volatility and system variables may affect performance</li>
                    <li>Partial or total loss of capital is possible</li>
                  </ul>
                  <p className="mt-3">
                    Users accept full responsibility for their financial decisions.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-bold text-white mb-3">6. User Conduct</h3>
                  <p>
                    Users agree not to engage in:
                  </p>
                  <ul className="list-disc pl-6 mt-3 space-y-1">
                    <li>Fraudulent activity</li>
                    <li>System manipulation</li>
                    <li>Abuse of referral systems</li>
                    <li>Unauthorized access attempts</li>
                  </ul>
                  <p className="mt-3">
                    Violations may result in immediate account suspension.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-bold text-white mb-3">7. Deposits and Withdrawals</h3>
                  <p>
                    All financial transactions are subject to:
                  </p>
                  <ul className="list-disc pl-6 mt-3 space-y-1">
                    <li>Platform rules and verification procedures</li>
                    <li>Security checks and compliance reviews</li>
                    <li>Processing timelines that may vary</li>
                  </ul>
                  <p className="mt-3">
                    CGA reserves the right to delay or investigate suspicious transactions.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-bold text-white mb-3">8. Referral Program Integrity</h3>
                  <p>
                    The referral system is strictly monitored. Any attempt to manipulate referral earnings through artificial means will result in penalties, including account termination.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-bold text-white mb-3">9. Account Suspension and Termination</h3>
                  <p>
                    Accounts may be suspended or terminated if:
                  </p>
                  <ul className="list-disc pl-6 mt-3 space-y-1">
                    <li>Terms are violated</li>
                    <li>Security risks are detected</li>
                    <li>Fraudulent behavior is identified</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-xl font-bold text-white mb-3">10. Limitation of Liability</h3>
                  <p>
                    CGA is not liable for:
                  </p>
                  <ul className="list-disc pl-6 mt-3 space-y-1">
                    <li>Financial losses</li>
                    <li>Market fluctuations</li>
                    <li>System interruptions</li>
                    <li>External service dependencies</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-xl font-bold text-white mb-3">11. Intellectual Property</h3>
                  <p>
                    All platform content, systems, and design remain the exclusive property of CGA.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-bold text-white mb-3">12. Modifications</h3>
                  <p>
                    CGA reserves the right to update these Terms at any time. Continued use implies acceptance.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-bold text-white mb-3">13. Contact</h3>
                  <p>
                    Users may contact support for inquiries related to these Terms.
                  </p>
                </section>
              </div>
            ) : (
              <div className="space-y-8 text-text-secondary leading-relaxed text-base">
                <section>
                  <h3 className="text-xl font-bold text-white mb-3">1. Introduction</h3>
                  <p>
                    Capital Growth Alliance (CGA) is committed to protecting user privacy and ensuring the secure handling of all personal and financial data.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-bold text-white mb-3">2. Global Infrastructure and Data Handling</h3>
                  <p>
                    CGA operates using global infrastructure systems and may interact with external analytical and liquidity platforms such as:
                  </p>
                  <ul className="list-disc pl-6 mt-3 space-y-1">
                    <li>Binance</li>
                    <li>Bybit</li>
                    <li>Coinbase</li>
                    <li>KuCoin</li>
                    <li>OKEx</li>
                    <li>TradingView</li>
                    <li>Headway</li>
                    <li>Exness</li>
                    <li>Oanda</li>
                    <li>IC Markets</li>
                    <li>OctaFX</li>
                  </ul>
                  <p className="mt-3">
                    These integrations are used for operational, analytical, and liquidity-related purposes. However, CGA does not share personal user data with these entities except where required for essential operations or legal compliance.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-bold text-white mb-3">3. Information Collected</h3>
                  <p>
                    We collect:
                  </p>
                  <ul className="list-disc pl-6 mt-3 space-y-1">
                    <li>Personal data (name, email)</li>
                    <li>Transaction data</li>
                    <li>Technical/device data</li>
                    <li>Usage analytics</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-xl font-bold text-white mb-3">4. Use of Information</h3>
                  <p>
                    Data is used to:
                  </p>
                  <ul className="list-disc pl-6 mt-3 space-y-1">
                    <li>Operate platform services</li>
                    <li>Process financial activities</li>
                    <li>Improve performance</li>
                    <li>Detect fraud</li>
                    <li>Communicate with users</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-xl font-bold text-white mb-3">5. Data Security</h3>
                  <p>
                    We implement:
                  </p>
                  <ul className="list-disc pl-6 mt-3 space-y-1">
                    <li>Encryption protocols</li>
                    <li>Secure infrastructure</li>
                    <li>Access restrictions</li>
                  </ul>
                  <p className="mt-3">
                    Users acknowledge that no system is entirely risk-free.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-bold text-white mb-3">6. Data Sharing</h3>
                  <p>
                    We do not sell personal data. Information may only be disclosed:
                  </p>
                  <ul className="list-disc pl-6 mt-3 space-y-1">
                    <li>When legally required</li>
                    <li>For operational purposes</li>
                    <li>To protect system integrity</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-xl font-bold text-white mb-3">7. Cookies</h3>
                  <p>
                    Cookies are used to enhance experience and analyze usage. Users can manage preferences through browser settings.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-bold text-white mb-3">8. User Rights</h3>
                  <p>
                    Users may:
                  </p>
                  <ul className="list-disc pl-6 mt-3 space-y-1">
                    <li>Access their data</li>
                    <li>Request corrections</li>
                    <li>Request deletion (subject to policy constraints)</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-xl font-bold text-white mb-3">9. Data Retention</h3>
                  <p>
                    Data is retained only as necessary for operational and legal purposes.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-bold text-white mb-3">10. User Security Responsibility</h3>
                  <p>
                    Users must:
                  </p>
                  <ul className="list-disc pl-6 mt-3 space-y-1">
                    <li>Protect login credentials</li>
                    <li>Use secure devices</li>
                    <li>Avoid unauthorized access</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-xl font-bold text-white mb-3">11. Policy Updates</h3>
                  <p>
                    This policy may be updated periodically. Continued use implies acceptance.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-bold text-white mb-3">12. Contact</h3>
                  <p>
                    Users may contact support for privacy-related concerns.
                  </p>
                </section>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-border-light shrink-0 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl font-medium text-slate-900 bg-accent-primary hover:bg-accent-hover transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
