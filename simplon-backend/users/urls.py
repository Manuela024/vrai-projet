

# # users/urls.py - VERSION COMPLÈTE AVEC ADMIN API
# from django.urls import path, include
# from rest_framework.routers import DefaultRouter
# from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
# from . import views
# from .views_api import AdminUserViewSet, DashboardStatsView

# router = DefaultRouter()
# router.register(r'admin/users', AdminUserViewSet, basename='admin-user')
# router.register(r'admin/dashboard-stats', DashboardStatsView, basename='dashboard-stats')

# urlpatterns = [
#     # ⭐ AUTHENTIFICATION JWT STANDARD
#     path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
#     path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
#     # ⭐ PROFIL UTILISATEUR
#     path('profile/', views.UserProfileView.as_view(), name='user-profile'),
#     path('user/', views.UserProfileView.as_view(), name='user-detail'),
    
#     # ⭐ FLOW CONNEXION PAR LIEN MAGIQUE
#     path('request-login/', views.RequestLoginView.as_view(), name='request-login'),
#     path('setup-password/', views.SetupPasswordView.as_view(), name='setup-password'),
    
#     # ⭐ CONNEXION DIRECTE
#     path('direct-login/', views.DirectLoginView.as_view(), name='direct-login'),
#     path('quick-login/', views.QuickLoginView.as_view(), name='quick-login'),
    
#     # ⭐ RÉINITIALISATION MOT DE PASSE
#     path('forgot-password/', views.ForgotPasswordView.as_view(), name='forgot-password'),
#     path('reset-password/', views.ResetPasswordView.as_view(), name='reset-password'),
    
#     # ⭐ ENDPOINT POUR LE FRONTEND REACT
#     path('users-with-projects/', views.users_with_projects, name='users-with-projects'),
    
#     # ⭐ API ADMIN DASHBOARD (NOUVEAU!)
#     path('', include(router.urls)),
    
#     # ⭐ TEST ENDPOINT SIMPLE (pour déboguer)
#     path('test/', views.users_with_projects, name='test-endpoint'),
# ]

# # users/urls.py
# from django.urls import path
# from .views import (
#     UserProfileView,
#     RequestLoginView,
#     SetupPasswordView,
#     QuickLoginView,
#     ForgotPasswordView,
#     ResetPasswordView,
#     users_with_projects
# )

# from .views_api import AdminUserViewSet, DashboardStatsView
# from rest_framework.routers import DefaultRouter

# router = DefaultRouter()
# router.register(r'users', AdminUserViewSet, basename='user')

# urlpatterns = [
#     # Endpoint pour React
#     path('users-with-projects/', users_with_projects, name='users-with-projects'),
    
#     # Authentification
#     path('login/', QuickLoginView.as_view(), name='login'),
#     path('request-login/', RequestLoginView.as_view(), name='request-login'),
#     path('setup-password/', SetupPasswordView.as_view(), name='setup-password'),
#     path('forgot-password/', ForgotPasswordView.as_view(), name='forgot-password'),
#     path('reset-password/', ResetPasswordView.as_view(), name='reset-password'),
    
#     # Profil
#     path('profile/', UserProfileView.as_view(), name='profile'),
    
#     # Dashboard admin
#     path('dashboard-stats/', DashboardStatsView.as_view({'get': 'list'}), name='dashboard-stats'),
    
#     # Routes du router
#     path('', include(router.urls)),
# ]

# # users/urls.py - VERSION FINALE CORRECTE
# from django.urls import path, include
# from rest_framework.routers import DefaultRouter
# from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
# from . import views
# from .views_api import AdminUserViewSet, DashboardStatsView


# # users/urls.py - AJOUTER CES ROUTES AU FICHIER EXISTANT
# from .views import (
#     UserProfileImageView,
#     UserProfileCompleteView,
#     UserProfileHistoryView,
#     UserNotificationsView,
#     MarkNotificationReadView,
#     MarkAllNotificationsReadView,
#     UserStatsView
# )

# # Ajoutez ces URLpatterns aux vôtres
# urlpatterns += [
#     # Profil complet avec toutes les infos
#     path('profile/complete/', UserProfileCompleteView.as_view(), name='user-profile-complete'),
    
#     # Photo de profil
#     path('profile/image/', UserProfileImageView.as_view(), name='user-profile-image'),
    
#     # Historique des modifications
#     path('profile/history/', UserProfileHistoryView.as_view(), name='user-profile-history'),
    
#     # Notifications
#     path('notifications/', UserNotificationsView.as_view(), name='user-notifications'),
#     path('notifications/<int:pk>/read/', MarkNotificationReadView.as_view(), name='mark-notification-read'),
#     path('notifications/mark-all-read/', MarkAllNotificationsReadView.as_view(), name='mark-all-notifications-read'),
    
#     # Statistiques
#     path('stats/', UserStatsView.as_view(), name='user-stats'),
    
#     # Endpoint pour les projets (déjà présent mais conservé)
#     path('users-with-projects/', views.users_with_projects, name='users-with-projects'),
# ]
# router = DefaultRouter()
# router.register(r'admin/users', AdminUserViewSet, basename='admin-user')
# router.register(r'admin/dashboard-stats', DashboardStatsView, basename='dashboard-stats')

