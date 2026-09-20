'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Github, FolderDown } from 'lucide-react';

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

  const isCurrent = (path: string) => {
    if (activeView) {
      if (path === '/' || path === '/browse') return activeView === 'browse';
      if (path === '/about') return activeView === 'about';
      if (path === '/disclaimer') return activeView === 'disclaimer';
    }
    return pathname === path;
  };

  return (
    <header
      style={{
        position: 'relative',
        zIndex: 30,
        width: '100%',
        padding: '16px 24px',
        borderBottom: '1px solid #141414',
        background: 'rgba(0, 0, 0, 0.90)',
        backdropFilter: 'blur(20px)',
      }}
    >
      <div
        style={{
          maxWidth: '1360px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        {/* Brand Logo - pure Wall-the-Heaven without v2 badge */}
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

        {/* Center Navigation: BROWSE, ABOUT, DISCLAIMER, and GITHUB in the middle */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            fontSize: '0.84rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            flexWrap: 'wrap',
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

          {/* GitHub button in the middle alongside page buttons */}
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

        {/* Right Action: Pack Queue Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {selectedCount > 0 && onOpenQueue && (
            <button
              type="button"
              onClick={onOpenQueue}
              style={{
                background: 'rgba(250, 204, 21, 0.12)',
                border: '1px solid #facc15',
                color: '#facc15',
                fontSize: '0.78rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                padding: '7px 14px',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                letterSpacing: '0.04em',
                boxShadow: '0 0 14px rgba(250, 204, 21, 0.25)',
              }}
            >
              <FolderDown size={15} />
              <span>PACK QUEUE ({selectedCount})</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
