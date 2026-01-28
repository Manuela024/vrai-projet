
# # users/serializers.py - VERSION FINALE CORRIGÉE
# from rest_framework import serializers
# from django.contrib.auth.models import User
# from django.contrib.auth.hashers import make_password
# from django.contrib.auth.password_validation import validate_password
# from rest_framework.validators import UniqueValidator
# from .models import MatriculeAutorise, UserProfile, ProfileUpdateHistory, Notification

# # ============ SERIALIZERS DE BASE ============

# class MatriculeAutoriseSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = MatriculeAutorise
#         fields = ['matricule', 'est_actif', 'date_creation', 'date_activation']
#         read_only_fields = ['date_creation', 'date_activation']

# class UserSerializer(serializers.ModelSerializer):
#     """
#     Serializer de base pour les utilisateurs - POUR LE PROFIL
#     """
#     class Meta:
#         model = User
#         fields = [
#             'id', 'username', 'email', 'first_name', 'last_name', 
#             'is_staff', 'is_superuser', 'is_active', 'date_joined', 'last_login'
#         ]
#         read_only_fields = [
#             'id', 'is_staff', 'is_superuser', 
#             'date_joined', 'last_login'
#         ]
#         extra_kwargs = {
#             'username': {'read_only': True},  # Username ne peut pas être modifié
#         }

# # ============ SERIALIZERS POUR CRÉATION ============

# class UserCreateSerializer(serializers.ModelSerializer):
#     """
#     Serializer pour créer un utilisateur avec mot de passe - POUR L'ADMIN
#     """
#     email = serializers.EmailField(
#         required=True,
#         validators=[UniqueValidator(
#             queryset=User.objects.all(), 
#             message="Cet email est déjà utilisé."
#         )]
#     )
#     username = serializers.CharField(
#         required=True,
#         validators=[UniqueValidator(
#             queryset=User.objects.all(), 
#             message="Ce nom d'utilisateur est déjà utilisé."
#         )]
#     )
#     password = serializers.CharField(
#         write_only=True,
#         required=True,
#         min_length=6,
#         style={'input_type': 'password'},
#         help_text="Le mot de passe doit contenir au moins 6 caractères"
#     )
#     confirm_password = serializers.CharField(
#         write_only=True,
#         required=True,
#         style={'input_type': 'password'},
#         help_text="Confirmez le mot de passe"
#     )
    
#     class Meta:
#         model = User
#         fields = ['id', 'username', 'email', 'first_name', 'last_name', 'password', 'confirm_password']
    
#     def validate(self, data):
#         # Vérifier que les mots de passe correspondent
#         if data['password'] != data['confirm_password']:
#             raise serializers.ValidationError({"password": "Les mots de passe ne correspondent pas."})
        
#         # Valider la force du mot de passe
#         validate_password(data['password'])
        
#         return data
    
#     def create(self, validated_data):
#         # Supprimer confirm_password avant création
#         validated_data.pop('confirm_password', None)
        
#         # Hacher le mot de passe
#         validated_data['password'] = make_password(validated_data['password'])
#         return super().create(validated_data)
    
#     def update(self, instance, validated_data):
#         # Gérer la confirmation de mot de passe
#         validated_data.pop('confirm_password', None)
        
#         # Hacher le mot de passe si présent
#         if 'password' in validated_data:
#             validated_data['password'] = make_password(validated_data['password'])
        
#         return super().update(instance, validated_data)

# # ============ SERIALIZERS PROFIL ÉTENDU ============

# class UserProfileSerializer(serializers.ModelSerializer):
#     """
#     Serializer pour le profil utilisateur étendu
#     """
#     user = UserSerializer(read_only=True)
#     avatar_url = serializers.SerializerMethodField()
    
#     class Meta:
#         model = UserProfile
#         fields = [
#             'id', 'user', 'bio', 'phone', 'location', 
#             'company', 'position', 'avatar', 'avatar_url',
#             'website', 'github', 'linkedin', 'twitter',
#             'created_at', 'updated_at'
#         ]
#         read_only_fields = ['id', 'user', 'created_at', 'updated_at']
    
