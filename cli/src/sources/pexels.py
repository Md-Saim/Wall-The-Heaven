"""
Pexels API source provider for Wall-the-Heaven.
High quality, royalty-free photography wallpapers.
"""
from typing import List, Optional
import requests
from ..models import WallpaperItem
from .base import WallpaperSource


class PexelsSource(WallpaperSource):
    def __init__(self, api_key: Optional[str] = None):
        super().__init__(name="Pexels", priority=3, is_zero_auth=False)
        self.api_key = api_key
        self.base_url = "https://api.pexels.com/v1/search"

    def is_available(self) -> bool:
        return bool(self.api_key and self.api_key.strip())

    def search(
        self,
        query: str,
        limit: int = 30,
        min_width: int = 1920,
        min_height: int = 1080
    ) -> List[WallpaperItem]:
        if not self.is_available():
            return []

        items: List[WallpaperItem] = []
        headers = {"Authorization": self.api_key}

        page = 1
        per_page = min(limit, 80)

        while len(items) < limit:
            params = {
                "query": query,
                "per_page": per_page,
                "page": page,
                "orientation": "landscape" if min_width >= min_height else None
            }
            # Remove None values
            params = {k: v for k, v in params.items() if v is not None}

            try:
                resp = self.session.get(
                    self.base_url,
                    headers=headers,
                    params=params,
                    timeout=10
                )
                if resp.status_code == 401:
                    print("  [Pexels] Invalid API key (HTTP 401).")
                    break
                elif resp.status_code == 429:
                    print("  [Pexels] Rate limit exceeded (HTTP 429).")
                    break
                elif resp.status_code != 200:
                    print(f"  [Pexels] Request failed with HTTP {resp.status_code}.")
                    break

                data = resp.json()
                photos = data.get("photos", [])
                if not photos:
                    break

                for p in photos:
                    pid = str(p.get("id"))
                    src = p.get("src", {})
                    # Prefer original or large2x
                    img_url = src.get("original") or src.get("large2x")
                    if not img_url:
                        continue

                    w = int(p.get("width", 0))
                    h = int(p.get("height", 0))

                    if min_width > 0 and w < min_width:
                        continue
                    if min_height > 0 and h < min_height:
                        continue

                    items.append(
                        WallpaperItem(
                            id=pid,
                            source="pexels",
                            url=img_url,
                            preview_url=src.get("medium"),
                            width=w,
                            height=h,
                            file_type="jpg",
                            title=p.get("alt") or f"Pexels {pid}"
                        )
                    )
                    if len(items) >= limit:
                        break

                page += 1
                if not data.get("next_page"):
                    break

            except requests.RequestException as e:
                print(f"  [Pexels] Connection error: {e}")
                break
            except Exception as e:
                print(f"  [Pexels] Unexpected error: {e}")
                break

        return items
