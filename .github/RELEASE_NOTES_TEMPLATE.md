## Consensus QC v[VERSION] — [FECHA YYYY-MM-DD]

> Descargue `ConsensusQC_Prueba_Setup.exe` de los **Assets** al final de esta página.

---

### ✨ Novedades
<!-- Enumerar las nuevas funcionalidades de esta versión -->
- ...

### 🛠 Mejoras
<!-- Cambios de rendimiento, usabilidad o estabilidad -->
- ...

### 🐛 Correcciones
<!-- Bugs corregidos -->
- ...

---

### 📥 Instalación

1. Descargue **`ConsensusQC_Prueba_Setup.exe`** desde los Assets de abajo.
2. Si Windows SmartScreen muestra una advertencia:
   - Haga clic en **"Más información"**
   - Luego en **"Ejecutar de todas formas"**
3. Siga el asistente de instalación (se requieren permisos de administrador).

### 🔒 Verificación de integridad (SHA-256)

Descargue también `ConsensusQC_Prueba_Setup.exe.sha256` y ejecute en PowerShell:

```powershell
# Calcular hash del instalador
(Get-FileHash "ConsensusQC_Prueba_Setup.exe" -Algorithm SHA256).Hash.ToLower()

# Leer el valor esperado publicado
Get-Content "ConsensusQC_Prueba_Setup.exe.sha256"
```

Ambos valores deben ser idénticos.

---

### 💻 Requisitos del sistema

| Requisito | Mínimo |
|---|---|
| Sistema operativo | Windows 10 / 11 (64 bits) |
| RAM | 4 GB |
| Disco libre | 500 MB |
| Conexión a internet | Requerida |
| Pantalla | 1280 × 768 o superior |

---

### 🔗 Recursos

- [Sitio web](https://descarga.github.io/consensus-qc)
- [Contacto y soporte](https://descarga.github.io/consensus-qc/#contacto)
- [Historial de versiones](https://github.com/descarga/consensus-qc/releases)
