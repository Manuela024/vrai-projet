

# # projects/urls_simple.py - VERSION CORRECTE ET SIMPLE
# from django.urls import path
# from . import views_api

# urlpatterns = [
#     # IMPORTANT: Une seule route racine qui accepte GET et POST
#     path('', views_api.project_list, name='project-list'),  # GET tous les projets & POST créer
    
#     # Route alternative pour créer un projet (POST seulement)
#     path('create/', views_api.create_project, name='project-create'),
    
#     # Route pour un projet spécifique (GET, PUT, DELETE)
#     path('<int:project_id>/', views_api.project_detail, name='project-detail'),
    
#     # Route pour les projets de l'utilisateur connecté
#     path('my-projects/', views_api.my_projects, name='my-projects'),
    
#     # Route pour debug
#     path('debug/', views_api.debug_projects, name='debug-projects'),
    
#     # Route pour les statistiques
#     path('stats/', views_api.dashboard_stats, name='stats'),
    
#     # Route pour la santé de l'API
#     path('health/', views_api.health_check, name='health-check'),
    
#     # Route pour rechercher
#     path('search/', views_api.search_projects, name='search-projects'),
    
#     # Route pour projets groupés par utilisateur
#     path('grouped/', views_api.ProjectsGroupedByUserView.as_view(), name='projects-grouped'),
    
#     # Route pour projets avec détails utilisateurs
#     path('with-users/', views_api.projects_with_users, name='projects-with-users'),
    
#     # Route pour le statut de l'API
#     path('status/', views_api.api_status, name='api-status'),
# ]

# print("=" * 70)
# print("✅ URLs simplifiées chargées!")
# print("📊 Endpoints disponibles:")
# print(f"   - GET /api/projects/ → Liste tous les projets")
# print(f"   - POST /api/projects/ → Créer un nouveau projet")
# print(f"   - POST /api/projects/create/ → Créer un projet (alternative)")
# print(f"   - GET /api/projects/my-projects/ → Mes projets (connecté)")
# print(f"   - GET /api/projects/<id>/ → Détails d'un projet")
# print(f"   - PUT /api/projects/<id>/ → Modifier un projet")
# print(f"   - DELETE /api/projects/<id>/ → Supprimer un projet")
# print("=" * 70)


# projects/urls_simple.py - VERSION COMPLÈTE
from django.urls import path
from . import views_api

urlpatterns = [
    # Route principale (GET & POST)
    path('', views_api.project_list, name='project-list'),
    
    # Routes de création
    path('create/', views_api.create_project, name='project-create'),
    path('create-auth/', views_api.create_project_authenticated_only, name='project-create-auth'),
    
    # Route pour les projets de l'utilisateur connecté
    path('my-projects/', views_api.my_projects, name='my-projects'),
    
    # Route pour un projet spécifique
    path('<int:project_id>/', views_api.project_detail, name='project-detail'),
    
    # Route pour debug
    path('debug/', views_api.debug_projects, name='debug-projects'),
    
    # Route pour les statistiques
    path('stats/', views_api.dashboard_stats, name='stats'),
    
    # Route pour la santé de l'API
    path('health/', views_api.health_check, name='health-check'),
    
    # Route pour rechercher
    path('search/', views_api.search_projects, name='search-projects'),
    
    # Route pour projets groupés par utilisateur
    path('grouped/', views_api.ProjectsGroupedByUserView.as_view(), name='projects-grouped'),
    
    # Route pour projets avec détails utilisateurs
    path('with-users/', views_api.projects_with_users, name='projects-with-users'),
    
    # Route pour le statut de l'API
    path('status/', views_api.api_status, name='api-status'),
]

print("=" * 70)
print("✅ URLs chargées!")
print("📊 Endpoints disponibles:")
print(f"   - GET  /api/projects/ → Liste tous les projets")
print(f"   - POST /api/projects/ → Créer un projet (auteur garanti)")
print(f"   - POST /api/projects/create/ → Création sécurisée")
print(f"   - POST /api/projects/create-auth/ → Création (connectés)")
print(f"   - GET  /api/projects/my-projects/ → Mes projets")
print(f"   - GET  /api/projects/<id>/ → Détails d'un projet")
print("=" * 70)