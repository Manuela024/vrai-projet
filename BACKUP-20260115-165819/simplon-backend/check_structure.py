import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'simplon_api.settings')
django.setup()

from django.db import connections

print("🔍 VÉRIFICATION DE LA STRUCTURE DES TABLES...")

# Vérifier SQLite
print("\n📊 STRUCTURE SQLite (projects_project):")
with connections['default'].cursor() as cursor:
    cursor.execute("PRAGMA table_info(projects_project)")
    columns = cursor.fetchall()
    for col in columns:
        print(f"   - {col[1]} ({col[2]})")

# Vérifier PostgreSQL  
print("\n📊 STRUCTURE PostgreSQL (projects_project):")
with connections['postgres'].cursor() as cursor:
    cursor.execute("""
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'projects_project' 
        ORDER BY ordinal_position
    """)
    columns = cursor.fetchall()
    for col in columns:
        print(f"   - {col[0]} ({col[1]})")

# Vérifier les données SQLite
print("\n📊 DONNÉES SQLite (projects_project):")
with connections['default'].cursor() as cursor:
    cursor.execute("SELECT * FROM projects_project LIMIT 1")
    sample = cursor.fetchone()
    if sample:
        print("   Première ligne:", sample)
        cursor.execute("SELECT COUNT(*) FROM projects_project")
        count = cursor.fetchone()[0]
        print(f"   Total des projets: {count}")