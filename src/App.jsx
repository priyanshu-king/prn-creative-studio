import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Lazy-loaded pages for performance
const LandingPage   = lazy(() => import('./pages/LandingPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const EditorPage    = lazy(() => import('./pages/EditorPage'));
const PricingPage   = lazy(() => import('./pages/PricingPage'));
const FeaturesPage  = lazy(() => import('./pages/FeaturesPage'));
const TemplatesPage = lazy(() => import('./pages/TemplatesPage'));
const AboutPage     = lazy(() => import('./pages/AboutPage'));
const LoginPage     = lazy(() => import('./pages/LoginPage'));
const SignupPage    = lazy(() => import('./pages/SignupPage'));
const AccountPage   = lazy(() => import('./pages/AccountPage'));
const PrivacyPage   = lazy(() => import('./pages/PrivacyPage'));
const TermsPage     = lazy(() => import('./pages/TermsPage'));
const HelpPage      = lazy(() => import('./pages/HelpPage'));
const NotFoundPage  = lazy(() => import('./pages/NotFoundPage'));

// Loading fallback
const PageLoader = () => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    height: '100vh', width: '100vw',
    background: '#f9fafb',
  }}>
    <div className="prn-spinner" aria-label="Loading…" />
  </div>
);

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public marketing site */}
        <Route path="/"            element={<LandingPage />}   />
        <Route path="/features"    element={<FeaturesPage />}  />
        <Route path="/templates"   element={<TemplatesPage />} />
        <Route path="/pricing"     element={<PricingPage />}   />
        <Route path="/about"       element={<AboutPage />}     />
        <Route path="/help"        element={<HelpPage />}      />
        <Route path="/privacy"     element={<PrivacyPage />}   />
        <Route path="/terms"       element={<TermsPage />}     />

        {/* Auth */}
        <Route path="/login"       element={<LoginPage />}     />
        <Route path="/signup"      element={<SignupPage />}    />
        <Route path="/account"     element={<AccountPage />}   />

        {/* App */}
        <Route path="/dashboard"   element={<DashboardPage />} />
        <Route path="/editor/:id"  element={<EditorPage />}    />
        <Route path="/editor"      element={<Navigate to="/dashboard" replace />} />

        {/* Catch-all */}
        <Route path="*"            element={<NotFoundPage />}  />
      </Routes>
    </Suspense>
  );
}

export default App;
