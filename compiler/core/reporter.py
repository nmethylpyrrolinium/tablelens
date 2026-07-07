from rich.console import Console
from rich.table import Table
from rich.panel import Panel
console = Console()

def title(text: str): console.print(Panel.fit(text, style="bold gold1"))
def ok(text: str): console.print(f"[green]✓[/green] {text}")
def warn(text: str): console.print(f"[yellow]⚠[/yellow] {text}")
def error(text: str): console.print(f"[red]✗[/red] {text}")

def report_table(title_text: str, rows: list[tuple[str, str, str]]):
    table = Table(title=title_text)
    table.add_column("Check"); table.add_column("Status"); table.add_column("Detail")
    for row in rows: table.add_row(*row)
    console.print(table)
