

# # users/urls.py - VERSION COMPLÈTE CORRIGÉE
# from django.urls import path, include
# from rest_framework.routers import DefaultRouter
# from rest_framework.decorators import api_view, permission_classes
# from rest_framework.permissions import AllowAny
# from rest_framework.response import Response
# from django.utils import timezone
# from . import views

# router = DefaultRouter()
# router.register(r'admin/users', views.AdminUserViewSet, basename='admin-users')

# # Vue racine simple pour l'API users
# @api_view(['GET'])
# @permission_classes([AllowAny])
# def users_api_root(request):
#     """Vue racine qui liste tous les endpoints disponibles pour users"""
#     base_url = request.build_absolute_uri('/')
    
#     endpoints = {
#         'admin': {
#             'users': f"{base_url}api/users/admin/users/",
#             'dashboard_stats': f"{base_url}api/users/admin/dashboard-stats/",
#         },
#         'profile': {
#             'my_profile': f"{base_url}api/users/profile/",
#             'extended_profile': f"{base_url}api/users/profile/extended/",  # <-- NOUVEAU
#             'complete_profile': f"{base_url}api/users/profile/complete/",
#             'complete': f"{base_url}api/users/profile/complete-data/",  # <-- NOUVEAU
#             'avatar': f"{base_url}api/users/profile/avatar/",
#             'history': f"{base_url}api/users/profile/history/",
#             'change_password': f"{base_url}api/users/profile/change-password/",
#         },
#         'notifications': {
#             'list': f"{base_url}api/users/notifications/",
#             'mark_all_read': f"{base_url}api/users/notifications/mark-all-read/",
#         },
#         'stats': f"{base_url}api/users/stats/",
#         'users_with_projects': f"{base_url}api/users/with-projects/",
#         'auth': {
#             'request_login': f"{base_url}api/users/auth/request-login/",
#             'setup_password': f"{base_url}api/users/auth/setup-password/",
#             'direct_login': f"{base_url}api/users/auth/direct-login/",
#             'quick_login': f"{base_url}api/users/auth/quick-login/",
#             'forgot_password': f"{base_url}api/users/auth/forgot-password/",
#             'reset_password': f"{base_url}api/users/auth/reset-password/",
#             'jwt_token': f"{base_url}api/token/",
#             'jwt_refresh': f"{base_url}api/token/refresh/",
#         },
#         'status': {
#             'user_status': f"{base_url}api/users/status/",
#             'api_health': f"{base_url}api/users/health/",
#             'api_status': f"{base_url}api/status/",
#         }
#     }
    
#     return Response({
#         'name': 'Simplon Users API',
#         'version': '2.0.0',
#         'timestamp': timezone.now(),
#         'documentation': f"{base_url}swagger/",
#         'authentication': 'Utilisez JWT token dans le header: Authorization: Bearer <token>',
#         'endpoints': endpoints,
#         'quick_start': [
#             '1. Inscription: POST /api/users/auth/request-login/',
#             '2. Connexion: POST /api/token/ ou POST /api/users/auth/quick-login/',
#             '3. Profil: GET /api/users/profile/',
#             '4. Dashboard admin: GET /api/users/admin/dashboard-stats/ (admin seulement)'
#         ]
#     })

# urlpatterns = [
#     # Racine de l'API users
#     path('', users_api_root, name='users-api-root'),
    
#     # Router URLs
#     path('', include(router.urls)),
    
#     # Endpoints frontend
#     path('with-projects/', views.users_with_projects, name='users-with-projects'),
#     path('status/', views.user_status, name='user-status'),
#     path('health/', views.health_check, name='health-check'),
    
#     # Profil utilisateur
#     path('profile/', views.UserProfileView.as_view(), name='user-profile'),
#     path('profile/extended/', views.UserExtendedProfileView.as_view(), name='user-profile-extended'),  # <-- NOUVEAU
#     path('profile/complete/', views.UserProfileCompleteView.as_view(), name='user-profile-complete'),
#     path('profile/complete-data/', views.get_complete_profile, name='user-profile-complete-data'),  # <-- NOUVEAU
#     path('profile/avatar/', views.UserProfileImageView.as_view(), name='user-profile-avatar'),
#     path('profile/history/', views.UserProfileHistoryView.as_view(), name='user-profile-history'),
#     path('profile/change-password/', views.ChangePasswordView.as_view(), name='change-password'),
    
