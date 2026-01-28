
# # projects/models.py - VERSION COMPLÈTE AVEC CHAMPS AUTEUR
# from django.db import models
# from django.contrib.auth.models import User
# from django.utils import timezone

# class Project(models.Model):
#     STATUS_CHOICES = [
#         ('draft', 'Brouillon'),
#         ('pending', 'En attente'),
#         ('approved', 'Approuvé'),
#         ('rejected', 'Rejeté'),
#         ('published', 'Publié'),
#         ('archivé', 'Archivé'),
#     ]
    
#     # Informations de base
#     title = models.CharField(max_length=200, verbose_name="Titre")
#     description = models.TextField(verbose_name="Description")
#     technologies = models.CharField(max_length=300, verbose_name="Technologies utilisées")
#     github_url = models.URLField(blank=True, verbose_name="Lien GitHub")
#     demo_url = models.URLField(blank=True, verbose_name="Lien de démo")
#     image = models.ImageField(upload_to='projects/', blank=True, null=True, verbose_name="Image du projet")
    
#     # Auteur - relation ForeignKey (conserve l'ID)
#     author = models.ForeignKey(
#         User, 
#         on_delete=models.CASCADE, 
#         related_name='projects', 
#         verbose_name="Auteur (ID)"
#     )
    
#     # INFORMATIONS AUTEUR DIRECTEMENT DANS LA TABLE (Nouveaux champs)
#     author_name = models.CharField(
#         max_length=255, 
#         blank=True, 
#         verbose_name="Nom complet de l'auteur",
#         help_text="Rempli automatiquement depuis l'utilisateur"
#     )
    
#     author_email = models.EmailField(
#         blank=True, 
#         verbose_name="Email de l'auteur",
#         help_text="Rempli automatiquement depuis l'utilisateur"
#     )
    
#     author_username = models.CharField(
#         max_length=150, 
#         blank=True, 
#         verbose_name="Nom d'utilisateur",
#         help_text="Rempli automatiquement depuis l'utilisateur"
#     )
    
#     # Statut et métadonnées
#     status = models.CharField(
#         max_length=20, 
#         choices=STATUS_CHOICES, 
#         default='draft', 
#         verbose_name="Statut"
#     )
    
#     cohort = models.CharField(
#         max_length=100, 
#         blank=True, 
#         verbose_name="Cohorte"
#     )
    
#     tags = models.TextField(
#         blank=True, 
#         verbose_name="Tags"
#     )
    
#     # Dates
#     created_at = models.DateTimeField(
#         auto_now_add=True, 
#         verbose_name="Créé le"
#     )
    
#     updated_at = models.DateTimeField(
#         auto_now=True, 
#         verbose_name="Mis à jour le"
#     )
    
#     class Meta:
#         ordering = ['-created_at']
#         verbose_name = "Projet"
#         verbose_name_plural = "Projets"
#         indexes = [
#             models.Index(fields=['author']),
#             models.Index(fields=['author_name']),
#             models.Index(fields=['status']),
#             models.Index(fields=['cohort']),
#             models.Index(fields=['created_at']),
#         ]
    
#     def __str__(self):
#         return f"{self.title} - {self.author_name or self.author.username}"
    
#     def save(self, *args, **kwargs):
#         """Met à jour automatiquement les informations d'auteur"""
#         # Si l'auteur est défini, remplir les champs dénormalisés
#         if self.author:
#             # Récupérer les infos de l'utilisateur
#             user = self.author
            
#             # Nom complet
#             full_name = f"{user.first_name or ''} {user.last_name or ''}".strip()
#             self.author_name = full_name if full_name else user.username
            
#             # Email
#             self.author_email = user.email or ''
            
#             # Username
#             self.author_username = user.username
        
#         # Sauvegarder
#         super().save(*args, **kwargs)
    
#     def update_author_info(self):
#         """Met à jour manuellement les infos auteur (pour migration)"""
#         if self.author:
#             user = self.author
#             full_name = f"{user.first_name or ''} {user.last_name or ''}".strip()
#             self.author_name = full_name if full_name else user.username
#             self.author_email = user.email or ''
#             self.author_username = user.username
#             self.save(update_fields=['author_name', 'author_email', 'author_username'])
    
#     @property
#     def author_display_name(self):
#         """Retourne le nom d'affichage de l'auteur"""
#         return self.author_name or self.author_username or f"Utilisateur #{self.author_id}"


# # projects/models.py - CORRECTION DE LA MÉTHODE save()
# from django.db import models
# from django.contrib.auth.models import User
# from django.utils import timezone

# class Project(models.Model):
#     STATUS_CHOICES = [
#         ('draft', 'Brouillon'),
#         ('pending', 'En attente'),
#         ('approved', 'Approuvé'),
#         ('rejected', 'Rejeté'),
#         ('published', 'Publié'),
#         ('archivé', 'Archivé'),
#     ]
    
