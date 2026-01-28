import os
import django
import sys

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'simplon_api.settings')
django.setup()

from django.db import connections

def migrate_correct():
    print("🚀 MIGRATION AVEC LA BONNE STRUCTURE...")
    
    try:
        # Compter les données
        with connections['default'].cursor() as cursor:
            cursor.execute("SELECT COUNT(*) FROM auth_user")
            user_count_sqlite = cursor.fetchone()[0]
            
            cursor.execute("SELECT COUNT(*) FROM projects_project")
            project_count_sqlite = cursor.fetchone()[0]
        
        print(f"📊 SQLite - Utilisateurs: {user_count_sqlite}, Projets: {project_count_sqlite}")
        
        with connections['postgres'].cursor() as cursor:
            cursor.execute("SELECT COUNT(*) FROM auth_user")
            user_count_pg = cursor.fetchone()[0]
            
            cursor.execute("SELECT COUNT(*) FROM projects_project")
            project_count_pg = cursor.fetchone()[0]
        
        print(f"📊 PostgreSQL - Utilisateurs: {user_count_pg}, Projets: {project_count_pg}")
        
        # Migrer les utilisateurs (si pas déjà fait)
        if user_count_pg == 0:
            print("🔄 Migration des utilisateurs...")
            
            with connections['default'].cursor() as source_cursor:
                source_cursor.execute("SELECT * FROM auth_user")
                users = source_cursor.fetchall()
                
                with connections['postgres'].cursor() as target_cursor:
                    for user in users:
                        user_id = user[0]
                        password = user[1]
                        last_login = user[2]
                        is_superuser = bool(user[3])
                        username = user[4]
                        first_name = user[5]
                        last_name = user[6]
                        email = user[7]
                        is_staff = bool(user[8])
                        is_active = bool(user[9])
                        date_joined = user[10]
                        
                        target_cursor.execute("""
                            INSERT INTO auth_user 
                            (id, password, last_login, is_superuser, username, 
                             first_name, last_name, email, is_staff, is_active, date_joined)
                            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                        """, (user_id, password, last_login, is_superuser, username,
                              first_name, last_name, email, is_staff, is_active, date_joined))
            
            print(f"✅ {len(users)} utilisateurs migrés")
        else:
            print("✅ Utilisateurs déjà migrés")
        
        # Migrer les projets avec la bonne structure
        if project_count_pg == 0:
            print("🔄 Migration des projets...")
            
            with connections['default'].cursor() as source_cursor:
                source_cursor.execute("""
                    SELECT id, title, description, technologies, github_url, 
                           demo_url, image, status, created_at, updated_at, author_id
                    FROM projects_project
                """)
                projects = source_cursor.fetchall()
                
                with connections['postgres'].cursor() as target_cursor:
                    for project in projects:
                        target_cursor.execute("""
                            INSERT INTO projects_project 
                            (id, title, description, technologies, github_url, demo_url, 
                             image, status, created_at, updated_at, author_id)
                            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                        """, project)
            
            print(f"✅ {len(projects)} projets migrés")
        else:
            print("✅ Projets déjà migrés")
        
        # Vérification finale
        with connections['postgres'].cursor() as cursor:
            cursor.execute("SELECT COUNT(*) FROM auth_user")
            final_users = cursor.fetchone()[0]
            
            cursor.execute("SELECT COUNT(*) FROM projects_project")
            final_projects = cursor.fetchone()[0]
            
            print(f"🎯 RÉSULTAT FINAL - Utilisateurs: {final_users}, Projets: {final_projects}")
        
        print("🎉 MIGRATION TERMINÉE AVEC SUCCÈS!")
        
    except Exception as e:
        print(f"❌ ERREUR: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    migrate_correct()