#     def get_avatar_url(self, obj):
#         """Retourne l'URL complète de l'avatar"""
#         if obj.avatar and hasattr(obj.avatar, 'url'):
#             request = self.context.get('request')
#             if request:
#                 return request.build_absolute_uri(obj.avatar.url)
#             return obj.avatar.url
#         return None

# class ProfileUpdateHistorySerializer(serializers.ModelSerializer):
#     """
#     Serializer pour l'historique des modifications
#     """
#     user = serializers.StringRelatedField()
    
#     class Meta:
#         model = ProfileUpdateHistory
#         fields = ['id', 'user', 'updated_at', 'changes', 'ip_address', 'user_agent']
#         read_only_fields = ['id', 'user', 'updated_at', 'changes']

# class NotificationSerializer(serializers.ModelSerializer):
#     """
#     Serializer pour les notifications
#     """
#     class Meta:
#         model = Notification
#         fields = ['id', 'message', 'notification_type', 'is_read', 'created_at', 'metadata']
#         read_only_fields = ['id', 'created_at']

# # ============ SERIALIZERS COMBINÉS ============

# class UserWithProfileSerializer(serializers.ModelSerializer):
#     """
#     Serializer combinant User et UserProfile
#     """
#     profile = UserProfileSerializer(read_only=True)
#     update_history = ProfileUpdateHistorySerializer(many=True, read_only=True)
#     notifications = NotificationSerializer(many=True, read_only=True)
    
#     class Meta:
#         model = User
#         fields = [
#             'id', 'username', 'email', 'first_name', 'last_name',
#             'is_active', 'date_joined', 'last_login',
#             'profile', 'update_history', 'notifications'
#         ]

# # ============ SERIALIZERS SPÉCIAUX POUR LE FRONTEND ============

# class PasswordChangeSerializer(serializers.Serializer):
#     """
#     Serializer pour changer le mot de passe
#     """
#     old_password = serializers.CharField(required=True, write_only=True)
#     new_password = serializers.CharField(required=True, write_only=True, min_length=6)
#     confirm_password = serializers.CharField(required=True, write_only=True)
    
#     def validate(self, data):
#         if data['new_password'] != data['confirm_password']:
#             raise serializers.ValidationError({"new_password": "Les mots de passe ne correspondent pas."})
#         validate_password(data['new_password'])
#         return data

# class AvatarUploadSerializer(serializers.Serializer):
#     """
#     Serializer pour upload d'avatar
#     """
#     avatar = serializers.ImageField(
#         required=True,
#         help_text="Image de profil (JPG, PNG, max 2MB)"
#     )
    
#     def validate_avatar(self, value):
#         # Vérifier la taille
#         if value.size > 2 * 1024 * 1024:  # 2MB
#             raise serializers.ValidationError("L'image ne doit pas dépasser 2MB.")
        
#         # Vérifier le type
#         valid_extensions = ['jpg', 'jpeg', 'png', 'gif']
#         extension = value.name.split('.')[-1].lower()
#         if extension not in valid_extensions:
#             raise serializers.ValidationError(
#                 f"Type de fichier non supporté. Utilisez: {', '.join(valid_extensions)}"
#             )
        
#         return value

# # ============ SERIALIZERS POUR STATISTIQUES ============

# class UserStatsSerializer(serializers.Serializer):
#     """
#     Serializer pour les statistiques utilisateur
#     """
#     total_users = serializers.IntegerField()
#     active_today = serializers.IntegerField()
#     new_this_week = serializers.IntegerField()
#     with_profile = serializers.IntegerField()
#     without_profile = serializers.IntegerField()
#     last_7_days = serializers.ListField(child=serializers.DictField())

