'use client';

import React from 'react';
import Link from 'next/link';
import { Github, Skull, ExternalLink, ShieldCheck, Monitor, Smartphone } from 'lucide-react';

export default function Footer() {
  return (
    <footer
      style={{
        position: 'relative',
        zIndex: 20,
        width: '100%',
        background: '#040404',
        borderTop: '1px solid #141414',
        padding: '50px 24px 30px',
        color: '#888888',
        fontSize: '0.86rem',
      }}
    >
      <div
        style={{
          maxWidth: '1360px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '36px',
          marginBottom: '40px',
        }}
      >
        {/* Col 1: Brand & Ethos */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <span
              style={{
                fontSize: '1.35rem',
                fontWeight: 900,
                letterSpacing: '-0.02em',
                color: '#facc15',
                fontFamily: 'var(--font-main)',
              }}
            >
              Wall-the-Heaven
            </span>
          </div>
          <p style={{ color: '#aaaaaa', lineHeight: 1.6, marginBottom: '16px', fontSize: '0.88rem' }}>
            High-resolution pure black wallpaper discovery engine for Gaming, Anime, Movies, Nature, Space, and AMOLED displays. Zero compression, zero bloat, and instantaneous in-memory batch ZIP packaging.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#facc15', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Pure High-Res. No Compression. Pure Black Aesthetic.
            </span>
          </div>
        </div>

        {/* Col 2: Navigation Links */}
        <div>
          <h4
            style={{
              color: '#ffffff',
              fontSize: '0.85rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '16px',
            }}
          >
            Navigation
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <li>
              <Link href="/browse" style={{ color: '#888888', textDecoration: 'none', transition: 'color 0.15s' }} onMouseEnter={(e) => (e.currentTarget.style.color = '#facc15')} onMouseLeave={(e) => (e.currentTarget.style.color = '#888888')}>
                Browse Wallpapers
              </Link>
            </li>
            <li>
              <Link href="/about" style={{ color: '#888888', textDecoration: 'none', transition: 'color 0.15s' }} onMouseEnter={(e) => (e.currentTarget.style.color = '#facc15')} onMouseLeave={(e) => (e.currentTarget.style.color = '#888888')}>
                About Platform &amp; Dev
              </Link>
            </li>
            <li>
              <Link href="/disclaimer" style={{ color: '#888888', textDecoration: 'none', transition: 'color 0.15s' }} onMouseEnter={(e) => (e.currentTarget.style.color = '#facc15')} onMouseLeave={(e) => (e.currentTarget.style.color = '#888888')}>
                Legal &amp; Usage Disclaimer
              </Link>
            </li>
            <li>
              <a href="https://github.com/Md-Saim/Wall-The-Heaven" target="_blank" rel="noopener noreferrer" style={{ color: '#888888', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '5px', transition: 'color 0.15s' }} onMouseEnter={(e) => (e.currentTarget.style.color = '#facc15')} onMouseLeave={(e) => (e.currentTarget.style.color = '#888888')}>
                <span>GitHub Repository</span>
                <ExternalLink size={13} />
              </a>
            </li>
          </ul>
        </div>

        {/* Col 3: Form Factors & Formats */}
        <div>
          <h4
            style={{
              color: '#ffffff',
              fontSize: '0.85rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '16px',
            }}
          >
            Form Factors
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Monitor size={15} color="#facc15" />
              <span>Desktop (16:9, 21:9 Ultrawide 4K/2K)</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Smartphone size={15} color="#facc15" />
              <span>Mobile (9:16, 9:20 AMOLED Lockscreen)</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={15} color="#22c55e" />
              <span>In-Memory Ephemeral ZIP Compilation</span>
            </li>
          </ul>
        </div>

        {/* Col 4: Developer & Social */}
        <div>
          <h4
            style={{
              color: '#ffffff',
              fontSize: '0.85rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '16px',
            }}
          >
            Developer
          </h4>
          <p style={{ color: '#aaaaaa', lineHeight: 1.5, marginBottom: '14px', fontSize: '0.85rem' }}>
            Created by <strong style={{ color: '#ffffff' }}>Md-Saim</strong>. Built for pure high-resolution wallpaper discovery.
          </p>
          <a
            href="https://github.com/Md-Saim"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: '#0d0d0d',
              border: '1px solid #222222',
              padding: '8px 14px',
              borderRadius: '4px',
              color: '#facc15',
              textDecoration: 'none',
              fontSize: '0.8rem',
              fontWeight: 700,
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#facc15';
              e.currentTarget.style.background = '#141414';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#222222';
              e.currentTarget.style.background = '#0d0d0d';
            }}
          >
            <Github size={16} />
            <span>Visit Md-Saim on GitHub</span>
          </a>
        </div>
      </div>

      {/* Bottom Sub-bar */}
      <div
        style={{
          maxWidth: '1360px',
          margin: '0 auto',
          paddingTop: '24px',
          borderTop: '1px solid #111111',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px',
          fontSize: '0.78rem',
        }}
      >
        <div>
          © 2026 <strong style={{ color: '#ffffff' }}>Wall-the-Heaven</strong>. Developed by{' '}
          <a href="https://github.com/Md-Saim" target="_blank" rel="noopener noreferrer" style={{ color: '#facc15', textDecoration: 'none', fontWeight: 700 }}>
            Md-Saim
          </a>{' '}
          under the MIT License.
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', display: 'inline-block', boxShadow: '0 0 8px #22c55e' }} />
          <span style={{ color: '#cccccc', fontWeight: 600 }}>System Operational • Wall-the-Heaven</span>
        </div>
      </div>
    </footer>
  );
}
