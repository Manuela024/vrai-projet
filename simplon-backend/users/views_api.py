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

# users/views_api.py - API ADMIN DASHBOARD
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.db.models import Count, Q
from django.utils import timezone
from datetime import timedelta
from .serializers import (
    UserCreateSerializer, UserWithProfileSerializer,
    UserStatsSerializer
)
from .models import UserProfile, Notification, ProfileUpdateHistory

# ============ VIEWSET ADMIN UTILISATEURS ============

class AdminUserViewSet(viewsets.ModelViewSet):
    """
    ViewSet pour la gestion admin des utilisateurs
    """
    permission_classes = [permissions.IsAdminUser]
    queryset = User.objects.all().order_by('-date_joined')
    
    def get_serializer_class(self):
        if self.action == 'create':
            return UserCreateSerializer
        elif self.action == 'retrieve' or self.action == 'update':
            return UserWithProfileSerializer
        return UserCreateSerializer
    
    @action(detail=True, methods=['post'])
    def activate(self, request, pk=None):
        """Activer/désactiver un utilisateur"""
        user = self.get_object()
        user.is_active = not user.is_active
        user.save()
        
        status_text = "activé" if user.is_active else "désactivé"
        return Response({
            'status': 'success',
            'message': f'Utilisateur {status_text}',
            'is_active': user.is_active
        })
    
    @action(detail=True, methods=['get'])
    def profile(self, request, pk=None):
        """Récupérer le profil complet d'un utilisateur"""
        user = self.get_object()
        serializer = UserWithProfileSerializer(user)
        return Response(serializer.data)

# ============ VIEWSET STATISTIQUES ============

class DashboardStatsView(viewsets.ViewSet):
    """
    ViewSet pour les statistiques dashboard admin
    """
    permission_classes = [permissions.IsAdminUser]
    
    def list(self, request):
        """Retourne les statistiques globales"""
        now = timezone.now()
        last_week = now - timedelta(days=7)
        
        # Calculs statistiques
        total_users = User.objects.count()
        active_today = User.objects.filter(
            last_login__date=now.date()
        ).count()
        
        new_this_week = User.objects.filter(
            date_joined__gte=last_week
        ).count()
        
        with_profile = User.objects.filter(
            userprofile__isnull=False
        ).count()
        
        without_profile = total_users - with_profile
        
        # Statistiques sur 7 jours
        daily_stats = []
        for i in range(6, -1, -1):
            day = now - timedelta(days=i)
            day_start = day.replace(hour=0, minute=0, second=0, microsecond=0)
            day_end = day.replace(hour=23, minute=59, second=59, microsecond=999999)
            
            new_users = User.objects.filter(
                date_joined__range=(day_start, day_end)
            ).count()
            
            active_users = User.objects.filter(
                last_login__range=(day_start, day_end)
            ).count()
            
            daily_stats.append({
                'date': day.date().isoformat(),
                'new_users': new_users,
                'active_users': active_users,
                'total_logins': active_users  # Approximation
            })
        
        data = {
            'total_users': total_users,
            'active_today': active_today,
            'new_this_week': new_this_week,
            'with_profile': with_profile,
            'without_profile': without_profile,
            'last_7_days': daily_stats
        }
        
        serializer = UserStatsSerializer(data)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def realtime(self, request):
        """Statistiques en temps réel"""
        online_users = User.objects.filter(
            last_login__gte=timezone.now() - timedelta(minutes=5)
        ).count()
        
        return Response({
            'online_users': online_users,
            'total_sessions': request.session.__len__() if hasattr(request, 'session') else 0,
            'server_time': timezone.now().isoformat()
        })