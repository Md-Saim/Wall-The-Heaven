"""
Pixabay API source provider for Wall-the-Heaven.
Large library of free wallpapers and photos.
"""
from typing import List, Optional
import requests
from ..models import WallpaperItem
from .base import WallpaperSource


class PixabaySource(WallpaperSource):
    def __init__(self, api_key: Optional[str] = None):
        super().__init__(name="Pixabay", priority=4, is_zero_auth=False)
        self.api_key = api_key
        self.base_url = "https://pixabay.com/api/"

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
        page = 1
        per_page = min(limit, 100)

        while len(items) < limit:
            params = {
                "key": self.api_key,
                "q": query,
                "image_type": "all",
                "safesearch": "true",
                "per_page": per_page,
                "page": page,
                "orientation": "horizontal" if min_width >= min_height else "all"
            }

            try:
                resp = self.session.get(
                    self.base_url,
                    params=params,
                    timeout=10
                )
                if resp.status_code == 400:
                    print("  [Pixabay] Bad request or invalid API key.")
                    break
                elif resp.status_code != 200:
                    print(f"  [Pixabay] Request failed with HTTP {resp.status_code}.")
                    break

                data = resp.json()
                hits = data.get("hits", [])
                if not hits:
                    break

                for hit in hits:
                    hid = str(hit.get("id"))
                    img_url = hit.get("largeImageURL") or hit.get("fullHDURL") or hit.get("imageURL")
                    if not img_url:
                        continue

                    w = int(hit.get("imageWidth", 0))
                    h = int(hit.get("imageHeight", 0))

                    if min_width > 0 and w < min_width:
                        continue
                    if min_height > 0 and h < min_height:
                        continue

                    items.append(
                        WallpaperItem(
                            id=hid,
                            source="pixabay",
                            url=img_url,
                            preview_url=hit.get("webformatURL"),
                            width=w,
                            height=h,
                            file_type="jpg",
                            title=hit.get("tags") or f"Pixabay {hid}"
                        )
                    )
                    if len(items) >= limit:
                        break

                page += 1
                total_hits = data.get("totalHits", 0)
                if page * per_page >= total_hits:
                    break

            except requests.RequestException as e:
                print(f"  [Pixabay] Connection error: {e}")
                break
            except Exception as e:
                print(f"  [Pixabay] Unexpected error: {e}")
                break

        return items
