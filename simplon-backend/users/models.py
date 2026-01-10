

# from django.db import models
# from django.utils import timezone
# from datetime import timedelta

# class MatriculeAutorise(models.Model):
#     matricule = models.CharField(max_length=50, unique=True, verbose_name="Matricule Simplon")
#     date_creation = models.DateTimeField(auto_now_add=True, verbose_name="Date de création")
#     est_actif = models.BooleanField(default=True, verbose_name="Actif")
#     date_activation = models.DateTimeField(null=True, blank=True, verbose_name="Date d'activation")
    
#     # ⭐ CHAMPS POUR L'EXPIRATION DU TOKEN
#     activation_token = models.CharField(max_length=100, blank=True, null=True)
#     token_expiration = models.DateTimeField(blank=True, null=True)
    
#     class Meta:
#         verbose_name = "Matricule autorisé"
#         verbose_name_plural = "Matricules autorisés"
    
#     def __str__(self):
#         return f"{self.matricule} ({'Actif' if self.est_actif else 'Inactif'})"
    
#     # ⭐ CORRECTION CRITIQUE : MÉTHODE POUR VÉRIFIER L'EXPIRATION
#     def is_token_expired(self):
#         if self.token_expiration:
#             # 🔍 LOGS DE DEBUG POUR VOIR CE QUI SE PASSE
#             now = timezone.now()
#             is_expired = now > self.token_expiration
            
#             print("=" * 50)
#             print("🔍 DEBUG is_token_expired()")
#             print("=" * 50)
#             print(f"🕒 Heure actuelle: {now}")
#             print(f"⏰ Expiration prévue: {self.token_expiration}")
#             print(f"📊 Différence: {self.token_expiration - now}")
            
#             if self.token_expiration > now:
#                 seconds_remaining = (self.token_expiration - now).total_seconds()
#                 print(f"✅ TEMPS RESTANT: {seconds_remaining} secondes")
#                 print(f"   Soit: {seconds_remaining / 60:.1f} minutes")
#             else:
#                 seconds_passed = (now - self.token_expiration).total_seconds()
#                 print(f"❌ TEMPS DÉPASSÉ: {seconds_passed} secondes")
#                 print(f"   Soit: {seconds_passed / 60:.1f} minutes")
            
#             print(f"🎯 RÉSULTAT: {'EXPIRÉ' if is_expired else 'VALIDE'}")
#             print("=" * 50)
            
#             return is_expired
        
#         # ⭐ CORRECTION : False si pas de date d'expiration (au lieu de True)
#         print("🔍 DEBUG: Aucune date d'expiration définie - Non expiré")
#         return False
    
#     # ⭐ MÉTHODE POUR OBTENIR LE TEMPS RESTANT (AMÉLIORÉE)
#     def get_remaining_time(self):
#         if self.token_expiration and not self.is_token_expired():
#             remaining = self.token_expiration - timezone.now()
#             seconds_remaining = max(0, int(remaining.total_seconds()))
            
#             print(f"⏱️ Temps restant calculé: {seconds_remaining}s")
#             return seconds_remaining
        
#         print("⏱️ Aucun temps restant - Token expiré ou inexistant")
#         return 0
    
#     # ⭐ NOUVELLE MÉTHODE : CRÉER UN TOKEN AVEC EXPIRATION
#     def create_activation_token(self, minutes=5):
#         import secrets
        
#         # Générer un token sécurisé
#         self.activation_token = secrets.token_urlsafe(32)
#         self.token_expiration = timezone.now() + timedelta(minutes=minutes)
        
#         print("=" * 50)
#         print("🎫 CRÉATION TOKEN D'ACTIVATION")
#         print("=" * 50)
#         print(f"📋 Matricule: {self.matricule}")
#         print(f"🔑 Token: {self.activation_token}")
#         print(f"⏰ Expiration: {self.token_expiration}")
#         print(f"   Dans: {minutes} minutes")
#         print("=" * 50)
        
#         self.save()
#         return self.activation_token
    
