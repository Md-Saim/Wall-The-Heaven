'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';

/**
 * ZipTransition – realistic zipper closing/opening on page navigation.
 *
 * Flow:
 *  1. Yellow screen fades in with flowing blob layers
 *  2. Black zipper teeth interlock from top → bottom (closing)
 *  3. Zipper slider pulls down the center seam
 *  4. Content swaps (hidden behind yellow + teeth)
 *  5. Zipper opens bottom → top, teeth separate
 *  6. Yellow screen fades out revealing new page
 */

const TOOTH_COUNT = 28;
const TOOTH_H = 18;
const TOOTH_W = 14;
const TOOTH_GAP = 2;

// Pre-generate blob positions for the flowing yellow background
const BLOBS = [
  { x: '15%', y: '20%', size: 320, delay: 0 },
  { x: '70%', y: '15%', size: 280, delay: 0.1 },
  { x: '40%', y: '60%', size: 360, delay: 0.05 },
  { x: '80%', y: '70%', size: 300, delay: 0.15 },
  { x: '25%', y: '80%', size: 250, delay: 0.08 },
  { x: '55%', y: '35%', size: 340, delay: 0.12 },
  { x: '10%', y: '50%', size: 220, delay: 0.06 },
];

export default function ZipTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [phase, setPhase] = useState<'idle' | 'yellow-in' | 'zipping' | 'hold' | 'unzipping' | 'yellow-out'>('idle');
  const [displayChildren, setDisplayChildren] = useState(children);
  const [prevPath, setPrevPath] = useState(pathname);
  const [zipProgress, setZipProgress] = useState(0); // 0 to 1

  const runTransition = useCallback(() => {
    // Phase 1: Yellow screen fades in (300ms)
    setPhase('yellow-in');
    setZipProgress(0);

    setTimeout(() => {
      // Phase 2: Zipper teeth close top→bottom (500ms)
      setPhase('zipping');

      let start: number | null = null;
      const duration = 500;
      const animateZip = (ts: number) => {
        if (!start) start = ts;
        const elapsed = ts - start;
        const p = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
        setZipProgress(eased);
        if (p < 1) {
          requestAnimationFrame(animateZip);
        } else {
          // Phase 3: Hold (swap content) (200ms)
          setPhase('hold');
          setDisplayChildren(children);

          setTimeout(() => {
            // Phase 4: Unzip teeth open top→bottom (450ms)
            setPhase('unzipping');
            let start2: number | null = null;
            const dur2 = 450;
            const animateUnzip = (ts2: number) => {
              if (!start2) start2 = ts2;
              const elapsed2 = ts2 - start2;
              const p2 = Math.min(elapsed2 / dur2, 1);
              const eased2 = 1 - Math.pow(1 - p2, 2);
              setZipProgress(1 - eased2);
              if (p2 < 1) {
                requestAnimationFrame(animateUnzip);
              } else {
                // Phase 5: Yellow fades out (250ms)
                setPhase('yellow-out');
                setTimeout(() => {
                  setPhase('idle');
                  setZipProgress(0);
                }, 280);
              }
            };
            requestAnimationFrame(animateUnzip);
          }, 200);
        }
      };
      requestAnimationFrame(animateZip);
    }, 320);
  }, [children]);

  useEffect(() => {
    if (pathname !== prevPath) {
      setPrevPath(pathname);
      runTransition();
    } else {
      setDisplayChildren(children);
    }
  }, [pathname, prevPath, children, runTransition]);

  const isActive = phase !== 'idle';

  // How many teeth are "closed" based on progress
  const closedTeeth = Math.floor(zipProgress * TOOTH_COUNT);
  // Slider position (follows the closing front)
  const sliderTop = zipProgress * 100;

  return (
    <>
      {displayChildren}

      {isActive && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            pointerEvents: 'none',
            overflow: 'hidden',
          }}
          aria-hidden="true"
        >
          {/* ── YELLOW BACKGROUND WITH FLOWING BLOBS ── */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: '#facc15',
              opacity:
                phase === 'yellow-in' ? 1
                : phase === 'yellow-out' ? 0
                : 1,
              transition:
                phase === 'yellow-in' ? 'opacity 0.3s ease-out'
                : phase === 'yellow-out' ? 'opacity 0.25s ease-in'
                : 'none',
            }}
          >
            {/* Flowing blob layers – slightly different yellows for depth */}
            {BLOBS.map((blob, i) => (
              <div
                key={`blob-${i}`}
                style={{
                  position: 'absolute',
                  left: blob.x,
                  top: blob.y,
                  width: blob.size,
                  height: blob.size,
                  borderRadius: '50%',
                  background:
                    i % 3 === 0
                      ? 'radial-gradient(circle, rgba(234,179,8,0.5) 0%, rgba(250,204,21,0) 70%)'
                      : i % 3 === 1
                      ? 'radial-gradient(circle, rgba(253,224,71,0.45) 0%, rgba(250,204,21,0) 70%)'
                      : 'radial-gradient(circle, rgba(202,138,4,0.4) 0%, rgba(250,204,21,0) 70%)',
                  transform: 'translate(-50%, -50%)',
                  animation: `blobFloat ${2.5 + i * 0.3}s ${blob.delay}s ease-in-out infinite alternate`,
                  filter: 'blur(30px)',
                }}
              />
            ))}
          </div>

          {/* ── ZIPPER CENTER TRACK ── */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '6px',
              height: '100%',
              zIndex: 3,
            }}
          >
            {/* Track background (dark line where zipper sits) */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: '#1a1a1a',
                borderRadius: '3px',
                opacity: phase === 'yellow-in' ? 0 : 1,
                transition: 'opacity 0.2s',
              }}
            />
          </div>

          {/* ── ZIPPER TEETH (LEFT SIDE) ── */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: '50%',
              transform: 'translateX(-100%)',
              width: TOOTH_W + 6,
              height: '100%',
              zIndex: 4,
            }}
          >
            {Array.from({ length: TOOTH_COUNT }).map((_, i) => {
              const isClosed = i < closedTeeth;
              const topPos = (i / TOOTH_COUNT) * 100;
              return (
                <div
                  key={`lt-${i}`}
                  style={{
                    position: 'absolute',
                    top: `${topPos}%`,
                    right: 0,
                    width: TOOTH_W,
                    height: TOOTH_H,
                    transition: 'transform 0.08s ease-out',
                    transform: isClosed ? 'translateX(3px)' : 'translateX(-12px)',
                  }}
                >
                  {/* Tooth body */}
                  <div style={{
                    width: '100%',
                    height: '100%',
                    background: '#111111',
                    borderRadius: '1px 3px 3px 1px',
                    border: '1px solid #333',
                    borderLeft: 'none',
                    boxShadow: isClosed ? '2px 0 4px rgba(0,0,0,0.5)' : 'none',
                    position: 'relative',
                  }}>
                    {/* Metal shine on tooth */}
                    <div style={{
                      position: 'absolute',
                      top: '20%',
                      right: '2px',
                      width: '3px',
                      height: '60%',
                      background: 'rgba(255,255,255,0.12)',
                      borderRadius: '1px',
                    }} />
                    {/* Interlocking nub */}
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      right: '-3px',
                      transform: 'translateY(-50%)',
                      width: '6px',
                      height: '8px',
                      background: '#222',
                      borderRadius: '0 2px 2px 0',
                      border: '1px solid #444',
                      borderLeft: 'none',
                    }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── ZIPPER TEETH (RIGHT SIDE) ── */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: '50%',
              width: TOOTH_W + 6,
              height: '100%',
              zIndex: 4,
            }}
          >
            {Array.from({ length: TOOTH_COUNT }).map((_, i) => {
              const isClosed = i < closedTeeth;
              // Offset right teeth by half a tooth height for interlocking
              const topPos = (i / TOOTH_COUNT) * 100 + (100 / TOOTH_COUNT / 2);
              return (
                <div
                  key={`rt-${i}`}
                  style={{
                    position: 'absolute',
                    top: `${topPos}%`,
                    left: 0,
                    width: TOOTH_W,
                    height: TOOTH_H,
                    transition: 'transform 0.08s ease-out',
                    transform: isClosed ? 'translateX(-3px)' : 'translateX(12px)',
                  }}
                >
                  {/* Tooth body */}
                  <div style={{
                    width: '100%',
                    height: '100%',
                    background: '#111111',
                    borderRadius: '3px 1px 1px 3px',
                    border: '1px solid #333',
                    borderRight: 'none',
                    boxShadow: isClosed ? '-2px 0 4px rgba(0,0,0,0.5)' : 'none',
                    position: 'relative',
                  }}>
                    {/* Metal shine */}
                    <div style={{
                      position: 'absolute',
                      top: '20%',
                      left: '2px',
                      width: '3px',
                      height: '60%',
                      background: 'rgba(255,255,255,0.12)',
                      borderRadius: '1px',
                    }} />
                    {/* Interlocking nub */}
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '-3px',
                      transform: 'translateY(-50%)',
                      width: '6px',
                      height: '8px',
                      background: '#222',
                      borderRadius: '2px 0 0 2px',
                      border: '1px solid #444',
                      borderRight: 'none',
                    }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── ZIPPER SLIDER (the pull tab) ── */}
          {(phase === 'zipping' || phase === 'hold' || phase === 'unzipping') && (
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: `${sliderTop}%`,
                transform: 'translate(-50%, -50%)',
                zIndex: 10,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              {/* Slider housing */}
              <div style={{
                width: 26,
                height: 34,
                background: 'linear-gradient(180deg, #2a2a2a 0%, #111 50%, #1a1a1a 100%)',
                borderRadius: '4px',
                border: '1.5px solid #444',
                position: 'relative',
                boxShadow: '0 4px 16px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.1)',
              }}>
                {/* Center slot */}
                <div style={{
                  position: 'absolute',
                  top: '30%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 8,
                  height: 10,
                  background: '#0a0a0a',
                  borderRadius: '2px',
                  border: '1px solid #555',
                }} />
                {/* Metal shine strip */}
                <div style={{
                  position: 'absolute',
                  top: 2,
                  left: 3,
                  width: 3,
                  height: '80%',
                  background: 'rgba(255,255,255,0.08)',
                  borderRadius: 1,
                }} />
              </div>
              {/* Pull tab */}
              <div style={{
                width: 12,
                height: 20,
                background: 'linear-gradient(180deg, #333 0%, #1a1a1a 100%)',
                borderRadius: '0 0 6px 6px',
                border: '1px solid #444',
                borderTop: 'none',
                marginTop: -1,
                boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
                position: 'relative',
              }}>
                {/* Pull ring hole */}
                <div style={{
                  position: 'absolute',
                  bottom: 3,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  border: '1.5px solid #555',
                  background: 'transparent',
                }} />
              </div>
            </div>
          )}

          {/* ── FABRIC EDGES (black zip tape on each side) ── */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: '50%',
              transform: 'translateX(calc(-50% - 22px))',
              width: 10,
              height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.3), rgba(20,20,20,0.8))',
              zIndex: 2,
              opacity: phase === 'yellow-in' || phase === 'yellow-out' ? 0 : 1,
              transition: 'opacity 0.2s',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: '50%',
              transform: 'translateX(calc(-50% + 12px))',
              width: 10,
              height: '100%',
              background: 'linear-gradient(270deg, transparent, rgba(0,0,0,0.3), rgba(20,20,20,0.8))',
              zIndex: 2,
              opacity: phase === 'yellow-in' || phase === 'yellow-out' ? 0 : 1,
              transition: 'opacity 0.2s',
            }}
          />
        </div>
      )}
    </>
  );
}
