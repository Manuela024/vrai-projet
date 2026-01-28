# # projects/models.py
# from django.db import models
# from django.contrib.auth.models import User  # IMPORTANT: import User

# class Project(models.Model):
#     STATUS_CHOICES = [
#         ('draft', 'Brouillon'),
#         ('published', 'Publié'),
#         ('archivé', 'Archivé'),
#     ]
    
#     title = models.CharField(max_length=200, verbose_name="Titre")
#     description = models.TextField(verbose_name="Description")
#     technologies = models.CharField(max_length=300, verbose_name="Technologies utilisées")
#     github_url = models.URLField(blank=True, verbose_name="Lien GitHub")
#     demo_url = models.URLField(blank=True, verbose_name="Lien de démo")
#     image = models.ImageField(upload_to='projects/', blank=True, null=True, verbose_name="Image du projet")
#     author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='projects', verbose_name="Auteur")
#     status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft', verbose_name="Statut")
    
#     # NOUVEAUX CHAMPS - ajoutez-les ici
#     cohort = models.CharField(max_length=100, blank=True, verbose_name="Cohorte")
#     tags = models.TextField(blank=True, verbose_name="Tags")
    
#     created_at = models.DateTimeField(auto_now_add=True, verbose_name="Créé le")
#     updated_at = models.DateTimeField(auto_now=True, verbose_name="Mis à jour le")
    
#     def __str__(self):
#         return self.title
    
#     class Meta:
#         ordering = ['-created_at']
#         verbose_name = "Projet"
#         verbose_name_plural = "Projets"


# # projects/models.py
# from django.db import models
# from django.contrib.auth.models import User

# class Project(models.Model):
#     STATUS_CHOICES = [
#         ('draft', 'Brouillon'),
#         ('pending', 'En attente'),
#         ('approved', 'Approuvé'),
#         ('rejected', 'Rejeté'),
#         ('published', 'Publié'),
#         ('archivé', 'Archivé'),
#     ]
    
#     title = models.CharField(max_length=200, verbose_name="Titre")
#     description = models.TextField(verbose_name="Description")
#     technologies = models.CharField(max_length=300, verbose_name="Technologies utilisées")
#     github_url = models.URLField(blank=True, verbose_name="Lien GitHub")
#     demo_url = models.URLField(blank=True, verbose_name="Lien de démo")
#     image = models.ImageField(upload_to='projects/', blank=True, null=True, verbose_name="Image du projet")
#     author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='projects', verbose_name="Auteur")
#     status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft', verbose_name="Statut")
    
#     # Champs existants dans la BD
#     cohort = models.CharField(max_length=100, blank=True, verbose_name="Cohorte")
#     tags = models.TextField(blank=True, verbose_name="Tags")
    
#     created_at = models.DateTimeField(auto_now_add=True, verbose_name="Créé le")
#     updated_at = models.DateTimeField(auto_now=True, verbose_name="Mis à jour le")
    
#     # NOUVEAUX CHAMPS POUR FACILITER LE FRONTEND
#     author_name = models.CharField(max_length=255, blank=True, verbose_name="Nom de l'auteur")
#     author_email = models.EmailField(blank=True, verbose_name="Email de l'auteur")
    
#     def __str__(self):
#         return f"{self.title} - {self.author.username if self.author else 'Sans auteur'}"
    
#     def save(self, *args, **kwargs):
#         """Mettre à jour automatiquement les infos auteur"""
#         if self.author:
#             self.author_name = f"{self.author.first_name or ''} {self.author.last_name or ''}".strip()
#             self.author_email = self.author.email or ''
#         super().save(*args, **kwargs)
    
#     class Meta:
#         ordering = ['-created_at']
#         verbose_name = "Projet"
#         verbose_name_plural = "Projets"
#         indexes = [
#             models.Index(fields=['author']),
#             models.Index(fields=['status']),
#             models.Index(fields=['cohort']),
#             models.Index(fields=['created_at']),
#         ]

# projects/models.py - VERSION COMPLÈTE AVEC CHAMPS AUTEUR
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class Project(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Brouillon'),
        ('pending', 'En attente'),
        ('approved', 'Approuvé'),
        ('rejected', 'Rejeté'),
        ('published', 'Publié'),
        ('archivé', 'Archivé'),
    ]
    
    # Informations de base
    title = models.CharField(max_length=200, verbose_name="Titre")
    description = models.TextField(verbose_name="Description")
    technologies = models.CharField(max_length=300, verbose_name="Technologies utilisées")
    github_url = models.URLField(blank=True, verbose_name="Lien GitHub")
    demo_url = models.URLField(blank=True, verbose_name="Lien de démo")
    image = models.ImageField(upload_to='projects/', blank=True, null=True, verbose_name="Image du projet")
    
    # Auteur - relation ForeignKey (conserve l'ID)
    author = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='projects', 
        verbose_name="Auteur (ID)"
    )
    
    # INFORMATIONS AUTEUR DIRECTEMENT DANS LA TABLE (Nouveaux champs)
    author_name = models.CharField(
        max_length=255, 
        blank=True, 
        verbose_name="Nom complet de l'auteur",
        help_text="Rempli automatiquement depuis l'utilisateur"
    )
    
    author_email = models.EmailField(
        blank=True, 
        verbose_name="Email de l'auteur",
        help_text="Rempli automatiquement depuis l'utilisateur"
    )
    
    author_username = models.CharField(
        max_length=150, 
        blank=True, 
        verbose_name="Nom d'utilisateur",
        help_text="Rempli automatiquement depuis l'utilisateur"
    )
    
    # Statut et métadonnées
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
    
    # Dates
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
            models.Index(fields=['cohort']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        return f"{self.title} - {self.author_name or self.author.username}"
    
    def save(self, *args, **kwargs):
        """Met à jour automatiquement les informations d'auteur"""
        # Si l'auteur est défini, remplir les champs dénormalisés
        if self.author:
            # Récupérer les infos de l'utilisateur
            user = self.author
            
            # Nom complet
            full_name = f"{user.first_name or ''} {user.last_name or ''}".strip()
            self.author_name = full_name if full_name else user.username
            
            # Email
            self.author_email = user.email or ''
            
            # Username
            self.author_username = user.username
        
        # Sauvegarder
        super().save(*args, **kwargs)
    
    def update_author_info(self):
        """Met à jour manuellement les infos auteur (pour migration)"""
        if self.author:
            user = self.author
            full_name = f"{user.first_name or ''} {user.last_name or ''}".strip()
            self.author_name = full_name if full_name else user.username
            self.author_email = user.email or ''
            self.author_username = user.username
            self.save(update_fields=['author_name', 'author_email', 'author_username'])
    
    @property
    def author_display_name(self):
        """Retourne le nom d'affichage de l'auteur"""
        return self.author_name or self.author_username or f"Utilisateur #{self.author_id}"