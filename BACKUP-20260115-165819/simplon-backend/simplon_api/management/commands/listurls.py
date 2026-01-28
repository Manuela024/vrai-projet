# simplon_api/management/commands/listurls.py
from django.core.management.base import BaseCommand
from django.urls import get_resolver

class Command(BaseCommand):
    help = 'List all URLs in the project'

    def handle(self, *args, **options):
        resolver = get_resolver()
        self.stdout.write("=" * 80)
        self.stdout.write("LISTE DES URLS DISPONIBLES")
        self.stdout.write("=" * 80)
        
        # Fonction récursive pour extraire toutes les URLs
        def print_urls(url_patterns, prefix=''):
            for pattern in url_patterns:
                if hasattr(pattern, 'url_patterns'):
                    # C'est un include
                    new_prefix = prefix + str(pattern.pattern)
                    print_urls(pattern.url_patterns, new_prefix)
                else:
                    # C'est un pattern final
                    full_url = prefix + str(pattern.pattern)
                    callback_info = str(pattern.callback)
                    name = pattern.name or 'Sans nom'
                    self.stdout.write(f"{full_url:60} -> {name:20} ({callback_info})")

        print_urls(resolver.url_patterns)
        self.stdout.write("=" * 80)