

# """
# Django settings for simplon_api project.
# """

# from pathlib import Path
# import os
# from datetime import timedelta

# # Build paths inside the project like this: BASE_DIR / 'subdir'.
# BASE_DIR = Path(__file__).resolve().parent.parent

# # SECURITY WARNING: keep the secret key used in production secret!
# SECRET_KEY = 'django-insecure-votre-cle-secrete-ici'

# # SECURITY WARNING: don't run with debug turned on in production!
# DEBUG = True

# ALLOWED_HOSTS = ['localhost', '127.0.0.1', '0.0.0.0']

# # Application definition
# INSTALLED_APPS = [
#     'django.contrib.admin',
#     'django.contrib.auth',
#     'django.contrib.contenttypes',
#     'django.contrib.sessions',
#     'django.contrib.messages',
#     'django.contrib.staticfiles',
    
#     # Third party apps
#     'rest_framework',
#     'corsheaders',
    
#     # Local apps
#     'projects',
#     'users',
#     'core',
    
# ]

# MIDDLEWARE = [
#     'corsheaders.middleware.CorsMiddleware',
#     'django.middleware.security.SecurityMiddleware',
#     'django.contrib.sessions.middleware.SessionMiddleware',
#     'django.middleware.common.CommonMiddleware',
#     'django.middleware.csrf.CsrfViewMiddleware',
#     'django.contrib.auth.middleware.AuthenticationMiddleware',
#     'django.contrib.messages.middleware.MessageMiddleware',
#     'django.middleware.clickjacking.XFrameOptionsMiddleware',
# ]

# ROOT_URLCONF = 'simplon_api.urls'

# TEMPLATES = [
#     {
#         'BACKEND': 'django.template.backends.django.DjangoTemplates',
#         'DIRS': [],
#         'APP_DIRS': True,
#         'OPTIONS': {
#             'context_processors': [
#                 'django.template.context_processors.debug',
#                 'django.template.context_processors.request',
#                 'django.contrib.auth.context_processors.auth',
#                 'django.contrib.messages.context_processors.messages',
#             ],
#         },
#     },
# ]

# WSGI_APPLICATION = 'simplon_api.wsgi.application'

# # Database

# # Configuration temporaire double base
# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.postgresql',
#         'NAME': 'simplon_db',
#         'USER': 'postgres',
#         'PASSWORD': 'postgres123',
#         'HOST': 'localhost',
#         'PORT': '5432',
#     }
# }
# # DATABASES = {
# #     'default': {
# #         'ENGINE': 'django.db.backends.sqlite3',
# #         'NAME': BASE_DIR / 'db.sqlite3',
# #     }
# # }

# # Password validation
# AUTH_PASSWORD_VALIDATORS = [
#     {
#         'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
#     },
#     {
#         'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
#     },
#     {
#         'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
#     },
#     {
#         'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
#     },
# ]

# # Internationalization
# LANGUAGE_CODE = 'fr-fr'
# # TIME_ZONE = 'Europe/Paris'
# TIME_ZONE = 'UTC'
# USE_I18N = True
# USE_TZ = True

# # Pour forcer le bon fuseau

# USE_L10N = True

# # Static files (CSS, JavaScript, Images)
# STATIC_URL = 'static/'

# # Default primary key field type
# DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# # REST Framework configuration
# REST_FRAMEWORK = {
#     'DEFAULT_AUTHENTICATION_CLASSES': [
#         'rest_framework_simplejwt.authentication.JWTAuthentication',
#         'rest_framework.authentication.SessionAuthentication',
#     ],
#     'DEFAULT_PERMISSION_CLASSES': [
#         'rest_framework.permissions.IsAuthenticated',
#     ],
# }

# # JWT Configuration
# SIMPLE_JWT = {
#     'ACCESS_TOKEN_LIFETIME': timedelta(days=1),
#     'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
#     'ROTATE_REFRESH_TOKENS': True,
#     'BLACKLIST_AFTER_ROTATION': True,
# }

# # CORS configuration
# CORS_ALLOWED_ORIGINS = [
#     # "http://localhost:5173",
#     # "http://127.0.0.1:5173",
#     "http://localhost:3000",
#     "http://127.0.0.1:3000",
#     # "http://localhost:3001",
#     # "http://127.0.0.1:3001",
# ]

# CORS_ALLOW_ALL_ORIGINS = True
# CORS_ALLOW_CREDENTIALS = True

# # Media files
# MEDIA_URL = '/media/'
# MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# # Configuration Email GMAIL CORRECTE
# EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
# EMAIL_HOST = 'smtp.gmail.com'
# EMAIL_PORT = 587
# EMAIL_USE_TLS = True

# # ⚠️ REMPLACEZ PAR LE MÊME EMAIL PARTout ⚠️
# EMAIL_HOST_USER = 'adouemmanuela05@gmail.com'  # Votre VRAI email
# EMAIL_HOST_PASSWORD = 'xfcahumtlazaofzv'       # Votre mot de passe d'application

# DEFAULT_FROM_EMAIL = 'Simplon Platform <adouemmanuela05@gmail.com>'
# SERVER_EMAIL = 'adouemmanuela05@gmail.com'


# """
# Django settings for simplon_api project.
# """

# from pathlib import Path
# import os
# from datetime import timedelta

# # Build paths inside the project like this: BASE_DIR / 'subdir'.
# BASE_DIR = Path(__file__).resolve().parent.parent

# # SECURITY WARNING: keep the secret key used in production secret!
# SECRET_KEY = 'django-insecure-votre-cle-secrete-ici-changez-pour-la-production'

# # SECURITY WARNING: don't run with debug turned on in production!
# DEBUG = True  # Gardez True pour le développement

# ALLOWED_HOSTS = ['localhost', '127.0.0.1', '0.0.0.0', '192.168.1.*']

# # Application definition
# INSTALLED_APPS = [
#     'django.contrib.admin',
#     'django.contrib.auth',
#     'django.contrib.contenttypes',
#     'django.contrib.sessions',
#     'django.contrib.messages',
#     'django.contrib.staticfiles',
#     'django_filters',
    
#     # Third party apps
#     'rest_framework',
#     'corsheaders',
#     'rest_framework_simplejwt',
#      'django_filters',  # <-- AJOUTEZ CETTE LIGNE
    
#     # Local apps
#     'projects',
#     'users',
#     'core',
# ]

# MIDDLEWARE = [
#     'corsheaders.middleware.CorsMiddleware',  # DOIT ÊTRE EN PREMIER
#     'django.middleware.security.SecurityMiddleware',
#     'django.contrib.sessions.middleware.SessionMiddleware',
#     'django.middleware.common.CommonMiddleware',
#     'django.middleware.csrf.CsrfViewMiddleware',
#     'django.contrib.auth.middleware.AuthenticationMiddleware',
#     'django.contrib.messages.middleware.MessageMiddleware',
#     'django.middleware.clickjacking.XFrameOptionsMiddleware',
# ]

# ROOT_URLCONF = 'simplon_api.urls'

# TEMPLATES = [
#     {
#         'BACKEND': 'django.template.backends.django.DjangoTemplates',
#         'DIRS': [],
#         'APP_DIRS': True,
#         'OPTIONS': {
#             'context_processors': [
#                 'django.template.context_processors.debug',
#                 'django.template.context_processors.request',
#                 'django.contrib.auth.context_processors.auth',
#                 'django.contrib.messages.context_processors.messages',
#             ],
#         },
#     },
# ]

# WSGI_APPLICATION = 'simplon_api.wsgi.application'

# # Database
# # Configuration PostgreSQL
# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.postgresql',
#         'NAME': 'simplon_db',
#         'USER': 'postgres',
#         'PASSWORD': 'postgres123',
#         'HOST': 'localhost',
#         'PORT': '5432',
#     }
# }

# # Backup SQLite pour tests (décommentez si PostgreSQL pose problème)
# # DATABASES = {
# #     'default': {
# #         'ENGINE': 'django.db.backends.sqlite3',
# #         'NAME': BASE_DIR / 'db.sqlite3',
# #     }
# # }

# # Password validation
# AUTH_PASSWORD_VALIDATORS = [
#     {
#         'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
#     },
#     {
#         'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
#     },
#     {
#         'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
#     },
#     {
#         'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
#     },
# ]

