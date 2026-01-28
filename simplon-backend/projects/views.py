

# # projects/views.py - VERSION CORRIGÉE (sans la vue dupliquée)
# from rest_framework import viewsets, permissions, generics
# from .models import Project
# from .serializers import ProjectSerializer

# # ViewSet pour les projets
# class ProjectViewSet(viewsets.ModelViewSet):
#     queryset = Project.objects.all()
#     serializer_class = ProjectSerializer
#     permission_classes = [permissions.IsAuthenticated]

#     def perform_create(self, serializer):
#         serializer.save(author=self.request.user)

# # Vue pour les projets de l'utilisateur connecté
# class MyProjectsView(generics.ListAPIView):
#     serializer_class = ProjectSerializer
#     permission_classes = [permissions.IsAuthenticated]

#     def get_queryset(self):
#         return Project.objects.filter(author=self.request.user)

# projects/views.py - VERSION COMPLÈTE ET OPTIMISÉE
from rest_framework import viewsets, permissions, generics, status, filters

from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone
from django.contrib.auth.models import User
from .models import Project
from .serializers import ProjectUploadSerializer
import os

from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404
from django.db.models import Count, Q, Prefetch
from django.utils import timezone
from datetime import timedelta
from .models import Project
from .serializers import (
    ProjectSerializer, 
    ProjectWithUserSerializer,
    UserWithProjectsSerializer
)
from django.contrib.auth import get_user_model
import logging

User = get_user_model()
logger = logging.getLogger(__name__)

# ============================================================================
# VIEWSETS
# ============================================================================

class ProjectViewSet(viewsets.ModelViewSet):
    """
    ViewSet complet pour les projets avec toutes les fonctionnalités CRUD
    Optimisé avec select_related et pagination
    """
    queryset = Project.objects.all().select_related('author')
    serializer_class = ProjectSerializer
    
    # Filtrage avancé
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'cohort', 'author']
    search_fields = ['title', 'description', 'technologies', 'tags']
    ordering_fields = ['created_at', 'updated_at', 'title']
    ordering = ['-created_at']
    
    def get_permissions(self):
        """
        Permissions dynamiques:
        - GET: Public (tout le monde peut voir)
        - POST/PUT/PATCH/DELETE: Authentifié seulement
        """
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]
    
    def get_queryset(self):
        """
        Optimisation des requêtes avec prefetch_related
        """
        queryset = super().get_queryset()
        
        # Filtrage par statut si fourni
        status_param = self.request.query_params.get('status', None)
        if status_param:
            queryset = queryset.filter(status=status_param)
        
        # Filtrage par cohorte
        cohort_param = self.request.query_params.get('cohort', None)
        if cohort_param:
            queryset = queryset.filter(cohort__icontains=cohort_param)
        
        # Filtrage par technologie
        tech_param = self.request.query_params.get('technology', None)
        if tech_param:
            queryset = queryset.filter(technologies__icontains=tech_param)
        
        return queryset
    
    def perform_create(self, serializer):
        """Associe automatiquement l'utilisateur connecté comme auteur"""
        serializer.save(author=self.request.user)
    
    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """Approuver un projet spécifique"""
        project = self.get_object()
        reason = request.data.get('reason', 'Projet conforme aux exigences')
        
        project.status = 'approved'
        project.save()
        
        logger.info(f"Projet {project.id} approuvé par {request.user.username}")
        
        return Response({
            'status': 'success',
            'message': f'Projet "{project.title}" approuvé avec succès',
            'reason': reason
        })
    
    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        """Rejeter un projet spécifique"""
        project = self.get_object()
        reason = request.data.get('reason', 'Projet nécessite des améliorations')
        
        project.status = 'rejected'
        project.save()
        
        logger.info(f"Projet {project.id} rejeté par {request.user.username}")
        
        return Response({
            'status': 'success',
            'message': f'Projet "{project.title}" rejeté',
            'reason': reason
        })
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Statistiques sur les projets"""
        total = self.get_queryset().count()
        
        stats = {
            'total': total,
            'by_status': {
                status[0]: self.get_queryset().filter(status=status[0]).count()
                for status in Project.STATUS_CHOICES
            },
            'by_cohort': {
                cohort: count
                for cohort, count in self.get_queryset().values_list('cohort').annotate(
                    count=Count('id')
                ).order_by('-count')
                if cohort
            },
            'recent': self.get_queryset().filter(
                created_at__gte=timezone.now() - timedelta(days=7)
            ).count()
        }
        
        return Response(stats)
    
    @action(detail=False, methods=['get'])
    def recent(self, request):
        """Projets récents (7 derniers jours)"""
        recent_projects = self.get_queryset().filter(
            created_at__gte=timezone.now() - timedelta(days=7)
        ).order_by('-created_at')[:10]
        
        serializer = self.get_serializer(recent_projects, many=True)
        return Response(serializer.data)

# ============================================================================
# API VIEWS POUR LE FRONTEND REACT
# ============================================================================

class ProjectListCreateView(generics.ListCreateAPIView):
    """
    Vue pour lister tous les projets et créer un nouveau projet
    GET: Liste tous les projets (public ou selon permissions)
    POST: Crée un nouveau projet (authentification requise)
    """
    queryset = Project.objects.all().select_related('author')
    serializer_class = ProjectSerializer
    
    def get_permissions(self):
        """Permissions dynamiques : GET public, POST authentifié"""
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]
    
    def get_queryset(self):
        """Optimisation des requêtes avec filtres"""
        queryset = super().get_queryset()
        
        # Filtre par statut
        status = self.request.query_params.get('status', None)
        if status:
            queryset = queryset.filter(status=status)
        
        # Filtre par cohorte
        cohort = self.request.query_params.get('cohort', None)
        if cohort:
            queryset = queryset.filter(cohort__icontains=cohort)
        
        # Filtre par technologie
        technology = self.request.query_params.get('technology', None)
        if technology:
            queryset = queryset.filter(technologies__icontains=technology)
        
        # Recherche
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) |
                Q(description__icontains=search) |
                Q(technologies__icontains=search) |
                Q(tags__icontains=search)
            )
        
        return queryset
    
    def perform_create(self, serializer):
        """Associe l'utilisateur connecté comme auteur"""
        if self.request.user.is_authenticated:
            serializer.save(author=self.request.user)
        else:
            serializer.save()

class ProjectRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    """
    Vue pour récupérer, mettre à jour ou supprimer un projet spécifique
    """
    queryset = Project.objects.all().select_related('author')
    serializer_class = ProjectSerializer
    lookup_field = 'pk'
    
    def get_permissions(self):
        """Permissions dynamiques"""
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]
    
    def get_object(self):
        """Récupère l'objet avec vérification des permissions"""
        obj = get_object_or_404(self.get_queryset(), pk=self.kwargs['pk'])
        self.check_object_permissions(self.request, obj)
        return obj
    
    def perform_update(self, serializer):
        """Mise à jour avec logging"""
        instance = serializer.save()
        logger.info(f"Projet {instance.id} mis à jour par {self.request.user.username}")

class MyProjectsView(generics.ListAPIView):
    """
    Vue pour récupérer les projets de l'utilisateur connecté
    """
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Project.objects.filter(author=self.request.user).select_related('author')

class PublicProjectsView(generics.ListAPIView):
    """
    Vue pour récupérer les projets publics (approuvés ou publiés)
    """
    serializer_class = ProjectSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        return Project.objects.filter(
            status__in=['approved', 'published']
        ).select_related('author').order_by('-created_at')

# ============================================================================
# VUES SPÉCIALES POUR L'ADMIN DASHBOARD
# ============================================================================

class UserProjectsView(generics.ListAPIView):
    """
    Vue pour récupérer les projets d'un utilisateur spécifique (admin)
    """
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAdminUser]
    
    def get_queryset(self):
        user_id = self.kwargs.get('user_id')
        return Project.objects.filter(author_id=user_id).select_related('author')

class ProjectsByStatusView(generics.ListAPIView):
    """
    Vue pour récupérer les projets par statut
    """
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAdminUser]
    
    def get_queryset(self):
        status = self.kwargs.get('status')
        return Project.objects.filter(status=status).select_related('author')

# ============================================================================
# VUES STATISTIQUES ET RAPPORTS
# ============================================================================

