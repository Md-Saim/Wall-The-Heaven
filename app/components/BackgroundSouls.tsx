'use client';

import React, { useEffect, useRef } from 'react';

interface SoulParticle {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  alpha: number;
  pulseSpeed: number;
  pulseOffset: number;
  highlightAngle: number;
}

interface GameEmblem {
  img: HTMLImageElement;
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  rotation: number;
  vRot: number;
  alpha: number;
  targetAlpha: number;
  alphaSpeed: number;
}

export default function BackgroundSouls() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const mouse = { x: -1000, y: -1000, radius: 140 };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', handleResize);

    const isMobileDevice = window.innerWidth <= 768;

    // Mobile: 6-8 bubbles; Desktop: up to 35 bubbles
    const soulCount = isMobileDevice ? 6 : Math.min(35, Math.floor(window.innerWidth / 40));
    const souls: SoulParticle[] = [];

    for (let i = 0; i < soulCount; i++) {
      souls.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: isMobileDevice ? Math.random() * 12 + 6 : Math.random() * 18 + 8,
        vx: (Math.random() - 0.5) * 0.25,
        vy: -(Math.random() * 0.35 + 0.1), // gentle upward drift
        alpha: Math.random() * 0.25 + 0.15,
        pulseSpeed: Math.random() * 0.015 + 0.01,
        pulseOffset: Math.random() * Math.PI * 2,
        highlightAngle: Math.random() * Math.PI * 2,
      });
    }

    // Preload dissolved game emblems (only 3 on mobile to maximize GPU fillrate)
    const allEmblems = [
      '/game-logos/cyberpunk.svg',
      '/game-logos/elden-ring.svg',
      '/game-logos/valorant.svg',
      '/game-logos/cs2.svg',
      '/game-logos/steam.svg',
      '/game-logos/witcher.svg',
    ];

    const emblemSources = isMobileDevice ? allEmblems.slice(0, 3) : allEmblems;
    const emblems: GameEmblem[] = [];

    emblemSources.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        emblems.push({
          img,
          x: Math.random() * (width - 160) + 80,
          y: Math.random() * (height - 160) + 80,
          size: isMobileDevice ? Math.random() * 50 + 100 : Math.random() * 80 + 150,
          vx: (Math.random() - 0.5) * 0.1,
          vy: (Math.random() - 0.5) * 0.08,
          rotation: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.0008,
          alpha: Math.random() * 0.035 + 0.03,
          targetAlpha: Math.random() * 0.04 + 0.03,
          alphaSpeed: Math.random() * 0.0005 + 0.0002,
        });
      };
    });

    let frame = 0;

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      // Pure Black Base
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      // 1. Draw Dissolved Emblems
      emblems.forEach((emb) => {
        emb.x += emb.vx;
        emb.y += emb.vy;
        emb.rotation += emb.vRot;

        if (emb.x < -emb.size) emb.x = width + emb.size;
        if (emb.x > width + emb.size) emb.x = -emb.size;
        if (emb.y < -emb.size) emb.y = height + emb.size;
        if (emb.y > height + emb.size) emb.y = -emb.size;

        ctx.save();
        ctx.globalAlpha = emb.alpha;
        ctx.translate(emb.x, emb.y);
        ctx.rotate(emb.rotation);
        ctx.drawImage(emb.img, -emb.size / 2, -emb.size / 2, emb.size, emb.size);
        ctx.restore();
      });

      // 2. Draw Moving Glassy Bubbles
      souls.forEach((soul) => {
        soul.x += soul.vx;
        soul.y += soul.vy;

        if (soul.y < -soul.radius * 2) {
          soul.y = height + soul.radius * 2;
          soul.x = Math.random() * width;
        }
        if (soul.x < -soul.radius * 2) soul.x = width + soul.radius * 2;
        if (soul.x > width + soul.radius * 2) soul.x = -soul.radius * 2;

        // Gentle Mouse Repulsion (desktop only)
        if (!isMobileDevice && mouse.x > 0) {
          const dx = mouse.x - soul.x;
          const dy = mouse.y - soul.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius && dist > 0) {
            const force = (mouse.radius - dist) / mouse.radius;
            soul.x -= (dx / dist) * force * 2;
            soul.y -= (dy / dist) * force * 2;
          }
        }

        const pulse = Math.sin(frame * soul.pulseSpeed + soul.pulseOffset);
        const r = soul.radius + pulse * 1.1;

        ctx.save();
        ctx.globalAlpha = soul.alpha + pulse * 0.08;

        // Outer Dark Bubble Glow
        const bubbleGrad = ctx.createRadialGradient(
          soul.x, soul.y, r * 0.2,
          soul.x, soul.y, r
        );
        bubbleGrad.addColorStop(0, 'rgba(25, 25, 25, 0.2)');
        bubbleGrad.addColorStop(0.7, 'rgba(12, 12, 12, 0.55)');
        bubbleGrad.addColorStop(1, 'rgba(250, 204, 21, 0.18)');

        ctx.fillStyle = bubbleGrad;
        ctx.beginPath();
        ctx.arc(soul.x, soul.y, r, 0, Math.PI * 2);
        ctx.fill();

        // Golden Rim
        ctx.strokeStyle = 'rgba(250, 204, 21, 0.22)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Specular Glint (desktop only for performance)
        if (!isMobileDevice) {
          const glintX = soul.x - r * 0.35;
          const glintY = soul.y - r * 0.35;
          const glintGrad = ctx.createRadialGradient(
            glintX, glintY, 0,
            glintX, glintY, r * 0.45
          );
          glintGrad.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
          glintGrad.addColorStop(0.4, 'rgba(250, 204, 21, 0.25)');
          glintGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

          ctx.fillStyle = glintGrad;
          ctx.beginPath();
          ctx.arc(glintX, glintY, r * 0.45, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        willChange: 'transform',
        transform: 'translateZ(0)',
      }}
    />
  );
}