#     # ⭐ NOUVELLE MÉTHODE : VALIDER ET UTILISER LE TOKEN
#     def use_activation_token(self, token_to_validate):
#         print("=" * 50)
#         print("🔐 VALIDATION TOKEN D'ACTIVATION")
#         print("=" * 50)
#         print(f"📋 Matricule: {self.matricule}")
#         print(f"🔑 Token reçu: {token_to_validate}")
#         print(f"🔑 Token stocké: {self.activation_token}")
        
#         # Vérifier si le token correspond
#         if self.activation_token != token_to_validate:
#             print("❌ ERREUR: Token invalide")
#             return False
        
#         # Vérifier l'expiration
#         if self.is_token_expired():
#             print("❌ ERREUR: Token expiré")
#             return False
        
#         # Token valide - le consommer
#         print("✅ SUCCÈS: Token valide et non expiré")
#         self.activation_token = None
#         self.token_expiration = None
#         self.date_activation = timezone.now()
#         self.save()
        
#         print("🔄 Token consommé et nettoyé")
#         print("=" * 50)
#         return True


# from django.db import models
# from django.utils import timezone
# from datetime import timedelta
# from django.contrib.auth.models import User  # ⭐ AJOUT
# import secrets  # ⭐ AJOUT

# class MatriculeAutorise(models.Model):
#     matricule = models.CharField(max_length=50, unique=True, verbose_name="Matricule Simplon")
#     date_creation = models.DateTimeField(auto_now_add=True, verbose_name="Date de création")
#     est_actif = models.BooleanField(default=True, verbose_name="Actif")
#     date_activation = models.DateTimeField(null=True, blank=True, verbose_name="Date d'activation")
    
#     # ⭐ CHAMPS POUR L'EXPIRATION DU TOKEN
#     activation_token = models.CharField(max_length=100, blank=True, null=True)
#     token_expiration = models.DateTimeField(blank=True, null=True)
    
#     class Meta:
#         verbose_name = "Matricule autorisé"
#         verbose_name_plural = "Matricules autorisés"
    
#     def __str__(self):
#         return f"{self.matricule} ({'Actif' if self.est_actif else 'Inactif'})"
    
#     # ⭐ CORRECTION CRITIQUE : MÉTHODE POUR VÉRIFIER L'EXPIRATION
#     def is_token_expired(self):
#         if self.token_expiration:
#             # 🔍 LOGS DE DEBUG POUR VOIR CE QUI SE PASSE
#             now = timezone.now()
#             is_expired = now > self.token_expiration
            
#             print("=" * 50)
#             print("🔍 DEBUG is_token_expired()")
#             print("=" * 50)
#             print(f"🕒 Heure actuelle: {now}")
#             print(f"⏰ Expiration prévue: {self.token_expiration}")
#             print(f"📊 Différence: {self.token_expiration - now}")
            
#             if self.token_expiration > now:
#                 seconds_remaining = (self.token_expiration - now).total_seconds()
#                 print(f"✅ TEMPS RESTANT: {seconds_remaining} secondes")
#                 print(f"   Soit: {seconds_remaining / 60:.1f} minutes")
#             else:
#                 seconds_passed = (now - self.token_expiration).total_seconds()
#                 print(f"❌ TEMPS DÉPASSÉ: {seconds_passed} secondes")
#                 print(f"   Soit: {seconds_passed / 60:.1f} minutes")
            
#             print(f"🎯 RÉSULTAT: {'EXPIRÉ' if is_expired else 'VALIDE'}")
#             print("=" * 50)
            
#             return is_expired
        
#         # ⭐ CORRECTION : False si pas de date d'expiration (au lieu de True)
#         print("🔍 DEBUG: Aucune date d'expiration définie - Non expiré")
#         return False
    
#     # ⭐ MÉTHODE POUR OBTENIR LE TEMPS RESTANT (AMÉLIORÉE)
#     def get_remaining_time(self):
#         if self.token_expiration and not self.is_token_expired():
#             remaining = self.token_expiration - timezone.now()
#             seconds_remaining = max(0, int(remaining.total_seconds()))
            
#             print(f"⏱️ Temps restant calculé: {seconds_remaining}s")
#             return seconds_remaining
        
#         print("⏱️ Aucun temps restant - Token expiré ou inexistant")
#         return 0
    
