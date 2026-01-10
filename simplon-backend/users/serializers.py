
# from rest_framework import serializers
# from django.contrib.auth.models import User
# # from .models import UserProfile  # ← COMMENTEZ ou SUPPRIMEZ cette ligne

# class UserProfileSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = User
#         fields = ['id', 'username', 'email', 'first_name', 'last_name']

# class UserSerializer(serializers.ModelSerializer):
#     profile = UserProfileSerializer(read_only=True, source='*')
    
#     class Meta:
#         model = User
#         fields = ['id', 'username', 'email', 'first_name', 'last_name', 'profile']

# # users/serializers.py - VERSION COMPLÈTE ET CORRECTE
# from rest_framework import serializers
# from django.contrib.auth.models import User
# from django.contrib.auth.hashers import make_password
# from rest_framework.validators import UniqueValidator
# from .models import MatriculeAutorise

# class MatriculeAutoriseSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = MatriculeAutorise
#         fields = ['matricule', 'est_actif', 'date_creation', 'date_activation']

# class UserSerializer(serializers.ModelSerializer):
#     """
#     Serializer de base pour les utilisateurs
#     """
#     class Meta:
#         model = User
#         fields = ['id', 'username', 'email', 'first_name', 'last_name', 
#                   'is_staff', 'is_superuser', 'is_active', 'date_joined', 'last_login']
#         read_only_fields = ['date_joined', 'last_login']

# class UserCreateSerializer(serializers.ModelSerializer):
#     """
#     Serializer pour créer un utilisateur avec mot de passe
#     """
#     email = serializers.EmailField(
#         required=True,
#         validators=[UniqueValidator(queryset=User.objects.all(), message="Cet email est déjà utilisé.")]
#     )
#     username = serializers.CharField(
#         required=True,
#         validators=[UniqueValidator(queryset=User.objects.all(), message="Ce nom d'utilisateur est déjà utilisé.")]
#     )
#     password = serializers.CharField(
#         write_only=True,
#         required=True,
#         min_length=6,
#         style={'input_type': 'password'}
#     )
    
#     class Meta:
#         model = User
#         fields = ['id', 'username', 'email', 'first_name', 'last_name', 
#                   'password', 'is_staff', 'is_superuser', 'is_active']
    
#     def create(self, validated_data):
#         # Hacher le mot de passe
#         validated_data['password'] = make_password(validated_data['password'])
#         return super().create(validated_data)
    
#     def update(self, instance, validated_data):
#         # Hacher le mot de passe si présent
#         if 'password' in validated_data:
#             validated_data['password'] = make_password(validated_data['password'])
#         return super().update(instance, validated_data)

# class UserWithProjectsSerializer(serializers.ModelSerializer):
#     """
#     Serializer pour les utilisateurs avec leurs projets
#     """
#     projects_count = serializers.SerializerMethodField()
    
#     class Meta:
#         model = User
#         fields = ['id', 'username', 'email', 'first_name', 'last_name', 
#                   'is_staff', 'is_superuser', 'is_active', 'date_joined', 
#                   'last_login', 'projects_count']
    
#     def get_projects_count(self, obj):
#         from projects.models import Project
#         return Project.objects.filter(author=obj).count()

# class UserDetailSerializer(serializers.ModelSerializer):
#     """
#     Serializer détaillé pour un utilisateur spécifique
#     """
#     class Meta:
#         model = User
#         fields = ['id', 'username', 'email', 'first_name', 'last_name', 
#                   'is_staff', 'is_superuser', 'is_active', 'date_joined', 
#                   'last_login', 'groups', 'user_permissions']

# # users/serializers.py - VERSION CORRIGÉE POUR LES MISE À JOUR
# from rest_framework import serializers
# from django.contrib.auth.models import User
# from django.contrib.auth.hashers import make_password
# from rest_framework.validators import UniqueValidator
# from .models import MatriculeAutorise

# class MatriculeAutoriseSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = MatriculeAutorise
#         fields = ['matricule', 'est_actif', 'date_creation', 'date_activation']

# # ⭐⭐ MODIFIEZ LE UserSerializer POUR PERMETTRE LES MISE À JOUR ⭐⭐
# class UserSerializer(serializers.ModelSerializer):
#     """
#     Serializer de base pour les utilisateurs
#     Permet GET, PATCH et PUT
#     """
#     class Meta:
#         model = User
#         fields = [
#             'id', 'username', 'email', 'first_name', 'last_name', 
#             'is_staff', 'is_superuser', 'is_active', 'date_joined', 
#             'last_login'
#         ]
#         # ⭐⭐ DÉFINISSEZ LES CHAMPS EN LECTURE SEULE ⭐⭐
#         read_only_fields = [
#             'id', 'username', 'is_staff', 'is_superuser', 
#             'date_joined', 'last_login'
#         ]
#         # ⭐⭐ OPTIONNEL : Définissez les règles de validation ⭐⭐
#         extra_kwargs = {
#             'email': {'required': False},
#             'first_name': {'required': False},
#             'last_name': {'required': False},
#         }
    
