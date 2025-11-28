
# from django.urls import path
# from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
# from . import views

# urlpatterns = [
#     # Authentification JWT standard
#     path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
#     path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
#     # Profil utilisateur
#     path('profile/', views.UserProfileView.as_view(), name='user-profile'),
#     path('user/', views.UserProfileView.as_view(), name='user-detail'),
    
#     # Flow de connexion par lien magique
#     path('request-login/', views.RequestLoginView.as_view(), name='request-login'),
#     path('setup-password/', views.SetupPasswordView.as_view(), name='setup-password'),
    
#     # Connexion directe
#     path('direct-login/', views.DirectLoginView.as_view(), name='direct-login'),
#     path('quick-login/', views.QuickLoginView.as_view(), name='quick-login'),
    
#     # ⭐ NOUVEAU : Mot de passe oublié
#     path('forgot-password/', views.ForgotPasswordView.as_view(), name='forgot-password'),
#     path('reset-password/', views.ResetPasswordView.as_view(), name='reset-password'),
# ]

from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views

urlpatterns = [
    # Authentification JWT standard
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Profil utilisateur
    path('profile/', views.UserProfileView.as_view(), name='user-profile'),
    path('user/', views.UserProfileView.as_view(), name='user-detail'),
    
    # Flow de connexion par lien magique
    path('request-login/', views.RequestLoginView.as_view(), name='request-login'),
    path('setup-password/', views.SetupPasswordView.as_view(), name='setup-password'),
    
    # Connexion directe
    path('direct-login/', views.DirectLoginView.as_view(), name='direct-login'),
    path('quick-login/', views.QuickLoginView.as_view(), name='quick-login'),
    
    # Mot de passe oublié
    path('forgot-password/', views.ForgotPasswordView.as_view(), name='forgot-password'),
    path('reset-password/', views.ResetPasswordView.as_view(), name='reset-password'),
]