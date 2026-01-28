# test_fix.ps1 - Test PowerShell
Write-Host "🧪 Test des corrections POST - PowerShell" -ForegroundColor Cyan
Write-Host "="*50

# Test 1: POST JSON sur /api/projects/
Write-Host "`n🎯 Test 1: POST JSON sur /api/projects/" -ForegroundColor Yellow
$body1 = @{
    title = "Projet test depuis PowerShell JSON"
    description = "Test après correction - JSON"
    technologies = "Django, REST, PowerShell, JSON"
    cohort = "DWWM - PowerShell Test"
    author_name = "PowerShell User"
    author_email = "powershell@test.com"
    tags = "test,powershell,json"
    status = "draft"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000/api/projects/" `
        -Method POST `
        -Body $body1 `
        -ContentType "application/json" `
        -ErrorAction Stop
    
    Write-Host "   ✅ Succès! (Status: $($response.StatusCode))" -ForegroundColor Green
    $result = $response.Content | ConvertFrom-Json
    Write-Host "   Message: $($result.message)" -ForegroundColor Cyan
    Write-Host "   Projet ID: $($result.project_id)" -ForegroundColor Cyan
    Write-Host "   Titre: $($result.title)" -ForegroundColor Cyan
} catch {
    Write-Host "   ❌ Échec: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $errorContent = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($errorContent)
        $errorBody = $reader.ReadToEnd()
        Write-Host "   Erreur détaillée: $errorBody" -ForegroundColor Red
    }
}

# Test 2: POST FormData sur /api/projects/create/
Write-Host "`n🎯 Test 2: POST FormData sur /api/projects/create/" -ForegroundColor Yellow

try {
    $formData = @{
        title = "Projet PowerShell FormData"
        description = "Description depuis PowerShell FormData"
        technologies = "PowerShell, FormData, Django"
        cohort = "DWWM - FormData Test"
        author_name = "PowerShell FormData"
        author_email = "formdata@powershell.com"
        tags = "powershell,formdata,test"
    }
    
    $response = Invoke-WebRequest -Uri "http://localhost:8000/api/projects/create/" `
        -Method POST `
        -Body $formData `
        -ErrorAction Stop
    
    Write-Host "   ✅ Succès! (Status: $($response.StatusCode))" -ForegroundColor Green
    $result = $response.Content | ConvertFrom-Json
    Write-Host "   Message: $($result.message)" -ForegroundColor Cyan
    if ($result.project) {
        Write-Host "   Projet ID: $($result.project.id)" -ForegroundColor Cyan
        Write-Host "   Titre: $($result.project.title)" -ForegroundColor Cyan
    }
} catch {
    Write-Host "   ❌ Échec: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $errorContent = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($errorContent)
        $errorBody = $reader.ReadToEnd()
        Write-Host "   Erreur détaillée: $errorBody" -ForegroundColor Red
    }
}

# Test 3: Vérifier que GET fonctionne toujours
Write-Host "`n🎯 Test 3: Vérification GET" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000/api/projects/" -Method GET -ErrorAction Stop
    $data = $response.Content | ConvertFrom-Json
    Write-Host "   ✅ GET fonctionne (Status: $($response.StatusCode))" -ForegroundColor Green
    Write-Host "   Projets dans la base: $($data.count)" -ForegroundColor Cyan
    Write-Host "   Source: $($data.source)" -ForegroundColor Cyan
} catch {
    Write-Host "   ❌ GET échoué: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Test OPTIONS
Write-Host "`n🎯 Test 4: Test OPTIONS" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000/api/projects/" -Method OPTIONS -ErrorAction Stop
    Write-Host "   ✅ OPTIONS fonctionne (Status: $($response.StatusCode))" -ForegroundColor Green
    Write-Host "   Méthodes autorisées: $($response.Headers.Allow)" -ForegroundColor Cyan
} catch {
    Write-Host "   ❌ OPTIONS échoué" -ForegroundColor Red
}

Write-Host "`n" "="*50
Write-Host "🏁 Test terminé" -ForegroundColor Cyan 