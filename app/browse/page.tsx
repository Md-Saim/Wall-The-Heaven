import type { Metadata } from 'next';
import BrowseView from '../components/BrowseView';

export const metadata: Metadata = {
  title: 'Browse & Download Wallpapers in Bulk – 4K HD Gallery',
  description:
    'Browse and bulk download free 4K, HD wallpapers for desktop and mobile. Filter anime, nature, cyberpunk, gaming wallpapers and download them all at once with Wall-the-Heaven.',
  keywords: [
    'browse wallpapers',
    'bulk wallpaper downloader',
    'download wallpapers in bulk',
    '4K wallpapers gallery',
    'free HD wallpapers',
    'anime wallpapers download',
    'gaming wallpapers bulk',
    'nature wallpapers free',
    'mobile wallpapers download',
    'desktop wallpaper pack',
  ],
  alternates: {
    canonical: '/browse',
  },
  openGraph: {
    title: 'Browse & Bulk Download Free 4K Wallpapers | Wall-the-Heaven',
    description: 'Browse thousands of free 4K, HD wallpapers. Filter by category and bulk download for desktop & mobile.',
    url: 'https://wall-the-heaven.vercel.app/browse',
    siteName: 'Wall-the-Heaven',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Browse & Bulk Download Free 4K Wallpapers | Wall-the-Heaven',
    description: 'Browse thousands of free 4K, HD wallpapers. Filter and bulk download for desktop & mobile.',
  },
};

export default function BrowsePage() {
  return <BrowseView initialQuery="Cyberpunk 2077" initialDevice="desktop" />;
}
