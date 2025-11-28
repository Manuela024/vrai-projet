import os
import django

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'simplon_api.settings')
django.setup()

from django.core.mail import send_mail
from django.conf import settings

def test_email_config():
    print("🧪 TEST DE CONFIGURATION EMAIL")
    print("=" * 50)
    
    # Afficher la configuration actuelle
    print(f"📧 Host: {getattr(settings, 'EMAIL_HOST', 'Non configuré')}")
    print(f"🔑 User: {getattr(settings, 'EMAIL_HOST_USER', 'Non configuré')}")
    print(f"🚪 Port: {getattr(settings, 'EMAIL_PORT', 'Non configuré')}")
    print(f"🔒 TLS: {getattr(settings, 'EMAIL_USE_TLS', 'Non configuré')}")
    
    print("\n📤 Tentative d'envoi d'email...")
    
    try:
        # Envoyer un email de test
        send_mail(
            subject='🎯 Test Email Simplon - ' + os.environ.get('COMPUTERNAME', 'Local'),
            message='''Ceci est un test de configuration email.

📋 Détails:
- Plateforme: Simplon
- Statut: Test de configuration
- Heure: Test immédiat

Si vous recevez cet email, la configuration Gmail fonctionne correctement !''',
            from_email=getattr(settings, 'DEFAULT_FROM_EMAIL', 'Simplon Platform <test@simplon.com>'),
            recipient_list=['adouemmanuela05@gmail.com'],  # ⚠️ REMPLACEZ par VOTRE email
            html_message='''
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 10px;">
                <div style="background: #E30613; color: white; padding: 20px; text-align: center;">
                    <h1>🎯 Test Réussi !</h1>
                </div>
                <div style="padding: 30px;">
                    <h2 style="color: #E30613;">Configuration Email Simplon</h2>
                    <p>Félicitations ! Votre configuration Gmail fonctionne correctement.</p>
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <p><strong>📧 Email de test envoyé depuis:</strong> Django Backend</p>
                        <p><strong>🕒 Statut:</strong> ✅ Fonctionnel</p>
                    </div>
                    <p>Vous pouvez maintenant recevoir les emails d'activation sur tous vos appareils.</p>
                </div>
                <div style="background: #2c3e50; color: white; padding: 15px; text-align: center;">
                    <p>© 2024 Simplon.co - Plateforme interne</p>
                </div>
            </div>
            ''',
            fail_silently=False,
        )
        
        print("✅ EMAIL ENVOYÉ AVEC SUCCÈS!")
        print("📱 Vérifiez votre boîte Gmail sur tous vos appareils")
        print("🔍 Vérifiez aussi les spams si vous ne voyez pas l'email")
        
    except Exception as e:
        print(f"❌ ERREUR D'ENVOI: {e}")
        print("\n🔧 SOLUTIONS:")
        print("1. Vérifiez EMAIL_HOST_USER dans settings.py")
        print("2. Vérifiez le mot de passe d'application Gmail")
        print("3. Activez la vérification en 2 étapes sur Gmail")
        print("4. Générez un nouveau mot de passe d'application")

if __name__ == '__main__':
    test_email_config()