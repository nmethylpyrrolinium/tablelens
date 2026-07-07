from pathlib import Path
from PIL import Image
from compiler.core.cache import BuildCache

def optimize_images(root: Path, cfg, cache: BuildCache) -> list[str]:
    out = root / cfg.output / "assets/images"
    thumbs = root / cfg.output / "assets/thumbnails"
    out.mkdir(parents=True, exist_ok=True); thumbs.mkdir(parents=True, exist_ok=True)
    processed=[]
    for path in (root / cfg.assets.images).glob("*.*"):
        if path.suffix.lower() not in {".jpg", ".jpeg", ".png", ".webp"}: continue
        dest = out / path.name
        thumb = thumbs / path.name
        if not cache.changed(path) and dest.exists() and thumb.exists():
            continue
        try:
            with Image.open(path) as img:
                img.thumbnail((cfg.compression.maxImageWidth, cfg.compression.maxImageWidth))
                img.save(dest, quality=cfg.compression.imageQuality, optimize=True)
                img.thumbnail((cfg.compression.thumbnailWidth, cfg.compression.thumbnailWidth))
                img.save(thumb, quality=cfg.compression.imageQuality, optimize=True)
            processed.append(str(path))
        except Exception as exc:
            processed.append(f"SKIP {path}: {exc}")
    return processed
