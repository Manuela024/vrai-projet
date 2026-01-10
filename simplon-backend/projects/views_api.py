# # projects/views_api.py
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import permissions
# from django.utils import timezone

# class ProjectsGroupedByUserView(APIView):
#     permission_classes = [permissions.AllowAny]
    
#     def get(self, request):
#         return Response({
#             'success': True,
#             'message': 'Endpoint projects-grouped fonctionnel',
#             'timestamp': timezone.now().isoformat(),
#             'demo_data': True,
#             'data': []
#         })

# def api_status(request):
#     from rest_framework.decorators import api_view
#     from rest_framework.response import Response
    
#     @api_view(['GET'])
#     def status_view(request):
#         return Response({
#             'status': 'online',
#             'timestamp': timezone.now().isoformat()
#         })
    
#     return status_view(request)

# def dashboard_stats(request):
#     from rest_framework.decorators import api_view
#     from rest_framework.response import Response
    
#     @api_view(['GET'])
#     def stats_view(request):
#         return Response({
#             'stats': 'endpoint_en_development',
#             'timestamp': timezone.now().isoformat()
#         })
    
#     return stats_view(request)


# # projects/views_api.py - CRÉEZ CE FICHIER
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import permissions
# from django.utils import timezone
# from rest_framework.decorators import api_view

# # Vérifier si la base de données est disponible
# try:
#     from .models import Project
#     from django.contrib.auth import get_user_model
#     User = get_user_model()
#     DB_AVAILABLE = True
#     print("✅ Base de données disponible")
# except Exception as e:
#     DB_AVAILABLE = False
#     print(f"⚠️ Base de données non disponible: {e}")

# class ProjectsGroupedByUserView(APIView):
#     """Endpoint principal pour React"""
#     permission_classes = [permissions.AllowAny]
    
#     def get(self, request):
#         try:
#             if not DB_AVAILABLE:
#                 return self.get_demo_data()
            
#             # Logique avec vraie base de données
#             users = User.objects.all()[:10]  # Limiter pour le test
            
#             result = []
#             for user in users:
#                 projects = Project.objects.filter(author=user)[:3]  # 3 projets max
                
#                 if projects.exists():
#                     user_data = {
#                         'id': user.id,
#                         'username': user.username,
#                         'email': user.email or '',
#                         'first_name': user.first_name or '',
#                         'last_name': user.last_name or '',
#                         'full_name': f"{user.first_name or ''} {user.last_name or ''}".strip() or user.username,
#                         'is_staff': user.is_staff,
#                         'is_active': user.is_active,
#                     }
                    
#                     projects_data = []
#                     for project in projects:
#                         projects_data.append({
#                             'id': project.id,
#                             'title': project.title,
#                             'description': project.description or '',
#                             'status': project.status,
#                             'technologies': project.technologies or '',
#                             'cohort': project.cohort or '',
#                             'created_at': project.created_at,
#                             'updated_at': project.updated_at,
#                         })
                    
#                     result.append({
#                         'user': user_data,
#                         'projects': projects_data,
#                         'projects_count': len(projects_data)
#                     })
            
#             return Response({
#                 'success': True,
#                 'count': len(result),
#                 'is_demo_mode': False,
#                 'data': result,
#                 'timestamp': timezone.now().isoformat()
#             })
            
#         except Exception as e:
#             print(f"❌ Erreur: {str(e)}")
#             return self.get_demo_data()
    
#     def get_demo_data(self):
#         """Données de démo"""
#         from datetime import timedelta
        
#         demo_data = [
#             {
#                 'user': {
#                     'id': 1,
#                     'username': 'simplon_2025001',
#                     'email': 'apprenant1@simplon.com',
#                     'first_name': 'Jean',
#                     'last_name': 'Dupont',
#                     'full_name': 'Jean Dupont',
#                     'is_staff': True,
#                     'is_active': True,
#                 },
#                 'projects': [
#                     {
#                         'id': 101,
#                         'title': 'Portfolio React',
#                         'description': 'Portfolio personnel avec React',
#                         'status': 'approved',
#                         'technologies': 'React, CSS, JavaScript',
#                         'cohort': 'DWWM-2024-01',
#                         'created_at': timezone.now() - timedelta(days=30),
#                         'updated_at': timezone.now() - timedelta(days=5),
#                     },
#                     {
#                         'id': 102,
#                         'title': 'API REST Django',
#                         'description': 'API pour gestion de projets',
#                         'status': 'pending',
#                         'technologies': 'Django, Django REST, PostgreSQL',
#                         'cohort': 'DWWM-2024-01',
#                         'created_at': timezone.now() - timedelta(days=20),
#                         'updated_at': timezone.now() - timedelta(days=2),
#                     }
#                 ],
#                 'projects_count': 2
#             },
#             {
#                 'user': {
#                     'id': 2,
#                     'username': 'simplon_2025002',
#                     'email': 'apprenant2@simplon.com',
#                     'first_name': 'Marie',
#                     'last_name': 'Martin',
#                     'full_name': 'Marie Martin',
#                     'is_staff': False,
#                     'is_active': True,
#                 },
#                 'projects': [
#                     {
#                         'id': 201,
#                         'title': 'E-commerce Vue.js',
#                         'description': 'Site e-commerce avec Vue.js',
#                         'status': 'approved',
#                         'technologies': 'Vue.js, Node.js, MongoDB',
#                         'cohort': 'CDA-2024-01',
#                         'created_at': timezone.now() - timedelta(days=25),
#                         'updated_at': timezone.now() - timedelta(days=3),
#                     }
#                 ],
#                 'projects_count': 1
#             }
#         ]
        