# urlpatterns = [
#     # ⭐ AUTHENTIFICATION JWT STANDARD
#     path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
#     path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
#     # ⭐ PROFIL UTILISATEUR - CRITIQUE : CET ENDPOINT DOIT SUPPORTER PATCH/PUT
#     path('profile/', views.UserProfileView.as_view(), name='user-profile'),
#     path('user/', views.UserProfileView.as_view(), name='user-detail'),
    
#     # ⭐ FLOW CONNEXION PAR LIEN MAGIQUE
#     path('request-login/', views.RequestLoginView.as_view(), name='request-login'),
#     path('setup-password/', views.SetupPasswordView.as_view(), name='setup-password'),
    
#     # ⭐ CONNEXION DIRECTE
#     path('direct-login/', views.DirectLoginView.as_view(), name='direct-login'),
#     path('quick-login/', views.QuickLoginView.as_view(), name='quick-login'),
    
#     # ⭐ RÉINITIALISATION MOT DE PASSE
#     path('forgot-password/', views.ForgotPasswordView.as_view(), name='forgot-password'),
#     path('reset-password/', views.ResetPasswordView.as_view(), name='reset-password'),
    
#     # ⭐ ENDPOINT POUR LE FRONTEND REACT
#     path('users-with-projects/', views.users_with_projects, name='users-with-projects'),
    
#     # ⭐ API ADMIN DASHBOARD
#     path('', include(router.urls)),
# ]

# # Si vous avez besoin d'un endpoint test simple
# urlpatterns += [
#     path('test/', views.users_with_projects, name='test-endpoint'),
# ]



# # users/urls.py - VERSION FINALE ORGANISÉE
# from django.urls import path, include
# from rest_framework.routers import DefaultRouter
# from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
# from . import views
# from .views_api import AdminUserViewSet, DashboardStatsView

# # ============ ROUTER POUR VIEWSETS ============
# router = DefaultRouter()
# router.register(r'admin/users', AdminUserViewSet, basename='admin-user')
# router.register(r'admin/dashboard-stats', DashboardStatsView, basename='dashboard-stats')

# # ============ URLPATTERNS PRINCIPALES ============
# urlpatterns = [
#     # 🔐 AUTHENTIFICATION JWT STANDARD
#     path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
#     path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
#     # 👤 PROFIL UTILISATEUR (SUPPORT PATCH/PUT)
#     path('profile/', views.UserProfileView.as_view(), name='user-profile'),
#     path('profile/complete/', views.UserProfileCompleteView.as_view(), name='user-profile-complete'),
#     path('profile/image/', views.UserProfileImageView.as_view(), name='user-profile-image'),
#     path('profile/history/', views.UserProfileHistoryView.as_view(), name='user-profile-history'),
    
#     # 🔑 FLOW AUTHENTIFICATION
#     path('request-login/', views.RequestLoginView.as_view(), name='request-login'),
#     path('setup-password/', views.SetupPasswordView.as_view(), name='setup-password'),
#     path('quick-login/', views.QuickLoginView.as_view(), name='quick-login'),
#     path('direct-login/', views.DirectLoginView.as_view(), name='direct-login'),
    
#     # 🔄 RÉINITIALISATION MOT DE PASSE
#     path('forgot-password/', views.ForgotPasswordView.as_view(), name='forgot-password'),
#     path('reset-password/', views.ResetPasswordView.as_view(), name='reset-password'),
#     path('change-password/', views.ChangePasswordView.as_view(), name='change-password'),
    
#     # 🔔 NOTIFICATIONS
#     path('notifications/', views.UserNotificationsView.as_view(), name='user-notifications'),
#     path('notifications/<int:pk>/read/', views.MarkNotificationReadView.as_view(), name='mark-notification-read'),
#     path('notifications/mark-all-read/', views.MarkAllNotificationsReadView.as_view(), name='mark-all-notifications-read'),
    
#     # 📊 STATISTIQUES
#     path('stats/', views.UserStatsView.as_view(), name='user-stats'),
    
#     # 📋 UTILISATEURS AVEC PROJETS (POUR FRONTEND)
#     path('users-with-projects/', views.users_with_projects, name='users-with-projects'),
    
#     # 🛠️ API ADMIN (INCLUE LES ROUTES DU ROUTER)
#     path('', include(router.urls)),
    
#     # 🧪 ENDPOINTS DE TEST
#     path('test/', views.users_with_projects, name='test-endpoint'),
# ]

# users/urls.py - VERSION SIMPLIFIÉE ET CORRIGÉE
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.utils import timezone
from . import views

router = DefaultRouter()
router.register(r'admin/users', views.AdminUserViewSet, basename='admin-users')

