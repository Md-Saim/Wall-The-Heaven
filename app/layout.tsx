import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Wall-the-Heaven | Multi-Source Wallpaper Downloader',
  description: 'High-resolution PC and mobile wallpaper search engine. Query AlphaCoders, Wallhaven, Pexels, and Pixabay with 1-click batch ZIP download.',
  keywords: ['wallpapers', '4k wallpapers', 'gaming wallpapers', 'anime wallpapers', 'mobile wallpapers', 'desktop wallpapers', 'download wallpapers'],
  authors: [{ name: 'Wall-the-Heaven' }],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body>{children}</body>
    </html>
  );
}