#     # ⭐ NOUVELLE MÉTHODE : CRÉER UN TOKEN AVEC EXPIRATION
#     def create_activation_token(self, minutes=5):
#         # Générer un token sécurisé
#         self.activation_token = secrets.token_urlsafe(32)
#         self.token_expiration = timezone.now() + timedelta(minutes=minutes)
        
#         print("=" * 50)
#         print("🎫 CRÉATION TOKEN D'ACTIVATION")
#         print("=" * 50)
#         print(f"📋 Matricule: {self.matricule}")
#         print(f"🔑 Token: {self.activation_token}")
#         print(f"⏰ Expiration: {self.token_expiration}")
#         print(f"   Dans: {minutes} minutes")
#         print("=" * 50)
        
#         self.save()
#         return self.activation_token
    
#     # ⭐ NOUVELLE MÉTHODE : VALIDER ET UTILISER LE TOKEN
#     def use_activation_token(self, token_to_validate):
#         print("=" * 50)
#         print("🔐 VALIDATION TOKEN D'ACTIVATION")
#         print("=" * 50)
#         print(f"📋 Matricule: {self.matricule}")
#         print(f"🔑 Token reçu: {token_to_validate}")
#         print(f"🔑 Token stocké: {self.activation_token}")
        
#         # Vérifier si le token correspond
#         if self.activation_token != token_to_validate:
#             print("❌ ERREUR: Token invalide")
#             return False
        
#         # Vérifier l'expiration
#         if self.is_token_expired():
#             print("❌ ERREUR: Token expiré")
#             return False
        
#         # Token valide - le consommer
#         print("✅ SUCCÈS: Token valide et non expiré")
#         self.activation_token = None
#         self.token_expiration = None
#         self.date_activation = timezone.now()
#         self.save()
        
#         print("🔄 Token consommé et nettoyé")
#         print("=" * 50)
#         return True

# # ⭐⭐⭐ NOUVEAUX MODÈLES À AJOUTER ⭐⭐⭐

# class UserProfile(models.Model):
#     """
#     Modèle étendu pour les informations supplémentaires des utilisateurs
#     """
#     user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    
#     # Informations personnelles
#     phone = models.CharField(max_length=20, blank=True, null=True, verbose_name="Téléphone")
#     bio = models.TextField(blank=True, null=True, verbose_name="Biographie")
#     profile_picture = models.ImageField(
#         upload_to='profiles/', 
#         blank=True, 
#         null=True, 
#         verbose_name="Photo de profil"
#     )
    
#     # Liens sociaux
#     github_url = models.URLField(blank=True, null=True, verbose_name="GitHub")
#     linkedin_url = models.URLField(blank=True, null=True, verbose_name="LinkedIn")
#     portfolio_url = models.URLField(blank=True, null=True, verbose_name="Portfolio")
    
#     # Informations Simplon
#     cohort = models.CharField(max_length=100, blank=True, null=True, verbose_name="Promotion")
#     specialite = models.CharField(max_length=100, blank=True, null=True, verbose_name="Spécialité")
#     date_entree = models.DateField(blank=True, null=True, verbose_name="Date d'entrée")
#     date_sortie = models.DateField(blank=True, null=True, verbose_name="Date de sortie")
    
#     # Paramètres utilisateur
#     email_notifications = models.BooleanField(default=True, verbose_name="Notifications par email")
#     dark_mode = models.BooleanField(default=False, verbose_name="Mode sombre")
    
#     # Métadonnées
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)
    
#     def __str__(self):
#         return f"Profile de {self.user.username}"
    
#     class Meta:
#         verbose_name = "Profil utilisateur"
#         verbose_name_plural = "Profils utilisateurs"
#         ordering = ['-created_at']
    
#     def get_profile_picture_url(self):
#         """Retourne l'URL de la photo de profil si elle existe"""
#         if self.profile_picture:
#             return self.profile_picture.url
#         return None
    
#     def get_full_name(self):
#         """Retourne le nom complet de l'utilisateur"""
#         if self.user.first_name and self.user.last_name:
#             return f"{self.user.first_name} {self.user.last_name}"
#         return self.user.username
    
