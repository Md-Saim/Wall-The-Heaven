<div align="center">

# Wall-the-Heaven

**A high-performance multi-source wallpaper aggregator and bulk downloader for Desktop & Mobile.**

Stop opening 30 browser tabs across ad-riddled wallpaper sites just to find a few good backgrounds. Wall-the-Heaven queries top wallpaper engines in parallel, filters results strictly by device aspect ratio, and bundles your favorites into a single `.zip` archive on the fly directly in your browser.

[Live Demo](https://wall-the-heaven.vercel.app) • [Python CLI](#python-cli) • [Architecture](#architecture) • [Getting Started](#getting-started)

<br/>

[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-181717?logo=github)](https://github.com/Md-Saim/Wall-The-Heaven)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

</div>

---

## Previews

<div align="center">

### Desktop View (16:9 Ultrawide / 4K)
![Desktop Preview](public/screenshots/desktop-preview.png)

### Mobile Lockscreen View (9:16 Portrait)
![Mobile Preview](public/screenshots/mobile-preview.png)

</div>

---

## The Problem It Solves

Finding high-resolution wallpapers on the web is notoriously clunky:
- **Fragmented sources**: The best anime wallpapers are on AlphaCoders, high-art renders are on Wallhaven, and crisp photography is scattered across WallpapersCraft and 4KWallpapers.
- **Wrong aspect ratios**: Desktop searches frequently return phone crops, and phone searches return squeezed landscape images.
- **Tedious downloads**: Downloading 20 wallpapers usually requires 20 separate tabs, waiting on ad timers, and manually saving each file.

**Wall-the-Heaven** fixes this by combining a unified search scraper, strict aspect-ratio enforcement, and an in-browser ZIP packaging pipeline.

---

## What It Does & Key Features

### 1. Concurrent Multi-Source Scraper & Aggregator
When you search for a tag (e.g. `Cyberpunk`, `Elden Ring`, `Anime`), the backend (`/api/search`) fires concurrent requests across 4 major sources in parallel:
- **Wallhaven API**: Official API integration for ultra-high-resolution community wallpapers.
- **AlphaCoders**: Fast scraper capturing high-res anime, gaming, and movie backgrounds.
- **WallpapersCraft**: High-density desktop and AMOLED mobile wallpapers.
- **4KWallpapers**: Curated 4K/5K desktop and 1080x1920 mobile wallpapers.

All results are fetched with strict 3-second abort timeouts, normalized, deduplicated by image URL, and sorted by total pixel density (highest resolution first).

### 2. Strict Device Ratio Separation
Never get a vertical phone wallpaper when customizing your dual-monitor setup:
- **Desktop Mode (`16:9`, `16:10`, `21:9 Ultrawide`)**: Returns landscape wallpapers from 1080p FHD to 4K UHD and 5K.
- **Mobile Mode (`9:16`, `9:20 AMOLED`)**: Returns vertical portrait wallpapers optimized for smartphone lock screens and AMOLED displays.
- **Resolution Filter**: Instantly isolate wallpapers by minimum resolution threshold (`All`, `1080p FHD`, `1440p 2K`, `3840x2160 4K`).

### 3. In-Browser Client-Side Bulk ZIP Downloader
- **Multi-select**: Check off wallpapers individually or click **Select All**.
- **Zero-Server Storage Overhead**: Wallpapers are fetched via a lightweight streaming proxy (`/api/proxy`) to bypass CORS and packaged into a clean `.zip` archive entirely inside the user's browser using `JSZip`.
- **Live Progress Bar**: Real-time download indicator tracking individual image fetches and ZIP compilation before triggering the save dialogue.

### 4. Interactive Full-Resolution Lightbox
- Click any wallpaper to open a modal inspector.
- View precise resolution (`Width x Height`), aspect ratio, source provider, and direct full-res download link.

### 5. Custom Aesthetics & Page Transitions
- **Pure Black & Gold UI**: Tailored for AMOLED displays with high-contrast electric gold (`#facc15`) accents.
- **Ambient Floating Soul Bubbles**: Canvas-based interactive background with drifting luminous bubbles and gaming watermark emblems.
- **Jacket-Style Zipper Route Transition**: Custom-engineered page transition that zips closed and open when navigating between pages.

### 6. Python CLI Companion
For terminal lovers and batch automation, the repository includes a standalone Python CLI tool located in [`cli/`](cli/):
- Interactive wizard or CLI flags (`--query`, `--device`, `--limit`, `--min-res`, `--zip`).
- Multi-threaded concurrent image downloads with terminal progress reporting.
- Automatic folder organization and optional `.zip` generation upon completion.

---

## Tech Stack

| Layer | Technologies |
|---|---|
| **Framework** | Next.js 15 (App Router, Server & Route Handlers), React 19 |
| **Language** | TypeScript |
| **Styling** | Vanilla CSS + Tailwind utility tokens, Custom Keyframe Animations |
| **Client Packaging** | JSZip, FileSaver |
| **Icons** | Lucide React |
| **CLI Companion** | Python 3, `requests`, `colorama` |
| **Deployment** | Vercel Edge / Serverless |

---

## Project Structure

```
Wall-the-Heaven/
├── app/
│   ├── api/
│   │   ├── proxy/route.ts      # CORS bypass stream for in-browser ZIP downloads
│   │   └── search/route.ts     # Concurrent multi-source scraper & aggregator
│   ├── components/
│   │   ├── BackgroundSouls.tsx  # Ambient floating bubbles & gaming emblems
│   │   ├── BatchDownloadBar.tsx # Multi-select action bar & ZIP generator
│   │   ├── BrowseView.tsx       # Core search, grid, and filter state
│   │   ├── Header.tsx           # Navigation, device toggles & GitHub links
│   │   ├── LightboxModal.tsx    # Full-screen wallpaper inspector & single download
│   │   ├── WallpaperCard.tsx    # Card with resolution badges & selection checkboxes
│   │   ├── WallpaperGrid.tsx    # Responsive grid layout for desktop/mobile cards
│   │   └── ZipTransition.tsx    # Jacket-style zipper page transition
│   ├── browse/page.tsx          # Dedicated gallery page
│   ├── about/page.tsx           # Project overview and architecture details
│   ├── disclaimer/page.tsx      # Fair-use copyright & technical notice
│   ├── layout.tsx               # Root layout, meta tags, and structured data
│   └── globals.css              # Global styles, scrollbar themes & animations
├── cli/
│   ├── src/                     # Modular Python scraper & downloader engine
│   ├── wall_the_heaven.py       # Main CLI entry point & interactive wizard
│   └── requirements.txt         # Python dependencies
├── public/
│   ├── screenshots/             # Interface preview screenshots
│   ├── sitemap.xml              # Search engine sitemap
│   └── robots.txt               # Crawler directives
├── package.json
└── README.md
```

---

## Getting Started

### 1. Web Application

#### Prerequisites
- Node.js 18+ installed
- npm or pnpm

#### Installation
```bash
# Clone the repository
git clone https://github.com/Md-Saim/Wall-The-Heaven.git
cd Wall-The-Heaven

# Install dependencies
npm install

# (Optional) Add your Wallhaven API key in a .env.local file
echo "WALLHAVEN_API_KEY=your_key_here" > .env.local

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

### 2. Python CLI

If you prefer downloading directly from your command line:

```bash
# Navigate to the CLI directory
cd cli

# Install Python dependencies
pip install -r requirements.txt

# Run the interactive wizard
python wall_the_heaven.py

# Or run with command-line arguments:
python wall_the_heaven.py --query "Cyberpunk" --device desktop --limit 30 --zip
```

#### CLI Options
```
--query, -q     Search query (e.g. "Genshin Impact", "Cyberpunk 2077")
--device, -d    Device orientation: "desktop" (16:9) or "mobile" (9:16)
--limit, -l     Max number of wallpapers to download (default: 20)
--min-res, -r   Minimum resolution: "all", "1080p", "1440p", "4k"
--output, -o    Output folder directory (default: ./wallpapers)
--zip, -z       Automatically bundle downloaded wallpapers into a .zip file
```

---

## API Overview

### `GET /api/search`
Searches wallpapers across all active sources concurrently.

**Parameters:**
- `q` (string): Query search term (e.g. `Anime`, `Minimal`, `Nature`)
- `device` (string): `desktop` or `mobile`
- `minRes` (string): `all`, `1080p`, `1440p`, or `4k`
- `limit` (number): Max count of results (10 - 100)

**Response:**
```json
{
  "success": true,
  "query": "Cyberpunk",
  "device": "desktop",
  "minRes": "all",
  "total": 42,
  "results": [
    {
      "id": "wh-9mx8pw",
      "source": "Wallhaven",
      "url": "https://w.wallhaven.cc/full/9m/wallhaven-9mx8pw.jpg",
      "previewUrl": "https://th.wallhaven.cc/lg/9m/9mx8pw.jpg",
      "width": 3840,
      "height": 2160,
      "aspectRatio": 1.78,
      "device": "desktop",
      "resolutionStr": "3840x2160",
      "title": "Wallhaven 9mx8pw",
      "fileType": "jpg"
    }
  ]
}
```

### `GET /api/proxy?url=<encoded_url>`
Streams image binary data with permissive CORS headers to allow client-side `JSZip` blob compilation.

---

## License

This project is open-source and available under the [MIT License](LICENSE).

Created by **[Md-Saim](https://github.com/Md-Saim)**.