#     # ⭐⭐ AJOUTEZ CETTE MÉTHODE POUR GÉRER LES MISE À JOUR ⭐⭐
#     def update(self, instance, validated_data):
#         """
#         Mise à jour personnalisée de l'utilisateur
#         """
#         # Empêcher la modification du nom d'utilisateur
#         validated_data.pop('username', None)
        
#         # Mettre à jour chaque champ
#         for attr, value in validated_data.items():
#             setattr(instance, attr, value)
        
#         instance.save()
#         return instance

# class UserCreateSerializer(serializers.ModelSerializer):
#     """
#     Serializer pour créer un utilisateur avec mot de passe
#     """
#     email = serializers.EmailField(
#         required=True,
#         validators=[UniqueValidator(queryset=User.objects.all(), message="Cet email est déjà utilisé.")]
#     )
#     username = serializers.CharField(
#         required=True,
#         validators=[UniqueValidator(queryset=User.objects.all(), message="Ce nom d'utilisateur est déjà utilisé.")]
#     )
#     password = serializers.CharField(
#         write_only=True,
#         required=True,
#         min_length=6,
#         style={'input_type': 'password'}
#     )
    
#     class Meta:
#         model = User
#         fields = ['id', 'username', 'email', 'first_name', 'last_name', 
#                   'password', 'is_staff', 'is_superuser', 'is_active']
    
#     def create(self, validated_data):
#         # Hacher le mot de passe
#         validated_data['password'] = make_password(validated_data['password'])
#         return super().create(validated_data)
    
#     def update(self, instance, validated_data):
#         # Hacher le mot de passe si présent
#         if 'password' in validated_data:
#             validated_data['password'] = make_password(validated_data['password'])
#         return super().update(instance, validated_data)

# class UserWithProjectsSerializer(serializers.ModelSerializer):
#     """
#     Serializer pour les utilisateurs avec leurs projets
#     """
#     projects_count = serializers.SerializerMethodField()
    
#     class Meta:
#         model = User
#         fields = ['id', 'username', 'email', 'first_name', 'last_name', 
#                   'is_staff', 'is_superuser', 'is_active', 'date_joined', 
#                   'last_login', 'projects_count']
    
#     def get_projects_count(self, obj):
#         from projects.models import Project
#         return Project.objects.filter(author=obj).count()

# class UserDetailSerializer(serializers.ModelSerializer):
#     """
#     Serializer détaillé pour un utilisateur spécifique
#     """
#     class Meta:
#         model = User
#         fields = ['id', 'username', 'email', 'first_name', 'last_name', 
#                   'is_staff', 'is_superuser', 'is_active', 'date_joined', 
#                   'last_login', 'groups', 'user_permissions']

# # users/serializers.py - VERSION COMPLÈTE AMÉLIORÉE
# from rest_framework import serializers
# from django.contrib.auth.models import User
# from django.contrib.auth.hashers import make_password
# from rest_framework.validators import UniqueValidator
# from .models import MatriculeAutorise, UserProfile, ProfileUpdateHistory, Notification
# import re
# from django.core.validators import validate_email
# from django.core.exceptions import ValidationError

# class MatriculeAutoriseSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = MatriculeAutorise
#         fields = ['matricule', 'est_actif', 'date_creation', 'date_activation']

# class UserProfileSerializer(serializers.ModelSerializer):
#     """Serializer pour le profil étendu"""
#     profile_picture_url = serializers.SerializerMethodField()
    
#     class Meta:
#         model = UserProfile
#         fields = [
#             'phone', 'bio', 'profile_picture', 'profile_picture_url',
#             'github_url', 'linkedin_url', 'portfolio_url',
#             'cohort', 'specialite', 'date_entree', 'date_sortie',
#             'email_notifications', 'dark_mode',
#             'created_at', 'updated_at'
#         ]
#         read_only_fields = ['created_at', 'updated_at']
    
#     def get_profile_picture_url(self, obj):
#         """Retourne l'URL complète de la photo de profil"""
#         if obj.profile_picture:
#             request = self.context.get('request')
#             if request:
#                 return request.build_absolute_uri(obj.profile_picture.url)
#             return obj.profile_picture.url
#         return None

