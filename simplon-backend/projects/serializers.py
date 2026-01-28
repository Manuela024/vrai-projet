
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

# # projects/serializers.py - VERSION CORRIGÉE AVEC TOUS LES CHAMPS
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
#     Serializer complet pour les projets avec TOUTES les infos
#     """
#     # Infos auteur incluses directement depuis la table
#     author_info = UserSimpleSerializer(source='author', read_only=True)
    
#     # Champs author_* directement de la table
#     author_name = serializers.CharField(read_only=True)
#     author_email = serializers.EmailField(read_only=True)
#     author_username = serializers.CharField(read_only=True)  # AJOUTÉ !
    
#     # Statistiques calculées
#     is_approved = serializers.SerializerMethodField()
#     is_pending = serializers.SerializerMethodField()
#     days_since_creation = serializers.SerializerMethodField()
    
#     class Meta:
#         model = Project
#         # 🎯 CORRECTION CRITIQUE : Inclure TOUS les champs
#         fields = '__all__'  # ✅ Retourne TOUS les 10 projets
        
#         # OU si vous préférez explicite :
#         # fields = [
#         #     'id', 'title', 'description', 'status', 'technologies',
#         #     'github_url', 'demo_url', 'cohort', 'tags', 'image',
#         #     'created_at', 'updated_at', 'author', 'author_name', 
#         #     'author_email', 'author_username', 'author_info',  # ✅ author_username ajouté
#         #     'is_approved', 'is_pending', 'days_since_creation'
#         # ]
        
#         read_only_fields = [
#             'created_at', 'updated_at', 'author', 'author_name', 
#             'author_email', 'author_username', 'author_info'
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
#         fields = '__all__'  # ✅ Retourne tous les champs
        
#         # OU spécifique :
#         # fields = [
#         #     'id', 'title', 'description', 'status', 'technologies',
#         #     'github_url', 'demo_url', 'cohort', 'tags', 'image',
#         #     'created_at', 'updated_at', 'user'
#         # ]

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



# # projects/serializers.py - VERSION COMPLÈTE AVEC MINIO
# from rest_framework import serializers
# from .models import Project
# from users.models import User
# import os

# class UserSimpleSerializer(serializers.ModelSerializer):
#     """
#     Serializer simplifié pour les utilisateurs
#     """
#     full_name = serializers.SerializerMethodField()
    
#     class Meta:
#         model = User
#         fields = ['id', 'username', 'email', 'first_name', 'last_name', 'full_name', 'is_staff', 'is_active']
    
#     def get_full_name(self, obj):
#         return obj.get_full_name()

# class ProjectSerializer(serializers.ModelSerializer):
#     """
#     Serializer principal pour le frontend React - Données groupées
#     Version étendue avec MinIO
#     """
#     user = UserSimpleSerializer(source='author', read_only=True)
#     zip_file_url = serializers.SerializerMethodField()
#     image_url = serializers.SerializerMethodField()
#     is_zip_available = serializers.SerializerMethodField()
#     downloads_count = serializers.IntegerField(source='downloads', read_only=True)
#     category_display = serializers.CharField(source='get_category_display', read_only=True)
    
#     class Meta:
#         model = Project
#         fields = '__all__'  # ✅ Retourne tous les champs
#         read_only_fields = [
#             'views', 'downloads', 'likes', 'created_at', 'updated_at',
#             'author_name', 'author_email', 'author_username'
#         ]

#     def get_zip_file_url(self, obj):
#         """Retourne l'URL du fichier ZIP"""
#         if obj.zip_file:
#             request = self.context.get('request')
#             if request:
#                 return request.build_absolute_uri(obj.zip_file.url)
#             return obj.zip_file.url
#         return None
    
#     def get_image_url(self, obj):
#         """Retourne l'URL de l'image"""
#         if obj.image:
#             request = self.context.get('request')
#             if request:
#                 return request.build_absolute_uri(obj.image.url)
#             return obj.image.url
#         return None
    
