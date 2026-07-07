# TableLens Compiler Architecture

```text
Structured sources (tablelens.config.yaml, menu.yaml/json)
        |
        v
compiler/cli -> compiler/pipeline stages -> generated/ + dist/
        |              |
        |              +-- validation, images, models, QR, build cache
        +-- Rich reporting and Typer commands
```

The plugin surface is intentionally small: `PluginManager.emit(stage, context)` lets future integrations observe build stages without executing arbitrary project files.