#         return Response({
#             'success': True,
#             'count': len(demo_data),
#             'is_demo_mode': True,
#             'data': demo_data,
#             'timestamp': timezone.now().isoformat(),
#             'message': 'Mode démonstration - Base de données non disponible'
#         })

# # Fonction pour l'état de l'API
# @api_view(['GET'])
# def api_status(request):
#     return Response({
#         'status': 'online',
#         'service': 'Simplon Projects API',
#         'version': '1.0.0',
#         'timestamp': timezone.now().isoformat(),
#         'database': 'connected' if DB_AVAILABLE else 'demo_mode',
#         'endpoints': [
#             '/api/projects-grouped/',
#             '/api/stats/',
#             '/api/status/',
#             '/api/test/',
#             '/api/auth/login/'
#         ]
#     })

# # Fonction pour les statistiques
# @api_view(['GET'])
# def dashboard_stats(request):
#     return Response({
#         'projects': {
#             'total': 15,
#             'approved': 8,
#             'pending': 5,
#             'rejected': 2
#         },
#         'users': {
#             'total': 3,
#             'with_projects': 3
#         },
#         'cohorts': {
#             'DWWM-2024-01': 10,
#             'CDA-2024-01': 5
#         },
#         'timestamp': timezone.now().isoformat(),
#         'is_demo': not DB_AVAILABLE
#     })

# # projects/views_api.py - VERSION CORRIGÉE POUR TOUS LES PROJETS
# from rest_framework.decorators import api_view, permission_classes
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework.permissions import AllowAny, IsAuthenticated
# from django.db.models import Count, Q
# from .models import Project
# from .serializers import ProjectSerializer, UserWithProjectsSerializer, ProjectWithUserSerializer
# from django.contrib.auth import get_user_model
# from django.utils import timezone

# User = get_user_model()

# # ============================================================================
# # VUES PRINCIPALES - CORRIGÉES POUR RETOURNER TOUS LES PROJETS
# # ============================================================================

# class ProjectsGroupedByUserView(APIView):
#     """
#     Vue qui retourne TOUS les projets groupés par utilisateur
#     """
#     permission_classes = [AllowAny]
    
#     def get(self, request):
#         try:
#             # Récupérer TOUS les utilisateurs avec leurs projets (même 0 projet)
#             users = User.objects.annotate(
#                 project_count=Count('projects')
#             ).order_by('-project_count')
            
#             # Sérialiser les données
#             serializer = UserWithProjectsSerializer(users, many=True)
            
#             # Compter tous les projets dans la base
#             total_in_db = Project.objects.count()
#             total_in_response = sum(user['project_count'] for user in serializer.data)
            
#             return Response({
#                 'debug': {
#                     'total_in_database': total_in_db,
#                     'total_in_response': total_in_response,
#                     'missing_projects': total_in_db - total_in_response if total_in_db > total_in_response else 0
#                 },
#                 'count': len(serializer.data),
#                 'users': serializer.data,
#                 'total_projects': total_in_db,
#                 'message': f'{total_in_db} projets groupés par {len(serializer.data)} utilisateurs'
#             })
            
#         except Exception as e:
#             return Response({
#                 'error': str(e),
#                 'message': 'Erreur lors de la récupération des données'
#             }, status=500)

# # ============================================================================
# # ENDPOINTS API PRINCIPAUX - CORRIGÉS
# # ============================================================================

# @api_view(['GET'])
# @permission_classes([AllowAny])
# def projects_with_users(request):
#     """Endpoint optimisé qui retourne TOUS les projets avec toutes les infos"""
#     try:
#         # 🎯 CORRECTION : Récupérer TOUS les projets sans filtre
#         projects = Project.objects.all().select_related('author')
        
#         # DEBUG: Afficher dans la console Django
#         print(f"🔍 projects_with_users: {projects.count()} projets trouvés")
        
#         # Utiliser le serializer qui inclut TOUS les champs
#         serializer = ProjectSerializer(projects, many=True)
        
#         # Vérifier le compte
#         total_in_db = Project.objects.count()
#         total_returned = len(serializer.data)
        
#         return Response({
#             'debug': {
#                 'total_in_database': total_in_db,
#                 'total_returned': total_returned,
#                 'all_projects_returned': total_in_db == total_returned
#             },
#             'count': total_returned,
#             'results': serializer.data,
#             'message': f'{total_returned}/{total_in_db} projets retournés'
#         })
        
#     except Exception as e:
#         return Response({
#             'error': str(e),
#             'message': 'Erreur API'
#         }, status=500)

# @api_view(['GET'])
# @permission_classes([AllowAny])
# def project_list(request):
#     """Retourne TOUTE la liste des projets avec les infos auteur"""
#     try:
#         # 🎯 CORRECTION : Récupérer TOUS les projets
#         projects = Project.objects.all().select_related('author')
        
#         # DEBUG IMPORTANT
#         print(f"🎯 project_list endpoint: {projects.count()} projets dans la requête")
        
