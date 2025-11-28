from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings
from .models import MatriculeAutorise
from .serializers import UserSerializer
import secrets
from datetime import timedelta
from rest_framework.views import APIView
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes

class UserProfileView(generics.RetrieveAPIView):
    """Vue pour récupérer le profil de l'utilisateur connecté"""
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer
    
    def get_object(self):
        return self.request.user

class RequestLoginView(generics.GenericAPIView):
    """Vue pour demander un lien d'activation par email"""
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        matricule = request.data.get('matricule')
        email = request.data.get('email')
        
        print("=" * 70)
        print("🔐 DEMANDE D'INSCRIPTION REÇUE")
        print("=" * 70)
        print(f"📋 Matricule: {matricule}")
        print(f"📧 Email: {email}")
        
        # Vérifier si le matricule est autorisé
        try:
            matricule_autorise = MatriculeAutorise.objects.get(
                matricule=matricule,
                est_actif=True
            )
            
            # Générer un token sécurisé valable 5 minutes
            token = secrets.token_urlsafe(32)
            expiration_time = timezone.now() + timedelta(minutes=5)
            
            # Sauvegarder le token et son expiration
            matricule_autorise.activation_token = token
            matricule_autorise.token_expiration = expiration_time
            matricule_autorise.save()
            
            activation_link = f"http://localhost:3001/setup-password?token={token}&matricule={matricule}&email={email}"
            
            print(f"✅ MATRICULE AUTORISÉ: {matricule}")
            print(f"⏰ Token généré: {token}")
            print(f"🕒 Expire à: {expiration_time.strftime('%H:%M:%S')} (dans 5 minutes)")
            print("=" * 70)
            
            # ==================== ENVOI EMAIL ====================
            print(f"📧 ENVOI EMAIL À: {email}")
            
            subject = '🎯 Activez votre compte Simplon - Lien rapide!'
            
            html_message = f"""
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden;">
                <div style="background: linear-gradient(135deg, #E30613, #B80505); color: white; padding: 25px; text-align: center;">
                    <h1 style="margin: 0; font-size: 28px;">🚀 Plateforme Simplon</h1>
                    <p style="margin: 5px 0 0 0; opacity: 0.9;">Activation de votre compte</p>
                </div>
                
                <div style="padding: 30px; background: #ffffff;">
                    <h2 style="color: #E30613; margin-top: 0;">Bonjour,</h2>
                    <p style="font-size: 16px; line-height: 1.6; color: #333;">
                        Vous avez demandé à créer un compte sur la plateforme interne Simplon.
                    </p>
                    
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #E30613;">
                        <p style="margin: 0; font-size: 16px;">
                            <strong style="color: #E30613;">📋 Matricule :</strong> {matricule}<br>
                            <strong style="color: #E30613;">📧 Email :</strong> {email}
                        </p>
                    </div>
                    
                    <p style="text-align: center; margin: 30px 0;">
                        <a href="{activation_link}" 
                           style="background: linear-gradient(135deg, #E30613, #B80505); 
                                  color: white; padding: 16px 35px; 
                                  text-decoration: none; border-radius: 8px; 
                                  font-size: 18px; font-weight: bold;
                                  display: inline-block; 
                                  box-shadow: 0 4px 15px rgba(227, 6, 19, 0.3);">
                            ✅ Activer mon compte
                        </a>
                    </p>
                    
                    <div style="background: #fff3f3; padding: 15px; border-radius: 6px; margin: 20px 0; border: 2px solid #E30613;">
                        <p style="margin: 0; font-size: 14px; color: #d32f2f; text-align: center;">
                            <strong>⚠️ URGENT :</strong> Ce lien expirera dans <strong>5 MINUTES</strong><br>
                            <small>Expire à : {expiration_time.strftime('%H:%M:%S')}</small>
                        </p>
                    </div>
                    
                    <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #eee;">
                        <p style="font-size: 14px; color: #666; margin-bottom: 10px;">
                            <strong>Lien alternatif :</strong> Si le bouton ne fonctionne pas, copiez-collez ce lien dans votre navigateur :
                        </p>
                        <div style="background: #f5f5f5; padding: 12px; border-radius: 6px; border: 1px solid #ddd;">
                            <code style="word-break: break-all; font-size: 12px; color: #333;">
                                {activation_link}
                            </code>
                        </div>
                    </div>
                </div>
                
                <div style="background: #2c3e50; color: white; padding: 20px; text-align: center;">
                    <p style="margin: 0; font-size: 14px;">
                        <strong>© 2025 Simplon.co - Plateforme interne</strong>
                    </p>
                    <p style="margin: 5px 0 0 0; font-size: 12px; opacity: 0.8;">
                        Cet email a été envoyé automatiquement, merci de ne pas y répondre.
                    </p>
                </div>
            </div>
            """
            
            plain_message = f"""ACTIVATION DE COMPTE - PLATEFORME SIMPLON

Bonjour,

Vous avez demandé à créer un compte sur la plateforme interne Simplon.

INFORMATIONS :
📋 Matricule : {matricule}
📧 Email : {email}

POUR ACTIVER VOTRE COMPTE :
Cliquez sur le lien suivant :
{activation_link}

⚠️ URGENT :
Ce lien d'activation expirera dans 5 MINUTES!
Expire à : {expiration_time.strftime('%H:%M:%S')}

Si vous n'avez pas demandé cette inscription, vous pouvez ignorer cet email.

Cordialement,
L'équipe Simplon

---
© 2025 Simplon.co - Plateforme interne
Cet email a été envoyé automatiquement.
"""
            
            # ENVOI EMAIL RÉEL
            try:
                send_mail(
                    subject=subject,
                    message=plain_message,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[email],
                    html_message=html_message,
                    fail_silently=False,
                )
                
                print(f"✅ EMAIL RÉEL ENVOYÉ avec succès à: {email}")
                print("⏰ Le lien expirera dans 5 minutes")
                print("=" * 70)
                
                return Response({
                    "message": "✅ Lien d'activation envoyé ! ⏰ Valable 5 minutes - Vérifiez vite votre email!",
                    "status": "success",
                    "expires_in": "5 minutes"
                }, status=status.HTTP_200_OK)
                
            except Exception as e:
                print(f"❌ ERREUR ENVOI EMAIL: {str(e)}")
                print("=" * 70)
                return Response({
                    "message": f"⚠️ Erreur d'envoi d'email. Utilisez ce lien (valable 5 minutes): {activation_link}",
                    "activation_link": activation_link,
                    "status": "success",
                    "expires_in": "5 minutes"
                }, status=status.HTTP_200_OK)
            
        except MatriculeAutorise.DoesNotExist:
            print("❌ MATRICULE NON AUTORISÉ")
            print("=" * 70)
            return Response({
                "message": "❌ Matricule non autorisé ou introuvable.",
                "status": "error"
            }, status=status.HTTP_400_BAD_REQUEST)