#     def get_is_zip_available(self, obj):
#         """Vérifie si un fichier ZIP est disponible"""
#         return bool(obj.zip_file)

# class UserWithProjectsSerializer(serializers.ModelSerializer):
#     """
#     Serializer pour les utilisateurs avec leurs projets
#     Version étendue avec MinIO
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

# # ============================================================================
# # SERIALIZERS POUR MINIO (NOUVEAUX)
# # ============================================================================

# class ProjectUploadSerializer(serializers.ModelSerializer):
#     """
#     Serializer pour l'upload de projets avec MinIO
#     """
#     class Meta:
#         model = Project
#         fields = [
#             'title', 'description', 'technologies', 'category',
#             'cohort', 'tags', 'github_url', 'demo_url', 'status',
#             'zip_file', 'image'
#         ]
    
#     def validate_zip_file(self, value):
#         """Validation du fichier ZIP"""
#         # Vérifier la taille (max 500MB)
#         max_size = 500 * 1024 * 1024  # 500MB
#         if value.size > max_size:
#             raise serializers.ValidationError("Le fichier ZIP est trop volumineux (max 500MB)")
        
#         # Vérifier l'extension
#         valid_extensions = ['.zip', '.rar', '.7z', '.tar.gz', '.tar']
#         ext = os.path.splitext(value.name)[1].lower()
#         if ext not in valid_extensions:
#             raise serializers.ValidationError(
#                 f"Extension non autorisée. Utilisez: {', '.join(valid_extensions)}"
#             )
        
#         return value
    
#     def validate_image(self, value):
#         """Validation de l'image"""
#         # Vérifier la taille (max 10MB)
#         max_size = 10 * 1024 * 1024  # 10MB
#         if value.size > max_size:
#             raise serializers.ValidationError("L'image est trop volumineuse (max 10MB)")
        
#         # Vérifier l'extension
#         valid_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
#         ext = os.path.splitext(value.name)[1].lower()
#         if ext not in valid_extensions:
#             raise serializers.ValidationError(
#                 f"Format d'image non supporté. Utilisez: {', '.join(valid_extensions)}"
#             )
        
#         return value

# class ProjectFileInfoSerializer(serializers.ModelSerializer):
#     """
#     Serializer pour les informations sur les fichiers d'un projet
#     """
#     zip_file_info = serializers.SerializerMethodField()
#     image_info = serializers.SerializerMethodField()
    
#     class Meta:
#         model = Project
#         fields = ['id', 'title', 'zip_file_info', 'image_info']
    
#     def get_zip_file_info(self, obj):
#         """Informations sur le fichier ZIP"""
#         if obj.zip_file:
#             return {
#                 'url': obj.zip_file.url,
#                 'filename': os.path.basename(obj.zip_file.name),
#                 'size': obj.zip_file.size,
#                 'size_mb': round(obj.zip_file.size / (1024 * 1024), 2),
#                 'available': True,
#                 'downloads': obj.downloads
#             }
#         return None
    
#     def get_image_info(self, obj):
#         """Informations sur l'image"""
#         if obj.image:
#             return {
#                 'url': obj.image.url,
#                 'filename': os.path.basename(obj.image.name),
#                 'size': obj.image.size,
#                 'size_mb': round(obj.image.size / (1024 * 1024), 2),
#                 'available': True
#             }
#         return None

# class MinioStatusSerializer(serializers.Serializer):
#     """
#     Serializer pour le statut de MinIO
#     """
#     enabled = serializers.BooleanField()
#     endpoint = serializers.CharField()
#     bucket = serializers.CharField()
#     secure = serializers.BooleanField()
#     connected = serializers.BooleanField(required=False)
#     buckets = serializers.ListField(child=serializers.CharField(), required=False)
#     error = serializers.CharField(required=False)

# # ============================================================================
# # SERIALIZERS COMPATIBILITÉ (EXISTANTS - À GARDER)
# # ============================================================================

