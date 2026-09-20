'use client';

import React from 'react';
import { Github, Sparkles, FolderDown } from 'lucide-react';

interface HeaderProps {
  onNavClick?: (view: string) => void;
  activeView?: string;
  selectedCount?: number;
  onOpenQueue?: () => void;
}

export default function Header({
  onNavClick,
  activeView = 'browse',
  selectedCount = 0,
  onOpenQueue,
}: HeaderProps) {
  return (
    <header
      style={{
        position: 'relative',
        zIndex: 20,
        width: '100%',
        padding: '18px 24px',
        borderBottom: '1px solid #141414',
        background: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(16px)',
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
        {/* Brand Logo matching Screenshots */}
        <div
          onClick={() => onNavClick && onNavClick('browse')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
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
          <span
            style={{
              border: '1px solid rgba(250, 204, 21, 0.4)',
              color: '#facc15',
              fontSize: '0.68rem',
              fontWeight: 700,
              padding: '2px 7px',
              borderRadius: '999px',
              background: 'rgba(250, 204, 21, 0.08)',
            }}
          >
            v2.0
          </span>
        </div>

        {/* Center Navigation Links (matching screenshot) */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            fontSize: '0.84rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          <button
            type="button"
            onClick={() => onNavClick && onNavClick('browse')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: activeView === 'browse' ? '#facc15' : '#888888',
              borderBottom: activeView === 'browse' ? '2px solid #facc15' : '2px solid transparent',
              paddingBottom: '4px',
              fontWeight: 700,
              transition: 'color 0.15s',
            }}
          >
            BROWSE
          </button>

          <button
            type="button"
            onClick={() => onNavClick && onNavClick('collections')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: activeView === 'collections' ? '#facc15' : '#888888',
              borderBottom: activeView === 'collections' ? '2px solid #facc15' : '2px solid transparent',
              paddingBottom: '4px',
              fontWeight: 700,
              transition: 'color 0.15s',
            }}
          >
            COLLECTIONS
          </button>

          <button
            type="button"
            onClick={() => onNavClick && onNavClick('about')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: activeView === 'about' ? '#facc15' : '#888888',
              borderBottom: activeView === 'about' ? '2px solid #facc15' : '2px solid transparent',
              paddingBottom: '4px',
              fontWeight: 700,
              transition: 'color 0.15s',
            }}
          >
            ABOUT
          </button>
        </nav>

        {/* Right Action buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {selectedCount > 0 && onOpenQueue && (
            <button
              type="button"
              onClick={onOpenQueue}
              style={{
                background: 'rgba(250, 204, 21, 0.1)',
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
              }}
            >
              <FolderDown size={15} />
              <span>PACK QUEUE ({selectedCount})</span>
            </button>
          )}

          <a
            href="https://github.com/Md-Saim/Wall-The-Heaven"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: '#0d0d0d',
              border: '1px solid #222222',
              borderRadius: '4px',
              padding: '7px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: '#cccccc',
              textDecoration: 'none',
              fontSize: '0.78rem',
              fontWeight: 600,
              transition: 'border-color 0.15s, color 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#facc15';
              e.currentTarget.style.color = '#ffffff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#222222';
              e.currentTarget.style.color = '#cccccc';
            }}
          >
            <Github size={15} />
            <span>GitHub</span>
          </a>
        </div>
      </div>
    </header>
  );
}
