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


# # projects/views_api.py - VERSION COMPLÈTE ET FONCTIONNELLE
# from rest_framework.decorators import api_view, permission_classes
# from rest_framework.permissions import AllowAny, IsAuthenticated
# from rest_framework.response import Response
# from rest_framework.views import APIView
# from rest_framework import status as drf_status
# from django.utils import timezone
# from django.contrib.auth.models import User
# from .models import Project
# import json
# import logging

# logger = logging.getLogger(__name__)

# # ============================================================================
# # FONCTIONS API SIMPLES
# # ============================================================================

# @api_view(['GET'])
# @permission_classes([AllowAny])
# def api_status(request):
#     """Statut de l'API"""
#     return Response({
#         'status': 'online',
#         'message': 'Projects API is running',
#         'timestamp': timezone.now().isoformat(),
#         'version': '2.0.0',
#         'endpoints': {
#             'projects_list': 'http://localhost:8000/api/projects/projects/',
#             'projects_with_users': 'http://localhost:8000/api/projects/projects-with-users/',
#             'stats': 'http://localhost:8000/api/projects/stats/',
#             'test': 'http://localhost:8000/api/projects/test/',
#             'debug': 'http://localhost:8000/api/projects/projects/debug/'
#         }
#     })

# @api_view(['GET'])
# @permission_classes([AllowAny])
# def project_list(request):
#     """Retourne TOUS les projets depuis la base de données - OPTIMISÉ"""
#     try:
#         print("=" * 70)
#         print("🚀 DEMANDE DE PROJETS RECUE DANS project_list()")
#         print(f"📡 URL: {request.build_absolute_uri()}")
#         print(f"👤 Utilisateur: {request.user.username if request.user.is_authenticated else 'Anonyme'}")
#         print("=" * 70)
        
#         # Récupérer tous les projets depuis la base avec optimisation
#         projects = Project.objects.all().select_related('author').order_by('-created_at')
        
#         print(f"📊 {projects.count()} projets trouvés dans la base de données")
        
#         # Si pas de projets, retourner liste vide
#         if not projects.exists():
#             print("⚠️ Aucun projet trouvé dans la base")
#             return Response({
#                 'status': 'success',
#                 'count': 0,
#                 'projects': [],
#                 'timestamp': timezone.now().isoformat(),
#                 'message': 'Aucun projet trouvé'
#             })
        
#         projects_data = []
#         for index, project in enumerate(projects):
#             # Créer l'objet auteur
#             author_data = {}
#             if project.author:
#                 author_data = {
#                     'id': project.author.id,
#                     'username': project.author.username,
#                     'first_name': project.author.first_name or '',
#                     'last_name': project.author.last_name or '',
#                     'email': project.author.email or '',
#                     'is_staff': project.author.is_staff,
#                     'is_active': project.author.is_active,
#                     'date_joined': project.author.date_joined.isoformat() if project.author.date_joined else None
#                 }
            
#             # Image URL
#             image_url = None
#             if project.image:
#                 image_url = request.build_absolute_uri(project.image.url)
            
#             # Créer l'objet projet
#             project_data = {
#                 'id': project.id,
#                 'title': project.title or 'Sans titre',
#                 'description': project.description or '',
#                 'technologies': project.technologies or '',
#                 'category': 'web',  # Valeur par défaut
#                 'status': project.status or 'draft',
#                 'cohort': project.cohort or '',
#                 'tags': project.tags or '',
#                 'github_url': project.github_url or '',
#                 'demo_url': project.demo_url or '',
#                 'image': image_url,
#                 'image_path': str(project.image) if project.image else None,
#                 'created_at': project.created_at.isoformat() if project.created_at else None,
#                 'updated_at': project.updated_at.isoformat() if project.updated_at else None,
#                 'author': author_data,
#                 'author_name': project.author_name or (project.author.get_full_name() if project.author else ''),
#                 'author_email': project.author_email or (project.author.email if project.author else ''),
#                 'author_username': project.author_username or (project.author.username if project.author else ''),
#                 'views': 0,  # Valeur par défaut si le champ n'existe pas
#                 'likes': 0,   # Valeur par défaut si le champ n'existe pas
#                 'is_published': project.status == 'published',
#                 'is_draft': project.status == 'draft',
#                 'is_approved': project.status == 'approved',
#                 'is_rejected': project.status == 'rejected',
#                 'is_pending': project.status == 'pending'
#             }
#             projects_data.append(project_data)
            
#             # Debug: Afficher le premier projet
#             if index == 0:
#                 print("🔍 PREMIER PROJET DANS LA BASE:")
#                 print(f"   ID: {project.id}")
#                 print(f"   Titre: {project.title}")
#                 print(f"   Auteur: {project.author_name if project.author_name else project.author.username if project.author else 'Inconnu'}")
#                 print(f"   Statut: {project.status}")
#                 print(f"   Technologies: {project.technologies[:50] if project.technologies else 'Aucune'}")
        
#         print(f"✅ {len(projects_data)} projets préparés pour l'API")
#         print("=" * 70)
        
#         return Response({
#             'status': 'success',
#             'count': len(projects_data),
#             'projects': projects_data,
#             'timestamp': timezone.now().isoformat(),
#             'database': 'PostgreSQL',
#             'source': 'projects/views_api.py',
#             'user': request.user.username if request.user.is_authenticated else 'anonymous'
#         })
        
#     except Exception as e:
#         print(f"❌ ERREUR dans project_list: {str(e)}")
#         import traceback
#         traceback.print_exc()
        
#         return Response({
#             'status': 'error',
#             'message': str(e),
#             'projects': [],
#             'timestamp': timezone.now().isoformat()
#         }, status=500)

# @api_view(['GET'])
# @permission_classes([AllowAny])
# def projects_with_users(request):
#     """Projets avec détails utilisateurs complets"""
#     try:
#         print("🔄 Chargement des projets avec utilisateurs...")
        
#         # Récupérer tous les utilisateurs avec leurs projets
#         users = User.objects.prefetch_related('projects').filter(projects__isnull=False).distinct()
        
#         users_data = []
#         for user in users:
#             user_projects = []
#             for project in user.projects.all():
#                 # Image URL
#                 image_url = None
#                 if project.image:
#                     image_url = request.build_absolute_uri(project.image.url)
                
#                 project_data = {
#                     'id': project.id,
#                     'title': project.title,
#                     'description': project.description,
#                     'status': project.status,
#                     'technologies': project.technologies,
#                     'cohort': project.cohort,
#                     'image': image_url,
#                     'created_at': project.created_at.isoformat() if project.created_at else None,
#                     'updated_at': project.updated_at.isoformat() if project.updated_at else None,
#                     'github_url': project.github_url,
#                     'demo_url': project.demo_url
#                 }
#                 user_projects.append(project_data)
            
#             users_data.append({
#                 'user': {
#                     'id': user.id,
#                     'username': user.username,
#                     'first_name': user.first_name,
#                     'last_name': user.last_name,
#                     'email': user.email,
#                     'is_staff': user.is_staff,
#                     'is_active': user.is_active
#                 },
#                 'projects': user_projects,
#                 'projects_count': len(user_projects)
#             })
        
#         print(f"✅ {len(users_data)} utilisateurs avec projets chargés")
        
#         return Response({
#             'status': 'success',
#             'count': len(users_data),
#             'users_with_projects': users_data,
#             'total_projects': sum(len(user['projects']) for user in users_data),
#             'timestamp': timezone.now().isoformat()
#         })
        
#     except Exception as e:
#         print(f"❌ Erreur dans projects_with_users: {str(e)}")
#         return Response({
#             'status': 'error',
#             'message': str(e),
#             'users_with_projects': []
#         }, status=500)

# @api_view(['GET'])
# @permission_classes([AllowAny])
# def dashboard_stats(request):
#     """Statistiques pour le dashboard"""
#     try:
#         print("📊 Calcul des statistiques...")
        
#         # Statistiques projets
#         total_projects = Project.objects.count()
        
#         # Comptage par statut
#         status_counts = {}
#         for status_choice in Project.STATUS_CHOICES:
#             status = status_choice[0]
#             count = Project.objects.filter(status=status).count()
#             status_counts[status] = count
        
#         # Statistiques utilisateurs
#         total_users = User.objects.count()
#         active_users = User.objects.filter(is_active=True).count()
#         users_with_projects = User.objects.filter(projects__isnull=False).distinct().count()
        
#         # Projets récents (7 derniers jours)
#         week_ago = timezone.now() - timezone.timedelta(days=7)
#         recent_projects = Project.objects.filter(created_at__gte=week_ago).count()
        
#         # Cohortes avec le plus de projets
#         top_cohorts = list(Project.objects.exclude(cohort='').values('cohort').annotate(
#             count=Count('id')
#         ).order_by('-count')[:5])
        
#         print(f"✅ Statistiques calculées: {total_projects} projets, {total_users} utilisateurs")
        
