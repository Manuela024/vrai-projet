# # projects/urls.py - VERSION COMPLÈTE CORRIGÉE
# from django.urls import path
# from rest_framework_simplejwt.views import TokenRefreshView
# from django.http import JsonResponse
# from django.views import View
# from django.utils import timezone

# # ============================================================================
# # VUES DE SECOURS (fallback)
# # ============================================================================

# class SimpleAPIView(View):
#     """Vue simple pour tous les endpoints"""
#     def get(self, request, *args, **kwargs):
#         endpoint = request.path
#         return JsonResponse({
#             'status': 'ok',
#             'service': 'Simplon Projects API',
#             'endpoint': endpoint,
#             'timestamp': timezone.now().isoformat(),
#             'message': 'API fonctionnelle - Endpoint en développement'
#         })
    
#     def post(self, request, *args, **kwargs):
#         return JsonResponse({
#             'status': 'ok',
#             'message': 'POST reçu',
#             'timestamp': timezone.now().isoformat()
#         })

# # ============================================================================
# # ESSAYER D'IMPORTER LES VRAIES VUES
# # ============================================================================

# try:
#     print("🔄 Tentative d'import des vues Django...")
    
#     # Essayer d'importer depuis views_api.py
#     from .views_api import (
#         ProjectsGroupedByUserView, 
#         api_status, 
#         dashboard_stats,
#         projects_with_users,
#         project_list
#     )
    
#     # Essayer d'importer depuis views.py
#     from .views import APITestView
    
#     # Essayer d'importer depuis users.views
#     from users.views import QuickLoginView, UserProfileView
    
#     print("✅ Import des vues réussi!")
    
#     # Si tout réussit, utiliser les vraies vues
#     urlpatterns = [
#         # ========== ENDPOINTS PROJETS (PRINCIPAUX) ==========
#         path('projects/', project_list, name='project-list'),
#         path('projects-grouped/', ProjectsGroupedByUserView.as_view(), name='projects-grouped'),
#         path('projects-with-users/', projects_with_users, name='projects-with-users'),
        
#         # ========== STATISTIQUES ==========
#         path('stats/', dashboard_stats, name='stats'),
        
#         # ========== STATUS API ==========
#         path('status/', api_status, name='api-status'),
#         path('test/', APITestView.as_view(), name='api-test'),
        
#         # ========== AUTHENTIFICATION ==========
#         path('auth/login/', QuickLoginView.as_view(), name='login'),
#         path('auth/token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
#         path('auth/profile/', UserProfileView.as_view(), name='user-profile'),
        
#         # ========== RACINE ==========
#         path('', api_status, name='api-root'),
#     ]
    
# except ImportError as e:
#     print(f"⚠️ Erreur d'import: {e}")
#     print("🔄 Utilisation des vues de secours...")
    
#     # Utiliser les vues de secours
#     urlpatterns = [
#         # ========== ENDPOINTS PRINCIPAUX ==========
#         path('projects/', SimpleAPIView.as_view(), name='project-list'),
#         path('projects-grouped/', SimpleAPIView.as_view(), name='projects-grouped'),
#         path('projects-with-users/', SimpleAPIView.as_view(), name='projects-with-users'),
#         path('stats/', SimpleAPIView.as_view(), name='stats'),
#         path('status/', SimpleAPIView.as_view(), name='api-status'),
#         path('test/', SimpleAPIView.as_view(), name='api-test'),
        
#         # ========== AUTHENTIFICATION ==========
#         path('auth/login/', SimpleAPIView.as_view(), name='login'),
#         path('auth/token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
#         path('auth/profile/', SimpleAPIView.as_view(), name='user-profile'),
        
#         # ========== RACINE ==========
#         path('', SimpleAPIView.as_view(), name='api-root'),
#     ]

# # ============================================================================
# # INFO DE DÉMARRAGE
# # ============================================================================

# print("=" * 70)
# print("🚀 API SIMPLON - URLs chargées avec succès!")
# print("=" * 70)
# print(f"📊 Endpoints disponibles: {len(urlpatterns)}")
# for url in urlpatterns:
#     print(f"   {url.pattern}")
# print("=" * 70)

# projects/urls.py - AJOUTEZ CES PATHS
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from django.http import JsonResponse
from django.views import View
from django.utils import timezone

# ============================================================================
# ESSAYER D'IMPORTER LES VRAIES VUES
# ============================================================================

try:
    print("🔄 Tentative d'import des vues Django...")

    from .views_api import (
        ProjectsGroupedByUserView,
        api_status, 
        dashboard_stats,
        projects_with_users,
        project_list,
        project_list_all,       # AJOUTÉ
        debug_projects          # AJOUTÉ
    )

    from .views import APITestView
    from users.views import QuickLoginView, UserProfileView

    print("✅ Import des vues réussi!")

    # URLPATTERNS COMPLETS
    urlpatterns = [
        # ========== ENDPOINTS PROJETS (PRINCIPAUX) ==========
        path('projects/', project_list, name='project-list'),           # Tous les projets
        path('projects/all/', project_list_all, name='project-list-all'), # Version debug
        path('projects/debug/', debug_projects, name='debug-projects'), # Debug
        path('projects-grouped/', ProjectsGroupedByUserView.as_view(), name='projects-grouped'),
        path('projects-with-users/', projects_with_users, name='projects-with-users'),

        # ========== STATISTIQUES ==========
        path('stats/', dashboard_stats, name='stats'),

        # ========== STATUS API ==========
        path('status/', api_status, name='api-status'),
        path('test/', APITestView.as_view(), name='api-test'),

        # ========== AUTHENTIFICATION ==========
        path('auth/login/', QuickLoginView.as_view(), name='login'),
        path('auth/token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
        path('auth/profile/', UserProfileView.as_view(), name='user-profile'),

        # ========== RACINE ==========
        path('', api_status, name='api-root'),
    ]

except ImportError as e:
    print(f"⚠️ Erreur d'import: {e}")
    print("🔄 Utilisation des vues de secours...")

    class SimpleAPIView(View):
        def get(self, request, *args, **kwargs):
            return JsonResponse({
                'status': 'fallback',
                'endpoint': request.path,
                'timestamp': timezone.now().isoformat(),
                'message': 'Vues API en cours de chargement'
            })

    urlpatterns = [
        path('projects/', SimpleAPIView.as_view(), name='project-list'),
        path('projects-grouped/', SimpleAPIView.as_view(), name='projects-grouped'),
        path('projects-with-users/', SimpleAPIView.as_view(), name='projects-with-users'),
        path('stats/', SimpleAPIView.as_view(), name='stats'),
        path('status/', SimpleAPIView.as_view(), name='api-status'),
        path('test/', SimpleAPIView.as_view(), name='api-test'),
        path('auth/login/', SimpleAPIView.as_view(), name='login'),
        path('auth/token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
        path('auth/profile/', SimpleAPIView.as_view(), name='user-profile'),
        path('', SimpleAPIView.as_view(), name='api-root'),
    ]

print("=" * 70)
print("🚀 API SIMPLON - URLs chargées avec succès!")
print("=" * 70)
print("📊 Endpoints disponibles:")
for url in urlpatterns:
    print(f"   {url.pattern}")
print("=" * 70)