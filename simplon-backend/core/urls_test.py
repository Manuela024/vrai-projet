# # core/urls_test.py
# from django.urls import path
# from rest_framework.decorators import api_view, permission_classes
# from rest_framework.permissions import AllowAny
# from rest_framework.response import Response
# from django.http import JsonResponse

# @api_view(['GET'])
# @permission_classes([AllowAny])
# def api_status(request):
#     """Endpoint pour vérifier l'état de l'API"""
#     return Response({
#         'status': 'online',
#         'service': 'Simplon API',
#         'version': '1.0.0',
#         'debug': True,
#         'jwt_endpoints': {
#             'token': '/api/token/',
#             'refresh': '/api/token/refresh/',
#             'verify': '/api/token/verify/'
#         },
#         'available_endpoints': {
#             'projects': '/api/projects/',
#             'users': '/api/users/',
#             'admin': '/admin/',
#             'api_auth': '/api-auth/'
#         }
#     })

# @api_view(['GET'])
# @permission_classes([AllowAny])
# def jwt_test(request):
#     """Endpoint de test pour JWT"""
#     return Response({
#         'message': 'JWT est configuré correctement',
#         'instructions': {
#             'obtain_token': 'POST /api/token/ avec {"username": "votre_username", "password": "votre_mot_de_passe"}',
#             'refresh_token': 'POST /api/token/refresh/ avec {"refresh": "votre_refresh_token"}',
#             'verify_token': 'POST /api/token/verify/ avec {"token": "votre_token"}'
#         }
#     })

# def simple_status(request):
#     """Version simplifiée sans DRF"""
#     return JsonResponse({
#         'status': 'ok',
#         'message': 'API Simplon en cours d\'exécution',
#         'timestamp': 'now'
#     })

# urlpatterns = [
#     path('', api_status, name='api_status'),
#     path('jwt/', jwt_test, name='jwt_test'),
#     path('simple/', simple_status, name='simple_status'),
# ]

# core/urls_test.py
from django.urls import path
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.utils import timezone

@api_view(['GET'])
@permission_classes([AllowAny])
def api_status(request):
    return Response({
        'status': 'online',
        'message': 'Simplon API is running',
        'timestamp': timezone.now(),
        'version': '2.0.0',
        'endpoints': {
            'users': 'http://localhost:8000/api/users/',
            'projects': 'http://localhost:8000/api/projects/',
            'admin': 'http://localhost:8000/admin/',
            'api_docs': 'http://localhost:8000/swagger/' if request.build_absolute_uri().endswith('/') else request.build_absolute_uri('/swagger/')
        }
    })

urlpatterns = [
    path('', api_status, name='api-status'),
]