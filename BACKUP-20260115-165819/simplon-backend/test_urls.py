# test_urls.py
import os
import sys
import django

# Configurez Django
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'simplon_api.settings')
django.setup()

from django.urls import get_resolver

print("=" * 80)
print("URLS DISPONIBLES DANS VOTRE PROJET")
print("=" * 80)

def explore_urls(url_patterns, prefix='', indent=0):
    for pattern in url_patterns:
        if hasattr(pattern, 'url_patterns'):
            # C'est un include
            new_prefix = prefix + str(pattern.pattern)
            print("  " * indent + f"├─📁 {str(pattern.pattern)}")
            explore_urls(pattern.url_patterns, new_prefix, indent + 1)
        else:
            # C'est un pattern final
            full_url = prefix + str(pattern.pattern)
            name = pattern.name or '(sans nom)'
            print("  " * indent + f"├─🔗 {full_url}")
            print("  " * (indent + 1) + f"└─ Nom: {name}")

resolver = get_resolver()
explore_urls(resolver.url_patterns)
print("=" * 80)