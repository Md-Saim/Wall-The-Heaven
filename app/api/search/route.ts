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
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept-Language': 'en-US,en;q=0.9',
};

// 1. AlphaCoders fast scraper with strict 3s timeout
async function searchAlphaCoders(
  query: string,
  device: string,
  limit: number
): Promise<WallpaperItem[]> {
  const items: WallpaperItem[] = [];
  const seenIds = new Set<string>();

  try {
    const url = `https://wall.alphacoders.com/search.php?search=${encodeURIComponent(query)}&page=1`;
    const resp = await fetch(url, {
      headers: {
        ...DEFAULT_HEADERS,
        Referer: 'https://wall.alphacoders.com/',
      },
      signal: AbortSignal.timeout(3200),
    });

    if (!resp.ok) return items;

    const html = await resp.text();

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

      const idMatch = contentUrl.match(/\/(\d+)\.(\w+)$/);
      const itemId = idMatch ? idMatch[1] : contentUrl;
      const fileExt = idMatch ? idMatch[2].toLowerCase() : 'jpg';

      if (seenIds.has(itemId)) continue;

      if (device === 'desktop' && isMobile) continue;
      if (device === 'mobile' && !isMobile) continue;

      seenIds.add(itemId);

      const title = nameMatch ? nameMatch[1].trim() : `${query} Wallpaper`;

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
  } catch {
    // Timeout or network notice handled gracefully
  }

  return items;
}

// 2. WallpapersCraft with strict 3s timeout and high density mobile & desktop
async function searchWallpapersCraft(
  query: string,
  device: string,
  limit: number
): Promise<WallpaperItem[]> {
  const items: WallpaperItem[] = [];
  const seenIds = new Set<string>();

  // Determine term: if multi-word, test primary gaming keyword if first term is better (e.g. "Cyberpunk" from "Cyberpunk 2077")
  const primaryTerm = query.includes(' ') ? query.split(' ')[0] : query;
  const termsToTry = primaryTerm !== query ? [query, primaryTerm] : [query];

  for (const term of termsToTry) {
    if (items.length >= limit) break;

    try {
      const url = `https://wallpaperscraft.com/search/?query=${encodeURIComponent(term)}`;
      const resp = await fetch(url, {
        headers: {
          ...DEFAULT_HEADERS,
          Referer: 'https://wallpaperscraft.com/',
        },
        signal: AbortSignal.timeout(3000),
      });

      if (!resp.ok) continue;

      const html = await resp.text();

      const imgMatches = Array.from(
        html.matchAll(/<img class="wallpapers__image" src="([^"]+)" alt="([^"]+)">/g)
      );

      for (const match of imgMatches) {
        const thumbUrl = match[1];
        const rawAlt = match[2].replace(/^Preview wallpaper\s*/i, '').trim();

        const idMatch = thumbUrl.match(/_(\d+)_\d+x\d+\.jpg$/);
        const itemId = idMatch ? idMatch[1] : thumbUrl;

        if (seenIds.has(itemId)) continue;
        seenIds.add(itemId);

        if (device === 'mobile') {
          // 1080x1920 mobile portrait lockscreen format
          const fullUrl = thumbUrl.replace(/_\d+x\d+\.jpg$/, '_1080x1920.jpg');
          items.push({
            id: `wc-${itemId}-mob`,
            source: 'WallpapersCraft',
            url: fullUrl,
            previewUrl: thumbUrl,
            width: 1080,
            height: 1920,
            aspectRatio: 0.56,
            device: 'mobile',
            resolutionStr: '1080x1920',
            title: rawAlt || `${term} Mobile Wallpaper`,
            fileType: 'jpg',
          });
        } else {
          // 1920x1080 desktop format
          const fullUrl = thumbUrl.replace(/_\d+x\d+\.jpg$/, '_1920x1080.jpg');
          items.push({
            id: `wc-${itemId}-desk`,
            source: 'WallpapersCraft',
            url: fullUrl,
            previewUrl: thumbUrl,
            width: 1920,
            height: 1080,
            aspectRatio: 1.78,
            device: 'desktop',
            resolutionStr: '1920x1080',
            title: rawAlt || `${term} Desktop Wallpaper`,
            fileType: 'jpg',
          });
        }

        if (items.length >= limit) break;
      }
    } catch {
      // Timeout or network notice handled gracefully
    }
  }

  return items;
}

