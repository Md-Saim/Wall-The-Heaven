'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';

/**
 * ZipTransition – A full-screen zipper animation overlay that plays on route changes.
 * Two black panels slide in from left/right like a zipper closing, meet in the middle
 * with yellow zipper teeth, then unzip apart to reveal the new page.
 */
export default function ZipTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [phase, setPhase] = useState<'idle' | 'zip-in' | 'hold' | 'zip-out'>('idle');
  const [displayChildren, setDisplayChildren] = useState(children);
  const [prevPath, setPrevPath] = useState(pathname);

  const runTransition = useCallback(() => {
    setPhase('zip-in');

    // Phase 1: Zip closes (panels slide in) — 400ms
    setTimeout(() => {
      setPhase('hold');
      setDisplayChildren(children); // swap content while hidden

      // Phase 2: Brief hold at center — 150ms
      setTimeout(() => {
        setPhase('zip-out');

        // Phase 3: Zip opens (panels slide out) — 400ms
        setTimeout(() => {
          setPhase('idle');
        }, 450);
      }, 150);
    }, 420);
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

  return (
    <>
      {displayChildren}

      {/* Overlay container */}
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
          {/* Left black panel */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '50%',
              height: '100%',
              background: '#000000',
              transform:
                phase === 'zip-in'
                  ? 'translateX(0%)'
                  : phase === 'hold'
                  ? 'translateX(0%)'
                  : 'translateX(-105%)',
              transition:
                phase === 'zip-in'
                  ? 'transform 0.4s cubic-bezier(0.76, 0, 0.24, 1)'
                  : phase === 'zip-out'
                  ? 'transform 0.42s cubic-bezier(0.76, 0, 0.24, 1)'
                  : 'none',
              ...(phase === 'zip-in' && { animation: 'zipSlideLeft 0.4s cubic-bezier(0.76, 0, 0.24, 1) forwards' }),
            }}
          >
            {/* Right edge zipper teeth (left panel) */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                right: '-1px',
                width: '20px',
                height: '100%',
                overflow: 'hidden',
              }}
            >
              {Array.from({ length: 30 }).map((_, i) => (
                <div
                  key={`lt-${i}`}
                  style={{
                    width: 0,
                    height: 0,
                    borderLeft: '10px solid #000000',
                    borderTop: '8px solid transparent',
                    borderBottom: '8px solid transparent',
                    marginLeft: '10px',
                    opacity: phase === 'hold' || phase === 'zip-out' ? 1 : 0,
                    transition: `opacity 0.15s ${i * 8}ms`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Right black panel */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '50%',
              height: '100%',
              background: '#000000',
              transform:
                phase === 'zip-in'
                  ? 'translateX(0%)'
                  : phase === 'hold'
                  ? 'translateX(0%)'
                  : 'translateX(105%)',
              transition:
                phase === 'zip-in'
                  ? 'transform 0.4s cubic-bezier(0.76, 0, 0.24, 1)'
                  : phase === 'zip-out'
                  ? 'transform 0.42s cubic-bezier(0.76, 0, 0.24, 1)'
                  : 'none',
              ...(phase === 'zip-in' && { animation: 'zipSlideRight 0.4s cubic-bezier(0.76, 0, 0.24, 1) forwards' }),
            }}
          >
            {/* Left edge zipper teeth (right panel) */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: '-1px',
                width: '20px',
                height: '100%',
                overflow: 'hidden',
              }}
            >
              {Array.from({ length: 30 }).map((_, i) => (
                <div
                  key={`rt-${i}`}
                  style={{
                    width: 0,
                    height: 0,
                    borderRight: '10px solid #000000',
                    borderTop: '8px solid transparent',
                    borderBottom: '8px solid transparent',
                    opacity: phase === 'hold' || phase === 'zip-out' ? 1 : 0,
                    transition: `opacity 0.15s ${i * 8}ms`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Center yellow zipper line */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '4px',
              height: '100%',
              background:
                phase === 'hold'
                  ? '#facc15'
                  : 'transparent',
              boxShadow:
                phase === 'hold'
                  ? '0 0 20px rgba(250, 204, 21, 0.8), 0 0 40px rgba(250, 204, 21, 0.4)'
                  : 'none',
              transition: 'all 0.15s',
            }}
          />

          {/* Yellow zipper pull (slider) that runs down the center */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '14px',
              height: '28px',
              background: '#facc15',
              borderRadius: '3px',
              boxShadow: '0 0 16px rgba(250, 204, 21, 0.9), 0 0 32px rgba(250, 204, 21, 0.5)',
              opacity: phase === 'zip-in' || phase === 'hold' ? 1 : 0,
              animation:
                phase === 'zip-in'
                  ? 'zipPullDown 0.4s cubic-bezier(0.76, 0, 0.24, 1) forwards'
                  : phase === 'zip-out'
                  ? 'zipPullUp 0.35s cubic-bezier(0.76, 0, 0.24, 1) forwards'
                  : 'none',
            }}
          >
            {/* Small yellow triangle at bottom of pull */}
            <div
              style={{
                position: 'absolute',
                bottom: '-6px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: 0,
                height: 0,
                borderLeft: '5px solid transparent',
                borderRight: '5px solid transparent',
                borderTop: '6px solid #facc15',
              }}
            />
          </div>

          {/* Yellow spark particles during hold */}
          {phase === 'hold' && (
            <>
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={`spark-${i}`}
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: `${12 + i * 12}%`,
                    width: '3px',
                    height: '3px',
                    background: '#facc15',
                    borderRadius: '50%',
                    boxShadow: '0 0 6px #facc15',
                    animation: `sparkle 0.3s ${i * 20}ms ease-out forwards`,
                    opacity: 0,
                  }}
                />
              ))}
            </>
          )}
        </div>
      )}
    </>
  );
}
