import psycopg2

# Liste de mots de passe courants à tester
passwords_to_try = [
    'postgres',      # Mot de passe par défaut
    'postgres123',   # Celui qu'on a essayé
    'password',
    'admin',
    '123456',
    'simplon',
    'simplon2024',
    'Postgres123',
    'POSTGRES',
    '',              # Mot de passe vide
    'root',
    'postgre',
    'postgresql'
]

print("🔍 RECHERCHE DU MOT DE PASSE POSTGRESQL...")

for password in passwords_to_try:
    try:
        conn = psycopg2.connect(
            dbname='simplon_db',
            user='postgres',
            password=password,
            host='localhost',
            port='5432',
            connect_timeout=3
        )
        print(f"✅ ✅ ✅ MOT DE PASSE TROUVÉ : '{password}'")
        conn.close()
        break
    except Exception as e:
        if 'password authentication failed' in str(e):
            print(f"❌ '{password}' - Mauvais mot de passe")
        else:
            print(f"⚠️  '{password}' - Autre erreur: {str(e)[:50]}...")