# # Internationalization
# LANGUAGE_CODE = 'fr-fr'
# TIME_ZONE = 'UTC'
# USE_I18N = True
# USE_TZ = True
# USE_L10N = True

# # Static files (CSS, JavaScript, Images)
# STATIC_URL = 'static/'
# STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# # Media files
# MEDIA_URL = '/media/'
# MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# # Default primary key field type
# DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# # ==================== REST FRAMEWORK CONFIGURATION ====================

# REST_FRAMEWORK = {
#     # Authentification - MULTIPLES OPTIONS POUR LE DÉVELOPPEMENT
#     'DEFAULT_AUTHENTICATION_CLASSES': [
#         'rest_framework_simplejwt.authentication.JWTAuthentication',
#         'rest_framework.authentication.SessionAuthentication',
#         'rest_framework.authentication.BasicAuthentication',  # Pour tests simples
#     ],
    
#     # Permissions - TEMPORAIREMENT AllowAny pour faciliter le développement
#     'DEFAULT_PERMISSION_CLASSES': [
#         'rest_framework.permissions.AllowAny',  # À CHANGER EN IsAuthenticated plus tard
#     ],
    
#     # Pagination
#     'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
#     'PAGE_SIZE': 20,
    
#     # Rendering
#     'DEFAULT_RENDERER_CLASSES': [
#         'rest_framework.renderers.JSONRenderer',
#         'rest_framework.renderers.BrowsableAPIRenderer',
#     ],
    
#     # Throttling (limitation de requêtes)
#     'DEFAULT_THROTTLE_CLASSES': [
#         'rest_framework.throttling.AnonRateThrottle',
#         'rest_framework.throttling.UserRateThrottle'
#     ],
#     'DEFAULT_THROTTLE_RATES': {
#         'anon': '100/day',
#         'user': '1000/day'
#     },
# }

# # ==================== JWT CONFIGURATION ====================

# SIMPLE_JWT = {
#     'ACCESS_TOKEN_LIFETIME': timedelta(days=1),
#     'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
#     'ROTATE_REFRESH_TOKENS': False,
#     'BLACKLIST_AFTER_ROTATION': False,
#     'UPDATE_LAST_LOGIN': False,
    
#     'ALGORITHM': 'HS256',
#     'SIGNING_KEY': SECRET_KEY,
#     'VERIFYING_KEY': None,
#     'AUDIENCE': None,
#     'ISSUER': None,
#     'JWK_URL': None,
#     'LEEWAY': 0,
    
#     'AUTH_HEADER_TYPES': ('Bearer',),
#     'AUTH_HEADER_NAME': 'HTTP_AUTHORIZATION',
#     'USER_ID_FIELD': 'id',
#     'USER_ID_CLAIM': 'user_id',
#     'USER_AUTHENTICATION_RULE': 'rest_framework_simplejwt.authentication.default_user_authentication_rule',
    
#     'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
#     'TOKEN_TYPE_CLAIM': 'token_type',
#     'TOKEN_USER_CLASS': 'rest_framework_simplejwt.models.TokenUser',
    
#     'JTI_CLAIM': 'jti',
    
#     'SLIDING_TOKEN_REFRESH_EXP_CLAIM': 'refresh_exp',
#     'SLIDING_TOKEN_LIFETIME': timedelta(minutes=5),
#     'SLIDING_TOKEN_REFRESH_LIFETIME': timedelta(days=1),
# }

# # ==================== CORS CONFIGURATION ====================

# # Pour développement, autoriser toutes les origines
# CORS_ALLOW_ALL_ORIGINS = True
# CORS_ALLOW_CREDENTIALS = True

# # Si vous préférez spécifier les origines
# CORS_ALLOWED_ORIGINS = [
#     "http://localhost:5173",
#     "http://127.0.0.1:5173",
#     "http://localhost:3000",
#     "http://127.0.0.1:3000",
#     "http://localhost:8080",
#     "http://127.0.0.1:8080",
# ]

# # Headers autorisés
# CORS_ALLOW_HEADERS = [
#     'accept',
#     'accept-encoding',
#     'authorization',
#     'content-type',
#     'dnt',
#     'origin',
#     'user-agent',
#     'x-csrftoken',
#     'x-requested-with',
#     'access-control-allow-credentials',
# ]

# # Méthodes HTTP autorisées
# CORS_ALLOW_METHODS = [
#     'DELETE',
#     'GET',
#     'OPTIONS',
#     'PATCH',
#     'POST',
#     'PUT',
# ]

# # ==================== AUTHENTICATION BACKENDS ====================

# AUTHENTICATION_BACKENDS = [
#     'django.contrib.auth.backends.ModelBackend',
# ]

# # ==================== LOGGING CONFIGURATION ====================

# LOGGING = {
#     'version': 1,
#     'disable_existing_loggers': False,
#     'formatters': {
#         'verbose': {
#             'format': '{levelname} {asctime} {module} {message}',
#             'style': '{',
#         },
#         'simple': {
#             'format': '{levelname} {message}',
#             'style': '{',
#         },
#     },
#     'handlers': {
#         'console': {
#             'level': 'DEBUG',
#             'class': 'logging.StreamHandler',
#             'formatter': 'simple',
#         },
#         'file': {
#             'level': 'INFO',
#             'class': 'logging.FileHandler',
#             'filename': os.path.join(BASE_DIR, 'debug.log'),
#             'formatter': 'verbose',
#         },
#     },
#     'loggers': {
#         'django': {
#             'handlers': ['console', 'file'],
#             'level': 'INFO',
#             'propagate': True,
#         },
#         'django.request': {
#             'handlers': ['console', 'file'],
#             'level': 'DEBUG',
#             'propagate': False,
#         },
#         'django.contrib.auth': {
#             'handlers': ['console', 'file'],
#             'level': 'DEBUG',  # IMPORTANT: Pour voir les logs d'authentification
#             'propagate': False,
#         },
#         'projects': {
#             'handlers': ['console', 'file'],
#             'level': 'DEBUG',
#             'propagate': False,
#         },
#     },
# }

# # ==================== EMAIL CONFIGURATION ====================

# EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'  # Pour développement
# EMAIL_HOST = 'smtp.gmail.com'
# EMAIL_PORT = 587
# EMAIL_USE_TLS = True

# # ⚠️ REMPLACEZ PAR VOS VRAIES CREDENTIALS ⚠️
# EMAIL_HOST_USER = 'adouemmanuela05@gmail.com'
# EMAIL_HOST_PASSWORD = 'xfcahumtlazaofzv'

# DEFAULT_FROM_EMAIL = 'Simplon Platform <adouemmanuela05@gmail.com>'
# SERVER_EMAIL = 'adouemmanuela05@gmail.com'

# # ==================== SECURITY CONFIGURATION ====================

# # Pour développement seulement
# if DEBUG:
#     # Désactiver certaines sécurités pour faciliter le développement
#     SECURE_SSL_REDIRECT = False
#     SESSION_COOKIE_SECURE = False
#     CSRF_COOKIE_SECURE = False
#     SECURE_BROWSER_XSS_FILTER = False
#     SECURE_CONTENT_TYPE_NOSNIFF = False
    
#     # CSRF settings pour développement avec React
#     CSRF_TRUSTED_ORIGINS = [
#         'http://localhost:3000',
#         'http://127.0.0.1:3000',
#         'http://localhost:5173',
#         'http://127.0.0.1:5173',
#     ]
    
#     # CORS settings étendus
#     CORS_EXPOSE_HEADERS = ['Content-Type', 'X-CSRFToken']
#     CORS_ALLOW_CREDENTIALS = True

# # ==================== APP-SPECIFIC SETTINGS ====================

# # Nombre d'éléments par page dans l'API
# API_PAGE_SIZE = 20

# # Statuts de projet autorisés
# PROJECT_STATUS_CHOICES = [
#     ('draft', 'Brouillon'),
#     ('published', 'Publié'),
#     ('archived', 'Archivé'),
# ]

# # Taille maximale des fichiers uploadés (50MB)
# MAX_UPLOAD_SIZE = 50 * 1024 * 1024  # 50MB

# # Extensions de fichier autorisées
# ALLOWED_FILE_EXTENSIONS = ['.zip', '.rar', '.7z', '.jpg', '.png', '.pdf']

