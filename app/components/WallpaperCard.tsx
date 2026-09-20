'use client';

import React, { useState } from 'react';
import { Download, Check, Maximize2 } from 'lucide-react';
import { WallpaperItem } from '../api/search/route';

interface WallpaperCardProps {
  item: WallpaperItem;
  isSelected: boolean;
  onToggleSelect: (item: WallpaperItem) => void;
  onOpenLightbox: (item: WallpaperItem) => void;
  onSingleDownload: (item: WallpaperItem) => void;
}

export default function WallpaperCard({
  item,
  isSelected,
  onToggleSelect,
  onOpenLightbox,
  onSingleDownload,
}: WallpaperCardProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const isMobile = item.device === 'mobile';

  // Format title like CS2 // DEFAULT or CYBERPUNK 2077 // NIGHT CITY
  const cleanTitle = item.title.toUpperCase().replace(/\s*-\s*|\s*\|\s*/g, ' // ');

  return (
    <div
      className={`hardcore-card wallpaper-card-container ${isSelected ? 'selected' : ''}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        border: isSelected ? '1.5px solid #facc15' : '1px solid rgba(234, 179, 8, 0.3)',
        boxShadow: isSelected
          ? '0 0 20px rgba(250, 204, 21, 0.4)'
          : '0 4px 15px rgba(0, 0, 0, 0.8)',
      }}
    >
      {/* Image Preview Container */}
      <div
        className={`card-image-box ${isMobile ? 'mobile-ratio' : 'desktop-ratio'}`}
        style={{
          position: 'relative',
          width: '100%',
          overflow: 'hidden',
          background: '#0a0a0a',
          cursor: 'pointer',
        }}
        onClick={() => onOpenLightbox(item)}
      >
        {!isLoaded && (
          <div
            className="skeleton-shimmer"
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 1,
            }}
          />
        )}

        <img
          src={item.previewUrl || item.url}
          alt={item.title}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          onError={(e) => {
            const target = e.currentTarget;
            if (!target.src.includes('/api/proxy')) {
              target.src = `/api/proxy?url=${encodeURIComponent(item.previewUrl || item.url)}`;
            }
          }}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            transition: 'transform 0.35s ease',
            opacity: isLoaded ? 1 : 0,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.04)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        />

        {/* Checkbox Selector (Top-Left) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleSelect(item);
          }}
          className="card-select-checkbox"
          style={{
            position: 'absolute',
            zIndex: 4,
            borderRadius: '4px',
            border: isSelected ? 'none' : '1.5px solid rgba(250, 204, 21, 0.6)',
            background: isSelected ? '#facc15' : 'rgba(0, 0, 0, 0.75)',
            color: '#000000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            backdropFilter: 'blur(6px)',
          }}
          title={isSelected ? 'Remove from pack' : 'Add to pack'}
        >
          {isSelected && <Check size={16} strokeWidth={3.5} />}
        </button>

        {/* Device & Ratio Indicator (Top-Right) */}
        <div
          className="card-ratio-badge"
          style={{
            position: 'absolute',
            zIndex: 4,
            background: 'rgba(0, 0, 0, 0.8)',
            border: '1px solid rgba(250, 204, 21, 0.3)',
            borderRadius: '3px',
            fontWeight: 800,
            color: '#facc15',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}
        >
          {isMobile ? '9:16' : '16:9'}
        </div>
      </div>

      {/* Card Info Footer matching Screenshots */}
      <div
        className="card-footer-info"
        style={{
          background: '#0d0d0d',
          borderTop: '1px solid #1c1c1c',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ overflow: 'hidden', minWidth: 0 }}>
          {/* Title */}
          <div
            className="card-title-text"
            style={{
              fontWeight: 800,
              color: '#ffffff',
              letterSpacing: '0.02em',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
            title={item.title}
          >
            {cleanTitle}
          </div>

          {/* Resolution & Aspect Ratio */}
          <div
            className="card-res-text"
            style={{
              fontFamily: 'var(--font-mono)',
              color: '#a3a3a3',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span style={{ color: '#facc15', fontWeight: 600 }}>{item.resolutionStr}</span>
          </div>
        </div>

        {/* Action icons (Right) */}
        <div className="card-actions-group" style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          {/* Lightbox zoom */}
          <button
            type="button"
            onClick={() => onOpenLightbox(item)}
            className="card-action-icon-btn"
            title="Inspect"
          >
            <Maximize2 size={15} />
          </button>

          {/* Quick single download */}
          <button
            type="button"
            onClick={() => onSingleDownload(item)}
            className="card-action-icon-btn download-accent"
            title="Download Wallpaper"
          >
            <Download size={16} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
