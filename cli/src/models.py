"""
Data models for Wall-the-Heaven Wallpaper Downloader.
"""
from dataclasses import dataclass
from typing import Optional


@dataclass
class WallpaperItem:
    """Represents a discovered wallpaper candidate ready for download."""
    id: str
    source: str
    url: str
    width: int = 0
    height: int = 0
    preview_url: Optional[str] = None
    file_type: str = "jpg"
    title: Optional[str] = None
    file_size: Optional[int] = None

    @property
    def resolution_str(self) -> str:
        """Human-readable resolution string like 1920x1080."""
        if self.width > 0 and self.height > 0:
            return f"{self.width}x{self.height}"
        return "Unknown"

    @property
    def pixel_count(self) -> int:
        """Total pixels for quality comparison."""
        return self.width * self.height

    @property
    def aspect_ratio(self) -> float:
        """Aspect ratio as float (width / height)."""
        if self.height > 0:
            return round(self.width / self.height, 2)
        return 0.0

    @property
    def extension(self) -> str:
        """Determine file extension cleanly from URL or file_type."""
        clean_ext = self.file_type.lower().replace(".", "")
        if clean_ext in ["jpeg", "jpg"]:
            return "jpg"
        if clean_ext in ["png", "webp", "bmp"]:
            return clean_ext
        
        # Fallback to URL path inspection
        path = self.url.split("?")[0]
        if "." in path:
            ext = path.split(".")[-1].lower()
            if ext in ["jpg", "jpeg", "png", "webp"]:
                return "jpg" if ext == "jpeg" else ext
        return "jpg"
