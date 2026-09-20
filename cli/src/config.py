"""
Configuration manager for Wall-the-Heaven.
Loads settings and API keys from config.json, environment variables, or CLI arguments.
"""
import os
import json
from pathlib import Path
from typing import Dict, Any, Optional


CONFIG_FILE_NAME = "config.json"


class Config:
    def __init__(self, config_path: Optional[str] = None):
        self.wallhaven_api_key: Optional[str] = None
        self.pexels_api_key: Optional[str] = None
        self.pixabay_api_key: Optional[str] = None
        self.unsplash_access_key: Optional[str] = None
        self.reddit_client_id: Optional[str] = None
        self.reddit_client_secret: Optional[str] = None
        
        # Download defaults
        self.default_count: int = 30
        self.default_min_res: str = "1920x1080"
        self.max_download_workers: int = 8
        self.default_output_dir: str = "./wallpapers"
        self.save_zip_only: bool = False
        
        # Load from file & environment
        self._load(config_path)

    def _load(self, custom_path: Optional[str] = None):
        # 1. Look for config.json in custom path, current working directory, or project root
        candidate_paths = []
        if custom_path:
            candidate_paths.append(Path(custom_path))
        candidate_paths.append(Path.cwd() / CONFIG_FILE_NAME)
        candidate_paths.append(Path(__file__).resolve().parent.parent / CONFIG_FILE_NAME)

        file_data: Dict[str, Any] = {}
        for p in candidate_paths:
            if p.exists() and p.is_file():
                try:
                    with open(p, "r", encoding="utf-8") as f:
                        file_data = json.load(f)
                    break
                except Exception:
                    pass

        # 2. Populate values, prioritizing Environment Variables over config.json
        self.wallhaven_api_key = (
            os.getenv("WALLHAVEN_API_KEY") or file_data.get("wallhaven_api_key")
        )
        self.pexels_api_key = (
            os.getenv("PEXELS_API_KEY") or file_data.get("pexels_api_key")
        )
        self.pixabay_api_key = (
            os.getenv("PIXABAY_API_KEY") or file_data.get("pixabay_api_key")
        )
        self.unsplash_access_key = (
            os.getenv("UNSPLASH_ACCESS_KEY") or file_data.get("unsplash_access_key")
        )
        self.reddit_client_id = (
            os.getenv("REDDIT_CLIENT_ID") or file_data.get("reddit_client_id")
        )
        self.reddit_client_secret = (
            os.getenv("REDDIT_CLIENT_SECRET") or file_data.get("reddit_client_secret")
        )

        if "default_count" in file_data:
            self.default_count = int(file_data["default_count"])
        if "default_min_res" in file_data:
            self.default_min_res = str(file_data["default_min_res"])
        if "max_download_workers" in file_data:
            self.max_download_workers = int(file_data["max_download_workers"])
        if "save_zip_only" in file_data:
            self.save_zip_only = bool(file_data["save_zip_only"])

    def parse_resolution(self, res_str: Optional[str]) -> tuple[int, int]:
        """Convert '1920x1080' or '2560x1440' to (width, height). Returns (0, 0) if invalid or 'any'."""
        if not res_str or res_str.lower() in ["any", "0", "all", "none"]:
            return (0, 0)
        try:
            parts = res_str.lower().split("x")
            if len(parts) == 2:
                return (int(parts[0].strip()), int(parts[1].strip()))
        except Exception:
            pass
        return (0, 0)
