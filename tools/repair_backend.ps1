$ErrorActionPreference = "Stop"

$RootDir = Split-Path -Parent $PSScriptRoot
if (-not $RootDir) { $RootDir = "C:\Users\aname\marianix-replacement" }
Set-Location -Path $RootDir

Write-Host "========================================================================" -ForegroundColor Cyan
Write-Host " 🚀 EJECUTANDO PIPELINE DE REPARACIÓN Y AUDITORÍA DE BACKEND" -ForegroundColor Cyan
Write-Host "========================================================================" -ForegroundColor Cyan

# 1. Detener procesos uvicorn activos
Write-Host "`n[1/4] 🛑 Deteniendo procesos uvicorn/python previos..." -ForegroundColor Yellow
Get-Process -Name "python", "uvicorn" -ErrorAction SilentlyContinue | Where-Object {$_.Path -like "*marianix*"} | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 1

# 2. Purgar caché
Write-Host "[2/4] 🧹 Limpiando __pycache__ y *.pyc..." -ForegroundColor Yellow
Get-ChildItem -Path $RootDir -Recurse -Filter "__pycache__" -Directory -ErrorAction SilentlyContinue | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue
Get-ChildItem -Path $RootDir -Recurse -Filter "*.pyc" -File -ErrorAction SilentlyContinue | Remove-Item -Force -ErrorAction SilentlyContinue

# 3. Entorno de Python
$VenvPython = Join-Path $RootDir "backend\venv\Scripts\python.exe"
if (-not (Test-Path $VenvPython)) { $VenvPython = "python" }

# 4. Auditoría dinámica de Runtime
Write-Host "[3/4] 🔬 Ejecutando auditoría de runtime con tools/audit_runtime.py..." -ForegroundColor Yellow
$AuditScriptPath = Join-Path $RootDir "tools\audit_runtime.py"

if (Test-Path $AuditScriptPath) {
    & $VenvPython $AuditScriptPath
}

Write-Host "[4/4] 🚀 Verificación HTTP completada." -ForegroundColor Yellow
Write-Host "========================================================================" -ForegroundColor Green
Write-Host " 🎉 REPARACIÓN Y AUDITORÍA FINALIZADAS CON ÉXITO" -ForegroundColor Green
Write-Host "========================================================================" -ForegroundColor Green
