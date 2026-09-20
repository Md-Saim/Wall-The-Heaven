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
      className="hardcore-card"
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
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: isMobile ? '9 / 14' : '16 / 9',
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
          style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            zIndex: 4,
            width: '26px',
            height: '26px',
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
          {isSelected && <Check size={18} strokeWidth={3.5} />}
        </button>

        {/* Device & Ratio Indicator (Top-Right) */}
        <div
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            zIndex: 4,
            background: 'rgba(0, 0, 0, 0.8)',
            border: '1px solid rgba(250, 204, 21, 0.3)',
            borderRadius: '3px',
            padding: '2px 6px',
            fontSize: '0.66rem',
            fontWeight: 800,
            color: '#facc15',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}
        >
          {isMobile ? 'MOBILE 9:16' : 'DESKTOP 16:9'}
        </div>
      </div>

      {/* Card Info Footer matching Screenshots */}
      <div
        style={{
          padding: '12px 14px',
          background: '#0d0d0d',
          borderTop: '1px solid #1c1c1c',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
        }}
      >
        <div style={{ overflow: 'hidden' }}>
          {/* Title */}
          <div
            style={{
              fontSize: '0.86rem',
              fontWeight: 800,
              color: '#ffffff',
              letterSpacing: '0.02em',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              marginBottom: '3px',
            }}
            title={item.title}
          >
            {cleanTitle}
          </div>

          {/* Resolution & Aspect Ratio */}
          <div
            style={{
              fontSize: '0.74rem',
              fontFamily: 'var(--font-mono)',
              color: '#a3a3a3',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span style={{ color: '#facc15', fontWeight: 600 }}>{item.resolutionStr}</span>
            <span>•</span>
            <span>{isMobile ? '9:16' : '16:9'}</span>
          </div>
        </div>

        {/* Action icons (Right) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Lightbox zoom */}
          <button
            type="button"
            onClick={() => onOpenLightbox(item)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#777777',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '4px',
            }}
            title="Inspect"
          >
            <Maximize2 size={16} />
          </button>

          {/* Quick single download (matching yellow arrow in screenshot) */}
          <button
            type="button"
            onClick={() => onSingleDownload(item)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#facc15',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '4px',
              transition: 'transform 0.1s',
            }}
            title="Download Wallpaper"
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <Download size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