# # users/serializers.py
# from rest_framework import serializers
# from django.contrib.auth.models import User
# from django.contrib.auth.hashers import make_password
# from django.contrib.auth.password_validation import validate_password
# from rest_framework.validators import UniqueValidator
# from .models import MatriculeAutorise, UserProfile, ProfileUpdateHistory, Notification

# # ============ SERIALIZERS DE BASE ============

# class MatriculeAutoriseSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = MatriculeAutorise
#         fields = ['matricule', 'est_actif', 'date_creation', 'date_activation']
#         read_only_fields = ['date_creation', 'date_activation']

# class UserSerializer(serializers.ModelSerializer):
#     """
#     Serializer de base pour les utilisateurs - POUR LE PROFIL
#     """
#     class Meta:
#         model = User
#         fields = [
#             'id', 'username', 'email', 'first_name', 'last_name', 
#             'is_staff', 'is_superuser', 'is_active', 'date_joined', 'last_login'
#         ]
#         read_only_fields = [
#             'id', 'is_staff', 'is_superuser', 
#             'date_joined', 'last_login'
#         ]
#         extra_kwargs = {
#             'username': {'read_only': True},
#         }

# # ============ SERIALIZERS POUR CRÉATION ============

# class UserCreateSerializer(serializers.ModelSerializer):
#     """
#     Serializer pour créer un utilisateur avec mot de passe - POUR L'ADMIN
#     """
#     email = serializers.EmailField(
#         required=True,
#         validators=[UniqueValidator(
#             queryset=User.objects.all(), 
#             message="Cet email est déjà utilisé."
#         )]
#     )
#     username = serializers.CharField(
#         required=True,
#         validators=[UniqueValidator(
#             queryset=User.objects.all(), 
#             message="Ce nom d'utilisateur est déjà utilisé."
#         )]
#     )
#     password = serializers.CharField(
#         write_only=True,
#         required=True,
#         min_length=6,
#         style={'input_type': 'password'},
#         help_text="Le mot de passe doit contenir au moins 6 caractères"
#     )
#     confirm_password = serializers.CharField(
#         write_only=True,
#         required=True,
#         style={'input_type': 'password'},
#         help_text="Confirmez le mot de passe"
#     )
    
#     class Meta:
#         model = User
#         fields = ['id', 'username', 'email', 'first_name', 'last_name', 'password', 'confirm_password']
    
#     def validate(self, data):
#         if data['password'] != data['confirm_password']:
#             raise serializers.ValidationError({"password": "Les mots de passe ne correspondent pas."})
        
#         validate_password(data['password'])
#         return data
    
#     def create(self, validated_data):
#         validated_data.pop('confirm_password', None)
#         validated_data['password'] = make_password(validated_data['password'])
#         return super().create(validated_data)
    
#     def update(self, instance, validated_data):
#         validated_data.pop('confirm_password', None)
#         if 'password' in validated_data:
#             validated_data['password'] = make_password(validated_data['password'])
#         return super().update(instance, validated_data)

# # ============ SERIALIZERS PROFIL ÉTENDU ============

# class UserProfileSerializer(serializers.ModelSerializer):
#     """
#     Serializer pour le profil utilisateur étendu
#     """
#     user = UserSerializer(read_only=True)
#     avatar_url = serializers.SerializerMethodField()
    
#     class Meta:
#         model = UserProfile
#         fields = [
#             'id', 'user', 'bio', 'phone', 'location', 
#             'company', 'position', 'avatar', 'avatar_url',
#             'website', 'github', 'linkedin', 'twitter',
#             'cohort', 'specialite', 'date_entree', 'date_sortie',
#             'created_at', 'updated_at'
#         ]
#         read_only_fields = ['id', 'user', 'created_at', 'updated_at']
    
#     def get_avatar_url(self, obj):
#         """Retourne l'URL complète de l'avatar"""
#         if obj.avatar and hasattr(obj.avatar, 'url'):
#             request = self.context.get('request')
#             if request:
#                 return request.build_absolute_uri(obj.avatar.url)
#             return obj.avatar.url
#         return None

