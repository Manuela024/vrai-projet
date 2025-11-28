from django.contrib import admin
from .models import MatriculeAutorise

@admin.register(MatriculeAutorise)
class MatriculeAutoriseAdmin(admin.ModelAdmin):
    list_display = ['matricule', 'date_creation', 'est_actif', 'date_activation']
    list_filter = ['est_actif', 'date_creation']
    search_fields = ['matricule']
    readonly_fields = ['date_creation', 'date_activation']
    
    fieldsets = (
        ('Informations Matricule', {
            'fields': ('matricule', 'est_actif')
        }),
        ('Dates', {
            'fields': ('date_creation', 'date_activation'),
            'classes': ('collapse',)
        }),
    )