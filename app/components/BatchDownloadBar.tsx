'use client';

import React from 'react';
import { Download, X, Archive, Loader2 } from 'lucide-react';
import { WallpaperItem } from '../api/search/route';

interface BatchDownloadBarProps {
  selectedItems: WallpaperItem[];
  onDeselectAll: () => void;
  onDownloadZip: () => void;
  isZipping: boolean;
  zipProgress: { current: number; total: number; percent: number };
}

export default function BatchDownloadBar({
  selectedItems,
  onDeselectAll,
  onDownloadZip,
  isZipping,
  zipProgress,
}: BatchDownloadBarProps) {
  if (selectedItems.length === 0) return null;

  return (
    <aside
      aria-label="Batch download options"
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 40,
        width: 'calc(100% - 40px)',
        maxWidth: '680px',
        animation: 'floatGentle 4s infinite ease-in-out',
      }}
    >
      <div
        className="glass-panel"
        style={{
          padding: '14px 20px',
          borderRadius: 'var(--radius-full)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          border: '1px solid rgba(0, 240, 255, 0.35)',
          boxShadow: '0 12px 40px 0 rgba(0, 0, 0, 0.8), 0 0 30px rgba(0, 240, 255, 0.25)',
          background: 'rgba(10, 14, 26, 0.92)',
        }}
      >
        {/* Selected count info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #00f0ff 0%, #a855f7 100%)',
              color: '#05070d',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '0.88rem',
            }}
          >
            {selectedItems.length}
          </div>

          <div>
            <div style={{ fontSize: '0.92rem', fontWeight: 700 }}>
              {selectedItems.length} Wallpaper{selectedItems.length > 1 ? 's' : ''} Selected
            </div>
            {isZipping ? (
              <div style={{ fontSize: '0.76rem', color: 'var(--accent-cyan)' }}>
                Packaging ZIP: {zipProgress.current} / {zipProgress.total} ({zipProgress.percent}%)
              </div>
            ) : (
              <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                Ready to download as clean ZIP
              </div>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={onDeselectAll}
            disabled={isZipping}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: isZipping ? 'not-allowed' : 'pointer',
              padding: '6px 12px',
              fontSize: '0.84rem',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <X size={15} />
            <span>Clear</span>
          </button>

          <button
            type="button"
            onClick={onDownloadZip}
            disabled={isZipping}
            style={{
              background: 'linear-gradient(135deg, #00f0ff 0%, #a855f7 100%)',
              color: '#05070d',
              border: 'none',
              borderRadius: 'var(--radius-full)',
              padding: '10px 22px',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: isZipping ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 0 20px rgba(0, 240, 255, 0.4)',
              transition: 'transform 0.15s, opacity 0.15s',
              opacity: isZipping ? 0.8 : 1,
            }}
          >
            {isZipping ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Downloading ({zipProgress.percent}%)...</span>
              </>
            ) : (
              <>
                <Archive size={16} strokeWidth={2.5} />
                <span>Download ZIP ({selectedItems.length})</span>
              </>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}