#     def get_social_links_count(self):
#         """Compte les liens sociaux remplis"""
#         count = 0
#         if self.github_url:
#             count += 1
#         if self.linkedin_url:
#             count += 1
#         if self.portfolio_url:
#             count += 1
#         return count
    
#     def calculate_profile_completion(self):
#         """Calcule le pourcentage de complétion du profil"""
#         total_fields = 12  # Nombre total de champs à remplir
#         completed_fields = 0
        
#         # Champs User
#         if self.user.first_name:
#             completed_fields += 1
#         if self.user.last_name:
#             completed_fields += 1
#         if self.user.email:
#             completed_fields += 1
        
#         # Champs UserProfile
#         if self.phone:
#             completed_fields += 1
#         if self.bio:
#             completed_fields += 1
#         if self.profile_picture:
#             completed_fields += 1
#         if self.github_url or self.linkedin_url or self.portfolio_url:
#             completed_fields += 1
#         if self.cohort:
#             completed_fields += 1
#         if self.specialite:
#             completed_fields += 1
#         if self.date_entree:
#             completed_fields += 1
#         if self.date_sortie:
#             completed_fields += 1
        
#         return round((completed_fields / total_fields) * 100, 1)

# class ProfileUpdateHistory(models.Model):
#     """
#     Historique des modifications de profil
#     """
#     ACTION_CHOICES = [
#         ('CREATE', 'Création'),
#         ('UPDATE', 'Mise à jour'),
#         ('DELETE', 'Suppression'),
#     ]
    
#     user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='profile_history')
#     action = models.CharField(max_length=10, choices=ACTION_CHOICES)
#     field_name = models.CharField(max_length=100)
#     old_value = models.TextField(blank=True, null=True)
#     new_value = models.TextField(blank=True, null=True)
#     ip_address = models.GenericIPAddressField(blank=True, null=True)
#     user_agent = models.TextField(blank=True, null=True)
#     changed_by = models.ForeignKey(
#         User, 
#         on_delete=models.SET_NULL, 
#         null=True, 
#         blank=True, 
#         related_name='made_changes'
#     )
#     changed_at = models.DateTimeField(auto_now_add=True)
    
#     def __str__(self):
#         return f"{self.get_action_display()} sur {self.field_name} - {self.user.username} ({self.changed_at})"
    
#     class Meta:
#         verbose_name = "Historique modification"
#         verbose_name_plural = "Historiques modifications"
#         ordering = ['-changed_at']
    
#     def get_formatted_field_name(self):
#         """Retourne le nom du champ formaté pour l'affichage"""
#         field_map = {
#             'first_name': 'Prénom',
#             'last_name': 'Nom',
#             'email': 'Email',
#             'phone': 'Téléphone',
#             'bio': 'Biographie',
#             'cohort': 'Promotion',
#             'specialite': 'Spécialité',
#             'date_entree': "Date d'entrée",
#             'date_sortie': 'Date de sortie',
#             'github_url': 'GitHub',
#             'linkedin_url': 'LinkedIn',
#             'portfolio_url': 'Portfolio',
#             'profile_picture': 'Photo de profil',
#             'email_notifications': 'Notifications email',
#             'dark_mode': 'Mode sombre',
#         }
        
#         # Enlever le préfixe "profile." si présent
#         field_key = self.field_name.replace('profile.', '')
#         return field_map.get(field_key, self.field_name)
    
#     def get_formatted_value(self, value):
#         """Formate la valeur pour l'affichage"""
#         if value is None or value == '':
#             return '<vide>'
        
#         # Masquer les valeurs sensibles
#         if 'email' in self.field_name.lower():
#             return '••••••@•••••.com'
#         elif 'phone' in self.field_name.lower():
#             return '•• •• •• •• ••'
        
#         return str(value)[:100] + ('...' if len(str(value)) > 100 else '')

# class Notification(models.Model):
#     """
#     Notifications pour les utilisateurs
#     """
#     TYPE_CHOICES = [
#         ('PROFILE_UPDATE', 'Mise à jour profil'),
#         ('PASSWORD_CHANGE', 'Changement mot de passe'),
#         ('SYSTEM', 'Système'),
#         ('INFO', 'Information'),
#         ('WARNING', 'Avertissement'),
#         ('SUCCESS', 'Succès'),
#     ]
    
