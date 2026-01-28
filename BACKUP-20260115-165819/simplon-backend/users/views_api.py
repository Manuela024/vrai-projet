# # users/views_api.py - VUES API POUR L'ADMIN DASHBOARD
# from rest_framework import viewsets, permissions, filters, status
# from rest_framework.decorators import action
# from rest_framework.response import Response
# from rest_framework.pagination import PageNumberPagination
# from django.contrib.auth.models import User
# from django_filters.rest_framework import DjangoFilterBackend
# from django.db.models import Count, Q
# from django.utils import timezone
# from datetime import timedelta
# from .serializers import UserSerializer, UserCreateSerializer, UserWithProjectsSerializer
# from projects.models import Project

# class StandardPagination(PageNumberPagination):
#     page_size = 20
#     page_size_query_param = 'page_size'
#     max_page_size = 100

# class AdminUserViewSet(viewsets.ModelViewSet):
#     """
#     API endpoint pour la gestion admin des utilisateurs
#     URL: /api/users/admin/users/
#     """
#     queryset = User.objects.all().order_by('-date_joined')
#     permission_classes = [permissions.IsAdminUser]
#     pagination_class = StandardPagination
#     filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
#     filterset_fields = ['is_active', 'is_staff', 'is_superuser']
#     search_fields = ['username', 'email', 'first_name', 'last_name']
#     ordering_fields = ['username', 'date_joined', 'last_login', 'email']
    
#     def get_serializer_class(self):
#         if self.action == 'create':
#             return UserCreateSerializer
#         elif self.action in ['update', 'partial_update']:
#             return UserCreateSerializer
#         elif self.action == 'retrieve':
#             return UserSerializer
#         return UserSerializer
    
#     @action(detail=True, methods=['get'])
#     def projects(self, request, pk=None):
#         """Récupérer les projets d'un utilisateur spécifique"""
#         user = self.get_object()
#         projects = Project.objects.filter(author=user)
        
#         from projects.serializers import ProjectSerializer
#         serializer = ProjectSerializer(projects, many=True)
        
#         return Response({
#             'user': user.username,
#             'projects_count': projects.count(),
#             'projects': serializer.data
#         })
    
#     @action(detail=False, methods=['get'])
#     def stats(self, request):
#         """Statistiques globales sur les utilisateurs"""
#         total = User.objects.count()
#         active = User.objects.filter(is_active=True).count()
#         inactive = User.objects.filter(is_active=False).count()
#         staff = User.objects.filter(is_staff=True).count()
#         superusers = User.objects.filter(is_superuser=True).count()
        
#         # Utilisateurs récemment inscrits (7 derniers jours)
#         week_ago = timezone.now() - timedelta(days=7)
#         recent_users = User.objects.filter(date_joined__gte=week_ago).count()
        
#         # Utilisateurs actifs récemment (30 derniers jours)
#         month_ago = timezone.now() - timedelta(days=30)
#         active_recently = User.objects.filter(
#             last_login__gte=month_ago,
#             is_active=True
#         ).count()
        
#         # Utilisateurs Simplon
#         simplon_users = User.objects.filter(username__startswith='simplon_').count()
        
#         # Distribution par statut
#         status_distribution = {
#             'active': active,
#             'inactive': inactive,
#             'staff': staff,
#             'superusers': superusers,
#             'simplon_users': simplon_users
#         }
        
#         # Données temporelles
#         today = timezone.now().date()
#         yesterday = today - timedelta(days=1)
        
#         new_today = User.objects.filter(date_joined__date=today).count()
#         new_yesterday = User.objects.filter(date_joined__date=yesterday).count()
        
#         return Response({
#             'total_users': total,
#             'active_users': active,
#             'inactive_users': inactive,
#             'staff_users': staff,
#             'superuser_users': superusers,
#             'recent_users': recent_users,
#             'active_recently': active_recently,
#             'simplon_users': simplon_users,
#             'status_distribution': status_distribution,
#             'new_today': new_today,
#             'new_yesterday': new_yesterday
#         })
    
#     @action(detail=False, methods=['get'])
#     def recent(self, request):
#         """Récupérer les utilisateurs récents (10 derniers)"""
#         recent_users = User.objects.all().order_by('-date_joined')[:10]
#         serializer = UserWithProjectsSerializer(recent_users, many=True)
#         return Response(serializer.data)
    
#     @action(detail=False, methods=['get'])
#     def active(self, request):
#         """Récupérer les utilisateurs actifs récemment"""
#         month_ago = timezone.now() - timedelta(days=30)
#         active_users = User.objects.filter(
#             last_login__gte=month_ago,
#             is_active=True
#         ).order_by('-last_login')
        
#         page = self.paginate_queryset(active_users)
#         if page is not None:
#             serializer = UserWithProjectsSerializer(page, many=True)
#             return self.get_paginated_response(serializer.data)
        
#         serializer = UserWithProjectsSerializer(active_users, many=True)
#         return Response(serializer.data)

# class DashboardStatsView(viewsets.ViewSet):
#     """
#     Vue pour les statistiques du dashboard admin
#     """
#     permission_classes = [permissions.IsAdminUser]
    
#     def list(self, request):
#         """Retourne toutes les stats pour le dashboard"""
#         try:
#             print("🔍 Génération des stats dashboard...")
            
#             # 1. Statistiques utilisateurs
#             total_users = User.objects.count()
#             active_users = User.objects.filter(is_active=True).count()
#             inactive_users = User.objects.filter(is_active=False).count()
#             staff_users = User.objects.filter(is_staff=True).count()
            
#             # 2. Statistiques projets
#             from projects.models import Project
#             total_projects = Project.objects.count()
#             published_projects = Project.objects.filter(status='published').count()
#             pending_projects = Project.objects.filter(status='pending').count()
#             draft_projects = Project.objects.filter(status='draft').count()
            
#             # 3. Téléchargements (à adapter selon votre modèle)
#             total_downloads = 0  # Remplacer par votre logique
            
