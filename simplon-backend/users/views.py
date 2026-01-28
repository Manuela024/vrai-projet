

# # users/views.py - VERSION COMPLÈTE ET CORRIGÉE
# from rest_framework import generics, permissions, status
# from rest_framework.response import Response
# from rest_framework.decorators import api_view, permission_classes
# from rest_framework.permissions import IsAuthenticated
# from django.contrib.auth.models import User
# from django.utils import timezone
# from django.core.mail import send_mail
# from django.conf import settings
# from .models import MatriculeAutorise
# from .serializers import UserSerializer
# import secrets
# from datetime import timedelta
# from rest_framework.views import APIView
# from projects.models import Project
# import traceback

# class UserProfileView(generics.RetrieveAPIView):
#     """Vue pour récupérer le profil de l'utilisateur connecté"""
#     permission_classes = [permissions.IsAuthenticated]
#     serializer_class = UserSerializer
    
#     def get_object(self):
#         return self.request.user

# class RequestLoginView(generics.GenericAPIView):
#     """Vue pour demander un lien d'activation par email"""
#     permission_classes = [permissions.AllowAny]
    
#     def post(self, request):
#         matricule = request.data.get('matricule')
#         email = request.data.get('email')
        
#         print("=" * 70)
#         print("🔐 DEMANDE D'INSCRIPTION REÇUE")
#         print("=" * 70)
#         print(f"📋 Matricule: {matricule}")
#         print(f"📧 Email: {email}")
        
#         # Vérifier si le matricule est autorisé
#         try:
#             matricule_autorise = MatriculeAutorise.objects.get(
#                 matricule=matricule,
#                 est_actif=True
#             )
            
#             # Générer un token sécurisé valable 5 minutes
#             token = secrets.token_urlsafe(32)
#             expiration_time = timezone.now() + timedelta(minutes=5)
            
#             # Sauvegarder le token et son expiration
#             matricule_autorise.activation_token = token
#             matricule_autorise.token_expiration = expiration_time
#             matricule_autorise.save()
            
#             activation_link = f"http://localhost:3001/setup-password?token={token}&matricule={matricule}&email={email}"
            
#             print(f"✅ MATRICULE AUTORISÉ: {matricule}")
#             print(f"⏰ Token généré: {token}")
#             print(f"🕒 Expire à: {expiration_time.strftime('%H:%M:%S')} (dans 5 minutes)")
#             print("=" * 70)
            
#             # ==================== ENVOI EMAIL ====================
#             print(f"📧 ENVOI EMAIL À: {email}")
            
#             subject = '🎯 Activez votre compte Simplon - Lien rapide!'
            
#             html_message = f"""
#             <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden;">
#                 <div style="background: linear-gradient(135deg, #E30613, #B80505); color: white; padding: 25px; text-align: center;">
#                     <h1 style="margin: 0; font-size: 28px;">🚀 Plateforme Simplon</h1>
#                     <p style="margin: 5px 0 0 0; opacity: 0.9;">Activation de votre compte</p>
#                 </div>
                
#                 <div style="padding: 30px; background: #ffffff;">
#                     <h2 style="color: #E30613; margin-top: 0;">Bonjour,</h2>
#                     <p style="font-size: 16px; line-height: 1.6; color: #333;">
#                         Vous avez demandé à créer un compte sur la plateforme interne Simplon.
#                     </p>
                    
#                     <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #E30613;">
#                         <p style="margin: 0; font-size: 16px;">
#                             <strong style="color: #E30613;">📋 Matricule :</strong> {matricule}<br>
#                             <strong style="color: #E30613;">📧 Email :</strong> {email}
#                         </p>
#                     </div>
                    
#                     <p style="text-align: center; margin: 30px 0;">
#                         <a href="{activation_link}" 
#                            style="background: linear-gradient(135deg, #E30613, #B80505); 
#                                   color: white; padding: 16px 35px; 
#                                   text-decoration: none; border-radius: 8px; 
#                                   font-size: 18px; font-weight: bold;
#                                   display: inline-block; 
#                                   box-shadow: 0 4px 15px rgba(227, 6, 19, 0.3);">
#                             ✅ Activer mon compte
#                         </a>
#                     </p>
                    
#                     <div style="background: #fff3f3; padding: 15px; border-radius: 6px; margin: 20px 0; border: 2px solid #E30613;">
#                         <p style="margin: 0; font-size: 14px; color: #d32f2f; text-align: center;">
#                             <strong>⚠️ URGENT :</strong> Ce lien expirera dans <strong>5 MINUTES</strong><br>
#                             <small>Expire à : {expiration_time.strftime('%H:%M:%S')}</small>
#                         </p>
#                     </div>
                    
#                     <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #eee;">
#                         <p style="font-size: 14px; color: #666; margin-bottom: 10px;">
#                             <strong>Lien alternatif :</strong> Si le bouton ne fonctionne pas, copiez-collez ce lien dans votre navigateur :
#                         </p>
#                         <div style="background: #f5f5f5; padding: 12px; border-radius: 6px; border: 1px solid #ddd;">
#                             <code style="word-break: break-all; font-size: 12px; color: #333;">
#                                 {activation_link}
#                             </code>
#                         </div>
#                     </div>
#                 </div>
                
#                 <div style="background: #2c3e50; color: white; padding: 20px; text-align: center;">
#                     <p style="margin: 0; font-size: 14px;">
#                         <strong>© 2025 Simplon.co - Plateforme interne</strong>
#                     </p>
#                     <p style="margin: 5px 0 0 0; font-size: 12px; opacity: 0.8;">
#                         Cet email a été envoyé automatiquement, merci de ne pas y répondre.
#                     </p>
#                 </div>
#             </div>
#             """
            
#             plain_message = f"""ACTIVATION DE COMPTE - PLATEFORME SIMPLON

# Bonjour,

# Vous avez demandé à créer un compte sur la plateforme interne Simplon.

# INFORMATIONS :
# 📋 Matricule : {matricule}
# 📧 Email : {email}

# POUR ACTIVER VOTRE COMPTE :
# Cliquez sur le lien suivant :
# {activation_link}

# ⚠️ URGENT :
# Ce lien d'activation expirera dans 5 MINUTES!
# Expire à : {expiration_time.strftime('%H:%M:%S')}

# Si vous n'avez pas demandé cette inscription, vous pouvez ignorer cet email.

# Cordialement,
# L'équipe Simplon

# ---
# © 2025 Simplon.co - Plateforme interne
# Cet email a été envoyé automatiquement.
# """
            
#             # ENVOI EMAIL RÉEL
#             try:
#                 send_mail(
#                     subject=subject,
#                     message=plain_message,
#                     from_email=settings.DEFAULT_FROM_EMAIL,
#                     recipient_list=[email],
#                     html_message=html_message,
#                     fail_silently=False,
#                 )
                
#                 print(f"✅ EMAIL RÉEL ENVOYÉ avec succès à: {email}")
#                 print("⏰ Le lien expirera dans 5 minutes")
#                 print("=" * 70)
                
#                 return Response({
#                     "message": "✅ Lien d'activation envoyé ! ⏰ Valable 5 minutes - Vérifiez vite votre email!",
#                     "status": "success",
#                     "expires_in": "5 minutes"
#                 }, status=status.HTTP_200_OK)
                
#             except Exception as e:
#                 print(f"❌ ERREUR ENVOI EMAIL: {str(e)}")
#                 print("=" * 70)
#                 return Response({
#                     "message": f"⚠️ Erreur d'envoi d'email. Utilisez ce lien (valable 5 minutes): {activation_link}",
#                     "activation_link": activation_link,
#                     "status": "success",
#                     "expires_in": "5 minutes"
#                 }, status=status.HTTP_200_OK)
            
#         except MatriculeAutorise.DoesNotExist:
#             print("❌ MATRICULE NON AUTORISÉ")
#             print("=" * 70)
#             return Response({
#                 "message": "❌ Matricule non autorisé ou introuvable.",
#                 "status": "error"
#             }, status=status.HTTP_400_BAD_REQUEST)

# class SetupPasswordView(generics.GenericAPIView):
#     """Vue pour finaliser la création du compte avec mot de passe"""
#     permission_classes = [permissions.AllowAny]
    
#     def post(self, request):
#         token = request.data.get('token')
#         matricule = request.data.get('matricule')
#         email = request.data.get('email')
#         username = request.data.get('username')
#         password = request.data.get('password')
        
#         print("=" * 70)
#         print(" VÉRIFICATION DU LIEN D'ACTIVATION - DEBUG")
#         print("=" * 70)
#         print(f" Matricule: {matricule}")
#         print(f" Email: {email}")
#         print(f" Token: {token}")
#         print(f" Heure actuelle: {timezone.now()}")
        
#         try:
#             # Vérifier le matricule
#             matricule_autorise = MatriculeAutorise.objects.get(
#                 matricule=matricule,
#                 est_actif=True
#             )
            
#             print(f"✅ Matricule trouvé: {matricule_autorise.matricule}")
#             print(f" Token stocké: {matricule_autorise.activation_token}")
#             print(f" Expiration stockée: {matricule_autorise.token_expiration}")
            
#             # Vérifier si le token correspond
#             if not matricule_autorise.activation_token or matricule_autorise.activation_token != token:
#                 print("❌ TOKEN INVALIDE OU MANQUANT")
#                 print(f"   Token attendu: {matricule_autorise.activation_token}")
#                 print(f"   Token reçu: {token}")
#                 return Response({
#                     "message": "❌ Lien d'activation invalide ou déjà utilisé.",
#                     "status": "error"
#                 }, status=status.HTTP_400_BAD_REQUEST)
            
#             # Vérifier si le token est expiré
#             if matricule_autorise.is_token_expired():
#                 print("❌ TOKEN EXPIRÉ - DÉTAILS:")
#                 time_diff = timezone.now() - matricule_autorise.token_expiration
#                 print(f"   Temps écoulé depuis expiration: {time_diff}")
#                 print(f"   Secondes écoulées: {time_diff.total_seconds()}s")
#                 print(f"   Minutes écoulées: {time_diff.total_seconds() / 60}min")
                
#                 return Response({
#                     "message": "❌ Le lien d'activation a expiré. Il n'était valable que 5 minutes. Veuillez demander un nouveau lien.",
#                     "status": "error",
#                     "expired": True
#                 }, status=status.HTTP_400_BAD_REQUEST)
            
#             print("✅ TOKEN VALIDE ET NON EXPIRÉ")
#             remaining_seconds = matricule_autorise.get_remaining_time()
#             print(f"   Temps restant: {remaining_seconds} secondes")
#             print(f"   Soit: {remaining_seconds / 60} minutes")
            
#             # Vérifier si le username est disponible
#             if User.objects.filter(username=username).exists():
#                 print("❌ Username déjà pris")
#                 return Response({
#                     "message": "❌ Ce nom d'utilisateur est déjà pris.",
#                     "status": "error"
#                 }, status=status.HTTP_400_BAD_REQUEST)
            
#             # Vérification email améliorée
#             existing_user_with_email = User.objects.filter(email=email).first()
#             if existing_user_with_email:
#                 if existing_user_with_email.username != matricule:
#                     print(f"❌ Email déjà utilisé par un autre matricule: {existing_user_with_email.username}")
#                     return Response({
#                         "message": "❌ Cet email est déjà associé à un autre compte.",
#                         "status": "error"
#                     }, status=status.HTTP_400_BAD_REQUEST)
#                 else:
#                     print(f"✅ Email réutilisé pour le même matricule: {matricule}")
            
#             # Créer ou mettre à jour l'utilisateur
#             user, created = User.objects.get_or_create(
#                 username=matricule,
#                 defaults={
#                     'email': email,
#                     'password': password,
#                     'first_name': '',
#                     'last_name': ''
#                 }
#             )
            
#             if not created:
#                 user.email = email
#                 user.set_password(password)
#                 user.save()
#                 print(f"✅ COMPTE MIS À JOUR: {username}")
#             else:
#                 print(f"✅ NOUVEAU COMPTE CRÉÉ: {username}")
            
#             # Marquer le matricule comme activé
#             matricule_autorise.date_activation = timezone.now()
#             matricule_autorise.activation_token = None
#             matricule_autorise.token_expiration = None
#             matricule_autorise.save()
            
#             print(f"✅ COMPTE CRÉÉ/MIS À JOUR AVEC SUCCÈS!")
#             print(f"Username: {username}")
#             print(f" Email: {email}")
#             print(f" ID: {user.id}")
#             print("=" * 70)
            
#             return Response({
#                 "message": "✅ Compte créé avec succès ! Vous pouvez maintenant vous connecter.",
#                 "status": "success",
#                 "username": username
#             }, status=status.HTTP_200_OK)
            
#         except MatriculeAutorise.DoesNotExist:
#             print("❌ MATRICULE NON AUTORISÉ")
#             print("=" * 70)
#             return Response({
#                 "message": "❌ Matricule non autorisé ou introuvable.",
#                 "status": "error"
#             }, status=status.HTTP_400_BAD_REQUEST)
#         except Exception as e:
#             print(f"❌ ERREUR: {str(e)}")
#             print("=" * 70)
#             return Response({
#                 "message": f"❌ Erreur: {str(e)}",
#                 "status": "error"
#             }, status=status.HTTP_400_BAD_REQUEST)
        
# class DirectLoginView(generics.GenericAPIView):
#     """Vue pour connexion directe avec username/password"""
#     permission_classes = [permissions.AllowAny]
    
#     def post(self, request):
#         username = request.data.get('username')
#         password = request.data.get('password')
        
#         print("=" * 70)
#         print(f" TENTATIVE DE CONNEXION: {username}")
        
#         from django.contrib.auth import authenticate
        
#         user = authenticate(username=username, password=password)
        
#         if user is not None:
#             from rest_framework_simplejwt.tokens import RefreshToken
#             refresh = RefreshToken.for_user(user)
            
#             print(f"✅ CONNEXION RÉUSSIE: {user.username}")
#             print(f" Email: {user.email}")
#             print(f" ID: {user.id}")
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
#                 }
#             })
#         else:
#             print("❌ IDENTIFIANTS INCORRECTS")
#             print("=" * 70)
#             return Response({
#                 "error": "❌ Identifiants incorrects"
#             }, status=status.HTTP_401_UNAUTHORIZED)

# class QuickLoginView(generics.GenericAPIView):
#     """Vue pour connexion rapide avec matricule/username"""
#     permission_classes = [permissions.AllowAny]
    
#     def post(self, request):
#         matricule = request.data.get('matricule')
#         username = request.data.get('username')
#         password = request.data.get('password')
        
#         print("=" * 70)
#         print("⚡ CONNEXION RAPIDE TENTATIVE - DEBUG DÉTAILLÉ")
#         print("=" * 70)
#         print(f"📋 Données reçues: {request.data}")
#         print(f"📋 Matricule: {matricule}")
#         print(f"👤 Username: {username}") 
#         print(f"🔑 Password: {'*' * len(password) if password else 'None'}")
        
#         # Utiliser username OU matricule
#         login_identifier = username or matricule
        
#         if not login_identifier:
#             print("❌ ERREUR: Aucun identifiant fourni (username ou matricule)")
#             return Response({
#                 "error": "Identifiant manquant. Fournissez un username ou matricule.",
#                 "code": "MISSING_IDENTIFIER"
#             }, status=status.HTTP_400_BAD_REQUEST)
        
#         if not password:
#             print("❌ ERREUR: Mot de passe manquant")
#             return Response({
#                 "error": "Mot de passe manquant.",
#                 "code": "MISSING_PASSWORD"
#             }, status=status.HTTP_400_BAD_REQUEST)

#         # Vérifier si le matricule est autorisé ET activé
#         try:
#             matricule_autorise = MatriculeAutorise.objects.get(
#                 matricule=login_identifier,
#                 est_actif=True,
#                 date_activation__isnull=False
#             )
#             print(f"✅ MATRICULE AUTORISÉ ET ACTIVÉ: {login_identifier}")
            
#         except MatriculeAutorise.DoesNotExist:
#             print(f"❌ MATRICULE NON ACTIVÉ OU INTROUVABLE: {login_identifier}")
#             return Response({
#                 "error": "❌ Compte non activé. Utilisez 'Activer mon compte' pour créer votre compte d'abord.",
#                 "code": "ACCOUNT_NOT_ACTIVATED"
#             }, status=status.HTTP_400_BAD_REQUEST)
        
#         # Authentifier avec Django
#         from django.contrib.auth import authenticate
#         user = authenticate(username=login_identifier, password=password)
        
#         print(f"🔐 RÉSULTAT AUTHENTIFICATION: {user}")
        
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
#             print("❌ ÉCHEC AUTHENTIFICATION - Vérifier:")
#             print(f"   - Identifiant: {login_identifier}")
#             print(f"   - Utilisateur existe: {User.objects.filter(username=login_identifier).exists()}")
            
#             if User.objects.filter(username=login_identifier).exists():
#                 print("   - ❌ Mot de passe incorrect")
#                 return Response({
#                     "error": "❌ Mot de passe incorrect",
#                     "code": "INVALID_PASSWORD"
#                 }, status=status.HTTP_401_UNAUTHORIZED)
#             else:
#                 print("   - ❌ Utilisateur non trouvé")
#                 return Response({
#                     "error": "❌ Identifiant non trouvé",
#                     "code": "USER_NOT_FOUND"
#                 }, status=status.HTTP_401_UNAUTHORIZED)

# class ForgotPasswordView(APIView):
#     """Vue pour demande de réinitialisation de mot de passe"""
#     permission_classes = [permissions.AllowAny]
    
#     def post(self, request):
#         email = request.data.get('email')
#         print("=" * 70)
#         print("🔐 DEMANDE RÉINITIALISATION MOT DE PASSE")
#         print("=" * 70)
#         print(f"📧 Email reçu: {email}")
        
#         try:
#             user = User.objects.get(email=email)
            
#             print(f"✅ UTILISATEUR TROUVÉ: {user.username} (ID: {user.id})")
            
#             reset_token = secrets.token_urlsafe(32)
#             expiration_time = timezone.now() + timedelta(minutes=15)
            
#             matricule_autorise, created = MatriculeAutorise.objects.get_or_create(
#                 matricule=f"reset_{user.id}",
#                 defaults={
#                     'est_actif': True,
#                     'date_activation': timezone.now()
#                 }
#             )
            
#             matricule_autorise.activation_token = reset_token
#             matricule_autorise.token_expiration = expiration_time
#             matricule_autorise.save()
            
#             print(f"✅ TOKEN STOCKÉ POUR L'UTILISATEUR: {user.username}")
#             print(f"🔑 Token généré: {reset_token}")
#             print(f"⏰ Expire à: {expiration_time}")
            
#             reset_link = f"http://localhost:3001/reset-password?token={reset_token}&email={email}"
            
#             print(f"✅ DEMANDE ACCEPTÉE POUR: {email}")
#             print("=" * 70)
            
#             subject = '🔒 Réinitialisation de votre mot de passe - Plateforme Simplon'
            
#             html_message = f"""
#             <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden;">
#                 <div style="background: linear-gradient(135deg, #E30613, #B80505); color: white; padding: 25px; text-align: center;">
#                     <h1 style="margin: 0; font-size: 28px;">🔒 Plateforme Simplon</h1>
#                     <p style="margin: 5px 0 0 0; opacity: 0.9;">Réinitialisation de mot de passe</p>
#                 </div>
                
#                 <div style="padding: 30px; background: #ffffff;">
#                     <h2 style="color: #E30613; margin-top: 0;">Bonjour,</h2>
#                     <p style="font-size: 16px; line-height: 1.6; color: #333;">
#                         Vous avez demandé à réinitialiser votre mot de passe pour la plateforme interne Simplon.
#                     </p>
                    
#                     <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #E30613;">
#                         <p style="margin: 0; font-size: 16px;">
#                             <strong style="color: #E30613;">📧 Email :</strong> {email}<br>
#                             <strong style="color: #E30613;">👤 Nom d'utilisateur :</strong> {user.username}<br>
#                             <strong style="color: #E30613;">⏰ Lien valable :</strong> 15 minutes
#                         </p>
#                     </div>
                    
#                     <p style="text-align: center; margin: 30px 0;">
#                         <a href="{reset_link}" 
#                            style="background: linear-gradient(135deg, #E30613, #B80505); 
#                                   color: white; padding: 16px 35px; 
#                                   text-decoration: none; border-radius: 8px; 
#                                   font-size: 18px; font-weight: bold;
#                                   display: inline-block; 
#                                   box-shadow: 0 4px 15px rgba(227, 6, 19, 0.3);">
#                             🔑 Réinitialiser mon mot de passe
#                         </a>
#                     </p>
                    
#                     <div style="background: #fff3f3; padding: 15px; border-radius: 6px; margin: 20px 0; border: 2px solid #E30613;">
#                         <p style="margin: 0; font-size: 14px; color: #d32f2f; text-align: center;">
#                             <strong>⚠️ SÉCURITÉ :</strong> Ce lien expirera dans <strong>15 MINUTES</strong><br>
#                             <small>Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.</small>
#                         </p>
#                     </div>
                    
#                     <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #eee;">
#                         <p style="font-size: 14px; color: #666; margin-bottom: 10px;">
#                             <strong>Lien alternatif :</strong> Si le bouton ne fonctionne pas, copiez-collez ce lien dans votre navigateur :
#                         </p>
#                         <div style="background: #f5f5f5; padding: 12px; border-radius: 6px; border: 1px solid #ddd;">
#                             <code style="word-break: break-all; font-size: 12px; color: #333;">
#                                 {reset_link}
#                             </code>
#                         </div>
#                     </div>
#                 </div>
                
#                 <div style="background: #2c3e50; color: white; padding: 20px; text-align: center;">
#                     <p style="margin: 0; font-size: 14px;">
#                         <strong>© 2025 Simplon.co - Plateforme interne</strong>
#                     </p>
#                     <p style="margin: 5px 0 0 0; font-size: 12px; opacity: 0.8;">
#                         Cet email a été envoyé automatiquement, merci de ne pas y répondre.
#                     </p>
#                 </div>
#             </div>
#             """
            
#             plain_message = f"""RÉINITIALISATION DE MOT DE PASSE - PLATEFORME SIMPLON

# Bonjour,

# Vous avez demandé à réinitialiser votre mot de passe pour la plateforme interne Simplon.

# INFORMATIONS :
# 📧 Email : {email}
# 👤 Nom d'utilisateur : {user.username}

# POUR RÉINITIALISER VOTRE MOT DE PASSE :
# Cliquez sur le lien suivant :
# {reset_link}

# ⚠️ SÉCURITÉ :
# Ce lien de réinitialisation expirera dans 15 MINUTES!
# Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.

# Cordialement,
# L'équipe Simplon

# ---
# © 2025 Simplon.co - Plateforme interne
# Cet email a été envoyé automatiquement.
# """
            
#             try:
#                 send_mail(
#                     subject=subject,
#                     message=plain_message,
#                     from_email=settings.DEFAULT_FROM_EMAIL,
#                     recipient_list=[email],
#                     html_message=html_message,
#                     fail_silently=False,
#                 )
                
#                 print(f"✅ EMAIL DE RÉINITIALISATION ENVOYÉ À: {email}")
#                 print("=" * 70)
                
#                 return Response({
#                     "message": "✅ Si votre email est enregistré, un lien de réinitialisation a été envoyé. Vérifiez votre boîte mail (valable 15 minutes).",
#                     "status": "success"
#                 }, status=status.HTTP_200_OK)
                
#             except Exception as e:
#                 print(f"❌ ERREUR ENVOI EMAIL: {str(e)}")
#                 traceback.print_exc()
#                 print("=" * 70)
#                 return Response({
#                     "message": "❌ Erreur d'envoi d'email. Veuillez réessayer.",
#                     "status": "error"
#                 }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
#         except User.DoesNotExist:
#             print("❌ EMAIL NON TROUVÉ DANS LA BASE")
#             print("=" * 70)
#             return Response({
#                 "message": "✅ Si votre email est enregistré, un lien de réinitialisation a été envoyé. Vérifiez votre boîte mail (valable 15 minutes).",
#                 "status": "success"
#             }, status=status.HTTP_200_OK)

# class ResetPasswordView(generics.GenericAPIView):
#     """Vue pour finaliser la réinitialisation du mot de passe"""
#     permission_classes = [permissions.AllowAny]
    
#     def post(self, request):
#         token = request.data.get('token')
#         email = request.data.get('email')
#         new_password = request.data.get('new_password')
        
#         print("=" * 70)
#         print("🔐 TENTATIVE RÉINITIALISATION MOT DE PASSE")
#         print("=" * 70)
#         print(f"📧 Email: {email}")
#         print(f"🎫 Token: {token}")
#         print(f"🕒 Heure actuelle: {timezone.now()}")
        
#         try:
#             user = User.objects.get(email=email)
            
#             print(f"✅ UTILISATEUR TROUVÉ: {user.username}")
            
#             # Chercher le token dans le matricule temporaire
#             try:
#                 matricule_autorise = MatriculeAutorise.objects.get(
#                     matricule=f"reset_{user.id}",
#                     est_actif=True
#                 )
                
#                 print(f"🔑 Token stocké: {matricule_autorise.activation_token}")
#                 print(f"⏰ Expiration stockée: {matricule_autorise.token_expiration}")
                
#                 # Vérifier si le token correspond et n'est pas expiré
#                 if (not matricule_autorise.activation_token or 
#                     matricule_autorise.activation_token != token or
#                     matricule_autorise.is_token_expired()):
                    
#                     print("❌ TOKEN INVALIDE OU EXPIRÉ")
#                     return Response({
#                         "message": "❌ Lien de réinitialisation invalide ou expiré. Veuillez demander un nouveau lien.",
#                         "status": "error",
#                         "expired": True
#                     }, status=status.HTTP_400_BAD_REQUEST)
                
#                 print("✅ TOKEN VALIDE ET NON EXPIRÉ")
                
#                 # Réinitialiser le mot de passe
#                 user.set_password(new_password)
#                 user.save()
                
#                 # Nettoyer le token après utilisation
#                 matricule_autorise.activation_token = None
#                 matricule_autorise.token_expiration = None
#                 matricule_autorise.save()
                
#                 print(f"✅ MOT DE PASSE RÉINITIALISÉ POUR: {user.username}")
#                 print("=" * 70)
                
#                 return Response({
#                     "message": "✅ Mot de passe réinitialisé avec succès ! Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.",
#                     "status": "success"
#                 }, status=status.HTTP_200_OK)
                
#             except MatriculeAutorise.DoesNotExist:
#                 print("❌ TOKEN DE RÉINITIALISATION NON TROUVÉ")
#                 return Response({
#                     "message": "❌ Lien de réinitialisation invalide. Veuillez demander un nouveau lien.",
#                     "status": "error"
#                 }, status=status.HTTP_400_BAD_REQUEST)
            
#         except User.DoesNotExist:
#             print("❌ UTILISATEUR NON TROUVÉ")
#             print("=" * 70)
#             return Response({
#                 "message": "❌ Erreur lors de la réinitialisation. Veuillez vérifier vos informations.",
#                 "status": "error"
#             }, status=status.HTTP_400_BAD_REQUEST)

# # ⭐ VUE FONCTION POUR LE FRONTEND REACT - ENDPOINT users-with-projects
# @api_view(['GET'])
# # @permission_classes([IsAuthenticated])
# def users_with_projects(request):
#     """Retourne tous les utilisateurs Simplon avec leurs projets"""
#     try:
#         print("=" * 70)
#         print("🔍 DÉBUT users_with_projects - DEBUG DÉTAILLÉ")
#         print("=" * 70)
        
#         # 1. Filtrer uniquement les utilisateurs Simplon
#         simplon_users = User.objects.filter(username__startswith='simplon_')
#         print(f"✅ {simplon_users.count()} utilisateur(s) Simplon trouvé(s)")
        
#         users_data = []
        
#         for user in simplon_users:
#             # 2. Récupérer les projets de cet utilisateur
#             projects = Project.objects.filter(author=user)
#             print(f"👤 {user.username}: {projects.count()} projet(s)")
            
#             projects_data = []
            
#             for project in projects:
#                 project_dict = {
#                     'id': project.id,
#                     'title': project.title or "Sans titre",
#                     'description': project.description or "",
#                     'technologies': project.technologies or "",
#                     'github_url': project.github_url or "",
#                     'demo_url': project.demo_url or "",
#                     'image': project.image.url if project.image else None,
#                     'status': project.status or "draft",
#                     'created_at': project.created_at,
#                     'updated_at': project.updated_at,
#                     'author': {
#                         'id': user.id,
#                         'username': user.username,
#                         'first_name': user.first_name or "",
#                         'last_name': user.last_name or "",
#                         'email': user.email or ""
#                     }
#                 }
#                 projects_data.append(project_dict)
            
#             user_dict = {
#                 'id': user.id,
#                 'username': user.username,
#                 'email': user.email or "",
#                 'first_name': user.first_name or "",
#                 'last_name': user.last_name or "",
#                 'date_joined': user.date_joined,
#                 'is_active': user.is_active,
#                 'projects_count': len(projects_data),
#                 'projects': projects_data
#             }
            
#             users_data.append(user_dict)
        
#         # 3. Trier par username
#         users_data.sort(key=lambda x: x['username'])
        
#         print("=" * 70)
#         print(f"✅ PRÊT POUR LE FRONTEND: {len(users_data)} utilisateur(s) avec projets")
        
#         for user in users_data:
#             print(f"   👤 {user['username']} - {user['projects_count']} projet(s)")
        
#         print("=" * 70)
        
#         return Response({
#             'count': len(users_data),
#             'users': users_data
#         })
        
#     except Exception as e:
#         print("❌ ERREUR DANS users_with_projects:")
#         print(f"   {str(e)}")
#         traceback.print_exc()
#         print("=" * 70)
        
#         return Response({
#             'error': str(e),
#             'message': 'Erreur serveur lors de la récupération des données',
#             'traceback': traceback.format_exc(),
#             'count': 0,
#             'users': []
#         }, status=500)

# # users/views.py - VERSION COMPLÈTE CORRIGÉE AVEC SUPPORT PATCH/PUT
# from rest_framework import generics, permissions, status
# from rest_framework.response import Response
# from rest_framework.decorators import api_view, permission_classes
# from rest_framework.permissions import IsAuthenticated
# from django.contrib.auth.models import User
# from django.utils import timezone
# from django.core.mail import send_mail
# from django.conf import settings
# from .models import MatriculeAutorise
# from .serializers import UserSerializer
# import secrets
# from datetime import timedelta
# from rest_framework.views import APIView
# from projects.models import Project
# import traceback

# class UserProfileView(generics.RetrieveUpdateAPIView):  # ⭐ CHANGÉ DE RetrieveAPIView À RetrieveUpdateAPIView
#     """
#     Vue pour récupérer et mettre à jour le profil de l'utilisateur connecté
#     Supporte GET (lecture), PATCH (mise à jour partielle), PUT (mise à jour complète)
#     """
#     permission_classes = [permissions.IsAuthenticated]
#     serializer_class = UserSerializer
    
#     def get_object(self):
#         """Retourne l'utilisateur connecté"""
#         return self.request.user
    
#     def get(self, request, *args, **kwargs):
#         """GET: Récupérer le profil"""
#         instance = self.get_object()
#         serializer = self.get_serializer(instance)
        
#         print("=" * 70)
#         print("📱 GET PROFIL UTILISATEUR")
#         print("=" * 70)
#         print(f"👤 Utilisateur: {instance.username}")
#         print(f"📧 Email: {instance.email}")
#         print(f"🆔 ID: {instance.id}")
#         print("=" * 70)
        
#         return Response(serializer.data)
    
#     def patch(self, request, *args, **kwargs):
#         """PATCH: Mettre à jour partiellement le profil"""
#         instance = self.get_object()
        
#         print("=" * 70)
#         print("🔄 PATCH PROFIL UTILISATEUR")
#         print("=" * 70)
#         print(f"👤 Utilisateur: {instance.username}")
#         print(f"📧 Ancien email: {instance.email}")
#         print(f"📋 Données reçues: {request.data}")
#         print("=" * 70)
        
#         serializer = self.get_serializer(instance, data=request.data, partial=True)
#         serializer.is_valid(raise_exception=True)
#         self.perform_update(serializer)
        
#         print(f"✅ MISE À JOUR RÉUSSIE POUR: {instance.username}")
#         print(f"📧 Nouvel email: {instance.email}")
#         print("=" * 70)
        
#         return Response(serializer.data)
    
#     def put(self, request, *args, **kwargs):
#         """PUT: Mettre à jour complètement le profil"""
#         instance = self.get_object()
        
#         print("=" * 70)
#         print("🔄 PUT PROFIL UTILISATEUR")
#         print("=" * 70)
#         print(f"👤 Utilisateur: {instance.username}")
#         print(f"📋 Données reçues: {request.data}")
#         print("=" * 70)
        
#         serializer = self.get_serializer(instance, data=request.data)
#         serializer.is_valid(raise_exception=True)
#         self.perform_update(serializer)
        
#         print(f"✅ MISE À JOUR COMPLÈTE RÉUSSIE POUR: {instance.username}")
#         print("=" * 70)
        
#         return Response(serializer.data)

# class RequestLoginView(generics.GenericAPIView):
#     """Vue pour demander un lien d'activation par email"""
#     permission_classes = [permissions.AllowAny]
    
#     def post(self, request):
#         matricule = request.data.get('matricule')
#         email = request.data.get('email')
        
#         print("=" * 70)
#         print("🔐 DEMANDE D'INSCRIPTION REÇUE")
#         print("=" * 70)
#         print(f"📋 Matricule: {matricule}")
#         print(f"📧 Email: {email}")
        
#         # Vérifier si le matricule est autorisé
#         try:
#             matricule_autorise = MatriculeAutorise.objects.get(
#                 matricule=matricule,
#                 est_actif=True
#             )
            
