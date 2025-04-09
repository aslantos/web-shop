from django.http import HttpResponse
from django.shortcuts import render

def index(request):
    context = {
        'title': 'Home - Главная',
        'content': "Магазин мебели HOME"
    }

    return render(request, 'main/index.html', context)

def about(request):
    context = {
        'title': 'Home - О нас',
        'content': "О нас",
        'text_on_page': "Мы магазин мебели скорость качество кайф."
    }

    return render(request, 'main/about.html', context)