#         return Response({
#             'status': 'success',
#             'timestamp': timezone.now().isoformat(),
#             'projects': {
#                 'total': total_projects,
#                 'by_status': status_counts,
#                 'recent_week': recent_projects,
#                 'top_cohorts': top_cohorts
#             },
#             'users': {
#                 'total': total_users,
#                 'active': active_users,
#                 'with_projects': users_with_projects,
#                 'percentage_with_projects': round((users_with_projects / total_users * 100), 2) if total_users > 0 else 0
#             },
#             'system': {
#                 'timestamp': timezone.now().isoformat(),
#                 'api_version': '2.0.0',
#                 'database': 'PostgreSQL'
#             }
#         })
        
#     except Exception as e:
#         print(f"❌ Erreur dans dashboard_stats: {str(e)}")
#         return Response({
#             'status': 'error',
#             'message': str(e),
#             'timestamp': timezone.now().isoformat()
#         }, status=500)

# @api_view(['GET'])
# @permission_classes([AllowAny])
# def debug_projects(request):
#     """Debug endpoint pour voir la structure des données"""
#     try:
#         projects = Project.objects.all()
        
#         # Récupérer les champs du modèle
#         model_fields = [f.name for f in Project._meta.get_fields()]
        
#         # Premier projet pour échantillon
#         sample_project = None
#         if projects.exists():
#             first_project = projects.first()
#             sample_project = {
#                 'id': first_project.id,
#                 'title': first_project.title,
#                 'author': str(first_project.author),
#                 'author_name': first_project.author_name,
#                 'author_email': first_project.author_email,
#                 'status': first_project.status,
#                 'technologies': first_project.technologies,
#                 'cohort': first_project.cohort,
#                 'has_image': bool(first_project.image)
#             }
        
#         return Response({
#             'debug': True,
#             'total_projects': projects.count(),
#             'sample': sample_project,
#             'fields': model_fields,
#             'status_choices': Project.STATUS_CHOICES,
#             'timestamp': timezone.now().isoformat(),
#             'endpoints': {
#                 'main': '/api/projects/projects/',
#                 'with_users': '/api/projects/projects-with-users/',
#                 'stats': '/api/projects/stats/',
#                 'debug': '/api/projects/projects/debug/'
#             }
#         })
        
#     except Exception as e:
#         return Response({
#             'debug': False,
#             'error': str(e),
#             'timestamp': timezone.now().isoformat()
#         }, status=500)

# # ============================================================================
# # VUES DE CLASSE
# # ============================================================================

# from django.db.models import Count

# class ProjectsGroupedByUserView(APIView):
#     """Groupe les projets par utilisateur"""
#     permission_classes = [AllowAny]
    
#     def get(self, request):
#         try:
#             print("👥 Groupement des projets par utilisateur...")
            
#             # Utilisateurs avec leurs projets
#             users = User.objects.prefetch_related('projects').annotate(
#                 project_count=Count('projects')
#             ).filter(project_count__gt=0).order_by('-project_count')
            
#             grouped_data = []
#             for user in users:
#                 user_projects = []
#                 for project in user.projects.all():
#                     # Image URL
#                     image_url = None
#                     if project.image:
#                         image_url = request.build_absolute_uri(project.image.url)
                    
#                     project_data = {
#                         'id': project.id,
#                         'title': project.title,
#                         'description': project.description[:100] + '...' if project.description and len(project.description) > 100 else project.description,
#                         'status': project.status,
#                         'technologies': project.technologies,
#                         'image': image_url,
#                         'created_at': project.created_at.isoformat() if project.created_at else None,
#                         'updated_at': project.updated_at.isoformat() if project.updated_at else None
#                     }
#                     user_projects.append(project_data)
                
#                 grouped_data.append({
#                     'user': {
#                         'id': user.id,
#                         'username': user.username,
#                         'full_name': user.get_full_name(),
#                         'email': user.email,
#                         'is_staff': user.is_staff,
#                         'project_count': user.project_count
#                     },
#                     'projects': user_projects,
#                     'projects_count': len(user_projects)
#                 })
            
#             print(f"✅ {len(grouped_data)} utilisateurs groupés avec projets")
            
#             return Response({
#                 'status': 'success',
#                 'users_count': len(grouped_data),
#                 'total_projects': sum(len(user['projects']) for user in grouped_data),
#                 'grouped_projects': grouped_data,
#                 'timestamp': timezone.now().isoformat()
#             })
            
#         except Exception as e:
#             print(f"❌ Erreur dans ProjectsGroupedByUserView: {str(e)}")
#             return Response({
#                 'status': 'error',
#                 'message': str(e)
#             }, status=500)

# # ============================================================================
# # VUES DE SÉCURITÉ ET AUTHENTIFICATION
# # ============================================================================

# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def my_projects(request):
#     """Projets de l'utilisateur connecté"""
#     try:
#         user = request.user
#         projects = Project.objects.filter(author=user).select_related('author').order_by('-created_at')
        
#         projects_data = []
#         for project in projects:
#             image_url = None
#             if project.image:
#                 image_url = request.build_absolute_uri(project.image.url)
            
#             project_data = {
#                 'id': project.id,
#                 'title': project.title,
#                 'description': project.description,
#                 'status': project.status,
#                 'technologies': project.technologies,
#                 'cohort': project.cohort,
#                 'image': image_url,
#                 'created_at': project.created_at.isoformat() if project.created_at else None,
#                 'updated_at': project.updated_at.isoformat() if project.updated_at else None,
#                 'github_url': project.github_url,
#                 'demo_url': project.demo_url
#             }
#             projects_data.append(project_data)
        
#         return Response({
#             'status': 'success',
#             'user': {
#                 'id': user.id,
#                 'username': user.username,
#                 'email': user.email
#             },
#             'projects': projects_data,
#             'count': len(projects_data),
#             'timestamp': timezone.now().isoformat()
#         })
        
#     except Exception as e:
#         return Response({
#             'status': 'error',
#             'message': str(e)
#         }, status=500)

# @api_view(['POST'])
# @permission_classes([IsAuthenticated])
# def create_project(request):
#     """Créer un nouveau projet"""
#     try:
#         data = request.data
        
#         # Validation basique
#         required_fields = ['title', 'description', 'technologies']
#         for field in required_fields:
#             if field not in data or not data[field]:
#                 return Response({
#                     'status': 'error',
#                     'message': f'Le champ "{field}" est requis'
#                 }, status=400)
        
#         # Créer le projet
#         project = Project.objects.create(
#             title=data['title'],
#             description=data['description'],
#             technologies=data['technologies'],
#             author=request.user,
#             status=data.get('status', 'draft'),
#             cohort=data.get('cohort', ''),
#             github_url=data.get('github_url', ''),
#             demo_url=data.get('demo_url', ''),
#             tags=data.get('tags', '')
#         )
        
#         # Gérer l'image si fournie
#         if 'image' in request.FILES:
#             project.image = request.FILES['image']
#             project.save()
        
#         return Response({
#             'status': 'success',
#             'message': 'Projet créé avec succès',
#             'project': {
#                 'id': project.id,
#                 'title': project.title,
#                 'status': project.status,
#                 'created_at': project.created_at.isoformat()
#             }
#         }, status=201)
        
#     except Exception as e:
#         return Response({
#             'status': 'error',
#             'message': str(e)
#         }, status=500)

# # ============================================================================
# # VUES UTILITAIRES
# # ============================================================================

# @api_view(['GET'])
# @permission_classes([AllowAny])
# def health_check(request):
#     """Vérification de santé de l'API"""
#     try:
#         # Vérifier la base de données
#         project_count = Project.objects.count()
#         user_count = User.objects.count()
        
#         return Response({
#             'status': 'healthy',
#             'database': {
#                 'projects': project_count,
#                 'users': user_count,
#                 'connected': True
#             },
#             'timestamp': timezone.now().isoformat(),
#             'version': '2.0.0'
#         })
        
#     except Exception as e:
#         return Response({
#             'status': 'unhealthy',
#             'error': str(e),
#             'timestamp': timezone.now().isoformat()
#         }, status=500)

# @api_view(['GET'])
# @permission_classes([AllowAny])
# def search_projects(request):
#     """Recherche de projets"""
#     try:
#         query = request.GET.get('q', '')
#         status_filter = request.GET.get('status', '')
#         cohort_filter = request.GET.get('cohort', '')
#         technology_filter = request.GET.get('technology', '')
        
#         # Construire la requête
#         from django.db.models import Q
        
#         filters = Q()
        
#         if query:
#             filters &= (
#                 Q(title__icontains=query) |
#                 Q(description__icontains=query) |
#                 Q(technologies__icontains=query) |
#                 Q(tags__icontains=query) |
#                 Q(cohort__icontains=query) |
#                 Q(author_name__icontains=query)
#             )
        
#         if status_filter:
#             filters &= Q(status=status_filter)
        
