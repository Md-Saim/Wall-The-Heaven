'use client';

import React from 'react';
import { CheckCircle2, Download, Search, Skull, ArrowLeft, AlertTriangle } from 'lucide-react';

interface PackStatusViewProps {
  status: 'packaging' | 'ready';
  zipProgress: { current: number; total: number; percent: number };
  zipFileName: string;
  zipBlob?: Blob | null;
  onDownloadZip: () => void;
  onNewSearch: () => void;
  onBackToBrowse: () => void;
}

export default function PackStatusView({
  status,
  zipProgress,
  zipFileName,
  onDownloadZip,
  onNewSearch,
  onBackToBrowse,
}: PackStatusViewProps) {
  if (status === 'packaging') {
    // Exact match for Image 2: SEARCHING & DOWNLOADING
    return (
      <div
        style={{
          position: 'relative',
          zIndex: 20,
          minHeight: 'calc(100vh - 120px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 20px',
          textAlign: 'center',
        }}
      >
        <button
          type="button"
          onClick={onBackToBrowse}
          style={{
            position: 'absolute',
            top: '20px',
            left: '30px',
            background: 'none',
            border: 'none',
            color: '#888888',
            fontSize: '0.85rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            textTransform: 'uppercase',
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Browse</span>
        </button>

        {/* Huge Condensed Title */}
        <h1
          className="display-title"
          style={{
            fontSize: 'clamp(2.8rem, 8vw, 5.5rem)',
            color: '#ffffff',
            marginBottom: '36px',
            letterSpacing: '0.04em',
          }}
        >
          SEARCHING &amp; DOWNLOADING
        </h1>

        {/* High Visibility Yellow Progress Bar matching Screenshot */}
        <div
          style={{
            width: '100%',
            maxWidth: '680px',
            height: '24px',
            background: '#0a0a0a',
            border: '2px solid #333333',
            borderRadius: '2px',
            overflow: 'hidden',
            marginBottom: '20px',
            position: 'relative',
          }}
        >
          <div
            className="animated-progress-bar"
            style={{
              width: `${zipProgress.percent}%`,
              height: '100%',
              background: '#facc15',
              transition: 'width 0.25s ease-out',
            }}
          />
        </div>

        {/* Status Subtitle matching Screenshot */}
        <div
          style={{
            fontSize: '1.05rem',
            color: '#cccccc',
            fontFamily: 'var(--font-mono)',
            fontWeight: 600,
            letterSpacing: '0.02em',
          }}
        >
          {zipProgress.current} / {zipProgress.total} wallpapers • AlphaCoders + WallpapersCraft
        </div>
      </div>
    );
  }

  // Exact match for Image 1: PACK READY
  return (
    <div
      style={{
        position: 'relative',
        zIndex: 20,
        minHeight: 'calc(100vh - 120px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        maxWidth: '960px',
        margin: '0 auto',
        padding: '40px 24px',
      }}
    >
      {/* Success Tag with Checkmark */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          color: '#facc15',
          fontSize: '0.9rem',
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          marginBottom: '16px',
        }}
      >
        <CheckCircle2 size={20} strokeWidth={3} />
        <span>SUCCESS</span>
      </div>

      {/* Huge Bold Yellow Header: PACK READY */}
      <h1
        className="display-title"
        style={{
          fontSize: 'clamp(3.8rem, 11vw, 7.5rem)',
          color: '#facc15',
          marginBottom: '20px',
          letterSpacing: '0.02em',
          textShadow: '0 0 30px rgba(250, 204, 21, 0.3)',
        }}
      >
        PACK READY
      </h1>

      {/* Monospace Subtitle matching Screenshot */}
      <div
        style={{
          fontSize: '1.05rem',
          color: '#e5e5e5',
          fontFamily: 'var(--font-mono)',
          marginBottom: '28px',
          letterSpacing: '0.01em',
        }}
      >
        Your game pack is ready to download:{' '}
        <span style={{ color: '#facc15', fontWeight: 700 }}>{zipFileName}</span>
      </div>

      {/* User Requested Disclaimer: Pack will be destroyed if you refresh */}
      <div
        style={{
          width: '100%',
          maxWidth: '520px',
          background: 'rgba(239, 68, 68, 0.08)',
          border: '1px solid rgba(239, 68, 68, 0.4)',
          borderRadius: '4px',
          padding: '12px 16px',
          marginBottom: '28px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <AlertTriangle size={22} color="#f87171" style={{ flexShrink: 0 }} />
        <div style={{ fontSize: '0.84rem', color: '#fca5a5', lineHeight: 1.45, fontWeight: 600 }}>
          <strong style={{ color: '#f87171', letterSpacing: '0.03em' }}>DISCLAIMER:</strong> This game pack is compiled in-memory in your browser. It <strong style={{ textDecoration: 'underline' }}>will be destroyed if you refresh or leave this website</strong>. Download your ZIP now!
        </div>
      </div>

      {/* Button Group matching Screenshot */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%', maxWidth: '380px', marginBottom: '50px' }}>
        {/* DOWNLOAD ZIP button */}
        <button
          type="button"
          onClick={onDownloadZip}
          className="btn-yellow-primary"
          style={{ width: '100%', padding: '16px 24px', fontSize: '1.05rem' }}
        >
          <span>DOWNLOAD ZIP</span>
          <Download size={20} strokeWidth={3} />
        </button>

        {/* NEW SEARCH button */}
        <button
          type="button"
          onClick={onNewSearch}
          className="btn-dark-outline"
          style={{ width: '100%', padding: '16px 24px', fontSize: '1.05rem' }}
        >
          <span>NEW SEARCH</span>
          <Search size={20} strokeWidth={2.5} />
        </button>
      </div>

      {/* Bottom Hardcore Gaming Tagline matching Screenshot */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: 'auto' }}>
        <Skull size={28} color="#facc15" />
        <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#facc15', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          HARDCORE GAMING. NO FLUFF. NO LIMITS.
          <br />
          BUILD YOUR OWN COLLECTION.
        </div>
      </div>
    </div>
  );
}
