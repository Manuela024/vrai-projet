# # projects/urls_simple.py
# from django.urls import path
# from .views_api import project_list, projects_with_users, dashboard_stats, api_status
# from .views import APITestView
# from users.views import QuickLoginView, UserProfileView
# from rest_framework_simplejwt.views import TokenRefreshView

# urlpatterns = [
#     # ENDPOINTS PRINCIPAUX
#     path('projects/', project_list, name='project-list'),
#     path('projects-with-users/', projects_with_users, name='projects-with-users'),
#     path('stats/', dashboard_stats, name='stats'),
#     path('status/', api_status, name='api-status'),
#     path('test/', APITestView.as_view(), name='api-test'),
    
#     # AUTHENTIFICATION
#     path('auth/login/', QuickLoginView.as_view(), name='login'),
#     path('auth/token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
#     path('auth/profile/', UserProfileView.as_view(), name='user-profile'),
    
#     # RACINE
#     path('', api_status, name='api-root'),
# ]


# projects/urls_simple.py - VERSION CORRIGÉE ET SIMPLE
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

# IMPORTATION UNIFIÉE
try:
    # Essayez d'abord views_api
    from .views_api import (
        project_list,
        projects_with_users,
        dashboard_stats,
        api_status,
        project_list_all,
        debug_projects,
        ProjectsGroupedByUserView
    )
    from .views import APITestView
    from users.views import QuickLoginView, UserProfileView
    
    print("✅ Import des vues API réussi!")
    
except ImportError as e:
    print(f"❌ Erreur d'import: {e}")
    
    # Créer des vues de secours minimales
    from rest_framework.decorators import api_view, permission_classes
    from rest_framework.permissions import AllowAny
    from rest_framework.response import Response
    from django.utils import timezone
    
    @api_view(['GET'])
    @permission_classes([AllowAny])
    def fallback_view(request):
        return Response({
            'status': 'fallback',
            'endpoint': request.path,
            'timestamp': timezone.now().isoformat(),
            'message': 'Veuillez vérifier views_api.py'
        })
    
    project_list = fallback_view
    projects_with_users = fallback_view
    dashboard_stats = fallback_view
    api_status = fallback_view
    project_list_all = fallback_view
    debug_projects = fallback_view
    
    from rest_framework.views import APIView
    class FallbackAPIView(APIView):
        permission_classes = [AllowAny]
        def get(self, request):
            return Response({'status': 'fallback'})
    
    ProjectsGroupedByUserView = FallbackAPIView
    APITestView = FallbackAPIView
    
    from rest_framework.views import APIView as BaseAPIView
    class FallbackAuthView(BaseAPIView):
        permission_classes = [AllowAny]
        def post(self, request):
            return Response({'status': 'fallback'})
    
    QuickLoginView = FallbackAuthView
    UserProfileView = FallbackAuthView

# URLS FINALES
urlpatterns = [
    # ========== ENDPOINTS PRINCIPAUX ==========
    # IMPORTANT: Cette URL sera accessible à http://localhost:8000/api/projects/projects/
    path('projects/', project_list, name='project-list'),
    
    # Alternative
    path('projects/all/', project_list_all, name='project-list-all'),
    
    # Debug
    path('projects/debug/', debug_projects, name='debug-projects'),
    
    # Projets groupés par utilisateur
    path('projects-grouped/', ProjectsGroupedByUserView.as_view(), name='projects-grouped'),
    
    # Projets avec utilisateurs détaillés
    path('projects-with-users/', projects_with_users, name='projects-with-users'),
    
    # ========== STATISTIQUES ==========
    path('stats/', dashboard_stats, name='stats'),
    
    # ========== STATUS API ==========
    path('status/', api_status, name='api-status'),
    path('test/', APITestView.as_view(), name='api-test'),
    
    # ========== AUTHENTIFICATION (optionnel) ==========
    path('auth/login/', QuickLoginView.as_view(), name='login'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('auth/profile/', UserProfileView.as_view(), name='user-profile'),
    
    # ========== RACINE ==========
    path('', api_status, name='api-root'),
]

print("=" * 70)
print("🚀 API PROJETS - URLs chargées!")
print("=" * 70)
print("📊 Endpoints disponibles:")
for url in urlpatterns:
    print(f"   http://localhost:8000/api/projects{url.pattern}")
print("=" * 70)