import type { Metadata } from 'next';
import BrowseView from './components/BrowseView';

export const metadata: Metadata = {
  title: 'Wall-the-Heaven | 4K Desktop & Mobile Gaming Wallpapers',
  description:
    'Search and download genuine 4K, 2K, and 1080p wallpapers tailored specifically for Desktop (16:9) and Mobile (9:16) devices with instant in-browser batch ZIP pack packaging. Pure black hardcore aesthetic.',
  keywords: [
    '4K gaming wallpapers',
    'mobile wallpapers 9:16',
    'desktop wallpapers 16:9',
    'Valorant 4K wallpapers',
    'Cyberpunk 2077 wallpapers',
    'Elden Ring wallpapers',
    'anime lockscreens',
    'wallpaper pack downloader',
  ],
  openGraph: {
    title: 'Wall-the-Heaven | Pure High-Res Gaming Wallpapers',
    description: '100% Clean. Hardcore Gaming. Pure Black Aesthetic. One-click batch game pack ZIP downloads.',
    url: 'https://wall-the-heaven.vercel.app',
    siteName: 'Wall-the-Heaven',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wall-the-Heaven | 4K & Mobile Gaming Wallpapers',
    description: 'Pure Black Aesthetic. Instant in-memory game pack ZIP compiler.',
  },
};

export default function Home() {
  return <BrowseView initialQuery="Cyberpunk 2077" initialDevice="desktop" />;
}
