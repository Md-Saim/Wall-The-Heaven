#!/usr/bin/env python3
"""
Wall-the-Heaven - Multi-Source Wallpaper Downloader
===================================================
A high-performance command-line tool to search and download high-resolution
wallpapers from multiple sources into a clean folder and ready-to-share ZIP.
"""
import sys
import os
import argparse
import time
from pathlib import Path
from typing import List, Optional

# Enable color formatting on Windows if available
try:
    import colorama
    colorama.init()
except ImportError:
    pass

from src.models import WallpaperItem
from src.config import Config
from src.sources import build_sources, search_all_sources, ALL_SOURCE_CLASSES
from src.downloader import WallpaperDownloader, sanitize_filename_part, format_bytes
from src.archiver import create_zip_archive

BANNER = r"""
 __      __      .__  .__         __  .__            ___ ___                                  
/  \    /  \____ |  | |  |       /  |_|  |__   ____ /   |   \   _________ ___  __ ____   ____  
\   \/\/   /\__  \|  | |  |      \   __\  |  \_/ __ \_   ___  /  \_  __ \__  \ \  \/ // __ \ /    \ 
 \        /  / __ \|  |_|  |__     |  | |   Y  \  ___/|   |  \ \   |  | \// __ \ \   /\  ___/|   |  \
  \__/\  /  (____  /____/____/____ |__| |___|  /\___  >___|  /  \__|  |  (____  / \_/  \___  >___|  /
       \/        \/         /_____/          \/     \/     \/                  \/           \/     \/ 
                 ~ Multi-Source High-Res Wallpaper Downloader v1.0 ~
"""

COLOR_CYAN = "\033[96m"
COLOR_GREEN = "\033[92m"
COLOR_YELLOW = "\033[93m"
COLOR_RED = "\033[91m"
COLOR_BOLD = "\033[1m"
COLOR_RESET = "\033[0m"


def print_banner():
    print(f"{COLOR_CYAN}{BANNER}{COLOR_RESET}")


def interactive_prompt(config: Config) -> dict:
    """Prompt user interactively for search criteria."""
    print(f"{COLOR_BOLD}=== Interactive Download Wizard ==={COLOR_RESET}\n")

    # 1. Query
    query = ""
    while not query.strip():
        try:
            query = input(f"{COLOR_YELLOW}Enter search query{COLOR_RESET} (e.g. 'Genshin Impact Zhongli', 'Cyberpunk', 'Naruto'): ").strip()
        except (KeyboardInterrupt, EOFError):
            print("\nExiting.")
            sys.exit(0)

    # 2. Count
    print(f"\n{COLOR_YELLOW}Choose how many wallpapers to download:{COLOR_RESET}")
    print("  [1] 20 wallpapers")
    print("  [2] 30 wallpapers (Recommended)")
    print("  [3] 50 wallpapers")
    print("  [4] 100 wallpapers")
    print("  [5] Custom number")
    count_choice = input("Select [1-5] (default: 2): ").strip()
    count_map = {"1": 20, "2": 30, "3": 50, "4": 100}
    if count_choice in count_map:
        count = count_map[count_choice]
    elif count_choice == "5":
        try:
            custom_input = input("Enter custom count (1-500): ").strip()
            count = max(1, min(500, int(custom_input)))
        except ValueError:
            count = 30
    else:
        count = 30

    # 3. Minimum Resolution
    print(f"\n{COLOR_YELLOW}Choose minimum resolution:{COLOR_RESET}")
    print("  [1] 1080p FHD (1920x1080) [Recommended]")
    print("  [2] 1440p 2K (2560x1440)")
    print("  [3] 4K UHD (3840x2160)")
    print("  [4] Any resolution")
    res_choice = input("Select [1-4] (default: 1): ").strip()
    res_map = {
        "1": "1920x1080",
        "2": "2560x1440",
        "3": "3840x2160",
        "4": "any"
    }
    min_res = res_map.get(res_choice, "1920x1080")

    # 4. Save ZIP only?
    zip_choice = input(f"\nKeep folder or save ZIP only? [K]eep folder + ZIP (default), [Z]IP only: ").strip().lower()
    zip_only = zip_choice.startswith("z")

    return {
        "query": query,
        "count": count,
        "min_res": min_res,
        "zip_only": zip_only,
        "sources": None
    }


def parse_arguments() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        prog="wall_the_heaven",
        description="Wall-the-Heaven: Multi-source high-resolution wallpaper downloader and packager."
    )
    parser.add_argument(
        "query",
        nargs="?",
        default=None,
        help="Search query for wallpapers (e.g. 'Cyberpunk 2077', 'Zhongli')"
    )
    parser.add_argument(
        "-c", "--count",
        type=int,
        default=None,
        help="Number of wallpapers to download (e.g. 20, 30, 50, 100)"
    )
    parser.add_argument(
        "--min-res",
        default=None,
        help="Minimum resolution (e.g. 1920x1080, 2560x1440, 3840x2160, or 'any')"
    )
    parser.add_argument(
        "-s", "--sources",
        default=None,
        help="Comma-separated list of sources to search (alphacoders, wallhaven, pexels, pixabay, unsplash, reddit)"
    )
    parser.add_argument(
        "-o", "--out-dir",
        default=None,
        help="Custom base output directory (default: ./wallpapers)"
    )
    parser.add_argument(
        "--zip-only",
        action="store_true",
        help="Delete downloaded folder after creating ZIP archive"
    )
    parser.add_argument(
        "-i", "--interactive",
        action="store_true",
        help="Force interactive wizard mode"
    )
    parser.add_argument(
        "--threads",
        type=int,
        default=8,
        help="Number of parallel download threads (default: 8)"
    )
    parser.add_argument(
        "--config",
        default=None,
        help="Path to custom config.json"
    )
    # API key overrides
    parser.add_argument("--wallhaven-key", default=None, help="Wallhaven API key")
    parser.add_argument("--pexels-key", default=None, help="Pexels API key")
    parser.add_argument("--pixabay-key", default=None, help="Pixabay API key")
    parser.add_argument("--unsplash-key", default=None, help="Unsplash Access Key")

    return parser.parse_args()


