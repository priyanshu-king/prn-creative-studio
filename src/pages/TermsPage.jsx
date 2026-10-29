import React from 'react';
import Nav from '../components/shared/Nav';
import Footer from '../components/shared/Footer';

const Section = ({ title, children }) => (
  <div style={{ marginBottom: 32 }}>
    <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12, color: 'var(--gray-900)' }}>{title}</h2>
    <div style={{ fontSize: 15, color: 'var(--gray-600)', lineHeight: 1.75 }}>{children}</div>
  </div>
);

const TermsPage = () => (
  <div>
    <Nav />
    <main id="main-content">
      <section className="page-section" style={{ background: '#fff', maxWidth: 760, margin: '0 auto' }}>
        <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 36, fontWeight: 800, marginBottom: 8, color: 'var(--gray-900)' }}>Terms of Service</h1>
        <p style={{ color: 'var(--gray-400)', fontSize: 14, marginBottom: 40 }}>Last updated: October 2026</p>

        <Section title="1. Acceptance of Terms">
          By creating an account or using PRN Design Platform ("PRN"), you agree to these Terms of Service. If you do not agree, do not use PRN.
        </Section>

        <Section title="2. Use of PRN">
          PRN grants you a non-exclusive, non-transferable licence to use PRN for personal or commercial design work, subject to these terms. You may not:
          <ul style={{ paddingLeft: 20, marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <li>Use PRN to create illegal, harmful, or infringing content</li>
            <li>Attempt to reverse-engineer, scrape, or disrupt the service</li>
            <li>Share your account credentials with others</li>
            <li>Misrepresent your identity or affiliation</li>
          </ul>
        </Section>

        <Section title="3. Your Content">
          You retain ownership of all designs you create in PRN. By uploading images or other content, you confirm you have the rights to use that content. You grant PRN a limited licence to store and display your content to provide the service.
        </Section>

        <Section title="4. Free Plan Limits">
          The free plan includes up to 5 active projects and access to free-tier features only. PRN may adjust free plan limits with reasonable notice.
        </Section>

        <Section title="5. PRN Pro Subscription">
          PRN Pro is a paid subscription billed monthly or annually. You may cancel at any time. Access continues until the end of the paid period. Refunds are not provided for partial billing periods unless required by applicable law.
        </Section>

        <Section title="6. Intellectual Property">
          PRN, its name, logo, and underlying technology are the intellectual property of PRN. Templates provided by PRN are licensed for use within your designs but may not be resold as standalone templates.
        </Section>

        <Section title="7. Disclaimer">
          PRN is provided "as is" without warranties of any kind. We do not guarantee that the service will be uninterrupted, error-free, or completely secure.
        </Section>

        <Section title="8. Limitation of Liability">
          To the maximum extent permitted by law, PRN is not liable for indirect, incidental, or consequential damages arising from use of the service.
        </Section>

        <Section title="9. Termination">
          We may suspend or terminate accounts that violate these terms. You may delete your account at any time by contacting us.
        </Section>

        <Section title="10. Changes">
          We may update these terms. Material changes will be communicated by email to registered users. Continued use after the effective date constitutes acceptance.
        </Section>

        <Section title="11. Contact">
          Questions about these terms: <a href="mailto:hello@prn.design" style={{ color: 'var(--prn-primary)' }}>hello@prn.design</a>
        </Section>
      </section>
    </main>
    <Footer />
  </div>
);

export default TermsPage;
