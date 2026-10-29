import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="prn-footer" role="contentinfo">
    <div className="prn-footer-grid">
      <div className="prn-footer-brand">
        <Link to="/" className="prn-logo" aria-label="PRN home">PRN</Link>
        <p className="prn-footer-tagline">
          The modern creative design platform for creators, marketers, students, and businesses.
        </p>
      </div>

      <div>
        <div className="prn-footer-col-title">Product</div>
        <ul className="prn-footer-links" role="list">
          <li><Link to="/features">Features</Link></li>
          <li><Link to="/templates">Templates</Link></li>
          <li><Link to="/pricing">Pricing</Link></li>
          <li><Link to="/dashboard">My Designs</Link></li>
        </ul>
      </div>

      <div>
        <div className="prn-footer-col-title">Company</div>
        <ul className="prn-footer-links" role="list">
          <li><Link to="/about">About PRN</Link></li>
          <li><Link to="/help">Help Center</Link></li>
          <li><a href="mailto:hello@prn.design">Contact</a></li>
        </ul>
      </div>

      <div>
        <div className="prn-footer-col-title">Legal</div>
        <ul className="prn-footer-links" role="list">
          <li><Link to="/privacy">Privacy Policy</Link></li>
          <li><Link to="/terms">Terms of Service</Link></li>
        </ul>
      </div>
    </div>

    <div className="prn-footer-bottom">
      <span>© {new Date().getFullYear()} PRN Design Platform. All rights reserved.</span>
      <span>Made for creators everywhere.</span>
    </div>
  </footer>
);

export default Footer;
