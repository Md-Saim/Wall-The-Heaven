'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';

/**
 * ZipTransition – Jacket-style zipper.
 *
 * Two yellow "fabric" halves sit on the sides like an open jacket.
 * The current page is visible through the V-shaped opening.
 *
 * Closing (bottom → top):
 *   The two halves zip together from the bottom, the V-gap shrinks
 *   upward as the slider pulls up. Below the zip-line the halves
 *   are sealed; above it they flare into a V showing the page.
 *
 * Opening (top → bottom):
 *   The slider descends and the halves peel apart from the top,
 *   revealing the new page through the growing V-gap.
 */

const TOOTH_COUNT = 32;
const TOOTH_H = 14;
const TOOTH_W = 10;

// V-gap half-width at the very top when fully open (percentage of viewport width)
const V_SPREAD = 52; // each side retreats 52% from center = basically off-screen

export default function ZipTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [phase, setPhase] = useState<'idle' | 'closing' | 'closed' | 'opening'>('idle');
  const [displayChildren, setDisplayChildren] = useState(children);
  const [prevPath, setPrevPath] = useState(pathname);
  const [zipLine, setZipLine] = useState(100); // percentage from top (100 = bottom)

  const runTransition = useCallback(() => {
    setPhase('closing');
    setZipLine(100);

    // Animate zip closing: bottom (100%) → top (0%) over 550ms
    let start: number | null = null;
    const closeDuration = 550;

    const animateClose = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / closeDuration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      setZipLine(100 - eased * 100);

      if (p < 1) {
        requestAnimationFrame(animateClose);
      } else {
        // Fully closed — swap content
        setPhase('closed');
        setDisplayChildren(children);

        setTimeout(() => {
          // Open: top (0%) → bottom (100%) over 500ms
          setPhase('opening');
          let start2: number | null = null;
          const openDuration = 500;

          const animateOpen = (ts2: number) => {
            if (!start2) start2 = ts2;
            const p2 = Math.min((ts2 - start2) / openDuration, 1);
            const eased2 = 1 - Math.pow(1 - p2, 2.5);
            setZipLine(eased2 * 100);

            if (p2 < 1) {
              requestAnimationFrame(animateOpen);
            } else {
              setPhase('idle');
              setZipLine(100);
            }
          };
          requestAnimationFrame(animateOpen);
        }, 180);
      }
    };
    requestAnimationFrame(animateClose);
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

  // Calculate clip paths for the two jacket halves
  // zipLine is 0-100 (percentage from top where the zipper currently is)
  //
  // BELOW the zipLine: halves are joined at center (50%)
  // ABOVE the zipLine: halves flare apart in a V
  //
  // The V-spread at any point above the zipLine depends on how far above it is.
  // At the zipLine itself: both edges are at 50% (meeting)
  // At the very top (0%): edges are spread apart by V_SPREAD

  // How much the V-gap is open (0 when closed, 1 when fully open/idle)
  const openness = zipLine / 100;

  // Left half clip-path points (clockwise):
  // top-left → top-right-edge (with V spread) → zip-point (center) → bottom-center → bottom-left
  const leftTopEdge = 50 - V_SPREAD * Math.min(openness * 1.3, 1); // how far left the right edge goes at top
  const leftClip = `polygon(
    0% 0%,
    ${leftTopEdge}% 0%,
    50% ${zipLine}%,
    50% 100%,
    0% 100%
  )`;

  // Right half (mirror):
  const rightTopEdge = 50 + V_SPREAD * Math.min(openness * 1.3, 1);
  const rightClip = `polygon(
    ${rightTopEdge}% 0%,
    100% 0%,
    100% 100%,
    50% 100%,
    50% ${zipLine}%
  )`;

  // Teeth: only render from zipLine down to bottom
  const teethStartPct = zipLine;
  const teethEndPct = 100;
  const visibleTeeth = Math.floor(((teethEndPct - teethStartPct) / 100) * TOOTH_COUNT);

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
          {/* ── LEFT JACKET HALF ── */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: '#facc15',
              clipPath: leftClip,
              zIndex: 2,
            }}
          >
            {/* Fabric texture - subtle gradient */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(135deg, #facc15 0%, #eab308 40%, #f5c518 60%, #facc15 100%)',
            }} />
            {/* Flowing blob layers for depth */}
            <div style={{
              position: 'absolute', left: '20%', top: '30%',
              width: 300, height: 300, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(234,179,8,0.5) 0%, transparent 70%)',
              filter: 'blur(40px)',
              animation: 'blobFloat 3s ease-in-out infinite alternate',
            }} />
            <div style={{
              position: 'absolute', left: '10%', top: '60%',
              width: 250, height: 250, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(253,224,71,0.4) 0%, transparent 70%)',
              filter: 'blur(35px)',
              animation: 'blobFloat 3.5s 0.2s ease-in-out infinite alternate',
            }} />
            <div style={{
              position: 'absolute', left: '30%', top: '10%',
              width: 200, height: 200, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(202,138,4,0.35) 0%, transparent 70%)',
              filter: 'blur(30px)',
              animation: 'blobFloat 2.8s 0.1s ease-in-out infinite alternate',
            }} />
            {/* Diagonal seam/stitch line on left panel */}
            <div style={{
              position: 'absolute', right: 0, top: 0, width: 2, height: '100%',
              background: 'rgba(180,130,0,0.3)',
            }} />
          </div>

          {/* ── RIGHT JACKET HALF ── */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: '#facc15',
              clipPath: rightClip,
              zIndex: 2,
            }}
          >
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(225deg, #facc15 0%, #eab308 40%, #f5c518 60%, #facc15 100%)',
            }} />
            <div style={{
              position: 'absolute', right: '20%', top: '25%',
              width: 280, height: 280, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(234,179,8,0.45) 0%, transparent 70%)',
              filter: 'blur(40px)',
              animation: 'blobFloat 3.2s 0.15s ease-in-out infinite alternate',
            }} />
            <div style={{
              position: 'absolute', right: '15%', top: '65%',
              width: 320, height: 320, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(253,224,71,0.35) 0%, transparent 70%)',
              filter: 'blur(35px)',
              animation: 'blobFloat 3.6s 0.3s ease-in-out infinite alternate',
            }} />
            {/* Seam line on right panel */}
            <div style={{
              position: 'absolute', left: 0, top: 0, width: 2, height: '100%',
              background: 'rgba(180,130,0,0.3)',
            }} />
          </div>

          {/* ── ZIPPER TEETH (along the center seam, below the zipLine) ── */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 5 }}>
            {Array.from({ length: visibleTeeth }).map((_, i) => {
              // Position teeth from zipLine downward
              const toothPct = teethStartPct + ((i + 0.5) / TOOTH_COUNT) * 100;
              if (toothPct > 100) return null;

              return (
                <React.Fragment key={`tooth-${i}`}>
                  {/* Left tooth */}
                  <div style={{
                    position: 'absolute',
                    top: `${toothPct}%`,
                    left: '50%',
                    transform: 'translate(-100%, -50%)',
                    width: TOOTH_W,
                    height: TOOTH_H,
                  }}>
                    <div style={{
                      width: '100%', height: '100%',
                      background: 'linear-gradient(90deg, #1a1a1a, #2a2a2a)',
                      borderRadius: '2px 0 0 2px',
                      border: '1px solid #444',
                      borderRight: 'none',
                      position: 'relative',
                    }}>
                      {/* Nub */}
                      <div style={{
                        position: 'absolute', top: '50%', right: -3,
                        transform: 'translateY(-50%)',
                        width: 5, height: 7,
                        background: '#333', borderRadius: '0 2px 2px 0',
                        border: '1px solid #555', borderLeft: 'none',
                      }} />
                      {/* Metal shine */}
                      <div style={{
                        position: 'absolute', top: '15%', left: 2,
                        width: 2, height: '70%',
                        background: 'rgba(255,255,255,0.15)', borderRadius: 1,
                      }} />
                    </div>
                  </div>

                  {/* Right tooth (offset by half for interlocking) */}
                  <div style={{
                    position: 'absolute',
                    top: `calc(${toothPct}% + ${TOOTH_H / 2}px)`,
                    left: '50%',
                    transform: 'translateY(-50%)',
                    width: TOOTH_W,
                    height: TOOTH_H,
                  }}>
                    <div style={{
                      width: '100%', height: '100%',
                      background: 'linear-gradient(270deg, #1a1a1a, #2a2a2a)',
                      borderRadius: '0 2px 2px 0',
                      border: '1px solid #444',
                      borderLeft: 'none',
                      position: 'relative',
                    }}>
                      {/* Nub */}
                      <div style={{
                        position: 'absolute', top: '50%', left: -3,
                        transform: 'translateY(-50%)',
                        width: 5, height: 7,
                        background: '#333', borderRadius: '2px 0 0 2px',
                        border: '1px solid #555', borderRight: 'none',
                      }} />
                      {/* Metal shine */}
                      <div style={{
                        position: 'absolute', top: '15%', right: 2,
                        width: 2, height: '70%',
                        background: 'rgba(255,255,255,0.15)', borderRadius: 1,
                      }} />
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>

          {/* ── ZIPPER SLIDER (at the zip line) ── */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: `${zipLine}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: 10,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              transition: 'none',
            }}
          >
            {/* Slider body */}
            <div style={{
              width: 24, height: 32,
              background: 'linear-gradient(180deg, #2a2a2a 0%, #111 40%, #1a1a1a 100%)',
              borderRadius: '4px 4px 2px 2px',
              border: '1.5px solid #555',
              position: 'relative',
              boxShadow: '0 3px 12px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.12)',
            }}>
              {/* Slot where teeth feed through */}
              <div style={{
                position: 'absolute', top: '25%', left: '50%',
                transform: 'translateX(-50%)',
                width: 8, height: 12,
                background: '#0a0a0a', borderRadius: 2,
                border: '1px solid #666',
              }} />
              {/* Left shine strip */}
              <div style={{
                position: 'absolute', top: 3, left: 3,
                width: 2, height: '75%',
                background: 'rgba(255,255,255,0.1)', borderRadius: 1,
              }} />
            </div>
            {/* Pull tab */}
            <div style={{
              width: 10, height: 18,
              background: 'linear-gradient(180deg, #2a2a2a, #151515)',
              borderRadius: '0 0 5px 5px',
              border: '1px solid #555', borderTop: 'none',
              marginTop: -1,
              boxShadow: '0 2px 6px rgba(0,0,0,0.6)',
              position: 'relative',
            }}>
              <div style={{
                position: 'absolute', bottom: 3, left: '50%',
                transform: 'translateX(-50%)',
                width: 5, height: 5, borderRadius: '50%',
                border: '1.5px solid #666', background: 'transparent',
              }} />
            </div>
          </div>

          {/* ── CENTER TAPE (black zipper tape behind teeth) ── */}
          <div style={{
            position: 'absolute',
            top: `${zipLine}%`, left: '50%',
            transform: 'translateX(-50%)',
            width: 28, height: `${100 - zipLine}%`,
            background: 'linear-gradient(90deg, #0f0f0f, #1a1a1a, #0f0f0f)',
            zIndex: 3,
          }} />

          {/* ── EDGE SHADOW (where fabric meets zip) ── */}
          <div style={{
            position: 'absolute',
            top: `${zipLine}%`, left: '50%',
            transform: 'translateX(calc(-50% - 18px))',
            width: 8, height: `${100 - zipLine}%`,
            background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.25))',
            zIndex: 4,
          }} />
          <div style={{
            position: 'absolute',
            top: `${zipLine}%`, left: '50%',
            transform: 'translateX(calc(-50% + 10px))',
            width: 8, height: `${100 - zipLine}%`,
            background: 'linear-gradient(270deg, transparent, rgba(0,0,0,0.25))',
            zIndex: 4,
          }} />
        </div>
      )}
    </>
  );
}