#             # Générer un token sécurisé valable 5 minutes
#             token = secrets.token_urlsafe(32)
#             expiration_time = timezone.now() + timedelta(minutes=5)
            
#             # Sauvegarder le token et son expiration
#             matricule_autorise.activation_token = token
#             matricule_autorise.token_expiration = expiration_time
#             matricule_autorise.save()
            
#             activation_link = f"http://localhost:3001/setup-password?token={token}&matricule={matricule}&email={email}"
            
#             print(f"✅ MATRICULE AUTORISÉ: {matricule}")
#             print(f"⏰ Token généré: {token}")
#             print(f"🕒 Expire à: {expiration_time.strftime('%H:%M:%S')} (dans 5 minutes)")
#             print("=" * 70)
            
#             # ==================== ENVOI EMAIL ====================
#             print(f"📧 ENVOI EMAIL À: {email}")
            
#             subject = '🎯 Activez votre compte Simplon - Lien rapide!'
            
#             html_message = f"""
#             <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden;">
#                 <div style="background: linear-gradient(135deg, #E30613, #B80505); color: white; padding: 25px; text-align: center;">
#                     <h1 style="margin: 0; font-size: 28px;">🚀 Plateforme Simplon</h1>
#                     <p style="margin: 5px 0 0 0; opacity: 0.9;">Activation de votre compte</p>
#                 </div>
                
#                 <div style="padding: 30px; background: #ffffff;">
#                     <h2 style="color: #E30613; margin-top: 0;">Bonjour,</h2>
#                     <p style="font-size: 16px; line-height: 1.6; color: #333;">
#                         Vous avez demandé à créer un compte sur la plateforme interne Simplon.
#                     </p>
                    
#                     <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #E30613;">
#                         <p style="margin: 0; font-size: 16px;">
#                             <strong style="color: #E30613;">📋 Matricule :</strong> {matricule}<br>
#                             <strong style="color: #E30613;">📧 Email :</strong> {email}
#                         </p>
#                     </div>
                    
#                     <p style="text-align: center; margin: 30px 0;">
#                         <a href="{activation_link}" 
#                            style="background: linear-gradient(135deg, #E30613, #B80505); 
#                                   color: white; padding: 16px 35px; 
#                                   text-decoration: none; border-radius: 8px; 
#                                   font-size: 18px; font-weight: bold;
#                                   display: inline-block; 
#                                   box-shadow: 0 4px 15px rgba(227, 6, 19, 0.3);">
#                             ✅ Activer mon compte
#                         </a>
#                     </p>
                    
#                     <div style="background: #fff3f3; padding: 15px; border-radius: 6px; margin: 20px 0; border: 2px solid #E30613;">
#                         <p style="margin: 0; font-size: 14px; color: #d32f2f; text-align: center;">
#                             <strong>⚠️ URGENT :</strong> Ce lien expirera dans <strong>5 MINUTES</strong><br>
#                             <small>Expire à : {expiration_time.strftime('%H:%M:%S')}</small>
#                         </p>
#                     </div>
                    
#                     <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #eee;">
#                         <p style="font-size: 14px; color: #666; margin-bottom: 10px;">
#                             <strong>Lien alternatif :</strong> Si le bouton ne fonctionne pas, copiez-collez ce lien dans votre navigateur :
#                         </p>
#                         <div style="background: #f5f5f5; padding: 12px; border-radius: 6px; border: 1px solid #ddd;">
#                             <code style="word-break: break-all; font-size: 12px; color: #333;">
#                                 {activation_link}
#                             </code>
#                         </div>
#                     </div>
#                 </div>
                
#                 <div style="background: #2c3e50; color: white; padding: 20px; text-align: center;">
#                     <p style="margin: 0; font-size: 14px;">
#                         <strong>© 2025 Simplon.co - Plateforme interne</strong>
#                     </p>
#                     <p style="margin: 5px 0 0 0; font-size: 12px; opacity: 0.8;">
#                         Cet email a été envoyé automatiquement, merci de ne pas y répondre.
#                     </p>
#                 </div>
#             </div>
#             """
            
#             plain_message = f"""ACTIVATION DE COMPTE - PLATEFORME SIMPLON

# Bonjour,

# Vous avez demandé à créer un compte sur la plateforme interne Simplon.

# INFORMATIONS :
# 📋 Matricule : {matricule}
# 📧 Email : {email}

# POUR ACTIVER VOTRE COMPTE :
# Cliquez sur le lien suivant :
# {activation_link}

# ⚠️ URGENT :
# Ce lien d'activation expirera dans 5 MINUTES!
# Expire à : {expiration_time.strftime('%H:%M:%S')}

# Si vous n'avez pas demandé cette inscription, vous pouvez ignorer cet email.

# Cordialement,
# L'équipe Simplon

# ---
# © 2025 Simplon.co - Plateforme interne
# Cet email a été envoyé automatiquement.
# """
            
#             # ENVOI EMAIL RÉEL
#             try:
#                 send_mail(
#                     subject=subject,
#                     message=plain_message,
#                     from_email=settings.DEFAULT_FROM_EMAIL,
#                     recipient_list=[email],
#                     html_message=html_message,
#                     fail_silently=False,
#                 )
                
#                 print(f"✅ EMAIL RÉEL ENVOYÉ avec succès à: {email}")
#                 print("⏰ Le lien expirera dans 5 minutes")
#                 print("=" * 70)
                
#                 return Response({
#                     "message": "✅ Lien d'activation envoyé ! ⏰ Valable 5 minutes - Vérifiez vite votre email!",
#                     "status": "success",
#                     "expires_in": "5 minutes"
#                 }, status=status.HTTP_200_OK)
                
#             except Exception as e:
#                 print(f"❌ ERREUR ENVOI EMAIL: {str(e)}")
#                 print("=" * 70)
#                 return Response({
#                     "message": f"⚠️ Erreur d'envoi d'email. Utilisez ce lien (valable 5 minutes): {activation_link}",
#                     "activation_link": activation_link,
#                     "status": "success",
#                     "expires_in": "5 minutes"
#                 }, status=status.HTTP_200_OK)
            
#         except MatriculeAutorise.DoesNotExist:
#             print("❌ MATRICULE NON AUTORISÉ")
#             print("=" * 70)
#             return Response({
#                 "message": "❌ Matricule non autorisé ou introuvable.",
#                 "status": "error"
#             }, status=status.HTTP_400_BAD_REQUEST)

# class SetupPasswordView(generics.GenericAPIView):
#     """Vue pour finaliser la création du compte avec mot de passe"""
#     permission_classes = [permissions.AllowAny]
    
#     def post(self, request):
#         token = request.data.get('token')
#         matricule = request.data.get('matricule')
#         email = request.data.get('email')
#         username = request.data.get('username')
#         password = request.data.get('password')
        
#         print("=" * 70)
#         print(" VÉRIFICATION DU LIEN D'ACTIVATION - DEBUG")
#         print("=" * 70)
#         print(f" Matricule: {matricule}")
#         print(f" Email: {email}")
#         print(f" Token: {token}")
#         print(f" Heure actuelle: {timezone.now()}")
        
#         try:
#             # Vérifier le matricule
#             matricule_autorise = MatriculeAutorise.objects.get(
#                 matricule=matricule,
#                 est_actif=True
#             )
            
#             print(f"✅ Matricule trouvé: {matricule_autorise.matricule}")
#             print(f" Token stocké: {matricule_autorise.activation_token}")
#             print(f" Expiration stockée: {matricule_autorise.token_expiration}")
            
#             # Vérifier si le token correspond
#             if not matricule_autorise.activation_token or matricule_autorise.activation_token != token:
#                 print("❌ TOKEN INVALIDE OU MANQUANT")
#                 print(f"   Token attendu: {matricule_autorise.activation_token}")
#                 print(f"   Token reçu: {token}")
#                 return Response({
#                     "message": "❌ Lien d'activation invalide ou déjà utilisé.",
#                     "status": "error"
#                 }, status=status.HTTP_400_BAD_REQUEST)
            
#             # Vérifier si le token est expiré
#             if matricule_autorise.is_token_expired():
#                 print("❌ TOKEN EXPIRÉ - DÉTAILS:")
#                 time_diff = timezone.now() - matricule_autorise.token_expiration
#                 print(f"   Temps écoulé depuis expiration: {time_diff}")
#                 print(f"   Secondes écoulées: {time_diff.total_seconds()}s")
#                 print(f"   Minutes écoulées: {time_diff.total_seconds() / 60}min")
                
#                 return Response({
#                     "message": "❌ Le lien d'activation a expiré. Il n'était valable que 5 minutes. Veuillez demander un nouveau lien.",
#                     "status": "error",
#                     "expired": True
#                 }, status=status.HTTP_400_BAD_REQUEST)
            
#             print("✅ TOKEN VALIDE ET NON EXPIRÉ")
#             remaining_seconds = matricule_autorise.get_remaining_time()
#             print(f"   Temps restant: {remaining_seconds} secondes")
#             print(f"   Soit: {remaining_seconds / 60} minutes")
            
#             # Vérifier si le username est disponible
#             if User.objects.filter(username=username).exists():
#                 print("❌ Username déjà pris")
#                 return Response({
#                     "message": "❌ Ce nom d'utilisateur est déjà pris.",
#                     "status": "error"
#                 }, status=status.HTTP_400_BAD_REQUEST)
            
#             # Vérification email améliorée
#             existing_user_with_email = User.objects.filter(email=email).first()
#             if existing_user_with_email:
#                 if existing_user_with_email.username != matricule:
#                     print(f"❌ Email déjà utilisé par un autre matricule: {existing_user_with_email.username}")
#                     return Response({
#                         "message": "❌ Cet email est déjà associé à un autre compte.",
#                         "status": "error"
#                     }, status=status.HTTP_400_BAD_REQUEST)
#                 else:
#                     print(f"✅ Email réutilisé pour le même matricule: {matricule}")
            
#             # Créer ou mettre à jour l'utilisateur
#             user, created = User.objects.get_or_create(
#                 username=matricule,
#                 defaults={
#                     'email': email,
#                     'password': password,
#                     'first_name': '',
#                     'last_name': ''
#                 }
#             )
            
#             if not created:
#                 user.email = email
#                 user.set_password(password)
#                 user.save()
#                 print(f"✅ COMPTE MIS À JOUR: {username}")
#             else:
#                 print(f"✅ NOUVEAU COMPTE CRÉÉ: {username}")
            
#             # Marquer le matricule comme activé
#             matricule_autorise.date_activation = timezone.now()
#             matricule_autorise.activation_token = None
#             matricule_autorise.token_expiration = None
#             matricule_autorise.save()
            
#             print(f"✅ COMPTE CRÉÉ/MIS À JOUR AVEC SUCCÈS!")
#             print(f"Username: {username}")
#             print(f" Email: {email}")
#             print(f" ID: {user.id}")
#             print("=" * 70)
            
#             return Response({
#                 "message": "✅ Compte créé avec succès ! Vous pouvez maintenant vous connecter.",
#                 "status": "success",
#                 "username": username
#             }, status=status.HTTP_200_OK)
            
#         except MatriculeAutorise.DoesNotExist:
#             print("❌ MATRICULE NON AUTORISÉ")
#             print("=" * 70)
#             return Response({
#                 "message": "❌ Matricule non autorisé ou introuvable.",
#                 "status": "error"
#             }, status=status.HTTP_400_BAD_REQUEST)
#         except Exception as e:
#             print(f"❌ ERREUR: {str(e)}")
#             print("=" * 70)
#             return Response({
#                 "message": f"❌ Erreur: {str(e)}",
#                 "status": "error"
#             }, status=status.HTTP_400_BAD_REQUEST)
        
# class DirectLoginView(generics.GenericAPIView):
#     """Vue pour connexion directe avec username/password"""
#     permission_classes = [permissions.AllowAny]
    
#     def post(self, request):
#         username = request.data.get('username')
#         password = request.data.get('password')
        
#         print("=" * 70)
#         print(f" TENTATIVE DE CONNEXION: {username}")
        
#         from django.contrib.auth import authenticate
        
#         user = authenticate(username=username, password=password)
        
#         if user is not None:
#             from rest_framework_simplejwt.tokens import RefreshToken
#             refresh = RefreshToken.for_user(user)
            
#             print(f"✅ CONNEXION RÉUSSIE: {user.username}")
#             print(f" Email: {user.email}")
#             print(f" ID: {user.id}")
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
#                 }
#             })
#         else:
#             print("❌ IDENTIFIANTS INCORRECTS")
#             print("=" * 70)
#             return Response({
#                 "error": "❌ Identifiants incorrects"
#             }, status=status.HTTP_401_UNAUTHORIZED)

# class QuickLoginView(generics.GenericAPIView):
#     """Vue pour connexion rapide avec matricule/username"""
#     permission_classes = [permissions.AllowAny]
    
#     def post(self, request):
#         matricule = request.data.get('matricule')
#         username = request.data.get('username')
#         password = request.data.get('password')
        
#         print("=" * 70)
#         print("⚡ CONNEXION RAPIDE TENTATIVE - DEBUG DÉTAILLÉ")
#         print("=" * 70)
#         print(f"📋 Données reçues: {request.data}")
#         print(f"📋 Matricule: {matricule}")
#         print(f"👤 Username: {username}") 
#         print(f"🔑 Password: {'*' * len(password) if password else 'None'}")
        
#         # Utiliser username OU matricule
#         login_identifier = username or matricule
        
#         if not login_identifier:
#             print("❌ ERREUR: Aucun identifiant fourni (username ou matricule)")
#             return Response({
#                 "error": "Identifiant manquant. Fournissez un username ou matricule.",
#                 "code": "MISSING_IDENTIFIER"
#             }, status=status.HTTP_400_BAD_REQUEST)
        
#         if not password:
#             print("❌ ERREUR: Mot de passe manquant")
#             return Response({
#                 "error": "Mot de passe manquant.",
#                 "code": "MISSING_PASSWORD"
#             }, status=status.HTTP_400_BAD_REQUEST)

#         # Vérifier si le matricule est autorisé ET activé
#         try:
#             matricule_autorise = MatriculeAutorise.objects.get(
#                 matricule=login_identifier,
#                 est_actif=True,
#                 date_activation__isnull=False
#             )
#             print(f"✅ MATRICULE AUTORISÉ ET ACTIVÉ: {login_identifier}")
            
#         except MatriculeAutorise.DoesNotExist:
#             print(f"❌ MATRICULE NON ACTIVÉ OU INTROUVABLE: {login_identifier}")
#             return Response({
#                 "error": "❌ Compte non activé. Utilisez 'Activer mon compte' pour créer votre compte d'abord.",
#                 "code": "ACCOUNT_NOT_ACTIVATED"
#             }, status=status.HTTP_400_BAD_REQUEST)
        
#         # Authentifier avec Django
#         from django.contrib.auth import authenticate
#         user = authenticate(username=login_identifier, password=password)
        
#         print(f"🔐 RÉSULTAT AUTHENTIFICATION: {user}")
        
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
#             print("❌ ÉCHEC AUTHENTIFICATION - Vérifier:")
#             print(f"   - Identifiant: {login_identifier}")
#             print(f"   - Utilisateur existe: {User.objects.filter(username=login_identifier).exists()}")
            
#             if User.objects.filter(username=login_identifier).exists():
#                 print("   - ❌ Mot de passe incorrect")
#                 return Response({
#                     "error": "❌ Mot de passe incorrect",
#                     "code": "INVALID_PASSWORD"
#                 }, status=status.HTTP_401_UNAUTHORIZED)
#             else:
#                 print("   - ❌ Utilisateur non trouvé")
#                 return Response({
#                     "error": "❌ Identifiant non trouvé",
#                     "code": "USER_NOT_FOUND"
#                 }, status=status.HTTP_401_UNAUTHORIZED)

# class ForgotPasswordView(APIView):
#     """Vue pour demande de réinitialisation de mot de passe"""
#     permission_classes = [permissions.AllowAny]
    
#     def post(self, request):
#         email = request.data.get('email')
#         print("=" * 70)
#         print("🔐 DEMANDE RÉINITIALISATION MOT DE PASSE")
#         print("=" * 70)
#         print(f"📧 Email reçu: {email}")
        
#         try:
#             user = User.objects.get(email=email)
            
#             print(f"✅ UTILISATEUR TROUVÉ: {user.username} (ID: {user.id})")
            
#             reset_token = secrets.token_urlsafe(32)
#             expiration_time = timezone.now() + timedelta(minutes=15)
            
#             matricule_autorise, created = MatriculeAutorise.objects.get_or_create(
#                 matricule=f"reset_{user.id}",
#                 defaults={
#                     'est_actif': True,
#                     'date_activation': timezone.now()
#                 }
#             )
            
#             matricule_autorise.activation_token = reset_token
#             matricule_autorise.token_expiration = expiration_time
#             matricule_autorise.save()
            
#             print(f"✅ TOKEN STOCKÉ POUR L'UTILISATEUR: {user.username}")
#             print(f"🔑 Token généré: {reset_token}")
#             print(f"⏰ Expire à: {expiration_time}")
            
#             reset_link = f"http://localhost:3001/reset-password?token={reset_token}&email={email}"
            
#             print(f"✅ DEMANDE ACCEPTÉE POUR: {email}")
#             print("=" * 70)
            
#             subject = '🔒 Réinitialisation de votre mot de passe - Plateforme Simplon'
            
#             html_message = f"""
#             <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden;">
#                 <div style="background: linear-gradient(135deg, #E30613, #B80505); color: white; padding: 25px; text-align: center;">
#                     <h1 style="margin: 0; font-size: 28px;">🔒 Plateforme Simplon</h1>
#                     <p style="margin: 5px 0 0 0; opacity: 0.9;">Réinitialisation de mot de passe</p>
#                 </div>
                
#                 <div style="padding: 30px; background: #ffffff;">
#                     <h2 style="color: #E30613; margin-top: 0;">Bonjour,</h2>
#                     <p style="font-size: 16px; line-height: 1.6; color: #333;">
#                         Vous avez demandé à réinitialiser votre mot de passe pour la plateforme interne Simplon.
#                     </p>
                    
#                     <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #E30613;">
#                         <p style="margin: 0; font-size: 16px;">
#                             <strong style="color: #E30613;">📧 Email :</strong> {email}<br>
#                             <strong style="color: #E30613;">👤 Nom d'utilisateur :</strong> {user.username}<br>
#                             <strong style="color: #E30613;">⏰ Lien valable :</strong> 15 minutes
#                         </p>
#                     </div>
                    
#                     <p style="text-align: center; margin: 30px 0;">
#                         <a href="{reset_link}" 
#                            style="background: linear-gradient(135deg, #E30613, #B80505); 
#                                   color: white; padding: 16px 35px; 
#                                   text-decoration: none; border-radius: 8px; 
#                                   font-size: 18px; font-weight: bold;
#                                   display: inline-block; 
#                                   box-shadow: 0 4px 15px rgba(227, 6, 19, 0.3);">
#                             🔑 Réinitialiser mon mot de passe
#                         </a>
#                     </p>
                    
#                     <div style="background: #fff3f3; padding: 15px; border-radius: 6px; margin: 20px 0; border: 2px solid #E30613;">
#                         <p style="margin: 0; font-size: 14px; color: #d32f2f; text-align: center;">
#                             <strong>⚠️ SÉCURITÉ :</strong> Ce lien expirera dans <strong>15 MINUTES</strong><br>
#                             <small>Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.</small>
#                         </p>
#                     </div>
                    
#                     <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #eee;">
#                         <p style="font-size: 14px; color: #666; margin-bottom: 10px;">
#                             <strong>Lien alternatif :</strong> Si le bouton ne fonctionne pas, copiez-collez ce lien dans votre navigateur :
#                         </p>
#                         <div style="background: #f5f5f5; padding: 12px; border-radius: 6px; border: 1px solid #ddd;">
#                             <code style="word-break: break-all; font-size: 12px; color: #333;">
#                                 {reset_link}
#                             </code>
#                         </div>
#                     </div>
#                 </div>
                
#                 <div style="background: #2c3e50; color: white; padding: 20px; text-align: center;">
#                     <p style="margin: 0; font-size: 14px;">
#                         <strong>© 2025 Simplon.co - Plateforme interne</strong>
#                     </p>
#                     <p style="margin: 5px 0 0 0; font-size: 12px; opacity: 0.8;">
#                         Cet email a été envoyé automatiquement, merci de ne pas y répondre.
#                     </p>
#                 </div>
#             </div>
#             """
            
#             plain_message = f"""RÉINITIALISATION DE MOT DE PASSE - PLATEFORME SIMPLON

# Bonjour,

# Vous avez demandé à réinitialiser votre mot de passe pour la plateforme interne Simplon.

# INFORMATIONS :
# 📧 Email : {email}
# 👤 Nom d'utilisateur : {user.username}

# POUR RÉINITIALISER VOTRE MOT DE PASSE :
# Cliquez sur le lien suivant :
# {reset_link}

# ⚠️ SÉCURITÉ :
# Ce lien de réinitialisation expirera dans 15 MINUTES!
# Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.

# Cordialement,
# L'équipe Simplon

# ---
# © 2025 Simplon.co - Plateforme interne
# Cet email a été envoyé automatiquement.
# """
            
#             try:
#                 send_mail(
#                     subject=subject,
#                     message=plain_message,
#                     from_email=settings.DEFAULT_FROM_EMAIL,
#                     recipient_list=[email],
#                     html_message=html_message,
#                     fail_silently=False,
#                 )
                
#                 print(f"✅ EMAIL DE RÉINITIALISATION ENVOYÉ À: {email}")
#                 print("=" * 70)
                
#                 return Response({
#                     "message": "✅ Si votre email est enregistré, un lien de réinitialisation a été envoyé. Vérifiez votre boîte mail (valable 15 minutes).",
#                     "status": "success"
#                 }, status=status.HTTP_200_OK)
                
#             except Exception as e:
#                 print(f"❌ ERREUR ENVOI EMAIL: {str(e)}")
#                 traceback.print_exc()
#                 print("=" * 70)
#                 return Response({
#                     "message": "❌ Erreur d'envoi d'email. Veuillez réessayer.",
#                     "status": "error"
#                 }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
#         except User.DoesNotExist:
#             print("❌ EMAIL NON TROUVÉ DANS LA BASE")
#             print("=" * 70)
#             return Response({
#                 "message": "✅ Si votre email est enregistré, un lien de réinitialisation a été envoyé. Vérifiez votre boîte mail (valable 15 minutes).",
#                 "status": "success"
#             }, status=status.HTTP_200_OK)

# class ResetPasswordView(generics.GenericAPIView):
#     """Vue pour finaliser la réinitialisation du mot de passe"""
#     permission_classes = [permissions.AllowAny]
    
#     def post(self, request):
#         token = request.data.get('token')
#         email = request.data.get('email')
#         new_password = request.data.get('new_password')
        
#         print("=" * 70)
#         print("🔐 TENTATIVE RÉINITIALISATION MOT DE PASSE")
#         print("=" * 70)
#         print(f"📧 Email: {email}")
#         print(f"🎫 Token: {token}")
#         print(f"🕒 Heure actuelle: {timezone.now()}")
        
#         try:
#             user = User.objects.get(email=email)
            
#             print(f"✅ UTILISATEUR TROUVÉ: {user.username}")
            
#             # Chercher le token dans le matricule temporaire
#             try:
#                 matricule_autorise = MatriculeAutorise.objects.get(
#                     matricule=f"reset_{user.id}",
#                     est_actif=True
#                 )
                
#                 print(f"🔑 Token stocké: {matricule_autorise.activation_token}")
#                 print(f"⏰ Expiration stockée: {matricule_autorise.token_expiration}")
                
#                 # Vérifier si le token correspond et n'est pas expiré
#                 if (not matricule_autorise.activation_token or 
#                     matricule_autorise.activation_token != token or
#                     matricule_autorise.is_token_expired()):
                    
#                     print("❌ TOKEN INVALIDE OU EXPIRÉ")
#                     return Response({
#                         "message": "❌ Lien de réinitialisation invalide ou expiré. Veuillez demander un nouveau lien.",
#                         "status": "error",
#                         "expired": True
#                     }, status=status.HTTP_400_BAD_REQUEST)
                
#                 print("✅ TOKEN VALIDE ET NON EXPIRÉ")
                
#                 # Réinitialiser le mot de passe
#                 user.set_password(new_password)
#                 user.save()
                
#                 # Nettoyer le token après utilisation
#                 matricule_autorise.activation_token = None
#                 matricule_autorise.token_expiration = None
#                 matricule_autorise.save()
                
#                 print(f"✅ MOT DE PASSE RÉINITIALISÉ POUR: {user.username}")
#                 print("=" * 70)
                
#                 return Response({
#                     "message": "✅ Mot de passe réinitialisé avec succès ! Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.",
#                     "status": "success"
#                 }, status=status.HTTP_200_OK)
                
#             except MatriculeAutorise.DoesNotExist:
#                 print("❌ TOKEN DE RÉINITIALISATION NON TROUVÉ")
#                 return Response({
#                     "message": "❌ Lien de réinitialisation invalide. Veuillez demander un nouveau lien.",
#                     "status": "error"
#                 }, status=status.HTTP_400_BAD_REQUEST)
            
#         except User.DoesNotExist:
#             print("❌ UTILISATEUR NON TROUVÉ")
#             print("=" * 70)
#             return Response({
#                 "message": "❌ Erreur lors de la réinitialisation. Veuillez vérifier vos informations.",
#                 "status": "error"
#             }, status=status.HTTP_400_BAD_REQUEST)

# # ⭐ VUE FONCTION POUR LE FRONTEND REACT - ENDPOINT users-with-projects
# @api_view(['GET'])
# def users_with_projects(request):
#     """Retourne tous les utilisateurs Simplon avec leurs projets"""
#     try:
#         print("=" * 70)
#         print("🔍 DÉBUT users_with_projects - DEBUG DÉTAILLÉ")
#         print("=" * 70)
        
#         # 1. Filtrer uniquement les utilisateurs Simplon
#         simplon_users = User.objects.filter(username__startswith='simplon_')
#         print(f"✅ {simplon_users.count()} utilisateur(s) Simplon trouvé(s)")
        
#         users_data = []
        
#         for user in simplon_users:
#             # 2. Récupérer les projets de cet utilisateur
#             projects = Project.objects.filter(author=user)
#             print(f"👤 {user.username}: {projects.count()} projet(s)")
            
#             projects_data = []
            
#             for project in projects:
#                 project_dict = {
#                     'id': project.id,
#                     'title': project.title or "Sans titre",
#                     'description': project.description or "",
#                     'technologies': project.technologies or "",
#                     'github_url': project.github_url or "",
#                     'demo_url': project.demo_url or "",
#                     'image': project.image.url if project.image else None,
#                     'status': project.status or "draft",
#                     'created_at': project.created_at,
#                     'updated_at': project.updated_at,
#                     'author': {
#                         'id': user.id,
#                         'username': user.username,
#                         'first_name': user.first_name or "",
#                         'last_name': user.last_name or "",
#                         'email': user.email or ""
#                     }
#                 }
#                 projects_data.append(project_dict)
            
#             user_dict = {
#                 'id': user.id,
#                 'username': user.username,
#                 'email': user.email or "",
#                 'first_name': user.first_name or "",
#                 'last_name': user.last_name or "",
#                 'date_joined': user.date_joined,
#                 'is_active': user.is_active,
#                 'projects_count': len(projects_data),
#                 'projects': projects_data
#             }
            
#             users_data.append(user_dict)
        
#         # 3. Trier par username
#         users_data.sort(key=lambda x: x['username'])
        
#         print("=" * 70)
#         print(f"✅ PRÊT POUR LE FRONTEND: {len(users_data)} utilisateur(s) avec projets")
        
#         for user in users_data:
#             print(f"   👤 {user['username']} - {user['projects_count']} projet(s)")
        
#         print("=" * 70)
        
#         return Response({
#             'count': len(users_data),
#             'users': users_data
#         })
        
#     except Exception as e:
#         print("❌ ERREUR DANS users_with_projects:")
#         print(f"   {str(e)}")
#         traceback.print_exc()
#         print("=" * 70)
        
#         return Response({
#             'error': str(e),
#             'message': 'Erreur serveur lors de la récupération des données',
#             'traceback': traceback.format_exc(),
#             'count': 0,
#             'users': []
#         }, status=500)
    
#     # users/views.py - AJOUTS AU FICHIER EXISTANT
# # (À ajouter à la fin du fichier existant)

# from django.db import transaction
# from django.utils import timezone
# import logging

# logger = logging.getLogger(__name__)

# class UserProfileImageView(generics.UpdateAPIView):
#     """
#     Vue spécifique pour mettre à jour la photo de profil
#     """
#     permission_classes = [permissions.IsAuthenticated]
#     serializer_class = UserProfileSerializer
    
#     def get_object(self):
#         return self.request.user.profile
    
#     def patch(self, request, *args, **kwargs):
#         """Mettre à jour uniquement la photo de profil"""
#         print("=" * 70)
#         print("🖼️  MISE À JOUR PHOTO DE PROFIL")
#         print("=" * 70)
        
#         if 'profile_picture' not in request.FILES:
#             return Response({
#                 "error": "Aucun fichier image fourni",
#                 "message": "Veuillez sélectionner une image"
#             }, status=status.HTTP_400_BAD_REQUEST)
        
#         instance = self.get_object()
        
#         # Supprimer l'ancienne photo si elle existe
#         if instance.profile_picture:
#             instance.profile_picture.delete(save=False)
        
#         # Sauvegarder la nouvelle photo
#         instance.profile_picture = request.FILES['profile_picture']
#         instance.save()
        
#         print(f"✅ PHOTO MIS À JOUR POUR: {request.user.username}")
#         print(f"📁 Fichier: {instance.profile_picture.name}")
#         print("=" * 70)
        
#         serializer = self.get_serializer(instance)
#         return Response(serializer.data)

# class UserProfileCompleteView(generics.RetrieveUpdateAPIView):
#     """
#     Vue complète pour le profil utilisateur avec toutes les infos
#     """
#     permission_classes = [permissions.IsAuthenticated]
#     serializer_class = UserSerializer
    
#     def get_object(self):
#         user = self.request.user
#         # S'assurer que le profil existe
#         if not hasattr(user, 'profile'):
#             UserProfile.objects.create(user=user)
#         return user
    
#     def get(self, request, *args, **kwargs):
#         """GET: Récupérer toutes les infos du profil"""
#         instance = self.get_object()
#         serializer = self.get_serializer(instance)
        
#         print("=" * 70)
#         print("📋 PROFIL COMPLET UTILISATEUR")
#         print("=" * 70)
#         print(f"👤 Utilisateur: {instance.username}")
#         print(f"📧 Email: {instance.email}")
#         print(f"📞 Téléphone: {instance.profile.phone if hasattr(instance, 'profile') else 'Non défini'}")
#         print(f"🎓 Promotion: {instance.profile.cohort if hasattr(instance, 'profile') else 'Non défini'}")
#         print("=" * 70)
        
#         return Response(serializer.data)
    
#     def perform_update(self, serializer):
#         """Override pour logguer les modifications"""
#         with transaction.atomic():
#             # Récupérer l'ancien état
#             old_instance = User.objects.get(id=self.request.user.id)
#             old_data = UserSerializer(old_instance).data
            
#             # Sauvegarder les modifications
#             instance = serializer.save()
            
#             # Logguer les modifications
#             self.log_profile_changes(old_data, serializer.data)
            
#             # Envoyer une notification
#             self.send_update_notification(instance)
            
#             print(f"✅ PROFIL COMPLET MIS À JOUR POUR: {instance.username}")
            
#             return instance
    
#     def log_profile_changes(self, old_data, new_data):
#         """Loggue les changements dans l'historique"""
#         user = self.request.user
        
#         # Comparer les champs
#         fields_to_check = ['first_name', 'last_name', 'email']
        
#         for field in fields_to_check:
#             if old_data.get(field) != new_data.get(field):
#                 ProfileUpdateHistory.objects.create(
#                     user=user,
#                     action='UPDATE',
#                     field_name=field,
#                     old_value=str(old_data.get(field, '')),
#                     new_value=str(new_data.get(field, '')),
#                     ip_address=self.get_client_ip(),
#                     user_agent=self.request.META.get('HTTP_USER_AGENT', ''),
#                     changed_by=user
#                 )
        
#         # Logguer les changements du profil étendu
#         if old_data.get('profile') != new_data.get('profile'):
#             profile_old = old_data.get('profile', {})
#             profile_new = new_data.get('profile', {})
            
#             profile_fields = ['phone', 'bio', 'cohort', 'specialite']
            
#             for field in profile_fields:
#                 if profile_old.get(field) != profile_new.get(field):
#                     ProfileUpdateHistory.objects.create(
#                         user=user,
#                         action='UPDATE',
#                         field_name=f"profile.{field}",
#                         old_value=str(profile_old.get(field, '')),
#                         new_value=str(profile_new.get(field, '')),
#                         ip_address=self.get_client_ip(),
#                         user_agent=self.request.META.get('HTTP_USER_AGENT', ''),
#                         changed_by=user
#                     )
    
#     def get_client_ip(self):
#         """Récupère l'adresse IP du client"""
#         x_forwarded_for = self.request.META.get('HTTP_X_FORWARDED_FOR')
#         if x_forwarded_for:
#             ip = x_forwarded_for.split(',')[0]
#         else:
#             ip = self.request.META.get('REMOTE_ADDR')
#         return ip
    
#     def send_update_notification(self, user):
#         """Envoie une notification de mise à jour"""
#         Notification.objects.create(
#             user=user,
#             type='PROFILE_UPDATE',
#             title='✅ Profil mis à jour',
#             message=f'Votre profil a été mis à jour avec succès le {timezone.now().strftime("%d/%m/%Y à %H:%M")}',
#             is_read=False
#         )