# class ProfileUpdateHistorySerializer(serializers.ModelSerializer):
#     """
#     Serializer pour l'historique des modifications
#     """
#     user = serializers.StringRelatedField()
    
#     class Meta:
#         model = ProfileUpdateHistory
#         fields = ['id', 'user', 'updated_at', 'changes', 'ip_address', 'user_agent']
#         read_only_fields = ['id', 'user', 'updated_at', 'changes']

# class NotificationSerializer(serializers.ModelSerializer):
#     """
#     Serializer pour les notifications
#     """
#     class Meta:
#         model = Notification
#         fields = ['id', 'message', 'notification_type', 'is_read', 'created_at', 'metadata']
#         read_only_fields = ['id', 'created_at']

# # ============ SERIALIZERS COMBINÉS ============

# class UserWithProfileSerializer(serializers.ModelSerializer):
#     """
#     Serializer combinant User et UserProfile
#     """
#     profile = UserProfileSerializer(read_only=True)
#     update_history = ProfileUpdateHistorySerializer(many=True, read_only=True)
#     notifications = NotificationSerializer(many=True, read_only=True)
    
#     class Meta:
#         model = User
#         fields = [
#             'id', 'username', 'email', 'first_name', 'last_name',
#             'is_active', 'date_joined', 'last_login',
#             'profile', 'update_history', 'notifications'
#         ]

# # ============ SERIALIZERS SPÉCIAUX POUR LE FRONTEND ============

# class PasswordChangeSerializer(serializers.Serializer):
#     """
#     Serializer pour changer le mot de passe
#     """
#     old_password = serializers.CharField(required=True, write_only=True)
#     new_password = serializers.CharField(required=True, write_only=True, min_length=6)
#     confirm_password = serializers.CharField(required=True, write_only=True)
    
#     def validate(self, data):
#         if data['new_password'] != data['confirm_password']:
#             raise serializers.ValidationError({"new_password": "Les mots de passe ne correspondent pas."})
#         validate_password(data['new_password'])
#         return data

# class AvatarUploadSerializer(serializers.Serializer):
#     """
#     Serializer pour upload d'avatar
#     """
#     avatar = serializers.ImageField(
#         required=True,
#         help_text="Image de profil (JPG, PNG, max 2MB)"
#     )
    
#     def validate_avatar(self, value):
#         if value.size > 2 * 1024 * 1024:  # 2MB
#             raise serializers.ValidationError("L'image ne doit pas dépasser 2MB.")
        
#         valid_extensions = ['jpg', 'jpeg', 'png', 'gif']
#         extension = value.name.split('.')[-1].lower()
#         if extension not in valid_extensions:
#             raise serializers.ValidationError(
#                 f"Type de fichier non supporté. Utilisez: {', '.join(valid_extensions)}"
#             )
        
#         return value

# class ExtendedProfileUpdateSerializer(serializers.Serializer):
#     """
#     Serializer pour la mise à jour du profil étendu depuis React
#     """
#     bio = serializers.CharField(required=False, allow_blank=True, allow_null=True)
#     phone = serializers.CharField(required=False, allow_blank=True, allow_null=True, max_length=20)
#     location = serializers.CharField(required=False, allow_blank=True, allow_null=True, max_length=100)
#     company = serializers.CharField(required=False, allow_blank=True, allow_null=True, max_length=100)
#     position = serializers.CharField(required=False, allow_blank=True, allow_null=True, max_length=100)
#     website = serializers.URLField(required=False, allow_blank=True, allow_null=True)
#     github = serializers.URLField(required=False, allow_blank=True, allow_null=True)
#     linkedin = serializers.URLField(required=False, allow_blank=True, allow_null=True)
#     twitter = serializers.URLField(required=False, allow_blank=True, allow_null=True)
#     cohort = serializers.CharField(required=False, allow_blank=True, allow_null=True, max_length=100)
#     specialite = serializers.CharField(required=False, allow_blank=True, allow_null=True, max_length=100)
#     date_entree = serializers.DateField(required=False, allow_null=True)
#     date_sortie = serializers.DateField(required=False, allow_null=True)