#     # Notifications
#     path('notifications/', views.UserNotificationsView.as_view(), name='user-notifications'),
#     path('notifications/<int:pk>/read/', views.MarkNotificationReadView.as_view(), name='mark-notification-read'),
#     path('notifications/mark-all-read/', views.MarkAllNotificationsReadView.as_view(), name='mark-all-notifications-read'),
    
#     # Statistiques
#     path('stats/', views.UserStatsView.as_view(), name='user-stats'),
    
#     # Authentification
#     path('auth/request-login/', views.RequestLoginView.as_view(), name='request-login'),
#     path('auth/setup-password/', views.SetupPasswordView.as_view(), name='setup-password'),
#     path('auth/direct-login/', views.DirectLoginView.as_view(), name='direct-login'),
#     path('auth/quick-login/', views.QuickLoginView.as_view(), name='quick-login'),
#     path('auth/forgot-password/', views.ForgotPasswordView.as_view(), name='forgot-password'),
#     path('auth/reset-password/', views.ResetPasswordView.as_view(), name='reset-password'),
    
#     # Dashboard admin
#     path('admin/dashboard-stats/', views.AdminUserViewSet.as_view({'get': 'stats'}), name='admin-dashboard-stats'),
    
#     # Utilitaires
#     path('all/', views.get_all_users_simple, name='all-users-simple'),
#     path('all/admin/', views.get_all_users_admin, name='all-users-admin'),
#     path('summary/', views.public_users_summary, name='users-summary'),
# ]

# # Version alternative plus simple
# @api_view(['GET'])
# @permission_classes([AllowAny])
# def simple_api_root(request):
#     """Version simplifiée de la vue racine"""
#     return Response({
#         'message': 'Bienvenue sur l\'API Users de Simplon',
#         'endpoints': {
#             'profile': '/api/users/profile/',
#             'extended_profile': '/api/users/profile/extended/',  # <-- NOUVEAU
#             'auth': '/api/users/auth/',
#             'notifications': '/api/users/notifications/',
#             'admin': '/api/users/admin/',
#             'with_projects': '/api/users/with-projects/',
#         },
#         'jwt_auth': '/api/token/',
#         'admin_panel': '/admin/',
#         'api_docs': '/swagger/',
#     })


# users/urls.py - VERSION SIMPLIFIÉE
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.utils import timezone
from . import views

router = DefaultRouter()
router.register(r'admin/users', views.AdminUserViewSet, basename='admin-users')

@api_view(['GET'])
@permission_classes([AllowAny])
def api_root(request):
    """Vue racine simplifiée"""
    return Response({
        'message': 'API Users de Simplon',
        'version': '1.0',
        'endpoints': {
            'profile': '/api/users/profile/',
            'extended_profile': '/api/users/profile/extended/',
            'avatar': '/api/users/profile/avatar/',
            'auth': '/api/users/auth/',
            'health': '/api/users/health/',
        }
    })

urlpatterns = [
    # Racine
    path('', api_root, name='api-root'),
    
    # Router
    path('', include(router.urls)),
    
    # Profil
    path('profile/', views.UserProfileView.as_view(), name='user-profile'),
    path('profile/extended/', views.UserExtendedProfileView.as_view(), name='user-profile-extended'),
    path('profile/complete/', views.UserProfileCompleteView.as_view(), name='user-profile-complete'),
    path('profile/complete-data/', views.get_complete_profile, name='user-profile-complete-data'),
    path('profile/avatar/', views.UserProfileImageView.as_view(), name='user-profile-avatar'),
    path('profile/history/', views.UserProfileHistoryView.as_view(), name='user-profile-history'),
    path('profile/change-password/', views.ChangePasswordView.as_view(), name='change-password'),
    
    # Notifications
    path('notifications/', views.UserNotificationsView.as_view(), name='user-notifications'),
    
    # Authentification
    path('auth/request-login/', views.RequestLoginView.as_view(), name='request-login'),
    path('auth/setup-password/', views.SetupPasswordView.as_view(), name='setup-password'),
    path('auth/quick-login/', views.QuickLoginView.as_view(), name='quick-login'),
    
    # Utilitaires
    path('all/', views.get_all_users_simple, name='all-users-simple'),
    path('all/admin/', views.get_all_users_admin, name='all-users-admin'),
    path('health/', views.health_check, name='health-check'),
    path('status/', views.user_status, name='user-status'),
    
    # Stats admin
    path('admin/dashboard-stats/', views.AdminUserViewSet.as_view({'get': 'stats'}), name='admin-dashboard-stats'),

    path('auth/universal-login/', views.UniversalLoginView.as_view(), name='universal-login'),
]