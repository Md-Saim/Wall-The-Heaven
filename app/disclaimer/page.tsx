import type { Metadata } from 'next';
import Link from 'next/link';
import { AlertTriangle, Cpu, Users, Copyright, Mail, ArrowRight, Monitor, Smartphone, Zap } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BackgroundSouls from '../components/BackgroundSouls';

export const metadata: Metadata = {
  title: 'Disclaimer & How It Works – Wall-the-Heaven',
  description:
    'Understand how Wall-the-Heaven bulk wallpaper downloader works, fair use policy, and copyright disclaimers. Free 4K wallpaper downloads with zero server storage.',
  keywords: [
    'Wall-the-Heaven disclaimer',
    'bulk wallpaper downloader how it works',
    'copyright policy wallpapers',
    'fair use wallpaper downloader',
    'free wallpaper download legal',
  ],
  alternates: {
    canonical: '/disclaimer',
  },
  openGraph: {
    title: 'Disclaimer & How It Works – Wall-the-Heaven',
    description: 'Learn how Wall-the-Heaven bulk wallpaper downloader works and our fair use policy.',
    url: 'https://wall-the-heaven.vercel.app/disclaimer',
    siteName: 'Wall-the-Heaven',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Disclaimer & How It Works | Wall-the-Heaven',
    description: 'Fair use, non-commercial personal wallpaper discovery and ephemeral in-memory ZIP compiling.',
  },
};

