from pathlib import Path
from pydantic import BaseModel, Field, field_validator

VALID_CURRENCIES = {"INR", "USD", "EUR", "GBP", "JPY", "CAD", "AUD"}

class RestaurantSchema(BaseModel):
    name: str = Field(min_length=1)
    tagline: str = ""
    locationLabel: str = ""
    currency: str = "USD"
    currencySymbol: str = "$"
    theme: str = "default"
    demoNote: str = ""

    @field_validator("currency")
    @classmethod
    def valid_currency(cls, value: str) -> str:
        if value not in VALID_CURRENCIES:
            raise ValueError(f"Unsupported currency '{value}'. Use one of {sorted(VALID_CURRENCIES)}")
        return value

class ThemeSchema(BaseModel):
    id: str = Field(min_length=1)
    primaryColor: str = "#d89b45"
    backgroundColor: str = "#130f0b"

    @field_validator("primaryColor", "backgroundColor")
    @classmethod
    def hex_color(cls, value: str) -> str:
        if not isinstance(value, str) or len(value) != 7 or not value.startswith("#"):
            raise ValueError("Expected a hex color like #d89b45")
        int(value[1:], 16)
        return value

class AssetFolders(BaseModel):
    images: Path = Path("assets/images")
    models: Path = Path("assets/models")
    qr: Path = Path("assets/qr")
    generated: Path = Path("generated")

class CompressionConfig(BaseModel):
    imageQuality: int = Field(default=82, ge=1, le=100)
    maxImageWidth: int = Field(default=1600, ge=64)
    thumbnailWidth: int = Field(default=480, ge=32)

class PwaConfig(BaseModel):
    enabled: bool = True

class ArConfig(BaseModel):
    requireGlb: bool = True
    requireUsdz: bool = True

class QrConfig(BaseModel):
    baseUrl: str = "http://localhost/"
    targets: list[str] = Field(default_factory=lambda: ["home", "menu", "dishes"])

class ValidationConfig(BaseModel):
    maxImageBytes: int = 5_242_880
    maxModelBytes: int = 25_000_000
    strictAssets: bool = False

class TableLensConfig(BaseModel):
    restaurant: RestaurantSchema
    theme: ThemeSchema
    assets: AssetFolders = Field(default_factory=AssetFolders)
    output: Path = Path("dist")
    compression: CompressionConfig = Field(default_factory=CompressionConfig)
    pwa: PwaConfig = Field(default_factory=PwaConfig)
    ar: ArConfig = Field(default_factory=ArConfig)
    qr: QrConfig = Field(default_factory=QrConfig)
    validation: ValidationConfig = Field(default_factory=ValidationConfig)
