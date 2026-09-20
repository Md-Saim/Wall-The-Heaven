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
}: WallpaperGridProps) {
  const allSelected = items.length > 0 && selectedItems.length === items.length;
  const isMobileView = device === 'mobile';

  return (
    <section
      style={{
        position: 'relative',
        zIndex: 10,
        maxWidth: '1360px',
        margin: '0 auto',
        padding: '10px 20px 100px',
      }}
    >
      {/* Top Controls Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '20px',
          paddingBottom: '12px',
          borderBottom: '1px solid #1a1a1a',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {isLoading ? 'SEARCHING ARCHIVES...' : `${items.length} WALLPAPERS DISCOVERED`}
          </span>
          {query && (
            <span
              style={{
                background: 'rgba(250, 204, 21, 0.1)',
                border: '1px solid rgba(250, 204, 21, 0.3)',
                color: '#facc15',
                fontSize: '0.74rem',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '3px',
              }}
            >
              {query.toUpperCase()}
            </span>
          )}
        </div>

        {items.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              onClick={allSelected ? onDeselectAll : onSelectAll}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: '#0d0d0d',
                border: '1px solid #282828',
                color: '#cccccc',
                borderRadius: '4px',
                padding: '6px 14px',
                fontSize: '0.8rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#facc15';
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#282828';
                e.currentTarget.style.color = '#cccccc';
              }}
            >
              {allSelected ? <CheckSquare size={16} color="#facc15" /> : <Square size={16} />}
              <span>{allSelected ? 'DESELECT ALL' : 'SELECT ALL'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Loading Skeleton Grid */}
      {isLoading && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobileView
              ? 'repeat(auto-fill, minmax(180px, 1fr))'
              : 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '20px',
          }}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="hardcore-card skeleton-shimmer"
              style={{
                aspectRatio: isMobileView ? '9 / 14' : '16 / 9',
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
            padding: '70px 20px',
            maxWidth: '540px',
            margin: '40px auto',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(250, 204, 21, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}
          >
            <ImageIcon size={30} color="#facc15" />
          </div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.04em' }}>
            NO WALLPAPERS FOUND
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px' }}>
            We couldn&apos;t find any wallpapers for &quot;{query}&quot;. Try gaming terms like &quot;Cyberpunk&quot;, &quot;Elden Ring&quot;, &quot;Zhongli&quot;, or &quot;CS2&quot;.
          </p>
        </div>
      )}

      {/* Responsive Wallpapers Grid */}
      {!isLoading && items.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobileView
              ? 'repeat(auto-fill, minmax(190px, 1fr))'
              : 'repeat(auto-fill, minmax(290px, 1fr))',
            gap: '20px',
          }}
        >
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