#     user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
#     type = models.CharField(max_length=20, choices=TYPE_CHOICES)
#     title = models.CharField(max_length=200)
#     message = models.TextField()
#     is_read = models.BooleanField(default=False)
#     created_at = models.DateTimeField(auto_now_add=True)
#     read_at = models.DateTimeField(blank=True, null=True)
    
#     def __str__(self):
#         return f"{self.title} - {self.user.username}"
    
#     class Meta:
#         ordering = ['-created_at']
#         verbose_name = "Notification"
#         verbose_name_plural = "Notifications"
    
#     def get_icon(self):
#         """Retourne l'icône correspondant au type de notification"""
#         icon_map = {
#             'PROFILE_UPDATE': '👤',
#             'PASSWORD_CHANGE': '🔒',
#             'SYSTEM': '⚙️',
#             'INFO': 'ℹ️',
#             'WARNING': '⚠️',
#             'SUCCESS': '✅',
#         }
#         return icon_map.get(self.type, '📌')
    
#     def get_color_class(self):
#         """Retourne la classe CSS pour la couleur"""
#         color_map = {
#             'PROFILE_UPDATE': 'bg-blue-50 border-blue-200 text-blue-800',
#             'PASSWORD_CHANGE': 'bg-red-50 border-red-200 text-red-800',
#             'SYSTEM': 'bg-purple-50 border-purple-200 text-purple-800',
#             'INFO': 'bg-gray-50 border-gray-200 text-gray-800',
#             'WARNING': 'bg-yellow-50 border-yellow-200 text-yellow-800',
#             'SUCCESS': 'bg-green-50 border-green-200 text-green-800',
#         }
#         return color_map.get(self.type, 'bg-gray-50 border-gray-200')
    
#     def mark_as_read(self):
#         """Marque la notification comme lue"""
#         if not self.is_read:
#             self.is_read = True
#             self.read_at = timezone.now()
#             self.save()
#             return True
#         return False

# # ⭐ SIGNALS POUR CRÉER AUTOMATIQUEMENT LES PROFILS

# from django.db.models.signals import post_save
# from django.dispatch import receiver

# @receiver(post_save, sender=User)
# def create_user_profile(sender, instance, created, **kwargs):
#     """
#     Crée automatiquement un UserProfile lorsqu'un User est créé
#     """
#     if created:
#         print(f"🎯 Création automatique du profil pour: {instance.username}")
#         UserProfile.objects.create(user=instance)
        
#         # Créer une notification de bienvenue
#         Notification.objects.create(
#             user=instance,
#             type='SUCCESS',
#             title='🎉 Bienvenue sur la plateforme Simplon !',
#             message=f'Bonjour {instance.username}, votre compte a été créé avec succès. Complétez votre profil pour commencer.',
#             is_read=False
#         )

# @receiver(post_save, sender=UserProfile)
# def log_profile_creation(sender, instance, created, **kwargs):
#     """
#     Loggue la création d'un profil dans l'historique
#     """
#     if created:
#         ProfileUpdateHistory.objects.create(
#             user=instance.user,
#             action='CREATE',
#             field_name='profile',
#             old_value='',
#             new_value='Profil créé',
#             changed_by=instance.user
#         )

# # ⭐ FONCTIONS UTILITAIRES

# def create_profile_update_history(user, field_name, old_value, new_value, request=None):
#     """
#     Fonction utilitaire pour créer une entrée d'historique
#     """
#     ip_address = None
#     user_agent = None
    
#     if request:
#         x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
#         if x_forwarded_for:
#             ip_address = x_forwarded_for.split(',')[0]
#         else:
#             ip_address = request.META.get('REMOTE_ADDR')
#         user_agent = request.META.get('HTTP_USER_AGENT')
    
#     ProfileUpdateHistory.objects.create(
#         user=user,
#         action='UPDATE',
#         field_name=field_name,
#         old_value=str(old_value),
#         new_value=str(new_value),
#         ip_address=ip_address,
#         user_agent=user_agent,
#         changed_by=user
#     )

