# repair_projects.py
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'votre_projet.settings')
django.setup()

from django.db import connection

print("=" * 70)
print("🛠️  RÉPARATION DE LA TABLE PROJECTS_PROJECT")
print("=" * 70)

# 1. Vérifier l'état actuel
print("\n📊 ÉTAT ACTUEL DE LA TABLE:")
with connection.cursor() as cursor:
    cursor.execute("""
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'projects_project'
        ORDER BY ordinal_position
    """)
    
    current_columns = []
    print("Colonnes existantes:")
    for row in cursor.fetchall():
        print(f"  - {row[0]:15} {row[1]:25} nullable: {row[2]}")
        current_columns.append(row[0])

# 2. Colonnes attendues selon votre models.py
expected_columns = [
    "id", "title", "description", "technologies", 
    "github_url", "demo_url", "image", "author_id",
    "status", "created_at", "updated_at"
]

# 3. Ajouter les colonnes manquantes
print("\n➕ AJOUT DES COLONNES MANQUANTES:")
columns_to_add = [
    ("github_url", "VARCHAR(200) DEFAULT '' NOT NULL"),
    ("demo_url", "VARCHAR(200) DEFAULT '' NOT NULL"),
    ("image", "VARCHAR(100)"),
    ("updated_at", "TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL"),
]

for col_name, col_def in columns_to_add:
    if col_name not in current_columns:
        print(f"  Ajout de {col_name}...")
        try:
            with connection.cursor() as cursor:
                # Pour les colonnes NOT NULL avec DEFAULT, on fait en 2 étapes
                if "NOT NULL" in col_def and "DEFAULT" in col_def:
                    # D'abord ajouter sans NOT NULL
                    temp_def = col_def.replace(" NOT NULL", "")
                    cursor.execute(f"ALTER TABLE projects_project ADD COLUMN {col_name} {temp_def}")
                    # Puis mettre à jour les valeurs NULL
                    cursor.execute(f"UPDATE projects_project SET {col_name} = '' WHERE {col_name} IS NULL")
                    # Enfin ajouter la contrainte NOT NULL
                    cursor.execute(f"ALTER TABLE projects_project ALTER COLUMN {col_name} SET NOT NULL")
                else:
                    cursor.execute(f"ALTER TABLE projects_project ADD COLUMN {col_name} {col_def}")
            print(f"  ✅ {col_name} ajouté")
        except Exception as e:
            print(f"  ❌ Erreur: {e}")
    else:
        print(f"  ✓ {col_name} existe déjà")

# 4. Renommer user_id → author_id
print("\n🔄 RENOMMAGE user_id → author_id:")
try:
    with connection.cursor() as cursor:
        # Vérifier si author_id existe déjà
        cursor.execute("""
            SELECT column_name FROM information_schema.columns 
            WHERE table_name = 'projects_project' AND column_name = 'author_id'
        """)
        
        if not cursor.fetchone():
            # Vérifier la contrainte de clé étrangère
            cursor.execute("""
                SELECT conname FROM pg_constraint 
                WHERE conrelid = 'projects_project'::regclass 
                AND conname LIKE '%user_id%'
            """)
            fk_name = cursor.fetchone()
            if fk_name:
                fk_name = fk_name[0]
                print(f"  Suppression de la contrainte {fk_name}...")
                cursor.execute(f"ALTER TABLE projects_project DROP CONSTRAINT {fk_name}")
            
            # Renommer la colonne
            print("  Renommage user_id → author_id...")
            cursor.execute("ALTER TABLE projects_project RENAME COLUMN user_id TO author_id")
            
            # Recréer la contrainte de clé étrangère
            print("  Recréation de la contrainte de clé étrangère...")
            cursor.execute("""
                ALTER TABLE projects_project 
                ADD CONSTRAINT projects_project_author_id_fkey 
                FOREIGN KEY (author_id) REFERENCES auth_user(id)
            """)
            
            print("  ✅ Colonne renommée avec succès")
        else:
            print("  ✓ author_id existe déjà")
except Exception as e:
    print(f"  ⚠️ Erreur lors du renommage: {e}")
    print("  (Ce n'est pas grave, vous pouvez garder user_id)")

# 5. Supprimer les colonnes obsolètes si vous ne les voulez pas
print("\n🗑️  COLONNES OBSOLÈTES (cohort, tags):")
response = input("  Supprimer les colonnes cohort et tags? (o/n): ")
if response.lower() == 'o':
    try:
        with connection.cursor() as cursor:
            if 'cohort' in current_columns:
                cursor.execute("ALTER TABLE projects_project DROP COLUMN cohort")
                print("  ✅ colonne cohort supprimée")
            if 'tags' in current_columns:
                cursor.execute("ALTER TABLE projects_project DROP COLUMN tags")
                print("  ✅ colonne tags supprimée")
    except Exception as e:
        print(f"  ❌ Erreur: {e}")
        print("  (Vous pouvez garder ces colonnes, elles ne gênent pas)")

# 6. Vérification finale
print("\n📋 VÉRIFICATION FINALE:")
with connection.cursor() as cursor:
    cursor.execute("""
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_name = 'projects_project'
        ORDER BY ordinal_position
    """)
    
    print("\nStructure finale de la table:")
    for row in cursor.fetchall():
        print(f"  {row[0]:20} {row[1]}")

print("\n" + "=" * 70)
print("✅ RÉPARATION TERMINÉE !")
print("=" * 70)

print("\n📝 POUR TESTER:")
print("python manage.py shell")
print(">>> from projects.models import Project")
print(">>> p = Project(title='Test', description='Test', technologies='Test', author_id=1)")
print(">>> p.save()")
print(">>> print(f'Projet créé: {p.id}')")