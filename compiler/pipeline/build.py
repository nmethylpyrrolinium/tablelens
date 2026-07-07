from pathlib import Path
import json, shutil
from compiler.core.io import ROOT_FILES, assert_inside
from compiler.core.cache import BuildCache
from compiler.pipeline.validation import validate_all
from compiler.pipeline.images import optimize_images
from compiler.pipeline.qr import generate_qr

def menu_js(cfg, menu) -> str:
    restaurant = cfg.restaurant.model_dump()
    restaurant["currency"] = cfg.restaurant.currencySymbol
    dishes = [dish.model_dump() for dish in menu.dishes]
    return "const RESTAURANT = " + json.dumps(restaurant, indent=2) + ";\n\nconst MENU = " + json.dumps(dishes, indent=2) + ";\n"

def copy_tree(src: Path, dst: Path):
    if src.exists():
        shutil.copytree(src, dst, dirs_exist_ok=True)

def build_site(root: Path, cfg, menu) -> dict:
    validate_all(root, cfg, menu)
    out = assert_inside(root, root / cfg.output)
    out.mkdir(parents=True, exist_ok=True)
    cache = BuildCache(root)
    images = optimize_images(root, cfg, cache)
    for file in ROOT_FILES:
        src = root / file
        if src.exists(): shutil.copy2(src, out / file)
    copy_tree(root / "engine", out / "engine")
    copy_tree(root / cfg.assets.models, out / "assets/models")
    generated = root / cfg.assets.generated
    generated.mkdir(parents=True, exist_ok=True)
    js = menu_js(cfg, menu)
    (generated / "menu-data.js").write_text(js, encoding="utf-8")
    (out / "menu-data.js").write_text(js, encoding="utf-8")
    qrs = generate_qr(root, cfg, menu)
    cache.save()
    return {"images": images, "qr": qrs, "output": str(out)}

def clean(root: Path, cfg):
    for path in [root / cfg.output, root / ".tablelens-cache"]:
        resolved = assert_inside(root, path)
        if resolved.exists(): shutil.rmtree(resolved)