# class UserProfileHistoryView(generics.ListAPIView):
#     """
#     Vue pour l'historique des modifications du profil
#     """
#     permission_classes = [permissions.IsAuthenticated]
#     serializer_class = ProfileUpdateHistorySerializer
    
#     def get_queryset(self):
#         return ProfileUpdateHistory.objects.filter(user=self.request.user)

# class UserNotificationsView(generics.ListAPIView):
#     """
#     Vue pour les notifications de l'utilisateur
#     """
#     permission_classes = [permissions.IsAuthenticated]
#     serializer_class = NotificationSerializer
    
#     def get_queryset(self):
#         return Notification.objects.filter(user=self.request.user)
    
#     def get(self, request, *args, **kwargs):
#         """Récupère les notifications avec statistiques"""
#         queryset = self.get_queryset()
        
#         stats = {
#             'total': queryset.count(),
#             'unread': queryset.filter(is_read=False).count(),
#             'read': queryset.filter(is_read=True).count(),
#         }
        
#         serializer = self.get_serializer(queryset, many=True)
        
#         return Response({
#             'stats': stats,
#             'notifications': serializer.data,
#             'unread_count': stats['unread']
#         })

# class MarkNotificationReadView(generics.UpdateAPIView):
#     """
#     Vue pour marquer une notification comme lue
#     """
#     permission_classes = [permissions.IsAuthenticated]
#     serializer_class = NotificationSerializer
    
#     def get_queryset(self):
#         return Notification.objects.filter(user=self.request.user)
    
#     def patch(self, request, *args, **kwargs):
#         notification = self.get_object()
#         notification.is_read = True
#         notification.read_at = timezone.now()
#         notification.save()
        
#         return Response({
#             'message': '✅ Notification marquée comme lue',
#             'notification': self.get_serializer(notification).data
#         })

# class MarkAllNotificationsReadView(generics.GenericAPIView):
#     """
#     Vue pour marquer toutes les notifications comme lues
#     """
#     permission_classes = [permissions.IsAuthenticated]
    
#     def post(self, request, *args, **kwargs):
#         updated = Notification.objects.filter(
#             user=request.user, 
#             is_read=False
#         ).update(
#             is_read=True, 
#             read_at=timezone.now()
#         )
        
#         return Response({
#             'message': f'✅ {updated} notification(s) marquée(s) comme lue(s)',
#             'marked_read': updated
#         })

# class UserStatsView(APIView):
#     """
#     Vue pour les statistiques utilisateur
#     """
#     permission_classes = [permissions.IsAuthenticated]
    
#     def get(self, request):
#         user = request.user
        
#         stats = {
#             'user_info': {
#                 'username': user.username,
#                 'full_name': f"{user.first_name} {user.last_name}".strip() or user.username,
#                 'email': user.email,
#                 'member_since': user.date_joined.strftime('%d/%m/%Y'),
#                 'days_since_join': (timezone.now() - user.date_joined).days,
#             },
#             'profile_stats': {
#                 'profile_completion': self.calculate_profile_completion(user),
#                 'has_profile_picture': hasattr(user, 'profile') and bool(user.profile.profile_picture),
#                 'has_bio': hasattr(user, 'profile') and bool(user.profile.bio),
#                 'has_links': self.count_social_links(user),
#             },
#             'activity_stats': {
#                 'profile_updates': ProfileUpdateHistory.objects.filter(user=user).count(),
#                 'unread_notifications': Notification.objects.filter(user=user, is_read=False).count(),
#             }
#         }
        
#         return Response(stats)
    
#     def calculate_profile_completion(self, user):
#         """Calcule le pourcentage de complétion du profil"""
#         total_fields = 10
#         completed_fields = 0
        
#         # Champs de base
#         if user.first_name:
#             completed_fields += 1
#         if user.last_name:
#             completed_fields += 1
#         if user.email:
#             completed_fields += 1
        
#         # Champs du profil
#         if hasattr(user, 'profile'):
#             profile = user.profile
#             if profile.phone:
#                 completed_fields += 1
#             if profile.bio:
#                 completed_fields += 1
#             if profile.profile_picture:
#                 completed_fields += 1
#             if profile.github_url or profile.linkedin_url or profile.portfolio_url:
#                 completed_fields += 1
#             if profile.cohort:
#                 completed_fields += 1
#             if profile.specialite:
#                 completed_fields += 1
#             if profile.date_entree:
#                 completed_fields += 1
        
#         return round((completed_fields / total_fields) * 100, 1)
    
#     def count_social_links(self, user):
#         """Compte les liens sociaux remplis"""
#         if hasattr(user, 'profile'):
#             profile = user.profile
#             count = 0
#             if profile.github_url:
#                 count += 1
#             if profile.linkedin_url:
#                 count += 1
#             if profile.portfolio_url:
#                 count += 1
#             return count
#         return 0


# # users/views.py - VERSION COMPLÈTE CORRIGÉE
# from rest_framework import generics, permissions, status
# from rest_framework.response import Response
# from rest_framework.decorators import api_view, permission_classes
# from rest_framework.permissions import IsAuthenticated
# from django.contrib.auth.models import User
# from django.utils import timezone
# from django.core.mail import send_mail
# from django.conf import settings
# from .models import MatriculeAutorise
# from .serializers import UserSerializer  # ✅ Import de base
# import secrets
# from datetime import timedelta
# from rest_framework.views import APIView
# from projects.models import Project
# import traceback
# from django.db import transaction
# import logging

# logger = logging.getLogger(__name__)

# # ============================================
# # 1. VUE PRINCIPALE POUR LE PROFIL UTILISATEUR
# # ============================================

# class UserProfileView(generics.RetrieveUpdateAPIView):
#     """
#     Vue pour récupérer et mettre à jour le profil de l'utilisateur connecté
#     Supporte GET (lecture), PATCH (mise à jour partielle), PUT (mise à jour complète)
#     """
#     permission_classes = [permissions.IsAuthenticated]
#     serializer_class = UserSerializer
    
#     def get_object(self):
#         """Retourne l'utilisateur connecté"""
#         return self.request.user
    
#     def get(self, request, *args, **kwargs):
#         """GET: Récupérer le profil"""
#         instance = self.get_object()
#         serializer = self.get_serializer(instance)
        
#         print("=" * 70)
#         print("📱 GET PROFIL UTILISATEUR")
#         print("=" * 70)
#         print(f"👤 Utilisateur: {instance.username}")
#         print(f"📧 Email: {instance.email}")
#         print(f"🆔 ID: {instance.id}")
#         print("=" * 70)
        
#         return Response(serializer.data)
    
#     def patch(self, request, *args, **kwargs):
#         """PATCH: Mettre à jour partiellement le profil"""
#         instance = self.get_object()
        
#         print("=" * 70)
#         print("🔄 PATCH PROFIL UTILISATEUR")
#         print("=" * 70)
#         print(f"👤 Utilisateur: {instance.username}")
#         print(f"📧 Ancien email: {instance.email}")
#         print(f"📋 Données reçues: {request.data}")
#         print("=" * 70)
        
#         serializer = self.get_serializer(instance, data=request.data, partial=True)
#         serializer.is_valid(raise_exception=True)
#         self.perform_update(serializer)
        
#         print(f"✅ MISE À JOUR RÉUSSIE POUR: {instance.username}")
#         print(f"📧 Nouvel email: {instance.email}")
#         print("=" * 70)
        
#         return Response(serializer.data)
    
#     def put(self, request, *args, **kwargs):
#         """PUT: Mettre à jour complètement le profil"""
#         instance = self.get_object()
        
#         print("=" * 70)
#         print("🔄 PUT PROFIL UTILISATEUR")
#         print("=" * 70)
#         print(f"👤 Utilisateur: {instance.username}")
#         print(f"📋 Données reçues: {request.data}")
#         print("=" * 70)
        
#         serializer = self.get_serializer(instance, data=request.data)
#         serializer.is_valid(raise_exception=True)
#         self.perform_update(serializer)
        
#         print(f"✅ MISE À JOUR COMPLÈTE RÉUSSIE POUR: {instance.username}")
#         print("=" * 70)
        
#         return Response(serializer.data)

# # ============================================
# # 2. VUES POUR L'ACTIVATION DE COMPTE
# # ============================================

# class RequestLoginView(generics.GenericAPIView):
#     """Vue pour demander un lien d'activation par email"""
#     permission_classes = [permissions.AllowAny]
    
#     def post(self, request):
#         matricule = request.data.get('matricule')
#         email = request.data.get('email')
        
#         print("=" * 70)
#         print("🔐 DEMANDE D'INSCRIPTION REÇUE")
#         print("=" * 70)
#         print(f"📋 Matricule: {matricule}")
#         print(f"📧 Email: {email}")
        
#         # Vérifier si le matricule est autorisé
#         try:
#             matricule_autorise = MatriculeAutorise.objects.get(
#                 matricule=matricule,
#                 est_actif=True
#             )
            
#             # Générer un token sécurisé valable 5 minutes
#             token = secrets.token_urlsafe(32)
#             expiration_time = timezone.now() + timedelta(minutes=5)
            
#             # Sauvegarder le token et son expiration
#             matricule_autorise.activation_token = token
#             matricule_autorise.token_expiration = expiration_time
#             matricule_autorise.save()
            
#             activation_link = f"http://localhost:3001/setup-password?token={token}&matricule={matricule}&email={email}"
            
#             print(f"✅ MATRICULE AUTORISÉ: {matricule}")
#             print(f"⏰ Token généré: {token}")
#             print(f"🕒 Expire à: {expiration_time.strftime('%H:%M:%S')} (dans 5 minutes)")
#             print("=" * 70)
            
#             # ==================== ENVOI EMAIL ====================
#             print(f"📧 ENVOI EMAIL À: {email}")
            
#             subject = '🎯 Activez votre compte Simplon - Lien rapide!'
            
#             html_message = f"""
#             <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden;">
#                 <div style="background: linear-gradient(135deg, #E30613, #B80505); color: white; padding: 25px; text-align: center;">
#                     <h1 style="margin: 0; font-size: 28px;">🚀 Plateforme Simplon</h1>
#                     <p style="margin: 5px 0 0 0; opacity: 0.9;">Activation de votre compte</p>
#                 </div>
                
#                 <div style="padding: 30px; background: #ffffff;">
#                     <h2 style="color: #E30613; margin-top: 0;">Bonjour,</h2>
#                     <p style="font-size: 16px; line-height: 1.6; color: #333;">
#                         Vous avez demandé à créer un compte sur la plateforme interne Simplon.
#                     </p>
                    
#                     <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #E30613;">
#                         <p style="margin: 0; font-size: 16px;">
#                             <strong style="color: #E30613;">📋 Matricule :</strong> {matricule}<br>
#                             <strong style="color: #E30613;">📧 Email :</strong> {email}
#                         </p>
#                     </div>
                    
#                     <p style="text-align: center; margin: 30px 0;">
#                         <a href="{activation_link}" 
#                            style="background: linear-gradient(135deg, #E30613, #B80505); 
#                                   color: white; padding: 16px 35px; 
#                                   text-decoration: none; border-radius: 8px; 
#                                   font-size: 18px; font-weight: bold;
#                                   display: inline-block; 
#                                   box-shadow: 0 4px 15px rgba(227, 6, 19, 0.3);">
#                             ✅ Activer mon compte
#                         </a>
#                     </p>
                    
#                     <div style="background: #fff3f3; padding: 15px; border-radius: 6px; margin: 20px 0; border: 2px solid #E30613;">
#                         <p style="margin: 0; font-size: 14px; color: #d32f2f; text-align: center;">
#                             <strong>⚠️ URGENT :</strong> Ce lien expirera dans <strong>5 MINUTES</strong><br>
#                             <small>Expire à : {expiration_time.strftime('%H:%M:%S')}</small>
#                         </p>
#                     </div>
                    
#                     <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #eee;">
#                         <p style="font-size: 14px; color: #666; margin-bottom: 10px;">
#                             <strong>Lien alternatif :</strong> Si le bouton ne fonctionne pas, copiez-collez ce lien dans votre navigateur :
#                         </p>
#                         <div style="background: #f5f5f5; padding: 12px; border-radius: 6px; border: 1px solid #ddd;">
#                             <code style="word-break: break-all; font-size: 12px; color: #333;">
#                                 {activation_link}
#                             </code>
#                         </div>
#                     </div>
#                 </div>
                
#                 <div style="background: #2c3e50; color: white; padding: 20px; text-align: center;">
#                     <p style="margin: 0; font-size: 14px;">
#                         <strong>© 2025 Simplon.co - Plateforme interne</strong>
#                     </p>
#                     <p style="margin: 5px 0 0 0; font-size: 12px; opacity: 0.8;">
#                         Cet email a été envoyé automatiquement, merci de ne pas y répondre.
#                     </p>
#                 </div>
#             </div>
#             """
            
#             plain_message = f"""ACTIVATION DE COMPTE - PLATEFORME SIMPLON

# Bonjour,

# Vous avez demandé à créer un compte sur la plateforme interne Simplon.

# INFORMATIONS :
# 📋 Matricule : {matricule}
# 📧 Email : {email}

# POUR ACTIVER VOTRE COMPTE :
# Cliquez sur le lien suivant :
# {activation_link}

# ⚠️ URGENT :
# Ce lien d'activation expirera dans 5 MINUTES!
# Expire à : {expiration_time.strftime('%H:%M:%S')}

# Si vous n'avez pas demandé cette inscription, vous pouvez ignorer cet email.

# Cordialement,
# L'équipe Simplon

# ---
# © 2025 Simplon.co - Plateforme interne
# Cet email a été envoyé automatiquement.
# """
            
#             # ENVOI EMAIL RÉEL
#             try:
#                 send_mail(
#                     subject=subject,
#                     message=plain_message,
#                     from_email=settings.DEFAULT_FROM_EMAIL,
#                     recipient_list=[email],
#                     html_message=html_message,
#                     fail_silently=False,
#                 )
                
#                 print(f"✅ EMAIL RÉEL ENVOYÉ avec succès à: {email}")
#                 print("⏰ Le lien expirera dans 5 minutes")
#                 print("=" * 70)
                
#                 return Response({
#                     "message": "✅ Lien d'activation envoyé ! ⏰ Valable 5 minutes - Vérifiez vite votre email!",
#                     "status": "success",
#                     "expires_in": "5 minutes"
#                 }, status=status.HTTP_200_OK)
                
#             except Exception as e:
#                 print(f"❌ ERREUR ENVOI EMAIL: {str(e)}")
#                 print("=" * 70)
#                 return Response({
#                     "message": f"⚠️ Erreur d'envoi d'email. Utilisez ce lien (valable 5 minutes): {activation_link}",
#                     "activation_link": activation_link,
#                     "status": "success",
#                     "expires_in": "5 minutes"
#                 }, status=status.HTTP_200_OK)
            
#         except MatriculeAutorise.DoesNotExist:
#             print("❌ MATRICULE NON AUTORISÉ")
#             print("=" * 70)
#             return Response({
#                 "message": "❌ Matricule non autorisé ou introuvable.",
#                 "status": "error"
#             }, status=status.HTTP_400_BAD_REQUEST)


# class SetupPasswordView(generics.GenericAPIView):
#     """Vue pour finaliser la création du compte avec mot de passe"""
#     permission_classes = [permissions.AllowAny]
    
#     def post(self, request):
#         token = request.data.get('token')
#         matricule = request.data.get('matricule')
#         email = request.data.get('email')
#         username = request.data.get('username')
#         password = request.data.get('password')
        
#         print("=" * 70)
#         print(" VÉRIFICATION DU LIEN D'ACTIVATION - DEBUG")
#         print("=" * 70)
#         print(f" Matricule: {matricule}")
#         print(f" Email: {email}")
#         print(f" Token: {token}")
#         print(f" Heure actuelle: {timezone.now()}")
        
#         try:
#             # Vérifier le matricule
#             matricule_autorise = MatriculeAutorise.objects.get(
#                 matricule=matricule,
#                 est_actif=True
#             )
            
#             print(f"✅ Matricule trouvé: {matricule_autorise.matricule}")
#             print(f" Token stocké: {matricule_autorise.activation_token}")
#             print(f" Expiration stockée: {matricule_autorise.token_expiration}")
            
#             # Vérifier si le token correspond
#             if not matricule_autorise.activation_token or matricule_autorise.activation_token != token:
#                 print("❌ TOKEN INVALIDE OU MANQUANT")
#                 print(f"   Token attendu: {matricule_autorise.activation_token}")
#                 print(f"   Token reçu: {token}")
#                 return Response({
#                     "message": "❌ Lien d'activation invalide ou déjà utilisé.",
#                     "status": "error"
#                 }, status=status.HTTP_400_BAD_REQUEST)
            
#             # Vérifier si le token est expiré
#             if matricule_autorise.is_token_expired():
#                 print("❌ TOKEN EXPIRÉ - DÉTAILS:")
#                 time_diff = timezone.now() - matricule_autorise.token_expiration
#                 print(f"   Temps écoulé depuis expiration: {time_diff}")
#                 print(f"   Secondes écoulées: {time_diff.total_seconds()}s")
#                 print(f"   Minutes écoulées: {time_diff.total_seconds() / 60}min")
                
#                 return Response({
#                     "message": "❌ Le lien d'activation a expiré. Il n'était valable que 5 minutes. Veuillez demander un nouveau lien.",
#                     "status": "error",
#                     "expired": True
#                 }, status=status.HTTP_400_BAD_REQUEST)
            
#             print("✅ TOKEN VALIDE ET NON EXPIRÉ")
#             remaining_seconds = matricule_autorise.get_remaining_time()
#             print(f"   Temps restant: {remaining_seconds} secondes")
#             print(f"   Soit: {remaining_seconds / 60} minutes")
            
#             # Vérifier si le username est disponible
#             if User.objects.filter(username=username).exists():
#                 print("❌ Username déjà pris")
#                 return Response({
#                     "message": "❌ Ce nom d'utilisateur est déjà pris.",
#                     "status": "error"
#                 }, status=status.HTTP_400_BAD_REQUEST)
            
#             # Vérification email améliorée
#             existing_user_with_email = User.objects.filter(email=email).first()
#             if existing_user_with_email:
#                 if existing_user_with_email.username != matricule:
#                     print(f"❌ Email déjà utilisé par un autre matricule: {existing_user_with_email.username}")
#                     return Response({
#                         "message": "❌ Cet email est déjà associé à un autre compte.",
#                         "status": "error"
#                     }, status=status.HTTP_400_BAD_REQUEST)
#                 else:
#                     print(f"✅ Email réutilisé pour le même matricule: {matricule}")
            
#             # Créer ou mettre à jour l'utilisateur
#             user, created = User.objects.get_or_create(
#                 username=matricule,
#                 defaults={
#                     'email': email,
#                     'password': password,
#                     'first_name': '',
#                     'last_name': ''
#                 }
#             )
            
#             if not created:
#                 user.email = email
#                 user.set_password(password)
#                 user.save()
#                 print(f"✅ COMPTE MIS À JOUR: {username}")
#             else:
#                 print(f"✅ NOUVEAU COMPTE CRÉÉ: {username}")
            
#             # Marquer le matricule comme activé
#             matricule_autorise.date_activation = timezone.now()
#             matricule_autorise.activation_token = None
#             matricule_autorise.token_expiration = None
#             matricule_autorise.save()
            
#             print(f"✅ COMPTE CRÉÉ/MIS À JOUR AVEC SUCCÈS!")
#             print(f"Username: {username}")
#             print(f" Email: {email}")
#             print(f" ID: {user.id}")
#             print("=" * 70)
            
#             return Response({
#                 "message": "✅ Compte créé avec succès ! Vous pouvez maintenant vous connecter.",
#                 "status": "success",
#                 "username": username
#             }, status=status.HTTP_200_OK)
            
#         except MatriculeAutorise.DoesNotExist:
#             print("❌ MATRICULE NON AUTORISÉ")
#             print("=" * 70)
#             return Response({
#                 "message": "❌ Matricule non autorisé ou introuvable.",
#                 "status": "error"
#             }, status=status.HTTP_400_BAD_REQUEST)
#         except Exception as e:
#             print(f"❌ ERREUR: {str(e)}")
#             print("=" * 70)
#             return Response({
#                 "message": f"❌ Erreur: {str(e)}",
#                 "status": "error"
#             }, status=status.HTTP_400_BAD_REQUEST)

# # ============================================
# # 3. VUES POUR LA CONNEXION
# # ============================================

# class DirectLoginView(generics.GenericAPIView):
#     """Vue pour connexion directe avec username/password"""
#     permission_classes = [permissions.AllowAny]
    
#     def post(self, request):
#         username = request.data.get('username')
#         password = request.data.get('password')
        
#         print("=" * 70)
#         print(f" TENTATIVE DE CONNEXION: {username}")
        
#         from django.contrib.auth import authenticate
        
#         user = authenticate(username=username, password=password)
        
#         if user is not None:
#             from rest_framework_simplejwt.tokens import RefreshToken
#             refresh = RefreshToken.for_user(user)
            
#             print(f"✅ CONNEXION RÉUSSIE: {user.username}")
#             print(f" Email: {user.email}")
#             print(f" ID: {user.id}")
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
#                 }
#             })
#         else:
#             print("❌ IDENTIFIANTS INCORRECTS")
#             print("=" * 70)
#             return Response({
#                 "error": "❌ Identifiants incorrects"
#             }, status=status.HTTP_401_UNAUTHORIZED)


# class QuickLoginView(generics.GenericAPIView):
#     """Vue pour connexion rapide avec matricule/username"""
#     permission_classes = [permissions.AllowAny]
    
#     def post(self, request):
#         matricule = request.data.get('matricule')
#         username = request.data.get('username')
#         password = request.data.get('password')
        
#         print("=" * 70)
#         print("⚡ CONNEXION RAPIDE TENTATIVE - DEBUG DÉTAILLÉ")
#         print("=" * 70)
#         print(f"📋 Données reçues: {request.data}")
#         print(f"📋 Matricule: {matricule}")
#         print(f"👤 Username: {username}") 
#         print(f"🔑 Password: {'*' * len(password) if password else 'None'}")
        
#         # Utiliser username OU matricule
#         login_identifier = username or matricule
        
#         if not login_identifier:
#             print("❌ ERREUR: Aucun identifiant fourni (username ou matricule)")
#             return Response({
#                 "error": "Identifiant manquant. Fournissez un username ou matricule.",
#                 "code": "MISSING_IDENTIFIER"
#             }, status=status.HTTP_400_BAD_REQUEST)
        
#         if not password:
#             print("❌ ERREUR: Mot de passe manquant")
#             return Response({
#                 "error": "Mot de passe manquant.",
#                 "code": "MISSING_PASSWORD"
#             }, status=status.HTTP_400_BAD_REQUEST)

#         # Vérifier si le matricule est autorisé ET activé
#         try:
#             matricule_autorise = MatriculeAutorise.objects.get(
#                 matricule=login_identifier,
#                 est_actif=True,
#                 date_activation__isnull=False
#             )
#             print(f"✅ MATRICULE AUTORISÉ ET ACTIVÉ: {login_identifier}")
            
#         except MatriculeAutorise.DoesNotExist:
#             print(f"❌ MATRICULE NON ACTIVÉ OU INTROUVABLE: {login_identifier}")
#             return Response({
#                 "error": "❌ Compte non activé. Utilisez 'Activer mon compte' pour créer votre compte d'abord.",
#                 "code": "ACCOUNT_NOT_ACTIVATED"
#             }, status=status.HTTP_400_BAD_REQUEST)
        
#         # Authentifier avec Django
#         from django.contrib.auth import authenticate
#         user = authenticate(username=login_identifier, password=password)
        
#         print(f"🔐 RÉSULTAT AUTHENTIFICATION: {user}")
        
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
#             print("❌ ÉCHEC AUTHENTIFICATION - Vérifier:")
#             print(f"   - Identifiant: {login_identifier}")
#             print(f"   - Utilisateur existe: {User.objects.filter(username=login_identifier).exists()}")
            
#             if User.objects.filter(username=login_identifier).exists():
#                 print("   - ❌ Mot de passe incorrect")
#                 return Response({
#                     "error": "❌ Mot de passe incorrect",
#                     "code": "INVALID_PASSWORD"
#                 }, status=status.HTTP_401_UNAUTHORIZED)
#             else:
#                 print("   - ❌ Utilisateur non trouvé")
#                 return Response({
#                     "error": "❌ Identifiant non trouvé",
#                     "code": "USER_NOT_FOUND"
#                 }, status=status.HTTP_401_UNAUTHORIZED)

# # ============================================
# # 4. VUES POUR LA RÉINITIALISATION DE MOT DE PASSE
# # ============================================

# class ForgotPasswordView(APIView):
#     """Vue pour demande de réinitialisation de mot de passe"""
#     permission_classes = [permissions.AllowAny]
    
#     def post(self, request):
#         email = request.data.get('email')
#         print("=" * 70)
#         print("🔐 DEMANDE RÉINITIALISATION MOT DE PASSE")
#         print("=" * 70)
#         print(f"📧 Email reçu: {email}")
        
#         try:
#             user = User.objects.get(email=email)
            
#             print(f"✅ UTILISATEUR TROUVÉ: {user.username} (ID: {user.id})")
            
#             reset_token = secrets.token_urlsafe(32)
#             expiration_time = timezone.now() + timedelta(minutes=15)
            
#             matricule_autorise, created = MatriculeAutorise.objects.get_or_create(
#                 matricule=f"reset_{user.id}",
#                 defaults={
#                     'est_actif': True,
#                     'date_activation': timezone.now()
#                 }
#             )
            
#             matricule_autorise.activation_token = reset_token
#             matricule_autorise.token_expiration = expiration_time
#             matricule_autorise.save()
            
#             print(f"✅ TOKEN STOCKÉ POUR L'UTILISATEUR: {user.username}")
#             print(f"🔑 Token généré: {reset_token}")
#             print(f"⏰ Expire à: {expiration_time}")
            
#             reset_link = f"http://localhost:3001/reset-password?token={reset_token}&email={email}"
            
#             print(f"✅ DEMANDE ACCEPTÉE POUR: {email}")
#             print("=" * 70)
            
#             subject = '🔒 Réinitialisation de votre mot de passe - Plateforme Simplon'
            
#             html_message = f"""
#             <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden;">
#                 <div style="background: linear-gradient(135deg, #E30613, #B80505); color: white; padding: 25px; text-align: center;">
#                     <h1 style="margin: 0; font-size: 28px;">🔒 Plateforme Simplon</h1>
#                     <p style="margin: 5px 0 0 0; opacity: 0.9;">Réinitialisation de mot de passe</p>
#                 </div>
                
#                 <div style="padding: 30px; background: #ffffff;">
#                     <h2 style="color: #E30613; margin-top: 0;">Bonjour,</h2>
#                     <p style="font-size: 16px; line-height: 1.6; color: #333;">
#                         Vous avez demandé à réinitialiser votre mot de passe pour la plateforme interne Simplon.
#                     </p>
                    
#                     <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #E30613;">
#                         <p style="margin: 0; font-size: 16px;">
#                             <strong style="color: #E30613;">📧 Email :</strong> {email}<br>
#                             <strong style="color: #E30613;">👤 Nom d'utilisateur :</strong> {user.username}<br>
#                             <strong style="color: #E30613;">⏰ Lien valable :</strong> 15 minutes
#                         </p>
#                     </div>
                    
#                     <p style="text-align: center; margin: 30px 0;">
#                         <a href="{reset_link}" 
#                            style="background: linear-gradient(135deg, #E30613, #B80505); 
#                                   color: white; padding: 16px 35px; 
#                                   text-decoration: none; border-radius: 8px; 
#                                   font-size: 18px; font-weight: bold;
#                                   display: inline-block; 
#                                   box-shadow: 0 4px 15px rgba(227, 6, 19, 0.3);">
#                             🔑 Réinitialiser mon mot de passe
#                         </a>
#                     </p>
                    
#                     <div style="background: #fff3f3; padding: 15px; border-radius: 6px; margin: 20px 0; border: 2px solid #E30613;">
#                         <p style="margin: 0; font-size: 14px; color: #d32f2f; text-align: center;">
#                             <strong>⚠️ SÉCURITÉ :</strong> Ce lien expirera dans <strong>15 MINUTES</strong><br>
#                             <small>Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.</small>
#                         </p>
#                     </div>
                    
#                     <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #eee;">
#                         <p style="font-size: 14px; color: #666; margin-bottom: 10px;">
#                             <strong>Lien alternatif :</strong> Si le bouton ne fonctionne pas, copiez-collez ce lien dans votre navigateur :
#                         </p>
#                         <div style="background: #f5f5f5; padding: 12px; border-radius: 6px; border: 1px solid #ddd;">
#                             <code style="word-break: break-all; font-size: 12px; color: #333;">
#                                 {reset_link}
#                             </code>
#                         </div>
#                     </div>
#                 </div>
                
#                 <div style="background: #2c3e50; color: white; padding: 20px; text-align: center;">
#                     <p style="margin: 0; font-size: 14px;">
#                         <strong>© 2025 Simplon.co - Plateforme interne</strong>
#                     </p>
#                     <p style="margin: 5px 0 0 0; font-size: 12px; opacity: 0.8;">
#                         Cet email a été envoyé automatiquement, merci de ne pas y répondre.
#                     </p>
#                 </div>
#             </div>
#             """
            
#             plain_message = f"""RÉINITIALISATION DE MOT DE PASSE - PLATEFORME SIMPLON

# Bonjour,

# Vous avez demandé à réinitialiser votre mot de passe pour la plateforme interne Simplon.

# INFORMATIONS :
# 📧 Email : {email}
# 👤 Nom d'utilisateur : {user.username}

# POUR RÉINITIALISER VOTRE MOT DE PASSE :
# Cliquez sur le lien suivant :
# {reset_link}

# ⚠️ SÉCURITÉ :
# Ce lien de réinitialisation expirera dans 15 MINUTES!
# Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.

# Cordialement,
# L'équipe Simplon

# ---
# © 2025 Simplon.co - Plateforme interne
# Cet email a été envoyé automatiquement.
# """
            
#             try:
#                 send_mail(
#                     subject=subject,
#                     message=plain_message,
#                     from_email=settings.DEFAULT_FROM_EMAIL,
#                     recipient_list=[email],
#                     html_message=html_message,
#                     fail_silently=False,
#                 )
                
#                 print(f"✅ EMAIL DE RÉINITIALISATION ENVOYÉ À: {email}")
#                 print("=" * 70)
                
#                 return Response({
#                     "message": "✅ Si votre email est enregistré, un lien de réinitialisation a été envoyé. Vérifiez votre boîte mail (valable 15 minutes).",
#                     "status": "success"
#                 }, status=status.HTTP_200_OK)
                
#             except Exception as e:
#                 print(f"❌ ERREUR ENVOI EMAIL: {str(e)}")
#                 traceback.print_exc()
#                 print("=" * 70)
#                 return Response({
#                     "message": "❌ Erreur d'envoi d'email. Veuillez réessayer.",
#                     "status": "error"
#                 }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
#         except User.DoesNotExist:
#             print("❌ EMAIL NON TROUVÉ DANS LA BASE")
#             print("=" * 70)
#             return Response({
#                 "message": "✅ Si votre email est enregistré, un lien de réinitialisation a été envoyé. Vérifiez votre boîte mail (valable 15 minutes).",
#                 "status": "success"
#             }, status=status.HTTP_200_OK)


# class ResetPasswordView(generics.GenericAPIView):
#     """Vue pour finaliser la réinitialisation du mot de passe"""
#     permission_classes = [permissions.AllowAny]
    
#     def post(self, request):
#         token = request.data.get('token')
#         email = request.data.get('email')
#         new_password = request.data.get('new_password')
        
#         print("=" * 70)
#         print("🔐 TENTATIVE RÉINITIALISATION MOT DE PASSE")
#         print("=" * 70)
#         print(f"📧 Email: {email}")
#         print(f"🎫 Token: {token}")
#         print(f"🕒 Heure actuelle: {timezone.now()}")
        
#         try:
#             user = User.objects.get(email=email)
            
#             print(f"✅ UTILISATEUR TROUVÉ: {user.username}")
            
#             # Chercher le token dans le matricule temporaire
#             try:
#                 matricule_autorise = MatriculeAutorise.objects.get(
#                     matricule=f"reset_{user.id}",
#                     est_actif=True
#                 )
                
#                 print(f"🔑 Token stocké: {matricule_autorise.activation_token}")
#                 print(f"⏰ Expiration stockée: {matricule_autorise.token_expiration}")
                
#                 # Vérifier si le token correspond et n'est pas expiré
#                 if (not matricule_autorise.activation_token or 
#                     matricule_autorise.activation_token != token or
#                     matricule_autorise.is_token_expired()):
                    
#                     print("❌ TOKEN INVALIDE OU EXPIRÉ")
#                     return Response({
#                         "message": "❌ Lien de réinitialisation invalide ou expiré. Veuillez demander un nouveau lien.",
#                         "status": "error",
#                         "expired": True
#                     }, status=status.HTTP_400_BAD_REQUEST)
                
#                 print("✅ TOKEN VALIDE ET NON EXPIRÉ")
                
#                 # Réinitialiser le mot de passe
#                 user.set_password(new_password)
#                 user.save()
                
#                 # Nettoyer le token après utilisation
#                 matricule_autorise.activation_token = None
#                 matricule_autorise.token_expiration = None
#                 matricule_autorise.save()
                
#                 print(f"✅ MOT DE PASSE RÉINITIALISÉ POUR: {user.username}")
#                 print("=" * 70)
                