# class UserSerializer(serializers.ModelSerializer):
#     """
#     Serializer complet pour les utilisateurs avec profil étendu
#     """
#     profile = UserProfileSerializer()
#     matricule = serializers.CharField(source='username', read_only=True)
#     full_name = serializers.SerializerMethodField()
#     is_admin = serializers.BooleanField(source='is_staff', read_only=True)
    
#     class Meta:
#         model = User
#         fields = [
#             'id', 'username', 'email', 'first_name', 'last_name', 'full_name',
#             'is_staff', 'is_superuser', 'is_active', 'is_admin',
#             'date_joined', 'last_login', 'matricule', 'profile'
#         ]
#         read_only_fields = [
#             'id', 'username', 'is_staff', 'is_superuser', 
#             'date_joined', 'last_login', 'matricule', 'is_admin'
#         ]
    
#     def get_full_name(self, obj):
#         """Retourne le nom complet formaté"""
#         if obj.first_name and obj.last_name:
#             return f"{obj.first_name} {obj.last_name}"
#         return obj.username
    
#     def validate_email(self, value):
#         """Validation avancée de l'email"""
#         # Vérifier le format
#         try:
#             validate_email(value)
#         except ValidationError:
#             raise serializers.ValidationError("Format d'email invalide.")
        
#         # Vérifier si l'email est déjà utilisé par un autre utilisateur
#         if User.objects.filter(email=value).exclude(id=self.instance.id).exists():
#             raise serializers.ValidationError("Cet email est déjà utilisé par un autre compte.")
        
#         return value
    
#     def validate_first_name(self, value):
#         """Validation du prénom"""
#         if value and not re.match(r'^[a-zA-ZÀ-ÿ\s\-]+$', value):
#             raise serializers.ValidationError(
#                 "Le prénom ne peut contenir que des lettres, espaces et tirets."
#             )
#         return value.strip() if value else value
    
#     def validate_last_name(self, value):
#         """Validation du nom"""
#         if value and not re.match(r'^[a-zA-ZÀ-ÿ\s\-]+$', value):
#             raise serializers.ValidationError(
#                 "Le nom ne peut contenir que des lettres, espaces et tirets."
#             )
#         return value.strip() if value else value
    
#     def update(self, instance, validated_data):
#         """Mise à jour personnalisée avec gestion du profil"""
#         # Extraire les données du profil
#         profile_data = validated_data.pop('profile', {})
        
#         # Mettre à jour les champs User
#         for attr, value in validated_data.items():
#             setattr(instance, attr, value)
        
#         instance.save()
        
#         # Mettre à jour le UserProfile
#         if hasattr(instance, 'profile'):
#             profile = instance.profile
#             for attr, value in profile_data.items():
#                 setattr(profile, attr, value)
#             profile.save()
        
#         return instance

# class UserCreateSerializer(serializers.ModelSerializer):
#     """
#     Serializer pour créer un utilisateur avec mot de passe
#     """
#     email = serializers.EmailField(
#         required=True,
#         validators=[
#             UniqueValidator(
#                 queryset=User.objects.all(), 
#                 message="Cet email est déjà utilisé."
#             )
#         ]
#     )
#     username = serializers.CharField(
#         required=True,
#         validators=[
#             UniqueValidator(
#                 queryset=User.objects.all(), 
#                 message="Ce nom d'utilisateur est déjà utilisé."
#             )
#         ]
#     )
#     password = serializers.CharField(
#         write_only=True,
#         required=True,
#         min_length=8,
#         style={'input_type': 'password'},
#         help_text="Le mot de passe doit contenir au moins 8 caractères"
#     )
#     confirm_password = serializers.CharField(
#         write_only=True,
#         required=True,
#         style={'input_type': 'password'}
#     )
    
#     class Meta:
#         model = User
#         fields = [
#             'username', 'email', 'first_name', 'last_name', 
#             'password', 'confirm_password'
#         ]
    
#     def validate(self, data):
#         """Validation croisée"""
#         if data['password'] != data['confirm_password']:
#             raise serializers.ValidationError({
#                 "confirm_password": "Les mots de passe ne correspondent pas."
#             })
        
#         # Validation de la force du mot de passe
#         password = data['password']
#         if len(password) < 8:
#             raise serializers.ValidationError({
#                 "password": "Le mot de passe doit contenir au moins 8 caractères."
#             })
        
#         return data
    
#     def create(self, validated_data):
#         # Supprimer confirm_password avant création
#         validated_data.pop('confirm_password')
        