#             # 4. Utilisateurs récents (5 derniers)
#             recent_users = User.objects.all().order_by('-date_joined')[:5]
#             recent_users_data = []
#             for user in recent_users:
#                 recent_users_data.append({
#                     'id': user.id,
#                     'username': user.username,
#                     'email': user.email,
#                     'first_name': user.first_name,
#                     'last_name': user.last_name,
#                     'date_joined': user.date_joined,
#                     'is_active': user.is_active
#                 })
            
#             # 5. Projets récents (5 derniers)
#             recent_projects = Project.objects.all().order_by('-created_at')[:5]
#             recent_projects_data = []
#             for project in recent_projects:
#                 recent_projects_data.append({
#                     'id': project.id,
#                     'title': project.title,
#                     'author': {
#                         'username': project.author.username if project.author else 'Anonyme',
#                         'first_name': project.author.first_name if project.author else '',
#                         'last_name': project.author.last_name if project.author else ''
#                     },
#                     'status': project.status,
#                     'created_at': project.created_at,
#                     'technologies': project.technologies
#                 })
            
#             print(f"✅ Stats générées: {total_users} users, {total_projects} projets")
            
#             return Response({
#                 'success': True,
#                 'stats': {
#                     'total_users': total_users,
#                     'total_projects': total_projects,
#                     'total_downloads': total_downloads,
#                     'pending_projects': pending_projects,
#                     'approved_projects': published_projects,
#                     'draft_projects': draft_projects,
#                     'active_users': active_users,
#                     'inactive_users': inactive_users,
#                     'staff_users': staff_users
#                 },
#                 'recent_users': recent_users_data,
#                 'recent_projects': recent_projects_data,
#                 'timestamp': timezone.now().isoformat()
#             })
            
#         except Exception as e:
#             print(f"❌ Erreur génération stats: {str(e)}")
#             return Response({
#                 'success': False,
#                 'error': str(e),
#                 'message': 'Erreur lors de la génération des statistiques'
#             }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# # users/views_api.py - VERSION CORRIGÉE AVEC IMPORT CORRECT
# from rest_framework import viewsets, permissions, filters, status
# from rest_framework.decorators import action
# from rest_framework.response import Response
# from rest_framework.pagination import PageNumberPagination
# from django.contrib.auth.models import User
# from django_filters.rest_framework import DjangoFilterBackend
# from django.db.models import Count, Q
# from django.utils import timezone
# from datetime import timedelta

# # ⭐⭐ CORRECTION CRITIQUE : IMPORT DEPUIS projects.serializers ⭐⭐
# from .serializers import UserSerializer, UserCreateSerializer
# try:
#     from projects.serializers import UserWithProjectsSerializer
# except ImportError:
#     # Fallback si pas encore défini dans projects
#     from .serializers import UserSerializer as UserWithProjectsSerializer

# from projects.models import Project

# class StandardPagination(PageNumberPagination):
#     page_size = 20
#     page_size_query_param = 'page_size'
#     max_page_size = 100

# class AdminUserViewSet(viewsets.ModelViewSet):
#     """
#     API endpoint pour la gestion admin des utilisateurs
#     URL: /api/users/admin/users/
#     """
#     queryset = User.objects.all().order_by('-date_joined')
#     permission_classes = [permissions.IsAdminUser]
#     pagination_class = StandardPagination
#     filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
#     filterset_fields = ['is_active', 'is_staff', 'is_superuser']
#     search_fields = ['username', 'email', 'first_name', 'last_name']
#     ordering_fields = ['username', 'date_joined', 'last_login', 'email']
    
#     def get_serializer_class(self):
#         if self.action == 'create':
#             return UserCreateSerializer
#         elif self.action in ['update', 'partial_update']:
#             return UserCreateSerializer
#         elif self.action == 'retrieve':
#             return UserSerializer
#         return UserSerializer
    
#     @action(detail=True, methods=['get'])
#     def projects(self, request, pk=None):
#         """Récupérer les projets d'un utilisateur spécifique"""
#         user = self.get_object()
#         projects = Project.objects.filter(author=user)
        
#         from projects.serializers import ProjectSerializer
#         serializer = ProjectSerializer(projects, many=True)
        
#         return Response({
#             'user': user.username,
#             'projects_count': projects.count(),
#             'projects': serializer.data
#         })
    
#     @action(detail=False, methods=['get'])
#     def stats(self, request):
#         """Statistiques globales sur les utilisateurs"""
#         total = User.objects.count()
#         active = User.objects.filter(is_active=True).count()
#         inactive = User.objects.filter(is_active=False).count()
#         staff = User.objects.filter(is_staff=True).count()
#         superusers = User.objects.filter(is_superuser=True).count()
        
#         # Utilisateurs récemment inscrits (7 derniers jours)
#         week_ago = timezone.now() - timedelta(days=7)
#         recent_users = User.objects.filter(date_joined__gte=week_ago).count()
        
#         # Utilisateurs actifs récemment (30 derniers jours)
#         month_ago = timezone.now() - timedelta(days=30)
#         active_recently = User.objects.filter(
#             last_login__gte=month_ago,
#             is_active=True
#         ).count()
        
#         # Utilisateurs Simplon
#         simplon_users = User.objects.filter(username__startswith='simplon_').count()
        
#         # Distribution par statut
#         status_distribution = {
#             'active': active,
#             'inactive': inactive,
#             'staff': staff,
#             'superusers': superusers,
#             'simplon_users': simplon_users
#         }
        
#         # Données temporelles
#         today = timezone.now().date()
#         yesterday = today - timedelta(days=1)
        
#         new_today = User.objects.filter(date_joined__date=today).count()
#         new_yesterday = User.objects.filter(date_joined__date=yesterday).count()
        
#         return Response({
#             'total_users': total,
#             'active_users': active,
#             'inactive_users': inactive,
#             'staff_users': staff,
#             'superuser_users': superusers,
#             'recent_users': recent_users,
#             'active_recently': active_recently,
#             'simplon_users': simplon_users,
#             'status_distribution': status_distribution,
#             'new_today': new_today,
#             'new_yesterday': new_yesterday
#         })
    
