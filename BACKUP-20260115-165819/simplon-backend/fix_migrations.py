# fix_migrations.py - CRÉEZ CE FICHIER À LA RACINE
import os
import django
import sys

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'simplon_api.settings')
django.setup()

print("=" * 70)
print("🔧 RÉSOLUTION DES PROBLÈMES DE MIGRATION")
print("=" * 70)

from django.db import connection

def check_migration_files():
    """Vérifie les fichiers de migration"""
    migrations_path = 'projects/migrations'
    print("📁 Fichiers de migration trouvés :")
    
    import os
    for file in sorted(os.listdir(migrations_path)):
        if file.endswith('.py') and not file.startswith('__'):
            print(f"   {file}")

def check_database_migrations():
    """Vérifie les migrations dans la base de données"""
    with connection.cursor() as cursor:
        # Migrations appliquées
        cursor.execute("""
            SELECT app, name, applied 
            FROM django_migrations 
            WHERE app = 'projects' 
            ORDER BY name
        """)
        
        print("\n📋 Migrations dans la base de données :")
        for app, name, applied in cursor.fetchall():
            status = "✅ APPLIQUÉ" if applied else "⏳ EN ATTENTE"
            print(f"   {status} {name}")

def fix_migration_issue():
    """Corrige le problème de migration manuellement"""
    print("\n🔧 Correction en cours...")
    
    with connection.cursor() as cursor:
        # 1. Vérifier si les colonnes existent déjà
        print("1. Vérification des colonnes...")
        
        columns_to_check = ['author_name', 'author_email', 'author_username']
        for column in columns_to_check:
            cursor.execute("""
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'projects_project' 
                AND column_name = %s
            """, [column])
            
            exists = cursor.fetchone() is not None
            status = "✅ EXISTE" if exists else "❌ MANQUANTE"
            print(f"   {column}: {status}")
        
        # 2. Ajouter les colonnes manquantes
        print("\n2. Ajout des colonnes manquantes...")
        
        columns_sql = [
            ('author_name', 'VARCHAR(255)'),
            ('author_email', 'VARCHAR(254)'),
            ('author_username', 'VARCHAR(150)'),
        ]
        
        for column_name, sql_type in columns_sql:
            cursor.execute("""
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'projects_project' 
                AND column_name = %s
            """, [column_name])
            
            if not cursor.fetchone():
                try:
                    cursor.execute(f"""
                        ALTER TABLE projects_project 
                        ADD COLUMN {column_name} {sql_type} DEFAULT '' NOT NULL
                    """)
                    print(f"   ✅ {column_name} ajouté")
                except Exception as e:
                    print(f"   ⚠️ {column_name}: {e}")
            else:
                print(f"   ✅ {column_name} existe déjà")
        
        # 3. Mettre à jour les données
        print("\n3. Mise à jour des données...")
        
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
            print(f"   ✅ {cursor.rowcount} projets mis à jour")
        except Exception as e:
            print(f"   ⚠️ Erreur mise à jour: {e}")
        
        # 4. Fixer la table des migrations
        print("\n4. Correction des migrations Django...")
        
        # Supprimer les entrées problématiques
        cursor.execute("""
            DELETE FROM django_migrations 
            WHERE app = 'projects' 
            AND name LIKE '0006%' OR name LIKE '0007%'
        """)
        print("   ✅ Entrées 0006/0007 supprimées")
        
        # Ajouter une entrée propre
        cursor.execute("""
            INSERT INTO django_migrations (app, name, applied)
            VALUES ('projects', '0006_add_author_fields', NOW())
            ON CONFLICT (app, name) DO NOTHING
        """)
        print("   ✅ Migration 0006 ajoutée")
        
        # 5. Vérification finale
        print("\n5. Vérification finale...")
        
        cursor.execute("""
            SELECT COUNT(*) as total_projects,
                   COUNT(CASE WHEN author_name != '' THEN 1 END) as with_name,
                   COUNT(CASE WHEN author_email != '' THEN 1 END) as with_email
            FROM projects_project
        """)
        
        stats = cursor.fetchone()
        print(f"   📊 Total projets: {stats[0]}")
        print(f"   👤 Avec nom d'auteur: {stats[1]}")
        print(f"   📧 Avec email d'auteur: {stats[2]}")
        
        cursor.execute("SELECT COUNT(*) FROM django_migrations WHERE app = 'projects'")
        print(f"   🗂️  Migrations enregistrées: {cursor.fetchone()[0]}")

def create_fixed_migration_file():
    """Crée un fichier de migration propre"""
    print("\n📝 Création d'un fichier de migration corrigé...")
    
    migration_content = '''# Generated by manual fix
from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0005_sync_existing_fields'),
    ]

    operations = [
        migrations.AddField(
            model_name='project',
            name='author_email',
            field=models.EmailField(blank=True, default='', max_length=254, verbose_name='Email de l\\'auteur'),
        ),
        migrations.AddField(
            model_name='project',
            name='author_name',
            field=models.CharField(blank=True, default='', max_length=255, verbose_name='Nom complet de l\\'auteur'),
        ),
        migrations.AddField(
            model_name='project',
            name='author_username',
            field=models.CharField(blank=True, default='', max_length=150, verbose_name='Nom d\\'utilisateur'),
        ),
    ]
'''
    
    # Créer le fichier
    import os
    migration_path = 'projects/migrations/0006_add_author_fields_fixed.py'
    
    with open(migration_path, 'w', encoding='utf-8') as f:
        f.write(migration_content)
    
    print(f"   ✅ Fichier créé: {migration_path}")

if __name__ == "__main__":
    try:
        check_migration_files()
        check_database_migrations()
        fix_migration_issue()
        create_fixed_migration_file()
        
        print("\n" + "=" * 70)
        print("✅ CORRECTION TERMINÉE AVEC SUCCÈS!")
        print("=" * 70)
        print("\n🎯 Prochaines étapes :")
        print("1. Exécutez: python manage.py showmigrations projects")
        print("2. Exécutez: python manage.py migrate --fake projects 0006_add_author_fields_fixed")
        print("3. Testez: curl http://localhost:8000/api/projects-grouped/")
        
    except Exception as e:
        print(f"\n❌ ERREUR: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)