# class ProjectSimpleSerializer(serializers.ModelSerializer):
#     """
#     Serializer simple pour les projets (compatibilité)
#     """
#     class Meta:
#         model = Project
#         fields = ['id', 'title', 'description', 'status', 'technologies', 'created_at']

# class ProjectDetailSerializer(serializers.ModelSerializer):
#     """
#     Serializer détaillé pour les projets (compatibilité)
#     """
#     author_info = serializers.SerializerMethodField()
    
#     class Meta:
#         model = Project
#         fields = [
#             'id', 'title', 'description', 'status', 'technologies',
#             'github_url', 'demo_url', 'cohort', 'tags', 'image',
#             'created_at', 'updated_at', 'author_info'
#         ]
    
#     def get_author_info(self, obj):
#         if obj.author:
#             return {
#                 'id': obj.author.id,
#                 'username': obj.author.username,
#                 'full_name': obj.author.get_full_name()
#             }
#         return None

# print("=" * 70)
# print("✅ SERIALIZERS CHARGÉS AVEC SUCCÈS!")
# print("📊 Serializers disponibles:")
# print("   - ProjectSerializer (principal avec MinIO)")
# print("   - ProjectUploadSerializer (upload MinIO)")
# print("   - ProjectFileInfoSerializer (info fichiers)")
# print("   - MinioStatusSerializer (statut MinIO)")
# print("   - ProjectSimpleSerializer (compatibilité)")
# print("   - ProjectDetailSerializer (compatibilité)")
# print("=" * 70)


# projects/serializers.py - VERSION COMPLÈTE AVEC MINIO
from rest_framework import serializers
from .models import Project
from users.models import User
import os

class UserSimpleSerializer(serializers.ModelSerializer):
    """
    Serializer simplifié pour les utilisateurs
    """
    full_name = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'full_name', 'is_staff', 'is_active']
    
    def get_full_name(self, obj):
        return obj.get_full_name()

class ProjectSerializer(serializers.ModelSerializer):
    """
    Serializer principal pour le frontend React - Données groupées
    Version étendue avec MinIO
    """
    user = UserSimpleSerializer(source='author', read_only=True)
    zip_file_url = serializers.SerializerMethodField()
    image_url = serializers.SerializerMethodField()
    is_zip_available = serializers.SerializerMethodField()
    downloads_count = serializers.IntegerField(source='downloads', read_only=True)
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    
    class Meta:
        model = Project
        fields = '__all__'  # ✅ Retourne tous les champs
        read_only_fields = [
            'views', 'downloads', 'likes', 'created_at', 'updated_at',
            'author_name', 'author_email', 'author_username'
        ]

    def get_zip_file_url(self, obj):
        """Retourne l'URL du fichier ZIP"""
        if obj.zip_file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.zip_file.url)
            return obj.zip_file.url
        return None
    
    def get_image_url(self, obj):
        """Retourne l'URL de l'image"""
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None
    
    def get_is_zip_available(self, obj):
        """Vérifie si un fichier ZIP est disponible"""
        return bool(obj.zip_file)

class UserWithProjectsSerializer(serializers.ModelSerializer):
    """
    Serializer pour les utilisateurs avec leurs projets
    Version étendue avec MinIO
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

# ============================================================================
# SERIALIZERS POUR MINIO (NOUVEAUX)
# ============================================================================

class ProjectUploadSerializer(serializers.ModelSerializer):
    """
    Serializer pour l'upload de projets avec MinIO
    """
    class Meta:
        model = Project
        fields = [
            'title', 'description', 'technologies', 'category',
            'cohort', 'tags', 'github_url', 'demo_url', 'status',
            'zip_file', 'image'
        ]
    
    def validate_zip_file(self, value):
        """Validation du fichier ZIP"""
        # Vérifier la taille (max 500MB)
        max_size = 500 * 1024 * 1024  # 500MB
        if value.size > max_size:
            raise serializers.ValidationError("Le fichier ZIP est trop volumineux (max 500MB)")
        
        # Vérifier l'extension
        valid_extensions = ['.zip', '.rar', '.7z', '.tar.gz', '.tar']
        ext = os.path.splitext(value.name)[1].lower()
        if ext not in valid_extensions:
            raise serializers.ValidationError(
                f"Extension non autorisée. Utilisez: {', '.join(valid_extensions)}"
            )
        
        return value
    
    def validate_image(self, value):
        """Validation de l'image"""
        # Vérifier la taille (max 10MB)
        max_size = 10 * 1024 * 1024  # 10MB
        if value.size > max_size:
            raise serializers.ValidationError("L'image est trop volumineuse (max 10MB)")
        
        # Vérifier l'extension
        valid_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
        ext = os.path.splitext(value.name)[1].lower()
        if ext not in valid_extensions:
            raise serializers.ValidationError(
                f"Format d'image non supporté. Utilisez: {', '.join(valid_extensions)}"
            )
        
        return value

