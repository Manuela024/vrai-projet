import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'simplon_api.settings')
django.setup()

from django.conf import settings

print("🔍 CONFIGURATION EMAIL ACTUELLE")
print("=" * 50)

print(f"📧 EMAIL_HOST: {getattr(settings, 'EMAIL_HOST', 'Non défini')}")
print(f"👤 EMAIL_HOST_USER: {getattr(settings, 'EMAIL_HOST_USER', 'Non défini')}")

# Afficher partiellement le mot de passe pour la sécurité
password = getattr(settings, 'EMAIL_HOST_PASSWORD', None)
if password:
    masked_password = '****' + password[-4:] if len(password) > 4 else '****'
else:
    masked_password = 'Non défini'
print(f"🔑 EMAIL_HOST_PASSWORD: {masked_password}")

print(f"🚪 EMAIL_PORT: {getattr(settings, 'EMAIL_PORT', 'Non défini')}")
print(f"🔒 EMAIL_USE_TLS: {getattr(settings, 'EMAIL_USE_TLS', 'Non défini')}")
print(f"📨 DEFAULT_FROM_EMAIL: {getattr(settings, 'DEFAULT_FROM_EMAIL', 'Non défini')}")

print("=" * 50)
