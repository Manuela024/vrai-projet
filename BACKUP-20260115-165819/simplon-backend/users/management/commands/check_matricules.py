# from django.core.management.base import BaseCommand
# from django.utils import timezone
# from django.contrib.auth.models import User
# from users.models import MatriculeAutorise

# class Command(BaseCommand):
#     help = '🔍 Vérifie l\'état des matricules et identifie les problèmes'
    
#     def add_arguments(self, parser):
#         parser.add_argument(
#             '--fix',
#             action='store_true',
#             help='Corriger automatiquement les problèmes détectés',
#         )
        
#         parser.add_argument(
#             '--details',
#             action='store_true',
#             help='Afficher tous les détails des matricules',
#         )

#     def handle(self, *args, **options):
#         self.stdout.write("")
#         self.stdout.write("🎯 DIAGNOSTIC COMPLET DU SYSTÈME DE MATRICULES")
#         self.stdout.write("=" * 60)
        
#         # 1. STATISTIQUES GÉNÉRALES
#         total_matricules = MatriculeAutorise.objects.count()
#         matricules_actifs = MatriculeAutorise.objects.filter(est_actif=True).count()
#         matricules_inactifs = MatriculeAutorise.objects.filter(est_actif=False).count()
#         matricules_utilises = MatriculeAutorise.objects.filter(date_activation__isnull=False).count()
        
#         self.stdout.write("\n📊 STATISTIQUES GÉNÉRALES:")
#         self.stdout.write(f"   ├── Matricules totaux: {total_matricules}")
#         self.stdout.write(f"   ├── Matricules actifs: {matricules_actifs}")
#         self.stdout.write(f"   ├── Matricules inactifs: {matricules_inactifs}")
#         self.stdout.write(f"   └── Matricules utilisés: {matricules_utilises}")
        
#         # 2. ANALYSE DES INACTIFS PROBLÉMATIQUES
#         self.stdout.write("\n🔍 ANALYSE DES MATRICULES INACTIFS:")
#         matricules_inactifs_sans_raison = MatriculeAutorise.objects.filter(
#             est_actif=False, 
#             date_activation__isnull=True
#         )
        
#         if matricules_inactifs_sans_raison.exists():
#             for matricule in matricules_inactifs_sans_raison:
#                 self.stdout.write(f"   ❌ PROBLÈME: {matricule.matricule} - Inactif sans raison")
                
#                 # Correction automatique si demandé
#                 if options['fix']:
#                     matricule.est_actif = True
#                     matricule.save()
#                     self.stdout.write(f"      🔓 CORRIGÉ: Maintenant activé!")
#         else:
#             self.stdout.write("   ✅ Aucun matricule inactif problématique")
        
#         # 3. MATRICULES ACTIFS MAIS DÉJÀ UTILISÉS (INCOHÉRENCE!)
#         self.stdout.write("\n🚨 MATRICULES ACTIFS MAIS DÉJÀ UTILISÉS:")
#         probleme_matricules = MatriculeAutorise.objects.filter(
#             est_actif=True, 
#             date_activation__isnull=False
#         )
        
#         if probleme_matricules.exists():
#             for matricule in probleme_matricules:
#                 self.stdout.write(f"   ⚠️  RISQUE: {matricule.matricule} (utilisé le {matricule.date_activation})")
                
#                 # Vérifier si un utilisateur existe avec ce matricule
#                 try:
#                     user = User.objects.get(username=matricule.matricule)
#                     self.stdout.write(f"      👤 Utilisateur: {user.email}")
#                 except User.DoesNotExist:
#                     self.stdout.write(f"      ❌ AUCUN utilisateur trouvé!")
                
#                 # Correction automatique si demandé
#                 if options['fix']:
#                     matricule.est_actif = False
#                     matricule.save()
#                     self.stdout.write(f"      🔒 CORRIGÉ: Maintenant désactivé")
#         else:
#             self.stdout.write("   ✅ Aucun matricule à risque détecté")
        
#         # 4. MATRICULES ACTIFS DISPONIBLES
#         self.stdout.write("\n🎯 MATRICULES ACTIFS DISPONIBLES:")
#         matricules_disponibles = MatriculeAutorise.objects.filter(
#             est_actif=True, 
#             date_activation__isnull=True
#         )
        
