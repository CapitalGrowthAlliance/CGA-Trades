import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SiteProvider } from './context/SiteContext';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n/config';

import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Lazy loaded dashboard pages
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const InvestmentPlansPage = lazy(() => import('./pages/InvestmentPlansPage'));
const InvestmentReviewPage = lazy(() => import('./pages/InvestmentReviewPage'));
const InvestmentFundingPage = lazy(() => import('./pages/InvestmentFundingPage'));
const InvestmentPendingPage = lazy(() => import('./pages/InvestmentPendingPage'));
const TransactionHistoryPage = lazy(() => import('./pages/TransactionHistoryPage'));
const PlanHistoryPage = lazy(() => import('./pages/PlanHistoryPage'));
const DepositPage = lazy(() => import('./pages/DepositPage'));
const WithdrawalPage = lazy(() => import('./pages/WithdrawalPage'));
const FundPage = lazy(() => import('./pages/FundPage'));

// Lazy loaded public pages
const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const FAQPage = lazy(() => import('./pages/FAQPage'));
const AIInsightPage = lazy(() => import('./pages/AIInsightPage'));
const AIInsightsPage = lazy(() => import('./pages/AIInsightsPage'));
const InteractiveTerminalPage = lazy(() => import('./pages/InteractiveTerminalPage'));
const MarketsPage = lazy(() => import('./pages/MarketsPage'));
const NotificationsPage = lazy(() => import('./pages/Notifications'));
const TopInvestorsPage = lazy(() => import('./pages/TopInvestorsPage'));
const HowItWorksPage = lazy(() => import('./pages/HowItWorksPage'));
const SupportPage = lazy(() => import('./pages/SupportPage'));
const TeamPage = lazy(() => import('./pages/TeamPage'));
const HelpGuidePage = lazy(() => import('./pages/HelpGuidePage'));
const SecurityPage = lazy(() => import('./pages/SecurityPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'));
const OurPartnersPage = lazy(() => import('./pages/OurPartnersPage'));
const CGATokenPage = lazy(() => import('./pages/CGATokenPage'));
const GiftCardExchangePage = lazy(() => import('./pages/GiftCardExchangePage'));
const InvestmentGuidePage = lazy(() => import('./pages/InvestmentGuidePage'));

// Lazy loaded components
const Chatbot = lazy(() => import('./components/Chatbot'));
const TelegramPopup = lazy(() => import('./components/TelegramPopup'));
const MobileBottomNav = lazy(() => import('./components/MobileBottomNav'));
const AnimatedBackground = lazy(() => import('./components/AnimatedBackground'));
const HomeActivityNotifications = lazy(() => import('./components/HomeActivityNotifications'));

