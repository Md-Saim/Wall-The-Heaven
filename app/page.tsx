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
import PackStatusView from './components/PackStatusView';
import { WallpaperItem } from './api/search/route';

export default function Home() {
  const [query, setQuery] = useState('Cyberpunk 2077');
  const [device, setDevice] = useState<'desktop' | 'mobile' | 'all'>('desktop');
  const [minRes, setMinRes] = useState('all');
  const [results, setResults] = useState<WallpaperItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<WallpaperItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lightboxItem, setLightboxItem] = useState<WallpaperItem | null>(null);

  // App View State: 'browse' | 'packaging' | 'ready'
  const [viewState, setViewState] = useState<'browse' | 'packaging' | 'ready'>('browse');

  // ZIP packaging state
  const [zipProgress, setZipProgress] = useState({ current: 0, total: 0, percent: 0 });
  const [completedZipBlob, setCompletedZipBlob] = useState<Blob | null>(null);
  const [completedZipName, setCompletedZipName] = useState<string>('Ultimate_Packs_2025_v3.zip');

  // Search execution
  const executeSearch = useCallback(
    async (searchQuery?: string, targetDevice?: 'desktop' | 'mobile' | 'all') => {
      const activeQuery = searchQuery !== undefined ? searchQuery : query;
      const activeDevice = targetDevice !== undefined ? targetDevice : device;

      if (!activeQuery.trim()) return;

      setIsLoading(true);
      setSelectedItems([]);
      setViewState('browse');

      try {
        const params = new URLSearchParams({
          q: activeQuery.trim(),
          device: activeDevice,
          minRes,
          limit: '36',
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

  // Initial load on launch
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
      window.open(item.url, '_blank');
    }
  };

  // Start Batch Packaging -> Triggers Image 2 Screen (SEARCHING & DOWNLOADING) -> then Image 1 (PACK READY)
  const handleStartPackaging = async () => {
    if (selectedItems.length === 0) return;

    setViewState('packaging');
    const total = selectedItems.length;
    setZipProgress({ current: 0, total, percent: 0 });

    const zip = new JSZip();
    const cleanQuery = query.replace(/[^a-zA-Z0-9_-]/g, '_') || 'Game_Pack';
    const targetFileName = `${cleanQuery}_Pack_${device}_${total}.zip`;

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
          console.warn(`Failed downloading item ${item.id}:`, downloadErr);
        }

        downloaded++;
        const percent = Math.round((downloaded / total) * 100);
        setZipProgress({ current: downloaded, total, percent });
      }

      // Generate ZIP blob
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      setCompletedZipBlob(zipBlob);
      setCompletedZipName(targetFileName);

      // Transition to Image 1: PACK READY
      setViewState('ready');
    } catch (err) {
      console.error('ZIP generation error:', err);
      setViewState('browse');
    }
  };

  // Trigger download from Pack Ready screen
  const handleTriggerZipDownload = () => {
    if (completedZipBlob) {
      saveAs(completedZipBlob, completedZipName);
    }
  };

  // New search button on Pack Ready screen
  const handleNewSearchFromPack = () => {
    setSelectedItems([]);
    setViewState('browse');
  };

  return (
    <main style={{ minHeight: '100vh', position: 'relative', background: '#000000' }}>
      {/* Moving Ethereal Bubbles & Dissolved Hardcore PC Game Logos Canvas */}
      <BackgroundSouls />

      {/* Header matching screenshot */}
      <Header
        activeView={viewState === 'ready' ? 'collections' : 'browse'}
        onNavClick={(view) => {
          if (view === 'browse') setViewState('browse');
          else if (view === 'collections' && completedZipBlob) setViewState('ready');
          else setViewState('browse');
        }}
        selectedCount={selectedItems.length}
        onOpenQueue={handleStartPackaging}
      />

      {/* VIEW STATE 1: BROWSE & SEARCH (Images 3 & 4) */}
      {viewState === 'browse' && (
        <>
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
            device={device}
          />

          {/* Floating Bottom Batch Pack Bar */}
          <BatchDownloadBar
            selectedItems={selectedItems}
            onDeselectAll={handleDeselectAll}
            onStartPackaging={handleStartPackaging}
          />
        </>
      )}

      {/* VIEW STATE 2 & 3: PACKAGING (Image 2) & PACK READY (Image 1) */}
      {(viewState === 'packaging' || viewState === 'ready') && (
        <PackStatusView
          status={viewState}
          zipProgress={zipProgress}
          zipFileName={completedZipName}
          zipBlob={completedZipBlob}
          onDownloadZip={handleTriggerZipDownload}
          onNewSearch={handleNewSearchFromPack}
          onBackToBrowse={() => setViewState('browse')}
        />
      )}

      {/* Fullscreen Lightbox Preview */}
      <LightboxModal
        item={lightboxItem}
        onClose={() => setLightboxItem(null)}
        onDownload={handleSingleDownload}
      />
    </main>
  );
}
