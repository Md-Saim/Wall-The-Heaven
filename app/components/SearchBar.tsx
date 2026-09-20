'use client';

import React, { useState } from 'react';
import { Search, Monitor, Smartphone, Globe, ArrowRight, X } from 'lucide-react';

interface SearchBarProps {
  query: string;
  setQuery: (q: string) => void;
  device: 'desktop' | 'mobile' | 'all';
  setDevice: (d: 'desktop' | 'mobile' | 'all') => void;
  minRes: string;
  onResolutionChange: (r: string) => void;
  onSearch: (newQuery?: string, newDevice?: 'desktop' | 'mobile' | 'all') => void;
  isLoading: boolean;
}

const TRENDING_TAGS = [
  '#ANIME',
  '#CYBERPUNK',
  '#NATURE',
  '#ELDENRING',
  '#MOVIES',
  '#CARS',
  '#SPACE',
  '#VALORANT',
  '#MINIMAL',
];

export default function SearchBar({
  query,
  setQuery,
  device,
  setDevice,
  minRes,
  onResolutionChange,
  onSearch,
  isLoading,
}: SearchBarProps) {
  const [localInput, setLocalInput] = useState(query);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!localInput.trim()) return;
    setQuery(localInput.trim());
    onSearch(localInput.trim());
  };

  const handleTagClick = (tag: string) => {
    const clean = tag.replace('#', '');
    setLocalInput(clean);
    setQuery(clean);
    onSearch(clean);
  };

  const handleDeviceChange = (newDevice: 'desktop' | 'mobile' | 'all') => {
    setDevice(newDevice);
    const activeQ = localInput.trim() || query;
    onSearch(activeQ, newDevice);
  };

  return (
    <div
      className="search-section-wrapper"
      style={{
        position: 'relative',
        zIndex: 10,
        maxWidth: '1080px',
        margin: '0 auto',
      }}
    >
      {/* Hero Title matching Screenshots */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h2
          style={{
            fontSize: 'clamp(1.9rem, 5.5vw, 3.4rem)',
            fontWeight: 900,
            color: '#ffffff',
            letterSpacing: '-0.02em',
            lineHeight: 1.15,
            marginBottom: '10px',
          }}
        >
          Find Pure High-Res Wallpapers
        </h2>
        <p
          style={{
            fontSize: 'clamp(0.85rem, 2.5vw, 1rem)',
            color: 'var(--text-secondary)',
            fontWeight: 500,
            letterSpacing: '0.01em',
            padding: '0 10px',
          }}
        >
          100% Clean. Gaming, Anime, Movies, Nature &amp; More. Pure Black Aesthetic.
        </p>
      </div>

      {/* Main Search Input Box */}
      <form
        onSubmit={handleSubmit}
        className="search-form-box"
        style={{
          display: 'flex',
          alignItems: 'center',
          background: '#090909',
          border: '1px solid #2a2a2a',
          borderRadius: '4px',
          overflow: 'hidden',
          marginBottom: '16px',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.9)',
          transition: 'border-color 0.2s',
          width: '100%',
          boxSizing: 'border-box',
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = '#facc15';
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = '#2a2a2a';
        }}
      >
        <div style={{ padding: '0 14px', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <Search size={19} color="#777777" />
        </div>

        <input
          type="text"
          value={localInput}
          onChange={(e) => setLocalInput(e.target.value)}
          placeholder="Search wallpapers (e.g. Cyberpunk, Anime, Nature, Cars)..."
          className="search-input-element"
          style={{
            flex: 1,
            minWidth: 0,
            width: '100%',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: '#ffffff',
            fontSize: '0.96rem',
            padding: '14px 0',
            fontFamily: 'inherit',
          }}
        />

        {localInput && (
          <button
            type="button"
            onClick={() => setLocalInput('')}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#666666',
              cursor: 'pointer',
              padding: '6px',
              marginRight: '6px',
              flexShrink: 0,
            }}
          >
            <X size={18} />
          </button>
        )}

        {/* Yellow SEARCH button */}
        <button
          type="submit"
          disabled={isLoading}
          className="search-submit-button"
          style={{
            background: '#facc15',
            color: '#000000',
            border: 'none',
            fontWeight: 900,
            cursor: isLoading ? 'wait' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            transition: 'background 0.15s',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#eab308';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#facc15';
          }}
        >
          <span>{isLoading ? 'Searching...' : 'Search'}</span>
          <ArrowRight size={17} strokeWidth={3} />
        </button>
      </form>

      {/* Filter Row: Form Factor + Resolutions + Trending Tags */}
      <div
        className="search-filter-panel"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          background: 'rgba(10, 10, 10, 0.75)',
          borderRadius: '6px',
          border: '1px solid #1c1c1c',
        }}
      >
        {/* Row 1: Device Ratio & Resolutions */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '14px',
          }}
        >
          {/* Ratio / Device Form Factor */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#888888', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              RATIO:
            </span>

            <button
              type="button"
              onClick={() => handleDeviceChange('desktop')}
              className={`pill-filter ${device === 'desktop' ? 'active' : ''}`}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
            >
              <Monitor size={14} />
              <span className="ratio-label-desktop">DESKTOP (16:9)</span>
              <span className="ratio-label-mobile">DESKTOP</span>
            </button>

            <button
              type="button"
              onClick={() => handleDeviceChange('mobile')}
              className={`pill-filter ${device === 'mobile' ? 'active' : ''}`}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
            >
              <Smartphone size={14} />
              <span className="ratio-label-desktop">MOBILE (9:16)</span>
              <span className="ratio-label-mobile">MOBILE</span>
            </button>

            <button
              type="button"
              onClick={() => handleDeviceChange('all')}
              className={`pill-filter ${device === 'all' ? 'active' : ''}`}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
            >
              <Globe size={14} />
              <span>ALL</span>
            </button>
          </div>

          {/* Resolution Selector matching screenshot */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#888888', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              MIN RES:
            </span>

            {[
              { id: 'all', labelDesktop: 'ALL', labelMobile: 'ALL' },
              { id: '1080p', labelDesktop: '1920x1080', labelMobile: '1080P' },
              { id: '1440p', labelDesktop: '2560x1440', labelMobile: '1440P' },
              { id: '4k', labelDesktop: '3840x2160', labelMobile: '4K' },
            ].map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => onResolutionChange(r.id)}
                className={`pill-filter ${minRes === r.id ? 'active' : ''}`}
              >
                <span className="res-label-desktop">{r.labelDesktop}</span>
                <span className="res-label-mobile">{r.labelMobile}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Row 2: Trending Tags matching screenshot */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', paddingTop: '4px' }}>
          <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#facc15', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            TRENDING:
          </span>

          {TRENDING_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => handleTagClick(tag)}
              style={{
                background: 'transparent',
                border: '1px solid rgba(250, 204, 21, 0.25)',
                color: '#facc15',
                borderRadius: '3px',
                padding: '3px 9px',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#facc15';
                e.currentTarget.style.color = '#000000';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#facc15';
              }}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
