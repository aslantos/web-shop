from django import template
from django.utils.http import urlencode
from django.core.cache import cache
from goods.models import Categories
from typing import Any, Dict

register = template.Library()


@register.simple_tag()
def tag_categories():
    """
    Возвращает все категории. Используется кэширование для повышения производительности.
    """
    categories = cache.get('categories')
    if not categories:
        categories = Categories.objects.all()
        cache.set('categories', categories, timeout=3600)  # Кэш на 1 час
    return categories


@register.simple_tag(takes_context=True)
def change_params(context: Dict[str, Any], **kwargs: Any) -> str:
    """
    Изменяет параметры запроса в URL.
    Если передано значение None, оно будет исключено.
    """
    query = context.get('request').GET.dict() if 'request' in context else {}
    query.update({k: v for k, v in kwargs.items() if v is not None})
    return urlencode(query)