#     # Informations de base
#     title = models.CharField(max_length=200, verbose_name="Titre")
#     description = models.TextField(verbose_name="Description")
#     technologies = models.CharField(max_length=300, verbose_name="Technologies utilisées")
#     github_url = models.URLField(blank=True, verbose_name="Lien GitHub")
#     demo_url = models.URLField(blank=True, verbose_name="Lien de démo")
#     image = models.ImageField(upload_to='projects/', blank=True, null=True, verbose_name="Image du projet")
    
#     # Auteur - relation ForeignKey OBLIGATOIRE
#     author = models.ForeignKey(
#         User, 
#         on_delete=models.CASCADE, 
#         related_name='projects', 
#         verbose_name="Auteur (ID)"
#         # PAS de null=True, blank=True - l'auteur est OBLIGATOIRE
#     )
    
#     # INFORMATIONS AUTEUR DANS LA TABLE
#     author_name = models.CharField(
#         max_length=255, 
#         blank=True, 
#         verbose_name="Nom complet de l'auteur",
#         help_text="Rempli automatiquement depuis l'utilisateur"
#     )
    
#     author_email = models.EmailField(
#         blank=True, 
#         verbose_name="Email de l'auteur",
#         help_text="Rempli automatiquement depuis l'utilisateur"
#     )
    
#     author_username = models.CharField(
#         max_length=150, 
#         blank=True, 
#         verbose_name="Nom d'utilisateur",
#         help_text="Rempli automatiquement depuis l'utilisateur"
#     )
    
#     # Statut et métadonnées
#     status = models.CharField(
#         max_length=20, 
#         choices=STATUS_CHOICES, 
#         default='draft', 
#         verbose_name="Statut"
#     )
    
#     cohort = models.CharField(
#         max_length=100, 
#         blank=True, 
#         verbose_name="Cohorte"
#     )
    
#     tags = models.TextField(
#         blank=True, 
#         verbose_name="Tags"
#     )
    
#     # Dates
#     created_at = models.DateTimeField(
#         auto_now_add=True, 
#         verbose_name="Créé le"
#     )
    
#     updated_at = models.DateTimeField(
#         auto_now=True, 
#         verbose_name="Mis à jour le"
#     )
    
#     class Meta:
#         ordering = ['-created_at']
#         verbose_name = "Projet"
#         verbose_name_plural = "Projets"
    
#     def __str__(self):
#         return f"{self.title} - {self.author_name or self.author.username}"
    
#     def save(self, *args, **kwargs):
#         """Met à jour automatiquement les informations d'auteur"""
#         # VÉRIFIER D'ABORD SI L'AUTEUR EXISTE
#         if hasattr(self, 'author') and self.author is not None:
#             # Récupérer les infos de l'utilisateur
#             user = self.author
            
#             # Nom complet
#             full_name = f"{user.first_name or ''} {user.last_name or ''}".strip()
#             self.author_name = full_name if full_name else user.username
            
#             # Email
#             self.author_email = user.email or ''
            
#             # Username
#             self.author_username = user.username
        
#         # Sauvegarder
#         super().save(*args, **kwargs)
    
#     @property
#     def author_display_name(self):
#         """Retourne le nom d'affichage de l'auteur"""
#         return self.author_name or self.author_username or f"Utilisateur #{self.author_id}"


# projects/models.py - AJOUTEZ CES MODIFICATIONS
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
import os

# ============================================================================
# FONCTIONS POUR LES CHEMINS D'UPLOAD (NOUVELLES)
# ============================================================================
def project_zip_upload_path(instance, filename):
    """Génère le chemin d'upload pour les fichiers ZIP"""
    # Sécuriser le nom du fichier
    safe_title = "".join(c for c in instance.title if c.isalnum() or c in (' ', '-', '_')).strip()
    safe_title = safe_title.replace(' ', '_').lower()[:50]
    
    # Garder l'extension originale
    ext = os.path.splitext(filename)[1] or '.zip'
    
    if instance.id:
        return f"projects/{instance.author_id}/{instance.id}/source{safe_title}{ext}"
    else:
        return f"projects/{instance.author_id}/temp/source{safe_title}{ext}"

def project_image_upload_path(instance, filename):
    """Génère le chemin d'upload pour les images (EXISTANT - MODIFIÉ)"""
    # Sécuriser le nom du fichier
    safe_title = "".join(c for c in instance.title if c.isalnum() or c in (' ', '-', '_')).strip()
    safe_title = safe_title.replace(' ', '_').lower()[:50]
    
    # Garder l'extension originale
    ext = os.path.splitext(filename)[1] or '.jpg'
    
    if instance.id:
        return f"projects/{instance.author_id}/{instance.id}/image{safe_title}{ext}"
    else:
        return f"projects/{instance.author_id}/temp/image{safe_title}{ext}"

