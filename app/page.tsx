import type { Metadata } from 'next';
import BrowseView from './components/BrowseView';

export const metadata: Metadata = {
  title: 'Bulk Wallpaper Downloader – Free 4K Desktop & Mobile Wallpapers',
  description:
    'Download free wallpapers in bulk! Search & get high-res 4K, HD desktop and mobile wallpapers – anime, nature, cyberpunk, gaming & more. Fast bulk wallpaper downloader for PC and phone.',
  keywords: [
    'bulk wallpaper downloader',
    'free wallpapers download',
    '4K wallpapers',
    'desktop wallpapers',
    'mobile wallpapers',
    'HD wallpapers bulk download',
    'anime wallpapers',
    'nature wallpapers',
    'cyberpunk wallpapers',
    'free wallpaper pack',
    'bulk image downloader',
    'gaming wallpapers',
    'wallpaper pack downloader',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Bulk Wallpaper Downloader – Free 4K Desktop & Mobile Wallpapers | Wall-the-Heaven',
    description: 'Download free wallpapers in bulk! Search & get high-res 4K, HD desktop and mobile wallpapers – anime, nature, cyberpunk, gaming & more.',
    url: 'https://wall-the-heaven.vercel.app',
    siteName: 'Wall-the-Heaven',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bulk Wallpaper Downloader – Free 4K Desktop & Mobile Wallpapers',
    description: 'Download free wallpapers in bulk! Search & get high-res 4K, HD desktop and mobile wallpapers – anime, nature, cyberpunk, gaming & more.',
  },
};

export default function Home() {
  return <BrowseView initialQuery="Cyberpunk 2077" initialDevice="desktop" />;
}
