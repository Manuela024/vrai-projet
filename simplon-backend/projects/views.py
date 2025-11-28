


# projects/views.py
from rest_framework import generics, permissions
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.authentication import SessionAuthentication
from .models import Project
from .serializers import ProjectSerializer, ProjectCreateSerializer

class ProjectListCreate(generics.ListCreateAPIView):
    authentication_classes = [JWTAuthentication, SessionAuthentication]  # ⭐ CHANGE ICI
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ProjectCreateSerializer
        return ProjectSerializer
    
    def get_queryset(self):
        if self.request.user.is_authenticated:
            return Project.objects.all()
        return Project.objects.filter(status='published')
    
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class ProjectDetail(generics.RetrieveUpdateDestroyAPIView):
    authentication_classes = [JWTAuthentication, SessionAuthentication]  # ⭐ CHANGE ICI
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

class UserProjects(generics.ListAPIView):
    authentication_classes = [JWTAuthentication, SessionAuthentication]  # ⭐ CHANGE ICI
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Project.objects.filter(author=self.request.user)