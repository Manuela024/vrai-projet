import os
import sys
import django

# Configuration pour éviter l'erreur d'encoding
sys.stdout.reconfigure(encoding='utf-8')

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'simplon_api.settings')
django.setup()

from django.urls import get_resolver

print("🔍 RECHERCHE DES URLs AVEC 'PROJECT'")
print("=" * 50)

def explore_urls(patterns, prefix=''):
    for pattern in patterns:
        if hasattr(pattern, 'url_patterns'):
            # C'est un include
            explore_urls(pattern.url_patterns, prefix + str(pattern.pattern))
        else:
            full_path = prefix + str(pattern.pattern)
            if 'project' in full_path.lower():
                print(f"✅ URL TROUVÉE: /{full_path}")
                print(f"   Nom: {pattern.name if hasattr(pattern, 'name') else 'N/A'}")
                print(f"   Callback: {pattern.callback if hasattr(pattern, 'callback') else pattern}")
                print("-" * 50)

resolver = get_resolver()
explore_urls(resolver.url_patterns)

print("\n🎯 URLs PROBABLES POUR LE FRONTEND:")
print("1. http://localhost:8000/api/projects/")
print("2. http://localhost:8000/api/projects-with-users/")
print("3. http://localhost:8000/projects/")