
# projects/admin_views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.contrib.auth import get_user_model
from .models import Project
from .serializers import ProjectSerializer

User = get_user_model()

class UsersWithProjectsView(APIView):
    """
    Vue admin pour récupérer tous les utilisateurs avec leurs projets
    URL: /api/projects/admin/users-with-projects/
    """
    permission_classes = [IsAuthenticated, IsAdminUser]
    
    def get(self, request):
        try:
            # Récupérer tous les utilisateurs
            users = User.objects.all()
            
            data = []
            for user in users:
                # Récupérer les projets de cet utilisateur
                user_projects = Project.objects.filter(author=user)
                
                if user_projects.exists():  # Ne garder que les utilisateurs avec projets
                    data.append({
                        'id': user.id,
                        'username': user.username,
                        'email': user.email,
                        'first_name': user.first_name,
                        'last_name': user.last_name,
                        'date_joined': user.date_joined,
                        'is_active': user.is_active,
                        'is_staff': user.is_staff,
                        'projects_count': user_projects.count(),
                        'projects': ProjectSerializer(user_projects, many=True).data
                    })
            
            return Response(data)
            
        except Exception as e:
            return Response(
                {'error': str(e), 'detail': 'Erreur lors de la récupération des données'}, 
                status=500
            )


class AllProjectsWithUsersView(APIView):
    """
    Vue admin pour récupérer tous les projets avec informations utilisateurs
    URL: /api/projects/admin/all-projects-with-users/
    """
    permission_classes = [IsAuthenticated, IsAdminUser]
    
    def get(self, request):
        try:
            # Récupérer tous les projets avec leurs auteurs
            projects = Project.objects.all().select_related('author')
            
            data = []
            for project in projects:
                project_data = ProjectSerializer(project).data
                
                # Ajouter les informations de l'auteur
                if project.author:
                    project_data['author_info'] = {
                        'id': project.author.id,
                        'username': project.author.username,
                        'email': project.author.email,
                        'first_name': project.author.first_name,
                        'last_name': project.author.last_name
                    }
                else:
                    project_data['author_info'] = None
                
                data.append(project_data)
            
            return Response(data)
            
        except Exception as e:
            return Response(
                {'error': str(e), 'detail': 'Erreur lors de la récupération des projets'}, 
                status=500
            )