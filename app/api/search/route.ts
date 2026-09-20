import { NextRequest, NextResponse } from 'next/server';

export interface WallpaperItem {
  id: string;
  source: string;
  url: string;
  previewUrl: string;
  width: number;
  height: number;
  aspectRatio: number;
  device: 'desktop' | 'mobile';
  resolutionStr: string;
  title: string;
  fileType: string;
}

const DEFAULT_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Accept-Language': 'en-US,en;q=0.9',
};

// 1. Search AlphaCoders
async function searchAlphaCoders(
  query: string,
  device: string,
  limit: number
): Promise<WallpaperItem[]> {
  const items: WallpaperItem[] = [];
  const seenIds = new Set<string>();

  // If mobile is selected, search page 1 and page 2 to gather plenty of portrait wallpapers
  const queriesToRun = device === 'mobile' ? [query, `${query} phone`] : [query];

  for (const q of queriesToRun) {
    if (items.length >= limit) break;

    try {
      const url = `https://wall.alphacoders.com/search.php?search=${encodeURIComponent(q)}&page=1`;
      const resp = await fetch(url, {
        headers: {
          ...DEFAULT_HEADERS,
          Referer: 'https://wall.alphacoders.com/',
        },
        next: { revalidate: 3600 },
      });

      if (!resp.ok) continue;

      const html = await resp.text();

      // Extract Schema.org ImageObject items
      const schemaBlocks =
        html.match(/<div[^>]*itemscope[^>]*itemtype="http:\/\/schema\.org\/ImageObject"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/gi) || [];

      for (const block of schemaBlocks) {
        const contentMatch = block.match(/itemprop="contentUrl"\s+content="([^"]+)"/i);
        const thumbMatch = block.match(/itemprop="thumbnailUrl"\s+content="([^"]+)"/i);
        const wMatch = block.match(/itemprop="width"\s+content="(\d+)"/i);
        const hMatch = block.match(/itemprop="height"\s+content="(\d+)"/i);
        const nameMatch = block.match(/itemprop="name"\s+content="([^"]+)"/i);

        if (!contentMatch) continue;

        const contentUrl = contentMatch[1];
        const previewUrl = thumbMatch ? thumbMatch[1] : contentUrl;
        const width = wMatch ? parseInt(wMatch[1], 10) : 1920;
        const height = hMatch ? parseInt(hMatch[1], 10) : 1080;
        const isMobile = height > width;

        // Extract clean ID from contentUrl
        const idMatch = contentUrl.match(/\/(\d+)\.(\w+)$/);
        const itemId = idMatch ? idMatch[1] : contentUrl;
        const fileExt = idMatch ? idMatch[2].toLowerCase() : 'jpg';

        if (seenIds.has(itemId)) continue;

        // Filter by user's chosen device
        if (device === 'desktop' && isMobile) continue;
        if (device === 'mobile' && !isMobile) continue;

        seenIds.add(itemId);

        const title = nameMatch ? nameMatch[1].trim() : `${q} Wallpaper`;

        items.push({
          id: `alpha-${itemId}`,
          source: 'AlphaCoders',
          url: contentUrl,
          previewUrl,
          width,
          height,
          aspectRatio: Number((width / height).toFixed(2)),
          device: isMobile ? 'mobile' : 'desktop',
          resolutionStr: `${width}x${height}`,
          title,
          fileType: fileExt,
        });

        if (items.length >= limit) break;
      }
    } catch (err) {
      console.error('AlphaCoders search error:', err);
    }
  }

  return items;
}

// 2. Search Wallhaven
async function searchWallhaven(
  query: string,
  device: string,
  limit: number
): Promise<WallpaperItem[]> {
  const items: WallpaperItem[] = [];
  try {
    const params = new URLSearchParams({
      q: query,
      categories: '111',
      purity: '100',
      sorting: 'relevance',
      order: 'desc',
    });

    if (device === 'desktop') {
      params.set('ratios', '16x9,16x10,21x9');
    } else if (device === 'mobile') {
      params.set('ratios', '9x16,9x18,10x16');
    }

    const apiKey = process.env.WALLHAVEN_API_KEY;
    if (apiKey) {
      params.set('apikey', apiKey);
    }

    const resp = await fetch(`https://wallhaven.cc/api/v1/search?${params.toString()}`, {
      headers: {
        'User-Agent': 'WallTheHeaven/1.0',
      },
      next: { revalidate: 3600 },
    });

    if (resp.status === 503) {
      return items;
    }

    if (!resp.ok) return items;

    const data = await resp.json();
    const results = data.data || [];

    for (const r of results) {
      const w = r.dimension_x || 1920;
      const h = r.dimension_y || 1080;
      const isMobile = h > w;

      if (device === 'desktop' && isMobile) continue;
      if (device === 'mobile' && !isMobile) continue;

      items.push({
        id: `wh-${r.id}`,
        source: 'Wallhaven',
        url: r.path,
        previewUrl: r.thumbs?.large || r.thumbs?.original || r.path,
        width: w,
        height: h,
        aspectRatio: Number((w / h).toFixed(2)),
        device: isMobile ? 'mobile' : 'desktop',
        resolutionStr: `${w}x${h}`,
        title: `Wallhaven ${r.id}`,
        fileType: (r.file_type || 'image/jpeg').split('/')[1] || 'jpg',
      });

      if (items.length >= limit) break;
    }
  } catch (err) {
    console.warn('Wallhaven API connection notice:', err);
  }

  return items;
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const query = searchParams.get('q') || 'Cyberpunk 2077';
  const device = searchParams.get('device') || 'desktop'; // desktop, mobile, all
  const minRes = searchParams.get('minRes') || 'all'; // all, 1080p, 1440p, 4k
  const limit = Math.min(60, Math.max(10, parseInt(searchParams.get('limit') || '30', 10)));

  // Query sources concurrently
  const [alphaResults, whResults] = await Promise.all([
    searchAlphaCoders(query, device, limit),
    searchWallhaven(query, device, limit),
  ]);

  const combined = [...alphaResults, ...whResults];

  // Deduplicate by URL
  const seenUrls = new Set<string>();
  const deduped: WallpaperItem[] = [];

  for (const item of combined) {
    const clean = item.url.split('?')[0].toLowerCase();
    if (seenUrls.has(clean)) continue;
    seenUrls.add(clean);
    deduped.push(item);
  }

  // Filter by min resolution if specified
  const filtered = deduped.filter((item) => {
    if (minRes === '4k') {
      return item.width >= 3840 || item.height >= 2160;
    }
    if (minRes === '1440p') {
      return item.width >= 2560 || item.height >= 1440;
    }
    if (minRes === '1080p') {
      return item.width >= 1920 || item.height >= 1080;
    }
    return true;
  });

  // Sort by pixel count (higher resolution first)
  filtered.sort((a, b) => b.width * b.height - a.width * a.height);

  return NextResponse.json({
    success: true,
    query,
    device,
    minRes,
    total: filtered.length,
    results: filtered.slice(0, limit),
  });
}
