import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-section">
          <h4>FindIt</h4>
          <p>
            <strong>Find it. Sell it. Reuse it.</strong>
          </p>
          <p style={{ marginTop: '0.5rem' }}>
            A community platform dedicated to helping people recover lost items, find what was lost, and give pre-owned goods a second life through sustainable local exchange.
          </p>
        </div>

        <div className="footer-section">
          <h4>Lost &amp; Found</h4>
          <ul className="footer-links">
            <li>
              <Link to="/lost-found">Browse All Reports</Link>
            </li>
            <li>
              <Link to="/report-item">Report a Lost Item</Link>
            </li>
            <li>
              <Link to="/report-item">Report a Found Item</Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Marketplace</h4>
          <ul className="footer-links">
            <li>
              <Link to="/marketplace">Browse Marketplace</Link>
            </li>
            <li>
              <Link to="/sell">Sell an Item</Link>
            </li>
            <li>
              <Link to="/my-posts">Manage Posts (Local)</Link>
            </li>
            <li>
              <Link to="/admin">Moderation (Dev)</Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} FindIt. Built for sustainable reuse. Local Development Prototype (Authentication Later).
      </div>
    </footer>
  );
}
