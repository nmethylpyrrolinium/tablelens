from pathlib import Path
import qrcode
import qrcode.image.svg

def generate_qr(root: Path, cfg, menu) -> list[str]:
    out = root / cfg.output / "assets/qr"; out.mkdir(parents=True, exist_ok=True)
    targets = {"home":"index.html", "menu":"menu.html"}
    if "dishes" in cfg.qr.targets:
        targets.update({f"dish-{d.id}": f"dish.html?id={d.id}" for d in menu.dishes})
    made=[]
    for name, path in targets.items():
        url = cfg.qr.baseUrl.rstrip("/") + "/" + path
        img = qrcode.make(url); img.save(out / f"{name}.png")
        svg = qrcode.make(url, image_factory=qrcode.image.svg.SvgImage); svg.save(out / f"{name}.svg")
        made.append(name)
    return made
