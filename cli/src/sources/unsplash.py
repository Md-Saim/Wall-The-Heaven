"""
Unsplash API source provider for Wall-the-Heaven.
High-quality curated photography wallpapers.
"""
from typing import List, Optional
import requests
from ..models import WallpaperItem
from .base import WallpaperSource


class UnsplashSource(WallpaperSource):
    def __init__(self, access_key: Optional[str] = None):
        super().__init__(name="Unsplash", priority=5, is_zero_auth=False)
        self.access_key = access_key
        self.base_url = "https://api.unsplash.com/search/photos"

    def is_available(self) -> bool:
        return bool(self.access_key and self.access_key.strip())

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
        headers = {"Authorization": f"Client-ID {self.access_key}"}

        page = 1
        per_page = min(limit, 30)

        while len(items) < limit:
            params = {
                "query": query,
                "per_page": per_page,
                "page": page,
                "orientation": "landscape" if min_width >= min_height else None
            }
            params = {k: v for k, v in params.items() if v is not None}

            try:
                resp = self.session.get(
                    self.base_url,
                    headers=headers,
                    params=params,
                    timeout=10
                )
                if resp.status_code == 401:
                    print("  [Unsplash] Invalid Access Key (HTTP 401).")
                    break
                elif resp.status_code == 403:
                    print("  [Unsplash] Rate limit reached (HTTP 403).")
                    break
                elif resp.status_code != 200:
                    print(f"  [Unsplash] Request failed with HTTP {resp.status_code}.")
                    break

                data = resp.json()
                results = data.get("results", [])
                if not results:
                    break

                for r in results:
                    uid = str(r.get("id"))
                    urls = r.get("urls", {})
                    # Use full or high-res raw crop
                    raw = urls.get("raw")
                    full = urls.get("full")
                    img_url = (f"{raw}&w=3840&q=85" if raw else full) or urls.get("regular")
                    if not img_url:
                        continue

                    w = int(r.get("width", 0))
                    h = int(r.get("height", 0))

                    if min_width > 0 and w < min_width:
                        continue
                    if min_height > 0 and h < min_height:
                        continue

                    items.append(
                        WallpaperItem(
                            id=uid,
                            source="unsplash",
                            url=img_url,
                            preview_url=urls.get("small"),
                            width=w,
                            height=h,
                            file_type="jpg",
                            title=r.get("alt_description") or f"Unsplash {uid}"
                        )
                    )
                    if len(items) >= limit:
                        break

                page += 1
                total_pages = data.get("total_pages", 0)
                if page > total_pages:
                    break

            except requests.RequestException as e:
                print(f"  [Unsplash] Connection error: {e}")
                break
            except Exception as e:
                print(f"  [Unsplash] Unexpected error: {e}")
                break

        return items
