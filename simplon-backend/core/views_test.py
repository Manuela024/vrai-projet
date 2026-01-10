# core/views_test.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.utils import timezone

@api_view(['GET'])
@permission_classes([AllowAny])
def api_root(request):
    """Vue racine pour l'API"""
    return Response({
        'message': 'Bienvenue sur l\'API Simplon',
        'timestamp': timezone.now(),
        'endpoints': {
            'users': 'http://localhost:8000/api/users/',
            'admin_users': 'http://localhost:8000/api/users/admin/users/',
            'dashboard_stats': 'http://localhost:8000/api/users/admin/dashboard-stats/',
            'profile': 'http://localhost:8000/api/users/profile/',
            'projects': 'http://localhost:8000/api/projects/',
            'jwt_token': 'http://localhost:8000/api/token/',
            'admin': 'http://localhost:8000/admin/',
            'api_docs': 'http://localhost:8000/swagger/'
        },
        'status': 'active',
        'version': '2.0.0'
    })