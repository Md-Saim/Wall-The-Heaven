'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Github, FolderDown, Menu, X, Mail } from 'lucide-react';

interface HeaderProps {
  onNavClick?: (view: string) => void;
  activeView?: string;
  selectedCount?: number;
  onOpenQueue?: () => void;
}

export default function Header({
  onNavClick,
  activeView,
  selectedCount = 0,
  onOpenQueue,
}: HeaderProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isCurrent = (path: string) => {
    if (activeView) {
      if (path === '/' || path === '/browse') return activeView === 'browse';
      if (path === '/about') return activeView === 'about';
      if (path === '/disclaimer') return activeView === 'disclaimer';
    }
    return pathname === path;
  };

  const closeMobile = () => setMobileMenuOpen(false);

  return (
    <header
      style={{
        position: 'relative',
        zIndex: 40,
        width: '100%',
        padding: '16px 24px',
        borderBottom: '1px solid #141414',
        background: 'rgba(0, 0, 0, 0.90)',
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* 3-Column Layout: Left (Brand), Center (Nav pages in desktop middle), Right (Queue + Mobile Envelope Menu) */}
      <div className="header-grid-layout">
        {/* Left: Brand Title */}
        <div className="header-left-col">
          <Link
            href="/"
            onClick={() => onNavClick && onNavClick('browse')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              textDecoration: 'none',
              cursor: 'pointer',
            }}
          >
            <span
              style={{
                fontSize: '1.45rem',
                fontWeight: 900,
                letterSpacing: '-0.02em',
                color: '#facc15',
                fontFamily: 'var(--font-main)',
              }}
            >
              Wall-the-Heaven
            </span>
          </Link>
        </div>

        {/* Center: Desktop Navigation centered directly in the middle */}
        <nav
          className="header-center-col desktop-nav-group"
          style={{
            gap: '24px',
            fontSize: '0.84rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          <Link
            href="/browse"
            onClick={() => onNavClick && onNavClick('browse')}
            style={{
              textDecoration: 'none',
              color: isCurrent('/browse') || isCurrent('/') ? '#facc15' : '#888888',
              borderBottom: isCurrent('/browse') || isCurrent('/') ? '2px solid #facc15' : '2px solid transparent',
              paddingBottom: '4px',
              transition: 'all 0.15s',
            }}
          >
            BROWSE
          </Link>

          <Link
            href="/about"
            style={{
              textDecoration: 'none',
              color: isCurrent('/about') ? '#facc15' : '#888888',
              borderBottom: isCurrent('/about') ? '2px solid #facc15' : '2px solid transparent',
              paddingBottom: '4px',
              transition: 'all 0.15s',
            }}
          >
            ABOUT
          </Link>

          <Link
            href="/disclaimer"
            style={{
              textDecoration: 'none',
              color: isCurrent('/disclaimer') ? '#facc15' : '#888888',
              borderBottom: isCurrent('/disclaimer') ? '2px solid #facc15' : '2px solid transparent',
              paddingBottom: '4px',
              transition: 'all 0.15s',
            }}
          >
            DISCLAIMER
          </Link>

          {/* GitHub button centered alongside page links */}
          <a
            href="https://github.com/Md-Saim"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: '#0d0d0d',
              border: '1px solid #2a2a2a',
              borderRadius: '4px',
              padding: '6px 14px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: '#e5e5e5',
              textDecoration: 'none',
              fontSize: '0.78rem',
              fontWeight: 800,
              letterSpacing: '0.05em',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#facc15';
              e.currentTarget.style.color = '#facc15';
              e.currentTarget.style.background = '#141414';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#2a2a2a';
              e.currentTarget.style.color = '#e5e5e5';
              e.currentTarget.style.background = '#0d0d0d';
            }}
          >
            <Github size={15} />
            <span>GITHUB</span>
          </a>
        </nav>

        {/* Right: Pack Queue Button and Mobile Menu Envelope Button */}
        <div className="header-right-col" style={{ gap: '10px' }}>
          {selectedCount > 0 && onOpenQueue && (
            <button
              type="button"
              onClick={onOpenQueue}
              style={{
                background: 'rgba(250, 204, 21, 0.12)',
                border: '1px solid #facc15',
                color: '#facc15',
                fontSize: '0.76rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                padding: '7px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                letterSpacing: '0.04em',
                boxShadow: '0 0 14px rgba(250, 204, 21, 0.25)',
              }}
            >
              <FolderDown size={14} />
              <span>QUEUE ({selectedCount})</span>
            </button>
          )}

          {/* Mobile Menu Envelope Button */}
          <button
            type="button"
            className="mobile-menu-envelope-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            style={{
              background: mobileMenuOpen ? '#facc15' : '#111111',
              color: mobileMenuOpen ? '#000000' : '#facc15',
              border: '1px solid rgba(250, 204, 21, 0.4)',
              borderRadius: '4px',
              padding: '7px 11px',
              cursor: 'pointer',
              display: 'none',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.8rem',
              fontWeight: 800,
              letterSpacing: '0.04em',
              transition: 'all 0.15s',
            }}
          >
            {mobileMenuOpen ? <X size={18} /> : <Mail size={17} />}
            <span>MENU</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Envelope Drawer */}
      {mobileMenuOpen && (
        <div
          className="mobile-envelope-drawer"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            width: '100%',
            background: 'rgba(5, 5, 5, 0.98)',
            borderBottom: '2px solid #facc15',
            padding: '24px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.95)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            zIndex: 50,
            backdropFilter: 'blur(20px)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #222222', paddingBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#facc15', fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              <Mail size={16} />
              <span>NAVIGATION MENU</span>
            </div>
            <button
              type="button"
              onClick={closeMobile}
              style={{ background: 'transparent', border: 'none', color: '#888888', cursor: 'pointer', display: 'flex' }}
            >
              <X size={20} />
            </button>
          </div>

          <Link
            href="/browse"
            onClick={() => {
              if (onNavClick) onNavClick('browse');
              closeMobile();
            }}
            style={{
              textDecoration: 'none',
              color: isCurrent('/browse') || isCurrent('/') ? '#facc15' : '#e5e5e5',
              fontSize: '1.05rem',
              fontWeight: 800,
              letterSpacing: '0.04em',
              padding: '8px 0',
              borderBottom: '1px solid #141414',
            }}
          >
            BROWSE WALLPAPERS
          </Link>

          <Link
            href="/about"
            onClick={closeMobile}
            style={{
              textDecoration: 'none',
              color: isCurrent('/about') ? '#facc15' : '#e5e5e5',
              fontSize: '1.05rem',
              fontWeight: 800,
              letterSpacing: '0.04em',
              padding: '8px 0',
              borderBottom: '1px solid #141414',
            }}
          >
            ABOUT PLATFORM &amp; DEV
          </Link>

          <Link
            href="/disclaimer"
            onClick={closeMobile}
            style={{
              textDecoration: 'none',
              color: isCurrent('/disclaimer') ? '#facc15' : '#e5e5e5',
              fontSize: '1.05rem',
              fontWeight: 800,
              letterSpacing: '0.04em',
              padding: '8px 0',
              borderBottom: '1px solid #141414',
            }}
          >
            DISCLAIMER &amp; HOW IT WORKS
          </Link>

          <a
            href="https://github.com/Md-Saim"
            target="_blank"
            rel="noopener noreferrer"
            onClick={closeMobile}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              background: '#111111',
              border: '1px solid #333333',
              borderRadius: '4px',
              padding: '12px',
              color: '#facc15',
              textDecoration: 'none',
              fontSize: '0.92rem',
              fontWeight: 800,
              letterSpacing: '0.05em',
              marginTop: '8px',
            }}
          >
            <Github size={18} />
            <span>MD-SAIM ON GITHUB</span>
          </a>
        </div>
      )}
    </header>
  );
}