#         if cohort_filter:
#             filters &= Q(cohort__icontains=cohort_filter)
        
#         if technology_filter:
#             filters &= Q(technologies__icontains=technology_filter)
        
#         # Exécuter la requête
#         projects = Project.objects.filter(filters).select_related('author').order_by('-created_at')
        
#         # Transformer en format API
#         projects_data = []
#         for project in projects:
#             image_url = None
#             if project.image:
#                 image_url = request.build_absolute_uri(project.image.url)
            
#             project_data = {
#                 'id': project.id,
#                 'title': project.title,
#                 'description': project.description[:200] + '...' if project.description and len(project.description) > 200 else project.description,
#                 'status': project.status,
#                 'technologies': project.technologies,
#                 'cohort': project.cohort,
#                 'image': image_url,
#                 'author_name': project.author_name or (project.author.username if project.author else ''),
#                 'created_at': project.created_at.isoformat() if project.created_at else None
#             }
#             projects_data.append(project_data)
        
#         return Response({
#             'status': 'success',
#             'query': query,
#             'filters': {
#                 'status': status_filter,
#                 'cohort': cohort_filter,
#                 'technology': technology_filter
#             },
#             'count': len(projects_data),
#             'projects': projects_data,
#             'timestamp': timezone.now().isoformat()
#         })
        
#     except Exception as e:
#         return Response({
#             'status': 'error',
#             'message': str(e)
#         }, status=500)

# # ============================================================================
# # ALIAS POUR LA COMPATIBILITÉ
# # ============================================================================

# # Alias pour éviter l'erreur de double wrapping
# project_list_all = project_list

# print("=" * 70)
# print("✅ projects/views_api.py chargé avec succès!")
# print(f"📊 Endpoints disponibles:")
# print(f"   - project_list: {len(Project.objects.all())} projets dans la base")
# print("=" * 70)

# # ============================================================================
# # VUES CRÉATION ET MODIFICATION (AJOUTEZ CES FONCTIONS)
# # ============================================================================

# @api_view(['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'])
# @permission_classes([AllowAny])  # Temporairement AllowAny pour tests
# def project_detail(request, project_id=None):
#     """Gérer un projet spécifique (GET, PUT, DELETE)"""
    
#     if request.method == 'OPTIONS':
#         return Response({
#             'methods': ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
#         })
    
#     elif request.method == 'GET':
#         # Récupérer un projet spécifique
#         try:
#             project = Project.objects.get(id=project_id)
#             image_url = None
#             if project.image:
#                 image_url = request.build_absolute_uri(project.image.url)
            
#             return Response({
#                 'id': project.id,
#                 'title': project.title,
#                 'description': project.description,
#                 'technologies': project.technologies,
#                 'status': project.status,
#                 'cohort': project.cohort,
#                 'tags': project.tags,
#                 'github_url': project.github_url,
#                 'demo_url': project.demo_url,
#                 'image': image_url,
#                 'created_at': project.created_at.isoformat() if project.created_at else None,
#                 'updated_at': project.updated_at.isoformat() if project.updated_at else None,
#                 'author': {
#                     'id': project.author.id if project.author else None,
#                     'username': project.author.username if project.author else None,
#                     'name': project.author.get_full_name() if project.author else None
#                 } if project.author else None
#             })
#         except Project.DoesNotExist:
#             return Response({'error': 'Projet non trouvé'}, status=404)
    
#     elif request.method == 'POST':
#         # Créer un nouveau projet
#         try:
#             print("🚀 CRÉATION D'UN PROJET - POST reçu")
#             print(f"📦 Content-Type: {request.content_type}")
#             print(f"👤 Utilisateur: {request.user}")
#             print(f"📁 Fichiers: {list(request.FILES.keys())}")
#             print(f"📋 Données: {dict(request.POST)}")
            
#             # Créer le projet
#             project = Project.objects.create(
#                 title=request.POST.get('title', 'Nouveau projet'),
#                 description=request.POST.get('description', ''),
#                 technologies=request.POST.get('technologies', ''),
#                 cohort=request.POST.get('cohort', ''),
#                 tags=request.POST.get('tags', ''),
#                 github_url=request.POST.get('github_url', ''),
#                 demo_url=request.POST.get('demo_url', ''),
#                 status='draft',
#                 author=request.user if request.user.is_authenticated else None,
#                 author_name=request.POST.get('author_name', ''),
#                 author_email=request.POST.get('author_email', '')
#             )
            
#             # Gérer l'image
#             if 'image' in request.FILES:
#                 project.image = request.FILES['image']
            
#             # Gérer le fichier ZIP
#             if 'zip_file' in request.FILES:
#                 # Vous pourriez sauvegarder le fichier ici
#                 pass
            
#             project.save()
            
#             print(f"✅ Projet créé: {project.id} - {project.title}")
            
#             return Response({
#                 'status': 'success',
#                 'message': 'Projet créé avec succès!',
#                 'project': {
#                     'id': project.id,
#                     'title': project.title,
#                     'status': project.status,
#                     'created_at': project.created_at.isoformat()
#                 }
#             }, status=201)
            
#         except Exception as e:
#             print(f"❌ Erreur création projet: {str(e)}")
#             return Response({
#                 'status': 'error',
#                 'message': f'Erreur: {str(e)}'
#             }, status=400)
    
#     elif request.method == 'PUT':
#         # Mettre à jour un projet
#         try:
#             project = Project.objects.get(id=project_id)
            
#             # Mettre à jour les champs
#             data = request.data if hasattr(request, 'data') else request.POST
#             files = request.FILES
            
#             for field in ['title', 'description', 'technologies', 'cohort', 'tags', 'github_url', 'demo_url', 'status']:
#                 if field in data:
#                     setattr(project, field, data[field])
            
#             # Mettre à jour l'image
#             if 'image' in files:
#                 project.image = files['image']
            
#             project.save()
            
#             return Response({
#                 'status': 'success',
#                 'message': 'Projet mis à jour',
#                 'project': {
#                     'id': project.id,
#                     'title': project.title,
#                     'updated_at': project.updated_at.isoformat()
#                 }
#             })
            
#         except Project.DoesNotExist:
#             return Response({'error': 'Projet non trouvé'}, status=404)
    
#     elif request.method == 'DELETE':
#         # Supprimer un projet
#         try:
#             project = Project.objects.get(id=project_id)
#             project.delete()
#             return Response({'status': 'success', 'message': 'Projet supprimé'})
#         except Project.DoesNotExist:
#             return Response({'error': 'Projet non trouvé'}, status=404)

# # ============================================================================
# # VUE CRÉATION SIMPLIFIÉE (VERSION TRÈS SIMPLE)
# # ============================================================================

# @api_view(['POST'])
# @permission_classes([AllowAny])
# def create_project_simple(request):
#     """Créer un projet - Version ultra simple pour tester"""
#     try:
#         print("=" * 70)
#         print("🚀 SIMPLE CREATE PROJECT APPELÉ!")
#         print("=" * 70)
        
#         # Accepter JSON ou FormData
#         if request.content_type == 'application/json':
#             data = request.data
#         else:
#             data = request.POST
        
#         print(f"📦 Données reçues: {data}")
#         print(f"📁 Fichiers reçus: {list(request.FILES.keys())}")
        
#         # Créer un projet très simple
#         project = Project.objects.create(
#             title=data.get('title', 'Projet test ' + str(timezone.now())),
#             description=data.get('description', 'Description de test'),
#             technologies=data.get('technologies', 'HTML, CSS'),
#             status='draft',
#             cohort=data.get('cohort', 'Test Cohort'),
#             author_name=data.get('author_name', 'Utilisateur Test')
#         )
        
#         # Gérer l'image si fournie
#         if 'image' in request.FILES:
#             project.image = request.FILES['image']
#             project.save()
        
#         print(f"✅ Projet créé: ID {project.id}, Titre: {project.title}")
        
#         return Response({
#             'status': 'success',
#             'message': 'Projet créé avec succès!',
#             'project_id': project.id,
#             'title': project.title,
#             'created_at': timezone.now().isoformat(),
#             'debug_info': {
#                 'content_type': request.content_type,
#                 'user': str(request.user),
#                 'files_count': len(request.FILES)
#             }
#         }, status=201)
        
#     except Exception as e:
#         print(f"❌ Erreur dans create_project_simple: {str(e)}")
#         return Response({
#             'status': 'error',
#             'message': f'Erreur: {str(e)}'
#         }, status=400)

# # ============================================================================
# # ASSUREZ-VOUS QUE create_project EXISTE
# # ============================================================================

# # Créez un alias pour que create_project existe
# create_project = create_project_simple


# # projects/views_api.py - VERSION COMPLÈTE ET FONCTIONNELLE
# from rest_framework.decorators import api_view, permission_classes
# from rest_framework.permissions import AllowAny, IsAuthenticated
# from rest_framework.response import Response
# from rest_framework.views import APIView
# from rest_framework import status as drf_status
# from django.utils import timezone
# from django.contrib.auth.models import User
# from .models import Project
# from django.db.models import Count
# import json
# import logging

