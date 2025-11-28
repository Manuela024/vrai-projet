import os
import django
from django.conf import settings

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'simplon_api.settings')
django.setup()

from django.db import connections

try:
    with connections['postgres'].cursor() as cursor:
        cursor.execute("SELECT version();")
        version = cursor.fetchone()
        print("✅ Connexion Django à PostgreSQL réussie!")
        print(f"📊 Version: {version[0]}")
except Exception as e:
    print(f"❌ Erreur: {e}")