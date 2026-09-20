'use client';

import React from 'react';
import { Download, X, Archive } from 'lucide-react';
import { WallpaperItem } from '../api/search/route';

interface BatchDownloadBarProps {
  selectedItems: WallpaperItem[];
  onDeselectAll: () => void;
  onStartPackaging: () => void;
}

export default function BatchDownloadBar({
  selectedItems,
  onDeselectAll,
  onStartPackaging,
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
        maxWidth: '620px',
      }}
    >
      <div
        style={{
          padding: '12px 18px',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          border: '1.5px solid #facc15',
          background: 'rgba(10, 10, 10, 0.96)',
          boxShadow: '0 10px 35px rgba(0, 0, 0, 0.9), 0 0 25px rgba(250, 204, 21, 0.25)',
        }}
      >
        {/* Count info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '4px',
              background: '#facc15',
              color: '#000000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              fontSize: '0.9rem',
            }}
          >
            {selectedItems.length}
          </div>

          <div>
            <div style={{ fontSize: '0.88rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {selectedItems.length} WALLPAPER{selectedItems.length > 1 ? 'S' : ''} IN PACK
            </div>
            <div style={{ fontSize: '0.72rem', color: '#888888', textTransform: 'uppercase' }}>
              READY TO PACKAGE INTO ZIP
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={onDeselectAll}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#888888',
              cursor: 'pointer',
              padding: '6px 10px',
              fontSize: '0.78rem',
              fontWeight: 700,
              textTransform: 'uppercase',
            }}
          >
            CLEAR
          </button>

          <button
            type="button"
            onClick={onStartPackaging}
            className="btn-yellow-primary"
            style={{
              padding: '10px 20px',
              fontSize: '0.86rem',
              borderRadius: '4px',
            }}
          >
            <Archive size={16} strokeWidth={2.5} />
            <span>PACKAGE PACK</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