class DashboardStatsView(APIView):
    """
    Vue pour les statistiques du dashboard admin
    """
    permission_classes = [permissions.IsAdminUser]
    
    def get(self, request):
        try:
            # 1. Statistiques projets
            total_projects = Project.objects.count()
            projects_by_status = {
                status[0]: Project.objects.filter(status=status[0]).count()
                for status in Project.STATUS_CHOICES
            }
            
            # 2. Statistiques utilisateurs
            total_users = User.objects.count()
            active_users = User.objects.filter(is_active=True).count()
            users_with_projects = User.objects.annotate(
                project_count=Count('projects')
            ).filter(project_count__gt=0).count()
            
            # 3. Statistiques temporelles
            today = timezone.now().date()
            week_ago = today - timedelta(days=7)
            month_ago = today - timedelta(days=30)
            
            new_projects_week = Project.objects.filter(
                created_at__gte=week_ago
            ).count()
            
            new_projects_month = Project.objects.filter(
                created_at__gte=month_ago
            ).count()
            
            # 4. Cohortes actives
            active_cohorts = Project.objects.exclude(cohort='').values(
                'cohort'
            ).annotate(
                count=Count('id'),
                approved=Count('id', filter=Q(status='approved'))
            ).order_by('-count')[:10]
            
            # 5. Technologies populaires
            from collections import Counter
            all_techs = []
            for techs in Project.objects.exclude(technologies='').values_list('technologies', flat=True):
                if techs:
                    all_techs.extend([t.strip() for t in techs.split(',')])
            
            popular_techs = Counter(all_techs).most_common(10)
            
            return Response({
                'success': True,
                'timestamp': timezone.now().isoformat(),
                'projects': {
                    'total': total_projects,
                    'by_status': projects_by_status,
                    'recent': {
                        'week': new_projects_week,
                        'month': new_projects_month
                    }
                },
                'users': {
                    'total': total_users,
                    'active': active_users,
                    'with_projects': users_with_projects
                },
                'cohorts': list(active_cohorts),
                'technologies': popular_techs,
                'activity': {
                    'today': Project.objects.filter(created_at__date=today).count(),
                    'yesterday': Project.objects.filter(
                        created_at__date=today - timedelta(days=1)
                    ).count()
                }
            })
            
        except Exception as e:
            logger.error(f"Erreur dans DashboardStatsView: {str(e)}")
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ExportProjectsView(APIView):
    """
    Vue pour exporter les projets en différents formats
    """
    permission_classes = [permissions.IsAdminUser]
    
    def get(self, request):
        format_type = request.query_params.get('format', 'json')
        
        projects = Project.objects.all().select_related('author')
        serializer = ProjectSerializer(projects, many=True)
        
        if format_type == 'csv':
            # Génération CSV simplifiée
            import csv
            from django.http import HttpResponse
            
            response = HttpResponse(content_type='text/csv')
            response['Content-Disposition'] = 'attachment; filename="projets_simplon.csv"'
            
            writer = csv.writer(response, delimiter=';')
            writer.writerow(['ID', 'Titre', 'Auteur', 'Email', 'Statut', 'Cohorte', 'Technologies', 'Date création'])
            
            for project in projects:
                writer.writerow([
                    project.id,
                    project.title,
                    project.author.username if project.author else '',
                    project.author.email if project.author else '',
                    project.get_status_display(),
                    project.cohort,
                    project.technologies,
                    project.created_at.strftime('%Y-%m-%d %H:%M')
                ])
            
            return response
        
        elif format_type == 'json':
            return Response({
                'count': projects.count(),
                'projects': serializer.data,
                'exported_at': timezone.now().isoformat()
            })
        
        return Response({'error': 'Format non supporté'}, status=400)

# ============================================================================
# VUES UTILITAIRES
# ============================================================================

class APITestView(APIView):
    """
    Vue simple pour tester si l'API fonctionne
    """
    permission_classes = [permissions.AllowAny]
    
    def get(self, request):
        return Response({
            'status': 'ok',
            'message': 'API Django fonctionne correctement',
            'timestamp': timezone.now().isoformat(),
            'projects_count': Project.objects.count(),
            'users_count': User.objects.count(),
            'endpoints': {
                'projects': '/api/projects/',
                'projects_grouped': '/api/projects-grouped/',
                'my_projects': '/api/my-projects/',
                'stats': '/api/stats/',
                'test': '/api/test/'
            }
        })