#         # Hacher le mot de passe
#         validated_data['password'] = make_password(validated_data['password'])
        
#         user = User.objects.create(**validated_data)
#         return user

# class UserWithProjectsSerializer(serializers.ModelSerializer):
#     """
#     Serializer pour les utilisateurs avec leurs projets
#     """
#     projects_count = serializers.SerializerMethodField()
#     profile = UserProfileSerializer()
    
#     class Meta:
#         model = User
#         fields = [
#             'id', 'username', 'email', 'first_name', 'last_name', 
#             'is_staff', 'is_superuser', 'is_active', 'date_joined', 
#             'last_login', 'projects_count', 'profile'
#         ]
    
#     def get_projects_count(self, obj):
#         from projects.models import Project
#         return Project.objects.filter(author=obj).count()

# class UserDetailSerializer(serializers.ModelSerializer):
#     """
#     Serializer détaillé pour un utilisateur spécifique
#     """
#     profile = UserProfileSerializer()
#     groups = serializers.SerializerMethodField()
#     permissions = serializers.SerializerMethodField()
    
#     class Meta:
#         model = User
#         fields = [
#             'id', 'username', 'email', 'first_name', 'last_name', 
#             'is_staff', 'is_superuser', 'is_active', 'date_joined', 
#             'last_login', 'groups', 'user_permissions', 'profile'
#         ]
    
#     def get_groups(self, obj):
#         return [group.name for group in obj.groups.all()]
    
#     def get_permissions(self, obj):
#         return [perm.codename for perm in obj.user_permissions.all()]

# class ProfileUpdateHistorySerializer(serializers.ModelSerializer):
#     """
#     Serializer pour l'historique des modifications
#     """
#     user_username = serializers.CharField(source='user.username', read_only=True)
#     changed_by_username = serializers.CharField(source='changed_by.username', read_only=True, allow_null=True)
    
#     class Meta:
#         model = ProfileUpdateHistory
#         fields = [
#             'id', 'user', 'user_username', 'action', 'field_name',
#             'old_value', 'new_value', 'ip_address', 'user_agent',
#             'changed_by', 'changed_by_username', 'changed_at'
#         ]
#         read_only_fields = ['changed_at']

# class NotificationSerializer(serializers.ModelSerializer):
#     """
#     Serializer pour les notifications
#     """
#     time_ago = serializers.SerializerMethodField()
    
#     class Meta:
#         model = Notification
#         fields = [
#             'id', 'type', 'title', 'message', 'is_read',
#             'created_at', 'read_at', 'time_ago'
#         ]
#         read_only_fields = ['created_at', 'read_at']
    
#     def get_time_ago(self, obj):
#         """Retourne le temps écoulé depuis la création"""
#         from django.utils import timezone
#         from django.utils.timesince import timesince
        
#         return timesince(obj.created_at, timezone.now())

# users/serializers.py - VERSION FINALE CORRIGÉE
from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from django.contrib.auth.password_validation import validate_password
from rest_framework.validators import UniqueValidator
from .models import MatriculeAutorise, UserProfile, ProfileUpdateHistory, Notification

# ============ SERIALIZERS DE BASE ============

class MatriculeAutoriseSerializer(serializers.ModelSerializer):
    class Meta:
        model = MatriculeAutorise
        fields = ['matricule', 'est_actif', 'date_creation', 'date_activation']
        read_only_fields = ['date_creation', 'date_activation']

class UserSerializer(serializers.ModelSerializer):
    """
    Serializer de base pour les utilisateurs - POUR LE PROFIL
    """
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 
            'is_staff', 'is_superuser', 'is_active', 'date_joined', 'last_login'
        ]
        read_only_fields = [
            'id', 'is_staff', 'is_superuser', 
            'date_joined', 'last_login'
        ]
        extra_kwargs = {
            'username': {'read_only': True},  # Username ne peut pas être modifié
        }

# ============ SERIALIZERS POUR CRÉATION ============