class ProjectFileInfoSerializer(serializers.ModelSerializer):
    """
    Serializer pour les informations sur les fichiers d'un projet
    """
    zip_file_info = serializers.SerializerMethodField()
    image_info = serializers.SerializerMethodField()
    
    class Meta:
        model = Project
        fields = ['id', 'title', 'zip_file_info', 'image_info']
    
    def get_zip_file_info(self, obj):
        """Informations sur le fichier ZIP"""
        if obj.zip_file:
            return {
                'url': obj.zip_file.url,
                'filename': os.path.basename(obj.zip_file.name),
                'size': obj.zip_file.size,
                'size_mb': round(obj.zip_file.size / (1024 * 1024), 2),
                'available': True,
                'downloads': obj.downloads
            }
        return None
    
    def get_image_info(self, obj):
        """Informations sur l'image"""
        if obj.image:
            return {
                'url': obj.image.url,
                'filename': os.path.basename(obj.image.name),
                'size': obj.image.size,
                'size_mb': round(obj.image.size / (1024 * 1024), 2),
                'available': True
            }
        return None

class MinioStatusSerializer(serializers.Serializer):
    """
    Serializer pour le statut de MinIO
    """
    enabled = serializers.BooleanField()
    endpoint = serializers.CharField()
    bucket = serializers.CharField()
    secure = serializers.BooleanField()
    connected = serializers.BooleanField(required=False)
    buckets = serializers.ListField(child=serializers.CharField(), required=False)
    error = serializers.CharField(required=False)

# ============================================================================
# SERIALIZERS COMPATIBILITÉ (EXISTANTS - À GARDER)
# ============================================================================

class ProjectSimpleSerializer(serializers.ModelSerializer):
    """
    Serializer simple pour les projets (compatibilité)
    """
    class Meta:
        model = Project
        fields = ['id', 'title', 'description', 'status', 'technologies', 'created_at']

class ProjectDetailSerializer(serializers.ModelSerializer):
    """
    Serializer détaillé pour les projets (compatibilité)
    """
    author_info = serializers.SerializerMethodField()
    
    class Meta:
        model = Project
        fields = [
            'id', 'title', 'description', 'status', 'technologies',
            'github_url', 'demo_url', 'cohort', 'tags', 'image',
            'created_at', 'updated_at', 'author_info'
        ]
    
    def get_author_info(self, obj):
        if obj.author:
            return {
                'id': obj.author.id,
                'username': obj.author.username,
                'full_name': obj.author.get_full_name()
            }
        return None

print("=" * 70)
print("✅ SERIALIZERS CHARGÉS AVEC SUCCÈS!")
print("📊 Serializers disponibles:")
print("   - ProjectSerializer (principal avec MinIO)")
print("   - ProjectUploadSerializer (upload MinIO)")
print("   - ProjectFileInfoSerializer (info fichiers)")
print("   - MinioStatusSerializer (statut MinIO)")
print("   - ProjectSimpleSerializer (compatibilité)")
print("   - ProjectDetailSerializer (compatibilité)")
print("=" * 70)