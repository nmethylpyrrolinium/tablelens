from dataclasses import dataclass, field
from typing import Protocol, Any

class Plugin(Protocol):
    name: str
    def on_stage(self, stage: str, context: dict[str, Any]) -> None: ...

@dataclass
class PluginManager:
    plugins: list[Plugin] = field(default_factory=list)
    def register(self, plugin: Plugin) -> None:
        self.plugins.append(plugin)
    def emit(self, stage: str, context: dict[str, Any]) -> None:
        for plugin in self.plugins:
            plugin.on_stage(stage, context)