class UserCreateSerializer(serializers.ModelSerializer):
    """
    Serializer pour créer un utilisateur avec mot de passe - POUR L'ADMIN
    """
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(
            queryset=User.objects.all(), 
            message="Cet email est déjà utilisé."
        )]
    )
    username = serializers.CharField(
        required=True,
        validators=[UniqueValidator(
            queryset=User.objects.all(), 
            message="Ce nom d'utilisateur est déjà utilisé."
        )]
    )
    password = serializers.CharField(
        write_only=True,
        required=True,
        min_length=6,
        style={'input_type': 'password'},
        help_text="Le mot de passe doit contenir au moins 6 caractères"
    )
    confirm_password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'},
        help_text="Confirmez le mot de passe"
    )
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'password', 'confirm_password']
    
    def validate(self, data):
        # Vérifier que les mots de passe correspondent
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({"password": "Les mots de passe ne correspondent pas."})
        
        # Valider la force du mot de passe
        validate_password(data['password'])
        
        return data
    
    def create(self, validated_data):
        # Supprimer confirm_password avant création
        validated_data.pop('confirm_password', None)
        
        # Hacher le mot de passe
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        # Gérer la confirmation de mot de passe
        validated_data.pop('confirm_password', None)
        
        # Hacher le mot de passe si présent
        if 'password' in validated_data:
            validated_data['password'] = make_password(validated_data['password'])
        
        return super().update(instance, validated_data)

# ============ SERIALIZERS PROFIL ÉTENDU ============

class UserProfileSerializer(serializers.ModelSerializer):
    """
    Serializer pour le profil utilisateur étendu
    """
    user = UserSerializer(read_only=True)
    avatar_url = serializers.SerializerMethodField()
    
    class Meta:
        model = UserProfile
        fields = [
            'id', 'user', 'bio', 'phone', 'location', 
            'company', 'position', 'avatar', 'avatar_url',
            'website', 'github', 'linkedin', 'twitter',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']
    
    def get_avatar_url(self, obj):
        """Retourne l'URL complète de l'avatar"""
        if obj.avatar and hasattr(obj.avatar, 'url'):
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.avatar.url)
            return obj.avatar.url
        return None

class ProfileUpdateHistorySerializer(serializers.ModelSerializer):
    """
    Serializer pour l'historique des modifications
    """
    user = serializers.StringRelatedField()
    
    class Meta:
        model = ProfileUpdateHistory
        fields = ['id', 'user', 'updated_at', 'changes', 'ip_address', 'user_agent']
        read_only_fields = ['id', 'user', 'updated_at', 'changes']

class NotificationSerializer(serializers.ModelSerializer):
    """
    Serializer pour les notifications
    """
    class Meta:
        model = Notification
        fields = ['id', 'message', 'notification_type', 'is_read', 'created_at', 'metadata']
        read_only_fields = ['id', 'created_at']

# ============ SERIALIZERS COMBINÉS ============

class UserWithProfileSerializer(serializers.ModelSerializer):
    """
    Serializer combinant User et UserProfile
    """
    profile = UserProfileSerializer(read_only=True)
    update_history = ProfileUpdateHistorySerializer(many=True, read_only=True)
    notifications = NotificationSerializer(many=True, read_only=True)
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'is_active', 'date_joined', 'last_login',
            'profile', 'update_history', 'notifications'
        ]

# ============ SERIALIZERS SPÉCIAUX POUR LE FRONTEND ============

class PasswordChangeSerializer(serializers.Serializer):
    """
    Serializer pour changer le mot de passe
    """
    old_password = serializers.CharField(required=True, write_only=True)
    new_password = serializers.CharField(required=True, write_only=True, min_length=6)
    confirm_password = serializers.CharField(required=True, write_only=True)
    
    def validate(self, data):
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError({"new_password": "Les mots de passe ne correspondent pas."})
        validate_password(data['new_password'])
        return data

class AvatarUploadSerializer(serializers.Serializer):
    """
    Serializer pour upload d'avatar
    """
    avatar = serializers.ImageField(
        required=True,
        help_text="Image de profil (JPG, PNG, max 2MB)"
    )
    
    def validate_avatar(self, value):
        # Vérifier la taille
        if value.size > 2 * 1024 * 1024:  # 2MB
            raise serializers.ValidationError("L'image ne doit pas dépasser 2MB.")
        
        # Vérifier le type
        valid_extensions = ['jpg', 'jpeg', 'png', 'gif']
        extension = value.name.split('.')[-1].lower()
        if extension not in valid_extensions:
            raise serializers.ValidationError(
                f"Type de fichier non supporté. Utilisez: {', '.join(valid_extensions)}"
            )
        
        return value

# ============ SERIALIZERS POUR STATISTIQUES ============

class UserStatsSerializer(serializers.Serializer):
    """
    Serializer pour les statistiques utilisateur
    """
    total_users = serializers.IntegerField()
    active_today = serializers.IntegerField()
    new_this_week = serializers.IntegerField()
    with_profile = serializers.IntegerField()
    without_profile = serializers.IntegerField()
    last_7_days = serializers.ListField(child=serializers.DictField())