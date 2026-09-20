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

    // Initialize 35 Dark Glossy Bubbles with Golden Highlights
    const soulCount = Math.min(40, Math.floor(window.innerWidth / 35));
    const souls: SoulParticle[] = [];

    for (let i = 0; i < soulCount; i++) {
      souls.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 18 + 8, // 8px to 26px
        vx: (Math.random() - 0.5) * 0.3,
        vy: -(Math.random() * 0.45 + 0.15), // upward drift
        alpha: Math.random() * 0.3 + 0.2,
        pulseSpeed: Math.random() * 0.015 + 0.01,
        pulseOffset: Math.random() * Math.PI * 2,
        highlightAngle: Math.random() * Math.PI * 2,
      });
    }

    // Preload PC Game Emblems for background dissolution
    const emblemSources = [
      '/game-logos/cs2.svg',
      '/game-logos/cyberpunk.svg',
      '/game-logos/elden-ring.svg',
      '/game-logos/valorant.svg',
      '/game-logos/steam.svg',
      '/game-logos/gtav.svg',
      '/game-logos/witcher.svg',
      '/game-logos/unreal.svg',
      '/game-logos/doom.svg',
      '/game-logos/dark-souls.svg',
    ];

    const emblems: GameEmblem[] = [];
    emblemSources.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        emblems.push({
          img,
          x: Math.random() * (width - 240) + 120,
          y: Math.random() * (height - 240) + 120,
          size: Math.random() * 80 + 150, // 150px to 230px
          vx: (Math.random() - 0.5) * 0.12,
          vy: (Math.random() - 0.5) * 0.1,
          rotation: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.001,
          alpha: Math.random() * 0.04 + 0.035, // Very subtle, dissolved (0.035 to 0.075)
          targetAlpha: Math.random() * 0.05 + 0.035,
          alphaSpeed: Math.random() * 0.0006 + 0.0003,
        });
      };
    });

    let frame = 0;

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      // Pure Black Base with Subtle Ambient Center Vignette
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      // 1. Draw Dissolved PC Game Logos
      emblems.forEach((emb) => {
        emb.x += emb.vx;
        emb.y += emb.vy;
        emb.rotation += emb.vRot;

        if (emb.x < -emb.size) emb.x = width + emb.size;
        if (emb.x > width + emb.size) emb.x = -emb.size;
        if (emb.y < -emb.size) emb.y = height + emb.size;
        if (emb.y > height + emb.size) emb.y = -emb.size;

        if (Math.abs(emb.alpha - emb.targetAlpha) < 0.002) {
          emb.targetAlpha = Math.random() * 0.04 + 0.03;
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

      // 2. Draw Moving Glassy Bubbles with Golden Specular Highlights
      souls.forEach((soul) => {
        soul.x += soul.vx;
        soul.y += soul.vy;

        if (soul.y < -soul.radius * 2) {
          soul.y = height + soul.radius * 2;
          soul.x = Math.random() * width;
        }
        if (soul.x < -soul.radius * 2) soul.x = width + soul.radius * 2;
        if (soul.x > width + soul.radius * 2) soul.x = -soul.radius * 2;

        // Gentle Mouse Repulsion
        const dx = mouse.x - soul.x;
        const dy = mouse.y - soul.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius && dist > 0) {
          const force = (mouse.radius - dist) / mouse.radius;
          soul.x -= (dx / dist) * force * 2.5;
          soul.y -= (dy / dist) * force * 2.5;
        }

        const pulse = Math.sin(frame * soul.pulseSpeed + soul.pulseOffset);
        const r = soul.radius + pulse * 1.2;

        ctx.save();
        ctx.globalAlpha = soul.alpha + pulse * 0.1;

        // Outer Dark Bubble Glow
        const bubbleGrad = ctx.createRadialGradient(
          soul.x, soul.y, r * 0.2,
          soul.x, soul.y, r
        );
        bubbleGrad.addColorStop(0, 'rgba(30, 30, 30, 0.2)');
        bubbleGrad.addColorStop(0.7, 'rgba(15, 15, 15, 0.6)');
        bubbleGrad.addColorStop(1, 'rgba(250, 204, 21, 0.18)'); // Golden edge rim

        ctx.fillStyle = bubbleGrad;
        ctx.beginPath();
        ctx.arc(soul.x, soul.y, r, 0, Math.PI * 2);
        ctx.fill();

        // Delicate Golden Rim Stroke
        ctx.strokeStyle = 'rgba(250, 204, 21, 0.25)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Specular Glint (Glossy Reflection on top-left of bubble)
        const glintX = soul.x - r * 0.35;
        const glintY = soul.y - r * 0.35;
        const glintGrad = ctx.createRadialGradient(
          glintX, glintY, 0,
          glintX, glintY, r * 0.45
        );
        glintGrad.addColorStop(0, 'rgba(255, 255, 255, 0.65)');
        glintGrad.addColorStop(0.4, 'rgba(250, 204, 21, 0.3)');
        glintGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = glintGrad;
        ctx.beginPath();
        ctx.arc(glintX, glintY, r * 0.45, 0, Math.PI * 2);
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
