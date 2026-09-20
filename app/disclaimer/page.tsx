import type { Metadata } from 'next';
import Link from 'next/link';
import { AlertTriangle, ShieldCheck, Cpu, Users, Copyright, Mail, ArrowRight } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BackgroundSouls from '../components/BackgroundSouls';

export const metadata: Metadata = {
  title: 'Legal & Usage Disclaimer | Wall-the-Heaven',
  description:
    'Understand how Wall-the-Heaven works, who it is built for, and our fair use & copyright disclaimers. Ephemeral in-memory streaming with zero server image storage.',
  keywords: [
    'Wall-the-Heaven disclaimer',
    'how it works',
    'who is it for',
    'copyright policy',
    'fair use wallpaper downloader',
    'ephemeral in-memory sessions',
  ],
  openGraph: {
    title: 'Legal & Usage Disclaimer | Wall-the-Heaven',
    description: 'Learn how Wall-the-Heaven functions as an ephemeral, in-browser gaming wallpaper discovery tool.',
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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', background: '#000000' }}>
      <BackgroundSouls />

      <Header activeView="disclaimer" />

      <main style={{ flex: 1, position: 'relative', zIndex: 10, maxWidth: '1080px', margin: '0 auto', padding: '60px 24px 80px', color: '#e5e5e5' }}>
        {/* Hero Section */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#facc15', fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '14px' }}>
            <AlertTriangle size={16} />
            <span>TRANSPARENCY &amp; LEGAL NOTICE</span>
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
            DISCLAIMER &amp; HOW IT WORKS
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#a3a3a3', maxWidth: '720px', margin: '0 auto', lineHeight: 1.6 }}>
            Everything you need to know about how Wall-the-Heaven operates, who this platform is intended for, and our copyright standards.
          </p>
        </div>

        {/* Section 1: How It Works */}
        <section
          style={{
            background: 'rgba(12, 12, 12, 0.85)',
            border: '1px solid #222222',
            borderRadius: '8px',
            padding: '36px 32px',
            marginBottom: '32px',
            backdropFilter: 'blur(16px)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
            <Cpu size={26} color="#facc15" />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#facc15' }}>
              ⚙️ How The Website Works
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.98rem', color: '#cccccc', lineHeight: 1.7 }}>
            <p>
              <strong>Wall-the-Heaven</strong> is an ephemeral client-side discovery engine and streaming aggregator. It acts as a specialized query interface for public wallpaper directories across the open web.
            </p>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li>
                <strong>Real-Time Public Indexing:</strong> When you enter a game or character query, the backend executes targeted concurrent queries to public directories (such as AlphaCoders, WallpapersCraft, 4KWallpapers, and Wallhaven) to retrieve matching public image URLs.
              </li>
              <li>
                <strong>Client-Side In-Memory ZIP Compilation:</strong> When you select wallpapers and download a game pack, your browser downloads the individual image streams and uses <code>JSZip</code> to build the <code>.zip</code> archive directly inside your device&apos;s RAM.
              </li>
              <li>
                <strong>Zero Server Storage &amp; Ephemeral Sessions:</strong> Wall-the-Heaven <em>does not host, re-upload, or store any wallpapers or generated ZIP files on its servers</em>. The compiled game pack exists solely within your active browser tab memory and is immediately destroyed if you refresh or navigate away from the site.
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
            padding: '36px 32px',
            marginBottom: '32px',
            backdropFilter: 'blur(16px)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
            <Users size={26} color="#facc15" />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#facc15' }}>
              🎯 Who Is It For?
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px', marginTop: '16px' }}>
            <div style={{ background: '#080808', border: '1px solid #1a1a1a', padding: '20px', borderRadius: '6px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>🖥️ PC &amp; Console Gamers</h3>
              <p style={{ fontSize: '0.88rem', color: '#888888', lineHeight: 1.6 }}>
                Gamers looking for crisp 16:9, 1440p 2K, and 2160p 4K wallpapers to match their battlestation aesthetic without pixelation or annoying branding.
              </p>
            </div>

            <div style={{ background: '#080808', border: '1px solid #1a1a1a', padding: '20px', borderRadius: '6px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>📱 Smartphone &amp; AMOLED Users</h3>
              <p style={{ fontSize: '0.88rem', color: '#888888', lineHeight: 1.6 }}>
                Mobile phone users who need vertical 9:16 portrait lockscreen backgrounds that take advantage of pure black pixels on OLED screens to conserve battery life.
              </p>
            </div>

            <div style={{ background: '#080808', border: '1px solid #1a1a1a', padding: '20px', borderRadius: '6px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>⚡ Curators &amp; Power Users</h3>
              <p style={{ fontSize: '0.88rem', color: '#888888', lineHeight: 1.6 }}>
                Users who want to curate full 20-50 wallpaper thematic packs in seconds and download them in a single archive rather than saving images one by one.
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
            padding: '36px 32px',
            marginBottom: '32px',
            backdropFilter: 'blur(16px)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
            <Copyright size={26} color="#facc15" />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#facc15' }}>
              ⚖️ Copyright &amp; Fair Use
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.96rem', color: '#cccccc', lineHeight: 1.7 }}>
            <p>
              All video game titles, publisher logos, character concept art, and digital assets indexed by this tool remain the exclusive intellectual property and copyright of their respective game studios, authors, and copyright holders.
            </p>
            <p>
              Wall-the-Heaven provides indexing and streaming convenience exclusively for <strong>personal, non-commercial desktop and mobile wallpaper customization</strong>. No images are licensed or sold by this service.
            </p>
            <p>
              If you are a copyright owner or legal representative and believe your work is being improperly referenced, please reach out to have the corresponding source or query pattern excluded immediately.
            </p>
            <div style={{ marginTop: '10px' }}>
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
                  padding: '10px 20px',
                  borderRadius: '4px',
                  fontWeight: 700,
                  fontSize: '0.86rem',
                  textDecoration: 'none',
                }}
              >
                <Mail size={16} />
                <span>Submit DMCA / Takedown Request via GitHub Issues</span>
              </a>
            </div>
          </div>
        </section>

        {/* Back to Browse */}
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <Link
            href="/browse"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: '#facc15',
              textDecoration: 'none',
              fontWeight: 800,
              fontSize: '0.96rem',
              letterSpacing: '0.04em',
            }}
          >
            <span>GO TO BROWSE WALLPAPERS</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
