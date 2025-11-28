import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'simplon_api.settings')
django.setup()

from django.db import connection

print("🔍 TEST DE POSTGRESQL COMME BASE PAR DÉFAUT...")

try:
    with connection.cursor() as cursor:
        cursor.execute("SELECT COUNT(*) FROM auth_user")
        user_count = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM projects_project")
        project_count = cursor.fetchone()[0]
        
        cursor.execute("SELECT version()")
        version = cursor.fetchone()[0]
    
    print("✅ POSTGRESQL EST MAINTENANT LA BASE PAR DÉFAUT !")
    print(f"📊 Utilisateurs: {user_count}")
    print(f"📊 Projets: {project_count}")
    print(f"📊 Version: {version.split(',')[0]}")
    
    print("\n🎉 FÉLICITATIONS ! VOTRE APPLICATION UTILISE MAINTENANT POSTGRESQL !")
    
except Exception as e:
    print(f"❌ ERREUR: {e}")