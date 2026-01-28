# projects/management/commands/checkdb.py
from django.core.management.base import BaseCommand
from django.db import connection
from django.contrib.auth.models import User
from projects.models import Project

class Command(BaseCommand):
    help = 'Vérifie l\'état de la base de données'

    def handle(self, *args, **options):
        self.stdout.write("=== VÉRIFICATION BASE DE DONNÉES ===")
        
        # Test de connexion
        try:
            connection.ensure_connection()
            self.stdout.write(
                self.style.SUCCESS('✅ Connexion base de données réussie')
            )
            db_info = connection.settings_dict
            self.stdout.write(f"📊 Base: {db_info['NAME']}")
            self.stdout.write(f"🔧 Moteur: {db_info['ENGINE']}")
            self.stdout.write(f"🏠 Host: {db_info.get('HOST', 'localhost')}")
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'❌ Erreur de connexion: {e}')
            )
            return
        
        # Compter les enregistrements
        self.stdout.write(f"\n=== NOMBRE D'ENREGISTREMENTS ===")
        self.stdout.write(f"👤 Utilisateurs: {User.objects.count()}")
        self.stdout.write(f"📁 Projets: {Project.objects.count()}")
        
        # Derniers projets
        projects = Project.objects.order_by('-id')[:5]
        if projects:
            self.stdout.write(f"\n=== 5 DERNIERS PROJETS ===")
            for p in projects:
                self.stdout.write(f"📄 {p.id}: {p.title}")
                self.stdout.write(f"   Auteur: {p.author}")
                self.stdout.write(f"   Statut: {p.status}")
                self.stdout.write(f"   Créé le: {p.created_at}")
                self.stdout.write("")
        
        # Tables disponibles
        self.stdout.write(f"=== TABLES DISPONIBLES ===")
        with connection.cursor() as cursor:
            if 'postgresql' in db_info['ENGINE']:
                cursor.execute("""
                    SELECT table_name 
                    FROM information_schema.tables 
                    WHERE table_schema = 'public'
                    ORDER BY table_name
                """)
            else:  # SQLite
                cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
            
            for table in cursor.fetchall():
                self.stdout.write(f"📊 {table[0]}")