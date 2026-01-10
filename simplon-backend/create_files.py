# create_files.py - CRÉEZ CE FICHIER À LA RACINE
import os

# Créer projects/urls_simple.py
urls_simple_content = '''# projects/urls_simple.py
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

def fallback_view(request):
    from django.http import JsonResponse
    return JsonResponse({
        'status': 'api_online',
        'message': 'API Simplon en cours de démarrage...',
        'endpoints': ['/api/status/', '/api/test/', '/api/projects-grouped/'],
        'timestamp': '2024-01-01T00:00:00Z'
    })

try:
    from .views_api import ProjectsGroupedByUserView, api_status, dashboard_stats
    from .views import APITestView
    from users.views import QuickLoginView, UserProfileView
    
    urlpatterns = [
        path('projects-grouped/', ProjectsGroupedByUserView.as_view(), name='projects-grouped'),
        path('stats/', dashboard_stats, name='stats'),
        path('status/', api_status, name='api-status'),
        path('test/', APITestView.as_view(), name='api-test'),
        path('auth/login/', QuickLoginView.as_view(), name='login'),
        path('auth/token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
        path('auth/profile/', UserProfileView.as_view(), name='user-profile'),
        path('', api_status, name='api-root'),
    ]
    
except ImportError as e:
    from django.views import View
    from django.http import JsonResponse
    from django.utils import timezone
    
    class FallbackAPIView(View):
        def get(self, request, *args, **kwargs):
            return JsonResponse({
                'status': 'fallback_mode',
                'message': 'API en cours de configuration',
                'available_endpoints': ['/api/status/', '/api/test/'],
                'timestamp': timezone.now().isoformat()
            })
    
    urlpatterns = [
        path('', FallbackAPIView.as_view(), name='api-root'),
        path('status/', FallbackAPIView.as_view(), name='status'),
        path('test/', FallbackAPIView.as_view(), name='test'),
        path('projects-grouped/', FallbackAPIView.as_view(), name='projects-grouped'),
    ]
'''

# Créer projects/views_api.py (simplifié)
views_api_content = '''# projects/views_api.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from django.utils import timezone

class ProjectsGroupedByUserView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def get(self, request):
        return Response({
            'success': True,
            'message': 'Endpoint projects-grouped fonctionnel',
            'timestamp': timezone.now().isoformat(),
            'demo_data': True,
            'data': []
        })

def api_status(request):
    from rest_framework.decorators import api_view
    from rest_framework.response import Response
    
    @api_view(['GET'])
    def status_view(request):
        return Response({
            'status': 'online',
            'timestamp': timezone.now().isoformat()
        })
    
    return status_view(request)

def dashboard_stats(request):
    from rest_framework.decorators import api_view
    from rest_framework.response import Response
    
    @api_view(['GET'])
    def stats_view(request):
        return Response({
            'stats': 'endpoint_en_development',
            'timestamp': timezone.now().isoformat()
        })
    
    return stats_view(request)
'''

# Écrire les fichiers
with open('projects/urls_simple.py', 'w', encoding='utf-8') as f:
    f.write(urls_simple_content)

with open('projects/views_api.py', 'w', encoding='utf-8') as f:
    f.write(views_api_content)

print("✅ Fichiers créés avec succès!")