# DocuContador - App para contadores con clientes profesionales

## Fecha

15/05/2025

---

## 🎯 Pitch Breve

**Nombre tentativo:** `DocuContador`

### Problema

Los contadores que trabajan con profesionales independientes (médicos, abogados, técnicos, etc.) pierden mucho tiempo recolectando y ordenando comprobantes, ya que sus clientes no tienen un flujo sistemático para enviarlos. Esto causa demoras, errores y estrés en fechas clave fiscales.

### Solución

Una app simple y mobile-first donde los clientes puedan subir fácilmente sus facturas, tickets y documentos desde el celular (foto o PDF).  
El contador accede a una plataforma web con toda la información ordenada por cliente, mes, tipo y monto, lista para exportar a Excel o sistemas contables.

---

## 🧩 MVP Funcional

### 📱 Frontend Mobile (para el cliente profesional)

**Pantallas:**

1. **Inicio**
   - Botones: `Subir PDF`, `Sacar Foto`, `Ver Documentos`

2. **Subir Documento**
   - Opción para tomar foto o seleccionar archivo
   - Campo opcional: categoría (alquiler, servicio, honorario, insumo)
   - Botón: `Enviar`

3. **Mis Documentos**
   - Lista con fecha, tipo y estado (procesado/no procesado)
   - Filtros por mes o categoría
   - Icono para eliminar o re-subir

---

### 🖥️ Frontend Web (para el contador)

**Panel principal:**

- Lista de clientes
- Indicadores por mes: cantidad de documentos, porcentaje cargado, alertas de faltantes
- Filtros por cliente, fecha, categoría
- Acciones:
  - Exportar a Excel
  - Marcar documento como `validado` o `rechazado`

---

### 🔧 Backend (API y lógica)

**Tecnologías sugeridas:**

- Node.js + Express / Django REST
- Base de datos: PostgreSQL o Firebase
- Almacenamiento de archivos: AWS S3, Firebase Storage o similar
- OCR: Tesseract (on-device) o Google Vision API / AWS Textract

**Endpoints básicos:**

- `POST /documento`: subir documento
- `GET /documentos?cliente=...&mes=...`: listar documentos
- `GET /clientes`: listar clientes (solo contador)
- `PUT /documento/:id`: actualizar estado o categoría
- `GET /exportar`: generar Excel por cliente y período

---

### 🔐 Seguridad

- Autenticación con JWT o Firebase Auth
- Cada usuario ve solo sus propios documentos
- El contador accede al panel con todos los clientes

---

## 📌 Estado

> Documento generado como base para desarrollo y presentación.  
> Versión inicial del pitch funcional y técnico.
