# test_api_simple.py
import requests
import json

def test_api():
    print("🧪 TEST DE L'API DJANGO")
    print("=" * 50)
    
    endpoints = [
        "http://localhost:8000/api/projects/",
        "http://localhost:8000/api/projects/all/",
        "http://localhost:8000/api/projects/stats/",
        "http://localhost:8000/api/projects/status/"
    ]
    
    for url in endpoints:
        try:
            print(f"\n🔗 Testing: {url}")
            response = requests.get(url, timeout=5)
            
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Status: {response.status_code}")
                
                if 'count' in data:
                    print(f"📊 Nombre de projets: {data['count']}")
                elif isinstance(data, list):
                    print(f"📊 Nombre de projets: {len(data)}")
                elif 'projects' in data and isinstance(data['projects'], list):
                    print(f"📊 Nombre de projets: {len(data['projects'])}")
                
                # Afficher les 2 premiers titres
                projects = []
                if isinstance(data, list):
                    projects = data[:2]
                elif 'projects' in data:
                    projects = data['projects'][:2]
                elif 'results' in data:
                    projects = data['results'][:2]
                
                for i, p in enumerate(projects, 1):
                    if isinstance(p, dict):
                        print(f"  {i}. {p.get('title', 'Sans titre')}")
                
            else:
                print(f"❌ Status: {response.status_code}")
                
        except Exception as e:
            print(f"❌ Erreur: {e}")
    
    print("\n" + "=" * 50)
    print("🎯 Si /api/projects/ retourne 200 avec des données,")
    print("   utilisez CETTE URL dans Explore.jsx !")

if __name__ == "__main__":
    test_api()