#                 return Response({
#                     "message": "✅ Mot de passe réinitialisé avec succès ! Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.",
#                     "status": "success"
#                 }, status=status.HTTP_200_OK)
                
#             except MatriculeAutorise.DoesNotExist:
#                 print("❌ TOKEN DE RÉINITIALISATION NON TROUVÉ")
#                 return Response({
#                     "message": "❌ Lien de réinitialisation invalide. Veuillez demander un nouveau lien.",
#                     "status": "error"
#                 }, status=status.HTTP_400_BAD_REQUEST)
            
#         except User.DoesNotExist:
#             print("❌ UTILISATEUR NON TROUVÉ")
#             print("=" * 70)
#             return Response({
#                 "message": "❌ Erreur lors de la réinitialisation. Veuillez vérifier vos informations.",
#                 "status": "error"
#             }, status=status.HTTP_400_BAD_REQUEST)

# # ============================================
# # 5. VUE POUR LE FRONTEND REACT
# # ============================================

# @api_view(['GET'])
# def users_with_projects(request):
#     """Retourne tous les utilisateurs Simplon avec leurs projets"""
#     try:
#         print("=" * 70)
#         print("🔍 DÉBUT users_with_projects - DEBUG DÉTAILLÉ")
#         print("=" * 70)
        
#         # 1. Filtrer uniquement les utilisateurs Simplon
#         simplon_users = User.objects.filter(username__startswith='simplon_')
#         print(f"✅ {simplon_users.count()} utilisateur(s) Simplon trouvé(s)")
        
#         users_data = []
        
#         for user in simplon_users:
#             # 2. Récupérer les projets de cet utilisateur
#             projects = Project.objects.filter(author=user)
#             print(f"👤 {user.username}: {projects.count()} projet(s)")
            
#             projects_data = []
            
#             for project in projects:
#                 project_dict = {
#                     'id': project.id,
#                     'title': project.title or "Sans titre",
#                     'description': project.description or "",
#                     'technologies': project.technologies or "",
#                     'github_url': project.github_url or "",
#                     'demo_url': project.demo_url or "",
#                     'image': project.image.url if project.image else None,
#                     'status': project.status or "draft",
#                     'created_at': project.created_at,
#                     'updated_at': project.updated_at,
#                     'author': {
#                         'id': user.id,
#                         'username': user.username,
#                         'first_name': user.first_name or "",
#                         'last_name': user.last_name or "",
#                         'email': user.email or ""
#                     }
#                 }
#                 projects_data.append(project_dict)
            
#             user_dict = {
#                 'id': user.id,
#                 'username': user.username,
#                 'email': user.email or "",
#                 'first_name': user.first_name or "",
#                 'last_name': user.last_name or "",
#                 'date_joined': user.date_joined,
#                 'is_active': user.is_active,
#                 'projects_count': len(projects_data),
#                 'projects': projects_data
#             }
            
#             users_data.append(user_dict)
        
#         # 3. Trier par username
#         users_data.sort(key=lambda x: x['username'])
        
#         print("=" * 70)
#         print(f"✅ PRÊT POUR LE FRONTEND: {len(users_data)} utilisateur(s) avec projets")
        
#         for user in users_data:
#             print(f"   👤 {user['username']} - {user['projects_count']} projet(s)")
        
#         print("=" * 70)
        
#         return Response({
#             'count': len(users_data),
#             'users': users_data
#         })
        
#     except Exception as e:
#         print("❌ ERREUR DANS users_with_projects:")
#         print(f"   {str(e)}")
#         traceback.print_exc()
#         print("=" * 70)
        
#         return Response({
#             'error': str(e),
#             'message': 'Erreur serveur lors de la récupération des données',
#             'traceback': traceback.format_exc(),
#             'count': 0,
#             'users': []
#         }, status=500)

# # ============================================
# # 6. NOUVELLES VUES AMÉLIORÉES (À AJOUTER APRÈS MIGRATION)
# # ============================================
# # NOTE: Ces vues nécessitent les nouveaux modèles (UserProfile, etc.)
# # Elles sont commentées pour l'instant pour éviter les erreurs

# """
# # ⭐ IMPORTS POUR LES NOUVELLES FONCTIONNALITÉS ⭐
# # Décommentez ces imports après avoir créé les modèles
# from .models import UserProfile, ProfileUpdateHistory, Notification
# from .serializers import (
#     UserProfileSerializer, 
#     ProfileUpdateHistorySerializer, 
#     NotificationSerializer
# )

# class UserProfileCompleteView(generics.RetrieveUpdateAPIView):
#     # Vue complète pour le profil utilisateur avec toutes les infos
#     # À ajouter après création des modèles
#     pass

# class UserProfileImageView(generics.UpdateAPIView):
#     # Vue spécifique pour mettre à jour la photo de profil
#     # À ajouter après création des modèles
#     pass

# class UserProfileHistoryView(generics.ListAPIView):
#     # Vue pour l'historique des modifications du profil
#     # À ajouter après création des modèles
#     pass

# class UserNotificationsView(generics.ListAPIView):
#     # Vue pour les notifications de l'utilisateur
#     # À ajouter après création des modèles
#     pass

# class MarkNotificationReadView(generics.UpdateAPIView):
#     # Vue pour marquer une notification comme lue
#     # À ajouter après création des modèles
#     pass

# class MarkAllNotificationsReadView(generics.GenericAPIView):
#     # Vue pour marquer toutes les notifications comme lues
#     # À ajouter après création des modèles
#     pass

# class UserStatsView(APIView):
#     # Vue pour les statistiques utilisateur
#     # À ajouter après création des modèles
#     pass
# """

# # users/views.py - VERSION FINALE COMPLÈTE CORRIGÉE
# from rest_framework import generics, permissions, status, viewsets
# from rest_framework.response import Response
# from rest_framework.decorators import api_view, permission_classes, action
# from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
# from rest_framework.views import APIView
# from django.contrib.auth.models import User
# from django.utils import timezone
# from django.core.mail import send_mail
# from django.conf import settings
# from django.db.models import Count, Q
# from datetime import timedelta, datetime
# import secrets
# import traceback
# import logging
# import json

# # ============ MODÈLES & SÉRIALIZERS ============
# from .models import MatriculeAutorise, UserProfile, ProfileUpdateHistory, Notification
# from .serializers import (
#     UserSerializer,
#     UserProfileSerializer,
#     ProfileUpdateHistorySerializer,
#     NotificationSerializer,
#     UserWithProfileSerializer,
#     PasswordChangeSerializer,
#     AvatarUploadSerializer,
#     UserStatsSerializer,
#     UserCreateSerializer
# )
# from projects.models import Project

# logger = logging.getLogger(__name__)

# # ============================================
# # 1. VUE PRINCIPALE POUR LE PROFIL UTILISATEUR - AMÉLIORÉE
# # ============================================

# class UserProfileView(generics.RetrieveUpdateAPIView):
#     """
#     Vue améliorée pour récupérer et mettre à jour le profil utilisateur
#     Supporte GET (lecture), PATCH (mise à jour partielle), PUT (mise à jour complète)
#     AVEC historique des modifications et notifications
#     """
#     permission_classes = [permissions.IsAuthenticated]
#     serializer_class = UserSerializer
    
#     def get_object(self):
#         """Retourne l'utilisateur connecté"""
#         return self.request.user
    
#     def get(self, request, *args, **kwargs):
#         """GET: Récupérer le profil avec statistiques"""
#         instance = self.get_object()
#         serializer = self.get_serializer(instance)
        
#         # Ajouter des informations supplémentaires
#         data = serializer.data
        
#         # Vérifier si le profil étendu existe
#         try:
#             user_profile = UserProfile.objects.get(user=instance)
#             data['has_extended_profile'] = True
#             data['avatar_url'] = request.build_absolute_uri(user_profile.avatar.url) if user_profile.avatar else None
#         except UserProfile.DoesNotExist:
#             data['has_extended_profile'] = False
        
#         # Statistiques
#         data['projects_count'] = Project.objects.filter(author=instance).count()
#         data['unread_notifications'] = Notification.objects.filter(user=instance, is_read=False).count()
        
#         print("=" * 70)
#         print("📱 GET PROFIL UTILISATEUR AMÉLIORÉ")
#         print("=" * 70)
#         print(f"👤 Utilisateur: {instance.username}")
#         print(f"📧 Email: {instance.email}")
#         print(f"🆔 ID: {instance.id}")
#         print(f"📊 Projets: {data['projects_count']}")
#         print(f"🔔 Notifications non lues: {data['unread_notifications']}")
#         print("=" * 70)
        
#         return Response(data)
    
#     def update(self, request, *args, **kwargs):
#         """
#         Surcharge pour tracker les modifications et créer des notifications
#         """
#         instance = self.get_object()
#         partial = kwargs.pop('partial', False)
        
#         # Sauvegarder les données avant modification
#         old_data = {
#             'email': instance.email,
#             'first_name': instance.first_name,
#             'last_name': instance.last_name,
#         }
        
#         serializer = self.get_serializer(instance, data=request.data, partial=partial)
#         serializer.is_valid(raise_exception=True)
        
#         print("=" * 70)
#         print(f"🔄 MISE À JOUR PROFIL - Utilisateur: {instance.username}")
#         print("=" * 70)
#         print(f"📋 Données reçues: {json.dumps(request.data, indent=2)}")
#         print(f"📊 Mode: {'PATCH' if partial else 'PUT'}")
        
#         # Appliquer les modifications
#         self.perform_update(serializer)
        
#         # Récupérer les données après modification
#         new_data = {
#             'email': instance.email,
#             'first_name': instance.first_name,
#             'last_name': instance.last_name,
#         }
        
#         # Identifier les changements
#         changes = {}
#         for key in old_data.keys():
#             old_value = old_data[key] or ""
#             new_value = new_data[key] or ""
#             if old_value != new_value:
#                 changes[key] = {
#                     'old': old_value,
#                     'new': new_value
#                 }
        
#         # Enregistrer l'historique si des changements
#         if changes:
#             # Créer ou mettre à jour le profil étendu
#             profile, created = UserProfile.objects.get_or_create(user=instance)
            
#             # Enregistrer dans l'historique
#             ProfileUpdateHistory.objects.create(
#                 user=instance,
#                 changes=changes,
#                 ip_address=self.get_client_ip(request),
#                 user_agent=request.META.get('HTTP_USER_AGENT', '')
#             )
            
#             # Créer une notification
#             Notification.objects.create(
#                 user=instance,
#                 message=f"✅ Votre profil a été mis à jour ({len(changes)} modification(s))",
#                 notification_type='profile_update'
#             )
            
#             print(f"✅ {len(changes)} CHANGEMENT(S) ENREGISTRÉ(S):")
#             for field, change in changes.items():
#                 print(f"   📝 {field}: '{change['old']}' → '{change['new']}'")
        
#         print(f"✅ MISE À JOUR RÉUSSIE POUR: {instance.username}")
#         print("=" * 70)
        
#         return Response({
#             'status': 'success',
#             'message': 'Profil mis à jour avec succès' + (f' ({len(changes)} changement(s))' if changes else ''),
#             'data': serializer.data,
#             'changes': changes if changes else None,
#             'history_id': ProfileUpdateHistory.objects.filter(user=instance).last().id if changes else None
#         })
    
#     def patch(self, request, *args, **kwargs):
#         """PATCH: Mettre à jour partiellement le profil"""
#         kwargs['partial'] = True
#         return self.update(request, *args, **kwargs)
    
#     def put(self, request, *args, **kwargs):
#         """PUT: Mettre à jour complètement le profil"""
#         return self.update(request, *args, **kwargs)
    
#     def get_client_ip(self, request):
#         """Récupère l'adresse IP du client"""
#         x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
#         if x_forwarded_for:
#             ip = x_forwarded_for.split(',')[0]
#         else:
#             ip = request.META.get('REMOTE_ADDR')
#         return ip

# # ============================================
# # 2. VUES POUR LE PROFIL ÉTENDU
# # ============================================

# class UserProfileCompleteView(generics.RetrieveUpdateAPIView):
#     """
#     Vue complète pour le profil utilisateur avec toutes les infos étendues
#     """
#     permission_classes = [permissions.IsAuthenticated]
#     serializer_class = UserWithProfileSerializer
    
#     def get_object(self):
#         return self.request.user
    
#     def get(self, request, *args, **kwargs):
#         """Récupérer toutes les informations du profil"""
#         instance = self.get_object()
        
#         # S'assurer que le profil étendu existe
#         UserProfile.objects.get_or_create(user=instance)
        
#         serializer = self.get_serializer(instance)
        
#         print("=" * 70)
#         print("📋 PROFIL COMPLET UTILISATEUR")
#         print("=" * 70)
#         print(f"👤 Utilisateur: {instance.username}")
#         print(f"📧 Email: {instance.email}")
#         print("=" * 70)
        
#         return Response(serializer.data)

# class UserProfileImageView(APIView):
#     """
#     Vue spécifique pour uploader/modifier la photo de profil
#     """
#     permission_classes = [permissions.IsAuthenticated]
    
#     def post(self, request):
#         """Uploader une nouvelle photo de profil"""
#         serializer = AvatarUploadSerializer(data=request.data)
#         if serializer.is_valid():
#             # Récupérer ou créer le profil
#             profile, created = UserProfile.objects.get_or_create(user=request.user)
            
#             # Supprimer l'ancienne image si elle existe
#             if profile.avatar:
#                 profile.avatar.delete(save=False)
            
#             # Sauvegarder la nouvelle image
#             profile.avatar = serializer.validated_data['avatar']
#             profile.save()
            
#             # Enregistrer dans l'historique
#             ProfileUpdateHistory.objects.create(
#                 user=request.user,
#                 changes={'avatar': 'updated'},
#                 ip_address=self.get_client_ip(request),
#                 user_agent=request.META.get('HTTP_USER_AGENT', '')
#             )
            
#             # Créer une notification
#             Notification.objects.create(
#                 user=request.user,
#                 message="🖼️ Votre photo de profil a été mise à jour",
#                 notification_type='profile_update'
#             )
            
#             print("=" * 70)
#             print("🖼️ PHOTO DE PROFIL MIS À JOUR")
#             print("=" * 70)
#             print(f"👤 Utilisateur: {request.user.username}")
#             print(f"📁 Fichier: {profile.avatar.name}")
#             print("=" * 70)
            
#             return Response({
#                 'status': 'success',
#                 'message': 'Photo de profil mise à jour avec succès',
#                 'avatar_url': request.build_absolute_uri(profile.avatar.url) if profile.avatar else None
#             })
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
#     def delete(self, request):
#         """Supprimer la photo de profil"""
#         try:
#             profile = UserProfile.objects.get(user=request.user)
#             if profile.avatar:
#                 profile.avatar.delete(save=False)
#                 profile.avatar = None
#                 profile.save()
                
#                 ProfileUpdateHistory.objects.create(
#                     user=request.user,
#                     changes={'avatar': 'removed'},
#                     ip_address=self.get_client_ip(request),
#                     user_agent=request.META.get('HTTP_USER_AGENT', '')
#                 )
                
#                 print("=" * 70)
#                 print("🗑️ PHOTO DE PROFIL SUPPRIMÉE")
#                 print("=" * 70)
#                 print(f"👤 Utilisateur: {request.user.username}")
#                 print("=" * 70)
                
#                 return Response({
#                     'status': 'success',
#                     'message': 'Photo de profil supprimée avec succès'
#                 })
#             return Response({
#                 'status': 'info',
#                 'message': 'Aucune photo de profil à supprimer'
#             })
#         except UserProfile.DoesNotExist:
#             return Response({
#                 'status': 'error',
#                 'message': 'Profil non trouvé'
#             }, status=status.HTTP_404_NOT_FOUND)
    
#     def get_client_ip(self, request):
#         x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
#         return x_forwarded_for.split(',')[0] if x_forwarded_for else request.META.get('REMOTE_ADDR')

# class UserProfileHistoryView(generics.ListAPIView):
#     """
#     Vue pour l'historique des modifications du profil
#     """
#     permission_classes = [permissions.IsAuthenticated]
#     serializer_class = ProfileUpdateHistorySerializer
    
#     def get_queryset(self):
#         return ProfileUpdateHistory.objects.filter(
#             user=self.request.user
#         ).order_by('-updated_at')
    
#     def list(self, request, *args, **kwargs):
#         """Retourne l'historique avec métadonnées"""
#         queryset = self.get_queryset()
#         serializer = self.get_serializer(queryset, many=True)
        
#         print("=" * 70)
#         print("📜 HISTORIQUE DES MODIFICATIONS")
#         print("=" * 70)
#         print(f"👤 Utilisateur: {request.user.username}")
#         print(f"📊 Nombre d'entrées: {queryset.count()}")
#         print("=" * 70)
        
#         return Response({
#             'count': queryset.count(),
#             'history': serializer.data
#         })

# # ============================================
# # 3. VUES POUR LES NOTIFICATIONS
# # ============================================

# class UserNotificationsView(generics.ListAPIView):
#     """
#     Vue pour les notifications de l'utilisateur
#     """
#     permission_classes = [permissions.IsAuthenticated]
#     serializer_class = NotificationSerializer
    
#     def get_queryset(self):
#         return Notification.objects.filter(
#             user=self.request.user
#         ).order_by('-created_at')
    
#     def list(self, request, *args, **kwargs):
#         """Retourne les notifications avec statistiques"""
#         queryset = self.get_queryset()
#         serializer = self.get_serializer(queryset, many=True)
        
#         unread_count = queryset.filter(is_read=False).count()
        
#         print("=" * 70)
#         print("🔔 NOTIFICATIONS UTILISATEUR")
#         print("=" * 70)
#         print(f"👤 Utilisateur: {request.user.username}")
#         print(f"📊 Total: {queryset.count()}")
#         print(f"📨 Non lues: {unread_count}")
#         print("=" * 70)
        
#         return Response({
#             'count': queryset.count(),
#             'unread_count': unread_count,
#             'notifications': serializer.data
#         })

# class MarkNotificationReadView(generics.UpdateAPIView):
#     """
#     Vue pour marquer une notification comme lue
#     """
#     permission_classes = [permissions.IsAuthenticated]
#     serializer_class = NotificationSerializer
#     queryset = Notification.objects.all()
    
#     def update(self, request, *args, **kwargs):
#         notification = self.get_object()
        
#         # Vérifier que la notification appartient à l'utilisateur
#         if notification.user != request.user:
#             return Response({
#                 'status': 'error',
#                 'message': 'Non autorisé'
#             }, status=status.HTTP_403_FORBIDDEN)
        
#         notification.is_read = True
#         notification.save()
        
#         print("=" * 70)
#         print("✅ NOTIFICATION MARQUÉE COMME LUE")
#         print("=" * 70)
#         print(f"👤 Utilisateur: {request.user.username}")
#         print(f"📝 Notification ID: {notification.id}")
#         print(f"📄 Message: {notification.message[:50]}...")
#         print("=" * 70)
        
#         return Response({
#             'status': 'success',
#             'message': 'Notification marquée comme lue',
#             'notification_id': notification.id
#         })

# class MarkAllNotificationsReadView(generics.GenericAPIView):
#     """
#     Vue pour marquer toutes les notifications comme lues
#     """
#     permission_classes = [permissions.IsAuthenticated]
    
#     def post(self, request):
#         updated_count = Notification.objects.filter(
#             user=request.user,
#             is_read=False
#         ).update(is_read=True)
        
#         print("=" * 70)
#         print("✅ TOUTES LES NOTIFICATIONS MARQUÉES COMME LUES")
#         print("=" * 70)
#         print(f"👤 Utilisateur: {request.user.username}")
#         print(f"📊 Notifications mises à jour: {updated_count}")
#         print("=" * 70)
        
#         return Response({
#             'status': 'success',
#             'message': f'{updated_count} notification(s) marquée(s) comme lue(s)',
#             'updated_count': updated_count
#         })

# # ============================================
# # 4. VUES POUR LES STATISTIQUES
# # ============================================

# class UserStatsView(APIView):
#     """
#     Vue pour les statistiques utilisateur
#     """
#     permission_classes = [permissions.IsAuthenticated]
    
#     def get(self, request):
#         user = request.user
        
#         # Statistiques de base
#         projects_count = Project.objects.filter(author=user).count()
#         unread_notifications = Notification.objects.filter(user=user, is_read=False).count()
#         profile_updates = ProfileUpdateHistory.objects.filter(user=user).count()
        
#         # Date de la dernière activité
#         last_activity = max([
#             user.last_login or user.date_joined,
#             ProfileUpdateHistory.objects.filter(user=user).order_by('-updated_at').first().updated_at 
#             if ProfileUpdateHistory.objects.filter(user=user).exists() else user.date_joined
#         ])
        
#         # Complétude du profil
#         profile_completeness = 50  # Base 50%
#         try:
#             profile = UserProfile.objects.get(user=user)
#             if profile.avatar:
#                 profile_completeness += 20
#             if profile.bio:
#                 profile_completeness += 10
#             if profile.phone or profile.location:
#                 profile_completeness += 10
#             if profile.company or profile.position:
#                 profile_completeness += 10
#         except UserProfile.DoesNotExist:
#             pass
        
#         data = {
#             'user': {
#                 'username': user.username,
#                 'email': user.email,
#                 'date_joined': user.date_joined,
#                 'last_login': user.last_login
#             },
#             'projects': {
#                 'total': projects_count,
#                 'active': Project.objects.filter(author=user, status='published').count(),
#                 'draft': Project.objects.filter(author=user, status='draft').count()
#             },
#             'notifications': {
#                 'total': Notification.objects.filter(user=user).count(),
#                 'unread': unread_notifications,
#                 'read': Notification.objects.filter(user=user, is_read=True).count()
#             },
#             'profile': {
#                 'updates_count': profile_updates,
#                 'completeness': min(profile_completeness, 100),
#                 'has_avatar': UserProfile.objects.filter(user=user, avatar__isnull=False).exists()
#             },
#             'activity': {
#                 'last_activity': last_activity,
#                 'days_since_joined': (timezone.now() - user.date_joined).days,
#                 'is_active_today': user.last_login.date() == timezone.now().date() if user.last_login else False
#             }
#         }
        
#         print("=" * 70)
#         print("📊 STATISTIQUES UTILISATEUR")
#         print("=" * 70)
#         print(f"👤 Utilisateur: {user.username}")
#         print(f"📁 Projets: {projects_count}")
#         print(f"🔔 Notifications non lues: {unread_notifications}")
#         print(f"📝 Modifications profil: {profile_updates}")
#         print(f"📈 Complétude profil: {data['profile']['completeness']}%")
#         print("=" * 70)
        
#         return Response(data)

# # ============================================
# # 5. VUE POUR CHANGEMENT DE MOT DE PASSE
# # ============================================

# class ChangePasswordView(generics.UpdateAPIView):
#     """
#     Vue pour changer le mot de passe de l'utilisateur connecté
#     """
#     permission_classes = [permissions.IsAuthenticated]
#     serializer_class = PasswordChangeSerializer
    
#     def update(self, request, *args, **kwargs):
#         user = request.user
#         serializer = self.get_serializer(data=request.data)
        
#         if serializer.is_valid():
#             # Vérifier l'ancien mot de passe
#             if not user.check_password(serializer.validated_data['old_password']):
#                 return Response({
#                     'status': 'error',
#                     'message': 'Ancien mot de passe incorrect'
#                 }, status=status.HTTP_400_BAD_REQUEST)
            
#             # Changer le mot de passe
#             user.set_password(serializer.validated_data['new_password'])
#             user.save()
            
#             # Créer une notification
#             Notification.objects.create(
#                 user=user,
#                 message="🔐 Votre mot de passe a été changé avec succès",
#                 notification_type='system'
#             )
            
#             print("=" * 70)
#             print("🔐 CHANGEMENT DE MOT DE PASSE")
#             print("=" * 70)
#             print(f"👤 Utilisateur: {user.username}")
#             print(f"✅ Mot de passe changé avec succès")
#             print("=" * 70)
            
#             return Response({
#                 'status': 'success',
#                 'message': 'Mot de passe changé avec succès'
#             })
        
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# # ============================================
# # 6. VUES EXISTANTES POUR L'AUTHENTIFICATION
# # ============================================

# class RequestLoginView(generics.GenericAPIView):
#     """Vue pour demander un lien d'activation par email"""
#     permission_classes = [permissions.AllowAny]
    
#     def post(self, request):
#         matricule = request.data.get('matricule')
#         email = request.data.get('email')
        
#         print("=" * 70)
#         print("🔐 DEMANDE D'INSCRIPTION REÇUE")
#         print("=" * 70)
#         print(f"📋 Matricule: {matricule}")
#         print(f"📧 Email: {email}")
        
#         # Vérifier si le matricule est autorisé
#         try:
#             matricule_autorise = MatriculeAutorise.objects.get(
#                 matricule=matricule,
#                 est_actif=True
#             )
            
#             # Générer un token sécurisé valable 5 minutes
#             token = secrets.token_urlsafe(32)
#             expiration_time = timezone.now() + timedelta(minutes=5)
            
#             # Sauvegarder le token et son expiration
#             matricule_autorise.activation_token = token
#             matricule_autorise.token_expiration = expiration_time
#             matricule_autorise.save()
            
#             activation_link = f"http://localhost:3001/setup-password?token={token}&matricule={matricule}&email={email}"
            
#             print(f"✅ MATRICULE AUTORISÉ: {matricule}")
#             print(f"⏰ Token généré: {token}")
#             print(f"🕒 Expire à: {expiration_time.strftime('%H:%M:%S')} (dans 5 minutes)")
#             print("=" * 70)
            
#             # ==================== ENVOI EMAIL ====================
#             print(f"📧 ENVOI EMAIL À: {email}")
            
#             subject = '🎯 Activez votre compte Simplon - Lien rapide!'
            
#             html_message = f"""
#             <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden;">
#                 <div style="background: linear-gradient(135deg, #E30613, #B80505); color: white; padding: 25px; text-align: center;">
#                     <h1 style="margin: 0; font-size: 28px;">🚀 Plateforme Simplon</h1>
#                     <p style="margin: 5px 0 0 0; opacity: 0.9;">Activation de votre compte</p>
#                 </div>
                
#                 <div style="padding: 30px; background: #ffffff;">
#                     <h2 style="color: #E30613; margin-top: 0;">Bonjour,</h2>
#                     <p style="font-size: 16px; line-height: 1.6; color: #333;">
#                         Vous avez demandé à créer un compte sur la plateforme interne Simplon.
#                     </p>
                    
#                     <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #E30613;">
#                         <p style="margin: 0; font-size: 16px;">
#                             <strong style="color: #E30613;">📋 Matricule :</strong> {matricule}<br>
#                             <strong style="color: #E30613;">📧 Email :</strong> {email}
#                         </p>
#                     </div>
                    
#                     <p style="text-align: center; margin: 30px 0;">
#                         <a href="{activation_link}" 
#                            style="background: linear-gradient(135deg, #E30613, #B80505); 
#                                   color: white; padding: 16px 35px; 
#                                   text-decoration: none; border-radius: 8px; 
#                                   font-size: 18px; font-weight: bold;
#                                   display: inline-block; 
#                                   box-shadow: 0 4px 15px rgba(227, 6, 19, 0.3);">
#                             ✅ Activer mon compte
#                         </a>
#                     </p>
                    
#                     <div style="background: #fff3f3; padding: 15px; border-radius: 6px; margin: 20px 0; border: 2px solid #E30613;">
#                         <p style="margin: 0; font-size: 14px; color: #d32f2f; text-align: center;">
#                             <strong>⚠️ URGENT :</strong> Ce lien expirera dans <strong>5 MINUTES</strong><br>
#                             <small>Expire à : {expiration_time.strftime('%H:%M:%S')}</small>
#                         </p>
#                     </div>
                    
#                     <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #eee;">
#                         <p style="font-size: 14px; color: #666; margin-bottom: 10px;">
#                             <strong>Lien alternatif :</strong> Si le bouton ne fonctionne pas, copiez-collez ce lien dans votre navigateur :
#                         </p>
#                         <div style="background: #f5f5f5; padding: 12px; border-radius: 6px; border: 1px solid #ddd;">
#                             <code style="word-break: break-all; font-size: 12px; color: #333;">
#                                 {activation_link}
#                             </code>
#                         </div>
#                     </div>
#                 </div>
                
#                 <div style="background: #2c3e50; color: white; padding: 20px; text-align: center;">
#                     <p style="margin: 0; font-size: 14px;">
#                         <strong>© 2025 Simplon.co - Plateforme interne</strong>
#                     </p>
#                     <p style="margin: 5px 0 0 0; font-size: 12px; opacity: 0.8;">
#                         Cet email a été envoyé automatiquement, merci de ne pas y répondre.
#                     </p>
#                 </div>
#             </div>
#             """
            
#             plain_message = f"""ACTIVATION DE COMPTE - PLATEFORME SIMPLON

# Bonjour,

# Vous avez demandé à créer un compte sur la plateforme interne Simplon.

# INFORMATIONS :
# 📋 Matricule : {matricule}
# 📧 Email : {email}

# POUR ACTIVER VOTRE COMPTE :
# Cliquez sur le lien suivant :
# {activation_link}

# ⚠️ URGENT :
# Ce lien d'activation expirera dans 5 MINUTES!
# Expire à : {expiration_time.strftime('%H:%M:%S')}

# Si vous n'avez pas demandé cette inscription, vous pouvez ignorer cet email.

# Cordialement,
# L'équipe Simplon

# ---
# © 2025 Simplon.co - Plateforme interne
# Cet email a été envoyé automatiquement.
# """
            
#             # ENVOI EMAIL RÉEL
#             try:
#                 send_mail(
#                     subject=subject,
#                     message=plain_message,
#                     from_email=settings.DEFAULT_FROM_EMAIL,
#                     recipient_list=[email],
#                     html_message=html_message,
#                     fail_silently=False,
#                 )
                
#                 print(f"✅ EMAIL RÉEL ENVOYÉ avec succès à: {email}")
#                 print("⏰ Le lien expirera dans 5 minutes")
#                 print("=" * 70)
                
#                 return Response({
#                     "message": "✅ Lien d'activation envoyé ! ⏰ Valable 5 minutes - Vérifiez vite votre email!",
#                     "status": "success",
#                     "expires_in": "5 minutes"
#                 }, status=status.HTTP_200_OK)
                
#             except Exception as e:
#                 print(f"❌ ERREUR ENVOI EMAIL: {str(e)}")
#                 print("=" * 70)
#                 return Response({
#                     "message": f"⚠️ Erreur d'envoi d'email. Utilisez ce lien (valable 5 minutes): {activation_link}",
#                     "activation_link": activation_link,
#                     "status": "success",
#                     "expires_in": "5 minutes"
#                 }, status=status.HTTP_200_OK)
            
#         except MatriculeAutorise.DoesNotExist:
#             print("❌ MATRICULE NON AUTORISÉ")
#             print("=" * 70)
#             return Response({
#                 "message": "❌ Matricule non autorisé ou introuvable.",
#                 "status": "error"
#             }, status=status.HTTP_400_BAD_REQUEST)

# class SetupPasswordView(generics.GenericAPIView):
#     """Vue pour finaliser la création du compte avec mot de passe"""
#     permission_classes = [permissions.AllowAny]
    
#     def post(self, request):
#         token = request.data.get('token')
#         matricule = request.data.get('matricule')
#         email = request.data.get('email')
#         username = request.data.get('username')
#         password = request.data.get('password')
        
#         print("=" * 70)
#         print(" VÉRIFICATION DU LIEN D'ACTIVATION - DEBUG")
#         print("=" * 70)
#         print(f" Matricule: {matricule}")
#         print(f" Email: {email}")
#         print(f" Token: {token}")
#         print(f" Heure actuelle: {timezone.now()}")
        
#         try:
#             # Vérifier le matricule
#             matricule_autorise = MatriculeAutorise.objects.get(
#                 matricule=matricule,
#                 est_actif=True
#             )
            
#             print(f"✅ Matricule trouvé: {matricule_autorise.matricule}")
#             print(f" Token stocké: {matricule_autorise.activation_token}")
#             print(f" Expiration stockée: {matricule_autorise.token_expiration}")
            
#             # Vérifier si le token correspond
#             if not matricule_autorise.activation_token or matricule_autorise.activation_token != token:
#                 print("❌ TOKEN INVALIDE OU MANQUANT")
#                 print(f"   Token attendu: {matricule_autorise.activation_token}")
#                 print(f"   Token reçu: {token}")
#                 return Response({
#                     "message": "❌ Lien d'activation invalide ou déjà utilisé.",
#                     "status": "error"
#                 }, status=status.HTTP_400_BAD_REQUEST)
            
#             # Vérifier si le token est expiré
#             if matricule_autorise.is_token_expired():
#                 print("❌ TOKEN EXPIRÉ - DÉTAILS:")
#                 time_diff = timezone.now() - matricule_autorise.token_expiration
#                 print(f"   Temps écoulé depuis expiration: {time_diff}")
#                 print(f"   Secondes écoulées: {time_diff.total_seconds()}s")
#                 print(f"   Minutes écoulées: {time_diff.total_seconds() / 60}min")
                
#                 return Response({
#                     "message": "❌ Le lien d'activation a expiré. Il n'était valable que 5 minutes. Veuillez demander un nouveau lien.",
#                     "status": "error",
#                     "expired": True
#                 }, status=status.HTTP_400_BAD_REQUEST)
            
#             print("✅ TOKEN VALIDE ET NON EXPIRÉ")
#             remaining_seconds = matricule_autorise.get_remaining_time()
#             print(f"   Temps restant: {remaining_seconds} secondes")
#             print(f"   Soit: {remaining_seconds / 60} minutes")
            