# # ==================== DEVELOPMENT SETTINGS ====================

# if DEBUG:
#     # Permettre le débogage des templates
#     TEMPLATES[0]['OPTIONS']['debug'] = True
    
#     # Ajouter l'app django-extensions si disponible
#     try:
#         import django_extensions
#         INSTALLED_APPS.append('django_extensions')
#     except ImportError:
#         pass
    
#     # Console email backend pour développement
#     EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
    
#     # Logging plus détaillé
#     LOGGING['loggers']['django']['level'] = 'DEBUG'
#     LOGGING['loggers']['django.contrib.auth']['level'] = 'DEBUG'
#     LOGGING['loggers']['projects']['level'] = 'DEBUG'
    
#     # Configuration spécifique pour le développement
#     print("=" * 60)
#     print("  MODE DÉVELOPPEMENT ACTIVÉ")
#     print(" Permissions: AllowAny (accès sans authentification)")
#     print(" Authentification: JWT + Session + Basic")
#     print(" CORS: Toutes les origines autorisées")
#     print(" Logging: Mode DEBUG activé")
#     print("=" * 60)

# # ==================== CONFIGURATION DE PRODUCTION ====================

# # À utiliser quand DEBUG = False
# if not DEBUG:
#     # Sécurité
#     SECURE_SSL_REDIRECT = True
#     SESSION_COOKIE_SECURE = True
#     CSRF_COOKIE_SECURE = True
    
#     # REST Framework permissions de production
#     REST_FRAMEWORK['DEFAULT_PERMISSION_CLASSES'] = [
#         'rest_framework.permissions.IsAuthenticatedOrReadOnly',
#     ]
    
#     # CORS restrictions
#     CORS_ALLOW_ALL_ORIGINS = False
#     CORS_ALLOWED_ORIGINS = [
#         "https://votre-domaine.com",
#     ]
    
#     print("=" * 50)
#     print("  MODE PRODUCTION ACTIVÉ")
#     print(" Permissions: IsAuthenticatedOrReadOnly")
#     print(" CORS: Origines restreintes")
#     print("=" * 50)

# # ==================== UTILITY FUNCTIONS ====================

# def check_initial_setup():
#     """Vérifie la configuration initiale et créé un utilisateur de test si nécessaire"""
#     try:
#         from django.contrib.auth.models import User
        
#         # Vérifier si un utilisateur de test existe
#         if not User.objects.filter(username='testuser').exists():
#             User.objects.create_user(
#                 username='testuser',
#                 email='test@example.com',
#                 password='test123',
#                 first_name='Test',
#                 last_name='User'
#             )
#             print(" Utilisateur de test créé: testuser / test123")
        
#         # Vérifier si un superuser existe
#         if not User.objects.filter(is_superuser=True).exists():
#             print("  Aucun superuser trouvé. Créez-en un avec:")
#             print("   python manage.py createsuperuser")
            
#     except Exception as e:
#         print(f"  Erreur lors de la vérification: {e}")

# # Exécuter la vérification au chargement (uniquement en DEBUG)
# if DEBUG and __name__ != '__main__':
#     import django
#     if os.environ.get('RUN_MAIN') or not hasattr(django, 'apps'):
#         check_initial_setup()



# """
# Django settings for simplon_api project.
# """

# from pathlib import Path
# import os
# from datetime import timedelta

# # Build paths inside the project like this: BASE_DIR / 'subdir'.
# BASE_DIR = Path(__file__).resolve().parent.parent

# # SECURITY WARNING: keep the secret key used in production secret!
# SECRET_KEY = 'django-insecure-votre-cle-secrete-ici-changez-pour-la-production'

# # SECURITY WARNING: don't run with debug turned on in production!
# DEBUG = True  # Gardez True pour le développement

# ALLOWED_HOSTS = ['localhost', '127.0.0.1', '0.0.0.0', '192.168.1.*']

# # Application definition
# INSTALLED_APPS = [
#     'django.contrib.admin',
#     'django.contrib.auth',
#     'django.contrib.contenttypes',
#     'django.contrib.sessions',
#     'django.contrib.messages',
#     'django.contrib.staticfiles',
#     'django_filters',
    
#     # Third party apps
#     'rest_framework',
#     'corsheaders',
#     'rest_framework_simplejwt',
    
#     # Local apps
#     'projects',
#     'users',
#     'core',
# ]

# MIDDLEWARE = [
#     'corsheaders.middleware.CorsMiddleware',  # DOIT ÊTRE EN PREMIER
#     'django.middleware.security.SecurityMiddleware',
#     'django.contrib.sessions.middleware.SessionMiddleware',
#     'django.middleware.common.CommonMiddleware',
#     'django.middleware.csrf.CsrfViewMiddleware',
#     'django.contrib.auth.middleware.AuthenticationMiddleware',
#     'django.contrib.messages.middleware.MessageMiddleware',
#     'django.middleware.clickjacking.XFrameOptionsMiddleware',
# ]

# ROOT_URLCONF = 'simplon_api.urls'

# TEMPLATES = [
#     {
#         'BACKEND': 'django.template.backends.django.DjangoTemplates',
#         'DIRS': [],
#         'APP_DIRS': True,
#         'OPTIONS': {
#             'context_processors': [
#                 'django.template.context_processors.debug',
#                 'django.template.context_processors.request',
#                 'django.contrib.auth.context_processors.auth',
#                 'django.contrib.messages.context_processors.messages',
#             ],
#         },
#     },
# ]

# WSGI_APPLICATION = 'simplon_api.wsgi.application'

# # Database
# # Configuration PostgreSQL
# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.postgresql',
#         'NAME': 'simplon_db',
#         'USER': 'postgres',
#         'PASSWORD': 'postgres123',
#         'HOST': 'localhost',
#         'PORT': '5432',
#     }
# }

# # Backup SQLite pour tests (décommentez si PostgreSQL pose problème)
# # DATABASES = {
# #     'default': {
# #         'ENGINE': 'django.db.backends.sqlite3',
# #         'NAME': BASE_DIR / 'db.sqlite3',
# #     }
# # }

# # Password validation
# AUTH_PASSWORD_VALIDATORS = [
#     {
#         'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
#     },
#     {
#         'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
#     },
#     {
#         'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
#     },
#     {
#         'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
#     },
# ]

# # Internationalization
# LANGUAGE_CODE = 'fr-fr'
# TIME_ZONE = 'UTC'
# USE_I18N = True
# USE_TZ = True
# USE_L10N = True

# # Static files (CSS, JavaScript, Images)
# STATIC_URL = 'static/'
# STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# # Media files
# MEDIA_URL = '/media/'
# MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# # Default primary key field type
# DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# # ==================== REST FRAMEWORK CONFIGURATION ====================

# REST_FRAMEWORK = {
#     # Authentification - MULTIPLES OPTIONS POUR LE DÉVELOPPEMENT
#     'DEFAULT_AUTHENTICATION_CLASSES': [
#         'rest_framework_simplejwt.authentication.JWTAuthentication',
#         'rest_framework.authentication.SessionAuthentication',
#         'rest_framework.authentication.BasicAuthentication',  # Pour tests simples
#     ],
    
#     # Permissions - TEMPORAIREMENT AllowAny pour faciliter le développement
#     'DEFAULT_PERMISSION_CLASSES': [
#         'rest_framework.permissions.AllowAny',  # À CHANGER EN IsAuthenticated plus tard
#     ],
    
#     # Pagination
#     'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
#     'PAGE_SIZE': 20,
    
#     # Rendering
#     'DEFAULT_RENDERER_CLASSES': [
#         'rest_framework.renderers.JSONRenderer',
#         'rest_framework.renderers.BrowsableAPIRenderer',
#     ],
    
#     # Filtres
#     'DEFAULT_FILTER_BACKENDS': [
#         'django_filters.rest_framework.DjangoFilterBackend',
#         'rest_framework.filters.SearchFilter',
#         'rest_framework.filters.OrderingFilter',
#     ],
    
#     # Throttling (limitation de requêtes)
#     'DEFAULT_THROTTLE_CLASSES': [
#         'rest_framework.throttling.AnonRateThrottle',
#         'rest_framework.throttling.UserRateThrottle'
#     ],
#     'DEFAULT_THROTTLE_RATES': {
#         'anon': '100/day',
#         'user': '1000/day'
#     },
# }