# logger = logging.getLogger(__name__)

# # ============================================================================
# # FONCTIONS API SIMPLES
# # ============================================================================

# @api_view(['GET'])
# @permission_classes([AllowAny])
# def api_status(request):
#     """Statut de l'API"""
#     return Response({
#         'status': 'online',
#         'message': 'Projects API is running',
#         'timestamp': timezone.now().isoformat(),
#         'version': '2.0.0',
#         'endpoints': {
#             'projects_list': 'http://localhost:8000/api/projects/',
#             'projects_with_users': 'http://localhost:8000/api/projects/with-users/',
#             'stats': 'http://localhost:8000/api/projects/stats/',
#             'debug': 'http://localhost:8000/api/projects/debug/'
#         }
#     })

# @api_view(['GET', 'POST', 'OPTIONS'])
# @permission_classes([AllowAny])
# def project_list(request):
#     """Retourne TOUS les projets depuis la base de données - ET ACCEPTE POST"""
    
#     if request.method == 'OPTIONS':
#         response = Response({})
#         response['Allow'] = 'GET, POST, OPTIONS'
#         return response
    
#     elif request.method == 'GET':
#         """GET: Retourne tous les projets"""
#         try:
#             print("=" * 70)
#             print("🚀 DEMANDE GET DE PROJETS RECUE DANS project_list()")
#             print(f"📡 URL: {request.build_absolute_uri()}")
#             print(f"👤 Utilisateur: {request.user.username if request.user.is_authenticated else 'Anonyme'}")
#             print("=" * 70)
            
#             # Récupérer tous les projets depuis la base avec optimisation
#             projects = Project.objects.all().select_related('author').order_by('-created_at')
            
#             print(f"📊 {projects.count()} projets trouvés dans la base de données")
            
#             # Si pas de projets, retourner liste vide
#             if not projects.exists():
#                 print("⚠️ Aucun projet trouvé dans la base")
#                 return Response({
#                     'status': 'success',
#                     'count': 0,
#                     'projects': [],
#                     'timestamp': timezone.now().isoformat(),
#                     'message': 'Aucun projet trouvé'
#                 })
            
#             projects_data = []
#             for index, project in enumerate(projects):
#                 # Créer l'objet auteur
#                 author_data = {}
#                 if project.author:
#                     author_data = {
#                         'id': project.author.id,
#                         'username': project.author.username,
#                         'first_name': project.author.first_name or '',
#                         'last_name': project.author.last_name or '',
#                         'email': project.author.email or '',
#                         'is_staff': project.author.is_staff,
#                         'is_active': project.author.is_active,
#                         'date_joined': project.author.date_joined.isoformat() if project.author.date_joined else None
#                     }
                
#                 # Image URL
#                 image_url = None
#                 if project.image:
#                     image_url = request.build_absolute_uri(project.image.url)
                
#                 # Créer l'objet projet
#                 project_data = {
#                     'id': project.id,
#                     'title': project.title or 'Sans titre',
#                     'description': project.description or '',
#                     'technologies': project.technologies or '',
#                     'category': 'web',
#                     'status': project.status or 'draft',
#                     'cohort': project.cohort or '',
#                     'tags': project.tags or '',
#                     'github_url': project.github_url or '',
#                     'demo_url': project.demo_url or '',
#                     'image': image_url,
#                     'image_path': str(project.image) if project.image else None,
#                     'created_at': project.created_at.isoformat() if project.created_at else None,
#                     'updated_at': project.updated_at.isoformat() if project.updated_at else None,
#                     'author': author_data,
#                     'author_name': project.author_name or (project.author.get_full_name() if project.author else ''),
#                     'author_email': project.author_email or (project.author.email if project.author else ''),
#                     'author_username': project.author_username or (project.author.username if project.author else ''),
#                     'views': getattr(project, 'views', 0),
#                     'likes': getattr(project, 'likes', 0),
#                     'is_published': project.status == 'published',
#                     'is_draft': project.status == 'draft',
#                     'is_approved': project.status == 'approved',
#                     'is_rejected': project.status == 'rejected',
#                     'is_pending': project.status == 'pending'
#                 }
#                 projects_data.append(project_data)
                
#                 # Debug: Afficher le premier projet
#                 if index == 0:
#                     print("🔍 PREMIER PROJET DANS LA BASE:")
#                     print(f"   ID: {project.id}")
#                     print(f"   Titre: {project.title}")
#                     print(f"   Auteur: {project.author_name if project.author_name else project.author.username if project.author else 'Inconnu'}")
#                     print(f"   Statut: {project.status}")
#                     print(f"   Technologies: {project.technologies[:50] if project.technologies else 'Aucune'}")
            
#             print(f"✅ {len(projects_data)} projets préparés pour l'API")
#             print("=" * 70)
            
#             return Response({
#                 'status': 'success',
#                 'count': len(projects_data),
#                 'projects': projects_data,
#                 'timestamp': timezone.now().isoformat(),
#                 'database': 'PostgreSQL',
#                 'source': 'projects/views_api.py',
#                 'user': request.user.username if request.user.is_authenticated else 'anonymous'
#             })
            
#         except Exception as e:
#             print(f"❌ ERREUR dans GET project_list: {str(e)}")
#             import traceback
#             traceback.print_exc()
            
#             return Response({
#                 'status': 'error',
#                 'message': str(e),
#                 'projects': [],
#                 'timestamp': timezone.now().isoformat()
#             }, status=500)
    
#     elif request.method == 'POST':
#         """POST: Créer un nouveau projet"""
#         try:
#             print("=" * 70)
#             print("🚀 POST reçu dans project_list() - CRÉATION DE PROJET")
#             print("=" * 70)
            
#             # Accepter JSON ou FormData
#             if request.content_type == 'application/json':
#                 data = request.data
#                 print(f"📦 Format: JSON")
#             else:
#                 data = request.POST
#                 print(f"📦 Format: FormData")
            
#             print(f"👤 Utilisateur: {request.user}")
#             print(f"🔑 Authentifié: {request.user.is_authenticated}")
#             print(f"📋 Données reçues: {data}")
#             print(f"📁 Fichiers: {list(request.FILES.keys())}")
            
#             # Validation minimale
#             if not data.get('title'):
#                 return Response({
#                     'status': 'error',
#                     'message': 'Le titre est requis'
#                 }, status=400)
            
#             # Créer le projet
#             project = Project.objects.create(
#                 title=data.get('title', 'Nouveau projet'),
#                 description=data.get('description', ''),
#                 technologies=data.get('technologies', ''),
#                 cohort=data.get('cohort', ''),
#                 tags=data.get('tags', ''),
#                 github_url=data.get('github_url', ''),
#                 demo_url=data.get('demo_url', ''),
#                 status=data.get('status', 'draft'),
#                 # Gérer l'auteur
#                 author=request.user if request.user.is_authenticated else None,
#                 author_name=data.get('author_name', ''),
#                 author_email=data.get('author_email', '')
#             )
            
#             # Gérer l'image si fournie
#             if 'image' in request.FILES:
#                 project.image = request.FILES['image']
#                 project.save()
#                 print(f"🖼️ Image ajoutée: {project.image.name}")
            
#             print(f"✅ Projet créé avec succès!")
#             print(f"   ID: {project.id}")
#             print(f"   Titre: {project.title}")
#             print(f"   Auteur: {project.author_name if project.author_name else 'Anonyme'}")
#             print(f"   Statut: {project.status}")
#             print("=" * 70)
            
#             return Response({
#                 'status': 'success',
#                 'message': 'Projet créé avec succès!',
#                 'project_id': project.id,
#                 'title': project.title,
#                 'author': str(project.author) if project.author else 'Anonyme',
#                 'created_at': timezone.now().isoformat()
#             }, status=201)
            
#         except Exception as e:
#             print(f"❌ Erreur création projet: {str(e)}")
#             import traceback
#             traceback.print_exc()
            
#             return Response({
#                 'status': 'error',
#                 'message': f'Erreur: {str(e)}'
#             }, status=400)

# @api_view(['GET'])
# @permission_classes([AllowAny])
# def projects_with_users(request):
#     """Projets avec détails utilisateurs complets"""
#     try:
#         print("🔄 Chargement des projets avec utilisateurs...")
        
#         # Récupérer tous les utilisateurs avec leurs projets
#         users = User.objects.prefetch_related('projects').filter(projects__isnull=False).distinct()
        
#         users_data = []
#         for user in users:
#             user_projects = []
#             for project in user.projects.all():
#                 # Image URL
#                 image_url = None
#                 if project.image:
#                     image_url = request.build_absolute_uri(project.image.url)
                
