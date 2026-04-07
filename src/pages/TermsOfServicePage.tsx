import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Scale, AlertTriangle, UserPlus, CreditCard, ShieldCheck, HelpCircle, Globe, Home } from 'lucide-react';

const TermsOfServicePage = () => {
  return (
    <div className="min-h-screen bg-background pt-24 pb-16 px-6 lg:px-12 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link 
            to="/" 
            onClick={() => window.scrollTo(0, 0)}
            className="inline-flex items-center gap-2 text-accent-primary hover:text-accent-hover transition-colors font-medium"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
        <div 
          className="mb-12 text-center"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent-primary/10 text-accent-primary mb-6">
            <Scale className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">Terms of Service</h1>
          <p className="text-text-secondary text-lg">Last Updated: April 5, 2026</p>
        </div>

        <div className="bg-card border border-border rounded-3xl p-8 md:p-12 shadow-sm space-y-10 text-text-secondary leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4 flex items-center gap-3">
              <Globe className="w-6 h-6 text-accent-primary" />
              1. Agreement to Terms
            </h2>
            <p className="mb-4">
              These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity (“you”) and Capital Growth Alliance (“CGA”, “we”, “us”, or “our”), concerning your access to and use of the https://cgatrades.com website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto (collectively, the “Site”).
            </p>
            <p className="mb-4">
              You agree that by accessing the Site, you have read, understood, and agreed to be bound by all of these Terms of Service. IF YOU DO NOT AGREE WITH ALL OF THESE TERMS OF SERVICE, THEN YOU ARE EXPRESSLY PROHIBITED FROM USING THE SITE AND YOU MUST DISCONTINUE USE IMMEDIATELY.
            </p>
            <p className="mb-4">
              Supplemental terms and conditions or documents that may be posted on the Site from time to time are hereby expressly incorporated herein by reference. We reserve the right, in our sole discretion, to make changes or modifications to these Terms of Service at any time and for any reason. We will alert you about any changes by updating the “Last updated” date of these Terms of Service, and you waive any right to receive specific notice of each such change.
            </p>
            <p>
              It is your responsibility to periodically review these Terms of Service to stay informed of updates. You will be subject to, and will be deemed to have been made aware of and to have accepted, the changes in any revised Terms of Service by your continued use of the Site after the date such revised Terms of Service are posted.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4 flex items-center gap-3">
              <UserPlus className="w-6 h-6 text-accent-primary" />
              2. User Representations
            </h2>
            <p className="mb-4">By using the Site, you represent and warrant that:</p>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li>All registration information you submit will be true, accurate, current, and complete;</li>
              <li>You will maintain the accuracy of such information and promptly update such registration information as necessary;</li>
              <li>You have the legal capacity and you agree to comply with these Terms of Service;</li>
              <li>You are not a minor in the jurisdiction in which you reside;</li>
              <li>You will not access the Site through automated or non-human means, whether through a bot, script, or otherwise;</li>
              <li>You will not use the Site for any illegal or unauthorized purpose;</li>
              <li>Your use of the Site will not violate any applicable law or regulation.</li>
            </ul>
            <p>
              If you provide any information that is untrue, inaccurate, not current, or incomplete, we have the right to suspend or terminate your account and refuse any and all current or future use of the Site (or any portion thereof).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4 flex items-center gap-3">
              <CreditCard className="w-6 h-6 text-accent-primary" />
              3. Investment Services & Risks
            </h2>
            <p className="mb-4">
              CGA provides an automated investment platform. By using our services, you acknowledge and agree to the following:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li><strong>No Financial Advice:</strong> The information provided on the Site does not constitute investment advice, financial advice, trading advice, or any other sort of advice and you should not treat any of the Site's content as such. CGA does not recommend that any cryptocurrency or investment product should be bought, sold, or held by you.</li>
              <li><strong>Risk of Loss:</strong> All investments involve risk, and the past performance of a security, industry, sector, market, financial product, investment strategy, or individual's trading does not guarantee future results or returns. Investors are fully responsible for any investment decisions they make. Such decisions should be based solely on an evaluation of their financial circumstances, investment objectives, risk tolerance, and liquidity needs.</li>
              <li><strong>Market Volatility:</strong> You acknowledge that the value of investments can go down as well as up and you may not get back the amount you originally invested. Cryptocurrency markets are particularly volatile and carry a high degree of risk.</li>
              <li><strong>Automated Trading:</strong> Our platform uses algorithms and automated systems to manage investments. While we strive for accuracy and performance, we are not liable for losses resulting from system failures, connectivity issues, or algorithmic errors.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4 flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-accent-primary" />
              4. Prohibited Activities
            </h2>
            <p className="mb-4">
              You may not access or use the Site for any purpose other than that for which we make the Site available. The Site may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.
            </p>
            <p className="mb-4 font-medium text-text-primary">As a user of the Site, you agree not to:</p>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li>Systematically retrieve data or other content from the Site to create or compile, directly or indirectly, a collection, compilation, database, or directory without written permission from us.</li>
              <li>Trick, defraud, or mislead us and other users, especially in any attempt to learn sensitive account information such as user passwords.</li>
              <li>Circumvent, disable, or otherwise interfere with security-related features of the Site, including features that prevent or restrict the use or copying of any Content or enforce limitations on the use of the Site and/or the Content contained therein.</li>
              <li>Disparage, tarnish, or otherwise harm, in our opinion, us and/or the Site.</li>
              <li>Use any information obtained from the Site in order to harass, abuse, or harm another person.</li>
              <li>Make improper use of our support services or submit false reports of abuse or misconduct.</li>
              <li>Use the Site in a manner inconsistent with any applicable laws or regulations.</li>
              <li>Engage in unauthorized framing of or linking to the Site.</li>
              <li>Upload or transmit (or attempt to upload or to transmit) viruses, Trojan horses, or other material, including excessive use of capital letters and spamming (continuous posting of repetitive text), that interferes with any party’s uninterrupted use and enjoyment of the Site or modifies, impairs, disrupts, alters, or interferes with the use, features, functions, operation, or maintenance of the Site.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4 flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-accent-primary" />
              5. Limitation of Liability
            </h2>
            <p className="mb-4">
              IN NO EVENT WILL WE OR OUR DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE TO YOU OR ANY THIRD PARTY FOR ANY DIRECT, INDIRECT, CONSEQUENTIAL, EXEMPLARY, INCIDENTAL, SPECIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFIT, LOST REVENUE, LOSS OF DATA, OR OTHER DAMAGES ARISING FROM YOUR USE OF THE SITE, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
            </p>
            <p>
              NOTWITHSTANDING ANYTHING TO THE CONTRARY CONTAINED HEREIN, OUR LIABILITY TO YOU FOR ANY CAUSE WHATSOEVER AND REGARDLESS OF THE FORM OF THE ACTION, WILL AT ALL TIMES BE LIMITED TO THE AMOUNT PAID, IF ANY, BY YOU TO US DURING THE SIX (6) MONTH PERIOD PRIOR TO ANY CAUSE OF ACTION ARISING. CERTAIN US STATE LAWS AND INTERNATIONAL LAWS DO NOT ALLOW LIMITATIONS ON IMPLIED WARRANTIES OR THE EXCLUSION OR LIMITATION OF CERTAIN DAMAGES. IF THESE LAWS APPLY TO YOU, SOME OR ALL OF THE ABOVE DISCLAIMERS OR LIMITATIONS MAY NOT APPLY TO YOU, AND YOU MAY HAVE ADDITIONAL RIGHTS.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4 flex items-center gap-3">
              <FileText className="w-6 h-6 text-accent-primary" />
              6. Term and Termination
            </h2>
            <p className="mb-4">
              These Terms of Service shall remain in full force and effect while you use the Site. WITHOUT LIMITING ANY OTHER PROVISION OF THESE TERMS OF SERVICE, WE RESERVE THE RIGHT TO, IN OUR SOLE DISCRETION AND WITHOUT NOTICE OR LIABILITY, DENY ACCESS TO AND USE OF THE SITE (INCLUDING BLOCKING CERTAIN IP ADDRESSES), TO ANY PERSON FOR ANY REASON OR FOR NO REASON, INCLUDING WITHOUT LIMITATION FOR BREACH OF ANY REPRESENTATION, WARRANTY, OR COVENANT CONTAINED IN THESE TERMS OF SERVICE OR OF ANY APPLICABLE LAW OR REGULATION. WE MAY TERMINATE YOUR USE OR PARTICIPATION IN THE SITE OR DELETE YOUR ACCOUNT AND ANY CONTENT OR INFORMATION THAT YOU POSTED AT ANY TIME, WITHOUT WARNING, IN OUR SOLE DISCRETION.
            </p>
            <p>
              If we terminate or suspend your account for any reason, you are prohibited from registering and creating a new account under your name, a fake or borrowed name, or the name of any third party, even if you may be acting on behalf of the third party. In addition to terminating or suspending your account, we reserve the right to take appropriate legal action, including without limitation pursuing civil, criminal, and injunctive redress.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4 flex items-center gap-3">
              <HelpCircle className="w-6 h-6 text-accent-primary" />
              7. Contact Us
            </h2>
            <p className="mb-4">
              In order to resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at:
            </p>
            <p className="font-medium text-text-primary">
              Capital Growth Alliance<br />
              123 Investment Way, Suite 500<br />
              Financial District, London, UK<br />
              Email: info@cgatrades.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;