class SetupPasswordView(generics.GenericAPIView):
    """Vue pour finaliser la création du compte avec mot de passe"""
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        token = request.data.get('token')
        matricule = request.data.get('matricule')
        email = request.data.get('email')
        username = request.data.get('username')
        password = request.data.get('password')
        
        print("=" * 70)
        print(" VÉRIFICATION DU LIEN D'ACTIVATION - DEBUG")
        print("=" * 70)
        print(f" Matricule: {matricule}")
        print(f" Email: {email}")
        print(f" Token: {token}")
        print(f" Heure actuelle: {timezone.now()}")
        
        try:
            # Vérifier le matricule
            matricule_autorise = MatriculeAutorise.objects.get(
                matricule=matricule,
                est_actif=True
            )
            
            print(f"✅ Matricule trouvé: {matricule_autorise.matricule}")
            print(f" Token stocké: {matricule_autorise.activation_token}")
            print(f" Expiration stockée: {matricule_autorise.token_expiration}")
            
            # Vérifier si le token correspond
            if not matricule_autorise.activation_token or matricule_autorise.activation_token != token:
                print("❌ TOKEN INVALIDE OU MANQUANT")
                print(f"   Token attendu: {matricule_autorise.activation_token}")
                print(f"   Token reçu: {token}")
                return Response({
                    "message": "❌ Lien d'activation invalide ou déjà utilisé.",
                    "status": "error"
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Vérifier si le token est expiré
            if matricule_autorise.is_token_expired():
                print("❌ TOKEN EXPIRÉ - DÉTAILS:")
                time_diff = timezone.now() - matricule_autorise.token_expiration
                print(f"   Temps écoulé depuis expiration: {time_diff}")
                print(f"   Secondes écoulées: {time_diff.total_seconds()}s")
                print(f"   Minutes écoulées: {time_diff.total_seconds() / 60}min")
                
                return Response({
                    "message": "❌ Le lien d'activation a expiré. Il n'était valable que 5 minutes. Veuillez demander un nouveau lien.",
                    "status": "error",
                    "expired": True
                }, status=status.HTTP_400_BAD_REQUEST)
            
            print("✅ TOKEN VALIDE ET NON EXPIRÉ")
            remaining_seconds = matricule_autorise.get_remaining_time()
            print(f"   Temps restant: {remaining_seconds} secondes")
            print(f"   Soit: {remaining_seconds / 60} minutes")
            
            # Vérifier si le username est disponible
            if User.objects.filter(username=username).exists():
                print("❌ Username déjà pris")
                return Response({
                    "message": "❌ Ce nom d'utilisateur est déjà pris.",
                    "status": "error"
                }, status=status.HTTP_400_BAD_REQUEST)
            
            #  CORRECTION CRITIQUE : Vérification email améliorée
            # Vérifier si l'email est déjà utilisé par un AUTRE utilisateur
            existing_user_with_email = User.objects.filter(email=email).first()
            if existing_user_with_email:
                # Si l'email existe déjà, vérifier si c'est pour le même matricule
                if existing_user_with_email.username != matricule:
                    print(f"❌ Email déjà utilisé par un autre matricule: {existing_user_with_email.username}")
                    return Response({
                        "message": "❌ Cet email est déjà associé à un autre compte.",
                        "status": "error"
                    }, status=status.HTTP_400_BAD_REQUEST)
                else:
                    print(f"✅ Email réutilisé pour le même matricule: {matricule}")
                    # C'est le même utilisateur qui réutilise son email - on peut continuer
            
            # Créer ou mettre à jour l'utilisateur
            user, created = User.objects.get_or_create(
                username=matricule,  # Utiliser le matricule comme username
                defaults={
                    'email': email,
                    'password': password,  # Sera hashé par create_user
                    'first_name': '',
                    'last_name': ''
                }
            )
            
            if not created:
                # Mettre à jour l'utilisateur existant
                user.email = email
                user.set_password(password)  # Hash le mot de passe
                user.save()
                print(f"✅ COMPTE MIS À JOUR: {username}")
            else:
                print(f"✅ NOUVEAU COMPTE CRÉÉ: {username}")
            
            # Marquer le matricule comme activé
            matricule_autorise.date_activation = timezone.now()
            matricule_autorise.activation_token = None
            matricule_autorise.token_expiration = None
            matricule_autorise.save()
            
            print(f"✅ COMPTE CRÉÉ/MIS À JOUR AVEC SUCCÈS!")
            print(f"Username: {username}")
            print(f" Email: {email}")
            print(f" ID: {user.id}")
            print("=" * 70)
            
            return Response({
                "message": "✅ Compte créé avec succès ! Vous pouvez maintenant vous connecter.",
                "status": "success",
                "username": username
            }, status=status.HTTP_200_OK)
            
        except MatriculeAutorise.DoesNotExist:
            print("❌ MATRICULE NON AUTORISÉ")
            print("=" * 70)
            return Response({
                "message": "❌ Matricule non autorisé ou introuvable.",
                "status": "error"
            }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(f"❌ ERREUR: {str(e)}")
            print("=" * 70)
            return Response({
                "message": f"❌ Erreur: {str(e)}",
                "status": "error"
            }, status=status.HTTP_400_BAD_REQUEST)
        
class DirectLoginView(generics.GenericAPIView):
    """Vue pour connexion directe avec username/password"""
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        print("=" * 70)
        print(f" TENTATIVE DE CONNEXION: {username}")
        
        from django.contrib.auth import authenticate
        
        user = authenticate(username=username, password=password)
        
        if user is not None:
            from rest_framework_simplejwt.tokens import RefreshToken
            refresh = RefreshToken.for_user(user)
            
            print(f"✅ CONNEXION RÉUSSIE: {user.username}")
            print(f" Email: {user.email}")
            print(f" ID: {user.id}")
            print("=" * 70)
            
            return Response({
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name
                }
            })
        else:
            print("❌ IDENTIFIANTS INCORRECTS")
            print("=" * 70)
            return Response({
                "error": "❌ Identifiants incorrects"
            }, status=status.HTTP_401_UNAUTHORIZED)

# class QuickLoginView(generics.GenericAPIView):
#     """Vue pour connexion rapide avec matricule/mot de passe"""
#     permission_classes = [permissions.AllowAny]
    
#     def post(self, request):
#         matricule = request.data.get('matricule')
#         password = request.data.get('password')
        
#         print("=" * 70)
#         print("⚡ CONNEXION RAPIDE TENTATIVE")
#         print("=" * 70)
#         print(f"📋 Matricule: {matricule}")
#         print(f"🔑 Password: {'*' * len(password) if password else 'None'}")
        
#         # 1. Vérifier si le matricule est autorisé ET activé
#         try:
#             matricule_autorise = MatriculeAutorise.objects.get(
#                 matricule=matricule,
#                 est_actif=True,
#                 date_activation__isnull=False
#             )
#             print(f"✅ MATRICULE AUTORISÉ ET ACTIVÉ: {matricule}")
            
#         except MatriculeAutorise.DoesNotExist:
#             print("❌ MATRICULE NON ACTIVÉ OU INTROUVABLE")
#             return Response({
#                 "error": "❌ Compte non activé. Utilisez 'Activer mon compte' pour créer votre compte d'abord.",
#                 "code": "ACCOUNT_NOT_ACTIVATED"
#             }, status=status.HTTP_400_BAD_REQUEST)
        
#         # 2. Authentifier avec Django (matricule comme username)
#         from django.contrib.auth import authenticate
#         user = authenticate(username=matricule, password=password)
        
#         if user is not None:
#             from rest_framework_simplejwt.tokens import RefreshToken
#             refresh = RefreshToken.for_user(user)
            
#             print(f"✅ CONNEXION RAPIDE RÉUSSIE: {user.username}")
#             print(f"📧 Email: {user.email}")
#             print(f"🆔 ID: {user.id}")
#             print("=" * 70)
            
#             return Response({
#                 "access": str(refresh.access_token),
#                 "refresh": str(refresh),
#                 "user": {
#                     "id": user.id,
#                     "username": user.username,
#                     "email": user.email,
#                     "first_name": user.first_name,
#                     "last_name": user.last_name
#                 },
#                 "message": "✅ Connexion réussie !"
#             })
#         else:
#             print("❌ MOT DE PASSE INCORRECT")
#             print("=" * 70)
#             return Response({
#                 "error": "❌ Matricule ou mot de passe incorrect",
#                 "code": "INVALID_CREDENTIALS"
#             }, status=status.HTTP_401_UNAUTHORIZED)

class QuickLoginView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        matricule = request.data.get('matricule')
        username = request.data.get('username')  # ⭐ AJOUT: Support username
        password = request.data.get('password')
        
        print("=" * 70)
        print("⚡ CONNEXION RAPIDE TENTATIVE - DEBUG DÉTAILLÉ")
        print("=" * 70)
        print(f"📋 Données reçues: {request.data}")
        print(f"📋 Matricule: {matricule}")
        print(f"👤 Username: {username}") 
        print(f"🔑 Password: {'*' * len(password) if password else 'None'}")
        
        # ⭐ CORRECTION : Utiliser username OU matricule
        login_identifier = username or matricule
        
        if not login_identifier:
            print("❌ ERREUR: Aucun identifiant fourni (username ou matricule)")
            return Response({
                "error": "Identifiant manquant. Fournissez un username ou matricule.",
                "code": "MISSING_IDENTIFIER"
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if not password:
            print("❌ ERREUR: Mot de passe manquant")
            return Response({
                "error": "Mot de passe manquant.",
                "code": "MISSING_PASSWORD"
            }, status=status.HTTP_400_BAD_REQUEST)

        # 1. Vérifier si le matricule est autorisé ET activé
        try:
            matricule_autorise = MatriculeAutorise.objects.get(
                matricule=login_identifier,
                est_actif=True,
                date_activation__isnull=False
            )
            print(f"✅ MATRICULE AUTORISÉ ET ACTIVÉ: {login_identifier}")
            
        except MatriculeAutorise.DoesNotExist:
            print(f"❌ MATRICULE NON ACTIVÉ OU INTROUVABLE: {login_identifier}")
            return Response({
                "error": "❌ Compte non activé. Utilisez 'Activer mon compte' pour créer votre compte d'abord.",
                "code": "ACCOUNT_NOT_ACTIVATED"
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # 2. Authentifier avec Django
        from django.contrib.auth import authenticate
        user = authenticate(username=login_identifier, password=password)
        
        print(f"🔐 RÉSULTAT AUTHENTIFICATION: {user}")
        
        if user is not None:
            from rest_framework_simplejwt.tokens import RefreshToken
            refresh = RefreshToken.for_user(user)
            
            print(f"✅ CONNEXION RAPIDE RÉUSSIE: {user.username}")
            print(f"📧 Email: {user.email}")
            print(f"🆔 ID: {user.id}")
            print("=" * 70)
            
            return Response({
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name
                },
                "message": "✅ Connexion réussie !"
            })
        else:
            print("❌ ÉCHEC AUTHENTIFICATION - Vérifier:")
            print(f"   - Identifiant: {login_identifier}")
            print(f"   - Utilisateur existe: {User.objects.filter(username=login_identifier).exists()}")
            
            # Vérifier si l'utilisateur existe mais le mot de passe est incorrect
            if User.objects.filter(username=login_identifier).exists():
                print("   - ❌ Mot de passe incorrect")
                return Response({
                    "error": "❌ Mot de passe incorrect",
                    "code": "INVALID_PASSWORD"
                }, status=status.HTTP_401_UNAUTHORIZED)
            else:
                print("   - ❌ Utilisateur non trouvé")
                return Response({
                    "error": "❌ Identifiant non trouvé",
                    "code": "USER_NOT_FOUND"
                }, status=status.HTTP_401_UNAUTHORIZED)


class ForgotPasswordView(APIView):
    """Vue pour demande de réinitialisation de mot de passe"""
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        email = request.data.get('email')
        print("=" * 70)
        print("🔐 DEMANDE RÉINITIALISATION MOT DE PASSE")
        print("=" * 70)
        print(f"📧 Email reçu: {email}")
        
        try:
            # Vérifier si l'utilisateur existe
            user = User.objects.get(email=email)
            
            print(f"✅ UTILISATEUR TROUVÉ: {user.username} (ID: {user.id})")
            
            # Générer un token sécurisé de réinitialisation
            reset_token = secrets.token_urlsafe(32)
            expiration_time = timezone.now() + timedelta(minutes=15)
            
            # Stocker le token dans un matricule temporaire
            matricule_autorise, created = MatriculeAutorise.objects.get_or_create(
                matricule=f"reset_{user.id}",
                defaults={
                    'est_actif': True,
                    'date_activation': timezone.now()
                }
            )
            
            # Stocker le token
            matricule_autorise.activation_token = reset_token
            matricule_autorise.token_expiration = expiration_time
            matricule_autorise.save()
            
            print(f"✅ TOKEN STOCKÉ POUR L'UTILISATEUR: {user.username}")
            print(f"🔑 Token généré: {reset_token}")
            print(f"⏰ Expire à: {expiration_time}")
            
            reset_link = f"http://localhost:3001/reset-password?token={reset_token}&email={email}"
            
            print(f"✅ DEMANDE ACCEPTÉE POUR: {email}")
            print("=" * 70)
            
            # ==================== ENVOI EMAIL SÉCURISÉ ====================
            subject = '🔒 Réinitialisation de votre mot de passe - Plateforme Simplon'
            
            html_message = f"""
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden;">
                <div style="background: linear-gradient(135deg, #E30613, #B80505); color: white; padding: 25px; text-align: center;">
                    <h1 style="margin: 0; font-size: 28px;">🔒 Plateforme Simplon</h1>
                    <p style="margin: 5px 0 0 0; opacity: 0.9;">Réinitialisation de mot de passe</p>
                </div>
                
                <div style="padding: 30px; background: #ffffff;">
                    <h2 style="color: #E30613; margin-top: 0;">Bonjour,</h2>
                    <p style="font-size: 16px; line-height: 1.6; color: #333;">
                        Vous avez demandé à réinitialiser votre mot de passe pour la plateforme interne Simplon.
                    </p>
                    
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #E30613;">
                        <p style="margin: 0; font-size: 16px;">
                            <strong style="color: #E30613;">📧 Email :</strong> {email}<br>
                            <strong style="color: #E30613;">👤 Nom d'utilisateur :</strong> {user.username}<br>
                            <strong style="color: #E30613;">⏰ Lien valable :</strong> 15 minutes
                        </p>
                    </div>
                    
                    <p style="text-align: center; margin: 30px 0;">
                        <a href="{reset_link}" 
                           style="background: linear-gradient(135deg, #E30613, #B80505); 
                                  color: white; padding: 16px 35px; 
                                  text-decoration: none; border-radius: 8px; 
                                  font-size: 18px; font-weight: bold;
                                  display: inline-block; 
                                  box-shadow: 0 4px 15px rgba(227, 6, 19, 0.3);">
                            🔑 Réinitialiser mon mot de passe
                        </a>
                    </p>
                    
                    <div style="background: #fff3f3; padding: 15px; border-radius: 6px; margin: 20px 0; border: 2px solid #E30613;">
                        <p style="margin: 0; font-size: 14px; color: #d32f2f; text-align: center;">
                            <strong>⚠️ SÉCURITÉ :</strong> Ce lien expirera dans <strong>15 MINUTES</strong><br>
                            <small>Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.</small>
                        </p>
                    </div>
                    
                    <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #eee;">
                        <p style="font-size: 14px; color: #666; margin-bottom: 10px;">
                            <strong>Lien alternatif :</strong> Si le bouton ne fonctionne pas, copiez-collez ce lien dans votre navigateur :
                        </p>
                        <div style="background: #f5f5f5; padding: 12px; border-radius: 6px; border: 1px solid #ddd;">
                            <code style="word-break: break-all; font-size: 12px; color: #333;">
                                {reset_link}
                            </code>
                        </div>
                    </div>
                </div>
                
                <div style="background: #2c3e50; color: white; padding: 20px; text-align: center;">
                    <p style="margin: 0; font-size: 14px;">
                        <strong>© 2025 Simplon.co - Plateforme interne</strong>
                    </p>
                    <p style="margin: 5px 0 0 0; font-size: 12px; opacity: 0.8;">
                        Cet email a été envoyé automatiquement, merci de ne pas y répondre.
                    </p>
                </div>
            </div>
            """
            
            plain_message = f"""RÉINITIALISATION DE MOT DE PASSE - PLATEFORME SIMPLON

Bonjour,

Vous avez demandé à réinitialiser votre mot de passe pour la plateforme interne Simplon.

INFORMATIONS :
📧 Email : {email}
👤 Nom d'utilisateur : {user.username}

POUR RÉINITIALISER VOTRE MOT DE PASSE :
Cliquez sur le lien suivant :
{reset_link}

⚠️ SÉCURITÉ :
Ce lien de réinitialisation expirera dans 15 MINUTES!
Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.

Cordialement,
L'équipe Simplon

---
© 2025 Simplon.co - Plateforme interne
Cet email a été envoyé automatiquement.
"""
            
            try:
                send_mail(
                    subject=subject,
                    message=plain_message,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[email],
                    html_message=html_message,
                    fail_silently=False,
                )
                
                print(f"✅ EMAIL DE RÉINITIALISATION ENVOYÉ À: {email}")
                print("=" * 70)
                
                return Response({
                    "message": "✅ Si votre email est enregistré, un lien de réinitialisation a été envoyé. Vérifiez votre boîte mail (valable 15 minutes).",
                    "status": "success"
                }, status=status.HTTP_200_OK)
                
            except Exception as e:
                print(f"❌ ERREUR ENVOI EMAIL: {str(e)}")
                import traceback
                traceback.print_exc()
                print("=" * 70)
                return Response({
                    "message": "❌ Erreur d'envoi d'email. Veuillez réessayer.",
                    "status": "error"
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
        except User.DoesNotExist:
            print("❌ EMAIL NON TROUVÉ DANS LA BASE")
            print("=" * 70)
            # Pour la sécurité, on retourne toujours un succès
            return Response({
                "message": "✅ Si votre email est enregistré, un lien de réinitialisation a été envoyé. Vérifiez votre boîte mail (valable 15 minutes).",
                "status": "success"
            }, status=status.HTTP_200_OK)

class ResetPasswordView(generics.GenericAPIView):
    """Vue pour finaliser la réinitialisation du mot de passe"""
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        token = request.data.get('token')
        email = request.data.get('email')
        new_password = request.data.get('new_password')
        
        print("=" * 70)
        print("🔐 TENTATIVE RÉINITIALISATION MOT DE PASSE")
        print("=" * 70)
        print(f"📧 Email: {email}")
        print(f"🎫 Token: {token}")
        print(f"🕒 Heure actuelle: {timezone.now()}")
        
        try:
            user = User.objects.get(email=email)
            
            print(f"✅ UTILISATEUR TROUVÉ: {user.username}")
            
            # Chercher le token dans le matricule temporaire
            try:
                matricule_autorise = MatriculeAutorise.objects.get(
                    matricule=f"reset_{user.id}",
                    est_actif=True
                )
                
                print(f"🔑 Token stocké: {matricule_autorise.activation_token}")
                print(f"⏰ Expiration stockée: {matricule_autorise.token_expiration}")
                
                # Vérifier si le token correspond et n'est pas expiré
                if (not matricule_autorise.activation_token or 
                    matricule_autorise.activation_token != token or
                    matricule_autorise.is_token_expired()):
                    
                    print("❌ TOKEN INVALIDE OU EXPIRÉ")
                    return Response({
                        "message": "❌ Lien de réinitialisation invalide ou expiré. Veuillez demander un nouveau lien.",
                        "status": "error",
                        "expired": True
                    }, status=status.HTTP_400_BAD_REQUEST)
                
                print("✅ TOKEN VALIDE ET NON EXPIRÉ")
                
                # Réinitialiser le mot de passe
                user.set_password(new_password)
                user.save()
                
                # Nettoyer le token après utilisation
                matricule_autorise.activation_token = None
                matricule_autorise.token_expiration = None
                matricule_autorise.save()
                
                print(f"✅ MOT DE PASSE RÉINITIALISÉ POUR: {user.username}")
                print("=" * 70)
                
                return Response({
                    "message": "✅ Mot de passe réinitialisé avec succès ! Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.",
                    "status": "success"
                }, status=status.HTTP_200_OK)
                
            except MatriculeAutorise.DoesNotExist:
                print("❌ TOKEN DE RÉINITIALISATION NON TROUVÉ")
                return Response({
                    "message": "❌ Lien de réinitialisation invalide. Veuillez demander un nouveau lien.",
                    "status": "error"
                }, status=status.HTTP_400_BAD_REQUEST)
            
        except User.DoesNotExist:
            print("❌ UTILISATEUR NON TROUVÉ")
            print("=" * 70)
            return Response({
                "message": "❌ Erreur lors de la réinitialisation. Veuillez vérifier vos informations.",
                "status": "error"
            }, status=status.HTTP_400_BAD_REQUEST)