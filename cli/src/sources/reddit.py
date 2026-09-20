"""
Reddit API source provider for Wall-the-Heaven.
Searches r/wallpapers, r/Animewallpaper, r/wallpaper, and r/WQHD_Wallpaper.
"""
from typing import List, Optional
import requests
from requests.auth import HTTPBasicAuth
from ..models import WallpaperItem
from .base import WallpaperSource


class RedditSource(WallpaperSource):
    def __init__(
        self,
        client_id: Optional[str] = None,
        client_secret: Optional[str] = None
    ):
        super().__init__(name="Reddit", priority=6, is_zero_auth=False)
        self.client_id = client_id
        self.client_secret = client_secret
        self.access_token: Optional[str] = None
        self.subreddits = "wallpapers+Animewallpaper+wallpaper+WQHD_Wallpaper"

    def is_available(self) -> bool:
        return bool(self.client_id and self.client_secret)

    def _authenticate(self) -> bool:
        if not self.is_available():
            return False
        auth_url = "https://www.reddit.com/api/v1/access_token"
        headers = {"User-Agent": "Wall-the-Heaven/1.0 (Wallpaper Downloader CLI)"}
        data = {"grant_type": "client_credentials"}
        try:
            resp = requests.post(
                auth_url,
                data=data,
                headers=headers,
                auth=HTTPBasicAuth(self.client_id, self.client_secret),
                timeout=10
            )
            if resp.status_code == 200:
                token_data = resp.json()
                self.access_token = token_data.get("access_token")
                return bool(self.access_token)
            else:
                print(f"  [Reddit] OAuth authentication failed (HTTP {resp.status_code}).")
                return False
        except Exception as e:
            print(f"  [Reddit] Auth error: {e}")
            return False

    def search(
        self,
        query: str,
        limit: int = 30,
        min_width: int = 1920,
        min_height: int = 1080
    ) -> List[WallpaperItem]:
        if not self.is_available():
            return []

        if not self.access_token and not self._authenticate():
            return []

        items: List[WallpaperItem] = []
        headers = {
            "Authorization": f"Bearer {self.access_token}",
            "User-Agent": "Wall-the-Heaven/1.0 (Wallpaper Downloader CLI)"
        }
        url = f"https://oauth.reddit.com/r/{self.subreddits}/search"
        params = {
            "q": query,
            "restrict_sr": 1,
            "sort": "relevance",
            "limit": min(limit * 2, 100)
        }

        try:
            resp = self.session.get(url, headers=headers, params=params, timeout=10)
            if resp.status_code != 200:
                print(f"  [Reddit] Search failed with HTTP {resp.status_code}.")
                return []

            data = resp.json()
            children = data.get("data", {}).get("children", [])
            for child in children:
                post = child.get("data", {})
                img_url = post.get("url_overridden_by_dest") or post.get("url")
                if not img_url:
                    continue

                # Check if it's a direct image link
                is_direct_image = any(
                    img_url.lower().endswith(ext)
                    for ext in [".jpg", ".jpeg", ".png", ".webp"]
                ) or "i.redd.it" in img_url or "i.imgur.com" in img_url

                if not is_direct_image:
                    continue

                pid = str(post.get("id"))
                title = post.get("title", f"Reddit {pid}")

                # Extract preview resolution if present
                w = 1920
                h = 1080
                preview_images = post.get("preview", {}).get("images", [])
                prev_url = None
                if preview_images:
                    source_info = preview_images[0].get("source", {})
                    w = int(source_info.get("width", 1920))
                    h = int(source_info.get("height", 1080))
                    prev_url = source_info.get("url")

                if min_width > 0 and w < min_width:
                    continue
                if min_height > 0 and h < min_height:
                    continue

                items.append(
                    WallpaperItem(
                        id=pid,
                        source="reddit",
                        url=img_url,
                        preview_url=prev_url,
                        width=w,
                        height=h,
                        file_type="jpg",
                        title=title
                    )
                )
                if len(items) >= limit:
                    break

        except requests.RequestException as e:
            print(f"  [Reddit] Connection error: {e}")
        except Exception as e:
            print(f"  [Reddit] Unexpected error: {e}")

        return items
