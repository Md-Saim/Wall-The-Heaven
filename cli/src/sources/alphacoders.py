"""
AlphaCoders Wallpaper Abyss provider for Wall-the-Heaven.
Completely zero-auth, high quality gaming, anime, movie and character wallpapers.
"""
import re
from typing import List
from urllib.parse import quote_plus
import requests
from ..models import WallpaperItem
from .base import WallpaperSource


class AlphaCodersSource(WallpaperSource):
    def __init__(self):
        super().__init__(name="AlphaCoders", priority=2, is_zero_auth=True)
        self.base_url = "https://wall.alphacoders.com/search.php"

    def is_available(self) -> bool:
        # Zero auth required
        return True

    def search(
        self,
        query: str,
        limit: int = 30,
        min_width: int = 1920,
        min_height: int = 1080
    ) -> List[WallpaperItem]:
        items: List[WallpaperItem] = []
        page = 1
        max_pages = (limit // 20) + 1
        max_pages = min(max_pages, 4)

        seen_ids = set()

        while page <= max_pages and len(items) < limit:
            url = f"{self.base_url}?search={quote_plus(query)}&page={page}"
            try:
                resp = self.session.get(
                    url,
                    headers={
                        "Referer": "https://wall.alphacoders.com/",
                    },
                    timeout=10
                )
                if resp.status_code != 200:
                    break

                html = resp.text
                # Parse picture elements for exact server, subfolder, item ID, and extension
                picture_blocks = re.findall(r'<picture>(.*?)</picture>', html, re.DOTALL)
                found_in_page = 0

                for block in picture_blocks:
                    # Prefer non-webp srcset if available
                    non_webp_match = re.findall(
                        r'srcset="(https://([^/]+)/(\d+)/[^-]+-(\d+)-(\d+)\.(jpe?g|png))"',
                        block,
                        re.IGNORECASE
                    )

                    if non_webp_match:
                        raw_url, host, sub, w_hint, item_id, ext = non_webp_match[0]
                    else:
                        any_match = re.findall(
                            r'srcset="(https://([^/]+)/(\d+)/[^-]+-(\d+)-(\d+)\.(\w+))"',
                            block,
                            re.IGNORECASE
                        )
                        if not any_match:
                            continue
                        raw_url, host, sub, w_hint, item_id, ext = any_match[0]

                    if item_id in seen_ids:
                        continue
                    seen_ids.add(item_id)

                    # Build high-resolution URL (1920 FHD / 4K variant)
                    full_res_url = f"https://{host}/{sub}/thumb-1920-{item_id}.{ext}"

                    # Estimate resolution from alt tag or block
                    width = 1920
                    height = 1080
                    dim_match = re.search(r'width="(\d+)"\s*height="(\d+)"', block)
                    if dim_match:
                        try:
                            # Calculate aspect ratio to project to 1920
                            pw = int(dim_match.group(1))
                            ph = int(dim_match.group(2))
                            if pw > 0 and ph > 0:
                                height = int(1920 * (ph / pw))
                        except Exception:
                            pass

                    # Filter by minimum resolution
                    if min_width > 0 and width < min_width:
                        continue
                    if min_height > 0 and height < min_height:
                        continue

                    # Extract alt text if present
                    alt_match = re.search(r'alt="([^"]+)"', block)
                    title = alt_match.group(1).strip() if alt_match else f"AlphaCoders {item_id}"

                    items.append(
                        WallpaperItem(
                            id=item_id,
                            source="alphacoders",
                            url=full_res_url,
                            preview_url=raw_url,
                            width=width,
                            height=height,
                            file_type=ext.lower(),
                            title=title
                        )
                    )
                    found_in_page += 1
                    if len(items) >= limit:
                        break

                if found_in_page == 0:
                    break

                page += 1

            except requests.RequestException as e:
                print(f"  [AlphaCoders] Connection error: {e}")
                break
            except Exception as e:
                print(f"  [AlphaCoders] Unexpected error: {e}")
                break

        return items
