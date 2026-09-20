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
  '#CS2',
  '#CYBERPUNK',
  '#ELDENRING',
  '#GTA5',
  '#VALORANT',
  '#ZHONGLI',
  '#DARKSOULS',
  '#WITCHER',
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
      style={{
        position: 'relative',
        zIndex: 10,
        maxWidth: '1080px',
        margin: '0 auto',
        padding: '36px 20px 20px',
      }}
    >
      {/* Hero Title matching Screenshots */}
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <h2
          style={{
            fontSize: 'clamp(2.1rem, 5.5vw, 3.4rem)',
            fontWeight: 900,
            color: '#ffffff',
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            marginBottom: '10px',
          }}
        >
          Find Pure High-Res Wallpapers
        </h2>
        <p
          style={{
            fontSize: '1rem',
            color: 'var(--text-secondary)',
            fontWeight: 500,
            letterSpacing: '0.01em',
          }}
        >
          100% Clean. Hardcore Gaming. Pure Black Aesthetic.
        </p>
      </div>

      {/* Main Search Input Box matching Screenshot */}
      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          alignItems: 'center',
          background: '#090909',
          border: '1px solid #2a2a2a',
          borderRadius: '4px',
          overflow: 'hidden',
          marginBottom: '20px',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.9)',
          transition: 'border-color 0.2s',
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = '#facc15';
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = '#2a2a2a';
        }}
      >
        <div style={{ padding: '0 16px', display: 'flex', alignItems: 'center' }}>
          <Search size={20} color="#777777" />
        </div>

        <input
          type="text"
          value={localInput}
          onChange={(e) => setLocalInput(e.target.value)}
          placeholder="Search wallpapers (e.g. Cyberpunk 2077, Elden Ring, FPS)..."
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: '#ffffff',
            fontSize: '1rem',
            padding: '16px 0',
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
              padding: '8px',
              marginRight: '8px',
            }}
          >
            <X size={18} />
          </button>
        )}

        {/* Big Yellow SEARCH -> button */}
        <button
          type="submit"
          disabled={isLoading}
          style={{
            background: '#facc15',
            color: '#000000',
            border: 'none',
            fontWeight: 900,
            fontSize: '0.96rem',
            padding: '16px 32px',
            cursor: isLoading ? 'wait' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            transition: 'background 0.15s',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#eab308';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#facc15';
          }}
        >
          <span>{isLoading ? 'Searching...' : 'Search'}</span>
          <ArrowRight size={18} strokeWidth={3} />
        </button>
      </form>

      {/* Filter Row: Form Factor + Resolutions + Trending Tags */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          background: 'rgba(10, 10, 10, 0.75)',
          padding: '14px 18px',
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#888888', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              RATIO:
            </span>

            <button
              type="button"
              onClick={() => handleDeviceChange('desktop')}
              className={`pill-filter ${device === 'desktop' ? 'active' : ''}`}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <Monitor size={14} />
              <span>DESKTOP (16:9)</span>
            </button>

            <button
              type="button"
              onClick={() => handleDeviceChange('mobile')}
              className={`pill-filter ${device === 'mobile' ? 'active' : ''}`}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <Smartphone size={14} />
              <span>MOBILE (9:16)</span>
            </button>

            <button
              type="button"
              onClick={() => handleDeviceChange('all')}
              className={`pill-filter ${device === 'all' ? 'active' : ''}`}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <Globe size={14} />
              <span>ALL</span>
            </button>
          </div>

          {/* Resolution Selector matching screenshot */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#888888', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              RESOLUTION:
            </span>

            {[
              { id: 'all', label: 'ALL' },
              { id: '1080p', label: '1920x1080' },
              { id: '1440p', label: '2560x1440' },
              { id: '4k', label: '3840x2160' },
            ].map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => onResolutionChange(r.id)}
                className={`pill-filter ${minRes === r.id ? 'active' : ''}`}
              >
                {r.label}
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
