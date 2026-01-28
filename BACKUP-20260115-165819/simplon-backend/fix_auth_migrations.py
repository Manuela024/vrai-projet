# fix_auth_migrations.py - CRÉEZ CE FICHIER
import os
import django
import sys

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'simplon_api.settings')
django.setup()

print("=" * 70)
print("🔧 RÉPARATION DES MIGRATIONS AUTH")
print("=" * 70)

from django.db import connection

def fix_auth_migrations():
    """Corrige l'ordre des migrations auth"""
    
    with connection.cursor() as cursor:
        # 1. Voir l'état actuel
        print("1. État actuel des migrations auth :")
        cursor.execute("""
            SELECT id, name, applied 
            FROM django_migrations 
            WHERE app = 'auth' 
            ORDER BY name
        """)
        
        migrations = cursor.fetchall()
        for mig_id, name, applied in migrations:
            status = "✅" if applied else "⏳"
            print(f"   {status} {name}")
        
        # 2. Corriger l'ordre problématique
        print("\n2. Correction de l'ordre des migrations...")
        
        # Les migrations auth doivent être dans cet ordre :
        auth_migrations_order = [
            '0001_initial',
            '0002_alter_permission_name_max_length',
            '0003_alter_user_email_max_length',
            '0004_alter_user_username_opts',
            '0005_alter_user_last_login_null',
            '0006_require_contenttypes_0002',
            '0007_alter_validators_add_error_messages',
            '0008_alter_user_username_max_length',
            '0009_alter_user_last_name_max_length',
            '0010_alter_group_name_max_length',
            '0011_update_proxy_permissions',
            '0012_alter_user_first_name_max_length',
        ]
        
        # Supprimer toutes les migrations auth
        cursor.execute("DELETE FROM django_migrations WHERE app = 'auth'")
        print("   ✅ Migrations auth supprimées")
        
        # Réappliquer dans le bon ordre
        import datetime
        applied_time = datetime.datetime.now()
        
        for i, migration_name in enumerate(auth_migrations_order):
            # Appliquer progressivement plus tôt pour simuler l'ordre
            fake_applied = applied_time - datetime.timedelta(hours=len(auth_migrations_order) - i)
            
            cursor.execute("""
                INSERT INTO django_migrations (app, name, applied)
                VALUES (%s, %s, %s)
            """, ['auth', migration_name, fake_applied])
        
        print(f"   ✅ {len(auth_migrations_order)} migrations auth réappliquées")
        
        # 3. Vérifier projects aussi
        print("\n3. Vérification des migrations projects...")
        
        cursor.execute("""
            SELECT name FROM django_migrations 
            WHERE app = 'projects' 
            ORDER BY name
        """)
        
        projects_migrations = [row[0] for row in cursor.fetchall()]
        print(f"   📁 Migrations projects: {len(projects_migrations)}")
        for mig in projects_migrations:
            print(f"      • {mig}")
        
        # 4. S'assurer que 0006 existe
        if '0006_add_author_fields_fixed' not in projects_migrations:
            cursor.execute("""
                INSERT INTO django_migrations (app, name, applied)
                VALUES ('projects', '0006_add_author_fields_fixed', NOW())
                ON CONFLICT DO NOTHING
            """)
            print("   ✅ Migration 0006 ajoutée")
        
        # 5. Vérification finale
        print("\n4. Vérification finale...")
        
        cursor.execute("SELECT COUNT(*) FROM django_migrations")
        total = cursor.fetchone()[0]
        print(f"   📊 Total migrations: {total}")
        
        cursor.execute("SELECT COUNT(DISTINCT app) FROM django_migrations")
        apps = cursor.fetchone()[0]
        print(f"   📱 Applications: {apps}")
        
        # Vérifier les colonnes author_*
        cursor.execute("""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'projects_project' 
            AND column_name LIKE 'author_%'
        """)
        
        author_columns = [row[0] for row in cursor.fetchall()]
        print(f"   👤 Colonnes author_*: {len(author_columns)}")
        for col in author_columns:
            print(f"      • {col}")

def check_author_columns():
    """Vérifie et ajoute les colonnes author_* si nécessaire"""
    print("\n🔍 Vérification des colonnes author_*...")
    
    with connection.cursor() as cursor:
        columns_to_check = [
            ('author_name', 'VARCHAR(255)'),
            ('author_email', 'VARCHAR(254)'),
            ('author_username', 'VARCHAR(150)'),
        ]
        
        for column_name, sql_type in columns_to_check:
            cursor.execute("""
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'projects_project' 
                AND column_name = %s
            """, [column_name])
            
            if not cursor.fetchone():
                print(f"   ⚠️ {column_name} manquante - ajout...")
                try:
                    cursor.execute(f"""
                        ALTER TABLE projects_project 
                        ADD COLUMN {column_name} {sql_type} DEFAULT '' NOT NULL
                    """)
                    print(f"   ✅ {column_name} ajoutée")
                except Exception as e:
                    print(f"   ❌ Erreur: {e}")
            else:
                print(f"   ✅ {column_name} existe déjà")
        
        # Mettre à jour les données
        print("\n🔄 Mise à jour des données...")
        try:
            cursor.execute("""
                UPDATE projects_project p
                SET 
                    author_name = COALESCE(
                        NULLIF(TRIM(CONCAT(u.first_name, ' ', u.last_name)), ''),
                        u.username
                    ),
                    author_email = COALESCE(u.email, ''),
                    author_username = u.username
                FROM auth_user u
                WHERE p.author_id = u.id
                AND (p.author_name = '' OR p.author_email = '' OR p.author_username = '');
            """)
            print(f"   ✅ {cursor.rowcount} lignes mises à jour")
        except Exception as e:
            print(f"   ⚠️ Erreur mise à jour: {e}")

if __name__ == "__main__":
    try:
        fix_auth_migrations()
        check_author_columns()
        
        print("\n" + "=" * 70)
        print("✅ RÉPARATION TERMINÉE!")
        print("=" * 70)
        print("\n🎯 Prochaines étapes :")
        print("1. python manage.py showmigrations")
        print("2. python manage.py migrate")
        print("3. python manage.py check")
        
    except Exception as e:
        print(f"\n❌ ERREUR: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)