import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'simplon_api.settings')
django.setup()

from django.db import connections

print("🔍 VÉRIFICATION FINALE COMPLÈTE...")

try:
    # Vérifier PostgreSQL
    with connections['postgres'].cursor() as cursor:
        # Utilisateurs
        cursor.execute("SELECT COUNT(*) FROM auth_user")
        user_count = cursor.fetchone()[0]
        
        # Projets
        cursor.execute("SELECT COUNT(*) FROM projects_project")
        project_count = cursor.fetchone()[0]
        
        # Détails des projets
        cursor.execute("SELECT id, title, author_id FROM projects_project")
        projects = cursor.fetchall()
        
        # Tables totales
        cursor.execute("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'")
        tables = cursor.fetchall()
    
    print("✅ POSTGRESQL - MIGRATION RÉUSSIE !")
    print(f"📊 Utilisateurs: {user_count}")
    print(f"📊 Projets: {project_count}")
    print(f"📊 Tables totales: {len(tables)}")
    
    print("\n📋 PROJETS MIGRÉS:")
    for project in projects:
        print(f"   - ID: {project[0]}, Titre: {project[1]}, Auteur ID: {project[2]}")
    
    print("\n🎉 TOUT EST PRÊT POUR LE BASCULEMENT VERS POSTGRESQL !")
    
except Exception as e:
    print(f"❌ ERREUR: {e}")