# # ==================== JWT CONFIGURATION ====================

# SIMPLE_JWT = {
#     'ACCESS_TOKEN_LIFETIME': timedelta(days=1),
#     'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
#     'ROTATE_REFRESH_TOKENS': False,
#     'BLACKLIST_AFTER_ROTATION': False,
#     'UPDATE_LAST_LOGIN': False,
    
#     'ALGORITHM': 'HS256',
#     'SIGNING_KEY': SECRET_KEY,
#     'VERIFYING_KEY': None,
#     'AUDIENCE': None,
#     'ISSUER': None,
#     'JWK_URL': None,
#     'LEEWAY': 0,
    
#     'AUTH_HEADER_TYPES': ('Bearer',),
#     'AUTH_HEADER_NAME': 'HTTP_AUTHORIZATION',
#     'USER_ID_FIELD': 'id',
#     'USER_ID_CLAIM': 'user_id',
#     'USER_AUTHENTICATION_RULE': 'rest_framework_simplejwt.authentication.default_user_authentication_rule',
    
#     'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
#     'TOKEN_TYPE_CLAIM': 'token_type',
#     'TOKEN_USER_CLASS': 'rest_framework_simplejwt.models.TokenUser',
    
#     'JTI_CLAIM': 'jti',
    
#     'SLIDING_TOKEN_REFRESH_EXP_CLAIM': 'refresh_exp',
#     'SLIDING_TOKEN_LIFETIME': timedelta(minutes=5),
#     'SLIDING_TOKEN_REFRESH_LIFETIME': timedelta(days=1),
# }

# # ==================== CORS CONFIGURATION ====================

# # Pour développement, autoriser toutes les origines
# CORS_ALLOW_ALL_ORIGINS = True
# CORS_ALLOW_CREDENTIALS = True

# # Si vous préférez spécifier les origines
# CORS_ALLOWED_ORIGINS = [
#     "http://localhost:5173",
#     "http://127.0.0.1:5173",
#     "http://localhost:3000",
#     "http://127.0.0.1:3000",
#     "http://localhost:8080",
#     "http://127.0.0.1:8080",
# ]

# # Headers autorisés
# CORS_ALLOW_HEADERS = [
#     'accept',
#     'accept-encoding',
#     'authorization',
#     'content-type',
#     'dnt',
#     'origin',
#     'user-agent',
#     'x-csrftoken',
#     'x-requested-with',
#     'access-control-allow-credentials',
# ]

# # Méthodes HTTP autorisées
# CORS_ALLOW_METHODS = [
#     'DELETE',
#     'GET',
#     'OPTIONS',
#     'PATCH',
#     'POST',
#     'PUT',
# ]

# # ==================== AUTHENTICATION BACKENDS ====================

# AUTHENTICATION_BACKENDS = [
#     'django.contrib.auth.backends.ModelBackend',
# ]

# # ==================== LOGGING CONFIGURATION ====================

# LOGGING = {
#     'version': 1,
#     'disable_existing_loggers': False,
#     'formatters': {
#         'verbose': {
#             'format': '{levelname} {asctime} {module} {message}',
#             'style': '{',
#         },
#         'simple': {
#             'format': '{levelname} {message}',
#             'style': '{',
#         },
#     },
#     'handlers': {
#         'console': {
#             'level': 'DEBUG',
#             'class': 'logging.StreamHandler',
#             'formatter': 'simple',
#         },
#         'file': {
#             'level': 'INFO',
#             'class': 'logging.FileHandler',
#             'filename': os.path.join(BASE_DIR, 'debug.log'),
#             'formatter': 'verbose',
#         },
#     },
#     'loggers': {
#         'django': {
#             'handlers': ['console', 'file'],
#             'level': 'INFO',
#             'propagate': True,
#         },
#         'django.request': {
#             'handlers': ['console', 'file'],
#             'level': 'DEBUG',
#             'propagate': False,
#         },
#         'django.contrib.auth': {
#             'handlers': ['console', 'file'],
#             'level': 'DEBUG',  # IMPORTANT: Pour voir les logs d'authentification
#             'propagate': False,
#         },
#         'projects': {
#             'handlers': ['console', 'file'],
#             'level': 'DEBUG',
#             'propagate': False,
#         },
#     },
# }

# # ==================== EMAIL CONFIGURATION ====================

# EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'  # Pour développement
# EMAIL_HOST = 'smtp.gmail.com'
# EMAIL_PORT = 587
# EMAIL_USE_TLS = True

# # ⚠️ REMPLACEZ PAR VOS VRAIES CREDENTIALS ⚠️
# EMAIL_HOST_USER = 'adouemmanuela05@gmail.com'
# EMAIL_HOST_PASSWORD = 'xfcahumtlazaofzv'

# DEFAULT_FROM_EMAIL = 'Simplon Platform <adouemmanuela05@gmail.com>'
# SERVER_EMAIL = 'adouemmanuela05@gmail.com'

# # ==================== SECURITY CONFIGURATION ====================

# # Pour développement seulement
# if DEBUG:
#     # Désactiver certaines sécurités pour faciliter le développement
#     SECURE_SSL_REDIRECT = False
#     SESSION_COOKIE_SECURE = False
#     CSRF_COOKIE_SECURE = False
#     SECURE_BROWSER_XSS_FILTER = False
#     SECURE_CONTENT_TYPE_NOSNIFF = False
    
#     # CSRF settings pour développement avec React
#     CSRF_TRUSTED_ORIGINS = [
#         'http://localhost:3000',
#         'http://127.0.0.1:3000',
#         'http://localhost:5173',
#         'http://127.0.0.1:5173',
#     ]
    
#     # CORS settings étendus
#     CORS_EXPOSE_HEADERS = ['Content-Type', 'X-CSRFToken']
#     CORS_ALLOW_CREDENTIALS = True

# # ==================== APP-SPECIFIC SETTINGS ====================

# # Nombre d'éléments par page dans l'API
# API_PAGE_SIZE = 20

# # Statuts de projet autorisés
# PROJECT_STATUS_CHOICES = [
#     ('draft', 'Brouillon'),
#     ('published', 'Publié'),
#     ('archived', 'Archivé'),
# ]

# # Taille maximale des fichiers uploadés (50MB)
# MAX_UPLOAD_SIZE = 50 * 1024 * 1024  # 50MB

# # Extensions de fichier autorisées
# ALLOWED_FILE_EXTENSIONS = ['.zip', '.rar', '.7z', '.jpg', '.png', '.pdf']

# # ==================== DEVELOPMENT SETTINGS ====================

# if DEBUG:
#     # Permettre le débogage des templates
#     TEMPLATES[0]['OPTIONS']['debug'] = True
    
#     # Ajouter l'app django-extensions si disponible
#     try:
#         import django_extensions
#         INSTALLED_APPS.append('django_extensions')
#     except ImportError:
#         pass
    
#     # Console email backend pour développement
#     EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
    
#     # Logging plus détaillé
#     LOGGING['loggers']['django']['level'] = 'DEBUG'
#     LOGGING['loggers']['django.contrib.auth']['level'] = 'DEBUG'
#     LOGGING['loggers']['projects']['level'] = 'DEBUG'
    
#     # Configuration spécifique pour le développement
#     print("=" * 60)
#     print("  MODE DÉVELOPPEMENT ACTIVÉ")
#     print(" Permissions: AllowAny (accès sans authentification)")
#     print(" Authentification: JWT + Session + Basic")
#     print(" CORS: Toutes les origines autorisées")
#     print(" Logging: Mode DEBUG activé")
#     print("=" * 60)

# # ==================== CONFIGURATION DE PRODUCTION ====================

# # À utiliser quand DEBUG = False
# if not DEBUG:
#     # Sécurité
#     SECURE_SSL_REDIRECT = True
#     SESSION_COOKIE_SECURE = True
#     CSRF_COOKIE_SECURE = True
    
#     # REST Framework permissions de production
#     REST_FRAMEWORK['DEFAULT_PERMISSION_CLASSES'] = [
#         'rest_framework.permissions.IsAuthenticatedOrReadOnly',
#     ]
    
