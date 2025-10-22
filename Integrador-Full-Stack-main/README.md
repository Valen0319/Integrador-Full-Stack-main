# To-Do List App

Una aplicación de lista de tareas con autenticación de usuarios, desarrollada con React (frontend) y Node.js/Express (backend).

## Características

- ✅ Autenticación de usuarios (registro y login)
- ✅ Gestión de tareas (crear, leer, actualizar, eliminar)
- ✅ Panel de administración
- ✅ Interfaz responsive y moderna
- ✅ Notificaciones toast
- ✅ Protección de rutas

## Tecnologías

### Backend
- Node.js
- Express.js
- MySQL
- JWT para autenticación
- bcryptjs para encriptación de contraseñas
- CORS habilitado

### Frontend
- React 19
- Vite
- React Router DOM
- Axios para peticiones HTTP
- React Toastify para notificaciones
- Context API para manejo de estado

## Instalación

### Prerrequisitos
- Node.js (versión 16 o superior)
- MySQL
- Git

### Pasos de instalación

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   ```

2. **Configurar la base de datos**
   - Abrir MySQL Workbench y ejecutar el archivo `Structure.sql`
   - O ejecutar manualmente:
     ```sql
     CREATE DATABASE todo_list;
     USE todo_list;
     -- Ejecutar el contenido de Structure.sql
     ```

3. **Configurar variables de entorno**
   - El archivo `.env` del backend ya está configurado con valores por defecto
   - El archivo `.env` del frontend ya está configurado con la URL del API

4. **Instalar dependencias del backend**
   ```bash
   cd backend
   npm install
   ```

5. **Instalar dependencias del frontend**
   ```bash
   cd ../frontend
   npm install
   ```

## Uso

### Opción 1: Usar el script de inicio automático (Windows)
```bash
start.bat
```

### Opción 2: Iniciar manualmente

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## Acceso a la aplicación

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api

## Usuarios por defecto

- **Administrador**: 
  - Email: admin@admin.com
  - Contraseña: admin123

## Estructura del proyecto

```
to-do-list-main/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuración de base de datos
│   │   ├── controllers/     # Controladores de rutas
│   │   ├── middlewares/     # Middlewares de autenticación
│   │   ├── models/          # Modelos de datos
│   │   ├── routes/          # Definición de rutas
│   ├── server.js            # Servidor principal
│   ├── .env                 # Configuración del servidor
│   ├── package-lock.json
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/             # Configuración de Axios
│   │   ├── assets/          #
│   │   ├── components/      # Componentes reutilizables
│   │   ├── context/         # Contexto de autenticación
│   │   ├── pages/           # Páginas de la aplicación
│   │   ├── styles/          # Estilos de páginas y componentes
│   │   ├── utils/           # Funciones para tratar token
│   │   ├── App.css          # Estilos principales
│   │   ├── App.jsx          # Toast notifications y direccionamiento de rutas
│   │   ├── index.css        # Estilos principales
│   │   ├── main.jsx         # 
│   ├── .env                 # Configuración de URL api del backend
│   ├── index.html           # Estructura de la web
│   ├── package-lock.json
│   └── package.json
```

## API Endpoints

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión

### Tareas
- `GET /api/tasks` - Obtener tareas del usuario
- `POST /api/tasks` - Crear nueva tarea
- `PUT /api/tasks/:id` - Actualizar tarea
- `DELETE /api/tasks/:id` - Eliminar tarea

## Desarrollo

Para contribuir al proyecto:

1. Fork el repositorio
2. Crear una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear un Pull Request

## Autores

# Integrador Full Stack — To‑Do App

Esta es una aplicación de ejemplo Full‑Stack para gestionar tareas con autenticación y roles (usuario/admin). Está pensada como un proyecto educativo y base para ampliar funcionalidades.

Contenido del README:
- Descripción y objetivos
- Estructura del repositorio
- Requisitos
- Configuración y ejecución (PowerShell)
- Endpoints de API (incluye rutas admin)
- Notas de implementación (fechas, modal, rendimiento)
- Desarrollo y pruebas
- Mejoras futuras

---

## Descripción

La aplicación permite a los usuarios registrar una cuenta, iniciar sesión y gestionar sus tareas (crear, editar, marcar como completadas y eliminar). Un usuario con rol `admin` dispone de un panel para:

- Ver todos los usuarios
- Crear, editar y eliminar usuarios
- Ver y gestionar (crear/editar/eliminar) las tareas de cualquier usuario

El frontend está desarrollado con React + Vite y el backend con Node.js + Express y MySQL.

---

## Estructura del proyecto

Raíz del repo:

- `backend/` — servidor Express y lógica de negocio (MySQL)
   - `src/config/db.js` — conexión a MySQL
   - `src/controllers/` — controladores (auth, tasks, admin)
   - `src/routes/` — rutas (auth, tasks, admin)
   - `server.js` — punto de entrada
   - `src/config/Structure.sql` — script SQL para crear tablas

- `frontend/` — aplicación React (Vite)
   - `src/components/` — componentes (TaskForm, TaskList, TaskCard, Navbar, etc.)
   - `src/components/admin/` — componentes del panel admin
   - `src/pages/` — páginas (Login, Register, Dashboard, AdminPanel)
   - `src/context/AuthContext.jsx` — restauración de sesión y estado auth
   - `src/api/axiosConfig.js` — instancia de axios con interceptor de token
   - `src/styles/` — estilos CSS

---

## Requisitos

- Node.js v16+ (o LTS actual)
- MySQL

Los comandos que muestro a continuación están escritos para PowerShell (Windows). Si usas macOS/Linux, usa bash/zsh sintaxis equivalente.

---

## Configuración (backend)

1. Copia o crea `.env` en `backend/` con las variables necesarias (ejemplo):

```powershell
# backend/.env
PORT=3000
JWT_SECRET=tu_secreto_aqui
DB_HOST=localhost
DB_USER=root
DB_PASS=tu_password
DB_NAME=integrador_db
FRONTEND_URL=http://localhost:5173
```

2. Crear la base de datos y tablas (ejecuta `Structure.sql` en tu servidor MySQL). Desde PowerShell con cliente mysql instalado:

```powershell
# crea la base y ejecuta el script (ejemplo)
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS integrador_db;"
mysql -u root -p integrador_db < backend/src/config/Structure.sql
```

3. Instalar dependencias y ejecutar backend:

```powershell
cd backend
npm install
# en desarrollo
npm run dev
```

El backend expondrá la API en `http://localhost:3000/api` por defecto.

