'use client';

import React, { useState, useEffect, useCallback } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

import BackgroundSouls from './components/BackgroundSouls';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import WallpaperGrid from './components/WallpaperGrid';
import LightboxModal from './components/LightboxModal';
import BatchDownloadBar from './components/BatchDownloadBar';
import { WallpaperItem } from './api/search/route';

export default function Home() {
  const [query, setQuery] = useState('Cyberpunk 2077');
  const [device, setDevice] = useState<'desktop' | 'mobile' | 'all'>('desktop');
  const [minRes, setMinRes] = useState('all');
  const [results, setResults] = useState<WallpaperItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<WallpaperItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lightboxItem, setLightboxItem] = useState<WallpaperItem | null>(null);

  // ZIP packaging state
  const [isZipping, setIsZipping] = useState(false);
  const [zipProgress, setZipProgress] = useState({ current: 0, total: 0, percent: 0 });

  // Execute search
  const executeSearch = useCallback(
    async (searchQuery?: string, targetDevice?: 'desktop' | 'mobile' | 'all') => {
      const activeQuery = searchQuery !== undefined ? searchQuery : query;
      const activeDevice = targetDevice !== undefined ? targetDevice : device;

      if (!activeQuery.trim()) return;

      setIsLoading(true);
      setSelectedItems([]);

      try {
        const params = new URLSearchParams({
          q: activeQuery.trim(),
          device: activeDevice,
          minRes,
          limit: '35',
        });

        const res = await fetch(`/api/search?${params.toString()}`);
        if (!res.ok) throw new Error(`Search failed: ${res.status}`);

        const data = await res.json();
        setResults(data.results || []);
      } catch (err) {
        console.error('Error executing search:', err);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    },
    [query, device, minRes]
  );

  // Initial load
  useEffect(() => {
    executeSearch('Cyberpunk 2077', 'desktop');
  }, []);

  // Selection handlers
  const handleToggleSelect = (item: WallpaperItem) => {
    setSelectedItems((prev) => {
      const exists = prev.some((p) => p.id === item.id);
      if (exists) {
        return prev.filter((p) => p.id !== item.id);
      } else {
        return [...prev, item];
      }
    });
  };

  const handleSelectAll = () => {
    setSelectedItems([...results]);
  };

  const handleDeselectAll = () => {
    setSelectedItems([]);
  };

  // Download Single Wallpaper
  const handleSingleDownload = async (item: WallpaperItem) => {
    try {
      const proxyUrl = `/api/proxy?url=${encodeURIComponent(item.url)}`;
      const res = await fetch(proxyUrl);
      if (!res.ok) throw new Error('Download failed');

      const blob = await res.blob();
      const cleanName = `${query.replace(/[^a-zA-Z0-9_-]/g, '_')}_${item.source}_${item.id}.${item.fileType || 'jpg'}`;
      saveAs(blob, cleanName);
    } catch (err) {
      console.error('Single download failed:', err);
      // Fallback: Open image URL in new tab
      window.open(item.url, '_blank');
    }
  };

  // Download Batch as ZIP
  const handleDownloadZip = async () => {
    if (selectedItems.length === 0 || isZipping) return;

    setIsZipping(true);
    setZipProgress({ current: 0, total: selectedItems.length, percent: 0 });

    const zip = new JSZip();
    const cleanQuery = query.replace(/[^a-zA-Z0-9_-]/g, '_') || 'wallpapers';

    try {
      let downloaded = 0;
      for (let i = 0; i < selectedItems.length; i++) {
        const item = selectedItems[i];
        try {
          const proxyUrl = `/api/proxy?url=${encodeURIComponent(item.url)}`;
          const resp = await fetch(proxyUrl);
          if (resp.ok) {
            const blob = await resp.blob();
            const fileName = `${cleanQuery}_${String(i + 1).padStart(3, '0')}_${item.source}_${item.id}.${item.fileType || 'jpg'}`;
            zip.file(fileName, blob);
          }
        } catch (downloadErr) {
          console.warn(`Failed to package item ${item.id} into ZIP:`, downloadErr);
        }

        downloaded++;
        const percent = Math.round((downloaded / selectedItems.length) * 100);
        setZipProgress({ current: downloaded, total: selectedItems.length, percent });
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      saveAs(zipBlob, `wallpapers_${cleanQuery}_${device}_${selectedItems.length}.zip`);
    } catch (err) {
      console.error('ZIP generation error:', err);
    } finally {
      setIsZipping(false);
      setSelectedItems([]);
    }
  };

  return (
    <main style={{ minHeight: '100vh', position: 'relative' }}>
      {/* Moving Ethereal Souls & Dissolved PC Game Logos Canvas */}
      <BackgroundSouls />

      {/* Header */}
      <Header />

      {/* Search & Ratio Selection Bar */}
      <SearchBar
        query={query}
        setQuery={setQuery}
        device={device}
        setDevice={setDevice}
        minRes={minRes}
        setMinRes={setMinRes}
        onSearch={executeSearch}
        isLoading={isLoading}
      />

      {/* Wallpaper Results Grid */}
      <WallpaperGrid
        items={results}
        selectedItems={selectedItems}
        onToggleSelect={handleToggleSelect}
        onSelectAll={handleSelectAll}
        onDeselectAll={handleDeselectAll}
        onOpenLightbox={setLightboxItem}
        onSingleDownload={handleSingleDownload}
        isLoading={isLoading}
        query={query}
      />

      {/* Fullscreen Lightbox Preview */}
      <LightboxModal
        item={lightboxItem}
        onClose={() => setLightboxItem(null)}
        onDownload={handleSingleDownload}
      />

      {/* Floating Bottom Batch ZIP Download Bar */}
      <BatchDownloadBar
        selectedItems={selectedItems}
        onDeselectAll={handleDeselectAll}
        onDownloadZip={handleDownloadZip}
        isZipping={isZipping}
        zipProgress={zipProgress}
      />
    </main>
  );
}