#     # CORS restrictions
#     CORS_ALLOW_ALL_ORIGINS = False
#     CORS_ALLOWED_ORIGINS = [
#         "https://votre-domaine.com",
#     ]
    
#     print("=" * 50)
#     print("  MODE PRODUCTION ACTIVÉ")
#     print(" Permissions: IsAuthenticatedOrReadOnly")
#     print(" CORS: Origines restreintes")
#     print("=" * 50)

# # ==================== UTILITY FUNCTIONS ====================

# def check_initial_setup():
#     """Vérifie la configuration initiale et créé un utilisateur de test si nécessaire"""
#     try:
#         from django.contrib.auth.models import User
        
#         # Vérifier si un utilisateur de test existe
#         if not User.objects.filter(username='testuser').exists():
#             User.objects.create_user(
#                 username='testuser',
#                 email='test@example.com',
#                 password='test123',
#                 first_name='Test',
#                 last_name='User'
#             )
#             print(" Utilisateur de test créé: testuser / test123")
        
#         # Vérifier si un superuser existe
#         if not User.objects.filter(is_superuser=True).exists():
#             print("  Aucun superuser trouvé. Créez-en un avec:")
#             print("   python manage.py createsuperuser")
            
#     except Exception as e:
#         print(f"  Erreur lors de la vérification: {e}")

# # Exécuter la vérification au chargement (uniquement en DEBUG)
# if DEBUG and __name__ != '__main__':
#     import django
#     if os.environ.get('RUN_MAIN') or not hasattr(django, 'apps'):
#         check_initial_setup()





# # """
# # Django settings for simplon_api project.
# # """

# # from pathlib import Path
# # import os
# # from datetime import timedelta

# # # Build paths inside the project like this: BASE_DIR / 'subdir'.
# # BASE_DIR = Path(__file__).resolve().parent.parent

# # # SECURITY WARNING: keep the secret key used in production secret!
# # SECRET_KEY = 'django-insecure-votre-cle-secrete-ici-changez-pour-la-production'

# # # SECURITY WARNING: don't run with debug turned on in production!
# # DEBUG = True  # Gardez True pour le développement

# # ALLOWED_HOSTS = ['localhost', '127.0.0.1', '0.0.0.0', '192.168.1.*']

# # # Application definition
# # INSTALLED_APPS = [
# #     'django.contrib.admin',
# #     'django.contrib.auth',
# #     'django.contrib.contenttypes',
# #     'django.contrib.sessions',
# #     'django.contrib.messages',
# #     'django.contrib.staticfiles',
# #     'django_filters',
    
# #     # Third party apps
# #     'rest_framework',
# #     'corsheaders',
# #     'rest_framework_simplejwt',
    
# #     # Local apps
# #     'projects',
# #     'users',
# #     'core',
# # ]

# # MIDDLEWARE = [
# #     'corsheaders.middleware.CorsMiddleware',  # DOIT ÊTRE EN PREMIER
# #     'django.middleware.security.SecurityMiddleware',
# #     'django.contrib.sessions.middleware.SessionMiddleware',
# #     'django.middleware.common.CommonMiddleware',
# #     'django.middleware.csrf.CsrfViewMiddleware',
# #     'django.contrib.auth.middleware.AuthenticationMiddleware',
# #     'django.contrib.messages.middleware.MessageMiddleware',
# #     'django.middleware.clickjacking.XFrameOptionsMiddleware',
# # ]

# # ROOT_URLCONF = 'simplon_api.urls'

# # TEMPLATES = [
# #     {
# #         'BACKEND': 'django.template.backends.django.DjangoTemplates',
# #         'DIRS': [],
# #         'APP_DIRS': True,
# #         'OPTIONS': {
# #             'context_processors': [
# #                 'django.template.context_processors.debug',
# #                 'django.template.context_processors.request',
# #                 'django.contrib.auth.context_processors.auth',
# #                 'django.contrib.messages.context_processors.messages',
# #             ],
# #         },
# #     },
# # ]

# # WSGI_APPLICATION = 'simplon_api.wsgi.application'

# # # Database
# # # Configuration PostgreSQL
# # DATABASES = {
# #     'default': {
# #         'ENGINE': 'django.db.backends.postgresql',
# #         'NAME': 'simplon_db',
# #         'USER': 'postgres',
# #         'PASSWORD': 'postgres123',
# #         'HOST': 'localhost',
# #         'PORT': '5432',
# #     }
# # }

# # # Backup SQLite pour tests (décommentez si PostgreSQL pose problème)
# # # DATABASES = {
# # #     'default': {
# # #         'ENGINE': 'django.db.backends.sqlite3',
# # #         'NAME': BASE_DIR / 'db.sqlite3',
# # #     }
# # # }

# # # Password validation
# # AUTH_PASSWORD_VALIDATORS = [
# #     {
# #         'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
# #     },
# #     {
# #         'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
# #     },
# #     {
# #         'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
# #     },
# #     {
# #         'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
# #     },
# # ]

# # # Internationalization
# # LANGUAGE_CODE = 'fr-fr'
# # TIME_ZONE = 'UTC'
# # USE_I18N = True
# # USE_TZ = True
# # USE_L10N = True

# # # Static files (CSS, JavaScript, Images)
# # STATIC_URL = 'static/'
# # STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# # # ============================================================================
# # # CONFIGURATION MINIO (NOUVEAU - AJOUTÉ APRÈS LES CONFIGS EXISTANTES)
# # # ============================================================================

# # # Configuration MinIO (développement local)
# # MINIO_ENDPOINT = os.environ.get('MINIO_ENDPOINT', 'localhost:9000')
# # MINIO_ACCESS_KEY = os.environ.get('MINIO_ACCESS_KEY', 'minioadmin')
# # MINIO_SECRET_KEY = os.environ.get('MINIO_SECRET_KEY', 'minioadmin')
# # MINIO_BUCKET_NAME = os.environ.get('MINIO_BUCKET_NAME', 'simplon-projects')
# # MINIO_SECURE = os.environ.get('MINIO_SECURE', 'False').lower() == 'true'

# # # Vérifier si django-storages est installé
# # try:
# #     import storages
# #     import boto3
# #     MINIO_AVAILABLE = True
    
# #     # Configuration Django Storage pour MinIO
# #     DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
    
# #     AWS_ACCESS_KEY_ID = MINIO_ACCESS_KEY
# #     AWS_SECRET_ACCESS_KEY = MINIO_SECRET_KEY
# #     AWS_STORAGE_BUCKET_NAME = MINIO_BUCKET_NAME
# #     AWS_S3_ENDPOINT_URL = f"http{'s' if MINIO_SECURE else ''}://{MINIO_ENDPOINT}"
# #     AWS_S3_USE_SSL = MINIO_SECURE
    
# #     # Configuration pour MinIO
# #     AWS_S3_FILE_OVERWRITE = False
# #     AWS_DEFAULT_ACL = 'public-read'
# #     AWS_QUERYSTRING_AUTH = False  # Important: URLs publiques pour le frontend
# #     AWS_S3_CUSTOM_DOMAIN = f"{MINIO_ENDPOINT}/{MINIO_BUCKET_NAME}"
# #     AWS_LOCATION = 'media'
    
# #     # URLs pour les fichiers média
# #     MEDIA_URL = f"{AWS_S3_ENDPOINT_URL}/{MINIO_BUCKET_NAME}/{AWS_LOCATION}/"
    
# #     print(f"✅ MinIO configuré: {AWS_S3_ENDPOINT_URL}")
    
# # except ImportError:
# #     MINIO_AVAILABLE = False
# #     # Garder la configuration existante pour le stockage local
# #     MEDIA_URL = '/media/'
# #     MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
# #     print("⚠️  MinIO non disponible - Utilisation du stockage local")

# # # ============================================================================
# # # CONFIGURATION DES UPLOADS POUR MINIO
# # # ============================================================================

# # # Tailles max des uploads (augmentées pour les ZIP)
# # DATA_UPLOAD_MAX_MEMORY_SIZE = 524288000  # 500MB
# # FILE_UPLOAD_MAX_MEMORY_SIZE = 524288000  # 500MB

