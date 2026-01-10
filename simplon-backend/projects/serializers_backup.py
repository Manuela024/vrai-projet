
# # projects/serializers.py - VERSION CORRIGÉE
# from rest_framework import serializers
# from .models import Project
# from django.contrib.auth import get_user_model

# User = get_user_model()

# class ProjectSerializer(serializers.ModelSerializer):
#     """
#     Serializer pour les projets
#     """
#     author_name = serializers.SerializerMethodField()
#     author_email = serializers.SerializerMethodField()
    
#     class Meta:
#         model = Project
#         fields = [
#             'id', 'title', 'description', 'status', 'technologies',
#             'github_url', 'demo_url', 'cohort', 'created_at', 'updated_at',
#             'author', 'author_name', 'author_email'
#         ]
#         read_only_fields = ['created_at', 'updated_at', 'author']
    
#     def get_author_name(self, obj):
#         """Retourne le nom complet de l'auteur"""
#         if obj.author:
#             full_name = f"{obj.author.first_name or ''} {obj.author.last_name or ''}".strip()
#             return full_name if full_name else obj.author.username
#         return None
    
#     def get_author_email(self, obj):
#         """Retourne l'email de l'auteur"""
#         if obj.author:
#             return obj.author.email
#         return None
    
#     def create(self, validated_data):
#         """Crée un nouveau projet avec l'utilisateur connecté comme auteur"""
#         user = self.context['request'].user
#         if user.is_authenticated:
#             validated_data['author'] = user
#         return super().create(validated_data)


# # projects/serializers.py
# from rest_framework import serializers
# from .models import Project
# from django.contrib.auth import get_user_model

# User = get_user_model()

# class UserSimpleSerializer(serializers.ModelSerializer):
#     """Serializer léger pour les utilisateurs"""
#     full_name = serializers.SerializerMethodField()
    
#     class Meta:
#         model = User
#         fields = ['id', 'username', 'email', 'full_name']
#         read_only_fields = fields
    
#     def get_full_name(self, obj):
#         full_name = f"{obj.first_name or ''} {obj.last_name or ''}".strip()
#         return full_name if full_name else obj.username

# class ProjectSerializer(serializers.ModelSerializer):
#     """
#     Serializer complet pour les projets avec toutes les infos
#     """
#     # Infos auteur incluses directement depuis la table
#     author_info = UserSimpleSerializer(source='author', read_only=True)
    
#     # Pour compatibilité avec l'ancien frontend
#     author_name = serializers.CharField( read_only=True)
#     author_email = serializers.EmailField( read_only=True)
    
#     # Statistiques calculées
#     is_approved = serializers.SerializerMethodField()
#     is_pending = serializers.SerializerMethodField()
#     days_since_creation = serializers.SerializerMethodField()
    
#     class Meta:
#         model = Project
#         fields = [
#             'id', 'title', 'description', 'status', 'technologies',
#             'github_url', 'demo_url', 'cohort', 'tags', 'image',
#             'created_at', 'updated_at', 'author', 'author_name', 
#             'author_email', 'author_info', 'is_approved', 'is_pending',
#             'days_since_creation'
#         ]
#         read_only_fields = [
#             'created_at', 'updated_at', 'author', 'author_name', 
#             'author_email', 'author_info'
#         ]
    
#     def get_is_approved(self, obj):
#         return obj.status == 'approved'
    
#     def get_is_pending(self, obj):
#         return obj.status == 'pending'
    
#     def get_days_since_creation(self, obj):
#         from django.utils.timezone import now
#         if obj.created_at:
#             delta = now() - obj.created_at
#             return delta.days
#         return 0
    
#     def create(self, validated_data):
#         """Crée un projet avec l'utilisateur connecté comme auteur"""
#         request = self.context.get('request')
#         if request and request.user.is_authenticated:
#             validated_data['author'] = request.user
#         return super().create(validated_data)

# class ProjectWithUserSerializer(serializers.ModelSerializer):
#     """
#     Serializer pour le frontend React - Données groupées
#     """
#     user = UserSimpleSerializer(source='author', read_only=True)
    