#     @action(detail=False, methods=['get'])
#     def recent(self, request):
#         """Récupérer les utilisateurs récents (10 derniers)"""
#         recent_users = User.objects.all().order_by('-date_joined')[:10]
#         serializer = UserWithProjectsSerializer(recent_users, many=True)
#         return Response(serializer.data)
    
#     @action(detail=False, methods=['get'])
#     def active(self, request):
#         """Récupérer les utilisateurs actifs récemment"""
#         month_ago = timezone.now() - timedelta(days=30)
#         active_users = User.objects.filter(
#             last_login__gte=month_ago,
#             is_active=True
#         ).order_by('-last_login')
        
#         page = self.paginate_queryset(active_users)
#         if page is not None:
#             serializer = UserWithProjectsSerializer(page, many=True)
#             return self.get_paginated_response(serializer.data)
        
#         serializer = UserWithProjectsSerializer(active_users, many=True)
#         return Response(serializer.data)

# class DashboardStatsView(viewsets.ViewSet):
#     """
#     Vue pour les statistiques du dashboard admin
#     """
#     permission_classes = [permissions.IsAdminUser]
    
#     def list(self, request):
#         """Retourne toutes les stats pour le dashboard"""
#         try:
#             print("🔍 Génération des stats dashboard...")
            
#             # 1. Statistiques utilisateurs
#             total_users = User.objects.count()
#             active_users = User.objects.filter(is_active=True).count()
#             inactive_users = User.objects.filter(is_active=False).count()
#             staff_users = User.objects.filter(is_staff=True).count()
            
#             # 2. Statistiques projets
#             total_projects = Project.objects.count()
#             published_projects = Project.objects.filter(status='published').count()
#             pending_projects = Project.objects.filter(status='pending').count()
#             draft_projects = Project.objects.filter(status='draft').count()
            
#             # 3. Téléchargements (à adapter selon votre modèle)
#             total_downloads = 0  # Remplacer par votre logique
            
#             # 4. Utilisateurs récents (5 derniers)
#             recent_users = User.objects.all().order_by('-date_joined')[:5]
#             recent_users_data = []
#             for user in recent_users:
#                 recent_users_data.append({
#                     'id': user.id,
#                     'username': user.username,
#                     'email': user.email,
#                     'first_name': user.first_name,
#                     'last_name': user.last_name,
#                     'date_joined': user.date_joined,
#                     'is_active': user.is_active
#                 })
            
#             # 5. Projets récents (5 derniers)
#             recent_projects = Project.objects.all().order_by('-created_at')[:5]
#             recent_projects_data = []
#             for project in recent_projects:
#                 recent_projects_data.append({
#                     'id': project.id,
#                     'title': project.title,
#                     'author': {
#                         'username': project.author.username if project.author else 'Anonyme',
#                         'first_name': project.author.first_name if project.author else '',
#                         'last_name': project.author.last_name if project.author else ''
#                     },
#                     'status': project.status,
#                     'created_at': project.created_at,
#                     'technologies': project.technologies
#                 })
            
#             print(f"✅ Stats générées: {total_users} users, {total_projects} projets")
            
#             return Response({
#                 'success': True,
#                 'stats': {
#                     'total_users': total_users,
#                     'total_projects': total_projects,
#                     'total_downloads': total_downloads,
#                     'pending_projects': pending_projects,
#                     'approved_projects': published_projects,
#                     'draft_projects': draft_projects,
#                     'active_users': active_users,
#                     'inactive_users': inactive_users,
#                     'staff_users': staff_users
#                 },
#                 'recent_users': recent_users_data,
#                 'recent_projects': recent_projects_data,
#                 'timestamp': timezone.now().isoformat()
#             })
            
#         except Exception as e:
#             print(f"❌ Erreur génération stats: {str(e)}")
#             return Response({
#                 'success': False,
#                 'error': str(e),
#                 'message': 'Erreur lors de la génération des statistiques'
#             }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# # users/views_api.py - API ADMIN DASHBOARD
# from rest_framework import viewsets, permissions, status
# from rest_framework.decorators import action
# from rest_framework.response import Response
# from django.contrib.auth.models import User
# from django.db.models import Count, Q
# from django.utils import timezone
# from datetime import timedelta
# from .serializers import (
#     UserCreateSerializer, UserWithProfileSerializer,
#     UserStatsSerializer
# )
# from .models import UserProfile, Notification, ProfileUpdateHistory

# # ============ VIEWSET ADMIN UTILISATEURS ============

# class AdminUserViewSet(viewsets.ModelViewSet):
#     """
#     ViewSet pour la gestion admin des utilisateurs
#     """
#     permission_classes = [permissions.IsAdminUser]
#     queryset = User.objects.all().order_by('-date_joined')
    
#     def get_serializer_class(self):
#         if self.action == 'create':
#             return UserCreateSerializer
#         elif self.action == 'retrieve' or self.action == 'update':
#             return UserWithProfileSerializer
#         return UserCreateSerializer
    
#     @action(detail=True, methods=['post'])
#     def activate(self, request, pk=None):
#         """Activer/désactiver un utilisateur"""
#         user = self.get_object()
#         user.is_active = not user.is_active
#         user.save()
        
#         status_text = "activé" if user.is_active else "désactivé"
#         return Response({
#             'status': 'success',
#             'message': f'Utilisateur {status_text}',
#             'is_active': user.is_active
#         })
    
#     @action(detail=True, methods=['get'])
#     def profile(self, request, pk=None):
#         """Récupérer le profil complet d'un utilisateur"""
#         user = self.get_object()
#         serializer = UserWithProfileSerializer(user)
#         return Response(serializer.data)

# # ============ VIEWSET STATISTIQUES ============

# class DashboardStatsView(viewsets.ViewSet):
#     """
#     ViewSet pour les statistiques dashboard admin
#     """
#     permission_classes = [permissions.IsAdminUser]
    
#     def list(self, request):
#         """Retourne les statistiques globales"""
#         now = timezone.now()
#         last_week = now - timedelta(days=7)
        
#         # Calculs statistiques
#         total_users = User.objects.count()
#         active_today = User.objects.filter(
#             last_login__date=now.date()
#         ).count()
        
