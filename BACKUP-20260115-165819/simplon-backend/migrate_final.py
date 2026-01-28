import os
import django
import sys

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'simplon_api.settings')
django.setup()

from django.db import connections

def migrate_data():
    print("🚀 DÉBUT DE LA MIGRATION DES DONNÉES...")
    
    try:
        # Compter les données dans SQLite
        with connections['default'].cursor() as cursor:
            cursor.execute("SELECT COUNT(*) FROM auth_user")
            user_count_sqlite = cursor.fetchone()[0]
            
            cursor.execute("SELECT COUNT(*) FROM projects_project")
            project_count_sqlite = cursor.fetchone()[0]
        
        print(f"📊 SQLite - Utilisateurs: {user_count_sqlite}, Projets: {project_count_sqlite}")
        
        # Compter les données dans PostgreSQL
        with connections['postgres'].cursor() as cursor:
            cursor.execute("SELECT COUNT(*) FROM auth_user")
            user_count_pg = cursor.fetchone()[0]
            
            cursor.execute("SELECT COUNT(*) FROM projects_project")
            project_count_pg = cursor.fetchone()[0]
        
        print(f"📊 PostgreSQL - Utilisateurs: {user_count_pg}, Projets: {project_count_pg}")
        
        # Migrer seulement si PostgreSQL est vide
        if user_count_pg == 0:
            print("🔄 Migration des utilisateurs...")
            
            with connections['default'].cursor() as source_cursor:
                source_cursor.execute("SELECT * FROM auth_user")
                users = source_cursor.fetchall()
                
                with connections['postgres'].cursor() as target_cursor:
                    for user in users:
                        target_cursor.execute("""
                            INSERT INTO auth_user (id, password, last_login, is_superuser, username, 
                            first_name, last_name, email, is_staff, is_active, date_joined)
                            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                        """, user)
            
            print(f"✅ {len(users)} utilisateurs migrés")
        
        if project_count_pg == 0:
            print("🔄 Migration des projets...")
            
            with connections['default'].cursor() as source_cursor:
                source_cursor.execute("SELECT * FROM projects_project")
                projects = source_cursor.fetchall()
                
                with connections['postgres'].cursor() as target_cursor:
                    for project in projects:
                        target_cursor.execute("""
                            INSERT INTO projects_project (id, title, description, technology, 
                            image_url, project_url, author_id, created_at, updated_at)
                            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                        """, project)
            
            print(f"✅ {len(projects)} projets migrés")
            
        print("🎯 MIGRATION TERMINÉE AVEC SUCCÈS!")
            
    except Exception as e:
        print(f"❌ ERREUR: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    migrate_data()