# test_admin_api.py
import requests
import json

BASE_URL = 'http://localhost:8000/api'

def test_admin_api():
    print("🔍 Test de l'API Admin Dashboard")
    print("=" * 60)
    
    # 1. Login pour obtenir un token
    login_data = {
        'username': 'admin',
        'password': 'admin123'  # Changez selon vos credentials
    }
    
    try:
        token_response = requests.post(f'{BASE_URL}/users/token/', data=login_data)
        token_data = token_response.json()
        
        if 'access' not in token_data:
            print("❌ Échec de l'authentification")
            print(token_data)
            return
        
        token = token_data['access']
        print(f"✅ Token obtenu: {token[:50]}...")
        
        headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        }
        
        # 2. Test de l'endpoint dashboard
        print("\n📊 Test endpoint dashboard-stats:")
        dashboard_response = requests.get(f'{BASE_URL}/users/admin/dashboard-stats/', headers=headers)
        
        if dashboard_response.status_code == 200:
            print(f"✅ Status: {dashboard_response.status_code}")
            data = dashboard_response.json()
            print(f"✅ Success: {data.get('success', 'N/A')}")
            
            if data.get('success'):
                stats = data.get('stats', {})
                print(f"📈 Statistiques:")
                print(f"   Utilisateurs: {stats.get('total_users', 'N/A')}")
                print(f"   Projets: {stats.get('total_projects', 'N/A')}")
                print(f"   En attente: {stats.get('pending_projects', 'N/A')}")
                print(f"   Publiés: {stats.get('approved_projects', 'N/A')}")
                
                print(f"👤 Utilisateurs récents: {len(data.get('recent_users', []))}")
                print(f"📁 Projets récents: {len(data.get('recent_projects', []))}")
            else:
                print(f"❌ Erreur: {data.get('error', 'Unknown error')}")
        else:
            print(f"❌ Status: {dashboard_response.status_code}")
            print(f"❌ Réponse: {dashboard_response.text}")
        
        # 3. Test de l'endpoint users
        print("\n👥 Test endpoint users:")
        users_response = requests.get(f'{BASE_URL}/users/admin/users/', headers=headers)
        
        if users_response.status_code == 200:
            print(f"✅ Status: {users_response.status_code}")
            users_data = users_response.json()
            
            if 'results' in users_data:
                print(f"✅ Format paginé détecté")
                print(f"   Total: {users_data.get('count', 'N/A')}")
                print(f"   Page: {users_data.get('page', 'N/A')}")
                print(f"   Utilisateurs sur cette page: {len(users_data['results'])}")
                
                for user in users_data['results'][:3]:  # Afficher les 3 premiers
                    print(f"   👤 {user.get('username')} - {user.get('email')}")
            else:
                print(f"✅ Format tableau détecté")
                print(f"   Utilisateurs: {len(users_data)}")
                
                for user in users_data[:3]:  # Afficher les 3 premiers
                    print(f"   👤 {user.get('username')} - {user.get('email')}")
        else:
            print(f"❌ Status: {users_response.status_code}")
            print(f"❌ Erreur: {users_response.text}")
        
        # 4. Test de l'endpoint stats
        print("\n📈 Test endpoint stats:")
        stats_response = requests.get(f'{BASE_URL}/users/admin/users/stats/', headers=headers)
        
        if stats_response.status_code == 200:
            print(f"✅ Status: {stats_response.status_code}")
            stats_data = stats_response.json()
            print(f"📊 Stats utilisateurs:")
            print(f"   Total: {stats_data.get('total_users', 'N/A')}")
            print(f"   Actifs: {stats_data.get('active_users', 'N/A')}")
            print(f"   Inactifs: {stats_data.get('inactive_users', 'N/A')}")
            print(f"   Staff: {stats_data.get('staff_users', 'N/A')}")
        else:
            print(f"❌ Status: {stats_response.status_code}")
            print(f"❌ Erreur: {stats_response.text}")
        
        print("\n" + "=" * 60)
        print("✅ Tests terminés!")
        
    except Exception as e:
        print(f"❌ Erreur globale: {str(e)}")

if __name__ == '__main__':
    test_admin_api()