#     class Meta:
#         model = Project
#         fields = [
#             'id', 'title', 'description', 'status', 'technologies',
#             'github_url', 'demo_url', 'cohort', 'tags', 'image',
#             'created_at', 'updated_at', 'user'
#         ]

# class UserWithProjectsSerializer(serializers.ModelSerializer):
#     """
#     Serializer pour les utilisateurs avec leurs projets
#     """
#     projects = ProjectSerializer(source='project_set', many=True, read_only=True)
#     projects_count = serializers.SerializerMethodField()
    
#     class Meta:
#         model = User
#         fields = [
#             'id', 'username', 'email', 'first_name', 'last_name',
#             'date_joined', 'last_login', 'is_active', 'is_staff',
#             'projects', 'projects_count'
#         ]
    
#     def get_projects_count(self, obj):
#         return obj.project_set.count()

# projects/serializers.py - VERSION CORRIGÉE AVEC TOUS LES CHAMPS
from rest_framework import serializers
from .models import Project
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSimpleSerializer(serializers.ModelSerializer):
    """Serializer léger pour les utilisateurs"""
    full_name = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'full_name']
        read_only_fields = fields
    
    def get_full_name(self, obj):
        full_name = f"{obj.first_name or ''} {obj.last_name or ''}".strip()
        return full_name if full_name else obj.username

class ProjectSerializer(serializers.ModelSerializer):
    """
    Serializer complet pour les projets avec TOUTES les infos
    """
    # Infos auteur incluses directement depuis la table
    author_info = UserSimpleSerializer(source='author', read_only=True)
    
    # Champs author_* directement de la table
    author_name = serializers.CharField(read_only=True)
    author_email = serializers.EmailField(read_only=True)
    author_username = serializers.CharField(read_only=True)  # AJOUTÉ !
    
    # Statistiques calculées
    is_approved = serializers.SerializerMethodField()
    is_pending = serializers.SerializerMethodField()
    days_since_creation = serializers.SerializerMethodField()
    
    class Meta:
        model = Project
        # 🎯 CORRECTION CRITIQUE : Inclure TOUS les champs
        fields = '__all__'  # ✅ Retourne TOUS les 10 projets
        
        # OU si vous préférez explicite :
        # fields = [
        #     'id', 'title', 'description', 'status', 'technologies',
        #     'github_url', 'demo_url', 'cohort', 'tags', 'image',
        #     'created_at', 'updated_at', 'author', 'author_name', 
        #     'author_email', 'author_username', 'author_info',  # ✅ author_username ajouté
        #     'is_approved', 'is_pending', 'days_since_creation'
        # ]
        
        read_only_fields = [
            'created_at', 'updated_at', 'author', 'author_name', 
            'author_email', 'author_username', 'author_info'
        ]
    
    def get_is_approved(self, obj):
        return obj.status == 'approved'
    
    def get_is_pending(self, obj):
        return obj.status == 'pending'
    
    def get_days_since_creation(self, obj):
        from django.utils.timezone import now
        if obj.created_at:
            delta = now() - obj.created_at
            return delta.days
        return 0
    
    def create(self, validated_data):
        """Crée un projet avec l'utilisateur connecté comme auteur"""
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            validated_data['author'] = request.user
        return super().create(validated_data)

class ProjectWithUserSerializer(serializers.ModelSerializer):
    """
    Serializer pour le frontend React - Données groupées
    """
    user = UserSimpleSerializer(source='author', read_only=True)
    
    class Meta:
        model = Project
        fields = '__all__'  # ✅ Retourne tous les champs
        
        # OU spécifique :
        # fields = [
        #     'id', 'title', 'description', 'status', 'technologies',
        #     'github_url', 'demo_url', 'cohort', 'tags', 'image',
        #     'created_at', 'updated_at', 'user'
        # ]

class UserWithProjectsSerializer(serializers.ModelSerializer):
    """
    Serializer pour les utilisateurs avec leurs projets
    """
    projects = ProjectSerializer(source='project_set', many=True, read_only=True)
    projects_count = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'date_joined', 'last_login', 'is_active', 'is_staff',
            'projects', 'projects_count'
        ]
    
    def get_projects_count(self, obj):
        return obj.project_set.count()