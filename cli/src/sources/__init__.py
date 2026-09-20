"""
Sources registry and multi-source aggregator.
"""
from concurrent.futures import ThreadPoolExecutor, as_completed
from typing import List, Dict, Optional

from ..models import WallpaperItem
from ..config import Config
from .base import WallpaperSource
from .wallhaven import WallhavenSource
from .alphacoders import AlphaCodersSource
from .pexels import PexelsSource
from .pixabay import PixabaySource
from .unsplash import UnsplashSource
from .reddit import RedditSource


ALL_SOURCE_CLASSES = {
    "alphacoders": AlphaCodersSource,
    "wallhaven": WallhavenSource,
    "pexels": PexelsSource,
    "pixabay": PixabaySource,
    "unsplash": UnsplashSource,
    "reddit": RedditSource,
}


def build_sources(config: Config, requested_names: Optional[List[str]] = None) -> List[WallpaperSource]:
    """Build configured source instances based on user requests and available credentials."""
    sources: List[WallpaperSource] = []

    selected = [name.lower().strip() for name in requested_names] if requested_names else list(ALL_SOURCE_CLASSES.keys())

    for name in selected:
        if name not in ALL_SOURCE_CLASSES:
            print(f"  [Warning] Unknown source '{name}'. Available: {', '.join(ALL_SOURCE_CLASSES.keys())}")
            continue

        if name == "alphacoders":
            sources.append(AlphaCodersSource())
        elif name == "wallhaven":
            sources.append(WallhavenSource(api_key=config.wallhaven_api_key))
        elif name == "pexels":
            src = PexelsSource(api_key=config.pexels_api_key)
            if src.is_available():
                sources.append(src)
            elif requested_names and "pexels" in selected:
                print("  [Notice] Pexels requires an API key (set PEXELS_API_KEY or use config.json). Skipping.")
        elif name == "pixabay":
            src = PixabaySource(api_key=config.pixabay_api_key)
            if src.is_available():
                sources.append(src)
            elif requested_names and "pixabay" in selected:
                print("  [Notice] Pixabay requires an API key (set PIXABAY_API_KEY or use config.json). Skipping.")
        elif name == "unsplash":
            src = UnsplashSource(access_key=config.unsplash_access_key)
            if src.is_available():
                sources.append(src)
            elif requested_names and "unsplash" in selected:
                print("  [Notice] Unsplash requires an Access Key (set UNSPLASH_ACCESS_KEY or use config.json). Skipping.")
        elif name == "reddit":
            src = RedditSource(client_id=config.reddit_client_id, client_secret=config.reddit_client_secret)
            if src.is_available():
                sources.append(src)
            elif requested_names and "reddit" in selected:
                print("  [Notice] Reddit requires REDDIT_CLIENT_ID and REDDIT_CLIENT_SECRET. Skipping.")

    # Sort sources by priority
    sources.sort(key=lambda s: s.priority)
    return sources


def search_all_sources(
    sources: List[WallpaperSource],
    query: str,
    target_count: int = 30,
    min_width: int = 1920,
    min_height: int = 1080
) -> List[WallpaperItem]:
    """
    Query all enabled sources in parallel, combine results, deduplicate,
    and rank by resolution quality.
    """
    if not sources:
        return []

    # Ask each source for a reasonable share of items
    per_source_limit = max(target_count, 20)
    all_items: List[WallpaperItem] = []

    with ThreadPoolExecutor(max_workers=len(sources)) as executor:
        future_to_source = {
            executor.submit(src.search, query, per_source_limit, min_width, min_height): src
            for src in sources
        }

        for future in as_completed(future_to_source):
            src = future_to_source[future]
            try:
                found = future.result()
                print(f"  [+] {src.name}: Found {len(found)} candidate wallpapers.")
                all_items.extend(found)
            except Exception as e:
                print(f"  [-] {src.name}: Encountered error during search: {e}")

    # Deduplicate items by image URL and normalize IDs
    seen_urls = set()
    deduped_items: List[WallpaperItem] = []

    for item in all_items:
        clean_url = item.url.split("?")[0].lower()
        if clean_url in seen_urls:
            continue
        seen_urls.add(clean_url)
        deduped_items.append(item)

    # Sort by pixel count (higher resolution preferred), then source priority
    source_prio_map = {s.name.lower(): s.priority for s in sources}
    deduped_items.sort(
        key=lambda x: (
            x.pixel_count,
            -source_prio_map.get(x.source.lower(), 99)
        ),
        reverse=True
    )

    return deduped_items[:target_count]
