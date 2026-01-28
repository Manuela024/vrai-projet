# test_fix.py - Script de test complet
import requests
import json
from datetime import datetime

class APITester:
    def __init__(self, base_url="http://localhost:8000"):
        self.base_url = base_url
        self.headers = {'Content-Type': 'application/json'}
        
    def print_header(self, text):
        print("\n" + "="*60)
        print(f"🎯 {text}")
        print("="*60)
    
    def print_success(self, text):
        print(f"✅ {text}")
    
    def print_error(self, text):
        print(f"❌ {text}")
    
    def test_options(self):
        """Test OPTIONS pour voir les méthodes autorisées"""
        self.print_header("TEST OPTIONS")
        
        endpoints = [
            '/api/projects/',
            '/api/projects/create/'
        ]
        
        for endpoint in endpoints:
            try:
                response = requests.options(f"{self.base_url}{endpoint}")
                print(f"📡 {endpoint}")
                print(f"   Status: {response.status_code}")
                if response.status_code == 200:
                    print(f"   Allow: {response.headers.get('Allow', 'N/A')}")
                    if 'POST' in response.headers.get('Allow', ''):
                        self.print_success(f"POST autorisé sur {endpoint}")
                    else:
                        self.print_error(f"POST NON autorisé sur {endpoint}")
                print()
            except Exception as e:
                self.print_error(f"Erreur OPTIONS {endpoint}: {e}")
    
    def test_get_projects(self):
        """Test GET des projets"""
        self.print_header("TEST GET PROJETS")
        
        try:
            response = requests.get(f"{self.base_url}/api/projects/")
            print(f"📡 GET {self.base_url}/api/projects/")
            print(f"   Status: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                self.print_success(f"GET réussi! {data.get('count', 0)} projets trouvés")
                print(f"   Message: {data.get('message', '')}")
            else:
                self.print_error(f"Échec GET: {response.text}")
                
        except Exception as e:
            self.print_error(f"Erreur GET: {e}")
    
    def test_post_json(self):
        """Test POST avec JSON"""
        self.print_header("TEST POST JSON")
        
        project_data = {
            "title": f"Projet test JSON {datetime.now().strftime('%H:%M:%S')}",
            "description": "Ceci est un projet de test créé via JSON",
            "technologies": "Django, REST API, JSON",
            "cohort": "DWWM - Mars 2024",
            "tags": "test,api,json",
            "github_url": "https://github.com/test/projet",
            "demo_url": "https://demo.example.com",
            "status": "draft",
            "author_name": "Testeur JSON",
            "author_email": "test@json.com"
        }
        
        try:
            response = requests.post(
                f"{self.base_url}/api/projects/",
                json=project_data,
                headers=self.headers
            )
            
            print(f"📡 POST JSON sur {self.base_url}/api/projects/")
            print(f"   Status: {response.status_code}")
            print(f"   Données envoyées: {json.dumps(project_data, indent=2)}")
            
            if response.status_code == 201:
                data = response.json()
                self.print_success(f"Projet créé avec succès!")
                print(f"   ID: {data.get('project_id')}")
                print(f"   Titre: {data.get('title')}")
                print(f"   Message: {data.get('message')}")
            else:
                self.print_error(f"Échec création: {response.text}")
                
        except Exception as e:
            self.print_error(f"Erreur POST JSON: {e}")
    
    def test_post_formdata(self):
        """Test POST avec FormData"""
        self.print_header("TEST POST FORMDATA")
        
        try:
            # Créer des données FormData
            form_data = {
                "title": f"Projet FormData {datetime.now().strftime('%H:%M:%S')}",
                "description": "Projet créé avec FormData",
                "technologies": "React, FormData, Multipart",
                "cohort": "DWWM - Avril 2024",
                "author_name": "Test FormData",
                "author_email": "formdata@test.com"
            }
            
            response = requests.post(
                f"{self.base_url}/api/projects/create/",
                data=form_data
            )
            
            print(f"📡 POST FormData sur {self.base_url}/api/projects/create/")
            print(f"   Status: {response.status_code}")
            print(f"   Données envoyées: {form_data}")
            
            if response.status_code == 201:
                data = response.json()
                self.print_success(f"Projet créé avec succès via FormData!")
                print(f"   ID: {data.get('project', {}).get('id')}")
                print(f"   Titre: {data.get('project', {}).get('title')}")
                print(f"   Message: {data.get('message')}")
            else:
                self.print_error(f"Échec création FormData: {response.text}")
                
        except Exception as e:
            self.print_error(f"Erreur POST FormData: {e}")
    
    def test_jwt_token(self):
        """Test JWT Token"""
        self.print_header("TEST JWT TOKEN")
        
        try:
            # Tentative d'obtention de token (vous devrez ajuster les credentials)
            auth_data = {
                "username": "admin",
                "password": "admin123"
            }
            
            response = requests.post(
                f"{self.base_url}/api/token/",
                json=auth_data,
                headers=self.headers
            )
            
            print(f"📡 POST {self.base_url}/api/token/")
            print(f"   Status: {response.status_code}")
            
            if response.status_code == 200:
                tokens = response.json()
                self.print_success("Token JWT obtenu!")
                print(f"   Access token: {tokens.get('access', '')[0:50]}...")
                print(f"   Refresh token: {tokens.get('refresh', '')[0:50]}...")
                
                # Tester l'accès authentifié
                if 'access' in tokens:
                    auth_headers = {
                        'Authorization': f'Bearer {tokens["access"]}',
                        'Content-Type': 'application/json'
                    }
                    
                    # Tester my-projects avec token
                    my_projects_response = requests.get(
                        f"{self.base_url}/api/projects/my-projects/",
                        headers=auth_headers
                    )
                    
                    print(f"\n🔐 Test my-projects avec token:")
                    print(f"   Status: {my_projects_response.status_code}")
                    if my_projects_response.status_code == 200:
                        self.print_success("Accès authentifié réussi!")
                    else:
                        self.print_error(f"Échec accès authentifié: {my_projects_response.text}")
            else:
                self.print_error(f"Échec authentification: {response.text}")
                
        except Exception as e:
            self.print_error(f"Erreur JWT: {e}")
    
    def test_all(self):
        """Exécuter tous les tests"""
        print("\n" + "="*60)
        print("🚀 DÉBUT DES TESTS DE L'API")
        print("="*60)
        
        self.test_options()
        self.test_get_projects()
        self.test_post_json()
        self.test_post_formdata()
        self.test_jwt_token()
        
        print("\n" + "="*60)
        print("🏁 TESTS TERMINÉS")
        print("="*60)

if __name__ == "__main__":
    tester = APITester()
    tester.test_all()