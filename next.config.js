/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.alphacoders.com' },
      { protocol: 'https', hostname: 'w.wallhaven.cc' },
      { protocol: 'https', hostname: 'th.wallhaven.cc' },
      { protocol: 'https', hostname: 'images.pexels.com' },
      { protocol: 'https', hostname: 'pixabay.com' },
      { protocol: 'https', hostname: 'cdn.pixabay.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'i.redd.it' },
      { protocol: 'https', hostname: 'preview.redd.it' },
      { protocol: 'https', hostname: 'i.imgur.com' }
    ],
    unoptimized: true
  }
};

module.exports = nextConfig;
