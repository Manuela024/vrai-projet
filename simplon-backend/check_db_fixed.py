# check_db_fixed.py
import os
import sys
import django

# Chemin absolu de votre projet
project_path = r'C:\Users\PC MARKET\Desktop\les traveaux\PROJET STAGE\simplon-backend'
sys.path.append(project_path)

# Utilisez le bon nom de projet
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'simplon_api.settings')

try:
    django.setup()
    
    from django.db import connection
    print("=== VÉRIFICATION BASE DE DONNÉES ===")
    
    # Test de connexion
    try:
        connection.ensure_connection()
        print("✅ Connexion base de données réussie")
        print(f"📊 Base: {connection.settings_dict['NAME']}")
        print(f"🏠 Host: {connection.settings_dict.get('HOST', 'localhost')}")
        print(f"🔑 Utilisateur: {connection.settings_dict.get('USER', 'inconnu')}")
    except Exception as e:
        print(f"❌ Erreur de connexion: {e}")
    
    # Test des modèles
    print(f"\n=== NOMBRE D'ENREGISTREMENTS ===")
    
    # Utilisateurs
    try:
        from django.contrib.auth.models import User
        user_count = User.objects.count()
        print(f"👤 Utilisateurs: {user_count}")
    except Exception as e:
        print(f"❌ Erreur User: {e}")
    
    # Projets
    try:
        from projects.models import Project
        project_count = Project.objects.count()
        print(f"📁 Projets: {project_count}")
        
        if project_count > 0:
            print(f"\n=== 3 DERNIERS PROJETS ===")
            projects = Project.objects.order_by('-id')[:3]
            for p in projects:
                print(f"📄 {p.id}: {p.title}")
                print(f"   Technologies: {p.technologies}")
                print(f"   Statut: {p.status}")
                print(f"   Créé le: {p.created_at}")
                print()
    except Exception as e:
        print(f"❌ Erreur Projects: {e}")
    
    # Tables disponibles
    print(f"=== TABLES DISPONIBLES ===")
    try:
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public'
                ORDER BY table_name
            """)
            tables = cursor.fetchall()
            for table in tables:
                print(f"📊 {table[0]}")
    except Exception as e:
        print(f"❌ Erreur tables: {e}")
        # Peut-être SQLite?
        try:
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
            tables = cursor.fetchall()
            for table in tables:
                print(f"📊 {table[0]}")
        except:
            pass
            
except Exception as e:
    print(f"❌ Erreur générale: {e}")
    import traceback
    traceback.print_exc()