#         if matricules_disponibles.exists():
#             for matricule in matricules_disponibles:
#                 self.stdout.write(f"   ✅ DISPONIBLE: {matricule.matricule}")
#         else:
#             self.stdout.write("   ℹ️  Aucun matricule disponible")
        
#         # 5. AFFICHAGE DÉTAILLÉ SI DEMANDÉ
#         if options['details']:
#             self.stdout.write("\n📋 LISTE COMPLÈTE DES MATRICULES:")
#             for matricule in MatriculeAutorise.objects.all().order_by('matricule'):
#                 status = "✅ ACTIF" if matricule.est_actif else "❌ INACTIF"
#                 utilise = "🔑 UTILISÉ" if matricule.date_activation else "🆓 LIBRE"
#                 self.stdout.write(f"   {status} | {utilise} | {matricule.matricule}")
        
#         # 6. RÉSUMÉ ET RECOMMANDATIONS
#         self.stdout.write("\n💡 RÉSUMÉ & ACTIONS:")
        
#         problemes_trouves = False
        
#         if matricules_inactifs_sans_raison.exists():
#             self.stdout.write("   ❌ Certains matricules sont inactifs sans raison")
#             self.stdout.write("   💡 Commande: python manage.py check_matricules --fix")
#             problemes_trouves = True
        
#         if probleme_matricules.exists():
#             self.stdout.write("   ⚠️  Certains matricules utilisés sont encore actifs")
#             self.stdout.write("   💡 Commande: python manage.py check_matricules --fix")
#             problemes_trouves = True
        
#         if not problemes_trouves:
#             self.stdout.write("   ✅ Aucun problème critique détecté")
        
#         self.stdout.write("")
#         self.stdout.write("=" * 60)
#         self.stdout.write("✅ Diagnostic terminé à {}".format(timezone.now().strftime("%H:%M:%S")))
#         self.stdout.write("")
from django.core.management.base import BaseCommand
from django.utils import timezone
from django.contrib.auth.models import User
from users.models import MatriculeAutorise

