# 🚨 Reporte de Incidencias Uniamazonia

Sistema web para el reporte y gestión de incidencias universitarias, desarrollado con React + Firebase y desplegado en Vercel.

🌐 **Demo:** [reporteincidencias.vercel.app](https://reporteincidencias.vercel.app)

---

## 🛠️ Tecnologías utilizadas

| Tecnología | Uso |
|-----------|-----|
| **React 18 + Vite** | Framework frontend |
| **Firebase Firestore** | Base de datos en tiempo real |
| **Firebase Authentication** | Login y registro de usuarios |
| **Firebase Storage** | Almacenamiento de imágenes |
| **EmailJS** | Notificaciones por correo |
| **React Router DOM** | Navegación entre páginas |
| **Chart.js + react-chartjs-2** | Gráficas de estadísticas |
| **Vercel** | Despliegue en producción |

---

## ⚙️ Requisitos previos

- Node.js v18 o superior
- npm v9 o superior
- Cuenta en [Firebase](https://firebase.google.com)
- Cuenta en [EmailJS](https://www.emailjs.com)
- Cuenta en [Vercel](https://vercel.com) (para despliegue)

---

## 🚀 Instalación y ejecución local

### 1. Clonar el repositorio

```bash
git clone https://github.com/TU_USUARIO/TU_REPOSITORIO.git
cd TU_REPOSITORIO
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar Firebase

El archivo de configuración está en `src/firebase/firebase.js`. Reemplaza con las credenciales de tu proyecto Firebase:

```javascript
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_AUTH_DOMAIN",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_STORAGE_BUCKET",
  messagingSenderId: "TU_MESSAGING_SENDER_ID",
  appId: "TU_APP_ID",
};
```

### 4. Configurar EmailJS

En `src/services/emailService.js` reemplaza con tus credenciales:

```javascript
const SERVICE_ID = 'TU_SERVICE_ID';
const TEMPLATE_REPORTE_ID = 'TU_TEMPLATE_REPORTE_ID';    // Plantilla reporte inicial
const TEMPLATE_ESTADO_ID = 'TU_TEMPLATE_ESTADO_ID';      // Plantilla cambio de estado
const PUBLIC_KEY = 'TU_PUBLIC_KEY';
```

### 5. Ejecutar en desarrollo

```bash
npm run dev
```

Disponible en: `http://localhost:5173`

### 6. Compilar para producción

```bash
npm run build
```

---

## 🔥 Configuración de Firebase

### Servicios requeridos

Activa en Firebase Console → tu proyecto:

| Servicio | Configuración |
|----------|--------------|
| **Firestore Database** | Modo producción |
| **Authentication** | Habilitar Email/Password |
| **Storage** | Modo producción |

### Colecciones en Firestore

| Colección | Descripción |
|-----------|-------------|
| `clientes` | Datos de clientes registrados |
| `administradores` | Datos del administrador |
| `incidencias` | Incidencias reportadas |

### Reglas de Firestore

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /incidencias/{document=**} {
      allow read: if true;
      allow write: if true;
    }
    match /clientes/{document=**} {
      allow read: if true;
      allow write: if true;
    }
    match /administradores/{document=**} {
      allow read: if true;
      allow write: if true;
    }
  }
}
```

### Reglas de Storage

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if true;
    }
  }
}
```

### Crear administrador manualmente

1. **Firebase Console → Authentication → Users → Add user**
2. Ingresa correo y contraseña del admin
3. Copia el **UID** generado
4. **Firestore → Nueva colección `administradores`**
5. Crea un documento con el UID como ID:

```
nombre:   "Admin"
apellido: "Principal"
correo:   "admin@correo.com"
telefono: "3000000000"
```

### Action URL para recuperar contraseña

**Firebase Console → Authentication → Templates → Password reset → Customize action URL:**

```
https://TU_PROYECTO.vercel.app/restablecer
```

### Dominios autorizados

**Firebase Console → Authentication → Settings → Authorized domains:**

```
localhost
TU_PROYECTO.vercel.app
```

---

## 🌐 Despliegue en Vercel

### 1. Importar repositorio

1. Ve a [vercel.com](https://vercel.com) e importa el repositorio de GitHub
2. Configura:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

### 2. Archivo `vercel.json`

El archivo `vercel.json` en la raíz maneja las rutas SPA:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

## 📁 Estructura del proyecto

```
proyecto/
├── public/
│   └── _redirects              # Redirects para Vercel
├── src/
│   ├── component/
│   │   ├── IncidenciaCard.jsx  # Card de incidencia en galería
│   │   ├── IncidenciaCard.css
│   │   ├── Navbar.jsx          # Barra de navegación
│   │   └── Navbar.css
│   ├── components/
│   │   └── RutaProtegida.jsx   # Protección de rutas por rol
│   ├── context/
│   │   ├── AuthContext.jsx     # Contexto de autenticación global
│   │   └── useAuth.js          # Hook de autenticación
│   ├── firebase/
│   │   └── firebase.js         # Configuración de Firebase
│   ├── pages/
│   │   ├── Admin.jsx           # Panel de administración
│   │   ├── Admin.css
│   │   ├── Clientes.jsx        # Gestión de clientes
│   │   ├── Clientes.css
│   │   ├── Estadisticas.jsx    # Dashboard de estadísticas
│   │   ├── Estadisticas.css
│   │   ├── Home.jsx            # Galería de incidencias
│   │   ├── Home.css
│   │   ├── Login.jsx           # Inicio de sesión
│   │   ├── Login.css
│   │   ├── Recuperar.jsx       # Solicitar recuperación
│   │   ├── Recuperar.css
│   │   ├── Registro.jsx        # Registro de cliente
│   │   ├── Registro.css
│   │   ├── ReportarIncidencia.jsx  # Formulario de reporte
│   │   ├── ReportarIncidencia.css
│   │   ├── ReporteAnonimo.jsx  # Reporte sin cuenta
│   │   ├── ReporteAnonimo.css
│   │   ├── Restablecer.jsx     # Nueva contraseña
│   │   └── Restablecer.css
│   ├── services/
│   │   ├── authService.js      # Funciones de autenticación
│   │   ├── clientesService.js  # CRUD de clientes
│   │   ├── emailService.js     # Envío de correos via EmailJS
│   │   ├── incidenciasService.js  # CRUD de incidencias
│   │   └── storageService.js   # Subida de imágenes a Firebase Storage
│   ├── App.css
│   ├── App.jsx                 # Rutas principales
│   └── main.jsx
├── index.html
├── vercel.json                 # Configuración de rutas Vercel
├── vite.config.js
└── package.json
```

---

## 👥 Roles del sistema

| Rol | Rutas disponibles |
|-----|------------------|
| **Cliente** | Galería, Reportar incidencia, Estadísticas, Mis reportes |
| **Administrador** | Todo lo anterior + Panel admin, Clientes, cambio de estado y prioridad, eliminar |
| **Anónimo** | Solo reportar incidencia sin cuenta (desde login) |

---

## 📱 Funcionalidades principales

### Para clientes
- ✅ Registro e inicio de sesión
- ✅ Reportar incidencias con imagen (cámara en móvil / galería en desktop)
- ✅ Ver galería de incidencias con filtro "Mis reportes"
- ✅ Recibir notificación por correo al reportar
- ✅ Recibir notificación por correo al cambiar estado
- ✅ Recuperar contraseña por correo
- ✅ Ver estadísticas generales

### Para administrador
- ✅ Ver todas las incidencias en tabla
- ✅ Filtrar por cliente, estado y prioridad
- ✅ Cambiar estado de incidencias (pendiente → en proceso → resuelto)
- ✅ Asignar prioridad (alta, media, baja)
- ✅ Eliminar incidencias resueltas
- ✅ Ver y eliminar clientes registrados
- ✅ Ver imagen ampliada de cada incidencia
- ✅ Dashboard de estadísticas

### General
- ✅ Reporte anónimo sin necesidad de cuenta
- ✅ Diseño responsive (móvil y desktop)
- ✅ Galería ordenada por prioridad y estado
- ✅ Incidencias anónimas identificadas visualmente

---

## 📧 Notificaciones por correo (EmailJS)

| Evento | Destinatario | Template |
|--------|-------------|----------|
| Nueva incidencia reportada | Cliente | `TEMPLATE_REPORTE_ID` |
| Cambio de estado de incidencia | Cliente | `TEMPLATE_ESTADO_ID` |

> Las incidencias anónimas **no envían correo** ya que no tienen correo registrado.

---

## 📊 Dashboard de estadísticas

Disponible para clientes y administrador en `/estadisticas`:

- Total de incidencias reportadas
- Incidencias por estado (pendiente, en proceso, resuelto)
- Distribución por prioridad (alta, media, baja)
- Top categorías más reportadas
- Últimas incidencias registradas
- Porcentaje de incidencias anónimas

---

## 📱 Captura de imagen en móvil

En el formulario de reporte:
- **Móvil:** botón para abrir cámara (foto directa) + botón para subir desde galería
- **Desktop:** solo opción de subir desde galería

---

## 📄 Licencia

Proyecto académico — Ingeniería de Sistemas, Universidad de la Amazonia 2026.
