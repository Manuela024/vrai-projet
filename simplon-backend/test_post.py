# test_post.py - TEST COMPLET DE L'API DJANGO
import requests
import json
import sys

BASE_URL = 'http://localhost:8000'

def print_header(text):
    """Affiche un en-tête"""
    print("\n" + "=" * 60)
    print(f"  {text}")
    print("=" * 60)

def test_options():
    """Tester OPTIONS pour voir les méthodes autorisées"""
    print_header("🔍 TEST OPTIONS")
    
    try:
        # Test sur /api/projects/
        response = requests.options(f'{BASE_URL}/api/projects/')
        print(f"📡 /api/projects/")
        print(f"   Status: {response.status_code}")
        print(f"   Allow: {response.headers.get('Allow', 'Non spécifié')}")
        
        # Test sur /api/projects/create/
        response = requests.options(f'{BASE_URL}/api/projects/create/')
        print(f"\n📡 /api/projects/create/")
        print(f"   Status: {response.status_code}")
        print(f"   Allow: {response.headers.get('Allow', 'Non spécifié')}")
        
        return True
    except Exception as e:
        print(f"❌ Erreur OPTIONS: {e}")
        return False

def test_get():
    """Tester GET pour voir si l'API répond"""
    print_header("📥 TEST GET")
    
    try:
        # Test sur /api/projects/
        print("🎯 GET /api/projects/")
        response = requests.get(f'{BASE_URL}/api/projects/')
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Succès!")
            print(f"   Projets trouvés: {data.get('count', 0)}")
            print(f"   Message: {data.get('message', '')}")
            return True
        else:
            print(f"   ❌ Erreur {response.status_code}")
            try:
                print(f"   Réponse: {response.json()}")
            except:
                print(f"   Réponse: {response.text[:200]}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ Impossible de se connecter à l'API")
        print("   Vérifiez que Django tourne: python manage.py runserver")
        return False
    except Exception as e:
        print(f"❌ Erreur GET: {e}")
        return False

def test_post_json():
    """Tester POST avec JSON"""
    print_header("📝 TEST POST (JSON)")
    
    try:
        data = {
            'title': 'Test projet API Python',
            'description': 'Ceci est un test depuis Python',
            'technologies': 'Python, Django, REST API',
            'cohort': 'Test - Python',
            'tags': 'test, api, python',
            'author_name': 'Test Script'
        }
        
        print("🎯 POST /api/projects/ avec JSON")
        response = requests.post(
            f'{BASE_URL}/api/projects/',
            json=data,
            headers={'Content-Type': 'application/json'}
        )
        
        print(f"   Status: {response.status_code}")
        
        if response.status_code in [200, 201]:
            result = response.json()
            print(f"   ✅ Succès!")
            print(f"   Message: {result.get('message', '')}")
            print(f"   Projet ID: {result.get('project_id', 'N/A')}")
            print(f"   Titre: {result.get('title', 'N/A')}")
            return True
        else:
            print(f"   ❌ Erreur {response.status_code}")
            try:
                error_data = response.json()
                print(f"   Erreur: {error_data}")
            except:
                print(f"   Réponse: {response.text[:200]}")
            return False
            
    except Exception as e:
        print(f"❌ Erreur POST JSON: {e}")
        return False

def test_post_formdata():
    """Tester POST avec FormData (comme le frontend)"""
    print_header("📁 TEST POST (FormData)")
    
    try:
        # Données de formulaire
        form_data = {
            'title': 'Projet avec FormData',
            'description': 'Test d\'upload avec FormData comme React',
            'technologies': 'React, Axios, FormData',
            'cohort': 'DWWM - Test',
            'tags': 'formdata, upload, test'
        }
        
        print("🎯 POST /api/projects/create/ avec FormData")
        response = requests.post(
            f'{BASE_URL}/api/projects/create/',
            data=form_data,
            headers={'Content-Type': 'application/x-www-form-urlencoded'}
        )
        
        print(f"   Status: {response.status_code}")
        
        if response.status_code in [200, 201]:
            result = response.json()
            print(f"   ✅ Succès!")
            print(f"   Message: {result.get('message', '')}")
            print(f"   Projet créé: {result.get('project_id', 'N/A')}")
            return True
        else:
            print(f"   ❌ Erreur {response.status_code}")
            try:
                print(f"   Erreur: {response.json()}")
            except:
                print(f"   Réponse: {response.text[:200]}")
            return False
            
    except Exception as e:
        print(f"❌ Erreur POST FormData: {e}")
        return False