const LandingPage = lazy(() => import('./pages/LandingPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const CompleteProfilePage = lazy(() => import('./pages/CompleteProfilePage'));
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import { isDev } from './config/env';

// Placeholder components for new routes
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="flex-1 flex items-center justify-center p-6">
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-4">{title}</h1>
      <p className="text-text-secondary">This page is coming soon.</p>
    </div>
  </div>
);

const ScrollAndRedirectHandler = () => {
  const { pathname } = useLocation();

  // Handle scroll to top on navigation
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const GlobalOverlays = () => {
  const { pathname } = useLocation();
  const { user } = useAuth();
  
  if (pathname === '/' || pathname === '/forgot-password') {
    return null;
  }

  return (
    <Suspense fallback={null}>
      <AnimatedBackground primaryColor="#c8ff00" />
      {user && (
        <>
          <HomeActivityNotifications />
          <MobileBottomNav />
        </>
      )}
      <TelegramPopup />
      <Chatbot />
    </Suspense>
  );
};

export default function App() {
  // Disable browser's default scroll restoration
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider>
        <AuthProvider>
          <SiteProvider>
            <BrowserRouter>
              <ScrollAndRedirectHandler />
              <GlobalOverlays />
              <Suspense fallback={<div className="flex items-center justify-center min-h-screen bg-[#0B1D3A]"><div className="w-8 h-8 border-4 border-accent-primary border-t-transparent rounded-full animate-spin"></div></div>}>
                <Routes>
              {/* Public Routes */}
            <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
            
            {/* Protected Public Layout Routes */}
            <Route path="/home" element={
              <ProtectedRoute><PublicLayout><HomePage /></PublicLayout></ProtectedRoute>
            } />
            <Route path="/about" element={<ProtectedRoute><PublicLayout><AboutPage /></PublicLayout></ProtectedRoute>} />
            <Route path="/team" element={<ProtectedRoute><PublicLayout><TeamPage /></PublicLayout></ProtectedRoute>} />
            <Route path="/faq" element={<ProtectedRoute><PublicLayout><FAQPage /></PublicLayout></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><PublicLayout><NotificationsPage /></PublicLayout></ProtectedRoute>} />
            <Route path="/top-investors" element={<ProtectedRoute><PublicLayout><TopInvestorsPage /></PublicLayout></ProtectedRoute>} />
            <Route path="/how-it-works" element={<ProtectedRoute><PublicLayout><HowItWorksPage /></PublicLayout></ProtectedRoute>} />
            <Route path="/support" element={<ProtectedRoute><PublicLayout><SupportPage /></PublicLayout></ProtectedRoute>} />
            <Route path="/help-guide" element={<ProtectedRoute><PublicLayout><HelpGuidePage /></PublicLayout></ProtectedRoute>} />
            <Route path="/security" element={<ProtectedRoute><PublicLayout><SecurityPage /></PublicLayout></ProtectedRoute>} />
            <Route path="/blog" element={<ProtectedRoute><PublicLayout><BlogPage /></PublicLayout></ProtectedRoute>} />
            <Route path="/blog/:id" element={<ProtectedRoute><PublicLayout><BlogPostPage /></PublicLayout></ProtectedRoute>} />
            <Route path="/our-partners" element={<ProtectedRoute><PublicLayout><OurPartnersPage /></PublicLayout></ProtectedRoute>} />
            <Route path="/cga-token" element={<ProtectedRoute><PublicLayout><CGATokenPage /></PublicLayout></ProtectedRoute>} />
            <Route path="/gift-cards" element={<ProtectedRoute><PublicLayout><GiftCardExchangePage /></PublicLayout></ProtectedRoute>} />
            <Route path="/invest" element={<ProtectedRoute><PublicLayout><InvestmentPlansPage /></PublicLayout></ProtectedRoute>} />
            <Route path="/investment-guide" element={<ProtectedRoute><PublicLayout><InvestmentGuidePage /></PublicLayout></ProtectedRoute>} />
            <Route path="/learn" element={<ProtectedRoute><PublicLayout><PlaceholderPage title="Mentorship" /></PublicLayout></ProtectedRoute>} />
            <Route path="/signals" element={<ProtectedRoute><PublicLayout><PlaceholderPage title="Signal Services" /></PublicLayout></ProtectedRoute>} />
            
            {/* Auth Routes */}
            <Route path="/signin" element={<Navigate to="/" replace />} />
            <Route path="/signup" element={<Navigate to="/" replace />} />
            <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
            <Route path="/complete-profile" element={<ProtectedRoute><CompleteProfilePage /></ProtectedRoute>} />

            {/* Authenticated Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute><DashboardLayout><DashboardPage /></DashboardLayout></ProtectedRoute>
            } />
            <Route path="/ai-insight" element={
              <ProtectedRoute><DashboardLayout><AIInsightPage /></DashboardLayout></ProtectedRoute>
            } />
            <Route path="/ai-insights" element={
              <ProtectedRoute><DashboardLayout><AIInsightsPage /></DashboardLayout></ProtectedRoute>
            } />
            <Route path="/interactive-terminal" element={
              <ProtectedRoute><DashboardLayout><InteractiveTerminalPage /></DashboardLayout></ProtectedRoute>
            } />
            <Route path="/markets" element={
              <ProtectedRoute><DashboardLayout><MarketsPage /></DashboardLayout></ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute><AdminDashboardPage /></ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute><DashboardLayout><ProfilePage /></DashboardLayout></ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute><DashboardLayout><SettingsPage /></DashboardLayout></ProtectedRoute>
            } />
            <Route path="/investment/review" element={
              <ProtectedRoute><InvestmentReviewPage /></ProtectedRoute>
            } />
            <Route path="/investment/funding" element={
              <ProtectedRoute><InvestmentFundingPage /></ProtectedRoute>
            } />
            <Route path="/investment/pending" element={
              <ProtectedRoute><InvestmentPendingPage /></ProtectedRoute>
            } />
            <Route path="/transactions" element={<Navigate to="/fund?tab=history" replace />} />
            <Route path="/deposit" element={<Navigate to="/fund?tab=deposit" replace />} />
            <Route path="/withdraw" element={<Navigate to="/fund?tab=withdraw" replace />} />
            <Route path="/fund" element={
              <ProtectedRoute><DashboardLayout><FundPage /></DashboardLayout></ProtectedRoute>
            } />
            <Route path="/plan-history" element={
              <ProtectedRoute><DashboardLayout><PlanHistoryPage /></DashboardLayout></ProtectedRoute>
            } />
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          </Suspense>
          </BrowserRouter>
          </SiteProvider>
        </AuthProvider>
      </ThemeProvider>
    </I18nextProvider>
  );
}
