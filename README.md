# 🌌 Wall-the-Heaven — Multi-Source Wallpaper Downloader

> **Ethereal, high-resolution wallpaper discovery engine and downloader for Desktop & Mobile.**  
> Built with Next.js 15, React 19, TypeScript, and HTML5 Canvas. Ready for 1-click **Vercel** deployment and paired with a standalone **Python CLI** tool.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FMd-Saim%2FWall-The-Heaven)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-181717?logo=github)](https://github.com/Md-Saim/Wall-The-Heaven)
[![CI & Auto-Verification](https://github.com/Md-Saim/Wall-The-Heaven/actions/workflows/ci.yml/badge.svg)](https://github.com/Md-Saim/Wall-The-Heaven/actions)
[![Next.js 15](https://img.shields.io/badge/Next.js-15.5-0070F3?logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

---

## ⚡ Automated CI/CD & Auto-Deployments

Every time you run `git push`:
1. **GitHub Actions (`ci.yml`)**: Automatically triggers to build, lint, and verify your Next.js application.
2. **Vercel Webhook**: Automatically detects new commits on `main` and immediately builds & publishes the latest production deployment in under 30 seconds with zero manual clicks!

---

## ✨ Features

- **Atmospheric Ethereal Background**:
  - Interactive HTML5 Canvas with floating soul orbs and luminous bubbles drifting upwards with organic physics.
  - Interactive cursor aura that gently repels and scatters floating souls on hover.
  - **Dissolved PC Game Logos**: Subtle, low-opacity vector emblems of legendary PC titles (*Dark Souls, Elden Ring, Cyberpunk 2077, The Witcher 3, Skyrim, Half-Life, DOOM*) slowly rotating and fading into the deep cosmic obsidian mist.
- **🖥️ Desktop & 📱 Mobile Form Factor Switching**:
  - **Desktop / Laptop Mode (16:9, 16:10, 21:9 Ultrawide)**: Automatically filters for landscape orientations (`width >= height`) with resolutions up to 4K & 5K.
  - **Mobile / Phone Mode (9:16, 9:20 AMOLED)**: Tailored portrait wallpapers (`height > width`) for smartphone lockscreens and home screens.
  - **All Form Factors**: Shows combined wallpapers with dynamic aspect ratio cards.
- **Multi-Source Unified Search**:
  - **AlphaCoders Wallpaper Abyss**: Zero-auth, full 1080p, 2K, 4K, and 5K gaming and anime wallpapers.
  - **Wallhaven.cc**: Top-tier digital art and anime wallpapers with automatic fallback handling.
  - **Pexels / Pixabay / Unsplash**: Optional API support via environment variables.
- **Fast Client-Side ZIP Generator**:
  - Select multiple wallpapers with a single click or **Select All**.
  - Packs selected high-resolution images into a clean `.zip` archive directly in your browser with real-time progress.
- **Fullscreen Lightbox Viewer**:
  - Inspect full-resolution images with resolution badges, aspect ratio details, and 1-click download.
- **Standalone Python CLI Tool Included**:
  - Located in the `cli/` directory for fast terminal usage with 8-thread concurrent downloads.

---

## 🚀 One-Click Vercel Deployment

Deploying **Wall-the-Heaven** to Vercel takes under 1 minute:

1. Push this repository to your GitHub account:
   ```bash
   git add .
   git commit -m "feat: complete Wall-the-Heaven web app & CLI"
   git push -u origin main
   ```
2. Open your [Vercel Dashboard](https://vercel.com/new).
3. Click **"Import Project"** and select `Md-Saim/Wall-The-Heaven`.
4. Click **"Deploy"** (Next.js is automatically detected; no build configurations needed!).

---

## 🛠️ Local Development

### 1. Prerequisites
- **Node.js**: v18+ (tested on v22 and v26)
- **npm** or **pnpm**

### 2. Install & Run
```bash
# Clone the repository
git clone https://github.com/Md-Saim/Wall-The-Heaven.git
cd Wall-The-Heaven

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to experience the site.

### 3. Build for Production
```bash
npm run build
npm run start
```

---

## 🐍 Standalone Python CLI Tool

For command-line enthusiasts, the Python CLI tool is preserved in `cli/`:

```bash
cd cli
pip install -r requirements.txt

# Interactive wizard mode
python wall_the_heaven.py

# CLI fast mode (download 30 wallpapers for Zhongli)
python wall_the_heaven.py "Genshin Impact Zhongli" --count 30

# High-res 4K download with ZIP-only output
python wall_the_heaven.py "Cyberpunk 2077" --count 50 --min-res 3840x2160 --zip-only
```

---

## 📁 Repository Structure

```
Wall-The-Heaven/
├── app/
│   ├── layout.tsx            # Global metadata, viewport, Outfit typography
│   ├── page.tsx              # Main wallpaper explorer page
│   ├── globals.css           # Glassmorphism, dark theme, sleek scrollbars
│   ├── api/
│   │   ├── search/route.ts   # Multi-source parallel search API
│   │   └── proxy/route.ts    # Cross-origin streaming proxy for ZIP creation
│   └── components/
│       ├── BackgroundSouls.tsx   # Canvas animation (souls + dissolved PC game logos)
│       ├── Header.tsx            # Navigation, source indicators, GitHub link
│       ├── SearchBar.tsx         # Search bar with Desktop vs Mobile ratio switcher
│       ├── WallpaperCard.tsx     # Responsive card with device & resolution badges
│       ├── WallpaperGrid.tsx     # Adaptive grid with skeleton loaders
│       ├── LightboxModal.tsx     # Fullscreen preview modal
│       └── BatchDownloadBar.tsx  # Floating bottom dock with live ZIP progress
├── public/
│   └── game-logos/           # Crisp SVG vector marks (Dark Souls, Elden Ring, Cyberpunk, Witcher, etc.)
├── cli/                      # Standalone Python CLI tool
│   ├── wall_the_heaven.py
│   ├── requirements.txt
│   ├── src/
│   └── tests/
├── package.json
├── tsconfig.json
├── next.config.js
└── README.md
```

---

## 📜 License

MIT License © 2026 [Md-Saim](https://github.com/Md-Saim)
