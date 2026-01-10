# check_data.py
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'simplon_api.settings')
django.setup()

from django.contrib.auth.models import User
from projects.models import Project

print("🔍 VÉRIFICATION DES DONNÉES")
print("=" * 50)

# 1. Lister tous les utilisateurs
print("\n👥 UTILISATEURS:")
for user in User.objects.all():
    print(f"  - {user.username} (ID: {user.id})")

# 2. Lister tous les projets
print("\n📁 PROJETS:")
for project in Project.objects.all():
    print(f"  - {project.title} (ID: {project.id})")
    print(f"    Auteur: {project.author.username if project.author else 'None'}")
    print(f"    Statut: {project.status}")
    print()

# 3. Compter les projets par utilisateur
print("\n📊 PROJETS PAR UTILISATEUR:")
for user in User.objects.all():
    projects_count = Project.objects.filter(author=user).count()
    if projects_count > 0:
        print(f"  - {user.username}: {projects_count} projet(s)")
        projects = Project.objects.filter(author=user)
        for p in projects:
            print(f"    • {p.title} ({p.status})")

# 4. Vérifier l'utilisateur simplon_2025001
print("\n🔎 DÉTAILS simplon_2025001:")
user = User.objects.filter(username="simplon_2025001").first()
if user:
    print(f"  ID: {user.id}")
    print(f"  Email: {user.email}")
    print(f"  Nom: {user.first_name} {user.last_name}")
    
    projects = Project.objects.filter(author=user)
    print(f"  Projets: {projects.count()}")
    for p in projects:
        print(f"    - {p.title} (ID: {p.id}, Statut: {p.status})")
else:
    print("  ❌ Utilisateur non trouvé!")