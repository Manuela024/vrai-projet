import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'simplon_api.settings')
django.setup()

from django.utils import timezone
from datetime import timedelta

print("🌍 VÉRIFICATION FUSEAU CÔTE D'IVOIRE")
print("=" * 50)

print("Heure réelle (vous êtes à 10h23) :")
print(f"UTC: {timezone.now()}")
print(f"Local: {timezone.localtime()}")

# Test d'expiration
expiration = timezone.localtime() + timedelta(minutes=5)
print(f"\nExpiration dans 5 minutes:")
print(f"Heure: {expiration}")

print("=" * 50)
print("✅ L'heure Django doit correspondre à votre heure réelle (10h23)")