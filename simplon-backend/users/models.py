

from django.db import models
from django.utils import timezone
from datetime import timedelta

class MatriculeAutorise(models.Model):
    matricule = models.CharField(max_length=50, unique=True, verbose_name="Matricule Simplon")
    date_creation = models.DateTimeField(auto_now_add=True, verbose_name="Date de création")
    est_actif = models.BooleanField(default=True, verbose_name="Actif")
    date_activation = models.DateTimeField(null=True, blank=True, verbose_name="Date d'activation")
    
    # ⭐ CHAMPS POUR L'EXPIRATION DU TOKEN
    activation_token = models.CharField(max_length=100, blank=True, null=True)
    token_expiration = models.DateTimeField(blank=True, null=True)
    
    class Meta:
        verbose_name = "Matricule autorisé"
        verbose_name_plural = "Matricules autorisés"
    
    def __str__(self):
        return f"{self.matricule} ({'Actif' if self.est_actif else 'Inactif'})"
    
    # ⭐ CORRECTION CRITIQUE : MÉTHODE POUR VÉRIFIER L'EXPIRATION
    def is_token_expired(self):
        if self.token_expiration:
            # 🔍 LOGS DE DEBUG POUR VOIR CE QUI SE PASSE
            now = timezone.now()
            is_expired = now > self.token_expiration
            
            print("=" * 50)
            print("🔍 DEBUG is_token_expired()")
            print("=" * 50)
            print(f"🕒 Heure actuelle: {now}")
            print(f"⏰ Expiration prévue: {self.token_expiration}")
            print(f"📊 Différence: {self.token_expiration - now}")
            
            if self.token_expiration > now:
                seconds_remaining = (self.token_expiration - now).total_seconds()
                print(f"✅ TEMPS RESTANT: {seconds_remaining} secondes")
                print(f"   Soit: {seconds_remaining / 60:.1f} minutes")
            else:
                seconds_passed = (now - self.token_expiration).total_seconds()
                print(f"❌ TEMPS DÉPASSÉ: {seconds_passed} secondes")
                print(f"   Soit: {seconds_passed / 60:.1f} minutes")
            
            print(f"🎯 RÉSULTAT: {'EXPIRÉ' if is_expired else 'VALIDE'}")
            print("=" * 50)
            
            return is_expired
        
        # ⭐ CORRECTION : False si pas de date d'expiration (au lieu de True)
        print("🔍 DEBUG: Aucune date d'expiration définie - Non expiré")
        return False
    
    # ⭐ MÉTHODE POUR OBTENIR LE TEMPS RESTANT (AMÉLIORÉE)
    def get_remaining_time(self):
        if self.token_expiration and not self.is_token_expired():
            remaining = self.token_expiration - timezone.now()
            seconds_remaining = max(0, int(remaining.total_seconds()))
            
            print(f"⏱️ Temps restant calculé: {seconds_remaining}s")
            return seconds_remaining
        
        print("⏱️ Aucun temps restant - Token expiré ou inexistant")
        return 0
    
    # ⭐ NOUVELLE MÉTHODE : CRÉER UN TOKEN AVEC EXPIRATION
    def create_activation_token(self, minutes=5):
        import secrets
        
        # Générer un token sécurisé
        self.activation_token = secrets.token_urlsafe(32)
        self.token_expiration = timezone.now() + timedelta(minutes=minutes)
        
        print("=" * 50)
        print("🎫 CRÉATION TOKEN D'ACTIVATION")
        print("=" * 50)
        print(f"📋 Matricule: {self.matricule}")
        print(f"🔑 Token: {self.activation_token}")
        print(f"⏰ Expiration: {self.token_expiration}")
        print(f"   Dans: {minutes} minutes")
        print("=" * 50)
        
        self.save()
        return self.activation_token
    
    # ⭐ NOUVELLE MÉTHODE : VALIDER ET UTILISER LE TOKEN
    def use_activation_token(self, token_to_validate):
        print("=" * 50)
        print("🔐 VALIDATION TOKEN D'ACTIVATION")
        print("=" * 50)
        print(f"📋 Matricule: {self.matricule}")
        print(f"🔑 Token reçu: {token_to_validate}")
        print(f"🔑 Token stocké: {self.activation_token}")
        
        # Vérifier si le token correspond
        if self.activation_token != token_to_validate:
            print("❌ ERREUR: Token invalide")
            return False
        
        # Vérifier l'expiration
        if self.is_token_expired():
            print("❌ ERREUR: Token expiré")
            return False
        
        # Token valide - le consommer
        print("✅ SUCCÈS: Token valide et non expiré")
        self.activation_token = None
        self.token_expiration = None
        self.date_activation = timezone.now()
        self.save()
        
        print("🔄 Token consommé et nettoyé")
        print("=" * 50)
        return True