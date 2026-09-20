'use client';

import React, { useState } from 'react';
import { Search, Monitor, Smartphone, Globe, Sparkles, Filter, X } from 'lucide-react';

interface SearchBarProps {
  query: string;
  setQuery: (q: string) => void;
  device: 'desktop' | 'mobile' | 'all';
  setDevice: (d: 'desktop' | 'mobile' | 'all') => void;
  minRes: string;
  setMinRes: (r: string) => void;
  onSearch: (newQuery?: string, newDevice?: 'desktop' | 'mobile' | 'all') => void;
  isLoading: boolean;
}

const POPULAR_TAGS = [
  'Genshin Impact',
  'Zhongli',
  'Cyberpunk 2077',
  'Elden Ring',
  'Dark Souls',
  'The Witcher 3',
  'Skyrim',
  'Naruto',
  'Anime 4K',
  'Sci-Fi City',
];

export default function SearchBar({
  query,
  setQuery,
  device,
  setDevice,
  minRes,
  setMinRes,
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
    setLocalInput(tag);
    setQuery(tag);
    onSearch(tag);
  };

  const handleDeviceChange = (newDevice: 'desktop' | 'mobile' | 'all') => {
    setDevice(newDevice);
    onSearch(localInput.trim(), newDevice);
  };

  return (
    <div
      style={{
        position: 'relative',
        zIndex: 10,
        maxWidth: '920px',
        margin: '0 auto',
        padding: '32px 20px 10px',
      }}
    >
      {/* Title / Hook */}
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <h2
          style={{
            fontSize: 'clamp(2rem, 5vw, 3.2rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            marginBottom: '12px',
          }}
        >
          Find Pure High-Res{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #00f0ff 0%, #a855f7 70%, #ec4899 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Wallpapers
          </span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '560px', margin: '0 auto' }}>
          Select your device form factor, type your favorite game or character, and let the magic happen.
        </p>
      </div>

      {/* Device Form Factor Switcher */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '20px',
        }}
      >
        <div
          className="glass-panel"
          style={{
            display: 'inline-flex',
            padding: '5px',
            borderRadius: 'var(--radius-full)',
            gap: '6px',
            background: 'rgba(10, 14, 26, 0.8)',
          }}
        >
          {/* Desktop */}
          <button
            type="button"
            onClick={() => handleDeviceChange('desktop')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 18px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.88rem',
              fontWeight: 600,
              transition: 'all 0.2s ease',
              background:
                device === 'desktop'
                  ? 'linear-gradient(135deg, #00f0ff 0%, #0284c7 100%)'
                  : 'transparent',
              color: device === 'desktop' ? '#05070d' : 'var(--text-secondary)',
              boxShadow: device === 'desktop' ? '0 0 20px rgba(0, 240, 255, 0.4)' : 'none',
            }}
          >
            <Monitor size={17} strokeWidth={2.4} />
            <span>Desktop / Laptop (16:9)</span>
          </button>

          {/* Mobile */}
          <button
            type="button"
            onClick={() => handleDeviceChange('mobile')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 18px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.88rem',
              fontWeight: 600,
              transition: 'all 0.2s ease',
              background:
                device === 'mobile'
                  ? 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)'
                  : 'transparent',
              color: device === 'mobile' ? '#ffffff' : 'var(--text-secondary)',
              boxShadow: device === 'mobile' ? '0 0 20px rgba(168, 85, 247, 0.4)' : 'none',
            }}
          >
            <Smartphone size={17} strokeWidth={2.4} />
            <span>Mobile / Phone (9:16)</span>
          </button>

          {/* All */}
          <button
            type="button"
            onClick={() => handleDeviceChange('all')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.88rem',
              fontWeight: 600,
              transition: 'all 0.2s ease',
              background:
                device === 'all'
                  ? 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)'
                  : 'transparent',
              color: device === 'all' ? '#ffffff' : 'var(--text-secondary)',
            }}
          >
            <Globe size={16} />
            <span>All</span>
          </button>
        </div>
      </div>

      {/* Search Input Bar */}
      <form onSubmit={handleSubmit} style={{ position: 'relative', marginBottom: '18px' }}>
        <div
          className="glass-panel"
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '8px 10px 8px 20px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid rgba(0, 240, 255, 0.25)',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.6), 0 0 20px rgba(0, 240, 255, 0.1)',
            transition: 'border-color 0.2s, box-shadow 0.2s',
          }}
        >
          <Search size={22} color="#00f0ff" style={{ marginRight: '14px', flexShrink: 0 }} />

          <input
            type="text"
            value={localInput}
            onChange={(e) => setLocalInput(e.target.value)}
            placeholder={`Search ${
              device === 'mobile' ? 'mobile wallpapers' : 'desktop wallpapers'
            } (e.g. 'Genshin Impact Zhongli', 'Cyberpunk', 'Elden Ring')...`}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#ffffff',
              fontSize: '1.05rem',
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
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '6px',
                marginRight: '6px',
              }}
            >
              <X size={18} />
            </button>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              background: 'linear-gradient(135deg, #00f0ff 0%, #a855f7 100%)',
              color: '#05070d',
              border: 'none',
              borderRadius: 'var(--radius-full)',
              padding: '12px 28px',
              fontWeight: 700,
              fontSize: '0.96rem',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 20px rgba(0, 240, 255, 0.35)',
              transition: 'transform 0.15s, opacity 0.15s',
              opacity: isLoading ? 0.7 : 1,
            }}
          >
            {isLoading ? (
              <span>Searching...</span>
            ) : (
              <>
                <Sparkles size={16} strokeWidth={2.5} />
                <span>Search</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Resolution Filters & Quick Tags */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        {/* Resolution selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Filter size={13} />
            <span>Resolution:</span>
          </span>
          {[
            { id: 'all', label: 'All Quality' },
            { id: '1080p', label: '1080p FHD' },
            { id: '1440p', label: '1440p 2K' },
            { id: '4k', label: '4K Ultra HD' },
          ].map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => {
                setMinRes(r.id);
                onSearch(localInput.trim());
              }}
              style={{
                background: minRes === r.id ? 'rgba(0, 240, 255, 0.18)' : 'rgba(255, 255, 255, 0.05)',
                color: minRes === r.id ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                border: minRes === r.id ? '1px solid rgba(0, 240, 255, 0.4)' : '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-full)',
                padding: '4px 12px',
                fontSize: '0.76rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* Quick Suggestion Tags */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Trending:</span>
          {POPULAR_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => handleTagClick(tag)}
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
                borderRadius: 'var(--radius-full)',
                padding: '3px 10px',
                fontSize: '0.74rem',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(0, 240, 255, 0.3)';
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
                e.currentTarget.style.color = 'var(--text-secondary)';
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