class HealthCheckView(APIView):
    """
    Vue pour vérifier la santé de l'API (monitoring)
    """
    permission_classes = [permissions.AllowAny]
    
    def get(self, request):
        try:
            # Vérifier la connexion à la base de données
            project_count = Project.objects.count()
            user_count = User.objects.count()
            
            # Vérifier les migrations
            from django.db import connection
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1")
            
            return Response({
                'status': 'healthy',
                'database': 'connected',
                'timestamp': timezone.now().isoformat(),
                'projects': project_count,
                'users': user_count,
                'version': '1.0.0'
            })
            
        except Exception as e:
            logger.error(f"Health check failed: {str(e)}")
            return Response({
                'status': 'unhealthy',
                'error': str(e),
                'timestamp': timezone.now().isoformat()
            }, status=status.HTTP_503_SERVICE_UNAVAILABLE)

# ============================================================================
# VUES DE RECHERCHE AVANCÉE
# ============================================================================

class SearchProjectsView(generics.ListAPIView):
    """
    Vue de recherche avancée sur les projets
    """
    serializer_class = ProjectSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        queryset = Project.objects.all().select_related('author')
        
        # Récupérer les paramètres de recherche
        search = self.request.query_params.get('q', '')
        status = self.request.query_params.get('status', '')
        cohort = self.request.query_params.get('cohort', '')
        technology = self.request.query_params.get('technology', '')
        
        # Appliquer les filtres
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) |
                Q(description__icontains=search) |
                Q(technologies__icontains=search) |
                Q(tags__icontains=search) |
                Q(cohort__icontains=search)
            )
        
        if status:
            queryset = queryset.filter(status=status)
        
        if cohort:
            queryset = queryset.filter(cohort__icontains=cohort)
        
        if technology:
            queryset = queryset.filter(technologies__icontains=technology)
        
        return queryset

# ============================================================================
# VUES POUR LES GRAPHIQUES ET VISUALISATIONS
# ============================================================================

class ProjectsTimelineView(APIView):
    """
    Vue pour générer des données de timeline (évolution des projets dans le temps)
    """
    permission_classes = [permissions.IsAdminUser]
    
    def get(self, request):
        # Générer des données pour les 30 derniers jours
        end_date = timezone.now().date()
        start_date = end_date - timedelta(days=30)
        
        timeline_data = []
        
        current_date = start_date
        while current_date <= end_date:
            count = Project.objects.filter(
                created_at__date=current_date
            ).count()
            
            timeline_data.append({
                'date': current_date.isoformat(),
                'count': count
            })
            
            current_date += timedelta(days=1)
        
        return Response({
            'period': {
                'start': start_date.isoformat(),
                'end': end_date.isoformat()
            },
            'timeline': timeline_data
        })

class CohortAnalysisView(APIView):
    """
    Analyse détaillée par cohorte
    """
    permission_classes = [permissions.IsAdminUser]
    
    def get(self, request):
        cohorts = Project.objects.exclude(cohort='').values_list(
            'cohort', flat=True
        ).distinct().order_by('cohort')
        
        analysis = []
        
        for cohort in cohorts:
            projects = Project.objects.filter(cohort=cohort)
            total = projects.count()
            
            by_status = {
                status[0]: projects.filter(status=status[0]).count()
                for status in Project.STATUS_CHOICES
            }
            
            # Technologies utilisées dans cette cohorte
            techs = []
            for p in projects.exclude(technologies=''):
                if p.technologies:
                    techs.extend([t.strip() for t in p.technologies.split(',')])
            
            from collections import Counter
            popular_techs = Counter(techs).most_common(5)
            
            analysis.append({
                'cohort': cohort,
                'total_projects': total,
                'by_status': by_status,
                'popular_technologies': popular_techs,
                'first_project': projects.order_by('created_at').first().created_at if total > 0 else None,
                'last_project': projects.order_by('-created_at').first().created_at if total > 0 else None
            })
        
        return Response({
            'cohort_count': len(analysis),
            'analysis': analysis
        })
    


    # projects/views_api.py - AJOUTEZ CES VUES À LA FIN DU FICHIER
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone
from django.contrib.auth.models import User
from .models import Project
from .serializers import ProjectUploadSerializer
import os