#         # Vérifier les 5 premiers pour debug
#         for i, p in enumerate(projects[:5]):
#             print(f"  {i+1}. ID:{p.id} - {p.title} - Auteur: {p.author_name}")
        
#         # Utiliser le serializer
#         serializer = ProjectSerializer(projects, many=True)
        
#         # Log pour vérifier
#         print(f"📊 Serializer retourne: {len(serializer.data)} projets")
        
#         # 🎯 CORRECTION : Retourner directement le tableau (comme attendu par React)
#         # C'est CE QUI A ÉTÉ TESTÉ AVEC SUCCÈS : [{"id": 1, ...}, {"id": 2, ...}]
#         return Response(serializer.data)
        
#     except Exception as e:
#         print(f"❌ Erreur dans project_list: {e}")
#         return Response({
#             'error': str(e),
#             'message': 'Erreur lors de la récupération des projets'
#         }, status=500)

# @api_view(['GET'])
# @permission_classes([AllowAny])
# def project_list_all(request):
#     """Version debug : Retourne TOUS les projets avec infos détaillées"""
#     try:
#         projects = Project.objects.all()
        
#         data = []
#         for project in projects:
#             data.append({
#                 'id': project.id,
#                 'title': project.title,
#                 'author_id': project.author_id,
#                 'author_name': project.author_name,
#                 'author_email': project.author_email,
#                 'author_username': project.author_username,
#                 'status': project.status,
#                 'cohort': project.cohort,
#                 'created_at': project.created_at,
#                 'in_serializer': True  # Pour debug
#             })
        
#         return Response({
#             'total_in_database': projects.count(),
#             'total_returned': len(data),
#             'projects': data
#         })
        
#     except Exception as e:
#         return Response({'error': str(e)}, status=500)

# # ============================================================================
# # ENDPOINTS DE STATUT ET STATISTIQUES
# # ============================================================================

# @api_view(['GET'])
# @permission_classes([AllowAny])
# def api_status(request):
#     """Endpoint de statut de l'API avec debug"""
#     total_projects = Project.objects.count()
    
#     # Tester différents serializers
#     projects = Project.objects.all()
#     serializer = ProjectSerializer(projects, many=True)
    
#     return Response({
#         'status': 'online',
#         'service': 'Simplon Projects API',
#         'version': '1.0.0',
#         'timestamp': timezone.now().isoformat(),
#         'debug': {
#             'total_projects_in_db': total_projects,
#             'total_projects_in_serializer': len(serializer.data),
#             'serializer_fields': ProjectSerializer.Meta.fields if hasattr(ProjectSerializer.Meta, 'fields') else 'N/A'
#         },
#         'endpoints': {
#             'projects': '/api/projects/',
#             'projects_all': '/api/projects/all/',
#             'projects_grouped': '/api/projects-grouped/',
#             'projects_with_users': '/api/projects-with-users/',
#             'stats': '/api/stats/',
#             'status': '/api/status/'
#         },
#         'database': {
#             'projects_count': total_projects,
#             'users_count': User.objects.count()
#         }
#     })

# @api_view(['GET'])
# @permission_classes([AllowAny])
# def dashboard_stats(request):
#     """Statistiques pour le dashboard"""
#     try:
#         total_projects = Project.objects.count()
#         approved_projects = Project.objects.filter(status='approved').count()
#         pending_projects = Project.objects.filter(status='pending').count()
        
#         # Utilisateurs avec projets
#         users_with_projects = User.objects.annotate(
#             project_count=Count('projects')
#         ).filter(project_count__gt=0).count()
        
#         # Tous les utilisateurs
#         all_users = User.objects.annotate(
#             project_count=Count('projects')
#         ).order_by('-project_count')
        
#         # Projets par statut
#         status_stats = {}
#         for status_value, status_label in Project.STATUS_CHOICES:
#             count = Project.objects.filter(status=status_value).count()
#             if count > 0:
#                 status_stats[status_label] = count
        
#         # 5 projets récents
#         recent_projects = Project.objects.order_by('-created_at')[:5].values(
#             'id', 'title', 'author_name', 'author_email', 'status', 'created_at'
#         )
        
#         return Response({
#             'total_projects': total_projects,
#             'approved_projects': approved_projects,
#             'pending_projects': pending_projects,
#             'users_with_projects': users_with_projects,
#             'total_users': all_users.count(),
#             'status_distribution': status_stats,
#             'recent_projects': list(recent_projects),
#             'top_users': [
#                 {
#                     'id': user.id,
#                     'username': user.username,
#                     'full_name': f"{user.first_name or ''} {user.last_name or ''}".strip(),
#                     'project_count': user.project_count
#                 }
#                 for user in all_users[:5]
#             ]
#         })
        
#     except Exception as e:
#         return Response({'error': str(e)}, status=500)

# # ============================================================================
# # ENDPOINTS DE DEBUG ET DIAGNOSTIC
# # ============================================================================

# @api_view(['GET'])
# @permission_classes([AllowAny])
# def debug_projects(request):
#     """Endpoint de debug pour voir TOUS les projets"""
#     from django.db import connection
    
#     # 1. Requête SQL directe
#     with connection.cursor() as cursor:
#         cursor.execute("SELECT COUNT(*) as count, MIN(id), MAX(id) FROM projects_project")
#         sql_stats = cursor.fetchone()
    
