# import os
# import django

# os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'simplon_api.settings')
# django.setup()

# from django.core.mail import send_mail

# print("🧪 TEST EMAIL SIMPLIFIÉ")
# print("=" * 40)

# try:
#     # Test minimaliste
#     send_mail(
#         subject='Test Simplon',
#         message='Ceci est un test.',
#         from_email=None,
#         recipient_list=['test@example.com'],
#         fail_silently=False,
#     )
#     print("✅ EMAIL ENVOYÉ!")
# except Exception as e:
#     print(f"❌ ERREUR: {e}")
#     print(f"💡 Type d'erreur: {type(e).__name__}")


import psycopg2

print("🔍 Test de connexion PostgreSQL...")

# Essayons d'abord sans mot de passe
try:
    conn = psycopg2.connect(
        dbname='simplon_db',
        user='postgres', 
        host='localhost',
        port='5432'
    )
    print("✅ CONNEXION RÉUSSIE sans mot de passe!")
    conn.close()
except Exception as e:
    print(f"❌ Sans mot de passe: {e}")

# Essayons avec le mot de passe par défaut
try:
    conn = psycopg2.connect(
        dbname='simplon_db',
        user='postgres',
        password='postgres',  # Mot de passe par défaut commun
        host='localhost',
        port='5432'
    )
    print("✅ CONNEXION RÉUSSIE avec mot de passe 'postgres'!")
    conn.close()
except Exception as e:
    print(f"❌ Avec 'postgres': {e}")

# Essayons avec un mot de passe vide
try:
    conn = psycopg2.connect(
        dbname='simplon_db',
        user='postgres',
        password='',  # Mot de passe vide
        host='localhost',
        port='5432'
    )
    print("✅ CONNEXION RÉUSSIE avec mot de passe vide!")
    conn.close()
except Exception as e:
    print(f"❌ Avec mot de passe vide: {e}")