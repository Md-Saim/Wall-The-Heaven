'use client';

import React from 'react';
import WallpaperCard from './WallpaperCard';
import { WallpaperItem } from '../api/search/route';
import { CheckSquare, Square, Image as ImageIcon } from 'lucide-react';

interface WallpaperGridProps {
  items: WallpaperItem[];
  selectedItems: WallpaperItem[];
  onToggleSelect: (item: WallpaperItem) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onOpenLightbox: (item: WallpaperItem) => void;
  onSingleDownload: (item: WallpaperItem) => void;
  isLoading: boolean;
  query: string;
  device: 'desktop' | 'mobile' | 'all';
  minRes?: string;
  onResolutionChange?: (r: string) => void;
}

export default function WallpaperGrid({
  items,
  selectedItems,
  onToggleSelect,
  onSelectAll,
  onDeselectAll,
  onOpenLightbox,
  onSingleDownload,
  isLoading,
  query,
  device,
  minRes = 'all',
  onResolutionChange,
}: WallpaperGridProps) {
  const allSelected = items.length > 0 && selectedItems.length === items.length;
  const isMobileView = device === 'mobile';

  return (
    <section className="wallpapers-section-wrapper">
      {/* Top Controls Bar */}
      <div className="wallpapers-top-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.92rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {isLoading ? 'SEARCHING ARCHIVES...' : `${items.length} WALLPAPERS DISCOVERED`}
          </span>
          {query && (
            <span
              style={{
                background: 'rgba(250, 204, 21, 0.1)',
                border: '1px solid rgba(250, 204, 21, 0.3)',
                color: '#facc15',
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '3px',
              }}
            >
              {query.toUpperCase()}
            </span>
          )}
          {minRes !== 'all' && (
            <span
              style={{
                background: 'rgba(250, 204, 21, 0.15)',
                border: '1px solid #facc15',
                color: '#facc15',
                fontSize: '0.7rem',
                fontWeight: 800,
                padding: '2px 6px',
                borderRadius: '3px',
              }}
            >
              {minRes.toUpperCase()}
            </span>
          )}
        </div>

        {items.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              onClick={allSelected ? onDeselectAll : onSelectAll}
              className="select-all-btn"
            >
              {allSelected ? <CheckSquare size={15} color="#facc15" /> : <Square size={15} />}
              <span>{allSelected ? 'DESELECT ALL' : 'SELECT ALL'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Loading Skeleton Grid */}
      {isLoading && (
        <div className={`wallpapers-grid-layout ${isMobileView ? 'mobile-form-factor' : ''}`}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="hardcore-card skeleton-shimmer"
              style={{
                aspectRatio: isMobileView ? '9 / 13' : '16 / 10',
                borderRadius: '6px',
              }}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && items.length === 0 && (
        <div
          className="hardcore-card"
          style={{
            textAlign: 'center',
            padding: '60px 20px',
            maxWidth: '540px',
            margin: '30px auto',
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'rgba(250, 204, 21, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}
          >
            <ImageIcon size={26} color="#facc15" />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.04em' }}>
            {minRes !== 'all' ? `NO ${minRes.toUpperCase()} WALLPAPERS FOUND` : 'NO WALLPAPERS FOUND'}
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '18px', lineHeight: 1.6 }}>
            {minRes !== 'all'
              ? `There are no wallpapers in the ${minRes} tier for "${query}". Try switching to ALL resolutions.`
              : `We couldn't find any wallpapers for "${query}". Try searching for "Anime", "Cyberpunk", "Nature", "Space", or "Elden Ring".`}
          </p>

          {minRes !== 'all' && onResolutionChange && (
            <button
              type="button"
              onClick={() => onResolutionChange('all')}
              className="btn-yellow-primary"
              style={{ padding: '10px 20px', fontSize: '0.84rem' }}
            >
              VIEW ALL RESOLUTIONS
            </button>
          )}
        </div>
      )}

      {/* Responsive Wallpapers Grid: 2 columns on mobile */}
      {!isLoading && items.length > 0 && (
        <div className={`wallpapers-grid-layout ${isMobileView ? 'mobile-form-factor' : ''}`}>
          {items.map((item) => {
            const isSelected = selectedItems.some((sel) => sel.id === item.id);
            return (
              <WallpaperCard
                key={item.id}
                item={item}
                isSelected={isSelected}
                onToggleSelect={onToggleSelect}
                onOpenLightbox={onOpenLightbox}
                onSingleDownload={onSingleDownload}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}