# # # Formats autorisés
# # ALLOWED_FILE_EXTENSIONS = [
# #     '.zip', '.rar', '.7z', '.tar.gz', '.tar',  # Archives
# #     '.jpg', '.jpeg', '.png', '.gif', '.webp',  # Images
# #     '.pdf', '.txt', '.md', '.py', '.js', '.html', '.css'  # Documents
# # ]

# # # Configuration CORS pour MinIO
# # CORS_ALLOWED_ORIGINS = [
# #     "http://localhost:5173",
# #     "http://127.0.0.1:5173",
# #     "http://localhost:3000",
# #     "http://127.0.0.1:3000",
# #     "http://localhost:8080",
# #     "http://127.0.0.1:8080",
# #     f"http{'s' if MINIO_SECURE else ''}://{MINIO_ENDPOINT}",  # MinIO CORS
# # ]

# # # Default primary key field type
# # DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# # # ==================== REST FRAMEWORK CONFIGURATION ====================

# # REST_FRAMEWORK = {
# #     # Authentification - MULTIPLES OPTIONS POUR LE DÉVELOPPEMENT
# #     'DEFAULT_AUTHENTICATION_CLASSES': [
# #         'rest_framework_simplejwt.authentication.JWTAuthentication',
# #         'rest_framework.authentication.SessionAuthentication',
# #         'rest_framework.authentication.BasicAuthentication',  # Pour tests simples
# #     ],
    
# #     # Permissions - TEMPORAIREMENT AllowAny pour faciliter le développement
# #     'DEFAULT_PERMISSION_CLASSES': [
# #         'rest_framework.permissions.AllowAny',  # À CHANGER EN IsAuthenticated plus tard
# #     ],
    
# #     # Pagination
# #     'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
# #     'PAGE_SIZE': 20,
    
# #     # Rendering
# #     'DEFAULT_RENDERER_CLASSES': [
# #         'rest_framework.renderers.JSONRenderer',
# #         'rest_framework.renderers.BrowsableAPIRenderer',
# #     ],
    
# #     # Filtres
# #     'DEFAULT_FILTER_BACKENDS': [
# #         'django_filters.rest_framework.DjangoFilterBackend',
# #         'rest_framework.filters.SearchFilter',
# #         'rest_framework.filters.OrderingFilter',
# #     ],
    
# #     # Throttling (limitation de requêtes)
# #     'DEFAULT_THROTTLE_CLASSES': [
# #         'rest_framework.throttling.AnonRateThrottle',
# #         'rest_framework.throttling.UserRateThrottle'
# #     ],
# #     'DEFAULT_THROTTLE_RATES': {
# #         'anon': '100/day',
# #         'user': '1000/day'
# #     },
# # }

# # # ==================== JWT CONFIGURATION ====================

# # SIMPLE_JWT = {
# #     'ACCESS_TOKEN_LIFETIME': timedelta(days=1),
# #     'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
# #     'ROTATE_REFRESH_TOKENS': False,
# #     'BLACKLIST_AFTER_ROTATION': False,
# #     'UPDATE_LAST_LOGIN': False,
    
# #     'ALGORITHM': 'HS256',
# #     'SIGNING_KEY': SECRET_KEY,
# #     'VERIFYING_KEY': None,
# #     'AUDIENCE': None,
# #     'ISSUER': None,
# #     'JWK_URL': None,
# #     'LEEWAY': 0,
    
# #     'AUTH_HEADER_TYPES': ('Bearer',),
# #     'AUTH_HEADER_NAME': 'HTTP_AUTHORIZATION',
# #     'USER_ID_FIELD': 'id',
# #     'USER_ID_CLAIM': 'user_id',
# #     'USER_AUTHENTICATION_RULE': 'rest_framework_simplejwt.authentication.default_user_authentication_rule',
    
# #     'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
# #     'TOKEN_TYPE_CLAIM': 'token_type',
# #     'TOKEN_USER_CLASS': 'rest_framework_simplejwt.models.TokenUser',
    
# #     'JTI_CLAIM': 'jti',
    
# #     'SLIDING_TOKEN_REFRESH_EXP_CLAIM': 'refresh_exp',
# #     'SLIDING_TOKEN_LIFETIME': timedelta(minutes=5),
# #     'SLIDING_TOKEN_REFRESH_LIFETIME': timedelta(days=1),
# # }

# # # ==================== CORS CONFIGURATION ====================

# # # Pour développement, autoriser toutes les origines
# # CORS_ALLOW_ALL_ORIGINS = True
# # CORS_ALLOW_CREDENTIALS = True

# # # Headers autorisés
# # CORS_ALLOW_HEADERS = [
# #     'accept',
# #     'accept-encoding',
# #     'authorization',
# #     'content-type',
# #     'dnt',
# #     'origin',
# #     'user-agent',
# #     'x-csrftoken',
# #     'x-requested-with',
# #     'access-control-allow-credentials',
# # ]

# # # Méthodes HTTP autorisées
# # CORS_ALLOW_METHODS = [
# #     'DELETE',
# #     'GET',
# #     'OPTIONS',
# #     'PATCH',
# #     'POST',
# #     'PUT',
# # ]

# # # ==================== AUTHENTICATION BACKENDS ====================

# # AUTHENTICATION_BACKENDS = [
# #     'django.contrib.auth.backends.ModelBackend',
# # ]

# # # ==================== LOGGING CONFIGURATION ====================

# # LOGGING = {
# #     'version': 1,
# #     'disable_existing_loggers': False,
# #     'formatters': {
# #         'verbose': {
# #             'format': '{levelname} {asctime} {module} {message}',
# #             'style': '{',
# #         },
# #         'simple': {
# #             'format': '{levelname} {message}',
# #             'style': '{',
# #         },
# #     },
# #     'handlers': {
# #         'console': {
# #             'level': 'DEBUG',
# #             'class': 'logging.StreamHandler',
# #             'formatter': 'simple',
# #         },
# #         'file': {
# #             'level': 'INFO',
# #             'class': 'logging.FileHandler',
# #             'filename': os.path.join(BASE_DIR, 'debug.log'),
# #             'formatter': 'verbose',
# #         },
# #     },
# #     'loggers': {
# #         'django': {
# #             'handlers': ['console', 'file'],
# #             'level': 'INFO',
# #             'propagate': True,
# #         },
# #         'django.request': {
# #             'handlers': ['console', 'file'],
# #             'level': 'DEBUG',
# #             'propagate': False,
# #         },
# #         'django.contrib.auth': {
# #             'handlers': ['console', 'file'],
# #             'level': 'DEBUG',  # IMPORTANT: Pour voir les logs d'authentification
# #             'propagate': False,
# #         },
# #         'projects': {
# #             'handlers': ['console', 'file'],
# #             'level': 'DEBUG',
# #             'propagate': False,
# #         },
# #         'minio': {
# #             'handlers': ['console', 'file'],
# #             'level': 'DEBUG',
# #             'propagate': False,
# #         },
# #     },
# # }

# # # ==================== EMAIL CONFIGURATION ====================

# # EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'  # Pour développement
# # EMAIL_HOST = 'smtp.gmail.com'
# # EMAIL_PORT = 587
# # EMAIL_USE_TLS = True

# # # ⚠️ REMPLACEZ PAR VOS VRAIES CREDENTIALS ⚠️
# # EMAIL_HOST_USER = 'adouemmanuela05@gmail.com'
# # EMAIL_HOST_PASSWORD = 'xfcahumtlazaofzv'

# # DEFAULT_FROM_EMAIL = 'Simplon Platform <adouemmanuela05@gmail.com>'
# # SERVER_EMAIL = 'adouemmanuela05@gmail.com'

# # # ==================== SECURITY CONFIGURATION ====================

# # # Pour développement seulement
# # if DEBUG:
# #     # Désactiver certaines sécurités pour faciliter le développement
# #     SECURE_SSL_REDIRECT = False
# #     SESSION_COOKIE_SECURE = False
# #     CSRF_COOKIE_SECURE = False
# #     SECURE_BROWSER_XSS_FILTER = False
# #     SECURE_CONTENT_TYPE_NOSNIFF = False
    
# #     # CSRF settings pour développement avec React
# #     CSRF_TRUSTED_ORIGINS = [
# #         'http://localhost:3000',
# #         'http://127.0.0.1:3000',
# #         'http://localhost:5173',
# #         'http://127.0.0.1:5173',
# #     ]
    
