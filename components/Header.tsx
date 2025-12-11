'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FiHome, 
  FiMail, 
  FiBarChart2, 
  FiPlus,
  FiMenu,
  FiX,
  FiCheckCircle
} from 'react-icons/fi';
import { useState } from 'react';

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: '/', label: 'Dashboard', icon: FiHome },
    { href: '/campaigns', label: 'Campaigns', icon: FiMail },
    { href: '/analytics', label: 'Analytics', icon: FiBarChart2 },
    { href: '/test', label: 'Test', icon: FiCheckCircle },
  ];

  return (
    <header className="app-header">
      <div className="header-container">
        <div className="header-brand">
          <FiMail className="brand-icon" />
          <span className="brand-text">Email Tracker</span>
        </div>

        <button 
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

        <nav className={`header-nav ${mobileMenuOpen ? 'nav-open' : ''}`}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || 
              (item.href !== '/' && pathname?.startsWith(item.href));
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link ${isActive ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Icon className="nav-icon" />
                <span>{item.label}</span>
              </Link>
            );
          })}
          <Link
            href="/campaigns/new"
            className="nav-link nav-link-primary"
            onClick={() => setMobileMenuOpen(false)}
          >
            <FiPlus className="nav-icon" />
            <span>New Campaign</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}

