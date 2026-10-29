import React from 'react';
import Nav from '../components/shared/Nav';
import Footer from '../components/shared/Footer';

const Section = ({ title, children }) => (
  <div style={{ marginBottom: 32 }}>
    <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12, color: 'var(--gray-900)' }}>{title}</h2>
    <div style={{ fontSize: 15, color: 'var(--gray-600)', lineHeight: 1.75 }}>{children}</div>
  </div>
);

const PrivacyPage = () => (
  <div>
    <Nav />
    <main id="main-content">
      <section className="page-section" style={{ background: '#fff', maxWidth: 760, margin: '0 auto' }}>
        <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 36, fontWeight: 800, marginBottom: 8, color: 'var(--gray-900)' }}>Privacy Policy</h1>
        <p style={{ color: 'var(--gray-400)', fontSize: 14, marginBottom: 40 }}>Last updated: October 2026</p>

        <Section title="1. Introduction">
          PRN Design Platform ("PRN", "we", "us", or "our") is committed to protecting your personal information. This Privacy Policy explains what data we collect, how we use it, and your rights regarding your information.
        </Section>

        <Section title="2. Information We Collect">
          <p style={{ marginBottom: 12 }}>We collect information you provide directly, including:</p>
          <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <li>Account registration data (name, email address, password hash)</li>
            <li>Design content you create and store using PRN</li>
            <li>Images and assets you upload to the editor</li>
            <li>Account preferences and settings</li>
            <li>Billing information (processed securely by our payment provider — raw card details are never stored on our servers)</li>
          </ul>
          <p style={{ marginTop: 12 }}>We may also collect usage data automatically, such as pages visited, features used, and technical information about your browser and device.</p>
        </Section>

        <Section title="3. How We Use Your Information">
          We use your information to:
          <ul style={{ paddingLeft: 20, marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <li>Provide, operate, and improve the PRN service</li>
            <li>Store and sync your designs</li>
            <li>Process subscription payments</li>
            <li>Send transactional emails (account confirmation, billing receipts)</li>
            <li>Respond to support requests</li>
            <li>Enforce our Terms of Service</li>
          </ul>
          We do not sell your personal information to third parties.
        </Section>

        <Section title="4. Data Storage and Security">
          Your data is stored securely. We use industry-standard security measures including HTTPS for all data in transit, and access controls for your account data. No security measure is perfect, and we cannot guarantee absolute security.
        </Section>

        <Section title="5. Your Rights">
          You have the right to access, correct, or delete your personal information. To exercise these rights, contact us at hello@prn.design. We will respond within 30 days.
        </Section>

        <Section title="6. Cookies">
          PRN uses essential cookies to keep you signed in and remember your preferences. We do not use advertising cookies or third-party tracking cookies without your consent.
        </Section>

        <Section title="7. Third-Party Services">
          PRN may use third-party services for payment processing, error monitoring, and analytics. These services have their own privacy policies. We share only the minimum data necessary for these services to function.
        </Section>

        <Section title="8. Children">
          PRN is not directed at children under 13. We do not knowingly collect personal information from children under 13. If you believe a child has provided us with personal information, contact us and we will delete it.
        </Section>

        <Section title="9. Changes to This Policy">
          We may update this Privacy Policy. We will notify registered users of material changes by email. Continued use of PRN after the effective date constitutes acceptance of the updated policy.
        </Section>

        <Section title="10. Contact">
          For privacy questions or requests: <a href="mailto:hello@prn.design" style={{ color: 'var(--prn-primary)' }}>hello@prn.design</a>
        </Section>
      </section>
    </main>
    <Footer />
  </div>
);

export default PrivacyPage;
