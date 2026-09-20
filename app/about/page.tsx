import type { Metadata } from 'next';
import Link from 'next/link';
import { Github, Monitor, Smartphone, ShieldCheck, Zap, Heart, ArrowRight } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BackgroundSouls from '../components/BackgroundSouls';

export const metadata: Metadata = {
  title: 'About Platform & Developer | Wall-the-Heaven',
  description:
    'Learn about Wall-the-Heaven, the hardcore gaming wallpaper discovery platform, and its developer Md-Saim. Built with Next.js, pure black aesthetic, and instant in-memory ZIP packaging.',
  keywords: [
    'About Wall-the-Heaven',
    'Md-Saim developer',
    'Md-Saim GitHub',
    'gaming wallpaper platform',
    'Next.js wallpaper app',
    'pure black wallpaper downloader',
  ],
  openGraph: {
    title: 'About Wall-the-Heaven | Platform & Developer Md-Saim',
    description: 'High-res gaming wallpaper discovery engine designed with zero bloat and in-memory batch ZIP packaging.',
    url: 'https://wall-the-heaven.vercel.app/about',
    siteName: 'Wall-the-Heaven',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Platform & Developer | Wall-the-Heaven',
    description: 'Developed by Md-Saim for PC gamers and high-resolution wallpaper enthusiasts.',
  },
};

