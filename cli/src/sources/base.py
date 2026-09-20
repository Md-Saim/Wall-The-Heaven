"""
Base class for all wallpaper search providers.
"""
from abc import ABC, abstractmethod
from typing import List, Optional
import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

from ..models import WallpaperItem


DEFAULT_USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/122.0.0.0 Safari/537.36"
)


class WallpaperSource(ABC):
    """Abstract base class for wallpaper sources."""

    def __init__(self, name: str, priority: int = 10, is_zero_auth: bool = False):
        self.name = name
        self.priority = priority
        self.is_zero_auth = is_zero_auth
        self._session: Optional[requests.Session] = None

    @property
    def session(self) -> requests.Session:
        """Create or reuse an optimized requests session with automatic retries."""
        if self._session is None:
            self._session = requests.Session()
            self._session.headers.update({
                "User-Agent": DEFAULT_USER_AGENT,
                "Accept-Language": "en-US,en;q=0.9",
            })
            retries = Retry(
                total=2,
                backoff_factor=0.5,
                status_forcelist=[429, 500, 502, 504],
                raise_on_status=False
            )
            adapter = HTTPAdapter(max_retries=retries, pool_connections=10, pool_maxsize=10)
            self._session.mount("http://", adapter)
            self._session.mount("https://", adapter)
        return self._session

    @abstractmethod
    def is_available(self) -> bool:
        """Check if source is configured or has the required keys/access."""
        pass

    @abstractmethod
    def search(
        self,
        query: str,
        limit: int = 30,
        min_width: int = 1920,
        min_height: int = 1080
    ) -> List[WallpaperItem]:
        """
        Search for wallpapers matching the query.
        Must return a list of WallpaperItem objects.
        Should handle network exceptions gracefully and return an empty list or partial list.
        """
        pass
