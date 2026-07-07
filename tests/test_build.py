from pathlib import Path
import shutil
from typer.testing import CliRunner
from compiler.cli.app import app


def copy_project(tmp_path: Path):
    root = Path.cwd()
    for name in ["index.html","menu.html","dish.html","style.css","script.js","app.js","manifest.json","tablelens.config.yaml","menu.yaml"]:
        shutil.copy2(root/name, tmp_path/name)
    shutil.copytree(root/"engine", tmp_path/"engine")
    (tmp_path/"assets/images").mkdir(parents=True)
    (tmp_path/"assets/models").mkdir(parents=True)
    (tmp_path/"assets/qr").mkdir(parents=True)


def test_cli_build_generates_menu_data(tmp_path, monkeypatch):
    copy_project(tmp_path)
    monkeypatch.chdir(tmp_path)
    result = CliRunner().invoke(app, ["build"])
    assert result.exit_code == 0, result.output
    assert (tmp_path/"dist/menu-data.js").exists()
    assert (tmp_path/"generated/menu-data.js").exists()