#     # 2. Via ORM
#     projects_orm = Project.objects.all()
    
#     # 3. Via Serializer
#     serializer = ProjectSerializer(projects_orm, many=True)
    
#     # 4. Vérifier chaque projet
#     detailed_projects = []
#     for project in projects_orm:
#         detailed_projects.append({
#             'id': project.id,
#             'title': project.title,
#             'author_name': project.author_name,
#             'author_email': project.author_email,
#             'author_username': project.author_username,
#             'status': project.status,
#             'cohort': project.cohort,
#             'has_author_fields': all([
#                 project.author_name is not None,
#                 project.author_email is not None
#             ])
#         })
    
#     return Response({
#         'sql_direct': {
#             'total_projects': sql_stats[0],
#             'min_id': sql_stats[1],
#             'max_id': sql_stats[2]
#         },
#         'orm': {
#             'total_projects': projects_orm.count(),
#             'query': str(projects_orm.query)
#         },
#         'serializer': {
#             'total_projects': len(serializer.data),
#             'fields_count': len(serializer.data[0]) if serializer.data else 0,
#             'missing_projects': projects_orm.count() - len(serializer.data)
#         },
#         'projects_detailed': detailed_projects,
#         'diagnostic': {
#             'issue': '3/10 projects' if len(serializer.data) < projects_orm.count() else 'OK',
#             'solution': 'Check ProjectSerializer fields = "__all__"' if len(serializer.data) < projects_orm.count() else 'Serialization OK'
#         }
#     })



# # projects/views_api.py - CRÉEZ CE FICHIER
# from rest_framework.decorators import api_view, permission_classes
# from rest_framework.permissions import AllowAny
# from rest_framework.response import Response
# from django.utils import timezone
# from .models import Project
# from django.contrib.auth.models import User
# import json

# @api_view(['GET'])
# @permission_classes([AllowAny])
# def api_status(request):
#     """Statut de l'API"""
#     return Response({
#         'status': 'online',
#         'message': 'Projects API is running',
#         'timestamp': timezone.now().isoformat(),
#         'endpoints': {
#             'projects': 'http://localhost:8000/api/projects/projects/',
#             'projects_with_users': 'http://localhost:8000/api/projects/projects-with-users/',
#             'stats': 'http://localhost:8000/api/projects/stats/',
#             'test': 'http://localhost:8000/api/projects/test/'
#         }
#     })

# @api_view(['GET'])
# @permission_classes([AllowAny])
# def project_list(request):
#     """Retourne TOUS les projets depuis la base de données"""
#     try:
#         print("=" * 70)
#         print("🚀 DEMANDE DE PROJETS RECUE DANS project_list()")
#         print("=" * 70)
        
#         # Récupérer tous les projets depuis la base
#         projects = Project.objects.all().select_related('author').order_by('-created_at')
        
#         print(f"📊 {projects.count()} projets trouvés dans la base de données")
        
#         projects_data = []
#         for project in projects:
#             # Créer l'objet auteur
#             author_data = {}
#             if project.author:
#                 author_data = {
#                     'id': project.author.id,
#                     'username': project.author.username,
#                     'first_name': project.author.first_name or '',
#                     'last_name': project.author.last_name or '',
#                     'email': project.author.email or '',
#                     'is_staff': project.author.is_staff
#                 }
            
#             # Créer l'objet projet
#             project_data = {
#                 'id': project.id,
#                 'title': project.title or 'Sans titre',
#                 'description': project.description or '',
#                 'technologies': project.technologies or '',
#                 'category': getattr(project, 'category', 'web'),  # Adaptez selon votre modèle
#                 'status': project.status or 'draft',
#                 'cohort': project.cohort or '',
#                 'github_url': project.github_url or '',
#                 'demo_url': project.demo_url or '',
#                 'image': project.image.url if project.image else None,
#                 'created_at': project.created_at.isoformat() if project.created_at else None,
#                 'updated_at': project.updated_at.isoformat() if project.updated_at else None,
#                 'author': author_data,
#                 'author_name': project.author_name or (project.author.username if project.author else ''),
#                 'author_email': project.author_email or (project.author.email if project.author else ''),
#                 'views': getattr(project, 'views', 0),
#                 'likes': getattr(project, 'likes', 0),
#                 'is_published': project.status == 'published',
#                 'is_draft': project.status == 'draft',
#                 'is_rejected': project.status == 'rejected'
#             }
#             projects_data.append(project_data)
            
#             # Debug: Afficher le premier projet
#             if len(projects_data) == 1:
#                 print("🔍 PREMIER PROJET DANS LA BASE:")
#                 print(json.dumps(project_data, indent=2, ensure_ascii=False, default=str))
        
#         print(f"✅ {len(projects_data)} projets préparés pour l'API")
#         print("=" * 70)
        
#         return Response({
#             'status': 'success',
#             'count': len(projects_data),
#             'projects': projects_data,
#             'timestamp': timezone.now().isoformat(),
#             'database': 'PostgreSQL',
#             'source': 'projects/views_api.py'
#         })
        
#     except Exception as e:
#         print(f"❌ ERREUR dans project_list: {str(e)}")
#         import traceback
#         traceback.print_exc()
        
