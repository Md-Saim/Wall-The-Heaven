'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

import BackgroundSouls from './BackgroundSouls';
import Header from './Header';
import SearchBar from './SearchBar';
import WallpaperGrid from './WallpaperGrid';
import LightboxModal from './LightboxModal';
import BatchDownloadBar from './BatchDownloadBar';
import PackStatusView from './PackStatusView';
import Footer from './Footer';
import { WallpaperItem } from '../api/search/route';

interface BrowseViewProps {
  initialQuery?: string;
  initialDevice?: 'desktop' | 'mobile' | 'all';
}

export default function BrowseView({
  initialQuery = 'Cyberpunk 2077',
  initialDevice = 'desktop',
}: BrowseViewProps) {
  const [query, setQuery] = useState(initialQuery);
  const [device, setDevice] = useState<'desktop' | 'mobile' | 'all'>(initialDevice);
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
  const [completedZipName, setCompletedZipName] = useState<string>('Ultimate_Packs_2026.zip');

  // Performance cache & request sequence tracking
  const cacheRef = useRef<Record<string, WallpaperItem[]>>({});
  const activeRequestIdRef = useRef<number>(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Fast execute search with instant caching and abort controller
  const executeSearch = useCallback(
    async (
      searchQuery?: string,
      targetDevice?: 'desktop' | 'mobile' | 'all',
      targetMinRes?: string
    ) => {
      const activeQuery = (searchQuery !== undefined ? searchQuery : query).trim();
      const activeDevice = targetDevice !== undefined ? targetDevice : device;
      const activeMinRes = targetMinRes !== undefined ? targetMinRes : minRes;

      if (!activeQuery) return;

      // Update state immediately
      setQuery(activeQuery);
      setDevice(activeDevice);
      if (targetMinRes) setMinRes(targetMinRes);

      const cacheKey = `${activeQuery.toLowerCase()}__${activeDevice}__${activeMinRes}`;

      // Check client-side memory cache for instantaneous 0ms switching!
      if (cacheRef.current[cacheKey]) {
        setResults(cacheRef.current[cacheKey]);
        setIsLoading(false);
        return;
      }

      // If not in cache, clear current results and show loading skeleton immediately
      // This prevents old mobile wallpapers from sticking when switching to desktop
      setResults([]);
      setIsLoading(true);
      setSelectedItems([]);

      // Cancel any previous in-flight search fetch
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;

      // Request sequence tracking to prevent race conditions
      const currentRequestId = ++activeRequestIdRef.current;

      try {
        const params = new URLSearchParams({
          q: activeQuery,
          device: activeDevice,
          minRes: activeMinRes,
          limit: '45',
        });

        const res = await fetch(`/api/search?${params.toString()}`, {
          signal: controller.signal,
        });

        if (!res.ok) throw new Error(`Search failed: ${res.status}`);

        const data = await res.json();

        // Only commit results if this is the newest requested query
        if (currentRequestId === activeRequestIdRef.current) {
          const items: WallpaperItem[] = data.results || [];
          cacheRef.current[cacheKey] = items;
          setResults(items);
        }
      } catch (err: unknown) {
        if ((err as Error)?.name !== 'AbortError') {
          console.error('Error executing search:', err);
          if (currentRequestId === activeRequestIdRef.current) {
            setResults([]);
          }
        }
      } finally {
        if (currentRequestId === activeRequestIdRef.current) {
          setIsLoading(false);
        }
      }
    },
    [query, device, minRes]
  );

  // Initial load
  useEffect(() => {
    executeSearch(initialQuery, initialDevice, 'all');
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

      // Generate ZIP blob in browser memory
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

  const handleNewSearchFromPack = () => {
    setSelectedItems([]);
    setViewState('browse');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', background: '#000000' }}>
      {/* Moving Ethereal Bubbles & Dissolved Hardcore PC Game Logos Canvas */}
      <BackgroundSouls />

      {/* Header with Navigation & Middle GitHub button */}
      <Header
        activeView="browse"
        onNavClick={(view) => {
          if (view === 'browse') setViewState('browse');
        }}
        selectedCount={selectedItems.length}
        onOpenQueue={handleStartPackaging}
      />

      <main style={{ flex: 1, position: 'relative', zIndex: 10 }}>
        {/* VIEW STATE 1: BROWSE & SEARCH */}
        {viewState === 'browse' && (
          <>
            <SearchBar
              query={query}
              setQuery={setQuery}
              device={device}
              setDevice={setDevice}
              minRes={minRes}
              setMinRes={(r) => {
                setMinRes(r);
                executeSearch(query, device, r);
              }}
              onSearch={(newQuery, newDevice) => executeSearch(newQuery, newDevice, minRes)}
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

      {/* Real Footer Section */}
      <Footer />
    </div>
  );
}
