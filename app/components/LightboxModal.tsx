'use client';

import React, { useEffect } from 'react';
import { X, Download, Monitor, Smartphone, ExternalLink, Sparkles } from 'lucide-react';
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
        background: 'rgba(3, 4, 8, 0.88)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        animation: 'fadeIn 0.2s ease',
      }}
    >
      {/* Top Bar */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span
            className={isMobile ? 'badge badge-violet' : 'badge badge-cyan'}
            style={{ fontSize: '0.75rem', padding: '4px 10px' }}
          >
            {isMobile ? <Smartphone size={13} /> : <Monitor size={13} />}
            <span>{isMobile ? 'Mobile' : 'Desktop'}</span>
          </span>

          <span className="badge badge-muted">{item.resolutionStr}</span>
          <span className="badge badge-amber">{item.source}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Direct Download Button */}
          <button
            type="button"
            onClick={() => onDownload(item)}
            style={{
              background: 'linear-gradient(135deg, #00f0ff 0%, #0284c7 100%)',
              color: '#05070d',
              border: 'none',
              borderRadius: 'var(--radius-full)',
              padding: '8px 20px',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 0 20px rgba(0, 240, 255, 0.4)',
            }}
          >
            <Download size={16} strokeWidth={2.5} />
            <span>Download</span>
          </button>

          {/* Close */}
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '50%',
              width: '38px',
              height: '38px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              cursor: 'pointer',
            }}
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Main Image View */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          maxWidth: '1200px',
          maxHeight: 'calc(100vh - 140px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 40px rgba(0, 240, 255, 0.15)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
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
            maxHeight: 'calc(100vh - 140px)',
            objectFit: 'contain',
            borderRadius: 'var(--radius-md)',
          }}
        />
      </div>
    </div>
  );
}