#         new_this_week = User.objects.filter(
#             date_joined__gte=last_week
#         ).count()
        
#         with_profile = User.objects.filter(
#             userprofile__isnull=False
#         ).count()
        
#         without_profile = total_users - with_profile
        
#         # Statistiques sur 7 jours
#         daily_stats = []
#         for i in range(6, -1, -1):
#             day = now - timedelta(days=i)
#             day_start = day.replace(hour=0, minute=0, second=0, microsecond=0)
#             day_end = day.replace(hour=23, minute=59, second=59, microsecond=999999)
            
#             new_users = User.objects.filter(
#                 date_joined__range=(day_start, day_end)
#             ).count()
            
#             active_users = User.objects.filter(
#                 last_login__range=(day_start, day_end)
#             ).count()
            
#             daily_stats.append({
#                 'date': day.date().isoformat(),
#                 'new_users': new_users,
#                 'active_users': active_users,
#                 'total_logins': active_users  # Approximation
#             })
        
#         data = {
#             'total_users': total_users,
#             'active_today': active_today,
#             'new_this_week': new_this_week,
#             'with_profile': with_profile,
#             'without_profile': without_profile,
#             'last_7_days': daily_stats
#         }
        
#         serializer = UserStatsSerializer(data)
#         return Response(serializer.data)
    
#     @action(detail=False, methods=['get'])
#     def realtime(self, request):
#         """Statistiques en temps réel"""
#         online_users = User.objects.filter(
#             last_login__gte=timezone.now() - timedelta(minutes=5)
#         ).count()
        
#         return Response({
#             'online_users': online_users,
#             'total_sessions': request.session.__len__() if hasattr(request, 'session') else 0,
#             'server_time': timezone.now().isoformat()
#         })


# # users/views_api.py - VERSION COMPLÈTE ET AMÉLIORÉE
# from django.contrib.auth.models import User
# from django.contrib.auth import authenticate
# from django.db.models import Count, Q
# from django.utils import timezone
# from datetime import timedelta
# from rest_framework import viewsets, permissions, status, generics
# from rest_framework.decorators import api_view, permission_classes, action
# from rest_framework.response import Response
# from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
# from rest_framework.views import APIView
# from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
# from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
# import json
# import logging

# from projects.models import Project
# from projects.serializers import ProjectSerializer
# from .models import UserProfile, Notification, ProfileUpdateHistory
# from .serializers import (
#     UserCreateSerializer, UserWithProfileSerializer,
#     UserStatsSerializer, UserProfileSerializer,
#     NotificationSerializer, ProfileUpdateHistorySerializer,
#     ProjectSerializer
# )

# logger = logging.getLogger(__name__)

# # ============ VUES D'AUTHENTIFICATION ============

# class UniversalLoginView(APIView):
#     """
#     Vue de login universelle qui accepte username/matricule/email
#     """
#     permission_classes = [AllowAny]
    
#     def post(self, request):
#         identifier = request.data.get('identifier', '').strip()
#         password = request.data.get('password', '')
        
#         if not identifier or not password:
#             return Response({
#                 'success': False,
#                 'message': 'Identifiant et mot de passe requis'
#             }, status=status.HTTP_400_BAD_REQUEST)
        
#         # Essayer de trouver l'utilisateur par username, email, ou matricule
#         user = None
        
#         # 1. Par username
#         user = User.objects.filter(username=identifier).first()
        
#         # 2. Par email (si pas trouvé par username)
#         if not user:
#             user = User.objects.filter(email=identifier).first()
        
#         # 3. Par matricule (dans le profil)
#         if not user:
#             try:
#                 profile = UserProfile.objects.filter(matricule=identifier).first()
#                 if profile:
#                     user = profile.user
#             except:
#                 pass
        
#         if not user:
#             return Response({
#                 'success': False,
#                 'message': 'Identifiant non trouvé'
#             }, status=status.HTTP_404_NOT_FOUND)
        
#         # Authentifier avec le mot de passe
#         auth_user = authenticate(username=user.username, password=password)
        
#         if not auth_user:
#             return Response({
#                 'success': False,
#                 'message': 'Mot de passe incorrect'
#             }, status=status.HTTP_401_UNAUTHORIZED)
        
#         if not auth_user.is_active:
#             return Response({
#                 'success': False,
#                 'message': 'Compte désactivé'
#             }, status=status.HTTP_403_FORBIDDEN)
        
#         # Générer les tokens JWT
#         refresh = RefreshToken.for_user(auth_user)
        
#         # Mettre à jour la dernière connexion
#         auth_user.last_login = timezone.now()
#         auth_user.save()
        
#         # Récupérer ou créer le profil
#         profile, created = UserProfile.objects.get_or_create(user=auth_user)
        
#         # Données utilisateur complètes
#         user_data = {
#             'id': auth_user.id,
#             'username': auth_user.username,
#             'email': auth_user.email,
#             'first_name': auth_user.first_name,
#             'last_name': auth_user.last_name,
#             'full_name': f"{auth_user.first_name or ''} {auth_user.last_name or ''}".strip() or auth_user.username,
#             'is_staff': auth_user.is_staff,
#             'is_superuser': auth_user.is_superuser,
#             'is_active': auth_user.is_active,
#             'date_joined': auth_user.date_joined,
#             'last_login': auth_user.last_login,
#             'role': 'admin' if auth_user.is_staff else 'user',
#             'matricule': profile.matricule if profile else None,
#             'cohort': profile.cohort if profile else None,
#             'profile_complete': bool(auth_user.first_name and auth_user.last_name and auth_user.email),
#             'has_profile': bool(profile and (profile.matricule or profile.cohort))
#         }
        
#         return Response({
#             'success': True,
#             'message': 'Connexion réussie',
#             'user': user_data,
#             'tokens': {
#                 'access': str(refresh.access_token),
#                 'refresh': str(refresh)
#             }
#         })

# class QuickLoginView(APIView):
#     """
#     Login rapide (sans mot de passe pour démo/développement)
#     """
#     permission_classes = [AllowAny]
    
#     def post(self, request):
#         username = request.data.get('username', 'admin')
        
