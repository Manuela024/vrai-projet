import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'simplon_api.settings')
django.setup()

from django.core.mail import send_mail
from django.conf import settings

print("🧪 TEST CONFIGURATION CORRIGÉE")
print("=" * 50)

print(f"📧 Envoi depuis: {settings.EMAIL_HOST_USER}")
print(f"📨 Vers: adouemmanuela05@gmail.com")

try:
    send_mail(
        subject='✅ Test Réussi - Configuration Simplon',
        message='Félicitations ! Votre configuration email fonctionne maintenant correctement.',
        from_email=None,  # Utilisera DEFAULT_FROM_EMAIL
        recipient_list=['adouemmanuela05@gmail.com'],  # Envoyez à vous-même
        html_message='''
        <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h1 style="color: #E30613;">🎉 Test Réussi !</h1>
            <p>Votre configuration Gmail pour la plateforme Simplon fonctionne parfaitement.</p>
            <div style="background: #f0f8ff; padding: 15px; border-radius: 5px;">
                <p><strong>Email:</strong> adouemmanuela05@gmail.com</p>
                <p><strong>Statut:</strong> ✅ Opérationnel</p>
            </div>
        </div>
        ''',
        fail_silently=False,
    )
    print("✅ EMAIL ENVOYÉ AVEC SUCCÈS !")
    print("📱 Vérifiez votre boîte Gmail sur tous vos appareils")
    
except Exception as e:
    print(f"❌ ERREUR: {e}")
    print("\n🔧 ACTIONS REQUISES:")
    print("1. Vérifiez que EMAIL_HOST_USER et DEFAULT_FROM_EMAIL sont identiques")
    print("2. Générez un nouveau mot de passe d'application Gmail")
    print("3. Activez la validation en 2 étapes sur Gmail")