# def send_notification(user, type, title, message):
#     """
#     Fonction utilitaire pour envoyer une notification
#     """
#     notification = Notification.objects.create(
#         user=user,
#         type=type,
#         title=title,
#         message=message,
#         is_read=False
#     )
    
#     print(f"📢 Notification envoyée à {user.username}: {title}")
#     return notification

# users/models.py - MODÈLES ÉTENDUS
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
import uuid

# class MatriculeAutorise(models.Model):
#     """Matricules autorisés pour l'inscription"""
#     matricule = models.CharField(max_length=20, unique=True)
#     est_actif = models.BooleanField(default=True)
#     date_creation = models.DateTimeField(auto_now_add=True)
#     date_activation = models.DateTimeField(null=True, blank=True)
    
#     def __str__(self):
#         return f"{self.matricule} ({'Actif' if self.est_actif else 'Inactif'})"


# users/models.py - AJOUTEZ CES MÉTHODES À LA CLASSE MatriculeAutorise

class MatriculeAutorise(models.Model):
    matricule = models.CharField(max_length=20, unique=True)
    est_actif = models.BooleanField(default=True)
    date_creation = models.DateTimeField(auto_now_add=True)
    date_activation = models.DateTimeField(null=True, blank=True)
    activation_token = models.CharField(max_length=100, null=True, blank=True)  # AJOUT
    token_expiration = models.DateTimeField(null=True, blank=True)  # AJOUT
    
    def __str__(self):
        return f"{self.matricule} ({'Actif' if self.est_actif else 'Inactif'})"
    
    def is_token_expired(self):
        """Vérifie si le token est expiré"""
        if not self.token_expiration:
            return True
        return timezone.now() > self.token_expiration
    
    def get_remaining_time(self):
        """Retourne le temps restant avant expiration en secondes"""
        if not self.token_expiration:
            return 0
        remaining = self.token_expiration - timezone.now()
        return max(0, int(remaining.total_seconds()))
    
class UserProfile(models.Model):
    """Profil utilisateur étendu"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='userprofile')
    bio = models.TextField(max_length=500, blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    location = models.CharField(max_length=100, blank=True, null=True)
    company = models.CharField(max_length=100, blank=True, null=True)
    position = models.CharField(max_length=100, blank=True, null=True)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    website = models.URLField(blank=True, null=True)
    github = models.CharField(max_length=100, blank=True, null=True)
    linkedin = models.CharField(max_length=100, blank=True, null=True)
    twitter = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Profil de {self.user.username}"
    
    class Meta:
        verbose_name = "Profil utilisateur"
        verbose_name_plural = "Profils utilisateurs"

class ProfileUpdateHistory(models.Model):
    """Historique des modifications de profil"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='update_history')
    updated_at = models.DateTimeField(auto_now_add=True)
    changes = models.JSONField()  # Stocke les modifications
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return f"{self.user.username} - {self.updated_at.strftime('%Y-%m-%d %H:%M')}"
    
    class Meta:
        verbose_name = "Historique modification"
        verbose_name_plural = "Historiques modifications"
        ordering = ['-updated_at']

class Notification(models.Model):
    """Notifications utilisateur"""
    NOTIFICATION_TYPES = [
        ('profile_update', 'Mise à jour profil'),
        ('project_update', 'Mise à jour projet'),
        ('system', 'Système'),
        ('message', 'Message'),
        ('alert', 'Alerte'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    message = models.TextField()
    notification_type = models.CharField(max_length=20, choices=NOTIFICATION_TYPES, default='system')
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    metadata = models.JSONField(null=True, blank=True)  # Données supplémentaires
    
    def __str__(self):
        return f"{self.user.username} - {self.message[:50]}..."
    
    class Meta:
        verbose_name = "Notification"
        verbose_name_plural = "Notifications"
        ordering = ['-created_at']
    
    def mark_as_read(self):
        self.is_read = True
        self.save()
    
    @classmethod
    def create_notification(cls, user, message, notification_type='system', metadata=None):
        return cls.objects.create(
            user=user,
            message=message,
            notification_type=notification_type,
            metadata=metadata or {}
        )