---

## Configuración (frontend)

1. En `frontend/` configura el `.env` si necesitas sobrescribir `VITE_API_URL`.

2. Instalar y ejecutar:

```powershell
cd frontend
npm install
npm run dev
```

Vite por defecto sirve la app en `http://localhost:5173`.

---

## Rutas principales de la API

Autenticación
- POST /api/auth/register — Registrar usuario
- POST /api/auth/login — Iniciar sesión (retorna { token, user })
- GET /api/auth/me — Validar token y obtener usuario (usado por el frontend al recargar)

Tareas (protegidas, requieren Authorization: Bearer <token>)
- GET /api/tasks — Obtener tareas del usuario autenticado
- POST /api/tasks — Crear tarea (para el usuario autenticado)
- PUT /api/tasks/:id — Actualizar tarea (debe ser del usuario o admin)
- DELETE /api/tasks/:id — Eliminar tarea

Rutas admin (requieren token y rol `admin`)
- GET /api/admin/users — Listar usuarios
- POST /api/admin/users — Crear usuario
- PUT /api/admin/users/:id — Actualizar usuario
- DELETE /api/admin/users/:id — Eliminar usuario
- GET /api/admin/users/:id/tasks — Listar tareas de un usuario
- POST /api/admin/users/:id/tasks — Crear tarea para un usuario (admin)

Nota: si necesitas que los administradores editen o borren las tareas de otros usuarios sin restricciones, podemos añadir endpoints admin específicos para editar/borrar tareas.

---

## Comportamientos importantes y decisiones de diseño

- Fecha (`due_date`):
   - En el frontend el usuario introduce la fecha en formato `dd/mm/yyyy`.
   - El frontend valida formato y no permite fechas pasadas.
   - Antes de enviar, la fecha se normaliza a `YYYY-MM-DD` y el backend la guarda en una columna `DATE`.

- Modal flotante para crear/editar tareas:
   - Renderizado como portal (`createPortal`) para que quede fuera del árbol que podría recibir filtros.
   - Overlay usa `backdrop-filter` para difuminar y oscurecer el fondo. El modal no recibe blur y no tiene sombra.
   - Se evita aplicar `filter` al root por rendimiento (aplicar `filter: blur()` a muchos elementos genera repaints y baja FPS).

- Autenticación y persistencia de sesión:
   - El JWT se guarda en `localStorage` al iniciar sesión.
   - `AuthContext` intenta restaurar la sesión al cargar la app mediante `GET /api/auth/me`. Si el token es inválido o expiró, se borra y se redirige a `/login`.

---

## Panel de Administración (UX rápido)

- Hay una tarjeta informativa que explica el panel de admin.
- Panel de gestión de usuarios: lista, crear (prompt por ahora), editar (prompt), eliminar.
- Al seleccionar un usuario se muestran sus tareas y puedes crear, editar o eliminar tareas para ese usuario.

Nota: las interacciones de usuario rápido usan `prompt()` para prototipado. Si quieres, puedo reemplazar esos prompts por modales bien diseñados y validados.

---

## Desarrollo y pruebas rápidas

- Crear usuario admin: puedes insertar manualmente un usuario con `role='admin'` en la BD para probar las rutas admin.
- Probar persistencia: inicia sesión, luego recarga la página. Si el token es válido, `AuthContext` restaurará la sesión.

Comandos de desarrollo (PowerShell):

```powershell
# Backend
cd backend; npm install; npm run dev

# Frontend
cd frontend; npm install; npm run dev
```

---

## Recomendaciones / mejoras a futuro

- Implementar refresh tokens para renovar sesión sin pedir login a cada expiración.
- Reemplazar `prompt()` por formularios modales para crear/editar usuarios.
- Añadir tests automatizados y scripts de CI.
- Mejorar accesibilidad: focus trap en modales, roles ARIA y navegación por teclado.

---

Si quieres que amplíe el README con diagramas, ejemplos de requests (cURL) o instrucciones para desplegar en un servidor (Docker, Heroku, Vercel), lo hago a continuación.

---

Autor/es: Guerrero Lautaro y Arroyo Valentin

Licencia: MIT