#                 project_data = {
#                     'id': project.id,
#                     'title': project.title,
#                     'description': project.description,
#                     'status': project.status,
#                     'technologies': project.technologies,
#                     'cohort': project.cohort,
#                     'image': image_url,
#                     'created_at': project.created_at.isoformat() if project.created_at else None,
#                     'updated_at': project.updated_at.isoformat() if project.updated_at else None,
#                     'github_url': project.github_url,
#                     'demo_url': project.demo_url
#                 }
#                 user_projects.append(project_data)
            
#             users_data.append({
#                 'user': {
#                     'id': user.id,
#                     'username': user.username,
#                     'first_name': user.first_name,
#                     'last_name': user.last_name,
#                     'email': user.email,
#                     'is_staff': user.is_staff,
#                     'is_active': user.is_active
#                 },
#                 'projects': user_projects,
#                 'projects_count': len(user_projects)
#             })
        
#         print(f"✅ {len(users_data)} utilisateurs avec projets chargés")
        
#         return Response({
#             'status': 'success',
#             'count': len(users_data),
#             'users_with_projects': users_data,
#             'total_projects': sum(len(user['projects']) for user in users_data),
#             'timestamp': timezone.now().isoformat()
#         })
        
#     except Exception as e:
#         print(f"❌ Erreur dans projects_with_users: {str(e)}")
#         return Response({
#             'status': 'error',
#             'message': str(e),
#             'users_with_projects': []
#         }, status=500)

# @api_view(['GET'])
# @permission_classes([AllowAny])
# def dashboard_stats(request):
#     """Statistiques pour le dashboard"""
#     try:
#         print("📊 Calcul des statistiques...")
        
#         # Statistiques projets
#         total_projects = Project.objects.count()
        
#         # Comptage par statut
#         status_counts = {}
#         for status_choice in Project.STATUS_CHOICES:
#             status = status_choice[0]
#             count = Project.objects.filter(status=status).count()
#             status_counts[status] = count
        
#         # Statistiques utilisateurs
#         total_users = User.objects.count()
#         active_users = User.objects.filter(is_active=True).count()
#         users_with_projects = User.objects.filter(projects__isnull=False).distinct().count()
        
#         # Projets récents (7 derniers jours)
#         week_ago = timezone.now() - timezone.timedelta(days=7)
#         recent_projects = Project.objects.filter(created_at__gte=week_ago).count()
        
#         # Cohortes avec le plus de projets
#         top_cohorts = list(Project.objects.exclude(cohort='').values('cohort').annotate(
#             count=Count('id')
#         ).order_by('-count')[:5])
        
#         print(f"✅ Statistiques calculées: {total_projects} projets, {total_users} utilisateurs")
        
#         return Response({
#             'status': 'success',
#             'timestamp': timezone.now().isoformat(),
#             'projects': {
#                 'total': total_projects,
#                 'by_status': status_counts,
#                 'recent_week': recent_projects,
#                 'top_cohorts': top_cohorts
#             },
#             'users': {
#                 'total': total_users,
#                 'active': active_users,
#                 'with_projects': users_with_projects,
#                 'percentage_with_projects': round((users_with_projects / total_users * 100), 2) if total_users > 0 else 0
#             },
#             'system': {
#                 'timestamp': timezone.now().isoformat(),
#                 'api_version': '2.0.0',
#                 'database': 'PostgreSQL'
#             }
#         })
        
#     except Exception as e:
#         print(f"❌ Erreur dans dashboard_stats: {str(e)}")
#         return Response({
#             'status': 'error',
#             'message': str(e),
#             'timestamp': timezone.now().isoformat()
#         }, status=500)

# @api_view(['GET'])
# @permission_classes([AllowAny])
# def debug_projects(request):
#     """Debug endpoint pour voir la structure des données"""
#     try:
#         projects = Project.objects.all()
        
#         # Récupérer les champs du modèle
#         model_fields = [f.name for f in Project._meta.get_fields()]
        
#         # Premier projet pour échantillon
#         sample_project = None
#         if projects.exists():
#             first_project = projects.first()
#             sample_project = {
#                 'id': first_project.id,
#                 'title': first_project.title,
#                 'author': str(first_project.author),
#                 'author_name': first_project.author_name,
#                 'author_email': first_project.author_email,
#                 'status': first_project.status,
#                 'technologies': first_project.technologies,
#                 'cohort': first_project.cohort,
#                 'has_image': bool(first_project.image)
#             }
        
#         return Response({
#             'debug': True,
#             'total_projects': projects.count(),
#             'sample': sample_project,
#             'fields': model_fields,
#             'status_choices': Project.STATUS_CHOICES,
#             'timestamp': timezone.now().isoformat(),
#             'endpoints': {
#                 'main': '/api/projects/',
#                 'with_users': '/api/projects/with-users/',
#                 'stats': '/api/projects/stats/',
#                 'debug': '/api/projects/debug/'
#             }
#         })
        
#     except Exception as e:
#         return Response({
#             'debug': False,
#             'error': str(e),
#             'timestamp': timezone.now().isoformat()
#         }, status=500)

# # ============================================================================
# # VUES DE CLASSE
# # ============================================================================

# class ProjectsGroupedByUserView(APIView):
#     """Groupe les projets par utilisateur"""
#     permission_classes = [AllowAny]
    
#     def get(self, request):
#         try:
#             print("👥 Groupement des projets par utilisateur...")
            
#             # Utilisateurs avec leurs projets
#             users = User.objects.prefetch_related('projects').annotate(
#                 project_count=Count('projects')
#             ).filter(project_count__gt=0).order_by('-project_count')
            
#             grouped_data = []
#             for user in users:
#                 user_projects = []
#                 for project in user.projects.all():
#                     # Image URL
#                     image_url = None
#                     if project.image:
#                         image_url = request.build_absolute_uri(project.image.url)
                    
#                     project_data = {
#                         'id': project.id,
#                         'title': project.title,
#                         'description': project.description[:100] + '...' if project.description and len(project.description) > 100 else project.description,
#                         'status': project.status,
#                         'technologies': project.technologies,
#                         'image': image_url,
#                         'created_at': project.created_at.isoformat() if project.created_at else None,
#                         'updated_at': project.updated_at.isoformat() if project.updated_at else None
#                     }
#                     user_projects.append(project_data)
                
#                 grouped_data.append({
#                     'user': {
#                         'id': user.id,
#                         'username': user.username,
#                         'full_name': user.get_full_name(),
#                         'email': user.email,
#                         'is_staff': user.is_staff,
#                         'project_count': user.project_count
#                     },
#                     'projects': user_projects,
#                     'projects_count': len(user_projects)
#                 })
            
#             print(f"✅ {len(grouped_data)} utilisateurs groupés avec projets")
            
#             return Response({
#                 'status': 'success',
#                 'users_count': len(grouped_data),
#                 'total_projects': sum(len(user['projects']) for user in grouped_data),
#                 'grouped_projects': grouped_data,
#                 'timestamp': timezone.now().isoformat()
#             })
            
#         except Exception as e:
#             print(f"❌ Erreur dans ProjectsGroupedByUserView: {str(e)}")
#             return Response({
#                 'status': 'error',
#                 'message': str(e)
#             }, status=500)

# # ============================================================================
# # VUES DE SÉCURITÉ ET AUTHENTIFICATION
# # ============================================================================

# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def my_projects(request):
#     """Projets de l'utilisateur connecté"""
#     try:
#         user = request.user
#         projects = Project.objects.filter(author=user).select_related('author').order_by('-created_at')
        
#         projects_data = []
#         for project in projects:
#             image_url = None
#             if project.image:
#                 image_url = request.build_absolute_uri(project.image.url)
            
#             project_data = {
#                 'id': project.id,
#                 'title': project.title,
#                 'description': project.description,
#                 'status': project.status,
#                 'technologies': project.technologies,
#                 'cohort': project.cohort,
#                 'image': image_url,
#                 'created_at': project.created_at.isoformat() if project.created_at else None,
#                 'updated_at': project.updated_at.isoformat() if project.updated_at else None,
#                 'github_url': project.github_url,
#                 'demo_url': project.demo_url
#             }
#             projects_data.append(project_data)
        
#         return Response({
#             'status': 'success',
#             'user': {
#                 'id': user.id,
#                 'username': user.username,
#                 'email': user.email
#             },
#             'projects': projects_data,
#             'count': len(projects_data),
#             'timestamp': timezone.now().isoformat()
#         })
        
#     except Exception as e:
#         return Response({
#             'status': 'error',
#             'message': str(e)
#         }, status=500)

# # ============================================================================
# # VUE CRÉATION SIMPLIFIÉE
# # ============================================================================

# @api_view(['POST', 'OPTIONS'])
# @permission_classes([AllowAny])
# def create_project_simple(request):
#     """Créer un projet - Version simple"""
#     try:
#         print("=" * 70)
#         print("🚀 CREATE_PROJECT_SIMPLE APPELÉ!")
#         print("=" * 70)
        
