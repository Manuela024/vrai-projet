# # test_api.py
# import requests
# import json

# def test_user_api():
#     print("=== TEST API UTILISATEUR ===")
    
#     # 1. Login pour obtenir token
#     print("\n1. Connexion...")
#     login_data = {
#         'username': 'simplon_2025001',
#         'password': 'simplon2024'
#     }
    
#     try:
#         response = requests.post('http://localhost:8000/api/token/', 
#                                json=login_data, 
#                                timeout=10)
        
#         if response.status_code == 200:
#             tokens = response.json()
#             access_token = tokens['access']
#             print(f"✅ Connecté - Token: {access_token[:30]}...")
            
#             # 2. Tester différents endpoints
#             headers = {
#                 'Authorization': f'Bearer {access_token}',
#                 'Content-Type': 'application/json'
#             }
            
#             endpoints = [
#                 ('/api/users/me/', 'Current user'),
#                 ('/api/users/?username=simplon_2025001', 'Search by username'),
#                 ('/api/users/18/', 'User by ID (18)'),
#                 ('/api/current-user/', 'Current user endpoint'),
#                 ('/api/profile/', 'Profile endpoint')
#             ]
            
#             for endpoint, description in endpoints:
#                 print(f"\n🔍 Testing {description} ({endpoint}):")
#                 try:
#                     resp = requests.get(f'http://localhost:8000{endpoint}', 
#                                       headers=headers, 
#                                       timeout=5)
                    
#                     print(f"   Status: {resp.status_code}")
                    
#                     if resp.status_code == 200:
#                         data = resp.json()
                        
#                         # Essayer d'extraire les données utilisateur
#                         user_data = None
                        
#                         if isinstance(data, dict):
#                             if 'username' in data:
#                                 user_data = data
#                             elif 'results' in data and data['results']:
#                                 user_data = data['results'][0]
#                         elif isinstance(data, list) and data:
#                             user_data = data[0]
                        
#                         if user_data:
#                             print(f"   ✅ User found!")
#                             print(f"      Username: {user_data.get('username')}")
#                             print(f"      Email: {user_data.get('email')}")
#                             print(f"      First name: '{user_data.get('first_name')}'")
#                             print(f"      Last name: '{user_data.get('last_name')}'")
#                             print(f"      Full name: {user_data.get('first_name')} {user_data.get('last_name')}")
#                         else:
#                             print(f"   ❓ Data format not recognized")
#                             print(f"      Data: {json.dumps(data, indent=2)[:200]}...")
#                     else:
#                         print(f"   ❌ Error response: {resp.text[:100]}")
                        
#                 except Exception as e:
#                     print(f"   ❌ Request failed: {e}")
                    
#         else:
#             print(f"❌ Login failed: {response.status_code}")
#             print(response.text)
            
#     except requests.exceptions.ConnectionError:
#         print("❌ Impossible de se connecter à l'API Django")
#         print("   Vérifiez que Django est en cours d'exécution: python manage.py runserver")
#     except Exception as e:
#         print(f"❌ Erreur: {e}")

# if __name__ == "__main__":
#     test_user_api()


# test_api.py
import requests
import json

BASE_URL = "http://localhost:8000/api"

def test_endpoints():
    endpoints = [
        f"{BASE_URL}/projects/",
        f"{BASE_URL}/projects/all/",
        f"{BASE_URL}/projects/stats/",
        f"{BASE_URL}/projects/status/",
        f"{BASE_URL}/projects/create/",
        f"{BASE_URL}/projects/my-projects/",
        f"{BASE_URL}/projects/debug/",
        f"{BASE_URL}/projects/projects-grouped/",
        f"{BASE_URL}/projects/projects-with-users/",
        f"{BASE_URL}/users/",
        f"{BASE_URL}/users/with-projects/",
    ]
    
    print("🧪 TEST DES ENDPOINTS API")
    print("=" * 70)
    
    for endpoint in endpoints:
        try:
            response = requests.get(endpoint, timeout=5)
            print(f"{'✅' if response.status_code == 200 else '❌'} {endpoint}")
            print(f"   Status: {response.status_code}")
            
            if response.status_code == 200:
                try:
                    data = response.json()
                    if isinstance(data, list):
                        print(f"   📦 {len(data)} éléments")
                    elif isinstance(data, dict) and 'count' in data:
                        print(f"   📦 {data.get('count', 0)} éléments")
                except:
                    print(f"   📄 Réponse non-JSON")
                    
        except Exception as e:
            print(f"❌ {endpoint}")
            print(f"   ⚠️ Erreur: {str(e)[:50]}...")
        
        print()
    
    print("=" * 70)

if __name__ == "__main__":
    test_endpoints()
    