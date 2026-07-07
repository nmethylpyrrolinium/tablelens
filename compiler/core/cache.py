from pathlib import Path
import hashlib, json

class BuildCache:
    def __init__(self, root: Path):
        self.path = root / ".tablelens-cache" / "hashes.json"
        self.data = json.loads(self.path.read_text()) if self.path.exists() else {}
    def hash_file(self, path: Path) -> str:
        h = hashlib.sha256(); h.update(path.read_bytes()); return h.hexdigest()
    def changed(self, path: Path) -> bool:
        if not path.exists(): return False
        digest = self.hash_file(path)
        key = str(path)
        changed = self.data.get(key) != digest
        self.data[key] = digest
        return changed
    def save(self):
        self.path.parent.mkdir(parents=True, exist_ok=True)
        self.path.write_text(json.dumps(self.data, indent=2), encoding="utf-8")