#         # Accepter JSON ou FormData
#         if request.content_type == 'application/json':
#             data = request.data
#         else:
#             data = request.POST
        
#         print(f"📦 Données: {data}")
#         print(f"📁 Fichiers: {list(request.FILES.keys())}")
#         print(f"👤 Utilisateur: {request.user}")
        
#         # Validation
#         if not data.get('title'):
#             return Response({
#                 'status': 'error',
#                 'message': 'Le titre est requis'
#             }, status=400)
        
#         # Créer le projet
#         project = Project.objects.create(
#             title=data.get('title', 'Projet test ' + str(timezone.now())),
#             description=data.get('description', 'Description de test'),
#             technologies=data.get('technologies', 'HTML, CSS, JavaScript'),
#             cohort=data.get('cohort', 'Test Cohort'),
#             tags=data.get('tags', 'test,demo'),
#             github_url=data.get('github_url', ''),
#             demo_url=data.get('demo_url', ''),
#             status='draft',
#             # Gérer l'auteur
#             author=request.user if request.user.is_authenticated else None,
#             author_name=data.get('author_name', 'Utilisateur Test'),
#             author_email=data.get('author_email', 'test@example.com')
#         )
        
#         # Gérer l'image
#         if 'image' in request.FILES:
#             project.image = request.FILES['image']
        
#         # Gérer le fichier ZIP
#         if 'zip_file' in request.FILES:
#             # Vous pourriez sauvegarder le fichier ici
#             pass
        
#         project.save()
        
#         print(f"✅ Projet créé avec succès! ID: {project.id}")
        
#         return Response({
#             'status': 'success',
#             'message': 'Projet créé avec succès!',
#             'project': {
#                 'id': project.id,
#                 'title': project.title,
#                 'description': project.description,
#                 'technologies': project.technologies,
#                 'cohort': project.cohort,
#                 'status': project.status,
#                 'author': str(project.author) if project.author else 'Anonyme',
#                 'author_name': project.author_name,
#                 'created_at': project.created_at.isoformat()
#             },
#             'debug': {
#                 'content_type': request.content_type,
#                 'user_authenticated': request.user.is_authenticated,
#                 'username': request.user.username if request.user.is_authenticated else 'Anonyme'
#             }
#         }, status=201)
        
#     except Exception as e:
#         print(f"❌ ERREUR dans create_project_simple: {str(e)}")
#         import traceback
#         traceback.print_exc()
        
#         return Response({
#             'status': 'error',
#             'message': f'Erreur: {str(e)}',
#             'debug': {
#                 'content_type': request.content_type,
#                 'data_received': str(data) if 'data' in locals() else 'No data',
#                 'error_details': traceback.format_exc()
#             }
#         }, status=400)

# # ============================================================================
# # VUES UTILITAIRES
# # ============================================================================

# @api_view(['GET'])
# @permission_classes([AllowAny])
# def health_check(request):
#     """Vérification de santé de l'API"""
#     try:
#         # Vérifier la base de données
#         project_count = Project.objects.count()
#         user_count = User.objects.count()
        
#         return Response({
#             'status': 'healthy',
#             'database': {
#                 'projects': project_count,
#                 'users': user_count,
#                 'connected': True
#             },
#             'timestamp': timezone.now().isoformat(),
#             'version': '2.0.0'
#         })
        
#     except Exception as e:
#         return Response({
#             'status': 'unhealthy',
#             'error': str(e),
#             'timestamp': timezone.now().isoformat()
#         }, status=500)

# @api_view(['GET'])
# @permission_classes([AllowAny])
# def search_projects(request):
#     """Recherche de projets"""
#     try:
#         query = request.GET.get('q', '')
#         status_filter = request.GET.get('status', '')
#         cohort_filter = request.GET.get('cohort', '')
#         technology_filter = request.GET.get('technology', '')
        
#         # Construire la requête
#         from django.db.models import Q
        
#         filters = Q()
        
#         if query:
#             filters &= (
#                 Q(title__icontains=query) |
#                 Q(description__icontains=query) |
#                 Q(technologies__icontains=query) |
#                 Q(tags__icontains=query) |
#                 Q(cohort__icontains=query) |
#                 Q(author_name__icontains=query)
#             )
        
#         if status_filter:
#             filters &= Q(status=status_filter)
        
#         if cohort_filter:
#             filters &= Q(cohort__icontains=cohort_filter)
        
#         if technology_filter:
#             filters &= Q(technologies__icontains=technology_filter)
        
#         # Exécuter la requête
#         projects = Project.objects.filter(filters).select_related('author').order_by('-created_at')
        
#         # Transformer en format API
#         projects_data = []
#         for project in projects:
#             image_url = None
#             if project.image:
#                 image_url = request.build_absolute_uri(project.image.url)
            
#             project_data = {
#                 'id': project.id,
#                 'title': project.title,
#                 'description': project.description[:200] + '...' if project.description and len(project.description) > 200 else project.description,
#                 'status': project.status,
#                 'technologies': project.technologies,
#                 'cohort': project.cohort,
#                 'image': image_url,
#                 'author_name': project.author_name or (project.author.username if project.author else ''),
#                 'created_at': project.created_at.isoformat() if project.created_at else None
#             }
#             projects_data.append(project_data)
        
#         return Response({
#             'status': 'success',
#             'query': query,
#             'filters': {
#                 'status': status_filter,
#                 'cohort': cohort_filter,
#                 'technology': technology_filter
#             },
#             'count': len(projects_data),
#             'projects': projects_data,
#             'timestamp': timezone.now().isoformat()
#         })
        
#     except Exception as e:
#         return Response({
#             'status': 'error',
#             'message': str(e)
#         }, status=500)

# # ============================================================================
# # VUES CRUD COMPLÈTES
# # ============================================================================

# @api_view(['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'])
# @permission_classes([AllowAny])
# def project_detail(request, project_id=None):
#     """Gérer un projet spécifique (GET, PUT, DELETE)"""
    
#     if request.method == 'OPTIONS':
#         return Response({
#             'methods': ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
#         })
    
#     elif request.method == 'GET':
#         # Récupérer un projet spécifique
#         try:
#             project = Project.objects.get(id=project_id)
#             image_url = None
#             if project.image:
#                 image_url = request.build_absolute_uri(project.image.url)
            
#             return Response({
#                 'id': project.id,
#                 'title': project.title,
#                 'description': project.description,
#                 'technologies': project.technologies,
#                 'status': project.status,
#                 'cohort': project.cohort,
#                 'tags': project.tags,
#                 'github_url': project.github_url,
#                 'demo_url': project.demo_url,
#                 'image': image_url,
#                 'created_at': project.created_at.isoformat() if project.created_at else None,
#                 'updated_at': project.updated_at.isoformat() if project.updated_at else None,
#                 'author': {
#                     'id': project.author.id if project.author else None,
#                     'username': project.author.username if project.author else None,
#                     'name': project.author.get_full_name() if project.author else None
#                 } if project.author else None
#             })
#         except Project.DoesNotExist:
#             return Response({'error': 'Projet non trouvé'}, status=404)
    
#     elif request.method == 'POST':
#         # Cette méthode ne devrait pas être appelée ici, utiliser project_list ou create_project_simple
#         return Response({
#             'status': 'error',
#             'message': 'Utilisez /api/projects/ ou /api/projects/create/ pour créer un projet'
#         }, status=405)
    
#     elif request.method == 'PUT':
#         # Mettre à jour un projet
#         try:
#             project = Project.objects.get(id=project_id)
            
#             # Mettre à jour les champs
#             data = request.data if hasattr(request, 'data') else request.POST
#             files = request.FILES
            
#             for field in ['title', 'description', 'technologies', 'cohort', 'tags', 'github_url', 'demo_url', 'status']:
#                 if field in data:
#                     setattr(project, field, data[field])
            
#             # Mettre à jour l'image
#             if 'image' in files:
#                 project.image = files['image']
            
#             project.save()
            
#             return Response({
#                 'status': 'success',
#                 'message': 'Projet mis à jour',
#                 'project': {
#                     'id': project.id,
#                     'title': project.title,
#                     'updated_at': project.updated_at.isoformat()
#                 }
#             })
            
#         except Project.DoesNotExist:
#             return Response({'error': 'Projet non trouvé'}, status=404)
    
#     elif request.method == 'DELETE':
#         # Supprimer un projet
#         try:
#             project = Project.objects.get(id=project_id)
#             project.delete()
#             return Response({'status': 'success', 'message': 'Projet supprimé'})
#         except Project.DoesNotExist:
#             return Response({'error': 'Projet non trouvé'}, status=404)

# # ============================================================================
# # ALIAS POUR LA COMPATIBILITÉ
# # ============================================================================

# # Alias pour éviter les erreurs
# create_project = create_project_simple
# project_list_all = project_list

