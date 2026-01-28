# test_upload_final.py
import requests
import json
from datetime import datetime

def test_upload():
    print("=" * 60)
    print("🚀 TEST FINAL UPLOAD - AUTEUR GARANTI")
    print("=" * 60)
    
    base_url = "http://localhost:8000"
    
    # Test 1: Upload sans authentification
    print("\n🎯 Test 1: Upload SANS authentification")
    print("-" * 40)
    
    data = {
        'title': 'Projet test ' + datetime.now().strftime("%H:%M:%S"),
        'description': 'Description du projet test',
        'technologies': 'Django, React, PostgreSQL',
        'cohort': 'DWWM 2024',
        'author_name': 'Jean Dupont',
        'author_email': 'jean.dupont@example.com',
        'tags': 'test,django,react'
    }
    
    try:
        response = requests.post(
            f"{base_url}/api/projects/create/",
            data=data
        )
        
        print(f"Status: {response.status_code}")
        
        if response.status_code == 201:
            result = response.json()
            print(f"✅ SUCCÈS!")
            print(f"   Message: {result['message']}")
            print(f"   Projet ID: {result['project']['id']}")
            print(f"   Titre: {result['project']['title']}")
            print(f"   Auteur: {result['project']['author']['username']}")
            print(f"   Auteur ID: {result['project']['author']['id']}")
        else:
            print(f"❌ ÉCHEC: {response.text}")
            
    except Exception as e:
        print(f"❌ Exception: {e}")
    
    # Test 2: Obtenir un token JWT
    print("\n🎯 Test 2: Authentification JWT")
    print("-" * 40)
    
    try:
        auth_response = requests.post(
            f"{base_url}/api/token/",
            json={'username': 'admin', 'password': 'admin123'},
            headers={'Content-Type': 'application/json'}
        )
        
        if auth_response.status_code == 200:
            tokens = auth_response.json()
            token = tokens['access']
            print(f"✅ Token obtenu: {token[:50]}...")
            
            # Test 3: Upload AVEC authentification
            print("\n🎯 Test 3: Upload AVEC authentification")
            print("-" * 40)
            
            headers = {
                'Authorization': f'Bearer {token}',
                'Content-Type': 'application/json'
            }
            
            auth_data = {
                'title': 'Projet authentifié ' + datetime.now().strftime("%H:%M:%S"),
                'description': 'Projet créé par utilisateur authentifié',
                'technologies': 'Python, Django REST',
                'cohort': 'DWWM Authentifié',
                'tags': 'auth,api,jwt'
            }
            
            auth_upload_response = requests.post(
                f"{base_url}/api/projects/create-auth/",
                json=auth_data,
                headers=headers
            )
            
            print(f"Status: {auth_upload_response.status_code}")
            
            if auth_upload_response.status_code == 201:
                auth_result = auth_upload_response.json()
                print(f"✅ SUCCÈS!")
                print(f"   Message: {auth_result['message']}")
                print(f"   Projet ID: {auth_result['project']['id']}")
                print(f"   Auteur: {auth_result['project']['author']['username']}")
                
                # Test 4: Mes projets
                print("\n🎯 Test 4: Mes projets")
                print("-" * 40)
                
                my_projects_response = requests.get(
                    f"{base_url}/api/projects/my-projects/",
                    headers=headers
                )
                
                print(f"Status: {my_projects_response.status_code}")
                
                if my_projects_response.status_code == 200:
                    my_projects = my_projects_response.json()
                    print(f"✅ {my_projects['count']} projets trouvés")
                    for project in my_projects['projects'][:3]:
                        print(f"   - {project['title']} (ID: {project['id']})")
                else:
                    print(f"❌ ÉCHEC mes projets: {my_projects_response.text}")
                    
            else:
                print(f"❌ ÉCHEC upload authentifié: {auth_upload_response.text}")
                
        else:
            print(f"❌ Échec authentification: {auth_response.text}")
            
    except Exception as e:
        print(f"❌ Exception: {e}")
    
    # Test 5: Vérifier GET
    print("\n🎯 Test 5: Vérification GET")
    print("-" * 40)
    
    try:
        get_response = requests.get(f"{base_url}/api/projects/")
        print(f"Status: {get_response.status_code}")
        
        if get_response.status_code == 200:
            data = get_response.json()
            print(f"✅ {data['count']} projets disponibles")
        else:
            print(f"❌ ÉCHEC GET: {get_response.text}")
            
    except Exception as e:
        print(f"❌ Exception: {e}")
    
    print("\n" + "=" * 60)
    print("🏁 TESTS TERMINÉS")
    print("=" * 60)

if __name__ == "__main__":
    test_upload()