"""
ZIP archive packaging and folder management for Wall-the-Heaven.
"""
import shutil
import zipfile
from pathlib import Path
from typing import Optional


def create_zip_archive(
    folder_path: Path,
    zip_path: Optional[Path] = None,
    delete_folder_after: bool = False
) -> Path:
    """
    Compress the contents of folder_path into a .zip archive.
    Optionally deletes the original folder after successful zipping.
    """
    folder = Path(folder_path).resolve()
    if not folder.exists() or not folder.is_dir():
        raise FileNotFoundError(f"Folder not found: {folder}")

    if zip_path is None:
        target_zip = folder.parent / f"{folder.name}.zip"
    else:
        target_zip = Path(zip_path).resolve()
        if not target_zip.name.endswith(".zip"):
            target_zip = target_zip.with_suffix(".zip")

    target_zip.parent.mkdir(parents=True, exist_ok=True)

    with zipfile.ZipFile(target_zip, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=6) as zf:
        for file in folder.rglob("*"):
            if file.is_file() and not file.name.endswith(".tmp"):
                arcname = file.relative_to(folder)
                zf.write(file, arcname=arcname)

    if delete_folder_after and target_zip.exists():
        shutil.rmtree(folder, ignore_errors=True)

    return target_zip
