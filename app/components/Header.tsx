'use client';

import React from 'react';
import { Sparkles, Github, Layers, ShieldCheck } from 'lucide-react';

export default function Header() {
  return (
    <header
      style={{
        position: 'relative',
        zIndex: 10,
        width: '100%',
        padding: '24px 20px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        background: 'rgba(5, 7, 13, 0.75)',
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
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #00f0ff 0%, #a855f7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 24px rgba(0, 240, 255, 0.45)',
            }}
          >
            <Sparkles size={22} color="#05070d" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1
                style={{
                  fontSize: '1.45rem',
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  background: 'linear-gradient(90deg, #ffffff 30%, #00f0ff 70%, #a855f7 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Wall-the-Heaven
              </h1>
              <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>
                v1.0
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Ethereal Multi-Source Wallpaper Downloader
            </p>
          </div>
        </div>

        {/* Source Status & GitHub link */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div
            className="glass-panel"
            style={{
              padding: '6px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.78rem',
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#10b981',
                boxShadow: '0 0 8px #10b981',
              }}
            />
            <span style={{ color: 'var(--text-secondary)' }}>AlphaCoders Abyss</span>
          </div>

          <div
            className="glass-panel"
            style={{
              padding: '6px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.78rem',
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#00f0ff',
                boxShadow: '0 0 8px #00f0ff',
              }}
            />
            <span style={{ color: 'var(--text-secondary)' }}>Wallhaven API</span>
          </div>

          <a
            href="https://github.com/Md-Saim/Wall-The-Heaven"
            target="_blank"
            rel="noopener noreferrer"
            className="glass-panel-interactive"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              textDecoration: 'none',
              color: 'var(--text-primary)',
              fontSize: '0.84rem',
              fontWeight: 600,
            }}
          >
            <Github size={16} />
            <span>GitHub</span>
          </a>
        </div>
      </div>
    </header>
  );
}