#             # Vérifier si le username est disponible
#             if User.objects.filter(username=username).exists():
#                 print("❌ Username déjà pris")
#                 return Response({
#                     "message": "❌ Ce nom d'utilisateur est déjà pris.",
#                     "status": "error"
#                 }, status=status.HTTP_400_BAD_REQUEST)
            
#             # Vérification email améliorée
#             existing_user_with_email = User.objects.filter(email=email).first()
#             if existing_user_with_email:
#                 if existing_user_with_email.username != matricule:
#                     print(f"❌ Email déjà utilisé par un autre matricule: {existing_user_with_email.username}")
#                     return Response({
#                         "message": "❌ Cet email est déjà associé à un autre compte.",
#                         "status": "error"
#                     }, status=status.HTTP_400_BAD_REQUEST)
#                 else:
#                     print(f"✅ Email réutilisé pour le même matricule: {matricule}")
            
#             # Créer ou mettre à jour l'utilisateur
#             user, created = User.objects.get_or_create(
#                 username=matricule,
#                 defaults={
#                     'email': email,
#                     'password': password,
#                     'first_name': '',
#                     'last_name': ''
#                 }
#             )
            
#             if not created:
#                 user.email = email
#                 user.set_password(password)
#                 user.save()
#                 print(f"✅ COMPTE MIS À JOUR: {username}")
#             else:
#                 print(f"✅ NOUVEAU COMPTE CRÉÉ: {username}")
            
#             # Marquer le matricule comme activé
#             matricule_autorise.date_activation = timezone.now()
#             matricule_autorise.activation_token = None
#             matricule_autorise.token_expiration = None
#             matricule_autorise.save()
            
#             print(f"✅ COMPTE CRÉÉ/MIS À JOUR AVEC SUCCÈS!")
#             print(f"Username: {username}")
#             print(f" Email: {email}")
#             print(f" ID: {user.id}")
#             print("=" * 70)
            
#             return Response({
#                 "message": "✅ Compte créé avec succès ! Vous pouvez maintenant vous connecter.",
#                 "status": "success",
#                 "username": username
#             }, status=status.HTTP_200_OK)
            
#         except MatriculeAutorise.DoesNotExist:
#             print("❌ MATRICULE NON AUTORISÉ")
#             print("=" * 70)
#             return Response({
#                 "message": "❌ Matricule non autorisé ou introuvable.",
#                 "status": "error"
#             }, status=status.HTTP_400_BAD_REQUEST)
#         except Exception as e:
#             print(f"❌ ERREUR: {str(e)}")
#             print("=" * 70)
#             return Response({
#                 "message": f"❌ Erreur: {str(e)}",
#                 "status": "error"
#             }, status=status.HTTP_400_BAD_REQUEST)

# class DirectLoginView(generics.GenericAPIView):
#     """Vue pour connexion directe avec username/password"""
#     permission_classes = [permissions.AllowAny]
    
#     def post(self, request):
#         username = request.data.get('username')
#         password = request.data.get('password')
        
#         print("=" * 70)
#         print(f" TENTATIVE DE CONNEXION: {username}")
        
#         from django.contrib.auth import authenticate
        
#         user = authenticate(username=username, password=password)
        
#         if user is not None:
#             from rest_framework_simplejwt.tokens import RefreshToken
#             refresh = RefreshToken.for_user(user)
            
#             print(f"✅ CONNEXION RÉUSSIE: {user.username}")
#             print(f" Email: {user.email}")
#             print(f" ID: {user.id}")
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
#                 }
#             })
#         else:
#             print("❌ IDENTIFIANTS INCORRECTS")
#             print("=" * 70)
#             return Response({
#                 "error": "❌ Identifiants incorrects"
#             }, status=status.HTTP_401_UNAUTHORIZED)

# class QuickLoginView(generics.GenericAPIView):
#     """Vue pour connexion rapide avec matricule/username"""
#     permission_classes = [permissions.AllowAny]
    
#     def post(self, request):
#         matricule = request.data.get('matricule')
#         username = request.data.get('username')
#         password = request.data.get('password')
        
#         print("=" * 70)
#         print("⚡ CONNEXION RAPIDE TENTATIVE - DEBUG DÉTAILLÉ")
#         print("=" * 70)
#         print(f"📋 Données reçues: {request.data}")
#         print(f"📋 Matricule: {matricule}")
#         print(f"👤 Username: {username}") 
#         print(f"🔑 Password: {'*' * len(password) if password else 'None'}")
        
#         # Utiliser username OU matricule
#         login_identifier = username or matricule
        
#         if not login_identifier:
#             print("❌ ERREUR: Aucun identifiant fourni (username ou matricule)")
#             return Response({
#                 "error": "Identifiant manquant. Fournissez un username ou matricule.",
#                 "code": "MISSING_IDENTIFIER"
#             }, status=status.HTTP_400_BAD_REQUEST)
        
#         if not password:
#             print("❌ ERREUR: Mot de passe manquant")
#             return Response({
#                 "error": "Mot de passe manquant.",
#                 "code": "MISSING_PASSWORD"
#             }, status=status.HTTP_400_BAD_REQUEST)

#         # Vérifier si le matricule est autorisé ET activé
#         try:
#             matricule_autorise = MatriculeAutorise.objects.get(
#                 matricule=login_identifier,
#                 est_actif=True,
#                 date_activation__isnull=False
#             )
#             print(f"✅ MATRICULE AUTORISÉ ET ACTIVÉ: {login_identifier}")
            
#         except MatriculeAutorise.DoesNotExist:
#             print(f"❌ MATRICULE NON ACTIVÉ OU INTROUVABLE: {login_identifier}")
#             return Response({
#                 "error": "❌ Compte non activé. Utilisez 'Activer mon compte' pour créer votre compte d'abord.",
#                 "code": "ACCOUNT_NOT_ACTIVATED"
#             }, status=status.HTTP_400_BAD_REQUEST)
        
#         # Authentifier avec Django
#         from django.contrib.auth import authenticate
#         user = authenticate(username=login_identifier, password=password)
        
#         print(f"🔐 RÉSULTAT AUTHENTIFICATION: {user}")
        
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
#             print("❌ ÉCHEC AUTHENTIFICATION - Vérifier:")
#             print(f"   - Identifiant: {login_identifier}")
#             print(f"   - Utilisateur existe: {User.objects.filter(username=login_identifier).exists()}")
            
#             if User.objects.filter(username=login_identifier).exists():
#                 print("   - ❌ Mot de passe incorrect")
#                 return Response({
#                     "error": "❌ Mot de passe incorrect",
#                     "code": "INVALID_PASSWORD"
#                 }, status=status.HTTP_401_UNAUTHORIZED)
#             else:
#                 print("   - ❌ Utilisateur non trouvé")
#                 return Response({
#                     "error": "❌ Identifiant non trouvé",
#                     "code": "USER_NOT_FOUND"
#                 }, status=status.HTTP_401_UNAUTHORIZED)

# class ForgotPasswordView(APIView):
#     """Vue pour demande de réinitialisation de mot de passe"""
#     permission_classes = [permissions.AllowAny]
    
#     def post(self, request):
#         email = request.data.get('email')
#         print("=" * 70)
#         print("🔐 DEMANDE RÉINITIALISATION MOT DE PASSE")
#         print("=" * 70)
#         print(f"📧 Email reçu: {email}")
        
#         try:
#             user = User.objects.get(email=email)
            
#             print(f"✅ UTILISATEUR TROUVÉ: {user.username} (ID: {user.id})")
            
#             reset_token = secrets.token_urlsafe(32)
#             expiration_time = timezone.now() + timedelta(minutes=15)
            
#             matricule_autorise, created = MatriculeAutorise.objects.get_or_create(
#                 matricule=f"reset_{user.id}",
#                 defaults={
#                     'est_actif': True,
#                     'date_activation': timezone.now()
#                 }
#             )
            
#             matricule_autorise.activation_token = reset_token
#             matricule_autorise.token_expiration = expiration_time
#             matricule_autorise.save()
            
#             print(f"✅ TOKEN STOCKÉ POUR L'UTILISATEUR: {user.username}")
#             print(f"🔑 Token généré: {reset_token}")
#             print(f"⏰ Expire à: {expiration_time}")
            
#             reset_link = f"http://localhost:3001/reset-password?token={reset_token}&email={email}"
            
#             print(f"✅ DEMANDE ACCEPTÉE POUR: {email}")
#             print("=" * 70)
            
#             subject = '🔒 Réinitialisation de votre mot de passe - Plateforme Simplon'
            
#             html_message = f"""
#             <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden;">
#                 <div style="background: linear-gradient(135deg, #E30613, #B80505); color: white; padding: 25px; text-align: center;">
#                     <h1 style="margin: 0; font-size: 28px;">🔒 Plateforme Simplon</h1>
#                     <p style="margin: 5px 0 0 0; opacity: 0.9;">Réinitialisation de mot de passe</p>
#                 </div>
                
#                 <div style="padding: 30px; background: #ffffff;">
#                     <h2 style="color: #E30613; margin-top: 0;">Bonjour,</h2>
#                     <p style="font-size: 16px; line-height: 1.6; color: #333;">
#                         Vous avez demandé à réinitialiser votre mot de passe pour la plateforme interne Simplon.
#                     </p>
                    
#                     <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #E30613;">
#                         <p style="margin: 0; font-size: 16px;">
#                             <strong style="color: #E30613;">📧 Email :</strong> {email}<br>
#                             <strong style="color: #E30613;">👤 Nom d'utilisateur :</strong> {user.username}<br>
#                             <strong style="color: #E30613;">⏰ Lien valable :</strong> 15 minutes
#                         </p>
#                     </div>
                    
#                     <p style="text-align: center; margin: 30px 0;">
#                         <a href="{reset_link}" 
#                            style="background: linear-gradient(135deg, #E30613, #B80505); 
#                                   color: white; padding: 16px 35px; 
#                                   text-decoration: none; border-radius: 8px; 
#                                   font-size: 18px; font-weight: bold;
#                                   display: inline-block; 
#                                   box-shadow: 0 4px 15px rgba(227, 6, 19, 0.3);">
#                             🔑 Réinitialiser mon mot de passe
#                         </a>
#                     </p>
                    
#                     <div style="background: #fff3f3; padding: 15px; border-radius: 6px; margin: 20px 0; border: 2px solid #E30613;">
#                         <p style="margin: 0; font-size: 14px; color: #d32f2f; text-align: center;">
#                             <strong>⚠️ SÉCURITÉ :</strong> Ce lien expirera dans <strong>15 MINUTES</strong><br>
#                             <small>Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.</small>
#                         </p>
#                     </div>
                    
#                     <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #eee;">
#                         <p style="font-size: 14px; color: #666; margin-bottom: 10px;">
#                             <strong>Lien alternatif :</strong> Si le bouton ne fonctionne pas, copiez-collez ce lien dans votre navigateur :
#                         </p>
#                         <div style="background: #f5f5f5; padding: 12px; border-radius: 6px; border: 1px solid #ddd;">
#                             <code style="word-break: break-all; font-size: 12px; color: #333;">
#                                 {reset_link}
#                             </code>
#                         </div>
#                     </div>
#                 </div>
                
#                 <div style="background: #2c3e50; color: white; padding: 20px; text-align: center;">
#                     <p style="margin: 0; font-size: 14px;">
#                         <strong>© 2025 Simplon.co - Plateforme interne</strong>
#                     </p>
#                     <p style="margin: 5px 0 0 0; font-size: 12px; opacity: 0.8;">
#                         Cet email a été envoyé automatiquement, merci de ne pas y répondre.
#                     </p>
#                 </div>
#             </div>
#             """
            
#             plain_message = f"""RÉINITIALISATION DE MOT DE PASSE - PLATEFORME SIMPLON

# Bonjour,

# Vous avez demandé à réinitialiser votre mot de passe pour la plateforme interne Simplon.

# INFORMATIONS :
# 📧 Email : {email}
# 👤 Nom d'utilisateur : {user.username}

# POUR RÉINITIALISER VOTRE MOT DE PASSE :
# Cliquez sur le lien suivant :
# {reset_link}

# ⚠️ SÉCURITÉ :
# Ce lien de réinitialisation expirera dans 15 MINUTES!
# Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.

# Cordialement,
# L'équipe Simplon

# ---
# © 2025 Simplon.co - Plateforme interne
# Cet email a été envoyé automatiquement.
# """
            
#             try:
#                 send_mail(
#                     subject=subject,
#                     message=plain_message,
#                     from_email=settings.DEFAULT_FROM_EMAIL,
#                     recipient_list=[email],
#                     html_message=html_message,
#                     fail_silently=False,
#                 )
                
#                 print(f"✅ EMAIL DE RÉINITIALISATION ENVOYÉ À: {email}")
#                 print("=" * 70)
                
#                 return Response({
#                     "message": "✅ Si votre email est enregistré, un lien de réinitialisation a été envoyé. Vérifiez votre boîte mail (valable 15 minutes).",
#                     "status": "success"
#                 }, status=status.HTTP_200_OK)
                
#             except Exception as e:
#                 print(f"❌ ERREUR ENVOI EMAIL: {str(e)}")
#                 traceback.print_exc()
#                 print("=" * 70)
#                 return Response({
#                     "message": "❌ Erreur d'envoi d'email. Veuillez réessayer.",
#                     "status": "error"
#                 }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
#         except User.DoesNotExist:
#             print("❌ EMAIL NON TROUVÉ DANS LA BASE")
#             print("=" * 70)
#             return Response({
#                 "message": "✅ Si votre email est enregistré, un lien de réinitialisation a été envoyé. Vérifiez votre boîte mail (valable 15 minutes).",
#                 "status": "success"
#             }, status=status.HTTP_200_OK)

# class ResetPasswordView(generics.GenericAPIView):
#     """Vue pour finaliser la réinitialisation du mot de passe"""
#     permission_classes = [permissions.AllowAny]
    
#     def post(self, request):
#         token = request.data.get('token')
#         email = request.data.get('email')
#         new_password = request.data.get('new_password')
        
#         print("=" * 70)
#         print("🔐 TENTATIVE RÉINITIALISATION MOT DE PASSE")
#         print("=" * 70)
#         print(f"📧 Email: {email}")
#         print(f"🎫 Token: {token}")
#         print(f"🕒 Heure actuelle: {timezone.now()}")
        
#         try:
#             user = User.objects.get(email=email)
            
#             print(f"✅ UTILISATEUR TROUVÉ: {user.username}")
            
#             # Chercher le token dans le matricule temporaire
#             try:
#                 matricule_autorise = MatriculeAutorise.objects.get(
#                     matricule=f"reset_{user.id}",
#                     est_actif=True
#                 )
                
#                 print(f"🔑 Token stocké: {matricule_autorise.activation_token}")
#                 print(f"⏰ Expiration stockée: {matricule_autorise.token_expiration}")
                
#                 # Vérifier si le token correspond et n'est pas expiré
#                 if (not matricule_autorise.activation_token or 
#                     matricule_autorise.activation_token != token or
#                     matricule_autorise.is_token_expired()):
                    
#                     print("❌ TOKEN INVALIDE OU EXPIRÉ")
#                     return Response({
#                         "message": "❌ Lien de réinitialisation invalide ou expiré. Veuillez demander un nouveau lien.",
#                         "status": "error",
#                         "expired": True
#                     }, status=status.HTTP_400_BAD_REQUEST)
                
#                 print("✅ TOKEN VALIDE ET NON EXPIRÉ")
                
#                 # Réinitialiser le mot de passe
#                 user.set_password(new_password)
#                 user.save()
                
#                 # Nettoyer le token après utilisation
#                 matricule_autorise.activation_token = None
#                 matricule_autorise.token_expiration = None
#                 matricule_autorise.save()
                
#                 print(f"✅ MOT DE PASSE RÉINITIALISÉ POUR: {user.username}")
#                 print("=" * 70)
                
#                 return Response({
#                     "message": "✅ Mot de passe réinitialisé avec succès ! Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.",
#                     "status": "success"
#                 }, status=status.HTTP_200_OK)
                
#             except MatriculeAutorise.DoesNotExist:
#                 print("❌ TOKEN DE RÉINITIALISATION NON TROUVÉ")
#                 return Response({
#                     "message": "❌ Lien de réinitialisation invalide. Veuillez demander un nouveau lien.",
#                     "status": "error"
#                 }, status=status.HTTP_400_BAD_REQUEST)
            
#         except User.DoesNotExist:
#             print("❌ UTILISATEUR NON TROUVÉ")
#             print("=" * 70)
#             return Response({
#                 "message": "❌ Erreur lors de la réinitialisation. Veuillez vérifier vos informations.",
#                 "status": "error"
#             }, status=status.HTTP_400_BAD_REQUEST)

# # ============================================
# # 7. VUE POUR LE FRONTEND REACT - AMÉLIORÉE
# # ============================================

# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def users_with_projects(request):
#     """Retourne tous les utilisateurs avec leurs projets et profils étendus"""
#     try:
#         print("=" * 70)
#         print("🔍 DÉBUT users_with_projects AMÉLIORÉ")
#         print("=" * 70)
        
#         # Récupérer tous les utilisateurs avec leurs projets
#         users = User.objects.all().prefetch_related('project_set', 'userprofile')
#         print(f"✅ {users.count()} utilisateur(s) trouvé(s)")
        
#         users_data = []
        
#         for user in users:
#             # Récupérer le profil étendu
#             try:
#                 profile = UserProfile.objects.get(user=user)
#                 profile_data = {
#                     'bio': profile.bio,
#                     'avatar_url': request.build_absolute_uri(profile.avatar.url) if profile.avatar else None,
#                     'location': profile.location,
#                     'company': profile.company,
#                     'position': profile.position,
#                     'phone': profile.phone,
#                     'updated_at': profile.updated_at
#                 }
#             except UserProfile.DoesNotExist:
#                 profile_data = None
            
#             # Récupérer les projets
#             projects = Project.objects.filter(author=user)
#             projects_data = []
            
#             for project in projects:
#                 projects_data.append({
#                     'id': project.id,
#                     'title': project.title or "Sans titre",
#                     'description': project.description or "",
#                     'technologies': project.technologies or "",
#                     'status': project.status or "draft",
#                     'created_at': project.created_at,
#                     'updated_at': project.updated_at,
#                     'image_url': request.build_absolute_uri(project.image.url) if project.image else None
#                 })
            
#             # Statistiques
#             projects_count = projects.count()
#             last_activity = max([
#                 user.last_login or user.date_joined,
#                 ProfileUpdateHistory.objects.filter(user=user).order_by('-updated_at').first().updated_at 
#                 if ProfileUpdateHistory.objects.filter(user=user).exists() else user.date_joined
#             ])
            
#             user_dict = {
#                 'id': user.id,
#                 'username': user.username,
#                 'email': user.email or "",
#                 'first_name': user.first_name or "",
#                 'last_name': user.last_name or "",
#                 'date_joined': user.date_joined,
#                 'last_login': user.last_login,
#                 'is_active': user.is_active,
#                 'profile': profile_data,
#                 'projects': {
#                     'count': projects_count,
#                     'items': projects_data
#                 },
#                 'stats': {
#                     'projects_count': projects_count,
#                     'notifications_count': Notification.objects.filter(user=user).count(),
#                     'profile_updates': ProfileUpdateHistory.objects.filter(user=user).count(),
#                     'last_activity': last_activity
#                 }
#             }
            
#             users_data.append(user_dict)
        
#         # Trier par nom d'utilisateur
#         users_data.sort(key=lambda x: x['username'])
        
#         print("=" * 70)
#         print(f"✅ PRÊT POUR LE FRONTEND: {len(users_data)} utilisateur(s)")
#         print("=" * 70)
        
#         return Response({
#             'status': 'success',
#             'count': len(users_data),
#             'users': users_data,
#             'generated_at': timezone.now(),
#             'requested_by': request.user.username
#         })
        
#     except Exception as e:
#         print("❌ ERREUR DANS users_with_projects:")
#         print(f"   {str(e)}")
#         traceback.print_exc()
#         print("=" * 70)
        
#         return Response({
#             'status': 'error',
#             'message': 'Erreur serveur lors de la récupération des données',
#             'error': str(e)
#         }, status=500)

# # ============================================
# # 8. VUE POUR L'ADMIN DASHBOARD
# # ============================================

# class AdminUserViewSet(viewsets.ModelViewSet):
#     """
#     ViewSet pour la gestion admin des utilisateurs
#     """
#     permission_classes = [permissions.IsAdminUser]
#     queryset = User.objects.all().order_by('-date_joined')
    
#     def get_serializer_class(self):
#         if self.action in ['create', 'update', 'partial_update']:
#             return UserCreateSerializer
#         return UserWithProfileSerializer
    
#     @action(detail=True, methods=['post'])
#     def activate(self, request, pk=None):
#         """Activer/désactiver un utilisateur"""
#         user = self.get_object()
#         user.is_active = not user.is_active
#         user.save()
        
#         # Notification
#         Notification.objects.create(
#             user=user,
#             message=f"Votre compte a été {'activé' if user.is_active else 'désactivé'} par un administrateur",
#             notification_type='system'
#         )
        
#         return Response({
#             'status': 'success',
#             'message': f'Utilisateur {"activé" if user.is_active else "désactivé"}',
#             'is_active': user.is_active
#         })
    
#     @action(detail=False, methods=['get'])
#     def stats(self, request):
#         """Statistiques admin"""
#         total_users = User.objects.count()
#         active_today = User.objects.filter(last_login__date=timezone.now().date()).count()
#         new_this_week = User.objects.filter(date_joined__gte=timezone.now()-timedelta(days=7)).count()
        
#         return Response({
#             'total_users': total_users,
#             'active_today': active_today,
#             'new_this_week': new_this_week,
#             'with_profile': UserProfile.objects.count(),
#             'generated_at': timezone.now()
#         })

# # ============================================
# # 9. ENDPOINTS UTILITAIRES
# # ============================================

# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def user_status(request):
#     """Vérifie le statut de l'utilisateur connecté"""
#     user = request.user
    
#     data = {
#         'is_authenticated': True,
#         'user': {
#             'id': user.id,
#             'username': user.username,
#             'email': user.email
#         },
#         'has_profile': UserProfile.objects.filter(user=user).exists(),
#         'timestamp': timezone.now()
#     }
    
#     return Response(data)

# @api_view(['GET'])
# @permission_classes([AllowAny])
# def health_check(request):
#     """Endpoint de vérification de santé de l'API"""
#     return Response({
#         'status': 'healthy',
#         'timestamp': timezone.now(),
#         'version': '2.0.0',
#         'features': [
#             'user_profile',
#             'project_management',
#             'notifications',
#             'history_tracking'
#         ]
#     })

# # AJOUTEZ CES VUES À LA FIN DE VOTRE views.py (avant les urls)

# # ============================================
# # 10. VUE SIMPLE POUR RÉCUPÉRER LES UTILISATEURS
# # ============================================

# from django.contrib.auth.models import User

# @api_view(['GET'])
# @permission_classes([AllowAny])  # <- Aucune permission requise
# def get_all_users_simple(request):
#     """
#     Endpoint simple pour récupérer tous les utilisateurs
#     Version publique - pas d'authentification requise
#     """
#     try:
#         users = User.objects.all().order_by('-date_joined')
        
#         print("=" * 70)
#         print("👥 ENDPOINT SIMPLE - Liste des utilisateurs")
#         print("=" * 70)
#         print(f"📊 Nombre d'utilisateurs dans la BD: {users.count()}")
        
#         users_data = []
#         for user in users:
#             users_data.append({
#                 'id': user.id,
#                 'username': user.username,
#                 'email': user.email,
#                 'first_name': user.first_name,
#                 'last_name': user.last_name,
#                 'is_active': user.is_active,
#                 'is_staff': user.is_staff,
#                 'is_superuser': user.is_superuser,
#                 'date_joined': user.date_joined,
#                 'last_login': user.last_login,
#                 'projects_count': user.project_set.count() if hasattr(user, 'project_set') else 0
#             })
        
#         print(f"✅ {len(users_data)} utilisateurs formatés")
#         print("=" * 70)
        
#         return Response({
#             'status': 'success',
#             'count': len(users_data),
#             'users': users_data,
#             'timestamp': timezone.now()
#         })
        
#     except Exception as e:
#         print(f"❌ Erreur dans get_all_users_simple: {str(e)}")
#         return Response({
#             'status': 'error',
#             'message': str(e)
#         }, status=500)

# @api_view(['GET'])
# @permission_classes([IsAdminUser])  # <- Pour admin seulement
# def get_all_users_admin(request):
#     """
#     Endpoint admin pour récupérer tous les utilisateurs avec détails
#     """
#     try:
#         users = User.objects.all().order_by('-date_joined')
        
#         print("=" * 70)
#         print("👑 ENDPOINT ADMIN - Liste complète des utilisateurs")
#         print("=" * 70)
#         print(f"📊 Nombre d'utilisateurs: {users.count()}")
#         print(f"👤 Admin demandeur: {request.user.username}")
        
#         users_data = []
#         for user in users:
#             # Récupérer le profil étendu
#             try:
#                 profile = UserProfile.objects.get(user=user)
#                 profile_data = {
#                     'avatar': request.build_absolute_uri(profile.avatar.url) if profile.avatar else None,
#                     'bio': profile.bio,
#                     'location': profile.location,
#                     'company': profile.company
#                 }
#             except UserProfile.DoesNotExist:
#                 profile_data = None
            
#             users_data.append({
#                 'id': user.id,
#                 'username': user.username,
#                 'email': user.email,
#                 'first_name': user.first_name,
#                 'last_name': user.last_name,
#                 'is_active': user.is_active,
#                 'is_staff': user.is_staff,
#                 'is_superuser': user.is_superuser,
#                 'date_joined': user.date_joined,
#                 'last_login': user.last_login,
#                 'profile': profile_data,
#                 'projects_count': user.project_set.count() if hasattr(user, 'project_set') else 0,
#                 'notifications_count': Notification.objects.filter(user=user).count(),
#                 'last_activity': ProfileUpdateHistory.objects.filter(user=user)
#                                                     .order_by('-updated_at')
#                                                     .first().updated_at 
#                                                     if ProfileUpdateHistory.objects.filter(user=user).exists() 
#                                                     else user.date_joined
#             })
        
#         print(f"✅ {len(users_data)} utilisateurs préparés pour admin")
#         print("=" * 70)
        
#         return Response({
#             'status': 'success',
#             'count': len(users_data),
#             'users': users_data,
#             'requested_by': request.user.username,
#             'timestamp': timezone.now()
#         })
        
#     except Exception as e:
#         print(f"❌ Erreur dans get_all_users_admin: {str(e)}")
#         return Response({
#             'status': 'error',
#             'message': str(e)
#         }, status=500)

# # ============================================
# # 11. STATISTIQUES PUBLIQUES
# # ============================================

# @api_view(['GET'])
# @permission_classes([AllowAny])
# def public_users_summary(request):
#     """
#     Récupère un résumé public des utilisateurs (sans détails sensibles)
#     """
#     total_users = User.objects.count()
#     active_users = User.objects.filter(is_active=True).count()
#     staff_users = User.objects.filter(is_staff=True).count()
#     super_users = User.objects.filter(is_superuser=True).count()
    
#     # Utilisateurs récemment actifs (dernières 24h)
#     recent_users = User.objects.filter(
#         last_login__gte=timezone.now() - timedelta(hours=24)
#     ).count()
    
#     return Response({
#         'total_users': total_users,
#         'active_users': active_users,
#         'staff_users': staff_users,
#         'super_users': super_users,
#         'recent_users': recent_users,
#         'with_profile': UserProfile.objects.count(),
#         'timestamp': timezone.now()
#     })

# # users/views.py - VERSION COMPLÈTE CORRIGÉE
# from rest_framework import generics, permissions, status, viewsets
# from rest_framework.response import Response
# from rest_framework.decorators import api_view, permission_classes, action
# from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
# from rest_framework.views import APIView
# from django.contrib.auth.models import User
# from django.utils import timezone
# from django.core.mail import send_mail
# from django.conf import settings
# from django.db.models import Count, Q
# from datetime import timedelta, datetime
# import secrets
# import traceback
# import logging
# import json


# # ============ MODÈLES & SÉRIALIZERS ============
# from .models import MatriculeAutorise, UserProfile, ProfileUpdateHistory, Notification
# from .serializers import (
#     UserSerializer,
#     UserProfileSerializer,
#     ExtendedProfileUpdateSerializer,
#     ProfileUpdateHistorySerializer,
#     NotificationSerializer,
#     UserWithProfileSerializer,
#     PasswordChangeSerializer,
#     AvatarUploadSerializer,
#     UserStatsSerializer,
#     UserCreateSerializer
# )
# from projects.models import Project

# logger = logging.getLogger(__name__)

# # ============================================
# # 1. VUE PRINCIPALE POUR LE PROFIL UTILISATEUR
# # ============================================

# class UserProfileView(generics.RetrieveUpdateAPIView):
#     """
#     Vue pour récupérer et mettre à jour le profil utilisateur de base
#     """
#     permission_classes = [permissions.IsAuthenticated]
#     serializer_class = UserSerializer
    
#     def get_object(self):
#         return self.request.user
    
#     def get(self, request, *args, **kwargs):
#         instance = self.get_object()
#         serializer = self.get_serializer(instance)
        
#         # Ajouter des informations supplémentaires
#         data = serializer.data
        
#         try:
#             user_profile = UserProfile.objects.get(user=instance)
#             data['has_extended_profile'] = True
#             data['avatar_url'] = request.build_absolute_uri(user_profile.avatar.url) if user_profile.avatar else None
#         except UserProfile.DoesNotExist:
#             data['has_extended_profile'] = False
        
#         # Statistiques
#         data['projects_count'] = Project.objects.filter(author=instance).count()
#         data['unread_notifications'] = Notification.objects.filter(user=instance, is_read=False).count()
        
#         print("📱 GET PROFIL UTILISATEUR - Utilisateur:", instance.username)
        
#         return Response(data)
    
#     def update(self, request, *args, **kwargs):
#         instance = self.get_object()
#         partial = kwargs.pop('partial', False)
        
#         # Sauvegarder les données avant modification
#         old_data = {
#             'email': instance.email,
#             'first_name': instance.first_name,
#             'last_name': instance.last_name,
#         }
        
#         serializer = self.get_serializer(instance, data=request.data, partial=partial)
#         serializer.is_valid(raise_exception=True)
        
#         # Appliquer les modifications
#         self.perform_update(serializer)
        
#         # Récupérer les données après modification
#         new_data = {
#             'email': instance.email,
#             'first_name': instance.first_name,
#             'last_name': instance.last_name,
#         }
        
#         # Identifier les changements
#         changes = {}
#         for key in old_data.keys():
#             old_value = old_data[key] or ""
#             new_value = new_data[key] or ""
#             if old_value != new_value:
#                 changes[key] = {
#                     'old': old_value,
#                     'new': new_value
#                 }
        
#         # Enregistrer l'historique si des changements
#         if changes:
#             ProfileUpdateHistory.objects.create(
#                 user=instance,
#                 changes=changes,
#                 ip_address=self.get_client_ip(request),
#                 user_agent=request.META.get('HTTP_USER_AGENT', '')
#             )
            
#             # Créer une notification
#             Notification.objects.create(
#                 user=instance,
#                 message=f"✅ Votre profil a été mis à jour ({len(changes)} modification(s))",
#                 notification_type='profile_update'
#             )
            
#             print(f"✅ {len(changes)} CHANGEMENT(S) ENREGISTRÉ(S) DANS LE PROFIL DE BASE")
        
#         return Response({
#             'status': 'success',
#             'message': 'Profil mis à jour avec succès' + (f' ({len(changes)} changement(s))' if changes else ''),
#             'data': serializer.data,
#             'changes': changes if changes else None
#         })
    
#     def patch(self, request, *args, **kwargs):
#         kwargs['partial'] = True
#         return self.update(request, *args, **kwargs)
    
#     def get_client_ip(self, request):
#         x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
#         return x_forwarded_for.split(',')[0] if x_forwarded_for else request.META.get('REMOTE_ADDR')

# # ============================================
# # 2. VUE POUR LE PROFIL ÉTENDU (NOUVELLE)
# # ============================================

# class UserExtendedProfileView(generics.RetrieveUpdateAPIView):
#     """
#     Vue pour gérer le profil étendu (Simplon, liens sociaux, bio, etc.)
#     """
#     permission_classes = [permissions.IsAuthenticated]
    
#     def get_serializer_class(self):
#         if self.request.method in ['PUT', 'PATCH']:
#             return ExtendedProfileUpdateSerializer
#         return UserProfileSerializer
    
#     def get_object(self):
#         # Récupérer ou créer le profil étendu
#         profile, created = UserProfile.objects.get_or_create(user=self.request.user)
#         return profile
    
#     def get(self, request, *args, **kwargs):
#         """Récupérer le profil étendu"""
#         instance = self.get_object()
#         serializer = UserProfileSerializer(instance, context={'request': request})
        
#         print("📋 GET PROFIL ÉTENDU - Utilisateur:", request.user.username)
        
#         return Response(serializer.data)
    
#     def update(self, request, *args, **kwargs):
#         """Mettre à jour le profil étendu"""
#         instance = self.get_object()
#         partial = kwargs.pop('partial', False)
        
#         # Sauvegarder les anciennes données
#         old_data = {
#             'bio': instance.bio,
#             'phone': instance.phone,
#             'location': instance.location,
#             'company': instance.company,
#             'position': instance.position,
#             'website': instance.website,
#             'github': instance.github,
#             'linkedin': instance.linkedin,
#             'twitter': instance.twitter,
#             'cohort': instance.cohort,
#             'specialite': instance.specialite,
#             'date_entree': instance.date_entree,
#             'date_sortie': instance.date_sortie,
#         }
        