class Command(BaseCommand):
    help = '🔍 Vérifie l\'état des matricules et identifie les problèmes'
    
    def add_arguments(self, parser):
        parser.add_argument(
            '--fix',
            action='store_true',
            help='Corriger automatiquement les problèmes détectés',
        )
        
        parser.add_argument(
            '--details',
            action='store_true',
            help='Afficher tous les détails des matricules',
        )

    def handle(self, *args, **options):
        self.stdout.write("")
        self.stdout.write("🎯 DIAGNOSTIC COMPLET DU SYSTÈME DE MATRICULES")
        self.stdout.write("=" * 60)
        
        # 1. STATISTIQUES GÉNÉRALES
        total_matricules = MatriculeAutorise.objects.count()
        matricules_actifs = MatriculeAutorise.objects.filter(est_actif=True).count()
        matricules_inactifs = MatriculeAutorise.objects.filter(est_actif=False).count()
        matricules_utilises = MatriculeAutorise.objects.filter(date_activation__isnull=False).count()
        matricules_actives_et_utilises = MatriculeAutorise.objects.filter(est_actif=True, date_activation__isnull=False).count()
        
        self.stdout.write("\n📊 STATISTIQUES GÉNÉRALES:")
        self.stdout.write(f"   ├── Matricules totaux: {total_matricules}")
        self.stdout.write(f"   ├── Matricules actifs: {matricules_actifs}")
        self.stdout.write(f"   ├── Matricules inactifs: {matricules_inactifs}")
        self.stdout.write(f"   ├── Matricules utilisés: {matricules_utilises}")
        self.stdout.write(f"   └── ✅ Matricules activés (normal): {matricules_actives_et_utilises}")
        
        # 2. ANALYSE DES INACTIFS PROBLÉMATIQUES
        self.stdout.write("\n🔍 ANALYSE DES MATRICULES INACTIFS:")
        matricules_inactifs_sans_raison = MatriculeAutorise.objects.filter(
            est_actif=False, 
            date_activation__isnull=True
        )
        
        if matricules_inactifs_sans_raison.exists():
            for matricule in matricules_inactifs_sans_raison:
                self.stdout.write(f"   ❌ PROBLÈME: {matricule.matricule} - Inactif sans raison")
                
                # Correction automatique si demandé
                if options['fix']:
                    matricule.est_actif = True
                    matricule.save()
                    self.stdout.write(f"      🔓 CORRIGÉ: Maintenant activé!")
        else:
            self.stdout.write("   ✅ Aucun matricule inactif problématique")
        
        # 3. ✅ CORRIGÉ: MATRICULES ACTIVÉS (ÉTAT NORMAL)
        self.stdout.write("\n✅ MATRICULES ACTIVÉS (état normal):")
        matricules_actives = MatriculeAutorise.objects.filter(
            est_actif=True, 
            date_activation__isnull=False
        )
        
        if matricules_actives.exists():
            for matricule in matricules_actives:
                self.stdout.write(f"   ✅ NORMAL: {matricule.matricule} (activé le {matricule.date_activation})")
                
                # Vérifier si un utilisateur existe avec ce matricule
                try:
                    user = User.objects.get(username=matricule.matricule)
                    self.stdout.write(f"      👤 Utilisateur associé: {user.email}")
                except User.DoesNotExist:
                    self.stdout.write(f"      ⚠️  ATTENTION: Aucun utilisateur trouvé!")
                    if options['fix']:
                        # Réinitialiser le matricule car utilisateur manquant
                        matricule.date_activation = None
                        matricule.save()
                        self.stdout.write(f"      🔄 CORRIGÉ: Matricule réinitialisé")
        else:
            self.stdout.write("   ℹ️  Aucun matricule activé")
        
        # 4. 🚨 VÉRITABLES PROBLÈMES: Matricules utilisés mais inactifs
        self.stdout.write("\n🚨 VÉRITABLES PROBLÈMES:")
        vrai_problemes = MatriculeAutorise.objects.filter(
            est_actif=False, 
            date_activation__isnull=False
        )
        
        if vrai_problemes.exists():
            for matricule in vrai_problemes:
                self.stdout.write(f"   ❌ PROBLÈME: {matricule.matricule} - Utilisé mais inactif!")
                
                if options['fix']:
                    matricule.est_actif = True
                    matricule.save()
                    self.stdout.write(f"      🔓 CORRIGÉ: Réactivé!")
        else:
            self.stdout.write("   ✅ Aucun vrai problème détecté")
        
        # 5. MATRICULES ACTIFS DISPONIBLES
        self.stdout.write("\n🎯 MATRICULES ACTIFS DISPONIBLES:")
        matricules_disponibles = MatriculeAutorise.objects.filter(
            est_actif=True, 
            date_activation__isnull=True
        )
        
        if matricules_disponibles.exists():
            for matricule in matricules_disponibles:
                self.stdout.write(f"   ✅ DISPONIBLE: {matricule.matricule}")
        else:
            self.stdout.write("   ℹ️  Aucun matricule disponible")
        
        # 6. AFFICHAGE DÉTAILLÉ SI DEMANDÉ
        if options['details']:
            self.stdout.write("\n📋 LISTE COMPLÈTE DES MATRICULES:")
            for matricule in MatriculeAutorise.objects.all().order_by('matricule'):
                status = "✅ ACTIF" if matricule.est_actif else "❌ INACTIF"
                utilise = "🔑 UTILISÉ" if matricule.date_activation else "🆓 LIBRE"
                self.stdout.write(f"   {status} | {utilise} | {matricule.matricule}")
        
        # 7. RÉSUMÉ ET RECOMMANDATIONS
        self.stdout.write("\n💡 RÉSUMÉ & ACTIONS:")
        
        problemes_trouves = False
        
        if matricules_inactifs_sans_raison.exists():
            self.stdout.write("   ❌ Certains matricules sont inactifs sans raison")
            self.stdout.write("   💡 Commande: python manage.py check_matricules --fix")
            problemes_trouves = True
        
        if vrai_problemes.exists():
            self.stdout.write("   ❌ Certains matricules utilisés sont inactifs")
            self.stdout.write("   💡 Commande: python manage.py check_matricules --fix")
            problemes_trouves = True
        
        if not problemes_trouves:
            self.stdout.write("   ✅ Aucun problème critique détecté")
        
        self.stdout.write("")
        self.stdout.write("=" * 60)
        self.stdout.write("✅ Diagnostic terminé à {}".format(timezone.now().strftime("%H:%M:%S")))
        self.stdout.write("")