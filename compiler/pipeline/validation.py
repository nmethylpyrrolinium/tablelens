from pathlib import Path
from urllib.parse import urlparse
from compiler.schemas.config import TableLensConfig
from compiler.schemas.menu import MenuSchema

class ValidationIssue(Exception): pass

def _local(root: Path, ref: str) -> Path | None:
    if urlparse(ref).scheme: return None
    return root / ref.replace("./", "", 1)

def validate_assets(root: Path, cfg: TableLensConfig, menu: MenuSchema) -> list[tuple[str,str,str]]:
    rows=[]; errors=[]
    for dish in menu.dishes:
        for label, ref, limit, required in [
            ("image", dish.image, cfg.validation.maxImageBytes, True),
            ("GLB", dish.modelGlb, cfg.validation.maxModelBytes, cfg.ar.requireGlb),
            ("USDZ", dish.modelUsdz, cfg.validation.maxModelBytes, cfg.ar.requireUsdz),
        ]:
            path = _local(root, ref)
            if not path: continue
            if not path.exists():
                status = "WARN" if not cfg.validation.strictAssets else "FAIL"
                msg = f"{dish.id}: missing {label} at {ref}"
                rows.append((label, status, msg))
                if required and cfg.validation.strictAssets: errors.append(msg)
            elif path.stat().st_size > limit:
                msg = f"{dish.id}: {ref} exceeds {limit} bytes"
                rows.append((label, "FAIL", msg)); errors.append(msg)
            else:
                rows.append((label, "PASS", f"{dish.id}: {ref}"))
    if errors: raise ValidationIssue("; ".join(errors))
    return rows

def validate_all(root: Path, cfg: TableLensConfig, menu: MenuSchema):
    return validate_assets(root, cfg, menu)