#         serializer = ExtendedProfileUpdateSerializer(instance, data=request.data, partial=partial)
#         serializer.is_valid(raise_exception=True)
        
#         print("🔄 MISE À JOUR PROFIL ÉTENDU - Utilisateur:", request.user.username)
#         print(f"📋 Données reçues: {json.dumps(request.data, indent=2)}")
        
#         # Mettre à jour les champs
#         for field, value in serializer.validated_data.items():
#             setattr(instance, field, value)
        
#         instance.save()
        
#         # Identifier les changements
#         new_data = {field: getattr(instance, field) for field in old_data.keys()}
#         changes = {}
        
#         for key in old_data.keys():
#             old_value = old_data[key] or ""
#             new_value = new_data[key] or ""
#             if old_value != new_value:
#                 changes[key] = {
#                     'old': old_value,
#                     'new': new_value
#                 }
        
#         # Enregistrer dans l'historique si des changements
#         if changes:
#             ProfileUpdateHistory.objects.create(
#                 user=request.user,
#                 changes=changes,
#                 ip_address=self.get_client_ip(request),
#                 user_agent=request.META.get('HTTP_USER_AGENT', '')
#             )
            
#             # Créer une notification
#             Notification.objects.create(
#                 user=request.user,
#                 message=f"✅ Votre profil étendu a été mis à jour ({len(changes)} modification(s))",
#                 notification_type='profile_update'
#             )
            
#             print(f"✅ {len(changes)} CHANGEMENT(S) ENREGISTRÉ(S) DANS LE PROFIL ÉTENDU")
#             for field, change in changes.items():
#                 print(f"   📝 {field}: '{change['old']}' → '{change['new']}'")
        
#         # Retourner les données mises à jour
#         response_serializer = UserProfileSerializer(instance, context={'request': request})
        
#         return Response({
#             'status': 'success',
#             'message': 'Profil étendu mis à jour avec succès' + (f' ({len(changes)} changement(s))' if changes else ''),
#             'data': response_serializer.data,
#             'changes': changes if changes else None
#         })
    
#     def patch(self, request, *args, **kwargs):
#         kwargs['partial'] = True
#         return self.update(request, *args, **kwargs)
    
#     def get_client_ip(self, request):
#         x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
#         return x_forwarded_for.split(',')[0] if x_forwarded_for else request.META.get('REMOTE_ADDR')

# # ============================================
# # 3. VUE POUR LA PHOTO DE PROFIL
# # ============================================

# class UserProfileImageView(APIView):
#     """
#     Vue spécifique pour uploader/modifier la photo de profil
#     """
#     permission_classes = [permissions.IsAuthenticated]
    
#     def get(self, request):
#         """Récupérer l'URL de l'avatar"""
#         try:
#             profile = UserProfile.objects.get(user=request.user)
#             avatar_url = None
#             if profile.avatar:
#                 avatar_url = request.build_absolute_uri(profile.avatar.url)
            
#             return Response({
#                 'avatar_url': avatar_url,
#                 'has_avatar': profile.avatar is not None
#             })
#         except UserProfile.DoesNotExist:
#             return Response({
#                 'avatar_url': None,
#                 'has_avatar': False
#             })
    
#     def post(self, request):
#         """Uploader une nouvelle photo de profil"""
#         serializer = AvatarUploadSerializer(data=request.data)
#         if serializer.is_valid():
#             # Récupérer ou créer le profil
#             profile, created = UserProfile.objects.get_or_create(user=request.user)
            
#             # Supprimer l'ancienne image si elle existe
#             if profile.avatar:
#                 profile.avatar.delete(save=False)
            
#             # Sauvegarder la nouvelle image
#             profile.avatar = serializer.validated_data['avatar']
#             profile.save()
            
#             # Enregistrer dans l'historique
#             ProfileUpdateHistory.objects.create(
#                 user=request.user,
#                 changes={'avatar': 'updated'},
#                 ip_address=self.get_client_ip(request),
#                 user_agent=request.META.get('HTTP_USER_AGENT', '')
#             )
            
#             # Créer une notification
#             Notification.objects.create(
#                 user=request.user,
#                 message="🖼️ Votre photo de profil a été mise à jour",
#                 notification_type='profile_update'
#             )
            
#             avatar_url = request.build_absolute_uri(profile.avatar.url) if profile.avatar else None
            
#             return Response({
#                 'status': 'success',
#                 'message': 'Photo de profil mise à jour avec succès',
#                 'avatar_url': avatar_url
#             })
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
#     def delete(self, request):
#         """Supprimer la photo de profil"""
#         try:
#             profile = UserProfile.objects.get(user=request.user)
#             if profile.avatar:
#                 profile.avatar.delete(save=False)
#                 profile.avatar = None
#                 profile.save()
                
#                 ProfileUpdateHistory.objects.create(
#                     user=request.user,
#                     changes={'avatar': 'removed'},
#                     ip_address=self.get_client_ip(request),
#                     user_agent=request.META.get('HTTP_USER_AGENT', '')
#                 )
                
#                 return Response({
#                     'status': 'success',
#                     'message': 'Photo de profil supprimée avec succès'
#                 })
#             return Response({
#                 'status': 'info',
#                 'message': 'Aucune photo de profil à supprimer'
#             })
#         except UserProfile.DoesNotExist:
#             return Response({
#                 'status': 'error',
#                 'message': 'Profil non trouvé'
#             }, status=status.HTTP_404_NOT_FOUND)
    
#     def get_client_ip(self, request):
#         x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
#         return x_forwarded_for.split(',')[0] if x_forwarded_for else request.META.get('REMOTE_ADDR')

# # ============================================
# # 4. VUE POUR LE PROFIL COMPLET (BASIC + EXTENDED)
# # ============================================

# class UserProfileCompleteView(generics.RetrieveAPIView):
#     """
#     Vue pour récupérer toutes les informations du profil (basic + extended)
#     """
#     permission_classes = [permissions.IsAuthenticated]
#     serializer_class = UserWithProfileSerializer
    
#     def get_object(self):
#         return self.request.user

# # [LES AUTRES VUES EXISTENTES RESTENT LES MÊMES - UserProfileHistoryView, UserNotificationsView, etc.]

# # ============================================
# # 5. VUE POUR LES STATISTIQUES UTILISATEUR
# # ============================================

# class UserStatsView(APIView):
#     """
#     Vue pour les statistiques utilisateur
#     """
#     permission_classes = [permissions.IsAuthenticated]
    
#     def get(self, request):
#         user = request.user
        
#         # Statistiques de base
#         projects_count = Project.objects.filter(author=user).count()
#         unread_notifications = Notification.objects.filter(user=user, is_read=False).count()
#         profile_updates = ProfileUpdateHistory.objects.filter(user=user).count()
        
#         # Date de la dernière activité
#         last_activity = user.last_login or user.date_joined
#         if ProfileUpdateHistory.objects.filter(user=user).exists():
#             last_update = ProfileUpdateHistory.objects.filter(user=user).order_by('-updated_at').first().updated_at
#             if last_update > last_activity:
#                 last_activity = last_update
        
#         # Complétude du profil
#         profile_completeness = 50  # Base 50%
#         try:
#             profile = UserProfile.objects.get(user=user)
#             if profile.avatar:
#                 profile_completeness += 20
#             if profile.bio:
#                 profile_completeness += 10
#             if profile.phone or profile.location:
#                 profile_completeness += 10
#             if profile.company or profile.position:
#                 profile_completeness += 10
#         except UserProfile.DoesNotExist:
#             pass
        
#         data = {
#             'user': {
#                 'username': user.username,
#                 'email': user.email,
#                 'date_joined': user.date_joined,
#                 'last_login': user.last_login
#             },
#             'projects': {
#                 'total': projects_count,
#                 'active': Project.objects.filter(author=user, status='published').count(),
#                 'draft': Project.objects.filter(author=user, status='draft').count()
#             },
#             'notifications': {
#                 'total': Notification.objects.filter(user=user).count(),
#                 'unread': unread_notifications,
#                 'read': Notification.objects.filter(user=user, is_read=True).count()
#             },
#             'profile': {
#                 'updates_count': profile_updates,
#                 'completeness': min(profile_completeness, 100),
#                 'has_avatar': UserProfile.objects.filter(user=user, avatar__isnull=False).exists()
#             },
#             'activity': {
#                 'last_activity': last_activity,
#                 'days_since_joined': (timezone.now() - user.date_joined).days,
#                 'is_active_today': user.last_login.date() == timezone.now().date() if user.last_login else False
#             }
#         }
        
#         return Response(data)

# # [LES AUTRES VUES D'AUTHENTIFICATION RESTENT LES MÊMES - RequestLoginView, SetupPasswordView, etc.]

# # ============================================
# # 6. VUES EXISTANTES POUR LE FRONTEND
# # ============================================

# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def users_with_projects(request):
#     """Retourne tous les utilisateurs avec leurs projets et profils étendus"""
#     try:
#         users = User.objects.all().prefetch_related('project_set', 'userprofile')
        
#         users_data = []
#         for user in users:
#             try:
#                 profile = UserProfile.objects.get(user=user)
#                 profile_data = {
#                     'bio': profile.bio,
#                     'avatar_url': request.build_absolute_uri(profile.avatar.url) if profile.avatar else None,
#                     'location': profile.location,
#                     'company': profile.company,
#                     'position': profile.position,
#                     'phone': profile.phone,
#                     'updated_at': profile.updated_at
#                 }
#             except UserProfile.DoesNotExist:
#                 profile_data = None
            
#             projects = Project.objects.filter(author=user)
#             projects_data = []
#             for project in projects:
#                 projects_data.append({
#                     'id': project.id,
#                     'title': project.title or "Sans titre",
#                     'description': project.description or "",
#                     'technologies': project.technologies or "",
#                     'status': project.status or "draft",
#                     'created_at': project.created_at,
#                     'updated_at': project.updated_at,
#                     'image_url': request.build_absolute_uri(project.image.url) if project.image else None
#                 })
            
#             user_dict = {
#                 'id': user.id,
#                 'username': user.username,
#                 'email': user.email or "",
#                 'first_name': user.first_name or "",
#                 'last_name': user.last_name or "",
#                 'date_joined': user.date_joined,
#                 'last_login': user.last_login,
#                 'is_active': user.is_active,
#                 'profile': profile_data,
#                 'projects': {
#                     'count': projects.count(),
#                     'items': projects_data
#                 }
#             }
#             users_data.append(user_dict)
        
#         users_data.sort(key=lambda x: x['username'])
        
#         return Response({
#             'status': 'success',
#             'count': len(users_data),
#             'users': users_data,
#             'generated_at': timezone.now(),
#             'requested_by': request.user.username
#         })
        
#     except Exception as e:
#         print(f"❌ ERREUR DANS users_with_projects: {str(e)}")
#         traceback.print_exc()
        
#         return Response({
#             'status': 'error',
#             'message': 'Erreur serveur lors de la récupération des données',
#             'error': str(e)
#         }, status=500)

# # [LES AUTRES VUES ADMIN ET UTILITAIRES RESTENT LES MÊMES]

# # AJOUTEZ À LA FIN DE VOTRE views.py
# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def get_complete_profile(request):
#     """
#     Récupère toutes les informations du profil en un seul endpoint
#     """
#     user = request.user
    
#     # Récupérer le profil de base
#     base_serializer = UserSerializer(user)
#     base_data = base_serializer.data
    
#     # Récupérer le profil étendu
#     try:
#         profile = UserProfile.objects.get(user=user)
#         extended_serializer = UserProfileSerializer(profile, context={'request': request})
#         extended_data = extended_serializer.data
#     except UserProfile.DoesNotExist:
#         extended_data = None
    
#     # Statistiques
#     projects_count = Project.objects.filter(author=user).count()
#     unread_notifications = Notification.objects.filter(user=user, is_read=False).count()
    
#     return Response({
#         'base_profile': base_data,
#         'extended_profile': extended_data,
#         'stats': {
#             'projects_count': projects_count,
#             'unread_notifications': unread_notifications,
#             'profile_completeness': calculate_profile_completeness(user)
#         },
#         'timestamp': timezone.now()
#     })

# def calculate_profile_completeness(user):
#     """Calcule le pourcentage de complétude du profil"""
#     completeness = 50  # Base 50% pour compte créé
    
#     try:
#         profile = UserProfile.objects.get(user=user)
#         if user.email:
#             completeness += 10
#         if user.first_name or user.last_name:
#             completeness += 10
#         if profile.bio:
#             completeness += 10
#         if profile.avatar:
#             completeness += 10
#         if profile.phone or profile.location:
#             completeness += 5
#         if profile.company or profile.position:
#             completeness += 5
#     except UserProfile.DoesNotExist:
#         pass
    
#     return min(completeness, 100)


# # users/views.py - VERSION COMPLÈTE ET SIMPLIFIÉE
# from rest_framework import generics, permissions, status, viewsets
# from rest_framework.response import Response
# from rest_framework.decorators import api_view, permission_classes, action
# from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
# from rest_framework.views import APIView
# from django.contrib.auth.models import User
# from django.utils import timezone
# from django.core.mail import send_mail
# from django.conf import settings
# from datetime import timedelta
# import secrets
# import traceback
# import logging
# import json

# # ============ MODÈLES & SÉRIALIZERS ============
# from .models import MatriculeAutorise, UserProfile, ProfileUpdateHistory, Notification
# from .serializers import (
#     UserSerializer,
#     UserProfileSerializer,
#     ExtendedProfileUpdateSerializer,
#     ProfileUpdateHistorySerializer,
#     NotificationSerializer,
#     UserWithProfileSerializer,
#     PasswordChangeSerializer,
#     AvatarUploadSerializer,
#     UserCreateSerializer
# )
# from projects.models import Project

# logger = logging.getLogger(__name__)

# # ============================================
# # 1. VUE PRINCIPALE POUR LE PROFIL UTILISATEUR
# # ============================================

# class UserProfileView(generics.RetrieveUpdateAPIView):
#     permission_classes = [permissions.IsAuthenticated]
#     serializer_class = UserSerializer
    
#     def get_object(self):
#         return self.request.user
    
#     def get(self, request, *args, **kwargs):
#         instance = self.get_object()
#         serializer = self.get_serializer(instance)
#         return Response(serializer.data)
    
#     def update(self, request, *args, **kwargs):
#         instance = self.get_object()
#         partial = kwargs.pop('partial', False)
        
#         serializer = self.get_serializer(instance, data=request.data, partial=partial)
#         serializer.is_valid(raise_exception=True)
#         self.perform_update(serializer)
        
#         return Response({
#             'status': 'success',
#             'message': 'Profil mis à jour avec succès',
#             'data': serializer.data
#         })

# # ============================================
# # 2. VUE POUR LE PROFIL ÉTENDU
# # ============================================

# class UserExtendedProfileView(generics.RetrieveUpdateAPIView):
#     permission_classes = [permissions.IsAuthenticated]
    
#     def get_serializer_class(self):
#         if self.request.method in ['PUT', 'PATCH']:
#             return ExtendedProfileUpdateSerializer
#         return UserProfileSerializer
    
#     def get_object(self):
#         profile, created = UserProfile.objects.get_or_create(user=self.request.user)
#         return profile
    
#     def get(self, request, *args, **kwargs):
#         instance = self.get_object()
#         serializer = UserProfileSerializer(instance, context={'request': request})
#         return Response(serializer.data)
    
#     def update(self, request, *args, **kwargs):
#         instance = self.get_object()
#         partial = kwargs.pop('partial', False)
        
#         serializer = ExtendedProfileUpdateSerializer(instance, data=request.data, partial=partial)
#         serializer.is_valid(raise_exception=True)
        
#         for field, value in serializer.validated_data.items():
#             setattr(instance, field, value)
        
#         instance.save()
        
#         response_serializer = UserProfileSerializer(instance, context={'request': request})
        
#         return Response({
#             'status': 'success',
#             'message': 'Profil étendu mis à jour avec succès',
#             'data': response_serializer.data
#         })

# # ============================================
# # 3. VUE POUR LA PHOTO DE PROFIL
# # ============================================

# class UserProfileImageView(APIView):
#     permission_classes = [permissions.IsAuthenticated]
    
#     def get(self, request):
#         try:
#             profile = UserProfile.objects.get(user=request.user)
#             avatar_url = None
#             if profile.avatar:
#                 avatar_url = request.build_absolute_uri(profile.avatar.url)
            
#             return Response({
#                 'avatar_url': avatar_url,
#                 'has_avatar': profile.avatar is not None
#             })
#         except UserProfile.DoesNotExist:
#             return Response({
#                 'avatar_url': None,
#                 'has_avatar': False
#             })
    
#     def post(self, request):
#         serializer = AvatarUploadSerializer(data=request.data)
#         if serializer.is_valid():
#             profile, created = UserProfile.objects.get_or_create(user=request.user)
            
#             if profile.avatar:
#                 profile.avatar.delete(save=False)
            
#             profile.avatar = serializer.validated_data['avatar']
#             profile.save()
            
#             avatar_url = request.build_absolute_uri(profile.avatar.url) if profile.avatar else None
            
#             return Response({
#                 'status': 'success',
#                 'message': 'Photo de profil mise à jour avec succès',
#                 'avatar_url': avatar_url
#             })
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# # ============================================
# # 4. VIEWSET POUR ADMIN
# # ============================================

# class AdminUserViewSet(viewsets.ModelViewSet):
#     """
#     ViewSet pour la gestion admin des utilisateurs
#     """
#     permission_classes = [permissions.IsAdminUser]
#     queryset = User.objects.all().order_by('-date_joined')
    
#     def get_serializer_class(self):
#         if self.action in ['create', 'update', 'partial_update']:
#             return UserCreateSerializer
#         return UserWithProfileSerializer
    
#     @action(detail=False, methods=['get'])
#     def stats(self, request):
#         """Statistiques admin"""
#         total_users = User.objects.count()
#         active_today = User.objects.filter(last_login__date=timezone.now().date()).count()
#         new_this_week = User.objects.filter(date_joined__gte=timezone.now()-timedelta(days=7)).count()
        
#         return Response({
#             'total_users': total_users,
#             'active_today': active_today,
#             'new_this_week': new_this_week,
#             'with_profile': UserProfile.objects.count(),
#             'generated_at': timezone.now()
#         })

# # ============================================
# # 5. AUTRES VUES ESSENTIELLES
# # ============================================

# class UserProfileCompleteView(generics.RetrieveAPIView):
#     permission_classes = [permissions.IsAuthenticated]
#     serializer_class = UserWithProfileSerializer
    
#     def get_object(self):
#         return self.request.user

# class UserProfileHistoryView(generics.ListAPIView):
#     permission_classes = [permissions.IsAuthenticated]
#     serializer_class = ProfileUpdateHistorySerializer
    
#     def get_queryset(self):
#         return ProfileUpdateHistory.objects.filter(
#             user=self.request.user
#         ).order_by('-updated_at')

# class UserNotificationsView(generics.ListAPIView):
#     permission_classes = [permissions.IsAuthenticated]
#     serializer_class = NotificationSerializer
    
#     def get_queryset(self):
#         return Notification.objects.filter(
#             user=self.request.user
#         ).order_by('-created_at')

# class ChangePasswordView(generics.UpdateAPIView):
#     permission_classes = [permissions.IsAuthenticated]
#     serializer_class = PasswordChangeSerializer

# # ============================================
# # 6. VUES D'AUTHENTIFICATION
# # ============================================

# class RequestLoginView(generics.GenericAPIView):
#     permission_classes = [permissions.AllowAny]
    
#     def post(self, request):
#         matricule = request.data.get('matricule')
#         email = request.data.get('email')
        
#         try:
#             matricule_autorise = MatriculeAutorise.objects.get(
#                 matricule=matricule,
#                 est_actif=True
#             )
            
#             token = secrets.token_urlsafe(32)
#             expiration_time = timezone.now() + timedelta(minutes=5)
            
#             matricule_autorise.activation_token = token
#             matricule_autorise.token_expiration = expiration_time
#             matricule_autorise.save()
            
#             return Response({
#                 "message": "✅ Lien d'activation envoyé !",
#                 "status": "success",
#                 "expires_in": "5 minutes"
#             }, status=status.HTTP_200_OK)
            
#         except MatriculeAutorise.DoesNotExist:
#             return Response({
#                 "message": "❌ Matricule non autorisé ou introuvable.",
#                 "status": "error"
#             }, status=status.HTTP_400_BAD_REQUEST)

# class SetupPasswordView(generics.GenericAPIView):
#     permission_classes = [permissions.AllowAny]
    
#     def post(self, request):
#         token = request.data.get('token')
#         matricule = request.data.get('matricule')
#         email = request.data.get('email')
#         username = request.data.get('username')
#         password = request.data.get('password')
        
#         try:
#             matricule_autorise = MatriculeAutorise.objects.get(
#                 matricule=matricule,
#                 est_actif=True
#             )
            
#             if not matricule_autorise.activation_token or matricule_autorise.activation_token != token:
#                 return Response({
#                     "message": "❌ Lien d'activation invalide ou déjà utilisé.",
#                     "status": "error"
#                 }, status=status.HTTP_400_BAD_REQUEST)
            
#             if User.objects.filter(username=username).exists():
#                 return Response({
#                     "message": "❌ Ce nom d'utilisateur est déjà pris.",
#                     "status": "error"
#                 }, status=status.HTTP_400_BAD_REQUEST)
            
#             user, created = User.objects.get_or_create(
#                 username=matricule,
#                 defaults={
#                     'email': email,
#                     'password': password,
#                     'first_name': '',
#                     'last_name': ''
#                 }
#             )
            
#             if not created:
#                 user.email = email
#                 user.set_password(password)
#                 user.save()
            
#             matricule_autorise.date_activation = timezone.now()
#             matricule_autorise.activation_token = None
#             matricule_autorise.token_expiration = None
#             matricule_autorise.save()
            
#             return Response({
#                 "message": "✅ Compte créé avec succès ! Vous pouvez maintenant vous connecter.",
#                 "status": "success",
#                 "username": username
#             }, status=status.HTTP_200_OK)
            
#         except MatriculeAutorise.DoesNotExist:
#             return Response({
#                 "message": "❌ Matricule non autorisé ou introuvable.",
#                 "status": "error"
#             }, status=status.HTTP_400_BAD_REQUEST)

# class QuickLoginView(generics.GenericAPIView):
#     permission_classes = [permissions.AllowAny]
    
#     def post(self, request):
#         matricule = request.data.get('matricule')
#         username = request.data.get('username')
#         password = request.data.get('password')
        
#         login_identifier = username or matricule
        
#         if not login_identifier or not password:
#             return Response({
#                 "error": "Identifiant ou mot de passe manquant."
#             }, status=status.HTTP_400_BAD_REQUEST)

#         try:
#             matricule_autorise = MatriculeAutorise.objects.get(
#                 matricule=login_identifier,
#                 est_actif=True,
#                 date_activation__isnull=False
#             )
#         except MatriculeAutorise.DoesNotExist:
#             return Response({
#                 "error": "❌ Compte non activé."
#             }, status=status.HTTP_400_BAD_REQUEST)
        
#         from django.contrib.auth import authenticate
#         user = authenticate(username=login_identifier, password=password)
        
#         if user is not None:
#             from rest_framework_simplejwt.tokens import RefreshToken
#             refresh = RefreshToken.for_user(user)
            
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
#             return Response({
#                 "error": "❌ Identifiant ou mot de passe incorrect"
#             }, status=status.HTTP_401_UNAUTHORIZED)

# # ============================================
# # 7. ENDPOINTS UTILITAIRES
# # ============================================

# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def get_complete_profile(request):
#     """Récupère toutes les informations du profil"""
#     user = request.user
    
#     base_serializer = UserSerializer(user)
#     base_data = base_serializer.data
    
#     try:
#         profile = UserProfile.objects.get(user=user)
#         extended_serializer = UserProfileSerializer(profile, context={'request': request})
#         extended_data = extended_serializer.data
#     except UserProfile.DoesNotExist:
#         extended_data = None
    
#     projects_count = Project.objects.filter(author=user).count()
#     unread_notifications = Notification.objects.filter(user=user, is_read=False).count()
    
#     return Response({
#         'base_profile': base_data,
#         'extended_profile': extended_data,
#         'stats': {
#             'projects_count': projects_count,
#             'unread_notifications': unread_notifications
#         },
#         'timestamp': timezone.now()
#     })

# @api_view(['GET'])
# @permission_classes([AllowAny])
# def get_all_users_simple(request):
#     """Endpoint simple pour récupérer tous les utilisateurs"""
#     try:
#         users = User.objects.all().order_by('-date_joined')
        
#         users_data = []
#         for user in users:
#             users_data.append({
#                 'id': user.id,
#                 'username': user.username,
#                 'email': user.email,
#                 'first_name': user.first_name,
#                 'last_name': user.last_name,
#                 'is_active': user.is_active,
#                 'date_joined': user.date_joined,
#                 'last_login': user.last_login,
#             })
        
#         return Response({
#             'status': 'success',
#             'count': len(users_data),
#             'users': users_data,
#             'timestamp': timezone.now()
#         })
        
#     except Exception as e:
#         return Response({
#             'status': 'error',
#             'message': str(e)
#         }, status=500)

# @api_view(['GET'])
# @permission_classes([IsAdminUser])
# def get_all_users_admin(request):
#     """Endpoint admin pour récupérer tous les utilisateurs"""
#     try:
#         users = User.objects.all().order_by('-date_joined')
        
#         users_data = []
#         for user in users:
#             try:
#                 profile = UserProfile.objects.get(user=user)
#                 profile_data = {
#                     'avatar': request.build_absolute_uri(profile.avatar.url) if profile.avatar else None,
#                     'bio': profile.bio,
#                 }
#             except UserProfile.DoesNotExist:
#                 profile_data = None
            
#             users_data.append({
#                 'id': user.id,
#                 'username': user.username,
#                 'email': user.email,
#                 'first_name': user.first_name,
#                 'last_name': user.last_name,
#                 'is_active': user.is_active,
#                 'profile': profile_data,
#                 'projects_count': user.project_set.count() if hasattr(user, 'project_set') else 0,
#             })
        
#         return Response({
#             'status': 'success',
#             'count': len(users_data),
#             'users': users_data,
#             'requested_by': request.user.username,
#             'timestamp': timezone.now()
#         })
        
#     except Exception as e:
#         return Response({
#             'status': 'error',
#             'message': str(e)
#         }, status=500)

# @api_view(['GET'])
# @permission_classes([AllowAny])
# def health_check(request):
#     """Endpoint de vérification de santé de l'API"""
#     return Response({
#         'status': 'healthy',
#         'timestamp': timezone.now(),
#         'version': '1.0.0'
#     })

# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def user_status(request):
#     """Vérifie le statut de l'utilisateur connecté"""
#     user = request.user
#     return Response({
#         'is_authenticated': True,
#         'user': {
#             'id': user.id,
#             'username': user.username,
#             'email': user.email
#         },
#         'timestamp': timezone.now()
#     })

# # users/views.py - VERSION COMPLÈTE ET SIMPLIFIÉE
# from rest_framework import generics, permissions, status, viewsets
# from rest_framework.response import Response
# from rest_framework.decorators import api_view, permission_classes, action
# from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
# from rest_framework.views import APIView
# from django.contrib.auth.models import User
# from django.utils import timezone
# from django.core.mail import send_mail
# from django.conf import settings
# from datetime import timedelta
# import secrets
# import traceback
# import logging
# import json
# from projects.models import Project
# from projects.serializers import ProjectSerializer
# from rest_framework import generics, permissions, status
# from rest_framework.response import Response

# # ============ MODÈLES & SÉRIALIZERS ============
# from .models import MatriculeAutorise, UserProfile, ProfileUpdateHistory, Notification
# from .serializers import (
#     UserSerializer,
#     UserProfileSerializer,
#     ExtendedProfileUpdateSerializer,
#     ProfileUpdateHistorySerializer,
#     NotificationSerializer,
#     UserWithProfileSerializer,
#     PasswordChangeSerializer,
#     AvatarUploadSerializer,
#     UserCreateSerializer,
#     QuickLoginSerializer  # <-- AJOUTÉ
# )
# from projects.models import Project

# logger = logging.getLogger(__name__)

# # ============================================
# # 1. VUE PRINCIPALE POUR LE PROFIL UTILISATEUR
# # ============================================

# class UserProfileView(generics.RetrieveUpdateAPIView):
#     permission_classes = [permissions.IsAuthenticated]
#     serializer_class = UserSerializer
    
#     def get_object(self):
#         return self.request.user
    
#     def get(self, request, *args, **kwargs):
#         instance = self.get_object()
#         serializer = self.get_serializer(instance)
#         return Response(serializer.data)
    
#     def update(self, request, *args, **kwargs):
#         instance = self.get_object()
#         partial = kwargs.pop('partial', False)
        
#         serializer = self.get_serializer(instance, data=request.data, partial=partial)
#         serializer.is_valid(raise_exception=True)
#         self.perform_update(serializer)
        
#         return Response({
#             'status': 'success',
#             'message': 'Profil mis à jour avec succès',
#             'data': serializer.data
#         })

# # ============================================
# # 2. VUE POUR LE PROFIL ÉTENDU
# # ============================================

# class UserExtendedProfileView(generics.RetrieveUpdateAPIView):
#     permission_classes = [permissions.IsAuthenticated]
    
#     def get_serializer_class(self):
#         if self.request.method in ['PUT', 'PATCH']:
#             return ExtendedProfileUpdateSerializer
#         return UserProfileSerializer
    
#     def get_object(self):
#         profile, created = UserProfile.objects.get_or_create(user=self.request.user)
#         return profile
    
#     def get(self, request, *args, **kwargs):
#         instance = self.get_object()
#         serializer = UserProfileSerializer(instance, context={'request': request})
#         return Response(serializer.data)
    
#     def update(self, request, *args, **kwargs):
#         instance = self.get_object()
#         partial = kwargs.pop('partial', False)
        
#         serializer = ExtendedProfileUpdateSerializer(instance, data=request.data, partial=partial)
#         serializer.is_valid(raise_exception=True)
        
#         for field, value in serializer.validated_data.items():
#             setattr(instance, field, value)
        
#         instance.save()
        
#         response_serializer = UserProfileSerializer(instance, context={'request': request})
        
#         return Response({
#             'status': 'success',
#             'message': 'Profil étendu mis à jour avec succès',
#             'data': response_serializer.data
#         })

# # ============================================
# # 3. VUE POUR LA PHOTO DE PROFIL
# # ============================================

# class UserProfileImageView(APIView):
#     permission_classes = [permissions.IsAuthenticated]
    
#     def get(self, request):
#         try:
#             profile = UserProfile.objects.get(user=request.user)
#             avatar_url = None
#             if profile.avatar:
#                 avatar_url = request.build_absolute_uri(profile.avatar.url)
            
#             return Response({
#                 'avatar_url': avatar_url,
#                 'has_avatar': profile.avatar is not None
#             })
#         except UserProfile.DoesNotExist:
#             return Response({
#                 'avatar_url': None,
#                 'has_avatar': False
#             })
    
#     def post(self, request):
#         serializer = AvatarUploadSerializer(data=request.data)
#         if serializer.is_valid():
#             profile, created = UserProfile.objects.get_or_create(user=request.user)
            
#             if profile.avatar:
#                 profile.avatar.delete(save=False)
            
#             profile.avatar = serializer.validated_data['avatar']
#             profile.save()
            
#             avatar_url = request.build_absolute_uri(profile.avatar.url) if profile.avatar else None
            
#             return Response({
#                 'status': 'success',
#                 'message': 'Photo de profil mise à jour avec succès',
#                 'avatar_url': avatar_url
#             })
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# # ============================================
# # 4. VIEWSET POUR ADMIN
# # ============================================

# class AdminUserViewSet(viewsets.ModelViewSet):
#     """
#     ViewSet pour la gestion admin des utilisateurs
#     """
#     permission_classes = [permissions.IsAdminUser]
#     queryset = User.objects.all().order_by('-date_joined')
    
#     def get_serializer_class(self):
#         if self.action in ['create', 'update', 'partial_update']:
#             return UserCreateSerializer
#         return UserWithProfileSerializer
    
#     @action(detail=False, methods=['get'])
#     def stats(self, request):
#         """Statistiques admin"""
#         total_users = User.objects.count()
#         active_today = User.objects.filter(last_login__date=timezone.now().date()).count()
#         new_this_week = User.objects.filter(date_joined__gte=timezone.now()-timedelta(days=7)).count()
        
#         return Response({
#             'total_users': total_users,
#             'active_today': active_today,
#             'new_this_week': new_this_week,
#             'with_profile': UserProfile.objects.count(),
#             'generated_at': timezone.now()
#         })

# # ============================================
# # 5. AUTRES VUES ESSENTIELLES
# # ============================================

# class UserProfileCompleteView(generics.RetrieveAPIView):
#     permission_classes = [permissions.IsAuthenticated]
#     serializer_class = UserWithProfileSerializer
    
#     def get_object(self):
#         return self.request.user

# class UserProfileHistoryView(generics.ListAPIView):
#     permission_classes = [permissions.IsAuthenticated]
#     serializer_class = ProfileUpdateHistorySerializer
    
#     def get_queryset(self):
#         return ProfileUpdateHistory.objects.filter(
#             user=self.request.user
#         ).order_by('-updated_at')

# class UserNotificationsView(generics.ListAPIView):
#     permission_classes = [permissions.IsAuthenticated]
#     serializer_class = NotificationSerializer
    
#     def get_queryset(self):
#         return Notification.objects.filter(
#             user=self.request.user
#         ).order_by('-created_at')

# class ChangePasswordView(generics.UpdateAPIView):
#     permission_classes = [permissions.IsAuthenticated]
#     serializer_class = PasswordChangeSerializer

