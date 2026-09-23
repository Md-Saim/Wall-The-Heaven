import type { Metadata } from 'next';
import './globals.css';
import ClientBody from './components/ClientBody';

export const metadata: Metadata = {
  title: {
    default: 'Bulk Wallpaper Downloader – Free 4K Desktop & Mobile Wallpapers | Wall-the-Heaven',
    template: '%s | Wall-the-Heaven',
  },
  description: 'Download free wallpapers in bulk! Search & get high-res 4K, HD desktop and mobile wallpapers – anime, nature, cyberpunk, gaming & more. Fast bulk wallpaper downloader for PC and phone.',
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
  ],
  authors: [{ name: 'Wall-the-Heaven' }],
  creator: 'Wall-the-Heaven',
  publisher: 'Wall-the-Heaven',
  metadataBase: new URL('https://wall-the-heaven.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Bulk Wallpaper Downloader – Free 4K Desktop & Mobile Wallpapers',
    description: 'Download free wallpapers in bulk! Search & get high-res 4K, HD desktop and mobile wallpapers – anime, nature, cyberpunk, gaming & more.',
    url: 'https://wall-the-heaven.vercel.app',
    siteName: 'Wall-the-Heaven',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bulk Wallpaper Downloader – Free 4K Desktop & Mobile Wallpapers',
    description: 'Download free wallpapers in bulk! Search & get high-res 4K, HD desktop and mobile wallpapers – anime, nature, cyberpunk, gaming & more.',
    creator: '@Wall_the_Heaven',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
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
        <link rel="icon" href="/icon-192.png" type="image/png" sizes="192x192" />
        <link rel="icon" href="/icon-512.png" type="image/png" sizes="512x512" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="google-site-verification" content="NyxxuZvDzjQfi5QXVlSk85QlYypjOJ_GuLKvt54dSS0" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'WebSite',
                  name: 'Wall-the-Heaven',
                  url: 'https://wall-the-heaven.vercel.app',
                  description: 'Download free wallpapers in bulk! Search & get high-res 4K, HD desktop and mobile wallpapers – anime, nature, cyberpunk, gaming & more.',
                  potentialAction: {
                    '@type': 'SearchAction',
                    target: 'https://wall-the-heaven.vercel.app/?q={search_term_string}',
                    'query-input': 'required name=search_term_string',
                  },
                },
                {
                  '@type': 'WebApplication',
                  name: 'Wall-the-Heaven – Bulk Wallpaper Downloader',
                  url: 'https://wall-the-heaven.vercel.app',
                  applicationCategory: 'MultimediaApplication',
                  operatingSystem: 'All',
                  offers: {
                    '@type': 'Offer',
                    price: '0',
                    priceCurrency: 'USD',
                  },
                  description: 'Free bulk wallpaper downloader for 4K, HD desktop and mobile wallpapers. Download anime, nature, cyberpunk, gaming wallpapers in one click.',
                },
              ],
            }),
          }}
        />
      </head>
      <body><ClientBody>{children}</ClientBody></body>
    </html>
  );
}
