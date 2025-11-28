Write-Host "🧹 NETTOYAGE COMPLET DU BACKEND" -ForegroundColor Red

# Supprimer le dossier backend
if (Test-Path "backend") {
    Write-Host "📁 Suppression du dossier backend..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force "backend"
    Write-Host "✅ Dossier backend supprimé" -ForegroundColor Green
} else {
    Write-Host "ℹ️ Dossier backend déjà supprimé" -ForegroundColor Blue
}

Write-Host "🎯 NETTOYAGE TERMINÉ !" -ForegroundColor Green
