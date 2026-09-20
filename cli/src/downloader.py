"""
Multi-threaded download manager with streaming, progress updates,
automatic deduplication via content hashing, and clean file naming.
"""
import os
import re
import hashlib
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from typing import List, Dict, Tuple, Optional
import requests

from .models import WallpaperItem


def sanitize_filename_part(text: str) -> str:
    """Sanitize query or string to be safe for filenames."""
    # Replace non-alphanumeric chars with underscore
    clean = re.sub(r'[^a-zA-Z0-9_\-]', '_', text.strip())
    clean = re.sub(r'_+', '_', clean).strip('_')
    return clean or "wallpaper"


def format_bytes(size: int) -> str:
    """Convert bytes to human readable format."""
    for unit in ['B', 'KB', 'MB', 'GB']:
        if size < 1024.0:
            return f"{size:.1f} {unit}"
        size /= 1024.0
    return f"{size:.1f} TB"


class WallpaperDownloader:
    def __init__(self, max_workers: int = 8, timeout: int = 25):
        self.max_workers = max_workers
        self.timeout = timeout
        self.seen_hashes = set()
        self.session = requests.Session()
        self.session.headers.update({
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/122.0.0.0 Safari/537.36"
            )
        })

    def download_single(
        self,
        item: WallpaperItem,
        dest_path: Path,
        index: int,
        total: int,
        progress_callback=None
    ) -> Optional[Tuple[WallpaperItem, Path, int]]:
        """
        Download a single wallpaper with streaming, compute hash, and save.
        Returns (item, path, byte_count) on success, or None on error/duplicate.
        """
        headers = {}
        if item.source == "alphacoders":
            headers["Referer"] = "https://wall.alphacoders.com/"

        # Generate candidate URLs with fallback extensions for stubborn providers
        candidate_urls = [item.url]
        lower_url = item.url.lower()
        if lower_url.endswith(".webp"):
            candidate_urls.extend([
                item.url[:-5] + ".png",
                item.url[:-5] + ".jpg",
                item.url[:-5] + ".jpeg"
            ])
        elif lower_url.endswith(".jpg"):
            candidate_urls.append(item.url[:-4] + ".png")
        if item.preview_url and item.preview_url not in candidate_urls:
            candidate_urls.append(item.preview_url)

        last_error = None
        for try_url in candidate_urls:
            try:
                resp = self.session.get(try_url, headers=headers, stream=True, timeout=self.timeout)
                if resp.status_code != 200:
                    last_error = f"HTTP {resp.status_code}"
                    resp.close()
                    continue

                # Adjust dest extension to match actual downloaded URL if changed
                if try_url != item.url:
                    new_ext = try_url.split("?")[0].split(".")[-1]
                    if new_ext in ["jpg", "jpeg", "png", "webp"]:
                        dest_path = dest_path.with_suffix("." + ("jpg" if new_ext == "jpeg" else new_ext))

                hasher = hashlib.md5()
                bytes_written = 0
                temp_path = dest_path.with_suffix(".tmp")

                with open(temp_path, "wb") as f:
                    for chunk in resp.iter_content(chunk_size=65536):
                        if chunk:
                            f.write(chunk)
                            hasher.update(chunk)
                            bytes_written += len(chunk)

                # Deduplicate by content hash
                content_hash = hasher.hexdigest()
                if content_hash in self.seen_hashes:
                    if temp_path.exists():
                        temp_path.unlink()
                    if progress_callback:
                        progress_callback(item, dest_path, bytes_written, False, "Duplicate image content")
                    return None

                self.seen_hashes.add(content_hash)
                temp_path.replace(dest_path)

                if progress_callback:
                    progress_callback(item, dest_path, bytes_written, True, None)

                return (item, dest_path, bytes_written)

            except Exception as e:
                last_error = str(e)
                temp_path = dest_path.with_suffix(".tmp")
                if temp_path.exists():
                    try:
                        temp_path.unlink()
                    except Exception:
                        pass
                continue

        if progress_callback:
            progress_callback(item, dest_path, 0, False, last_error or "All candidate URLs failed")
        return None

    def download_batch(
        self,
        items: List[WallpaperItem],
        query: str,
        output_dir: Path
    ) -> Dict:
        """
        Download a list of WallpaperItem candidates into output_dir.
        """
        output_dir.mkdir(parents=True, exist_ok=True)
        clean_query = sanitize_filename_part(query)

        successful_downloads: List[Tuple[WallpaperItem, Path, int]] = []
        source_counts: Dict[str, int] = {}
        total_bytes = 0
        total_targets = len(items)

        completed_count = 0

        def on_progress(item: WallpaperItem, dest: Path, size: int, success: bool, error: Optional[str]):
            nonlocal completed_count
            completed_count += 1
            percent = int((completed_count / total_targets) * 100) if total_targets > 0 else 100
            status_tag = "OK" if success else "FAIL"
            size_str = format_bytes(size) if size > 0 else ""
            err_msg = f" ({error})" if error else ""
            res_str = f" [{item.resolution_str}]" if item.resolution_str != "Unknown" else ""

            color_start = "\033[92m" if success else "\033[91m"
            color_end = "\033[0m"

            print(
                f"  [{completed_count:02d}/{total_targets:02d}] ({percent:3d}%) "
                f"{color_start}{status_tag}{color_end} {dest.name} {res_str} {size_str}{err_msg}"
            )

        print(f"\nStarting parallel download with {self.max_workers} threads...")

        tasks = []
        with ThreadPoolExecutor(max_workers=self.max_workers) as executor:
            for idx, item in enumerate(items, start=1):
                clean_id = sanitize_filename_part(item.id)
                ext = item.extension
                filename = f"{clean_query}_{idx:03d}_{item.source}_{clean_id}.{ext}"
                dest_path = output_dir / filename

                future = executor.submit(
                    self.download_single,
                    item,
                    dest_path,
                    idx,
                    total_targets,
                    on_progress
                )
                tasks.append(future)

            for future in as_completed(tasks):
                result = future.result()
                if result:
                    item, path, size = result
                    successful_downloads.append(result)
                    source_counts[item.source] = source_counts.get(item.source, 0) + 1
                    total_bytes += size

        return {
            "total_requested": total_targets,
            "total_downloaded": len(successful_downloads),
            "by_source": source_counts,
            "total_bytes": total_bytes,
            "total_bytes_str": format_bytes(total_bytes),
            "output_dir": output_dir,
            "items": successful_downloads
        }