# # ============================================
# # 6. VUES D'AUTHENTIFICATION
# # ============================================

# class RequestLoginView(generics.GenericAPIView):
#     permission_classes = [permissions.AllowAny]
    
#     def post(self, request):
#         matricule = request.data.get('matricule')
#         email = request.data.get('email')
        
#         try:
#             matricule_autorise = MatriculeAutorise.objects.get(
#                 matricule=matricule,
#                 est_actif=True
#             )
            
#             token = secrets.token_urlsafe(32)
#             expiration_time = timezone.now() + timedelta(minutes=5)
            
#             matricule_autorise.activation_token = token
#             matricule_autorise.token_expiration = expiration_time
#             matricule_autorise.save()
            
#             return Response({
#                 "message": "✅ Lien d'activation envoyé !",
#                 "status": "success",
#                 "expires_in": "5 minutes"
#             }, status=status.HTTP_200_OK)
            
#         except MatriculeAutorise.DoesNotExist:
#             return Response({
#                 "message": "❌ Matricule non autorisé ou introuvable.",
#                 "status": "error"
#             }, status=status.HTTP_400_BAD_REQUEST)

# class SetupPasswordView(generics.GenericAPIView):
#     permission_classes = [permissions.AllowAny]
    
#     def post(self, request):
#         token = request.data.get('token')
#         matricule = request.data.get('matricule')
#         email = request.data.get('email')
#         username = request.data.get('username')
#         password = request.data.get('password')
        
#         try:
#             matricule_autorise = MatriculeAutorise.objects.get(
#                 matricule=matricule,
#                 est_actif=True
#             )
            
#             if not matricule_autorise.activation_token or matricule_autorise.activation_token != token:
#                 return Response({
#                     "message": "❌ Lien d'activation invalide ou déjà utilisé.",
#                     "status": "error"
#                 }, status=status.HTTP_400_BAD_REQUEST)
            
#             if User.objects.filter(username=username).exists():
#                 return Response({
#                     "message": "❌ Ce nom d'utilisateur est déjà pris.",
#                     "status": "error"
#                 }, status=status.HTTP_400_BAD_REQUEST)
            
#             user, created = User.objects.get_or_create(
#                 username=matricule,
#                 defaults={
#                     'email': email,
#                     'password': password,
#                     'first_name': '',
#                     'last_name': ''
#                 }
#             )
            
#             if not created:
#                 user.email = email
#                 user.set_password(password)
#                 user.save()
            
#             matricule_autorise.date_activation = timezone.now()
#             matricule_autorise.activation_token = None
#             matricule_autorise.token_expiration = None
#             matricule_autorise.save()
            
#             return Response({
#                 "message": "✅ Compte créé avec succès ! Vous pouvez maintenant vous connecter.",
#                 "status": "success",
#                 "username": username
#             }, status=status.HTTP_200_OK)
            
#         except MatriculeAutorise.DoesNotExist:
#             return Response({
#                 "message": "❌ Matricule non autorisé ou introuvable.",
#                 "status": "error"
#             }, status=status.HTTP_400_BAD_REQUEST)

# class QuickLoginView(generics.GenericAPIView):
#     permission_classes = [permissions.AllowAny]
#     serializer_class = QuickLoginSerializer  # <-- AJOUTEZ CETTE LIGNE
    
#     def post(self, request):
#         # Valider les données avec le serializer
#         serializer = self.get_serializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
        
#         matricule = serializer.validated_data.get('matricule')
#         username = serializer.validated_data.get('username')
#         password = serializer.validated_data.get('password')
        
#         login_identifier = username or matricule
        
#         try:
#             matricule_autorise = MatriculeAutorise.objects.get(
#                 matricule=login_identifier,
#                 est_actif=True,
#                 date_activation__isnull=False
#             )
#         except MatriculeAutorise.DoesNotExist:
#             return Response({
#                 "error": "❌ Compte non activé."
#             }, status=status.HTTP_400_BAD_REQUEST)
        
#         from django.contrib.auth import authenticate
#         user = authenticate(username=login_identifier, password=password)
        
#         if user is not None:
#             from rest_framework_simplejwt.tokens import RefreshToken
#             refresh = RefreshToken.for_user(user)
            
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
#             return Response({
#                 "error": "❌ Identifiant ou mot de passe incorrect"
#             }, status=status.HTTP_401_UNAUTHORIZED)

# # ============================================
# # 7. ENDPOINTS UTILITAIRES
# # ============================================

# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def get_complete_profile(request):
#     """Récupère toutes les informations du profil"""
#     user = request.user
    
#     base_serializer = UserSerializer(user)
#     base_data = base_serializer.data
    
#     try:
#         profile = UserProfile.objects.get(user=user)
#         extended_serializer = UserProfileSerializer(profile, context={'request': request})
#         extended_data = extended_serializer.data
#     except UserProfile.DoesNotExist:
#         extended_data = None
    
#     projects_count = Project.objects.filter(author=user).count()
#     unread_notifications = Notification.objects.filter(user=user, is_read=False).count()
    
#     return Response({
#         'base_profile': base_data,
#         'extended_profile': extended_data,
#         'stats': {
#             'projects_count': projects_count,
#             'unread_notifications': unread_notifications
#         },
#         'timestamp': timezone.now()
#     })

# @api_view(['GET'])
# @permission_classes([AllowAny])
# def get_all_users_simple(request):
#     """Endpoint simple pour récupérer tous les utilisateurs"""
#     try:
#         users = User.objects.all().order_by('-date_joined')
        
#         users_data = []
#         for user in users:
#             users_data.append({
#                 'id': user.id,
#                 'username': user.username,
#                 'email': user.email,
#                 'first_name': user.first_name,
#                 'last_name': user.last_name,
#                 'is_active': user.is_active,
#                 'date_joined': user.date_joined,
#                 'last_login': user.last_login,
#             })
        
#         return Response({
#             'status': 'success',
#             'count': len(users_data),
#             'users': users_data,
#             'timestamp': timezone.now()
#         })
        
#     except Exception as e:
#         return Response({
#             'status': 'error',
#             'message': str(e)
#         }, status=500)

# @api_view(['GET'])
# @permission_classes([IsAdminUser])
# def get_all_users_admin(request):
#     """Endpoint admin pour récupérer tous les utilisateurs"""
#     try:
#         users = User.objects.all().order_by('-date_joined')
        
#         users_data = []
#         for user in users:
#             try:
#                 profile = UserProfile.objects.get(user=user)
#                 profile_data = {
#                     'avatar': request.build_absolute_uri(profile.avatar.url) if profile.avatar else None,
#                     'bio': profile.bio,
#                 }
#             except UserProfile.DoesNotExist:
#                 profile_data = None
            
#             users_data.append({
#                 'id': user.id,
#                 'username': user.username,
#                 'email': user.email,
#                 'first_name': user.first_name,
#                 'last_name': user.last_name,
#                 'is_active': user.is_active,
#                 'profile': profile_data,
#                 'projects_count': user.project_set.count() if hasattr(user, 'project_set') else 0,
#             })
        
#         return Response({
#             'status': 'success',
#             'count': len(users_data),
#             'users': users_data,
#             'requested_by': request.user.username,
#             'timestamp': timezone.now()
#         })
        
#     except Exception as e:
#         return Response({
#             'status': 'error',
#             'message': str(e)
#         }, status=500)

# @api_view(['GET'])
# @permission_classes([AllowAny])
# def health_check(request):
#     """Endpoint de vérification de santé de l'API"""
#     return Response({
#         'status': 'healthy',
#         'timestamp': timezone.now(),
#         'version': '1.0.0'
#     })

# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def user_status(request):
#     """Vérifie le statut de l'utilisateur connecté"""
#     user = request.user
#     return Response({
#         'is_authenticated': True,
#         'user': {
#             'id': user.id,
#             'username': user.username,
#             'email': user.email
#         },
#         'timestamp': timezone.now()
#     })

#     # ============================================
# # 8. VUE DE CONNEXION UNIVERSELLE
# # ============================================

# class UniversalLoginView(generics.GenericAPIView):
#     """
#     Vue unique pour la connexion de tous les utilisateurs
#     - Admins: se connectent avec username + password
#     - Apprenants: se connectent avec matricule + password
#     """
#     permission_classes = [permissions.AllowAny]
#     serializer_class = QuickLoginSerializer
    
#     def post(self, request):
#         identifier = request.data.get('identifier', '').strip()
#         password = request.data.get('password', '')
        
#         if not identifier or not password:
#             return Response({
#                 "error": "Identifiant et mot de passe requis"
#             }, status=status.HTTP_400_BAD_REQUEST)
        
#         # 🎯 DÉTECTION AUTOMATIQUE DU TYPE D'UTILISATEUR
        
#         # Tentative 1: Vérifier si c'est un admin (via username)
#         user = None
#         user_type = None
        
#         try:
#             # Chercher l'utilisateur par username
#             user = User.objects.get(username=identifier)
            
#             # Vérifier si c'est un admin
#             if user.is_staff or user.is_superuser:
#                 user_type = 'admin'
#             else:
#                 user_type = 'apprenant'  # C'est un utilisateur standard
                
#         except User.DoesNotExist:
#             # Tentative 2: Vérifier si c'est un matricule d'apprenant
#             try:
#                 matricule_autorise = MatriculeAutorise.objects.get(
#                     matricule=identifier,
#                     est_actif=True
#                 )
                
#                 # Le matricule existe et est actif
#                 # Chercher l'utilisateur avec ce matricule comme username
#                 try:
#                     user = User.objects.get(username=identifier)
#                     user_type = 'apprenant'
#                 except User.DoesNotExist:
#                     return Response({
#                         "error": "Compte non activé pour ce matricule. Veuillez d'abord activer votre compte."
#                     }, status=status.HTTP_400_BAD_REQUEST)
                    
#             except MatriculeAutorise.DoesNotExist:
#                 # Aucun utilisateur ou matricule trouvé
#                 return Response({
#                     "error": "Identifiant ou mot de passe incorrect"
#                 }, status=status.HTTP_401_UNAUTHORIZED)
        
#         # 🎯 AUTHENTIFICATION
#         from django.contrib.auth import authenticate
#         authenticated_user = authenticate(
#             username=identifier, 
#             password=password
#         )
        
#         if authenticated_user is not None:
#             from rest_framework_simplejwt.tokens import RefreshToken
#             refresh = RefreshToken.for_user(authenticated_user)
            
#             # 🎯 PRÉPARER LA RÉPONSE AVEC LES INFORMATIONS DE REDIRECTION
#             is_admin = authenticated_user.is_staff or authenticated_user.is_superuser
            
#             # Déterminer le dashboard approprié
#             redirect_to = "/admin" if is_admin else "/dashboard"
#             user_role = "admin" if is_admin else "apprenant"
            
#             return Response({
#                 "access": str(refresh.access_token),
#                 "refresh": str(refresh),
#                 "user": {
#                     "id": authenticated_user.id,
#                     "username": authenticated_user.username,
#                     "email": authenticated_user.email,
#                     "first_name": authenticated_user.first_name,
#                     "last_name": authenticated_user.last_name,
#                     "role": user_role,
#                     "is_staff": authenticated_user.is_staff,
#                     "is_superuser": authenticated_user.is_superuser,
#                 },
#                 "redirect_to": redirect_to,
#                 "message": f"Connexion réussie en tant que {user_role}"
#             })
#         else:
#             return Response({
#                 "error": "Identifiant ou mot de passe incorrect"
#             }, status=status.HTTP_401_UNAUTHORIZED)


#             # AJOUTER CETTE VUE À users/views.py (à la fin du fichier)


# class UserProjectsAPIView(generics.ListAPIView):
#     """
#     API pour récupérer les projets d'un utilisateur spécifique
#     """
#     permission_classes = [permissions.IsAuthenticated]
#     serializer_class = ProjectSerializer
    
#     def get_queryset(self):
#         # Récupérer l'ID utilisateur depuis les paramètres ou le token
#         user_id = self.kwargs.get('user_id')
        
#         if user_id:
#             # Si un user_id est fourni dans l'URL
#             return Project.objects.filter(author_id=user_id).order_by('-created_at')
#         else:
#             # Sinon, utiliser l'utilisateur connecté
#             return Project.objects.filter(author=self.request.user).order_by('-created_at')
    
#     def list(self, request, *args, **kwargs):
#         try:
#             queryset = self.get_queryset()
            
#             # Filtrer par statut si demandé
#             status_filter = request.query_params.get('status')
#             if status_filter:
#                 queryset = queryset.filter(status=status_filter)
            
#             # Pagination simple
#             page = int(request.query_params.get('page', 1))
#             per_page = int(request.query_params.get('per_page', 10))
#             start = (page - 1) * per_page
#             end = start + per_page
            
#             total = queryset.count()
#             projects = queryset[start:end]
            
#             serializer = self.get_serializer(projects, many=True)
            
#             return Response({
#                 'status': 'success',
#                 'user_id': self.request.user.id if not self.kwargs.get('user_id') else self.kwargs.get('user_id'),
#                 'username': self.request.user.username,
#                 'count': total,
#                 'page': page,
#                 'per_page': per_page,
#                 'total_pages': (total + per_page - 1) // per_page,
#                 'projects': serializer.data
#             })
            
#         except Exception as e:
#             logger.error(f"Erreur UserProjectsAPIView: {str(e)}")
#             return Response({
#                 'status': 'error',
#                 'message': str(e)
#             }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# class UserProjectsCountView(generics.GenericAPIView):
#     """
#     API pour compter les projets d'un utilisateur
#     """
#     permission_classes = [permissions.IsAuthenticated]
    
#     def get(self, request, *args, **kwargs):
#         try:
#             user_id = kwargs.get('user_id')
            
#             if user_id:
#                 count = Project.objects.filter(author_id=user_id).count()
#                 user = User.objects.get(id=user_id)
#                 username = user.username
#             else:
#                 count = Project.objects.filter(author=request.user).count()
#                 username = request.user.username
#                 user_id = request.user.id
            
#             # Compter par statut
#             status_counts = {}
#             for status_choice in ['draft', 'pending', 'approved', 'rejected']:
#                 if user_id:
#                     status_counts[status_choice] = Project.objects.filter(
#                         author_id=user_id,
#                         status=status_choice
#                     ).count()
#                 else:
#                     status_counts[status_choice] = Project.objects.filter(
#                         author=request.user,
#                         status=status_choice
#                     ).count()
            
#             return Response({
#                 'status': 'success',
#                 'user_id': user_id,
#                 'username': username,
#                 'total_projects': count,
#                 'status_counts': status_counts,
#                 'requested_at': timezone.now()
#             })
            
#         except User.DoesNotExist:
#             return Response({
#                 'status': 'error',
#                 'message': 'Utilisateur non trouvé'
#             }, status=status.HTTP_404_NOT_FOUND)
#         except Exception as e:
#             logger.error(f"Erreur UserProjectsCountView: {str(e)}")
#             return Response({
#                 'status': 'error',
#                 'message': str(e)
#             }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

#         # Ajoute ce code dans simplon-backend/users/views.py

# class UserProjectsAPIView(generics.ListAPIView):
#     """API pour récupérer les projets d'un utilisateur"""
#     permission_classes = [permissions.IsAuthenticated]
#     serializer_class = ProjectSerializer
    
#     def get_queryset(self):
#         user_id = self.kwargs.get('user_id')
        
#         if user_id:
#             return Project.objects.filter(author_id=user_id).order_by('-created_at')
#         else:
#             return Project.objects.filter(author=self.request.user).order_by('-created_at')
    
#     def list(self, request, *args, **kwargs):
#         try:
#             queryset = self.get_queryset()
#             serializer = self.get_serializer(queryset, many=True)
            
#             return Response({
#                 'status': 'success',
#                 'user_id': self.request.user.id,
#                 'count': len(serializer.data),
#                 'projects': serializer.data
#             })
#         except Exception as e:
#             return Response({
#                 'status': 'error',
#                 'message': str(e)
#             }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# class UserProjectsCountView(generics.GenericAPIView):
#     """API pour compter les projets d'un utilisateur"""
#     permission_classes = [permissions.IsAuthenticated]
    
#     def get(self, request, *args, **kwargs):
#         try:
#             user_id = kwargs.get('user_id') or request.user.id
            
#             count = Project.objects.filter(author_id=user_id).count()
            
#             # Compter par statut
#             status_counts = {
#                 'draft': Project.objects.filter(author_id=user_id, status='draft').count(),
#                 'pending': Project.objects.filter(author_id=user_id, status='pending').count(),
#                 'approved': Project.objects.filter(author_id=user_id, status='approved').count(),
#                 'rejected': Project.objects.filter(author_id=user_id, status='rejected').count(),
#             }
            
#             return Response({
#                 'status': 'success',
#                 'user_id': user_id,
#                 'total_projects': count,
#                 'status_counts': status_counts
#             })
#         except Exception as e:
#             return Response({
#                 'status': 'error',
#                 'message': str(e)
#             }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# # users/views.py - FICHIER UNIFIÉ ET DÉFINITIF
# from django.contrib.auth.models import User
# from django.contrib.auth import authenticate
# from django.db.models import Count, Q
# from django.utils import timezone
# from datetime import timedelta
# from rest_framework import viewsets, permissions, status, generics
# from rest_framework.decorators import api_view, permission_classes, action
# from rest_framework.response import Response
# from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
# from rest_framework.views import APIView
# from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
# import json
# import logging

# from projects.models import Project
# from projects.serializers import ProjectSerializer
# from .models import MatriculeAutorise, UserProfile, Notification, ProfileUpdateHistory
# from .serializers import (
#     UserCreateSerializer, UserWithProfileSerializer,
#     UserStatsSerializer, UserProfileSerializer,
#     NotificationSerializer, ProfileUpdateHistorySerializer,
#     UserSerializer, ExtendedProfileUpdateSerializer,
#     PasswordChangeSerializer, AvatarUploadSerializer,
#     QuickLoginSerializer
# )

# logger = logging.getLogger(__name__)

# # ============ VUES D'AUTHENTIFICATION ============

# class UniversalLoginView(APIView):
#     """
#     Vue de login universelle (username/email/matricule + password)
#     """
#     permission_classes = [AllowAny]
    
#     def post(self, request):
#         identifier = request.data.get('identifier', '').strip()
#         password = request.data.get('password', '')
        
#         if not identifier or not password:
#             return Response({
#                 'success': False,
#                 'message': 'Identifiant et mot de passe requis'
#             }, status=status.HTTP_400_BAD_REQUEST)
        
#         # Chercher l'utilisateur par différents critères
#         user = None
        
#         # 1. Par username
#         user = User.objects.filter(username=identifier).first()
        
#         # 2. Par email
#         if not user:
#             user = User.objects.filter(email=identifier).first()
        
#         # 3. Par matricule (chercher dans MatriculeAutorise puis User)
#         if not user:
#             try:
#                 matricule_auth = MatriculeAutorise.objects.filter(
#                     matricule=identifier,
#                     est_actif=True
#                 ).first()
#                 if matricule_auth:
#                     # Chercher l'utilisateur avec ce matricule comme username
#                     user = User.objects.filter(username=identifier).first()
#             except Exception as e:
#                 logger.error(f"Erreur recherche matricule: {e}")
        
#         if not user:
#             return Response({
#                 'success': False,
#                 'message': 'Identifiant non trouvé'
#             }, status=status.HTTP_404_NOT_FOUND)
        
#         # Authentifier avec le mot de passe
#         auth_user = authenticate(username=user.username, password=password)
        
#         if not auth_user:
#             return Response({
#                 'success': False,
#                 'message': 'Mot de passe incorrect'
#             }, status=status.HTTP_401_UNAUTHORIZED)
        
#         if not auth_user.is_active:
#             return Response({
#                 'success': False,
#                 'message': 'Compte désactivé'
#             }, status=status.HTTP_403_FORBIDDEN)
        
#         # Générer les tokens JWT
#         refresh = RefreshToken.for_user(auth_user)
        
#         # Mettre à jour la dernière connexion
#         auth_user.last_login = timezone.now()
#         auth_user.save()
        
#         # Récupérer le profil
#         try:
#             profile = UserProfile.objects.get(user=auth_user)
#             profile_data = UserProfileSerializer(profile).data
#         except UserProfile.DoesNotExist:
#             profile_data = {}
        
#         # Données utilisateur complètes
#         user_data = {
#             'id': auth_user.id,
#             'username': auth_user.username,
#             'email': auth_user.email,
#             'first_name': auth_user.first_name,
#             'last_name': auth_user.last_name,
#             'full_name': f"{auth_user.first_name or ''} {auth_user.last_name or ''}".strip() or auth_user.username,
#             'is_staff': auth_user.is_staff,
#             'is_superuser': auth_user.is_superuser,
#             'is_active': auth_user.is_active,
#             'date_joined': auth_user.date_joined,
#             'last_login': auth_user.last_login,
#             'role': 'admin' if auth_user.is_staff else 'user',
#             'profile': profile_data,
#             'profile_complete': bool(auth_user.first_name and auth_user.last_name and auth_user.email),
#         }
        
#         return Response({
#             'success': True,
#             'message': 'Connexion réussie',
#             'user': user_data,
#             'tokens': {
#                 'access': str(refresh.access_token),
#                 'refresh': str(refresh)
#             }
#         })

# class QuickLoginView(APIView):
#     """
#     Login rapide pour la démo
#     """
#     permission_classes = [AllowAny]
    
#     def post(self, request):
#         username = request.data.get('username', 'admin')
        
#         try:
#             user = User.objects.get(username=username)
            
#             # Pour la démo, on accepte n'importe quel mot de passe simple
#             password = request.data.get('password', '123')
#             valid_passwords = ['admin123', '123', 'password', 'simplon']
            
#             if password not in valid_passwords:
#                 return Response({
#                     'success': False,
#                     'message': 'Mot de passe incorrect (essayez: 123)'
#                 }, status=status.HTTP_401_UNAUTHORIZED)
            
#             if not user.is_active:
#                 return Response({
#                     'success': False,
#                     'message': 'Compte désactivé'
#                 }, status=status.HTTP_403_FORBIDDEN)
            
#             # Générer les tokens
#             refresh = RefreshToken.for_user(user)
            
#             user.last_login = timezone.now()
#             user.save()
            
#             user_data = {
#                 'id': user.id,
#                 'username': user.username,
#                 'email': user.email,
#                 'first_name': user.first_name,
#                 'last_name': user.last_name,
#                 'is_staff': user.is_staff,
#                 'is_superuser': user.is_superuser,
#                 'role': 'admin' if user.is_staff else 'user'
#             }
            
#             return Response({
#                 'success': True,
#                 'message': 'Connexion rapide réussie',
#                 'user': user_data,
#                 'tokens': {
#                     'access': str(refresh.access_token),
#                     'refresh': str(refresh)
#                 }
#             })
            
#         except User.DoesNotExist:
#             return Response({
#                 'success': False,
#                 'message': f'Utilisateur {username} non trouvé'
#             }, status=status.HTTP_404_NOT_FOUND)

# # ============ VUES DE PROFIL ============

# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def get_current_user(request):
#     """
#     Récupère l'utilisateur courant - ENDPOINT SIMPLE POUR FRONTEND
#     """
#     user = request.user
    
#     try:
#         profile = UserProfile.objects.get(user=user)
#         profile_data = UserProfileSerializer(profile).data
#     except UserProfile.DoesNotExist:
#         profile_data = {}
    
#     projects_count = Project.objects.filter(author=user).count()
    
#     return Response({
#         'id': user.id,
#         'username': user.username,
#         'email': user.email,
#         'first_name': user.first_name,
#         'last_name': user.last_name,
#         'full_name': f"{user.first_name or ''} {user.last_name or ''}".strip() or user.username,
#         'is_staff': user.is_staff,
#         'is_superuser': user.is_superuser,
#         'is_active': user.is_active,
#         'date_joined': user.date_joined,
#         'last_login': user.last_login,
#         'role': 'admin' if user.is_staff else 'user',
#         'profile_complete': bool(user.first_name and user.last_name and user.email),
#         'profile': profile_data,
#         'projects_count': projects_count,
#         'has_password': user.has_usable_password()
#     })

# class UserProfileView(generics.RetrieveUpdateAPIView):
#     """
#     Vue pour le profil utilisateur de base
#     """
#     permission_classes = [IsAuthenticated]
#     serializer_class = UserSerializer
    
#     def get_object(self):
#         return self.request.user

# class UserExtendedProfileView(generics.RetrieveUpdateAPIView):
#     """
#     Vue pour le profil utilisateur étendu
#     """
#     permission_classes = [IsAuthenticated]
    
#     def get_serializer_class(self):
#         if self.request.method in ['PUT', 'PATCH']:
#             return ExtendedProfileUpdateSerializer
#         return UserProfileSerializer
    
#     def get_object(self):
#         profile, created = UserProfile.objects.get_or_create(user=self.request.user)
#         return profile
    
#     def get(self, request, *args, **kwargs):
#         instance = self.get_object()
#         serializer = UserProfileSerializer(instance)
#         return Response(serializer.data)
    
#     def update(self, request, *args, **kwargs):
#         instance = self.get_object()
#         partial = kwargs.pop('partial', False)
        
#         serializer = ExtendedProfileUpdateSerializer(instance, data=request.data, partial=partial)
#         serializer.is_valid(raise_exception=True)
        
#         for field, value in serializer.validated_data.items():
#             setattr(instance, field, value)
        
#         instance.save()
        
#         # Historiser la modification
#         ProfileUpdateHistory.objects.create(
#             user=request.user,
#             changes=json.dumps(serializer.validated_data),
#             ip_address=request.META.get('REMOTE_ADDR'),
#             user_agent=request.META.get('HTTP_USER_AGENT', '')
#         )
        
#         response_serializer = UserProfileSerializer(instance)
#         return Response(response_serializer.data)

# class UserProfileCompleteView(APIView):
#     """
#     Vérifie si le profil est complet
#     """
#     permission_classes = [IsAuthenticated]
    
#     def get(self, request):
#         user = request.user
        
#         required_fields = {
#             'first_name': bool(user.first_name),
#             'last_name': bool(user.last_name),
#             'email': bool(user.email),
#         }
        
#         try:
#             profile = UserProfile.objects.get(user=user)
#             required_fields['cohort'] = bool(profile.cohort)
#         except UserProfile.DoesNotExist:
#             required_fields['cohort'] = False
        
#         all_complete = all(required_fields.values())
#         completed_fields = sum(required_fields.values())
#         total_fields = len(required_fields)
        
#         return Response({
#             'is_complete': all_complete,
#             'progress': {
#                 'completed': completed_fields,
#                 'total': total_fields,
#                 'percentage': int((completed_fields / total_fields) * 100)
#             },
#             'missing_fields': [field for field, is_set in required_fields.items() if not is_set]
#         })

# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def get_complete_profile(request):
#     """
#     Profil complet avec toutes les données
#     """
#     user = request.user
    
#     try:
#         profile = UserProfile.objects.get(user=user)
#         profile_data = UserProfileSerializer(profile).data
#     except UserProfile.DoesNotExist:
#         profile_data = {}
    
#     projects = Project.objects.filter(author=user)
#     projects_data = ProjectSerializer(projects, many=True).data
    
#     notifications = Notification.objects.filter(user=user, is_read=False)
#     notifications_data = NotificationSerializer(notifications, many=True).data
    
#     return Response({
#         'user': {
#             'id': user.id,
#             'username': user.username,
#             'email': user.email,
#             'first_name': user.first_name,
#             'last_name': user.last_name,
#             'full_name': f"{user.first_name or ''} {user.last_name or ''}".strip() or user.username,
#             'is_staff': user.is_staff,
#             'is_superuser': user.is_superuser,
#             'is_active': user.is_active,
#             'date_joined': user.date_joined,
#             'last_login': user.last_login,
#             'role': 'admin' if user.is_staff else 'user'
#         },
#         'profile': profile_data,
#         'projects': projects_data,
#         'unread_notifications': notifications_data,
#         'unread_count': notifications.count()
#     })

# class UserProfileImageView(APIView):
#     """
#     Gestion de l'avatar utilisateur
#     """
#     permission_classes = [IsAuthenticated]
    
#     def get(self, request):
#         try:
#             profile = UserProfile.objects.get(user=request.user)
#             if profile.avatar:
#                 avatar_url = request.build_absolute_uri(profile.avatar.url)
#                 return Response({
#                     'avatar_url': avatar_url,
#                     'has_avatar': True
#                 })
#         except UserProfile.DoesNotExist:
#             pass
        
#         return Response({
#             'avatar_url': None,
#             'has_avatar': False
#         })
    
#     def post(self, request):
#         serializer = AvatarUploadSerializer(data=request.data)
#         if serializer.is_valid():
#             profile, created = UserProfile.objects.get_or_create(user=request.user)
            
#             if profile.avatar:
#                 profile.avatar.delete(save=False)
            
#             profile.avatar = serializer.validated_data['avatar']
#             profile.save()
            
#             avatar_url = request.build_absolute_uri(profile.avatar.url) if profile.avatar else None
            
#             return Response({
#                 'success': True,
#                 'message': 'Photo de profil mise à jour',
#                 'avatar_url': avatar_url
#             })
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
#     def delete(self, request):
#         try:
#             profile = UserProfile.objects.get(user=request.user)
#             if profile.avatar:
#                 profile.avatar.delete()
#                 profile.save()
#                 return Response({
#                     'success': True,
#                     'message': 'Avatar supprimé'
#                 })
#         except UserProfile.DoesNotExist:
#             pass
        
#         return Response({
#             'success': False,
#             'message': 'Pas d\'avatar à supprimer'
#         })

# class UserProfileHistoryView(generics.ListAPIView):
#     """
#     Historique des modifications du profil
#     """
#     permission_classes = [IsAuthenticated]
#     serializer_class = ProfileUpdateHistorySerializer
    
#     def get_queryset(self):
#         return ProfileUpdateHistory.objects.filter(
#             user=self.request.user
#         ).order_by('-updated_at')

# class ChangePasswordView(APIView):
#     """
#     Changement de mot de passe
#     """
#     permission_classes = [IsAuthenticated]
    
#     def post(self, request):
#         old_password = request.data.get('old_password')
#         new_password = request.data.get('new_password')
#         confirm_password = request.data.get('confirm_password')
        
#         if not all([old_password, new_password, confirm_password]):
#             return Response({
#                 'success': False,
#                 'message': 'Tous les champs sont requis'
#             }, status=status.HTTP_400_BAD_REQUEST)
        
#         if new_password != confirm_password:
#             return Response({
#                 'success': False,
#                 'message': 'Les nouveaux mots de passe ne correspondent pas'
#             }, status=status.HTTP_400_BAD_REQUEST)
        
#         user = request.user
#         if not user.check_password(old_password):
#             return Response({
#                 'success': False,
#                 'message': 'Ancien mot de passe incorrect'
#             }, status=status.HTTP_400_BAD_REQUEST)
        
#         user.set_password(new_password)
#         user.save()
        
#         return Response({
#             'success': True,
#             'message': 'Mot de passe changé avec succès'
#         })

# # ============ VUES DE PROJETS ============

# class UserProjectsAPIView(generics.ListAPIView):
#     """
#     API pour récupérer les projets d'un utilisateur
#     """
#     permission_classes = [IsAuthenticated]
#     serializer_class = ProjectSerializer
    
#     def get_queryset(self):
#         user_id = self.kwargs.get('user_id')
        
#         if user_id:
#             # Vérifier les permissions
#             if self.request.user.is_staff:
#                 return Project.objects.filter(author_id=user_id).order_by('-created_at')
#             elif self.request.user.id == user_id:
#                 return Project.objects.filter(author_id=user_id).order_by('-created_at')
#             else:
#                 return Project.objects.none()
#         else:
#             # Utilisateur courant
#             return Project.objects.filter(author=self.request.user).order_by('-created_at')
    
#     def list(self, request, *args, **kwargs):
#         queryset = self.get_queryset()
        
#         # Filtrer par statut
#         status_filter = request.query_params.get('status')
#         if status_filter:
#             queryset = queryset.filter(status=status_filter)
        
#         # Pagination
#         page = int(request.query_params.get('page', 1))
#         per_page = int(request.query_params.get('per_page', 10))
#         start = (page - 1) * per_page
#         end = start + per_page
        
#         total = queryset.count()
#         projects = queryset[start:end]
        
#         serializer = self.get_serializer(projects, many=True)
        
#         return Response({
#             'success': True,
#             'user_id': self.kwargs.get('user_id') or request.user.id,
#             'username': request.user.username,
#             'count': total,
#             'page': page,
#             'per_page': per_page,
#             'total_pages': (total + per_page - 1) // per_page,
#             'projects': serializer.data
#         })

# class UserProjectsCountView(APIView):
#     """
#     Compte les projets d'un utilisateur par statut
#     """
#     permission_classes = [IsAuthenticated]
    
#     def get(self, request, user_id=None):
#         if user_id:
#             if request.user.is_staff or request.user.id == user_id:
#                 target_user_id = user_id
#             else:
#                 return Response({
#                     'success': False,
#                     'message': 'Permission refusée'
#                 }, status=status.HTTP_403_FORBIDDEN)
#         else:
#             target_user_id = request.user.id
        
#         try:
#             user = User.objects.get(id=target_user_id)
#         except User.DoesNotExist:
#             return Response({
#                 'success': False,
#                 'message': 'Utilisateur non trouvé'
#             }, status=status.HTTP_404_NOT_FOUND)
        
#         projects = Project.objects.filter(author=user)
        
#         counts = {
#             'total': projects.count(),
#             'draft': projects.filter(status='draft').count(),
#             'pending': projects.filter(status='pending').count(),
#             'approved': projects.filter(status='approved').count(),
#             'published': projects.filter(status='publié').count(),
#             'rejected': projects.filter(status='rejected').count()
#         }
        
