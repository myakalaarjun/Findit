import React from 'react';
import { NavLink, Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <header className="header">
      <div className="dev-banner">
        Prototype Mode: Development prototype without authentication. Verified user ownership and public security will be implemented later.
      </div>
      <div className="header-inner">
        <Link to="/" className="brand-link">
          <span className="brand-title">ReLoop</span>
          <span className="brand-tagline">Find it. Sell it. Reuse it.</span>
        </Link>

        <nav>
          <ul className="nav-links">
            <li>
              <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} end>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/lost-found" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                Lost &amp; Found
              </NavLink>
            </li>
            <li>
              <NavLink to="/report-item" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                Report Item
              </NavLink>
            </li>
            <li>
              <NavLink to="/marketplace" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                Marketplace
              </NavLink>
            </li>
            <li>
              <NavLink to="/sell" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                Sell Item
              </NavLink>
            </li>
            <li>
              <NavLink to="/my-posts" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                My Posts
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                Admin <span className="nav-badge">Dev</span>
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