def test_token():
    """Tester l'obtention d'un token JWT"""
    print_header("🔑 TEST TOKEN JWT")
    
    try:
        # Essayez d'abord avec un utilisateur de test
        print("🎯 POST /api/token/")
        response = requests.post(
            f'{BASE_URL}/api/token/',
            data={
                'username': 'testuser',
                'password': 'test123'
            }
        )
        
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 200:
            token_data = response.json()
            print(f"   ✅ Token obtenu!")
            print(f"   Access token: {token_data.get('access', '')[0:50]}...")
            print(f"   Refresh token: {token_data.get('refresh', '')[0:50]}...")
            return token_data.get('access')
        else:
            print(f"   ❌ Erreur {response.status_code}")
            try:
                print(f"   Détail: {response.json()}")
            except:
                print(f"   Réponse: {response.text}")
            
            # Essayer de créer un utilisateur test
            print("\n🔄 Tentative de création d'utilisateur test...")
            from django.contrib.auth.models import User
            User.objects.create_user(
                username='testuser',
                email='test@example.com',
                password='test123',
                first_name='Test',
                last_name='User'
            )
            print("   ✅ Utilisateur 'testuser' créé (mot de passe: 'test123')")
            return None
            
    except Exception as e:
        print(f"❌ Erreur token: {e}")
        return None

def main():
    """Fonction principale"""
    print("\n" + "=" * 60)
    print("   🚀 TEST COMPLET DE L'API DJANGO")
    print("=" * 60)
    
    # Vérifier que Django tourne
    print("📡 Base URL:", BASE_URL)
    
    # Liste des tests
    tests = [
        ('OPTIONS', test_options),
        ('GET', test_get),
        ('POST JSON', test_post_json),
        ('POST FormData', test_post_formdata),
        ('Token JWT', test_token)
    ]
    
    results = {}
    
    # Exécuter tous les tests
    for test_name, test_func in tests:
        try:
            result = test_func()
            if test_name == 'Token JWT':
                results[test_name] = '✅' if result else '❌'
            else:
                results[test_name] = '✅' if result else '❌'
        except Exception as e:
            print(f"❌ Exception dans {test_name}: {e}")
            results[test_name] = '💥'
    
    # Résumé
    print_header("📊 RÉSUMÉ DES TESTS")
    
    for test_name, result in results.items():
        print(f"   {test_name:15} {result}")
    
    print("\n" + "=" * 60)
    print("   RECOMMANDATIONS:")
    
    if results.get('OPTIONS') == '✅' and 'POST' in results and results['POST'] == '✅':
        print("   ✅ Votre API accepte POST! Le frontend devrait fonctionner.")
        print("   👉 Testez maintenant votre formulaire React.")
    elif results.get('GET') == '❌':
        print("   ❌ L'API ne répond pas. Vérifiez que Django tourne:")
        print("      python manage.py runserver")
    elif results.get('OPTIONS') == '✅' and 'POST' not in results.get('Allow', ''):
        print("   ❌ L'API n'accepte pas POST. Vérifiez:")
        print("      1. Le décorateur @api_view(['GET', 'POST'])")
        print("      2. Les permissions dans settings.py")
        print("      3. La vue project_list dans views_api.py")
    else:
        print("   🔧 Consultez les messages d'erreur ci-dessus.")
    
    print("=" * 60)

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n👋 Test interrompu")
    except Exception as e:
        print(f"\n❌ Erreur inattendue: {e}")