#         return Response({
#             'status': 'error',
#             'message': str(e),
#             'projects': [],
#             'error_details': str(e)
#         }, status=500)

# @api_view(['GET'])
# @permission_classes([AllowAny])
# def projects_with_users(request):
#     """Projets avec détails utilisateurs"""
#     try:
#         from users.views import users_with_projects
        
#         # Récupère via users_with_projects
#         from rest_framework.request import Request
#         from rest_framework.parsers import JSONParser
        
#         # Simuler une requête pour users_with_projects
#         class DummyRequest:
#             def __init__(self):
#                 self.user = request.user
#                 self.method = 'GET'
#                 self.query_params = {}
#                 self.META = request.META.copy()
#                 self.build_absolute_uri = request.build_absolute_uri
                
#         dummy_request = DummyRequest()
        
#         # Importer et exécuter
#         from users import views as users_views
#         response = users_views.users_with_projects(dummy_request)
        
#         return response
        
#     except Exception as e:
#         print(f"Erreur dans projects_with_users: {e}")
#         return Response({
#             'status': 'error',
#             'message': str(e)
#         }, status=500)

# @api_view(['GET'])
# @permission_classes([AllowAny])
# def dashboard_stats(request):
#     """Statistiques pour le dashboard"""
#     try:
#         total_projects = Project.objects.count()
#         total_users = User.objects.count()
        
#         return Response({
#             'status': 'success',
#             'timestamp': timezone.now().isoformat(),
#             'projects': {
#                 'total': total_projects,
#                 'by_status': {
#                     status[0]: Project.objects.filter(status=status[0]).count()
#                     for status in Project.STATUS_CHOICES
#                 }
#             },
#             'users': {
#                 'total': total_users,
#                 'with_projects': User.objects.filter(projects__isnull=False).distinct().count()
#             }
#         })
        
#     except Exception as e:
#         return Response({
#             'status': 'error',
#             'message': str(e)
#         }, status=500)

# # AJOUTEZ CES FONCTIONS MANQUANTES
# @api_view(['GET'])
# @permission_classes([AllowAny])
# def project_list_all(request):
#     """Version alternative pour debug"""
#     return project_list(request)

# @api_view(['GET'])
# @permission_classes([AllowAny])
# def debug_projects(request):
#     """Debug endpoint"""
#     projects = Project.objects.all()
#     return Response({
#         'debug': True,
#         'total_projects': projects.count(),
#         'sample': str(projects.first()) if projects.exists() else 'Aucun projet',
#         'fields': [f.name for f in Project._meta.get_fields()]
#     })

# # AJOUTEZ CETTE CLASSE
# from rest_framework.views import APIView
# from rest_framework import permissions

# class ProjectsGroupedByUserView(APIView):
#     """Groupe les projets par utilisateur"""
#     permission_classes = [permissions.AllowAny]
    
#     def get(self, request):
#         try:
#             users = User.objects.prefetch_related('projects').all()
            
#             grouped = []
#             for user in users:
#                 user_projects = []
#                 for project in user.projects.all():
#                     user_projects.append({
#                         'id': project.id,
#                         'title': project.title,
#                         'status': project.status,
#                         'created_at': project.created_at
#                     })
                
#                 if user_projects:  # Seulement ajouter les utilisateurs avec projets
#                     grouped.append({
#                         'user': {
#                             'id': user.id,
#                             'username': user.username,
#                             'email': user.email,
#                             'first_name': user.first_name,
#                             'last_name': user.last_name
#                         },
#                         'projects': user_projects,
#                         'projects_count': len(user_projects)
#                     })
            
#             return Response({
#                 'status': 'success',
#                 'users_count': len(grouped),
#                 'grouped_projects': grouped
#             })
            
#         except Exception as e:
#             return Response({
#                 'status': 'error',
#                 'message': str(e)
#             }, status=500)


# projects/views_api.py - VERSION COMPLÈTE ET FONCTIONNELLE
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status as drf_status
from django.utils import timezone
from django.contrib.auth.models import User
from .models import Project
import json
import logging

logger = logging.getLogger(__name__)

# ============================================================================
# FONCTIONS API SIMPLES
# ============================================================================

@api_view(['GET'])
@permission_classes([AllowAny])
def api_status(request):
    """Statut de l'API"""
    return Response({
        'status': 'online',
        'message': 'Projects API is running',
        'timestamp': timezone.now().isoformat(),
        'version': '2.0.0',
        'endpoints': {
            'projects_list': 'http://localhost:8000/api/projects/projects/',
            'projects_with_users': 'http://localhost:8000/api/projects/projects-with-users/',
            'stats': 'http://localhost:8000/api/projects/stats/',
            'test': 'http://localhost:8000/api/projects/test/',
            'debug': 'http://localhost:8000/api/projects/projects/debug/'
        }
    })