# Vue racine simple pour l'API users
@api_view(['GET'])
@permission_classes([AllowAny])
def users_api_root(request):
    """Vue racine qui liste tous les endpoints disponibles pour users"""
    base_url = request.build_absolute_uri('/')
    
    endpoints = {
        'admin': {
            'users': f"{base_url}api/users/admin/users/",
            'dashboard_stats': f"{base_url}api/users/admin/dashboard-stats/",
        },
        'profile': {
            'my_profile': f"{base_url}api/users/profile/",
            'complete_profile': f"{base_url}api/users/profile/complete/",
            'avatar': f"{base_url}api/users/profile/avatar/",
            'history': f"{base_url}api/users/profile/history/",
            'change_password': f"{base_url}api/users/profile/change-password/",
        },
        'notifications': {
            'list': f"{base_url}api/users/notifications/",
            'mark_all_read': f"{base_url}api/users/notifications/mark-all-read/",
        },
        'stats': f"{base_url}api/users/stats/",
        'users_with_projects': f"{base_url}api/users/with-projects/",
        'auth': {
            'request_login': f"{base_url}api/users/auth/request-login/",
            'setup_password': f"{base_url}api/users/auth/setup-password/",
            'direct_login': f"{base_url}api/users/auth/direct-login/",
            'quick_login': f"{base_url}api/users/auth/quick-login/",
            'forgot_password': f"{base_url}api/users/auth/forgot-password/",
            'reset_password': f"{base_url}api/users/auth/reset-password/",
            'jwt_token': f"{base_url}api/token/",
            'jwt_refresh': f"{base_url}api/token/refresh/",
        },
        'status': {
            'user_status': f"{base_url}api/users/status/",
            'api_health': f"{base_url}api/users/health/",
            'api_status': f"{base_url}api/status/",
        }
    }
    
    return Response({
        'name': 'Simplon Users API',
        'version': '2.0.0',
        'timestamp': timezone.now(),
        'documentation': f"{base_url}swagger/",
        'authentication': 'Utilisez JWT token dans le header: Authorization: Bearer <token>',
        'endpoints': endpoints,
        'quick_start': [
            '1. Inscription: POST /api/users/auth/request-login/',
            '2. Connexion: POST /api/token/ ou POST /api/users/auth/quick-login/',
            '3. Profil: GET /api/users/profile/',
            '4. Dashboard admin: GET /api/users/admin/dashboard-stats/ (admin seulement)'
        ]
    })

urlpatterns = [
    # Racine de l'API users
    path('', users_api_root, name='users-api-root'),
    
    # Router URLs
    path('', include(router.urls)),
    
    # Endpoints frontend
    path('with-projects/', views.users_with_projects, name='users-with-projects'),
    path('status/', views.user_status, name='user-status'),
    path('health/', views.health_check, name='health-check'),
    
    # Profil utilisateur
    path('profile/', views.UserProfileView.as_view(), name='user-profile'),
    path('profile/complete/', views.UserProfileCompleteView.as_view(), name='user-profile-complete'),
    path('profile/avatar/', views.UserProfileImageView.as_view(), name='user-profile-avatar'),
    path('profile/history/', views.UserProfileHistoryView.as_view(), name='user-profile-history'),
    path('profile/change-password/', views.ChangePasswordView.as_view(), name='change-password'),
    
    # Notifications
    path('notifications/', views.UserNotificationsView.as_view(), name='user-notifications'),
    path('notifications/<int:pk>/read/', views.MarkNotificationReadView.as_view(), name='mark-notification-read'),
    path('notifications/mark-all-read/', views.MarkAllNotificationsReadView.as_view(), name='mark-all-notifications-read'),
    
    # Statistiques
    path('stats/', views.UserStatsView.as_view(), name='user-stats'),
    
    # Authentification
    path('auth/request-login/', views.RequestLoginView.as_view(), name='request-login'),
    path('auth/setup-password/', views.SetupPasswordView.as_view(), name='setup-password'),
    path('auth/direct-login/', views.DirectLoginView.as_view(), name='direct-login'),
    path('auth/quick-login/', views.QuickLoginView.as_view(), name='quick-login'),
    path('auth/forgot-password/', views.ForgotPasswordView.as_view(), name='forgot-password'),
    path('auth/reset-password/', views.ResetPasswordView.as_view(), name='reset-password'),
    
    # Dashboard admin
    path('admin/dashboard-stats/', views.AdminUserViewSet.as_view({'get': 'stats'}), name='admin-dashboard-stats'),
        path('all/', views.get_all_users_simple, name='all-users-simple'),
    path('all/admin/', views.get_all_users_admin, name='all-users-admin'),
    path('summary/', views.public_users_summary, name='users-summary'),
]

# Version alternative plus simple si vous préférez
@api_view(['GET'])
@permission_classes([AllowAny])
def simple_api_root(request):
    """Version simplifiée de la vue racine"""
    return Response({
        'message': 'Bienvenue sur l\'API Users de Simplon',
        'endpoints': {
            'profile': '/api/users/profile/',
            'auth': '/api/users/auth/',
            'notifications': '/api/users/notifications/',
            'admin': '/api/users/admin/',
            'with_projects': '/api/users/with-projects/',
        },
        'jwt_auth': '/api/token/',
        'admin_panel': '/admin/',
        'api_docs': '/swagger/',
    })