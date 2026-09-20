'use client';

import React from 'react';
import WallpaperCard from './WallpaperCard';
import { WallpaperItem } from '../api/search/route';
import { CheckSquare, Square, Image as ImageIcon, Sparkles } from 'lucide-react';

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
}: WallpaperGridProps) {
  const allSelected = items.length > 0 && selectedItems.length === items.length;

  return (
    <section
      style={{
        position: 'relative',
        zIndex: 10,
        maxWidth: '1360px',
        margin: '0 auto',
        padding: '20px 20px 100px',
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
          paddingBottom: '14px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>
            {isLoading ? 'Searching...' : `Found ${items.length} Wallpapers`}
          </span>
          {query && (
            <span className="badge badge-cyan" style={{ fontSize: '0.72rem' }}>
              &quot;{query}&quot;
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
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
                borderRadius: 'var(--radius-sm)',
                padding: '6px 14px',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {allSelected ? <CheckSquare size={16} color="#00f0ff" /> : <Square size={16} />}
              <span>{allSelected ? 'Deselect All' : 'Select All'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Loading Skeleton Grid */}
      {isLoading && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '20px',
          }}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="glass-panel skeleton-shimmer"
              style={{
                borderRadius: 'var(--radius-md)',
                aspectRatio: '16 / 9',
              }}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && items.length === 0 && (
        <div
          className="glass-panel"
          style={{
            textAlign: 'center',
            padding: '60px 20px',
            maxWidth: '520px',
            margin: '40px auto',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(0, 240, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}
          >
            <ImageIcon size={30} color="#00f0ff" />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>
            No Wallpapers Found
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px' }}>
            We couldn&apos;t find any wallpapers for &quot;{query}&quot;. Try broader terms like &quot;Cyberpunk&quot;, &quot;Zhongli&quot;, or &quot;Anime&quot;.
          </p>
        </div>
      )}

      {/* Actual Results Grid */}
      {!isLoading && items.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '22px',
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
