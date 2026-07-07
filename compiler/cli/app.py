from pathlib import Path
import typer
from compiler.core.io import load_config, load_menu
from compiler.core import reporter as r
from compiler.pipeline.validation import validate_all, ValidationIssue
from compiler.pipeline.build import build_site, clean as clean_build
from compiler.pipeline.images import optimize_images
from compiler.pipeline.models import validate_models
from compiler.pipeline.qr import generate_qr
from compiler.core.cache import BuildCache

app = typer.Typer(help="TableLens static-site compiler and asset pipeline.", no_args_is_help=True)
VERSION = "0.1.0"

def root() -> Path:
    return Path.cwd()

def ctx():
    project = root()
    return project, load_config(project), load_menu(project)

def user_error(exc: Exception):
    r.error(str(exc)); raise typer.Exit(1)

@app.command()
def init():
    """Create starter config and menu files if they do not exist."""
    created=[]
    for name in ["tablelens.config.yaml", "menu.yaml"]:
        path=root()/name
        if not path.exists(): path.write_text("# TableLens starter file\n", encoding="utf-8"); created.append(name)
    r.ok("Project initialized" if created else "Project already initialized")

@app.command()
def validate():
    """Validate config, menu schemas, links, prices, colors, and assets."""
    try:
        project, cfg, menu = ctx(); rows = validate_all(project, cfg, menu)
        r.report_table("Validation report", rows); r.ok("Menu validated")
    except Exception as exc: user_error(exc)

@app.command()
def build():
    """Run discover, validate, optimize, generate, compile, copy, emit."""
    try:
        project, cfg, menu = ctx(); r.title("TableLens build")
        result = build_site(project, cfg, menu)
        r.ok(f"Images optimized: {len(result['images'])}"); r.ok(f"QR codes generated: {len(result['qr'])}"); r.ok(f"Build completed: {result['output']}")
    except Exception as exc: user_error(exc)

@app.command()
def clean():
    """Remove build output and cache safely."""
    try: project=root(); cfg=load_config(project); clean_build(project, cfg); r.ok("Clean completed")
    except Exception as exc: user_error(exc)

@app.command()
def doctor():
    """Check local project health and required source files."""
    rows=[]
    for f in ["tablelens.config.yaml","menu.yaml","index.html","menu.html","dish.html"]:
        rows.append((f, "PASS" if (root()/f).exists() else "FAIL", str(root()/f)))
    r.report_table("Doctor", rows)

@app.command()
def audit():
    """Run validation and model audit reports."""
    try:
        project, cfg, menu = ctx(); r.report_table("Validation", validate_all(project,cfg,menu)); r.report_table("Models", validate_models(project,cfg,menu))
    except Exception as exc: user_error(exc)

@app.command("optimize-images")
def optimize_images_cmd():
    """Resize, compress, and thumbnail source images."""
    try: project,cfg,_=ctx(); done=optimize_images(project,cfg,BuildCache(project)); r.ok(f"Images processed: {len(done)}")
    except Exception as exc: user_error(exc)

@app.command("validate-models")
def validate_models_cmd():
    """Validate GLB/USDZ references, naming, duplicates, and existence."""
    try: project,cfg,menu=ctx(); r.report_table("Model report", validate_models(project,cfg,menu))
    except Exception as exc: user_error(exc)

@app.command("generate-qr")
def generate_qr_cmd():
    """Generate PNG and SVG QR codes for configured targets."""
    try: project,cfg,menu=ctx(); made=generate_qr(project,cfg,menu); r.ok(f"QR generated: {', '.join(made)}")
    except Exception as exc: user_error(exc)

@app.command()
def manifest():
    """Print generated file manifest."""
    _,cfg,_=ctx(); r.ok(f"Output: {cfg.output}; generated menu: {cfg.assets.generated}/menu-data.js")

@app.command()
def stats():
    """Print menu and asset statistics."""
    _,cfg,menu=ctx(); r.ok(f"Dishes: {len(menu.dishes)}; categories: {len(menu.categories)}; output: {cfg.output}")

@app.command()
def version():
    """Print the TableLens compiler version."""
    typer.echo(VERSION)