# # ============ SERIALIZERS POUR STATISTIQUES ============

# class UserStatsSerializer(serializers.Serializer):
#     """
#     Serializer pour les statistiques utilisateur
#     """
#     total_users = serializers.IntegerField()
#     active_today = serializers.IntegerField()
#     new_this_week = serializers.IntegerField()
#     with_profile = serializers.IntegerField()
#     without_profile = serializers.IntegerField()
#     last_7_days = serializers.ListField(child=serializers.DictField())


# users/serializers.py
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
            'username': {'read_only': True},
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
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({"password": "Les mots de passe ne correspondent pas."})
        
        validate_password(data['password'])
        return data
    
    def create(self, validated_data):
        validated_data.pop('confirm_password', None)
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        validated_data.pop('confirm_password', None)
        if 'password' in validated_data:
            validated_data['password'] = make_password(validated_data['password'])
        return super().update(instance, validated_data)

# ============ SERIALIZERS POUR AUTHENTIFICATION ============

class QuickLoginSerializer(serializers.Serializer):
    """
    Serializer pour la connexion rapide
    """
    matricule = serializers.CharField(required=False, allow_blank=True)
    username = serializers.CharField(required=False, allow_blank=True)
    password = serializers.CharField(write_only=True, required=True, min_length=1)
    
    def validate(self, data):
        matricule = data.get('matricule')
        username = data.get('username')
        password = data.get('password')
        
        if not (matricule or username):
            raise serializers.ValidationError("Matricule ou nom d'utilisateur requis")
        
        if not password:
            raise serializers.ValidationError("Mot de passe requis")
        
        return data

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
            'cohort', 'specialite', 'date_entree', 'date_sortie',
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
        if value.size > 2 * 1024 * 1024:  # 2MB
            raise serializers.ValidationError("L'image ne doit pas dépasser 2MB.")
        
        valid_extensions = ['jpg', 'jpeg', 'png', 'gif']
        extension = value.name.split('.')[-1].lower()
        if extension not in valid_extensions:
            raise serializers.ValidationError(
                f"Type de fichier non supporté. Utilisez: {', '.join(valid_extensions)}"
            )
        
        return value

class ExtendedProfileUpdateSerializer(serializers.Serializer):
    """
    Serializer pour la mise à jour du profil étendu depuis React
    """
    bio = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    phone = serializers.CharField(required=False, allow_blank=True, allow_null=True, max_length=20)
    location = serializers.CharField(required=False, allow_blank=True, allow_null=True, max_length=100)
    company = serializers.CharField(required=False, allow_blank=True, allow_null=True, max_length=100)
    position = serializers.CharField(required=False, allow_blank=True, allow_null=True, max_length=100)
    website = serializers.URLField(required=False, allow_blank=True, allow_null=True)
    github = serializers.URLField(required=False, allow_blank=True, allow_null=True)
    linkedin = serializers.URLField(required=False, allow_blank=True, allow_null=True)
    twitter = serializers.URLField(required=False, allow_blank=True, allow_null=True)
    cohort = serializers.CharField(required=False, allow_blank=True, allow_null=True, max_length=100)
    specialite = serializers.CharField(required=False, allow_blank=True, allow_null=True, max_length=100)
    date_entree = serializers.DateField(required=False, allow_null=True)
    date_sortie = serializers.DateField(required=False, allow_null=True)

# ============ SERIALIZERS POUR STATISTIQUES ============

class UserStatsSerializer(serializers.Serializer):
    total_users = serializers.IntegerField()
    active_today = serializers.IntegerField()
    new_this_week = serializers.IntegerField()
    with_profile = serializers.IntegerField()
    generated_at = serializers.DateTimeField()