export default function DisclaimerPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', background: '#000000', overflowX: 'hidden' }}>
      <BackgroundSouls />

      <Header activeView="disclaimer" />

      <main style={{ flex: 1, position: 'relative', zIndex: 10, maxWidth: '1080px', width: '100%', margin: '0 auto', padding: '36px 16px 60px', color: '#e5e5e5', boxSizing: 'border-box' }}>
        {/* Hero Section */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#facc15', fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
            <AlertTriangle size={15} />
            <span>TRANSPARENCY &amp; LEGAL NOTICE</span>
          </div>
          <h1
            className="display-title"
            style={{
              fontSize: 'clamp(2.2rem, 7vw, 4.4rem)',
              color: '#ffffff',
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              marginBottom: '14px',
            }}
          >
            DISCLAIMER &amp; HOW IT WORKS
          </h1>
          <p style={{ fontSize: 'clamp(0.92rem, 2.5vw, 1.05rem)', color: '#a3a3a3', maxWidth: '720px', margin: '0 auto', lineHeight: 1.6, padding: '0 10px' }}>
            Everything you need to know about how Wall-the-Heaven operates, who this platform is intended for, and our copyright standards.
          </p>
        </div>

        {/* Section 1: How It Works */}
        <section
          style={{
            background: 'rgba(12, 12, 12, 0.85)',
            border: '1px solid #222222',
            borderRadius: '8px',
            padding: '28px 20px',
            marginBottom: '28px',
            backdropFilter: 'blur(16px)',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <Cpu size={24} color="#facc15" />
            <h2 style={{ fontSize: '1.45rem', fontWeight: 900, color: '#facc15' }}>
              How The Website Works
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.96rem', color: '#cccccc', lineHeight: 1.7 }}>
            <p>
              <strong>Wall-the-Heaven</strong> is an ephemeral client-side discovery engine and streaming aggregator. It acts as a specialized query interface for public wallpaper directories across the open web.
            </p>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li>
                <strong>Real-Time Public Indexing:</strong> When you enter a query (gaming, anime, movies, nature, cars, space), the backend executes targeted concurrent queries to public directories (such as AlphaCoders, WallpapersCraft, 4KWallpapers, and Wallhaven) to retrieve matching public image URLs.
              </li>
              <li>
                <strong>Client-Side In-Memory ZIP Compilation:</strong> When you select wallpapers and download a pack, your browser downloads the individual image streams and uses <code>JSZip</code> to build the <code>.zip</code> archive directly inside your device&apos;s RAM.
              </li>
              <li>
                <strong>Zero Server Storage &amp; Ephemeral Sessions:</strong> Wall-the-Heaven <em>does not host, re-upload, or store any wallpapers or generated ZIP files on its servers</em>. The compiled pack exists solely within your active browser tab memory and is immediately destroyed if you refresh or navigate away from the site.
              </li>
            </ul>
          </div>
        </section>

        {/* Section 2: Who Is It For */}
        <section
          style={{
            background: 'rgba(12, 12, 12, 0.85)',
            border: '1px solid #222222',
            borderRadius: '8px',
            padding: '28px 20px',
            marginBottom: '28px',
            backdropFilter: 'blur(16px)',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <Users size={24} color="#facc15" />
            <h2 style={{ fontSize: '1.45rem', fontWeight: 900, color: '#facc15' }}>
              Who Is It For?
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginTop: '14px' }}>
            <div style={{ background: '#080808', border: '1px solid #1a1a1a', padding: '18px', borderRadius: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#facc15' }}>
                <Monitor size={18} />
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff' }}>PC &amp; Monitor Setups</h3>
              </div>
              <p style={{ fontSize: '0.86rem', color: '#888888', lineHeight: 1.6 }}>
                Users looking for crisp 16:9, 1440p 2K, and 2160p 4K wallpapers for dual-monitor or ultrawide setups without pixelation or intrusive watermarks.
              </p>
            </div>

            <div style={{ background: '#080808', border: '1px solid #1a1a1a', padding: '18px', borderRadius: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#facc15' }}>
                <Smartphone size={18} />
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff' }}>Smartphone &amp; AMOLED Screens</h3>
              </div>
              <p style={{ fontSize: '0.86rem', color: '#888888', lineHeight: 1.6 }}>
                Mobile phone users who need vertical 9:16 portrait lockscreen backgrounds that take advantage of true pitch-black pixels on OLED screens.
              </p>
            </div>

            <div style={{ background: '#080808', border: '1px solid #1a1a1a', padding: '18px', borderRadius: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#facc15' }}>
                <Zap size={18} />
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff' }}>Enthusiasts &amp; Curators</h3>
              </div>
              <p style={{ fontSize: '0.86rem', color: '#888888', lineHeight: 1.6 }}>
                Fans of gaming, anime, cinema, nature, space, and art who want to curate full 20-50 wallpaper packs in seconds and download them in a single archive.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Copyright & Fair Use */}
        <section
          style={{
            background: 'rgba(12, 12, 12, 0.85)',
            border: '1px solid #222222',
            borderRadius: '8px',
            padding: '28px 20px',
            marginBottom: '28px',
            backdropFilter: 'blur(16px)',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <Copyright size={24} color="#facc15" />
            <h2 style={{ fontSize: '1.45rem', fontWeight: 900, color: '#facc15' }}>
              Copyright &amp; Fair Use
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.94rem', color: '#cccccc', lineHeight: 1.7 }}>
            <p>
              All wallpaper media, concept art, franchise logos, character designs, and digital assets indexed by this tool remain the exclusive intellectual property and copyright of their respective creators, photographers, studios, and copyright holders.
            </p>
            <p>
              Wall-the-Heaven provides indexing and streaming convenience exclusively for <strong>personal, non-commercial desktop and mobile wallpaper customization</strong>. No images are licensed or sold by this service.
            </p>
            <p>
              If you are a copyright owner or legal representative and believe your work is being improperly referenced, please reach out to have the corresponding source or query pattern excluded immediately.
            </p>
            <div style={{ marginTop: '8px' }}>
              <a
                href="https://github.com/Md-Saim/Wall-The-Heaven/issues"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#111111',
                  border: '1px solid #333333',
                  color: '#facc15',
                  padding: '10px 18px',
                  borderRadius: '4px',
                  fontWeight: 700,
                  fontSize: '0.84rem',
                  textDecoration: 'none',
                }}
              >
                <Mail size={15} />
                <span>Submit DMCA / Takedown Request via GitHub Issues</span>
              </a>
            </div>
          </div>
        </section>

        {/* Back to Browse */}
        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <Link
            href="/browse"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: '#facc15',
              textDecoration: 'none',
              fontWeight: 800,
              fontSize: '0.94rem',
              letterSpacing: '0.04em',
            }}
          >
            <span>GO TO BROWSE WALLPAPERS</span>
            <ArrowRight size={17} />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
