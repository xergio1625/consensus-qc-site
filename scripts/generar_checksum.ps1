<#
.SYNOPSIS
    Genera el checksum SHA-256 de un instalador .exe para publicar en GitHub Releases.

.PARAMETER Instalador
    Nombre o ruta del archivo .exe. Por defecto: ConsensusQC_Prueba_Setup.exe

.EXAMPLE
    .\generar_checksum.ps1
    .\generar_checksum.ps1 -Instalador "ConsensusQC_Prueba_Setup.exe"
    .\generar_checksum.ps1 -Instalador "C:\builds\ConsensusQC_Prueba_Setup.exe"
#>

param(
    [string]$Instalador = "ConsensusQC_Prueba_Setup.exe"
)

# Resolver ruta absoluta
$rutaInstalador = Resolve-Path -Path $Instalador -ErrorAction SilentlyContinue

if (-not $rutaInstalador) {
    Write-Error "No se encontro el archivo: $Instalador"
    exit 1
}

$archivoExe      = $rutaInstalador.Path
$archivoChecksum = $archivoExe + ".sha256"

Write-Host ""
Write-Host "Calculando SHA-256 de: $archivoExe" -ForegroundColor Cyan

$hash = (Get-FileHash -Path $archivoExe -Algorithm SHA256).Hash.ToLower()

# Formato estándar: <hash>  <nombre_archivo>
$nombreArchivo = Split-Path $archivoExe -Leaf
$linea = "$hash  $nombreArchivo"

# Guardar archivo .sha256 en la misma carpeta que el .exe
$linea | Out-File -FilePath $archivoChecksum -Encoding ASCII -Force

Write-Host ""
Write-Host "SHA-256: $hash" -ForegroundColor Green
Write-Host ""
Write-Host "Archivo generado: $archivoChecksum" -ForegroundColor Green
Write-Host ""
Write-Host "Verificacion:" -ForegroundColor Yellow
Write-Host "  Subir a GitHub Releases como asset junto al .exe" -ForegroundColor Yellow
Write-Host "  Los usuarios pueden verificar con:" -ForegroundColor Yellow
Write-Host "  (Get-FileHash '$nombreArchivo' -Algorithm SHA256).Hash.ToLower()" -ForegroundColor DarkGray
Write-Host ""