# print("=" * 70)
# print("✅ projects/views_api.py chargé avec succès!")
# print(f"📊 Endpoints disponibles:")
# print(f"   - GET/POST /api/projects/ → Liste et création")
# print(f"   - POST /api/projects/create/ → Création simple")
# print("=" * 70)


# projects/views_api.py - VERSION COMPLÈTE AVEC AUTEUR OBLIGATOIRE
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status as drf_status
from django.utils import timezone
from django.contrib.auth.models import User
from .models import Project
from django.db.models import Count
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
            'projects_list': 'http://localhost:8000/api/projects/',
            'projects_with_users': 'http://localhost:8000/api/projects/with-users/',
            'stats': 'http://localhost:8000/api/projects/stats/',
            'debug': 'http://localhost:8000/api/projects/debug/'
        }
    })

@api_view(['GET', 'POST', 'OPTIONS'])
@permission_classes([AllowAny])
def project_list(request):
    """Retourne TOUS les projets depuis la base de données - ET ACCEPTE POST"""
    
    if request.method == 'OPTIONS':
        response = Response({})
        response['Allow'] = 'GET, POST, OPTIONS'
        return response
    
    elif request.method == 'GET':
        """GET: Retourne tous les projets"""
        try:
            print("=" * 70)
            print("🚀 DEMANDE GET DE PROJETS RECUE DANS project_list()")
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
                    'category': 'web',
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
                    'views': getattr(project, 'views', 0),
                    'likes': getattr(project, 'likes', 0),
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
            print(f"❌ ERREUR dans GET project_list: {str(e)}")
            import traceback
            traceback.print_exc()
            
            return Response({
                'status': 'error',
                'message': str(e),
                'projects': [],
                'timestamp': timezone.now().isoformat()
            }, status=500)
    
    elif request.method == 'POST':
        """POST: Créer un nouveau projet - GARANTIT TOUJOURS UN AUTEUR"""
        try:
            print("=" * 70)
            print("🚀 POST reçu dans project_list() - CRÉATION DE PROJET AVEC AUTEUR")
            print("=" * 70)
            
            # Accepter JSON ou FormData
            if request.content_type == 'application/json':
                data = request.data
                print(f"📦 Format: JSON")
            else:
                data = request.POST
                print(f"📦 Format: FormData")
            
            print(f"👤 Utilisateur: {request.user}")
            print(f"🔑 Authentifié: {request.user.is_authenticated}")
            print(f"📋 Données reçues: {data}")
            print(f"📁 Fichiers: {list(request.FILES.keys())}")
            
            # Validation minimale
            if not data.get('title'):
                return Response({
                    'status': 'error',
                    'message': 'Le titre est requis'
                }, status=400)
            
            # ====================================================================
            # DÉTERMINATION DE L'AUTEUR (CRITIQUE)
            # ====================================================================
            author = None
            
            # 1. Si utilisateur authentifié → utiliser cet utilisateur
            if request.user.is_authenticated:
                author = request.user
                print(f"✅ Auteur authentifié: {author.username} (ID: {author.id})")
            
            # 2. Sinon, chercher/créer un utilisateur "default"
            else:
                try:
                    # Chercher un utilisateur spécial pour les projets anonymes
                    default_user, created = User.objects.get_or_create(
                        username='default_uploader',
                        defaults={
                            'email': 'uploader@example.com',
                            'first_name': 'Uploader',
                            'last_name': 'Default',
                            'is_active': True,
                            'is_staff': False
                        }
                    )
                    author = default_user
                    
                    if created:
                        print(f"👤 Utilisateur par défaut créé: {author.username}")
                    else:
                        print(f"👤 Utilisateur par défaut utilisé: {author.username}")
                        
                except Exception as e:
                    print(f"⚠️ Erreur création utilisateur par défaut: {e}")
                    # Fallback: utiliser le premier superuser
                    author = User.objects.filter(is_superuser=True).first()
                    if author:
                        print(f"🔄 Fallback sur superuser: {author.username}")
                    else:
                        # Dernier recours: créer un utilisateur admin
                        author = User.objects.create_user(
                            username='fallback_admin',
                            email='admin@fallback.com',
                            password='temp_password_123',
                            is_superuser=True,
                            is_staff=True
                        )
                        print(f"🆕 Utilisateur fallback créé: {author.username}")
            
            # VÉRIFICATION FINALE: l'auteur DOIT exister
            if not author:
                return Response({
                    'status': 'error',
                    'message': 'Impossible de déterminer un auteur pour ce projet'
                }, status=400)
            
            # ====================================================================
            # CRÉATION DU PROJET AVEC AUTEUR GARANTI
            # ====================================================================
            project_data = {
                'title': data.get('title', 'Nouveau projet'),
                'description': data.get('description', ''),
                'technologies': data.get('technologies', ''),
                'cohort': data.get('cohort', ''),
                'tags': data.get('tags', ''),
                'github_url': data.get('github_url', ''),
                'demo_url': data.get('demo_url', ''),
                'status': data.get('status', 'draft'),
                'author': author,  # AUTEUR GARANTI
                'author_name': data.get('author_name', author.get_full_name() or author.username),
                'author_email': data.get('author_email', author.email or ''),
                'author_username': author.username
            }
            
            # Créer le projet
            project = Project.objects.create(**project_data)
            
            # Gérer l'image si fournie
            if 'image' in request.FILES:
                project.image = request.FILES['image']
                project.save()
                print(f"🖼️ Image ajoutée: {project.image.name}")
            
            print(f"✅ Projet créé avec succès!")
            print(f"   ID: {project.id}")
            print(f"   Titre: {project.title}")
            print(f"   Auteur: {author.username} (ID: {author.id})")
            print(f"   Statut: {project.status}")
            print("=" * 70)
            
            return Response({
                'status': 'success',
                'message': 'Projet créé avec succès!',
                'project_id': project.id,
                'title': project.title,
                'author': {
                    'id': author.id,
                    'username': author.username,
                    'email': author.email
                },
                'created_at': timezone.now().isoformat()
            }, status=201)
            
        except Exception as e:
            print(f"❌ Erreur création projet: {str(e)}")
            import traceback
            traceback.print_exc()
            
            return Response({
                'status': 'error',
                'message': f'Erreur: {str(e)}'
            }, status=400)

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
                'main': '/api/projects/',
                'with_users': '/api/projects/with-users/',
                'stats': '/api/projects/stats/',
                'debug': '/api/projects/debug/'
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

# ============================================================================
# VUE CRÉATION SÉCURISÉE AVEC AUTEUR GARANTI
# ============================================================================