@api_view(['GET'])
@permission_classes([AllowAny])
def project_list(request):
    """Retourne TOUS les projets depuis la base de données - OPTIMISÉ"""
    try:
        print("=" * 70)
        print("🚀 DEMANDE DE PROJETS RECUE DANS project_list()")
        print(f"📡 URL: {request.build_absolute_uri()}")
        print(f"👤 Utilisateur: {request.user.username if request.user.is_authenticated else 'Anonyme'}")
        print("=" * 70)
        
        # Récupérer tous les projets depuis la base avec optimisation
        projects = Project.objects.all().select_related('author').order_by('-created_at')
        
        print(f"📊 {projects.count()} projets trouvés dans la base de données")
        
        # Si pas de projets, retourner liste vide
        if not projects.exists():
            print("⚠️ Aucun projet trouvé dans la base")
            return Response({
                'status': 'success',
                'count': 0,
                'projects': [],
                'timestamp': timezone.now().isoformat(),
                'message': 'Aucun projet trouvé'
            })
        
        projects_data = []
        for index, project in enumerate(projects):
            # Créer l'objet auteur
            author_data = {}
            if project.author:
                author_data = {
                    'id': project.author.id,
                    'username': project.author.username,
                    'first_name': project.author.first_name or '',
                    'last_name': project.author.last_name or '',
                    'email': project.author.email or '',
                    'is_staff': project.author.is_staff,
                    'is_active': project.author.is_active,
                    'date_joined': project.author.date_joined.isoformat() if project.author.date_joined else None
                }
            
            # Image URL
            image_url = None
            if project.image:
                image_url = request.build_absolute_uri(project.image.url)
            
            # Créer l'objet projet
            project_data = {
                'id': project.id,
                'title': project.title or 'Sans titre',
                'description': project.description or '',
                'technologies': project.technologies or '',
                'category': 'web',  # Valeur par défaut
                'status': project.status or 'draft',
                'cohort': project.cohort or '',
                'tags': project.tags or '',
                'github_url': project.github_url or '',
                'demo_url': project.demo_url or '',
                'image': image_url,
                'image_path': str(project.image) if project.image else None,
                'created_at': project.created_at.isoformat() if project.created_at else None,
                'updated_at': project.updated_at.isoformat() if project.updated_at else None,
                'author': author_data,
                'author_name': project.author_name or (project.author.get_full_name() if project.author else ''),
                'author_email': project.author_email or (project.author.email if project.author else ''),
                'author_username': project.author_username or (project.author.username if project.author else ''),
                'views': 0,  # Valeur par défaut si le champ n'existe pas
                'likes': 0,   # Valeur par défaut si le champ n'existe pas
                'is_published': project.status == 'published',
                'is_draft': project.status == 'draft',
                'is_approved': project.status == 'approved',
                'is_rejected': project.status == 'rejected',
                'is_pending': project.status == 'pending'
            }
            projects_data.append(project_data)
            
            # Debug: Afficher le premier projet
            if index == 0:
                print("🔍 PREMIER PROJET DANS LA BASE:")
                print(f"   ID: {project.id}")
                print(f"   Titre: {project.title}")
                print(f"   Auteur: {project.author_name if project.author_name else project.author.username if project.author else 'Inconnu'}")
                print(f"   Statut: {project.status}")
                print(f"   Technologies: {project.technologies[:50] if project.technologies else 'Aucune'}")
        
        print(f"✅ {len(projects_data)} projets préparés pour l'API")
        print("=" * 70)
        
        return Response({
            'status': 'success',
            'count': len(projects_data),
            'projects': projects_data,
            'timestamp': timezone.now().isoformat(),
            'database': 'PostgreSQL',
            'source': 'projects/views_api.py',
            'user': request.user.username if request.user.is_authenticated else 'anonymous'
        })
        
    except Exception as e:
        print(f"❌ ERREUR dans project_list: {str(e)}")
        import traceback
        traceback.print_exc()
        
        return Response({
            'status': 'error',
            'message': str(e),
            'projects': [],
            'timestamp': timezone.now().isoformat()
        }, status=500)

@api_view(['GET'])
@permission_classes([AllowAny])
def projects_with_users(request):
    """Projets avec détails utilisateurs complets"""
    try:
        print("🔄 Chargement des projets avec utilisateurs...")
        
        # Récupérer tous les utilisateurs avec leurs projets
        users = User.objects.prefetch_related('projects').filter(projects__isnull=False).distinct()
        
        users_data = []
        for user in users:
            user_projects = []
            for project in user.projects.all():
                # Image URL
                image_url = None
                if project.image:
                    image_url = request.build_absolute_uri(project.image.url)
                
                project_data = {
                    'id': project.id,
                    'title': project.title,
                    'description': project.description,
                    'status': project.status,
                    'technologies': project.technologies,
                    'cohort': project.cohort,
                    'image': image_url,
                    'created_at': project.created_at.isoformat() if project.created_at else None,
                    'updated_at': project.updated_at.isoformat() if project.updated_at else None,
                    'github_url': project.github_url,
                    'demo_url': project.demo_url
                }
                user_projects.append(project_data)
            
            users_data.append({
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'email': user.email,
                    'is_staff': user.is_staff,
                    'is_active': user.is_active
                },
                'projects': user_projects,
                'projects_count': len(user_projects)
            })
        
        print(f"✅ {len(users_data)} utilisateurs avec projets chargés")
        
        return Response({
            'status': 'success',
            'count': len(users_data),
            'users_with_projects': users_data,
            'total_projects': sum(len(user['projects']) for user in users_data),
            'timestamp': timezone.now().isoformat()
        })
        
    except Exception as e:
        print(f"❌ Erreur dans projects_with_users: {str(e)}")
        return Response({
            'status': 'error',
            'message': str(e),
            'users_with_projects': []
        }, status=500)

