'use client';

import React, { useEffect, useRef } from 'react';

interface SoulParticle {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  baseAlpha: number;
  pulseSpeed: number;
  pulseOffset: number;
  color: string;
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

    // Mouse coordinates for gentle soul interaction
    const mouse = { x: -1000, y: -1000, radius: 150 };

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

    // Soul Particle Colors
    const soulGradients = [
      { core: '#e0faff', aura: 'rgba(0, 240, 255, 0.45)' },
      { core: '#f5e8ff', aura: 'rgba(168, 85, 247, 0.45)' },
      { core: '#e0f2fe', aura: 'rgba(56, 189, 248, 0.40)' },
      { core: '#fef3c7', aura: 'rgba(245, 158, 11, 0.35)' },
    ];

    // Initialize Soul Bubbles
    const soulCount = Math.min(45, Math.floor(window.innerWidth / 30));
    const souls: SoulParticle[] = [];

    for (let i = 0; i < soulCount; i++) {
      const grad = soulGradients[Math.floor(Math.random() * soulGradients.length)];
      souls.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 14 + 6,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -(Math.random() * 0.5 + 0.2), // gentle upwards drift
        baseAlpha: Math.random() * 0.4 + 0.25,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        pulseOffset: Math.random() * Math.PI * 2,
        color: grad.aura,
      });
    }

    // Preload PC Game Emblems
    const emblemSources = [
      '/game-logos/dark-souls.svg',
      '/game-logos/elden-ring.svg',
      '/game-logos/cyberpunk.svg',
      '/game-logos/witcher.svg',
      '/game-logos/skyrim.svg',
      '/game-logos/half-life.svg',
      '/game-logos/doom.svg',
    ];

    const emblems: GameEmblem[] = [];
    emblemSources.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        emblems.push({
          img,
          x: Math.random() * (width - 250) + 120,
          y: Math.random() * (height - 250) + 120,
          size: Math.random() * 80 + 130, // 130px to 210px
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.12,
          rotation: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.0015,
          alpha: Math.random() * 0.05 + 0.04, // Very subtle, dissolved (0.04 to 0.09)
          targetAlpha: Math.random() * 0.06 + 0.04,
          alphaSpeed: Math.random() * 0.0008 + 0.0004,
        });
      };
    });

    let frame = 0;

    // Render Loop
    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      // Deep dark cosmic background fill
      const bgGrad = ctx.createRadialGradient(
        width / 2, height / 2, 50,
        width / 2, height / 2, Math.max(width, height)
      );
      bgGrad.addColorStop(0, '#0a0e1c');
      bgGrad.addColorStop(0.5, '#060811');
      bgGrad.addColorStop(1, '#030408');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 1. Draw Dissolved PC Game Logos (deep background layer)
      emblems.forEach((emb) => {
        emb.x += emb.vx;
        emb.y += emb.vy;
        emb.rotation += emb.vRot;

        // Wrap boundaries smoothly
        if (emb.x < -emb.size) emb.x = width + emb.size;
        if (emb.x > width + emb.size) emb.x = -emb.size;
        if (emb.y < -emb.size) emb.y = height + emb.size;
        if (emb.y > height + emb.size) emb.y = -emb.size;

        // Slowly cycle opacity
        if (Math.abs(emb.alpha - emb.targetAlpha) < 0.002) {
          emb.targetAlpha = Math.random() * 0.05 + 0.035;
        } else {
          emb.alpha += (emb.targetAlpha - emb.alpha) * emb.alphaSpeed;
        }

        ctx.save();
        ctx.globalAlpha = emb.alpha;
        ctx.translate(emb.x, emb.y);
        ctx.rotate(emb.rotation);
        ctx.drawImage(emb.img, -emb.size / 2, -emb.size / 2, emb.size, emb.size);
        ctx.restore();
      });

      // 2. Draw Moving Souls & Bubbles
      souls.forEach((soul) => {
        soul.x += soul.vx;
        soul.y += soul.vy;

        // Wrap when reaching top
        if (soul.y < -soul.radius * 2) {
          soul.y = height + soul.radius * 2;
          soul.x = Math.random() * width;
        }
        if (soul.x < -soul.radius * 2) soul.x = width + soul.radius * 2;
        if (soul.x > width + soul.radius * 2) soul.x = -soul.radius * 2;

        // Mouse gentle repulsion
        const dx = mouse.x - soul.x;
        const dy = mouse.y - soul.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius && dist > 0) {
          const force = (mouse.radius - dist) / mouse.radius;
          soul.x -= (dx / dist) * force * 3;
          soul.y -= (dy / dist) * force * 3;
        }

        // Pulse calculation
        const pulse = Math.sin(frame * soul.pulseSpeed + soul.pulseOffset);
        const currentAlpha = soul.baseAlpha + pulse * 0.15;
        const currentRadius = soul.radius + pulse * 1.5;

        // Glowing soul aura
        const radGrad = ctx.createRadialGradient(
          soul.x, soul.y, currentRadius * 0.15,
          soul.x, soul.y, currentRadius * 2.2
        );
        radGrad.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
        radGrad.addColorStop(0.3, soul.color);
        radGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.save();
        ctx.globalAlpha = Math.max(0, currentAlpha);
        ctx.fillStyle = radGrad;
        ctx.beginPath();
        ctx.arc(soul.x, soul.y, currentRadius * 2.2, 0, Math.PI * 2);
        ctx.fill();

        // Inner glowing core
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.beginPath();
        ctx.arc(soul.x, soul.y, currentRadius * 0.35, 0, Math.PI * 2);
        ctx.fill();
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
      }}
    />
  );
}
