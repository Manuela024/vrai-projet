#!/usr/bin/env python
# scripts/setup_minio.py - SCRIPT D'INITIALISATION MINIO
import os
import sys
import django
import time

# Configuration Django
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'simplon_api.settings')
django.setup()

from minio import Minio
from django.conf import settings
import requests

def check_minio_connection():
    """Vérifie si MinIO est accessible"""
    try:
        endpoint = settings.MINIO_ENDPOINT
        secure = settings.MINIO_SECURE
        protocol = 'https' if secure else 'http'
        
        # Tester la connexion HTTP
        health_url = f"{protocol}://{endpoint}/minio/health/live"
        response = requests.get(health_url, timeout=5)
        
        if response.status_code == 200:
            print(f"✅ MinIO accessible à {protocol}://{endpoint}")
            return True
        else:
            print(f"⚠️  MinIO répond avec code {response.status_code}")
            return False
            
    except requests.ConnectionError:
        print(f"❌ Impossible de se connecter à MinIO à {settings.MINIO_ENDPOINT}")
        return False
    except Exception as e:
        print(f"❌ Erreur de connexion: {e}")
        return False

def setup_minio():
    """Initialise MinIO avec le bucket et la configuration"""
    print("=" * 70)
    print("🔄 CONFIGURATION MINIO")
    print("=" * 70)
    
    try:
        # Vérifier les dépendances
        print("📦 Vérification des dépendances...")
        try:
            import storages
            import boto3
            print("✅ django-storages et boto3 installés")
        except ImportError as e:
            print(f"❌ Dépendances manquantes: {e}")
            print("💡 Installez avec: pip install django-storages boto3 minio")
            return False
        
        # Vérifier la connexion
        print("\n🔌 Test de connexion à MinIO...")
        if not check_minio_connection():
            print("\n💡 MinIO n'est pas accessible. Solutions:")
            print("1. Lancez MinIO avec Docker:")
            print("   docker run -p 9000:9000 -p 9001:9001 \\")
            print("     -e MINIO_ROOT_USER=minioadmin \\")
            print("     -e MINIO_ROOT_PASSWORD=minioadmin \\")
            print("     minio/minio server /data --console-address ':9001'")
            print("\n2. OU téléchargez MinIO depuis: https://min.io/download")
            print("\n3. Attendez 30 secondes que MinIO démarre...")
            
            # Attendre un peu
            time.sleep(5)
            
            # Réessayer
            if not check_minio_connection():
                print("❌ Abandon après tentative de reconnexion")
                return False
        
        # Créer le client MinIO
        print("\n🔧 Création du client MinIO...")
        client = Minio(
            endpoint=settings.MINIO_ENDPOINT,
            access_key=settings.MINIO_ACCESS_KEY,
            secret_key=settings.MINIO_SECRET_KEY,
            secure=settings.MINIO_SECURE
        )
        
        bucket_name = settings.MINIO_BUCKET_NAME
        
        # Créer le bucket s'il n'existe pas
        print(f"\n📦 Création du bucket '{bucket_name}'...")
        if not client.bucket_exists(bucket_name):
            client.make_bucket(bucket_name)
            print(f"✅ Bucket '{bucket_name}' créé")
        else:
            print(f"✅ Bucket '{bucket_name}' existe déjà")
        
        # Configurer la politique d'accès publique (pour le développement)
        print("\n🔓 Configuration de la politique d'accès...")
        policy = {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Effect": "Allow",
                    "Principal": {"AWS": ["*"]},
                    "Action": ["s3:GetObject", "s3:GetObjectVersion"],
                    "Resource": [f"arn:aws:s3:::{bucket_name}/*"]
                }
            ]
        }
        
        client.set_bucket_policy(bucket_name, policy)
        print("✅ Politique d'accès publique configurée")
        
        # Créer la structure de dossiers
        print("\n📁 Création de la structure de dossiers...")
        folders = [
            'media/projects/',
            'media/users/',
            'media/temp/',
            'media/logos/'
        ]
        
        for folder in folders:
            try:
                # Créer un objet vide pour simuler un dossier
                client.put_object(bucket_name, folder, bytes(), 0)
                print(f"✅ Dossier créé: {folder}")
            except Exception as e:
                print(f"⚠️  Dossier {folder}: {e}")
        
        # Vérifier que tout fonctionne
        print("\n🧪 Test final de configuration...")
        try:
            # Lister les buckets
            buckets = client.list_buckets()
            print(f"✅ {len(buckets)} bucket(s) disponible(s)")
            
            # Vérifier notre bucket
            our_bucket = any(b.name == bucket_name for b in buckets)
            if our_bucket:
                print(f"✅ Notre bucket '{bucket_name}' est présent")
            
            print("\n" + "=" * 70)
            print("🎉 MINIO CONFIGURÉ AVEC SUCCÈS!")
            print("=" * 70)
            print(f"📦 Bucket: {bucket_name}")
            print(f"🔗 API Endpoint: http{'s' if settings.MINIO_SECURE else ''}://{settings.MINIO_ENDPOINT}")
            print(f"🖥️  Console Web: http{'s' if settings.MINIO_SECURE else ''}://{settings.MINIO_ENDPOINT.replace('9000', '9001')}")
            print(f"👤 Access Key: {settings.MINIO_ACCESS_KEY}")
            print(f"🔐 Secret Key: {'*' * len(settings.MINIO_SECRET_KEY)}")
            print("=" * 70)
            
            print("\n📖 POUR UTILISER MINIO DANS VOTRE PROJET:")
            print("1. Créez un projet avec fichier ZIP:")
            print("   POST http://localhost:8000/api/upload-files/")
            print("\n2. Téléchargez un fichier ZIP:")
            print("   GET http://localhost:8000/api/projects/<id>/download/")
            print("\n3. Vérifiez le statut MinIO:")
            print("   GET http://localhost:8000/api/minio-status/")
            print("=" * 70)
            
            return True
            
        except Exception as e:
            print(f"❌ Erreur lors du test final: {e}")
            return False
        
    except Exception as e:
        print(f"\n❌ ERREUR DE CONFIGURATION MINIO: {str(e)}")
        print("\n💡 CONSEILS DE DÉPANNAGE:")
        print("1. Vérifiez que MinIO est en cours d'exécution")
        print("2. Vérifiez les identifiants dans settings.py")
        print("3. Vérifiez les variables d'environnement")
        print("4. Essayez de vous connecter manuellement:")
        print(f"   curl http://{settings.MINIO_ENDPOINT}/minio/health/live")
        print("=" * 70)
        return False

if __name__ == "__main__":
    # Vérifier si nous sommes dans l'environnement virtuel
    if not hasattr(sys, 'real_prefix') and not (hasattr(sys, 'base_prefix') and sys.base_prefix != sys.prefix):
        print("⚠️  Attention: Vous n'êtes pas dans un environnement virtuel Python")
        print("💡 Activez-le avec: source venv/Scripts/activate (Windows)")
        print("                  ou source venv/bin/activate (Linux/Mac)")
        print("=" * 70)
    
    # Exécuter la configuration
    success = setup_minio()
    
    if success:
        print("\n✅ Configuration terminée avec succès!")
        sys.exit(0)
    else:
        print("\n❌ La configuration a échoué")
        sys.exit(1)