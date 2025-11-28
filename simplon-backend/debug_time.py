import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'simplon_api.settings')
django.setup()

from django.utils import timezone
from datetime import timedelta
import time

print("🕒 DIAGNOSTIC COMPLET DU TEMPS")
print("=" * 50)

# Test 1: Temps Django
print("1. 📊 TEMPS DJANGO:")
print(f"   - Heure actuelle: {timezone.now()}")
print(f"   - Fuseau horaire: {timezone.get_current_timezone()}")

# Test 2: Calcul d'expiration
expiration_test = timezone.now() + timedelta(minutes=5)
print(f"   - Expiration test: {expiration_test}")

# Test 3: Différence
time_diff = expiration_test - timezone.now()
print(f"   - Différence: {time_diff.total_seconds()} secondes")
print(f"   - Soit: {time_diff.total_seconds() / 60} minutes")

# Test 4: Vérification en temps réel
print("\n2. ⏰ TEST EN TEMPS RÉEL:")
start_time = timezone.now()
print(f"   - Début: {start_time}")

# Attendre 10 secondes
time.sleep(10)

end_time = timezone.now()
elapsed = end_time - start_time
print(f"   - Fin: {end_time}")
print(f"   - Écoulé: {elapsed.total_seconds()} secondes")

print("=" * 50)