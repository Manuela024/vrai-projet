# test_jwt.py
import requests
import json

BASE_URL = "http://localhost:8000"

# Test 1: Vérifier si l'API fonctionne
print("=== Test 1: Vérification de l'API ===")
try:
    response = requests.get(f"{BASE_URL}/api/status/", timeout=5)
    print(f"✅ Status API: {response.status_code}")
    print(f"Réponse: {response.text[:200]}...")
except Exception as e:
    print(f"❌ Erreur: {e}")

# Test 2: Essayer de créer un utilisateur de test
print("\n=== Test 2: Création d'utilisateur de test ===")
try:
    # Créez d'abord un superutilisateur via la console
    print("Exécutez cette commande dans une autre fenêtre:")
    print("python manage.py createsuperuser")
    print("Username: testuser")
    print("Email: test@simplon.com")
    print("Password: test123")
except Exception as e:
    print(f"Erreur: {e}")

# Test 3: Tester l'endpoint JWT directement
print("\n=== Test 3: Test de l'endpoint JWT ===")
try:
    response = requests.options(f"{BASE_URL}/api/token/", timeout=5)
    print(f"✅ Options JWT: {response.status_code}")
    print(f"Headers: {dict(response.headers)}")
except Exception as e:
    print(f"❌ Erreur: {e}")