# ============================================================================
# VUES POUR MINIO (NOUVELLES - NE MODIFIENT PAS L'EXISTANT)
# ============================================================================

@api_view(['POST'])
@permission_classes([AllowAny])
@parser_classes([MultiPartParser, FormParser])
def upload_project_with_files(request):
    """
    Upload d'un projet avec fichiers (ZIP + Image) vers MinIO
    Compatible avec les vues existantes
    """
    try:
        print("=" * 80)
        print("📤 UPLOAD AVEC FICHIERS (MinIO)")
        print("=" * 80)
        
        # Log pour debug
        print(f"📝 Données POST: {dict(request.POST)}")
        print(f"📦 Fichiers reçus: {list(request.FILES.keys())}")
        
        for key, file in request.FILES.items():
            print(f"   - {key}: {file.name} ({file.size} bytes)")
        
        # Validation du titre
        title = request.POST.get('title', '').strip()
        if not title:
            return Response({
                'status': 'error',
                'message': 'Le titre est requis'
            }, status=400)
        
        # Déterminer l'auteur (compatible avec la logique existante)
        if request.user.is_authenticated:
            author = request.user
        else:
            # Utiliser la même logique que la vue existante
            author, _ = User.objects.get_or_create(
                username='default_uploader',
                defaults={
                    'email': 'uploader@example.com',
                    'first_name': 'Default',
                    'last_name': 'Uploader'
                }
            )
        
        # Préparer les données pour le projet
        project_data = {
            'title': title,
            'description': request.POST.get('description', ''),
            'technologies': request.POST.get('technologies', ''),
            'category': request.POST.get('category', 'web'),
            'cohort': request.POST.get('cohort', ''),
            'tags': request.POST.get('tags', ''),
            'github_url': request.POST.get('github_url', ''),
            'demo_url': request.POST.get('demo_url', ''),
            'status': request.POST.get('status', 'draft'),
            'author': author
        }
        
        # Créer le projet
        project = Project.objects.create(**project_data)
        
        # Gérer les fichiers
        files_added = []
        
        if 'zip_file' in request.FILES:
            project.zip_file = request.FILES['zip_file']
            files_added.append('zip_file')
            print(f"📦 Fichier ZIP sauvegardé: {project.zip_file.name}")
        
        if 'image' in request.FILES:
            project.image = request.FILES['image']
            files_added.append('image')
            print(f"🖼️ Image sauvegardée: {project.image.name}")
        
        # Sauvegarder les modifications
        if files_added:
            project.save()
        
        print(f"✅ Projet créé avec succès!")
        print(f"   ID: {project.id}")
        print(f"   Fichiers ajoutés: {files_added}")
        print("=" * 80)
        
        # Retourner la réponse
        return Response({
            'status': 'success',
            'message': 'Projet créé avec succès!',
            'project': {
                'id': project.id,
                'title': project.title,
                'zip_file_url': project.zip_file.url if project.zip_file else None,
                'image_url': project.image.url if project.image else None,
                'files_added': files_added,
                'created_at': project.created_at.isoformat()
            }
        }, status=201)
        
    except Exception as e:
        print(f"❌ Erreur d'upload: {str(e)}")
        import traceback
        traceback.print_exc()
        
        return Response({
            'status': 'error',
            'message': f'Erreur lors de la création du projet: {str(e)}'
        }, status=500)