@api_view(['GET'])
@permission_classes([AllowAny])
def dashboard_stats(request):
    """Statistiques pour le dashboard"""
    try:
        print("📊 Calcul des statistiques...")
        
        # Statistiques projets
        total_projects = Project.objects.count()
        
        # Comptage par statut
        status_counts = {}
        for status_choice in Project.STATUS_CHOICES:
            status = status_choice[0]
            count = Project.objects.filter(status=status).count()
            status_counts[status] = count
        
        # Statistiques utilisateurs
        total_users = User.objects.count()
        active_users = User.objects.filter(is_active=True).count()
        users_with_projects = User.objects.filter(projects__isnull=False).distinct().count()
        
        # Projets récents (7 derniers jours)
        week_ago = timezone.now() - timezone.timedelta(days=7)
        recent_projects = Project.objects.filter(created_at__gte=week_ago).count()
        
        # Cohortes avec le plus de projets
        top_cohorts = list(Project.objects.exclude(cohort='').values('cohort').annotate(
            count=Count('id')
        ).order_by('-count')[:5])
        
        print(f"✅ Statistiques calculées: {total_projects} projets, {total_users} utilisateurs")
        
        return Response({
            'status': 'success',
            'timestamp': timezone.now().isoformat(),
            'projects': {
                'total': total_projects,
                'by_status': status_counts,
                'recent_week': recent_projects,
                'top_cohorts': top_cohorts
            },
            'users': {
                'total': total_users,
                'active': active_users,
                'with_projects': users_with_projects,
                'percentage_with_projects': round((users_with_projects / total_users * 100), 2) if total_users > 0 else 0
            },
            'system': {
                'timestamp': timezone.now().isoformat(),
                'api_version': '2.0.0',
                'database': 'PostgreSQL'
            }
        })
        
    except Exception as e:
        print(f"❌ Erreur dans dashboard_stats: {str(e)}")
        return Response({
            'status': 'error',
            'message': str(e),
            'timestamp': timezone.now().isoformat()
        }, status=500)

@api_view(['GET'])
@permission_classes([AllowAny])
def debug_projects(request):
    """Debug endpoint pour voir la structure des données"""
    try:
        projects = Project.objects.all()
        
        # Récupérer les champs du modèle
        model_fields = [f.name for f in Project._meta.get_fields()]
        
        # Premier projet pour échantillon
        sample_project = None
        if projects.exists():
            first_project = projects.first()
            sample_project = {
                'id': first_project.id,
                'title': first_project.title,
                'author': str(first_project.author),
                'author_name': first_project.author_name,
                'author_email': first_project.author_email,
                'status': first_project.status,
                'technologies': first_project.technologies,
                'cohort': first_project.cohort,
                'has_image': bool(first_project.image)
            }
        
        return Response({
            'debug': True,
            'total_projects': projects.count(),
            'sample': sample_project,
            'fields': model_fields,
            'status_choices': Project.STATUS_CHOICES,
            'timestamp': timezone.now().isoformat(),
            'endpoints': {
                'main': '/api/projects/projects/',
                'with_users': '/api/projects/projects-with-users/',
                'stats': '/api/projects/stats/',
                'debug': '/api/projects/projects/debug/'
            }
        })
        
    except Exception as e:
        return Response({
            'debug': False,
            'error': str(e),
            'timestamp': timezone.now().isoformat()
        }, status=500)

# ============================================================================
# VUES DE CLASSE
# ============================================================================

from django.db.models import Count

class ProjectsGroupedByUserView(APIView):
    """Groupe les projets par utilisateur"""
    permission_classes = [AllowAny]
    
    def get(self, request):
        try:
            print("👥 Groupement des projets par utilisateur...")
            
            # Utilisateurs avec leurs projets
            users = User.objects.prefetch_related('projects').annotate(
                project_count=Count('projects')
            ).filter(project_count__gt=0).order_by('-project_count')
            
            grouped_data = []
            for user in users:
                user_projects = []
                for project in user.projects.all():
                    # Image URL
                    image_url = None
                    if project.image:
                        image_url = request.build_absolute_uri(project.image.url)
                    
                    project_data = {
                        'id': project.id,
                        'title': project.title,
                        'description': project.description[:100] + '...' if project.description and len(project.description) > 100 else project.description,
                        'status': project.status,
                        'technologies': project.technologies,
                        'image': image_url,
                        'created_at': project.created_at.isoformat() if project.created_at else None,
                        'updated_at': project.updated_at.isoformat() if project.updated_at else None
                    }
                    user_projects.append(project_data)
                
                grouped_data.append({
                    'user': {
                        'id': user.id,
                        'username': user.username,
                        'full_name': user.get_full_name(),
                        'email': user.email,
                        'is_staff': user.is_staff,
                        'project_count': user.project_count
                    },
                    'projects': user_projects,
                    'projects_count': len(user_projects)
                })
            
            print(f"✅ {len(grouped_data)} utilisateurs groupés avec projets")
            
            return Response({
                'status': 'success',
                'users_count': len(grouped_data),
                'total_projects': sum(len(user['projects']) for user in grouped_data),
                'grouped_projects': grouped_data,
                'timestamp': timezone.now().isoformat()
            })
            
        except Exception as e:
            print(f"❌ Erreur dans ProjectsGroupedByUserView: {str(e)}")
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=500)