#         # Pour la démo, on accepte n'importe quel utilisateur
#         try:
#             user = User.objects.get(username=username)
#         except User.DoesNotExist:
#             # Essayer par email
#             user = User.objects.filter(email=username).first()
            
#         if not user:
#             return Response({
#                 'success': False,
#                 'message': f'Utilisateur {username} non trouvé'
#             }, status=status.HTTP_404_NOT_FOUND)
        
#         if not user.is_active:
#             return Response({
#                 'success': False,
#                 'message': 'Compte désactivé'
#             }, status=status.HTTP_403_FORBIDDEN)
        
#         # Générer les tokens
#         refresh = RefreshToken.for_user(user)
        
#         # Mettre à jour la dernière connexion
#         user.last_login = timezone.now()
#         user.save()
        
#         # Données utilisateur
#         user_data = {
#             'id': user.id,
#             'username': user.username,
#             'email': user.email,
#             'first_name': user.first_name,
#             'last_name': user.last_name,
#             'is_staff': user.is_staff,
#             'is_superuser': user.is_superuser,
#             'role': 'admin' if user.is_staff else 'user',
#             'profile_complete': bool(user.first_name and user.last_name and user.email)
#         }
        
#         return Response({
#             'success': True,
#             'message': 'Connexion rapide réussie',
#             'user': user_data,
#             'tokens': {
#                 'access': str(refresh.access_token),
#                 'refresh': str(refresh)
#             }
#         })

# class RequestLoginView(APIView):
#     """
#     Demande de connexion (pour envoi de lien/mail)
#     """
#     permission_classes = [AllowAny]
    
#     def post(self, request):
#         identifier = request.data.get('identifier', '').strip()
        
#         if not identifier:
#             return Response({
#                 'success': False,
#                 'message': 'Identifiant requis (email/matricule)'
#             }, status=status.HTTP_400_BAD_REQUEST)
        
#         # Trouver l'utilisateur
#         user = User.objects.filter(email=identifier).first()
        
#         if not user:
#             # Chercher par matricule
#             try:
#                 profile = UserProfile.objects.filter(matricule=identifier).first()
#                 if profile:
#                     user = profile.user
#             except:
#                 pass
        
#         if not user:
#             return Response({
#                 'success': False,
#                 'message': 'Identifiant non trouvé'
#             }, status=status.HTTP_404_NOT_FOUND)
        
#         # Générer un token temporaire pour le lien
#         temp_token = RefreshToken.for_user(user).access_token
        
#         # En production, vous enverriez un email ici
#         # Pour la démo, on retourne juste le token
        
#         return Response({
#             'success': True,
#             'message': f'Lien de connexion généré pour {user.email}',
#             'user_id': user.id,
#             'email': user.email,
#             'temp_token': str(temp_token)[:50] + '...',  # Partiel pour sécurité
#             'next_step': '/setup-password/'  # URL pour le frontend
#         })

# class SetupPasswordView(APIView):
#     """
#     Configuration du mot de passe (après demande de connexion)
#     """
#     permission_classes = [AllowAny]
    
#     def post(self, request):
#         token = request.data.get('token', '')
#         new_password = request.data.get('password', '')
        
#         if not token or not new_password:
#             return Response({
#                 'success': False,
#                 'message': 'Token et nouveau mot de passe requis'
#             }, status=status.HTTP_400_BAD_REQUEST)
        
#         # Vérifier le token (simplifié pour la démo)
#         # En production, utilisez un système de token temporaire
        
#         user_id = request.data.get('user_id')
#         if not user_id:
#             return Response({
#                 'success': False,
#                 'message': 'ID utilisateur manquant'
#             })
        
#         try:
#             user = User.objects.get(id=user_id)
            
#             # Définir le nouveau mot de passe
#             user.set_password(new_password)
#             user.save()
            
#             return Response({
#                 'success': True,
#                 'message': 'Mot de passe configuré avec succès',
#                 'user_id': user.id,
#                 'username': user.username
#             })
            
#         except User.DoesNotExist:
#             return Response({
#                 'success': False,
#                 'message': 'Utilisateur non trouvé'
#             }, status=status.HTTP_404_NOT_FOUND)

# # ============ VUES DE PROFIL ============

# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def get_current_user(request):
#     """
#     Récupère l'utilisateur courant - VUE SIMPLE POUR LE FRONTEND
#     """
#     user = request.user
    
#     # Récupérer le profil
#     profile = None
#     try:
#         profile = UserProfile.objects.get(user=user)
#     except UserProfile.DoesNotExist:
#         profile = None
    
#     # Compter les projets
#     projects_count = Project.objects.filter(author=user).count()
    
#     return Response({
#         'id': user.id,
#         'username': user.username,
#         'email': user.email,
#         'first_name': user.first_name,
#         'last_name': user.last_name,
#         'full_name': f"{user.first_name or ''} {user.last_name or ''}".strip() or user.username,
#         'is_staff': user.is_staff,
#         'is_superuser': user.is_superuser,
#         'is_active': user.is_active,
#         'date_joined': user.date_joined,
#         'last_login': user.last_login,
#         'role': 'admin' if user.is_staff else 'user',
#         'profile_complete': bool(user.first_name and user.last_name and user.email),
#         'matricule': profile.matricule if profile else None,
#         'cohort': profile.cohort if profile else None,
#         'phone': profile.phone if profile else None,
#         'bio': profile.bio if profile else None,
#         'projects_count': projects_count,
#         'has_password': user.has_usable_password(),
#         'permissions': list(user.get_all_permissions())
#     })

# class UserProfileView(APIView):
#     """
#     Vue pour le profil utilisateur
#     """
#     permission_classes = [IsAuthenticated]
    
#     def get(self, request):
#         """Récupérer le profil"""
#         try:
#             profile = UserProfile.objects.get(user=request.user)
#             serializer = UserProfileSerializer(profile)
#             return Response(serializer.data)
#         except UserProfile.DoesNotExist:
#             # Créer un profil vide si inexistant
#             profile = UserProfile.objects.create(user=request.user)
#             serializer = UserProfileSerializer(profile)
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
    
