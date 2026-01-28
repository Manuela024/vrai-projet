import psycopg2

print("🔍 Test de la nouvelle connexion...")

try:
    conn = psycopg2.connect(
        dbname='simplon_db',
        user='postgres',
        password='postgres123',  # Votre nouveau mot de passe
        host='localhost',
        port='5432'
    )
    print("✅ ✅ ✅ CONNEXION RÉUSSIE !")
    print("🎉 PostgreSQL est maintenant configuré !")
    
    # Vérifier les tables
    cursor = conn.cursor()
    cursor.execute("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'")
    tables = cursor.fetchall()
    
    print(f"📊 {len(tables)} tables trouvées dans la base :")
    for table in tables:
        print(f"   - {table[0]}")
    
    conn.close()
    
except Exception as e:
    print(f"❌ ERREUR: {e}")