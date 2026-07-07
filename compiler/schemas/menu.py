import re
from pydantic import BaseModel, Field, field_validator, model_validator

SLUG_RE = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")

class CategorySchema(BaseModel):
    id: str
    name: str = Field(min_length=1)

class DishSchema(BaseModel):
    id: str
    name: str = Field(min_length=1)
    category: str = Field(min_length=1)
    price: float = Field(ge=0)
    type: str = ""
    spice: str = "none"
    description: str = Field(min_length=1)
    tags: list[str] = Field(default_factory=list)
    portionNote: str = ""
    image: str
    modelGlb: str
    modelUsdz: str
    accent: str = "#d89b45"

    @field_validator("id")
    @classmethod
    def id_slug(cls, value: str) -> str:
        if not SLUG_RE.match(value):
            raise ValueError("Use URL-safe lowercase ids, e.g. signature-burger")
        return value

    @field_validator("accent")
    @classmethod
    def accent_color(cls, value: str) -> str:
        if len(value) != 7 or not value.startswith("#"):
            raise ValueError("accent must be a hex color like #d89b45")
        int(value[1:], 16)
        return value

class MenuSchema(BaseModel):
    categories: list[CategorySchema] = Field(default_factory=list)
    dishes: list[DishSchema]

    @model_validator(mode="after")
    def validate_menu(self):
        if not self.dishes:
            raise ValueError("Menu cannot be empty")
        ids = [dish.id for dish in self.dishes]
        if len(ids) != len(set(ids)):
            raise ValueError("Duplicate dish ids detected")
        category_names = {category.name for category in self.categories}
        if category_names:
            invalid = sorted({dish.category for dish in self.dishes} - category_names)
            if invalid:
                raise ValueError(f"Dishes reference unknown categories: {invalid}")
        return self
