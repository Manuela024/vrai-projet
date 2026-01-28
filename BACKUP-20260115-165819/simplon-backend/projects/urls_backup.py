
# # projects/urls.py - VERSION CORRIGÉE
# from django.urls import path
# from . import views_api
# from . import admin_views

# urlpatterns = [
#     # URLs API standards
#     path('', views_api.ProjectListCreateView.as_view(), name='project-list'),
#     path('<int:pk>/', views_api.ProjectRetrieveUpdateDestroyView.as_view(), name='project-detail'),
    
#     # URLs pour les projets de l'utilisateur connecté
#     path('my-projects/', views_api.MyProjectsView.as_view(), name='my-projects'),
#     path('public/', views_api.PublicProjectsView.as_view(), name='public-projects'),
    
#     # URLs pour tester l'API
#     path('test/', views_api.APITestView.as_view(), name='api-test'),
    
#     # URLs ADMIN
#     path('admin/users-with-projects/', admin_views.UsersWithProjectsView.as_view(), name='users-with-projects'),
#     path('admin/all-projects-with-users/', admin_views.AllProjectsWithUsersView.as_view(), name='all-projects-with-users'),
# ]


# # projects/urls.py
# from django.urls import path, include
# from rest_framework.routers import DefaultRouter
# from rest_framework_simplejwt.views import TokenRefreshView

# # Import des vues depuis le BON fichier
# from .views_api import (
#     ProjectsGroupedByUserView, 
#     ProjectBulkActionsView, 
#     api_status, 
#     dashboard_stats
# )

# # Import des vues depuis views.py (où elles se trouvent vraiment)
# from .views import (
#     ProjectViewSet,
#     ProjectListCreateView,  # Cette vue est dans views.py, pas views_api.py !
#     ProjectRetrieveUpdateDestroyView,
#     MyProjectsView,
#     PublicProjectsView,
#     APITestView
# )

# from users.views import (
#     UserProfileView,
#     RequestLoginView,
#     SetupPasswordView,
#     QuickLoginView,
#     ForgotPasswordView,
#     ResetPasswordView,
#     users_with_projects
# )

# from users.views_api import (
#     AdminUserViewSet,
#     DashboardStatsView
# )

# # Router pour les vues ViewSet
# router = DefaultRouter()
# router.register(r'admin/users', AdminUserViewSet, basename='admin-user')
# router.register(r'projects', ProjectViewSet, basename='project')

# urlpatterns = [
#     # ==== API CORE ====
#     path('', api_status, name='api-status'),
#     path('status/', api_status, name='api-status-alt'),
#     path('test/', APITestView.as_view(), name='api-test'),
    
#     # ==== ENDPOINTS GROUPÉS POUR REACT ====
#     path('projects-grouped/', ProjectsGroupedByUserView.as_view(), name='projects-grouped'),
#     path('users-with-projects/', users_with_projects, name='users-with-projects'),
    
#     # ==== STATISTIQUES ====
#     path('stats/', dashboard_stats, name='dashboard-stats'),
#     path('admin/dashboard-stats/', DashboardStatsView.as_view({'get': 'list'}), name='admin-dashboard-stats'),
    
#     # ==== PROJETS (REST API) ====
#     # Utilisez directement les vues de views.py
#     path('projects/list-create/', ProjectListCreateView.as_view(), name='projects-list-create'),
#     path('projects/<int:pk>/', ProjectRetrieveUpdateDestroyView.as_view(), name='projects-detail'),
#     path('projects/', include(router.urls)),  # Inclut toutes les routes du router
    
#     # ==== PROJETS SPÉCIFIQUES ====
#     path('my-projects/', MyProjectsView.as_view(), name='my-projects'),
#     path('public-projects/', PublicProjectsView.as_view(), name='public-projects'),
    
#     # ==== ACTIONS EN MASSE ====
#     path('projects/bulk-actions/', ProjectBulkActionsView.as_view(), name='projects-bulk-actions'),
    
#     # ==== AUTHENTIFICATION UTILISATEURS ====
#     path('auth/login/', QuickLoginView.as_view(), name='quick-login'),
#     path('auth/token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
#     path('auth/request-login/', RequestLoginView.as_view(), name='request-login'),
#     path('auth/setup-password/', SetupPasswordView.as_view(), name='setup-password'),
#     path('auth/forgot-password/', ForgotPasswordView.as_view(), name='forgot-password'),
#     path('auth/reset-password/', ResetPasswordView.as_view(), name='reset-password'),
    
#     # ==== PROFIL UTILISATEUR ====
#     path('auth/profile/', UserProfileView.as_view(), name='user-profile'),
    
#     # ==== ADMIN DASHBOARD ====
#     path('admin/', include(router.urls)),  # Inclut les routes admin
    
#     # ==== ALIAS POUR COMPATIBILITÉ ====
#     path('api-test/', APITestView.as_view(), name='api-test-alias'),
#     path('all-projects/', ProjectListCreateView.as_view(), name='all-projects'),
# ]

# projects/urls_simple.py - VERSION MINIMALE FONCTIONNELLE
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

# Import direct avec try/except pour éviter les erreurs
try:
    from .views_api import ProjectsGroupedByUserView, api_status, dashboard_stats
    from .views import APITestView
    from users.views import QuickLoginView, UserProfileView
    
    urlpatterns = [
        # Endpoint principal pour React
        path('projects-grouped/', ProjectsGroupedByUserView.as_view(), name='projects-grouped'),
        
        # Statistiques
        path('stats/', dashboard_stats, name='stats'),
        
        # Status API
        path('status/', api_status, name='api-status'),
        path('test/', APITestView.as_view(), name='api-test'),
        
        # Authentification
        path('auth/login/', QuickLoginView.as_view(), name='login'),
        path('auth/token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
        path('auth/profile/', UserProfileView.as_view(), name='user-profile'),
        
        # Racine
        path('', api_status, name='api-root'),
    ]
    
except ImportError as e:
    # Version de secours ultra-minimale
    from django.http import JsonResponse
    
    def fallback_view(request):
        return JsonResponse({
            'status': 'warning',
            'message': 'API en cours de configuration',
            'error': str(e),
            'available_endpoints': ['/api/status/']
        })
    
    urlpatterns = [
        path('', fallback_view, name='fallback'),
        path('status/', fallback_view, name='status'),
    ]