# ============================================================================
# VUES DE SÉCURITÉ ET AUTHENTIFICATION
# ============================================================================

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_projects(request):
    """Projets de l'utilisateur connecté"""
    try:
        user = request.user
        projects = Project.objects.filter(author=user).select_related('author').order_by('-created_at')
        
        projects_data = []
        for project in projects:
            image_url = None
            if project.image:
                image_url = request.build_absolute_uri(project.image.url)
            
            project_data = {
                'id': project.id,
                'title': project.title,
                'description': project.description,
                'status': project.status,
                'technologies': project.technologies,
                'cohort': project.cohort,
                'image': image_url,
                'created_at': project.created_at.isoformat() if project.created_at else None,
                'updated_at': project.updated_at.isoformat() if project.updated_at else None,
                'github_url': project.github_url,
                'demo_url': project.demo_url
            }
            projects_data.append(project_data)
        
        return Response({
            'status': 'success',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email
            },
            'projects': projects_data,
            'count': len(projects_data),
            'timestamp': timezone.now().isoformat()
        })
        
    except Exception as e:
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=500)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_project(request):
    """Créer un nouveau projet"""
    try:
        data = request.data
        
        # Validation basique
        required_fields = ['title', 'description', 'technologies']
        for field in required_fields:
            if field not in data or not data[field]:
                return Response({
                    'status': 'error',
                    'message': f'Le champ "{field}" est requis'
                }, status=400)
        
        # Créer le projet
        project = Project.objects.create(
            title=data['title'],
            description=data['description'],
            technologies=data['technologies'],
            author=request.user,
            status=data.get('status', 'draft'),
            cohort=data.get('cohort', ''),
            github_url=data.get('github_url', ''),
            demo_url=data.get('demo_url', ''),
            tags=data.get('tags', '')
        )
        
        # Gérer l'image si fournie
        if 'image' in request.FILES:
            project.image = request.FILES['image']
            project.save()
        
        return Response({
            'status': 'success',
            'message': 'Projet créé avec succès',
            'project': {
                'id': project.id,
                'title': project.title,
                'status': project.status,
                'created_at': project.created_at.isoformat()
            }
        }, status=201)
        
    except Exception as e:
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=500)

# ============================================================================
# VUES UTILITAIRES
# ============================================================================

@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    """Vérification de santé de l'API"""
    try:
        # Vérifier la base de données
        project_count = Project.objects.count()
        user_count = User.objects.count()
        
        return Response({
            'status': 'healthy',
            'database': {
                'projects': project_count,
                'users': user_count,
                'connected': True
            },
            'timestamp': timezone.now().isoformat(),
            'version': '2.0.0'
        })
        
    except Exception as e:
        return Response({
            'status': 'unhealthy',
            'error': str(e),
            'timestamp': timezone.now().isoformat()
        }, status=500)

@api_view(['GET'])
@permission_classes([AllowAny])
def search_projects(request):
    """Recherche de projets"""
    try:
        query = request.GET.get('q', '')
        status_filter = request.GET.get('status', '')
        cohort_filter = request.GET.get('cohort', '')
        technology_filter = request.GET.get('technology', '')
        
        # Construire la requête
        from django.db.models import Q
        
        filters = Q()
        
        if query:
            filters &= (
                Q(title__icontains=query) |
                Q(description__icontains=query) |
                Q(technologies__icontains=query) |
                Q(tags__icontains=query) |
                Q(cohort__icontains=query) |
                Q(author_name__icontains=query)
            )
        
        if status_filter:
            filters &= Q(status=status_filter)
        
        if cohort_filter:
            filters &= Q(cohort__icontains=cohort_filter)
        
        if technology_filter:
            filters &= Q(technologies__icontains=technology_filter)
        
        # Exécuter la requête
        projects = Project.objects.filter(filters).select_related('author').order_by('-created_at')
        
        # Transformer en format API
        projects_data = []
        for project in projects:
            image_url = None
            if project.image:
                image_url = request.build_absolute_uri(project.image.url)
            
            project_data = {
                'id': project.id,
                'title': project.title,
                'description': project.description[:200] + '...' if project.description and len(project.description) > 200 else project.description,
                'status': project.status,
                'technologies': project.technologies,
                'cohort': project.cohort,
                'image': image_url,
                'author_name': project.author_name or (project.author.username if project.author else ''),
                'created_at': project.created_at.isoformat() if project.created_at else None
            }
            projects_data.append(project_data)
        
        return Response({
            'status': 'success',
            'query': query,
            'filters': {
                'status': status_filter,
                'cohort': cohort_filter,
                'technology': technology_filter
            },
            'count': len(projects_data),
            'projects': projects_data,
            'timestamp': timezone.now().isoformat()
        })
        
    except Exception as e:
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=500)

# ============================================================================
# ALIAS POUR LA COMPATIBILITÉ
# ============================================================================

# Alias pour éviter l'erreur de double wrapping
project_list_all = project_list

print("=" * 70)
print("✅ projects/views_api.py chargé avec succès!")
print(f"📊 Endpoints disponibles:")
print(f"   - project_list: {len(Project.objects.all())} projets dans la base")
print("=" * 70)