#     def put(self, request):
#         """Mettre à jour le profil"""
#         try:
#             profile = UserProfile.objects.get(user=request.user)
#         except UserProfile.DoesNotExist:
#             profile = UserProfile.objects.create(user=request.user)
        
#         serializer = UserProfileSerializer(profile, data=request.data, partial=True)
#         if serializer.is_valid():
#             serializer.save()
            
#             # Historiser la mise à jour
#             ProfileUpdateHistory.objects.create(
#                 user=request.user,
#                 field='profile',
#                 old_value=json.dumps({'action': 'update'}),
#                 new_value=json.dumps(request.data),
#                 changed_by=request.user
#             )
            
#             return Response(serializer.data)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# class UserExtendedProfileView(APIView):
#     """
#     Profil utilisateur étendu avec statistiques
#     """
#     permission_classes = [IsAuthenticated]
    
#     def get(self, request):
#         user = request.user
        
#         # Données de base
#         try:
#             profile = UserProfile.objects.get(user=user)
#             profile_data = UserProfileSerializer(profile).data
#         except UserProfile.DoesNotExist:
#             profile_data = {}
        
#         # Statistiques
#         projects = Project.objects.filter(author=user)
#         projects_count = projects.count()
#         published_projects = projects.filter(status='publié').count()
#         pending_projects = projects.filter(status='en_attente').count()
        
#         # Dernière activité
#         last_project = projects.order_by('-created_at').first()
        
#         return Response({
#             'user': {
#                 'id': user.id,
#                 'username': user.username,
#                 'email': user.email,
#                 'first_name': user.first_name,
#                 'last_name': user.last_name,
#                 'is_staff': user.is_staff,
#                 'date_joined': user.date_joined,
#                 'last_login': user.last_login
#             },
#             'profile': profile_data,
#             'stats': {
#                 'total_projects': projects_count,
#                 'published_projects': published_projects,
#                 'pending_projects': pending_projects,
#                 'approval_rate': (published_projects / projects_count * 100) if projects_count > 0 else 0
#             },
#             'last_activity': {
#                 'last_project': ProjectSerializer(last_project).data if last_project else None,
#                 'profile_updated': profile.updated_at if hasattr(profile, 'updated_at') else None
#             }
#         })

# class UserProfileCompleteView(APIView):
#     """
#     Vérifier et marquer le profil comme complet
#     """
#     permission_classes = [IsAuthenticated]
    
#     def get(self, request):
#         user = request.user
        
#         # Vérifier les champs requis
#         required_fields = {
#             'first_name': bool(user.first_name),
#             'last_name': bool(user.last_name),
#             'email': bool(user.email),
#         }
        
#         # Vérifier le profil
#         try:
#             profile = UserProfile.objects.get(user=user)
#             required_fields['matricule'] = bool(profile.matricule)
#             required_fields['cohort'] = bool(profile.cohort)
#         except UserProfile.DoesNotExist:
#             required_fields['matricule'] = False
#             required_fields['cohort'] = False
        
#         all_complete = all(required_fields.values())
#         completed_fields = sum(required_fields.values())
#         total_fields = len(required_fields)
        
#         return Response({
#             'is_complete': all_complete,
#             'progress': {
#                 'completed': completed_fields,
#                 'total': total_fields,
#                 'percentage': int((completed_fields / total_fields) * 100)
#             },
#             'missing_fields': [field for field, is_set in required_fields.items() if not is_set],
#             'required_fields': required_fields
#         })

# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def get_complete_profile(request):
#     """
#     Profil complet avec toutes les données
#     """
#     user = request.user
    
#     try:
#         profile = UserProfile.objects.get(user=user)
#         profile_data = UserProfileSerializer(profile).data
#     except UserProfile.DoesNotExist:
#         profile_data = {}
    
#     # Projets de l'utilisateur
#     projects = Project.objects.filter(author=user)
#     projects_data = ProjectSerializer(projects, many=True).data
    
#     # Notifications non lues
#     notifications = Notification.objects.filter(user=user, is_read=False)
#     notifications_data = NotificationSerializer(notifications, many=True).data
    
#     return Response({
#         'user': {
#             'id': user.id,
#             'username': user.username,
#             'email': user.email,
#             'first_name': user.first_name,
#             'last_name': user.last_name,
#             'full_name': f"{user.first_name or ''} {user.last_name or ''}".strip() or user.username,
#             'is_staff': user.is_staff,
#             'is_superuser': user.is_superuser,
#             'is_active': user.is_active,
#             'date_joined': user.date_joined,
#             'last_login': user.last_login,
#             'role': 'admin' if user.is_staff else 'user'
#         },
#         'profile': profile_data,
#         'projects': projects_data,
#         'unread_notifications': notifications_data,
#         'unread_count': notifications.count(),
#         'last_updated': timezone.now()
#     })

# class UserProfileImageView(APIView):
#     """
#     Gestion de l'avatar utilisateur
#     """
#     permission_classes = [IsAuthenticated]
    
#     def get(self, request):
#         try:
#             profile = UserProfile.objects.get(user=request.user)
#             if profile.avatar:
#                 return Response({
#                     'avatar_url': profile.avatar.url,
#                     'has_avatar': True
#                 })
#         except UserProfile.DoesNotExist:
#             pass
        
#         return Response({
#             'avatar_url': None,
#             'has_avatar': False
#         })
    
#     def post(self, request):
#         try:
#             profile = UserProfile.objects.get(user=request.user)
#         except UserProfile.DoesNotExist:
#             profile = UserProfile.objects.create(user=request.user)
        
#         if 'avatar' in request.FILES:
#             profile.avatar = request.FILES['avatar']
#             profile.save()
            
#             return Response({
#                 'success': True,
#                 'message': 'Avatar mis à jour',
#                 'avatar_url': profile.avatar.url
#             })
        
#         return Response({
#             'success': False,
#             'message': 'Aucun fichier fourni'
#         }, status=status.HTTP_400_BAD_REQUEST)
    
#     def delete(self, request):
#         try:
#             profile = UserProfile.objects.get(user=request.user)
#             if profile.avatar:
#                 profile.avatar.delete()
#                 profile.save()
                
