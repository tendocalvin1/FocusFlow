from django.http import JsonResponse

def home(request):
    return JsonResponse({
        "project": "FocusFlow API",
        "status": "online",
        "version": "1.0.0",
        "docs": "/api/docs/",
        "admin": "/admin/"
    })