export default function AboutPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', background: '#000000' }}>
      <BackgroundSouls />

      <Header activeView="about" />

      <main style={{ flex: 1, position: 'relative', zIndex: 10, maxWidth: '1080px', margin: '0 auto', padding: '60px 24px 80px', color: '#e5e5e5' }}>
        {/* Hero Section */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#facc15', fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '14px' }}>
            <span>THE MANIFESTO</span>
          </div>
          <h1
            className="display-title"
            style={{
              fontSize: 'clamp(2.6rem, 7vw, 4.8rem)',
              color: '#ffffff',
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              marginBottom: '16px',
            }}
          >
            ABOUT WALL-THE-HEAVEN
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#a3a3a3', maxWidth: '680px', margin: '0 auto', lineHeight: 1.6 }}>
            A pure black, hardcore gaming wallpaper discovery engine engineered for serious gamers, ultrawide monitor owners, and mobile AMOLED customizers.
          </p>
        </div>

        {/* Section 1: The Platform */}
        <section
          style={{
            background: 'rgba(12, 12, 12, 0.85)',
            border: '1px solid #222222',
            borderRadius: '8px',
            padding: '40px 32px',
            marginBottom: '40px',
            backdropFilter: 'blur(16px)',
          }}
        >
          <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#facc15', marginBottom: '18px', letterSpacing: '-0.01em' }}>
            🌌 The Platform
          </h2>
          <p style={{ fontSize: '1rem', color: '#cccccc', lineHeight: 1.7, marginBottom: '24px' }}>
            Traditional wallpaper websites are filled with intrusive ads, countdown timers, watermarks, and heavily compressed images. <strong>Wall-the-Heaven</strong> was built to eliminate that fluff entirely.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            <div style={{ background: '#080808', border: '1px solid #1a1a1a', padding: '20px', borderRadius: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#facc15', marginBottom: '10px' }}>
                <Monitor size={20} />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff' }}>Desktop &amp; Ultrawide</h3>
              </div>
              <p style={{ fontSize: '0.88rem', color: '#888888', lineHeight: 1.6 }}>
                Landscape 16:9, 16:10, and 21:9 ultrawide wallpapers reaching genuine 2K, 4K, and 5K resolutions for battle-station setups.
              </p>
            </div>

            <div style={{ background: '#080808', border: '1px solid #1a1a1a', padding: '20px', borderRadius: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#facc15', marginBottom: '10px' }}>
                <Smartphone size={20} />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff' }}>Mobile &amp; AMOLED</h3>
              </div>
              <p style={{ fontSize: '0.88rem', color: '#888888', lineHeight: 1.6 }}>
                Native 9:16 and 9:20 portrait lockscreen wallpapers formatted for smartphones with pitch black AMOLED backgrounds.
              </p>
            </div>

            <div style={{ background: '#080808', border: '1px solid #1a1a1a', padding: '20px', borderRadius: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#facc15', marginBottom: '10px' }}>
                <Zap size={20} />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff' }}>In-Memory Batch ZIP</h3>
              </div>
              <p style={{ fontSize: '0.88rem', color: '#888888', lineHeight: 1.6 }}>
                Compile entire collections into a single ZIP archive on-the-fly in browser memory with real-time download tickers.
              </p>
            </div>

            <div style={{ background: '#080808', border: '1px solid #1a1a1a', padding: '20px', borderRadius: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#22c55e', marginBottom: '10px' }}>
                <ShieldCheck size={20} />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff' }}>Zero Data Retention</h3>
              </div>
              <p style={{ fontSize: '0.88rem', color: '#888888', lineHeight: 1.6 }}>
                Ephemeral client-side architecture. We store no user logs, no images on server disks, and require no account logins.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: The Developer */}
        <section
          style={{
            background: 'rgba(12, 12, 12, 0.85)',
            border: '1px solid #222222',
            borderRadius: '8px',
            padding: '40px 32px',
            marginBottom: '40px',
            backdropFilter: 'blur(16px)',
          }}
        >
          <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#facc15', marginBottom: '18px', letterSpacing: '-0.01em' }}>
            👨‍💻 About The Developer
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <p style={{ fontSize: '1.02rem', color: '#d4d4d4', lineHeight: 1.7 }}>
              Wall-the-Heaven was designed and developed by <strong style={{ color: '#ffffff' }}>Md-Saim</strong>, an engineer and passionate gamer dedicated to creating high-performance, aesthetically pleasing web tools.
            </p>
            <p style={{ fontSize: '0.94rem', color: '#999999', lineHeight: 1.7 }}>
              Driven by the philosophy of <em>&ldquo;Hardcore Gaming. No Fluff. No Limits,&rdquo;</em> Md-Saim built this platform to give gamers instant access to clean high-resolution wallpapers without friction or unwanted clutter.
            </p>

            <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <a
                href="https://github.com/Md-Saim"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#facc15',
                  color: '#000000',
                  padding: '12px 24px',
                  borderRadius: '4px',
                  fontWeight: 900,
                  fontSize: '0.92rem',
                  textDecoration: 'none',
                  letterSpacing: '0.04em',
                  transition: 'background 0.15s',
                }}
              >
                <Github size={18} />
                <span>VISIT MD-SAIM ON GITHUB</span>
              </a>

              <a
                href="https://github.com/Md-Saim/Wall-The-Heaven"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#111111',
                  border: '1px solid #333333',
                  color: '#e5e5e5',
                  padding: '12px 24px',
                  borderRadius: '4px',
                  fontWeight: 800,
                  fontSize: '0.92rem',
                  textDecoration: 'none',
                  letterSpacing: '0.04em',
                  transition: 'border-color 0.15s',
                }}
              >
                <span>STAR REPOSITORY</span>
                <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </section>

        {/* Section 3: Call to Action */}
        <div style={{ textAlign: 'center', padding: '40px 20px', background: 'radial-gradient(ellipse at center, rgba(250, 204, 21, 0.1) 0%, transparent 70%)' }}>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#ffffff', marginBottom: '16px' }}>
            Ready to Build Your Game Pack?
          </h3>
          <p style={{ color: '#888888', marginBottom: '24px', fontSize: '0.98rem' }}>
            Start discovering pure high-resolution wallpapers tailored for your device right now.
          </p>
          <Link
            href="/browse"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              background: '#facc15',
              color: '#000000',
              padding: '14px 32px',
              borderRadius: '4px',
              fontWeight: 900,
              fontSize: '1rem',
              textDecoration: 'none',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            <span>LAUNCH BROWSE GALLERY</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