# #     # CORS settings étendus
# #     CORS_EXPOSE_HEADERS = ['Content-Type', 'X-CSRFToken']
# #     CORS_ALLOW_CREDENTIALS = True

# # # ==================== APP-SPECIFIC SETTINGS ====================

# # # Nombre d'éléments par page dans l'API
# # API_PAGE_SIZE = 20

# # # Taille maximale des fichiers uploadés (500MB pour MinIO)
# # MAX_UPLOAD_SIZE = 500 * 1024 * 1024  # 500MB

# # # ==================== DEVELOPMENT SETTINGS ====================

# # if DEBUG:
# #     # Permettre le débogage des templates
# #     TEMPLATES[0]['OPTIONS']['debug'] = True
    
# #     # Ajouter l'app django-extensions si disponible
# #     try:
# #         import django_extensions
# #         INSTALLED_APPS.append('django_extensions')
# #     except ImportError:
# #         pass
    
# #     # Console email backend pour développement
# #     EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
    
# #     # Logging plus détaillé
# #     LOGGING['loggers']['django']['level'] = 'DEBUG'
# #     LOGGING['loggers']['django.contrib.auth']['level'] = 'DEBUG'
# #     LOGGING['loggers']['projects']['level'] = 'DEBUG'
    
# #     # Configuration spécifique pour le développement
# #     print("=" * 60)
# #     print("  MODE DÉVELOPPEMENT ACTIVÉ")
# #     print(f"  MinIO: {'✅ DISPONIBLE' if MINIO_AVAILABLE else '❌ NON DISPONIBLE'}")
# #     if MINIO_AVAILABLE:
# #         print(f"  Bucket: {MINIO_BUCKET_NAME}")
# #         print(f"  Endpoint: {MINIO_ENDPOINT}")
# #     print("  Permissions: AllowAny (accès sans authentification)")
# #     print("  Authentification: JWT + Session + Basic")
# #     print("  CORS: Toutes les origines autorisées")
# #     print("  Logging: Mode DEBUG activé")
# #     print("=" * 60)

# # # ==================== CONFIGURATION DE PRODUCTION ====================

# # # À utiliser quand DEBUG = False
# # if not DEBUG:
# #     # Sécurité
# #     SECURE_SSL_REDIRECT = True
# #     SESSION_COOKIE_SECURE = True
# #     CSRF_COOKIE_SECURE = True
    
# #     # REST Framework permissions de production
# #     REST_FRAMEWORK['DEFAULT_PERMISSION_CLASSES'] = [
# #         'rest_framework.permissions.IsAuthenticatedOrReadOnly',
# #     ]
    
# #     # CORS restrictions
# #     CORS_ALLOW_ALL_ORIGINS = False
# #     CORS_ALLOWED_ORIGINS = [
# #         "https://votre-domaine.com",
# #     ]
    
# #     print("=" * 50)
# #     print("  MODE PRODUCTION ACTIVÉ")
# #     print("  Permissions: IsAuthenticatedOrReadOnly")
# #     print("  CORS: Origines restreintes")
# #     print("=" * 50)

# # # ==================== UTILITY FUNCTIONS ====================

# # def check_initial_setup():
# #     """Vérifie la configuration initiale et créé un utilisateur de test si nécessaire"""
# #     try:
# #         from django.contrib.auth.models import User
        
# #         # Vérifier si un utilisateur de test existe
# #         if not User.objects.filter(username='testuser').exists():
# #             User.objects.create_user(
# #                 username='testuser',
# #                 email='test@example.com',
# #                 password='test123',
# #                 first_name='Test',
# #                 last_name='User'
# #             )
# #             print("  Utilisateur de test créé: testuser / test123")
        
# #         # Vérifier si un superuser existe
# #         if not User.objects.filter(is_superuser=True).exists():
# #             print("  Aucun superuser trouvé. Créez-en un avec:")
# #             print("   python manage.py createsuperuser")
            
# #     except Exception as e:
# #         print(f"  Erreur lors de la vérification: {e}")

# # # Exécuter la vérification au chargement (uniquement en DEBUG)
# # if DEBUG and __name__ != '__main__':
# #     import django
# #     if os.environ.get('RUN_MAIN') or not hasattr(django, 'apps'):
# #         check_initial_setup()



"""
Django settings for simplon_api project.
"""

from pathlib import Path
import os
from datetime import timedelta

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-votre-cle-secrete-ici-changez-pour-la-production'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True  # Gardez True pour le développement

ALLOWED_HOSTS = ['localhost', '127.0.0.1', '0.0.0.0', '192.168.1.*']

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django_filters',
    
    # Third party apps
    'rest_framework',
    'corsheaders',
    'rest_framework_simplejwt',
    
    # Local apps
    'projects',
    'users',
    'core',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # DOIT ÊTRE EN PREMIER
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'simplon_api.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'simplon_api.wsgi.application'

# Database
# Configuration PostgreSQL
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'simplon_db',
        'USER': 'postgres',
        'PASSWORD': 'postgres123',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}

# Backup SQLite pour tests (décommentez si PostgreSQL pose problème)
# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.sqlite3',
#         'NAME': BASE_DIR / 'db.sqlite3',
#     }
# }

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
LANGUAGE_CODE = 'fr-fr'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True
USE_L10N = True

# Static files (CSS, JavaScript, Images)
STATIC_URL = 'static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# ============================================================================
# CONFIGURATION MINIO (NOUVEAU - AJOUTÉ APRÈS LES CONFIGS EXISTANTES)
# ============================================================================

# Configuration MinIO (développement local)
MINIO_ENDPOINT = os.environ.get('MINIO_ENDPOINT', 'localhost:9000')
MINIO_ACCESS_KEY = os.environ.get('MINIO_ACCESS_KEY', 'minioadmin')
MINIO_SECRET_KEY = os.environ.get('MINIO_SECRET_KEY', 'minioadmin')
MINIO_BUCKET_NAME = os.environ.get('MINIO_BUCKET_NAME', 'simplon-projects')
MINIO_SECURE = os.environ.get('MINIO_SECURE', 'False').lower() == 'true'

# Vérifier si django-storages est installé
try:
    import storages
    import boto3
    MINIO_AVAILABLE = True
    
    # Configuration Django Storage pour MinIO
    DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
    
    AWS_ACCESS_KEY_ID = MINIO_ACCESS_KEY
    AWS_SECRET_ACCESS_KEY = MINIO_SECRET_KEY
    AWS_STORAGE_BUCKET_NAME = MINIO_BUCKET_NAME
    AWS_S3_ENDPOINT_URL = f"http{'s' if MINIO_SECURE else ''}://{MINIO_ENDPOINT}"
    AWS_S3_USE_SSL = MINIO_SECURE
    
    # Configuration pour MinIO
    AWS_S3_FILE_OVERWRITE = False
    AWS_DEFAULT_ACL = 'public-read'
    AWS_QUERYSTRING_AUTH = False  # Important: URLs publiques pour le frontend
    AWS_S3_CUSTOM_DOMAIN = f"{MINIO_ENDPOINT}/{MINIO_BUCKET_NAME}"
    AWS_LOCATION = 'media'
    
    # URLs pour les fichiers média
    MEDIA_URL = f"{AWS_S3_ENDPOINT_URL}/{MINIO_BUCKET_NAME}/{AWS_LOCATION}/"
    
    print(f"✅ MinIO configuré: {AWS_S3_ENDPOINT_URL}")
    
except ImportError:
    MINIO_AVAILABLE = False
    # Garder la configuration existante pour le stockage local
    MEDIA_URL = '/media/'
    MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
    print("⚠️  MinIO non disponible - Utilisation du stockage local")

# ============================================================================
# CONFIGURATION DES UPLOADS POUR MINIO
# ============================================================================

# Tailles max des uploads (augmentées pour les ZIP)
DATA_UPLOAD_MAX_MEMORY_SIZE = 524288000  # 500MB
FILE_UPLOAD_MAX_MEMORY_SIZE = 524288000  # 500MB