class Project(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Brouillon'),
        ('pending', 'En attente'),
        ('approved', 'Approuvé'),
        ('rejected', 'Rejeté'),
        ('published', 'Publié'),
        ('archivé', 'Archivé'),
    ]
    
    CATEGORY_CHOICES = [
        ('web', 'Web'),
        ('mobile', 'Mobile'),
        ('desktop', 'Desktop'),
        ('data', 'Data Science'),
        ('ai', 'IA/ML'),
        ('game', 'Jeux'),
        ('other', 'Autre'),
    ]

    # ==============================
    # INFORMATIONS DE BASE (EXISTANT)
    # ==============================
    title = models.CharField(max_length=200, verbose_name="Titre")
    description = models.TextField(verbose_name="Description")
    technologies = models.CharField(max_length=300, verbose_name="Technologies utilisées")
    github_url = models.URLField(blank=True, verbose_name="Lien GitHub")
    demo_url = models.URLField(blank=True, verbose_name="Lien de démo")
    
    # ==============================
    # CHAMP ZIP FILE (NOUVEAU - MinIO)
    # ==============================
    zip_file = models.FileField(
        upload_to=project_zip_upload_path,
        verbose_name="Fichier ZIP du projet",
        blank=True,
        null=True,
        max_length=500,
        help_text="Archive ZIP contenant le code source du projet (max 500MB)"
    )
    
    # ==============================
    # IMAGE (EXISTANT - MODIFIÉ POUR MinIO)
    # ==============================
    image = models.ImageField(
        upload_to=project_image_upload_path,
        verbose_name="Image du projet",
        blank=True,
        null=True,
        max_length=500,
        help_text="Image de présentation du projet"
    )
    
    # ==============================
    # CATÉGORIE (NOUVEAU)
    # ==============================
    category = models.CharField(
        max_length=50,
        choices=CATEGORY_CHOICES,
        default='web',
        verbose_name="Catégorie"
    )

    # ==============================
    # AUTEUR (EXISTANT)
    # ==============================
    author = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='projects',
        verbose_name="Auteur (ID)"
    )

    author_name = models.CharField(
        max_length=255,
        blank=True,
        verbose_name="Nom complet de l'auteur"
    )

    author_email = models.EmailField(
        blank=True,
        verbose_name="Email de l'auteur"
    )

    author_username = models.CharField(
        max_length=150,
        blank=True,
        verbose_name="Nom d'utilisateur"
    )

    # ==============================
    # STATUT ET MÉTADONNÉES (EXISTANT)
    # ==============================
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='draft',
        verbose_name="Statut"
    )

    cohort = models.CharField(
        max_length=100,
        blank=True,
        verbose_name="Cohorte"
    )
    
    tags = models.TextField(
        blank=True,
        verbose_name="Tags"
    )
    
    # ==============================
    # STATISTIQUES (NOUVEAUX CHAMPS)
    # ==============================
    views = models.IntegerField(
        default=0,
        verbose_name="Nombre de vues"
    )
    
    downloads = models.IntegerField(
        default=0,
        verbose_name="Nombre de téléchargements"
    )
    
    likes = models.IntegerField(
        default=0,
        verbose_name="Nombre de likes"
    )

    # ==============================
    # DATES (EXISTANT)
    # ==============================
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Créé le"
    )
    
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name="Mis à jour le"
    )

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Projet"
        verbose_name_plural = "Projets"
        indexes = [
            models.Index(fields=['author']),
            models.Index(fields=['author_name']),
            models.Index(fields=['status']),
            models.Index(fields=['category']),
            models.Index(fields=['cohort']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self):
        return f"{self.title} - {self.author_name or self.author.username}"

    def save(self, *args, **kwargs):
        """Met à jour automatiquement les informations d'auteur"""
        if hasattr(self, 'author') and self.author is not None:
            user = self.author
            full_name = f"{user.first_name or ''} {user.last_name or ''}".strip()
            self.author_name = full_name if full_name else user.username
            self.author_email = user.email or ''
            self.author_username = user.username

        super().save(*args, **kwargs)

    # ==============================
    # MÉTHODES UTILITAIRES (NOUVELLES)
    # ==============================
    @property
    def author_display_name(self):
        return self.author_name or self.author_username or f"Utilisateur #{self.author_id}"
    
    def get_zip_file_url(self):
        """Retourne l'URL du fichier ZIP"""
        if self.zip_file:
            return self.zip_file.url
        return None
    
    def get_image_url(self):
        """Retourne l'URL de l'image"""
        if self.image:
            return self.image.url
        return None
    
    def increment_views(self):
        """Incrémente le compteur de vues"""
        self.views += 1
        self.save(update_fields=['views'])
    
    def increment_downloads(self):
        """Incrémente le compteur de téléchargements"""
        self.downloads += 1
        self.save(update_fields=['downloads'])
    
    def is_zip_available(self):
        """Vérifie si un fichier ZIP est disponible"""
        return bool(self.zip_file)