#                 return Response({
#                     'success': True,
#                     'message': 'Avatar supprimé'
#                 })
#         except UserProfile.DoesNotExist:
#             pass
        
#         return Response({
#             'success': False,
#             'message': 'Pas d\'avatar à supprimer'
#         })

# class UserProfileHistoryView(APIView):
#     """
#     Historique des modifications du profil
#     """
#     permission_classes = [IsAuthenticated]
    
#     def get(self, request):
#         history = ProfileUpdateHistory.objects.filter(user=request.user).order_by('-created_at')
#         serializer = ProfileUpdateHistorySerializer(history, many=True)
#         return Response(serializer.data)

# # ============ VUES DE PROJETS ============

# class UserProjectsAPIView(APIView):
#     """
#     Récupère les projets d'un utilisateur
#     """
#     permission_classes = [IsAuthenticated]
    
#     def get(self, request, user_id=None):
#         # Si user_id est fourni, vérifier les permissions
#         if user_id:
#             # Admin peut voir les projets de n'importe qui
#             if request.user.is_staff:
#                 target_user_id = user_id
#             # Sinon, on ne peut voir que ses propres projets
#             elif request.user.id != user_id:
#                 return Response({
#                     'error': 'Vous n\'avez pas la permission de voir les projets de cet utilisateur'
#                 }, status=status.HTTP_403_FORBIDDEN)
#             else:
#                 target_user_id = user_id
#         else:
#             # Pas d'ID fourni = utilisateur courant
#             target_user_id = request.user.id
        
#         try:
#             user = User.objects.get(id=target_user_id)
#         except User.DoesNotExist:
#             return Response({
#                 'error': 'Utilisateur non trouvé'
#             }, status=status.HTTP_404_NOT_FOUND)
        
#         projects = Project.objects.filter(author=user).order_by('-created_at')
        
#         # Filtrer par statut si fourni
#         status_filter = request.query_params.get('status')
#         if status_filter:
#             projects = projects.filter(status=status_filter)
        
#         # Pagination simple
#         page = int(request.query_params.get('page', 1))
#         page_size = int(request.query_params.get('page_size', 10))
#         start = (page - 1) * page_size
#         end = start + page_size
        
#         total = projects.count()
#         paginated_projects = projects[start:end]
        
#         serializer = ProjectSerializer(paginated_projects, many=True)
        
#         return Response({
#             'user': {
#                 'id': user.id,
#                 'username': user.username,
#                 'email': user.email
#             },
#             'projects': serializer.data,
#             'pagination': {
#                 'page': page,
#                 'page_size': page_size,
#                 'total': total,
#                 'total_pages': (total + page_size - 1) // page_size,
#                 'has_next': end < total,
#                 'has_previous': start > 0
#             }
#         })

# class UserProjectsCountView(APIView):
#     """
#     Compte les projets d'un utilisateur par statut
#     """
#     permission_classes = [IsAuthenticated]
    
#     def get(self, request, user_id=None):
#         if user_id:
#             if request.user.is_staff:
#                 target_user_id = user_id
#             elif request.user.id != user_id:
#                 return Response({
#                     'error': 'Permission refusée'
#                 }, status=status.HTTP_403_FORBIDDEN)
#             else:
#                 target_user_id = user_id
#         else:
#             target_user_id = request.user.id
        
#         try:
#             user = User.objects.get(id=target_user_id)
#         except User.DoesNotExist:
#             return Response({
#                 'error': 'Utilisateur non trouvé'
#             }, status=status.HTTP_404_NOT_FOUND)
        
#         projects = Project.objects.filter(author=user)
        
#         counts = {
#             'total': projects.count(),
#             'draft': projects.filter(status='draft').count(),
#             'pending': projects.filter(status='pending').count(),
#             'approved': projects.filter(status='approved').count(),
#             'published': projects.filter(status='publié').count(),
#             'rejected': projects.filter(status='rejected').count()
#         }
        
#         return Response({
#             'user': {
#                 'id': user.id,
#                 'username': user.username
#             },
#             'counts': counts
#         })

# # ============ VUES ADMIN ============

# class AdminUserViewSet(viewsets.ModelViewSet):
#     """
#     ViewSet pour la gestion admin des utilisateurs
#     """
#     permission_classes = [IsAdminUser]
#     queryset = User.objects.all().order_by('-date_joined')
    
#     def get_serializer_class(self):
#         if self.action == 'create':
#             return UserCreateSerializer
#         elif self.action == 'retrieve' or self.action == 'update':
#             return UserWithProfileSerializer
#         return UserCreateSerializer
    
#     @action(detail=True, methods=['post'])
#     def activate(self, request, pk=None):
#         """Activer/désactiver un utilisateur"""
#         user = self.get_object()
#         user.is_active = not user.is_active
#         user.save()
        
#         status_text = "activé" if user.is_active else "désactivé"
#         return Response({
#             'status': 'success',
#             'message': f'Utilisateur {status_text}',
#             'is_active': user.is_active
#         })
    
#     @action(detail=True, methods=['get'])
#     def profile(self, request, pk=None):
#         """Récupérer le profil complet d'un utilisateur"""
#         user = self.get_object()
#         serializer = UserWithProfileSerializer(user)
#         return Response(serializer.data)
    
#     @action(detail=False, methods=['get'])
#     def stats(self, request):
#         """Statistiques admin"""
#         now = timezone.now()
#         last_week = now - timedelta(days=7)
        
#         # Calculs statistiques
#         total_users = User.objects.count()
#         active_today = User.objects.filter(
#             last_login__date=now.date()
#         ).count()
        
#         new_this_week = User.objects.filter(
#             date_joined__gte=last_week
#         ).count()
        
#         with_profile = User.objects.filter(
#             userprofile__isnull=False
#         ).count()
        
#         without_profile = total_users - with_profile
        
#         # Admins
#         admins = User.objects.filter(is_staff=True).count()
        
#         # Projets par utilisateur
#         users_with_projects = User.objects.annotate(
#             project_count=Count('project')
#         ).filter(project_count__gt=0).count()
        
