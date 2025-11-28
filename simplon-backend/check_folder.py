import os

print("📁 STRUCTURE DU DOSSIER ACTUEL")
print("=" * 40)
print(f"Dossier courant: {os.getcwd()}")
print("\nFichiers présents:")
for file in os.listdir('.'):
    if os.path.isfile(file):
        print(f"  📄 {file}")
