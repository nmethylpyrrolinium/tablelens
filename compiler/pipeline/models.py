from pathlib import Path

def validate_models(root: Path, cfg, menu) -> list[tuple[str,str,str]]:
    seen=set(); rows=[]
    for dish in menu.dishes:
        for ref, ext in [(dish.modelGlb, ".glb"), (dish.modelUsdz, ".usdz")]:
            path = root / ref.replace("./", "", 1)
            if ref in seen: rows.append(("duplicate", "WARN", ref))
            seen.add(ref)
            if path.suffix.lower() != ext: rows.append(("naming", "FAIL", f"{ref} should end with {ext}"))
            elif path.exists(): rows.append(("model", "PASS", ref))
            else: rows.append(("model", "WARN", f"missing {ref}"))
    return rows
