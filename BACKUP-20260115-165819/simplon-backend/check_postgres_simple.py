# check_postgres_simple.py
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'simplon_api.settings')

try:
    import django
    django.setup()
    print("✅ Django configuré")
    
    from django.db import connection
    
    print("\n🔍 VÉRIFICATION POSTGRESQL")
    print("=" * 50)
    
    with connection.cursor() as cursor:
        # Vérifier les colonnes de la table
        cursor.execute("""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'projects_project'
            ORDER BY column_name;
        """)
        
        all_columns = [row[0] for row in cursor.fetchall()]
        print(f"Toutes les colonnes ({len(all_columns)}):")
        for col in all_columns[:10]:  # Afficher les 10 premières
            print(f"  - {col}")
        if len(all_columns) > 10:
            print(f"  ... et {len(all_columns)-10} autres")
        
        # Vérifier spécifiquement les champs author_*
        print("\n🔎 CHAMPS AUTHOR_*:")
        author_fields = []
        for col in all_columns:
            if 'author' in col.lower():
                author_fields.append(col)
        
        for field in ['author_name', 'author_email', 'author_username']:
            if field in all_columns:
                print(f"  ✅ {field} - PRÉSENT")
            else:
                print(f"  ❌ {field} - ABSENT")
        
        # Compter les projets
        cursor.execute("SELECT COUNT(*) FROM projects_project;")
        total = cursor.fetchone()[0]
        print(f"\n📊 Total projets: {total}")
        
except Exception as e:
    print(f"\n❌ ERREUR: {e}")
    import traceback
    traceback.print_exc()