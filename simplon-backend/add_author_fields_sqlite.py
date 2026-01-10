import sqlite3
import os
from django.contrib.auth import get_user_model
import django

# Configurer Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'simplon_api.settings')
django.setup()

User = get_user_model()

def add_author_fields_to_sqlite():
    """Ajoute les champs author_* à la table SQLite et peuple les données"""
    
    db_path = 'db.sqlite3'
    
    if not os.path.exists(db_path):
        print(f"❌ Fichier de base de données introuvable: {db_path}")
        return
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # 1. Trouver le nom exact de la table projet
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name LIKE '%project%';")
        project_tables = cursor.fetchall()
        
        if not project_tables:
            print("❌ Aucune table projet trouvée!")
            # Lister toutes les tables pour debug
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
            all_tables = cursor.fetchall()
            print("Tables disponibles:")
            for table in all_tables:
                print(f"  - {table[0]}")
            return
        
        table_name = project_tables[0][0]
        print(f"✅ Table projet trouvée: {table_name}")
        
        # 2. Vérifier la structure actuelle
        cursor.execute(f'PRAGMA table_info({table_name});')
        columns = [col[1] for col in cursor.fetchall()]
        print(f"\nColonnes actuelles ({len(columns)}): {', '.join(columns)}")
        
        # 3. Ajouter les nouvelles colonnes si elles n'existent pas
        new_columns = [
            ('author_name', 'VARCHAR(255) DEFAULT ""'),
            ('author_email', 'VARCHAR(255) DEFAULT ""'),
            ('author_username', 'VARCHAR(150) DEFAULT ""')
        ]
        
        for col_name, col_type in new_columns:
            if col_name in columns:
                print(f"⚠️  La colonne {col_name} existe déjà")
            else:
                print(f"➕ Ajout de la colonne {col_name}...")
                cursor.execute(f'ALTER TABLE {table_name} ADD COLUMN {col_name} {col_type};')
        
        # 4. Mettre à jour les données avec les informations utilisateur
        print("\n🔄 Mise à jour des données existantes...")
        
        # Récupérer tous les projets avec leur author_id
        cursor.execute(f'SELECT id, author_id FROM {table_name} WHERE author_id IS NOT NULL;')
        projects = cursor.fetchall()
        
        print(f"📊 {len(projects)} projets à mettre à jour")
        
        updated_count = 0
        for project_id, author_id in projects:
            try:
                # Récupérer l'utilisateur depuis Django
                user = User.objects.get(id=author_id)
                
                # Construire le nom complet
                full_name = f"{user.first_name or ''} {user.last_name or ''}".strip()
                if not full_name:
                    full_name = user.username
                
                # Mettre à jour la ligne
                cursor.execute(f"""
                    UPDATE {table_name} 
                    SET author_name = ?, author_email = ?, author_username = ?
                    WHERE id = ?
                """, (full_name, user.email or '', user.username, project_id))
                
                updated_count += 1
                if updated_count % 10 == 0:
                    print(f"  {updated_count}/{len(projects)} projets mis à jour...")
                
            except User.DoesNotExist:
                print(f"⚠️  Utilisateur #{author_id} non trouvé pour le projet #{project_id}")
            except Exception as e:
                print(f"❌ Erreur sur projet #{project_id}: {e}")
        
        # 5. Vérifier le résultat
        conn.commit()
        
        print(f"\n✅ {updated_count} projets mis à jour avec succès!")
        
        print("\n🔍 Vérification finale...")
        cursor.execute(f"""
            SELECT 
                COUNT(*) as total,
                COUNT(author_name) as with_name,
                COUNT(author_email) as with_email,
                COUNT(author_username) as with_username
            FROM {table_name}
        """)
        
        total, with_name, with_email, with_username = cursor.fetchone()
        
        print(f"📊 Résultats:")
        print(f"   Total projets: {total}")
        print(f"   Avec author_name: {with_name} ({with_name/total*100:.1f}%)")
        print(f"   Avec author_email: {with_email} ({with_email/total*100:.1f}%)")
        print(f"   Avec author_username: {with_username} ({with_username/total*100:.1f}%)")
        
        # 6. Afficher un exemple
        print("\n🔍 Exemple de données mises à jour:")
        cursor.execute(f"""
            SELECT id, title, author_name, author_email, author_username 
            FROM {table_name} 
            WHERE author_name != '' 
            LIMIT 3
        """)
        
        for row in cursor.fetchall():
            pid, title, name, email, username = row
            print(f"  Projet #{pid}: '{title[:30]}...'")
            print(f"    Auteur: {name} ({username})")
            print(f"    Email: {email}")
            print()
        
        print("🎉 Opération terminée avec succès!")
        
    except Exception as e:
        print(f"❌ Erreur critique: {e}")
        conn.rollback()
        raise
    finally:
        conn.close()

if __name__ == "__main__":
    add_author_fields_to_sqlite()