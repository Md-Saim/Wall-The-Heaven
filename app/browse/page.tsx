import type { Metadata } from 'next';
import BrowseView from '../components/BrowseView';

export const metadata: Metadata = {
  title: 'Browse Wallpapers | Wall-the-Heaven - 4K Desktop & Mobile Gallery',
  description:
    'Explore high-resolution Gaming, Anime, Movies, Nature, Space & Mobile wallpapers. Filter by 16:9 Desktop landscape or 9:16 AMOLED Mobile portrait ratios with instant 1-click batch ZIP pack downloads.',
  keywords: [
    'browse wallpapers',
    'anime wallpapers',
    'game wallpapers gallery',
    '4K PC wallpapers',
    'nature wallpapers',
    'movie wallpapers',
    'phone lockscreens',
    '3840x2160 ultra hd',
    'Wall-the-Heaven browse',
  ],
  openGraph: {
    title: 'Browse High-Res Wallpapers | Wall-the-Heaven',
    description: 'Filter by Desktop (16:9) or Mobile (9:16) with instant batch ZIP packaging. Pure black aesthetic.',
    url: 'https://wall-the-heaven.vercel.app/browse',
    siteName: 'Wall-the-Heaven',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Browse Wallpapers | Wall-the-Heaven',
    description: 'Discover ultra clean, pure black high-res PC & mobile wallpapers.',
  },
};

export default function BrowsePage() {
  return <BrowseView initialQuery="Cyberpunk 2077" initialDevice="desktop" />;
}
