# from django.contrib import admin
# from .models import MatriculeAutorise

# @admin.register(MatriculeAutorise)
# class MatriculeAutoriseAdmin(admin.ModelAdmin):
#     list_display = ['matricule', 'date_creation', 'est_actif', 'date_activation']
#     list_filter = ['est_actif', 'date_creation']
#     search_fields = ['matricule']
#     readonly_fields = ['date_creation', 'date_activation']
    
#     fieldsets = (
#         ('Informations Matricule', {
#             'fields': ('matricule', 'est_actif')
#         }),
#         ('Dates', {
#             'fields': ('date_creation', 'date_activation'),
#             'classes': ('collapse',)
#         }),
#     )

# users/admin.py - VERSION CORRIGÉE

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User
from .models import (
    MatriculeAutorise, 
    UserProfile, 
    ProfileUpdateHistory, 
    Notification
)

# ============ ADMIN INLINE POUR PROFIL UTILISATEUR ============
class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False
    verbose_name_plural = 'Profils utilisateurs'
    fk_name = 'user'
    fields = [
        'bio', 'phone', 'location', 'company', 'position',
        'avatar', 'website', 'github', 'linkedin', 'twitter'
    ]

# ============ USER ADMIN PERSONNALISÉ ============
class CustomUserAdmin(UserAdmin):
    inlines = (UserProfileInline,)
    
    def get_inline_instances(self, request, obj=None):
        if not obj:
            return list()
        return super().get_inline_instances(request, obj)

# ============ ADMIN POUR MATRICULE AUTORISÉ ============
@admin.register(MatriculeAutorise)
class MatriculeAutoriseAdmin(admin.ModelAdmin):
    list_display = [
        'matricule', 
        'est_actif', 
        'date_creation', 
        'date_activation',
        'activation_token'
    ]
    list_filter = ['est_actif', 'date_creation']
    search_fields = ['matricule']
    readonly_fields = ['date_creation', 'date_activation', 'activation_token']
    ordering = ['-date_creation']

# ============ ADMIN POUR PROFIL UTILISATEUR ============
@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = [
        'user', 
        'company', 
        'position', 
        'location',
        'updated_at'
    ]
    list_filter = ['company', 'position', 'location']
    search_fields = [
        'user__username', 
        'user__email', 
        'company', 
        'position'
    ]
    readonly_fields = ['created_at', 'updated_at']
    ordering = ['-updated_at']
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user')

# ============ ADMIN POUR HISTORIQUE DES MODIFICATIONS ============
@admin.register(ProfileUpdateHistory)
class ProfileUpdateHistoryAdmin(admin.ModelAdmin):
    list_display = [
        'user', 
        'updated_at', 
        'ip_address',
        'changes_summary'
    ]
    list_filter = ['updated_at', 'user']
    search_fields = ['user__username', 'ip_address', 'user_agent']
    readonly_fields = ['user', 'updated_at', 'changes', 'ip_address', 'user_agent']
    ordering = ['-updated_at']
    
    def changes_summary(self, obj):
        """Affiche un résumé des changements"""
        if obj.changes:
            changes = obj.changes
            if isinstance(changes, dict):
                return f"{len(changes)} champ(s) modifié(s)"
        return "Aucun changement"
    changes_summary.short_description = "Résumé des changements"
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user')

# ============ ADMIN POUR NOTIFICATIONS ============
@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = [
        'user', 
        'message_preview', 
        'notification_type',
        'is_read', 
        'created_at'
    ]
    list_filter = ['notification_type', 'is_read', 'created_at']
    search_fields = ['user__username', 'message']
    readonly_fields = ['user', 'created_at', 'metadata']
    ordering = ['-created_at']
    
    def message_preview(self, obj):
        """Affiche un aperçu du message"""
        return obj.message[:50] + "..." if len(obj.message) > 50 else obj.message
    message_preview.short_description = "Message"
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user')

# ============ ENREGISTREMENT DES ADMINS ============
# Désenregistrer l'admin User par défaut
admin.site.unregister(User)

# Réenregistrer avec notre admin personnalisé
admin.site.register(User, CustomUserAdmin)

# ============ CONFIGURATION DU SITE ADMIN ============
admin.site.site_header = "Administration Simplon Backend"
admin.site.site_title = "Plateforme Simplon"
admin.site.index_title = "Gestion de la plateforme"