# Formats autorisés
ALLOWED_FILE_EXTENSIONS = [
    '.zip', '.rar', '.7z', '.tar.gz', '.tar',  # Archives
    '.jpg', '.jpeg', '.png', '.gif', '.webp',  # Images
    '.pdf', '.txt', '.md', '.py', '.js', '.html', '.css'  # Documents
]

# Configuration CORS pour MinIO
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:8080",
    "http://127.0.0.1:8080",
    f"http{'s' if MINIO_SECURE else ''}://{MINIO_ENDPOINT}",  # MinIO CORS
]

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# ==================== REST FRAMEWORK CONFIGURATION ====================

REST_FRAMEWORK = {
    # Authentification - MULTIPLES OPTIONS POUR LE DÉVELOPPEMENT
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework.authentication.BasicAuthentication',  # Pour tests simples
    ],
    
    # Permissions - TEMPORAIREMENT AllowAny pour faciliter le développement
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',  # À CHANGER EN IsAuthenticated plus tard
    ],
    
    # Pagination
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
    
    # Rendering
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
        'rest_framework.renderers.BrowsableAPIRenderer',
    ],
    
    # Filtres
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ],
    
    # Throttling (limitation de requêtes)
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle'
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '100/day',
        'user': '1000/day'
    },
}

# ==================== JWT CONFIGURATION ====================

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': False,
    'BLACKLIST_AFTER_ROTATION': False,
    'UPDATE_LAST_LOGIN': False,
    
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    'VERIFYING_KEY': None,
    'AUDIENCE': None,
    'ISSUER': None,
    'JWK_URL': None,
    'LEEWAY': 0,
    
    'AUTH_HEADER_TYPES': ('Bearer',),
    'AUTH_HEADER_NAME': 'HTTP_AUTHORIZATION',
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
    'USER_AUTHENTICATION_RULE': 'rest_framework_simplejwt.authentication.default_user_authentication_rule',
    
    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
    'TOKEN_TYPE_CLAIM': 'token_type',
    'TOKEN_USER_CLASS': 'rest_framework_simplejwt.models.TokenUser',
    
    'JTI_CLAIM': 'jti',
    
    'SLIDING_TOKEN_REFRESH_EXP_CLAIM': 'refresh_exp',
    'SLIDING_TOKEN_LIFETIME': timedelta(minutes=5),
    'SLIDING_TOKEN_REFRESH_LIFETIME': timedelta(days=1),
}

# ==================== CORS CONFIGURATION ====================

# Pour développement, autoriser toutes les origines
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True

# Headers autorisés
CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
    'access-control-allow-credentials',
]

# Méthodes HTTP autorisées
CORS_ALLOW_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
]

# ==================== AUTHENTICATION BACKENDS ====================

AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend',
]

# ==================== LOGGING CONFIGURATION ====================

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {message}',
            'style': '{',
        },
        'simple': {
            'format': '{levelname} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
            'formatter': 'simple',
        },
        'file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': os.path.join(BASE_DIR, 'debug.log'),
            'formatter': 'verbose',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['console', 'file'],
            'level': 'INFO',
            'propagate': True,
        },
        'django.request': {
            'handlers': ['console', 'file'],
            'level': 'DEBUG',
            'propagate': False,
        },
        'django.contrib.auth': {
            'handlers': ['console', 'file'],
            'level': 'DEBUG',  # IMPORTANT: Pour voir les logs d'authentification
            'propagate': False,
        },
        'projects': {
            'handlers': ['console', 'file'],
            'level': 'DEBUG',
            'propagate': False,
        },
        'minio': {
            'handlers': ['console', 'file'],
            'level': 'DEBUG',
            'propagate': False,
        },
    },
}

# ==================== EMAIL CONFIGURATION ====================

EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'  # Pour développement
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True

# ⚠️ REMPLACEZ PAR VOS VRAIES CREDENTIALS ⚠️
EMAIL_HOST_USER = 'adouemmanuela05@gmail.com'
EMAIL_HOST_PASSWORD = 'xfcahumtlazaofzv'

DEFAULT_FROM_EMAIL = 'Simplon Platform <adouemmanuela05@gmail.com>'
SERVER_EMAIL = 'adouemmanuela05@gmail.com'

# ==================== SECURITY CONFIGURATION ====================

# Pour développement seulement
if DEBUG:
    # Désactiver certaines sécurités pour faciliter le développement
    SECURE_SSL_REDIRECT = False
    SESSION_COOKIE_SECURE = False
    CSRF_COOKIE_SECURE = False
    SECURE_BROWSER_XSS_FILTER = False
    SECURE_CONTENT_TYPE_NOSNIFF = False
    
    # CSRF settings pour développement avec React
    CSRF_TRUSTED_ORIGINS = [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'http://localhost:5173',
        'http://127.0.0.1:5173',
    ]
    
    # CORS settings étendus
    CORS_EXPOSE_HEADERS = ['Content-Type', 'X-CSRFToken']
    CORS_ALLOW_CREDENTIALS = True

# ==================== APP-SPECIFIC SETTINGS ====================

# Nombre d'éléments par page dans l'API
API_PAGE_SIZE = 20

# Taille maximale des fichiers uploadés (500MB pour MinIO)
MAX_UPLOAD_SIZE = 500 * 1024 * 1024  # 500MB

# ==================== DEVELOPMENT SETTINGS ====================

if DEBUG:
    # Permettre le débogage des templates
    TEMPLATES[0]['OPTIONS']['debug'] = True
    
    # Ajouter l'app django-extensions si disponible
    try:
        import django_extensions
        INSTALLED_APPS.append('django_extensions')
    except ImportError:
        pass
    
    # Console email backend pour développement
    EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
    
    # Logging plus détaillé
    LOGGING['loggers']['django']['level'] = 'DEBUG'
    LOGGING['loggers']['django.contrib.auth']['level'] = 'DEBUG'
    LOGGING['loggers']['projects']['level'] = 'DEBUG'
    
    # Configuration spécifique pour le développement
    print("=" * 60)
    print("  MODE DÉVELOPPEMENT ACTIVÉ")
    print(f"  MinIO: {'✅ DISPONIBLE' if MINIO_AVAILABLE else '❌ NON DISPONIBLE'}")
    if MINIO_AVAILABLE:
        print(f"  Bucket: {MINIO_BUCKET_NAME}")
        print(f"  Endpoint: {MINIO_ENDPOINT}")
    print("  Permissions: AllowAny (accès sans authentification)")
    print("  Authentification: JWT + Session + Basic")
    print("  CORS: Toutes les origines autorisées")
    print("  Logging: Mode DEBUG activé")
    print("=" * 60)

# ==================== CONFIGURATION DE PRODUCTION ====================

# À utiliser quand DEBUG = False
if not DEBUG:
    # Sécurité
    SECURE_SSL_REDIRECT = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    
    # REST Framework permissions de production
    REST_FRAMEWORK['DEFAULT_PERMISSION_CLASSES'] = [
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ]
    
    # CORS restrictions
    CORS_ALLOW_ALL_ORIGINS = False
    CORS_ALLOWED_ORIGINS = [
        "https://votre-domaine.com",
    ]
    
    print("=" * 50)
    print("  MODE PRODUCTION ACTIVÉ")
    print("  Permissions: IsAuthenticatedOrReadOnly")
    print("  CORS: Origines restreintes")
    print("=" * 50)

# ==================== UTILITY FUNCTIONS ====================

def check_initial_setup():
    """Vérifie la configuration initiale et créé un utilisateur de test si nécessaire"""
    try:
        from django.contrib.auth.models import User
        
        # Vérifier si un utilisateur de test existe
        if not User.objects.filter(username='testuser').exists():
            User.objects.create_user(
                username='testuser',
                email='test@example.com',
                password='test123',
                first_name='Test',
                last_name='User'
            )
            print("  Utilisateur de test créé: testuser / test123")
        
        # Vérifier si un superuser existe
        if not User.objects.filter(is_superuser=True).exists():
            print("  Aucun superuser trouvé. Créez-en un avec:")
            print("   python manage.py createsuperuser")
            
    except Exception as e:
        print(f"  Erreur lors de la vérification: {e}")

# Exécuter la vérification au chargement (uniquement en DEBUG)
if DEBUG and __name__ != '__main__':
    import django
    if os.environ.get('RUN_MAIN') or not hasattr(django, 'apps'):
        check_initial_setup()