// 3. 4KWallpapers scraper with instant 1080x1920 mobile and 1920x1080/3840x2160 desktop
async function search4KWallpapers(
  query: string,
  device: string,
  limit: number
): Promise<WallpaperItem[]> {
  const items: WallpaperItem[] = [];
  const seenIds = new Set<string>();

  try {
    const url = `https://4kwallpapers.com/search/?q=${encodeURIComponent(query)}`;
    const resp = await fetch(url, {
      headers: {
        ...DEFAULT_HEADERS,
        Referer: 'https://4kwallpapers.com/',
      },
      signal: AbortSignal.timeout(3000),
    });

    if (!resp.ok) return items;

    const html = await resp.text();

    const matches = Array.from(
      html.matchAll(/<a[^>]+href="\/[^/]+\/([^/]+)-(\d+)\.html"[^>]*>[\s\S]*?<img[^>]+src="(\/images\/walls\/thumbs\/\d+\.(\w+))"[^>]*alt="([^"]+)"/g)
    );

    for (const match of matches) {
      const slug = match[1];
      const id = match[2];
      const thumb = match[3];
      const ext = match[4];
      const alt = match[5];

      if (seenIds.has(id)) continue;
      seenIds.add(id);

      const previewUrl = `https://4kwallpapers.com${thumb}`;

      if (device === 'mobile') {
        const fullUrl = `https://4kwallpapers.com/images/wallpapers/${slug}-1080x1920-${id}.${ext}`;
        items.push({
          id: `4kw-${id}-mob`,
          source: '4KWallpapers',
          url: fullUrl,
          previewUrl,
          width: 1080,
          height: 1920,
          aspectRatio: 0.56,
          device: 'mobile',
          resolutionStr: '1080x1920',
          title: alt.split(',')[0].trim() || `${query} Mobile Wallpaper`,
          fileType: ext,
        });
      } else {
        const fullUrl = `https://4kwallpapers.com/images/wallpapers/${slug}-1920x1080-${id}.${ext}`;
        items.push({
          id: `4kw-${id}-desk`,
          source: '4KWallpapers',
          url: fullUrl,
          previewUrl,
          width: 1920,
          height: 1080,
          aspectRatio: 1.78,
          device: 'desktop',
          resolutionStr: '1920x1080',
          title: alt.split(',')[0].trim() || `${query} Desktop Wallpaper`,
          fileType: ext,
        });
      }

      if (items.length >= limit) break;
    }
  } catch {
    // Graceful error handle
  }

  return items;
}

// 4. Wallhaven fast search with strict 2.5s timeout
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
    if (apiKey) params.set('apikey', apiKey);

    const resp = await fetch(`https://wallhaven.cc/api/v1/search?${params.toString()}`, {
      headers: { 'User-Agent': 'WallTheHeaven/1.0' },
      signal: AbortSignal.timeout(2500),
    });

    if (resp.status === 503 || !resp.ok) return items;

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
  } catch {
    // Wallhaven maintenance / timeout handled
  }

  return items;
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const rawQuery = searchParams.get('q') || 'Cyberpunk 2077';
  const query = rawQuery.trim();
  const device = (searchParams.get('device') || 'desktop') as 'desktop' | 'mobile' | 'all';
  const minRes = searchParams.get('minRes') || 'all';
  const limit = Math.min(100, Math.max(10, parseInt(searchParams.get('limit') || '65', 10)));

  // Query sources concurrently in parallel
  const [alphaResults, wcResults, fkwResults, whResults] = await Promise.all([
    searchAlphaCoders(query, device, limit),
    searchWallpapersCraft(query, device, limit),
    search4KWallpapers(query, device, limit),
    searchWallhaven(query, device, limit),
  ]);

  const combined = [...alphaResults, ...wcResults, ...fkwResults, ...whResults];

  // Deduplicate by clean image URL
  const seenUrls = new Set<string>();
  const deduped: WallpaperItem[] = [];

  for (const item of combined) {
    const clean = item.url.split('?')[0].toLowerCase();
    if (seenUrls.has(clean)) continue;
    seenUrls.add(clean);
    deduped.push(item);
  }

  // Filter by resolution tier (minimum resolution threshold)
  const filtered = deduped.filter((item) => {
    if (minRes === 'all') return true;
    const maxDim = Math.max(item.width, item.height);
    const minDim = Math.min(item.width, item.height);

    if (minRes === '4k') return maxDim >= 3600 && minDim >= 1800;
    if (minRes === '1440p') return maxDim >= 2400 && minDim >= 1300;
    if (minRes === '1080p') return maxDim >= 1800 && minDim >= 900;
    return true;
  });

  // Sort: Higher resolution first
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
