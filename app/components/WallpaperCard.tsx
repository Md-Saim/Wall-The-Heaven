'use client';

import React, { useState } from 'react';
import { Download, Check, Maximize2, Monitor, Smartphone } from 'lucide-react';
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

  return (
    <div
      className="glass-panel-interactive"
      style={{
        position: 'relative',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        aspectRatio: isMobile ? '9 / 16' : '16 / 9',
        border: isSelected
          ? '2px solid #00f0ff'
          : '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: isSelected
          ? '0 0 25px rgba(0, 240, 255, 0.35)'
          : '0 4px 20px rgba(0, 0, 0, 0.4)',
      }}
    >
      {/* Loading Skeleton */}
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

      {/* Image element with proxy fallback */}
      <img
        src={item.previewUrl || item.url}
        alt={item.title}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={(e) => {
          // If direct preview fails, route through our CORS proxy
          const target = e.currentTarget;
          if (!target.src.includes('/api/proxy')) {
            target.src = `/api/proxy?url=${encodeURIComponent(item.previewUrl || item.url)}`;
          }
        }}
        onClick={() => onOpenLightbox(item)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          cursor: 'pointer',
          transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease',
          opacity: isLoaded ? 1 : 0,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
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
          top: '12px',
          left: '12px',
          zIndex: 3,
          width: '28px',
          height: '28px',
          borderRadius: '8px',
          border: isSelected ? 'none' : '1.5px solid rgba(255, 255, 255, 0.5)',
          background: isSelected ? '#00f0ff' : 'rgba(5, 7, 13, 0.65)',
          color: '#05070d',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          backdropFilter: 'blur(8px)',
          transition: 'transform 0.15s, background 0.15s',
        }}
        title={isSelected ? 'Deselect wallpaper' : 'Select for batch ZIP'}
      >
        {isSelected && <Check size={18} strokeWidth={3} />}
      </button>

      {/* Device & Resolution Badges (Top-Right) */}
      <div
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          zIndex: 3,
          display: 'flex',
          gap: '6px',
        }}
      >
        <span
          className={isMobile ? 'badge badge-violet' : 'badge badge-cyan'}
          style={{
            backdropFilter: 'blur(10px)',
            fontSize: '0.68rem',
            padding: '3px 8px',
          }}
        >
          {isMobile ? <Smartphone size={11} /> : <Monitor size={11} />}
          <span>{isMobile ? 'Mobile' : 'Desktop'}</span>
        </span>

        <span
          className="badge badge-muted"
          style={{
            backdropFilter: 'blur(10px)',
            fontSize: '0.68rem',
            padding: '3px 8px',
          }}
        >
          {item.resolutionStr}
        </span>
      </div>

      {/* Bottom Overlay bar on Hover */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 3,
          padding: '12px 14px',
          background: 'linear-gradient(180deg, transparent 0%, rgba(5, 7, 13, 0.9) 80%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pointerEvents: 'none',
        }}
      >
        <span
          style={{
            fontSize: '0.78rem',
            color: 'var(--text-secondary)',
            fontWeight: 500,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '65%',
          }}
        >
          {item.source}
        </span>

        {/* Quick Action buttons */}
        <div style={{ display: 'flex', gap: '8px', pointerEvents: 'auto' }}>
          {/* Zoom Lightbox */}
          <button
            type="button"
            onClick={() => onOpenLightbox(item)}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '6px',
              padding: '6px',
              color: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="Preview Fullscreen"
          >
            <Maximize2 size={14} />
          </button>

          {/* Download Single */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSingleDownload(item);
            }}
            style={{
              background: 'linear-gradient(135deg, #00f0ff 0%, #0284c7 100%)',
              border: 'none',
              borderRadius: '6px',
              padding: '6px',
              color: '#05070d',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
            }}
            title="Download Wallpaper"
          >
            <Download size={14} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
