'use client';

import React, { useEffect } from 'react';
import { X, Download, Monitor, Smartphone } from 'lucide-react';
import { WallpaperItem } from '../api/search/route';

interface LightboxModalProps {
  item: WallpaperItem | null;
  onClose: () => void;
  onDownload: (item: WallpaperItem) => void;
}

export default function LightboxModal({
  item,
  onClose,
  onDownload,
}: LightboxModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!item) return null;

  const isMobile = item.device === 'mobile';

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        background: 'rgba(0, 0, 0, 0.94)',
        backdropFilter: 'blur(20px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      {/* Header bar */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '1200px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span
            style={{
              background: 'rgba(250, 204, 21, 0.15)',
              border: '1px solid #facc15',
              color: '#facc15',
              fontSize: '0.72rem',
              fontWeight: 800,
              padding: '3px 8px',
              borderRadius: '3px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              textTransform: 'uppercase',
            }}
          >
            {isMobile ? <Smartphone size={12} /> : <Monitor size={12} />}
            <span>{isMobile ? 'Mobile 9:16' : 'Desktop 16:9'}</span>
          </span>

          <span
            style={{
              background: '#141414',
              border: '1px solid #2e2e2e',
              color: '#e5e5e5',
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '3px 8px',
              borderRadius: '3px',
              fontFamily: 'var(--font-mono)',
            }}
          >
            {item.resolutionStr}
          </span>

          <span style={{ fontSize: '0.8rem', color: '#888888', textTransform: 'uppercase' }}>
            {item.source}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Download Button */}
          <button
            type="button"
            onClick={() => onDownload(item)}
            className="btn-yellow-primary"
            style={{ padding: '8px 18px', fontSize: '0.84rem' }}
          >
            <Download size={16} strokeWidth={3} />
            <span>DOWNLOAD</span>
          </button>

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            style={{
              background: '#141414',
              border: '1px solid #282828',
              borderRadius: '4px',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              cursor: 'pointer',
            }}
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Main Image container */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          maxWidth: '1200px',
          maxHeight: 'calc(100vh - 130px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid rgba(250, 204, 21, 0.4)',
          borderRadius: '4px',
          overflow: 'hidden',
          background: '#0a0a0a',
          boxShadow: '0 0 35px rgba(0, 0, 0, 0.9), 0 0 25px rgba(250, 204, 21, 0.15)',
        }}
      >
        <img
          src={item.url}
          alt={item.title}
          onError={(e) => {
            const target = e.currentTarget;
            if (!target.src.includes('/api/proxy')) {
              target.src = `/api/proxy?url=${encodeURIComponent(item.url)}`;
            }
          }}
          style={{
            maxWidth: '100%',
            maxHeight: 'calc(100vh - 130px)',
            objectFit: 'contain',
            display: 'block',
          }}
        />
      </div>
    </div>
  );
}
