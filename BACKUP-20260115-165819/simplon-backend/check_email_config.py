import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'simplon_api.settings')
django.setup()

from django.conf import settings

print("🔍 CONFIGURATION EMAIL ACTUELLE")
print("=" * 50)

print(f"📧 EMAIL_HOST: {getattr(settings, 'EMAIL_HOST', 'Non défini')}")
print(f"👤 EMAIL_HOST_USER: {getattr(settings, 'EMAIL_HOST_USER', 'Non défini')}")
print(f"🔑 EMAIL_HOST_PASSWORD: {'****' + getattr(settings, 'EMAIL_HOST_PASSWORD', 'Non défini')[-4:] if getattr(settings, 'EMAIL_HOST_PASSWORD', None) else 'Non défini'}")
print(f"🚪 EMAIL_PORT: {getattr(settings, 'EMAIL_PORT', 'Non défini')}")
print(f"🔒 EMAIL_USE_TLS: {getattr(settings, 'EMAIL_USE_TLS', 'Non défini')}")

print("=" * 50)