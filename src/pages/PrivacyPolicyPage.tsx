import React from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, Eye, FileText, Globe, UserCheck, Bell, HelpCircle } from 'lucide-react';

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-background pt-24 pb-16 px-6 lg:px-12 font-sans">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent-primary/10 text-accent-primary mb-6">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">Privacy Policy</h1>
          <p className="text-text-secondary text-lg">Last Updated: April 5, 2026</p>
        </motion.div>

        <div className="bg-card border border-border rounded-3xl p-8 md:p-12 shadow-sm space-y-10 text-text-secondary leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4 flex items-center gap-3">
              <Globe className="w-6 h-6 text-accent-primary" />
              1. Introduction
            </h2>
            <p className="mb-4">
              Welcome to Capital Growth Alliance ("CGA", "we", "us", or "our"). We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy notice, or our practices with regards to your personal information, please contact us at info@cgatrades.com.
            </p>
            <p className="mb-4">
              When you visit our website https://cgatrades.com (the "Website"), and more generally, use any of our services (the "Services", which include the Website), we appreciate that you are trusting us with your personal information. We take your privacy very seriously. In this privacy notice, we seek to explain to you in the clearest way possible what information we collect, how we use it and what rights you have in relation to it. We hope you take some time to read through it carefully, as it is important. If there are any terms in this privacy notice that you do not agree with, please discontinue use of our Services immediately.
            </p>
            <p>
              This privacy notice applies to all information collected through our Services (which, as described above, includes our Website), as well as, any related services, sales, marketing or events.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4 flex items-center gap-3">
              <Eye className="w-6 h-6 text-accent-primary" />
              2. Information We Collect
            </h2>
            <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">Personal information you disclose to us</h3>
            <p className="mb-4">
              <strong>In Short:</strong> We collect personal information that you provide to us.
            </p>
            <p className="mb-4">
              We collect personal information that you voluntarily provide to us when you register on the Website, express an interest in obtaining information about us or our products and Services, when you participate in activities on the Website or otherwise when you contact us.
            </p>
            <p className="mb-4 font-medium text-text-primary">The personal information that we collect depends on the context of your interactions with us and the Website, the choices you make and the products and features you use. The personal information we collect may include the following:</p>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li><strong>Personal Information Provided by You:</strong> We collect names; phone numbers; email addresses; mailing addresses; usernames; passwords; contact preferences; contact or authentication data; billing addresses; debit/credit card numbers; and other similar information.</li>
              <li><strong>Financial Information:</strong> We collect information related to your investment activities, including transaction history, wallet addresses (for cryptocurrency transactions), investment preferences, and risk profiles.</li>
              <li><strong>Verification Data:</strong> To comply with Know Your Customer (KYC) and Anti-Money Laundering (AML) regulations, we may collect government-issued identification, proof of address, and other documentation required for identity verification.</li>
            </ul>
            <p className="mb-4">
              All personal information that you provide to us must be true, complete and accurate, and you must notify us of any changes to such personal information.
            </p>

            <h3 className="text-xl font-semibold text-text-primary mt-8 mb-3">Information automatically collected</h3>
            <p className="mb-4">
              <strong>In Short:</strong> Some information — such as your Internet Protocol (IP) address and/or browser and device characteristics — is collected automatically when you visit our Website.
            </p>
            <p className="mb-4">
              We automatically collect certain information when you visit, use or navigate the Website. This information does not reveal your specific identity (like your name or contact information) but may include device and usage information, such as your IP address, browser and device characteristics, operating system, language preferences, referring URLs, device name, country, location, information about how and when you use our Website and other technical information. This information is primarily needed to maintain the security and operation of our Website, and for our internal analytics and reporting purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4 flex items-center gap-3">
              <Lock className="w-6 h-6 text-accent-primary" />
              3. How We Use Your Information
            </h2>
            <p className="mb-4">
              <strong>In Short:</strong> We process your information for purposes based on legitimate business interests, the fulfillment of our contract with you, compliance with our legal obligations, and/or your consent.
            </p>
            <p className="mb-4">We use personal information collected via our Website for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations. We indicate the specific processing grounds we rely on next to each purpose listed below.</p>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li><strong>To facilitate account creation and logon process:</strong> If you choose to link your account with us to a third-party account (such as your Google or Facebook account), we use the information you allowed us to collect from those third parties to facilitate account creation and logon process for the performance of the contract.</li>
              <li><strong>To post testimonials:</strong> We post testimonials on our Website that may contain personal information. Prior to posting a testimonial, we will obtain your consent to use your name and the content of the testimonial.</li>
              <li><strong>Request feedback:</strong> We may use your information to request feedback and to contact you about your use of our Website.</li>
              <li><strong>To enable user-to-user communications:</strong> We may use your information in order to enable user-to-user communications with each user's consent.</li>
              <li><strong>To manage user accounts:</strong> We may use your information for the purposes of managing our account and keeping it in working order.</li>
              <li><strong>To fulfill and manage your investments:</strong> We use your information to process your investment requests, manage your portfolio, and provide you with updates on your investment performance.</li>
              <li><strong>To send administrative information to you:</strong> We may use your personal information to send you product, service and new feature information and/or information about changes to our terms, conditions, and policies.</li>
              <li><strong>To protect our Services:</strong> We may use your information as part of our efforts to keep our Website safe and secure (for example, for fraud monitoring and prevention).</li>
              <li><strong>To enforce our terms, conditions and policies for business purposes, to comply with legal and regulatory requirements or in connection with our contract.</strong></li>
              <li><strong>To respond to legal requests and prevent harm:</strong> If we receive a subpoena or other legal request, we may need to inspect the data we hold to determine how to respond.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4 flex items-center gap-3">
              <UserCheck className="w-6 h-6 text-accent-primary" />
              4. Will Your Information Be Shared With Anyone?
            </h2>
            <p className="mb-4">
              <strong>In Short:</strong> We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.
            </p>
            <p className="mb-4">We may process or share your data that we hold based on the following legal basis:</p>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li><strong>Consent:</strong> We may process your data if you have given us specific consent to use your personal information for a specific purpose.</li>
              <li><strong>Legitimate Interests:</strong> We may process your data when it is reasonably necessary to achieve our legitimate business interests.</li>
              <li><strong>Performance of a Contract:</strong> Where we have entered into a contract with you, we may process your personal information to fulfill the terms of our contract.</li>
              <li><strong>Legal Obligations:</strong> We may disclose your information where we are legally required to do so in order to comply with applicable law, governmental requests, a judicial proceeding, court order, or legal process, such as in response to a court order or a subpoena (including in response to public authorities to meet national security or law enforcement requirements).</li>
              <li><strong>Vital Interests:</strong> We may disclose your information where we believe it is necessary to investigate, prevent, or take action regarding potential violations of our policies, suspected fraud, situations involving potential threats to the safety of any person and illegal activities, or as evidence in litigation in which we are involved.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4 flex items-center gap-3">
              <FileText className="w-6 h-6 text-accent-primary" />
              5. Use of Cookies and Other Tracking Technologies
            </h2>
            <p className="mb-4">
              <strong>In Short:</strong> We may use cookies and other tracking technologies to collect and store your information.
            </p>
            <p className="mb-4">
              We may use cookies and similar tracking technologies (like web beacons and pixels) to access or store information. Specific information about how we use such technologies and how you can refuse certain cookies is set out in our Cookie Notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4 flex items-center gap-3">
              <Bell className="w-6 h-6 text-accent-primary" />
              6. How Long Do We Keep Your Information?
            </h2>
            <p className="mb-4">
              <strong>In Short:</strong> We keep your information for as long as necessary to fulfill the purposes outlined in this privacy notice unless otherwise required by law.
            </p>
            <p className="mb-4">
              We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy notice, unless a longer retention period is required or permitted by law (such as tax, accounting or other legal requirements). No purpose in this notice will require us keeping your personal information for longer than the period of time in which users have an account with us.
            </p>
            <p className="mb-4">
              When we have no ongoing legitimate business need to process your personal information, we will either delete or anonymize such information, or, if this is not possible (for example, because your personal information has been stored in backup archives), then we will securely store your personal information and isolate it from any further processing until deletion is possible.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4 flex items-center gap-3">
              <Lock className="w-6 h-6 text-accent-primary" />
              7. How Do We Keep Your Information Safe?
            </h2>
            <p className="mb-4">
              <strong>In Short:</strong> We aim to protect your personal information through a system of organizational and technical security measures.
            </p>
            <p className="mb-4">
              We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure, so we cannot promise or guarantee that hackers, cybercriminals, or other unauthorized third parties will not be able to defeat our security, and improperly collect, access, steal, or modify your information. Although we will do our best to protect your personal information, transmission of personal information to and from our Website is at your own risk. You should only access the Website within a secure environment.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4 flex items-center gap-3">
              <UserCheck className="w-6 h-6 text-accent-primary" />
              8. What Are Your Privacy Rights?
            </h2>
            <p className="mb-4">
              <strong>In Short:</strong> In some regions, such as the European Economic Area (EEA) and United Kingdom (UK), you have rights that allow you greater access to and control over your personal information. You may review, change, or terminate your account at any time.
            </p>
            <p className="mb-4">
              In some regions (like the EEA and UK), you have certain rights under applicable data protection laws. These may include the right (i) to request access and obtain a copy of your personal information, (ii) to request rectification or erasure; (iii) to restrict the processing of your personal information; and (iv) if applicable, to data portability. In certain circumstances, you may also have the right to object to the processing of your personal information. To make such a request, please use the contact details provided below. We will consider and act upon any request in accordance with applicable data protection laws.
            </p>
            <p className="mb-4">
              If we are relying on your consent to process your personal information, you have the right to withdraw your consent at any time. Please note however that this will not affect the lawfulness of the processing before its withdrawal, nor will it affect the processing of your personal information conducted in reliance on lawful processing grounds other than consent.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4 flex items-center gap-3">
              <HelpCircle className="w-6 h-6 text-accent-primary" />
              9. Contact Us
            </h2>
            <p className="mb-4">
              If you have questions or comments about this notice, you may email us at info@cgatrades.com or by post to:
            </p>
            <p className="font-medium text-text-primary">
              Capital Growth Alliance<br />
              Attn: Privacy Department<br />
              123 Investment Way, Suite 500<br />
              Financial District, London, UK
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
