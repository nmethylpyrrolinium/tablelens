from pathlib import Path
import json, yaml
from compiler.schemas.config import TableLensConfig
from compiler.schemas.menu import MenuSchema

ROOT_FILES = ["index.html", "menu.html", "dish.html", "style.css", "script.js", "app.js", "manifest.json"]

def safe_yaml(path: Path):
    with path.open("r", encoding="utf-8") as handle:
        return yaml.safe_load(handle) or {}

def load_config(root: Path) -> TableLensConfig:
    return TableLensConfig.model_validate(safe_yaml(root / "tablelens.config.yaml"))

def load_menu(root: Path) -> MenuSchema:
    yaml_path, json_path = root / "menu.yaml", root / "menu.json"
    if yaml_path.exists():
        data = safe_yaml(yaml_path)
    elif json_path.exists():
        data = json.loads(json_path.read_text(encoding="utf-8"))
    else:
        raise FileNotFoundError("Create menu.yaml or menu.json, then run tablelens validate")
    return MenuSchema.model_validate(data)

def assert_inside(root: Path, target: Path) -> Path:
    resolved = target.resolve()
    if root.resolve() not in [resolved, *resolved.parents]:
        raise ValueError(f"Refusing to write outside project: {target}")
    return resolved
