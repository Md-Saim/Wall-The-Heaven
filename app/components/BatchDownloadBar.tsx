'use client';

import React from 'react';
import { Download, X, Archive } from 'lucide-react';
import { WallpaperItem } from '../api/search/route';

interface BatchDownloadBarProps {
  selectedItems: WallpaperItem[];
  onDeselectAll: () => void;
  onStartPackaging: () => void;
}

export default function BatchDownloadBar({
  selectedItems,
  onDeselectAll,
  onStartPackaging,
}: BatchDownloadBarProps) {
  if (selectedItems.length === 0) return null;

  return (
    <aside
      aria-label="Batch download options"
      className="batch-download-bar-container"
    >
      <div className="batch-download-bar-content">
        {/* Count info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
          <div className="batch-count-badge">
            {selectedItems.length}
          </div>

          <div style={{ minWidth: 0, overflow: 'hidden' }}>
            <div className="batch-main-title">
              <span className="batch-text-desktop">
                {selectedItems.length} WALLPAPER{selectedItems.length > 1 ? 'S' : ''} IN PACK
              </span>
              <span className="batch-text-mobile">
                {selectedItems.length} SELECTED
              </span>
            </div>
            <div className="batch-sub-title">
              READY TO PACKAGE ZIP
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
          <button
            type="button"
            onClick={onDeselectAll}
            className="batch-clear-btn"
            title="Deselect all"
          >
            CLEAR
          </button>

          <button
            type="button"
            onClick={onStartPackaging}
            className="btn-yellow-primary batch-package-btn"
          >
            <Archive size={15} strokeWidth={2.5} />
            <span className="batch-btn-text-desktop">PACKAGE PACK</span>
            <span className="batch-btn-text-mobile">PACKAGE</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
