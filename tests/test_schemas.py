import pytest
from pydantic import ValidationError
from compiler.schemas.menu import MenuSchema
from compiler.schemas.config import TableLensConfig


def test_menu_rejects_duplicate_ids():
    data = {"dishes": [{"id":"a","name":"A","category":"C","price":1,"description":"x","image":"a.jpg","modelGlb":"a.glb","modelUsdz":"a.usdz"},{"id":"a","name":"B","category":"C","price":2,"description":"x","image":"b.jpg","modelGlb":"b.glb","modelUsdz":"b.usdz"}]}
    with pytest.raises(ValidationError):
        MenuSchema.model_validate(data)


def test_menu_rejects_negative_price():
    data = {"dishes": [{"id":"a","name":"A","category":"C","price":-1,"description":"x","image":"a.jpg","modelGlb":"a.glb","modelUsdz":"a.usdz"}]}
    with pytest.raises(ValidationError):
        MenuSchema.model_validate(data)


def test_config_rejects_invalid_currency():
    data = {"restaurant":{"name":"Cafe","currency":"NOPE"}, "theme":{"id":"t"}}
    with pytest.raises(ValidationError):
        TableLensConfig.model_validate(data)
