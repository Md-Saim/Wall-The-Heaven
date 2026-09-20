"""
Unit and integration tests for Wall-the-Heaven.
"""
import unittest
import shutil
import tempfile
from pathlib import Path

from src.models import WallpaperItem
from src.config import Config
from src.archiver import create_zip_archive
from src.downloader import sanitize_filename_part, format_bytes
from src.sources import build_sources
from src.sources.alphacoders import AlphaCodersSource
from src.sources.wallhaven import WallhavenSource


class TestWallTheHeaven(unittest.TestCase):
    def test_wallpaper_item_properties(self):
        item = WallpaperItem(
            id="12345",
            source="test",
            url="https://example.com/images/wallpaper.png?token=xyz",
            width=2560,
            height=1440,
            file_type="png"
        )
        self.assertEqual(item.resolution_str, "2560x1440")
        self.assertEqual(item.pixel_count, 2560 * 1440)
        self.assertAlmostEqual(item.aspect_ratio, 1.78, places=2)
        self.assertEqual(item.extension, "png")

    def test_config_parse_resolution(self):
        cfg = Config()
        self.assertEqual(cfg.parse_resolution("1920x1080"), (1920, 1080))
        self.assertEqual(cfg.parse_resolution("2560x1440"), (2560, 1440))
        self.assertEqual(cfg.parse_resolution("3840x2160"), (3840, 2160))
        self.assertEqual(cfg.parse_resolution("any"), (0, 0))
        self.assertEqual(cfg.parse_resolution("invalid"), (0, 0))

    def test_sanitize_filename(self):
        self.assertEqual(sanitize_filename_part("Genshin Impact: Zhongli!"), "Genshin_Impact_Zhongli")
        self.assertEqual(sanitize_filename_part("Cyberpunk 2077 / 4K"), "Cyberpunk_2077_4K")

    def test_format_bytes(self):
        self.assertEqual(format_bytes(1024), "1.0 KB")
        self.assertEqual(format_bytes(1024 * 1024 * 3), "3.0 MB")

    def test_sources_instantiation(self):
        cfg = Config()
        sources = build_sources(cfg)
        self.assertTrue(any(isinstance(s, AlphaCodersSource) for s in sources))
        self.assertTrue(any(isinstance(s, WallhavenSource) for s in sources))

    def test_archiver(self):
        tmp_dir = Path(tempfile.mkdtemp())
        try:
            sample_folder = tmp_dir / "sample_wallpapers"
            sample_folder.mkdir()
            (sample_folder / "img1.jpg").write_bytes(b"sample_data_1")
            (sample_folder / "img2.jpg").write_bytes(b"sample_data_2")

            zip_res = create_zip_archive(sample_folder)
            self.assertTrue(zip_res.exists())
            self.assertTrue(zip_res.stat().st_size > 0)
        finally:
            shutil.rmtree(tmp_dir, ignore_errors=True)


if __name__ == "__main__":
    unittest.main()
