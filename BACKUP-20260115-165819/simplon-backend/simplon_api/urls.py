
# # simplon_api/urls.py
# from django.contrib import admin
# from django.urls import path, include
# from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

# urlpatterns = [
#     path('admin/', admin.site.urls),
#     path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
#     path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
#     path('api/', include('projects.urls')),
#     path('api/', include('users.urls')),  # Si vous avez une app users
# ]

# # config/urls.py ou simplon/urls.py
# from django.contrib import admin
# from django.urls import path, include
# from django.conf import settings
# from django.conf.urls.static import static

# urlpatterns = [
#     path('admin/', admin.site.urls),
    
#     # API endpoints
#     # path('api/', include('projects.urls')),
#     path('api/', include('projects.urls_simple')),
#     path('api/', include('users.urls')),  # Si vous avez un fichier users/urls.py
    
#     # Documentation API (optionnel)
#     path('api-auth/', include('rest_framework.urls')),
    
#     # Redirection pour la racine
#     path('', lambda request: redirect('/api/status/')),
# ]

# # Servir les fichiers média en développement
# if settings.DEBUG:
#     urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
#     urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# # simplon_api/urls.py - VERSION CORRIGÉE
# from django.contrib import admin
# from django.urls import path, include
# from django.conf import settings
# from django.conf.urls.static import static
# from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView
# from django.views.generic import RedirectView

# urlpatterns = [
#     # Admin
#     path('admin/', admin.site.urls),
    
#     # API endpoints - JWT AUTHENTICATION (ESSENTIEL)
#     path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
#     path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
#     path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    
#     # API endpoints - vos applications
#     path('api/projects/', include('projects.urls_simple')),  # avec préfixe
#     path('api/users/', include('users.urls')),  # avec préfixe
    
#     # Documentation API
#     path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    
#     # Redirection pour la racine
#     path('', RedirectView.as_view(url='/api/status/', permanent=False)),
    
#     # Endpoint de status pour vérifier si l'API fonctionne
#     path('api/status/', include('core.urls_test')),
# ]

# # Servir les fichiers média en développement
# if settings.DEBUG:
#     urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
#     urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    
#     # Swagger UI pour la documentation API (optionnel)
#     try:
#         from rest_framework import permissions
#         from drf_yasg.views import get_schema_view
#         from drf_yasg import openapi
        
#         schema_view = get_schema_view(
#             openapi.Info(
#                 title="Simplon API",
#                 default_version='v1',
#                 description="API documentation",
#                 terms_of_service="https://www.google.com/policies/terms/",
#                 contact=openapi.Contact(email="contact@simplon.local"),
#                 license=openapi.License(name="BSD License"),
#             ),
#             public=True,
#             permission_classes=(permissions.AllowAny,),
#         )
        
#         urlpatterns += [
#             path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
#             path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
#             path('swagger.json', schema_view.without_ui(cache_timeout=0), name='schema-json'),
#         ]
#     except ImportError:
#         pass


# # simplon_api/urls.py - VERSION FINALE
# from django.contrib import admin
# from django.urls import path, include
# from django.conf import settings
# from django.conf.urls.static import static
# from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView
# from django.views.generic import RedirectView

# urlpatterns = [
#     # Admin Django
#     path('admin/', admin.site.urls),
    
#     # API Root
#     path('', RedirectView.as_view(url='/api/status/', permanent=False)),
    
#     # API endpoints
#     path('api/', include([
#         # Authentification JWT
#         path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
#         path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
#         path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
        
#         # Applications
#         path('users/', include('users.urls')),
#         path('projects/', include('projects.urls_simple')),
        
#         # Status et vérifications
#         path('status/', include('core.urls_test')),
        
#         # Authentification DRF (pour browsable API)
#         path('auth/', include('rest_framework.urls', namespace='rest_framework')),
#     ])),
# ]

# # Servir les fichiers média en développement
# if settings.DEBUG:
#     urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
#     urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    
#     # Swagger UI pour la documentation API
#     try:
#         from rest_framework import permissions
#         from drf_yasg.views import get_schema_view
#         from drf_yasg import openapi
        
#         schema_view = get_schema_view(
#             openapi.Info(
#                 title="Simplon API",
#                 default_version='v1',
#                 description="API documentation",
#                 terms_of_service="https://www.google.com/policies/terms/",
#                 contact=openapi.Contact(email="contact@simplon.local"),
#                 license=openapi.License(name="BSD License"),
#             ),
#             public=True,
#             permission_classes=(permissions.AllowAny,),
#         )
        
#         urlpatterns += [
#             path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
#             path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
#             path('swagger.json', schema_view.without_ui(cache_timeout=0), name='schema-json'),
#         ]
#     except ImportError:
#         pass


# simplon_api/urls.py - ASSUREZ-VOUS D'AVOIR CECI
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView

urlpatterns = [
    # Admin Django
    path('admin/', admin.site.urls),
    
    # API endpoints
    path('api/', include([
        # Authentification JWT
        path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
        path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
        path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
        
        # Applications
        path('users/', include('users.urls')),
        path('projects/', include('projects.urls_simple')),  # <-- IMPORTANT: utilisez urls_simple
        
        # Status
        path('status/', include('core.urls_test')),
        
        # API browsable
        path('auth/', include('rest_framework.urls', namespace='rest_framework')),
    ])),
]

# Fichiers média/statiques
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)