#         return Response({
#             'success': True,
#             'user': {
#                 'id': user.id,
#                 'username': user.username
#             },
#             'counts': counts
#         })

# # ============ VUES ADMIN ============

# class AdminUserViewSet(viewsets.ModelViewSet):
#     """
#     ViewSet pour la gestion admin des utilisateurs
#     """
#     permission_classes = [IsAdminUser]
#     queryset = User.objects.all().order_by('-date_joined')
    
#     def get_serializer_class(self):
#         if self.action == 'create':
#             return UserCreateSerializer
#         elif self.action in ['retrieve', 'update', 'partial_update']:
#             return UserWithProfileSerializer
#         return UserCreateSerializer
    
#     @action(detail=True, methods=['post'])
#     def activate(self, request, pk=None):
#         """Activer/désactiver un utilisateur"""
#         user = self.get_object()
#         user.is_active = not user.is_active
#         user.save()
        
#         status_text = "activé" if user.is_active else "désactivé"
#         return Response({
#             'success': True,
#             'message': f'Utilisateur {status_text}',
#             'is_active': user.is_active
#         })
    
#     @action(detail=False, methods=['get'])
#     def stats(self, request):
#         """Statistiques admin"""
#         now = timezone.now()
#         last_week = now - timedelta(days=7)
        
#         total_users = User.objects.count()
#         active_today = User.objects.filter(last_login__date=now.date()).count()
#         new_this_week = User.objects.filter(date_joined__gte=last_week).count()
#         with_profile = UserProfile.objects.count()
        
#         return Response({
#             'total_users': total_users,
#             'active_today': active_today,
#             'new_this_week': new_this_week,
#             'with_profile': with_profile,
#             'without_profile': total_users - with_profile,
#             'generated_at': now.isoformat()
#         })

# # ============ NOTIFICATIONS ============

# class UserNotificationsView(APIView):
#     """
#     Gestion des notifications utilisateur
#     """
#     permission_classes = [IsAuthenticated]
    
#     def get(self, request):
#         notifications = Notification.objects.filter(user=request.user).order_by('-created_at')
        
#         # Marquer comme lues si demandé
#         mark_read = request.query_params.get('mark_read', 'false').lower() == 'true'
#         if mark_read:
#             notifications.update(is_read=True)
        
#         # Pagination
#         page = int(request.query_params.get('page', 1))
#         page_size = int(request.query_params.get('page_size', 20))
#         start = (page - 1) * page_size
#         end = start + page_size
        
#         total = notifications.count()
#         paginated_notifications = notifications[start:end]
        
#         serializer = NotificationSerializer(paginated_notifications, many=True)
        
#         unread_count = Notification.objects.filter(user=request.user, is_read=False).count()
        
#         return Response({
#             'success': True,
#             'notifications': serializer.data,
#             'unread_count': unread_count,
#             'pagination': {
#                 'page': page,
#                 'page_size': page_size,
#                 'total': total,
#                 'total_pages': (total + page_size - 1) // page_size
#             }
#         })
    
#     def post(self, request):
#         # Marquer toutes comme lues
#         if request.data.get('mark_all_read', False):
#             Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)
#             return Response({
#                 'success': True,
#                 'message': 'Toutes les notifications marquées comme lues'
#             })
        
#         # Marquer une notification spécifique comme lue
#         notification_id = request.data.get('notification_id')
#         if notification_id:
#             try:
#                 notification = Notification.objects.get(id=notification_id, user=request.user)
#                 notification.is_read = True
#                 notification.save()
#                 return Response({
#                     'success': True,
#                     'message': 'Notification marquée comme lue'
#                 })
#             except Notification.DoesNotExist:
#                 return Response({
#                     'success': False,
#                     'message': 'Notification non trouvée'
#                 }, status=status.HTTP_404_NOT_FOUND)
        
#         return Response({
#             'success': False,
#             'message': 'Action non spécifiée'
#         }, status=status.HTTP_400_BAD_REQUEST)

# # ============ VUES UTILITAIRES ============

# @api_view(['GET'])
# @permission_classes([AllowAny])
# def get_all_users_simple(request):
#     """Liste simple de tous les utilisateurs"""
#     users = User.objects.filter(is_active=True).values('id', 'username', 'email', 'first_name', 'last_name')
#     return Response(list(users))

# @api_view(['GET'])
# @permission_classes([IsAdminUser])
# def get_all_users_admin(request):
#     """Liste complète de tous les utilisateurs (admin)"""
#     users = User.objects.all().order_by('-date_joined')
#     serializer = UserWithProfileSerializer(users, many=True)
#     return Response(serializer.data)

# @api_view(['GET'])
# @permission_classes([AllowAny])
# def health_check(request):
#     """Vérification de santé de l'API"""
#     users_count = User.objects.count()
#     active_users = User.objects.filter(is_active=True).count()
    
#     return Response({
#         'status': 'healthy',
#         'timestamp': timezone.now().isoformat(),
#         'database': {
#             'total_users': users_count,
#             'active_users': active_users
#         }
#     })

# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def user_status(request):
#     """Statut de l'utilisateur courant"""
#     user = request.user
    
#     last_project = Project.objects.filter(author=user).order_by('-created_at').first()
#     unread_notifications = Notification.objects.filter(user=user, is_read=False).count()
    
#     return Response({
#         'user': {
#             'id': user.id,
#             'username': user.username,
#             'is_active': user.is_active,
#             'is_authenticated': True
#         },
#         'last_activity': {
#             'project': ProjectSerializer(last_project).data if last_project else None,
#             'login': user.last_login
#         },
#         'notifications': {
#             'unread': unread_notifications
#         }
#     })

# # ============ VUES SPÉCIALES (activation par matricule) ============

# class RequestLoginView(APIView):
#     """
#     Demande de connexion pour activation par matricule
#     """
#     permission_classes = [AllowAny]
    
#     def post(self, request):
#         matricule = request.data.get('matricule')
#         email = request.data.get('email')
        
#         try:
#             matricule_autorise = MatriculeAutorise.objects.get(
#                 matricule=matricule,
#                 est_actif=True
#             )
            
#             token = matricule_autorise.generate_activation_token(minutes=5)
            
#             return Response({
#                 "success": True,
#                 "message": "Lien d'activation envoyé !",
#                 "expires_in": "5 minutes"
#             })
            
#         except MatriculeAutorise.DoesNotExist:
#             return Response({
#                 "success": False,
#                 "message": "Matricule non autorisé ou introuvable."
#             }, status=status.HTTP_400_BAD_REQUEST)

# class SetupPasswordView(APIView):
#     """
#     Configuration du mot de passe après activation
#     """
#     permission_classes = [AllowAny]
    
#     def post(self, request):
#         token = request.data.get('token')
#         matricule = request.data.get('matricule')
#         email = request.data.get('email')
#         username = request.data.get('username')
#         password = request.data.get('password')
        
#         try:
#             matricule_autorise = MatriculeAutorise.objects.get(
#                 matricule=matricule,
#                 est_actif=True
#             )
            
#             if not matricule_autorise.activation_token or matricule_autorise.activation_token != token:
#                 return Response({
#                     "success": False,
#                     "message": "Lien d'activation invalide ou déjà utilisé."
#                 }, status=status.HTTP_400_BAD_REQUEST)
            
#             if User.objects.filter(username=username).exists():
#                 return Response({
#                     "success": False,
#                     "message": "Ce nom d'utilisateur est déjà pris."
#                 }, status=status.HTTP_400_BAD_REQUEST)
            
#             user, created = User.objects.get_or_create(
#                 username=matricule,
#                 defaults={
#                     'email': email,
#                     'password': password,
#                     'first_name': '',
#                     'last_name': ''
#                 }
#             )
            
#             if not created:
#                 user.email = email
#                 user.set_password(password)
#                 user.save()
            
#             matricule_autorise.date_activation = timezone.now()
#             matricule_autorise.activation_token = None
#             matricule_autorise.token_expiration = None
#             matricule_autorise.save()
            
#             return Response({
#                 "success": True,
#                 "message": "Compte créé avec succès !",
#                 "username": username
#             })
            
#         except MatriculeAutorise.DoesNotExist:
#             return Response({
#                 "success": False,
#                 "message": "Matricule non autorisé ou introuvable."
#             }, status=status.HTTP_400_BAD_REQUEST)


# users/views.py - FICHIER UNIFIÉ ET DÉFINITIF - VERSION CORRIGÉE
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.db.models import Count, Q
from django.utils import timezone
from datetime import timedelta
from rest_framework import viewsets, permissions, status, generics
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
import json
import logging

from projects.models import Project
from projects.serializers import ProjectSerializer
from .models import MatriculeAutorise, UserProfile, Notification, ProfileUpdateHistory
from .serializers import (
    UserCreateSerializer, UserWithProfileSerializer,
    UserStatsSerializer, UserProfileSerializer,
    NotificationSerializer, ProfileUpdateHistorySerializer,
    UserSerializer, ExtendedProfileUpdateSerializer,
    PasswordChangeSerializer, AvatarUploadSerializer,
    QuickLoginSerializer
)

logger = logging.getLogger(__name__)

# ============ VUES D'AUTHENTIFICATION ============

# class UniversalLoginView(APIView):
#     """
#     Vue de login universelle (username/email/matricule + password)
#     Version corrigée avec serializer et gestion d'erreurs
#     """
#     permission_classes = [AllowAny]
    
#     def post(self, request):
#         try:
#             # VALIDATION AVEC SERIALIZER - CORRECTION AJOUTÉE
#             serializer = QuickLoginSerializer(data=request.data)
#             if not serializer.is_valid():
#                 return Response({
#                     'success': False,
#                     'message': 'Données de connexion invalides',
#                     'errors': serializer.errors
#                 }, status=status.HTTP_400_BAD_REQUEST)
            
#             validated_data = serializer.validated_data
#             identifier = validated_data.get('identifier', '').strip()
#             password = validated_data.get('password', '')
            
#             if not identifier or not password:
#                 return Response({
#                     'success': False,
#                     'message': 'Identifiant et mot de passe requis'
#                 }, status=status.HTTP_400_BAD_REQUEST)
            
#             # Chercher l'utilisateur par différents critères
#             user = None
            
#             # 1. Par username
#             user = User.objects.filter(username=identifier).first()
            
#             # 2. Par email
#             if not user:
#                 user = User.objects.filter(email=identifier).first()
            
#             # 3. Par matricule (chercher dans MatriculeAutorise puis User)
#             if not user:
#                 try:
#                     matricule_auth = MatriculeAutorise.objects.filter(
#                         matricule=identifier,
#                         est_actif=True
#                     ).first()
#                     if matricule_auth:
#                         # Chercher l'utilisateur avec ce matricule comme username
#                         user = User.objects.filter(username=identifier).first()
#                 except Exception as e:
#                     logger.error(f"Erreur recherche matricule: {e}")
            
#             if not user:
#                 return Response({
#                     'success': False,
#                     'message': 'Identifiant non trouvé'
#                 }, status=status.HTTP_404_NOT_FOUND)
            
#             # Authentifier avec le mot de passe
#             auth_user = authenticate(username=user.username, password=password)
            
#             if not auth_user:
#                 return Response({
#                     'success': False,
#                     'message': 'Mot de passe incorrect'
#                 }, status=status.HTTP_401_UNAUTHORIZED)
            
#             if not auth_user.is_active:
#                 return Response({
#                     'success': False,
#                     'message': 'Compte désactivé'
#                 }, status=status.HTTP_403_FORBIDDEN)
            
#             # Générer les tokens JWT
#             refresh = RefreshToken.for_user(auth_user)
            
#             # Mettre à jour la dernière connexion
#             auth_user.last_login = timezone.now()
#             auth_user.save()
            
#             # Récupérer le profil
#             try:
#                 profile = UserProfile.objects.get(user=auth_user)
#                 profile_data = UserProfileSerializer(profile).data
#             except UserProfile.DoesNotExist:
#                 profile_data = {}
            
#             # Données utilisateur complètes
#             user_data = {
#                 'id': auth_user.id,
#                 'username': auth_user.username,
#                 'email': auth_user.email,
#                 'first_name': auth_user.first_name,
#                 'last_name': auth_user.last_name,
#                 'full_name': f"{auth_user.first_name or ''} {auth_user.last_name or ''}".strip() or auth_user.username,
#                 'is_staff': auth_user.is_staff,
#                 'is_superuser': auth_user.is_superuser,
#                 'is_active': auth_user.is_active,
#                 'date_joined': auth_user.date_joined,
#                 'last_login': auth_user.last_login,
#                 'role': 'admin' if auth_user.is_staff else 'user',
#                 'profile': profile_data,
#                 'profile_complete': bool(auth_user.first_name and auth_user.last_name and auth_user.email),
#             }
            
#             return Response({
#                 'success': True,
#                 'message': 'Connexion réussie',
#                 'user': user_data,
#                 'tokens': {
#                     'access': str(refresh.access_token),
#                     'refresh': str(refresh)
#                 }
#             })
            
#         except Exception as e:
#             logger.error(f"Erreur UniversalLoginView: {str(e)}", exc_info=True)
#             return Response({
#                 'success': False,
#                 'message': 'Erreur serveur lors de la connexion',
#                 'error': str(e) if settings.DEBUG else None
#             }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UniversalLoginView(APIView):
    """
    Vue de login universelle (username/email/matricule + password)
    Version corrigée qui fonctionne avec QuickLoginSerializer
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        try:
            identifier = request.data.get('identifier', '').strip()
            password = request.data.get('password', '')
            
            # Déterminer le type d'identifiant
            serializer_data = {'password': password}
            
            if '@' in identifier:
                # C'est un email, utiliser comme username temporairement
                serializer_data['username'] = identifier
            elif identifier.isdigit() or len(identifier) == 8:  # Supposition: matricule
                serializer_data['matricule'] = identifier
            else:
                serializer_data['username'] = identifier
            
            # Validation avec serializer
            serializer = QuickLoginSerializer(data=serializer_data)
            if not serializer.is_valid():
                return Response({
                    'success': False,
                    'message': 'Données de connexion invalides',
                    'errors': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)
            
            validated_data = serializer.validated_data
            username = validated_data.get('username')
            matricule = validated_data.get('matricule')
            
            # Recherche utilisateur
            user = None
            
            # Si username fourni
            if username:
                user = User.objects.filter(username=username).first()
                if not user:
                    user = User.objects.filter(email=username).first()
            
            # Si matricule fourni
            if not user and matricule:
                try:
                    matricule_auth = MatriculeAutorise.objects.filter(
                        matricule=matricule,
                        est_actif=True
                    ).first()
                    if matricule_auth:
                        user = User.objects.filter(username=matricule).first()
                except Exception as e:
                    logger.error(f"Erreur recherche matricule: {e}")
            
            if not user:
                return Response({
                    'success': False,
                    'message': 'Identifiant non trouvé'
                }, status=status.HTTP_404_NOT_FOUND)
            
            # Authentification
            auth_user = authenticate(username=user.username, password=password)
            
            if not auth_user:
                return Response({
                    'success': False,
                    'message': 'Mot de passe incorrect'
                }, status=status.HTTP_401_UNAUTHORIZED)
            
            if not auth_user.is_active:
                return Response({
                    'success': False,
                    'message': 'Compte désactivé'
                }, status=status.HTTP_403_FORBIDDEN)
            
            # Génération tokens
            refresh = RefreshToken.for_user(auth_user)
            
            # Mise à jour dernière connexion
            auth_user.last_login = timezone.now()
            auth_user.save()
            
            # Récupération profil
            try:
                profile = UserProfile.objects.get(user=auth_user)
                profile_data = UserProfileSerializer(profile).data
            except UserProfile.DoesNotExist:
                profile_data = {}
            
            # Construction réponse
            user_data = {
                'id': auth_user.id,
                'username': auth_user.username,
                'email': auth_user.email,
                'first_name': auth_user.first_name,
                'last_name': auth_user.last_name,
                'full_name': f"{auth_user.first_name or ''} {auth_user.last_name or ''}".strip() or auth_user.username,
                'is_staff': auth_user.is_staff,
                'is_superuser': auth_user.is_superuser,
                'is_active': auth_user.is_active,
                'date_joined': auth_user.date_joined,
                'last_login': auth_user.last_login,
                'role': 'admin' if auth_user.is_staff else 'user',
                'profile': profile_data,
                'profile_complete': bool(auth_user.first_name and auth_user.last_name and auth_user.email),
            }
            
            return Response({
                'success': True,
                'message': 'Connexion réussie',
                'user': user_data,
                'tokens': {
                    'access': str(refresh.access_token),
                    'refresh': str(refresh)
                }
            })
            
        except Exception as e:
            logger.error(f"Erreur UniversalLoginView: {str(e)}", exc_info=True)
            return Response({
                'success': False,
                'message': 'Erreur serveur lors de la connexion',
                'error': str(e) if settings.DEBUG else None
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class QuickLoginView(APIView):
    """
    Login rapide pour la démo
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        username = request.data.get('username', 'admin')
        
        try:
            user = User.objects.get(username=username)
            
            # Pour la démo, on accepte n'importe quel mot de passe simple
            password = request.data.get('password', '123')
            valid_passwords = ['admin123', '123', 'password', 'simplon']
            
            if password not in valid_passwords:
                return Response({
                    'success': False,
                    'message': 'Mot de passe incorrect (essayez: 123)'
                }, status=status.HTTP_401_UNAUTHORIZED)
            
            if not user.is_active:
                return Response({
                    'success': False,
                    'message': 'Compte désactivé'
                }, status=status.HTTP_403_FORBIDDEN)
            
            # Générer les tokens
            refresh = RefreshToken.for_user(user)
            
            user.last_login = timezone.now()
            user.save()
            
            user_data = {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'is_staff': user.is_staff,
                'is_superuser': user.is_superuser,
                'role': 'admin' if user.is_staff else 'user'
            }
            
            return Response({
                'success': True,
                'message': 'Connexion rapide réussie',
                'user': user_data,
                'tokens': {
                    'access': str(refresh.access_token),
                    'refresh': str(refresh)
                }
            })
            
        except User.DoesNotExist:
            return Response({
                'success': False,
                'message': f'Utilisateur {username} non trouvé'
            }, status=status.HTTP_404_NOT_FOUND)

# ============ VUES DE PROFIL ============

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_current_user(request):
    """
    Récupère l'utilisateur courant - ENDPOINT SIMPLE POUR FRONTEND
    """
    user = request.user
    
    try:
        profile = UserProfile.objects.get(user=user)
        profile_data = UserProfileSerializer(profile).data
    except UserProfile.DoesNotExist:
        profile_data = {}
    
    projects_count = Project.objects.filter(author=user).count()
    
    return Response({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'full_name': f"{user.first_name or ''} {user.last_name or ''}".strip() or user.username,
        'is_staff': user.is_staff,
        'is_superuser': user.is_superuser,
        'is_active': user.is_active,
        'date_joined': user.date_joined,
        'last_login': user.last_login,
        'role': 'admin' if user.is_staff else 'user',
        'profile_complete': bool(user.first_name and user.last_name and user.email),
        'profile': profile_data,
        'projects_count': projects_count,
        'has_password': user.has_usable_password()
    })

class UserProfileView(generics.RetrieveUpdateAPIView):
    """
    Vue pour le profil utilisateur de base
    """
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer
    
    def get_object(self):
        return self.request.user

class UserExtendedProfileView(generics.RetrieveUpdateAPIView):
    """
    Vue pour le profil utilisateur étendu
    """
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return ExtendedProfileUpdateSerializer
        return UserProfileSerializer
    
    def get_object(self):
        profile, created = UserProfile.objects.get_or_create(user=self.request.user)
        return profile
    
    def get(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = UserProfileSerializer(instance)
        return Response(serializer.data)
    
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        partial = kwargs.pop('partial', False)
        
        serializer = ExtendedProfileUpdateSerializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        
        for field, value in serializer.validated_data.items():
            setattr(instance, field, value)
        
        instance.save()
        
        # Historiser la modification
        ProfileUpdateHistory.objects.create(
            user=request.user,
            changes=json.dumps(serializer.validated_data),
            ip_address=request.META.get('REMOTE_ADDR'),
            user_agent=request.META.get('HTTP_USER_AGENT', '')
        )
        
        response_serializer = UserProfileSerializer(instance)
        return Response(response_serializer.data)

class UserProfileCompleteView(APIView):
    """
    Vérifie si le profil est complet
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        
        required_fields = {
            'first_name': bool(user.first_name),
            'last_name': bool(user.last_name),
            'email': bool(user.email),
        }
        
        try:
            profile = UserProfile.objects.get(user=user)
            required_fields['cohort'] = bool(profile.cohort)
        except UserProfile.DoesNotExist:
            required_fields['cohort'] = False
        
        all_complete = all(required_fields.values())
        completed_fields = sum(required_fields.values())
        total_fields = len(required_fields)
        
        return Response({
            'is_complete': all_complete,
            'progress': {
                'completed': completed_fields,
                'total': total_fields,
                'percentage': int((completed_fields / total_fields) * 100)
            },
            'missing_fields': [field for field, is_set in required_fields.items() if not is_set]
        })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_complete_profile(request):
    """
    Profil complet avec toutes les données
    """
    user = request.user
    
    try:
        profile = UserProfile.objects.get(user=user)
        profile_data = UserProfileSerializer(profile).data
    except UserProfile.DoesNotExist:
        profile_data = {}
    
    projects = Project.objects.filter(author=user)
    projects_data = ProjectSerializer(projects, many=True).data
    
    notifications = Notification.objects.filter(user=user, is_read=False)
    notifications_data = NotificationSerializer(notifications, many=True).data
    
    return Response({
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'full_name': f"{user.first_name or ''} {user.last_name or ''}".strip() or user.username,
            'is_staff': user.is_staff,
            'is_superuser': user.is_superuser,
            'is_active': user.is_active,
            'date_joined': user.date_joined,
            'last_login': user.last_login,
            'role': 'admin' if user.is_staff else 'user'
        },
        'profile': profile_data,
        'projects': projects_data,
        'unread_notifications': notifications_data,
        'unread_count': notifications.count()
    })

class UserProfileImageView(APIView):
    """
    Gestion de l'avatar utilisateur
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            profile = UserProfile.objects.get(user=request.user)
            if profile.avatar:
                avatar_url = request.build_absolute_uri(profile.avatar.url)
                return Response({
                    'avatar_url': avatar_url,
                    'has_avatar': True
                })
        except UserProfile.DoesNotExist:
            pass
        
        return Response({
            'avatar_url': None,
            'has_avatar': False
        })
    
    def post(self, request):
        serializer = AvatarUploadSerializer(data=request.data)
        if serializer.is_valid():
            profile, created = UserProfile.objects.get_or_create(user=request.user)
            
            if profile.avatar:
                profile.avatar.delete(save=False)
            
            profile.avatar = serializer.validated_data['avatar']
            profile.save()
            
            avatar_url = request.build_absolute_uri(profile.avatar.url) if profile.avatar else None
            
            return Response({
                'success': True,
                'message': 'Photo de profil mise à jour',
                'avatar_url': avatar_url
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request):
        try:
            profile = UserProfile.objects.get(user=request.user)
            if profile.avatar:
                profile.avatar.delete()
                profile.save()
                return Response({
                    'success': True,
                    'message': 'Avatar supprimé'
                })
        except UserProfile.DoesNotExist:
            pass
        
        return Response({
            'success': False,
            'message': 'Pas d\'avatar à supprimer'
        })

class UserProfileHistoryView(generics.ListAPIView):
    """
    Historique des modifications du profil
    """
    permission_classes = [IsAuthenticated]
    serializer_class = ProfileUpdateHistorySerializer
    
    def get_queryset(self):
        return ProfileUpdateHistory.objects.filter(
            user=self.request.user
        ).order_by('-updated_at')

class ChangePasswordView(APIView):
    """
    Changement de mot de passe
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')
        confirm_password = request.data.get('confirm_password')
        
        if not all([old_password, new_password, confirm_password]):
            return Response({
                'success': False,
                'message': 'Tous les champs sont requis'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if new_password != confirm_password:
            return Response({
                'success': False,
                'message': 'Les nouveaux mots de passe ne correspondent pas'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        user = request.user
        if not user.check_password(old_password):
            return Response({
                'success': False,
                'message': 'Ancien mot de passe incorrect'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        user.set_password(new_password)
        user.save()
        
        return Response({
            'success': True,
            'message': 'Mot de passe changé avec succès'
        })

# ============ VUES DE PROJETS ============

class UserProjectsAPIView(generics.ListAPIView):
    """
    API pour récupérer les projets d'un utilisateur
    """
    permission_classes = [IsAuthenticated]
    serializer_class = ProjectSerializer
    
    def get_queryset(self):
        user_id = self.kwargs.get('user_id')
        
        if user_id:
            # Vérifier les permissions
            if self.request.user.is_staff:
                return Project.objects.filter(author_id=user_id).order_by('-created_at')
            elif self.request.user.id == user_id:
                return Project.objects.filter(author_id=user_id).order_by('-created_at')
            else:
                return Project.objects.none()
        else:
            # Utilisateur courant
            return Project.objects.filter(author=self.request.user).order_by('-created_at')
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        
        # Filtrer par statut
        status_filter = request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        # Pagination
        page = int(request.query_params.get('page', 1))
        per_page = int(request.query_params.get('per_page', 10))
        start = (page - 1) * per_page
        end = start + per_page
        
        total = queryset.count()
        projects = queryset[start:end]
        
        serializer = self.get_serializer(projects, many=True)
        
        return Response({
            'success': True,
            'user_id': self.kwargs.get('user_id') or request.user.id,
            'username': request.user.username,
            'count': total,
            'page': page,
            'per_page': per_page,
            'total_pages': (total + per_page - 1) // per_page,
            'projects': serializer.data
        })

class UserProjectsCountView(APIView):
    """
    Compte les projets d'un utilisateur par statut
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request, user_id=None):
        if user_id:
            if request.user.is_staff or request.user.id == user_id:
                target_user_id = user_id
            else:
                return Response({
                    'success': False,
                    'message': 'Permission refusée'
                }, status=status.HTTP_403_FORBIDDEN)
        else:
            target_user_id = request.user.id
        
        try:
            user = User.objects.get(id=target_user_id)
        except User.DoesNotExist:
            return Response({
                'success': False,
                'message': 'Utilisateur non trouvé'
            }, status=status.HTTP_404_NOT_FOUND)
        
        projects = Project.objects.filter(author=user)
        
        counts = {
            'total': projects.count(),
            'draft': projects.filter(status='draft').count(),
            'pending': projects.filter(status='pending').count(),
            'approved': projects.filter(status='approved').count(),
            'published': projects.filter(status='publié').count(),
            'rejected': projects.filter(status='rejected').count()
        }
        
        return Response({
            'success': True,
            'user': {
                'id': user.id,
                'username': user.username
            },
            'counts': counts
        })

# ============ VUES ADMIN ============

class AdminUserViewSet(viewsets.ModelViewSet):
    """
    ViewSet pour la gestion admin des utilisateurs
    """
    permission_classes = [IsAdminUser]
    queryset = User.objects.all().order_by('-date_joined')
    
    def get_serializer_class(self):
        if self.action == 'create':
            return UserCreateSerializer
        elif self.action in ['retrieve', 'update', 'partial_update']:
            return UserWithProfileSerializer
        return UserCreateSerializer
    
    @action(detail=True, methods=['post'])
    def activate(self, request, pk=None):
        """Activer/désactiver un utilisateur"""
        user = self.get_object()
        user.is_active = not user.is_active
        user.save()
        
        status_text = "activé" if user.is_active else "désactivé"
        return Response({
            'success': True,
            'message': f'Utilisateur {status_text}',
            'is_active': user.is_active
        })
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Statistiques admin"""
        now = timezone.now()
        last_week = now - timedelta(days=7)
        
        total_users = User.objects.count()
        active_today = User.objects.filter(last_login__date=now.date()).count()
        new_this_week = User.objects.filter(date_joined__gte=last_week).count()
        with_profile = UserProfile.objects.count()
        
        return Response({
            'total_users': total_users,
            'active_today': active_today,
            'new_this_week': new_this_week,
            'with_profile': with_profile,
            'without_profile': total_users - with_profile,
            'generated_at': now.isoformat()
        })

# ============ NOTIFICATIONS ============

class UserNotificationsView(APIView):
    """
    Gestion des notifications utilisateur
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        notifications = Notification.objects.filter(user=request.user).order_by('-created_at')
        
        # Marquer comme lues si demandé
        mark_read = request.query_params.get('mark_read', 'false').lower() == 'true'
        if mark_read:
            notifications.update(is_read=True)
        
        # Pagination
        page = int(request.query_params.get('page', 1))
        page_size = int(request.query_params.get('page_size', 20))
        start = (page - 1) * page_size
        end = start + page_size
        
        total = notifications.count()
        paginated_notifications = notifications[start:end]
        
        serializer = NotificationSerializer(paginated_notifications, many=True)
        
        unread_count = Notification.objects.filter(user=request.user, is_read=False).count()
        
        return Response({
            'success': True,
            'notifications': serializer.data,
            'unread_count': unread_count,
            'pagination': {
                'page': page,
                'page_size': page_size,
                'total': total,
                'total_pages': (total + page_size - 1) // page_size
            }
        })
    
    def post(self, request):
        # Marquer toutes comme lues
        if request.data.get('mark_all_read', False):
            Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)
            return Response({
                'success': True,
                'message': 'Toutes les notifications marquées comme lues'
            })
        
        # Marquer une notification spécifique comme lue
        notification_id = request.data.get('notification_id')
        if notification_id:
            try:
                notification = Notification.objects.get(id=notification_id, user=request.user)
                notification.is_read = True
                notification.save()
                return Response({
                    'success': True,
                    'message': 'Notification marquée comme lue'
                })
            except Notification.DoesNotExist:
                return Response({
                    'success': False,
                    'message': 'Notification non trouvée'
                }, status=status.HTTP_404_NOT_FOUND)
        
        return Response({
            'success': False,
            'message': 'Action non spécifiée'
        }, status=status.HTTP_400_BAD_REQUEST)

# ============ VUES UTILITAIRES ============

@api_view(['GET'])
@permission_classes([AllowAny])
def get_all_users_simple(request):
    """Liste simple de tous les utilisateurs"""
    users = User.objects.filter(is_active=True).values('id', 'username', 'email', 'first_name', 'last_name')
    return Response(list(users))

@api_view(['GET'])
@permission_classes([IsAdminUser])
def get_all_users_admin(request):
    """Liste complète de tous les utilisateurs (admin)"""
    users = User.objects.all().order_by('-date_joined')
    serializer = UserWithProfileSerializer(users, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    """Vérification de santé de l'API"""
    users_count = User.objects.count()
    active_users = User.objects.filter(is_active=True).count()
    
    return Response({
        'status': 'healthy',
        'timestamp': timezone.now().isoformat(),
        'database': {
            'total_users': users_count,
            'active_users': active_users
        }
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_status(request):
    """Statut de l'utilisateur courant"""
    user = request.user
    
    last_project = Project.objects.filter(author=user).order_by('-created_at').first()
    unread_notifications = Notification.objects.filter(user=user, is_read=False).count()
    
    return Response({
        'user': {
            'id': user.id,
            'username': user.username,
            'is_active': user.is_active,
            'is_authenticated': True
        },
        'last_activity': {
            'project': ProjectSerializer(last_project).data if last_project else None,
            'login': user.last_login
        },
        'notifications': {
            'unread': unread_notifications
        }
    })

# ============ VUES SPÉCIALES (activation par matricule) ============

class RequestLoginView(APIView):
    """
    Demande de connexion pour activation par matricule
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        matricule = request.data.get('matricule')
        email = request.data.get('email')
        
        try:
            matricule_autorise = MatriculeAutorise.objects.get(
                matricule=matricule,
                est_actif=True
            )
            
            token = matricule_autorise.generate_activation_token(minutes=5)
            
            return Response({
                "success": True,
                "message": "Lien d'activation envoyé !",
                "expires_in": "5 minutes"
            })
            
        except MatriculeAutorise.DoesNotExist:
            return Response({
                "success": False,
                "message": "Matricule non autorisé ou introuvable."
            }, status=status.HTTP_400_BAD_REQUEST)

class SetupPasswordView(APIView):
    """
    Configuration du mot de passe après activation
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        token = request.data.get('token')
        matricule = request.data.get('matricule')
        email = request.data.get('email')
        username = request.data.get('username')
        password = request.data.get('password')
        
        try:
            matricule_autorise = MatriculeAutorise.objects.get(
                matricule=matricule,
                est_actif=True
            )
            
            if not matricule_autorise.activation_token or matricule_autorise.activation_token != token:
                return Response({
                    "success": False,
                    "message": "Lien d'activation invalide ou déjà utilisé."
                }, status=status.HTTP_400_BAD_REQUEST)
            
            if User.objects.filter(username=username).exists():
                return Response({
                    "success": False,
                    "message": "Ce nom d'utilisateur est déjà pris."
                }, status=status.HTTP_400_BAD_REQUEST)
            
            user, created = User.objects.get_or_create(
                username=matricule,
                defaults={
                    'email': email,
                    'password': password,
                    'first_name': '',
                    'last_name': ''
                }
            )
            
            if not created:
                user.email = email
                user.set_password(password)
                user.save()
            
            matricule_autorise.date_activation = timezone.now()
            matricule_autorise.activation_token = None
            matricule_autorise.token_expiration = None
            matricule_autorise.save()
            
            return Response({
                "success": True,
                "message": "Compte créé avec succès !",
                "username": username
            })
            
        except MatriculeAutorise.DoesNotExist:
            return Response({
                "success": False,
                "message": "Matricule non autorisé ou introuvable."
            }, status=status.HTTP_400_BAD_REQUEST)