#         # Utilisateurs actifs (connectés dans les 7 jours)
#         active_users = User.objects.filter(
#             last_login__gte=last_week
#         ).count()
        
#         return Response({
#             'total_users': total_users,
#             'active_today': active_today,
#             'active_this_week': active_users,
#             'new_this_week': new_this_week,
#             'with_profile': with_profile,
#             'without_profile': without_profile,
#             'admins': admins,
#             'users_with_projects': users_with_projects,
#             'users_without_projects': total_users - users_with_projects,
#             'timestamp': now.isoformat()
#         })

# # ============ VUES UTILITAIRES ============

# @api_view(['GET'])
# @permission_classes([AllowAny])
# def get_all_users_simple(request):
#     """Liste simple de tous les utilisateurs (public)"""
#     users = User.objects.filter(is_active=True).values('id', 'username', 'email', 'first_name', 'last_name')
#     return Response(list(users))

# @api_view(['GET'])
# @permission_classes([IsAdminUser])
# def get_all_users_admin(request):
#     """Liste complète de tous les utilisateurs (admin)"""
#     users = User.objects.all().order_by('-date_joined')
#     serializer = UserWithProfileSerializer(users, many=True)
#     return Response(serializer.data)

# @api_view(['GET'])
# @permission_classes([AllowAny])
# def health_check(request):
#     """Vérification de santé de l'API"""
#     users_count = User.objects.count()
#     active_users = User.objects.filter(is_active=True).count()
    
#     return Response({
#         'status': 'healthy',
#         'timestamp': timezone.now().isoformat(),
#         'database': {
#             'total_users': users_count,
#             'active_users': active_users
#         },
#         'services': {
#             'authentication': 'operational',
#             'database': 'operational',
#             'api': 'operational'
#         }
#     })

# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def user_status(request):
#     """Statut de l'utilisateur courant"""
#     user = request.user
    
#     # Dernières activités
#     last_project = Project.objects.filter(author=user).order_by('-created_at').first()
    
#     # Notifications non lues
#     unread_notifications = Notification.objects.filter(user=user, is_read=False).count()
    
#     return Response({
#         'user': {
#             'id': user.id,
#             'username': user.username,
#             'is_active': user.is_active,
#             'is_authenticated': True
#         },
#         'last_activity': {
#             'project': ProjectSerializer(last_project).data if last_project else None,
#             'login': user.last_login
#         },
#         'notifications': {
#             'unread': unread_notifications
#         },
#         'timestamp': timezone.now().isoformat()
#     })

# # ============ NOTIFICATIONS ============

# class UserNotificationsView(APIView):
#     """
#     Gestion des notifications utilisateur
#     """
#     permission_classes = [IsAuthenticated]
    
#     def get(self, request):
#         # Récupérer les notifications
#         notifications = Notification.objects.filter(user=request.user).order_by('-created_at')
        
#         # Marquer comme lues si demandé
#         mark_read = request.query_params.get('mark_read', 'false').lower() == 'true'
#         if mark_read:
#             notifications.update(is_read=True)
        
#         # Pagination
#         page = int(request.query_params.get('page', 1))
#         page_size = int(request.query_params.get('page_size', 20))
#         start = (page - 1) * page_size
#         end = start + page_size
        
#         total = notifications.count()
#         paginated_notifications = notifications[start:end]
        
#         serializer = NotificationSerializer(paginated_notifications, many=True)
        
#         # Compter les non lues
#         unread_count = Notification.objects.filter(user=request.user, is_read=False).count()
        
#         return Response({
#             'notifications': serializer.data,
#             'unread_count': unread_count,
#             'pagination': {
#                 'page': page,
#                 'page_size': page_size,
#                 'total': total,
#                 'total_pages': (total + page_size - 1) // page_size
#             }
#         })
    
#     def post(self, request):
#         # Marquer toutes comme lues
#         if request.data.get('mark_all_read', False):
#             Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)
#             return Response({
#                 'success': True,
#                 'message': 'Toutes les notifications marquées comme lues'
#             })
        
#         # Marquer une notification spécifique comme lue
#         notification_id = request.data.get('notification_id')
#         if notification_id:
#             try:
#                 notification = Notification.objects.get(id=notification_id, user=request.user)
#                 notification.is_read = True
#                 notification.save()
#                 return Response({
#                     'success': True,
#                     'message': 'Notification marquée comme lue'
#                 })
#             except Notification.DoesNotExist:
#                 return Response({
#                     'success': False,
#                     'message': 'Notification non trouvée'
#                 }, status=status.HTTP_404_NOT_FOUND)
        
#         return Response({
#             'success': False,
#             'message': 'Action non spécifiée'
#         }, status=status.HTTP_400_BAD_REQUEST)

# # ============ CHANGEMENT DE MOT DE PASSE ============

# class ChangePasswordView(APIView):
#     """
#     Changement de mot de passe
#     """
#     permission_classes = [IsAuthenticated]
    
#     def post(self, request):
#         old_password = request.data.get('old_password')
#         new_password = request.data.get('new_password')
#         confirm_password = request.data.get('confirm_password')
        
#         if not all([old_password, new_password, confirm_password]):
#             return Response({
#                 'success': False,
#                 'message': 'Tous les champs sont requis'
#             }, status=status.HTTP_400_BAD_REQUEST)
        
#         if new_password != confirm_password:
#             return Response({
#                 'success': False,
#                 'message': 'Les nouveaux mots de passe ne correspondent pas'
#             }, status=status.HTTP_400_BAD_REQUEST)
        
#         # Vérifier l'ancien mot de passe
#         user = request.user
#         if not user.check_password(old_password):
#             return Response({
#                 'success': False,
#                 'message': 'Ancien mot de passe incorrect'
#             }, status=status.HTTP_400_BAD_REQUEST)
        
#         # Changer le mot de passe
#         user.set_password(new_password)
#         user.save()
        
#         # Invalider les tokens existants
#         # (En production, vous pourriez vouloir invalider les tokens JWT)
        
#         return Response({
#             'success': True,
#             'message': 'Mot de passe changé avec succès'
#         })