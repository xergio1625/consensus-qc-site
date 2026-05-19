# Consensus QC — Sitio web y distribución

Repositorio público que contiene:
- **Sitio web** (GitHub Pages, carpeta `docs/`)
- **Instaladores** distribuidos mediante GitHub Releases

**URL del sitio:** https://descarga.github.io/consensus-qc

---

## Configuración inicial (una sola vez)

### 1. Activar GitHub Pages
En GitHub → **Settings → Pages**:
- Source: `Deploy from a branch`
- Branch: `main` → `/docs`
- Guardar

### 2. Configurar Formspree (formulario de contacto)
1. Crear cuenta gratuita en https://formspree.io
2. Crear un nuevo form → copiar el ID (ej: `xabcdefg`)
3. Editar `docs/index.html` y reemplazar:
   ```
   action="https://formspree.io/f/XXXXXXXX"
   ```
   por:
   ```
   action="https://formspree.io/f/xabcdefg"
   ```
4. Hacer push → el formulario quedará funcional

---

## Publicar una nueva versión

### Paso 1 — Generar el instalador
Compilar con Inno Setup → obtener `ConsensusQC_Prueba_Setup.exe`

> El nombre del archivo `.exe` debe mantenerse **exactamente igual** en cada versión para que la URL `releases/latest/download/` siempre funcione.

### Paso 2 — Calcular el checksum SHA-256

Ejecutar en PowerShell (desde la carpeta del instalador):

```powershell
$hash = (Get-FileHash "ConsensusQC_Prueba_Setup.exe" -Algorithm SHA256).Hash.ToLower()
"$hash  ConsensusQC_Prueba_Setup.exe" | Out-File -Encoding ASCII "ConsensusQC_Prueba_Setup.exe.sha256"
Write-Host "SHA-256: $hash"
```

O ejecutar el script incluido:

```powershell
.\scripts\generar_checksum.ps1 -Instalador "ConsensusQC_Prueba_Setup.exe"
```

### Paso 3 — Crear el Release en GitHub

1. Ir a **GitHub → Releases → Draft a new release**
2. **Tag**: crear nuevo → `vX.X.X` (semver, ej: `v3.0.1`)
3. **Title**: `Consensus QC vX.X.X`
4. **Body**: copiar desde `.github/RELEASE_NOTES_TEMPLATE.md` y completar
5. **Assets**: subir ambos archivos:
   - `ConsensusQC_Prueba_Setup.exe`
   - `ConsensusQC_Prueba_Setup.exe.sha256`
6. ✅ Marcar como **"Set as the latest release"**
7. **Publish release**

### Convención de versiones (semver)
| Tipo de cambio | Ejemplo |
|---|---|
| Corrección de bugs | `v3.0.0` → `v3.0.1` |
| Nuevas funcionalidades compatibles | `v3.0.1` → `v3.1.0` |
| Cambios mayores / incompatibles | `v3.1.0` → `v4.0.0` |

---

## URL permanente de descarga

Esta URL **nunca cambia** y siempre apunta al instalador de la última versión publicada:

```
https://github.com/descarga/consensus-qc/releases/latest/download/ConsensusQC_Prueba_Setup.exe
```

El botón de descarga en `docs/index.html` ya usa esta URL.

---

## Estructura del repositorio

```
consensus-qc/
├── docs/                            ← Raíz del sitio GitHub Pages
│   ├── index.html                   ← Landing page principal
│   └── assets/
│       ├── css/style.css            ← Estilos (paleta Consensus QC)
│       ├── js/main.js               ← JS mínimo (menú, formulario, descarga)
│       └── img/                     ← Imágenes y screenshots del app
│           ├── hero-mockup.png      ← Screenshot principal (agregar manualmente)
│           └── favicon.ico          ← Favicon (agregar manualmente)
├── scripts/
│   └── generar_checksum.ps1         ← Script PowerShell de SHA-256
├── .github/
│   └── RELEASE_NOTES_TEMPLATE.md   ← Plantilla de notas de versión
└── README.md                        ← Este archivo
```

---

## Agregar screenshots reales

Reemplazar los placeholders en la sección `#screenshots` de `docs/index.html`:

```html
<!-- Reemplazar este bloque: -->
<div class="screenshot-img" aria-label="...">
  <span class="ss-placeholder-icon">📊</span>
  <span>Texto placeholder</span>
</div>

<!-- Por este: -->
<img src="assets/img/screenshot-qc.png" alt="Visualizador QC – Levey-Jennings">
```

Tamaño recomendado para screenshots: **1200 × 750 px** (WebP o PNG).

---

## Checklist antes de cada release

- [ ] Instalador compilado y probado en Windows limpio
- [ ] SHA-256 calculado y archivo `.sha256` generado
- [ ] Release Notes completadas (sin secciones vacías)
- [ ] Tag semver correcto (`vX.X.X`)
- [ ] Ambos archivos subidos a los Assets
- [ ] Marcado como "Latest release"
- [ ] URL de descarga probada en el navegador

---

## Sobre SmartScreen

Windows Defender SmartScreen puede mostrar advertencia en instaladores sin firma de código.

**Opciones:**

| Opción | Costo | Resultado |
|---|---|---|
| Instrucciones en la FAQ (ya incluidas) | Gratis | Usuarios deben hacer clic en "Más información → Ejecutar" |
| OV Code Signing Certificate | ~USD 200-400/año | Reduce advertencias con el tiempo |
| EV Code Signing Certificate | ~USD 400-600/año | Elimina SmartScreen completamente |

**Proveedores recomendados:** DigiCert, Sectigo, SSL.com

**Comando de firma (cuando tenga certificado):**
```powershell
signtool sign `
  /f "certificado.pfx" `
  /p "password_certificado" `
  /tr "http://timestamp.digicert.com" `
  /td SHA256 `
  /fd SHA256 `
  "ConsensusQC_Prueba_Setup.exe"
```
