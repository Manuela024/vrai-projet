import psycopg2
import os

print("🧹 TEST DE CONNEXION PROPRE...")

# Configuration propre
config = {
    'dbname': 'simplon_db',
    'user': 'postgres',
    'password': 'postgres123',  # Exactement ça
    'host': 'localhost',
    'port': '5432'
}

try:
    conn = psycopg2.connect(**config)
    print("✅ CONNEXION PROPRE RÉUSSIE !")
    
    # Tester les données
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM auth_user")
    users = cursor.fetchone()[0]
    cursor.execute("SELECT COUNT(*) FROM projects_project")
    projects = cursor.fetchone()[0]
    
    print(f"📊 Utilisateurs: {users}")
    print(f"📊 Projets: {projects}")
    
    conn.close()
    print("🎉 TOUT FONCTIONNE !")
    
except Exception as e:
    print(f"❌ ERREUR: {e}")