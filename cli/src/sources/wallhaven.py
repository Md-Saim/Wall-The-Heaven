"""
Wallhaven.cc API source provider for Wall-the-Heaven.
"""
from typing import List, Optional
import requests
from ..models import WallpaperItem
from .base import WallpaperSource


class WallhavenSource(WallpaperSource):
    def __init__(self, api_key: Optional[str] = None):
        super().__init__(name="Wallhaven", priority=1, is_zero_auth=True)
        self.api_key = api_key
        self.base_url = "https://wallhaven.cc/api/v1/search"

    def is_available(self) -> bool:
        # Wallhaven supports public SFW queries with zero API key
        return True

    def search(
        self,
        query: str,
        limit: int = 30,
        min_width: int = 1920,
        min_height: int = 1080
    ) -> List[WallpaperItem]:
        items: List[WallpaperItem] = []
        headers = {}
        if self.api_key:
            headers["X-API-Key"] = self.api_key

        page = 1
        per_page = 24  # Wallhaven default page size
        max_pages = (limit // per_page) + (1 if limit % per_page != 0 else 0)
        max_pages = min(max_pages, 3)  # Safety limit

        while page <= max_pages and len(items) < limit:
            params = {
                "q": query,
                "categories": "111",      # General, Anime, People
                "purity": "100",          # SFW only
                "sorting": "relevance",
                "order": "desc",
                "page": page,
            }
            if min_width > 0 and min_height > 0:
                params["atleast"] = f"{min_width}x{min_height}"

            try:
                resp = self.session.get(
                    self.base_url,
                    params=params,
                    headers=headers,
                    timeout=8
                )

                if resp.status_code == 503:
                    print(f"  [Wallhaven] Service temporarily unavailable (HTTP 503 maintenance) - skipping source gracefully.")
                    break
                elif resp.status_code == 429:
                    print(f"  [Wallhaven] Rate limited (HTTP 429) - skipping further pages.")
                    break
                elif resp.status_code != 200:
                    print(f"  [Wallhaven] HTTP {resp.status_code} - skipping.")
                    break

                data = resp.json()
                results = data.get("data", [])
                if not results:
                    break

                for r in results:
                    item_id = str(r.get("id", ""))
                    img_url = r.get("path")
                    if not item_id or not img_url:
                        continue

                    w = int(r.get("dimension_x", 0))
                    h = int(r.get("dimension_y", 0))
                    ftype = r.get("file_type", "image/jpeg").split("/")[-1]
                    size = r.get("file_size")
                    thumbs = r.get("thumbs", {})
                    prev = thumbs.get("original") or thumbs.get("large") or thumbs.get("small")

                    items.append(
                        WallpaperItem(
                            id=item_id,
                            source="wallhaven",
                            url=img_url,
                            width=w,
                            height=h,
                            preview_url=prev,
                            file_type=ftype,
                            file_size=size,
                            title=f"Wallhaven {item_id}"
                        )
                    )

                    if len(items) >= limit:
                        break

                page += 1

            except requests.RequestException as e:
                print(f"  [Wallhaven] Connection error: {e}")
                break
            except Exception as e:
                print(f"  [Wallhaven] Unexpected error: {e}")
                break

        return items
