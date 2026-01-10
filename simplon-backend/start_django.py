# start_django.py
import os
import sys
import django
from django.core.management import execute_from_command_line

# Désactiver les migrations
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'simplon_api.settings')

class DisableMigrations:
    def __contains__(self, item):
        return True
    def __getitem__(self, item):
        return None

# Monkey patch pour bypass les migrations
import django.core.management.commands.runserver
original_check_migrations = django.core.management.commands.runserver.Command.check_migrations

def patched_check_migrations(self):
    print("⚠️ Migrations désactivées - Mode de secours")
    return

django.core.management.commands.runserver.Command.check_migrations = patched_check_migrations

if __name__ == '__main__':
    # Démarrer le serveur directement
    from django.core.management.commands.runserver import Command as RunServer
    from django.core.servers.basehttp import run
    
    print("==========================================")
    print("🚀 DJANGO - MODE DÉMARRAGE RAPIDE")
    print("==========================================")
    print("⚠️ Migrations désactivées")
    print("📡 Serveur démarré sur http://127.0.0.1:8000")
    print("==========================================")
    
    # Configurer Django
    django.setup()
    
    # Créer une commande runserver personnalisée
    from django.core.management import execute_from_command_line
    
    # Remplacer sys.argv
    sys.argv = ['manage.py', 'runserver', '--noreload', '--skip-checks']
    
    try:
        execute_from_command_line(sys.argv)
    except SystemExit:
        pass