@api_view(['GET'])
@permission_classes([AllowAny])
def download_project_zip(request, project_id):
    """
    Récupère l'URL de téléchargement d'un fichier ZIP
    Compatible avec MinIO et stockage local
    """
    try:
        project = Project.objects.get(id=project_id)
        
        if not project.zip_file:
            return Response({
                'status': 'error',
                'message': 'Aucun fichier ZIP disponible pour ce projet'
            }, status=404)
        
        # Incrémenter les téléchargements
        project.downloads += 1
        project.save(update_fields=['downloads'])
        
        # Retourner l'URL de téléchargement
        return Response({
            'status': 'success',
            'project_id': project.id,
            'title': project.title,
            'download_url': project.zip_file.url,
            'filename': os.path.basename(project.zip_file.name),
            'size': project.zip_file.size,
            'downloads': project.downloads,
            'is_minio': 'minio' in project.zip_file.url.lower() if project.zip_file else False
        })
        
    except Project.DoesNotExist:
        return Response({
            'status': 'error',
            'message': 'Projet non trouvé'
        }, status=404)
    except Exception as e:
        return Response({
            'status': 'error',
            'message': f'Erreur: {str(e)}'
        }, status=500)

@api_view(['POST'])
@permission_classes([AllowAny])
def increment_views(request, project_id):
    """
    Incrémente le compteur de vues d'un projet
    """
    try:
        project = Project.objects.get(id=project_id)
        project.views += 1
        project.save(update_fields=['views'])
        
        return Response({
            'status': 'success',
            'project_id': project.id,
            'title': project.title,
            'views': project.views
        })
        
    except Project.DoesNotExist:
        return Response({
            'status': 'error',
            'message': 'Projet non trouvé'
        }, status=404)

@api_view(['GET'])
@permission_classes([AllowAny])
def project_files_info(request, project_id):
    """
    Retourne les informations sur les fichiers d'un projet
    """
    try:
        project = Project.objects.get(id=project_id)
        
        zip_info = None
        if project.zip_file:
            zip_info = {
                'url': project.zip_file.url,
                'name': os.path.basename(project.zip_file.name),
                'size': project.zip_file.size,
                'available': True
            }
        
        image_info = None
        if project.image:
            image_info = {
                'url': project.image.url,
                'name': os.path.basename(project.image.name),
                'size': project.image.size,
                'available': True
            }
        
        return Response({
            'status': 'success',
            'project_id': project.id,
            'title': project.title,
            'zip_file': zip_info,
            'image': image_info,
            'has_files': bool(zip_info or image_info)
        })
        
    except Project.DoesNotExist:
        return Response({
            'status': 'error',
            'message': 'Projet non trouvé'
        }, status=404)

# ============================================================================
# VUE POUR TESTER MINIO
# ============================================================================

@api_view(['GET'])
@permission_classes([AllowAny])
def minio_status(request):
    """
    Vérifie l'état de MinIO
    """
    try:
        from django.conf import settings
        
        minio_info = {
            'enabled': getattr(settings, 'MINIO_AVAILABLE', False),
            'endpoint': getattr(settings, 'MINIO_ENDPOINT', 'non configuré'),
            'bucket': getattr(settings, 'MINIO_BUCKET_NAME', 'non configuré'),
            'secure': getattr(settings, 'MINIO_SECURE', False)
        }
        
        if minio_info['enabled']:
            try:
                from minio import Minio
                client = Minio(
                    endpoint=settings.MINIO_ENDPOINT,
                    access_key=settings.MINIO_ACCESS_KEY,
                    secret_key=settings.MINIO_SECRET_KEY,
                    secure=settings.MINIO_SECURE
                )
                
                # Tester la connexion
                buckets = client.list_buckets()
                minio_info['connected'] = True
                minio_info['buckets'] = [b.name for b in buckets]
                
            except Exception as e:
                minio_info['connected'] = False
                minio_info['error'] = str(e)
        
        return Response({
            'status': 'success',
            'minio': minio_info,
            'timestamp': timezone.now().isoformat()
        })
        
    except Exception as e:
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=500)

print("=" * 70)
print("✅ VUES MINIO AJOUTÉES!")
print("📊 Nouvelles endpoints MinIO:")
print("   - POST /api/projects/upload-files/ → Upload avec fichiers")
print("   - GET  /api/projects/<id>/download/ → Téléchargement ZIP")
print("   - POST /api/projects/<id>/increment-views/ → Incrémenter vues")
print("   - GET  /api/projects/<id>/files/ → Info fichiers")
print("   - GET  /api/minio-status/ → Statut MinIO")
print("=" * 70)