def main():
    print_banner()

    args = parse_arguments()
    config = Config(args.config)

    # CLI API key overrides
    if args.wallhaven_key:
        config.wallhaven_api_key = args.wallhaven_key
    if args.pexels_key:
        config.pexels_api_key = args.pexels_key
    if args.pixabay_key:
        config.pixabay_api_key = args.pixabay_key
    if args.unsplash_key:
        config.unsplash_access_key = args.unsplash_key

    # Decide if interactive mode is needed
    if args.interactive or args.query is None:
        params = interactive_prompt(config)
        query = params["query"]
        target_count = params["count"]
        min_res_str = params["min_res"]
        zip_only = params["zip_only"]
        sources_list = None
    else:
        query = args.query
        target_count = args.count if args.count is not None else config.default_count
        min_res_str = args.min_res if args.min_res is not None else config.default_min_res
        zip_only = args.zip_only or config.save_zip_only
        sources_list = [s.strip() for s in args.sources.split(",")] if args.sources else None

    min_w, min_h = config.parse_resolution(min_res_str)

    print(f"\n{COLOR_BOLD}--- Search Configuration ---{COLOR_RESET}")
    print(f"  Query:              {COLOR_CYAN}{query}{COLOR_RESET}")
    print(f"  Target Count:       {COLOR_CYAN}{target_count}{COLOR_RESET}")
    print(f"  Min Resolution:     {COLOR_CYAN}{min_w}x{min_h}{COLOR_RESET}" if min_w > 0 else f"  Min Resolution:     {COLOR_CYAN}Any{COLOR_RESET}")
    print(f"  Archive Only:       {COLOR_CYAN}{'Yes' if zip_only else 'No (Keep Folder + ZIP)'}{COLOR_RESET}")

    # Build and configure sources
    sources = build_sources(config, sources_list)
    if not sources:
        print(f"\n{COLOR_RED}[Error] No wallpaper sources are enabled or available.{COLOR_RESET}")
        sys.exit(1)

    print(f"  Active Sources:     {COLOR_GREEN}{', '.join(s.name for s in sources)}{COLOR_RESET}")
    print("----------------------------\n")

    # Search phase
    print(f"Searching across {len(sources)} sources in parallel...")
    start_time = time.time()
    candidates = search_all_sources(
        sources=sources,
        query=query,
        target_count=target_count,
        min_width=min_w,
        min_height=min_h
    )

    if not candidates:
        print(f"\n{COLOR_YELLOW}[!] No wallpapers found matching '{query}'. Try broader keywords or lower resolution.{COLOR_RESET}")
        sys.exit(0)

    print(f"\n{COLOR_GREEN}[+] Found {len(candidates)} unique high-quality wallpapers.{COLOR_RESET}")
    download_count = min(len(candidates), target_count)
    selected_items = candidates[:download_count]

    # Setup directories
    clean_query = sanitize_filename_part(query)
    base_out_dir = Path(args.out_dir or config.default_output_dir).resolve()
    target_folder_name = f"wallpapers_{clean_query}_{download_count}"
    output_dir = base_out_dir / target_folder_name

    # Download phase
    threads = args.threads or config.max_download_workers
    downloader = WallpaperDownloader(max_workers=threads)
    stats = downloader.download_batch(
        items=selected_items,
        query=query,
        output_dir=output_dir
    )

    # Packaging phase
    zip_path = base_out_dir / f"{target_folder_name}.zip"
    print(f"\nPackaging wallpapers into ZIP: {zip_path.name}...")
    try:
        final_zip = create_zip_archive(output_dir, zip_path, delete_folder_after=zip_only)
        zip_size_str = format_bytes(final_zip.stat().st_size)
    except Exception as e:
        print(f"{COLOR_RED}[!] Error creating ZIP: {e}{COLOR_RESET}")
        final_zip = None
        zip_size_str = "0 B"

    total_time = round(time.time() - start_time, 1)

    # Final summary display
    print(f"\n{COLOR_BOLD}==================== DOWNLOAD SUMMARY ===================={COLOR_RESET}")
    print(f"  Status:             {COLOR_GREEN}Success{COLOR_RESET}")
    print(f"  Wallpapers Saved:   {COLOR_BOLD}{stats['total_downloaded']} / {target_count}{COLOR_RESET}")
    print(f"  Total Downloaded:   {COLOR_CYAN}{stats['total_bytes_str']}{COLOR_RESET}")
    print(f"  Elapsed Time:       {COLOR_CYAN}{total_time}s{COLOR_RESET}")
    
    print(f"\n  {COLOR_BOLD}Source Breakdown:{COLOR_RESET}")
    for src_name, count in stats.get("by_source", {}).items():
        print(f"   * {src_name:15s}: {count:3d} image(s)")

    if not zip_only and output_dir.exists():
        print(f"\n  {COLOR_BOLD}Saved Folder:{COLOR_RESET}       {COLOR_CYAN}{output_dir}{COLOR_RESET}")
    if final_zip and final_zip.exists():
        print(f"  {COLOR_BOLD}Saved ZIP Archive:{COLOR_RESET}  {COLOR_GREEN}{final_zip}{COLOR_RESET} ({zip_size_str})")
    print(f"{COLOR_BOLD}=========================================================={COLOR_RESET}\n")


if __name__ == "__main__":
    main()