@api_view(['POST'])
@permission_classes([AllowAny])
def create_project_secure(request):
    """Créer un projet avec auteur OBLIGATOIRE - Version sécurisée"""
    try:
        print("=" * 70)
        print("🚀 CREATE_PROJECT_SECURE - AUTEUR GARANTI")
        print("=" * 70)
        
        # Accepter JSON ou FormData
        if request.content_type == 'application/json':
            data = request.data
            print(f"📦 Format: JSON")
        else:
            data = request.POST
            print(f"📦 Format: FormData")
        
        print(f"👤 Utilisateur: {request.user}")
        print(f"🔑 Authentifié: {request.user.is_authenticated}")
        print(f"📋 Données: {data}")
        print(f"📁 Fichiers: {list(request.FILES.keys())}")
        
        # ====================================================================
        # ÉTAPE 1: VALIDATION
        # ====================================================================
        if not data.get('title'):
            return Response({
                'status': 'error',
                'message': 'Le titre est requis'
            }, status=400)
        
        # ====================================================================
        # ÉTAPE 2: DÉTERMINATION DE L'AUTEUR (CRITIQUE)
        # ====================================================================
        author = None
        
        # Option A: Utilisateur authentifié
        if request.user.is_authenticated:
            author = request.user
            print(f"✅ Auteur authentifié: {author.username} (ID: {author.id})")
        
        # Option B: Créer un utilisateur basé sur les données fournies
        else:
            # Extraire les informations d'auteur des données
            author_name = data.get('author_name', '').strip()
            author_email = data.get('author_email', '').strip().lower()
            
            if not author_name:
                return Response({
                    'status': 'error',
                    'message': 'Le nom de l\'auteur est requis pour les projets non authentifiés'
                }, status=400)
            
            # Générer un username unique à partir du nom
            base_username = author_name.lower().replace(' ', '_').replace('.', '_')[:20]
            username = base_username
            counter = 1
            
            # S'assurer que le username est unique
            while User.objects.filter(username=username).exists():
                username = f"{base_username}_{counter}"
                counter += 1
                if counter > 100:
                    username = f"user_{int(timezone.now().timestamp())}"
                    break
            
            try:
                # Créer un nouvel utilisateur pour ce projet
                author = User.objects.create_user(
                    username=username,
                    email=author_email if author_email else f"{username}@project-upload.com",
                    password=f"project_upload_{int(timezone.now().timestamp())}",
                    first_name=author_name.split(' ')[0] if ' ' in author_name else '',
                    last_name=' '.join(author_name.split(' ')[1:]) if ' ' in author_name else '',
                    is_active=True
                )
                print(f"👤 Nouvel utilisateur créé: {author.username} pour le projet")
                
            except Exception as e:
                print(f"⚠️ Erreur création utilisateur: {e}")
                # Fallback: utiliser l'utilisateur "uploader" par défaut
                author = User.objects.filter(username='uploader').first()
                if not author:
                    author = User.objects.create_user(
                        username='uploader',
                        email='uploader@projects.com',
                        password='uploader_password_123',
                        first_name='Project',
                        last_name='Uploader',
                        is_active=True
                    )
                    print(f"🔄 Utilisateur uploader créé: {author.username}")
        
        # VÉRIFICATION FINALE: l'auteur DOIT exister
        if not author:
            return Response({
                'status': 'error',
                'message': 'Erreur critique: impossible de déterminer un auteur'
            }, status=500)
        
        # ====================================================================
        # ÉTAPE 3: CRÉATION DU PROJET
        # ====================================================================
        project = Project.objects.create(
            title=data.get('title'),
            description=data.get('description', ''),
            technologies=data.get('technologies', ''),
            cohort=data.get('cohort', ''),
            tags=data.get('tags', ''),
            github_url=data.get('github_url', ''),
            demo_url=data.get('demo_url', ''),
            status=data.get('status', 'draft'),
            author=author,  # AUTEUR GARANTI
            author_name=author.get_full_name() or author.username,
            author_email=author.email or '',
            author_username=author.username
        )
        
        # ====================================================================
        # ÉTAPE 4: GESTION DES FICHIERS
        # ====================================================================
        if 'image' in request.FILES:
            project.image = request.FILES['image']
            project.save()
            print(f"🖼️ Image ajoutée: {project.image.name}")
        
        if 'zip_file' in request.FILES:
            # Vous pourriez sauvegarder le fichier ici
            print(f"📦 Fichier ZIP reçu: {request.FILES['zip_file'].name}")
        
        print(f"✅ Projet créé avec succès!")
        print(f"   ID: {project.id}")
        print(f"   Titre: {project.title}")
        print(f"   Auteur: {author.username} (ID: {author.id})")
        print("=" * 70)
        
        # ====================================================================
        # ÉTAPE 5: RÉPONSE
        # ====================================================================
        return Response({
            'status': 'success',
            'message': 'Projet créé avec succès!',
            'project': {
                'id': project.id,
                'title': project.title,
                'description': project.description,
                'technologies': project.technologies,
                'cohort': project.cohort,
                'status': project.status,
                'author': {
                    'id': author.id,
                    'username': author.username,
                    'email': author.email,
                    'full_name': author.get_full_name()
                },
                'author_name': project.author_name,
                'created_at': project.created_at.isoformat()
            },
            'debug': {
                'user_authenticated': request.user.is_authenticated,
                'user_id': request.user.id if request.user.is_authenticated else None,
                'author_type': 'authenticated' if request.user.is_authenticated else 'created'
            }
        }, status=201)
        
    except Exception as e:
        print(f"❌ ERREUR dans create_project_secure: {str(e)}")
        import traceback
        traceback.print_exc()
        
        return Response({
            'status': 'error',
            'message': f'Erreur: {str(e)}',
            'error_type': type(e).__name__
        }, status=400)

# ============================================================================
# VUE POUR UTILISATEURS AUTHENTIFIÉS UNIQUEMENT
# ============================================================================

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_project_authenticated_only(request):
    """Créer un projet (réservé aux utilisateurs authentifiés)"""
    try:
        print("=" * 70)
        print("🚀 CREATE_PROJECT_AUTHENTICATED_ONLY")
        print("=" * 70)
        
        # L'utilisateur EST forcément authentifié grâce à @permission_classes([IsAuthenticated])
        user = request.user
        print(f"👤 Auteur authentifié: {user.username} (ID: {user.id})")
        
        # Accepter JSON ou FormData
        if request.content_type == 'application/json':
            data = request.data
        else:
            data = request.POST
        
        print(f"📦 Données: {data}")
        
        # VALIDATION
        if not data.get('title'):
            return Response({
                'status': 'error',
                'message': 'Le titre est requis'
            }, status=400)
        
        # CRÉATION
        project = Project.objects.create(
            title=data.get('title'),
            description=data.get('description', ''),
            technologies=data.get('technologies', ''),
            cohort=data.get('cohort', ''),
            tags=data.get('tags', ''),
            github_url=data.get('github_url', ''),
            demo_url=data.get('demo_url', ''),
            status=data.get('status', 'draft'),
            author=user,  # AUTEUR = utilisateur connecté
            author_name=data.get('author_name', user.get_full_name() or user.username),
            author_email=data.get('author_email', user.email or ''),
            author_username=user.username
        )
        
        # GESTION DES FICHIERS
        if 'image' in request.FILES:
            project.image = request.FILES['image']
            project.save()
        
        if 'zip_file' in request.FILES:
            print(f"📦 Fichier ZIP reçu: {request.FILES['zip_file'].name}")
        
        print(f"✅ Projet créé! ID: {project.id}")
        
        return Response({
            'status': 'success',
            'message': 'Projet créé avec succès!',
            'project': {
                'id': project.id,
                'title': project.title,
                'author': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email
                },
                'author_id': user.id,
                'status': project.status,
                'created_at': project.created_at.isoformat()
            }
        }, status=201)
        
    except Exception as e:
        print(f"❌ ERREUR: {str(e)}")
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=400)

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
# VUES CRUD COMPLÈTES
# ============================================================================

@api_view(['GET', 'PUT', 'DELETE', 'OPTIONS'])
@permission_classes([AllowAny])
def project_detail(request, project_id=None):
    """Gérer un projet spécifique (GET, PUT, DELETE)"""
    
    if request.method == 'OPTIONS':
        return Response({
            'methods': ['GET', 'PUT', 'DELETE', 'OPTIONS']
        })
    
    elif request.method == 'GET':
        # Récupérer un projet spécifique
        try:
            project = Project.objects.get(id=project_id)
            image_url = None
            if project.image:
                image_url = request.build_absolute_uri(project.image.url)
            
            author_data = {}
            if project.author:
                author_data = {
                    'id': project.author.id,
                    'username': project.author.username,
                    'name': project.author.get_full_name() if project.author else None,
                    'email': project.author.email
                }
            
            return Response({
                'id': project.id,
                'title': project.title,
                'description': project.description,
                'technologies': project.technologies,
                'status': project.status,
                'cohort': project.cohort,
                'tags': project.tags,
                'github_url': project.github_url,
                'demo_url': project.demo_url,
                'image': image_url,
                'created_at': project.created_at.isoformat() if project.created_at else None,
                'updated_at': project.updated_at.isoformat() if project.updated_at else None,
                'author': author_data,
                'author_name': project.author_name,
                'author_email': project.author_email,
                'author_username': project.author_username
            })
        except Project.DoesNotExist:
            return Response({'error': 'Projet non trouvé'}, status=404)
    
    elif request.method == 'PUT':
        # Mettre à jour un projet
        try:
            project = Project.objects.get(id=project_id)
            
            # Mettre à jour les champs
            data = request.data if hasattr(request, 'data') else request.POST
            files = request.FILES
            
            for field in ['title', 'description', 'technologies', 'cohort', 'tags', 'github_url', 'demo_url', 'status']:
                if field in data:
                    setattr(project, field, data[field])
            
            # Mettre à jour l'image
            if 'image' in files:
                project.image = files['image']
            
            project.save()
            
            return Response({
                'status': 'success',
                'message': 'Projet mis à jour',
                'project': {
                    'id': project.id,
                    'title': project.title,
                    'updated_at': project.updated_at.isoformat()
                }
            })
            
        except Project.DoesNotExist:
            return Response({'error': 'Projet non trouvé'}, status=404)
    
    elif request.method == 'DELETE':
        # Supprimer un projet
        try:
            project = Project.objects.get(id=project_id)
            project.delete()
            return Response({'status': 'success', 'message': 'Projet supprimé'})
        except Project.DoesNotExist:
            return Response({'error': 'Projet non trouvé'}, status=404)

# ============================================================================
# ALIAS POUR LA COMPATIBILITÉ
# ============================================================================

# Alias pour la compatibilité
create_project = create_project_secure
project_list_all = project_list

print("=" * 70)
print("✅ projects/views_api.py chargé avec succès!")
print(f"📊 Endpoints disponibles:")
print(f"   - GET/POST /api/projects/ → Liste et création")
print(f"   - POST /api/projects/create/ → Création sécurisée (auteur garanti)")
print(f"   - POST /api/projects/create-auth/ → Création (utilisateurs connectés)")
print(f"   - GET  /api/projects/my-projects/ → Mes projets (connectés)")
print("=" * 70)